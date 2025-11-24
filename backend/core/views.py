# core/views.py
from django.shortcuts import render

def home(request):
    return render(request, "pages/index.html")

# views.py
def about(request):
    bali_images = [f'{i:02}' for i in range(1, 17)]
    return render(request, 'pages/about-bali.html', {
        'bali_images': bali_images,
    })

def projects(request):
    return render(request, "pages/projects.html")

def error(request):
    return render(request, "pages/page-error.html")

# --- Кастомные страницы ошибок ---
def custom_404(request, exception):
    # ваш шаблон 404 лежит тут: templates/404/page-error.html
    return render(request, "pages/page-error.html", status=404)

def custom_500(request):
    # можно использовать тот же шаблон или сделать отдельный 500
    return render(request, "pages/page-error.html", status=500)