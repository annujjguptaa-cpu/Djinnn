from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import RedirectResponse
import httpx
from settings import settings

router = APIRouter(prefix="/linkedin", tags=["auth"])

@router.get("/login")
async def linkedin_login(wish_id: str = Query(None)):
    """Step 1: Redirect the user to LinkedIn's OAuth 2.0 authorization page."""
    if not settings.LINKEDIN_CLIENT_ID:
        raise HTTPException(status_code=500, detail="LINKEDIN_CLIENT_ID not configured")
    
    # Passing wish_id into the state parameter to preserve context
    state = wish_id if wish_id else "random_string_123"
    
    import urllib.parse
    params = {
        "response_type": "code",
        "client_id": settings.LINKEDIN_CLIENT_ID,
        "redirect_uri": settings.LINKEDIN_REDIRECT_URI,
        "state": state,
        "scope": "w_member_social profile openid email",
    }
    
    encoded_params = urllib.parse.urlencode(params)
    url = f"https://www.linkedin.com/oauth/v2/authorization?{encoded_params}"
    return RedirectResponse(url)

@router.get("/callback")
async def linkedin_callback(code: str = Query(None), state: str = Query(None), error: str = Query(None)):
    """Step 2: Handle the callback from LinkedIn and exchange the code for an access token."""
    if error:
        return RedirectResponse(f"{settings.FRONTEND_URL}/wish/error?error={error}")
    
    if not code:
        raise HTTPException(status_code=400, detail="No code provided")

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            data={
                "grant_type": "authorization_code",
                "code": code,
                "client_id": settings.LINKEDIN_CLIENT_ID,
                "client_secret": settings.LINKEDIN_CLIENT_SECRET,
                "redirect_uri": settings.LINKEDIN_REDIRECT_URI,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if response.status_code != 200:
            print("------- BLACK BOX: TOKEN EXCHANGE FAILED -------")
            print(f"Status: {response.status_code}")
            print(f"Body: {response.text}")
            return RedirectResponse(f"{settings.FRONTEND_URL}/wish/error?error=token_exchange_failed")
            
        data = response.json()
        print(f"Token exchange success. Scopes: {data.get('scope')}")
        access_token = data.get("access_token")
        
        # Extract wish_id from state (which we set in Step 1)
        wish_id = state if state and state != "random_string_123" else "error"
        
        # Redirect back to the specific wish page with the token
        return RedirectResponse(f"{settings.FRONTEND_URL}/wish/{wish_id}?token={access_token}")
