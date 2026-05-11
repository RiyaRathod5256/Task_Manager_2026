import re

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
)

from ..extensions import db
from ..models import User

bp = Blueprint("auth", __name__)

# Email validation regex
EMAIL_PATTERN = (
    r'^[A-Za-z][A-Za-z0-9._%+-]*@'
    r'[A-Za-z0-9]+([.-][A-Za-z0-9]+)*'
    r'\.[A-Za-z]{2,}$'
)

# Password validation regex
# - 8 to 15 characters
# - at least 1 lowercase
# - at least 1 uppercase
# - at least 1 digit
# - at least 1 special character
PASSWORD_PATTERN = (
    r'^(?=.*[a-z])'
    r'(?=.*[A-Z])'
    r'(?=.*\d)'
    r'(?=.*[@$!%*?&])'
    r'[A-Za-z\d@$!%*?&]{8,15}$'
)

# Full name: 2–120 chars, Unicode letters, spaces / . ' - between parts (matches DB column)
FULL_NAME_PATTERN = re.compile(
    r'^(?=.{2,120}$)[^\W\d_]+(?:[\s\'.\-]+[^\W\d_]+)*$',
    re.UNICODE,
)


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
    full_name = " ".join((data.get("full_name") or "").split())

    # Required fields validation
    if not email or not password or not full_name:
        return jsonify({
            "error": "email, password, and full_name are required"
        }), 400

    # Full name validation
    if not FULL_NAME_PATTERN.match(full_name):
        return jsonify({
            "error": (
                "Full name must be 2–120 characters, use letters only, "
                "and may include spaces, hyphens, apostrophes, or periods between parts."
            )
        }), 400

    # Email validation
    if not re.match(EMAIL_PATTERN, email):
        return jsonify({
            "error": "Invalid email format"
        }), 400

    # Password validation
    if not re.match(PASSWORD_PATTERN, password):
        return jsonify({
            "error": (
                "Password must be 8-15 characters long and include "
                "uppercase, lowercase, number, and special character."
            )
        }), 400

    # Check if email already exists
    if User.query.filter_by(email=email).first():
        return jsonify({
            "error": "Email already registered"
        }), 409

    # Role logic
    user_count = User.query.count()
    role = data.get("role")

    if user_count == 0 and role == "admin":
        final_role = "admin"
    else:
        final_role = "member"

    # Create new user
    user = User(
        email=email,
        full_name=full_name,
        role=final_role,
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    # Generate JWT token
    token = create_access_token(identity=user.id)

    return jsonify({
        "access_token": token,
        "user": user_to_dict(user)
    }), 201


@bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    # Required fields check
    if not email or not password:
        return jsonify({
            "error": "email and password are required"
        }), 400

    # Optional email format validation
    if not re.match(EMAIL_PATTERN, email):
        return jsonify({
            "error": "Invalid email format"
        }), 400

    # Find user
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({
            "error": "User does not exist"
        }), 401

    if not user.check_password(password):
        return jsonify({
            "error": "Invalid email or password"
        }), 401

    # Generate JWT token
    token = create_access_token(identity=user.id)

    return jsonify({
        "access_token": token,
        "user": user_to_dict(user)
    }), 200


@bp.get("/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "error": "User not found"
        }), 404

    return jsonify(user_to_dict(user)), 200