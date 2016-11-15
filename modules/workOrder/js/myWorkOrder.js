'use strict';
/**
 * Created by sophia.wang on 16/11/4.
 */
(function(){
    /**
     * service defined
     */
    app.service('MyWorkOrder.RES', ServiceMyWorkOrderRES);
    ServiceMyWorkOrderRES.$inject = ['$q', '$resource', 'fakeMapping'];
    function ServiceMyWorkOrderRES($q, $resource, fakeMapping) {
        this.CMD = {
            ListWorkOrder    : 'listWorkOrders',
            CreateWorkOrder  : 'createWorkOrder',
            GetWorkOrder     : 'getWorkOrder',
            ListProperties   : 'listWorkOrderProperties'
        };

        var api_workOrder_list = '/unifacc?action=:cmd',
            res_workOrder_list = $resource(api_workOrder_list,{cmd : '@cmd'});

        fakeMapping.scheme(api_workOrder_list, {
            '@cmd:listWorkOrders'   : 'modules/workOrder/json/workOrder.list.json',
            '@cmd:createWorkOrder'  : 'modules/workOrder/json/workOrder.save.json',
            '@cmd:getWorkOrder'     : 'modules/workOrder/json/workOrder.info.json',
            '@cmd:listWorkOrderProperties'     : 'modules/workOrder/json/property.list.json'
        });

        this.list = function(cmd, id) {
            var task = $q.defer();
            if(!cmd) cmd = this.CMD.ListWorkOrder;
            var params = id == undefined ? {cmd: cmd} : {cmd: cmd,id: id};
            res_workOrder_list.get(params, function (response) {
                task.resolve(response.toJSON());
            });
            return task.promise;
        };

        this.create = function(params){
            var task = $q.defer();
            res_workOrder_list.save(params,function(response){
                task.resolve(response.toJSON());
            });
            return task.promise;
        };

        this.remove = function(id){
            var task = $q.defer();
            res_workOrder_list.delete({id:id},function(response){
                task.resolve(response.toJSON());
            });
            return task.promise;
        };

        this.listProperties = function(cmd) {
            var task = $q.defer();
            var self = this;

            if(!cmd) cmd = this.CMD.ListProperties;
            var params = {cmd: cmd};
            res_workOrder_list.get(params, function (response) {
                task.resolve(response.toJSON());
            });

            return task.promise;
        }
    }

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
    }

    /**
     * myWorkOrder list controller defined
     */
    app.controller('MyWorkOrderCtrl', MyWorkOrderViewCtrl);
    MyWorkOrderViewCtrl.$inject = ['$scope', '$location', '$log', '$cacheFactory', 'MyWorkOrder.RES'];
    function MyWorkOrderViewCtrl($scope, $location, $log, $cacheFactory, myWorkOrderRES) {

        renderMyWorkOrderTable($scope, $log, myWorkOrderRES);

        $scope.createItem = function(){
            $location.url("/app/workOrderCreate");
        };
    }

    /**
     * myWorkOrder list controller defined
     */
    app.controller('WorkOrderCreateCtrl', CreateViewCtrl);
    CreateViewCtrl.$inject = ['$scope', '$location', '$log', '$cacheFactory', 'MyWorkOrder.RES'];
    function CreateViewCtrl($scope, $location, $log, $cacheFactory, myWorkOrderRES) {

        //create new workOrder
        $scope.saveItem = function () {
            $log.info($scope.workOrder);
            myWorkOrderRES.create($scope.workOrder).then(function(result){
                $log.info(result);
            });
        };

        //return to the main page
        $scope.backToMain = function () {
            $location.url("/app/myWorkOrder");
        }
    }

    /************************************
     * render
     ************************************/
    function renderMyWorkOrderTable(scope, log, myRes){
        //i18nService.setCurrentLang("zh-cn");

        var index=0;//默认选中行，下标置为0
        scope.myGridOptions = {
            columnDefs: [
                {
                    field: 'id',
                    displayName: 'ID',
                    cellTemplate:'<div class="ui-grid-cell-contents ng-binding ng-scope"><a class="text-info" ui-sref="app.modeler({modelId:row.entity.id})">{{row.entity.id}}</a></div>'
                },
                {
                    field: "name",
                    displayName: '名称'
                },
                {
                    field: "mark",
                    displayName: '备注'
                },
                {
                    field: "createDate",
                    displayName: '创建时间',
                    cellTemplate:'<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.createDate | date:"yyyy-MM-dd HH:mm:ss"}}</div>'
                },
                {
                    field: "lastUpdateDate",
                    displayName: '最后更新时间',
                    cellTemplate:'<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.lastUpdateDate | date:"yyyy-MM-dd HH:mm:ss"}}</div>'
                },
                {
                    field: "status",
                    displayName: '状态',
                    cellTemplate:'<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.status | status}}</div>'
                }],
            paginationCurrentPage: 1, //当前页码
            paginationPageSize: 5, //每页显示个数
            paginationPageSizes: [5,10,20,50],//默认[250, 500, 1000]
            isRowSelectable: function (row) { //GridRow
                index+=1;//下标加1
                if(index==1){
                    row.grid.api.selection.selectRow(row.entity);
                }
            },
            useExternalPagination: true, //是否使用客户端分页,默认false
            onRegisterApi: function (gridApi) {
                scope.gridApi = gridApi;
                //分页按钮事件
                gridApi.pagination.on.paginationChanged(scope, function (newPage, pageSize) {
                    var params = {};
                    params.page=newPage;
                    params.pageSize=pageSize;
                    if (getPage) {
                        myRes.list().then(function (result) {
                            debugger;
                            workOrders=result.content;
                            getPage(params.page,params.pageSize, result.totalElements);
                        });
                    }
                });
                //行选中事件
                scope.gridApi.selection.on.rowSelectionChanged(scope, function (row, event) {
                    if (row && row.isSelected) {
                        scope.selectedRows = row.entity;
                    }
                });
            }
        };
        var workOrders=[];
        var params={
            page: scope.myGridOptions.paginationCurrentPage,
            pageSize: scope.myGridOptions.paginationPageSize
        };
        var getPage = function (curPage, pageSize,totalSize) {
            index=0;//下标置为0
            scope.myGridOptions.totalItems = totalSize;
            scope.myGridOptions.data = workOrders;
        };
        scope.loadData = function(){
            myRes.list().then(function (result) {
                debugger;
                workOrders = result.content;  //每次返回结果都是最新的
                getPage(1, params.pageSize, result.totalElements);
            });
        };

        //the list of flows
        scope.loadData();

        //search function end
        scope.params = {grid: {}, fun: {}};

        // callback function
        scope.callFn = function(item){
            scope.rowItem = item;
        }
    }

})();