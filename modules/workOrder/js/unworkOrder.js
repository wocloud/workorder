app.controller('UNworkOrder', UNworkOrder);
app.filter('status', status);
function status (){
    return function(input){
        if ( input == "1") {
            return  "是";
        } else if(input == "0") {
            return "否";
        }
    };
};
app.filter('dit', dit);
function dit (){
    return function(input){
        if ( input == 1) {
            return  true;
        } else if(input == 0) {
            return false;
        }
    };
};
app.filter('priorityStatus', priorityStatus);
function priorityStatus (){
    return function(input){
        if ( input == 0) {
            return  "低";
        } else if(input == 1) {
            return "中";
        }
        else if(input == 2) {
            return "高";
        }
    };
};
app.filter('productTypeStatus', productTypeStatus);
function productTypeStatus (){
    return function(input){
        if ( input == 1001) {
            return  "云主机";
        } else if(input == 1002) {
            return "云存储";
        }
        else {
            return "其他";
        }
    };
};
app.filter('performerStatus', performerStatus);
function performerStatus (){
    return function(input){
        if ( input == 1) {
            return  "受理中";
        } else if(input == 2) {
            return "已受理";
        }
        else {
            return "未受理";
        }
    };
};
UNworkOrder.$inject = ['$scope', '$location', '$log', '$cacheFactory', 'MyWorkOrder.RES','$state'];
function UNworkOrder($scope, $location, $log, $cacheFactory, myWorkOrderRES,$state) {
    $scope.search={};
    $scope.yel=false;
    var index = 0;//默认选中行，下标置为0
    $scope.myGridOptions = {
        columnDefs: [
            {
                field: 'id',
                displayName: 'ID'
            },
            {
                field: "workorderType",
                displayName: '工单类型'

            },
            {
                field: "title",
                displayName: '主题'
            },
            {
                field: "priority",
                displayName: '优先级',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.priority|priorityStatus}}</div>'
            },
            {
                field: "productType",
                displayName: '问题分类',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.productType|productTypeStatus}}</div>'
            },
            {
                field: "linkName",
                displayName: '当前环节'
            },
            {
                field: "performerName",
                displayName: '受理人'
            },
            {
                field: "status",
                displayName: '受理状态',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.status|performerStatus}}</div>'
            },
            {
                field: "contactName",
                displayName: '联系人'
            },

            {
                field: "ownerName",
                displayName: '创建人'
            },
            {
                field: "createTime",
                displayName: '创建时间'
            }],
        enableCellEdit: false,
        enableFooterTotalSelected: false, // 是否显示选中的总数，默认为true, 如果显示，showGridFooter 必须为true
        enableFullRowSelection: true, //是否点击行任意位置后选中,默认为false,当为true时，checkbox可以显示但是不可选中
        enableRowHeaderSelection: true, //是否显示选中checkbox框 ,默认为true
        enableRowSelection: true, // 行选择是否可用，默认为true;
        enableSelectAll: true, // 选择所有checkbox是否可用，默认为true;
        enableSelectionBatchEvent: true, //默认true
        modifierKeysToMultiSelect: true,//默认false,为true时只能 按ctrl或shift键进行多选, multiSelect 必须为true;
        multiSelect: true,// 是否可以选择多个,默认为true;
        noUnselect: true,//默认false,选中后是否可以取消选中
        paginationCurrentPage: 1, //当前页码
        paginationPageSize: 10, //每页显示个数
        enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
        enableVerticalScrollbar: 0, //grid垂直滚动条是否显示, 0-不显示  1-显示
        paginationPageSizes: [ 10],//默认[250, 500, 1000]
        isRowSelectable: function (row) { //GridRow
            index += 1;//下标加1
            if (index == 1) {
                row.grid.api.selection.selectRow(row.entity);
            }
        },
        useExternalPagination: true, //是否使用客户端分页,默认false
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            //分页按钮事件
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                if (getPage) {
                    $scope.sreach(newPage,pageSize)
                    /*var params=data();
                     params.page = newPage;
                     params.pageSize = pageSize;
                     myWorkOrderRES.list().then(function (result) {
                     workOrders = result.content;
                     getPage(params.page, params.pageSize, result.totalElements);
                     });*/
                }
            });
            //行选中事件
            $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
                if (row && row.isSelected) {
                    $scope.selectedRows = row.entity;
                    $scope.initBtn($scope.selectedRows.status);
                }
            });
        }
    };
    $scope.searchParams={};
    myWorkOrderRES.list_typeCode().then(function (result) {
        $scope.searchParams.workOrderTypeList= result.data;  //每次返回结果都是最新的
    });
    myWorkOrderRES.list_priority().then(function (result) {
        $scope.searchParams.priorityList= result.data;
    });
    myWorkOrderRES.list_ProductType().then(function (result) {
        $scope.searchParams.productTypeList= result.data;  //每次返回结果都是最新的
    });
    $scope.initBtn=function(sign){
        if(sign==0){
            $scope.singflag=false;
            $scope.disposeflag=true;
        }
        else if(sign==1){
            $scope.singflag=true;
            $scope.disposeflag=false;
        }else{
            $scope.singflag=true;
            $scope.disposeflag=true;
        }
    };
    var getPage = function (curPage, pageSize, totalSize,workOrders) {
        index = 0;//下标置为0
        $scope.myGridOptions.totalItems = totalSize;
        $scope.myGridOptions.data = workOrders;
    };
    /*function data(){
        var params = {};
        if($scope.properties!=undefined&&$scope.properties.length>0) {
            for (var i = 0; i < $scope.properties.length; i++) {
                *//*var key = $scope.properties[i].propertyKey;
                var value = $scope.properties[i].sreachValue;*//*
                *//*var str = "{" + key + ":" + "value" + "}";
                var param = eval('(' + str + ')');
                for (var r in param) {
                    eval("params." + r + "=param." + r);
                }*//*
            }
        }
        params.sreachStatus=$scope.sreachStatus;

        return params;
    }*/
    $scope.sreach = function (page,pageSize) {
        if($scope.search.startTime==""){
            delete $scope.search.startTime;
        }
        if($scope.search.endTime==""){
            delete $scope.search.endTime;
        }
        $scope.search.instanceLinkPropertyList=$scope.properties;
        $scope.search.page=page!=undefined?page:1;
        $scope.search.performerId=1;
        $scope.search.size=pageSize!=undefined?pageSize:10;
        console.log($scope.search);
        $scope.$root.unWorkCount=3;
        myWorkOrderRES.list_unwork(JSON.stringify($scope.search)).then(function (result) {
            var workOrders = result.data.content;  //每次返回结果都是最新的
            getPage($scope.search.page, $scope.search.pageSize, result.data.totalElements,workOrders);
        });
    };
    $scope.check = function (event) {
        $scope.removeEvent(event.items);
    };
    $scope.removeEvent = function (b) {
        var a = $scope.properties.indexOf(b);
        if (a >= 0) {
            $scope.properties.splice(a, 1);
            return true;
        }
        return false;
    };

    //the list of flows
    $scope.sreach();
    // callback function
    $scope.callFn = function (item) {
        $scope.rowItem = item;
    }
    $scope.propertieslist = [];
    myWorkOrderRES.list_attr().then(function (result) {
        var a = result.data;
        for (var i = 0; i < a.length; i++) {
            if (a[i].propertyType == "select") {
                a[i].propertyOptions = jQuery.parseJSON(a[i].propertyOptions);
            }
            a[i].propertyValue = a[i].propertyDefaultValue;
        }
        var arr = [];
        $scope.properties = arr;
        $scope.allproperties = a;
    });

    $scope.disposeItem = function () {
        $state.go("app.mgworkOrder",{id:$scope.selectedRows.linkId});
        /*$location.url("/app/workOrderCreate");*/
    };
    $scope.signItem = function () {
        var params={
            id:/*$scope.selectedRows.linkId*/53,
            performerId:$scope.$root.user.id
        }
        console.log(params);
        myWorkOrderRES.sign(params).then(function (result) {
            if(result.code==0){
                window.wxc.xcConfirm("签收成功", window.wxc.xcConfirm.typeEnum.success);
                $scope.sreach();
            }
            else{
                window.wxc.xcConfirm("签收失败", window.wxc.xcConfirm.typeEnum.error);
            }
        });
    };
};