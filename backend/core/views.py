# core/views.py
from django.shortcuts import render

def home(request):
    return render(request, "pages/index.html")

# --- Кастомные страницы ошибок ---
def custom_404(request, exception):
    # ваш шаблон 404 лежит тут: templates/404/page-error.html
    return render(request, "404/page-error.html", status=404)

def custom_500(request):
    # можно использовать тот же шаблон или сделать отдельный 500
    return render(request, "404/page-error.html", status=500)