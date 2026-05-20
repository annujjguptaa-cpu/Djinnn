import os
import json
import re
import httpx
from settings import settings

# Active Provider Detection
ACTIVE_PROVIDER = None

# Initialize API Keys
GROQ_KEY = settings.GROQ_API_KEY or os.environ.get("GROQ_API_KEY", "")
GOOGLE_KEY = settings.GOOGLE_API_KEY or settings.GEMINI_API_KEY or os.environ.get("GOOGLE_API_KEY", "")
CLAUDE_KEY = settings.ANTHROPIC_API_KEY or os.environ.get("ANTHROPIC_API_KEY", "")
OPENAI_KEY = settings.OPENAI_API_KEY or os.environ.get("OPENAI_API_KEY", "")

if GROQ_KEY:
    ACTIVE_PROVIDER = "GROQ"
elif GOOGLE_KEY:
    ACTIVE_PROVIDER = "GOOGLE"
elif CLAUDE_KEY:
    ACTIVE_PROVIDER = "CLAUDE"
elif OPENAI_KEY:
    ACTIVE_PROVIDER = "OPENAI"
else:
    ACTIVE_PROVIDER = "MOCK"

print(f"=========================================")
print(f"🤖 ACTIVE AI PROVIDER DETECTED: {ACTIVE_PROVIDER}")
print(f"=========================================")

def parse_json_safely(text: str) -> dict:
    """Helper to parse JSON from AI response, cleaning markdown syntax if present."""
    # Find JSON blocks
    match = re.search(r"```json\s*(.*?)\s*```", text, re.DOTALL)
    if match:
        text = match.group(1)
    else:
        # Try finding anything between { and }
        match = re.search(r"(\{.*\})", text, re.DOTALL)
        if match:
            text = match.group(1)
    
    try:
        return json.loads(text.strip())
    except Exception as e:
        print(f"JSON parsing error: {e}. Raw text was: {text}")
        return {}

async def call_ai(prompt: str, system_prompt: str = "You are Djinn, a helpful AI Action Agent.", json_mode: bool = False) -> str:
    """Calls the first available AI provider based on priority."""
    if ACTIVE_PROVIDER == "GROQ":
        try:
            async with httpx.AsyncClient() as client:
                headers = {
                    "Authorization": f"Bearer {GROQ_KEY}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": "llama-3.1-8b-instant",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ]
                }
                if json_mode:
                    payload["response_format"] = {"type": "json_object"}
                    
                res = await client.post("https://api.groq.com/openai/v1/chat/completions", json=payload, headers=headers, timeout=30.0)
                if res.status_code == 200:
                    return res.json()["choices"][0]["message"]["content"]
                else:
                    print(f"Groq API Error {res.status_code}: {res.text}")
        except Exception as e:
            print(f"Groq failed: {e}")

    elif ACTIVE_PROVIDER == "GOOGLE":
        try:
            import google.generativeai as genai
            genai.configure(api_key=GOOGLE_KEY)
            model = genai.GenerativeModel(
                model_name='gemma-3-27b-it',
                system_instruction=system_prompt
            )
            config = {}
            if json_mode:
                config["response_mime_type"] = "application/json"
                
            res = model.generate_content(prompt, generation_config=config)
            return res.text
        except Exception as e:
            print(f"Google AI Studio failed: {e}")

    elif ACTIVE_PROVIDER == "CLAUDE":
        try:
            from anthropic import Anthropic
            client = Anthropic(api_key=CLAUDE_KEY)
            # Synchronous client wrapper (fastapi handles async worker thread pools)
            # To prevent blocking, we can run inside a thread executor or just run it directly.
            # Using raw HTTP endpoint or SDK in thread.
            message = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=1024,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            return message.content[0].text
        except Exception as e:
            print(f"Claude failed: {e}")

    elif ACTIVE_PROVIDER == "OPENAI":
        try:
            from openai import OpenAI
            client = OpenAI(api_key=OPENAI_KEY)
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ]
            }
            if json_mode:
                payload["response_format"] = {"type": "json_object"}
            res = client.chat.completions.create(**payload)
            return res.choices[0].message.content
        except Exception as e:
            print(f"OpenAI failed: {e}")

    # Fallback / Mock Mode
    print("AI Providers unavailable. Executing Mock Response.")
    if json_mode:
        return '{"mock": true, "message": "This is a mock JSON response from Djinn"}'
    return "This is a mock text response from the Djinn agent."

# Specific AI Functions

async def generate_cover_letter(job_title: str, company_name: str, job_description: str, resume_content: str) -> str:
    system_prompt = "You are a professional career advisor writing customized cover letters."
    prompt = f"""
    Write a personalized cover letter of between 250 and 300 words.
    
    Target Job: {job_title}
    Company: {company_name}
    Job Description: {job_description}
    Resume Content: {resume_content}
    
    Format the output nicely. Ensure it is professional, engaging, and highlights matching skills.
    """
    return await call_ai(prompt, system_prompt)

