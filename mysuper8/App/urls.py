"""mysuba URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin

from App import views

urlpatterns = [
    #首页
    url(r'^$',views.yuding,name='yuding'),
    url(r'^(\d+)/$',views.yuding,name='yuding'),

    #登录
    url(r'^loginym/$',views.loginym, name='loginym'),
    #退出
    url(r'^userlogout/$',views.userlogout,name='userlogout'),
    #注册
    url(r'^registerym/$',views.registerym,name='registerym'),
    # 验证码
    url(r'^yzm/$', views.get_yzm, name='yzm'),
    # 手机验证码
    url(r'^phoneyzm/$', views.phoneyzm, name='phoneyzm'),
    #忘记密码（验证身份）
    url(r'^findcode/$', views.findcode, name='findcode'),
    #忘记密码（重置密码）
    url(r'^findcodetwo/(\d+)/$', views.findcodetwo, name='findcodetwo'),
    # 重置密码成功
    url(r'^findcodesan/$', views.findcodesan, name='findcodesan'),
    #酒店详情
    url(r'^hoteldetail/$',views.hoteldetail,name='hoteldetail'),
    url(r'^hoteldetail/(\d+)/$',views.hoteldetail,name='hoteldetail'),
    #预定页面
    url(r'^makeorder/(\d+)/$',views.makeorder,name='makeorder'),
    #确认订单
    url(r'^confirmorder/(\d+)/$',views.confirmorder,name='confirmorder'),
    #我的订单
    url(r'^myorderdetail/$',views.myorderdetail,name='myorderdetail'),
    #取消订单的路由
    url(r'^myorderdetail/(\d+)/$',views.myorderdetail,name='myorderdetail'),
    #支付宝付款
    url(r'^alipay/(\d+)/$',views.alipay,name='alipay'),
    #酒店评价
    url(r'^hotelreflex/$',views.hotelreflex,name='hotelreflex'),
    #预定付款成功后修改订单状态
    url(r'^finishpay/$',views.finishpay,name='finishpay'),

]
