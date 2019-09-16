;;

Using()(['CitySearch', 'KeySearch', 'Menu', 'KeepTop', 'DataBind', 'DetailMap', 'HoteHotels'], 'HotelDetail');
var super8, com = new commobj, waf = new wafobj();;;
Super8.extend({
    HotelDetail: (function () {
        var hotelDetail = new Class('HotelDetail');
        hotelDetail.inhert(wafobj);
        hotelDetail.extend({
            CoommentCount: function (count) {
                $("[data-id=commcount]").html(count)
            },
            HotelID: $("#hidhotelid").val(),
            HotelBrand: $("#hotelBrand").val(),
            mapdata: [],
            pricearr: [],
            PriceAdd: function (price) {
                if (price > 0) {
                    this.pricearr.push(parseInt(price));
                }
                return '';
            },
            init: function () {

                super8 = new Super8;
                var Node = this.nodeCache('#hotel-top-filter'), initevent, $fromDP, $toDP;
                super8.Menu.init(Node.get('numtop'));
                (initevent = function () {
                    var maxOffDay = 88;
                    var SERVER_TIME = new Date();

                    $fromDP = Node.get('from'),
                        $toDP = Node.get('to');

                    var now = typeof window.SERVER_TIME !== "undefined" ? SERVER_TIME : new Date() //当前时间
                        ,
                        minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()) //最小时间
                        ,
                        maxDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + maxOffDay) //最大开始时间
                        ,
                        maxToDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + maxOffDay); //最大结束时间
                    var defaultToDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) //默认开始时间 从第二天开始
                        ,
                        defaultFromDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()); //默认开始时间 从第三天天开始
                    var linkTo = $toDP.qdatepicker({
                        ui: "su8",
                        showTip: false,
                        refObj: $fromDP,
                        defaultDay: defaultToDay.valueOf(),
                        maxDate: maxToDate,
                        strictMaxDate: maxToDate
                    });
                    $fromDP.qdatepicker({
                        ui: "su8",
                        showTip: false,
                        linkRules: "+1D,+1D,+14D",
                        minDate: minDate,
                        maxDate: maxDate,
                        linkTo: linkTo,
                        defaultDay: defaultFromDay.valueOf()
                    });
                })();
                Node = this.nodeCache('#hotel-inner-filter');
                super8.Menu.init(Node.get('nummid'));
                initevent();
                var _self = this;
                $("[data-id=recivehotel]").unbind('click').click(function () {
                    if ($(this).hasClass("cancel-favor")) {
                        var _collectid = $(this).attr("data-code");
                        $.post('/Hotel/DelCollection', { collectid: _collectid }, function (data) {
                            if (data != '-1') {
                                $("[data-id=recivehotel]").removeClass("cancel-favor");
                                $("[data-id=recivehotel]").html("添加收藏");
                            } else {
                                $("#dlogin").click();
                            }

                        })
                    } else {
                        $.post('/Hotel/AddCollection', { hotelid: _self.HotelID }, function (data) {
                            if (data != '-1') {
                                $("[data-id=recivehotel]").attr("data-code", data)
                                $("[data-id=recivehotel]").addClass("cancel-favor");
                                $("[data-id=recivehotel]").html("取消收藏");
                            } else {
                                $("#dlogin").click();
                            }

                        })
                    }
                });
                //收藏及二维码
                $('.qcode-favor .icon-qcode').hover(function () {
                    $('.qcode-favor .qcode-hover').show();
                }, function () {
                    $('.qcode-favor .qcode-hover').hide();
                });
                $('.qcode-favor .qcode-hover').hover(function () {
                    $('.qcode-favor .qcode-hover').show();
                }, function () {
                    $('.qcode-favor .qcode-hover').hide();
                });

                super8.CitySearch.init({
                    srcid: 't-input-city',
                    keytagid: 'mydiv',
                    clicktagid: 'hotel_citylist',
                    citydata: s8b_cities,
                    selector: 'hid_city',
                    trigger: keyFunc,
                    pagesize: 5
                });

                function keyFunc() {
                    if ($("#hid_city").val() != '') {
                        var data = arounddata[$("#hid_city").val()];
                        super8.KeySearch.init({
                            srcid: 't-input-key',
                            keytagid: 'mykeydiv',
                            clicktagid: 'keyclick',
                            arounddata: data,
                            selector: 'hid_key',
                            govselector: 'hid_keygov',
                            hotelselector: 'hid_keyhotel',
                            pagesize: 5
                        });
                    }
                };
                keyFunc();
                if ($("#hidstime").val() != '') {
                    $("[data-id=from]").val($("#hidstime").val()),
                        $(":text[node_type=from]").val($("#hidstime").val());
                }
                if ($("#hidetime").val() != '') {
                    $("[data-id=to]").val($("#hidetime").val()),
                        $(":text[node_type=to]").val($("#hidetime").val());
                }
                if ($("#hideroomnum").val() != '') {
                    var roomnum = $("#hideroomnum").val(), $roomnum = $("[data-id=roomnumtop]"), lis;
                    $roomnum.attr("value", roomnum);
                    $roomnum.html(roomnum + '间');
                    lis = $("[node_type=numtop]").find("li");
                    lis.each(function (li) {
                        $("a", this).attr("value") == roomnum && ($(this).addClass("current").siblings().removeClass("current"));
                    });
                    $roomnum = $("[data-id=roomnummid]");
                    $roomnum.attr("value", roomnum);
                    $roomnum.html(roomnum + '间');
                    lis = $("[node_type=nummid]").find("li");
                    lis.each(function (li) {
                        $("a", this).attr("value") == roomnum && ($(this).addClass("current").siblings().removeClass("current"));
                    });
                }
                var _modelhtml = $("[data-bind=container]").html(), _self = this;
                $("#ajaxSerch").click(function () {
                    $("[data-bind=container]").html(_modelhtml);
                    _stime = $("[data-id=from]").val();
                    _etime = $("[data-id=to]").val();
                    _roomnum = $("[data-id=roomnum] li.current a").attr("value");
                    //加载价格策略房型
                    super8.DataBind.init({
                        srcobj: $("[data-bind=repeter_pproom]"),
                        url: "/Hotel/GetPPRoom",
                        data: { stime: _stime, etime: _etime, roomnum: _roomnum, hotelid: _self.HotelID },
                        databinder: 'reperter',
                        model: 'HotelDetail',
                        loadingimg: ''
                    });
                    //加载房型数据
                    super8.DataBind.init({
                        srcobj: $("[data-bind=repeter]"),
                        url: "/Hotel/GetRoom",
                        data: { stime: _stime, etime: _etime, roomnum: _roomnum, hotelid: _self.HotelID },
                        databinder: 'reperter',
                        call: HotelDetail.Call,
                        model: 'HotelDetail',
                        loadingimg: $("[data-id=loadgroups]")
                    });
                    $("[data-bind=container]").show();
                });
                setTimeout(this.GetHotelImgs, 200);
                $("#btnsearch").click(function () {
                    var _citycode = $("#hid_city").val(), _keycode;
                    $("#hid_key").val() != '' && (_keycode = $("#hid_key").val(), _type = 1);
                    $("#hid_keygov").val() != '' && (_keycode = $("#hid_keygov").val(), _type = 2);
                    $("#hid_keyhotel").val() != '' && (_keycode = $("#hid_keyhotel").val(), _type = 3);
                    var _stime = $(":text[node_type=from]").val();
                    var _etime = $(":text[node_type=to]").val();
                    _stime && _etime && _citycode && (searchhref = 'citycode=' + _citycode + '&' + 'stime=' + _stime + '&' + 'etime=' + _etime + '&' + 'keycode=' + _keycode + '&type=' + _type, window.location.href = '/Hotel/List?' + searchhref);
                });
                super8.HoteHotels.citycode = $("#hid_city").val();

                super8.HoteHotels.init();

                $("#ajaxSerch").click();

            },
            AmBackValue: function (SPValue) {
                var html = '';
                var IfAdvancePayMent = parseInt($("#IfAdvancePayMent").val());
                if (IfAdvancePayMent == 1 && SPValue > 0) {
                    html = '<span class="cheapest return">返券' + SPValue + '元</span>';
                }
                return html;
            },
            AddMapData: function (_hotelname, _hotelimgsrc, _hoteldesc, _x, _y, _pic) {
                this.mapdata.push({
                    hotelname: _hotelname,
                    hotelimgsrc: _hotelimgsrc,
                    hoteldesc: _hoteldesc,
                    x: _x,
                    y: _y,
                    index: 1,
                    pic: _pic
                });
                $.mapdata = HotelDetail.mapdata;
                return '';
            },
            BedSize: function (bedSize) {
                if (!bedSize || bedSize == "0" || bedSize == "")
                    return '';
                return '床型：' + bedSize + '米';
            },
            RmTypeArea: function (rmTypeArea) {
                if (!rmTypeArea || rmTypeArea == "0" || rmTypeArea == "")
                    return '';
                return '建筑面积：' + rmTypeArea + '平米';
            },
            AddPrice: function (price) {
                if (!price || price == "0" || price == "")
                    return '';
                return '加床：' + price + '元/张';
            },
            SpecialDesc: function (SpecialDesc) {
                if (!SpecialDesc || SpecialDesc == "0" || SpecialDesc == "" || SpecialDesc == "null")
                    return '';
                return '特殊说明：' + SpecialDesc;
            },
            RoomDesc: function (RoomDesc) {
                if (!RoomDesc || RoomDesc == '')
                    return '';
                return '房型说明：' + RoomDesc;
            },
            AddPic: function (pic) {
                
                if (pic) {
                    if ($('#HotelBrand').val() == '2') {
                        return '<img src="' + pic + '" width="100" height="75" class="room_pic" alt="速8精选酒店" />';
                    } else {
                        return '<img src="' + pic + '" width="100" height="75" class="room_pic" alt="速8酒店"/>';
                    }

                } else {
                    return '<img src="/Statics/images/top_logo.png" width="100" height="75" class="room_pic" />';
                }
            },
            TBYD: function (num) {
                if (num <= 0)
                    return '<span class="btn-s btn-red btn-group-full" style="margin: 6px 0;"><a href="javascript:void(0);"><em>满房</em></a></span>';
                return '<span class="btn-s btn-red" style="margin: 6px 0;"><a id="addcart" href="javascript:void(0);" onclick="HotelDetail.TBYDClick.call(this);"><em>预订</em></a></span>';
            },
            TBYDClick: function () {
                var $this = $(this);
                var containerroom = $this.closest("div.group");
                var containerhotel = $this.closest("[data-tag=groups]");
                var _stime = $("[data-id=from]").val();
                var _etime = $("[data-id=to]").val();
                var _roomnum = $("[data-id=roomnum] li.current a").attr("value");
                var _hotelid = $("#hid_hotelid").val();
                var _roomid = containerroom.find("[data-bind=roomid]").val();
                var begintime_ms = Date.parse(new Date(_stime.replace(/-/g, "/"))); //begintime 为开始时间
                var endtime_ms = Date.parse(new Date(_etime.replace(/-/g, "/")));   // endtime 为结束时间
                var days = Math.floor((endtime_ms - begintime_ms) / (24 * 3600 * 1000))
                var _href = '/Book/TeamBuyInfo/' + _hotelid + '/' + _roomid + '/' + _roomnum + '/' + _stime + '/' + _etime + '/' + days + '/';
                var img = $('<em><img src="/Statics/images/icons/btn_loading.gif" /></em>');
                $this.hide();
                $this.parent().append(img);
                $.post('/Book/checkRoom', { sdate: _stime, edate: _etime, hotelid: _hotelid, roomnum: _roomnum, roomid: _roomid, ishourroom: 1, isteamroom: 0 }, function (data) {
                    if (data == '0')
                        window.location.href = _href;
                    else {
                        if (data == '1')
                            alert("数量不足")
                        else if (data == '2')
                            alert("价格不对")
                        else
                            alert("系统错误，请稍后再试")
                        img.hide();
                        $this.show();
                    }
                }).error(function () { alert("网络问题"); $this.show(); });

            },
            YD: function (num, price) {
                if (!price)
                    return '';
                if (num == 0)
                    return '<span class="btn-s btn-red btn-group-full" style="margin: 6px 0;" data-id="ydspan"><a href="javascript:void(0);"  data-id="yd"><em>满房</em></a></span>';
                return '<span class="btn-s btn-red fl" style="margin: 6px 0;" data-id="ydspan"><a id="addcart" href="javascript:void(0);" data-id="yd" onclick="HotelDetail.YDClick.call(this);"><em>预订</em></a></span>';

            },
            IfAdvancePayMentlist: function () {
                var ifpayment = $("#IfAdvancePayMent").val();
                if (ifpayment == "1")
                    return '<span class="icon-discount">立减!</span>';
                return '';
            },
            YDClick: function () {
                var $this = $(this);
                var containerroom = $this.closest("div.group");
                var containerhotel = $this.closest("[data-tag=groups]");
                var _stime = $("[data-id=from]").val();
                var _etime = $("[data-id=to]").val();
                var _roomnum = $("[data-id=roomnum] li.current a").attr("value");
                var _hotelid = $("#hid_hotelid").val();
                var _roomid = containerroom.find("[data-bind=roomid]").val();
                var begintime_ms = Date.parse(new Date(_stime.replace(/-/g, "/"))); //begintime 为开始时间
                var endtime_ms = Date.parse(new Date(_etime.replace(/-/g, "/")));   // endtime 为结束时间
                var days = Math.floor((endtime_ms - begintime_ms) / (24 * 3600 * 1000))
                var _href = '/Book/Info/' + _hotelid + '/' + _roomid + '/' + _roomnum + '/' + _stime + '/' + _etime + '/' + days + '/';
                var img = $('<em><img src="/Statics/images/icons/btn_loading.gif" /></em>');
                $this.hide();
                $this.parent().append(img);
                $.post('/Book/checkRoom', { sdate: _stime, edate: _etime, hotelid: _hotelid, roomnum: _roomnum, roomid: _roomid, ishourroom: 1, isteamroom: 1 }, function (data) {
                    if (data == '0')
                        window.location.href = _href;
                    else {
                        if (data == '1')
                            com.ShowMsg("房间数量不足");
                        else if (data == '2')
                            com.ShowMsg("价格异常");
                        else
                            com.ShowMsg("系统错误，请稍后再试");
                        img.hide();
                        $this.show();
                    }
                }).error(function () { com.ShowMsg("网络问题"); $this.show(); });
            },
            HourYD: function (curnum, usenum) {
                if (parseInt(curnum, 10) <= parseInt(usenum, 10))
                    return '<a href="javascript:void(0);"><em>满房</em></a>';
                return '<a id="addcart" href="javascript:void(0);" onclick="HotelDetail.HourYDClick.call(this);"><em>预订</em></a></span>';
            },
            HourYDClick: function () {
                var $this = $(this);
                var containerroom = $this.closest("div.group");
                var containerhotel = $this.closest("[data-tag=groups]");
                var _stime = $("[data-id=from]").val();
                var _etime = $("[data-id=to]").val();
                var _roomnum = $("[data-id=roomnum] li.current a").attr("value");
                var _hotelid = $("#hid_hotelid").val();
                var _roomid = containerroom.find("[data-bind=roomid]").val();
                var begintime_ms = Date.parse(new Date(_stime.replace(/-/g, "/"))); //begintime 为开始时间
                var endtime_ms = Date.parse(new Date(_etime.replace(/-/g, "/")));   // endtime 为结束时间
                var days = Math.floor((endtime_ms - begintime_ms) / (24 * 3600 * 1000))
                var _href = '/Book/HourRoomInfo/' + _hotelid + '/' + _roomid + '/' + _roomnum + '/' + _stime + '/' + _etime + '/' + days + '/';
                var img = $('<em><img src="/Statics/images/icons/btn_loading.gif" /></em>');
                $this.hide();
                $this.parent().append(img);
                $.post('/Book/checkRoom', { sdate: _stime, edate: _etime, hotelid: _hotelid, roomnum: _roomnum, roomid: _roomid, ishourroom: 1, isteamroom: 0 }, function (data) {
                    if (data == '0')
                        window.location.href = _href;
                    else {
                        if (data == '1')
                            com.ShowMsg("房间数量不足");
                        else if (data == '2')
                            com.ShowMsg("价格异常");
                        else
                            com.ShowMsg("系统错误，请稍后再试");
                        img.hide();
                        $this.show();
                    }
                }).error(function () { com.ShowMsg("网络问题"); $this.show(); });
            },
            IconCick: function () {
                var boxarr = $(this).closest('.group').find('.price_box');
                var rowbase = $(this).closest('.row-base');
                boxarr.slideToggle();
                if (rowbase.hasClass("row-expand")) {
                    rowbase.removeClass("row-expand");
                } else {
                    rowbase.addClass("row-expand");
                }
            },
            GetHotelImgs: function () {
                $.post("/Hotel/GetHotelImgs", { hotelid: HotelDetail.HotelID }, function (data) {
                    if (data) {
                        var arrdata = eval("(" + data + ")");
                        $("#slidecontianer").slide({
                            images: arrdata,
                            container: 'slidecontianer',
                            selector: '',
                            slideWidth: 300,
                            refimg: 'slider-img-big',
                            HotelBrand: HotelDetail.HotelBrand
                        });
                    }
                })
            },
            Call: function (_hotelid, tag) {
                if ($("#hidmemflag").val() != '') {
                    switch ($("#hidmemflag").val()) {
                        case "1": $("[data-id=memtitle]").html("网络会员价"); break;
                        case "2", "5": $("[data-id=memtitle]").html("贵宾会员价"); break;
                        case "3", "6": $("[data-id=memtitle]").html("金卡会员价"); break;
                        case "4", "7": $("[data-id=memtitle]").html("超级会员价"); break;
                    }
                }
                var $this = $(this);
                var top = $this.closest("[data-tag=groups]");
                var topParent = $this.closest("[data-id=groups]")
                var price = $("[data-id=price]");
                top.find("[data-id=ajaxnone]").hide();
                var minprice = HotelDetail.pricearr[0];
                for (var i = 0; i < HotelDetail.pricearr.length; i++) {
                    if (minprice > HotelDetail.pricearr[i]) {
                        minprice = HotelDetail.pricearr[i];
                    }
                }
                HotelDetail.pricearr = [];
                if (tag || minprice == '')
                    topParent.find("[data-priceid=price]").remove();
                else
                    price.html(minprice);
                var reg = /^￥.{0,20}[0-9]{1,3}.{0,5}/;
                $this.find("[data-id=jg]").each(function () {
                    if (!reg.test($(this).html()))
                        $(this).html('');
                    if ($(this).html().replace('￥', '') == minprice) {
                        $(this).css("font-weight", "bold");
                        $(this).closest(".group").find("[data-id=kyj]").html(minprice);
                    }
                });
                var groups = top.find(".group"), ulflag = 0, fullindex = 0;
                for (var i = 0; i < groups.length; i++) {
                    var group = $(groups[i]);
                    if (group.find("[data-id=ydspan]").length > 0) {
                        var uls = group.find(".price_box.hidden ul"), ckyd, yd;
                        for (var j = 0; j < uls.length; j++) {
                            $(uls[j]).attr("data-id") == "ajaxnone" && (ulflag++);
                        }
                        if (ulflag == 1) {
                            ckyd = group.find("[data-id=ckyd]");
                            if (group.find("[data-id=ydspan]").hasClass("btn-group-full")) {
                                ckyd.addClass("btn-group-full");
                                fullindex++;
                            }
                            yd = group.find("[data-id=ydspan]").html();
                            ckyd.html("");
                            ckyd.removeClass('btn-redd').attr("onclick", "");
                            ckyd.append(yd);
                        }
                    }
                    if (fullindex > 0) {
                        group.addClass("group-full");
                    }
                    ulflag = 0;
                    fullindex = 0;
                }
                super8.DetailMap.init({
                    container: 'allmap',
                    trigger: 'detailid',
                    data: super8.HotelDetail.mapdata,
                    auto: true,
                    mode: 'single'
                });
                super8.BaiduMap.init(super8.HotelDetail.mapdata[0]);
            },
            HotelState: function (state) {
                var datereg = /^(\d{4})(\-)(\d{1,2})(\-)(\d{1,2})T00:00:00$/;
                if (datereg.test(state)) {
                    state = state.replace('T00:00:00', '');
                    var date = new Date();
                    var now = date.getFullYear() + '-' + (date.getMonth() - 2) + '-' + date.getDay();
                    if (Date.parse(state) > Date.parse(now))
                        //alert(state);
                        return '<span class="pride new-open"></span>';
                }
                //<span class="pride new-open"></span><span class="pride rectify"></span><span class="pride no-recommend"></span>
                var taghtml = '';
                if (state == 0) {
                    return taghtml = '<span class="pride tese"></span>';
                }
                else if (state == 2) {
                    return taghtml = '<span class="pride jiaoao"></span><span class="pride star"></span>';
                }
                else if (state == 3) {
                    return taghtml = '<span class="pride new-open"></span>';
                }
                return taghtml;
            },
            HotelServers: function (tagid) {
                var taghtml = '';
                if (tagid == 3) {
                    taghtml = '<img title="wifi" src="~/Statics/images/icons/wifi.gif" alt="" />';
                }
                else if (tagid == 2) {

                    taghtml = '<img title="alarm" src="~/Statics/images/icons/alarm.gif" alt="" />';
                }
                else {
                    taghtml = ' <img title="phone" src="~/Statics/images/icons/phone.gif" alt="" />';
                }
                return taghtml;
            },
            RoomLeft: function (tagid, price) {
                if (price) {
                    if (parseInt(tagid) <= 0)
                        return '满房';
                    else if (parseInt(tagid) < 3)
                        return '最后' + tagid + "间";
                }
                return '';
            },
            IsBreakfast: function (tagid) {
                return tagid;
            },
            HourRoom: function (tagid, roomid, roomtypeid) {
                if (tagid == '' || (roomid != roomtypeid)) {
                    //$("[value=" + roomid + "]").closest(".group").find("[data-id=zdf]").hide();
                    return 'none';
                } else {
                    return '';
                }
            },
            HourRoomTime: function (tagid) {
                if (tagid == '') {
                    $(this).html('');
                }
                $(this).html('(' + tagid + '小时)');
            },
            IsShowMemberType1: function (show, connet) {
                if (show != "0")
                    return '' + connet + '';
                else
                    return '';
            },
            IsShowHotelReply1: function (show, connet) {
                if (show != "0")
                    return '<div class="reply"><div class="reply-user">总经理回复</div><div class="reply-content"><em class="arrow"></em><p>' + connet + '</p></div></div>';
                else
                    return '';

            },
            IsShowConNoByReason1: function (show, connet) {
                if (show != "0")
                    return '<div class="reply"><div class="reply-user">速8宾客服务部回复</div><div class="reply-content"><em class="arrow"></em><p>' + connet + '</p></div></div>';
                else
                    return '';

            },
            IsShowZiDongReply1: function (show, connet) {
                if (show != "0")
                    return '<div class="reply"><div class="reply-user">速8宾客服务部回复</div><div class="reply-content"><em class="arrow"></em><p>' + connet + '</p></div></div>';
                else
                    return '';

            },
            Commentcontent: function (connet, comid) {
                var sTitle = '';
                var sTitle2 = '';
                if (connet.length > 100) {
                    sTitle = connet.substring(0, 100);
                    sTitle2 = connet.substring(100);
                    return '<p>' + sTitle + '<a id="connetshow_' + comid + '" href="javascript:void(0)" class="link-expand" onclick="getconnetshow(' + comid + ')">...全部</a><span style="display :none" id="phid_' + comid + '">' + sTitle2 + '<a id="connethid_' + comid + '" href="javascript:void(0)" class="link-expand" onclick="getconnethid(' + comid + ')">  收起</a></span></p>';
                } else {
                    return '<p>' + connet + '&nbsp;</p>';
                }
            },
            IsShowCardNo: function (cardno, comid) {
                var sTitle = '';
                if (comid == "0") {
                    sTitle = '<i class="icon-user-pc"></i>' + cardno + '';
                }
                else if (comid == "1") {
                    sTitle = '<i class="icon-user-mobile"></i>' + cardno + '';
                } else {
                    sTitle = '';
                }
                return sTitle;
            },

            PPAddPic: function (pic) {
                if (pic) {
                    if ($('#HotelBrand').val() == '2') {
                        return '<img src="' + pic + '" class="sale-room-pic" alt="速8精选酒店" />';
                    } else {
                        return '<img src="' + pic + '" class="sale-room-pic" alt="速8酒店"/>';
                    }
                    
                } else {
                    return ' <img src="http://admin.super8.com.cn/himage/upload/default/room.gif" class="sale-room-pic" />';
                }
            },
            PPRoomLeft: function (rmCount, price, amount, roomTypeId) {
                var amountStr = '';
                if (amount > 0) {
                    amountStr = 'onMouseOver="$(\'.quan_' + roomTypeId + '\').show()" onMouseOut="$(\'.quan_' + roomTypeId + '\').hide()"';
                }
                if (price && parseInt(rmCount) > 0) {
                    if (parseInt(rmCount) < 3)
                        return '<div class="price-reserve"><p class="hover-quan quan_' + roomTypeId + '">现金券可减<b>' + amount
                            + '元</b></p><span class="icon_prepay">预付</span><a href="javascript:void(0);" onclick="HotelDetail.PPYDClick.call(this);" class="btn-sale-new">预订</a><span class="last-room">最后'
                            + rmCount + '间</span><span class="price" ' + amountStr + '>￥<b>' + price + '</b></span></div>';
                    else
                        return '<div class="price-reserve"><p class="hover-quan quan_' + roomTypeId + '">现金券可减<b>' + amount
                            + '元</b></p><span class="icon_prepay">预付</span><a href="javascript:void(0);" onclick="HotelDetail.PPYDClick.call(this);" class="btn-sale-new">预订</a><span class="price"  ' +
                            amountStr + '>￥<b>'
                            + price + '</b></span></div>';
                }
                return '<div class="price-reserve sale-no-room"><a href="javascript:void(0);" class="btn-sale-new">满房</a><span class="price">￥<b>'
                    + price + '</b></span></div>';
            },
            PPYDClick: function () {
                if ($("#hidmemflag").val() == "") {
                    $('#dlogin').click();
                    return;
                } else {
                    if ($("#hidmemflag").val() != "2" && $("#hidmemflag").val() != "3" && $("#hidmemflag").val() != "4") {
                        popupMemberSupper('pop-vip');
                        return;
                    }
                }
                var $this = $(this);
                var containerhotel = $this.closest("[data-tag=groupspp]");
                var containerroom = $this.closest("[data-tag=roomspp]");
                var _stime = $("[data-id=from]").val();
                var _etime = $("[data-id=to]").val();
                var _roomnum = $("[data-id=roomnum] li.current a").attr("value");
                var _hotelid = $("#hid_hotelid").val();
                var _roomid = containerroom.find("[data-bind=roomidpp]").val();
                var begintime_ms = Date.parse(new Date(_stime.replace(/-/g, "/"))); //begintime 为开始时间
                var endtime_ms = Date.parse(new Date(_etime.replace(/-/g, "/")));   // endtime 为结束时间
                var pricePolicy = "XDCX";
                var _href = '/Book/TeamBuyInfo/' + _hotelid + '/' + _roomid + '/' + _roomnum + '/' + _stime + '/' + _etime + '/' + pricePolicy + '/';
                var img = $('<em><img src="/Statics/images/icons/btn_loading.gif" /></em>');
                $this.hide();
                $this.parent().append(img);
                $.post('/Book/checkRoom', { sdate: _stime, edate: _etime, hotelid: _hotelid, roomnum: _roomnum, roomid: _roomid, ishourroom: 1, isteamroom: 2 }, function (data) {
                    if (data == '0')
                        window.location.href = _href;
                    else {
                        if (data == '1')
                            alert("数量不足")
                        else if (data == '2')
                            alert("价格不对")
                        else
                            alert("系统错误，请稍后再试")
                        img.hide();
                        $this.show();
                    }
                }).error(function () { alert("网络问题"); $this.show(); });
            },
        });
        return new hotelDetail;
    })()
})
var HotelDetail = new Super8().HotelDetail;
;;
