
from flask import Blueprint, jsonify, request

from app.extensions import db
from app.models import Task

tasks_bp = Blueprint("tasks", __name__)


ALLOWED_FIELDS = {
    "title": 150,
    "description": None,
    "status": 30,
    "priority": 20,
    "assigned_to": 100,
}


def validate_task_data(data, partial=False):
    if not isinstance(data, dict) or not data:
        return {"error": "Valid JSON object required"}

    invalid_fields = [field for field in data if field not in ALLOWED_FIELDS]

    if invalid_fields:
        return {
            "error": "Invalid fields",
            "fields": invalid_fields
        }

    if not partial:
        missing_fields = [
            field for field in ALLOWED_FIELDS
            if field not in data
        ]

        if missing_fields:
            return {
                "error": "Missing required fields",
                "fields": missing_fields
            }

    errors = {}

    for field, value in data.items():
        if not isinstance(value, str) or not value.strip():
            errors[field] = "Must be a non-empty string"
            continue

        if ALLOWED_FIELDS[field] is not None:
            if len(value.strip()) > ALLOWED_FIELDS[field]:
                errors[field] = (
                    f"Must not exceed {ALLOWED_FIELDS[field]} characters"
                )

        if field == "status" and value.strip() not in Task.VALID_STATUSES:
            errors[field] = "Invalid status"

        if field == "priority" and value.strip() not in Task.VALID_PRIORITIES:
            errors[field] = "Invalid priority"

    return {"errors": errors} if errors else None



# GET: Retrieve all tasks
@tasks_bp.route("/api/tasks", methods=["GET"])
def get_tasks():
    tasks = db.session.execute(
        db.select(Task).order_by(Task.id)
    ).scalars().all()

    return jsonify([task.to_dict() for task in tasks]), 200


# GET: Retrieve a single task
@tasks_bp.route("/api/tasks/<int:task_id>", methods=["GET"])
def get_task(task_id):
    task = db.session.get(Task, task_id)

    if task is None:
        return jsonify({"error": "Task not found"}), 404

    return jsonify(task.to_dict()), 200



@tasks_bp.route("/api/tasks", methods=["POST"])
def create_task():
    data = request.get_json(silent=True)

    validation_error = validate_task_data(data)

    if validation_error:
        return jsonify(validation_error), 400

    task = Task(
        title=data["title"].strip(),
        description=data["description"].strip(),
        status=data["status"].strip(),
        priority=data["priority"].strip(),
        assigned_to=data["assigned_to"].strip()
    )

    db.session.add(task)

    db.session.commit()

    return jsonify(task.to_dict()), 201


@tasks_bp.route("/api/tasks/<int:task_id>", methods=["PATCH"])
def update_task(task_id):
    task = db.session.get(Task, task_id)

    if task is None:
        return jsonify({"error": "Task not found"}), 404

    data = request.get_json(silent=True)

    validation_error = validate_task_data(data, partial=True)

    if validation_error:
        return jsonify(validation_error), 400

    for field, value in data.items():
        setattr(task, field, value.strip())

    db.session.commit()

    return jsonify(task.to_dict()), 200



@tasks_bp.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = db.session.get(Task, task_id)

    if task is None:
        return jsonify({"error": "Task not found"}), 404

    db.session.delete(task)

    db.session.commit()

    return jsonify({
        "message": "Task deleted successfully",
        "task_id": task_id
    }), 200
