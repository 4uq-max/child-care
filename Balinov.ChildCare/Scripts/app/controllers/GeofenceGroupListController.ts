'use strict';
import IScope = require('../app.d');
import BaseController = require('app/controllers/BaseController');
import Dialog = require('app/system/dialog');
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
        Dialog.confirm('Сигурни ли сте, че исате да изтриете избраият елемент?')
            .then(() => this.dataService.deleteGeofenceGroup(geofenceGroup.Id));
    }
}

export = GeofenceGroupListController;