
from flask import Blueprint, jsonify
from sqlalchemy import text

from app.extensions import db

health_bp = Blueprint("health", __name__)


@health_bp.route("/api/health", methods=["GET"])
def health_check():
    db.session.execute(text("SELECT 1"))

    return jsonify({
        "status": "healthy",
        "application": "OpsBoard API",
        "database": "connected"
    }), 200
