
import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify
from sqlalchemy import URL, text
from sqlalchemy.exc import SQLAlchemyError

from app.extensions import db
from app.routes.health import health_bp
from app.routes.tasks import tasks_bp


def create_app():
    env_path = Path(__file__).resolve().parents[1] / ".env"
    load_dotenv(dotenv_path=env_path)

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s"
    )

    app = Flask(__name__)

    required_variables = [
        "DB_USER",
        "DB_PASSWORD",
        "DB_HOST",
        "DB_NAME"
    ]

    missing_variables = [
        variable for variable in required_variables
        if not os.getenv(variable)
    ]

    if missing_variables:
        raise RuntimeError(
            f"Missing required environment variables: {missing_variables}"
        )

    database_url = URL.create(
        drivername="postgresql+psycopg",
        username=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", "5432")),
        database=os.getenv("DB_NAME"),
    )

    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    app.register_blueprint(health_bp)
    app.register_blueprint(tasks_bp)

    @app.errorhandler(SQLAlchemyError)
    def handle_database_error(error):
        db.session.rollback()

        app.logger.exception("Database operation failed")

        return jsonify({
            "error": "A database error occurred. Please try again."
        }), 500

    return app
