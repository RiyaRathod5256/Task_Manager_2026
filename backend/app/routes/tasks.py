from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from sqlalchemy import func, or_

from ..auth_helpers import admin_required
from ..extensions import db
from ..models import Project, Task, User

bp = Blueprint("tasks", __name__)


@bp.post("/tasks")
@jwt_required()
@admin_required
def create_task():
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    project_id = data.get("project_id")
    assigned_to_id = data.get("assigned_to_user_id") or data.get("assigned_to_id")
    due_raw = data.get("due_date")
    status = data.get("status") or "pending"
    description = data.get("description")

    if not title or project_id is None or assigned_to_id is None:
        return (
            jsonify(
                {"error": "title, project_id, and assigned_to_user_id are required"}
            ),
            400,
        )

    try:
        from datetime import datetime

        if isinstance(due_raw, str):
            due_date = datetime.strptime(due_raw[:10], "%Y-%m-%d").date()
        else:
            return jsonify({"error": "due_date required (YYYY-MM-DD)"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid due_date"}), 400

    creator_id = int(get_jwt_identity())
    project = Project.query.get(int(project_id))
    if not project:
        return jsonify({"error": "Project not found"}), 404
    assignee = User.query.get(int(assigned_to_id))
    if not assignee:
        return jsonify({"error": "User not found"}), 404
    if assignee not in project.members:
        return (
            jsonify({"error": "Assignee must be a member of the project"}),
            400,
        )

    allowed_status = {"pending", "in_progress", "completed"}
    if status not in allowed_status:
        status = "pending"

    task = Task(
        title=title,
        description=(description or "").strip() or None,
        due_date=due_date,
        status=status,
        project_id=project.id,
        assigned_to_id=assignee.id,
        created_by_id=creator_id,
    )
    db.session.add(task)
    db.session.commit()
    return jsonify({"task": _serialize_task(task)}), 201


@bp.patch("/tasks/<int:task_id>")
@jwt_required()
def update_task_status(task_id: int):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Not found"}), 404
    data = request.get_json(silent=True) or {}

    if user.role == "admin":
        if "assigned_to_user_id" in data and data["assigned_to_user_id"]:
            nid = int(data["assigned_to_user_id"])
            new_user = User.query.get(nid)
            if new_user and new_user in task.project.members:
                task.assigned_to_id = nid

    if user.role == "admin" or (
        user.role == "member" and task.assigned_to_id == user.id
    ):
        if "status" in data and data["status"] in (
            "pending",
            "in_progress",
            "completed",
        ):
            task.status = data["status"]

    db.session.commit()
    return jsonify({"task": _serialize_task(task)})


@bp.delete("/tasks/<int:task_id>")
@jwt_required()
@admin_required
def delete_task(task_id: int):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(task)
    db.session.commit()
    return jsonify({"ok": True})


@bp.get("/tasks/recent")
@jwt_required()
@admin_required
def recent_tasks():
    search = (request.args.get("q") or "").strip().lower()
    limit = request.args.get("limit", default=50, type=int)
    query = Task.query.join(Project)

    if search:
        needle = f"%{search}%"
        query = query.filter(
            or_(func.lower(Task.title).like(needle), func.lower(Project.name).like(needle))
        )

    rows = query.order_by(Task.created_at.desc()).limit(min(limit, 100)).all()
    out = [_serialize_admin_task_summary(t) for t in rows]
    return jsonify({"tasks": out})


def _serialize_task(t: Task) -> dict:
    return {
        "id": t.id,
        "title": t.title,
        "project_id": t.project_id,
        "project_name": t.project.name,
        "assigned_to_id": t.assigned_to_id,
        "assigned_name": t.assignee.full_name if t.assignee else "",
        "due_date": t.due_date.isoformat(),
        "status": t.status,
        "is_overdue": t.is_overdue(),
    }


def _serialize_admin_task_summary(t: Task) -> dict:
    return _serialize_task(t)


@bp.get("/users/for-assignment")
@jwt_required()
@admin_required
def users_for_dropdown():
    members = User.query.filter_by(role="member").order_by(User.full_name).all()
    projects = Project.query.order_by(Project.name).all()
    return jsonify(
        {
            "members": [{"id": m.id, "full_name": m.full_name} for m in members],
            "projects": [{"id": p.id, "name": p.name} for p in projects],
        }
    )
