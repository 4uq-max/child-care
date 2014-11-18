'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'app/controllers/BaseController', 'app/system/dialog'], function(require, exports, BaseController, Dialog) {
    var GeofenceGroupListController = (function (_super) {
        __extends(GeofenceGroupListController, _super);
        function GeofenceGroupListController($scope, dataService) {
            var _this = this;
            _super.call(this, $scope);
            this.dataService = dataService;

            this.dataService.getGeofenceGroups().then(function (geofenceGroups) {
                _this.geofenceGroups = geofenceGroups;
            });
        }
        GeofenceGroupListController.prototype.remove = function (geofenceGroup) {
            var _this = this;
            Dialog.confirm('Сигурни ли сте, че исате да изтриете избраият елемент?').then(function () {
                return _this.dataService.deleteGeofenceGroup(geofenceGroup.Id);
            });
        };
        return GeofenceGroupListController;
    })(BaseController);

    
    return GeofenceGroupListController;
});
//# sourceMappingURL=GeofenceGroupListController.js.map
