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
    app.filter('workorderStatus', workorderStatus);
    function workorderStatus (){
        return function(input){
            if ( input == 0) {
                return  "已保存";
            } else if(input == 1) {
                return "已提交";
            }
            else {
                return "处理完成";
            }
        };
    };

    /**
     * myWorkOrder list controller defined
     */
    app.controller('MyWorkOrderCtrl', MyWorkOrderViewCtrl);
    MyWorkOrderViewCtrl.$inject = ['$scope', 'ngDialog','$location', '$log', '$cacheFactory', 'MyWorkOrder.RES','$state', '$modal'];
    function MyWorkOrderViewCtrl($scope, ngDialog,$location, $log, $cacheFactory, myWorkOrderRES,$state, $modal) {
        $scope.submitBtn=true;
        $scope.search={};
        $scope.yel=true;
        var owern=$scope.$root.user;
        var index = 0;//默认选中行，下标置为0
        $scope.myGridOptions = {
            columnDefs: [
                {
                    field: 'id',
                    displayName: 'ID',
                    cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope"><a class="text-info" ui-sref="app.workOrderInfo({id:row.entity.linkId})">{{row.entity.linkId}}</a></div>'
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
                    field: "workorderStatus",
                    displayName: '工单状态',
                    cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.workorderStatus|workorderStatus}}</div>'
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
                        $scope.initBtn($scope.selectedRows.workorderStatus);
                    }
                });
            }
        };
        var getPage = function (curPage, pageSize, totalSize,workOrders) {
            index = 0;//下标置为0
            $scope.myGridOptions.totalItems = totalSize;
            $scope.myGridOptions.data = workOrders;
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
        $scope.addCms=function(){
            angular.forEach($scope.haveproperties,function(a1,b1,c1){
                var ds=true;
                angular.forEach($scope.myGridOptions.columnDefs,function(a,b,c){
                    if(a1.propertyKey== a.field){
                         ds=false ;
                        return;
                    }
                });
                if(ds){
                    var param={
                        field:a1.propertyKey,
                        displayName:a1.propertyName
                    };
                    $scope.myGridOptions.columnDefs.push(param);
                }

            });

        };
        $scope.initBtn=function(code){
            if(code==0){
                $scope.submitBtn=false;
            }else{
                $scope.submitBtn=true;
            }
        }
        $scope.sreach = function (page,pageSize) {
            //$scope.search.ownerId=$scope.$root.user.userId;
            if($scope.search.startTime==""){
                delete $scope.search.startTime;
            }
            if($scope.search.endTime==""){
                delete $scope.search.endTime;
            }
            $scope.search.ownerId=1;
            $scope.search.instanceLinkPropertyList=$scope.properties;
            $scope.search.page=page!=undefined?page:1;
            $scope.search.size=pageSize!=undefined?pageSize:10;
            console.log($scope.search);
            $scope.$root.unWorkCount=3;
            myWorkOrderRES.list_work(JSON.stringify($scope.search)).then(function (result) {
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
        myWorkOrderRES.list_attr().then(function (result) {
            var a = result.data;
            for (var i = 0; i < a.length; i++) {
                if (a[i].propertyType == "select") {
                    a[i].propertyOptions = jQuery.parseJSON(a[i].propertyOptions);
                }
                a[i].propertyValue = a[i].propertyDefaultValue;
            }
            $scope.properties = [];
            $scope.allproperties = a;
        });

        $scope.createItem = function () {
            $state.go("app.workOrderCreate");
            /*$location.url("/app/workOrderCreate");*/
        };
        $scope.putItem = function () {
            var para={
                id:$scope.selectedRows.id,
                ownerId:1
            };
            myWorkOrderRES.submit(para).then(function (result1) {
                $log.info(result1);
                ngDialog.open({ template: 'modules/workOrder/test.html',//模式对话框内容为test.html
                    className:'ngdialog-theme-default ngdialog-theme-dadao',
                    scope:$scope,
                    controller:function($scope){
                        if(result1.code==0){
                            $scope.titel="成功";
                            $scope.content="提交成功";
                        }else{
                            $scope.titel="失败";
                            $scope.content="提交失败";
                        }
                        $scope.show = function(){
                            $scope.closeThisDialog(); //关闭弹窗
                        };
                        $scope.ok = function(){
                            $scope.content="提交成功";
                            $scope.closeThisDialog(); //关闭弹窗
                            $scope.sreach();
                        }
                    }
                });
            });
            $scope.sreach();
            /*var params={
                id:$scope.selectedRows.id,
                owernId:owern.userId
            };
            myWorkOrderRES.save(params).then(function (result1) {
                $log.info(result1);
                if(result1.code==0){
                    window.wxc.xcConfirm("提交成功", window.wxc.xcConfirm.typeEnum.success);
                }else{
                    window.wxc.xcConfirm("提交失败", window.wxc.xcConfirm.typeEnum.success);
                }
            });*/

        };

        $scope.linkFlow = function () {
            var modalInstance = $modal.open({
                backdrop: false,
                templateUrl: 'linkFlowTemplate',
                controller: 'LinkFlowViewCtrl',
                resolve: {
                    params: function () {
                        console.log($scope.selectedRows);
                        return $scope.selectedRows;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                if(result.code=="0"){
                    toaster.pop('info', "提示", "工单关联流程成功!");
                } else {
                    toaster.pop('error', "提示", "工单关联流程失败!");
                }
                $scope.loadData();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    };

    /**
     * myWorkOrder list controller defined
     */
    app.controller('WorkOrderCreateCtrl', CreateViewCtrl);
    CreateViewCtrl.$inject = ['$rootScope','ngDialog','$scope', '$location', '$log', '$cacheFactory', 'MyWorkOrder.RES', '$state'];
    function CreateViewCtrl($rootScope,ngDialog,$scope, $location, $log, $cacheFactory, myWorkOrderRES, $state) {
            $scope.createValue={};
            var owner=$rootScope.user;
            myWorkOrderRES.list_priority().then(function (result) {
                $scope.priorityList = result.data;  //每次返回结果都是最新的
                $scope.createValue.priority=result.data[0].priorityValue;
            });
            myWorkOrderRES.list_typeCode().then(function (result) {
                $scope.typeCodeList = result.data;  //每次返回结果都是最新的
                $scope.createValue.typeCode=result.data[0].typeCode;
            });
            myWorkOrderRES.list_ProductType().then(function (result) {
                $scope.productTypeList = result.data;  //每次返回结果都是最新的
                $scope.createValue.productType=result.data[0].productType;
            });
            $scope.$watch('createValue.typeCode', function (r, t, y) {
                if (r != undefined) {
                    var params={
                        codeType:r
                    };
                    myWorkOrderRES.list_create_attr(params).then(function(result){
                        for(var i=0;i<result.data.length;i++){
                            if (result.data[i].propertyType == "select") {
                                result.data[i].propertyOptions = jQuery.parseJSON(result.data[i].propertyOptions);
                            }
                            result.data[i].propertyValue=result.data[i].propertyDefaultValue;
                        }
                        $scope.properties=result.data;
                    });
                }
            });

            function data(){
                if($scope.properties!=undefined&&$scope.properties.length>0) {
                    for (var i = 0; i < $scope.properties.length; i++) {
                        if($scope.properties[i].propertyType=="datetime"){
                            $scope.properties[i].propertyValue = (new Date()).getTime();
                        }
                    }
                    $scope.createValue.properties=JSON.stringify($scope.properties);
                    $scope.createValue.ownerId=1/*owner.userId*/;
                    $scope.createValue.contactId=1/*owner.userId*/;
                }
                return $scope.createValue;
            }
            //create new workOrder
            $scope.saveItem = function () {
                var params=data();
                console.log(params);
                $log.info(params);
                myWorkOrderRES.save(params).then(function (result) {
                    $log.info(result);
                    ngDialog.open({ template: 'modules/workOrder/test.html',//模式对话框内容为test.html
                        className:'ngdialog-theme-default ngdialog-theme-dadao',
                        controller:function($scope){
                            if(result.code==0){
                                $scope.titel="成功";
                                $scope.content="保存成功,是否提交？";
                            }else{
                                $scope.titel="失败";
                                $scope.content="保存失败";
                            }
                            $scope.paramss={
                                id:result.data.id,
                                ownerId:1
                            };
                            $scope.ok = function(){
                                $scope.closeThisDialog();
                                myWorkOrderRES.submit($scope.paramss).then(function (result1) {
                                    $log.info(result1);
                                    ngDialog.open({ template: 'modules/workOrder/test.html',//模式对话框内容为test.html
                                        className:'ngdialog-theme-default ngdialog-theme-dadao',
                                        controller:function($scope){
                                            if(result1.code==0){
                                                $scope.titel="成功";
                                                $scope.content="提交成功";
                                            }else{
                                                $scope.titel="失败";
                                                $scope.content="提交失败";
                                            }
                                            $scope.ok = function(){
                                                $scope.closeThisDialog(); //关闭弹窗
                                                $state.go("app.myWorkOrder");
                                            }
                                        }
                                    });
                                });
                            };
                        }
                    });
                });
            };
            //return to the main page
            $scope.backToMain = function () {
                history.back();
                /*$location.url("/app/myWorkOrder");*/
            };
        };

    /**
     * workOrder link flow controller
     */
    app.controller('LinkFlowViewCtrl', LinkFlowViewCtrl);
    LinkFlowViewCtrl.$inject = ['$scope', '$modalInstance', 'params', 'MyWorkOrder.RES'];
    function LinkFlowViewCtrl($scope, $modalInstance, params, myWorkOrderRES) {
        var workorderTypeId = params.workorderTypeId;
        $scope.myData = [];
        $scope.selectedItems = [];
        $scope.flowGridOptions = {
            data: 'myData',
            columnDefs: [
                {
                    field: 'id',
                    displayName: 'ID',
                    title : 'id'
                },
                {
                    field: "key",
                    displayName: 'KEY'
                },
                {
                    field: "name",
                    displayName: '名称'
                },
                {
                    field: "version",
                    displayName: '版本'
                }],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                //行选中事件
                $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
                    if (row && row.isSelected) {
                        $scope.selectedItems = row.entity;
                    }
                });
            }
        };
        $scope.loadData = function(){
            myWorkOrderRES.listWorkFlows().then(function (result) {
                $scope.myData = result.data;
            }, function(){
                $scope.myData = [];
            });
        };
        //the list of attrs
        $scope.loadData();

        //search function end
        $scope.params = {grid: {}, fun: {}};

        // callback function
        $scope.callFn = function(item){
            $scope.rowItem = item;
        };

        //link flows
        $scope.linkWorkOrderAndFlow = function () {
            var selectItem = $scope.selectedItems;
            var params = {
                "workorderTypeId"       : workorderTypeId,
                "processDeploymentKey"  : selectItem.key,
                "processDeploymentId"   : selectItem.id
            }
            myWorkOrderRES.linkWorkOrderAndFlow(params).then(function (result) {
                $modalInstance.close(result);
            });
        };

        //cancel the modal
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    }
})();