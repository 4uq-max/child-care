'use strict';
module App.Controllers {
    export class GeofenceListController extends BaseController {
        private geofences: Array<Geofence>;

        constructor($scope: IScope<GeofenceListController>,
            private dataService: Services.DataService) {
            super($scope);

            this.dataService.getGeofences()
                .then((geofences) => {
                    this.geofences = geofences;
                    for (var i = 0; i < this.geofences.length; i++) {
                        this.geofences[i].Visible = false;
                    }
                });
        }

        remove(geofence: Geofence) {
            this.dataService.deleteGeofence(geofence.Id);
        }

        toggle(geofence: Geofence) {
            //var map = app.getMap();
            if (!geofence.Visible) {
                //    geofence.Feature = map.addFeature(geofence.GeoJSONBuffered);
                geofence.Visible = true;
            } else {
                //    map.removeFeature(geofence.Feature);
                //    delete geofence.Feature;
                geofence.Visible = false;
            }
        }
    }
}