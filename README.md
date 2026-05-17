# 🪔 Djinn — Omni-Platform AI Action Agent

> **You wish it. Djinn does it.** — The AI-powered automation platform for social media, GitHub governance, and team workflows.

Djinn is an intelligent agent that lets you upload images, generate AI-crafted captions, preview your post exactly as it will look on LinkedIn or X (Twitter), **edit everything before publishing**, and then publish with a single click via secure OAuth. No scheduling tools. No copy-paste. Pure automation.

---

## ✨ Features

### 🪄 Social AI Posting
- **Omni-Platform AI Agent** — Upload images, auto-generate captions, preview your post exactly as it will look on LinkedIn or X (Twitter).
- **Gemma 4 Local First** — Runs locally with Ollama (port 11434). Gracefully falls back to Claude 3.5 Sonnet if Gemma 4 is unavailable.
- **15 Djinn Topics** — Access customized AI workflows spanning across Presence, Opportunity, Growth, Spotlight, Oracle, Scholar, and more.
- **Waitlist System** — For unlaunched "Coming Soon" features, users can add themselves to a Supabase-backed waitlist directly from the UI.
- **Interactive Wish Preview** — Open your Magic Link to see the post preview. Hit **Edit Wish** to rewrite the caption, swap images, or regenerate AI content before publishing.
- **Dual Platform** — LinkedIn (Posts API v2 + UGC fallback) and X (Twitter) OAuth 2.0.

### 🐙 GitHub Integration
- **GitHub (Personal)** — One-click push wizard for individual developers
- **GitHub B2B** — Full Governance HQ: Team Network, member management, white-label portals, workflow blueprints, and compliance analytics
- **Security Guardian** — Scans every push for leaked API keys, secrets, and tokens before they land on GitHub

### ⚙️ Platform Architecture
- **Real-time AI Streaming** — Captions stream word-by-word as Gemini/OpenAI generates them
- **Persistent Storage** — Supabase with in-memory MOCK_DB fallback for local dev
- **Static File Serving** — Uploaded images exposed at `/uploads/` for preview rendering

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** — UI framework and dev server
- **Tailwind CSS** — Utility-first styling with custom Djinn design tokens
- **Framer Motion** — Smooth page transitions and micro-animations
- **Axios** — HTTP client for API calls
- **Lucide React** — Icon library

### Backend
- **FastAPI** — Modern async Python web framework
- **HTTPX** — Async HTTP client for LinkedIn/X/GitHub APIs
- **Local AI** — Ollama Integration (Gemma 4 model)
- **Cloud AI Fallback** — Claude 3.5 Sonnet & OpenAI fallback engines
- **Pydantic** — Request/response data validation
- **Supabase** — Cloud persistence layer
- **PyGitHub** — GitHub API v3

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- At least one AI API key (Gemini or OpenAI)
- OAuth credentials for LinkedIn and/or X

### 1. Clone & Install

```bash
git clone https://github.com/annujjguptaa-cpu/Djinn---AI-Action-Agent.git
cd Djinn
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # Fill in your keys
python -m uvicorn main:app --reload
# → http://127.0.0.1:8000
# → API Docs: http://127.0.0.1:8000/docs
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## 📁 Project Structure

```
Djinn/
├── backend/
│   ├── main.py                  # FastAPI app + static file serving
│   ├── models.py                # Pydantic request/response models
│   ├── settings.py              # Environment config
│   ├── db.py                    # In-memory wish store
│   ├── db_supabase.py           # Supabase persistence layer
│   ├── routers/
│   │   ├── post.py              # AI caption engine + LinkedIn/X publish
│   │   ├── connect.py           # Auto-connect workflow
│   │   ├── auth.py              # LinkedIn OAuth
│   │   ├── x_auth.py            # X (Twitter) OAuth
│   │   ├── github.py            # GitHub OAuth + push router
│   │   └── workflow.py          # B2B workflow + white-label portals
│   ├── services/
│   │   ├── guardian.py          # Secret scanner (pre-push security)
│   │   ├── ai_engine.py         # LLM orchestrator
│   │   ├── ai_readme.py         # AI README generator
│   │   └── github_service.py    # GitHub API wrapper
│   └── uploads/                 # Served at /uploads/* (static)
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Home.jsx              # Platform command hub
        │   ├── AutoPost.jsx          # AI Social Post Creator
        │   ├── WishPage.jsx          # Interactive Magic Link preview + editor
        │   ├── AutoConnect.jsx       # LinkedIn auto-connect
        │   ├── GitHubDashboard.jsx   # B2B Governance HQ
        │   ├── PersonalPushView.jsx  # GitHub Personal Push Wizard
        │   ├── WhiteLabelPortal.jsx  # External contributor portal
        │   └── WorkflowBuilder.jsx   # B2B Blueprint creator
        └── components/
            ├── SocialPreview.jsx     # Live LinkedIn/X post preview
            ├── Navbar.jsx            # Navigation
            └── PageWrapper.jsx       # Layout wrapper
