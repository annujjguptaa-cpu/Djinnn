import anthropic
import google.generativeai as genai
from typing import Optional
from settings import settings

class AIEngine:
    @staticmethod
    async def generate_text(prompt: str, engine: str = "claude") -> str:
        """Standardized text generation with automatic fallback to Gemini."""
        
        # 1. Try Claude (High Precision)
        if engine == "claude" and settings.ANTHROPIC_API_KEY:
            try:
                client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
                message = client.messages.create(
                    model="claude-3-5-sonnet-20240620",
                    max_tokens=2000,
                    messages=[{"role": "user", "content": prompt}]
                )
                return message.content[0].text
            except Exception as e:
                print(f"Claude failed, falling back: {e}")

        # 2. Try Gemini (High Velocity / Default)
        if settings.GEMINI_API_KEY:
            try:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                model = genai.GenerativeModel("gemini-1.5-pro")
                response = model.generate_content(prompt)
                return response.text
            except Exception as e:
                print(f"Gemini failed: {e}")

        return "AI content generation unavailable. Please check your API keys."

    @staticmethod
    async def generate_readme(project_summary: str, template_format: str, engine: str = "claude") -> str:
        """Generate a project README using the standardized text engine."""
        prompt = (
            f"You are a Senior Technical Writer for Djinn B2B.\n"
            f"Generate a professional README.md for the following project details:\n{project_summary}\n\n"
            f"IMPORTANT: Follow this specific format: {template_format}\n"
            f"Output ONLY the markdown content for the file."
        )
        return await AIEngine.generate_text(prompt, engine=engine)
