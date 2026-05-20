# 🪔 Djinn — Omni-Platform AI Action Agent

> **You wish it. Djinn does it.** — The AI-powered automation platform for social media, GitHub governance, and team workflows.

Djinn is an intelligent agent that lets you upload images, generate AI-crafted captions, preview your post exactly as it will look on LinkedIn or X (Twitter), **edit everything before publishing**, and then publish with a single click via secure OAuth. No scheduling tools. No copy-paste. Pure automation.

---

## ✨ Features

### 🪄 Social AI Posting
- **Omni-Platform AI Agent** — Upload images, auto-generate captions, preview your post exactly as it will look on LinkedIn or X (Twitter).
- **Gemma 4 Local First** — Runs locally with Ollama (port 11434). Gracefully falls back to Claude 3.5 Sonnet if Gemma 4 is unavailable.

### 🌟 The 15 Wishes (Topics)
Djinn has expanded its capabilities into 15 specific "Wishes" (Topics). Each Wish contains a variety of sub-workflows.
1. **The Presence Wish** — Build your voice. Own your network. (Includes LinkedIn/X Auto Post, Auto Connect, Personal Brand Building, Engagement Automations).
2. **The Opportunity Wish** — Find your path. Land your dream. (Auto Apply to Jobs/Internships, Resume Optimizer, Interview Scheduler).
3. **The Growth Wish** — Close deals. Build empires. (VC Research, Cold Email Campaigns, Supplier Discovery, CRM Updates).
4. **The Spotlight Wish** — Publish everywhere. Be seen by all. (Multi-Platform Post, SEO Monitoring, Product Launch Automation).
5. **The Oracle Wish** — Know everything. Before anyone else. (Academic Research, Patent Search, Competitive Intelligence).
6. **The Scholar Wish** — Learn smarter. Submit faster. (Scholarship Apps, Assignment Submission, Exam Registration).
7. **The Builder Wish** — Ship code. Own the internet. (Personal GitHub Summon, Governance B2B HQ, Bug Report Submission, Cloud Cost Monitor).
8. **The Merchant Wish** — Sell more. Manage less. (Multi-Platform Listing, Price Drop Alerts, Bulk Order Automation).
9. **The Guardian Wish** — Protect what matters. Stay compliant. (Contract Risk Analysis, GST Filing, Trademark Search).
10. **The Healer Wish** — Your health. Handled. (Doctor Appointments, Prescription Refills, Medical Record Organiser).
11. **The Foundation Wish** — Find your space. Own your ground. (Property Listing Monitor, Rent Agreement Comparison).
12. **The People Wish** — Build teams. Retain talent. (Recruitment Pipeline, Employee Onboarding, Performance Reviews).
13. **The Wanderer Wish** — Go anywhere. Effortlessly. (Flight Price Monitor, Travel Itinerary Builder, Visa Apps).
14. **The Citizen Wish** — Navigate systems. Claim what's yours. (Gov Tender Monitor, RTI Filing, Subsidy Apps).
15. **The Life Wish** — Handle everything else. (Subscription Manager, Auto Raise Complaints, Bill Payment Reminders).

---

## 🚀 Recent Enhancements

### 🔮 Discover More Wishes & Navigation
To drive platform-wide discovery, we have introduced the reusable **Discover More Wishes** panel.
- **Recommendations Engine:** Shows curated, context-aware suggestions tailored to the active wish type (e.g., career suggestions for Job Seekers, B2B/outreach tools for Growth builders).
- **All Wishes Collapsible Directory:** Renders a nested, browseable list of all wishes across the 15 categories, showing active and upcoming/locked features.
- **Rollout Coverage:** Integrated at the bottom of all 10 primary pages:
  - LinkedIn Auto Post (`AutoPost.jsx`)
  - LinkedIn Auto Connect (`AutoConnect.jsx`)
  - Personal GitHub Summon (`PersonalPushView.jsx`)
  - Governance B2B HQ (`GitHubDashboard.jsx`)
  - Auto Apply LinkedIn Jobs (`JobApplication.jsx`)
  - Auto Apply Naukri Jobs (`NaukriApplication.jsx`)
  - Scholarship Application Automation (`ScholarshipApplication.jsx`)
  - VC Research and Outreach (`VCOutreach.jsx`)
  - Cold Email Campaign (`ColdEmailCampaign.jsx`)
  - Sales Lead Follow Up (`SalesFollowUp.jsx`)

