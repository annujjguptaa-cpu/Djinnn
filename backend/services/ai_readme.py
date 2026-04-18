import os
import httpx
from services.ai_engine import AIEngine

class AIReadmeService:
    @staticmethod
    async def generate_readme(project_name: str, files_summary: str) -> str:
        """Uses AI to generate a professional README based on project files."""
        prompt = (
            f"Generate a professional, high-impact README.md for a project named '{project_name}'.\n"
            f"The goal is to make it look like a top-tier open-source repository.\n\n"
            f"PROJECT CONTEXT:\nProject Name: {project_name}\nFiles Detected: {files_summary}\n\n"
            "INSTRUCTIONS:\n"
            "1. Detect the likely tech stack (e.g., React, Python, FastAPI, Node.js) from the files provided.\n"
            "2. Write a compelling hero description.\n"
            "3. Include a 'Features' section with bullet points.\n"
            "4. Include a 'Tech Stack' section using appropriate icons or badges where possible.\n"
            "5. Provide standard 'Installation' and 'Quick Start' instructions.\n"
            "6. End with a professional 'License' (MIT) and 'Contribution' section.\n"
            "7. Use premium Markdown formatting (bold headers, code blocks, lists).\n\n"
            "Output ONLY the Markdown content for the README.md file."
        )
        
        # Using the existing AIEngine (Claude/Gemini)
        return await AIEngine.generate_text(prompt)
