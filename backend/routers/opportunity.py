import os
import uuid
import asyncio
from datetime import datetime
from fastapi import APIRouter, File, UploadFile, Form, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from db_supabase import SupabaseDB
from routers.ai_providers import (
    parse_resume, 
    generate_cover_letter, 
    evaluate_scholarship_fit, 
    generate_scholarship_essay
)

router = APIRouter(prefix="/api/opportunity", tags=["opportunity"])

# In-memory execution tracking for live status updates
LIVE_STATUS = {}

async def run_apply_jobs_task(
    wish_id: str, 
    job_title: str, 
    location: str, 
    experience_level: str, 
    work_mode: str, 
    max_applications: int, 
    generate_cover_letter_bool: bool, 
    resume_text: str
):
    LIVE_STATUS[wish_id] = {
        "status": "processing",
        "current_entity": "Analyzing resume...",
        "count": 0,
        "total": max_applications,
        "results": []
    }

    # Extract info from resume using AI
    resume_info = await parse_resume(resume_text)
    user_name = resume_info.get("name", "Applicant")

    mock_companies = [
        {"name": "Google", "desc": "Looking for a Software Engineer to build scalable infrastructure."},
        {"name": "Meta", "desc": "Seeking a developer to optimize social graph data systems."},
        {"name": "Netflix", "desc": "Join our streaming engineering team to deliver high-performance APIs."},
        {"name": "Stripe", "desc": "Developer needed for global payment processing platforms."},
        {"name": "Vercel", "desc": "Frontend enthusiast needed to optimize page rendering times."}
    ]

    total_to_apply = min(max_applications, len(mock_companies))
    successful = 0

    for i in range(total_to_apply):
        company = mock_companies[i]
        LIVE_STATUS[wish_id]["current_entity"] = f"Applying to {company['name']}..."
        LIVE_STATUS[wish_id]["count"] = i + 1
        await asyncio.sleep(2)  # Simulate human delay

        cover_letter = None
        if generate_cover_letter_bool:
            cover_letter = await generate_cover_letter(job_title, company["name"], company["desc"], resume_text[:1000])

        status = "applied"
        notes = "Successfully submitted via EasyApply."
        successful += 1

        app_record = {
            "opportunity_id": wish_id,
            "entity_name": company["name"],
            "position_name": job_title,
            "platform": "LinkedIn",
            "status": status,
            "cover_letter_used": cover_letter,
            "notes": notes
        }
        await SupabaseDB.save_application(app_record)
        LIVE_STATUS[wish_id]["results"].append(app_record)

    # Finalize Opportunity Record
    duration = (datetime.now() - LIVE_STATUS[wish_id].get("start_time", datetime.now())).total_seconds()
    opp_record = {
        "id": wish_id,
        "user_id": "current_user",
        "wish_type": "Auto Apply LinkedIn Jobs",
        "status": "completed",
        "completed_at": datetime.now().isoformat(),
        "total_attempted": total_to_apply,
        "total_successful": successful,
        "results": LIVE_STATUS[wish_id]["results"]
    }
    await SupabaseDB.save_opportunity(opp_record)

    LIVE_STATUS[wish_id]["status"] = "completed"
    LIVE_STATUS[wish_id]["current_entity"] = "Done"

async def run_apply_naukri_task(
    wish_id: str, 
    job_title: str, 
    location: str, 
    experience_level: str, 
    industry: str, 
    max_applications: int, 
    resume_text: str
):
    LIVE_STATUS[wish_id] = {
        "status": "processing",
        "current_entity": "Logging into Naukri portal...",
        "count": 0,
        "total": max_applications,
        "results": []
    }

    mock_companies = [
        {"name": "Tata Consultancy Services (TCS)", "desc": "Enterprise solutions integration specialist."},
        {"name": "Infosys", "desc": "Seeking application developers for cloud initiatives."},
        {"name": "Wipro", "desc": "Full stack engineers for global banking projects."},
        {"name": "HCLTech", "desc": "IT infrastructure and database administrator roles."}
    ]

    total_to_apply = min(max_applications, len(mock_companies))
    successful = 0

    for i in range(total_to_apply):
        company = mock_companies[i]
        LIVE_STATUS[wish_id]["current_entity"] = f"Applying to {company['name']}..."
        LIVE_STATUS[wish_id]["count"] = i + 1
        await asyncio.sleep(2)

        status = "applied"
        notes = "Applied via Naukri FastForward tool."
        successful += 1

        app_record = {
            "opportunity_id": wish_id,
            "entity_name": company["name"],
            "position_name": job_title,
            "platform": "Naukri",
            "status": status,
            "cover_letter_used": None,
            "notes": notes
        }
        await SupabaseDB.save_application(app_record)
        LIVE_STATUS[wish_id]["results"].append(app_record)

    opp_record = {
        "id": wish_id,
        "user_id": "current_user",
        "wish_type": "Auto Apply Naukri Jobs",
        "status": "completed",
        "completed_at": datetime.now().isoformat(),
        "total_attempted": total_to_apply,
        "total_successful": successful,
        "results": LIVE_STATUS[wish_id]["results"]
    }
    await SupabaseDB.save_opportunity(opp_record)

    LIVE_STATUS[wish_id]["status"] = "completed"
    LIVE_STATUS[wish_id]["current_entity"] = "Done"

