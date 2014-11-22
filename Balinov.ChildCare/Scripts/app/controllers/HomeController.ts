'use strict';
module App.Controllers {
    export class HomeController extends BaseController {
        public isAuthenticated: boolean;

        constructor($scope: IScope<HomeController>,
            private $location: ng.ILocationService,
            private $timeout: ng.ITimeoutService,
            private dataService: Services.DataService) {
            super($scope);
            this.isAuthenticated = false;

            this.dataService.isAuthenticated()
                .then((data) => {
                    this.isAuthenticated = data.IsAuthenticated;
                    var path = this.isAuthenticated ? '/Home' : '/Account/Login';
                    this.$timeout(() => {
                        this.$location.path(path);
                    }, 500);
                });
        }
    }
}