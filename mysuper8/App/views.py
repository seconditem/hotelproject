import datetime
from datetime import datetime
from random import randint

from alipay import AliPay
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect

# Create your views here.
from django.urls import reverse
from rest_framework.decorators import api_view


from App.forms import RegisterForm
from App.models import *
from mysuba import settings
from tools.sms import send_sms
from tools.verifycode import VerifyCode




#首页
def yuding(request,order = 0):
    order = int(order)
    rooms = RoomStyle.objects.all()
    #将空闲房间数量写进roomstyle表里
    for roomstyle in rooms:
        roomstyle.num = Room.objects.filter(typeid=roomstyle.id).filter(room_status=2).count()
        roomstyle.save()
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
        #获取手机号
        phoneunm = request.POST.get('phonenum')
        print(phoneunm,'手机号')
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
            phone = phoneunm
            usertype = 0
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = User.objects.create_user(username=username, password=password, email=email, regtime=regtime,usertype=usertype,phone = phone)
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
         #验证码对比
         yzm1 = request.POST.get('ImgCode')
         yzm2 = request.session.get('code')
         print('实际验证码====>',yzm2,'用户输入===>',yzm1)
         res = yzm1 == yzm2
         restyzm = ''
         if  not res:
             restyzm = "验证码不匹配"
         #验证成功返回用户对象，否则返回None
         user = authenticate(request,username=username,password=password)
         if user and res:
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
    print(request.POST,"修改密码第一层收到的数据")
    userphone = request.POST.get('phone')
    print(userphone,'--')
    curuser = User.objects.filter(phone=userphone).first()
    sjyzm1 = request.POST.get('rpcode')
    sjyzm2 = request.session.get('code1')
    print(sjyzm1,'前台写的验证码',sjyzm2,'后台收到的验证码')
    error = ''
    print(curuser,'----------')

    if request.method == 'POST':
        if curuser and sjyzm2:
            if sjyzm1 == sjyzm2:
                return redirect(reverse('app:findcodetwo', args=[curuser.uid]))
            else:
                error = '手机验证码不正确'
    return render(request,'app/findcode.html',locals())

#重置密码
def findcodetwo(request , uid = 0 ):
    #当前用户为
    curuser = User.objects.get(pk=int(uid))

    if request.method == "POST":
        print(request.POST,'修改密码第二层设置密码')
        newcode = request.POST.get("UsPwd")
        confignewcode = request.POST.get("UsPwd2")
        print(newcode,'第一次的密码设置',confignewcode,'<++++++第二次的密码设置')
        if newcode == confignewcode:
            print('进入了修改密码if')
            curuser.set_password(newcode)
            curuser.save()
            print('修改成功')
            return render(request, 'app/findcode3.html', locals())
        else:
            error = '两次输入的密码不一致'
    return render(request, 'app/findcode2.html', locals())
#密码重置成功的跳转
def findcodesan(request):
    return render(request, 'app/findcode3.html', locals())



def hoteldetail(request):
    roomstyles = RoomStyle.objects.all()
    reflexs = Reflex.objects.all()
    return render(request, 'app/hoteldetail.html', locals())


#预订订单
@login_required(login_url='/loginym/')
def makeorder(request,rid):#rid 是房间类型
    print(rid,'11111111')
    #该类型剩余的数量
    roomcount = Room.objects.filter(typeid=rid).filter(room_status=2).count()
    roomcountlist = []
    for i in range(roomcount):
        roomcountlist.append(i+1)

    # print(roomcountlist,'列表')
    # print(roomcount,'剩余数量')
    roomstyle = RoomStyle.objects.get(pk=rid)
    if request.method == 'POST':
        print(request.POST,'收到的订单数据')
        cheak_in = request.POST.get('ruzhu')
        cheak_out = request.POST.get('lidian')
        username = request.POST.get("GstsName")
        order_room_num = request.POST.get('order_room_num')
        #更改对应的房间状态
        order_room_ids = ""
        for i in range(int(order_room_num)):
            room = Room.objects.filter(typeid=rid).filter(room_status=2).first()
            room.room_status = 4
            order_room_ids = order_room_ids +str(room.id) +","
            room.save()
            print(room.id,'空闲房间的id')
            print(i,'次数')

        print('00000o0o0o0o0o0o0o0',order_room_ids,'idididididididididissssss')
        print(order_room_num,'房间数')
        last_intime = request.POST.get("last_time")
        ContactMobile = request.POST.get('ContactMobile')
        curroomstyle = RoomStyle.objects.get(pk=rid)
        print(curroomstyle.webprice,'看看这里是不是800？')
        tolprice = roomstyle.webprice * int(order_room_num)
        print(rid, '21111111')
        user_id= request.user.uid
        desc = roomstyle.desc
        Order.objects.create(user_id_id=user_id,username=username,
                             order_room_num=order_room_num,last_in_time=datetime.now(),
                             room_id=rid,order_status=0,create_time=datetime.now(),
                             check_in_time=cheak_in,check_out_time=cheak_out,
                             price=tolprice,phone=ContactMobile,order_room_ids = order_room_ids)
        order = Order.objects.all().last()
        return redirect(reverse('app:confirmorder', args=[order.id]))

    return render(request, 'app/BookInfo.html', locals())
