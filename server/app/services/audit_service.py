from typing import List, Optional

from fastapi import HTTPException, status
from sqlmodel import Session, func, select

from app.models import Asset, AuditAssignment, AuditCycle, AuditResult, User
from app.schemas.audit import (
    AuditAssignmentCreate,
    AuditAssignmentResponse,
    AuditCycleCreate,
    AuditCycleResponse,
    AuditDiscrepancyReport,
    AuditResultCreate,
    AuditResultResponse,
    DiscrepancyItem,
)


class AuditService:
    def __init__(self, session: Session):
        self.session = session

    # ── B6: Audit Cycles ────────────────────────────────────────────────

    def _require_admin(self, user: User) -> None:
        if user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admin can perform this action.",
            )

    def _require_manager(self, user: User) -> None:
        if user.role not in {"admin", "asset_manager"}:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admin or asset_manager can perform this action.",
            )

    def create_cycle(self, data: AuditCycleCreate, current_user: User) -> AuditCycleResponse:
        self._require_admin(current_user)
        if data.start_date > data.end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="start_date must be before end_date"
            )

        cycle = AuditCycle(
            name=data.name,
            scope_department_id=data.scope_department_id,
            scope_location=data.scope_location,
            start_date=data.start_date,
            end_date=data.end_date,
            status="active",
        )
        self.session.add(cycle)
        self.session.commit()
        self.session.refresh(cycle)
        return AuditCycleResponse.model_validate(cycle)

    def list_cycles(
        self,
        cycle_status: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> tuple[List[AuditCycleResponse], int]:
        query = select(AuditCycle)
        if cycle_status:
            query = query.where(AuditCycle.status == cycle_status)
        
        total = self.session.exec(select(func.count()).select_from(query.subquery())).one()
        cycles = self.session.exec(query.order_by(AuditCycle.created_at.desc()).offset(skip).limit(limit)).all()
        return [AuditCycleResponse.model_validate(c) for c in cycles], total

    def assign_auditors(
        self, cycle_id: int, data: AuditAssignmentCreate, current_user: User
    ) -> List[AuditAssignmentResponse]:
        self._require_admin(current_user)
        cycle = self.session.get(AuditCycle, cycle_id)
        if not cycle:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cycle not found")
        if cycle.status != "active":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot assign to inactive cycle")

        assignments = []
        for auditor_id in data.auditor_ids:
            # Check if user exists
            auditor = self.session.get(User, auditor_id)
            if not auditor or auditor.status != "active":
                continue
            
            # Check if already assigned
            existing = self.session.exec(
                select(AuditAssignment).where(
                    AuditAssignment.audit_cycle_id == cycle_id,
                    AuditAssignment.auditor_id == auditor_id
                )
            ).first()
            
            if not existing:
                new_assignment = AuditAssignment(audit_cycle_id=cycle_id, auditor_id=auditor_id)
                self.session.add(new_assignment)
                assignments.append(new_assignment)

        self.session.commit()
        for a in assignments:
            self.session.refresh(a)

        return [AuditAssignmentResponse.model_validate(a) for a in assignments]

    # ── B7: Result Logging ──────────────────────────────────────────────

    def log_result(
        self, cycle_id: int, data: AuditResultCreate, current_user: User
    ) -> AuditResultResponse:
        cycle = self.session.get(AuditCycle, cycle_id)
        if not cycle:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cycle not found")
        if cycle.status != "active":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cycle is not active")

        # Verify current_user is assigned
        assignment = self.session.exec(
            select(AuditAssignment).where(
                AuditAssignment.audit_cycle_id == cycle_id,
                AuditAssignment.auditor_id == current_user.id
            )
        ).first()
        if not assignment:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not assigned to this audit cycle")

        # Verify asset scope
        asset = self.session.get(Asset, data.asset_id)
        if not asset:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")
        
        if cycle.scope_department_id and asset.department_id != cycle.scope_department_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Asset does not belong to the scoped department")
        if cycle.scope_location and asset.location != cycle.scope_location:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Asset does not belong to the scoped location")

        # Upsert result
        result = self.session.exec(
            select(AuditResult).where(
                AuditResult.audit_cycle_id == cycle_id,
                AuditResult.asset_id == data.asset_id
            )
        ).first()

        if result:
            result.status = data.status
            result.notes = data.notes
            result.auditor_id = current_user.id
        else:
            result = AuditResult(
                audit_cycle_id=cycle_id,
                asset_id=data.asset_id,
                auditor_id=current_user.id,
                status=data.status,
                notes=data.notes
            )
        
        self.session.add(result)
        self.session.commit()
        self.session.refresh(result)
        return AuditResultResponse.model_validate(result)

    def list_results(
        self, cycle_id: int, skip: int = 0, limit: int = 50
    ) -> tuple[List[AuditResultResponse], int]:
        query = select(AuditResult).where(AuditResult.audit_cycle_id == cycle_id)
        total = self.session.exec(select(func.count()).select_from(query.subquery())).one()
        results = self.session.exec(query.order_by(AuditResult.created_at.desc()).offset(skip).limit(limit)).all()
        return [AuditResultResponse.model_validate(r) for r in results], total

    # ── B7: Closure Engine ──────────────────────────────────────────────

    def close_cycle(self, cycle_id: int, current_user: User) -> AuditDiscrepancyReport:
        self._require_manager(current_user)
        cycle = self.session.get(AuditCycle, cycle_id)
        if not cycle:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cycle not found")
        if cycle.status == "closed":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cycle is already closed")

        # 1. Find all assets in scope
        query = select(Asset)
        if cycle.scope_department_id:
            query = query.where(Asset.department_id == cycle.scope_department_id)
        if cycle.scope_location:
            query = query.where(Asset.location == cycle.scope_location)
        assets_in_scope = self.session.exec(query).all()

        # 2. Get all logged results
        results = self.session.exec(select(AuditResult).where(AuditResult.audit_cycle_id == cycle_id)).all()
        result_map = {r.asset_id: r for r in results}

        # 3. Process each asset
        for asset in assets_in_scope:
            res = result_map.get(asset.id)
            if not res:
                # Missing asset, automatically log it
                auto_result = AuditResult(
                    audit_cycle_id=cycle_id,
                    asset_id=asset.id,
                    auditor_id=current_user.id, # System closed it
                    status="missing",
                    notes="Auto-generated: Asset not scanned during audit cycle"
                )
                self.session.add(auto_result)
                asset.status = "lost"
                self.session.add(asset)
            else:
                # If explicitly marked missing or damaged, handle asset status
                if res.status == "missing":
                    asset.status = "lost"
                    self.session.add(asset)
                # Note: if damaged, we don't automatically put it under maintenance,
                # a maintenance request should be raised. We leave status as is, 
                # but it goes into discrepancy report.
        
        cycle.status = "closed"
        self.session.add(cycle)
        self.session.commit()

        # Generate report
        return self.get_report(cycle_id, current_user)

    def get_report(self, cycle_id: int, current_user: User) -> AuditDiscrepancyReport:
        self._require_manager(current_user)
        cycle = self.session.get(AuditCycle, cycle_id)
        if not cycle:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cycle not found")

        # In-scope
        query = select(Asset)
        if cycle.scope_department_id:
            query = query.where(Asset.department_id == cycle.scope_department_id)
        if cycle.scope_location:
            query = query.where(Asset.location == cycle.scope_location)
        assets_in_scope = self.session.exec(query).all()

        results = self.session.exec(select(AuditResult).where(AuditResult.audit_cycle_id == cycle_id)).all()
        result_map = {r.asset_id: r for r in results}

        verified_count = 0
        missing_count = 0
        damaged_count = 0
        discrepancies = []

        for asset in assets_in_scope:
            res = result_map.get(asset.id)
            status = res.status if res else "missing"
            
            if status == "verified":
                verified_count += 1
            else:
                if status == "missing":
                    missing_count += 1
                elif status == "damaged":
                    damaged_count += 1
                
                discrepancies.append(
                    DiscrepancyItem(
                        asset_id=asset.id,
                        asset_tag=asset.tag,
                        status=status,
                        notes=res.notes if res else "Not scanned"
                    )
                )
        
        return AuditDiscrepancyReport(
            audit_cycle_id=cycle.id,
            cycle_name=cycle.name,
            total_assets_in_scope=len(assets_in_scope),
            verified_count=verified_count,
            missing_count=missing_count,
            damaged_count=damaged_count,
            discrepancies=discrepancies
        )
