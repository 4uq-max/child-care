'use strict';
module App.Controllers {
    export class GeofenceGroupListController extends BaseController {
        private geofenceGroups: Array<GeofenceGroup>;

        constructor($scope: IScope<GeofenceGroupListController>,
            private dataService: Services.DataService) {
            super($scope);

            this.dataService.getGeofenceGroups()
                .then((geofenceGroups) => { this.geofenceGroups = geofenceGroups; });
        }

        remove(geofenceGroup: GeofenceGroup) {
            this.dataService.deleteGeofenceGroup(geofenceGroup.Id);
        }
    }
}