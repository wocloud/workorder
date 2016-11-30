var at = angular.module("ui-sreach", []);
at.directive("myWorkOrderSreach", ['ngDialog','$q','$resource',function (ngDialog,$q,$resource) {
    return {
        restrict: 'AE',
        scope: {
            properties: '=',
            allproperties: '=',
            prClick: '&',
            prCheck: '&',
            propertiesevent: '=',
            status:'=',
            addproperties:"@",
            haveproperties:"=",
            haveCms:"&",
            search:"=",
            flag:"=",
            searchParams:"="
        },
        template:''+
        '<div class="col-md-6 col-sm-6 no-padder-sm" >' +
                '<div class="form-group" style="margin-bottom:40px;" ng-if="flag">'+
                    '<label class="col-md-offset-1 col-sm-offset-1 col-md-3 col-sm-2 control-label">' +
                        '<span>受理状态</span>:' +
                    '</label>' +
                    '<div class="col-md-6 col-sm-6 no-padder-sm">' +
                        '<select class="form-control"  ng-model="search.status" ng-selected="$index==0"   style="height:30px;width:300px">' +
                            '<option value="">全部</option>' +
                            '<option value="0">未受理</option>' +
                            '<option value="1">受理中</option>' +
                            '<option value="2">已受理</option>' +
                        '</select>' +
                    '</div>' +
                '</div>' +
            //审批人
                '<div class="form-group" style="margin-bottom:40px;">'+
                    '<label class="col-md-offset-1 col-sm-offset-1 col-md-3 col-sm-2 control-label">' +
                        '<span>受理人</span>:' +
                    '</label>' +
                    '<div class="col-md-6 col-sm-6 no-padder-sm" style="margin-bottom: 10px;">' +
                        '<div  style="width:300px;display:inline;">'+
                        '<input class="form-control" type="text" ng-disabled="true" ng-model="ownerName"  style="height:30px;display:inline;width:200px;"/>' +
                        '<button style="display:inline;margin-left:15px" type="button" ng-click="selectCustomer()">选择</button>'+
                        '</div>'+
                    '</div>' +
                '</div>' +

                '<div class="form-group" style="margin-bottom:40px;">'+
                    '<label class="col-md-offset-1 col-sm-offset-1 col-md-3 col-sm-2 control-label">' +
                        '<span>创建时间</span>:' +
                    '</label>' +
                    '<div class="col-md-6 col-sm-6 no-padder-sm" style="margin-bottom: 10px;">' +
                        '<div  style="width:300px">'+
                            '<input   class="laydate-icon" def-laydate  type="text"  ng-model="search.startTime" style="width:47.5%;height:30px;" margin-right:3%; />' +
                            '<span style="padding: -1px 2.5%">至</span>'+
                            '<input   class="laydate-icon" def-laydate type="text"  min-date="search.startTime"style="width:47.5%;height:30px;" ng-model="search.endTime"  />' +
                        '</div>'+
                    '</div>' +
                '</div>' +
                '<div class="form-group" style="margin-bottom:40px;">'+
                    '<label class="col-md-offset-1 col-sm-offset-1 col-md-3 col-sm-2 control-label">' +
                        '<span>工单类型</span>:' +
                    '</label>' +
                    '<div class="col-md-6 col-sm-6 no-padder-sm" style="margin-bottom: 10px;">' +
                        '<div  style="width:300px">'+
                            '<select class="form-control"  ng-model="search.workorderTypeId" ng-selected="$index==0" style="height:30px;width:300px;">' +
                                '<option  value="">全部</option>' +
                                '<option ng-repeat="item in searchParams.workOrderTypeList track by $index" value="{{item.id}}">{{item.typeName}}</option>' +
                            '</select>' +
                        '</div>'+
                    '</div>' +
                '</div>' +
                '<div class="form-group" style="margin-bottom:40px;">'+
                    '<label class="col-md-offset-1 col-sm-offset-1 col-md-3 col-sm-2 control-label">' +
                        '<span>问题分类</span>:' +
                    '</label>' +
                    '<div class="col-md-6 col-sm-6 no-padder-sm" style="margin-bottom: 10px;">' +
                        '<div  style="width:300px">'+
                            '<select class="form-control"  ng-model="search.productType" ng-selected="$index==0" style="height:30px;width:300px;">' +
                                '<option  value="">全部</option>' +
                                '<option ng-repeat="item in searchParams.productTypeList track by $index" value="{{item.productType}}">{{item.productName}}</option>' +
                            '</select>' +
                        '</div>'+
                    '</div>' +
                '</div>' +
                '<div class="form-group" style="margin-bottom:40px;">'+
                    '<label class="col-md-offset-1 col-sm-offset-1 col-md-3 col-sm-2 control-label">' +
                        '<span>优先级</span>:' +
                    '</label>' +
                    '<div class="col-md-6 col-sm-6 no-padder-sm" style="margin-bottom: 10px;">' +
                        '<div  style="width:300px">'+
                            '<select class="form-control"  ng-model="search.priority" ng-selected="$index==0" style="height:30px;width:300px;">' +
                                '<option  value="">全部</option>' +
                                '<option ng-repeat="item in searchParams.priorityList track by $index" value="{{item.priorityValue}}">{{item.priorityName}}</option>' +
                            '</select>' +
                        '</div>'+
                    '</div>' +
                '</div>' +

                '<div class="form-group" style="margin-bottom:40px;">'+
                    '<label class="col-md-offset-1 col-sm-offset-1 col-md-3 col-sm-2 control-label">' +
                        '<span>主题</span>:' +
                    '</label>' +
                        '<div class="col-md-6 col-sm-6 no-padder-sm" style="margin-bottom: 10px;">' +
                            '<div  style="width:300px">'+
                            '<input class="form-control" type="text"  ng-model="search.title"  style="height:30px;width:300px;"/>' +
                        '</div>'+
                    '</div>' +
                '</div>' +

                '<div class="form-group" ng-repeat="items in properties" style="margin-bottom:30px;">'+
                    '<label class="col-md-offset-1 col-sm-offset-1 col-md-3 col-sm-2 control-label" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">' +
                        '<input  type="checkbox" checked="true" ng-click="prCheck({$event:$event,items:items})"/>' +
                        '<span title="{{items.propertyName}}" ng-bind="items.propertyName"></span>:' +
                    '</label>' +
                    '<div class="col-md-6 col-sm-6 no-padder-sm" style="margin-bottom:10px;">' +
                        '<select class="form-control" ng-if=items.propertyType=="select"  ng-model="items.propertyValue" ng-selected="$index==0" style="height:30px;width:300px;">' +
                            '<option ng-repeat="item in items.propertyOptions track by $index" value="{{item.optionValue}}">{{item.optionName}}</option>' +
                        '</select>' +
                        '<input class="form-control" type="text" ng-if=items.propertyType=="text" ng-model="items.propertyValue" value="{{items.propertyDefaultValue}}" style="height:30px;width:300px;"/>' +
                        '<textarea class="form-control" ng-if=items.propertyType=="textArea" ng-model="items.propertyValue" style="height:20px;">{{items.propertyDefaultValue}}</textarea>' +
                        '<div ng-if=items.propertyType=="datetime" style="width:300px">'+
                            '<input   class="laydate-icon" def-laydate  type="text"  ng-model="items.propertyValue.startTime" style="width:47.5%;height:30px;" margin-right:3%; />' +
                            '<span style="padding: -1px 2.5%">至</span>'+
                            '<input   class="laydate-icon" def-laydate type="text"  min-date="items.propertyValue.startTime"style="width:47.5%;height:30px;" ng-model="items.propertyValue.endTime"  />' +
                        '</div>'+
                    '</div>' +
                '</div>'+
            '<button ng-click="prClick()" style="position: absolute;bottom:10px;right:0;">查询</button>' +
        '</div>' +
        '<div class="col-md-6 col-sm-6 no-padder-sm" style="height: 100%">' +
            '<div style="float:right">' +
                '<span>增加过滤器:</span>' +
                '<select  ng-model="propertiesevent" ng-options="item.propertyName for item in allproperties"> '+
                '<option value="">--请选择自定义属性--</option></select>'+
            '</div>' +
            /*'<div  style=" overflow :auto; width:20%; height:160px;float:left;background: #F6F8F8;">' +
            '<span  ng-repeat=" item in cmsproperties track by $index" ><a ng-click="addCms($event,item)">{{item.propertyName}}</a> <br ></span>'+
            '</div>' +
            '<div style=" text-align:center;overflow :auto;width:40px; height:160px;float:left;">添加</div>'+
            '<div  style=" overflow :auto; width:20%; height:160px;float:left;background: #F6F8F8;">' +
            '<span  ng-repeat=" item in haveproperties track by $index"><a ng-click="removeCms(item)">{{item.propertyName}}</a> <br ></span>'+
            '</div>'+
            '<button ng-click="haveCms()" style="position: absolute;bottom:0;">添加列</button>'+*/
        '</div>',
        link: function ($scope, element, attr){
            $scope.$watch('propertiesevent', function (r, t, y) {
                if (r != undefined) {
                    if ($scope.properties.indexOf(r) == -1) {
                        $scope.properties.push(r);
                    }
                }
            });

            //查询创建人

            $scope.selectCustomer = function(){
                ngDialog.open({
                    template:'modules/workOrder/owner.html',
                    className:'ngdialog-theme-default',
                    scope:$scope,
                    controller:function($scope){
                        $scope.searchCustomer = function(newPage){
                            if(newPage==undefined){
                                $scope.customerOptions.paginationCurrentPage=1;
                            }
                            var param={
                                first:$scope.first,
                                page:newPage==undefined?1:newPage
                            };
                            $scope.listUser(param).then(function (result) {
                                getCustomerPage(param.targetPage,result.totalRecord,result.data.content);

                            });
                        };
                        $scope.customerOptions = {
                            columnDefs: [{field:'id', displayName:'登录名'},{field:'first', displayName:'用户名'},{field:'pwd', displayName:'密码'}],
                            paginationCurrentPage: 1, //当前页码
                            paginationPageSize: 10, //每页显示个数
                            paginationPageSizes: [10],
                            noUnselect: false,//默认false,选中后是否可以取消选中
                            modifierKeysToMultiSelect: true,//默认false,为true时只能 按ctrl或shift键进行多选, multiSelect 必须为true;
                            isRowSelectable: function(row){ //GridRow
                            },
                            onRegisterApi: function (gridApi) {
                                $scope.gridApi = gridApi;
                                //分页按钮事件
                                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                                    if (getCustomerPage) {
                                        $scope.searchCustomer(newPage);
                                    }
                                });
                                $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
                                    if (row) {
                                        $scope.customerRow = row.entity;
                                    }
                                });
                            },
                            useExternalPagination: true//是否使用分页按钮
                        };
                        var getCustomerPage = function (curPage,totalSize,customerlists) {
                            $scope.customerOptions.totalItems = totalSize;
                            $scope.customerOptions.data = customerlists;
                        };
                        $scope.searchCustomer();
                        $scope.confirm = function(){
                            if( $scope.customerRow){
                                $scope.search.ownerId = $scope.customerRow.id;
                                $scope.$parent.ownerName = $scope.customerRow.first;
                            }
                            $scope.closeThisDialog();
                        };
                        $scope.cancel = function(){
                            $scope.closeThisDialog();
                        };
                    }
                });
            };
            var api_user_list = '/wocloud-workorder-restapi/actIdUser/getActIdUserListByConditions',
                res_user_list = $resource(api_user_list,{},{post:{
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json;charset=UTF-8'
                    }
                }});
            $scope.listUser=function(params){
                var task = $q.defer();
                res_user_list.post(params, function (response) {
                    task.resolve(response.toJSON());
                });
                return task.promise;
            };
            /*scope.haveproperties=[];
            scope.addCms=function($event,item){
                console.log(item);
                $event.target.style={"hide":true};
                if(scope.haveproperties.indexOf(item)==-1){
                    scope.haveproperties.push(item)
                }
                var a = scope.cmsproperties.indexOf(item);
                if (a >= 0) {
                    scope.cmsproperties.splice(a, 1);
                }
            }
            scope.removeCms=function(item){
                console.log(item);
                var a = scope.haveproperties.indexOf(item);
                if (a >= 0) {
                    scope.haveproperties.splice(a, 1);
                }
                if(scope.cmsproperties.indexOf(item)==-1){
                    scope.cmsproperties.push(item)
                }
            }
            scope.$watch("addproperties",function(a,b,c){
                if(a!=""&&a!=undefined&&a!=null){
                    scope.cmsproperties=jQuery.parseJSON(scope.addproperties);
                }

            })*/
        }
    }
}]);