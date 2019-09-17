
;;
Using()(['KeySearch', 'DataBind', 'Page'], 'HotelComment');
var super8;
Super8.extend({
    HotelComment: (function () {
        var hotelComment = new Class('HotelComment');
        hotelComment.inhert(wafobj);
        hotelComment.extend({
            init: function () {
                super8 = new Super8;
                var _modelhtml11;
                var sw = true;
                $(function () {
                    _modelhtml11 = $("[data-bind=containercomment]").html();
                })
                function hotelcommmenttype(cpidty) {
                    hotelcomment(cpidty);
                }
                $("[data-id=comment-tab] li:not(.fr)").unbind('click').click(function () {
                    $(this).toggleClass("current").siblings().removeClass("current");
                    if ($(this).hasClass("current")) {
                        $("#Cpid").val("");
                        cpid = $(this).attr("data-type");
                        $("#Cpid").val(cpid);
                        $("[data-id=hid_pageindex]").val("1");
                        hotelcomment();
                    }
                });
                function hotelcomment() {
                    var _pageindex = $("[data-id=hid_pageindex]").val() == "#data.pageindex#" ? "1" : $("[data-id=hid_pageindex]").val();
                    var _cpid = $("#Cpid").val();
                    $("#pager").html('');
                    $("[data-bind=containercomment]").html(_modelhtml11);
                    var hotelid = $("#hid_hotelid").val();
                    $("#tab_box_daodao").hide();
                    $("[data-id=g2]").show();
                    super8.DataBind.init({
                        srcobj: $("[data-bind=repetercomment]"),
                        url: "/UCLogin/HotelCommentList",
                        data: { cpid: _cpid, pageindex: _pageindex, hotelid: hotelid },
                        databinder: 'reperter',
                        call: SubRepeter,
                        model: 'HotelComment',
                        loadingimg: $("[data-id=g2]").find("[data-id=loadgroups]")
                    });
                    function SubRepeter(calldata) {
                    
                        $("[data-id=itemcomment]").each(function (e) {
                            var $this = $(this);
                            
                            var comid = $this.attr("data-data");
                            var $val = $this.find('[data-id=itemhid]').val();
                            var $span = $this.find('[data-id=span]');
                            var sTitle = '';
                            var sTitle2 = '';
                            if ($val.length > 100) {
                                sTitle = $val.substring(0, 100);
                                sTitle2 = $val.substring(100);
                                $val = '<p>' + sTitle + '<a id="connetshow_' + comid + '" href="javascript:void(0)" class="link-expand" onclick="getconnetshow(' + comid + ')">...全部</a><span style="display :none" id="phid_' + comid + '">' + sTitle2 + '<a id="connethid_' + comid + '" href="javascript:void(0)" class="link-expand" onclick="getconnethid(' + comid + ')">  收起</a></span></p>';
                            }
                            $span.html($val)
                        })
                        setTimeout(function () {
                            super8.Page.init({
                                srcid: 'comment-pager',
                                count: parseInt($("[data-id=hid_pages]").val()),
                                pageindex: parseInt($("[data-id=hid_pageindex]").val()),
                                call: hotelcomment
                            });
                        }, 200);
                        $("[data-bind=container]").show();
                        var $titleBar = $('#hotel-title-bar')
                            , $filter = $('#hotel-inner-filter')
                            , $win = $(window);
                        super8.KeepTop.init($titleBar);
                        var _self = this;
                        var offset = [];

                        $titleBar.find('a').each(function () {
                            var $el = $(this), $target = $($el.attr('rel'));
                            if ($target && $target.length > 0) {
                                offset.push([$el.parent(), $target.offset().top + $target.height() - 40]);
                                $el.click(function () {
                                    $('html,body').scrollTop($target.offset().top - 40);
                                })
                            }
                        });
                        $(window).scroll(function () {
                            var top = $win.scrollTop();
                            for (var n = 0, a = offset.length; n < a; n++) {
                                if (offset[n][1] > top) {
                                    offset[n][0].addClass("current").siblings().removeClass('current');
                                    break;
                                }
                            }
                        });
                    }
                }


                hotelcomment();

                $("#zpicon").click(function () {
                    var zpicon = $(this);
                    if (sw == false) {
                        $("#HuiZong").slideDown();
                        zpicon.attr("class", "btn-comment-expand");
                        sw = true;
                    } else {
                        $("#HuiZong").slideUp();
                        zpicon.attr("class", "btn-comment-hide");
                        sw = false;
                    }
                })
            },
            HaoPingLogin: function () {
                alert("请您先登录速8网站!");
                return false;
            },
            IsShowHotelImages: function (files) {
                if (files != "") {
                    var con = "";
                    var cis = files.split(';');
                    con = "<br/><div style='height:15px'></div><div class='photo-in-comment'>";
                    var loca = window.location.host;
                    for (var i = 0; i < cis.length; i++) {
                        if (cis[i] != "") {
                            con += "<a  href=http://m.super8.com.cn/hcomment/original/" + cis[i] + " class='pop-img' target='_blank'><img src=http://m.super8.com.cn/hcomment/thumbnail/" + cis[i] + " class='photo-comment'></a>&nbsp;&nbsp;";
                        }
                        if (i == 3 || i == 7) {
                            con += "<div style='height:8px'></div>";
                        }
                    }
                    con += "</div>";
                    return con;
                } else {
                    return '';
                }
            },
            IsShowMemberType1: function (show, connet) {
                if (show != "0")
                    return '<br/> <span class=\"member-class\">' + connet + '</span> ';
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
            }
        });
        return new hotelComment;
    })()
});
var HotelComment = new Super8().HotelComment;
;;
function getconnetshow(comid) {
    $("#connetshow_" + comid + "").hide();
    $("#phid_" + comid + "").show();
}

function getconnethid(comid) {
    $("#connetshow_" + comid + "").show();
    $("#phid_" + comid + "").hide();
}