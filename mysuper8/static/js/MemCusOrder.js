;;
Using()(['CitySearch', 'KeySearch', 'DataBind', 'Page'], 'MemCusOrder');
var super8, _modelhtml;;
Super8.extend({
    MemCusOrder: (function () {
        var memCusOrder = new Class('MemCusOrder');
        memCusOrder.inhert(wafobj);
        memCusOrder.extend({
            init: function () {
                super8 = new Super8();
                var _type;
                $(function () {
                    if (!GetSession()) {
                        window.location.href = "/MemInfo/MemLogin";
                        return;
                    }
                    $("[data-id=order-tab] li").unbind('click').click(function () {
                        $(this).toggleClass("current").siblings().removeClass("current");
                        if ($(this).hasClass("current")) {
                            _type = $(this).attr("data-type");
                            tj();
                        }
                    });
                    _modelhtml = $("[data-bind=container]").html();
                    $("#pager").html('');
                    function tj() {
                        var _pageindex = $("[data-id=hid_pageindex]").val() == "#data.pageindex#" ? "1" : $("[data-id=hid_pageindex]").val();
                        $("[data-bind=container]").html(_modelhtml);
                        super8.DataBind.init({
                            srcobj: $("[data-bind=repeter]"),
                            url: "/MemInfo/GetMemCusOrder",
                            data: { PageSize: 5, PageIndex: _pageindex, type: _type },
                            databinder: 'reperter',
                            call: SubRepeter,
                            model: 'MemCusOrder',
                            loadingimg: $("[data-id=loadgroups]"),
                            container: 'tbody'
                            //pagecount: function (e) {
                            //    //$("[data-id=datacount]").html(e);个数
                            //}
                        });
                        function SubRepeter() {
                            var repeters = $("[data-bind=repeter1]");
                            if (repeters.length > 0) {
                                for (var i = 0; i < repeters.length; i++) {
                                    var subrepeter = $(repeters[i]);
                                    var _orderid = subrepeter.closest("div").find("[data-bind=OrderID]").val();
                                    super8.DataBind.init({
                                        srcobj: subrepeter,
                                        url: "/MemInfo/GetMemCusOrderDetail",
                                        data: { orderid: _orderid },
                                        databinder: 'reperter',
                                        model: 'MemCusOrder',
                                        loadingimg: $("[data-id=loadgroups]")
                                    });
                                }
                            }
                            setTimeout(function () {
                                super8.Page.init({
                                    srcid: 'pager',
                                    count: parseInt($("[data-id=hid_pages]").val()),
                                    pageindex: parseInt($("[data-id=hid_pageindex]").val()),
                                    call: tj
                                });
                            }, 200);
                        }
                        $("[data-bind=container]").show();
                    }
                    tj();
                });
            },
            PriceList: function () {
                var htmlstr = '';
                var price = window["orderDayPriceList"];
                for (var i = 0; i < price.length; i++) {
                    htmlstr += ' <span class="span-day-price span-quan">' +
                                   '<div class="date">' + price[i].rmDate + '（' + price[i].weekd + '）</div>' +
                                   '<em>￥' + price[i].rmPrice + '<i>（' + price[i].breakfast + '）</i></em></span>';

                }
                return htmlstr;
            },
            OrderStatus: function (pymtstart, isconcel, lastcanceltime, pymttypeId, hotelid, status, orderid, time, IfAdvancePayMent) {
                var htmlstr = '';
                var htmlstrfu = '';
                var date = Now();
                var time1 = new Date(date.replace("-", "/").replace("-", "/"));
                var time2 = new Date(time.replace("-", "/").replace("-", "/"));
                if (status == 1 || status == 5) {
                    if (pymttypeId == 3) {
                        if (pymtstart == 2) {
                            if (time1 < time2) {
                                htmlstrfu = '&nbsp;&nbsp;<a class="link" style ="color :red" href="javascript:void(0)" onclick=GetPayTime("' + orderid + '")>付款</a>';
                            }
                            htmlstr = '<a class="link" href="javascript:void(0)" onclick=GetCancelOrder("' + orderid + '")>取消订单</a>';
                        }
                        else if (pymtstart == 1) {
                            if (isconcel != "") {
                                if (isconcel == 1) {
                                    var lastcanceltime = new Date(lastcanceltime);
                                    if (time1 < lastcanceltime) {
                                        htmlstr = '<a class="link" href="javascript:void(0)" onclick=GetCancelOrder("' + orderid + '")>取消订单</a>';
                                    }
                                }
                            }
                        }
                    } else if (pymttypeId == 1 && IfAdvancePayMent == 1) {
                        htmlstrfu = '&nbsp;&nbsp;<a class="link" style ="color :red" href="javascript:void(0)" onclick=GetPayTime("' + orderid + '")>付款</a>';
                        htmlstr = '<a class="link" href="javascript:void(0)" onclick=GetCancelOrder("' + orderid + '")>取消订单</a>';
                    }
                    else {
                        htmlstr = '<a class="link" href="javascript:void(0)" onclick=GetCancelOrder("' + orderid + '")>取消订单</a>';
                    }
                } else if (status == 15 || status == 20 || status == 25) {
                    htmlstr = '<a class="link" href="/Hotel/Detail/' + hotelid + '/">再次预订</a>';
                }
                htmlstr = htmlstr + "  " + htmlstrfu;
                return htmlstr;
            },
            OrderStatus2: function (pymtstart, pymttypeId, status, orderid, time, IfAdvancePayMent) {
                var htmlstr = '';
                var date = Now();
                var time1 = new Date(date.replace("-", "/").replace("-", "/"));
                var time2 = new Date(time.replace("-", "/").replace("-", "/"));
                if (status == 1 || status == 5) {
                    if (pymttypeId == 3) {
                        if (pymtstart == 2) {
                            if (time1 < time2) {
                                htmlstr = '&nbsp;&nbsp;<a class="submit-btn" href="javascript:void(0)" onclick=GetPayTime("' + orderid + '")>付款</a>';
                            }
                        }
                    } else if (pymttypeId == 1 && IfAdvancePayMent == 1) {
                        htmlstr = '&nbsp;&nbsp;<a class="submit-btn" href="javascript:void(0)" onclick=GetPayTime("' + orderid + '")>付款</a>';
                        htmlstr += '&nbsp;&nbsp;<a class="submit-btn" href="javascript:void(0)" onclick=GetCancelOrder("' + orderid + '")>取消订单</a>';
                    }
                }
                return htmlstr;
            }
        });
        return new memCusOrder;
    })()
})
;;
var MemCusOrder = {
    PriceList: function () {
        var htmlstr = '';
        var price = window["orderDayPriceList"];
        for (var i = 0; i < price.length; i++) {
            htmlstr += ' <span class="span-day-price span-quan">' +
                           '<div class="date">' + price[i].rmDate + '（' + price[i].weekd + '）</div>' +
                           '<em>￥' + price[i].rmPrice + '<i>（' + price[i].breakfast + '）</i></em></span>';

        }
        return htmlstr;
    },
    OrderStatus: function (pymtstart, isconcel, lastcanceltime, pymttypeId, hotelid, status, orderid, time, IfAdvancePayMent) {
        var htmlstr = '';
        var htmlstrfu = '';
        var date = Now();
        var time1 = new Date(date.replace("-", "/").replace("-", "/"));
        var time2 = new Date(time.replace("-", "/").replace("-", "/"));
        if (status == 1 || status == 5) {
            if (pymttypeId == 3) {
                if (pymtstart == 2) {
                    if (time1 < time2) {
                        htmlstrfu = '&nbsp;&nbsp;<a class="link" style ="color :red" href="javascript:void(0)" onclick=GetPayTime("' + orderid + '")>付款</a>';
                    }
                    htmlstr = '<a class="link" href="javascript:void(0)" onclick=GetCancelOrder("' + orderid + '")>取消订单</a>';
                }
                else if (pymtstart == 1) {
                    if (isconcel != "") {
                        if (isconcel == 1) {
                            var lastcanceltime = new Date(lastcanceltime);
                            if (time1 < lastcanceltime) {
                                htmlstr = '<a class="link" href="javascript:void(0)" onclick=GetCancelOrder("' + orderid + '")>取消订单</a>';
                            }
                        }
                    }
                }
            } else if (pymttypeId == 1 && IfAdvancePayMent == 1) {
                htmlstrfu = '&nbsp;&nbsp;<a class="link" style ="color :red" href="javascript:void(0)" onclick=GetPayTime("' + orderid + '")>付款</a>';
                htmlstr = '<a class="link" href="javascript:void(0)" onclick=GetCancelOrder("' + orderid + '")>取消订单</a>';
            }
            else {
                htmlstr = '<a class="link" href="javascript:void(0)" onclick=GetCancelOrder("' + orderid + '")>取消订单</a>';
            }
        } else if (status == 15 || status == 20 || status == 25) {
            htmlstr = '<a class="link" href="/Hotel/Detail/' + hotelid + '/">再次预订</a>';
        }
        htmlstr = htmlstr + "  " + htmlstrfu;
        return htmlstr;
    },
    OrderStatus2: function (pymtstart, pymttypeId, status, orderid, time, IfAdvancePayMent) {
        var htmlstr = '';
        var date = Now();
        var time1 = new Date(date.replace("-", "/").replace("-", "/"));
        var time2 = new Date(time.replace("-", "/").replace("-", "/"));
        if (status == 1 || status == 5) {
            if (pymttypeId == 3) {
                if (pymtstart == 2) {
                    if (time1 < time2) {
                        htmlstr = '&nbsp;&nbsp;<a class="submit-btn" href="javascript:void(0)" onclick=GetPayTime("' + orderid + '")>付款</a>';
                    }
                }
            } else if (pymttypeId == 1 && IfAdvancePayMent == 1) {
                htmlstr = '&nbsp;&nbsp;<a class="submit-btn" href="javascript:void(0)" onclick=GetPayTime("' + orderid + '")>付款</a>';
                htmlstr += '&nbsp;&nbsp;<a class="submit-btn" href="javascript:void(0)" onclick=GetCancelOrder("' + orderid + '")>取消订单</a>';
            }
        }
        return htmlstr;
    },
    IsTrueDianPing: function (orderid, isdianping, orderstartid, hotelid) {
        var htmlstr = '';
        if (orderstartid == 20) {
            if (isdianping == "1") {
                htmlstr = '<a class="link" href="javascript:void(0)" onclick="getOrderid(' + orderid + ',' + hotelid + ');">点评</a>';
            } else if (isdianping == "2") {
                htmlstr = '<a class="link" href="javascript:void(0)" onClick="getOrderidDetail(' + orderid + ',' + hotelid + ')">查看</a>';
            } else if (isdianping == "3") {
                htmlstr = '已过期';
            }
            //htmlstr = '<a class="link"  href="javascript:void(0)" onclick=GetDaoDaoDianPing("' + orderid + '","' + hotelid + '")>我要点评</a>'           
        }
        return htmlstr;
    },
    PriceAmaccount: function (CouponAmount, AmAccount, PymtStatus) {
        var htmlstr = '';
        if (PymtStatus == 1) {
            if (CouponAmount > 0) {
                htmlstr += '使用抵扣券<b class="red">' + CouponAmount + '元</b>';
            }
            if (AmAccount > 0) {
                if (htmlstr != '')
                    htmlstr += '，';
                htmlstr += '使用现金券<b class="red">' + AmAccount + '元</b>';
            }
            if (htmlstr != '') {
                htmlstr = '优惠：' + htmlstr + '<br/>';
            }
        }
        return htmlstr;
    },
    InsuranceOrder: function (InsuranceID) {
        var htmlstr = '';
        if (InsuranceID != null && InsuranceID > 0) {
            htmlstr = '<div class="insurance-tip">'
            + '您是取消险年卡用户，享全年累计600元赔付额。<br>'
            + '预付订单未到，无需材料证明，未入住可获赔70%；如提供指定材料证明，赔付高达90%。<a href="javascript:void(0)" class="link" onClick=showPop("pop-rule-A")>查看保险说明</a>'
        + '</div>';
        }
        return htmlstr;
    }
};

