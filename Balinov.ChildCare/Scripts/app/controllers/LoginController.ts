'use strict';
module App.Controllers {
    export class LoginController extends BaseController {
        private login: Login;
        private errors: Array<string>;

        constructor($scope: IScope<LoginController>,
            private dataService: Services.DataService) {
            super($scope);

            this.login = { Email: '', Password: '', RememberMe: false };
        }

        submit() {
            var parent: any = this.$scope.$parent;

            console.log('parent scope:', parent, parent.IsAuthenticated);
            this.dataService.login(this.login)
                .then(() => {
                    console.log('login');
                    // declare app;
                    //app.route('Home');
                    // this.dataService.IsAuthenticated = true;
                },
                (errors) => { this.errors = errors; });
        }
    }
}