;;
Using()(['FormCheck'], 'RegisterIndx');
var InterValObj; //timer变量，控制时间
var super8;
Super8.extend({
    RegisterIndx: (function () {
        var registerIndx = new Class('RegisterIndx');
        registerIndx.inhert(wafobj);
        registerIndx.extend({
            init: function () {
                super8 = new Super8();
                var _self = this;
                $('div.ui-placeholder-re input').each(function () {
                    _self.placeholder($(this));
                });
                $("#Gender").val(1);
                super8.FormCheck.init({
                    triggerid: 'submit',
                    submitid: 'RegisterSm',
                    type: 'keyup',
                    url: '/MemInfo/GetLoginNameIsNO'
                });
            }

        });
        return new registerIndx;
    })()
});

$("#rsubmit").click(function () {
    $("#divPhoneNumShow").empty();
    $("#showWebCode").empty();
    $("#phonesendcode").empty();
    $("#allValidation").empty();
    $("#reginstname").empty();
    var PhoneNum = $("#PhoneNum").val();
    var webCode = $("#webCode").val();
    var RegisterCode = $("#RegisterCode").val();
    var CustomeName = $("#CustomeName").val();
    if (PhoneNum == "") {
        $("#divPhoneNumShow").append("<img src='/Statics/images/checkicon_wrong.gif' class='checkicon' /><span class='checkTip'>手机号不能为空</span>");
    } else {
        $("#divPhoneNumShow").empty();
    }
    if (webCode == "") {
        $("#showWebCode").append("<img src='/Statics/images/checkicon_wrong.gif' class='checkicon' /><span class='checkTip'>验证码不能为空</span>");
    } else {
        $("#showWebCode").empty();
    }
    if (RegisterCode == "") {
        $("#phonesendcode").append("<img src='/Statics/images/checkicon_wrong.gif' class='checkicon' /><span class='checkTip'>手机验证码不能为空</span>");
    } else {
        $("#phonesendcode").empty();
    }
    if (CustomeName == "") {
        $("#reginstname").append("<img src='/Statics/images/checkicon_wrong.gif' class='checkicon' /><span class='checkTip'>姓名不能为空</span>");
    } else {
        var myReg = /(^[A-Za-z]{5,20}$)|(^[\u4E00-\u9FA5]{2,8}$)/;
        if (!myReg.test(CustomeName)) {
            $("#reginstname").append("<img src='/Statics/images/checkicon_wrong.gif' class='checkicon' /><span class='checkTip'>姓名请输入中文或英文</span>");
        } else {
            $("#reginstname").empty();
        }
    }
    if (PhoneNum != "" && webCode != "" && RegisterCode != "" && CustomeName != "") {
        if (PhoneNum.length == 11) {
            document.getElementById('RegisterSm').submit();
        } else {
            $("#divPhoneNumShow").append("<img src='/Statics/images/checkicon_wrong.gif' class='checkicon' /><span class='checkTip'>手机号格式不正确</span>");
        }
    } else {
        return false;
    }
});

function GetCurrent() {
    $("#men").addClass("current")
    $("#women").removeClass("current")
    $("#Gender").val(1);
}
function GetCurrent1() {
    $("#women").addClass("current")
    $("#men").removeClass("current")
    $("#Gender").val(2);
}

function GetMemberSale(registerType) {
    $("#RegisterType").val(registerType);
}