function Now() {
    var n = new Date();
    return n.getFullYear() + "-" + (n.getMonth() + 1) + "-" + n.getDate() + " " + n.getHours() + ":" + n.getMinutes() + ":" + n.getSeconds()
};

function GetSession() {
    var isok = false;
    $.ajax({
        async: false,
        url: '/MemInfo/GetSession',
        dataType: "json",
        success: function (data) {
            if (data == "1") {
                isok = true;
            }
        }
    });
    return isok;
}


function GetDaoDaoDianPing(orderid, hotelid) {
    if (orderid != "" && hotelid != "") {
        $.ajax({
            async: false,
            url: '/MemInfo/GetDaoDao',
            data: { orderid: orderid, hotelid: hotelid },
            dataType: "json",
            success: function (data) {
                if (data != "") {
                    window.open(data);
                }
            }
        });
    }
}

function GetPayTime(orderid) {
    if (orderid != "") {
        $.ajax({
            async: false,
            url: '/MemInfo/ValidateOrderId',
            data: { orderid: orderid },
            dataType: "json",
            success: function (data) {
                if (data == 1) {
                    location.href = '/Book/PayOnline/' + orderid + '';
                } else if (data == 2) {
                    location.href = '/MemInfo/MemCusOrder/';
                } else {
                    location.href = '/MemInfo/MemCusOrder/';
                    alert("系统错误");
                }
            }
        });
    }
}
function GetCancelOrder(orderid) {
    if (confirm("确定要取消吗？")) {
        $.ajax({
            async: false,
            url: '/MemInfo/CancelOrderId',
            data: { orderid: orderid },
            dataType: "json",
            success: function (data) {
                if (data == '取消订单成功') {
                    var _type;
                    _type = $(".order-tab li[class='item-tab current']").attr("data-type");
                    _modelhtml = $("[data-bind=container]").html();
                    $("#pager").html('');
                    location.href = '/MemInfo/MemCusOrder/';
                    //function tjj() {
                    //    var _pageindex = $("[data-id=hid_pageindex]").val() == "#data.pageindex#" ? "1" : $("[data-id=hid_pageindex]").val();
                    //    $("[data-bind=container]").html(_modelhtml);
                    //    super8.DataBind.init({
                    //        srcobj: $("[data-bind=repeter]"),
                    //        url: "/MemInfo/GetMemCusOrder",
                    //        data: { PageSize: 5, PageIndex: _pageindex, type: _type },
                    //        databinder: 'reperter',
                    //        call: SubRepeter,
                    //        model: 'MemCusOrder',
                    //        loadingimg: $("[data-id=loadgroups]"),
                    //        container: 'tbody'
                    //    });
                    //    function SubRepeter() {
                    //        var repeters = $("[data-bind=repeter1]");
                    //        if (repeters.length > 0) {
                    //            for (var i = 0; i < repeters.length; i++) {
                    //                var subrepeter = $(repeters[i]);
                    //                var _orderid = subrepeter.closest("div").find("[data-bind=OrderID]").val();
                    //                super8.DataBind.init({
                    //                    srcobj: subrepeter,
                    //                    url: "/MemInfo/GetMemCusOrderDetail",
                    //                    data: { orderid: _orderid },
                    //                    databinder: 'reperter',
                    //                    model: 'MemCusOrder',
                    //                    loadingimg: $("[data-id=loadgroups]")
                    //                });
                    //            }
                    //        }
                    //        setTimeout(function () {
                    //            super8.Page.init({
                    //                srcid: 'pager',
                    //                count: parseInt($("[data-id=hid_pages]").val()),
                    //                pageindex: parseInt($("[data-id=hid_pageindex]").val()),
                    //                call: tjj
                    //            });
                    //        }, 200);
                    //    }
                    //    $("[data-bind=container]").show();
                    //}
                    //tjj();
                }
                alert(data)
            }
        });

    }
}
$('#box-order').delegate('a.link-expand', 'click', function () {
    var $tr = $(this).closest('tr')
        , $expand = $tr.next();
    $tr.toggleClass('item-open');
    $expand.toggleClass('hidden');
});

