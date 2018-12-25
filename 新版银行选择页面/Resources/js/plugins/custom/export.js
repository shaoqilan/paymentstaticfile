//导出表格数据文件
(function ($) {
    $.extend({
        ExportExcelFile: function (FileName,SQLString, ActionKey, EType) {
            var loadindex = top.window.layer.load(1, { shade: [0.1, '#fff'] });
            $.ajax({
                url: "/PublicAction/InsertExportQueueData",
                type: "post",
                data: { FileName:FileName,ExecuteSql: encodeURI(SQLString), ActionKey: ActionKey, EType: EType },
                dataType: "json",
                success: function (data) {
                    top.window.layer.close(loadindex);
                    if (data.ErrCode == 200) {
                        top.window.layer.open({
                            type: 2,
                            title: '导出数据',
                            shade: 0.8,
                            maxmin: true, //开启最大化最小化按钮
                            area: ['500px', '560px'],
                            content: '/PublicAction/ExportQueueManage?PK_EQID=' + data.Data.PK_EQID
                        });
                    } else {
                        top.window.layer.msg(data.ErrMsg, { icon: 1 });
                    }
                }
            });
        },
        ImportExcelFile: function (ActionType, WhereKey,CallBack) {
            $.OpenUpload({
                Filtration: [".xls"],
                RType: 1,//文档
                SelectedEnd: function (url) {
                    top.window.layer.open({
                        type: 2,
                        title: '导入结果',
                        shade: 0.8,
                        maxmin: true, //开启最大化最小化按钮
                        area: ['800px', '560px'],
                        content: '/PublicAction/ImportData?FileUrl=' + url + '&ActionType=' + ActionType + '&WhereKey=' + WhereKey + '',
                        end: function () {
                            if (CallBack != undefined && CallBack != null) {
                                CallBack(ActionType, WhereKey,url);
                            }
                        }
                    });
                }
            });
        }
    });
}(jQuery));