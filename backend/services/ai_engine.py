import anthropic
import google.generativeai as genai
from typing import Optional
from settings import settings

class AIEngine:
    @staticmethod
    async def generate_readme(project_summary: str, template_format: str, engine: str = "claude") -> str:
        """Generate a project README using Claude or Gemini."""
        
        prompt = (
            f"You are a Senior Technical Writer for Djinn B2B. "
            f"Generate a professional README.md for the following project: {project_summary}. "
            f"IMPORTANT: Follow this specific format defined by the Engineering Admin: {template_format}. "
            f"Output ONLY the markdown content."
        )

        if engine == "claude" and settings.ANTHROPIC_API_KEY:
            try:
                client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
                message = client.messages.create(
                    model="claude-3-opus-20240229",
                    max_tokens=2000,
                    messages=[{"role": "user", "content": prompt}]
                )
                return message.content[0].text
            except Exception as e:
                print(f"Claude failed, falling back to Gemini: {e}")
        
        # Fallback/Default: Gemini (Already integrated)
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-pro")
            response = model.generate_content(prompt)
            return response.text
            
        return "README generation failed. Please check AI API keys."
