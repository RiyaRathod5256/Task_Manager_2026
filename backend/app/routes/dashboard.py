from sqlalchemy import func

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from ..auth_helpers import admin_required
from ..extensions import db
from ..models import Project, Task, User

bp = Blueprint("dashboard", __name__)


@bp.get("/admin/dashboard-stats")
@jwt_required()
@admin_required
def admin_dashboard_stats():
    total_projects = Project.query.count()
    total_tasks = Task.query.count()
    in_progress = Task.query.filter_by(status="in_progress").count()
    completed = Task.query.filter_by(status="completed").count()
    pending = Task.query.filter_by(status="pending").count()
    projects_in_progress = Project.query.filter_by(status="in_progress").count()
    projects_completed = Project.query.filter_by(status="completed").count()
    return jsonify(
        {
            "total_projects": total_projects,
            "total_tasks": total_tasks,
            "in_progress_tasks": in_progress,
            "completed_tasks": completed,
            "pending_tasks": pending,
            "projects_in_progress": projects_in_progress,
            "projects_completed": projects_completed,
        }
    )


@bp.get("/member/my-tasks")
@jwt_required()
def member_my_tasks():
    from flask_jwt_extended import get_jwt_identity

    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role == "admin":
        return jsonify({"error": "Use admin endpoints"}), 400

    tasks = (
        Task.query.filter_by(assigned_to_id=user_id)
        .join(Project)
        .order_by(Project.name, Task.due_date)
        .all()
    )
    grouped = {}
    for t in tasks:
        pname = t.project.name
        if pname not in grouped:
            grouped[pname] = {
                "project_id": t.project.id,
                "project_name": pname,
                "tasks": [],
            }
        grouped[pname]["tasks"].append(_task_detail(t))

    return jsonify({"projects": list(grouped.values())})


def _task_detail(t: Task) -> dict:
    return {
        "id": t.id,
        "title": t.title,
        "status": t.status,
        "due_date": t.due_date.isoformat(),
        "is_overdue": t.is_overdue(),
        "project_id": t.project_id,
    }


@bp.get("/member/project-stats")
@jwt_required()
def member_project_stats():
    """Counts for member dashboard + sidebar chart (assigned tasks only)."""
    from flask_jwt_extended import get_jwt_identity

    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role == "admin":
        return jsonify({"error": "Use admin endpoints"}), 400

    overdue = Task.query.filter(
        Task.assigned_to_id == user_id,
        Task.status != "completed",
        Task.due_date < func.current_date(),
    ).count()
    open_tasks = Task.query.filter(
        Task.assigned_to_id == user_id, Task.status != "completed"
    ).count()
    completed_tasks = Task.query.filter_by(
        assigned_to_id=user_id, status="completed"
    ).count()
    in_progress_tasks = Task.query.filter_by(
        assigned_to_id=user_id, status="in_progress"
    ).count()
    pending_tasks = Task.query.filter_by(
        assigned_to_id=user_id, status="pending"
    ).count()
    return jsonify(
        {
            "open_tasks": open_tasks,
            "overdue_tasks": overdue,
            "completed_tasks": completed_tasks,
            "in_progress_tasks": in_progress_tasks,
            "pending_tasks": pending_tasks,
        }
    )
