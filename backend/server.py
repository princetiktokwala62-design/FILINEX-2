"""FILINEX backend - leads, newsletter, blog, admin, AI brief assistant.

Designed to run on:
  - Local supervisor (uvicorn server:app --host 0.0.0.0 --port 8001)
  - Vercel serverless (via /api/index.py importing this module's `app`)
"""
from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import jwt as pyjwt
from pathlib import Path
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

JWT_SECRET = os.environ.get("JWT_SECRET", "filinex-dev-secret-change-me")
JWT_ALG = "HS256"
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@filinex.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "password")
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")

security = HTTPBearer(auto_error=False)


# ---------------------- Helpers ----------------------
def utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def new_id() -> str:
    return str(uuid.uuid4())


def make_token(email: str) -> str:
    payload = {
        "sub": email,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
    }
    return pyjwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


async def require_admin(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> str:
    if not creds:
        raise HTTPException(status_code=401, detail="Missing auth token")
    try:
        payload = pyjwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALG])
        return payload.get("sub")
    except pyjwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# ---------------------- Models ----------------------
class LeadCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    country: Optional[str] = None
    budget: Optional[str] = None
    project_type: Optional[str] = None
    message: Optional[str] = None
    source: Optional[str] = "contact"
    estimator_data: Optional[dict] = None
    brief_transcript: Optional[List[dict]] = None


class Lead(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    country: Optional[str] = None
    budget: Optional[str] = None
    project_type: Optional[str] = None
    message: Optional[str] = None
    source: str = "contact"
    status: str = "new"
    meeting_date: Optional[str] = None
    notes: Optional[str] = None
    estimator_data: Optional[dict] = None
    brief_transcript: Optional[List[dict]] = None
    created_at: str
    updated_at: str


class LeadUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    meeting_date: Optional[str] = None


class NewsletterCreate(BaseModel):
    email: EmailStr


class NewsletterEntry(BaseModel):
    id: str
    email: str
    created_at: str


class AdminLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    token: str
    email: str


class BlogPost(BaseModel):
    id: str
    slug: str
    title: str
    excerpt: str
    content: str
    category: str
    tags: List[str] = []
    author: str = "FILINEX Team"
    cover_image: Optional[str] = None
    reading_time: int = 5
    featured: bool = False
    published: bool = True
    created_at: str
    updated_at: str


class BlogPostCreate(BaseModel):
    slug: str
    title: str
    excerpt: str
    content: str
    category: str
    tags: List[str] = []
    cover_image: Optional[str] = None
    reading_time: int = 5
    featured: bool = False
    published: bool = True


class BriefMessage(BaseModel):
    role: str  # 'user' | 'assistant'
    content: str


class BriefChatRequest(BaseModel):
    session_id: str
    messages: List[BriefMessage]


class BriefChatResponse(BaseModel):
    reply: str
    finished: bool = False


# ---------------------- App + Lifespan ----------------------
DEFAULT_POSTS = [
    {
        "slug": "the-rise-of-ai-native-saas",
        "title": "The Rise of AI-Native SaaS: Architectures for 2026",
        "excerpt": "How AI-first products are rewriting SaaS economics, retention, and pricing.",
        "category": "AI",
        "tags": ["AI", "SaaS", "Architecture"],
        "cover_image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80",
        "reading_time": 8,
        "featured": True,
        "published": True,
        "content": "# The Rise of AI-Native SaaS\n\nFor the past decade SaaS architecture has been defined by predictable patterns: multi-tenant databases, REST APIs, queue workers, and dashboards. In 2026 a new generation of products is emerging that we call **AI-native SaaS** — software where intelligence is not a bolt-on feature, but the operating system of the product itself.\n\n## What changes\n\n- **Pricing**: from per-seat to per-outcome.\n- **Onboarding**: from forms to conversation.\n- **Retention**: from feature breadth to compounding personal context.\n\n## A reference architecture\n\nAt FILINEX we deploy AI-native systems with four layers: a streaming event spine, a retrieval graph, a planner-executor loop, and a deterministic safety rail.\n",
    },
    {
        "slug": "building-cinematic-product-launches",
        "title": "Building Cinematic Product Launches the Apple Way",
        "excerpt": "Frame pacing, motion design, and the principles behind unforgettable launches.",
        "category": "Design",
        "tags": ["Design", "Motion", "Branding"],
        "cover_image": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80",
        "reading_time": 6,
        "featured": True,
        "published": True,
        "content": "# Cinematic Launches\n\nA launch page is not a brochure — it is a film. Pacing, restraint, and contrast carry far more weight than copy.\n",
    },
    {
        "slug": "web3-without-the-hype",
        "title": "Web3 Without the Hype: Real Use Cases that Ship Revenue",
        "excerpt": "Where blockchain delivers measurable ROI today — outside of speculation.",
        "category": "Blockchain",
        "tags": ["Web3", "Blockchain"],
        "cover_image": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1600&q=80",
        "reading_time": 7,
        "featured": False,
        "published": True,
        "content": "# Web3 Without the Hype\n\nWe ship Web3 systems only when they solve a real coordination problem.\n",
    },
    {
        "slug": "the-enterprise-automation-stack",
        "title": "The Modern Enterprise Automation Stack",
        "excerpt": "Beyond RPA: how event-driven automation collapses operational cost.",
        "category": "Automation",
        "tags": ["Automation", "Enterprise"],
        "cover_image": "https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=1600&q=80",
        "reading_time": 9,
        "featured": False,
        "published": True,
        "content": "# Enterprise Automation\n\nRPA is dead. The new stack is event-driven, LLM-mediated, and observability-first.\n",
    },
    {
        "slug": "from-zero-to-product-six-week-sprint",
        "title": "From Zero to Product in a Six-Week Sprint",
        "excerpt": "The FILINEX sprint methodology that ships production-grade MVPs in 42 days.",
        "category": "Process",
        "tags": ["Process", "MVP"],
        "cover_image": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&q=80",
        "reading_time": 5,
        "featured": False,
        "published": True,
        "content": "# Six-Week Sprint\n\nWeek by week breakdown of how we go from blank canvas to revenue-ready product.\n",
    },
]


async def seed_if_needed():
    try:
        count = await db.blog_posts.count_documents({})
        if count == 0:
            now = utcnow_iso()
            docs = []
            for p in DEFAULT_POSTS:
                docs.append({
                    **p,
                    "id": new_id(),
                    "author": "FILINEX Team",
                    "created_at": now,
                    "updated_at": now,
                })
            await db.blog_posts.insert_many(docs)
            logger.info("Seeded default blog posts.")
    except Exception as exc:
        logger.warning(f"Seed skipped: {exc}")


@asynccontextmanager
async def lifespan(_app: FastAPI):
    await seed_if_needed()
    logger.info(f"FILINEX backend ready. Admin: {ADMIN_EMAIL}")
    yield


app = FastAPI(title="FILINEX API", version="1.1", lifespan=lifespan)
api_router = APIRouter(prefix="/api")


# ---------------------- Routes ----------------------
@api_router.get("/")
async def root():
    return {"name": "FILINEX API", "status": "operational", "version": "1.1"}


@api_router.get("/health")
async def health():
    # Trigger seed lazily for serverless cold starts
    await seed_if_needed()
    return {"ok": True, "ts": utcnow_iso()}


# ----- Leads -----
@api_router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate):
    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["status"] = "new"
    doc["created_at"] = utcnow_iso()
    doc["updated_at"] = doc["created_at"]
    doc.setdefault("source", "contact")
    await db.leads.insert_one(doc)
    doc.pop("_id", None)
    return Lead(**doc)


