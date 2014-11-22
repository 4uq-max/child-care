'use strict';
import IScope = require('../app.d');
import BaseController = require('app/controllers/BaseController');
import DataService = require('app/services/DataService');

class HomeController extends BaseController {
    public isAuthenticated: boolean;

    constructor($scope: IScope<HomeController>,
        //$location: 
        private dataService: DataService) {
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

export = HomeController; 