(function ($) {
    $.fn.extend({
        OSSUploadFile: function (options) {
            var defaults = {
                Filtration: "*",
                Label: "",
                SelectFile: undefined,
                Progress: undefined,
                NodeEnd: undefined,
                UploadEnd: undefined,
                VerifyFileTypeError: undefined
            };
            var options = $.extend(defaults, options);
            var plugin = this;
            function make_form($el, text) {
                $el.wrap('<div></div>');
                $el.after(options.Label);
                $el.hide();
                var file = $("<div style='display: none;'></div>");
                file.append($el.clone());
                $el.remove();
                $("body").append(file);
                return file;
            };
            var applyTokenDo = function (func) {
                var appServer = '/PublicAction/GetOSSSecurityToken';
                var url = appServer;
                $.get(url, function (data) {
                    var creds = data.Data;
                    var client = new OSS.Wrapper({
                        region: creds.Config.Region,
                        accessKeyId: creds.Token.Credentials.AccessKeyId,
                        accessKeySecret: creds.Token.Credentials.AccessKeySecret,
                        stsToken: creds.Token.Credentials.SecurityToken,
                        bucket: creds.Config.Bucket
                    });
                    func(client);
                });
            };
            function uplod(files, i) {
                applyTokenDo(function (client) {
                    var file = files[i];
                    if (file == undefined || file == null) {
                        return;
                    }
                    var filename = file.name;
                    var fileexc = (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename.toLowerCase()) : '';
                    var key = Date.now() + "." + fileexc;
                    return client.multipartUpload(key, file, {
                        progress: function (p) {
                            return function (done) {
                                if (options.Progress != undefined && options.Progress != null) {
                                    options.Progress(p, file, key);
                                }
                                done();
                            }
                        }
                    }).then(function (res) {
                        var url = res.res.requestUrls[0];
                        if (res.res.requestUrls[0].indexOf("?") != -1) {
                            url = res.res.requestUrls[0].substring(0, res.res.requestUrls[0].indexOf("?"))
                        }
                        if (i < (files.length - 1)) {
                            if (options.NodeEnd != undefined && options.NodeEnd != null) {
                                options.NodeEnd(url, res, files[i]);
                            }
                            i = i + 1;
                            uplod(files, i);
                        } else {
                            if (options.NodeEnd != undefined && options.NodeEnd != null) {
                                options.NodeEnd(url, res, files[files.length - 1]);
                            }
                            if (options.UploadEnd != undefined && options.UploadEnd != null) {
                                options.UploadEnd(url, res, files[files.length - 1]);
                            }
                            //结束后清除
                            if ($wrap != null) {
                                $wrap.find("input[type=\"file\"]").val("");
                            }
                        }
                    });
                });
            }
            var f = new Array();
            var i = 0;
            var $wrap = null;
            plugin.each(function () {
                $this = $(this);
                if ($this) {
                    $wrap = make_form($this = $(this), options.text);
                    f[i] = $wrap.find("input[type=\"file\"]");
                }
            });
            for (var i = 0; i < f.length; i++) {
                $(f[i]).change(function () {
                    var file = this.files;
                    var State = true;
                    if (options.SelectFile != undefined && options.SelectFile != null) {
                        State = options.SelectFile(file);
                    }
                    //筛选后缀
                    if (options.Filtration != "*") {
                        for (var k = 0; k < file.length; k++) {
                            var filename = file[k].name;
                            var fileexc = (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename.toLowerCase()) : '';
                            if ($.inArray("." + fileexc, options.Filtration) == -1) {
                                State = false;
                                layer.msg("只能上传文件：" + options.Filtration, { icon: 2 });
                                if (options.VerifyFileTypeError != undefined && options.VerifyFileTypeError != null) {
                                    options.VerifyFileTypeError(filename);
                                }
                                return;
                            }
                        }
                    }
                    if (State) {
                        //可以上传
                        //上传操作
                        uplod(file, 0);
                        // alert(file.length);
                    }
                });
            }
            if (f.length == 1) {
                return f[0];
            } else {
                return f;
            }
        },
        LocalUploadFile: function (options) {
            var defaults = {
                Filtration: "*",
                Label: "",
                SelectFile: undefined,
                Progress: undefined,
                NodeEnd: undefined,
                UploadEnd: undefined,
                UploadError: undefined,//上传异常
                VerifyFileTypeError: undefined
            };
            var options = $.extend(defaults, options);
            var plugin = this;
            function make_form($el, text) {
                $el.wrap('<div></div>');
                $el.after(options.Label);
                $el.hide();
                var file = $("<div style='display: none;'></div>");
                file.append($el.clone());
                $el.remove();
                $("body").append(file);
                return file;
            };
            function uplod(files, i) {
                var file = files[i];
                if (file == undefined || file == null) {
                    return;
                }
                //开始上传/PublicAction/LocalUploadFile
                var formData = new FormData();
                var name = file.name;
                formData.append("FileInfo", file);
                formData.append("name", name);
                $.ajax({
                    url: "/PublicAction/LocalUploadFile",
                    type: 'POST',
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    xhr: function () {
                        var xhr = $.ajaxSettings.xhr();
                        if (onprogress && xhr.upload) {
                            xhr.upload.addEventListener("progress", onprogress, false);
                            return xhr;
                        }
                    },
                    success: function (res) {
                        if (res.ErrCode === 200) {
                            var url = res.Data[0];
                            if (i < (files.length - 1)) {
                                if (options.NodeEnd != undefined && options.NodeEnd != null) {
                                    options.NodeEnd(url, res, file);
                                }
                                i = i + 1;
                                uplod(files, i);
                            } else {
                                if (options.NodeEnd != undefined && options.NodeEnd != null) {
                                    options.NodeEnd(url, res, file);
                                }
                                if (options.UploadEnd != undefined && options.UploadEnd != null) {
                                    options.UploadEnd(url, res, file);
                                }
                                //结束后清除
                                if ($wrap != null) {
                                    $wrap.find("input[type=\"file\"]").val("");
                                }
                            }
                        } else {
                            layer.msg("文件" + name + "上传失败", { icon: 2 });
                            if (options.UploadError != undefined && options.UploadError != null) {
                                options.UploadError(name, res.ErrMsg);
                            }
                        }
                    },
                    error: function (responseStr) {
                        layer.msg("文件" + name + "上传失败", { icon: 2 });
                        if (options.UploadError != undefined && options.UploadError != null) {
                            options.UploadError(name, responseStr);
                        }
                    }
                });
                function onprogress(evt) {
                    var loaded = evt.loaded;     //已经上传大小情况
                    var tot = evt.total;      //附件总大小
                    var p = parseFloat(loaded) / tot;  // 已经上传的百分比
                    if (options.Progress != undefined && options.Progress != null) {
                        options.Progress(p, file, name);
                    }
                }
                //结束后清除
                if ($wrap != null) {
                    $wrap.find("input[type=\"file\"]").val("");
                }
            }
            var f = new Array();
            var i = 0;
            var $wrap = null;
            plugin.each(function () {
                $this = $(this);
                if ($this) {
                    $wrap = make_form($this = $(this), options.text);
                    f[i] = $wrap.find("input[type=\"file\"]");
                }
            });
            for (var i = 0; i < f.length; i++) {
                $(f[i]).change(function () {
                    var file = this.files;
                    var State = true;
                    if (options.SelectFile != undefined && options.SelectFile != null) {
                        State = options.SelectFile(file);
                    }
                    //筛选后缀
                    if (options.Filtration != "*") {
                        for (var k = 0; k < file.length; k++) {
                            var filename = file[k].name;
                            var fileexc = (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename.toLowerCase()) : '';
                            if ($.inArray("." + fileexc, options.Filtration) == -1) {
                                State = false;
                                layer.msg("只能上传文件：" + options.Filtration, { icon: 2 });
                                if (options.VerifyFileTypeError != undefined && options.VerifyFileTypeError != null) {
                                    options.VerifyFileTypeError(filename);
                                }
                                return;
                            }
                        }
                    }
                    if (State) {
                        //可以上传
                        //上传操作
                        uplod(file, 0);
                        // alert(file.length);
                    }
                });
            }
            if (f.length == 1) {
                return f[0];
            } else {
                return f;
            }
        }
    });
    $.extend({
        OpenUpload: function (options) {
            options = $.extend({
                Multiple: false,
                RType: 0,
                AllowCount: 100,
                OutFileName: false,
                SelectedEnd: null
            }, options);
            top.window.layer.open({
                type: 2,
                title: '选择文件',
                shade: 0.8,
                maxmin: true, //开启最大化最小化按钮
                area: ['727px', '500px'],
                btn: ["确定", "本地上传", "取消"],
                success: function (layero, index) {
                    $(layero.find(".layui-layer-btn1")[0]).css({ "background-color": "#1ab394", "border-color": "#1ab394", "color": "#FFFFFF" });
                },
                yes: function (index, layero) {
                    var TemFileList = layero.find('iframe')[0].contentWindow.GetSelectFileList();
                    var FileList = [];
                    if (options.OutFileName) {
                        FileList = TemFileList;
                    } else {
                        if (TemFileList != null && TemFileList != undefined) {
                            for (var i = 0; i < TemFileList.length; i++) {
                                FileList.push(TemFileList[i].Url);
                            }
                        }
                    }
                    if (options.SelectedEnd != undefined && options.SelectedEnd != null && FileList != null && FileList != undefined && FileList.length > 0) {
                        if (options.Multiple) {
                            options.SelectedEnd(FileList);
                        } else {
                            options.SelectedEnd(FileList[0]);
                        }
                    }
                    top.window.layer.close(index);
                },
                btn2: function (index, layero) {
                    var win = layero.find('iframe')[0].contentWindow;
                    win.Upload();
                    //触发上传
                    return false;
                },
                content: '/PublicAction/ResourceMaterialLocal?Multiple=' + options.Multiple + '&RType=' + options.RType + '&AllowCount=' + options.AllowCount
                //(OSS)content: '/PublicAction/ResourceMaterial?Multiple=' + options.Multiple + '&RType=' + options.RType + '&AllowCount=' + options.AllowCount
            });
        }
    });
}(jQuery));