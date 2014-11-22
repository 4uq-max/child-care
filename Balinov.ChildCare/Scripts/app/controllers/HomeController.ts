'use strict';
module App.Controllers {
    export class HomeController extends BaseController {
        public isAuthenticated: boolean;

        constructor($scope: IScope<HomeController>,
            //$location: 
            private dataService: Services.DataService) {
            super($scope);
            this.isAuthenticated = false;

            this.dataService.isAuthenticated()
                .then((data) => {
                    this.isAuthenticated = data.IsAuthenticated;
                    //this.router = new Router(this);
                    //var routeTo = data.IsAuthenticated ?
                    //    (window.location.hash == '' ? '#Home' : window.location.hash)
                    //    : '#Account/Login';
                    //this.route(routeTo);
                });
        }
    }
}