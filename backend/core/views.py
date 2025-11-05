# core/views.py
from django.shortcuts import render

def index(request):
    # Файл шаблона: /templates/index.html
    return render(request, "pages/index.html")
