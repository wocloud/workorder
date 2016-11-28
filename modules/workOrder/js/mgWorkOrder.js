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
    app.controller('MGworkOrder', MGworkOrder);
    MGworkOrder.$inject = ['$scope', '$location', '$log', '$cacheFactory', 'MyWorkOrder.RES', '$state','$stateParams'];
    function MGworkOrder($scope, $location, $log, $cacheFactory, myWorkOrderRES, $state,$stateParams) {
        console.log($stateParams.id);
        var params={
            linkId:$stateParams.id
        };
        myWorkOrderRES.listById(params).then(function(result){
            $scope.workorder=result.data[0];
        });
        $scope.disposeToMain = function () {
            console.log($scope.workorder);
            var properties={};
            $.extend(properties,$scope.workorder);
            properties.properties=JSON.stringify(properties.properties);
            $log.info(properties);
            myWorkOrderRES.dispose(properties).then(function (result) {
                $log.info(result);
            });
        };
        //return to the main page
        $scope.backToMain = function () {
            history.back();
            /*$location.url("/app/myWorkOrder");*/
        };
    };
})()