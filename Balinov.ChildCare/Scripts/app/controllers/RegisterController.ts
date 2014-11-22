'use strict';
module App.Controllers {
    export class RegisterController extends BaseController {
        private register: Register;
        private errors: string[];

        constructor($scope: IScope<RegisterController>,
            private $location: ng.ILocationService,
            private dataService: Services.DataService) {
            super($scope);
            this.register = { Email: '', FirstName: '', LastName: '', Password: '', ConfirmPassword: '' };
        }

        submit() {
            this.dataService.register(this.register)
                .then(() => this.$location.path('/Account/Login'),
                errors => this.errors = errors);
        }
    }
} 