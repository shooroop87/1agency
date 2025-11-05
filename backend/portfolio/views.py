from django.shortcuts import render

def portfolio_list(request):
    return render(request, 'portfolio/list.html')

def portfolio_detail(request, slug):
    return render(request, 'portfolio/detail.html')