#确认订单
def confirmorder(request,id):
    id = int(id)
    order = Order.objects.get(pk=id)
    #计算天数
    days = order.check_out_time - order.check_in_time
    days = int(str(days)[0])
    print(days,'天数')
    order.price = int(order.price)*days
    order.save()
    order.check_in_time = str(order.check_in_time).split(' ')[0]
    order.check_out_time = str(order.check_out_time).split(' ')[0]
    order = Order.objects.get(pk=id)
    print(order.order_room_num,'《《《《《《《《《《《《房间数',order.price,'《《《《《《总价',days,'《《《《《《《《《《《天数')
    print(order.room.desc,'方形')
    return render(request,'app/confirmorder.html',locals())



#手机验证码
def phoneyzm(request,*args,**kwargs):
    data = dict(request.GET)
    phnumber = data['phonenum'][0]
    print(data,'88888000888888888')
    print(phnumber,'前台的输入手机号')
    num = str(randint(10000, 1000000))
    print('------------------------',num)
    res = send_sms(phnumber, {'number': num})
    #写入session
    request.session['code1'] = num
    print(res, num, 'num就是验证码')

    return HttpResponse(res,'image/png')

#我的订单
def myorderdetail(request):
    myorder=request.GET.get('myorder')

    uid = request.user.uid
    #筛选已预订，未入住0
    if myorder == '1':
        myorderdetails = Order.objects.filter(user_id=uid).filter(order_status=0)
    #待评价，必须是已入住订单1才可以评价
    elif myorder == '3':

        myorderdetails = Order.objects.filter(user_id=uid).filter(order_status=1)
    else:
        myorderdetails = Order.objects.filter(user_id=uid)

    return render(request,'app/myorderdetail.html',locals())

#订单评价
def hotelreflex(request):
    #当前订单评价的id
    order_id =request.GET.get('myorderdetail_id')
    print(order_id,type(order_id),'====')
    if request.method=='POST':
        print(request.POST.get('reflex'),'111')
        #评价写入数据库
        content = request.POST.get('reflex')
        create_time= datetime.now()
        level = 4
        score = 100
        order_id = int(order_id)
        Reflex.objects.create(create_time=create_time,level=level,
                              content=content,score=score,order_id=order_id)
        # 当前订单状态由已入住未评价1转为已入住已评价3
        orders = Order.objects.get(pk=order_id)
        orders.order_status = 3
        orders.save()
        return redirect(reverse('app:myorderdetail'))

    return render(request,'app/hotelreflex.html',locals())
    return render(request,'app/myorderdetail.html')

#支付宝付款
def alipay(request ,orderid):
    order = Order.objects.get(id = int(orderid))
    #生成支付对象
    alipay = AliPay(
        appid=settings.APPID,
        # 默认回调url
        app_notify_url=None,
        app_private_key_string=settings.APP_PRIVATE_KEY,
        # 支付宝的公钥，验证支付宝回传消息使用，不是你自己的公钥,
        alipay_public_key_string=settings.ALIPAY_PUBLIC_KEY,
        sign_type="RSA2",  # RSA 或者 RSA2
        debug = False  # 默认False
    )
    trademun = str(randint(10000, 1000000))+str(randint(10000, 1000000))
    order_string = alipay.api_alipay_trade_page_pay(
        out_trade_no=trademun,
        total_amount=float(order.price),
        subject='黑八酒店',
        return_url="http://127.0.0.1:8000/",
      #  notify_url="http://127.0.0.1:8000/callback/"  # 可选, 不填则使用默认notify url
    )
    print(order_string)
    url = "https://openapi.alipaydev.com/gateway.do?"+order_string
    return HttpResponseRedirect(url)

