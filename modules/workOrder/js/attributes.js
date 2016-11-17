'use strict';
/**
 * Created by sophia.wang on 16/11/3.
 */
$(function(){
    /**
     * workOrder attributes service
     */
    app.service('workOrderAttr.RES', ServiceWorkOrderAttrRES);
    ServiceWorkOrderAttrRES.$inject = ['$q', '$resource', 'fakeMapping'];
    function ServiceWorkOrderAttrRES($q, $resource, fakeMapping) {

        this.CMD = {
            ListAttrs   : 'listWorkOrderAttrs',
            CreateAttr  : 'createWorkOrderAttr',
            GetAttr     : 'getWorkOrderAttr',
            LinkedFlows : 'listLinkedFlow',
            IsNameUnique: 'isNameUnique'
        };

        this.baseEnum = function() {
            return {
                propertyType : [ 'text', 'textarea', 'datetime', 'select']
            };
        };

        var api_workOrderAttr_list = '/unifacc?action=:cmd',
            res_workOrderAttr_list = $resource(api_workOrderAttr_list,{cmd : '@cmd'});

        fakeMapping.scheme(api_workOrderAttr_list, {
            '@cmd:listWorkOrderAttrs'   : 'modules/workOrder/json/attr.list.json',
            '@cmd:createWorkOrderAttr'  : 'modules/workOrder/json/attr.save.json',
            '@cmd:getWorkOrderAttr'     : 'modules/workOrder/json/attr.info.json',
            '@cmd:listLinkedFlow'       : 'modules/workOrder/json/attr.linkedFlow.list.json',
            '@cmd:isNameUnique'         : 'modules/workOrder/json/isNameUnique'
        });

        this.list = function (attrId,cmd) {
            var task = $q.defer();
            if(!cmd) cmd = this.CMD.ListAttrs;
            var params = attrId == undefined ? {cmd: cmd} : {cmd: cmd,attrId: attrId};
            res_workOrderAttr_list.get(params, function (response) {
                task.resolve(response.toJSON().data);
            }, function(response){
                task.reject("调用失败,未获取属性列表信息!");
            });
            return task.promise;
        };

        this.getById = function (id,cmd) {
            var task = $q.defer();
            if(!cmd) cmd = this.CMD.GetAttr;
            var params = id == undefined ? {cmd: cmd} : {cmd: cmd, id: id};
            res_workOrderAttr_list.get(params, function (response) {
                task.resolve(response.toJSON().data);
            }, function(response){
                task.reject("调用失败,未查找到指定的属性信息!");
            });
            return task.promise;
        };

        this.isNameUnique = function(name){
            var task = $q.defer();
            if(!cmd) cmd = this.CMD.IsNameUnique;
            var params = name == undefined ? {cmd: cmd} : {cmd: cmd,propertyName: name};
            res_workOrderAttr_list.get(params, function (response) {
                task.resolve(response.toJSON().data);
            }, function(response){
                task.reject("调用失败,未查找到属性名称是否唯一信息!");
            });
            return task.promise;
        };

        this.create = function(params){
            var task = $q.defer();
            res_workOrderAttr_list.save(params,function(response){
                task.resolve(response.toJSON());
            });
            return task.promise;
        };

        this.remove = function(key){
            var task = $q.defer();
            res_workOrderAttr_list.delete({key:key},function(response){
                task.resolve(response.toJSON());
            });
            return task.promise;
        };

        this.listLinkedFlow = function(key) {
            var task = $q.defer();
            var cmd = this.CMD.LinkedFlows;
            var params = key == undefined ? {cmd: cmd} : {cmd: cmd,key: key};
            res_workOrderAttr_list.get(params, function (response) {
                task.resolve(response.toJSON().data);
            });
            return task.promise;
        };
    }


    /**
     * attr status filter
     * @returns {Function}
     * @constructor
     */
    app.filter('propertyTypeFilter',PropertyTypeFilter);
    function PropertyTypeFilter (){
        return function(input){
            if(input == "select") {
                return "Select";
            } else if(input == "text") {
                return "Text";
            } else if(input == "datetime") {
                return "Datetime";
            } else if(input == "textarea") {
                return "Textarea";
            }
        };
    }

    /**
     * workOrder attributes controller
     */
    app.controller('WorkOrderAttrsViewCtrl', AttrViewCtrl);
    AttrViewCtrl.$inject = ['$scope', '$modal', '$location', '$log', '$cacheFactory', 'workOrderAttr.RES', 'toaster'];
    function AttrViewCtrl($scope, $modal, $location, $log, $cacheFactory, workOrderAttrRES, toaster) {

        renderAttrTable($scope, $log, workOrderAttrRES);

        //create new attr
        $scope.createItem = function () {
            $location.url("/app/workOrderAttrCreateOrUpdate");
        };

        //edit attr
        $scope.updateItem = function() {
            if($scope.selectedRows.length==0){
                toaster.pop('info', "提示", "请选择要操作的条目!");
                return;
            }
            var id = $scope.selectedRows[0].id;
            $location.url("/app/workOrderAttrCreateOrUpdate?id="+id);
        };

        //delete an attribute
        $scope.deleteItem = function() {
            if($scope.selectedRows.length==0){
                toaster.pop('info', "提示", "请选择要操作的条目!");
                return;
            }
            var modalInstance = $modal.open({
                backdrop: false,
                templateUrl: 'deleteTemplate',
                controller: 'WorkOrderAttrDeleteViewCtrl',
                resolve: {
                    params: function () {
                        return $scope.selectedRows;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.loadData();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        //return to the main page
        $scope.backToMain = function () {
            $location.url("/app/workOrderAttrs");
        }
    }

    /**
     * workOrder attributes create controller
     */
    app.controller('WorkOrderAttrCreateOrUpdateViewCtrl', AttrCreateOrUpdateViewCtrl);
    AttrCreateOrUpdateViewCtrl.$inject = ['$scope', '$location', '$stateParams', '$log', '$cacheFactory', 'workOrderAttr.RES'];
    function AttrCreateOrUpdateViewCtrl($scope, $location, $stateParams, $log, $cacheFactory, workOrderAttrRES){
        var id = $stateParams.id;

        $scope.PropertyType = workOrderAttrRES.baseEnum().propertyType;

        if ($scope.attr == undefined || $scope.attr == null){
            $scope.attr = {};
        }

        $scope.createOrUpdate = 'C';
        if(id!=undefined && id!=null && id!=''){
            $scope.createOrUpdate = 'U';
            workOrderAttrRES.getById(id).then(function(result){
                $scope.attr = result;
                $scope.optionProperties = result.propertyOptions;
            }, function(e){
                alert(e);
            });
        }

        if ($scope.attr.propertyType == undefined || $scope.attr.propertyType == null) {
            $scope.attr.propertyType = $scope.PropertyType[0];
        }

        //create new attr
        $scope.saveItem = function (isValid) {
            if (!isValid) return;
            //$scope.attr.propertyOptions = $scope.option;
            $log.info($scope.attr);
            if($scope.createOrUpdate=="C"){
                $log.info("create");
                //workOrderAttrRES.create($scope.attr).then(function(result){
                //    $log.info(result);
                //});
            } else if($scope.createOrUpdate=="U"){
                $log.info("update");
                //workOrderAttrRES.update($scope.attr).then(function(result){
                //    $log.info(result);
                //});
            }
        };

        //return to the main page
        $scope.backToMain = function () {
            $location.url("/app/workOrderAttrs");
        };

        //watch the propertyType change
        $scope.$watch("attr.propertyType", function(newValue, oldValue){
            $scope.f = newValue;
        });

        //click handler function
        var valueIndex = 2, nameIndex = 2;
        $scope.addOptionValue = function (index) {
            $scope.optionProperties.splice(index + 1, 0, {optionValue: 'value ' + valueIndex++, optionName: 'name' + nameIndex++});
        };

        $scope.removeOptionValue = function (index) {
            $scope.optionProperties.splice(index, 1);
        };
    }

    /**
     * workOrder attr delete controller
     */
    app.controller('WorkOrderAttrDeleteViewCtrl', AttrDeleteViewCtrl);
    AttrDeleteViewCtrl.$inject = ['$scope', '$log', '$modalInstance', 'params', 'workOrderAttr.RES'];
    function AttrDeleteViewCtrl($scope, $log, $modalInstance, params, workOrderAttrRES) {
        var keys = [];

        $scope.items = params;
        angular.forEach(params, function(data,index,array){
            keys.push(data.propertyKey);
        });

        console.log($scope.items);

        //remove attr
        $scope.removeItem = function () {
            workOrderAttrRES.remove(keys).then(function (result) {
                $log.info(result);
                $modalInstance.close($scope.items);
            });
        };

        //cancel the modal
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    }

    /**
     * attr linked controller
     */
    app.controller('WorkOrderAttrLinkedViewCtrl', AttrLinkedViewCtrl);
    AttrLinkedViewCtrl.$inject = ['$scope', '$stateParams', '$log', 'workOrderAttr.RES'];
    function AttrLinkedViewCtrl($scope, $stateParams, $log, workOrderAttrRES){
        var key = $stateParams.key;
        renderAttrLinkedView(key, $scope, $log, workOrderAttrRES);
    }

    /*************************
     * render view
     ************************/
    function renderAttrTable($scope, $log, workOrderAttrRES){
        //i18nService.setCurrentLang("zh-cn");

        var index=0;//默认选中行，下标置为0
        $scope.selectedRows = [];
        $scope.attrGridOptions = {
            columnDefs: [
                {
                    field: 'propertyKey',
                    displayName: 'key'
                },
                {
                    field: "propertyName",
                    displayName: '名称'
                },
                {
                    field: "propertyType",
                    displayName: '格式',
                    cellTemplate:'<div class="ui-grid-cell-contents">{{row.entity.propertyType | propertyTypeFilter}}</div>'
                },
                {
                    field: "belonged",
                    displayName: '所属流程',
                    cellTemplate:'<div class="ui-grid-cell-contents"><a class="text-info" ui-sref="app.workOrderAttrLinked({key:row.entity.propertyKey})">{{row.entity.belonged}}</a></div>'
                },
                {
                    field: "createDate",
                    displayName: '创建时间',
                    cellTemplate:'<div class="ui-grid-cell-contents">{{row.entity.createDate | date:"yyyy-MM-dd HH:mm:ss"}}</div>'
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
                $scope.gridApi = gridApi;
                //分页按钮事件
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    var params = {};
                    params.page=newPage;
                    params.pageSize=pageSize;
                    if (getPage) {
                        workOrderAttrRES.list().then(function (result) {
                            attrs=result.content;
                            getPage(params.page,params.pageSize, result.totalElements);
                        });
                    }
                });
                //行选中事件
                $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
                    if (row && row.isSelected) {
                        $scope.selectedRows.push(row.entity);
                    }
                    if(row && !row.isSelected){
                        angular.forEach($scope.selectedRows, function(data, index, rows){
                           if(data.propertyKey == row.entity.propertyKey) {
                               $scope.selectedRows.splice(index, 1);
                           }
                        });
                    }
                });
            }
        };
        var attrs=[];
        var params={
            page: $scope.attrGridOptions.paginationCurrentPage,
            pageSize: $scope.attrGridOptions.paginationPageSize
        };
        var getPage = function (curPage, pageSize,totalSize) {
            index=0;//下标置为0
            $scope.attrGridOptions.totalItems = totalSize;
            $scope.attrGridOptions.data = attrs;
        };
        var loadData = function(){
            workOrderAttrRES.list().then(function (result) {
                attrs = result.content;  //每次返回结果都是最新的
                getPage(1,params.pageSize, result.totalElements);
            });
        };
        //the list of attrs
        loadData();

        //search function end
        $scope.params = {grid: {}, fun: {}};

        // callback function
        $scope.callFn = function(item){
            $scope.rowItem = item;
        }
    }

    function renderAttrLinkedView(key, $scope, $log, workOrderAttrRES) {
        //i18nService.setCurrentLang("zh-cn");

        var index=0;//默认选中行，下标置为0
        $scope.linkedGridOptions = {
            columnDefs: [
                {
                    field: "flowName",
                    displayName: '流程名称'
                },
                {
                    field: "sectionName",
                    displayName: '环节名称'
                },
                {
                    field: "createDate",
                    displayName: '创建时间',
                    cellTemplate:'<div class="ui-grid-cell-contents">{{row.entity.createDate | date:"yyyy-MM-dd HH:mm:ss"}}</div>'
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
            noUnselect: true,//默认false,选中后是否可以取消选中
            useExternalPagination: true, //是否使用客户端分页,默认false
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                //分页按钮事件
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    var params = {};
                    params.page=newPage;
                    params.pageSize=pageSize;
                    if (getPage) {
                        workOrderAttrRES.listLinkedFlow(key).then(function (result) {
                            linkeds=result.content;
                            getPage(params.page,params.pageSize, result.totalElements);
                        });
                    }
                });
                //行选中事件
                $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
                    if (row) {
                        $scope.testRow = row.entity;
                    }
                });
            }
        };
        var linkeds=[];
        var params={
            page: $scope.linkedGridOptions.paginationCurrentPage,
            pageSize: $scope.linkedGridOptions.paginationPageSize
        };

        var getPage = function (curPage, pageSize,totalSize) {
            index=0;//下标置为0
            $scope.linkedGridOptions.totalItems = totalSize;
            $scope.linkedGridOptions.data = linkeds;
        };

        var loadData = function(){
            workOrderAttrRES.listLinkedFlow(key).then(function (result) {
                linkeds = result.content;
                getPage(1,params.pageSize, result.totalElements);
            });
        };

        //the list of attrs
        loadData();

        //search function end
        $scope.params = {grid: {}, fun: {}};

        // callback function
        $scope.callFn = function(item){
            $scope.rowItem = item;
        }
    }
});
/***********************
 * validate the unique
 ***********************/
app.directive('ensureUnique', ['workOrderAttr.RES', function(workOrderAttrRES) {debugger;
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, c) {
                scope.$watch(attrs.ngModel, function () {
                    workOrderAttrRES.isNameUnique(attrs.ensureUnique).then(function(result){
                        c.$setValidity('ensureUnique', result);
                    }, function(e){
                        c.$setValidity('ensureUnique', false);
                        alert(e);
                    })
                })
            }
        }
    }]);


//app.directive('ensureUnique', ['$http', function($http) {
//    return {
//        require: 'ngModel',
//        link: function(scope, ele, attrs, c) {
//            scope.$watch(attrs.ngModel, function() {
//                $http({
//                    method: 'POST',
//                    url: '/api/check/' + attrs.ensureUnique,
//                    data: {'field': attrs.ensureUnique}
//                }).success(function(data, status, headers, cfg) {
//                    c.$setValidity('unique', data.isUnique);
//                }).error(function(data, status, headers, cfg) {
//                    c.$setValidity('unique', false);
//                });
//            });
//        }
//    }
//}]);