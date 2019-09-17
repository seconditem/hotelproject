//会员价悬停显示
$(function () {
    var picDialog = {
        config: {
            delayShow: 500,
            delayBetweenShow: 200,
            delayClose: 0
        },
        timerClose: null,
        isShow: false,
        init: function () {
            var self = this;
            $(document).delegate("span.memberpriceHover", "mouseenter", function (e) {
                var $el = $(this)
                    , timer = $el.data('timer-show')
                    , delayShow = self.config.delayShow
                    , data = {
                        web: $el.attr('data-web'),
                        ep: $el.attr('data-ep'),
                        vipp: $el.attr('data-vip'),
                        goldp: $el.attr('data-gold'),
                        superp: $el.attr('data-super'),
                        account: $el.attr('data-account'),
                        voucher: $el.attr('data-voucher')
                    };
                if (!data.ep || !data.vipp || !data.goldp || !data.superp) return;
                timer && clearTimeout(timer);
                if (self.isShow) {
                    clearTimeout(self.timerClose);
                    delayShow = self.config.delayBetweentTagShow;
                }
                timer = setTimeout(function () {
                    self.renderLayer($el, data);
                }, delayShow);
                $el.data('timer-show', timer);
            });
            $(document).delegate("span.memberpriceHover", "mouseleave", function () {
                var $el = $(this)
                    , timerShow = $el.data('timer-show')
                clearTimeout(timerShow);
                self.timerClose = setTimeout(function () {
                    self.layer && self.close();
                }, self.config.delayClose);
            });

        },
        layer: null,
        renderLayer: function ($el, data) {
            var html = '<div class="member-price"><div class="hp-arrow"></div><ul><li data-id="popwebmprice"  class="current">官网价<br />￥' + data.web + '</li><li data-id="popEmemprice">网络会员<br />￥' + data.ep + '</li><li data-id="popLmemprice">贵宾会员<br />￥' + data.vipp + '</li><li data-id="popGmemprice">金卡会员<br />￥' + data.goldp + '</li><li data-id="popSmemprice">超级会员<br />￥' + data.superp + '</li></ul></div>';
            if (parseInt(data.account) > 0) {
                html = '<div class="member-price"><div class="hp-arrow"></div><div class="sale-intro">现金券可减<span class="red">' + data.account + '元</span></div><ul><li data-id="popwebmprice"  class="current">官网价<br />￥' + data.web + '</li><li data-id="popEmemprice">网络会员<br />￥' + data.ep + '</li><li data-id="popLmemprice">贵宾会员<br />￥' + data.vipp + '</li><li data-id="popGmemprice">金卡会员<br />￥' + data.goldp + '</li><li data-id="popSmemprice">超级会员<br />￥' + data.superp + '</li></ul></div>';
            }
            if (parseInt(data.voucher) > 0) {
                html = '<div class="member-price"><div class="hp-arrow"></div><div class="sale-intro">抵扣券可减<span class="red">' + data.voucher + '元</span></div><ul><li data-id="popwebmprice"  class="current">官网价<br />￥' + data.web + '</li><li data-id="popEmemprice">网络会员<br />￥' + data.ep + '</li><li data-id="popLmemprice">贵宾会员<br />￥' + data.vipp + '</li><li data-id="popGmemprice">金卡会员<br />￥' + data.goldp + '</li><li data-id="popSmemprice">超级会员<br />￥' + data.superp + '</li></ul></div>';
            }
            if (parseInt(data.account) > 0 && parseInt(data.voucher) > 0) {
                html = '<div class="member-price"><div class="hp-arrow"></div><div class="sale-intro">抵扣券可减<span class="red">' + data.voucher + '元</span>，现金券可减<span class="red">' + data.account + '元</span></div><ul><li data-id="popwebmprice"  class="current">官网价<br />￥' + data.web + '</li><li data-id="popEmemprice">网络会员<br />￥' + data.ep + '</li><li data-id="popLmemprice">贵宾会员<br />￥' + data.vipp + '</li><li data-id="popGmemprice">金卡会员<br />￥' + data.goldp + '</li><li data-id="popSmemprice">超级会员<br />￥' + data.superp + '</li></ul></div>';
            }
            var self = this;

            this.layer && this.layer.remove();
            this.layer = $(html);
            this.layer.appendTo(document.body);
            var memlevel = $("#hidmemflag").val();
            if (memlevel)
                if (memlevel) {
                    switch (memlevel) {
                        case "1": $("[data-id=popEmemprice]").addClass("current").siblings().removeClass("current"); break;
                        case "2": $("[data-id=popLmemprice]").addClass("current").siblings().removeClass("current"); break;
                        case "3": $("[data-id=popGmemprice]").addClass("current").siblings().removeClass("current"); break;
                        case "4": $("[data-id=popSmemprice]").addClass("current").siblings().removeClass("current"); break;
                        case "5": $("[data-id=popLmemprice]").addClass("current").siblings().removeClass("current"); break;
                        case "6": $("[data-id=popGmemprice]").addClass("current").siblings().removeClass("current"); break;
                        case "7": $("[data-id=popSmemprice]").addClass("current").siblings().removeClass("current"); break;
                    }
                } else
                    $("[data-id=popwebmprice]").addClass("current").siblings().removeClass("current")
            var offset = $el.offset();
            this.layer.show().css({
                "top": offset.top + $el.height() + 20 + "px",
                "left": offset.left + $el.outerWidth() / 2 - this.layer.outerWidth() / 2 + "px"
            });

            this.layer.mouseleave(function (e) {
                self.timerClose = setTimeout(function () {
                    self.close();
                }, self.config.delayClose);
            });
            this.layer.mouseenter(function (e) {
                clearTimeout(self.timerClose);
            });
            this.isShow = true;
        },
        close: function () {
            this.isShow = false;
            this.layer && this.layer.hide();
        }
    };
    picDialog.init();
})
//抵扣券悬停显示
$(function () {
    var couponsDialog = {
        config: {
            delayShow: 200,
            delayBetweenShow: 200,
            delayClose: 0
        },
        timerClose: null,
        isShow: false,
        init: function () {
            var self = this;
            $(document).delegate("span.quanr", "mouseenter", function (e) {
                var $el = $(this)
                    , timer = $el.data('timer-show')
                    , delayShow = self.config.delayShow
                    , data = {
                        account: $el.attr('data-account'),
                        voucher: $el.attr('data-voucher')
                    };
                if (!data.account || !data.voucher) return;
                timer && clearTimeout(timer);
                if (self.isShow) {
                    clearTimeout(self.timerClose);
                    delayShow = self.config.delayBetweentTagShow;
                }
                timer = setTimeout(function () {
                    self.renderLayer($el, data);
                }, delayShow);
                $el.data('timer-show', timer);
            });
            $(document).delegate("span.quanr", "mouseleave", function () {
                var $el = $(this)
                    , timerShow = $el.data('timer-show')
                clearTimeout(timerShow);
                self.timerClose = setTimeout(function () {
                    self.layer && self.close();
                }, self.config.delayClose);
            });

        },
        layer: null,
        renderLayer: function ($el, data) {
            var html = '';
            if (parseInt(data.voucher) > 0) {
                html = '<div class="hover-quanr" ><div class="hp-arrow"></div><div>可使用' + data.voucher + '元抵扣券</div></div>';
            }
            if (parseInt(data.account) > 0) {
                html = '<div class="hover-quanr" ><div class="hp-arrow"></div><div>可使用' + data.account + '元现金券</div></div>';
            }
            if (parseInt(data.voucher) > 0 && parseInt(data.account) > 0) {
                html = '<div class="hover-quanr" ><div class="hp-arrow"></div><div>可使用' + data.voucher + '元抵扣券+' + data.account + '元现金券</div></div>';
            }
            var self = this;

            this.layer && this.layer.remove();
            this.layer = $(html);
            this.layer.appendTo(document.body);

            var offset = $el.offset();
            this.layer.show().css({
                "top": offset.top + $el.height() + 15 + "px",
                "left": offset.left + $el.outerWidth() / 2 - 14 + "px"
            });

            this.layer.mouseleave(function (e) {
                self.timerClose = setTimeout(function () {
                    self.close();
                }, self.config.delayClose);
            });
            this.layer.mouseenter(function (e) {
                clearTimeout(self.timerClose);
            });
            this.isShow = true;
        },
        close: function () {
            this.isShow = false;
            this.layer && this.layer.hide();
        }
    };
    couponsDialog.init();
})

