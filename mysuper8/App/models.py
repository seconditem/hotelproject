import django
from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class User(AbstractUser):
    uid = models.AutoField(primary_key=True)
    # username = models.CharField(null=True, max_length=60, unique=True)
    # password = models.CharField(max_length=128, null=True)
    phone = models.CharField(max_length=11, null=True)
    realname = models.CharField(max_length=60)
    usertype = models.IntegerField(default=0, null=True)
    gender = models.IntegerField(default=0)
    # email = models.EmailField()
    regtime = models.DateField(auto_now_add=True)
    pict = models.CharField(null=True,max_length=128)
    ID_Number = models.CharField(null=False,max_length=21)


    class Meta:
        db_table = "hotel_user"


class Order(models.Model):
    # order_id = models.AutoField(default=100000)
    check_in_time = models.DateTimeField()
    check_out_time = models.DateTimeField()
    username = models.CharField(null=True,max_length=30)
    user_nums = models.IntegerField(default=1)
    order_room_num = models.IntegerField(default=1)
    last_in_time = models.DateTimeField()
    phone = models.CharField(max_length=11)
    price = models.FloatField()
    create_time = models.DateTimeField(auto_now_add=True)
    order_status = models.IntegerField(default=0)
    user_id = models.ForeignKey(User, related_name="user", db_column='user_id', on_delete=models.CASCADE, null=True)
    room = models.OneToOneField('RoomStyle', on_delete=models.CASCADE, db_column='roomstyle')

    class Meta:
        db_table = 'hotel_order'


class RoomStyle(models.Model):
    # id = models.CharField(primary_key=True)
    style = models.IntegerField(default=0)
    size = models.IntegerField()
    num = models.IntegerField(default=10)
    iswindow = models.IntegerField(choices=[(0, "无"), (1, "有")])
    iswifi = models.IntegerField(choices=[(0, '无'), (1, '有')])
    bathroom = models.IntegerField(choices=[(0, '无'), (1, '有')])
    breakfast = models.IntegerField(choices=[(0, '无'), (1, '有')])
    desc = models.TextField(max_length=100)
    dorprice = models.FloatField()
    webprice = models.FloatField()
    huiyuanprice = models.FloatField()

    class Meta:
        db_table = "hotel_roomstyle"


class Room(models.Model):
    # room_id = models.CharField(primary_key=True)
    room_status = models.IntegerField(default=2, choices=[(0, '预定'), (1, '入住'), (2, '空闲')])
    typeid = models.ForeignKey(RoomStyle, db_column='roomstyleid', related_name='type')

    class Meta:
        db_table = 'hotel_room'


class Reflex(models.Model):
    username = models.CharField(null=True,max_length=60)
    create_time = models.DateTimeField(auto_now_add=True)
    level = models.IntegerField(default=2, choices=[(0, '吐槽'), (1, '差'), (2, '一般'), (3, '很满意'), (4, '强烈推荐')])
    content = models.TextField(max_length=150)
    # user_id = models.ForeignKey(User, db_column="userid", related_name='userid')
    order = models.OneToOneField(Order, related_name="orderid")
    score = models.FloatField(default=6.0)

    class Meta:
        db_table = 'hotel_reflex'


class HotelInfo(models.Model):
    phone = models.CharField(max_length=11)
    address = models.CharField(max_length=128)
    desc = models.CharField(max_length=150)
    web = models.IntegerField(default=0, choices=[(0, '无'), (1, '有')])
    service = models.TextField(max_length=150)
    inquerment = models.TextField(max_length=100)

    class Meta:
        db_table = 'hotel_info'
