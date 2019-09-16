import datetime
from datetime import datetime
from django.contrib.auth import login, authenticate, logout
from django.http import HttpResponse
from django.shortcuts import render, redirect

# Create your views here.
from django.urls import reverse

from App.forms import RegisterForm
from App.models import User
from tools.verifycode import VerifyCode




#首页
def yuding(request):


    return render(request,'app/yudingindex.html',locals())

#注册
def registerym(request):
    if request.method == 'POST':
        # 用POST数据实例化表单，表单对象会验证POST数据
        form = RegisterForm(request.POST)

        # 验证码验证
        yzm1 = request.POST.get('yzm')
        yzm2 = request.session.get('code')
        # print(yzm1,'yzm1')
        # print(yzm2, 'yzm2')
        # 判定验证码是否匹配
        res = (yzm1 == yzm2)
        # 如果验证码不匹配
        if not res:
            form.errors['yzm'] = "验证码不匹配"

        if res and form.is_valid():  # 验证通过
            # form.cleaned_data.pop('repassword')
            # form.cleaned_data.pop('yzm')
            # User.objects.create(**form.cleaned_data)
            # 基础写法
            email = form.cleaned_data.get('email')
            regtime = datetime.now()

            usertype = 0
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = User.objects.create_user(username=username, password=password, email=email, regtime=regtime,
                                            usertype=usertype)
            login(request, user)
            return redirect(reverse('app:yuding'))
        return render(request,'app/registerym.html',locals())
    else:
        form = RegisterForm()
        return render(request,'app/registerym.html',locals())
#用户登录
def user_login(request):
    if request.method=='POST':
         if request.POST.get('loginsubmit'):
             username = request.POST.get('username')
             password = request.POST.get('password')
             autologin = request.POST.get('cookietime')
             #验证成功返回用户对象，否则返回None
             user = authenticate(request,username=username,password=password)
             if user:
                 #判断是否自动登录
                 if autologin:
                     user.autologin = 1
                     user.save()

                 #登录写入session，并把user写入request
                 login(request,user)
             return  redirect(reverse('app:index'))

    return redirect(reverse('app:index'))

#退出登录
def user_logout(request):
    logout(request)
    return redirect(reverse('app:index'))

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