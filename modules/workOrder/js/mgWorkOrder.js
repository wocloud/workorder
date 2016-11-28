(function() {
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
    app.controller('MGworkOrder', MGworkOrder);
    MGworkOrder.$inject = ['$scope','ngDialog', '$location', '$log', '$cacheFactory', 'MyWorkOrder.RES', '$state','$stateParams'];
    function MGworkOrder($scope,ngDialog, $location, $log, $cacheFactory, myWorkOrderRES, $state,$stateParams) {
        console.log($stateParams.id);
        var params={
            linkId:$stateParams.id
        };
        myWorkOrderRES.listById(params).then(function(result){
            $scope.mgworkorder=result.data[0];
        });
        $scope.disposeToMain = function () {
            console.log($scope.mgworkorder);
            var properties={};
            $.extend(properties,$scope.mgworkorder);
            properties.properties=JSON.stringify(properties.properties);
            $log.info(properties);
            debugger;
            myWorkOrderRES.dispose(properties).then(function (result) {
                ngDialog.open({ template: 'modules/workOrder/test.html',//模式对话框内容为test.html
                    className:'ngdialog-theme-default ngdialog-theme-dadao',
                    scope:$scope,
                    controller:function($scope){
                        if(result.code==0){
                            $scope.titel="成功";
                            $scope.content="处理成功";
                            $state.go("app.unworkOrder");
                        }else{
                            $scope.titel="失败";
                            $scope.content="处理失败";
                        }
                        $scope.ok = function(){
                            $scope.closeThisDialog(); //关闭弹窗
                        }
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
})()