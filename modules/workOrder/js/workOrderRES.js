app.service('MyWorkOrder.RES', ServiceMyWorkOrderRES);
ServiceMyWorkOrderRES.$inject = ['$q', '$resource', 'fakeMapping'];
function ServiceMyWorkOrderRES($q, $resource, fakeMapping) {
    this.CMD = {
        ListWorkOrder    : 'listWorkOrders',
        CreateWorkOrder  : 'createWorkOrder',
        GetWorkOrder     : 'getWorkOrder',
        ListProperties   : 'listWorkOrderProperties'
    };

    var api_workOrder_list = '/unifacc?action=:cmd',
        res_workOrder_list = $resource(api_workOrder_list,{cmd : '@cmd'});
    var api_workOrder_attr_list = '/wocloud-workorder-restapi/workorderProperty/selectWorkorderPropertiesByCondition',
        res_workOrder_attr_list = $resource(api_workOrder_attr_list,{},{post:{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json;charset=UTF-8'
            }
        }});
    var api_creatCorkOrder_attr_list = '/wocloud-workorder-restapi/workorderProperty/selectWorkorderPropertiesByConditionss',
        res_creatCorkOrder_attr_list = $resource(api_creatCorkOrder_attr_list,{},{post:{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json;charset=UTF-8'
            }
        }});
    fakeMapping.scheme(api_creatCorkOrder_attr_list, {
        '':'modules/workOrder/json/create.listattr.json'
    });
    fakeMapping.scheme(api_workOrder_list, {
        '@cmd:listWorkOrders'   : 'modules/workOrder/json/workOrder.list.json',
        '@cmd:createWorkOrder'  : 'modules/workOrder/json/workOrder.save.json',
        '@cmd:getWorkOrder'     : 'modules/workOrder/json/workOrder.info.json',
        '@cmd:listWorkOrderProperties'     : 'modules/workOrder/json/property.list.json'
    });
    fakeMapping.scheme(api_workOrder_attr_list, {
        ''   : 'modules/workOrder/json/property.list.json'
    });
    this.list_create_attr=function(params){
        var task = $q.defer();
        res_creatCorkOrder_attr_list.post(params, function (response) {
            task.resolve(response.toJSON());
        });
        return task.promise;
    }
    this.list_attr=function(params){
        var task = $q.defer();
        res_workOrder_attr_list.post(params, function (response) {
            task.resolve(response.toJSON());
        });
        return task.promise;
    };
    this.list = function(cmd, id) {
        var task = $q.defer();
        if(!cmd) cmd = this.CMD.ListWorkOrder;
        var params = id == undefined ? {cmd: cmd} : {cmd: cmd,id: id};
        res_workOrder_list.get(params, function (response) {
            task.resolve(response.toJSON());
        });
        return task.promise;
    };

    this.create = function(params){
        var task = $q.defer();
        res_workOrder_list.save(params,function(response){
            task.resolve(response.toJSON());
        });
        return task.promise;
    };

    this.remove = function(id){
        var task = $q.defer();
        res_workOrder_list.delete({id:id},function(response){
            task.resolve(response.toJSON());
        });
        return task.promise;
    };

    this.listProperties = function(cmd) {
        var task = $q.defer();
        var self = this;

        if(!cmd) cmd = this.CMD.ListProperties;
        var params = {cmd: cmd};
        res_workOrder_list.get(params, function (response) {
            task.resolve(response.toJSON());
        });

        return task.promise;
    }
}