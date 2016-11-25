(function() {
    app.controller('WorkOrderInfo', WorkOrderInfo);
    WorkOrderInfo.$inject = ['$scope', '$location', '$log', '$cacheFactory', 'MyWorkOrder.RES', '$state','$stateParams'];
    function WorkOrderInfo($scope, $location, $log, $cacheFactory, myWorkOrderRES, $state,$stateParams) {
        var params={
            linkId:$stateParams.id
        };
        myWorkOrderRES.listById(params).then(function (result) {
            debugger;
            $scope.workOrder = result.data[0];  //每次返回结果都是最新的
        });
        $scope.isShow=true;
        $scope.folder = function(){
            $scope.isShow=!$scope.isShow;
            if(!$scope.isShow){
            }
        };
        $scope.isShow1=true;
        $scope.folder1 = function(){
            $scope.isShow1=!$scope.isShow1;
            if(!$scope.isShow1){
            }
        };
        $scope.isShow2=true;
        $scope.folder2 = function(){
            $scope.isShow2=!$scope.isShow2;
            if(!$scope.isShow2){
            }
        };
    };
})()