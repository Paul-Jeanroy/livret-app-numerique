from django.shortcuts import render
from .models import Apprenti, Referentiel

def index(request):
    apprentis = Apprenti.objects.all()
    return render(request, 'apprentis/index.html', {'apprentis': apprentis})

def referentiels(request):
    referentiels = Referentiel.objects.all()
    return render(request, 'apprentis/referentiels.html', {'referentiels': referentiels})