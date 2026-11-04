import os
import re
from pathlib import Path
from typing import Any
from uuid import UUID

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template_string, request
from postgrest import APIError
from supabase import Client, create_client

load_dotenv(Path(__file__).resolve().with_name(".env"))

app = Flask(__name__)


def _create_supabase_client() -> Client | None:
    url = os.environ.get("SUPABASE_URL")
    key = (
        os.environ.get("SUPABASE_SECRET_KEY")
        or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        or os.environ.get("SUPABASE_PUBLISHABLE_KEY")
    )
    if not url or not key:
        return None
    return create_client(url, key)


supabase = _create_supabase_client()


def _database() -> Client:
    if supabase is None:
        raise RuntimeError(
            "Supabase is not configured. Set SUPABASE_URL and a server-side "
            "SUPABASE_SECRET_KEY in the backend environment."
        )
    return supabase


def _rows(response: Any) -> list[dict[str, Any]]:
    data = response.data
    if data is None:
        return []
    return data if isinstance(data, list) else [data]


def _find_event(event_id: str) -> dict[str, Any] | None:
    rows = _rows(
        _database()
        .table("events")
        .select("*")
        .eq("id", event_id)
        .limit(1)
        .execute()
    )
    return rows[0] if rows else None


def _event_data(row: dict[str, Any]) -> dict[str, Any]:
    event = {
        key: value
        for key, value in row.items()
        if key not in {"data", "organizer_id", "registered_count"}
    }
    event.update(row.get("data") or {})
    event["id"] = str(row["id"])
    event["organizerId"] = row.get("organizer_id") or event.get("organizerId")
    event["capacity"] = row.get("capacity", event.get("capacity", 0))
    event["registeredCount"] = row.get(
        "registered_count", event.get("registeredCount", 0)
    )
    return event


def _registration_data(row: dict[str, Any]) -> dict[str, Any]:
    registration = dict(row.get("data") or {})
    for key, value in row.items():
        if key == "data":
            continue
        camel_key = re.sub(r"_([a-z])", lambda match: match.group(1).upper(), key)
        registration.setdefault(camel_key, str(value) if isinstance(value, UUID) else value)
    if "id" in registration:
        registration["id"] = str(registration["id"])
    if "eventId" in registration:
        registration["eventId"] = str(registration["eventId"])
    return registration


def _valid_event_uuid(event_id: str) -> bool:
    try:
        UUID(event_id)
        return True
    except ValueError:
        return False


def _db_error_response(error: Exception):
    app.logger.error("Supabase request failed: %s", error)
    if isinstance(error, RuntimeError):
        return jsonify({"error": "Backend not configured", "message": str(error)}), 503
    details = error.message if isinstance(error, APIError) else str(error)
    return jsonify(
        {
            "error": "Database operation failed",
            "message": details,
        }
    ), 502


@app.get("/")
def api_index():
    endpoints = [
        {
            "method": "GET",
            "path": "/api/events",
            "description": "Browse events. Supports search, category, and status query parameters.",
            "url": "/api/events",
        },
        {
            "method": "GET",
            "path": "/api/events/{id}",
            "description": "Get event details. Copy a UUID from GET /api/events.",
            "url": "/api/events",
        },
        {
            "method": "POST",
            "path": "/api/registrations",
            "description": "Create a registration. eventId must be a UUID from GET /api/events.",
            "url": None,
        },
        {
            "method": "GET",
            "path": "/api/me/registrations",
            "description": "List registrations. Optionally filter with ?studentId=STUDENT_ID.",
            "url": "/api/me/registrations",
        },
        {
            "method": "GET",
            "path": "/api/events/{id}/registrations",
            "description": "List attendees. Use a UUID from GET /api/events.",
            "url": "/api/events",
        },
    ]
    return render_template_string(
        """<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>CampusConnect API</title>
    <style>
      body { margin: 0; padding: 2rem; background: #f8fafc; color: #0f172a; font: 16px/1.5 system-ui, sans-serif; }
      main { max-width: 1000px; margin: auto; }
      h1 { margin-bottom: .25rem; }
      p { color: #475569; }
      table { width: 100%; margin-top: 1.5rem; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px #0f172a18; }
      th, td { padding: 1rem; text-align: left; vertical-align: top; border-bottom: 1px solid #e2e8f0; }
      th { background: #ede9fe; }
      code { color: #c2410c; font-weight: 700; }
      a { color: #4f46e5; }
      .method { font-weight: 700; color: #4338ca; }
      @media (max-width: 650px) {
        body { padding: 1rem; }
        th, td { padding: .65rem; }
      }
    </style>
  </head>
  <body>
    <main>
      <h1>CampusConnect API</h1>
      <p>API is running. Select a GET endpoint to see its JSON response. Use an API client to send the POST request.</p>
      <table>
        <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th><th>Try it</th></tr></thead>
        <tbody>
          {% for endpoint in endpoints %}
          <tr>
            <td class="method">{{ endpoint.method }}</td>
            <td><code>{{ endpoint.path }}</code></td>
            <td>{{ endpoint.description }}</td>
            <td>{% if endpoint.url %}<a href="{{ endpoint.url }}">Open</a>{% else %}POST JSON{% endif %}</td>
          </tr>
          {% endfor %}
        </tbody>
      </table>
    </main>
  </body>
</html>""",
        endpoints=endpoints,
    )


