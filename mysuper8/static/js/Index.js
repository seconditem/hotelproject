;;
$(document).ready(function(){
Using()(['CityList', 'KeyList'], 'HomeIndexNew');
var super8;
Super8.extend({
    HomeIndexNew: (function () {
        var homeindexnew = new Class('HomeIndexNew');
        homeindexnew.inhert(wafobj);
        homeindexnew.extend({
            init: function () {
                super8 = new Super8();
                var _self = this;
                super8.CityList.init({
                    srcid: 't-input-city',
                    keytagid: 'mydiv',
                    clicktagid: 'hotel_citylist',
                    citydata: s8b_cities,
                    selector: 'hid_city',
                    trigger: _self.CallKey,
                    pagesize: 5
                });
                this.CallKey();
                this.placeholder('#search-key');
                var maxOffDay = 88;
                var SERVER_TIME = new Date();

                var $fromDP = $('#fromdate'),
                    $toDP = $('#todate');

                var now = typeof window.SERVER_TIME !== "undefined" ? SERVER_TIME : new Date() //当前时间
                    , minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()) //最小时间
                    , maxDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + maxOffDay) //最大开始时间
                    , maxToDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + maxOffDay); //最大结束时间

                var defaultToDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)   //默认开始时间 从第二天开始
                    , defaultFromDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());  //默认开始时间 从第三天天开始

                var linkTo = $toDP.qdatepicker({ ui: "su8", refObj: $fromDP, defaultDay: defaultToDay.valueOf(), maxDate: maxToDate, strictMaxDate: maxToDate });
                $fromDP.qdatepicker({ ui: "su8", linkRules: "+1D,+1D,+14D", minDate: minDate, maxDate: maxDate, linkTo: linkTo, defaultDay: defaultFromDay.valueOf() });
                $("#ajaxSerch").click(function () {
                    if ($("#hid_city").val() == '') {
                        $("#t-input-city").click();
                        return;
                    }
                    var _stime = $(":text[node_type=from]").val(),
                    _etime = $(":text[node_type=to]").val(),
                    _citycode = $("#hid_city").val(),
                    _keycode, _cityname = $("#home_zbjd").val(), searchhref, _type;
                    $("#hid_key").val() != '' && (_keycode = $("#hid_key").val(), _type = 1);
                    $("#hid_keygov").val() != '' && (_keycode = $("#hid_keygov").val(), _type = 2);
                    $("#hid_keyhotel").val() != '' && (_keycode = $("#hid_keyhotel").val(), _type = 3);
                    
                    $.cookie("cityCodeCookie", $("#hid_city").val(), { path: '/', expires: 7 });
                    $.cookie("cityNameCookie", $("#t-input-city").val(), { path: '/', expires: 7 });
                    _stime && _etime && _citycode && (searchhref = 'citycode=' + _citycode + '&' + 'stime=' + _stime + '&' + 'etime=' + _etime + '&' + 'keycode=' + _keycode + '&type=' + _type, window.location.href = '/Hotel/List?' + searchhref);
                });
                $("#mapSearch").click(function () {
                    var _stime = $(":text[node_type=from]").val(),
                    _etime = $(":text[node_type=to]").val(),
                    _citycode = $("#hid_city").val(),
                    _keycode, _cityname = $("#home_zbjd").val(), searchhref, _type;
                    $("#hid_key").val() != '' && (_keycode = $("#hid_key").val(), _type = 1);
                    $("#hid_keygov").val() != '' && (_keycode = $("#hid_keygov").val(), _type = 2);
                    $("#hid_keyhotel").val() != '' && (_keycode = $("#hid_keyhotel").val(), _type = 3);
                    searchhref = '/Hotel/MapList/'
                    _stime && _etime && _citycode && (searchhref = 'citycode=' + _citycode + '&' + 'stime=' + _stime + '&' + 'etime=' + _etime + '&' + 'keycode=' + _keycode + '&type=' + _type, window.location.href = '/Hotel/MapList?' + searchhref);
                });
            },
            CallKey: function () {
                $("#t-input-key").val('');
                if (!("undefined" == typeof arounddata)) {
                    if ($("#t-input-city").val() != '') {
                        var data = arounddata[$("#hid_city").val()],
                        data_city = s8b_cityhotels[$("#hid_city").val()];
                        super8.KeyList.init({
                            srcid: 't-input-key',
                            keytagid: 'mykeydiv',
                            clicktagid: 'keyclick',
                            arounddata: data,
                            hoteldata: data_city,
                            selector: 'hid_key',
                            govselector: 'hid_keygov',
                            hotelselector: 'hid_keyhotel',
                            pagesize: 5
                        });
                    }
                }
            }
        });
        return new homeindexnew;
    })()
})
    ;;
});