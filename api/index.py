"""Vercel Python serverless entry-point.

Vercel will route every request matching `/api/*` to this file because of
`vercel.json -> rewrites: /api/(.*) -> /api/index.py`.

We import the FastAPI `app` from `/backend/server.py` and expose it as the ASGI
callable. Vercel's Python runtime auto-detects ASGI apps.
"""
import os
import sys

# Allow importing from /backend/ when deployed
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND = os.path.join(ROOT, "backend")
if BACKEND not in sys.path:
    sys.path.insert(0, BACKEND)

from server import app  # noqa: E402  (FastAPI ASGI instance)
