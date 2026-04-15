import os
import httpx
from services.ai_engine import AIEngine

class AIReadmeService:
    @staticmethod
    async def generate_readme(project_name: str, files_summary: str) -> str:
        """Uses AI to generate a professional README based on project files."""
        prompt = (
            f"Generate a professional, high-impact README.md for a project named '{project_name}'.\n"
            f"Here is a summary of the files and tech stack detected:\n{files_summary}\n\n"
            "Include sections for: Features, Tech Stack, Installation, and Usage. "
            "Make it look like a top-tier open-source project. Use standard Markdown."
        )
        
        # Using the existing AIEngine (Claude/Gemini)
        return await AIEngine.generate_text(prompt)