```

---

## ✨ Pages & Routes

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Platform overview and feature cards |
| **Auto Post** | `/auto-post` | Upload images → AI caption → Magic Link |
| **Wish Preview** | `/wish/:id` | Interactive preview — edit, regenerate, grant |
| **Auto Connect** | `/auto-connect` | LinkedIn connection automation |
| **GitHub** | `/github-personal` | Personal push wizard |
| **GitHub B2B** | `/github-dashboard` | Team governance HQ |
| **Workflow Builder** | `/workflow-builder` | B2B blueprint creator |
| **White-Label Portal** | `/share/:id` | External contributor submission |

---

## 🔌 API Endpoints

### Social Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/post/upload` | Upload images (returns filenames) |
| `POST` | `/api/post/stream` | Stream AI caption (SSE) |
| `POST` | `/api/post/create` | Save wish → returns Magic Link ID |
| `GET` | `/api/post/{wish_id}` | Fetch wish data |
| `PUT` | `/api/post/{wish_id}` | Update caption/images before publishing |
| `POST` | `/api/post/execute/{wish_id}` | Publish to LinkedIn or X |
| `GET` | `/uploads/{filename}` | Serve uploaded image files |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/auth/linkedin/login` | LinkedIn OAuth redirect |
| `GET` | `/api/auth/linkedin/callback` | LinkedIn OAuth callback |
| `GET` | `/api/auth/x/login` | X OAuth redirect |
| `GET` | `/api/auth/x/callback` | X OAuth callback |
| `GET` | `/api/auth/github/login` | GitHub OAuth redirect |
| `GET` | `/api/auth/github/callback` | GitHub OAuth callback |

---

## 🎯 The Wish Workflow

```
1. Open Auto Post
2. Choose platform (LinkedIn or X)
3. Enter context (optional — "My new product launch")
4. Upload images (optional — up to 6)
5. Djinn streams an AI-written caption
6. Click "Summon Your Djinn" → get a Magic Link
7. Open the Magic Link to see the live preview
8. Hit "✏️ Edit Wish" to change caption, swap images, or regenerate
9. Click "Grant" → OAuth login → post published instantly
```

---

## 🔐 OAuth Setup

### LinkedIn
1. Go to [developer.linkedin.com](https://developer.linkedin.com)
2. Create an app, navigate to **Auth** → **OAuth 2.0 Settings**
3. Add redirect URI: `http://localhost:8000/api/auth/linkedin/callback`
4. Required scopes: `openid`, `profile`, `email`, `w_member_social`
5. Copy Client ID and Secret to `.env`

### X (Twitter)
1. Go to [developer.twitter.com](https://developer.twitter.com)
2. Create an app with **OAuth 2.0** enabled (PKCE)
3. Callback URL: `http://127.0.0.1:8000/api/auth/x/callback`
4. Copy Client ID and Secret to `.env`

### GitHub
1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Create an OAuth App
3. Callback URL: `http://localhost:8000/api/auth/github/callback`
4. Copy Client ID and Secret to `.env`

---

## 🔑 Environment Variables

```env
# AI Models (at least one required)
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:8000/api/auth/linkedin/callback

# X (Twitter) OAuth
X_CLIENT_ID=your_x_client_id
X_CLIENT_SECRET=your_x_client_secret
X_REDIRECT_URI=http://127.0.0.1:8000/api/auth/x/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:8000/api/auth/github/callback

# Supabase (optional — uses in-memory DB if not set)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# App
APP_ENV=development
FRONTEND_URL=http://localhost:5173
ENCRYPTION_KEY=your_32_byte_fernet_key
```

---

## 📝 License

MIT License — see LICENSE file for details.

---

**You wish it. Djinn does it.** 🪔🚀
