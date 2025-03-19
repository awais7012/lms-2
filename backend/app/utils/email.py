import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

logger = logging.getLogger(__name__)

async def send_email(
    email_to: str,
    subject: str,
    html_content: str,
    text_content: str = None
) -> None:
    """
    Send email using SMTP.
    """
    if not settings.SMTP_HOST or not settings.SMTP_PORT:
        logger.warning("SMTP settings not configured, skipping email")
        return
    
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>"
    message["To"] = email_to
    
    if text_content:
        message.attach(MIMEText(text_content, "plain"))
    
    message.attach(MIMEText(html_content, "html"))
    
    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            if settings.SMTP_TLS:
                server.starttls()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(
                settings.EMAILS_FROM_EMAIL,
                email_to,
                message.as_string()
            )
        logger.info(f"Email sent to {email_to}")
    except Exception as e:
        logger.error(f"Failed to send email to {email_to}: {e}")
        raise

async def send_reset_password_email(email: str, otp: str) -> None:
    """
    Send password reset email with OTP.
    """
    subject = "Password Reset Request"
    
    html_content = f"""
    <html>
        <body>
            <h1>Password Reset Request</h1>
            <p>You have requested to reset your password. Use the following OTP code to verify your identity:</p>
            <h2 style="background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 24px;">{otp}</h2>
            <p>This code will expire in 15 minutes.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
        </body>
    </html>
    """
    
    text_content = f"""
    Password Reset Request
    
    You have requested to reset your password. Use the following OTP code to verify your identity:
    
    {otp}
    
    This code will expire in 15 minutes.
    
    If you did not request a password reset, please ignore this email.
    """
    
    await send_email(
        email_to=email,
        subject=subject,
        html_content=html_content,
        text_content=text_content
    )

async def send_verification_email(email: str) -> None:
    """
    Send email verification link.
    """
    subject = "Verify Your Email Address"
    
    html_content = f"""
    <html>
        <body>
            <h1>Welcome to the Learning Management System!</h1>
            <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
            <p><a href="http://localhost:3000/verify-email?email={email}">Verify Email</a></p>
            <p>If you did not sign up for an account, please ignore this email.</p>
        </body>
    </html>
    """
    
    text_content = f"""
    Welcome to the Learning Management System!
    
    Thank you for signing up. Please verify your email address by visiting the link below:
    
    http://localhost:3000/verify-email?email={email}
    
    If you did not sign up for an account, please ignore this email.
    """
    
    await send_email(
        email_to=email,
        subject=subject,
        html_content=html_content,
        text_content=text_content
    )