@app.get("/api/events")
def list_events():
    try:
        rows = _rows(_database().table("events").select("*").execute())
        events = [_event_data(row) for row in rows]

        search = request.args.get("search", "").strip().casefold()
        category = request.args.get("category", "").strip().casefold()
        status = request.args.get("status", "").strip().casefold()

        if search:
            events = [
                event
                for event in events
                if search
                in " ".join(
                    [
                        str(event.get("title", "")),
                        str(event.get("shortDescription", "")),
                        str(event.get("venue", "")),
                        str((event.get("organizer") or {}).get("name", "")),
                        " ".join(str(tag) for tag in event.get("tags", [])),
                    ]
                ).casefold()
            ]
        if category and category != "all":
            events = [
                event
                for event in events
                if str(event.get("category", "")).casefold() == category
            ]
        if status and status != "all":
            events = [
                event
                for event in events
                if str(event.get("status", "")).casefold() == status
            ]

        return jsonify(events)
    except (APIError, RuntimeError) as error:
        return _db_error_response(error)


@app.get("/api/events/<event_id>")
def get_event(event_id: str):
    if not _valid_event_uuid(event_id):
        return jsonify(
            {
                "error": "Bad request",
                "message": "Event id must be a UUID. Get a valid id from GET /api/events.",
            }
        ), 400
    try:
        row = _find_event(event_id)
        if row is None:
            return jsonify({"error": "Not found", "message": "Event not found"}), 404
        return jsonify(_event_data(row))
    except (APIError, RuntimeError) as error:
        return _db_error_response(error)


@app.post("/api/registrations")
def create_registration():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "Bad request", "message": "Expected a JSON object"}), 400

    required = ("eventId", "fullName", "email", "studentId")
    missing = [field for field in required if not str(payload.get(field, "")).strip()]
    if missing:
        return jsonify(
            {
                "error": "Bad request",
                "message": f"Missing required fields: {', '.join(missing)}",
            }
        ), 400

    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", str(payload["email"]).strip()):
        return jsonify({"error": "Bad request", "message": "A valid email is required"}), 400

    event_id = str(payload["eventId"]).strip()
    if not _valid_event_uuid(event_id):
        return jsonify(
            {
                "error": "Bad request",
                "message": "eventId must be a UUID from GET /api/events.",
            }
        ), 400

    try:
        result = _database().rpc(
            "create_registration",
            {
                "p_event_id": event_id,
                "p_registration": payload,
            },
        ).execute().data
        if isinstance(result, list):
            result = result[0] if result else {}
        result = result or {}
        return jsonify(result.get("data", {})), int(result.get("status", 201))
    except (APIError, RuntimeError) as error:
        return _db_error_response(error)


@app.get("/api/me/registrations")
def get_my_registrations():
    try:
        rows = _rows(_database().table("registrations").select("*").execute())
        student_id = request.args.get("studentId", "").strip()
        if student_id:
            registrations = [_registration_data(row) for row in rows]
            registrations = [
                registration
                for registration in registrations
                if str(registration.get("studentId", "")).casefold()
                == student_id.casefold()
            ]
            return jsonify(registrations)
        return jsonify([_registration_data(row) for row in rows])
    except (APIError, RuntimeError) as error:
        return _db_error_response(error)


@app.get("/api/events/<event_id>/registrations")
def get_event_registrations(event_id: str):
    if not _valid_event_uuid(event_id):
        return jsonify(
            {
                "error": "Bad request",
                "message": "Event id must be a UUID. Get a valid id from GET /api/events.",
            }
        ), 400
    try:
        event_row = _find_event(event_id)
        if event_row is None:
            return jsonify({"error": "Not found", "message": "Event not found"}), 404

        attendee_rows = _rows(
            _database()
            .table("registrations")
            .select("*")
            .eq("event_id", event_id)
            .execute()
        )
        attendees = [_registration_data(row) for row in attendee_rows]
        checked_in_count = sum(bool(attendee.get("checkedIn")) for attendee in attendees)
        event = _event_data(event_row)
        total_registrations = len(attendees)

        return jsonify(
            {
                "eventId": event_id,
                "eventTitle": event.get("title", ""),
                "organizerName": (event.get("organizer") or {}).get("name", ""),
                "totalCapacity": event.get("capacity", 0),
                "totalRegistrations": total_registrations,
                "checkedInCount": checked_in_count,
                "checkInPercentage": round(
                    checked_in_count / total_registrations * 100
                )
                if total_registrations
                else 0,
                "attendees": attendees,
            }
        )
    except (APIError, RuntimeError) as error:
        return _db_error_response(error)


if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG") == "true")
