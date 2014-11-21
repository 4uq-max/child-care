'use strict';
import IScope = require('../app.d');
import BaseController = require('app/controllers/BaseController');
import Dialog = require('app/system/dialog');
import Device = require('app/models/Device');
import DataService = require('app/services/DataService');

class UserDeviceListController extends BaseController {
    private devices: Array<Device>;

    constructor($scope: IScope<UserDeviceListController>,
        private dataService: DataService) {
        super($scope);

        this.dataService.getDevices()
            .then(devices => this.devices = devices);
    }

    remove(device: Device) {
        Dialog.confirm('Сигурни ли сте, че исате да изтриете избраият елемент?')
            .then(() => this.dataService.deleteDevice(device.DeviceId));
    }

    history(device: Device) {

    }
}

export = UserDeviceListController;