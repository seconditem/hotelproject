
$("#dlogin").click(function () {
    var ref = window.location.href;
    $("#RefUrl").val(ref);
});
$("#dregister").click(function () {
    var ref = window.location.href;
    window.location.href = "/Register/RegisterIndex?historyresiterurl =" + ref + "";
});
$("#tandregister").click(function() {
    var ref = window.location.href;
    window.location.href = "/Register/RegisterIndex?historyresiterurl =" + ref + "";
})
$("#checkchengeindexlogin").click(function () {
    $("#Indexerror").empty();
    $("#IndexCompanyerror").empty();
    $("#Indexcompanyloginerror").empty();
});
$("#checkchengeindexlogincompany").click(function () {
    $("#Indexerror").empty();
    $("#IndexCompanyerror").empty();
    $("#Indexloginerror").empty();
});
$("#btn3").click(function () {
    var loginname = $("#IndexLogin input[name='LoginName']").val();
    var passwd = $("#IndexLogin input[name='PassWd']").val();
    var imgCode = $("#IndexLogin input[name='ImgCode']").val();
    $("#Indexerror").empty();
    $("#IndexCompanyerror").empty();
    $("#Indexcompanyloginerror").empty();
    if (loginname == "") {
        $("#Indexloginerror").empty();
        $("#Indexloginerror").append("<div class='error'>请输入用户名</div>")
        $("#IndexLogin input[name='LoginName']").focus();
        return false;
    }
    if (passwd == "") {
        $("#Indexloginerror").empty();
        $("#Indexloginerror").append("<div class='error'>请输入密码</div>")
        $("#IndexLogin input[name='PassWd']").focus();
        return false;
    }
    if (imgCode == "") {
        $("#Indexloginerror").empty();
        $("#Indexloginerror").append("<div class='error'>请输入验证码</div>")
        $("#IndexLogin input[name='ImgCode']").focus();
        return false;
    }
    $.ajax({
        async: false,
        url: '/MemInfo/ValidateIndexLogin',
        data: {
            loginname: loginname, passwd: passwd,
            imgcode:imgCode,
            ts: Math.random()
        },
        dataType: "json",
        success: function (data) {
            if (data == 1) {
                document.getElementById('IndexLogin').submit();
            } else if (data == "-1") {
                $("#Indexloginerror").empty();
                IndexNewValidateCode('s8LGHeaderMem', 'sp_imag_HM');
                $("#Indexloginerror").append("<div class='error'>请输入正确的验证码</div>")
            }
            else {
                $("#Indexloginerror").empty();
                IndexNewValidateCode('s8LGHeaderMem', 'sp_imag_HM');
                $("#Indexloginerror").append("<div class='error'>请输入正确的用户名/密码</div>")
            }
        }
    });
});
$("#btn4").click(function () {
    var loginname = $("#IndexCompanyLogin input[name='LoginName']").val();
    var passwd = $("#IndexCompanyLogin input[name='PassWd']").val();
    var imgCode = $("#IndexCompanyLogin input[name='ImgCode']").val();
    $("#Indexerror").empty();
    $("#IndexCompanyerror").empty();
    $("#Indexloginerror").empty();
    if (loginname == "") {
        $("#Indexcompanyloginerror").empty();
        $("#Indexcompanyloginerror").append("<div class='error'>请输入用户名</div>")
        $("#IndexCompanyLogin input[name='LoginName']").focus();
        return false;
    }
    if (passwd == "") {
        $("#Indexcompanyloginerror").empty();
        $("#Indexcompanyloginerror").append("<div class='error'>请输入密码</div>")
        $("#IndexCompanyLogin input[name='PassWd']").focus();
        return false;
    }
    if (imgCode == "") {
        $("#Indexcompanyloginerror").empty();
        $("#Indexcompanyloginerror").append("<div class='error'>请输入验证码</div>")
        $("#IndexCompanyLogin input[name='ImgCode']").focus();
        return false;
    }
    $.ajax({
        async: false,
        url: '/Company/ValidateIndexCompanyLogin',
        data: {
            loginname: loginname, passwd: passwd,
            imgcode: imgCode,
            ts: Math.random()
        },
        dataType: "json",
        success: function (data) {
            if (data == 1) {
                document.getElementById('IndexCompanyLogin').submit();
            }
            else if (data == "-1") {
                $("#Indexcompanyloginerror").empty();
                IndexNewValidateCode('s8LGHeaderCom', 'sp_imag_com');
                $("#Indexcompanyloginerror").append("<div class='error'>请输入正确的验证码</div>")
            }
            else {
                $("#Indexcompanyloginerror").empty();
                IndexNewValidateCode('s8LGHeaderCom', 'sp_imag_com');
                $("#Indexcompanyloginerror").append("<div class='error'>请输入正确的用户名/密码</div>")
            }
        }
    });
});

function IndexNewValidateCode(codetype, objname) {
    $("#" + objname).attr("src", "/Register/NewValidateCodeImageType?imct=" + codetype + "&rd=?" + Math.random());
};
(function () {
    var timer = null,
    $hdlink = $('.top_head .top_head_right'),
    delay = 300,
    $hdmenu = $('.top_head .top-head-pop');

    $hdlink.hover(function () {
        clearTimeout(timer);
        $hdmenu.show();
    },
    function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            $hdmenu.hide();
        },
        delay)
    });
    $hdmenu.hover(function () {
        clearTimeout(timer);
        $hdmenu.show();
    },
    function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            $hdmenu.hide();
        },
        300)
    });


})();