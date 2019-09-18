import datetime
from datetime import datetime
from random import randint

from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render, redirect

# Create your views here.
from django.urls import reverse

from App.forms import RegisterForm
from App.models import *
from tools.sms import send_sms
from tools.verifycode import VerifyCode




#首页
def yuding(request,order = 0):
    order = int(order)
    if request.method == 'POST':
    #房间排序选择
        if order == 1 : # 1 代表给出官网价格价格最低的可用房间
            roomstyles = RoomStyle.objects.ordered()
            print(roomstyles,'按价格排序')


    roomstyles = RoomStyle.objects.all() #所有房间展示
    return render(request,'app/yudingindex.html',locals())

#注册
def registerym(request):
    if request.method == 'POST':
        # 用POST数据实例化表单，表单对象会验证POST数据
        form = RegisterForm(request.POST)
        print('++++++++++++进入注册了+++++++')

        # 验证码验证
        yzm1 = request.POST.get('yzm')
        yzm2 = request.session.get('code')
        #手机验证码
        sjyzm1 = request.POST.get('sjyzm')
        sjyzm2 = request.session.get('code1')
        print(sjyzm2,'正确的手机验证码','前台输入的：',sjyzm1)
        res2 = sjyzm1 == sjyzm2
        # print(yzm1,'yzm1')
        # print(yzm2, 'yzm2')
        # 判定验证码是否匹配
        res = (yzm1 == yzm2)
        # 如果验证码不匹配

        if not res:
            form.errors['yzm'] = "验证码不匹配"

        if not res2:
            form.errors['sjyzm'] = "手机验证码不正确"

        if res and form.is_valid() and res2:  # 验证通过
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
def loginym(request):
    if request.method=='POST':
         print('12000000000000000000')
         username = request.POST.get('username')
         password = request.POST.get('password')

         #验证成功返回用户对象，否则返回None
         user = authenticate(request,username=username,password=password)
         if user:
             #登录写入session，并把user写入request
             print('000000000000000000')
             login(request,user)
             return redirect(reverse('app:yuding'))

         return render(request, 'app/loginym.html', locals())
    return render(request, 'app/loginym.html', locals())



#退出登录
def userlogout(request):
    logout(request)
    return redirect(reverse('app:yuding'))

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



def hoteldetail(request):
    roomstyles = RoomStyle.objects.all()

    return render(request, 'app/hoteldetail.html', locals())

@login_required(login_url='/loginym/')
def makeorder(request,rid):
    print(rid,'11111111')
    roomstyle = RoomStyle.objects.get(pk=rid)
    return render(request, 'app/BookInfo.html', locals())





def phoneyzm(request,*args,**kwargs):
    data = dict(request.GET)
    phnumber = data['phonenum'][0]
    print(data,'88888000888888888')
    print(phnumber,'前台的输入手机号')

    num = str(randint(10000, 1000000))
    res = send_sms(phnumber, {'number': num})
    #写入session
    request.session['code1'] = num
    print(res, num, 'num就是验证码')

    return HttpResponse(res,'image/png')

