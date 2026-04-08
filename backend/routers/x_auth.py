import hashlib
import base64
import secrets
import httpx
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import RedirectResponse
from settings import settings

router = APIRouter(prefix="/auth/x", tags=["x_auth"])

# In-memory code verifier storage (Simplified for demo)
# In production, use session or Redis
verifiers: dict = {}

def get_pkce_pair():
    """Generate PKCE code_verifier and code_challenge."""
    verifier = secrets.token_urlsafe(64)
    # Hash the verifier using SHA256
    sha256_hash = hashlib.sha256(verifier.encode('utf-8')).digest()
    # Base64 encode the hash
    challenge = base64.urlsafe_b64encode(sha256_hash).decode('utf-8').replace('=', '')
    return verifier, challenge

@router.get("/login")
async def x_login(wish_id: str = Query(None)):
    """Step 1: Redirect the user to X (Twitter) OAuth 2.0 authorization page."""
    if not settings.X_CLIENT_ID:
        raise HTTPException(status_code=500, detail="X_CLIENT_ID not configured")
    
    verifier, challenge = get_pkce_pair()
    
    # Store the verifier tied to the state (wish_id)
    state = wish_id if wish_id else "random_state_123"
    verifiers[state] = verifier
    
    params = {
        "response_type": "code",
        "client_id": settings.X_CLIENT_ID,
        "redirect_uri": settings.X_REDIRECT_URI,
        "state": state,
        "code_challenge": challenge,
        "code_challenge_method": "S256",
        "scope": "tweet.read tweet.write users.read offline.access media.write",
    }
    
    url = f"https://twitter.com/i/oauth2/authorize?" + "&".join([f"{k}={v}" for k, v in params.items()])
    return RedirectResponse(url)

@router.get("/callback")
async def x_callback(code: str = Query(None), state: str = Query(None), error: str = Query(None)):
    """Step 2: Handle the callback from X and exchange the code for an access token."""
    if error:
        return RedirectResponse(f"{settings.FRONTEND_URL}/wish/error?error={error}")
    
    if not code:
        raise HTTPException(status_code=400, detail="No code provided")

    # Retrieve the verifier we stored earlier
    verifier = verifiers.get(state)
    if not verifier:
        raise HTTPException(status_code=400, detail="State mismatch or expired session")

    async with httpx.AsyncClient() as client:
        # X OAuth 2.0 Token Exchange requires Basic Auth with Client ID/Secret
        auth_header = base64.b64encode(f"{settings.X_CLIENT_ID}:{settings.X_CLIENT_SECRET}".encode()).decode()
        
        response = await client.post(
            "https://api.twitter.com/2/oauth2/token",
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": settings.X_REDIRECT_URI,
                "code_verifier": verifier,
            },
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": f"Basic {auth_header}"
            }
        )
        
        if response.status_code != 200:
            print(f"X Token Exchange Error: {response.status_code} - {response.text}")
            return RedirectResponse(f"{settings.FRONTEND_URL}/wish/error?error=x_token_exchange_failed")
            
        data = response.json()
        access_token = data.get("access_token")
        
        # Cleanup
        if state in verifiers: del verifiers[state]
        
        # Redirect back to the wish page
        return RedirectResponse(f"{settings.FRONTEND_URL}/wish/{state}?token={access_token}&platform=x")
