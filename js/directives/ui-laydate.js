var uiLaydate=angular.module("ui-laydate",[]);
uiLaydate.directive('defLaydate', function($timeout) {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
            ngModel: '=',
            minDate:'='
        },
        link: function(scope, element, attr, ngModel) {
            scope._date = null;
            scope._config = {};
            var myDate = new Date();
            $timeout(function () {
                scope._config = {
                    istime: true,
                    elem: "#" + element.attr("id", myDate.getMilliseconds()).context.id,
                    format: attr.format != undefined && attr.format != '' ? attr.format : 'YYYY-MM-DD hh:mm:ss',
                    max: attr.hasOwnProperty('maxDate') ? attr.maxDate : '',
                    min: attr.hasOwnProperty('minDate') ? attr.minDate : '',
                    choose: function (data) {
                        scope.$apply(setViewValue);
                    },
                    clear: function () {
                        ngModel.$setViewValue(null);
                    }
                };
                // 初始化
                scope._date = laydate(scope._config);
                scope.$watch('minDate',function(a, b,c){
                    if(a){
                        scope._config.min=a;
                        scope._date = laydate(scope._config);
                    }

                });
                // 模型值同步到视图上
                ngModel.$render = function () {
                    element.val(ngModel.$viewValue || '');
                };
                // 监听元素上的事件
                element.on('blur keyup change', function () {
                    scope.$apply(setViewValue);
                });
                setViewValue();
                // 更新模型上的视图值
                function setViewValue() {
                    var val = element.val();
                    ngModel.$setViewValue(val);
                }
            },0);
        }
    }
});