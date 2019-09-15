from django.shortcuts import render

# Create your views here.
def index(request):


    return render(request,'app/shouye.html',locals())


def yuding(request):

    return render(request,'app/yudingindex.html',locals())