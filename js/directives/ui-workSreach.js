var at = angular.module("ui-sreach", []);
at.directive("myWorkOrderSreach", function () {
    return {
        restrict: 'AE',
        scope: {
            properties: '=',
            allproperties: '=',
            prClick: '&',
            prCheck: '&',
            propertiesevent: '=',
            status:'=',
            falg:'='
        },
        template:
        '<div class="col-md-6 col-sm-6 no-padder-sm">' +
                '<div class="form-group" style="margin-bottom:40px;">'+
                    '<label class="col-md-offset-1 col-sm-offset-1 col-md-3 col-sm-2 control-label">' +
                        '<span>受理状态</span>:' +
                    '</label>' +
                    '<div class="col-md-6 col-sm-6 no-padder-sm">' +
                        '<select class="form-control"  ng-model="status" ng-selected="$index==0"  ng-disabled="falg" style="height:30px;">' +
                            '<option value="all">全部</option>' +
                            '<option value="dis">已受理</option>' +
                            '<option value="un">未受理</option>' +
                            '<option value="dis">已指派</option>' +
                        '</select>' +
                    '</div>' +
                '</div>' +
                '<div class="form-group" ng-repeat="items in properties" style="margin-bottom:30px;">'+
                    '<label class="col-md-offset-1 col-sm-offset-1 col-md-3 col-sm-2 control-label">' +
                        '<input  type="checkbox" checked="true" ng-click="prCheck({$event:$event,items:items})"/>' +
                        '<span ng-bind="items.propertyName"></span>:' +
                    '</label>' +
                    '<div class="col-md-6 col-sm-6 no-padder-sm" style="margin-bottom:10px;">' +
                        '<select class="form-control" ng-if=items.propertyType=="select"  ng-model="items.sreachValue" ng-selected="$index==0" style="height:30px;">' +
                            '<option ng-repeat="item in items.propertyOptions track by $index" value="{{item.optionValue}}">{{item.optionName}}</option>' +
                        '</select>' +
                        '<input class="form-control" type="text" ng-if=items.propertyType=="text" ng-model="items.sreachValue" value="{{items.propertyDefaultValue}}" style="height:30px;"/>' +
                        '<textarea class="form-control" ng-if=items.propertyType=="textArea" ng-model="items.sreachValue" style="height:20px;">{{items.propertyDefaultValue}}</textarea>' +
                        '<div ng-if=items.propertyType=="datetime">'+
                            '<input   class="laydate-icon" def-laydate  type="text"  ng-model="items.startTime" style="width:45%;height:30px;" margin-right:3%; />' +
                            '<span style="padding: 0 2.5%">至</span>'+
                            '<input   class="laydate-icon" def-laydate type="text"  min-date="items.startTime"style="width:45%;height:30px;" ng-model="items.endTime"  />' +
                        '</div>'+
                    '</div>' +
                '</div>'+
            '<button ng-click="prClick()" style="position: absolute;bottom:0;right:0;">查询</button>' +
        '</div>' +
        '<div class="col-md-6 col-sm-6 no-padder-sm" style="height: 100%">' +
            '<div style="float:right">' +
                '<span>增加过滤器:</span>' +
                '<select  ng-model="propertiesevent" ng-options="item.propertyName for item in allproperties"></select>' +
            '</div>' +
        '</div>',
        link: function (scope, element, attr) {
        }
    }
});