# OpsBoard Backend

Flask REST API for the OpsBoard Team Operations and Incident Management Platform.

## Technology Stack

- Python
- Flask
- Flask-SQLAlchemy
- SQLAlchemy
- PostgreSQL
- Psycopg

## Features

- Task creation and retrieval
- Task updates using PATCH
- Task deletion
- Server-side input validation
- PostgreSQL persistence
- Centralised database error handling
- Database-aware health endpoint

## Setup

1. Create and activate a Python virtual environment.
2. Install dependencies:

   pip install -r requirements.txt

3. Copy `.env.example` to `.env`.
4. Configure your local PostgreSQL credentials.
5. Start the Flask API:

   python run.py

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/health | Application and database health |
| GET | /api/tasks | Retrieve all tasks |
| GET | /api/tasks/<id> | Retrieve one task |
| POST | /api/tasks | Create a task |
| PATCH | /api/tasks/<id> | Update a task |
| DELETE | /api/tasks/<id> | Delete a task |

## Development Server

The API runs locally at:

http://127.0.0.1:5000
