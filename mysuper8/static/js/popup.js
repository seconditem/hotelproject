var myWidth = 0;
var myHeight = 0;
var myScroll = 0;
var isIe = (document.all) ? true : false;
//设置select的可见状态

function setSelectState(state) {
    var objl = document.getElementsByTagName('select');
    for (var i = 0; i < objl.length; i++) {
        objl[i].style.visibility = state;
    }
}//弹出层定位
function mousePosition(ev) {
    if (ev.pageX || ev.pageY) {
        return { x: ev.pageX, y: ev.pageY };
    }
    return {
        x: ev.clientX + document.body.scrollLeft - document.body.clientLeft, y: ev.clientY + document.body.scrollTop - document.body.clientTop
    };
}
//弹出方法
function showMessageBox(sourceDivId, wWidth, flag) {

    var vbody = document.getElementsByTagName('body')[0];
    vbody.style.cssText = "overflow:hidden;"

    var bWidth = parseInt(document.documentElement.scrollWidth);
    var bHeight = parseInt(document.documentElement.scrollHeight);

    if (isIe) {
        setSelectState('hidden');
    }
    var back = document.createElement("div");
    back.id = "back";
    back.className = "popback";
    var styleStr = "top:0px;left:0px;position:absolute;z-index:1899;background:#666;filter:alpha(opacity=50);opacity:0.5;width:" + bWidth + "px;height:" + bHeight + "px;";
    //styleStr+=(isIe)?"filter:alpha(opacity=50);":"opacity:0.5;";
    back.style.cssText = styleStr;
    document.body.appendChild(back);
    //showBackground(back,50);

    /*
	var mesW=document.createElement("div");
	mesW.id="memberWindow";
	mesW.className=popupClassname;
	mesW.innerHTML=srcDiv.innerHTML;
	*/
    var srcDiv = document.getElementById(sourceDivId);

    //get window size..
    if (self.innerHeight) { // Everyone but IE from fancyzoom.js
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
        myScroll = window.pageYOffset;
    } else if (document.documentElement && document.documentElement.clientHeight) { // IE6 Strict
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
        myScroll = document.documentElement.scrollTop;
    } else if (document.body) { // Other IE, such as IE7
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
        myScroll = document.body.scrollTop;
    }
    if (srcDiv)
        srcDiv.style.display = "";

    var v_top = (myHeight - srcDiv.offsetHeight) / 2;
    v_top += myScroll;//加滚动高度
    if (v_top < 0) v_top = 0;

    //计算定位的left侧值
    if (flag) {//flag为true,wWidth失效，自动计算宽度
        var v_left = (myWidth - srcDiv.offsetWidth) / 2;//用源目标div宽度
        styleStr = "top:" + (v_top) + "px;left:" + v_left + "px;position:absolute;z-index:19999;";
    } else {//flag为false,按wWidth计算宽度
        v_left = (myWidth - wWidth) / 2;//用div的传值宽度
        styleStr = "width:" + (wWidth) + "px;top:" + (v_top) + "px;left:" + v_left + "px;position:absolute;z-index:19999;";
    }
    //srcDiv.style.display = "none";

    /*mesW.style.cssText=styleStr;
	document.body.appendChild(mesW);*/
    srcDiv.style.cssText = styleStr;
    srcDiv.style.display = "";
}

//让背景渐渐变暗
function showBackground(obj, endInt) {
    if (isIe) {
        obj.filters.alpha.opacity += 5;
        if (obj.filters.alpha.opacity < endInt) {
            setTimeout(function () { showBackground(obj, endInt) }, 5);
        }
    } else {
        var al = parseFloat(obj.style.opacity); al += 0.05;
        obj.style.opacity = al;
        if (al < (endInt / 100))
        { setTimeout(function () { showBackground(obj, endInt) }, 5); }
    }
}
//关闭窗口
function closeWindow(srcDiv) {
    if (document.getElementById('back') != null) {
        document.getElementById('back').parentNode.removeChild(document.getElementById('back'));
    }
    if (document.getElementById(srcDiv) != null) {
        document.getElementById(srcDiv).style.display = "none";
    }
    if (isIe) {
        setSelectState('');
    }

    document.getElementsByTagName('body')[0].style.cssText = "overflow:;"
}

//发送朋友关闭隐藏
function popMbrOpenCheck(flag, srcDivId, openWidth, closeWidth) {//根据flag 传值，控制关闭隐藏，返回相应div宽度
    if (flag == true) {
        var sendFrds = document.getElementById("popmbrFriends");//打开发送朋友层
        sendFrds.style.display = "";
        return openWidth;
    } else {
        var sendFrds = document.getElementById("popmbrFriends");//关闭发送朋友层
        sendFrds.style.display = "none";
        return closeWidth;
    }
}

function popupMemberSupper(srcDiv)//无需传event参数
{
    showMessageBox(srcDiv, 410, true);
}

function popupMemberFlag(ev, srcDiv, srcClass, wwidthO, wwidthC, flag) {
    var mywidth = popMbrOpenCheck(flag, srcDiv, wwidthO, wwidthC);
    //var objPos = mousePosition(ev);
    showMessageBox(srcDiv, srcClass, mywidth, false);
}


function showPop(element) {
    $('.' + element).show();
    $('body').css('overflow', 'hidden').append('<div class="bg-pop"></div>');
    $('html').css('overflow', 'hidden');
}

function hidePop(element) {
    $('.' + element).hide();
    $('body div').remove('.bg-pop');
    $('body').css('overflow', 'auto');
    $('html').css('overflow', 'auto');
}
