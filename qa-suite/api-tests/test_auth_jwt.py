from app.core import config
from app.core.security import create_access_token


QA_PASSWORD = "QaOnly-Password-42!"


def login(api_client, email, password=QA_PASSWORD):
    return api_client(
        "POST",
        "/api/v1/auth/login",
        data={"username": email, "password": password},
    )


def test_login_returns_bearer_token_and_public_user(api_client, user_factory):
    """Phase 1: TC-008."""
    user = user_factory("auth-login@example.com", department="Engineering")

    response = login(api_client, user.email)

    assert response.status_code == 200
    payload = response.json()
    assert payload["token_type"] == "bearer"
    assert payload["access_token"]
    assert payload["user"]["email"] == user.email
    assert payload["user"]["department"] == "Engineering"
    assert "hashed_password" not in payload["user"]


def test_login_rejects_wrong_password(api_client, user_factory):
    """Phase 1: TC-009."""
    user = user_factory("auth-wrong-password@example.com")

    response = login(api_client, user.email, password="Wrong-QA-Password")

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_current_user_requires_and_accepts_bearer_token(
    api_client, user_factory
):
    """Phase 1: TC-011 and TC-012."""
    user = user_factory("auth-current-user@example.com")

    missing_token = api_client("GET", "/api/v1/auth/me")
    assert missing_token.status_code == 401

    token_response = login(api_client, user.email)
    token = token_response.json()["access_token"]
    current_user = api_client(
        "GET",
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert current_user.status_code == 200
    assert current_user.json()["email"] == user.email


def test_current_user_rejects_invalid_token(api_client, user_factory):
    """Phase 1: TC-014."""
    user = user_factory("auth-invalid-token@example.com")
    token = create_access_token({"sub": user.email})
    header, payload, signature = token.split(".")
    replacement = "A" if signature[0] != "A" else "B"
    tampered_token = f"{header}.{payload}.{replacement}{signature[1:]}"

    response = api_client(
        "GET",
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {tampered_token}"},
    )

    assert response.status_code == 401


def test_current_user_rejects_expired_token(
    api_client, user_factory, monkeypatch
):
    """Phase 1: TC-013."""
    user = user_factory("auth-expired-token@example.com")
    monkeypatch.setattr(config.settings, "ACCESS_TOKEN_EXPIRE_MINUTES", -1)
    expired_token = create_access_token({"sub": user.email})

    response = api_client(
        "GET",
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {expired_token}"},
    )

    assert response.status_code == 401


def test_verify_token_reports_invalid_token(api_client):
    """Phase 1: TC-015."""
    response = api_client(
        "GET",
        "/api/v1/auth/verify-token/not-a-valid-token",
    )

    assert response.status_code == 200
    assert response.json() == {"message": "Invalid token"}


def test_signup_ignores_client_role_and_department(api_client):
    """Phase 1: TC-003."""
    response = api_client(
        "POST",
        "/api/v1/auth/signup",
        json={
            "email": "auth-signup@example.com",
            "full_name": "QA Signup User",
            "password": QA_PASSWORD,
            "department": "Engineering",
            "role": "admin",
        },
    )

    assert response.status_code == 200
    assert response.json()["email"] == "auth-signup@example.com"
    assert response.json()["department"] == "General"
    assert response.json()["role"] == "user"
    assert "password" not in response.json()


def test_signup_rejects_invalid_email(api_client):
    """Phase 1: TC-004."""
    response = api_client(
        "POST",
        "/api/v1/auth/signup",
        json={
            "email": "not-an-email",
            "full_name": "QA Signup User",
            "password": QA_PASSWORD,
        },
    )

    assert response.status_code == 422


def test_signup_rejects_missing_required_field(api_client):
    """Phase 1: TC-005."""
    response = api_client(
        "POST",
        "/api/v1/auth/signup",
        json={
            "email": "auth-missing-name@example.com",
            "password": QA_PASSWORD,
        },
    )

    assert response.status_code == 422


def test_signup_rejects_duplicate_email(api_client):
    """Phase 1: TC-006."""
    body = {
        "email": "auth-duplicate@example.com",
        "full_name": "QA Duplicate User",
        "password": QA_PASSWORD,
    }
    first = api_client("POST", "/api/v1/auth/signup", json=body)
    second = api_client("POST", "/api/v1/auth/signup", json=body)

    assert first.status_code == 200
    assert second.status_code == 400
    assert second.json()["detail"] == "Email already registered"


def test_login_rejects_json_instead_of_form_data(api_client, user_factory):
    """Phase 1: TC-010."""
    user = user_factory("auth-json-login@example.com")

    response = api_client(
        "POST",
        "/api/v1/auth/login",
        json={"username": user.email, "password": QA_PASSWORD},
    )

    assert response.status_code == 422
