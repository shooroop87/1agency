from django import template
from django.utils.safestring import mark_safe
from core.models import CodeSnippet

register = template.Library()

@register.simple_tag(takes_context=True)
def render_snippets(context, location):
    """Render code snippets for specific location"""
    request = context.get('request')
    path = request.path if request else '/'
    
    snippets = CodeSnippet.objects.filter(
        is_active=True,
        location=location
    ).order_by('priority')
    
    output = []
    for snippet in snippets:
        # Проверка страниц
        if not snippet.show_on_all:
            pages = [p.strip() for p in snippet.pages.split('\n') if p.strip()]
            if pages and path not in pages:
                continue
        
        output.append(snippet.code)
    
    return mark_safe('\n'.join(output))