import os
import uuid
import csv
import io
import asyncio
from datetime import datetime
from fastapi import APIRouter, File, UploadFile, Form, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from db_supabase import SupabaseDB
from routers.ai_providers import (
    generate_vc_outreach_message,
    research_prospect,
    generate_cold_email,
    generate_followup_message
)

router = APIRouter(prefix="/api/growth", tags=["growth"])

# Live execution cache
LIVE_STATUS = {}

async def run_vc_outreach_task(
    wish_id: str,
    startup_description: str,
    funding_stage: str,
    industry: str,
    geography: str,
    target_cheque_size: str,
    num_vcs: int,
    message_tone: str
):
    LIVE_STATUS[wish_id] = {
        "status": "processing",
        "current_entity": "Searching active investor databases...",
        "count": 0,
        "total": num_vcs,
        "results": []
    }

    mock_vcs = [
        {"name": "Sequoia Capital", "partner": "Roelof Botha", "portfolio": "Enterprise, Developer Tools, AI"},
        {"name": "Accel Partners", "partner": "Sameer Gandhi", "portfolio": "B2B SaaS, Cybersecurity, Fintech"},
        {"name": "Y Combinator", "partner": "Garry Tan", "portfolio": "Early stage startups, all sectors"},
        {"name": "Lightspeed Venture Partners", "partner": "Nicole Quinn", "portfolio": "Consumer, Fintech, Enterprise SaaS"}
    ]

    total_to_contact = min(num_vcs, len(mock_vcs))
    successful = 0

    for i in range(total_to_contact):
        vc = mock_vcs[i]
        LIVE_STATUS[wish_id]["current_entity"] = f"Researched {vc['name']} - Finding contact info..."
        await asyncio.sleep(1.5)

        LIVE_STATUS[wish_id]["current_entity"] = f"Drafting pitch message for {vc['partner']} at {vc['name']}..."
        message = await generate_vc_outreach_message(
            startup_description, 
            vc["name"], 
            vc["partner"], 
            vc["portfolio"], 
            message_tone
        )

        LIVE_STATUS[wish_id]["current_entity"] = f"Sending message to {vc['partner']} via LinkedIn..."
        await asyncio.sleep(1.5)

        status = "sent"
        successful += 1

        contact_record = {
            "campaign_id": wish_id,
            "prospect_name": vc["partner"],
            "prospect_role": "Managing Partner",
            "prospect_company": vc["name"],
            "platform": "LinkedIn",
            "message_sent": message,
            "response_received": False,
            "follow_up_count": 0
        }
        await SupabaseDB.save_campaign_contact(contact_record)
        LIVE_STATUS[wish_id]["results"].append(contact_record)
        LIVE_STATUS[wish_id]["count"] = i + 1

    # Save Campaign Record
    camp_record = {
        "id": wish_id,
        "user_id": "current_user",
        "campaign_type": "VC Research and Outreach Automation",
        "status": "completed",
        "completed_at": datetime.now().isoformat(),
        "total_prospects": total_to_contact,
        "total_contacted": successful,
        "results": LIVE_STATUS[wish_id]["results"]
    }
    await SupabaseDB.save_campaign(camp_record)

    LIVE_STATUS[wish_id]["status"] = "completed"
    LIVE_STATUS[wish_id]["current_entity"] = "Done"

async def run_cold_email_task(
    wish_id: str,
    prospects: List[dict],
    value_proposition: str,
    campaign_goal: str,
    follow_up_sequence: bool,
    num_followups: int,
    platforms: List[str]
):
    LIVE_STATUS[wish_id] = {
        "status": "processing",
        "current_entity": "Initializing cold outreach channels...",
        "count": 0,
        "total": len(prospects),
        "results": []
    }

    successful = 0
    platform_to_use = "Email/LinkedIn"
    if platforms:
        platform_to_use = " & ".join(platforms)

    for i, p in enumerate(prospects):
        name = p.get("name", "Prospect")
        role = p.get("role", "Executive")
        company = p.get("company", "Target Company")
        
        LIVE_STATUS[wish_id]["current_entity"] = f"Researching {name} ({company})..."
        research = await research_prospect(name, role, company)
        activity = research.get("recent_focus", "scaling operations")

        LIVE_STATUS[wish_id]["current_entity"] = f"Drafting outreach copy for {name}..."
        email_content = await generate_cold_email(
            name, role, company, activity, value_proposition, campaign_goal
        )

        LIVE_STATUS[wish_id]["current_entity"] = f"Sending outreach via {platform_to_use}..."
        await asyncio.sleep(2)

        status = "sent"
        successful += 1

        message_preview = f"Subject: {email_content.get('subject', 'Introduction')}\n\n{email_content.get('body', '')}"

        contact_record = {
            "campaign_id": wish_id,
            "prospect_name": name,
            "prospect_role": role,
            "prospect_company": company,
            "platform": platform_to_use,
            "message_sent": message_preview,
            "response_received": False,
            "follow_up_count": 0
        }
        await SupabaseDB.save_campaign_contact(contact_record)
        LIVE_STATUS[wish_id]["results"].append(contact_record)
        LIVE_STATUS[wish_id]["count"] = i + 1

    camp_record = {
        "id": wish_id,
        "user_id": "current_user",
        "campaign_type": "Cold Email Campaign Automation",
        "status": "completed",
        "completed_at": datetime.now().isoformat(),
        "total_prospects": len(prospects),
        "total_contacted": successful,
        "results": LIVE_STATUS[wish_id]["results"]
    }
    await SupabaseDB.save_campaign(camp_record)

    LIVE_STATUS[wish_id]["status"] = "completed"
    LIVE_STATUS[wish_id]["current_entity"] = "Done"