//礼 悬停显示
$(function () {
    var giftDialog = {
        config: {
            delayShow: 100,
            delayBetweenShow: 200,
            delayClose: 0
        },
        timerClose: null,
        isShow: false,
        init: function () {
            var self = this;
            $(document).delegate("em.li", "mouseenter", function (e) {
                var $el = $(this)
                    , timer = $el.data('timer-show')
                    , delayShow = self.config.delayShow
                    , data = {
                        li: $el.attr('data-li')
                    };
                if (!data.li) return;
                timer && clearTimeout(timer);
                if (self.isShow) {
                    clearTimeout(self.timerClose);
                    delayShow = self.config.delayBetweentTagShow;
                }
                timer = setTimeout(function () {
                    self.renderLayer($el, data);
                }, delayShow);
                $el.data('timer-show', timer);
            });
            $(document).delegate("em.li", "mouseleave", function () {
                var $el = $(this)
                    , timerShow = $el.data('timer-show')
                clearTimeout(timerShow);
                self.timerClose = setTimeout(function () {
                    self.layer && self.close();
                }, self.config.delayClose);
            });

        },
        layer: null,
        renderLayer: function ($el, data) {

            var html = '<div class="hover-li" ><div class="hp-arrow"></div><div>' + data.li + '</div></div>';
            var self = this;

            this.layer && this.layer.remove();
            this.layer = $(html);
            this.layer.appendTo(document.body);

            var offset = $el.offset();
            this.layer.show().css({
                "top": offset.top + $el.height() + 15 + "px",
                "left": offset.left + $el.outerWidth() / 2 - 14 + "px"
            });

            this.layer.mouseleave(function (e) {
                self.timerClose = setTimeout(function () {
                    self.close();
                }, self.config.delayClose);
            });
            this.layer.mouseenter(function (e) {
                clearTimeout(self.timerClose);
            });
            this.isShow = true;
        },
        close: function () {
            this.isShow = false;
            this.layer && this.layer.hide();
        }
    };
    giftDialog.init();
})

