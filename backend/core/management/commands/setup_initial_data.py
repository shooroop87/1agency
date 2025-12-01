# backend/core/management/commands/setup_initial_data.py
from django.core.management.base import BaseCommand
from core.models import SiteSettings, PopupSettings


class Command(BaseCommand):
    help = 'Setup initial site data'

    def handle(self, *args, **options):
        # Site Settings
        site = SiteSettings.load()
        site.set_current_language('en')
        site.site_name = 'One Agency'
        site.site_description = 'Smart investing with a human touch'
        site.save()
        
        site.set_current_language('ru')
        site.site_name = 'One Agency'
        site.site_description = 'Умные инвестиции с человеческим подходом'
        site.save()
        
        self.stdout.write(self.style.SUCCESS('✓ Site settings created'))

        # Popup Settings
        popups_data = [
            {
                'popup_type': 'callback',
                'en': {
                    'title': 'Request a callback using this form',
                    'button_text': 'Send',
                    'success_title': 'Thank you!',
                    'success_message': 'We will call you back soon.',
                },
                'ru': {
                    'title': 'Запросите обратный звонок',
                    'button_text': 'Отправить',
                    'success_title': 'Спасибо!',
                    'success_message': 'Мы перезвоним вам в ближайшее время.',
                },
            },
            {
                'popup_type': 'service',
                'en': {
                    'title': 'Request a service',
                    'subtitle': 'Please fill out the form below.',
                    'button_text': 'Send',
                    'success_title': 'Thank you!',
                    'success_message': 'Your request has been submitted.',
                },
                'ru': {
                    'title': 'Заказать услугу',
                    'subtitle': 'Пожалуйста, заполните форму.',
                    'button_text': 'Отправить',
                    'success_title': 'Спасибо!',
                    'success_message': 'Ваша заявка отправлена.',
                },
            },
            {
                'popup_type': 'faq',
                'en': {
                    'title': 'Ask your question',
                    'button_text': 'Send',
                    'success_title': 'Thank you!',
                    'success_message': 'Your question has been submitted.',
                },
                'ru': {
                    'title': 'Задайте ваш вопрос',
                    'button_text': 'Отправить',
                    'success_title': 'Спасибо!',
                    'success_message': 'Ваш вопрос отправлен.',
                },
            },
        ]

        for popup_data in popups_data:
            popup, created = PopupSettings.objects.get_or_create(
                popup_type=popup_data['popup_type']
            )
            
            popup.set_current_language('en')
            popup.title = popup_data['en']['title']
            popup.subtitle = popup_data['en'].get('subtitle', '')
            popup.button_text = popup_data['en']['button_text']
            popup.success_title = popup_data['en']['success_title']
            popup.success_message = popup_data['en']['success_message']
            popup.save()
            
            popup.set_current_language('ru')
            popup.title = popup_data['ru']['title']
            popup.subtitle = popup_data['ru'].get('subtitle', '')
            popup.button_text = popup_data['ru']['button_text']
            popup.success_title = popup_data['ru']['success_title']
            popup.success_message = popup_data['ru']['success_message']
            popup.save()
            
            status = 'created' if created else 'updated'
            self.stdout.write(f'✓ Popup "{popup_data["popup_type"]}" {status}')

        self.stdout.write(self.style.SUCCESS('\n✅ Initial data setup complete!'))