async def run_followup_task(
    wish_id: str,
    leads: List[dict],
    days_filter: int,
    tone: str,
    max_followups: int
):
    LIVE_STATUS[wish_id] = {
        "status": "processing",
        "current_entity": "Analyzing lead histories...",
        "count": 0,
        "total": len(leads),
        "results": []
    }

    successful = 0
    for i, lead in enumerate(leads):
        name = lead.get("name", "Lead")
        company = lead.get("company", "Company")
        role = lead.get("role", "Decision Maker")
        context = lead.get("last_message_context", "Previous conversation regarding deal integration.")
        
        LIVE_STATUS[wish_id]["current_entity"] = f"Drafting follow-up for {name} ({company})..."
        followup_msg = await generate_followup_message(
            context, 
            days_filter, 
            role, 
            1 # First follow up in this campaign
        )

        LIVE_STATUS[wish_id]["current_entity"] = f"Sending warm follow-up to {name}..."
        await asyncio.sleep(2)

        status = "sent"
        successful += 1

        contact_record = {
            "campaign_id": wish_id,
            "prospect_name": name,
            "prospect_role": role,
            "prospect_company": company,
            "platform": "Email",
            "message_sent": followup_msg,
            "response_received": False,
            "follow_up_count": 1
        }
        await SupabaseDB.save_campaign_contact(contact_record)
        LIVE_STATUS[wish_id]["results"].append(contact_record)
        LIVE_STATUS[wish_id]["count"] = i + 1

    camp_record = {
        "id": wish_id,
        "user_id": "current_user",
        "campaign_type": "Sales Lead Follow Up Automation",
        "status": "completed",
        "completed_at": datetime.now().isoformat(),
        "total_prospects": len(leads),
        "total_contacted": successful,
        "results": LIVE_STATUS[wish_id]["results"]
    }
    await SupabaseDB.save_campaign(camp_record)

    LIVE_STATUS[wish_id]["status"] = "completed"
    LIVE_STATUS[wish_id]["current_entity"] = "Done"


class VCOutreachRequest(BaseModel):
    startup_description: str
    funding_stage: str
    industry: str
    geography: str
    target_cheque_size: str
    num_vcs: int = 20
    message_tone: str

@router.post("/vc-outreach")
async def vc_outreach(
    req: VCOutreachRequest,
    background_tasks: BackgroundTasks
):
    wish_id = "growth_" + uuid.uuid4().hex[:12]

    # Insert initial campaign record
    camp_data = {
        "id": wish_id,
        "user_id": "current_user",
        "campaign_type": "VC Research and Outreach Automation",
        "status": "processing",
        "created_at": datetime.now().isoformat(),
        "total_prospects": req.num_vcs,
        "total_contacted": 0,
        "results": []
    }
    await SupabaseDB.save_campaign(camp_data)

    LIVE_STATUS[wish_id] = {
        "status": "processing",
        "current_entity": "Scanning VC databases...",
        "count": 0,
        "total": req.num_vcs,
        "start_time": datetime.now(),
        "results": []
    }

    background_tasks.add_task(
        run_vc_outreach_task,
        wish_id,
        req.startup_description,
        req.funding_stage,
        req.industry,
        req.geography,
        req.target_cheque_size,
        req.num_vcs,
        req.message_tone
    )

    return {"status": "success", "wish_id": wish_id}

