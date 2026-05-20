export interface Wish {
  id: string;
  name: string;
  description: string;
  topic: string;
  isActive: boolean;
  path: string;
}

export interface TopicWishes {
  id: string;
  title: string;
  icon: string;
  wishes: Wish[];
}

export const ALL_WISHES: TopicWishes[] = [
  {
    "id": "presence",
    "title": "The Presence Wish",
    "icon": "🎙️",
    "wishes": [
      {
        "id": "linkedin-post",
        "name": "LinkedIn Auto Post",
        "description": "Write AI posts from images, Auto publish to feed",
        "topic": "presence",
        "isActive": true,
        "path": "/auto-post"
      },
      {
        "id": "linkedin-connect",
        "name": "LinkedIn Auto Connect",
        "description": "Target by role & location, Send personalized notes",
        "topic": "presence",
        "isActive": true,
        "path": "/auto-connect"
      },
      {
        "id": "twitter-x-auto-post",
        "name": "Twitter X Auto Post",
        "description": "Generate viral tweets, Auto publish to timeline",
        "topic": "presence",
        "isActive": false,
        "path": ""
      },
      {
        "id": "twitter-thread-publisher",
        "name": "Twitter Thread Publisher",
        "description": "Convert blogs to threads, Schedule thread delivery",
        "topic": "presence",
        "isActive": false,
        "path": ""
      },
      {
        "id": "personal-brand-building-engine",
        "name": "Personal Brand Building Engine",
        "description": "Analyze engagement, Suggest weekly topics",
        "topic": "presence",
        "isActive": false,
        "path": ""
      },
      {
        "id": "auto-comment-on-trending-posts",
        "name": "Auto Comment on Trending Posts",
        "description": "Find relevant hashtags, Draft insightful replies",
        "topic": "presence",
        "isActive": false,
        "path": ""
      },
      {
        "id": "speaker-application-automation",
        "name": "Speaker Application Automation",
        "description": "Find industry events, Submit speaker pitches",
        "topic": "presence",
        "isActive": false,
        "path": ""
      },
      {
        "id": "podcast-pitch-automation",
        "name": "Podcast Pitch Automation",
        "description": "Discover niche podcasts, Send guest proposals",
        "topic": "presence",
        "isActive": false,
        "path": ""
      },
      {
        "id": "pr-outreach-automation",
        "name": "PR Outreach Automation",
        "description": "Find journalists, Draft press releases",
        "topic": "presence",
        "isActive": false,
        "path": ""
      },
      {
        "id": "auto-collect-testimonials",
        "name": "Auto Collect Testimonials",
        "description": "Email past clients, Publish to profile",
        "topic": "presence",
        "isActive": false,
        "path": ""
      },
      {
        "id": "conference-networking-automation",
        "name": "Conference Networking Automation",
        "description": "Extract attendee lists, Send pre-event invites",
        "topic": "presence",
        "isActive": false,
        "path": ""
      },
      {
        "id": "crowdfunding-campaign-monitor",
        "name": "Crowdfunding Campaign Monitor",
        "description": "Track funding milestones, Auto thank backers",
        "topic": "presence",
        "isActive": false,
        "path": ""
      },
      {
        "id": "competitive-intelligence-monitor",
        "name": "Competitive Intelligence Monitor",
        "description": "Track competitor posts, Analyze content gaps",
        "topic": "presence",
        "isActive": false,
        "path": ""
      },
      {
        "id": "linkedin-profile-optimiser",
        "name": "LinkedIn Profile Optimiser",
        "description": "Audit profile keywords, Rewrite summary",
        "topic": "presence",
        "isActive": false,
        "path": ""
      },
      {
        "id": "auto-request-recommendations",
        "name": "Auto Request Recommendations",
        "description": "Identify key colleagues, Draft recommendation requests",
        "topic": "presence",
        "isActive": false,
        "path": ""
      }
    ]
  },
  {
    "id": "opportunity",
    "title": "The Opportunity Wish",
    "icon": "🧭",
    "wishes": [
      {
        "id": "linkedin-jobs",
        "name": "Auto Apply LinkedIn Jobs",
        "description": "Filter by role, Auto submit resumes",
        "topic": "opportunity",
        "isActive": true,
        "path": "/opportunity/jobs"
      },
      {
        "id": "naukri-jobs",
        "name": "Auto Apply Naukri Jobs",
        "description": "Update profile daily, Bulk apply to matches",
        "topic": "opportunity",
        "isActive": true,
        "path": "/opportunity/naukri"
      },
      {
        "id": "auto-apply-internshala",
        "name": "Auto Apply Internshala",
        "description": "Find relevant roles, Submit custom cover letters",
        "topic": "opportunity",
        "isActive": false,
        "path": ""
      },
      {
        "id": "multi-platform-job-application",
        "name": "Multi-platform Job Application",
        "description": "Cross-post resumes, Track application status",
        "topic": "opportunity",
        "isActive": false,
        "path": ""
      },
      {
        "id": "resume-optimiser",
        "name": "Resume Optimiser",
        "description": "Scan JD keywords, Tailor resume bullets",
        "topic": "opportunity",
        "isActive": false,
        "path": ""
      },
      {
        "id": "cover-letter-generator",
        "name": "Cover Letter Generator",
        "description": "Analyze company info, Draft personalized letters",
        "topic": "opportunity",
        "isActive": false,
        "path": ""
      },
      {
        "id": "auto-follow-up-applications",
        "name": "Auto Follow Up Applications",
        "description": "Track application dates, Send follow-up emails",
        "topic": "opportunity",
        "isActive": false,
        "path": ""
      },
      {
        "id": "interview-scheduler",
        "name": "Interview Scheduler",
        "description": "Sync with calendar, Suggest meeting times",
        "topic": "opportunity",
        "isActive": false,
        "path": ""
      },
      {
        "id": "salary-negotiation-research",
        "name": "Salary Negotiation Research",
        "description": "Scrape market rates, Prepare negotiation scripts",
        "topic": "opportunity",
        "isActive": false,
        "path": ""
      },
      {
        "id": "hackathon-registration",
        "name": "Hackathon Registration",
        "description": "Find global hackathons, Auto fill team details",
        "topic": "opportunity",
        "isActive": false,
        "path": ""
      },
      {
        "id": "scholarships",
        "name": "Scholarship Application Automation",
        "description": "Match eligibility, Draft application essays",
        "topic": "opportunity",
        "isActive": true,
        "path": "/opportunity/scholarships"
      },
      {
        "id": "university-admissions",
        "name": "University Admissions",
        "description": "Track deadlines, Organize transcripts",
        "topic": "opportunity",
        "isActive": false,
        "path": ""
      },
      {
        "id": "auto-request-linkedin-recommendations",
        "name": "Auto Request LinkedIn Recommendations",
        "description": "Identify key colleagues, Draft recommendation requests",
        "topic": "opportunity",
        "isActive": false,
        "path": ""
      },
      {
        "id": "internship-hunt",
        "name": "Internship Hunt",
        "description": "Find remote internships, Alert on new postings",
        "topic": "opportunity",
        "isActive": false,
        "path": ""
      },
      {
        "id": "academic-conference-submission",
        "name": "Academic Conference Submission",
        "description": "Find call for papers, Format submissions",
        "topic": "opportunity",
        "isActive": false,
        "path": ""
      }
    ]
  },
  {
    "id": "growth",
    "title": "The Growth Wish",
    "icon": "📈",
    "wishes": [
      {
        "id": "vc-outreach",
        "name": "VC Research and Outreach",
        "description": "Find active investors, Send personalized pitch decks",
        "topic": "growth",
        "isActive": true,
        "path": "/growth/vc-outreach"
      },
      {
        "id": "cold-email",
        "name": "Cold Email Campaign",
        "description": "Generate leads, Automate email sequences",
        "topic": "growth",
        "isActive": true,
        "path": "/growth/cold-email"
      },
      {
        "id": "supplier-discovery-indiamart",
        "name": "Supplier Discovery IndiaMART",
        "description": "Search product keywords, Request bulk quotes",
        "topic": "growth",
        "isActive": false,
        "path": ""
      },
      {
        "id": "client-proposal-submission",
        "name": "Client Proposal Submission",
        "description": "Draft project proposals, Auto calculate estimates",
        "topic": "growth",
        "isActive": false,
        "path": ""
      },
      {
        "id": "sales-followup",
        "name": "Sales Lead Follow Up",
        "description": "Track email opens, Send timed follow-ups",
        "topic": "growth",
        "isActive": true,
        "path": "/growth/follow-up"
      },
      {
        "id": "crm-update-automation",
        "name": "CRM Update Automation",
        "description": "Log calls and emails, Update deal stages",
        "topic": "growth",
        "isActive": false,
        "path": ""
      },
      {
        "id": "lead-generation-linkedin",
        "name": "Lead Generation LinkedIn",
        "description": "Extract target profiles, Export to CSV/CRM",
        "topic": "growth",
        "isActive": false,
        "path": ""
      },
      {
        "id": "freelance-rate-negotiation-upwork",
        "name": "Freelance Rate Negotiation Upwork",
        "description": "Analyze client budget, Propose optimal rates",
        "topic": "growth",
        "isActive": false,
        "path": ""
      },
      {
        "id": "government-tender-monitor",
        "name": "Government Tender Monitor",
        "description": "Track new tenders, Alert on relevant keywords",
        "topic": "growth",
        "isActive": false,
        "path": ""
      },
      {
        "id": "partnership-outreach",
        "name": "Partnership Outreach",
        "description": "Find synergy brands, Draft collaboration proposals",
        "topic": "growth",
        "isActive": false,
        "path": ""
      },
      {
        "id": "investor-relations-automation",
        "name": "Investor Relations Automation",
        "description": "Send monthly updates, Track investor engagement",
        "topic": "growth",
        "isActive": false,
        "path": ""
      },
      {
        "id": "request-for-quotes-automation",
        "name": "Request for Quotes Automation",
        "description": "Draft RFQ documents, Send to multiple vendors",
        "topic": "growth",
        "isActive": false,
        "path": ""
      },
      {
        "id": "b2b-directory-listing",
        "name": "B2B Directory Listing",
        "description": "Submit company profile, Update across directories",
        "topic": "growth",
        "isActive": false,
        "path": ""
      },
      {
        "id": "trade-show-registration",
        "name": "Trade Show Registration",
        "description": "Find industry expos, Book exhibitor booths",
        "topic": "growth",
        "isActive": false,
        "path": ""
      },
      {
        "id": "startup-accelerator-submission",
        "name": "Startup Accelerator Submission",
        "description": "Track accelerator deadlines, Draft application answers",
        "topic": "growth",
        "isActive": false,
        "path": ""
      }
    ]
  },
  {
    "id": "spotlight",
    "title": "The Spotlight Wish",
    "icon": "📻",
    "wishes": [
      {
        "id": "multi-platform-simultaneous-post",
        "name": "Multi-Platform Simultaneous Post",
        "description": "Post to LinkedIn, X, FB, Adjust formatting per platform",
        "topic": "spotlight",
        "isActive": false,
        "path": ""
      },
      {
        "id": "instagram-auto-post",
        "name": "Instagram Auto Post",
        "description": "Schedule reels & posts, Generate viral captions",
        "topic": "spotlight",
        "isActive": false,
        "path": ""
      },
      {
        "id": "facebook-group-post",
        "name": "Facebook Group Post",
        "description": "Post to multiple groups, Answer membership questions",
        "topic": "spotlight",
        "isActive": false,
        "path": ""
      },
      {
        "id": "content-calendar-execution",
        "name": "Content Calendar Execution",
        "description": "Sync with Notion/Trello, Auto publish on schedule",
        "topic": "spotlight",
        "isActive": false,
        "path": ""
      },
      {
        "id": "auto-repurpose-content",
        "name": "Auto Repurpose Content",
        "description": "Turn videos into text, Create snippets from blogs",
        "topic": "spotlight",
        "isActive": false,
        "path": ""
      },
      {
        "id": "seo-monitoring",
        "name": "SEO Monitoring",
        "description": "Track keyword rankings, Suggest on-page edits",
        "topic": "spotlight",
        "isActive": false,
        "path": ""
      },
      {
        "id": "broken-link-fixer",
        "name": "Broken Link Fixer",
        "description": "Scan site for 404s, Auto redirect broken URLs",
        "topic": "spotlight",
        "isActive": false,
        "path": ""
      },
      {
        "id": "product-launch-automation",
        "name": "Product Launch Automation",
        "description": "Schedule launch emails, Post on Product Hunt",
        "topic": "spotlight",
        "isActive": false,
        "path": ""
      },
      {
        "id": "influencer-outreach",
        "name": "Influencer Outreach",
        "description": "Find niche influencers, Send collaboration DMs",
        "topic": "spotlight",
        "isActive": false,
        "path": ""
      },
      {
        "id": "email-newsletter-automation",
        "name": "Email Newsletter Automation",
        "description": "Curate weekly content, Draft and send via Mailchimp",
        "topic": "spotlight",
        "isActive": false,
        "path": ""
      },
      {
        "id": "app-store-review-monitor",
        "name": "App 'Store' Review Monitor",
        "description": "Track new reviews, Auto reply to feedback",
        "topic": "spotlight",
        "isActive": false,
        "path": ""
      },
      {
        "id": "brand-mention-monitor",
        "name": "Brand Mention Monitor",
        "description": "Track social mentions, Alert on negative sentiment",
        "topic": "spotlight",
        "isActive": false,
        "path": ""
      },
      {
        "id": "crisis-management-monitor",
        "name": "Crisis Management Monitor",
        "description": "Detect PR spikes, Draft holding statements",
        "topic": "spotlight",
        "isActive": false,
        "path": ""
      },
      {
        "id": "competitor-product-monitor",
        "name": "Competitor Product Monitor",
        "description": "Track new feature launches, Compare pricing changes",
        "topic": "spotlight",
        "isActive": false,
        "path": ""
      },
      {
        "id": "submit-website-to-directories",
        "name": "Submit Website to Directories",
        "description": "Find relevant directories, Auto fill submission forms",
        "topic": "spotlight",
        "isActive": false,
        "path": ""
      }
    ]
  },
  {
    "id": "oracle",
    "title": "The Oracle Wish",
    "icon": "👁️",
    "wishes": [
      {
        "id": "academic-research-paper-writer",
        "name": "Academic Research Paper Writer",
        "description": "Find peer-reviewed sources, Draft literature review",
        "topic": "oracle",
        "isActive": false,
        "path": ""
      },
      {
        "id": "wikipedia-citation-checker",
        "name": "Wikipedia Citation Checker",
        "description": "Verify wiki claims, Find original sources",
        "topic": "oracle",
        "isActive": false,
        "path": ""
      },
      {
        "id": "patent-search-analysis",
        "name": "Patent Search Analysis",
        "description": "Search patent databases, Summarize prior art",
        "topic": "oracle",
        "isActive": false,
        "path": ""
      },
      {
        "id": "competitive-intelligence-dashboard",
        "name": "Competitive Intelligence Dashboard",
        "description": "Track competitor news, Analyze market positioning",
        "topic": "oracle",
        "isActive": false,
        "path": ""
      },
      {
        "id": "real-estate-due-diligence",
        "name": "Real Estate Due Diligence",
        "description": "Check property records, Verify ownership history",
        "topic": "oracle",
        "isActive": false,
        "path": ""
      },
      {
        "id": "business-acquisition-due-diligence",
        "name": "Business Acquisition Due Diligence",
        "description": "Analyze public financials, Check legal filings",
        "topic": "oracle",
        "isActive": false,
        "path": ""
      },
      {
        "id": "market-research-report",
        "name": "Market Research Report",
        "description": "Gather industry stats, Draft comprehensive reports",
        "topic": "oracle",
        "isActive": false,
        "path": ""
      },
      {
        "id": "supply-chain-price-intelligence",
        "name": "Supply Chain Price Intelligence",
        "description": "Track raw material costs, Alert on price drops",
        "topic": "oracle",
        "isActive": false,
        "path": ""
      },
      {
        "id": "legal-document-intelligence",
        "name": "Legal Document Intelligence",
        "description": "Summarize long contracts, Highlight key clauses",
        "topic": "oracle",
        "isActive": false,
        "path": ""
      },
      {
        "id": "government-policy-monitor",
        "name": "Government Policy Monitor",
        "description": "Track regulatory changes, Summarize impact",
        "topic": "oracle",
        "isActive": false,
        "path": ""
      },
      {
        "id": "scientific-literature-review",
        "name": "Scientific Literature Review",
        "description": "Search PubMed/ArXiv, Extract key findings",
        "topic": "oracle",
        "isActive": false,
        "path": ""
      },
      {
        "id": "news-aggregator-summariser",
        "name": "News Aggregator Summariser",
        "description": "Collect daily news, Create bulleted summaries",
        "topic": "oracle",
        "isActive": false,
        "path": ""
      },
      {
        "id": "financial-news-monitor",
        "name": "Financial News Monitor",
        "description": "Track stock tickers, Analyze market sentiment",
        "topic": "oracle",
        "isActive": false,
        "path": ""
      },
      {
        "id": "industry-report-compiler",
        "name": "Industry Report Compiler",
        "description": "Scrape consulting reports, Extract charts and data",
        "topic": "oracle",
        "isActive": false,
        "path": ""
      },
      {
        "id": "technology-trend-monitor",
        "name": "Technology Trend Monitor",
        "description": "Track emerging tech terms, Alert on new frameworks",
        "topic": "oracle",
        "isActive": false,
        "path": ""
      }
    ]
  },
  {
    "id": "scholar",
    "title": "The Scholar Wish",
    "icon": "🎓",
    "wishes": [
      {
        "id": "scholarship-application",
        "name": "Scholarship Application",
        "description": "Find matching funds, Draft application essays",
        "topic": "scholar",
        "isActive": false,
        "path": ""
      },
      {
        "id": "university-admissions",
        "name": "University Admissions",
        "description": "Track university deadlines, Manage application portals",
        "topic": "scholar",
        "isActive": false,
        "path": ""
      },
      {
        "id": "assignment-submission",
        "name": "Assignment Submission",
        "description": "Format documents, Auto submit to LMS",
        "topic": "scholar",
        "isActive": false,
        "path": ""
      },
      {
        "id": "hackathon-project-submission",
        "name": "Hackathon Project Submission",
        "description": "Draft project descriptions, Upload code repositories",
        "topic": "scholar",
        "isActive": false,
        "path": ""
      },
      {
        "id": "online-course-enrollment",
        "name": "Online Course Enrollment",
        "description": "Find free courses, Auto register for classes",
        "topic": "scholar",
        "isActive": false,
        "path": ""
      },
      {
        "id": "bootcamp-project-submission",
        "name": "Bootcamp Project Submission",
        "description": "Package final projects, Submit for review",
        "topic": "scholar",
        "isActive": false,
        "path": ""
      },
      {
        "id": "academic-paper-citation-formatter",
        "name": "Academic Paper Citation Formatter",
        "description": "Convert to APA/MLA, Build bibliography",
        "topic": "scholar",
        "isActive": false,
        "path": ""
      },
      {
        "id": "study-material-aggregator",
        "name": "Study Material Aggregator",
        "description": "Find past papers, Download lecture slides",
        "topic": "scholar",
        "isActive": false,
        "path": ""
      },
      {
        "id": "online-exam-registration",
        "name": "Online Exam Registration",
        "description": "Track exam dates, Book testing slots",
        "topic": "scholar",
        "isActive": false,
        "path": ""
      },
      {
        "id": "student-loan-application",
        "name": "Student Loan Application",
        "description": "Compare loan rates, Fill application forms",
        "topic": "scholar",
        "isActive": false,
        "path": ""
      },
      {
        "id": "college-event-registration",
        "name": "College Event Registration",
        "description": "RSVP to campus events, Add to calendar",
        "topic": "scholar",
        "isActive": false,
        "path": ""
      },
      {
        "id": "internship-hunt",
        "name": "Internship Hunt",
        "description": "Find summer internships, Auto send resumes",
        "topic": "scholar",
        "isActive": false,
        "path": ""
      },
      {
        "id": "academic-conference-submission",
        "name": "Academic Conference Submission",
        "description": "Find call for papers, Format abstract submissions",
        "topic": "scholar",
        "isActive": false,
        "path": ""
      },
      {
        "id": "research-grant-application",
        "name": "Research Grant Application",
        "description": "Find academic grants, Draft proposal documents",
        "topic": "scholar",
        "isActive": false,
        "path": ""
      },
      {
        "id": "alumni-network-outreach",
        "name": "Alumni Network Outreach",
        "description": "Find notable alumni, Draft connection requests",
        "topic": "scholar",
        "isActive": false,
        "path": ""
      }
    ]
  },
  {
    "id": "builder",
    "title": "The Builder Wish",
    "icon": "💻",
    "wishes": [
      {
        "id": "github-push",
        "name": "Personal GitHub Summon",
        "description": "Deploy local folders, Generate AI readmes",
        "topic": "builder",
        "isActive": true,
        "path": "/github-personal"
      },
      {
        "id": "github-b2b",
        "name": "Governance B2B HQ",
        "description": "Manage dev network, Distribute magic links",
        "topic": "builder",
        "isActive": true,
        "path": "/github-dashboard"
      },
      {
        "id": "github-auto-push-with-ai-readme",
        "name": "GitHub Auto Push with AI README",
        "description": "Commit code automatically, Draft detailed documentation",
        "topic": "builder",
        "isActive": false,
        "path": ""
      },
      {
        "id": "github-repository-setup",
        "name": "GitHub Repository Setup",
        "description": "Initialize repos, Add standard templates",
        "topic": "builder",
        "isActive": false,
        "path": ""
      },
      {
        "id": "developer-onboarding",
        "name": "Developer Onboarding",
        "description": "Grant repo access, Send setup instructions",
        "topic": "builder",
        "isActive": false,
        "path": ""
      },
      {
        "id": "open-source-contributor-onboarding",
        "name": "Open Source Contributor Onboarding",
        "description": "Review first PRs, Send welcome messages",
        "topic": "builder",
        "isActive": false,
        "path": ""
      },
      {
        "id": "bug-report-submission",
        "name": "Bug Report Submission",
        "description": "Format issue tickets, Attach error logs",
        "topic": "builder",
        "isActive": false,
        "path": ""
      },
      {
        "id": "stack-overflow-monitor",
        "name": "Stack Overflow Monitor",
        "description": "Track relevant tags, Draft answer templates",
        "topic": "builder",
        "isActive": false,
        "path": ""
      },
      {
        "id": "tech-job-board-monitor",
        "name": "Tech Job Board Monitor",
        "description": "Find engineering roles, Alert on new postings",
        "topic": "builder",
        "isActive": false,
        "path": ""
      },
      {
        "id": "api-documentation-scraper",
        "name": "API Documentation Scraper",
        "description": "Extract API specs, Convert to Postman collections",
        "topic": "builder",
        "isActive": false,
        "path": ""
      },
      {
        "id": "dependency-update-monitor",
        "name": "Dependency Update Monitor",
        "description": "Check for outdated packages, Create update PRs",
        "topic": "builder",
        "isActive": false,
        "path": ""
      },
      {
        "id": "github-star-and-follow",
        "name": "GitHub Star and Follow",
        "description": "Star trending repos, Follow active developers",
        "topic": "builder",
        "isActive": false,
        "path": ""
      },
      {
        "id": "code-review-request",
        "name": "'Code' Review Request",
        "description": "Assign reviewers, Summarize PR changes",
        "topic": "builder",
        "isActive": false,
        "path": ""
      },
      {
        "id": "technical-blog-publisher",
        "name": "Technical Blog Publisher",
        "description": "Convert markdown to blog, Publish to Medium/Dev.to",
        "topic": "builder",
        "isActive": false,
        "path": ""
      },
      {
        "id": "hackathon-team-formation",
        "name": "Hackathon Team Formation",
        "description": "Find teammates, Setup project workspace",
        "topic": "builder",
        "isActive": false,
        "path": ""
      },
      {
        "id": "cloud-cost-monitor",
        "name": "Cloud Cost Monitor",
        "description": "Track AWS/GCP billing, Alert on budget spikes",
        "topic": "builder",
        "isActive": false,
        "path": ""
      },
      {
        "id": "devops-incident-report",
        "name": "DevOps Incident Report",
        "description": "Draft post-mortems, Distribute to team",
        "topic": "builder",
        "isActive": false,
        "path": ""
      }
    ]
  },
  {
    "id": "merchant",
    "title": "The Merchant Wish",
    "icon": "🏪",
    "wishes": [
      {
        "id": "multi-platform-product-listing",
        "name": "Multi-Platform Product Listing",
        "description": "List on Amazon, eBay, Shopify, Sync inventory",
        "topic": "merchant",
        "isActive": false,
        "path": ""
      },
      {
        "id": "price-comparison-platforms",
        "name": "Price Comparison Platforms",
        "description": "Track competitor prices, Auto adjust own prices",
        "topic": "merchant",
        "isActive": false,
        "path": ""
      },
      {
        "id": "auto-reorder-inventory",
        "name": "Auto Reorder Inventory",
        "description": "Monitor stock levels, Send purchase orders",
        "topic": "merchant",
        "isActive": false,
        "path": ""
      },
      {
        "id": "customer-review-monitor",
        "name": "Customer Review Monitor",
        "description": "Track new reviews, Auto reply to common queries",
        "topic": "merchant",
        "isActive": false,
        "path": ""
      },
      {
        "id": "return-refund-request",
        "name": "Return Refund Request",
        "description": "Process returns, Issue automated refunds",
        "topic": "merchant",
        "isActive": false,
        "path": ""
      },
      {
        "id": "flash-sale-monitor",
        "name": "Flash Sale Monitor",
        "description": "Track competitor sales, Alert on deep discounts",
        "topic": "merchant",
        "isActive": false,
        "path": ""
      },
      {
        "id": "wishlist-price-drop-alert",
        "name": "Wishlist Price Drop Alert",
        "description": "Email customers on price drop, Track wishlist items",
        "topic": "merchant",
        "isActive": false,
        "path": ""
      },
      {
        "id": "supplier-catalogue-monitor",
        "name": "Supplier Catalogue Monitor",
        "description": "Track new supplier products, Import to store",
        "topic": "merchant",
        "isActive": false,
        "path": ""
      },
      {
        "id": "product-description-optimiser",
        "name": "Product Description Optimiser",
        "description": "Rewrite descriptions with AI, Add SEO keywords",
        "topic": "merchant",
        "isActive": false,
        "path": ""
      },
      {
        "id": "competitor-product-launch-monitor",
        "name": "Competitor Product Launch Monitor",
        "description": "Track new product lines, Analyze features",
        "topic": "merchant",
        "isActive": false,
        "path": ""
      },
      {
        "id": "auto-apply-coupon-codes",
        "name": "Auto Apply Coupon Codes",
        "description": "Distribute promo codes, Track redemption rates",
        "topic": "merchant",
        "isActive": false,
        "path": ""
      },
      {
        "id": "bulk-order-automation",
        "name": "Bulk Order Automation",
        "description": "Process wholesale orders, Generate invoices",
        "topic": "merchant",
        "isActive": false,
        "path": ""
      },
      {
        "id": "cross-border-sourcing",
        "name": "Cross-border Sourcing",
        "description": "Find international suppliers, Calculate shipping costs",
        "topic": "merchant",
        "isActive": false,
        "path": ""
      },
      {
        "id": "marketplace-account-health-monitor",
        "name": "Marketplace Account Health Monitor",
        "description": "Track seller metrics, Alert on policy violations",
        "topic": "merchant",
        "isActive": false,
        "path": ""
      },
      {
        "id": "auto-respond-buyer-queries",
        "name": "Auto Respond Buyer Queries",
        "description": "Answer shipping FAQs, Handle order status requests",
        "topic": "merchant",
        "isActive": false,
        "path": ""
      }
    ]
  },
  {
    "id": "guardian",
    "title": "The Guardian Wish",
    "icon": "🛡️",
    "wishes": [
      {
        "id": "contract-risk-analysis",
        "name": "Contract Risk Analysis",
        "description": "Highlight risky clauses, Suggest redlines",
        "topic": "guardian",
        "isActive": false,
        "path": ""
      },
      {
        "id": "government-form-submission",
        "name": "Government Form Submission",
        "description": "Auto fill official forms, Submit via portals",
        "topic": "guardian",
        "isActive": false,
        "path": ""
      },
      {
        "id": "gst-filing-preparation",
        "name": "GST Filing Preparation",
        "description": "Reconcile invoices, Draft tax returns",
        "topic": "guardian",
        "isActive": false,
        "path": ""
      },
      {
        "id": "company-registration-research-mca",
        "name": "Company Registration Research MCA",
        "description": "Check name availability, Verify director details",
        "topic": "guardian",
        "isActive": false,
        "path": ""
      },
      {
        "id": "rera-compliance-check",
        "name": "RERA Compliance Check",
        "description": "Verify project registration, Track builder compliance",
        "topic": "guardian",
        "isActive": false,
        "path": ""
      },
      {
        "id": "court-record-search",
        "name": "Court Record Search",
        "description": "Find case histories, Track hearing dates",
        "topic": "guardian",
        "isActive": false,
        "path": ""
      },
      {
        "id": "trademark-search-filing",
        "name": "Trademark Search Filing",
        "description": "Search trademark registry, Draft application forms",
        "topic": "guardian",
        "isActive": false,
        "path": ""
      },
      {
        "id": "tax-deadline-monitor",
        "name": "Tax Deadline Monitor",
        "description": "Track filing dates, Send reminder alerts",
        "topic": "guardian",
        "isActive": false,
        "path": ""
      },
      {
        "id": "insurance-policy-comparison",
        "name": "Insurance Policy Comparison",
        "description": "Scrape policy terms, Highlight best coverage",
        "topic": "guardian",
        "isActive": false,
        "path": ""
      },
      {
        "id": "loan-application-submission",
        "name": "Loan Application Submission",
        "description": "Compile financial docs, Apply to multiple banks",
        "topic": "guardian",
        "isActive": false,
        "path": ""
      },
      {
        "id": "financial-statement-analyser",
        "name": "Financial Statement Analyser",
        "description": "Extract balance sheet data, Calculate key ratios",
        "topic": "guardian",
        "isActive": false,
        "path": ""
      },
      {
        "id": "regulatory-change-monitor",
        "name": "Regulatory Change Monitor",
        "description": "Track industry regulations, Summarize compliance impact",
        "topic": "guardian",
        "isActive": false,
        "path": ""
      },
      {
        "id": "compliance-certificate-tracker",
        "name": "Compliance Certificate Tracker",
        "description": "Monitor expiry dates, Auto request renewals",
        "topic": "guardian",
        "isActive": false,
        "path": ""
      },
      {
        "id": "annual-report-extractor",
        "name": "Annual Report Extractor",
        "description": "Download company reports, Extract key metrics",
        "topic": "guardian",
        "isActive": false,
        "path": ""
      },
      {
        "id": "legal-precedent-research",
        "name": "Legal Precedent Research",
        "description": "Find relevant case law, Summarize judgments",
        "topic": "guardian",
        "isActive": false,
        "path": ""
      }
    ]
  },
  {
    "id": "healer",
    "title": "The Healer Wish",
    "icon": "❤️",
    "wishes": [
      {
        "id": "doctor-appointment-booking",
        "name": "Doctor Appointment Booking",
        "description": "Find available slots, Book consultations",
        "topic": "healer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "medicine-availability-checker",
        "name": "Medicine Availability Checker",
        "description": "Search local pharmacies, Compare online prices",
        "topic": "healer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "health-insurance-claim-tracker",
        "name": "Health Insurance Claim Tracker",
        "description": "Submit claim documents, Monitor approval status",
        "topic": "healer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "medical-report-summariser",
        "name": "Medical Report Summariser",
        "description": "Translate medical jargon, Highlight abnormal results",
        "topic": "healer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "hospital-bed-availability-monitor",
        "name": "Hospital Bed Availability Monitor",
        "description": "Track real-time capacity, Alert on availability",
        "topic": "healer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "prescription-refill-order",
        "name": "Prescription Refill Order",
        "description": "Track medication schedule, Auto order refills",
        "topic": "healer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "health-test-result-monitor",
        "name": "Health Test Result Monitor",
        "description": "Download lab reports, Track historical trends",
        "topic": "healer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "telemedicine-platform-registration",
        "name": "Telemedicine Platform Registration",
        "description": "Create patient profiles, Upload medical history",
        "topic": "healer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "medical-record-organiser",
        "name": "Medical Record Organiser",
        "description": "Digitize prescriptions, Categorize by condition",
        "topic": "healer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "specialist-referral-research",
        "name": "Specialist Referral Research",
        "description": "Find top-rated specialists, Check insurance network",
        "topic": "healer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "clinical-trial-eligibility-checker",
        "name": "Clinical Trial Eligibility Checker",
        "description": "Match patient profiles, Apply for trials",
        "topic": "healer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "wellness-programme-registration",
        "name": "Wellness Programme Registration",
        "description": "Find local fitness classes, Book wellness retreats",
        "topic": "healer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "vaccination-slot-booking",
        "name": "Vaccination Slot Booking",
        "description": "Track vaccine availability, Schedule appointments",
        "topic": "healer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "mental-health-resource-finder",
        "name": "Mental Health Resource Finder",
        "description": "Find local therapists, Verify credentials",
        "topic": "healer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "caregiver-support-outreach",
        "name": "Caregiver Support Outreach",
        "description": "Find nursing services, Request care quotes",
        "topic": "healer",
        "isActive": false,
        "path": ""
      }
    ]
  },
  {
    "id": "foundation",
    "title": "The Foundation Wish",
    "icon": "📍",
    "wishes": [
      {
        "id": "property-listing-monitor",
        "name": "Property Listing Monitor",
        "description": "Track new listings, Filter by specific criteria",
        "topic": "foundation",
        "isActive": false,
        "path": ""
      },
      {
        "id": "real-estate-due-diligence",
        "name": "Real Estate Due Diligence",
        "description": "Check property records, Verify ownership history",
        "topic": "foundation",
        "isActive": false,
        "path": ""
      },
      {
        "id": "property-tax-verification",
        "name": "Property Tax Verification",
        "description": "Check tax payment status, Download receipts",
        "topic": "foundation",
        "isActive": false,
        "path": ""
      },
      {
        "id": "builder-complaint-research",
        "name": "Builder Complaint Research",
        "description": "Search consumer forums, Summarize builder reputation",
        "topic": "foundation",
        "isActive": false,
        "path": ""
      },
      {
        "id": "rental-agreement-comparison",
        "name": "Rental Agreement Comparison",
        "description": "Analyze lease terms, Highlight unusual clauses",
        "topic": "foundation",
        "isActive": false,
        "path": ""
      },
      {
        "id": "home-loan-multi-bank-submission",
        "name": "Home Loan Multi-Bank Submission",
        "description": "Compile income docs, Apply for mortgages",
        "topic": "foundation",
        "isActive": false,
        "path": ""
      },
      {
        "id": "property-registration-research",
        "name": "Property Registration Research",
        "description": "Automate property registration research workflows.",
        "topic": "foundation",
        "isActive": false,
        "path": ""
      },
      {
        "id": "society-maintenance-portal",
        "name": "Society Maintenance Portal",
        "description": "Auto pay maintenance bills, Log society complaints",
        "topic": "foundation",
        "isActive": false,
        "path": ""
      },
      {
        "id": "tenant-background-check",
        "name": "Tenant Background Check",
        "description": "Verify identity documents, Check credit history",
        "topic": "foundation",
        "isActive": false,
        "path": ""
      },
      {
        "id": "property-investment-roi-calculator",
        "name": "Property Investment ROI Calculator",
        "description": "Analyze rental yields, Project capital growth",
        "topic": "foundation",
        "isActive": false,
        "path": ""
      },
      {
        "id": "commercial-space-search",
        "name": "Commercial Space Search",
        "description": "Find office spaces, Compare lease rates",
        "topic": "foundation",
        "isActive": false,
        "path": ""
      },
      {
        "id": "rera-project-status-tracker",
        "name": "RERA Project Status Tracker",
        "description": "Monitor construction updates, Track completion dates",
        "topic": "foundation",
        "isActive": false,
        "path": ""
      },
      {
        "id": "neighbourhood-development-monitor",
        "name": "Neighbourhood Development Monitor",
        "description": "Track infrastructure projects, Analyze local property trends",
        "topic": "foundation",
        "isActive": false,
        "path": ""
      },
      {
        "id": "property-auction-monitor",
        "name": "Property Auction Monitor",
        "description": "Find bank auctions, Track distress sales",
        "topic": "foundation",
        "isActive": false,
        "path": ""
      },
      {
        "id": "vastu-location-analysis",
        "name": "Vastu Location Analysis",
        "description": "Check property orientation, Analyze layout principles",
        "topic": "foundation",
        "isActive": false,
        "path": ""
      }
    ]
  },
  {
    "id": "people",
    "title": "The People Wish",
    "icon": "👥",
    "wishes": [
      {
        "id": "full-recruitment-pipeline",
        "name": "Full Recruitment Pipeline",
        "description": "Post job descriptions, Screen initial resumes",
        "topic": "people",
        "isActive": false,
        "path": ""
      },
      {
        "id": "employee-onboarding",
        "name": "Employee Onboarding",
        "description": "Send welcome packets, Setup software accounts",
        "topic": "people",
        "isActive": false,
        "path": ""
      },
      {
        "id": "performance-review-aggregator",
        "name": "Performance Review Aggregator",
        "description": "Collect peer feedback, Draft review summaries",
        "topic": "people",
        "isActive": false,
        "path": ""
      },
      {
        "id": "employee-feedback-survey",
        "name": "Employee Feedback Survey",
        "description": "Send pulse surveys, Analyze sentiment",
        "topic": "people",
        "isActive": false,
        "path": ""
      },
      {
        "id": "training-certification-tracker",
        "name": "Training Certification Tracker",
        "description": "Monitor expiry dates, Enroll in refresher courses",
        "topic": "people",
        "isActive": false,
        "path": ""
      },
      {
        "id": "payroll-compliance-monitor",
        "name": "Payroll Compliance Monitor",
        "description": "Track tax changes, Verify deduction calculations",
        "topic": "people",
        "isActive": false,
        "path": ""
      },
      {
        "id": "hr-policy-updater",
        "name": "HR Policy Updater",
        "description": "Draft policy updates, Distribute for signature",
        "topic": "people",
        "isActive": false,
        "path": ""
      },
      {
        "id": "job-description-optimiser",
        "name": "Job Description Optimiser",
        "description": "Remove biased language, Add compelling details",
        "topic": "people",
        "isActive": false,
        "path": ""
      },
      {
        "id": "candidate-rejection-email",
        "name": "Candidate Rejection Email",
        "description": "Send personalized rejections, Request feedback",
        "topic": "people",
        "isActive": false,
        "path": ""
      },
      {
        "id": "exit-interview-scheduler",
        "name": "Exit Interview Scheduler",
        "description": "Book final meetings, Send exit surveys",
        "topic": "people",
        "isActive": false,
        "path": ""
      },
      {
        "id": "employee-anniversary-birthday",
        "name": "Employee Anniversary Birthday",
        "description": "Track important dates, Send automated wishes",
        "topic": "people",
        "isActive": false,
        "path": ""
      },
      {
        "id": "workforce-planning-research",
        "name": "Workforce Planning Research",
        "description": "Analyze industry salary trends, Forecast hiring needs",
        "topic": "people",
        "isActive": false,
        "path": ""
      },
      {
        "id": "diversity-hiring-tracker",
        "name": "Diversity Hiring Tracker",
        "description": "Monitor applicant demographics, Suggest inclusive sourcing",
        "topic": "people",
        "isActive": false,
        "path": ""
      },
      {
        "id": "background-verification",
        "name": "Background Verification",
        "description": "Check past employment, Verify education degrees",
        "topic": "people",
        "isActive": false,
        "path": ""
      },
      {
        "id": "labour-law-compliance-monitor",
        "name": "Labour Law Compliance Monitor",
        "description": "Track local labor laws, Alert on necessary changes",
        "topic": "people",
        "isActive": false,
        "path": ""
      }
    ]
  },
  {
    "id": "wanderer",
    "title": "The Wanderer Wish",
    "icon": "✈️",
    "wishes": [
      {
        "id": "flight-price-monitor-auto-book",
        "name": "Flight Price Monitor Auto Book",
        "description": "Track specific routes, Book when price drops",
        "topic": "wanderer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "hotel-availability-tracker",
        "name": "Hotel Availability Tracker",
        "description": "Monitor sold-out hotels, Alert on cancellations",
        "topic": "wanderer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "visa-application-research",
        "name": "Visa Application Research",
        "description": "Check entry requirements, Auto fill visa forms",
        "topic": "wanderer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "travel-itinerary-builder",
        "name": "Travel Itinerary Builder",
        "description": "Research local attractions, Create day-by-day plans",
        "topic": "wanderer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "corporate-travel-policy-checker",
        "name": "Corporate Travel Policy Checker",
        "description": "Verify flight class, Check per diem limits",
        "topic": "wanderer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "freight-rate-comparison",
        "name": "Freight Rate Comparison",
        "description": "Compare shipping quotes, Book cargo space",
        "topic": "wanderer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "customs-documentation-research",
        "name": "Customs Documentation Research",
        "description": "Find required import docs, Calculate duty fees",
        "topic": "wanderer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "travel-insurance-comparison",
        "name": "Travel Insurance Comparison",
        "description": "Compare coverage limits, Purchase policies online",
        "topic": "wanderer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "airport-lounge-checker",
        "name": "Airport Lounge Checker",
        "description": "Find accessible lounges, Verify credit card access",
        "topic": "wanderer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "corporate-expense-report",
        "name": "Corporate Expense Report",
        "description": "Scan travel receipts, Compile expense claims",
        "topic": "wanderer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "group-travel-coordination",
        "name": "Group Travel Coordination",
        "description": "Find common flight times, Book large accommodations",
        "topic": "wanderer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "last-minute-deal-monitor",
        "name": "Last Minute Deal Monitor",
        "description": "Track weekend getaways, Alert on cheap packages",
        "topic": "wanderer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "train-bus-booking",
        "name": "Train Bus Booking",
        "description": "Find ground transport, Book connecting tickets",
        "topic": "wanderer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "travel-advisory-monitor",
        "name": "Travel Advisory Monitor",
        "description": "Track government warnings, Alert on travel disruptions",
        "topic": "wanderer",
        "isActive": false,
        "path": ""
      },
      {
        "id": "loyalty-points-tracker",
        "name": "Loyalty Points Tracker",
        "description": "Monitor frequent flyer miles, Alert on expiring points",
        "topic": "wanderer",
        "isActive": false,
        "path": ""
      }
    ]
  },
  {
    "id": "citizen",
    "title": "The Citizen Wish",
    "icon": "🏛️",
    "wishes": [
      {
        "id": "government-tender-monitor",
        "name": "Government Tender Monitor",
        "description": "Track relevant public tenders, Alert on submission deadlines",
        "topic": "citizen",
        "isActive": false,
        "path": ""
      },
      {
        "id": "rti-application-filing",
        "name": "RTI Application Filing",
        "description": "Draft information requests, Submit via government portals",
        "topic": "citizen",
        "isActive": false,
        "path": ""
      },
      {
        "id": "scholarship-portal-monitor",
        "name": "Scholarship Portal Monitor",
        "description": "Track state/national scholarships, Check eligibility criteria",
        "topic": "citizen",
        "isActive": false,
        "path": ""
      },
      {
        "id": "government-scheme-eligibility",
        "name": "Government Scheme Eligibility",
        "description": "Match profile to schemes, List required documents",
        "topic": "citizen",
        "isActive": false,
        "path": ""
      },
      {
        "id": "aadhaar-pan-service-automation",
        "name": "Aadhaar PAN Service Automation",
        "description": "Book update appointments, Track linking status",
        "topic": "citizen",
        "isActive": false,
        "path": ""
      },
      {
        "id": "municipal-complaint-filing",
        "name": "Municipal Complaint Filing",
        "description": "Report civic issues, Track resolution status",
        "topic": "citizen",
        "isActive": false,
        "path": ""
      },
      {
        "id": "voter-registration-verification",
        "name": "Voter Registration Verification",
        "description": "Check electoral roll, Find polling station",
        "topic": "citizen",
        "isActive": false,
        "path": ""
      },
      {
        "id": "government-certificate-tracking",
        "name": "Government Certificate Tracking",
        "description": "Track domicile/caste certificates, Download issued documents",
        "topic": "citizen",
        "isActive": false,
        "path": ""
      },
      {
        "id": "subsidy-application",
        "name": "Subsidy Application",
        "description": "Find business/agri subsidies, Draft application forms",
        "topic": "citizen",
        "isActive": false,
        "path": ""
      },
      {
        "id": "public-procurement-monitor",
        "name": "Public Procurement Monitor",
        "description": "Track government purchases, Analyze awarded contracts",
        "topic": "citizen",
        "isActive": false,
        "path": ""
      },
      {
        "id": "election-result-monitor",
        "name": "Election Result Monitor",
        "description": "Track local/national polls, Summarize political shifts",
        "topic": "citizen",
        "isActive": false,
        "path": ""
      },
      {
        "id": "parliamentary-bill-tracker",
        "name": "Parliamentary Bill Tracker",
        "description": "Monitor new legislation, Summarize key provisions",
        "topic": "citizen",
        "isActive": false,
        "path": ""
      },
      {
        "id": "government-gazette-monitor",
        "name": "Government Gazette Monitor",
        "description": "Track official notifications, Alert on relevant keywords",
        "topic": "citizen",
        "isActive": false,
        "path": ""
      },
      {
        "id": "public-infrastructure-tracker",
        "name": "Public Infrastructure Tracker",
        "description": "Monitor local projects, Track budget allocations",
        "topic": "citizen",
        "isActive": false,
        "path": ""
      },
      {
        "id": "ngo-registration-compliance",
        "name": "NGO Registration Compliance",
        "description": "Track FCRA/Society rules, Monitor renewal dates",
        "topic": "citizen",
        "isActive": false,
        "path": ""
      }
    ]
  },
  {
    "id": "life",
    "title": "The Life Wish",
    "icon": "✨",
    "wishes": [
      {
        "id": "subscription-manager",
        "name": "Subscription Manager",
        "description": "Track active subscriptions, Auto cancel unused services",
        "topic": "life",
        "isActive": false,
        "path": ""
      },
      {
        "id": "auto-raise-complaints",
        "name": "Auto Raise Complaints",
        "description": "Draft customer service emails, Tweet at company support",
        "topic": "life",
        "isActive": false,
        "path": ""
      },
      {
        "id": "bill-payment-reminder",
        "name": "Bill Payment Reminder",
        "description": "Track utility due dates, Auto pay via bank portals",
        "topic": "life",
        "isActive": false,
        "path": ""
      },
      {
        "id": "auto-rsvp-calendar",
        "name": "Auto RSVP Calendar",
        "description": "Scan email for invites, Accept and add to calendar",
        "topic": "life",
        "isActive": false,
        "path": ""
      },
      {
        "id": "email-newsletter-unsubscribe",
        "name": "Email Newsletter Unsubscribe",
        "description": "Find marketing emails, Click unsubscribe links",
        "topic": "life",
        "isActive": false,
        "path": ""
      },
      {
        "id": "social-media-account-cleanup",
        "name": "Social Media Account Cleanup",
        "description": "Delete old posts, Unlike controversial content",
        "topic": "life",
        "isActive": false,
        "path": ""
      },
      {
        "id": "password-account-audit",
        "name": "Password Account Audit",
        "description": "Check haveibeenpwned, Prompt password updates",
        "topic": "life",
        "isActive": false,
        "path": ""
      },
      {
        "id": "digital-estate-planning",
        "name": "Digital Estate Planning",
        "description": "Organize digital assets, Draft access instructions",
        "topic": "life",
        "isActive": false,
        "path": ""
      },
      {
        "id": "auto-backup-documents",
        "name": "Auto Backup Documents",
        "description": "Scan local folders, Upload to cloud storage",
        "topic": "life",
        "isActive": false,
        "path": ""
      },
      {
        "id": "personal-finance-dashboard",
        "name": "Personal Finance Dashboard",
        "description": "Aggregate bank accounts, Categorize monthly spending",
        "topic": "life",
        "isActive": false,
        "path": ""
      },
      {
        "id": "utility-connection-automation",
        "name": "Utility Connection Automation",
        "description": "Apply for internet/gas/water, Schedule installation dates",
        "topic": "life",
        "isActive": false,
        "path": ""
      },
      {
        "id": "vehicle-insurance-renewal",
        "name": "Vehicle Insurance Renewal",
        "description": "Compare renewal quotes, Auto purchase policies",
        "topic": "life",
        "isActive": false,
        "path": ""
      },
      {
        "id": "school-admission-research",
        "name": "School Admission Research",
        "description": "Track application dates, Compare school fees",
        "topic": "life",
        "isActive": false,
        "path": ""
      },
      {
        "id": "pet-care-appointment-booking",
        "name": "Pet Care Appointment Booking",
        "description": "Book vet checkups, Schedule grooming sessions",
        "topic": "life",
        "isActive": false,
        "path": ""
      },
      {
        "id": "home-service-provider-booking",
        "name": "Home Service Provider Booking",
        "description": "Find plumbers/electricians, Request service quotes",
        "topic": "life",
        "isActive": false,
        "path": ""
      }
    ]
  }
];
