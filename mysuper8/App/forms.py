import re

from django import forms
from django.core.exceptions import ValidationError

from App.models import User


def check_password(password):
    if re.search(r'\d',password) and \
       re.search(r'[a-z]',password) and  \
       re.search(r'[A-Z]',password) and  \
       re.search(r'[^0-9a-zA-Z]',password): \
        return password
    raise ValidationError('密码强度不满足要求')

class ChangePasswordForm(forms.Form):
    oldpassword = forms.CharField(label='旧密码',
                               max_length=12,
                               min_length=3,
                               widget=forms.PasswordInput(attrs={
                                   'placehold':'请输入旧密码',
                                   'class':'hahaha'
                               }),
                               # validators=[check_password],
                               error_messages={
                                   'max_length': '旧密码最大长度是12字符',
                                   'min_length': '旧密码长度不能小于3个字符',
                                   'required': '旧密码必须输入'
                               })
    newpassword = forms.CharField(label='新密码',
                               max_length=12,
                               min_length=3,
                               widget=forms.PasswordInput(attrs={
                                   'placehold':'请输入新密码',
                                   'class':'hahaha'
                               }),
                               validators=[check_password],
                               error_messages={
                                   'max_length': '密码最大长度是12字符',
                                   'min_length': '密码长度不能小于3个字符',
                                   'required': '新密码必须输入'
                               })
    confirm_newpassword = forms.CharField(label='确认新密码',
                               max_length=12,
                               min_length=3,
                               widget=forms.PasswordInput(attrs={
                                   'placehold':'请输入确认新密码',
                                   'class':'hahaha'
                               }),
                               validators=[check_password],
                               error_messages={
                                   'max_length': '密码最大长度是12字符',
                                   'min_length': '密码长度不能小于3个字符',
                                   'required': '确认新密码必须输入'
                               })
    emailnew = forms.EmailField(label='邮箱', error_messages={
        'required': '邮箱必须输入',
        'invalid': '邮箱格式无效'
    })

    # 全局验证方法
    def clean(self):
        # 获取字段值，应该从cleaned_data获取
        passwrod1 = self.cleaned_data.get('newpassword')
        passwrod2 = self.cleaned_data.get('confirm_newpassword')
        if passwrod1 != passwrod2:
            raise ValidationError({'confirm_newpassword': '两次密码不一致'})
        return self.cleaned_data

class RegisterForm(forms.Form):
    username = forms.CharField(label='用户名',
                               max_length=12,
                               min_length=3,
                               error_messages={
                                   'max_length':'用户名最大长度是12字符',
                                   'min_length':'用户名长度不能小于3个字符',
                                   'required':'用户名必须输入'
                               })
    password = forms.CharField(label='密码',
                               max_length=12,
                               min_length=3,
                               widget=forms.PasswordInput(attrs={
                                   'placehold':'请输入密码',
                                   'class':'hahaha'
                               }),
                               validators=[check_password],
                               error_messages={
                                   'max_length': '密码最大长度是12字符',
                                   'min_length': '密码长度不能小于3个字符',
                                   'required': '用户名必须输入'
                               })

    repassword = forms.CharField(
        label='确认密码',
        max_length=12,
        min_length=3,
        widget=forms.PasswordInput(attrs={
            'placehold': '请输入确认密码',
            'class': '994'
        }),
        validators=[check_password],
        error_messages={
            'max_length': '密码最大长度是12字符',
            'min_length': '密码长度不能小于3个字符',
            'required': '用户名必须输入'
        })
    email = forms.EmailField(label='邮箱',error_messages={
        'required':'邮箱必须数据',
        'invalid':'邮箱格式无效'
    })
    yzm = forms.CharField(label='验证码',error_messages={
        'required':'验证码必须输入'
    })

    #自定义验证方法
    #自定义的验证规则：clean_字段名
    def clean_username(self):
        res = User.objects.filter(username=self.cleaned_data.get('username')).exists()
        if res:
            raise ValidationError("用户重复")
        return self.cleaned_data.get('username')

    #全局验证方法
    def clean(self):
        #获取字段值，应该从cleaned_data获取
        passwrod1 = self.cleaned_data.get('password')
        passwrod2 = self.cleaned_data.get('repassword')
        if passwrod1 != passwrod2:
            raise ValidationError({'repassword':'两次密码不一致'})
        return self.cleaned_data