function NewValidateCode() {
    document.getElementById("sp_imag").src = "/Register/NewValidateCodeImage?" + Math.random();
};
$(document).ready(function () {
    //var rtype = $("input[name='memberSale']:checked").val();
    //$("#RegisterType").val(rtype);
    $("#RegisterType").val(1006);
    $("#RegisterCode").val("");
    $("#btnSendCode").attr("disabled", "true");
    $("#btnSendCode").val("获取短信验证码");
    $("#btnSendCode").removeClass('btn-register-check');
    $("#btnSendCode").addClass('btn-register-nocheck');
    var args = new Object();
    args = GetUrlParms();
    //如果要查找参数key:
    if (args["historyresiterurl"] != undefined) {
        //如果要查找参数key:
        var value1 = args["historyresiterurl"];
        $("#ReRefUrl").val(value1);
    }
   
});
function GetUrlParms() {
    var args = new Object();
    var query = location.search.substring(1);//获取查询串 
    var pairs = query.split("&");//在逗号处断开 
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('=');//查找name=value 
        if (pos == -1) continue;//如果没有找到就跳过 
        var argname = pairs[i].substring(0, pos);//提取name 
        var value = pairs[i].substring(pos + 1);//提取value 
        args[argname] = unescape(value);//存为属性 
    }
    return args;
}
function webCodekeyup() {
    var webCode = $("#webCode").val();
    var PhoneNum = $("#PhoneNum").val();
    $("#divPhoneNumShow").empty();
    if (PhoneNum == "") {
        $("#divPhoneNumShow").append("<img src='/Statics/images/checkicon_wrong.gif' class='checkicon' /><span class='checkTip'>请填写手机号</span>");
        $("#webCode").val("");
        return;
    } else {
        if (PhoneNum.length != 11) {
            $("#divPhoneNumShow").append("<img src='/Statics/images/checkicon_wrong.gif' class='checkicon' /><span class='checkTip'>手机号格式不正确</span>");
            $("#webCode").val("");
            return;
        }
    }
    $("#allValidation").empty();
    $("#showWebCode").empty();
    $("#phonesendcode").empty();
    $("#reginstname").empty();
    if (webCode != "" && webCode.length == 4) {
        $("#webCode").removeClass("i_text_red");
        $.ajax({
            type: "GET",
            url: "/Register/GetRegisterCode?webCode=" + webCode,
            success: function (result) {
                if (result == 1) {
                    $("#showWebCode").append("<img src='/Statics/images/checkicon_check.gif' class='checkicon' />");
                    $("#btnSendCode").removeAttr("disabled");//启用按钮
                    $("#btnSendCode").removeClass('btn-register-nocheck');
                    $("#btnSendCode").addClass('btn-register-check');
                } else {
                    $("#showWebCode").append("<img src='/Statics/images/checkicon_wrong.gif' class='checkicon' /><span class='checkTip'>验证码错误</span>");
                    $("#btnSendCode").attr("disabled", "true");
                    $("#btnSendCode").removeClass('btn-register-check');
                    $("#btnSendCode").addClass('btn-register-nocheck');

                }
                if (!InterValObj) {
                    $("#btnSendCode").val("获取短信验证码");
                }
            }
        });
    } else {
        if (!InterValObj) {
            $("#btnSendCode").attr("disabled", "true");
            $("#btnSendCode").val("获取短信验证码");
            $("#btnSendCode").removeClass('btn-register-check');
            $("#btnSendCode").addClass('btn-register-nocheck');
            $("#webCode").addClass("i_text_red");
            $("#showWebCode").append("<img src='/Statics/images/checkicon_wrong.gif' class='checkicon' /><span class='checkTip'>验证码错误</span>");

        }
    }
};
function GetPhoneCode() {
    if (!InterValObj) {
        $("#showWebCode").empty();
        $("#divPhoneNumShow").empty();
        $("#phonesendcode").empty();
        $("#reginstname").empty();
        var count = 60; //间隔函数，1秒执行
        var curCount;//当前剩余秒数
        var userphone = $("#PhoneNum").val();
        var webCode = $("#webCode").val();
        if (webCode != "") {
            if (userphone != "") {
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: "/Register/GetPhoneCodeSKA?phone=" + userphone + "&checkcode=" + webCode + "&s8random=" + Math.random(),
                    success: function (result) {
                        //if (result == "001") {
                        //    $("#divPhoneNumShow").append("<img src='/Statics/images/checkicon_wrong.gif' class='checkicon' /><span class='checkTip'>手机已存在请直接登陆</span>");
                        //} else 
                        if (result == "002") {
                            $("#showWebCode").append("<img src='/Statics/images/checkicon_wrong.gif' class='checkicon' /><span class='checkTip'>验证码错误</span>");
                        }
                        else {
                            if (result != "00") {
                                $("#btnSendCode").attr("disabled", "true");
                                $("#btnSendCode").removeClass('btn-register-check');
                                $("#btnSendCode").addClass('btn-register-nocheck');
                                $("#btnSendCode").val(result);
                            } else {
                                curCount = count;
                                //设置button效果，开始计时
                                $("#btnSendCode").attr("disabled", "true");
                                $("#btnSendCode").removeClass('btn-register-check');
                                $("#btnSendCode").addClass('btn-register-nocheck');
                                $("#btnSendCode").val("请在" + curCount + "秒内输入");
                                window.clearInterval(InterValObj);
                                InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
                            }
                        }
                        NewValidateCode();
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("系统错误！");
                    }
                });
            } else {
                $("#PhoneNum").addClass("i_text_red");
            }
        }
    }


    //timer处理函数
    function SetRemainTime() {
        if (curCount == 0) {
            window.clearInterval(InterValObj);//停止计时器
            InterValObj = null;
            $("#btnSendCode").removeAttr("disabled");//启用按钮
            $("#btnSendCode").removeClass('btn-register-nocheck');
            $("#btnSendCode").addClass('btn-register-check');
            $("#btnSendCode").val("重新发送验证码");
        }
        else {
            curCount--;
            $("#btnSendCode").val("请在" + curCount + "秒内输入");
        }
    }
}

function getPhonenumnull() {
    $("#btnSendCode").removeClass('btn-register-check');
    $("#btnSendCode").addClass('btn-register-nocheck');
    $("#divPhoneNumShow").empty();
    $("#showWebCode").empty();
    $("#phonesendcode").empty();
    $("#reginstname").empty();
    $("#webCode").val("");
    var userphone = $("#PhoneNum").val();
    var reTel = /0?(13|14|15|16|17|18|19)[0-9]{9}$/;
    if (userphone != "") {
        if (!reTel.test(userphone)) {
            $("#divPhoneNumShow").append("<img src='/Statics/images/checkicon_wrong.gif' class='checkicon' /><span class='checkTip'>手机号格式不正确</span>");
        } else {
            $("#divPhoneNumShow").append("<img src='/Statics/images/checkicon_check.gif' class='checkicon' />");
        }
    } else {
        $("#divPhoneNumShow").append("<img src='/Statics/images/checkicon_wrong.gif' class='checkicon' /><span class='checkTip'>请填写手机号</span>");
    }
}

function getreginstname() {
    $("#reginstname").empty();
    var CustomeName = $("#CustomeName").val();
    if (CustomeName == "") {
        $("#reginstname").append("<img src='/Statics/images/checkicon_wrong.gif' class='checkicon' /><span class='checkTip'>姓名不能为空</span>");
    } else {
        var myReg = /(^[A-Za-z]{5,20}$)|(^[\u4E00-\u9FA5]{2,8}$)/;
        if (!myReg.test(CustomeName)) {
            $("#reginstname").append("<img src='/Statics/images/checkicon_wrong.gif' class='checkicon' /><span class='checkTip'>姓名请输入中文或英文</span>");
        } else {
            $("#reginstname").empty();
        }
    }
}




