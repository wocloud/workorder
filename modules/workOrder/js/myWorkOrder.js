'use strict';
/**
 * Created by sophia.wang on 16/11/4.
 */
(function(){

    /**
     * flow status filter
     * @returns {Function}
     * @constructor
     */
    app.filter('status', Status);
    function Status (){
        return function(input){
            if ( input == "open") {
                return  "启用";
            } else if(input == "closed") {
                return "已挂起";
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

    /**
     * myWorkOrder list controller defined
     */
    app.controller('MyWorkOrderCtrl', MyWorkOrderViewCtrl);
    MyWorkOrderViewCtrl.$inject = ['$scope', '$location', '$log', '$cacheFactory', 'MyWorkOrder.RES','$state'];
    function MyWorkOrderViewCtrl($scope, $location, $log, $cacheFactory, myWorkOrderRES,$state) {
        $scope.sreachStatus="all"
        var index = 0;//默认选中行，下标置为0
        $scope.myGridOptions = {
            columnDefs: [
                {
                    field: 'id',
                    displayName: 'ID',
                    cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope"><a class="text-info" ui-sref="app.workOrderInfo({id:row.entity.id})">{{row.entity.id}}</a></div>'
                },
                {
                    field: "name",
                    displayName: '工单类型'
                },
                {
                    field: "mark",
                    displayName: '主题',
                    cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope"><a class="text-info" ui-sref="app.workOrderInfo({id:row.entity.id})">{{row.entity.id}}</a></div>'
                },
                {
                    field: "name",
                    displayName: '优先级'
                },
                {
                    field: "mark",
                    displayName: '问题分类'
                },
                {
                    field: "mark",
                    displayName: '当前环节',
                    cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope"><a class="text-info" ui-sref="app.workOrderInfo({id:row.entity.id})">{{row.entity.id}}</a></div>'
                },
                {
                    field: "name",
                    displayName: '受理人'
                },
                {
                    field: "mark",
                    displayName: '受理状态'
                },
                {
                    field: "mark",
                    displayName: '创建人'
                },
                {
                    field: "createDate",
                    displayName: '创建时间',
                    cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.createDate | date:"yyyy-MM-dd HH:mm:ss"}}</div>'
                }],
            paginationCurrentPage: 1, //当前页码
            paginationPageSize: 5, //每页显示个数
            enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
            enableVerticalScrollbar: 0, //grid垂直滚动条是否显示, 0-不显示  1-显示
            paginationPageSizes: [5, 10, 20, 50],//默认[250, 500, 1000]
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
                    }
                });
            }
        };
        var workOrders = [];
        var params = {
            page: $scope.myGridOptions.paginationCurrentPage,
            pageSize: $scope.myGridOptions.paginationPageSize
        };
        var getPage = function (curPage, pageSize, totalSize) {
            index = 0;//下标置为0
            $scope.myGridOptions.totalItems = totalSize;
            $scope.myGridOptions.data = workOrders;
        };
        function data(){
            var params = {};
            if($scope.properties!=undefined&&$scope.properties.length>0) {
                for (var i = 0; i < $scope.properties.length; i++) {
                    var key = $scope.properties[i].propertyKey;
                    var value=null;
                    if ($scope.properties[i].propertyType == "datetime") {
                        value = {
                            startTime: (new Date($scope.properties[i].startTime)).getTime(),
                            endTime: (new Date($scope.properties[i].endTime)).getTime()
                        }
                    } else {
                        value = $scope.properties[i].sreachValue;
                    }
                    var str = "{" + key + ":" + "value" + "}";
                    var param = eval('(' + str + ')');
                    for (var r in param) {
                        eval("params." + r + "=param." + r);
                    }
                }
            }
            params.sreachStatus=$scope.sreachStatus;

            return params;
        }
        $scope.sreach = function (page,pageSize) {
            var params=data();
            params.page=page!=undefined?page:1;
            params.pageSize=pageSize!=undefined?pageSize:10;
            console.log(params);
            myWorkOrderRES.list(params).then(function (result) {
                workOrders = result.content;  //每次返回结果都是最新的
                getPage(params.page, params.pageSize, result.totalElements);
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
        var params = {"page": 1, "size": 10};
        myWorkOrderRES.list_attr(params).then(function (result) {
            var a = result.data.content;
            for (var i = 0; i < a.length; i++) {
                if (a[i].propertyType == "select") {
                    a[i].propertyOptions = jQuery.parseJSON(a[i].propertyOptions);
                }
                a[i].sreachValue = a[i].propertyDefaultValue;
            }
            var arr = [];
            if (result.data.totalElements >= 3) {
                for (var i = 0; i < 3; i++) {
                    arr.push(a[i]);
                }
            } else {
                arr = a;
            }
            $scope.properties = arr;
            $scope.allproperties = a;
            $scope.propertiesevent = a[0];
        });
        $scope.$watch('propertiesevent', function (r, t, y) {
            if (r != undefined) {
                if ($scope.properties.indexOf(r) == -1) {
                    $scope.properties.push(r);
                }
            }
        });

        $scope.createItem = function () {
            $state.go("app.workOrderCreate");
            /*$location.url("/app/workOrderCreate");*/
        };
    };

        /**
         * myWorkOrder list controller defined
         */
        app.controller('WorkOrderCreateCtrl', CreateViewCtrl);
        CreateViewCtrl.$inject = ['$scope', '$location', '$log', '$cacheFactory', 'MyWorkOrder.RES', '$state'];
        function CreateViewCtrl($scope, $location, $log, $cacheFactory, myWorkOrderRES, $state) {
            myWorkOrderRES.list_create_attr().then(function(result){
                for(var i=0;i<result.data.content.length;i++){
                    result.data.content[i].createValue=result.data.content[i].propertyDefaultValue;
                }
                $scope.properties=result.data.content;
                $scope.createWorkOrder
            });
            function data(){
                var params = {};
                if($scope.properties!=undefined&&$scope.properties.length>0) {
                    for (var i = 0; i < $scope.properties.length; i++) {
                        var key = $scope.properties[i].propertyKey;
                        var value=null;
                        if($scope.properties[i].propertyType=="datetime"){
                            $scope.properties[i].createValue = (new Date()).getTime();
                        }
                        value = $scope.properties[i].createValue;
                        var str = "{" + key + ":" + "value" + "}";
                        var param = eval('(' + str + ')');
                        for (var r in param) {
                            eval("params." + r + "=param." + r);
                        }
                    }
                }
                return params;
            }
            //create new workOrder
            $scope.saveItem = function () {
                var params=data();
                console.log(params);
                $log.info($scope.workOrder);
                myWorkOrderRES.create($scope.workOrder).then(function (result) {
                    $log.info(result);
                });
            };
            //return to the main page
            $scope.backToMain = function () {
                history.back();
                /*$location.url("/app/myWorkOrder");*/
            };
        }
})();