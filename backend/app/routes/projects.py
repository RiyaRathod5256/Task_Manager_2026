from typing import Tuple

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.orm import joinedload

from ..auth_helpers import admin_required
from ..extensions import db
from ..models import Project, Task, User

bp = Blueprint("projects", __name__)


def _project_badge_status(project: Project) -> str:
    if project.status == "completed":
        return "completed"
    return "in_progress"


def _tasks_counts(project_id: int) -> Tuple[int, int]:
    total = Task.query.filter_by(project_id=project_id).count()
    done = Task.query.filter_by(project_id=project_id, status="completed").count()
    return done, total


@bp.post("/projects")
@jwt_required()
@admin_required
def create_project():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    description = (data.get("description") or "").strip() or None
    member_ids = data.get("member_ids") or []
    status = data.get("status") or "in_progress"
    if not name:
        return jsonify({"error": "name required"}), 400
    user_id = int(get_jwt_identity())
    project = Project(
        name=name,
        description=description,
        status=status if status in ("in_progress", "completed") else "in_progress",
        created_by_id=user_id,
    )
    db.session.add(project)
    db.session.flush()

    for mid in member_ids:
        member = User.query.get(int(mid))
        if member and member.role == "member":
            project.members.append(member)

    db.session.commit()
    return jsonify({"project": project_to_dict_detail(project)}), 201


@bp.get("/projects")
@jwt_required()
@admin_required
def list_projects():
    projects = Project.query.order_by(Project.created_at.desc()).all()
    out = []
    for p in projects:
        done, total = _tasks_counts(p.id)
        out.append(
            {
                "id": p.id,
                "name": p.name,
                "thumbnail_color": thumbnail_color(p.id),
                "member_count": len(p.members),
                "tasks_summary": {"done": done, "total": total},
                "status": _project_badge_status(p),
                "created_at": p.created_at.isoformat(),
            }
        )
    return jsonify({"projects": out})


def thumbnail_color(seed: int) -> str:
    colors = ["#6366f1", "#22c55e", "#f59e0b", "#ec4899", "#0ea5e9", "#a855f7"]
    return colors[seed % len(colors)]


@bp.get("/projects/<int:project_id>")
@jwt_required()
@admin_required
def get_project(project_id: int):
    project = Project.query.options(joinedload(Project.members)).get(project_id)
    if not project:
        return jsonify({"error": "Not found"}), 404
    return jsonify(project_to_dict_detail(project))


@bp.patch("/projects/<int:project_id>")
@jwt_required()
@admin_required
def update_project(project_id: int):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Not found"}), 404
    data = request.get_json(silent=True) or {}
    if "name" in data and data["name"]:
        project.name = str(data["name"]).strip()
    if "description" in data:
        project.description = (data["description"] or "").strip() or None
    if "status" in data and data["status"] in ("in_progress", "completed"):
        project.status = data["status"]
    db.session.commit()
    return jsonify({"project": project_to_dict_detail(project)})


def project_to_dict_detail(project: Project) -> dict:
    done, total = _tasks_counts(project.id)
    members_out = []
    for m in project.members:
        members_out.append(
            {
                "id": m.id,
                "full_name": m.full_name,
                "email": m.email,
                "role_title": role_label_for_member(m),
                "projects_count": len(m.projects),
                "avatar_color": thumbnail_color(m.id),
            }
        )
    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "status": project.status,
        "created_at": project.created_at.isoformat(),
        "tasks_summary": {"done": done, "total": total},
        "members": members_out,
    }


def role_label_for_member(user: User) -> str:
    return "Administrator" if user.role == "admin" else "Member"


@bp.post("/projects/<int:project_id>/members")
@jwt_required()
@admin_required
def add_project_members(project_id: int):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Not found"}), 404
    data = request.get_json(silent=True) or {}
    member_ids = data.get("member_ids") or []
    for mid in member_ids:
        member = User.query.get(int(mid))
        if member and member not in project.members:
            project.members.append(member)
    db.session.commit()
    return jsonify({"project": project_to_dict_detail(project)})


@bp.delete("/projects/<int:project_id>/members/<int:user_id>")
@jwt_required()
@admin_required
def remove_project_member(project_id: int, user_id: int):
    project = Project.query.options(joinedload(Project.members)).get(project_id)
    if not project:
        return jsonify({"error": "Not found"}), 404
    member = User.query.get(user_id)
    if member and member in project.members:
        project.members.remove(member)
    db.session.commit()
    return jsonify({"project": project_to_dict_detail(project)})


@bp.get("/projects/<int:project_id>/members/<int:user_id>/tasks")
@jwt_required()
@admin_required
def member_tasks_in_project(project_id: int, user_id: int):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Not found"}), 404
    member = User.query.get(user_id)
    if not member or member not in project.members:
        return jsonify({"error": "Member not in project"}), 404
    tasks = (
        Task.query.filter_by(project_id=project_id, assigned_to_id=user_id)
        .order_by(Task.due_date)
        .all()
    )
    return jsonify(
        {
            "project": {"id": project.id, "name": project.name},
            "member": {
                "id": member.id,
                "full_name": member.full_name,
                "email": member.email,
                "avatar_color": thumbnail_color(member.id),
            },
            "tasks": [
                {
                    "id": t.id,
                    "title": t.title,
                    "status": t.status,
                    "due_date": t.due_date.isoformat(),
                    "is_overdue": t.is_overdue(),
                }
                for t in tasks
            ],
        }
    )
