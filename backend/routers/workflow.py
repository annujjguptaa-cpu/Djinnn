from fastapi import APIRouter, HTTPException
import uuid
from typing import List, Optional
from pydantic import BaseModel
from db_supabase import SupabaseDB

router = APIRouter(prefix="/workflow", tags=["workflows"])

class WorkflowTemplate(BaseModel):
    name: str
    readme_format: str
    folder_structure: List[str]
    gitignore_rules: Optional[List[str]] = []
    license_type: str = "MIT"
    branch_protection: bool = True
    collaborators: Optional[List[str]] = []
    portal_name: Optional[str] = "Standard Engineering Portal"
    logo_url: Optional[str] = None

@router.post("/create")
async def create_workflow(payload: WorkflowTemplate):
    """Admin creates a new reusable repository workflow."""
    workflow_id = f"wf_{uuid.uuid4().hex[:10]}"
    
    workflow_data = {
        "id": workflow_id,
        "name": payload.name,
        "template": payload.model_dump()
    }
    
    # Store in Supabase
    await SupabaseDB.save_workflow(workflow_id, workflow_data)
    
    # Save branding/white-label configs if provided
    if payload.portal_name or payload.logo_url:
        await SupabaseDB.save_white_label_config(workflow_id, {
            "portal_name": payload.portal_name,
            "custom_logo_url": payload.logo_url
        })
    
    return {
        "status": "success",
        "workflow_id": workflow_id,
        "share_url": f"/share/{workflow_id}"
    }

@router.get("/{workflow_id}")
async def get_workflow(workflow_id: str):
    """Retrieve template for a specific workflow."""
    workflow = await SupabaseDB.get_workflow(workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow template not found")
    return workflow
