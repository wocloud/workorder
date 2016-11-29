'use strict';
/**
 * Created by sophia.wang on 16/11/28.
 */
$(function(){
    /**
     * workOrder types service
     */
    app.service('workOrderType.RES', ServiceWorkOrderTypeRES);
    ServiceWorkOrderTypeRES.$inject = ['$q', '$resource'];
    function ServiceWorkOrderTypeRES($q, $resource) {

        //获取流程列表
        this.listWorkFlows = function(params){
            var cmd = '/wocloud-workorder-restapi/workflow/listProcessDefinition';
            var task = $q.defer();
            var parameters = params==undefined ? {} : params;
            $resource(cmd).save(parameters, function(response){
                task.resolve(response.data);
            }, function(response){
                task.reject(response);
            });
            return task.promise;
        };

        //绑定工单类型流程
        this.bind = function(params){
            var cmd = '/wocloud-workorder-restapi/workorderTypeProcess/insertOrUpdateWorkorderTypeAndProcess';
            var task = $q.defer();
            var parameters = params==undefined ? {} : params;
            $resource(cmd).save(parameters, function(response){
                task.resolve(response);
            }, function(response){
                task.reject(response);
            });
            return task.promise;
        };

        //查询工单类型与流程定义绑定关系
        this.queryRelation = function(params){
            var cmd = '/wocloud-workorder-restapi/workorderTypeProcess/selectWorkorderTypeAndProcessByCondition';
            var task = $q.defer();
            var parameters = params==undefined ? {} : params;
            $resource(cmd).save(parameters, function(response){
                task.resolve(response.data);
            }, function(response){
                task.reject(response);
            });
            return task.promise;
        };

        //解绑工单类型流程
        this.unbind = function(params){
            var cmd = '/wocloud-workorder-restapi/workorderTypeProcess/unbindWorkorderTypeProcess';
            var task = $q.defer();
            var parameters = params==undefined ? {} : params;
            $resource(cmd).save(parameters, function(response){
                task.resolve(response);
            }, function(response){
                task.reject(response);
            });
            return task.promise;
        };

        this.save = function(params){
            var task = $q.defer();
            var cmd = '/wocloud-workorder-restapi/workorderType/saveWorkorderType';
            $resource(cmd).save(params,function(response){
                task.resolve(response);
            }, function(response){
                task.reject("调用失败,属性信息更新失败!");
            });
            return task.promise;
        };

        this.removeById = function(id){
            var task = $q.defer();
            var cmd = '/wocloud-workorder-restapi/workorderType/removeWorkorderType';
            $resource(cmd).save({id:id},function(response){
                task.resolve(response);
            }, function(response){
                task.reject("调用失败,属性信息删除失败!");
            });
            return task.promise;
        };

        this.list = function() {
            var task = $q.defer();
            var cmd = '/wocloud-workorder-restapi/workorderType/listWorkorderTypes';
            $resource(cmd).save({}, function (response) {
                task.resolve(response.data);
            });
            return task.promise;
        };

        this.listByCondition = function(params) {
            var task = $q.defer();
            var cmd = '/wocloud-workorder-restapi/workorderType/selectWorkorderTypesByCondition';
            var parameters = params == undefined ? {} : params;
            $resource(cmd).save(parameters, function (response) {
                task.resolve(response.data);
            });
            return task.promise;
        };
    }

    /**
     * workOrder types controller
     */
    app.controller('WorkOrderTypesViewCtrl', TypeViewCtrl);
    TypeViewCtrl.$inject = ['$scope', '$modal', '$log', 'workOrderType.RES', 'toaster'];
    function TypeViewCtrl($scope, $modal, $log, workOrderTypeRES, toaster) {

        $scope.myData = [];
        $scope.myGridOptions = {
            data: 'myData',
            columnDefs: [
                {
                    field: 'id',
                    displayName: 'ID'
                },
                {
                    field: "typeName",
                    displayName: '名称'
                },
                {
                    field: "typeCode",
                    displayName: 'Code'
                }],
            multiSelect: false,
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                //行选中事件
                $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
                    if (row && row.isSelected) {
                        $scope.selectedItem=row.entity;
                    } else {
                        $scope.selectedItem = undefined;
                    }
                });
            }
        };
        $scope.loadData = function(){
            $scope.selectedItem = undefined;
            workOrderTypeRES.list().then(function (result) {
                $scope.myData = result;
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

        //create
        $scope.createItem = function () {
            var modalInstance = $modal.open({
                backdrop: false,
                templateUrl: 'createOrUpdateTemplate',
                controller: 'WorkOrderTypeCreateOrUpdateViewCtrl',
                resolve: {
                    params: function () {
                        return {};
                    }
                }
            });
            modalInstance.result.then(function(result) {
                $scope.loadData();
                if(result.code=="0"){
                    toaster.pop('info', "提示", " 工单类型新建成功!");
                } else {
                    toaster.pop('error', "提示", " 工单类型新建失败!");
                }
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        //edit
        $scope.updateItem = function() {
            if(!$scope.selectedItem){
                toaster.pop('info', "提示", "请选择要操作的条目!");
                return;
            }
            var modalInstance = $modal.open({
                backdrop: false,
                templateUrl: 'createOrUpdateTemplate',
                controller: 'WorkOrderTypeCreateOrUpdateViewCtrl',
                resolve: {
                    params: function () {
                        return $scope.selectedItem;
                    }
                }
            });
            modalInstance.result.then(function(result) {
                $scope.loadData();
                if(result.code=="0"){
                    toaster.pop('info', "提示", " 工单类型编辑成功!");
                } else {
                    toaster.pop('error', "提示", " 工单类型编辑失败!");
                }
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        //delete an attribute
        $scope.deleteItem = function() {
            var modalInstance = $modal.open({
                backdrop: false,
                templateUrl: 'deleteTemplate',
                controller: 'WorkOrderTypeDeleteViewCtrl',
                resolve: {
                    params: function () {
                        return $scope.selectedItem;
                    }
                }
            });
            modalInstance.result.then(function(result) {
                $scope.loadData();
                if(result.code=="0"){
                    toaster.pop('info', "提示", " 工单类型删除成功!");
                } else {
                    toaster.pop('error', "提示", " 工单类型删除失败!");
                }
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        //bind
        $scope.bindWithProcess = function () {
            var modalInstance = $modal.open({
                backdrop: false,
                templateUrl: 'bindWithProcessTemplate',
                controller: 'bindWithProcessViewCtrl',
                resolve: {
                    params: function () {
                        return $scope.selectedItem;
                    }
                }
            });
            modalInstance.result.then(function(result) {
                $scope.loadData();
                if(result.code=="0"){
                    toaster.pop('info', "提示", "工单绑定流程成功!");
                } else {
                    toaster.pop('error', "提示", "工单绑定流程失败!");
                }
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        // unbind
        $scope.unbindWithProcess = function () {
            var modalInstance = $modal.open({
                backdrop: false,
                templateUrl: 'unbindWithProcessTemplate',
                controller: 'unbindWithProcessViewCtrl',
                resolve: {
                    params: function () {
                        return $scope.selectedItem;
                    }
                }
            });
            modalInstance.result.then(function(result) {
                $scope.loadData();
                if(result.code=="0"){
                    toaster.pop('info', "提示", "工单解绑流程成功!");
                } else {
                    toaster.pop('error', "提示", "工单解绑流程失败!");
                }
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }

    /**
     * workOrder types create controller
     */
    app.controller('WorkOrderTypeCreateOrUpdateViewCtrl', TypeCreateOrUpdateViewCtrl);
    TypeCreateOrUpdateViewCtrl.$inject = ['$scope', 'params', '$modalInstance', 'workOrderType.RES'];
    function TypeCreateOrUpdateViewCtrl($scope, params, $modalInstance, workOrderTypeRES){
        var id = params.id;

        if ($scope.workOrderType == undefined || $scope.workOrderType == null){
            $scope.workOrderType = {};
        }

        $scope.createOrUpdate = 'C';
        if(id!=undefined && id!=null && id!=''){
            $scope.createOrUpdate = 'U';
            workOrderTypeRES.listByCondition({"id":id}).then(function(result){
                $scope.workOrderType = result.content[0];
            }, function(e){
            });
        }

        //create or update
        $scope.saveItem = function () {
            if($scope.createOrUpdate=="U"){
                $scope.workOrderType.id = id;
            }
            workOrderTypeRES.save($scope.workOrderType).then(function(result){
                $modalInstance.close(result);
            });
        };

        //cancel the modal
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }

    /**
     * workOrder attr delete controller
     */
    app.controller('WorkOrderTypeDeleteViewCtrl', TypeDeleteViewCtrl);
    TypeDeleteViewCtrl.$inject = ['$scope', '$modalInstance', 'params', 'workOrderType.RES'];
    function TypeDeleteViewCtrl($scope, $modalInstance, params, workOrderTypeRES) {
        $scope.currentItem = params;
        var id = $scope.currentItem.id;

        //remove
        $scope.removeItem = function () {
            workOrderTypeRES.removeById(id).then(function (result) {
                $modalInstance.close(result);
            });
        };

        //cancel the modal
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    }

    /**
     * workOrder bind With Process controller
     */
    app.controller('bindWithProcessViewCtrl', BindWithProcessViewCtrl);
    BindWithProcessViewCtrl.$inject = ['$scope', '$modalInstance', 'params', 'workOrderType.RES'];
    function BindWithProcessViewCtrl($scope, $modalInstance, params, workOrderTypeRES) {
        var workorderTypeId = params.id;
        $scope.myData = [];
        $scope.flowGridOptions = {
            data: 'myData',
            columnDefs: [
                {
                    field: 'id',
                    displayName: 'ID'
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
            multiSelect: false,
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                //行选中事件
                $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
                    if (row && row.isSelected) {
                        $scope.selectedItem = row.entity;
                    } else {
                        $scope.selectedItem = undefined;
                    }
                });
            }
        };
        $scope.loadData = function(){
            $scope.selectedItem = undefined;
            workOrderTypeRES.listWorkFlows().then(function (result) {
                $scope.myData = result;
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

        //bind
        $scope.bindWorkorderTypeAndProcess = function () {
            var selectItem = $scope.selectedItem;
            var params = {
                "workorderTypeId"       : workorderTypeId,
                "processDeploymentKey"  : selectItem.key,
                "processDeploymentId"   : selectItem.id
            };
            workOrderTypeRES.bind(params).then(function (result) {
                $modalInstance.close(result);
            });
        };

        //cancel the modal
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    };

    /**
     * workOrder unbind With Process controller
     */
    app.controller('unbindWithProcessViewCtrl', UnbindWithProcessViewCtrl);
    UnbindWithProcessViewCtrl.$inject = ['$scope', '$modalInstance', 'params', 'workOrderType.RES'];
    function UnbindWithProcessViewCtrl($scope, $modalInstance, params, workOrderTypeRES) {
        $scope.relationId = -1;
        $scope.processDeploymentId = "";

        workOrderTypeRES.queryRelation({"workorderTypeId": params.id}).then(function (result) {
            if(result.content && result.content.length > 0){
                $scope.processDeploymentId = result.content[0].processDeploymentId;
                $scope.relationId = result.content[0].id;
            }
        });

        //unbind
        $scope.unbindWorkorderTypeAndProcess = function () {
            workOrderTypeRES.unbind({"id": $scope.relationId}).then(function (result) {
                $modalInstance.close(result);
            });
        };

        //cancel the modal
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    }

});
