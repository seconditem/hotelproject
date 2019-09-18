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
    url(r'^/(\d+)/$',views.yuding,name='yuding'),

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
    #忘记密码
    url(r'^findcode/$', views.findcode, name='findcode'),
    #忘记密码
    url(r'^findcodetwo/$', views.findcodetwo, name='findcodetwo'),
    #酒店详情
    url(r'^hoteldetail/$',views.hoteldetail,name='hoteldetail'),
    #预定页面
    url(r'^makeorder/(\d+)/$',views.makeorder,name='makeorder'),



]
