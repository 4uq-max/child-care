'use strict';
import IScope = require('../app.d');
import BaseController = require('app/controllers/BaseController');

class HomeController extends BaseController {
    public isAuthenticated: boolean;

    constructor($scope: IScope<HomeController>) {
        super($scope);
        this.isAuthenticated = false;
    }
}

export = HomeController; 