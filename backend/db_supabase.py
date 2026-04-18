import os
import httpx
from settings import settings
from cryptography.fernet import Fernet
from typing import Optional

# Encryption setup for sensitive tokens
ENCRYPTION_KEY = os.environ.get("ENCRYPTION_KEY", Fernet.generate_key().decode())
cipher_suite = Fernet(ENCRYPTION_KEY.encode())

def encrypt_token(token: str) -> str:
    return cipher_suite.encrypt(token.encode()).decode()

def decrypt_token(encrypted_token: str) -> str:
    return cipher_suite.decrypt(encrypted_token.encode()).decode()

# In-memory fallback for local development without Supabase configured
MOCK_DB = {
    "wishes": [],
    "github_auth": [],
    "workflows": [],
    "github_white_label": [],
    "github_executions": [],
    "github_members": [],
    "github_links": []
}

class SupabaseDB:
    @staticmethod
    def _mock_action(method, table, data, params):
        if table not in MOCK_DB:
            MOCK_DB[table] = []
            
        if method == "GET":
            # Simple mock filtering for admin_id or user_id
            if params and "admin_id" in params:
                val = params["admin_id"].split(".")[1]
                return [x for x in MOCK_DB[table] if x.get("admin_id") == val]
            if params and "user_id" in params:
                val = params["user_id"].split(".")[1]
                return [x for x in MOCK_DB[table] if x.get("user_id") == val]
            return MOCK_DB[table]
            
        elif method == "POST":
            # Very basic UUID mock for new rows without ID
            if data and "id" not in data:
                data["id"] = "mock_" + os.urandom(4).hex()
            MOCK_DB[table].append(data)
            return [data]
            
        elif method == "DELETE":
            # Simple mock delete
            if params and "id" in params:
                val = params["id"].split(".")[1]
                MOCK_DB[table] = [x for x in MOCK_DB[table] if x.get("id") != val]
            return {"status": "mock_deleted"}
            
        elif method == "UPSERT":
            # Simple mock upsert (just append for now)
            MOCK_DB[table].append(data)
            return [data]
        return []

    @staticmethod
    async def _request(method: str, table: str, data: dict = None, params: dict = None):
        """Perform a direct REST call to Supabase, or use local mock."""
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            return SupabaseDB._mock_action(method, table, data, params)
            
        url = f"{settings.SUPABASE_URL}/rest/v1/{table}"
        headers = {
            "apikey": settings.SUPABASE_KEY,
            "Authorization": f"Bearer {settings.SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        
        async with httpx.AsyncClient() as client:
            if method == "GET":
                res = await client.get(url, headers=headers, params=params)
            elif method == "POST":
                res = await client.post(url, headers=headers, json=data)
            elif method == "UPSERT":
                headers["Prefer"] = "resolution=merge-duplicates,return=representation"
                res = await client.post(url, headers=headers, json=data)
            
            if res.status_code == 404:
                return SupabaseDB._mock_action(method, table, data, params) # Fallback to mock
            if res.status_code >= 400:
                print(f"Supabase Error {res.status_code}: {res.text}")
                return SupabaseDB._mock_action(method, table, data, params) # Fallback to mock
            return res.json()

    @staticmethod
    async def save_wish(wish_data: dict):
        return await SupabaseDB._request("POST", "wishes", data=wish_data)

    @staticmethod
    async def get_wish(wish_id: str):
        data = await SupabaseDB._request("GET", "wishes", params={"id": f"eq.{wish_id}"})
        return data[0] if data else None

    @staticmethod
    async def save_github_auth(user_id: str, token: str, username: str):
        encrypted = encrypt_token(token)
        return await SupabaseDB._request("UPSERT", "github_auth", data={
            "user_id": user_id,
            "access_token": encrypted,
            "username": username
        })

    @staticmethod
    async def get_github_auth(user_id: str):
        data = await SupabaseDB._request("GET", "github_auth", params={"user_id": f"eq.{user_id}"})
        if not data: return None
        auth = data[0]
        auth['access_token'] = decrypt_token(auth['access_token'])
        return auth

    @staticmethod
    async def save_workflow(workflow_id: str, workflow_data: dict):
        return await SupabaseDB._request("UPSERT", "workflows", data={
            "id": workflow_id,
            "name": workflow_data['name'],
            "template": workflow_data['template']
        })

    @staticmethod
    async def save_white_label_config(workflow_id: str, config: dict):
        return await SupabaseDB._request("UPSERT", "github_white_label", data={
            "workflow_id": workflow_id,
            "portal_name": config.get("portal_name"),
            "custom_logo_url": config.get("custom_logo_url")
        })

    @staticmethod
    async def get_workflow(workflow_id: str):
        data = await SupabaseDB._request("GET", "workflows", params={"id": f"eq.{workflow_id}"})
        return data[0] if data else None

    @staticmethod
    async def log_execution(execution_data: dict):
        return await SupabaseDB._request("POST", "github_executions", data=execution_data)

    @staticmethod
    async def get_team_members(admin_id: str):
        """Fetch all members in the admin's network."""
        return await SupabaseDB._request("GET", "github_members", params={"admin_id": f"eq.{admin_id}"})

    @staticmethod
    async def add_team_member(admin_id: str, member_data: dict):
        """Add a new member to the governance network."""
        return await SupabaseDB._request("POST", "github_members", data={
            "admin_id": admin_id,
            "name": member_data['name'],
            "role": member_data['role'],
            "usage": 0,
            "limit": member_data.get('limit', 10),
            "avatar": member_data.get('avatar', 'https://github.com/github.png')
        })

    @staticmethod
    async def delete_team_member(member_id: str):
        """Standardized deletion for team management."""
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            return SupabaseDB._mock_action("DELETE", "github_members", None, {"id": f"eq.{member_id}"})
            
        url = f"{settings.SUPABASE_URL}/rest/v1/github_members?id=eq.{member_id}"
        headers = {
            "apikey": settings.SUPABASE_KEY,
            "Authorization": f"Bearer {settings.SUPABASE_KEY}",
            "Content-Type": "application/json"
        }
        async with httpx.AsyncClient() as client:
            res = await client.delete(url, headers=headers)
            if res.status_code >= 400:
                return SupabaseDB._mock_action("DELETE", "github_members", None, {"id": f"eq.{member_id}"})
            return {"status": "deleted"}

    @staticmethod
    async def save_magic_link(link_data: dict):
        """Persist a magic link for B2B portal access."""
        return await SupabaseDB._request("POST", "github_links", data=link_data)

    @staticmethod
    async def get_active_links(admin_id: str):
        """Fetch all live streams for the admin."""
        return await SupabaseDB._request("GET", "github_links", params={"admin_id": f"eq.{admin_id}"})
