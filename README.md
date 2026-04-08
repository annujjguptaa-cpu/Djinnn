# 🪔 Djinn - Omni-Platform AI Action Agent

> **You wish it. Djinn does it.** — Automated AI-powered posting to LinkedIn and X (Twitter)

Djinn is an intelligent agent that transforms images into engaging social media posts with AI-generated captions, then automatically publishes them to LinkedIn and X platforms using secure OAuth authentication.

## ✨ Features

- 🤖 **AI Caption Generation** - Google Gemini or OpenAI integration for intelligent post creation
- 📱 **Dual Platform Support** - LinkedIn & X (Twitter) OAuth 2.0 integration
- 🖼️ **Smart Image Processing** - Automatic optimization and upload handling
- 💾 **Persistent Wish Storage** - Save drafts and wishes as JSON
- ⚡ **Real-time Streaming** - Stream captions as they're generated
- 🔐 **Secure Authentication** - PKCE for X, OAuth 2.0 for LinkedIn
- 🎨 **Social Preview** - See exactly how your post will look across platforms
- 📸 **Image Gallery** - Navigate and manage multiple images per post

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
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **HTTPX** - Async HTTP client
- **PIL/Pillow** - Image processing
- **google-generativeai** - Gemini AI integration
- **openai** - OpenAI integration

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
djinn/
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── settings.py             # Configuration & environment vars
│   ├── models.py               # Data models (Pydantic)
│   ├── requirements.txt         # Python dependencies
│   ├── routers/
│   │   ├── auth.py            # LinkedIn OAuth routes
│   │   ├── x_auth.py          # X/Twitter OAuth routes
│   │   ├── post.py            # Post creation & execution
│   │   └── connect.py         # Connection management
│   ├── uploads/               # User uploaded images
│   └── wishes.json            # Persistent wish storage
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx           # React entry point
│   │   ├── App.jsx            # Root component
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── SocialPreview.jsx    # Platform-specific preview
│   │   │   ├── LinkedInPreview.jsx
│   │   │   └── PageWrapper.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Landing page
│   │   │   ├── AutoPost.jsx   # Post creation
│   │   │   ├── AutoConnect.jsx
│   │   │   └── WishPage.jsx   # Wish execution
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
| **Auto Post**    | `/auto-post`    | Image upload → AI caption → platform preview → publish |
| **Auto Connect** | `/auto-connect` | Connection request builder                             |
| **Wish Page**    | `/wish/:id`     | OAuth authentication → post publication                |

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

# Server
APP_ENV=production
FRONTEND_URL=http://localhost:5174
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
