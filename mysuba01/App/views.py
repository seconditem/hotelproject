import datetime

from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from tools.verifycode import VerifyCode




#首页
def yuding(request):

    return render(request,'app/yudingindex.html',locals())

#注册
def registerym(request):

    return render(request,'app/registerym.html',locals())

#验证码
def get_yzm(request):
    vc = VerifyCode()
    res = vc.output()
    request.session['code'] = vc.code
    return HttpResponse(res,'image/png')



#忘记密码(验证身份)
def findcode(request):

    return render(request,'app/findcode.html',locals())

#重置密码
def findcodetwo(request):

    # if request.method == "POST":
    #     a = 1
    return render(request, 'app/findcode2.html', locals())


def HotelDetail(request):
    return render(request, 'app/BookInfo.html', locals())