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

class SupabaseDB:
    @staticmethod
    async def _request(method: str, table: str, data: dict = None, params: dict = None):
        """Perform a direct REST call to Supabase."""
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            return None
            
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
            
            res.raise_for_status()
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