$(document).ready(function () {
    $("#error").hide();
    $("#error1").hide();
    $("#error2").hide();
    $("#error3").hide();
    $("#error4").hide();
    $("#error5").hide();
});
function getOrderid(aid, hid) {

    //$.ajax({
    //    async: false,
    //    url: 'MenInfo/CommentExist',
    //    data: { orderid: aid },
    //    dataType: 'json',
    //    success: function (data)
    //    {
    //        if (data.ResultCode == "-2") {
    //            getOrderidDetail(data.Description, hid);
    //        } else {
    //            $("#FbdpBtn").disabled = false;
    //            popupMemberSupper("comment-write-pop");
    //            if (aid != "" && hid != "") {
    //                $("#hid_getOrderid").val(aid);
    //                $("#hid_getHotelid").val(hid);
    //            }
    //        }
    //    }
    //});

               $("#FbdpBtn").disabled = false;
                popupMemberSupper("comment-write-pop");
                if (aid != "" && hid != "") {
                    $("#hid_getOrderid").val(aid);
                    $("#hid_getHotelid").val(hid);
                }

}

//function getOrderidDetail(aid, hid) {
//    popupMemberSupper("del-wrap");
//    var varhtml = "";
//    if (aid != "" && hid != "") {
//        $.ajax({
//            async: false,
//            url: '/MemInfo/GetHotelmentDetail',
//            data: { orderid: aid, hotelid: hid },
//            dataType: "json",
//            success: function (data) {
//                if (data != null) {
//                    if (data != "-1") {
//                        varhtml = "";
//                    }
//                };
//            }
//        });
//    }
//}

function errorshow() {
    $("#error").hide();
    $("#error4").hide();
}
function error1show() {
    $("#error1").hide();
}
function error2show() {
    $("#error2").hide();
}
function error3show() {
    $("#error3").hide();
    $("#error5").hide();
}

