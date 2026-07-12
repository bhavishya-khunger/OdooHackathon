import sys
import os

# Ensure the app module can be imported by adding the current directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from datetime import date
from sqlmodel import Session, select
from app.database import engine, init_db
from app.models.tables import User, Department, AssetCategory, Asset
from app.core.security import hash_password

def seed_data():
    print("Initializing database tables (if they don't exist)...")
    init_db()

    with Session(engine) as session:
        print("Seeding departments...")
        
        departments_data = ["IT Department", "Human Resources", "Operations"]
        departments = {}
        
        for dept_name in departments_data:
            # Check if department exists
            statement = select(Department).where(Department.name == dept_name)
            dept = session.exec(statement).first()
            if not dept:
                dept = Department(name=dept_name)
                session.add(dept)
                session.commit()
                session.refresh(dept)
            departments[dept_name] = dept
            
        print("Seeding users...")

        users_data = [
            {
                "name": "Admin User",
                "email": "admin@odoo.com",
                "password_hash": hash_password("admin123"),
                "role": "admin",
                "department_id": departments["IT Department"].id,
                "status": "active"
            },
            {
                "name": "Manager User",
                "email": "manager@odoo.com",
                "password_hash": hash_password("manager123"),
                "role": "manager",
                "department_id": departments["Operations"].id,
                "status": "active"
            },
            {
                "name": "Employee User",
                "email": "employee@odoo.com",
                "password_hash": hash_password("employee123"),
                "role": "employee",
                "department_id": departments["IT Department"].id,
                "status": "active"
            },
            {
                "name": "Auditor User",
                "email": "auditor@odoo.com",
                "password_hash": hash_password("auditor123"),
                "role": "auditor",
                "department_id": departments["Human Resources"].id,
                "status": "active"
            },
            {
                "name": "Inactive User",
                "email": "inactive@odoo.com",
                "password_hash": hash_password("inactive123"),
                "role": "employee",
                "department_id": departments["Human Resources"].id,
                "status": "inactive"
            }
        ]

        added_users = 0
        for user_dict in users_data:
            # Check if user exists by email
            statement = select(User).where(User.email == user_dict["email"])
            user = session.exec(statement).first()
            if not user:
                user = User(**user_dict)
                session.add(user)
                added_users += 1

        session.commit()

        print("Seeding asset categories...")
        categories_data = ["Laptops", "Monitors", "Office Furniture"]
        categories = {}

        for cat_name in categories_data:
            statement = select(AssetCategory).where(AssetCategory.name == cat_name)
            cat = session.exec(statement).first()
            if not cat:
                cat = AssetCategory(name=cat_name)
                session.add(cat)
                session.commit()
                session.refresh(cat)
            categories[cat_name] = cat
            
        print("Seeding assets...")
        assets_data = [
            {
                "name": "MacBook Pro M2",
                "category_id": categories["Laptops"].id,
                "tag": "LAP-001",
                "serial_number": "C02F123456",
                "acquisition_date": date(2023, 5, 15),
                "acquisition_cost": 2199.00,
                "condition": "good",
                "location": "HQ - 3rd Floor",
                "status": "available",
                "department_id": departments["IT Department"].id
            },
            {
                "name": "Dell XPS 15",
                "category_id": categories["Laptops"].id,
                "tag": "LAP-002",
                "serial_number": "DXPS78910",
                "acquisition_date": date(2022, 11, 20),
                "acquisition_cost": 1850.50,
                "condition": "fair",
                "location": "HQ - 2nd Floor",
                "status": "available",
                "department_id": departments["Operations"].id
            },
            {
                "name": "Dell UltraSharp 27",
                "category_id": categories["Monitors"].id,
                "tag": "MON-001",
                "serial_number": "DUS27123",
                "acquisition_date": date(2024, 1, 10),
                "acquisition_cost": 450.00,
                "condition": "new",
                "location": "HQ - 3rd Floor",
                "status": "available",
                "department_id": departments["IT Department"].id
            },
            {
                "name": "Ergonomic Office Chair",
                "category_id": categories["Office Furniture"].id,
                "tag": "FURN-001",
                "serial_number": "EOC999",
                "acquisition_date": date(2023, 8, 5),
                "acquisition_cost": 350.00,
                "condition": "good",
                "location": "HQ - HR Office",
                "status": "in_use",
                "department_id": departments["Human Resources"].id
            }
        ]

        added_assets = 0
        for asset_dict in assets_data:
            statement = select(Asset).where(Asset.tag == asset_dict["tag"])
            asset = session.exec(statement).first()
            if not asset:
                asset = Asset(**asset_dict)
                session.add(asset)
                added_assets += 1
                
        session.commit()
        
        print(f"Successfully seeded {added_users} new users, {len(categories)} categories, and {added_assets} new assets. Ensured 3 departments exist.")

if __name__ == "__main__":
    print("Starting database seeding...")
    seed_data()
    print("Done!")
