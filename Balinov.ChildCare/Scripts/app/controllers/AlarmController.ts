'use strict';
import IScope = require('../app.d');
import BaseController = require('app/controllers/BaseController');
import Alarm = require('app/models/Alarm');
import Geofence = require('app/models/Geofence');
import Device = require('app/models/Device');
import DataService = require('app/services/DataService');
import Dialog = require('app/system/dialog');

class AlarmController extends BaseController {
    private alarm: Alarm;
    private geofences: Geofence[];
    private devices: Device[];

    private errors: Array<string>;
    private isEdit = false;

    constructor($scope: IScope<AlarmController>,
        private $routeParams: ng.route.IRouteParamsService,
        private $location: ng.ILocationService,
        private dataService: DataService) {
        super($scope);

        var id = $routeParams['id'];
        if (id) {
            this.isEdit = true;
            var item = this.dataService.getAlarm(id);
            this.alarm = {
                Id: item.Id,
                GeofenceId: item.GeofenceId,
                GeofenceName: item.GeofenceName,
                DeviceId: item.DeviceId,
                DeviceName: item.DeviceName
            };

        } else {
            this.alarm = {
                Id: 0,
                GeofenceId: 0,
                GeofenceName: '',
                DeviceId: 0,
                DeviceName: ''
            };
        }

        this.dataService.getGeofences()
            .then(geofences => this.geofences = geofences);
        this.dataService.getDevices()
            .then(devices => this.devices = devices);
    }

    submit() {
        this.dataService.saveAlarm(this.alarm)
            .then(() => { this.$location.path('/Alarm/List'); },
            (errors) => { this.errors = errors; });
    }
}

export = AlarmController;  