//团购价 抵扣券悬停显示
$(function () {
    var tecouponsDialog = {
        config: {
            delayShow: 50,
            delayBetweenShow: 200,
            delayClose: 0
        },
        timerClose: null,
        isShow: false,
        init: function () {
            var self = this;
            $(document).delegate("span.memberpriceTe", "mouseenter", function (e) {
                var $el = $(this)
                    , timer = $el.data('timer-show')
                    , delayShow = self.config.delayShow
                    , data = {
                        account: $el.attr('data-account'),
                    };
                if (!data.account) return;
                timer && clearTimeout(timer);
                if (self.isShow) {
                    clearTimeout(self.timerClose);
                    delayShow = self.config.delayBetweentTagShow;
                }
                timer = setTimeout(function () {
                    self.renderLayer($el, data);
                }, delayShow);
                $el.data('timer-show', timer);
            });
            $(document).delegate("span.memberpriceTe", "mouseleave", function () {
                var $el = $(this)
                    , timerShow = $el.data('timer-show')
                clearTimeout(timerShow);
                self.timerClose = setTimeout(function () {
                    self.layer && self.close();
                }, self.config.delayClose);
            });

        },
        layer: null,
        renderLayer: function ($el, data) {
            var html = '';
            if (parseInt(data.account) > 0) {
                html = '<div class="hover-quanr border-red" ><div class="hp-arrow"></div><div>现金券可减' + data.account + '元</div></div>';
            }
            var self = this;

            this.layer && this.layer.remove();
            this.layer = $(html);
            this.layer.appendTo(document.body);

            var offset = $el.offset();
            this.layer.show().css({
                "top": offset.top + $el.height() + 15 + "px",
                "left": offset.left + $el.outerWidth() / 2 - 14 + "px"
            });

            this.layer.mouseleave(function (e) {
                self.timerClose = setTimeout(function () {
                    self.close();
                }, self.config.delayClose);
            });
            this.layer.mouseenter(function (e) {
                clearTimeout(self.timerClose);
            });
            this.isShow = true;
        },
        close: function () {
            this.isShow = false;
            this.layer && this.layer.hide();
        }
    };
    tecouponsDialog.init();
})

//酒店荣誉悬停
$(function () {
    $('.pride').livequery(function () {
        $(this).hover(function () {
            $(this).find('.hover-pride').fadeIn(300);
        },
        function () {
            $(this).find('.hover-pride').fadeOut(300);
        });
    });
    //$('.pride').hover(function () {
    //    $(this).find('.hover-pride').fadeIn(300);
    //}, function () {
    //    $(this).find('.hover-pride').fadeOut(300);
    //});
});


