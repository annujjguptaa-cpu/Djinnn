import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from settings import settings
import os

def send_waitlist_email(to_email: str, wish_name: str, topic_name: str):
    """
    Sends a stylized HTML confirmation email to the user joining the waitlist.
    """
    smtp_email = settings.SMTP_EMAIL
    smtp_password = settings.SMTP_PASSWORD

    if not smtp_email or not smtp_password:
        print("Warning: SMTP_EMAIL or SMTP_PASSWORD not set in environment variables. Email will not be sent.")
        return

    # Create the email message
    msg = MIMEMultipart("alternative")
    msg['Subject'] = f"✨ You're on the Waitlist for {wish_name}!"
    msg['From'] = f"Djinn Platform <{smtp_email}>"
    msg['To'] = to_email

    # Fallback plain text
    text = f"""
    Hello!

    Your wish has been heard. You have successfully joined the waitlist for {wish_name} (Part of the {topic_name}).
    
    We are working hard to bring this feature to life and will notify you the moment it's ready.

    Best,
    The Djinn Team
    """

    # Stylized HTML
    html = f"""
    <html>
      <body style="background-color: #0a0a0f; color: #ffffff; font-family: sans-serif; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a2e; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; text-align: center;">
            <div style="padding: 40px 20px;">
                <div style="font-size: 48px; margin-bottom: 20px;">🪔</div>
                <h1 style="color: #ffffff; font-size: 24px; margin-bottom: 10px;">Your wish has been heard.</h1>
                <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                    You have successfully joined the waitlist for <strong>{wish_name}</strong>.
                </p>
                <div style="background-color: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); padding: 16px; border-radius: 12px; display: inline-block; margin-bottom: 30px;">
                    <span style="color: #c4b5fd; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">{topic_name}</span>
                </div>
                <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; padding: 0 20px;">
                    We are currently building this workflow in the Djinn forge. You will receive another raven (email) the moment it is ready for you to use.
                </p>
            </div>
            <div style="background-color: rgba(0,0,0,0.2); padding: 20px; font-size: 12px; color: #71717a;">
                Djinn — Omni-Platform AI Action Agent
            </div>
        </div>
      </body>
    </html>
    """

    part1 = MIMEText(text, 'plain')
    part2 = MIMEText(html, 'html')

    msg.attach(part1)
    msg.attach(part2)

    try:
        # Connect to Gmail SMTP (you can adjust this for SendGrid or others if needed)
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(smtp_email, smtp_password)
        server.sendmail(smtp_email, to_email, msg.as_string())
        server.quit()
        print(f"Successfully sent waitlist email to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {str(e)}")

