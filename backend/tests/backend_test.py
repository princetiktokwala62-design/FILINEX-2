"""FILINEX backend API tests - leads, newsletter, blog, admin, stats."""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://e17ee658-09e0-4de0-a9ac-59df5558a6ae.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = "admin@filinex.com"
ADMIN_PASSWORD = "password"
OLD_ADMIN_PASSWORD = "Filinex@2026"


@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(api):
    r = api.post(f"{BASE_URL}/api/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    if r.status_code != 200:
        pytest.skip(f"Admin login failed: {r.status_code} {r.text}")
    return r.json()["token"]


@pytest.fixture(scope="session")
def admin_client(api, admin_token):
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json", "Authorization": f"Bearer {admin_token}"})
    return s


# ---------- Health / Root ----------
class TestHealth:
    def test_health(self, api):
        r = api.get(f"{BASE_URL}/api/health")
        assert r.status_code == 200
        body = r.json()
        assert body.get("ok") is True
        assert "ts" in body

    def test_root(self, api):
        r = api.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        assert r.json().get("status") == "operational"


# ---------- Admin Auth ----------
class TestAdminAuth:
    def test_login_success(self, api):
        r = api.post(f"{BASE_URL}/api/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        assert "token" in data and isinstance(data["token"], str) and len(data["token"]) > 20
        assert data["email"].lower() == ADMIN_EMAIL.lower()

    def test_login_invalid(self, api):
        r = api.post(f"{BASE_URL}/api/admin/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_admin_me_requires_token(self, api):
        r = api.get(f"{BASE_URL}/api/admin/me")
        assert r.status_code == 401

    def test_admin_me_ok(self, admin_client):
        r = admin_client.get(f"{BASE_URL}/api/admin/me")
        assert r.status_code == 200
        assert r.json()["email"].lower() == ADMIN_EMAIL.lower()


# ---------- Leads CRUD ----------
class TestLeads:
    def test_create_lead_contact(self, api):
        payload = {
            "name": "TEST_Lead Contact",
            "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
            "phone": "+1-555-0100",
            "company": "Acme",
            "message": "Hi, interested in your services.",
            "source": "contact",
        }
        r = api.post(f"{BASE_URL}/api/leads", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["status"] == "new"
        assert data["source"] == "contact"
        assert "id" in data and len(data["id"]) > 0
        assert "_id" not in data

    def test_create_lead_estimator(self, api):
        payload = {
            "name": "TEST_Estimator",
            "email": f"est_{uuid.uuid4().hex[:8]}@example.com",
            "source": "estimator",
            "estimator_data": {"type": "saas", "complexity": "high", "estimate": "$80k-$120k"},
        }
        r = api.post(f"{BASE_URL}/api/leads", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["source"] == "estimator"
        assert d["estimator_data"]["type"] == "saas"

    def test_create_lead_invalid_email(self, api):
        r = api.post(f"{BASE_URL}/api/leads", json={"name": "X", "email": "not-an-email"})
        assert r.status_code == 422

    def test_list_leads_requires_admin(self, api):
        r = api.get(f"{BASE_URL}/api/leads")
        assert r.status_code == 401

    def test_full_lead_lifecycle(self, api, admin_client):
        # CREATE
        payload = {
            "name": "TEST_Lifecycle",
            "email": f"life_{uuid.uuid4().hex[:8]}@example.com",
            "source": "contact",
            "message": "lifecycle test",
        }
        r = api.post(f"{BASE_URL}/api/leads", json=payload)
        assert r.status_code == 200
        lead_id = r.json()["id"]

        # LIST contains created
        r = admin_client.get(f"{BASE_URL}/api/leads")
        assert r.status_code == 200
        ids = [x["id"] for x in r.json()]
        assert lead_id in ids

        # PATCH status
        r = admin_client.patch(
            f"{BASE_URL}/api/leads/{lead_id}",
            json={"status": "qualified", "notes": "Promising"},
        )
        assert r.status_code == 200, r.text
        upd = r.json()
        assert upd["status"] == "qualified"
        assert upd["notes"] == "Promising"

        # PATCH empty body -> 400
        r = admin_client.patch(f"{BASE_URL}/api/leads/{lead_id}", json={})
        assert r.status_code == 400

        # DELETE
        r = admin_client.delete(f"{BASE_URL}/api/leads/{lead_id}")
        assert r.status_code == 200
        assert r.json().get("ok") is True

        # DELETE again -> 404
        r = admin_client.delete(f"{BASE_URL}/api/leads/{lead_id}")
        assert r.status_code == 404

    def test_leads_stats(self, admin_client):
        r = admin_client.get(f"{BASE_URL}/api/leads/stats")
        assert r.status_code == 200
        data = r.json()
        for k in ["new", "qualified", "meeting_scheduled", "proposal_sent", "won", "lost", "total"]:
            assert k in data
            assert isinstance(data[k], int)


# ---------- Newsletter ----------
class TestNewsletter:
    def test_subscribe_and_idempotent(self, api):
        email = f"nl_{uuid.uuid4().hex[:8]}@example.com"
        r1 = api.post(f"{BASE_URL}/api/newsletter", json={"email": email})
        assert r1.status_code == 200, r1.text
        assert r1.json()["email"] == email
        # Idempotent — second submit returns existing entry
        r2 = api.post(f"{BASE_URL}/api/newsletter", json={"email": email})
        assert r2.status_code == 200
        assert r2.json()["id"] == r1.json()["id"]

    def test_subscribe_invalid(self, api):
        r = api.post(f"{BASE_URL}/api/newsletter", json={"email": "bad"})
        assert r.status_code == 422

    def test_list_requires_admin(self, api):
        r = api.get(f"{BASE_URL}/api/newsletter")
        assert r.status_code == 401

    def test_list_as_admin(self, admin_client):
        r = admin_client.get(f"{BASE_URL}/api/newsletter")
        assert r.status_code == 200
        assert isinstance(r.json(), list)


# ---------- Blog ----------
class TestBlog:
    def test_list_posts(self, api):
        r = api.get(f"{BASE_URL}/api/blog/posts")
        assert r.status_code == 200
        posts = r.json()
        assert isinstance(posts, list)
        assert len(posts) >= 5, f"Expected at least 5 seeded posts, got {len(posts)}"
        for p in posts:
            assert "slug" in p and "title" in p and "content" in p

    def test_get_single_post(self, api):
        # Fetch list, then verify get by slug
        r = api.get(f"{BASE_URL}/api/blog/posts")
        posts = r.json()
        slug = posts[0]["slug"]
        r2 = api.get(f"{BASE_URL}/api/blog/posts/{slug}")
        assert r2.status_code == 200
        assert r2.json()["slug"] == slug

    def test_get_missing_post(self, api):
        r = api.get(f"{BASE_URL}/api/blog/posts/this-does-not-exist-xyz")
        assert r.status_code == 404

    def test_filter_category(self, api):
        r = api.get(f"{BASE_URL}/api/blog/posts", params={"category": "AI"})
        assert r.status_code == 200
        for p in r.json():
            assert p["category"] == "AI"

    def test_create_post_requires_admin(self, api):
        r = api.post(f"{BASE_URL}/api/blog/posts", json={
            "slug": "x", "title": "x", "excerpt": "x", "content": "x", "category": "x"
        })
        assert r.status_code == 401


# ---------- Public Stats ----------
class TestStats:
    def test_stats(self, api):
        r = api.get(f"{BASE_URL}/api/stats")
        assert r.status_code == 200
        d = r.json()
        for k in ["projects_delivered", "countries_served", "client_satisfaction", "technologies_mastered", "newsletter_subscribers"]:
            assert k in d
        assert d["projects_delivered"] >= 187
        assert d["countries_served"] == 34
        assert d["client_satisfaction"] == 98
        assert d["technologies_mastered"] == 42


# ---------- Admin password rotation (new in iter 2) ----------
class TestAdminPasswordRotation:
    def test_old_password_rejected(self, api):
        r = api.post(f"{BASE_URL}/api/admin/login", json={"email": ADMIN_EMAIL, "password": OLD_ADMIN_PASSWORD})
        assert r.status_code == 401, f"Old password 'Filinex@2026' should no longer work, got {r.status_code}"

    def test_new_password_works(self, api):
        r = api.post(f"{BASE_URL}/api/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        assert "token" in r.json()


# ---------- AI Brief Assistant (new endpoint) ----------
class TestBriefChat:
    def test_brief_greeting_empty_messages(self, api):
        session_id = f"test-{uuid.uuid4().hex[:10]}"
        r = api.post(
            f"{BASE_URL}/api/brief/chat",
            json={"session_id": session_id, "messages": []},
            timeout=60,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert "reply" in data and isinstance(data["reply"], str)
        assert len(data["reply"]) > 0, "Greeting should be non-empty"
        assert data.get("finished") is False

    def test_brief_continues_conversation(self, api):
        session_id = f"test-{uuid.uuid4().hex[:10]}"
        # 1. greeting
        r1 = api.post(
            f"{BASE_URL}/api/brief/chat",
            json={"session_id": session_id, "messages": []},
            timeout=60,
        )
        assert r1.status_code == 200
        greeting = r1.json()["reply"]
        # 2. user reply
        msgs = [
            {"role": "assistant", "content": greeting},
            {"role": "user", "content": "I want to build an AI-powered fintech SaaS for SMB invoicing."},
        ]
        r2 = api.post(
            f"{BASE_URL}/api/brief/chat",
            json={"session_id": session_id, "messages": msgs},
            timeout=60,
        )
        assert r2.status_code == 200, r2.text
        data = r2.json()
        assert isinstance(data["reply"], str) and len(data["reply"]) > 0
        # Should not echo "[BRIEF_COMPLETE]" verbatim — backend strips that token
        assert "[BRIEF_COMPLETE]" not in data["reply"]

    def test_brief_lead_with_ai_brief_source(self, api):
        """Final brief submit creates lead with source='ai_brief' and brief_transcript."""
        payload = {
            "name": "TEST_AI_Brief",
            "email": f"brief_{uuid.uuid4().hex[:8]}@example.com",
            "source": "ai_brief",
            "message": "AI brief summary line",
            "brief_transcript": [
                {"role": "assistant", "content": "Hi!"},
                {"role": "user", "content": "I want a SaaS."},
            ],
        }
        r = api.post(f"{BASE_URL}/api/leads", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["source"] == "ai_brief"
        assert isinstance(data.get("brief_transcript"), list)
        assert len(data["brief_transcript"]) == 2