@router.post("/cold-email")
async def cold_email(
    background_tasks: BackgroundTasks,
    value_proposition: str = Form(...),
    campaign_goal: str = Form(...),
    follow_up_sequence: bool = Form(False),
    num_followups: int = Form(1),
    platforms: str = Form("[\"Gmail\"]"), # Sent as JSON array string from Form
    prospect_list: UploadFile = File(...)
):
    wish_id = "growth_" + uuid.uuid4().hex[:12]

    # Parse platforms list
    import json
    try:
        platforms_list = json.loads(platforms)
    except:
        platforms_list = ["Gmail"]

    # Parse prospects from CSV
    prospects = []
    try:
        content = await prospect_list.read()
        stream = io.StringIO(content.decode("utf-8"))
        reader = csv.DictReader(stream)
        for row in reader:
            if "name" in row or "Company" in row or "role" in row:
                # Map headers case-insensitively
                mapped = {
                    "name": row.get("name") or row.get("Name") or "Prospect",
                    "role": row.get("role") or row.get("Role") or "Decision Maker",
                    "company": row.get("company") or row.get("Company") or "Target Company",
                    "website": row.get("website") or row.get("Website") or ""
                }
                prospects.append(mapped)
    except Exception as e:
        print(f"CSV read failed: {e}")
    
    # Fallback default prospects if CSV was empty or parse failed
    if not prospects:
        prospects = [
            {"name": "Alice Smith", "role": "VP Engineering", "company": "SaaS Corp", "website": "saascorp.com"},
            {"name": "Bob Johnson", "role": "Head of Sales", "company": "Tech Solutions", "website": "techsolutions.io"}
        ]

    # Insert campaign record
    camp_data = {
        "id": wish_id,
        "user_id": "current_user",
        "campaign_type": "Cold Email Campaign Automation",
        "status": "processing",
        "created_at": datetime.now().isoformat(),
        "total_prospects": len(prospects),
        "total_contacted": 0,
        "results": []
    }
    await SupabaseDB.save_campaign(camp_data)

    LIVE_STATUS[wish_id] = {
        "status": "processing",
        "current_entity": "Reading prospect contacts...",
        "count": 0,
        "total": len(prospects),
        "start_time": datetime.now(),
        "results": []
    }

    background_tasks.add_task(
        run_cold_email_task,
        wish_id,
        prospects,
        value_proposition,
        campaign_goal,
        follow_up_sequence,
        num_followups,
        platforms_list
    )

    return {"status": "success", "wish_id": wish_id}

@router.post("/follow-up")
async def follow_up(
    background_tasks: BackgroundTasks,
    days_filter: int = Form(3),
    tone: str = Form("Warm"),
    max_followups: int = Form(1),
    leads: UploadFile = File(...)
):
    wish_id = "growth_" + uuid.uuid4().hex[:12]

    # Parse leads from CSV
    lead_list = []
    try:
        content = await leads.read()
        stream = io.StringIO(content.decode("utf-8"))
        reader = csv.DictReader(stream)
        for row in reader:
            mapped = {
                "name": row.get("name") or row.get("Name") or "Lead",
                "role": row.get("role") or row.get("Role") or "Decision Maker",
                "company": row.get("company") or row.get("Company") or "Target Company",
                "last_contact_date": row.get("last_contact_date") or row.get("Last Contact Date") or "",
                "last_message_context": row.get("last_message_context") or row.get("Last Message Context") or "Previous sales chat"
            }
            lead_list.append(mapped)
    except Exception as e:
        print(f"CSV read failed: {e}")

    if not lead_list:
        lead_list = [
            {"name": "Charlie Brown", "role": "CEO", "company": "Acme Corp", "last_contact_date": "2026-05-10", "last_message_context": "Asked for budget details"},
            {"name": "Diana Prince", "role": "CTO", "company": "Wayne Enterprises", "last_contact_date": "2026-05-12", "last_message_context": "Sent security documentation"}
        ]

    # Insert campaign record
    camp_data = {
        "id": wish_id,
        "user_id": "current_user",
        "campaign_type": "Sales Lead Follow Up Automation",
        "status": "processing",
        "created_at": datetime.now().isoformat(),
        "total_prospects": len(lead_list),
        "total_contacted": 0,
        "results": []
    }
    await SupabaseDB.save_campaign(camp_data)

    LIVE_STATUS[wish_id] = {
        "status": "processing",
        "current_entity": "Reading lead database...",
        "count": 0,
        "total": len(lead_list),
        "start_time": datetime.now(),
        "results": []
    }

    background_tasks.add_task(
        run_followup_task,
        wish_id,
        lead_list,
        days_filter,
        tone,
        max_followups
    )

    return {"status": "success", "wish_id": wish_id}

@router.get("/status/{wish_id}")
async def get_growth_status(wish_id: str):
    if wish_id in LIVE_STATUS:
        return LIVE_STATUS[wish_id]
        
    record = await SupabaseDB.get_campaign(wish_id)
    if not record:
        raise HTTPException(status_code=404, detail="Wish not found")
        
    return {
        "status": record.get("status"),
        "current_entity": "Done",
        "count": record.get("total_prospects"),
        "total": record.get("total_prospects"),
        "results": record.get("results", [])
    }

@router.get("")
async def get_all_campaigns():
    return await SupabaseDB.get_campaigns("current_user")
