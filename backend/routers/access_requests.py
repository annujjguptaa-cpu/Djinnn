from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from datetime import datetime
from db_supabase import SupabaseDB
from services.email_service import send_access_request_email

router = APIRouter(prefix="/api/access-request", tags=["access-request"])

class AccessRequestSchema(BaseModel):
    full_name: str
    email: str
    organisation: str
    use_case_description: str = Field(..., min_length=50)
    plan_interest: str
    wish_name: str
    wish_topic: str

@router.post("")
async def create_access_request(req: AccessRequestSchema, background_tasks: BackgroundTasks):
    request_record = {
        "full_name": req.full_name,
        "email": req.email,
        "organisation": req.organisation,
        "use_case_description": req.use_case_description,
        "plan_interest": req.plan_interest,
        "wish_name": req.wish_name,
        "wish_topic": req.wish_topic,
        "status": "pending",
        "requested_at": datetime.now().isoformat()
    }
    
    try:
        await SupabaseDB.save_access_request(request_record)
    except Exception as e:
        print(f"Error saving access request: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save access request.")

    # Send confirmation email in background
    background_tasks.add_task(send_access_request_email, req.email, req.wish_name)

    return {"status": "success", "message": "Access request submitted successfully."}
