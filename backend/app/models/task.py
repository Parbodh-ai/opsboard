
from app.extensions import db


class Task(db.Model):
    __tablename__ = "tasks"

    VALID_STATUSES = {"Pending", "In Progress", "Completed"}
    VALID_PRIORITIES = {"Low", "Medium", "High"}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(30), nullable=False, default="Pending")
    priority = db.Column(db.String(20), nullable=False, default="Medium")
    assigned_to = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "priority": self.priority,
            "assigned_to": self.assigned_to
        }
