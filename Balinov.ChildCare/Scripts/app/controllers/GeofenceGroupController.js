'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'app/controllers/BaseController'], function(require, exports, BaseController) {
    var GeofenceGroupController = (function (_super) {
        __extends(GeofenceGroupController, _super);
        function GeofenceGroupController($scope, $routeParams, $location, dataService) {
            _super.call(this, $scope);
            this.$routeParams = $routeParams;
            this.$location = $location;
            this.dataService = dataService;
            this.isEdit = false;

            var id = $routeParams['id'];
            if (id) {
                this.isEdit = true;
                var item = this.dataService.getGeofenceGroup(id);
                this.geofenceGroup = { Id: item.Id, Name: item.Name, IsUserItem: true };
            } else {
                this.geofenceGroup = { Id: 0, Name: '', IsUserItem: true };
            }

            this.geofenceGroup.IsUserItem = true;
        }
        GeofenceGroupController.prototype.submit = function () {
            var _this = this;
            this.dataService.saveGeofenceGroup(this.geofenceGroup).then(function () {
                _this.$location.path('/GeofenceGroups');
            }, function (errors) {
                _this.errors = errors;
            });
        };
        return GeofenceGroupController;
    })(BaseController);

    
    return GeofenceGroupController;
});
//# sourceMappingURL=GeofenceGroupController.js.map