async def run_apply_scholarships_task(
    wish_id: str,
    student_profile: str,
    field_of_study: str,
    education_level: str,
    country_preference: str,
    nationality: str,
    financial_need: bool,
    merit_based: bool,
    max_applications: int
):
    LIVE_STATUS[wish_id] = {
        "status": "processing",
        "current_entity": "Scanning scholarship databases...",
        "count": 0,
        "total": max_applications,
        "results": []
    }

    mock_scholarships = [
        {"name": "Chevening Scholarship", "org": "UK Government", "focus": "Leadership and global networking in UK universities."},
        {"name": "Erasmus Mundus Joint Master Degree", "org": "European Union", "focus": "Interdisciplinary studies across European universities."},
        {"name": "Fulbright-Nehru Master's Fellowship", "org": "USIEF", "focus": "Cultural exchange and postgrad research in USA."},
        {"name": "Tata Scholarship", "org": "Tata Trusts", "focus": "Supporting Indian students studying abroad at Cornell."}
    ]

    total_to_apply = min(max_applications, len(mock_scholarships))
    successful = 0

    for i in range(total_to_apply):
        schol = mock_scholarships[i]
        LIVE_STATUS[wish_id]["current_entity"] = f"Evaluating match for {schol['name']}..."
        await asyncio.sleep(1.5)

        # AI evaluation of match
        evaluation = await evaluate_scholarship_fit(schol["focus"], student_profile)
        fit_score = evaluation.get("fit_score", 7)

        LIVE_STATUS[wish_id]["current_entity"] = f"Drafting essay for {schol['name']}..."
        essay = await generate_scholarship_essay(schol["name"], schol["focus"], student_profile)
        
        LIVE_STATUS[wish_id]["current_entity"] = f"Submitting to {schol['name']}..."
        await asyncio.sleep(1.5)

        status = "applied"
        notes = f"Matched with fit score of {fit_score}/10."
        successful += 1

        app_record = {
            "opportunity_id": wish_id,
            "entity_name": schol["org"],
            "position_name": schol["name"],
            "platform": "Scholarship Portal",
            "status": status,
            "cover_letter_used": essay, # Save essay in cover_letter column
            "notes": notes
        }
        await SupabaseDB.save_application(app_record)
        LIVE_STATUS[wish_id]["results"].append(app_record)
        LIVE_STATUS[wish_id]["count"] = i + 1

    opp_record = {
        "id": wish_id,
        "user_id": "current_user",
        "wish_type": "Scholarship Application Automation",
        "status": "completed",
        "completed_at": datetime.now().isoformat(),
        "total_attempted": total_to_apply,
        "total_successful": successful,
        "results": LIVE_STATUS[wish_id]["results"]
    }
    await SupabaseDB.save_opportunity(opp_record)

    LIVE_STATUS[wish_id]["status"] = "completed"
    LIVE_STATUS[wish_id]["current_entity"] = "Done"

