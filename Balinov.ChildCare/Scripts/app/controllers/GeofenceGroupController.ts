'use strict';
module App.Controllers {
    export class GeofenceGroupController extends BaseController {
        private isEdit = false;
        private geofenceGroup: GeofenceGroup;
        private errors: Array<string>;

        constructor($scope: IScope<GeofenceGroupController>,
            private $routeParams: ng.route.IRouteParamsService,
            private $location: ng.ILocationService,
            private dataService: Services.DataService) {
            super($scope);

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

        submit() {
            this.dataService.saveGeofenceGroup(this.geofenceGroup)
                .then(() => { this.$location.path('/GeofenceGroups'); },
                (errors) => { this.errors = errors; });
        }
    }
}