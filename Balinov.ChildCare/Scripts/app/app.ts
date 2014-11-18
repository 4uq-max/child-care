import $ = require('jquery');
import ko = require('knockout');
import AccountViewModel = require('app/viewmodels/AccountViewModel');
import HttpRequest = require('libs/httprequest');
import Router = require('app/system/router');
import IMap = require('app/maps/IMap');
import angular = require('angular');
import ngRoute = require('ngRoute');
import BaseController = require('app/controllers/BaseController');
import NotificationListController = require('app/controllers/NotificationListController');
import GeofenceGroupController = require('app/controllers/GeofenceGroupController');
import GeofenceGroupListController = require('app/controllers/GeofenceGroupListController');

import DataService = require('app/services/DataService');

ngRoute;
var childCare = angular.module('ChildCare', ['ngRoute'/*, 'ngCookies'*/])
    .controller("BaseController", BaseController)
    .controller('NotificationListController', NotificationListController)
    .controller('GeofenceGroupController', GeofenceGroupController)
    .controller('GeofenceGroupListController', GeofenceGroupListController) 
    // Config routes
    .config(($routeProvider: ng.route.IRouteProvider) => {
        $routeProvider
            .when('/Notifications', {
                templateUrl: '/scripts/app/views/Notification/List.html',
                controller: 'NotificationListController'
            })
            .when('/GeofenceGroup/:id?', {
                templateUrl: '/scripts/app/views/GeofenceGroup/Edit.html',
                controller: 'GeofenceGroupController'
            })
            .when('/GeofenceGroups', {
                templateUrl: '/scripts/app/views/GeofenceGroup/List.html',
                controller: 'GeofenceGroupListController'
            });
    })
    // Services
    .factory('dataService', ['$http', '$q', ($http, $q) => new DataService($http, $q)])
    .run(($rootScope: ng.IRootScopeService, $location: ng.ILocationService) => {
//        $rootScope.$on("$locationChangeStart", function (event, next, current) {
//            console.log(next, current);
//        });
    });

class App {
    private router;
    private map: IMap;
    private viewModels = {};

    constructor() {
        this.setViewModel('Account', new AccountViewModel(false));
    }

    run = () => {
        HttpRequest.getJSON('api/account').then((data) => {
            this.getViewModel('Account').IsAuthenticated(data.IsAuthenticated);
            ko.applyBindings(this.getViewModel('Account'), $('nav')[0]);
            this.router = new Router(this);
            var routeTo = data.IsAuthenticated ?
                (window.location.hash == '' ? '#Home' : window.location.hash)
                : '#Account/Login';
            //this.route(routeTo);
        });
    }

    route = (to: string) => {
        this.router.route(to);
    }

    getViewModel = (key) => {
        var result = this.viewModels[key];
        return result;
    }

    setViewModel = (key, value) => {
        this.viewModels[key] = value;
    }

    getMap = () => {
        return this.map;
    }

    setMap = (map: IMap) => {
        this.map = map;
    }
}

export = App;