(function() {
    app.controller('WorkOrderInfo', WorkOrderInfo);
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
    WorkOrderInfo.$inject = ['$scope', '$location', '$log', '$cacheFactory', 'MyWorkOrder.RES', '$state','$stateParams'];
    function WorkOrderInfo($scope, $location, $log, $cacheFactory, myWorkOrderRES, $state,$stateParams) {
        $scope.imageSrc = "";
        $scope.records = [];
        $scope.workOrderInstanceId = "";

        var params={
            linkId:$stateParams.id
        };

        myWorkOrderRES.listById(params).then(function (result) {
            $scope.workOrder = result.data[0];  //每次返回结果都是最新的
            $scope.workOrderInstanceId = result.data[0].id;
            angular.forEach($scope.workOrder.instanceLinkResponseList, function(data, index, array) {
               if(data.linkType=='task') {
                   $scope.records.push(data);
               }
            });
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
        };
        $scope.isShow2=true;
        $scope.folder2 = function(){
            $scope.isShow2=!$scope.isShow2;
            if(!$scope.isShow2){
                myWorkOrderRES.getProcessPicture($scope.workOrderInstanceId).then(function (result) {
                    if(result.data!=undefined && result.data!="") {
                        $scope.imageSrc = "data:image/png;base64," + result.data;
                    }
                });
            }
        };
    };
})();