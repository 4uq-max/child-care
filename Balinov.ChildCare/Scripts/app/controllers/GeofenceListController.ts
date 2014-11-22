'use strict';
import IScope = require('../app.d');
import BaseController = require('app/controllers/BaseController');
import Geofence = require('app/models/Geofence');
import DataService = require('app/services/DataService');

class GeofenceListController extends BaseController {
    private geofences: Array<Geofence>;
   
    constructor($scope: IScope<GeofenceListController>,
        private dataService: DataService) {
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

export = GeofenceListController;