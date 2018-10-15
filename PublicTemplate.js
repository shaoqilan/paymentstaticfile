
$(function () {
    //初始化页面
    IntPage();
    //显示银行列表
    for (var i = 0; i < BankList.length; i++) {
        if (BankList[i].BankCardTypeValue == "1") {
            var html = "";
            for (var k = 0; k < BankList[i].BankList.length; k++) {
                html += " <li><a class=\"click\" onclick=\"SelectBank(this, '" + BankList[i].BankList[k].BankCode + "')\" title=\"" + BankList[i].BankList[k].BankName + "\"><div class=\"selectoff\"></div><div class=\"" + BankList[i].BankList[k].OfficialBankCode + "\"></div></a></li>";
            }
            html += "<div class=\"clear\"></div>";
            $("#selectbank").html(html);
        }
    }
    //获取显示金额
    if (BankList.length > 0 && BankList[0].BankList.length > 0) {
        ShowOrder(BankList[0].BankList[0].OrderName, BankList[0].BankList[0].OrderNumber, BankList[0].BankList[0].OrderAmount);
    }
    //选中第一项
    $($("#selectbank").find("li a")[0]).click();
});
//初始化页面
function IntPage() {
    var PageHtml = '<div class="box"><div class="head"><h4 id="ProductName">商品名称:无</h4><p id="OrderNumber">订单号:无</p><div class="money"><p class="m1" id="Price">0.00</p><p class="m2">元</p></div></div><div class="main"><div class="titlebox"><span>借记卡网银</span></div><div class="bank"><ul id="selectbank"></ul><input type="button" onclick="Request(\'1\')" value="到网上银行支付" /></div></div></div>';
    $(document.body).append(PageHtml);
}
//显示订单的信息
function ShowOrder(ProductName, OrderNumber, Price) {
    $("#ProductName").text("商品名称:" + ProductName);
    $("#OrderNumber").text("订单号:" + OrderNumber);
    Price = (Price / 100).toFixed(2);
    $("#Price").text(Price);
}
//选择
function SelectBank(obj, code) {
    var lilist = obj.parentNode.parentNode.getElementsByTagName("li");
    for (var i = 0; i < lilist.length; i++) {
        lilist[i].getElementsByTagName("div")[0].className = "selectoff";
    }
    obj.getElementsByTagName("div")[0].className = "selectlock";
    BankCode = code;
}
//获取form代码
function GetForm(BankCardType, BankCode) {
    for (var i = 0; i < BankList.length; i++) {
        if (BankList[i].BankCardTypeValue == BankCardType) {
            for (var k = 0; k < BankList[i].BankList.length; k++) {
                if (BankList[i].BankList[k].BankCode == BankCode) {
                    return BankList[i].BankList[k];
                }
            }
        }
    }
    return null;
}
//提交
var BankCode = "";
function Request(BankCardType) {
    var Bank = GetForm(BankCardType, BankCode);
    var Form = $(Bank.Payment);
    //获取form类型
    if (Form.attr("ChannelType") == "Sand") {
        //是杉德
        var ApiUrl = Form.attr("action");
        var Parameter = [];
        for (var i = 0; i < Form.find("input").length; i++) {
            Parameter.push($(Form.find("input")[i]).attr("name") + "=" + $(Form.find("input")[i]).val());
        }
        $.ajax({
            type: "post",
            url: "/Payment/AgencyHttp",
            data:JSON.stringify({ HttpUrl: ApiUrl,Method:"POST", ContentType: 0, Parameter: Parameter.join("&") }),
            dataType: "text",
            success: function (ret) {
                var retBody = decodeURIComponent(ret);
                var Data = JSON.parse(GetQueryString(retBody, "data"));
                if (Data.head.respCode == "000000") {
                    var Credential = JSON.parse(Data.body.credential);
                    var TemForm = "<form style=\"display:none;\" action=\"" + Credential.submitUrl + "\" method=\"post\" accept-charset=\"utf-8\" enctype=\"application/x-www-form-urlencoded\">";
                    for (var pitem in Credential.params) {
                        TemForm += "<input name='" + pitem + "' value='" + Credential.params[pitem] + "' />";
                    }
                    TemForm += "</form>";
                    var FormObj = $(TemForm);
                    var ContDiv = $("<div></div>");
                    ContDiv.append(FormObj);
                    $(document.body).append(ContDiv);
                    FormObj.submit();
                } else {
                    alert("[" + Data.head.respCode + "]" + Data.head.respMsg);
                }
            }
        });
    } else {
        var ContDiv = $("<div></div>");
        ContDiv.append(Form);
        $(document.body).append(ContDiv);
        Form.submit();
    }
}
function GetQueryString(QueryString, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = QueryString.match(reg);
    if (r != null) return unescape(r[2]); return null;
}