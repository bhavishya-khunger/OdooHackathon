from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app


def test_activity_and_notifications_are_recorded_for_user_actions():
    client = TestClient(app)
    email = f"loguser-{uuid4().hex[:8]}@example.com"

    register_response = client.post(
        "/auth/register",
        json={"name": "Log User", "email": email, "password": "Password123"},
    )
    assert register_response.status_code == 201

    login_response = client.post(
        "/auth/login",
        json={"name": "Log User", "email": email, "password": "Password123"},
    )
    assert login_response.status_code == 200
    cookie = login_response.headers.get("set-cookie", "")
    assert "access_token=" in cookie

    me_response = client.get("/auth/me", headers={"cookie": cookie})
    assert me_response.status_code == 200

    notifications_response = client.get("/notifications", headers={"cookie": cookie})
    assert notifications_response.status_code == 200
    data = notifications_response.json()
    assert isinstance(data, list)
    assert any(item.get("message") for item in data)

    activity_response = client.get("/activity-logs", headers={"cookie": cookie})
    assert activity_response.status_code == 200
    activity_data = activity_response.json()
    assert isinstance(activity_data, list)
    assert any(item.get("action") for item in activity_data)
