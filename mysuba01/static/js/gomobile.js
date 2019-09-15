getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
function uaredirect(murl) {
    try {
        var c = getQueryString("pc");
        var urlhash = window.location.hash;
        if (c != "pc") {
            if (!urlhash.match("fromapp")) {
                if ((navigator.userAgent.match(/(iPhone|iPod|Android|Windows Phone)/i))) {
                    location.replace(murl);
                }
            }
        }
    } catch (err) { }
}
uaredirect("http://m.super8.com.cn");