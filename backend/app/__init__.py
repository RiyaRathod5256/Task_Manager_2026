import os

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .extensions import db


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL", "sqlite:///tasks.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv(
        "JWT_SECRET_KEY", "dev-change-me-in-production"
    )

    db.init_app(app)
    JWTManager(app)
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
    )

    from .routes.auth import bp as auth_bp
    from .routes.projects import bp as projects_bp
    from .routes.tasks import bp as tasks_bp
    from .routes.dashboard import bp as dashboard_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(projects_bp, url_prefix="/api")
    app.register_blueprint(tasks_bp, url_prefix="/api")
    app.register_blueprint(dashboard_bp, url_prefix="/api")

    @app.cli.command("init-db")
    def init_db():
        db.create_all()
        print("Database tables created.")

    return app


__all__ = ["create_app", "db"]
