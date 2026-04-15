from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    GOOGLE_CLIENT_ID: str = ""
    
    LINKEDIN_CLIENT_ID: str = ""
    LINKEDIN_CLIENT_SECRET: str = ""
    LINKEDIN_REDIRECT_URI: str = "http://localhost:8000/api/auth/linkedin/callback"
    
    # X (Twitter) API Credentials
    X_CLIENT_ID: str = ""
    X_CLIENT_SECRET: str = ""
    X_REDIRECT_URI: str = "http://localhost:8000/api/auth/x/callback"
    
    APP_ENV: str = "development"
    FRONTEND_URL: str = "http://localhost:5173"
    
    # GitHub B2B Settings
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    GITHUB_REDIRECT_URI: str = "http://localhost:8000/api/auth/github/callback"
    
    # Supabase Settings
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    # AI Engine
    ANTHROPIC_API_KEY: str = ""
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
