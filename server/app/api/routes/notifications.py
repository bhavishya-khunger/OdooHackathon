from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select

from app.api.deps import get_current_user
from app.database import get_session
from app.models import ActivityLog, Notification, User
from app.schemas.notifications import ActivityLogResponse, NotificationResponse

router = APIRouter(tags=["notifications"])


@router.get("/notifications", response_model=list[NotificationResponse])
def list_notifications(
    unread_only: bool = Query(default=False),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    query = select(Notification).where(Notification.user_id == current_user.id)
    if unread_only:
        query = query.where(Notification.is_read == False)
    query = query.order_by(Notification.created_at.desc())
    return session.exec(query).all()


@router.patch("/notifications/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    notification = session.get(Notification, notification_id)
    if not notification or notification.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )

    notification.is_read = True
    session.add(notification)
    session.commit()
    session.refresh(notification)
    return notification


@router.get("/activity-logs", response_model=list[ActivityLogResponse])
def list_activity_logs(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    query = select(ActivityLog).where(ActivityLog.user_id == current_user.id)
    query = query.order_by(ActivityLog.created_at.desc())
    return session.exec(query).all()
