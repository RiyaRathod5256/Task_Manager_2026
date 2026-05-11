"""Create default admin account. Run after init-db."""

import os
import sys

from dotenv import load_dotenv

load_dotenv()

sys.path.insert(0, os.path.dirname(__file__))

from app import create_app
from app.extensions import db
from app.models import User


def seed():
    app = create_app()
    with app.app_context():
        db.create_all()
        email = os.getenv("SEED_ADMIN_EMAIL", "admin12@gmail.com").lower().strip()
        password = os.getenv("SEED_ADMIN_PASSWORD", "Admin123@")
        name = os.getenv("SEED_ADMIN_NAME", "Admin")

        existing = User.query.filter_by(email=email).first()
        if existing:
            print(f"Admin already exists: {email}")
            return
        admin = User(email=email, full_name=name, role="admin")
        admin.set_password(password)
        db.session.add(admin)
        db.session.commit()
        print(f"Created admin: {email} / password: {password}")


if __name__ == "__main__":
    seed()
