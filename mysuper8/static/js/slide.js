;; (function ($) {
    var defaultOptions = {
        images: [],
        container: '',
        selector: '',
        slideWidth: '',
        refimg: '',
        HotelBrand:''
    }
    var method = {
        index: 0,
        maxlen: 0,
        init: function (options) {
            var j = 0;
            var $this = $(this);
            var container = '<div class="img-list" id="slider-img-list">' +
                '<a class="arrow arrow-left arrow-left-disable" href="javascript:void(0)" data-id="left"></a>' +
                '<a class="arrow arrow-right" href="javascript:void(0);" data-id="right"></a>' +
                '<div class="img-list-wrapper">' +
                '<ul class="img-list-content" data-id="groups">' +
                '<li class="item-group" data-id="group">' +
                '<ul>' +
                '</ul>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '</div>';
            $('#' + options.container).html(container);

            for (var i = 0; i < options.images.length; i++) {
                if (i != 0) {
                    if (i % 9 == 0) {

                        var ul = $('<li class="item-group" data-id="group">' +
                            '<ul>' +
                            '</ul>' +
                            '</li>');
                        $("[data-id=groups]").append(ul);
                        j++;
                    }
                }

                if (options.images[i] != undefined) {
                    if (options.images[i].pictureTypeid == 12) {
                        $("#" + options.refimg).find("a>img").eq(0).hide();
                        $("#" + options.refimg).find("a").eq(1).attr('VideoUrl', options.images[i].VideoUrl);
                        $("#" + options.refimg).find("a>img").eq(1).show().attr("src", options.images[i].url);
                    }
                    
                    if (options.HotelBrand == '2') {
                        var li = $('<li ><a href="javascript:void(0);">' +
                            '<img src="' +
                            options.images[i].url +
                            '" alt="速8精选酒店" data-pic="' +
                            options.images[i].url +
                            '" data-VideoUrl="' +
                            options.images[i].VideoUrl +
                            '" data-pictureTypeid="' +
                            options.images[i].pictureTypeid +
                            '"></a></li>')
                    } else {
                        var li = $('<li ><a href="javascript:void(0);">' +
                            '<img src="' + options.images[i].url + '" alt="速8酒店" data-pic="' + options.images[i].url + '" data-VideoUrl="' + options.images[i].VideoUrl + '" data-pictureTypeid="' + options.images[i].pictureTypeid + '"></a></li>')
                    }

                    $($("[data-id=group]")[j]).children("ul").append(li);
                }


            }

            method.maxlen = $("[data-id=group]").length;
            method.rightSlide.call($this, options);
            method.leftSilde.call($this, options);
            $("#slider-img-list").find("[data-id=groups] li").not("[data-id=group]").click(function () {
                if ($(this).find("img").attr("data-pictureTypeid") == 12) {

                    //$("#" + options.refimg).find("img").attr("src", $(this).find("img").attr("src"));
                    $("#" + options.refimg).find("a>img").eq(0).hide();
                    $("#" + options.refimg).find("a").eq(1).attr('vUrl', $(this).find("img").attr("data-VideoUrl"));
                    $("#" + options.refimg).find("a>img").eq(1).show().attr("src", $(this).find("img").attr("data-pic"));
                } else {
                    $("#" + options.refimg).find("a>img").eq(0).show();
                    $("#" + options.refimg).find("a>img").eq(1).hide();
                    $("#" + options.refimg).find("a>img").eq(0).attr("src", $(this).find("img").attr("src"));
                }

            }).mouseover(function () {
                $(this).addClass("current").siblings().removeClass("current");
            });
        },
        rightSlide: function (options) {
            $("[data-id=right]").click(function () {
                if (method.index == (method.maxlen - 1)) {
                    return;
                }
                $($("[data-id=group]")[method.index]).animate({
                    'marginLeft': options.slideWidth * -1
                });
                method.index++;
                if (method.index == (method.maxlen - 1)) {
                    $(this).addClass("arrow-right-disable");
                    $("[data-id=left]").removeClass("arrow-left-disable");
                }
            });
        },
        leftSilde: function (options) {
            $("[data-id=left]").click(function () {
                if (method.index == 0) {
                    return;
                }
                method.index--;
                $($("[data-id=group]")[method.index]).animate({
                    'marginLeft': 0
                });

                if (method.index <= 0) {
                    $(this).addClass("arrow-left-disable");
                    $("[data-id=right]").removeClass("arrow-right-disable");
                }
            });
        },
        clickImg: function () {


        }
    }
    $.fn.slide = function (options) {
        $.extend({}, options, defaultOptions);
        return this.each(function () {
            method.init.call(this, options)
        })
    }
})(jQuery);;