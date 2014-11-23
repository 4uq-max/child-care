'use strict';
module App.Controllers {
    export class UserDeviceController extends BaseController {
        private device: { Name; Platform; Uuid };
        private platforms: string[];
        private errors: string[];

        constructor($scope: IScope<UserDeviceController>,
            private dataService: Services.DataService) {
            super($scope);

            this.dataService.getPlatforms()
                .then(platforms => this.platforms = platforms);
        }

        submit() {
            //var listViewModel = app.getViewModel('UserDevicesList');
            //$http.post('api/userdevice', this.device)
            //.then((data) => { 
            //listViewModel.devices.push(data);
            //listViewModel.list();
            //}, errors => this.errors = errors);
        }
    }
}