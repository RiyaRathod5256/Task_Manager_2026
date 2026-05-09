from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from ..extensions import db
from ..models import User

bp = Blueprint("auth", __name__)


def user_to_dict(u: User) -> dict:
    return {
        "id": u.id,
        "email": u.email,
        "full_name": u.full_name,
        "role": u.role,
    }


@bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    full_name = (data.get("full_name") or "").strip()
    if not email or not password or not full_name:
        return jsonify({"error": "email, password, full_name required"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409
    user_count = User.query.count()
    role = data.get("role")
    if user_count == 0 and role == "admin":
        final_role = "admin"
    else:
        final_role = "member"
    user = User(email=email, full_name=full_name, role=final_role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    token = create_access_token(identity=user.id)
    return jsonify({"access_token": token, "user": user_to_dict(user)}), 201


@bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401
    token = create_access_token(identity=user.id)
    return jsonify({"access_token": token, "user": user_to_dict(user)})


@bp.get("/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Not found"}), 404
    return jsonify(user_to_dict(user))
