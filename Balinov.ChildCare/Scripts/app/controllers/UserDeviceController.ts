'use strict';
module App.Controllers {
    export class UserDeviceController extends BaseController {
        private device: { Name; Platform; Uuid };
        private platforms: string[];
        private errors: string[];

        constructor($scope: IScope<UserDeviceController>,
            private $location: ng.ILocationService,
            private dataService: Services.DataService) {
            super($scope);

            this.device = { Name: '', Platform: '', Uuid: '' };
            this.dataService.getPlatforms()
                .then(platforms => this.platforms = platforms);
        }

        submit() {
            this.dataService.saveDevice(this.device)
                .then(() => this.$location.path('/UserDevice/List'),
                errors => this.errors = errors);
        }
    }
}