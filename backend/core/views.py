# core/views.py
from django.shortcuts import render

def home(request):
    return render(request, "pages/index.html")

def about(request):
    return render(request, "pages/about-bali.html")

def projects(request):
    return render(request, "pages/projects.html")

# --- Кастомные страницы ошибок ---
def custom_404(request, exception):
    # ваш шаблон 404 лежит тут: templates/404/page-error.html
    return render(request, "pages/page-error.html", status=404)

def custom_500(request):
    # можно использовать тот же шаблон или сделать отдельный 500
    return render(request, "pages/page-error.html", status=500)