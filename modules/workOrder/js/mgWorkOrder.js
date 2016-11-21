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
    MGworkOrder.$inject = ['$scope', '$location', '$log', '$cacheFactory', 'MyWorkOrder.RES', '$state'];
    function MGworkOrder($scope, $location, $log, $cacheFactory, myWorkOrderRES, $state) {
        myWorkOrderRES.list_create_attr().then(function(result){
            for(var i=0;i<result.data.content.length;i++){
                result.data.content[i].createValue=result.data.content[i].propertyDefaultValue;
            }
            $scope.properties=result.data.content;
            $scope.createWorkOrder
        });
        function data(){
            var params = {};
            if($scope.properties!=undefined&&$scope.properties.length>0) {
                for (var i = 0; i < $scope.properties.length; i++) {
                    var key = $scope.properties[i].propertyKey;
                    var value=null;
                    if($scope.properties[i].propertyType=="dateTime"){
                        $scope.properties[i].createValue = (new Date()).getTime();
                    }
                    value = $scope.properties[i].createValue;
                    var str = "{" + key + ":" + "value" + "}";
                    var param = eval('(' + str + ')');
                    for (var r in param) {
                        eval("params." + r + "=param." + r);
                    }
                }
            }
            return params;
        }
        //create new workOrder
        $scope.saveItem = function () {
            var params=data();
            console.log(params);
            $log.info($scope.workOrder);
            myWorkOrderRES.create($scope.workOrder).then(function (result) {
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