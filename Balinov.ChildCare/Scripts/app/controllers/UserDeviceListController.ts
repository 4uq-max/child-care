'use strict';
module App.Controllers {
    export class UserDeviceListController extends BaseController {
        private devices: Device[];

        constructor($scope: IScope<UserDeviceListController>,
            private dataService: Services.DataService) {
            super($scope);

            this.dataService.getDevices()
                .then(devices => this.devices = devices);
        }

        remove(device: Device) {
            this.dataService.deleteDevice(device.DeviceId);
        }
    }
}