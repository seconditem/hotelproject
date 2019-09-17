;;
Using()(['FormCheck'], 'TeamBuyInfo');
var super8, com = new commobj;
Super8.extend({
    TeamBuyInfo: (function () {
        var Teambuyinfo = new Class('TeamBuyInfo');
        Teambuyinfo.inhert(wafobj);
        Teambuyinfo.extend({
            ttprice: 0,
            paytype: 3,
            init: function () {
                super8 = new Super8;
                this.PayablePrice();
                this.PriceJS();
                this.SaveTime();
                this.RoomNum();
                this.Fre();
                this.CusAmountJS();
                new Super8().FormCheck.init({
                    triggerid: 'tj_a',
                    submitid: 'grid-g2',
                    type: 'keyup',
                    call: super8.TeamBuyInfo.Submit
                });
                var Node = this.nodeCache('#section-info');
                var $handel = Node.get('expand');
                $handel.click(function () {
                    $handel.toggleClass('link-expand-show');
                    $handel.parent().next().toggleClass('hidden');
                });
                var $handel2 = Node.get('expand2');
                if ($handel2 != null) {
                    $handel2.click(function () {
                        $handel2.toggleClass('link-expand-show');
                        $handel2.next().toggleClass('hidden');
                    });
                };
                if ($("#ismem").val() != '1')
                    $('#dlogin').click();
            },
            PriceJS: function () {
                var taotal, ye = 0;
                taotal = $("[data-id=totalprice]").val();
                var roomnum = parseInt($("[data-id=roomnum]").find('li.current a').attr("value"));
                taotal = taotal * roomnum;
                this.ttprice = taotal;
                this.CusAmountJS();
                $("[data-id=totalprice_span]").html(taotal);
                if ($("#sale-balance").attr("checked") == "checked") {
                    ye = parseInt(typeof ($("#usr_CusAmount").val()) == 'undefined' ? "0" : $("#usr_CusAmount").val());
                }
                taotal = (taotal - ye) < 0 ? 0 : (taotal - ye);
                $("[data-id=payable]").html(taotal);
                $("[data-id=pay]").html(taotal);
                $("[data-id=dbje]").html(taotal);
                $("[data-id=yedd]").html(ye);
                $("[data-id=roomnumdd]").html(roomnum + ' 间');
            },
            PayablePrice: function () {
                var _slef = this;
                $("#sale-balance").click(function () {
                    var $this = $(this);
                    if ($this.attr("checked") == "checked") {
                        $this.attr("checked", false);
                    } else {
                        $this.attr("checked", true);
                    }
                    _slef.PriceJS();
                });
                $("#usr_CusAmount").blur(function () {
                    _slef.PriceJS(_slef.paytype);
                });
            },
            Submit: function (flag) {
                if (flag) {
                    $("[data-id=GstsName]").html($("#GstsName").val());
                    $("[data-id=ContactName]").html($("#ContactName").val());
                    $("[data-id=ContactMobile]").html($("#ContactMobile").val());
                    popupMemberSupper('confirm-pop');
                    super8.TeamBuyInfo.TJ();
                }
            },
            SaveTime: function () {
                var $el = $("[data-id=savetime]");
                var $input = $el.find('#ArrTime');
                var _self = this;
                $el.find('ul:first').delegate(".option", "click",
                    function (event) {
                        var option = $(this);
                        var name = option.find('span.item-text').text();
                        var value = parseInt(option.attr("value"));
                        if (value == 0) return;
                        option.parent().addClass('current').siblings().removeClass('current');
                        $el.children(".menu-name").html(name).attr("value", value);
                        $input.attr("value", value);
                        $("[data-id=rmetime]").html(value);
                        // _self.GuaranteeJS();
                    });
                $el.click(function (e) {
                    $(this).toggleClass('ui-menu-select-active');
                });
            },
            RoomNum: function () {
                var $el = $("[data-id=roomnum]");
                var $input = $el.find('#RoomNum');
                var _self = this;
                $el.find('ul:first').delegate(".option", "click",
                    function (event) {
                        var option = $(this);
                        var name = option.find('span.item-text').text();
                        var value = parseInt(option.attr("value"));
                        if (value == 0) return;
                        option.parent().addClass('current').siblings().removeClass('current');
                        $el.children(".menu-name").html(name).attr("value", value);
                        $input.attr("value", value);
                        _self.PriceJS(this.paytype);
                        _self.CusAmountJS();
                        var ye = parseInt(typeof ($("[data-id=ye]").html()) == 'undefined' ? "0" : $("[data-id=ye]").html());
                        var $cusamt = $("#usr_CusAmount");
                        if (ye >= _self.ttprice)
                            $cusamt.val(_self.ttprice)
                        else
                            $cusamt.val(ye)
                    });
                $el.click(function (e) {
                    $(this).toggleClass('ui-menu-select-active');
                });
            },
            TJ: function () {
                $("[data-id=submit]").unbind('click').click(function () {
                    com.pop.show();
                    var $this = $(this);
                    var _hotelid = $("#HotelId").val();
                    var _roomid = $("#RoomId").val();
                    var _sdate = $("#StartDate").val();
                    var _edate = $("#EndDate").val();
                    var _roomnum = $("#RoomNum").val();
                    var _arrtime = $("#ArrTime").val();
                    var _gstname = $("#GstsName").val();
                    var _conname = $("#ContactName").val();
                    var _conmoblie = $("#ContactMobile").val();
                    var _conemail = $("#ContactEmail").val();
                    var _isVoucher = 0;
                    var _isBlance = 0;
                    $item = $("#sale-balance");
                    if ($item.attr("checked") == "checked")
                        _isBlance = $("#usr_CusAmount").val();
                    var _pricePolicy = $("#hidPricePolicy").val();
                    var senddata = {
                        hotelid: _hotelid,
                        roomid: _roomid,
                        sdate: _sdate,
                        edate: _edate,
                        roomnum: _roomnum,
                        arrtime: _arrtime,
                        gstname: _gstname,
                        conname: _conname,
                        conmoblie: _conmoblie,
                        conemail: _conemail,
                        isVoucher: _isVoucher,
                        isBlance: _isBlance,
                        pricePolicy: _pricePolicy
                    };                   
                    if (_pricePolicy != "") {
                        _pricePolicy

                        var isteamroom = 2;
                        if (_pricePolicy == 'GDCX')
                            isteamroom = 3;
                        $.post('/book/CheckRoom', { sdate: _sdate, edate: _edate, hotelid: _hotelid, roomnum: _roomnum, roomid: _roomid, ishourroom: 0, isteamroom: isteamroom }, function (data) {
                            if (data == '0') {
                                $.post("/Book/ToTeamPay", senddata, function (data) {
                                    var resultobj = eval("(" + data + ")");
                                    if (resultobj.result == '-1') {
                                        com.pop.hide();
                                        com.ShowMsg("提交失败");
                                    } else {
                                        if (resultobj.type == 1)
                                            window.location.href = '/Book/Result/' + resultobj.orderid;
                                        else
                                            window.location.href = '/Book/PayOnline/' + resultobj.orderid;
                                    }


                                }).error(function () { com.pop.hide(); com.ShowMsg("网络问题"); $this.show(); });
                            }
                            else {
                                com.pop.hide();
                                if (data == '1')
                                    com.ShowMsg("房间数量不足");
                                else if (data == '2')
                                    com.ShowMsg("价格异常");
                                else
                                    com.ShowMsg("系统错误，请稍后再试");
                                img.hide();
                                $this.show();
                            }
                        }).error(function () { com.pop.hide(); com.ShowMsg("网络问题"); $this.show(); });
                    } else {
                        $.post('/book/CheckRoom', { sdate: _sdate, edate: _edate, hotelid: _hotelid, roomnum: _roomnum, roomid: _roomid, ishourroom: 0, isteamroom: 1 }, function (data) {
                            if (data == '0') {
                                $.post("/Book/ToTeamPay", senddata, function (data) {
                                    var resultobj = eval("(" + data + ")");
                                    if (resultobj.result == '-1') {
                                        com.pop.hide();
                                        com.ShowMsg("提交失败");
                                    } else {
                                        if (resultobj.type == 1)
                                            window.location.href = '/Book/Result/' + resultobj.orderid;
                                        else
                                            window.location.href = '/Book/PayOnline/' + resultobj.orderid;
                                    }


                                }).error(function () { com.pop.hide(); com.ShowMsg("网络问题"); $this.show(); });
                            }
                            else {
                                com.pop.hide();
                                if (data == '1')
                                    com.ShowMsg("房间数量不足");
                                else if (data == '2')
                                    com.ShowMsg("价格异常");
                                else
                                    com.ShowMsg("系统错误，请稍后再试");
                                img.hide();
                                $this.show();
                            }
                        }).error(function () { com.pop.hide(); com.ShowMsg("网络问题"); $this.show(); });
                    }
                });
            },
            Fre: function () {
                $("[data-id=fre]").unbind("click").click(function () {
                    var $this = $(this);
                    var $thisVal = $this.attr("name");
                    var $val = $("#GstsName").val();
                    if (name == '') {
                        $thisVal = $this.attr("NAME");
                    }
                    if ($this.attr("checked") == "checked") {
                        $this.attr("checked", false);
                        $("#GstsName").val($val.replace($thisVal + ',', ''));
                    } else {
                        $this.attr("checked", true);
                        $("#GstsName").val($thisVal + ',' + $val);
                    }

                })
            },
            CusAmountJS: function () {
                var ye = parseInt(typeof ($("[data-id=ye]").html()) == 'undefined' ? "0" : $("[data-id=ye]").html());
                var $this = $("#usr_CusAmount");
                var val = $this.val();
                if (val != '') {
                    parseInt(val) < 0 && (val = 0);
                    parseInt(val) > ye && (val = ye);
                    parseInt(val) > this.ttprice && (val = this.ttprice);
                }
                $this.val(val);
            }
        });
        return new Teambuyinfo;
    })()
});
;;