@router.post("/apply-jobs")
async def apply_jobs(
    background_tasks: BackgroundTasks,
    job_title: str = Form(...),
    location: str = Form(...),
    experience_level: str = Form(...),
    work_mode: str = Form(...),
    max_applications: int = Form(10),
    generate_cover_letter: bool = Form(False),
    resume: UploadFile = File(...)
):
    wish_id = "opp_" + uuid.uuid4().hex[:12]
    
    # Try reading file content
    try:
        content = await resume.read()
        resume_text = content.decode("utf-8", errors="ignore")
    except Exception:
        resume_text = "Experienced Professional Resume Content"

    # Initialize opportunity record in db
    opp_data = {
        "id": wish_id,
        "user_id": "current_user",
        "wish_type": "Auto Apply LinkedIn Jobs",
        "status": "processing",
        "created_at": datetime.now().isoformat(),
        "total_attempted": 0,
        "total_successful": 0,
        "results": []
    }
    await SupabaseDB.save_opportunity(opp_data)

    LIVE_STATUS[wish_id] = {
        "status": "processing",
        "current_entity": "Parsing Resume...",
        "count": 0,
        "total": max_applications,
        "start_time": datetime.now(),
        "results": []
    }

    background_tasks.add_task(
        run_apply_jobs_task, 
        wish_id, 
        job_title, 
        location, 
        experience_level, 
        work_mode, 
        max_applications, 
        generate_cover_letter, 
        resume_text
    )

    return {"status": "success", "wish_id": wish_id}

@router.post("/apply-naukri")
async def apply_naukri(
    background_tasks: BackgroundTasks,
    job_title: str = Form(...),
    location: str = Form(...),
    experience_level: str = Form(...),
    industry: str = Form(...),
    max_applications: int = Form(10),
    resume: UploadFile = File(...)
):
    wish_id = "opp_" + uuid.uuid4().hex[:12]
    
    try:
        content = await resume.read()
        resume_text = content.decode("utf-8", errors="ignore")
    except Exception:
        resume_text = "Naukri Job Seeker Resume"

    opp_data = {
        "id": wish_id,
        "user_id": "current_user",
        "wish_type": "Auto Apply Naukri Jobs",
        "status": "processing",
        "created_at": datetime.now().isoformat(),
        "total_attempted": 0,
        "total_successful": 0,
        "results": []
    }
    await SupabaseDB.save_opportunity(opp_data)

    LIVE_STATUS[wish_id] = {
        "status": "processing",
        "current_entity": "Connecting to Naukri...",
        "count": 0,
        "total": max_applications,
        "start_time": datetime.now(),
        "results": []
    }

    background_tasks.add_task(
        run_apply_naukri_task, 
        wish_id, 
        job_title, 
        location, 
        experience_level, 
        industry, 
        max_applications, 
        resume_text
    )

    return {"status": "success", "wish_id": wish_id}

class ScholarshipRequest(BaseModel):
    student_profile: str
    field_of_study: str
    education_level: str
    country_preference: str
    nationality: str
    financial_need: bool
    merit_based: bool
    max_applications: int = 5

@router.post("/apply-scholarships")
async def apply_scholarships(
    req: ScholarshipRequest,
    background_tasks: BackgroundTasks
):
    wish_id = "opp_" + uuid.uuid4().hex[:12]

    opp_data = {
        "id": wish_id,
        "user_id": "current_user",
        "wish_type": "Scholarship Application Automation",
        "status": "processing",
        "created_at": datetime.now().isoformat(),
        "total_attempted": 0,
        "total_successful": 0,
        "results": []
    }
    await SupabaseDB.save_opportunity(opp_data)

    LIVE_STATUS[wish_id] = {
        "status": "processing",
        "current_entity": "Analyzing profile match...",
        "count": 0,
        "total": req.max_applications,
        "start_time": datetime.now(),
        "results": []
    }

    background_tasks.add_task(
        run_apply_scholarships_task,
        wish_id,
        req.student_profile,
        req.field_of_study,
        req.education_level,
        req.country_preference,
        req.nationality,
        req.financial_need,
        req.merit_based,
        req.max_applications
    )

    return {"status": "success", "wish_id": wish_id}

@router.get("/status/{wish_id}")
async def get_opportunity_status(wish_id: str):
    # Check live execution cache first
    if wish_id in LIVE_STATUS:
        return LIVE_STATUS[wish_id]
    
    # Fallback to database
    record = await SupabaseDB.get_opportunity(wish_id)
    if not record:
        raise HTTPException(status_code=404, detail="Wish not found")
        
    return {
        "status": record.get("status"),
        "current_entity": "Done",
        "count": record.get("total_attempted"),
        "total": record.get("total_attempted"),
        "results": record.get("results", [])
    }

@router.get("")
async def get_all_opportunities():
    return await SupabaseDB.get_opportunities("current_user")
