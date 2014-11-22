'use strict';
import IScope = require('../app.d');
import BaseController = require('app/controllers/BaseController');
import Device = require('app/models/Device');
import DataService = require('app/services/DataService');

class UserDeviceListController extends BaseController {
    private devices: Device[];

    constructor($scope: IScope<UserDeviceListController>,
        private dataService: DataService) {
        super($scope);

        this.dataService.getDevices()
            .then(devices => this.devices = devices);
    }

    remove(device: Device) {
        this.dataService.deleteDevice(device.DeviceId);
    }
}

export = UserDeviceListController;