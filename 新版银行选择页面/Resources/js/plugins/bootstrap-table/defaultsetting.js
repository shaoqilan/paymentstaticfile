var tabledefaultsetting = {
    pagination: true,
    pageNumber: 1,
    pageSize: 10,
    search: true,
    searchOnEnterKey: true,
    pagination: true,
    showRefresh: true,
    showToggle: true,
    showColumns: true,
    iconSize: 'outline',
    sortOrder: 'desc',
    toolbar: '#Toolbar',
    icons: {
        refresh: 'glyphicon-search',
        toggle: 'glyphicon-list-alt',
        columns: 'glyphicon-list'
    },
    RefreshText: "&nbsp;搜索",
    ToggleText: "&nbsp;视图切换",
    ColumnsText: "&nbsp;显示列",
    method: "post",
    sidePagination: "server",
    mobileResponsive: true,//响应式布局
    //自定义
    toolcontainer: function () {
        var $toolbar = $($(this.toolbar).parents(".fixed-table-toolbar")[0]);
        return $toolbar;
    },
    ToolView:true,//是否显示工具条
    CustomParams: undefined,
    CustomSearchTool: undefined,
    CustomButtonTool: undefined,
    queryParams: function (Params) {
        //获取搜索框
        var SearchText = "";
        if (this.toolcontainer() != undefined && this.toolcontainer() != null) {
            SearchText = this.toolcontainer().find('.search input').val();
        }
        var p = { Search: SearchText, PageIndex: (Params.offset / Params.limit) + 1, PageSize: Params.limit, SortField: Params.sort, SortWay: Params.order };
        if (this.CustomParams != undefined && this.CustomParams != null) {
            if (this.toolcontainer() != undefined && this.toolcontainer() != null) {
                p = this.CustomParams(p, this.toolcontainer());
            } else {
                p = this.CustomParams(p, null);
            }
        };
        return p;
    },
    responseHandler: function (res) {//这里我查看源码的，在ajax请求成功后，发放数据之前可以对返回的数据进行处理，返回什么部分的数据，比如我的就需要进行整改的！
        if (res.ErrCode == 200) {
            //成功
            return { rows: res.Data.Rows, total: res.Data.Total };
        } else {
            //提示错误消息
            top.window.layer.msg(res.ErrMsg, { icon: 2 });
            return { rows: [], total: 0 };
        }
    },
    sortStable: true
}