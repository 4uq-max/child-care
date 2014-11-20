'use strict';
import IScope = require('../app.d');
import BaseController = require('app/controllers/BaseController');
import Login = require('app/models/Login');
import DataService = require('app/services/DataService');

class LoginController extends BaseController {
    private login: Login;
    private errors: Array<string>;

    constructor($scope: IScope<LoginController>,
        private dataService: DataService) {
        super($scope);

        this.login = { Email: '', Password: '', RememberMe: false };
    }

    submit() {
        //console.log('Drago');
        var parent: any = this.$scope.$parent;
       // this.$scope
        console.log('parent scope:', parent, parent.IsAuthenticated);
        this.dataService.login(this.login)
            .then(() => {
                console.log('login');
                //app.route('Home');
                // this.dataService.IsAuthenticated = true;
            },
            (errors) => { this.errors = errors; });
    }
}

export = LoginController;