(function ($) {
    $.extend({
        StringToJson: function (str, defaultobj) {
            var jsonObj = defaultobj;
            try {
                jsonObj = eval("(" + decodeURI(str) + ")");
            } catch (e) {

            }
            if (jsonObj == undefined || jsonObj == null) {
                jsonObj = defaultobj;
            }
            return jsonObj;
        },//将数组转成string
        ObjArryToString: function (arry, fieldkey, separatorval, fieldvalue, separator) {
            var tem = [];
            for (var i = 0; i < arry.length; i++) {
                //开始处理
                var keys = arry[i][fieldkey].split('-');
                var values = arry[i][fieldvalue].split('-');
                //处理多级
                var l = [];
                for (var k = 0; k < keys.length; k++) {
                    var key=keys[k];
                    var val=key;
                    if(values.length>k){
                        val=values[k];
                    }
                    l.push(key + separatorval + val);
                }
                tem.push(l.join('-'));
            }
            return tem.join(separator);
        },//将json对象绑定到元素上面
        SetStructureProperty: function (JsonModel, Element) {
            for (var Key in JsonModel) {
                var Val = JsonModel[Key];
                if (typeof JsonModel[Key] == "object") {
                    var Val = encodeURI(JSON.stringify(Val));
                    Element.attr(Key, Val);
                } else {
                    Element.attr(Key, Val);
                }
            }
            return Element;
        }//将服务器的数据转成本地可以使用的
        , ConverServerToLocal: function (ListData) {
            for (var i = 0; i < ListData.length; i++) {
                ListData[i].DataPool = $.StringToJson(ListData[i].DataPool, []);
                ListData[i].SubItem = $.StringToJson(ListData[i].SubItem, []);
                if (ListData[i].IsHide == 1) {
                    ListData[i].IsHide = true;
                } else {
                    ListData[i].IsHide = false;
                }
                if (ListData[i].IsRequired == 1) {
                    ListData[i].IsRequired = true;
                } else {
                    ListData[i].IsRequired = false;
                }
                if (ListData[i].IsStatistics == 1) {
                    ListData[i].IsStatistics = true;
                } else {
                    ListData[i].IsStatistics = false;
                }
                for (var k in ListData[i]) {
                    if (ListData[i][k] == null) {
                        ListData[i][k] = "";
                    }
                }
            }
            return ListData;
        },
        TimeRangeToObj: function (TimeRangeString, split) {
            //将时间范围字符串拆分成两个时间2018-12-04 00:00:00 - 2019-01-24 23:59:59
            var timearry = TimeRangeString.split(" - ");
            if (timearry.length > 1) {
                return { BeginTime: timearry[0], EndTime: timearry[1] };
            } else {
                return { BeginTime: "", EndTime: "" };
            }
        }
    });
}(jQuery));