async def parse_resume(resume_content: str) -> dict:
    system_prompt = "You are an AI resume parser. You extract structured data from resume texts. You must return a raw JSON object."
    prompt = f"""
    Parse this resume and extract:
    1. name
    2. email
    3. phone
    4. skills (array of strings)
    5. experience (array of strings/objects)
    6. education (array of strings/objects)
    
    Resume content:
    {resume_content}
    
    Return a JSON object conforming exactly to this structure:
    {{
        "name": "",
        "email": "",
        "phone": "",
        "skills": [],
        "experience": [],
        "education": []
    }}
    """
    res = await call_ai(prompt, system_prompt, json_mode=True)
    return parse_json_safely(res)

async def evaluate_scholarship_fit(scholarship_criteria: str, student_profile: str) -> dict:
    system_prompt = "You are an academic advisor evaluating scholarship applications. Return a raw JSON object."
    prompt = f"""
    Evaluate the fit between the student's profile and the scholarship criteria.
    Provide:
    1. fit_score: Integer from 1 to 10.
    2. strengths: Array of strings.
    3. gaps: Array of strings.
    4. application_strategy: A brief strategy paragraph.
    
    Scholarship Criteria: {scholarship_criteria}
    Student Profile: {student_profile}
    
    Return a JSON object:
    {{
        "fit_score": 0,
        "strengths": [],
        "gaps": [],
        "application_strategy": ""
    }}
    """
    res = await call_ai(prompt, system_prompt, json_mode=True)
    return parse_json_safely(res)

async def generate_scholarship_essay(scholarship_name: str, scholarship_focus: str, student_profile: str) -> str:
    system_prompt = "You are an expert essay writer assisting students with scholarship essays."
    prompt = f"""
    Write a compelling scholarship essay of between 400 and 500 words.
    
    Scholarship Name: {scholarship_name}
    Focus/Theme: {scholarship_focus}
    Student Profile: {student_profile}
    
    The essay should sound authentic, passionate, and demonstrate merit and alignment with the scholarship's goals.
    """
    return await call_ai(prompt, system_prompt)

async def generate_vc_outreach_message(startup_description: str, vc_name: str, partner_name: str, portfolio_summary: str, message_tone: str) -> str:
    system_prompt = "You are an expert startup founder doing outbound investor networking."
    prompt = f"""
    Draft a personalized LinkedIn outreach message under 300 characters (extremely concise).
    
    Startup: {startup_description}
    VC Firm: {vc_name}
    Partner Name: {partner_name}
    Portfolio Focus: {portfolio_summary}
    Tone: {message_tone}
    
    Avoid corporate jargon. Be direct and clear about the value prop.
    """
    return await call_ai(prompt, system_prompt)

async def generate_cold_email(prospect_name: str, prospect_role: str, prospect_company: str, prospect_recent_activity: str, value_proposition: str, campaign_goal: str) -> dict:
    system_prompt = "You are a sales copywriter writing cold emails. Return a raw JSON object."
    prompt = f"""
    Write a cold email to:
    Prospect: {prospect_name} ({prospect_role} at {prospect_company})
    Recent Activity: {prospect_recent_activity}
    Value Prop: {value_proposition}
    Goal: {campaign_goal}
    
    Return a JSON object containing:
    1. subject (Catchy, brief subject line)
    2. body (Under 150 words, punchy call-to-action)
    
    JSON format:
    {{
        "subject": "",
        "body": ""
    }}
    """
    res = await call_ai(prompt, system_prompt, json_mode=True)
    return parse_json_safely(res)

async def generate_followup_message(original_context: str, days_since_original: int, recipient_role: str, follow_up_number: int) -> str:
    system_prompt = "You are a sales representative writing polite follow-up messages."
    prompt = f"""
    Write a follow-up message under 100 words.
    
    Context: {original_context}
    Days since last contact: {days_since_original}
    Recipient Role: {recipient_role}
    Follow up # (1, 2, or 3): {follow_up_number}
    
    Keep it respectful, quick, and value-focused.
    """
    return await call_ai(prompt, system_prompt)

async def research_prospect(prospect_name: str, prospect_role: str, prospect_company: str) -> dict:
    system_prompt = "You are a sales researcher gathering intelligence on a prospect. Return a raw JSON object."
    prompt = f"""
    Synthesize research on:
    Name: {prospect_name}
    Role: {prospect_role}
    Company: {prospect_company}
    
    Return a JSON object:
    {{
        "key_interests": ["list of interests"],
        "recent_focus": "what the company or role is focusing on",
        "conversation_hooks": ["hooks to start a chat"],
        "best_outreach_angle": "recommended angle"
    }}
    """
    res = await call_ai(prompt, system_prompt, json_mode=True)
    return parse_json_safely(res)
