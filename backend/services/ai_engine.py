import anthropic
import google.generativeai as genai
from typing import Optional
from settings import settings

class AIEngine:
    @staticmethod
    async def generate_text(prompt: str, engine: str = "claude") -> str:
        """Standardized text generation with automatic fallback to Gemini and mock content."""
        
        # Helper to check if key is a placeholder
        def is_placeholder(key: str) -> bool:
            return not key or "..." in key or "your_" in key or len(key) < 15

        # 1. Try Claude (High Precision)
        if engine == "claude" and settings.ANTHROPIC_API_KEY and not is_placeholder(settings.ANTHROPIC_API_KEY):
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
        if settings.GEMINI_API_KEY and not is_placeholder(settings.GEMINI_API_KEY):
            try:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                model = genai.GenerativeModel("gemini-1.5-pro")
                response = model.generate_content(prompt)
                return response.text
            except Exception as e:
                print(f"Gemini failed: {e}")

        # 3. Try Ollama local (OpenAI-compatible fallback at http://localhost:11434/v1)
        try:
            import httpx
            with httpx.Client(timeout=4.0) as client:
                res = client.post(
                    "http://localhost:11434/v1/chat/completions",
                    json={
                        "model": "qwen2.5",
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.7
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                    if content:
                        print("Generated content via Ollama local fallback.")
                        return content
        except Exception as e:
            print(f"Ollama local fallback unavailable: {e}")

        # 3. Fallback to smart local mock data for demo purposes
        print("AI keys missing or invalid. Falling back to local mock generator.")
        prompt_lower = prompt.lower()
        import random
        
        if "connection message" in prompt_lower or "outreach" in prompt_lower or "connect" in prompt_lower:
            import re
            role_match = re.search(r"for a ([\w\s\-]+) in", prompt)
            role = role_match.group(1).strip() if role_match else "professional"
            loc_match = re.search(r"in ([\w\s\-,]+)\.", prompt)
            loc = loc_match.group(1).strip() if loc_match else "your area"
            
            mock_connection_messages = [
                f"Hi [Name],\n\nI came across your profile and was really impressed by your background as a {role} in {loc}. I'd love to connect and keep up with your work!",
                f"Hello [Name],\n\nI'm expanding my network of professional connections. I noticed you are working as a {role} in {loc}. Let's connect and share insights!",
                f"Hi [Name],\n\nI saw your profile and wanted to reach out. I'm always looking to connect with talented {role}s in the {loc} area. Let's stay in touch!"
            ]
            return random.choice(mock_connection_messages)
            
        elif "tweet" in prompt_lower or "x " in prompt_lower or "viral tweet" in prompt_lower:
            mock_tweets = [
                "Building something exciting with Djinn today! AI automation makes workflow management incredibly smooth. What are you building? 🚀 #buildinpublic #AI #automation",
                "Automated workflows are a game changer. Doing more in less time. 💡 #productivity #tech #development",
                "Celebrating progress today. Every step counts toward the bigger vision. Keep pushing! ✨ #mindset #growth #entrepreneur"
            ]
            return random.choice(mock_tweets)
            
        else:
            mock_posts = [
                "🚀 Excited to share this moment with my network!\n\nEvery great achievement starts with a single step. This progress represents hard work, dedication, and the right tools coming together.\n\n💡 What's the one thing you're working on this week that excites you most? Drop it in the comments!\n\n#Growth #LinkedIn #Innovation #Mindset #Networking",
                "✨ Big things are happening!\n\nI've been working on something incredible, and seeing it come to life is beyond rewarding. The journey is the destination — and I'm loving every second.\n\nDrop a 🔥 if you're also building something amazing right now!\n\n#BuildingInPublic #Startup #Entrepreneur #AI #TechCommunity",
                "🌟 Moments like these remind me why I do what I do.\n\nIn a world that moves fast, it's important to pause and celebrate progress — no matter how big or small. This milestone means a lot.\n\nTag someone who inspires you to keep going! 👇\n\n#Motivation #Leadership #PersonalGrowth #Career #Inspiration"
            ]
            return random.choice(mock_posts)

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
