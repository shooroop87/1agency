# backend/core/management/commands/test_email.py
from django.core.management.base import BaseCommand
from django.conf import settings
from core.email import send_email


class Command(BaseCommand):
    help = 'Test email sending via Gmail API'

    def add_arguments(self, parser):
        parser.add_argument(
            '--to',
            type=str,
            default=None,
            help='Recipient email (default: ADMIN_EMAIL from settings)'
        )

    def handle(self, *args, **options):
        to_email = options['to'] or settings.ADMIN_EMAIL
        
        self.stdout.write(f"Sending test email to: {to_email}")
        self.stdout.write(f"Email backend: {settings.EMAIL_BACKEND_TYPE}")
        
        subject = "Test Email from One Agency"
        body_text = """
        This is a test email from One Agency website.
        
        If you received this, email configuration is working correctly!
        
        --
        One Agency
        """
        
        body_html = """
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #E08A72;">Test Email</h2>
            <p>This is a test email from <strong>One Agency</strong> website.</p>
            <p>If you received this, email configuration is working correctly! ✓</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">One Agency</p>
        </div>
        """
        
        result = send_email(
            to=to_email,
            subject=subject,
            body_text=body_text,
            body_html=body_html,
        )
        
        if result:
            self.stdout.write(self.style.SUCCESS('✓ Email sent successfully!'))
        else:
            self.stdout.write(self.style.ERROR('✗ Failed to send email'))
            self.stdout.write('Check logs for details')