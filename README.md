# 🪔 Djinn - Omni-Platform AI Action Agent

> **You wish it. Djinn does it.** — Automated AI-powered posting to LinkedIn and X (Twitter)

Djinn is an intelligent agent that transforms images into engaging social media posts with AI-generated captions, then automatically publishes them to LinkedIn and X platforms using secure OAuth authentication.

## ✨ Features

- 🤖 **AI Caption Generation** - Google Gemini or OpenAI integration for intelligent post creation
- 📱 **Dual Platform Support** - LinkedIn & X (Twitter) OAuth 2.0 integration
- 🚀 **Unified GitHub Hub** - Combined B2C (Summoner) and B2B (Governance) repository command center
- 🛡️ **Security Guardian** - Post-processing engine that hard-blocks pushes containing leaked API keys or secrets
- 👥 **Team Network HQ** - Persistent member management and execution oversight for engineering leads
- 🔗 **Magic Link Registry** - Generate and manage secure, branded project portals for external contributors
- 🎨 **Social Preview** - See exactly how your post will look across platforms
- ⚡ **Real-time Analytics** - Tracking deployment velocity and team submission compliance

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend

- **FastAPI** - Modern Python web framework
- **PyGitHub** - GitHub API v3 integration
- **Pydantic** - Data validation
- **HTTPX** - Async HTTP client
- **cryptography** - Fernet encryption for secure token storage
- **recharts** - High-velocity data visualization for B2B analytics
- **google-generativeai** - Gemini AI integration

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 16+
- Git
- API Keys: Google Gemini or OpenAI (at least one)
- OAuth Credentials: LinkedIn & X Developer Accounts

### Frontend (React + Vite + Tailwind)

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5174
```

### Backend (Python FastAPI)

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000
# → API docs at http://127.0.0.1:8000/docs
```

---

## 📁 Project Structure

```
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── db_supabase.py          # Supabase & Persistence layer
│   ├── routers/
│   │   ├── github.py          # Unified B2C/B2B repository logic
│   │   ├── workflow.py        # Template & White-label management
│   │   ├── auth.py            # Platform authentication
│   │   └── post.py            # AI social posting engine
│   ├── services/
│   │   ├── guardian.py        # Security secret scanner
│   │   ├── ai_readme.py       # AI documentation generator
│   │   └── ai_engine.py       # Core LLM orchestrator
│   └── migrations/            # SQL structural updates
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── GitHubDashboard.jsx  # Governance & Analytics HQ
│   │   │   ├── PersonalPushView.jsx # One-click magic wizard
│   │   │   ├── WhiteLabelPortal.jsx # Branded recipient entry
│   │   │   └── WorkflowBuilder.jsx # B2B Blueprint creator
│   │   ├── assets/
│   │   └── styles/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── .env                       # Environment variables (git ignored)
├── .gitignore
└── README.md
```

---

## ✨ Pages & Routes

| Page             | Route           | Description                                            |
| ---------------- | --------------- | ------------------------------------------------------ |
| **Home**         | `/`             | Djinn hero + feature overview                          |
| **GitHub Hub**   | `/github-dashboard`| Unified B2C Push + B2B Governance Command Center    |
| **Workflow Build**| `/workflow-builder`| Admin blueprint & branding creator                  |
| **White-Label**  | `/share/:id`    | External project submission portal                      |
| **Auto Post**    | `/auto-post`    | AI caption → platform preview → publish                |

## 🔌 API Endpoints

### Posts

- `POST /api/post/upload` - Upload images
- `POST /api/post/stream` - Stream caption generation
- `POST /api/post/create` - Create a post wish
- `GET /api/post/{wish_id}` - Get post details
- `POST /api/post/execute/{wish_id}` - Execute and publish post

### Authentication

- `GET /api/auth/linkedin` - LinkedIn OAuth redirect
- `GET /api/auth/linkedin/callback` - LinkedIn OAuth callback
- `GET /api/auth/x/login` - X OAuth redirect
- `GET /api/auth/x/callback` - X OAuth callback

## 🔐 OAuth Setup

### LinkedIn

1. Go to [developer.linkedin.com](https://developer.linkedin.com)
2. Create an application
3. Navigate to **Auth** → **OAuth 2.0 settings**
4. Add Redirect URI: `http://localhost:8000/api/auth/linkedin/callback`
5. Copy Client ID and Secret to `.env`

### X (Twitter)

1. Go to [developer.twitter.com](https://developer.twitter.com)
2. Create an application with OAuth 2.0 enabled
3. In **App Settings** → **Authentication settings**
4. Add Callback URL: `http://127.0.0.1:8000/api/auth/x/callback`
5. Copy Client ID and Secret to `.env`

## 🔑 Environment Variables

Copy `.env` template:

```env
# AI Models (at least one required)
GEMINI_API_KEY=your_key_from_makersuite.google.com
OPENAI_API_KEY=your_key_from_platform.openai.com

# LinkedIn
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_secret
LINKEDIN_REDIRECT_URI=http://localhost:8000/api/auth/linkedin/callback

# X (Twitter)
X_CLIENT_ID=your_x_client_id
X_CLIENT_SECRET=your_x_secret
X_REDIRECT_URI=http://127.0.0.1:8000/api/auth/x/callback

# GitHub B2B
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_secret
GITHUB_REDIRECT_URI=http://localhost:8000/api/auth/github/callback

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# Server
APP_ENV=production
FRONTEND_URL=http://localhost:5173
```

## 🎯 Workflow

1. **Upload Image** → Send to `/api/post/upload`
2. **Generate Caption** → Stream AI caption via `/api/post/stream`
3. **Create Wish** → Save post configuration to `/api/post/create`
4. **Preview** → See how post looks on LinkedIn/X
5. **Grant Wish** → Authenticate via OAuth
6. **Execute** → Publish to chosen platform(s)

## 📝 License

MIT License - see LICENSE file for details

---

**Ready to automate your social media?** 🚀 Get started now!
