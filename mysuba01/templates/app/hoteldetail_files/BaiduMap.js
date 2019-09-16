;;

Super8.extend({
    BaiduMap: (function () {
        var baiduMap = new Class('BaiduMap');
        baiduMap.inhert(wafobj);
        baiduMap.extend({
            firload: true,
            acload: false,
            ac1load: false,
            hotelname: '',
            ac: null,
            ac1: null,
            map: null,
            init: function (MapData) {
                var mapdata = MapData;
                if (mapdata == null) return;
                this.hotelname = mapdata.hotelname;
                var sContent = ' <div style="width: auto; height: auto; text-align: center;" class="BMap_bubble_content"><h4 style="margin: 0px 0px 5px; padding: 0.2em 0px; color: rgb(224, 54, 59);">' + mapdata.hotelname + '</h4>' +
                    '<img  id="imgDemo"  style="width: 150px; height: 100px;" src=' + mapdata.pic + ' width="139" height="104" title=' + mapdata.hotelname + '/>' +
                    '</div>';
                if (this.map == null)
                    this.map = new BMap.Map("allmapBig", { enableMapClick: false });
                else
                    this.map.clearOverlays();
                //var mapall = new BMap.Panorama("allmapBigall", { navigationControl: true });
                var point = new BMap.Point(mapdata.x, mapdata.y);
                //var point = new BMap.Point(116.5755, 40.0769);
                //mapall.setPosition(point);
                var marker = new BMap.Marker(point);
                var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
                this.map.centerAndZoom(point, 15);
                this.map.addOverlay(marker);
                this.map.enableScrollWheelZoom(true);
                marker.addEventListener("click", function () {
                    this.openInfoWindow(infoWindow);
                    //图片加载完毕重绘infowindow
                    document.getElementById('imgDemo').onload = function () {
                        infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
                    }
                });
                marker.openInfoWindow(infoWindow, marker.getPosition());
                marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                $(".back").hide();
                $("#resl").hide();
                $(".around-search").show();
                $(".map-around-result").hide();
                $(".map-route-search").show();
                $("#suggestId").val('');
                $("#suggestendI").val('');
                setTimeout(function () { $("#suggestendId").val(mapdata.hotelname) }, 1000);
                //if (!this.firload)
                //    return;
                var that = this;
                function acPacking() {
                    that.ac = new BMap.Autocomplete({
                        "input": "suggestId",
                        "location": that.map
                    });
                    that.ac.addEventListener("onconfirm", function (e) {
                        var _value = e.item.value;
                        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                    });
                    setTimeout(function () { $(".tangram-suggestion-main").css({ "z-index": 999999 }); }, 2000);
                };
                function ac1Packing() {
                    that.ac1 = new BMap.Autocomplete({
                        "input": "suggestendId",
                        "location": that.map
                    });
                    that.ac1.addEventListener("onconfirm", function (e) {
                        var _value = e.item.value;
                        end = _value.province + _value.city + _value.district + _value.street + _value.business;
                    });
                    setTimeout(function () { $(".tangram-suggestion-main").css({ "z-index": 999999 }); }, 2000);
                };
                $("#suggestId").unbind("keyup").keyup(function () {
                    if (that.acload)
                        acPacking();
                    that.acload = false;
                });
                $("#suggestendId").unbind("keyup").keyup(function () {
                    if (that.ac1load)
                        ac1Packing();
                    that.ac1load = false;
                });
                acPacking();
                ac1Packing();
                var myValue;
                var end = point;
                $("[data-id=change]").unbind("click").click(function () {
                    var temp = $("#suggestId").val();
                    $("#suggestId").val($("#suggestendId").val())
                    $("#suggestendId").val(temp);
                });
                function tjcz(select) {
                    switch (select) {
                        case "公交": return new BMap.TransitRoute(that.map, {
                            renderOptions: { map: that.map, panel: "resl" },
                            policy: 0
                        });
                        case "驾车": return new BMap.DrivingRoute(that.map, {
                            renderOptions: { map: that.map, panel: "resl" },
                            policy: 0
                        });
                        case "步行": return new BMap.WalkingRoute(that.map, {
                            renderOptions: { map: that.map, panel: "resl" },
                            policy: 0
                        });
                    }
                };
                var mapway, transit, routeway;
                $("#result").unbind("click").click(function () {
                    resultFunc();
                });
                function resultFunc() {
                    that.map.clearOverlays();
                    routeway = $('#route-way').children("a.selected").html();
                    if (routeway == "" || !routeway)
                        transit = tjcz("公交");
                    else
                        transit = tjcz(routeway);
                    transit.search(myValue, end);
                    $(".around-search").hide();
                    $(".back").show();
                    $("#resl").show();
                };
                $(".back").unbind("click").click(function () {
                    $(".back").hide();
                    $("#resl").hide();
                    $(".around-search").show();
                    $(".map-around-result").hide();
                    $(".map-route-search").show();
                });
                $("[data-id=nearby]").unbind("click").click(function () {
                    $(".back").show();
                    var $this = $(this);
                    var ls = new BMap.LocalSearch(point, {
                        renderOptions: {},
                        pageCapacity: 7
                    });
                    ls.setSearchCompleteCallback(function (data) {
                        var htmlarr = [], aroundmap = {}, poi, poiarr = [], mapcover, map = super8.BaiduMap.map;
                        map.clearOverlays();
                        var marker = new BMap.Marker(point);  // 创建标注
                        map.addOverlay(marker);               // 将标注添加到地图中
                        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                        for (var i = 1; data.getPoi(i) ; i++) {
                            poi = data.getPoi(i);
                            htmlarr.push(
                               '<div class="around_item" data-id="aroudclick" data-code="' + i + '">' +
                                   '<span class="num">' + i + '</span>' +
                                   '<span class="distance">' +
                                        '<span>' + map.getDistance(point, poi.point).toFixed(2) + '</span>米' +
                                   '</span>' +
                                   '<p class="name">' +
                                     '<a target="_blank" title="' + poi.title + '" href="' + poi.url + '" class="around_hotel">' + poi.title + '</a>' +
                                   '</p>' +
                                   '<div class="go_to" style="display:block;">' +
                                       '<a href="javascript:;" data-way="transfer" data-code="' + i + '">公交</a>|<a href="javascript:;" data-way="driving" data-code="' + i + '">驾车</a>|<a href="javascript:;" data-way="walking" data-code="' + i + '">步行</a>' +
                                   '</div>' +
                               '</div>'
                            );
                            aroundmap[i + ''] = poi.point;
                            poiarr.push(poi.point);
                            mapcover = new ComplexCustomOverlay(poi.point, i, poi.url, poi.title);
                            map.addOverlay(mapcover);
                        }
                        that.map.setViewport(poiarr);
                        $("#aroundlist").html(htmlarr.join(''));
                        $(".map-around-result").show();
                        $(".map-route-search").hide();
                        new Super8().Page.init({
                            srcid: 'pagermap',
                            count: data.getNumPages() - 1,
                            pageindex: parseInt($("[data-id=hid_pageindex]").val()),
                            call: function (to) {
                                if (this.pageindex <= data.getNumPages() && this.pageindex >= 1)
                                    ls.gotoPage(this.pageindex);
                            }
                        });
                        $("[data-id=aroudclick]").unbind("click").click(function () {
                            var code = $(this).attr("data-code");
                            $("#mapspan" + code).mouseover();
                        });
                        $("[data-way]").unbind("click").click(function () {
                            var code = $(this).attr("data-code");
                            mapway = $(this).html();
                            $('#route-way a').removeClass("selected");
                            $('#route-way').children("a").each(function () {
                                if ($(this).html() == mapway)
                                    $(this).addClass("selected");
                            })
                            $("#mapspan" + code).click();
                        });
                        $("[data-id=aroundnum]").html(data.getNumPages());
                    })
                    ls.searchNearby($(this).html(), point);
                });
                $('#route-way').children().unbind("click").click(function () {
                    $(this).addClass('selected').siblings().removeClass('selected');
                    if ($('.map-route-search .map-side-title .back').is(':visible')) {
                        $('.route_search_box').children().hide().eq($(this).index()).show();
                    };
                });
                function G(id) {
                    return document.getElementById(id);
                }
                function ComplexCustomOverlay(point, text, url, title) {
                    this._point = point;
                    this._text = text;
                    this._url = url;
                    this._title = title;
                }
                ComplexCustomOverlay.prototype = new BMap.Overlay();
                ComplexCustomOverlay.prototype.initialize = function () {
                    this._map = super8.BaiduMap.map;
                    var div = this._div = document.createElement("div");
                    div.style.position = "absolute";
                    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
                    div.style.color = "white";
                    div.style.height = "18px";
                    div.style.padding = "2px";
                    div.style.lineHeight = "18px";
                    div.style.whiteSpace = "nowrap";
                    div.style.MozUserSelect = "none";
                    div.style.fontSize = "24px";

                    var innerdiv = this._innerdiv = document.createElement("div");
                    div.appendChild(innerdiv);

                    var divspan = this._span = document.createElement("span");
                    divspan.id = "mapspan" + this._text;
                    divspan.style.background = "url(/Statics/images/s_map_pop_side.png) no-repeat 0 -346px";
                    divspan.style.width = "24px";
                    divspan.style.height = "28px";
                    divspan.style.lineHeight = "24px";
                    divspan.style.display = "block";
                    divspan.style.textAlign = "center";
                    divspan.style.position = "absolute";
                    divspan.style.fontWeight = "bold";
                    divspan.style.fontSize = "12px";
                    divspan.style.fontFamily = '"微软雅黑","Microsoft yahei", arial, Simsun, sans - serif';
                    innerdiv.appendChild(divspan);
                    divspan.innerHTML = this._text;

                    var arrow = this._arrow = document.createElement("div");
                    arrow.style.background = "url(http://map.baidu.com/fwmap/upload/r/map/fwmap/static/house/images/label.png) no-repeat";
                    arrow.style.position = "absolute";
                    arrow.style.width = "1px";
                    arrow.style.height = "1px";
                    arrow.style.top = "22px";
                    arrow.style.left = "10px";
                    arrow.style.overflow = "hidden";
                    arrow.style.backgroundColor = "red";
                    div.appendChild(arrow);

                    var that = this;
                    divspan.onmouseover = function () {
                        var sContent = ' <div style="width: auto; height: auto; text-align: center;" class="BMap_bubble_content"><h4 style="margin: 0px 0px 5px; padding: 0.2em 0px; color: rgb(224, 54, 59);">' + that._title + '</h4>'
                            +
                            '<a target="_blank" href="' + that._url + '">详情>></a>'
                        '</div>';
                        var infoWindow = new BMap.InfoWindow(sContent);
                        super8.BaiduMap.map.openInfoWindow(infoWindow, that._point);
                    };
                    divspan.onclick = function () {
                        super8.BaiduMap.acload = true;
                        super8.BaiduMap.ac1load = true;
                        super8.BaiduMap.ac.dispose();
                        super8.BaiduMap.ac1.dispose();
                        myValue = point;
                        end = that._point;
                        $("#suggestId").val(mapdata.hotelname);
                        $("#suggestendId").val(that._title);
                        $(".map-route-search").show();
                        $(".map-around-result").hide();
                        resultFunc();
                    };
                    super8.BaiduMap.map.getPanes().labelPane.appendChild(div);
                    return div;
                }
                ComplexCustomOverlay.prototype.draw = function () {
                    var map = this._map;
                    var pixel = map.pointToOverlayPixel(this._point);
                    this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
                    this._div.style.top = pixel.y - 30 + "px";
                }
                this.firload = false;
            }
        });
        return new baiduMap;
    })()
});
;;