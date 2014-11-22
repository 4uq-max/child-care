'use strict';
import IScope = require('../app.d');
import BaseController = require('app/controllers/BaseController');
import GeofenceGroup = require('app/models/GeofenceGroup');
import DataService = require('app/services/DataService');

class GeofenceGroupListController extends BaseController {
    private geofenceGroups: Array<GeofenceGroup>;

    constructor($scope: IScope<GeofenceGroupListController>,
        private dataService: DataService) {
        super($scope);

        this.dataService.getGeofenceGroups()
            .then((geofenceGroups) => { this.geofenceGroups = geofenceGroups; });
    }

    remove(geofenceGroup: GeofenceGroup) {
        this.dataService.deleteGeofenceGroup(geofenceGroup.Id);
    }
}

export = GeofenceGroupListController;