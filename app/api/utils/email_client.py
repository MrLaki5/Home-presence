import smtplib
import ssl
from model import db, AppUser


# Method for sending specific message to email with email credentials from db
def send_email(subject, message):
    try:
        # Merge message
        message = "Subject: " + subject + "\n" + message
        # Check for mail credentials
        app_user = AppUser.query.first()
        if not app_user:
            return False, "DB not initialized."
        # Create ssl context and send email
        context = ssl.create_default_context()
        with smtplib.SMTP(app_user["email_smtp_server"], app_user["email_port"]) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            server.login(app_user["email_sender"], app_user["email_sender_password"])
            server.sendmail(app_user["email_sender"], app_user["email_receiver"], message)
        return True, "Email sent."
    except Exception as ex:
        return False, str(ex)
