# 🪔 Djinn — AI Action Agent

> **You wish it. Djinn does it.**

A full-stack LinkedIn automation platform with a React + Tailwind CSS frontend and a Python FastAPI backend.

---

## 🚀 Quick Start

### Frontend (React + Vite + Tailwind)

```bash
cd frontend
npm run dev
# → http://localhost:5173
```

### Backend (Python FastAPI)

```bash
cd backend
uvicorn main:app --reload
# → http://localhost:8000
# → API docs at http://localhost:8000/docs
```

---

## 📁 Project Structure

```
Djinn/
├── frontend/               # React + Vite + Tailwind CSS
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx          # Landing page with feature cards
│       │   ├── AutoPost.jsx      # Image upload + AI caption + preview
│       │   ├── AutoConnect.jsx   # Connect campaign builder
│       │   └── WishPage.jsx      # Recipient page with auth + animation
│       ├── components/
│       │   ├── Navbar.jsx        # Glassmorphism nav
│       │   └── PageWrapper.jsx   # Animated page transitions
│       ├── App.jsx
│       └── index.css
│
└── backend/                # Python FastAPI
    ├── main.py             # App entry with CORS
    ├── models.py           # Pydantic schemas
    ├── routers/
    │   ├── post.py         # POST /api/post/upload + /create
    │   └── connect.py      # POST /api/connect/create
    └── requirements.txt
```

---

## ✨ Pages

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Djinn lamp hero + feature cards |
| **Auto Post** | `/auto-post` | Image upload → AI caption → LinkedIn preview → wish link |
| **Auto Connect** | `/auto-connect` | Campaign builder → wish link |
| **Wish Page** | `/wish/:id` | Google One Tap → loading animation → success |

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/post/upload` | Upload image, get AI caption |
| `POST` | `/api/post/create` | Create post wish → returns wish_id |
| `POST` | `/api/connect/create` | Create connect campaign → returns wish_id |
| `GET` | `/health` | Health check |

## 🔑 Environment Variables

Copy `backend/.env.example` → `backend/.env` and fill in:

- `OPENAI_API_KEY` — for AI caption generation
- `GOOGLE_CLIENT_ID` — for Google One Tap auth
