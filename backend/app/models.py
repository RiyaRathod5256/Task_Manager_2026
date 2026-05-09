from datetime import date, datetime

from werkzeug.security import check_password_hash, generate_password_hash

from .extensions import db

project_members = db.Table(
    "project_members",
    db.Column("project_id", db.Integer, db.ForeignKey("projects.id"), primary_key=True),
    db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
    db.Column("joined_at", db.DateTime, default=datetime.utcnow),
)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="member")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    projects = db.relationship(
        "Project", secondary=project_members, back_populates="members"
    )

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(30), nullable=False, default="in_progress")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    creator = db.relationship("User", foreign_keys=[created_by_id])
    members = db.relationship(
        "User", secondary=project_members, back_populates="projects"
    )
    tasks = db.relationship("Task", backref="project", lazy="dynamic")


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(300), nullable=False)
    description = db.Column(db.Text)
    due_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(30), nullable=False, default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)
    assigned_to_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_by_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    assignee = db.relationship("User", foreign_keys=[assigned_to_id])
    creator = db.relationship(
        "User", foreign_keys=[created_by_id]
    )

    def is_overdue(self) -> bool:
        if self.status == "completed":
            return False
        today = date.today()
        return self.due_date < today
