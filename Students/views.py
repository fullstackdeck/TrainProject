from django.shortcuts import render

# Create your views here.
def accueil(request):
    return render(request, 'Students/accueil.html', {})

def register(request):
    return render(request, 'Students/register/register.html', {})

def login(request):
    return render(request, 'Students/register/login.html', {})