### 🔒 Locked Features & Access Request Modal
- Allows users to preview locked or upcoming features.
- Clicking **Request Access** opens a beautiful, animated modal where users enter their name, email, organization, and use case details.
- Access requests are saved securely in the backend Database and trigger real-time SMTP Email Alerts directly to the administrator.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** — UI framework and dev server
- **Tailwind CSS** — Utility-first styling with custom Djinn design tokens
- **Framer Motion** — Smooth page transitions and micro-animations
- **Axios** — HTTP client for API calls
- **TypeScript** — Secure, typed components and state management

### Backend
- **FastAPI** — Modern async Python web framework
- **Supabase / PostgreSQL** — Persistence layer for user logs, wishes, and access requests
- **SMTP Service** — Automatic email notifications for admin alerts
- **Ollama / Gemma 4 / Claude 3.5 Sonnet / Gemini** — Multi-tiered LLM orchestration engines

---

## 📁 Project Structure

```
Djinn/
├── backend/
│   ├── main.py                  # FastAPI app + static file serving
│   ├── models.py                # Pydantic request/response models
│   ├── settings.py              # Environment config
│   ├── db_supabase.py           # Supabase persistence layer
│   ├── migrations/
│   │   ├── access_requests.sql  # Access requests table schema
│   │   └── expansion.sql        # Core updates and schemas
│   ├── routers/
│   │   ├── post.py              # AI caption engine + LinkedIn/X publish
│   │   ├── connect.py           # Auto-connect workflow
│   │   ├── auth.py              # LinkedIn OAuth
│   │   ├── x_auth.py            # X (Twitter) OAuth
│   │   ├── github.py            # GitHub OAuth + push router
│   │   ├── workflow.py          # B2B workflow + white-label portals
│   │   ├── access_requests.py   # Access request submissions
│   │   ├── opportunity.py       # Job application automation routes
│   │   └── growth.py            # VC outreach & email campaign routes
│   ├── services/
│   │   ├── guardian.py          # Secret scanner (pre-push security)
│   │   ├── ai_engine.py         # LLM orchestrator
│   │   ├── email_service.py     # Admin SMTP notifications
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
        │   ├── JobApplication.jsx    # LinkedIn Job auto-applier
        │   ├── NaukriApplication.jsx  # Naukri Job auto-applier
        │   ├── ScholarshipApplication.jsx # Scholarship essay applier
        │   ├── VCOutreach.jsx        # VC researcher and pitcher
        │   ├── ColdEmailCampaign.jsx # Bulk cold emailing sequences
        │   └── SalesFollowUp.jsx     # CRM re-engagement campaigns
        ├── components/
        │   ├── DiscoverMoreWishes.tsx # Curated suggestions & all wishes directory
        │   ├── RequestAccessModal.tsx # Form to request entry to locked tools
        │   ├── SocialPreview.jsx     # Live LinkedIn/X post preview
        │   └── Navbar.jsx            # Navigation
        └── data/
            └── allWishes.ts          # Comprehensive lookup directory configuration
```

---

## 🔌 API Endpoints

### Social Posts & Actions
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/post/upload` | Upload images (returns filenames) |
| `POST` | `/api/post/stream` | Stream AI caption (SSE) |
| `POST` | `/api/post/create` | Save wish → returns Magic Link ID |
| `GET` | `/api/post/{wish_id}` | Fetch wish data |
| `PUT` | `/api/post/{wish_id}` | Update caption/images before publishing |
| `POST` | `/api/post/execute/{wish_id}` | Publish to LinkedIn or X |

### Access Requests & Waitlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/access-request` | Submit name/email for features & trigger admin SMTP notification |

### Opportunity automation
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/opportunity/apply-jobs` | Automatically apply to LinkedIn Jobs |
| `POST` | `/api/opportunity/apply-naukri` | Automatically apply to Naukri Jobs |
| `POST` | `/api/opportunity/apply-scholarships` | Apply to international scholarship grants |
| `GET` | `/api/opportunity/status/{wish_id}` | Poll current application status |

### Growth automation
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/growth/vc-outreach` | Research VCs & write custom pitch letters |
| `POST` | `/api/growth/cold-email` | Deploy cold outreach campaigns |
| `POST` | `/api/growth/follow-up` | Trigger CRM re-engagement sequences |
| `GET` | `/api/growth/status/{wish_id}` | Poll current outreach campaign status |

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

# SMTP Alerts Configuration
SMTP_EMAIL=your-sender@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_PORT=587
SMTP_SERVER=smtp.gmail.com

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