@api_router.get("/leads", response_model=List[Lead])
async def list_leads(_: str = Depends(require_admin)):
    cursor = db.leads.find({}, {"_id": 0}).sort("created_at", -1)
    items = await cursor.to_list(length=1000)
    return [Lead(**i) for i in items]


@api_router.get("/leads/stats")
async def leads_stats(_: str = Depends(require_admin)):
    statuses = ["new", "qualified", "meeting_scheduled", "proposal_sent", "won", "lost"]
    counts = {s: await db.leads.count_documents({"status": s}) for s in statuses}
    counts["total"] = await db.leads.count_documents({})
    return counts


@api_router.patch("/leads/{lead_id}", response_model=Lead)
async def update_lead(lead_id: str, payload: LeadUpdate, _: str = Depends(require_admin)):
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update:
        raise HTTPException(status_code=400, detail="No fields to update")
    update["updated_at"] = utcnow_iso()
    result = await db.leads.find_one_and_update(
        {"id": lead_id},
        {"$set": update},
        return_document=True,
        projection={"_id": 0},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Lead not found")
    return Lead(**result)


@api_router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: str, _: str = Depends(require_admin)):
    res = await db.leads.delete_one({"id": lead_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"ok": True}


# ----- Newsletter -----
@api_router.post("/newsletter", response_model=NewsletterEntry)
async def newsletter_subscribe(payload: NewsletterCreate):
    existing = await db.newsletter.find_one({"email": payload.email}, {"_id": 0})
    if existing:
        return NewsletterEntry(**existing)
    doc = {"id": new_id(), "email": payload.email, "created_at": utcnow_iso()}
    await db.newsletter.insert_one(doc)
    doc.pop("_id", None)
    return NewsletterEntry(**doc)


@api_router.get("/newsletter", response_model=List[NewsletterEntry])
async def list_newsletter(_: str = Depends(require_admin)):
    items = await db.newsletter.find({}, {"_id": 0}).sort("created_at", -1).to_list(2000)
    return [NewsletterEntry(**i) for i in items]


# ----- Admin Auth -----
@api_router.post("/admin/login", response_model=TokenResponse)
async def admin_login(payload: AdminLogin):
    if payload.email.lower() != ADMIN_EMAIL.lower() or payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return TokenResponse(token=make_token(payload.email), email=payload.email)


@api_router.get("/admin/me")
async def admin_me(email: str = Depends(require_admin)):
    return {"email": email}


# ----- Blog -----
@api_router.get("/blog/posts", response_model=List[BlogPost])
async def list_posts(category: Optional[str] = None, q: Optional[str] = None):
    query = {"published": True}
    if category:
        query["category"] = category
    if q:
        query["$or"] = [
            {"title": {"$regex": q, "$options": "i"}},
            {"excerpt": {"$regex": q, "$options": "i"}},
        ]
    cursor = db.blog_posts.find(query, {"_id": 0}).sort("created_at", -1)
    items = await cursor.to_list(200)
    return [BlogPost(**i) for i in items]


@api_router.get("/blog/posts/{slug}", response_model=BlogPost)
async def get_post(slug: str):
    doc = await db.blog_posts.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Post not found")
    return BlogPost(**doc)


@api_router.post("/blog/posts", response_model=BlogPost)
async def create_post(payload: BlogPostCreate, _: str = Depends(require_admin)):
    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["author"] = "FILINEX Team"
    doc["created_at"] = utcnow_iso()
    doc["updated_at"] = doc["created_at"]
    await db.blog_posts.insert_one(doc)
    doc.pop("_id", None)
    return BlogPost(**doc)


# ----- Public Stats -----
@api_router.get("/stats")
async def public_stats():
    leads = await db.leads.count_documents({})
    subs = await db.newsletter.count_documents({})
    return {
        "projects_delivered": 187 + leads,
        "countries_served": 34,
        "client_satisfaction": 98,
        "technologies_mastered": 42,
        "newsletter_subscribers": subs,
    }


# ----- AI Brief Assistant -----
BRIEF_SYSTEM = (
    "You are FILINEX BriefBot, a senior solutions architect who interviews prospects to scope premium software projects. "
    "FILINEX is a luxury technology studio that builds AI, SaaS, web, blockchain, automation and enterprise systems. "
    "Your job: conduct a short, professional conversation (4-6 turns max) to understand the prospect's project so a senior partner can follow up. "
    "Rules: "
    "1. Open with a warm one-line greeting and ONE focused first question (project type or problem they want to solve). "
    "2. Ask ONLY ONE question per message. Keep messages under 50 words. "
    "3. Cover (in any order): project type/idea, target users, must-have features, timeline, budget range, contact name+email. "
    "4. NEVER ask for sensitive data (passwords, credit cards, IDs). "
    "5. When you have enough information (typically after 4-5 user replies) end with a SUMMARY in this exact format and append the literal token [BRIEF_COMPLETE] on the LAST line: "
    "Project: <one-line>\nTarget users: <one-line>\nKey features: <bullets joined with •>\nTimeline: <text>\nBudget: <text>\nContact: <name, email>\n[BRIEF_COMPLETE] "
    "6. Be warm, decisive, and never sycophantic. Sound like a senior consultant from Apple/Stripe."
)


@api_router.post("/brief/chat", response_model=BriefChatResponse)
async def brief_chat(payload: BriefChatRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=503, detail="LLM key not configured")
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"LLM library unavailable: {exc}")

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=payload.session_id,
        system_message=BRIEF_SYSTEM,
    ).with_model("openai", "gpt-5.4")

    # Replay user history except the last user msg (the library manages session_id-based history in some flows,
    # but for stateless serverless we replay all user messages this call). Simplest: send last user msg only.
    last_user = next((m for m in reversed(payload.messages) if m.role == "user"), None)
    if last_user is None:
        # Initial open — bootstrap with a system-aware greeting trigger
        last_user_text = "[START_CONVERSATION]"
    else:
        # Replay full thread as a single contextual message so model has memory in stateless mode
        thread = []
        for m in payload.messages:
            thread.append(f"{m.role.upper()}: {m.content}")
        last_user_text = "Conversation so far:\n" + "\n".join(thread) + "\n\nWrite ONLY your next assistant message (one short message, follow the rules)."

    try:
        reply = await chat.send_message(UserMessage(text=last_user_text))
    except Exception as exc:
        logger.error(f"LLM error: {exc}")
        raise HTTPException(status_code=502, detail="Assistant temporarily unavailable")

    text = (reply or "").strip()
    finished = "[BRIEF_COMPLETE]" in text
    text = text.replace("[BRIEF_COMPLETE]", "").strip()

    # Persist transcript fragment (optional, lightweight)
    try:
        await db.brief_sessions.update_one(
            {"session_id": payload.session_id},
            {"$set": {"updated_at": utcnow_iso()}, "$setOnInsert": {"created_at": utcnow_iso()}},
            upsert=True,
        )
    except Exception:
        pass

    return BriefChatResponse(reply=text, finished=finished)


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)
