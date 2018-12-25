var summernotedefaultsetting = {
    lang: 'zh-CN',
    toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline', 'clear']], // ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],  ['fontname', ['fontname']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['height', ['height']],
        ['table', ['table']],
        ['insert', ['ulink', 'upicture', 'hr']],
        ['view', ['fullscreen', 'codeview']]
    ],
    buttons: {
        upicture: function (context) {
            var ui = $.summernote.ui;
            var button = ui.button({
                contents: '<i class="note-icon-picture"/>',
                tooltip: '图片',
                click: function () {
                    $.OpenUpload({
                        Multiple: true,
                        RType: 0,
                        SelectedEnd: function (FileList) {
                            for (var i = 0; i < FileList.length; i++) {
                                context.invoke('editor.insertImage', FileList[i]);
                            }
                        }
                    });
                }
            });
            return button.render();
        },
        ulink: function (context) {
            var ui = $.summernote.ui;
            var button = ui.button({
                contents: '<i class="note-icon-link"/>',
                tooltip: '链接',
                click: function () {
                    top.window.layer.open({
                        type: 1,
                        title: '插入链接',
                        shade: 0.8,
                        area: ['500px', '250px'],
                        shadeClose: true, //开启遮罩关闭
                        btn: ["插入", "取消"],
                        yes: function (i, layero) {
                            top.window.layer.close(i);
                            var text = $(layero.find("input")[0]).val();
                            var url = $(layero.find("input")[1]).val();
                            var isNewWindow = layero.find("input")[2].checked;
                            if (url.length > 0) {
                                if (text.length == 0) {
                                    text = url;
                                }
                                context.invoke('editor.createLink', {
                                    text: text,
                                    url: url,
                                    isNewWindow: isNewWindow
                                });
                            }
                        },
                        content: '<div style="width: 450px;margin: 0px auto;margin-top: 20px;" class="form-horizontal">\
                            <div class="form-group">\
                                <label class="col-sm-3 control-label">链接文字：</label>\
                                <div class="col-sm-8">\
                                    <input type="text" placeholder="链接文字" class="form-control">\
                                </div>\
                            </div>\
                            <div class="form-group">\
                                <label class="col-sm-3 control-label">链接地址：</label>\
                                <div class="col-sm-8">\
                                    <input type="text" placeholder="链接地址" class="form-control">\
                                </div>\
                            </div>\
                            <div class="form-group">\
                                <div class="col-sm-offset-3 col-sm-8">\
                                    <label style="line-height: 8px;font-size: 13px;" class="checkbox-inline">\
                                        <input type="checkbox" >新的窗口打开\
                                    </label>\
                                </div>\
                            </div>\
                        </div>'
                    });
                }
            });
            return button.render();
        },
        uelink: function (context) {
            var ui = $.summernote.ui;
            var button = ui.button({
                contents: '<i class="note-icon-link"/>',
                tooltip: '链接',
                click: function (e) {
                    var linkInfo = context.invoke('editor.getLinkInfo');
                    top.window.layer.open({
                        type: 1,
                        title: '插入链接',
                        shade: 0.8,
                        area: ['500px', '250px'],
                        shadeClose: true, //开启遮罩关闭
                        btn: ["插入", "取消"],
                        yes: function (i, layero) {
                            top.window.layer.close(i);
                            var text = $(layero.find("input")[0]).val();
                            var url = $(layero.find("input")[1]).val();
                            var isNewWindow = layero.find("input")[2].checked;
                            if (url.length > 0) {
                                if (text.length == 0) {
                                    text = url;
                                }
                                //移除
                                $(context.invoke('editor.createRange').sc.parentElement).remove();
                                context.invoke('editor.createLink', {
                                    text: text,
                                    url: url,
                                    isNewWindow: isNewWindow
                                });
                            }
                        },
                        success: function(layero, index){
                            $(layero.find("input")[0]).val(linkInfo.text);
                            $(layero.find("input")[1]).val(linkInfo.url);
                            layero.find("input")[2].checked = linkInfo.isNewWindow;
                        },
                        content: '<div style="width: 450px;margin: 0px auto;margin-top: 20px;" class="form-horizontal">\
                            <div class="form-group">\
                                <label class="col-sm-3 control-label">链接文字：</label>\
                                <div class="col-sm-8">\
                                    <input type="text" placeholder="链接文字" class="form-control">\
                                </div>\
                            </div>\
                            <div class="form-group">\
                                <label class="col-sm-3 control-label">链接地址：</label>\
                                <div class="col-sm-8">\
                                    <input type="text" placeholder="链接地址" class="form-control">\
                                </div>\
                            </div>\
                            <div class="form-group">\
                                <div class="col-sm-offset-3 col-sm-8">\
                                    <label style="line-height: 8px;font-size: 13px;" class="checkbox-inline">\
                                        <input type="checkbox" >新的窗口打开\
                                    </label>\
                                </div>\
                            </div>\
                        </div>'
                    });
                }
            });
            return button.render();
        }
    }
    ,
    popover: {
        link: [
             ['link', ['uelink', 'unlink']]
        ],
        image: [
                  ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
                  ['float', ['floatLeft', 'floatRight', 'floatNone']],
                  ['remove', ['removeMedia']]
        ]


    }
}