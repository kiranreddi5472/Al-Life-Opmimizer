from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.
def ongole(request):
    obj = HttpResponse('i love  my ongole')
    return obj