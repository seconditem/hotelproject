;;
Using()(['CitySearch', 'KeySearch', 'Menu', 'KeepTop', 'TopSearch', 'TopAllSearch', 'DataBind', 'Page', 'ListMap', 'HoteHotels'], 'HotelList');
var super8, com = new commobj, waf = new wafobj();;
Super8.extend({
    HotelList: (function () {
        var hotellist = new Class('HotelList');
        hotellist.inhert(wafobj);
        hotellist.extend({
            order: 1,
            pagesize: 9,
            mapdata: [],
            pricearr: [],
            sdate: '',
            edate: '',
            roomnum: '',//AjaxSearchFunc
            init: function (_hotelid) {
                super8 = new Super8;
                var _self = this;
                this.tempdata["AjaxSearchFlag"] = true;
                this.tempcall.push(function () {
                    $("[data-id=daohang]").html($("#t-input-city").val() + "酒店");
                    super8.HotelList.order = 1;
                    $("#pager").html('');
                    mapdata = [];
                    var _data = super8.TopAllSearch.postDataPack();
                    _self.sdate = _data.stime;
                    _self.edate = _data.etime;
                    _self.roomnum = _data.roomnum;

                    $("[data-bind=container]").html(_self.tempdata['modelhtml']);
                    super8.DataBind.init({
                        srcobj: $("[data-bind=repeter]"),
                        url: "/Hotel/HotelList",
                        data: _data,
                        databinder: 'reperter',
                        callmodel: _self,
                        call: _self.SubRepeter,
                        model: 'HotelList',
                        loadingimg: $("#g2").find("[data-id=loadgroups]"),
                        errfunc: function (e) {
                            this.tempdata["AjaxSearchFlag"] = true;
                        },
                        pagecount: function (e) {
                            $("[data-id=datacount]").html(e);
                        }
                    });
                    $("[data-id=datacount]").html(0);
                    super8.HoteHotels.citycode = $("#hid_city").val();
                });
                $("#mapSearch").click(function () {
                    var _stime = $(":text[node_type=from]").val(),
                        _etime = $(":text[node_type=to]").val(),
                        _citycode = $("#hid_city").val(),
                        _keycode, _cityname = $("#home_zbjd").val(), searchhref, _type;
                    $("#hid_key").val() != '' && (_keycode = $("#hid_key").val(), _type = 1);
                    $("#hid_keygov").val() != '' && (_keycode = $("#hid_keygov").val(), _type = 2);
                    $("#hid_keyhotel").val() != '' && (_keycode = $("#hid_keyhotel").val(), _type = 3);

                    searchhref = '/Hotel/MapList/';
                    _stime && _etime && _citycode && (searchhref = 'citycode=' + _citycode + '&' + 'stime=' + _stime + '&' + 'etime=' + _etime + '&' + 'keycode=' + _keycode + '&type=' + _type, window.location.href = '/Hotel/MapList?' + searchhref);
                });
                super8.HoteHotels.type = 'List';
                super8.HoteHotels.init();
                super8.TopSearch.init();
                super8.TopAllSearch.init();
            },
            SubRepeter: function () {
                var _self = this;
                $("[data-id=mappop]").click(function () {
                    var code = $(this).attr("data-code");
                    super8.BaiduMap.init(super8.HotelList.mapdata[code]);
                    popupMemberSupper('pop-map');
                });
                var _stime = $(":text[node_type=from]").val();
                var _etime = $(":text[node_type=to]").val();
                var _roomnum = $("[data-id=roomnum]").attr("value");
                //绑定价格策略房间数据
                var repeterspp = $("[data-bind=repeter_pproom]"), replenpp = repeterspp.length, repparentpp, repeterpp, _hotelid;
                if (replenpp) {
                    for (var i = 0; i < replenpp; i++) {
                        repeterpp = $(repeterspp[i]);
                        repparentpp = repeterpp.closest("[data-tag=groupspp]");
                        _hotelid = repparentpp.find("[data-bind=hotelidpp]").val();
                        repparentpp.next().find("[data-bind=hotelid]").val(_hotelid);
                        super8.DataBind.init({
                            srcobj: repeterpp,
                            url: "/Hotel/GetPPRoom",
                            data: { stime: _stime, etime: _etime, roomnum: _roomnum, hotelid: _hotelid },
                            databinder: 'reperter',
                            calldata: _hotelid,
                            lazycalldata: '',
                            model: 'HotelList',
                            loadingimg: '',
                            errfunc: function () {

                            }
                        });

                    }
                    setTimeout(function () {
                        super8.Page.init({
                            srcid: 'pager',
                            count: parseInt($("[data-id=hid_pages]").val()),
                            pageindex: parseInt($("[data-id=hid_pageindex]").val()),
                            call: ''
                        });
                    }, 200);
                }
                //绑定房间数据
                var repeters = $("[data-bind=repeter1]"), replen = repeters.length, repparent, repeter;
                if (replen) {
                    for (var i = 0; i < replen; i++) {
                        repeter = $(repeters[i]);
                        repparent = repeter.closest("[data-tag=groups]");
                        _hotelid = repparent.find("[data-bind=hotelid]").val();
                        super8.DataBind.init({
                            srcobj: repeter,
                            url: "/Hotel/GetRoom",
                            data: { stime: _stime, etime: _etime, roomnum: _roomnum, hotelid: _hotelid },
                            databinder: 'reperter',
                            call: _self.Call,
                            calldata: _hotelid,
                            lazycall: _self.LazyCall,
                            lazycalldata: '',
                            model: 'HotelList',
                            loadingimg: repparent.find("[data-id=loadgroup]"),
                            errfunc: function () {

                            }
                        });

                    }
                    setTimeout(function () {
                        super8.Page.init({
                            srcid: 'pager',
                            count: parseInt($("[data-id=hid_pages]").val()),
                            pageindex: parseInt($("[data-id=hid_pageindex]").val()),
                            call: ''
                        });
                    }, 200);
                }
                this.tempdata["AjaxSearchFlag"] = true;
                $("[data-bind=container]").show();
                var ooo = $("img[data-src]").each(function () {
                    $(this).attr("src", $(this).attr("data-src"));
                });
                $("#jump-top-box > a").click();
                if (($("#hid_keygov").val() == "0" || $("#hid_keygov").val() == "") && $("#t-input-key").val() != "") {
                    if ($("#hid_keyhotel").val() == "0" || $("#hid_keyhotel").val() == "") {
                        if ($("#t-input-key").val().length < 28)
                            //$(".spkeyword").html($("#t-input-key").val());
                            $(".spkeyword").text($("#t-input-key").val());
                        else {
                            //$(".spkeyword").html($("#t-input-key").val().substring(0, 29) + "...");
                            $(".spkeyword").text($("#t-input-key").val().substring(0, 29) + "...");
                        }
                        if ($(".paddress").attr("data-distin") != "0" && $(".paddress").attr("data-distin") != "")
                            $(".paddress").show();
                    }
                }
            },
            PriceAdd: function (price) {
                if (price > 0) {
                    this.pricearr.push(parseInt(price));
                }
                return '';
            },
            HotelTag: function (tagid) {
                var enumtag = this.Enum.get('HotelTag');
                var taghtml = '';
                if ((tagid & enumtag.jiaoao) > 0)
                    taghtml += '<span class="pride jiaoao"><div class="hover-pride">速8骄傲：最优质的酒店</div></span>';
                if ((tagid & enumtag.stargold) > 0)
                    taghtml += '<span class="pride star-gold"><div class="hover-pride">质量金星</div></span>';
                if ((tagid & enumtag.starsilver) > 0)
                    taghtml += '<span class="pride star-silver"><div class="hover-pride">质量银星</div></span>';
                if ((tagid & enumtag.okyouli) > 0)
                    taghtml += '<span class="pride ok-brand"><div class="hover-pride">到店出示OK手势有惊喜</div></span>';
                return taghtml;
            },
            HotelState: function (state, ispp) {
                if (ispp == '1')
                    return '<span class="pride sale6" title="新店6折"></span>';
                else {
                    if (state == '1')
                        return '<span class="pride new-open"></span>';
                }
                return '';
            },
            HotelBrand: function (brand) {
                if (brand == '2')
                    return '<img src="/Statics/images/icon-new-list.png" class="icon-new-product">';
                return '';
            },
            HotelViode: function (url) {
                
                if (url =='1') {
                    return '<img src="/Statics/images/tag-video.png" class="icon-video">'
                } else {
                    return '';
                }

            },
            HotelServers: function (tagid) {
                var enumtag = this.Enum.get('HotelServer');
                var serrvices = window["Serrvices"];
                var taghtml = '';
                if (serrvices) {
                    for (var i = 0; i < serrvices.length; i++) {
                        if (enumtag[serrvices[i].FacilityTypeID]) {
                            taghtml += HotelList.TagImg(enumtag[serrvices[i].FacilityTypeID])
                        }
                    }

                }
                return taghtml;
            },
            TagImg: function (FacilityTypeName) {
                switch (FacilityTypeName) {
                    case "早餐": return '<img title="早餐" src="/Statics/images/icons/icon-new-breakfast.png" alt="早餐" />';
                    case "24小时热水": return '<img title="24小时热水" src="/Statics/images/icons/icon-new-hotwater.png" alt="24小时热水" />';
                    case "室内": return '<img title="室内停车场" src="/Statics/images/icons/icon-new-p.png" alt="室内停车场" />';
                    case "室外": return '<img title="室外停车场" src="/Statics/images/icons/icon-new-p.png" alt="室外停车场" />';
                    case "专票": return '<img title="专票" src="/Statics/images/icons/icon-new-zhuan.png" alt="专票" />';
                }
                return '';
            },
            Orderby: function () {
                if (this.order > this.pagesize)
                    this.order = 1;
                return '<div class="order-map">' + (HotelList.order++) + '</div>'
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
            AddMapData: function (_hotelid, _hotelname, _hotelimgsrc, _hoteldesc, _x, _y) {
                if (_x && _x != '' && _x != '0' && _y && _y != '' && _y != '0') {
                    this.mapdata[_hotelid] = {
                        hotelname: _hotelname,
                        hotelimgsrc: _hotelimgsrc,
                        hoteldesc: _hoteldesc,
                        x: _x,
                        y: _y,
                        index: HotelList.order - 1,
                        pic: _hotelimgsrc
                    };
                }
                return '';
            },
            AmBackValue: function (hotelId, SPValue) {
                var html = '';
                var IfAdvancePayMent = parseInt($("#if_" + hotelId).val());
                if (IfAdvancePayMent == 1 && SPValue > 0) {
                    html = '<span class="cheapest return">返券' + SPValue + '元</span>';
                }
                return html;
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
            AddPic: function (hotelId,pic) {
                
                var HotelBrand = parseInt($("#HotelBrand_" + hotelId).val());
                
                if (pic) {
                    if (HotelBrand == 2) {
                        return '<img src="' + pic + '" width="100" height="75" class="room_pic" alt="速8精选酒店"/>';
                    } else {
                        return '<img src="' + pic + '" width="100" height="75" class="room_pic" alt="速8酒店"/>';
                    }
                } else {
                    return ' <img src="/Statics/images/top_logo.png" width="100" height="75" class="room_pic" />';
                }

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
            YD: function (num, price) {
                if (!price)
                    return '';
                if (num == 0)
                    return '<span class="btn-s btn-red btn-group-full" style="margin: 6px 0;" data-id="ydspan"><a href="javascript:void(0);"  data-id="yd"><em>满房</em></a></span>';
                return '<span class="btn-s btn-red fl" style="margin: 6px 0;" data-id="ydspan"><a id="addcart" href="javascript:void(0);" data-id="yd" onclick="HotelList.YDClick.call(this);"><em>预订</em></a></span>';

            },
            IfAdvancePayMent: function (ifpayment) {
                var AmMinus = $("#AmMinus").val();
                if (ifpayment == 1)
                    return '<dt class="prepay-discount">预付立减&nbsp;￥' + AmMinus + '</dt>';
                return '';
            },
            IfAdvancePayMentlist: function (hid) {
                var ifpayment = $('#if_' + hid + '').val();
                if (ifpayment == "1")
                    return '<span class="icon-discount">立减!</span>';
                return '';
            },
            IfAdvancePayMentlist2: function (num, hid) {
                var ifpayment = $('#if_' + hid + '').val();
                if (ifpayment == "1" & num != 0)
                    return '<span class="icon-discount">立减!</span>';
                return '';
            },
            YDClick: function () {
                var $this = $(this);
                var containerroom = $this.closest("div.group");
                var containerhotel = $this.closest("[data-tag=groups]");
                var _stime = super8.HotelList.sdate;
                var _etime = super8.HotelList.edate;
                var _roomnum = $("[data-id=roomnum]").attr("value");
                var _hotelid = containerhotel.find("[data-bind=hotelid]").val();
                var _roomid = containerroom.find("[data-bind=roomid]").val();
                var begintime_ms = Date.parse(new Date(_stime.replace(/-/g, "/"))); //begintime 为开始时间
                var endtime_ms = Date.parse(new Date(_etime.replace(/-/g, "/")));   // endtime 为结束时间
                var days = Math.floor((endtime_ms - begintime_ms) / (24 * 3600 * 1000))
                var _href = '/Book/Info/' + _hotelid + '/' + _roomid + '/' + _roomnum + '/' + _stime + '/' + _etime + '/' + days + '/';
                var img = $('<em><img src="/Statics/images/icons/loading-reserve.gif" class="icon-loading"/></em>');
                $this.hide();
                $this.parent().append(img);
                $.post('/book/CheckRoom', { sdate: _stime, edate: _etime, hotelid: _hotelid, roomnum: _roomnum, roomid: _roomid, ishourroom: 0, isteamroom: 0 }, function (data) {
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
                    return '<span class="btn-s btn-red btn-group-full" style="margin: 6px 0;"><a href="javascript:void(0);"><em>满房</em></a></span>';
                return '<span class="btn-s btn-red" style="margin: 6px 0;"><a id="addcart" href="javascript:void(0);" onclick="HotelList.HourYDClick.call(this);"><em>预订</em></a></span>';
            },

            HourYDClick: function () {
                var $this = $(this);
                var containerroom = $this.closest("div.group");
                var containerhotel = $this.closest("[data-tag=groups]");
                var _stime = super8.HotelList.sdate;
                var _etime = super8.HotelList.edate;
                var _roomnum = $("[data-id=roomnum]").attr("value");
                var _hotelid = containerhotel.find("[data-bind=hotelid]").val();
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
            TBYD: function (num) {
                if (num <= 0)
                    return '<span class="btn-s btn-red btn-group-full" style="margin: 6px 0;"><a href="javascript:void(0);"><em>满房</em></a></span>';
                return '<span class="btn-s btn-red" style="margin: 6px 0;"><a id="addcart" href="javascript:void(0);" onclick="HotelList.TBYDClick.call(this);"><em>预订</em></a></span>';
                //    return '<a href="javascript:void(0);"><em>满房</em></a></span>';
                //return '<a href="javascript:void(0);" onclick="HotelList.TBYDClick.call(this);"><em>预订</em></a>';
            },
            TBYDClick: function () {
                var $this = $(this);
                var containerroom = $this.closest("div.group");
                var containerhotel = $this.closest("[data-tag=groups]");
                var _stime = super8.HotelList.sdate;
                var _etime = super8.HotelList.edate;
                var _roomnum = $("[data-id=roomnum]").attr("value");
                var _hotelid = containerhotel.find("[data-bind=hotelid]").val();
                var _roomid = containerroom.find("[data-bind=roomid]").val();
                var begintime_ms = Date.parse(new Date(_stime.replace(/-/g, "/"))); //begintime 为开始时间
                var endtime_ms = Date.parse(new Date(_etime.replace(/-/g, "/")));   // endtime 为结束时间
                var days = Math.floor((endtime_ms - begintime_ms) / (24 * 3600 * 1000))
                var _href = '/Book/TeamBuyInfo/' + _hotelid + '/' + _roomid + '/' + _roomnum + '/' + _stime + '/' + _etime + '/' + days + '/';
                var img = $('<em><img src="/Statics/images/icons/btn_loading.gif" /></em>');
                $this.hide();
                $this.parent().append(img);
                $.post('/Book/checkRoom', { sdate: _stime, edate: _etime, hotelid: _hotelid, roomnum: _roomnum, roomid: _roomid, ishourroom: 0, isteamroom: 1 }, function (data) {
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
            ExplandClick: function () {
                var top = $(this).closest("[data-tag=groups]");
                if ($("a > i", this).hasClass("icon-more-top")) {
                    top.find(".group:gt(2)").hide();
                    $("a > i", this).removeClass("icon-more-top");
                    $("a", this).html($("a", this).html().replace("收起", "更多"));
                } else {
                    top.find(".group:gt(2)").show();
                    $("a > i", this).addClass("icon-more-top");
                    $("a", this).html($("a", this).html().replace("更多", "收起"));
                }

            },
            Call: function (_hotelid, tag) {
                var $this = $(this);
                var top = $this.closest("[data-tag=groups]");
                top.find("[data-id=ajaxnone]").hide();
                top.find(".group:gt(2)").hide();
                var groups = top.find(".group"), expand = top.find('.table-expand-more');
                if (groups.length < 4)
                    expand.hide();
                else
                    expand.show();
                var Browser = waf.browser;
                if (!(Browser.msie && Browser.version < 9)) {
                    var topParent = $this.closest("[data-id=groups]")
                    var price = topParent.find("[data-id=price]");
                    var minprice = HotelList.pricearr[0];
                    for (var i = 0; i < HotelList.pricearr.length; i++) {
                        if (minprice > HotelList.pricearr[i]) {
                            minprice = HotelList.pricearr[i];
                        }
                    }
                    HotelList.pricearr = [];
                    if (tag || !minprice || minprice == '')
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
                    var ulflag = 0, fullindex = 0;
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
                }
            },
            LazyCall: function (data) {
                if ($("#hidmemflag").val() != '') {
                    switch ($("#hidmemflag").val()) {
                        case "1": $("[data-id=memtitle]").html("网络会员价"); break;
                        case "2": $("[data-id=memtitle]").html("贵宾会员价"); break;
                        case "3": $("[data-id=memtitle]").html("金卡会员价"); break;
                        case "4": $("[data-id=memtitle]").html("超级会员价"); break;
                        case "5": $("[data-id=memtitle]").html("贵宾会员价"); break;
                        case "6": $("[data-id=memtitle]").html("金卡会员价"); break;
                        case "7": $("[data-id=memtitle]").html("超级会员价"); break;
                    }
                }
                $("[data-id=itemsort]  li").click(function () {
                    if (!super8.HotelList.tempdata["AjaxSearchFlag"])
                        return false;
                    var val = $("a", this).attr("data-code");
                    $(this).addClass("current").siblings().removeClass("current");
                    $("[data-id=hid_select]").val(val);
                    $("#ajaxSerch").click();
                });
                $("[data-id=newsearch]").unbind('click').click(function () {
                    if (!super8.HotelList.tempdata["AjaxSearchFlag"])
                        return false;
                    var $this = $(this);
                    var val = $("#hid_newsearch").val() + ',' + $this.attr("data-code");
                    if (val[0] == ',') {
                        val = val.substring(1);
                    }
                    if ($this.attr("checked") == "checked") {
                        $this.attr("checked", false);
                        var reg = new RegExp($this.attr("data-code") + ',', 'g');
                        val = val.replace(reg, '');
                        reg = new RegExp(',' + $this.attr("data-code"), 'g');
                        val = val.replace(reg, '');
                    } else {
                        $this.attr("checked", true);
                        $("#hid_newsearch").val(val);
                    }
                    $("#hid_newsearch").val(val);
                    $("#ajaxSerch").click();
                });
                $("[data-id=hoteldetail]").click(function () {
                    var code = $(this).attr("data-code");
                    href = '/Hotel/Detail/' + code + '/' + super8.HotelList.sdate + '/' + super8.HotelList.edate + '/' + super8.HotelList.roomnum;

                    $(this).attr("href", href);
                });
                var Browser = waf.browser;
                if (!(Browser.msie && Browser.version < 7)) {
                    if (!super8.ListMap.map) {
                        super8.ListMap.map = new BMap.Map("allmap");
                        super8.ListMap.map.centerAndZoom($("#t-input-city").val(), 12);
                    }
                    if (super8.ListMap.map.$g != undefined && super8.ListMap.map.$g != $("#t-input-city").val())
                        super8.ListMap.map.centerAndZoom($("#t-input-city").val(), 12);
                    var $win = $(window);
                    var $keepWrapper = $('#sidebar-keeptop-wrapper'), $topFilter = $('.hotel-top-filter'), $parent = $keepWrapper.closest('.wrapper');
                    var offsetTop = $keepWrapper.offset().top - $topFilter.outerHeight();
                    $win.scroll(function () {
                        var maxOffsetTop = $parent.height() - $keepWrapper.height() + $parent.offset().top - $topFilter.outerHeight() - 10;
                        var scrollTop = $(window).scrollTop();
                        if (scrollTop > offsetTop && scrollTop < maxOffsetTop) {
                            $keepWrapper.css({ position: 'fixed', top: 38 })
                        } else if (scrollTop >= maxOffsetTop) {
                            $keepWrapper.css({ position: 'absolute', top: maxOffsetTop + 38 })
                        } else if (scrollTop <= offsetTop) {
                            $keepWrapper.css({ position: 'static' });
                        }
                    });
                }
                super8.HotelList.tempdata["AjaxSearchFlag"] = true;
            },
            HotelNameClick: function () {
            },

            PPAddPic: function (pic) {
                if (pic)
                    return '<img src="' + pic + '" class="sale-room-pic" />';
                return ' <img src="http://admin.super8.com.cn/himage/upload/default/room.gif" class="sale-room-pic" />';
            },
            PPRoomLeft: function (rmCount, price, amount, roomTypeId) {
                var amountStr = '';
                if (amount > 0) {
                    amountStr = 'onMouseOver="$(\'.quan_' + roomTypeId + '\').show()" onMouseOut="$(\'.quan_' + roomTypeId + '\').hide()"';
                }
                if (price && parseInt(rmCount) > 0) {
                    if (parseInt(rmCount) < 3)
                        return '<div class="price-reserve"><p class="hover-quan quan_' + roomTypeId + '">现金券可减<b>' + amount
                            + '元</b></p><span class="icon_prepay">预付</span><a href="javascript:void(0);" onclick="HotelList.PPYDClick.call(this);" class="btn-sale-new">预订</a><span class="last-room">最后'
                            + rmCount + '间</span><span class="price" ' + amountStr + '>￥<b>' + price + '</b></span></div>';
                    else
                        return '<div class="price-reserve"><p class="hover-quan quan_' + roomTypeId + '">现金券可减<b>' + amount
                            + '元</b></p><span class="icon_prepay">预付</span><a href="javascript:void(0);" onclick="HotelList.PPYDClick.call(this);" class="btn-sale-new">预订</a><span class="price" ' + amountStr + '>￥<b>'
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
                var _stime = super8.HotelList.sdate;
                var _etime = super8.HotelList.edate;
                var _roomnum = $("[data-id=roomnum]").attr("value");
                var _hotelid = containerhotel.find("[data-bind=hotelidpp]").val();
                var _roomid = containerroom.find("[data-bind=roomidpp]").val();
                var begintime_ms = Date.parse(new Date(_stime.replace(/-/g, "/"))); //begintime 为开始时间
                var endtime_ms = Date.parse(new Date(_etime.replace(/-/g, "/")));   // endtime 为结束时间
                var pricePolicy = "XDCX";
                var _href = '/Book/TeamBuyInfo/' + _hotelid + '/' + _roomid + '/' + _roomnum + '/' + _stime + '/' + _etime + '/' + pricePolicy + '/';
                var img = $('<em><img src="/Statics/images/icons/btn_loading.gif" /></em>');
                $this.hide();
                $this.parent().append(img);
                $.post('/Book/checkRoom', { sdate: _stime, edate: _etime, hotelid: _hotelid, roomnum: _roomnum, roomid: _roomid, ishourroom: 0, isteamroom: 2 }, function (data) {
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
        });
        return new hotellist;
    })()
})
var HotelList = new Super8().HotelList;
;;