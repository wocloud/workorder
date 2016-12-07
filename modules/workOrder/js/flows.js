'use strict';
/**
 * Created by sophia.wang on 16/11/9.
 */
(function(){
    /**
     * workOrder flows service
     */
    app.service('workOrderFlow.RES', ServiceWorkOrderFlowRES);
    ServiceWorkOrderFlowRES.$inject = ['$q', '$resource', 'fakeMapping'];
    function ServiceWorkOrderFlowRES($q, $resource, fakeMapping) {

        this.CMD = {
            ListFlows   : 'listWorkOrderFlows',
            CreateFlow  : 'createWorkOrderFlow',
            DetailFlow  : 'detailWorkOrderFlow'
        };

        var api_workOrderFlow_list = '/unifacc?action=:cmd',
            res_workOrderFlow_list = $resource(api_workOrderFlow_list,{cmd : '@cmd'});

        fakeMapping.scheme(api_workOrderFlow_list, {
            '@cmd:listWorkOrderFlows'    : 'modules/workOrder/json/flow.list.json',
            '@cmd:createWorkOrderFlow'   : 'modules/workOrder/json/flow.list.json',
            '@cmd:detailWorkOrderFlow'   : 'modules/workOrder/json/flow.list.json'
        });

        this.list = function (attrId,cmd) {
            var task = $q.defer();
            if(!cmd) cmd = this.CMD.ListFlows;
            var params = attrId == undefined ? {cmd: cmd} : {cmd: cmd,attrId: attrId};
            res_workOrderFlow_list.get(params, function (response) {
                task.resolve(response.toJSON().data);
            });
            return task.promise;
        };

        this.create = function(params){
            var task = $q.defer();
            res_workOrderFlow_list.save(params,function(response){
                task.resolve(response.toJSON());
            });
            return task.promise;
        };

        this.remove = function(id){
            var task = $q.defer();
            res_workOrderFlow_list.delete({id:id},function(response){
                task.resolve(response.toJSON());
            });
            return task.promise;
        };

        this.detail = function(id) {
            var task = $q.defer();
            if(!cmd) cmd = this.CMD.ListFlows;
            var params = id == undefined ? {cmd: cmd} : {cmd: cmd, id: id};
            res_workOrderFlow_list.get(params, function (response) {
                task.resolve(response.toJSON().data);
            });
            return task.promise;
        };
    }

    /**
     * flow status filter
     * @returns {Function}
     * @constructor
     */
    app.filter('flowStatus',FlowStatus);
    function FlowStatus (){
        return function(input){
            if ( input == "open") {
                return  "启用";
            } else if(input == "closed") {
                return "已挂起";
            }
        };
    }

    /**
     * workOrder flow controller
     */
    app.controller('WorkOrderFlowsViewCtrl', FlowViewCtrl);
    FlowViewCtrl.$inject = ['$scope', '$modal', '$log', '$location', '$cacheFactory', 'workOrderFlow.RES','i18nService'];
    function FlowViewCtrl($scope, $modal, $log, $location, $cacheFactory, flowRES,i18nService) {
        i18nService.setCurrentLang("zh-cn");
        renderFlowTable($scope, $log, flowRES,i18nService);

        //create new flow
        $scope.createItem = function () {
            var modalInstance = $modal.open({
                backdrop: false,
                templateUrl: 'modules/workOrder/flow.create.html',
                controller: 'WorkOrderFlowCreateViewCtrl'
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.loadData();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }

    /**
     * workOrder flow create controller
     */
    app.controller('WorkOrderFlowCreateViewCtrl', FlowCreateViewCtrl);
    FlowCreateViewCtrl.$inject = ['$scope', '$log', '$modalInstance', 'workOrderFlow.RES'];
    function FlowCreateViewCtrl($scope, $log, $modalInstance, flowRES) {
        //create new flow
        $scope.saveItem = function (isValid) {
            //if (!isValid) return;
            $log.info($scope.flow);
            flowRES.create($scope.flow).then(function(result){
                $modalInstance.close();
            });
        };

        //cancel the modal
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    }

    /**
     * workOrder flow detail controller
     */
    app.controller('WorkOrderFlowDetailViewCtrl', FlowDetailViewCtrl);
    FlowDetailViewCtrl.$inject = ['$scope', '$log', '$stateParams', 'workOrderFlow.RES','i18nService'];
    function FlowDetailViewCtrl($scope, $log, $stateParams, flowRES,i18nService){
        $log.info($stateParams);
        //flowRES.detail($stateParams.id).then(function(){
        //
        //});
    }

    /************************************
     * render
     ************************************/
    function renderFlowTable(scope, log, flowRes,i18nService){

        var index=0;//默认选中行，下标置为0
        scope.flowGridOptions = {
            columnDefs: [
                {
                    field: 'id',
                    type:'number',
                    displayName: 'ID'
                    //cellTemplate:'<div class="ui-grid-cell-contents ng-binding ng-scope"><a class="text-info" ui-sref="app.modeler({modelId:row.entity.id})">{{row.entity.id}}</a></div>'
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
                    cellTemplate:'<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.status | flowStatus}}</div>'
                    //},
                    //{
                    //    field: "delete",
                    //    displayName: '操作',
                    //    cellTemplate:'<div class="ui-grid-cell-contents ng-binding ng-scope"><a href="#" class="text-info" ng-click="deleteItem({{row.entity.key}})">删除</a></div>'
                }],
            enableCellEdit: false, // 是否可编辑
            enableSorting: true, //是否排序
            useExternalSorting: false, //是否使用自定义排序规则
            enableGridMenu: true, //是否显示grid 菜单
            showGridFooter: false, //是否显示grid footer
            enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
            enableVerticalScrollbar: 0, //grid垂直滚动条是否显示, 0-不显示  1-显示
            //-------- 分页属性 ----------------
            enablePagination: true, //是否分页，默认为true
            enablePaginationControls: true, //使用默认的底部分页
            paginationPageSizes: [10], //每页显示个数可选项
            paginationCurrentPage: 1, //当前页码
            paginationPageSize: 10, //每页显示个数
            //paginationTemplate:"<div></div>", //自定义底部分页代码
            totalItems: 0, // 总数量
            useExternalPagination: true,//是否使用分页按钮
            //----------- 选中 ----------------------
            enableFooterTotalSelected: false, // 是否显示选中的总数，默认为true, 如果显示，showGridFooter 必须为true
            enableFullRowSelection: true, //是否点击行任意位置后选中,默认为false,当为true时，checkbox可以显示但是不可选中
            enableRowHeaderSelection: true, //是否显示选中checkbox框 ,默认为true
            enableRowSelection: true, // 行选择是否可用，默认为true;
            enableSelectAll: true, // 选择所有checkbox是否可用，默认为true;
            enableSelectionBatchEvent: true, //默认true
            isRowSelectable: function (row) { //GridRow
                index+=1;//下标加1
                if(index==1){
                    row.grid.api.selection.selectRow(row.entity);
                }
            },
            onRegisterApi: function (gridApi) {
                scope.gridApi = gridApi;
                //分页按钮事件
                gridApi.pagination.on.paginationChanged(scope, function (newPage, pageSize) {
                    var params = {};
                    params.page=newPage;
                    params.pageSize=pageSize;
                    if (getPage) {
                        flowRes.list().then(function (result) {
                            flows=result.content;
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
        var flows=[];
        var params={
            page: scope.flowGridOptions.paginationCurrentPage,
            pageSize: scope.flowGridOptions.paginationPageSize
        };
        var getPage = function (curPage, pageSize,totalSize) {
            index=0;//下标置为0
            scope.flowGridOptions.totalItems = totalSize;
            scope.flowGridOptions.data = flows;
        };
        scope.loadData = function(){
            flowRes.list().then(function (result) {
                flows = result.content;  //每次返回结果都是最新的
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