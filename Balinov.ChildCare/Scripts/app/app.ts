import $ = require('jquery');
import ko = require('knockout');
import AccountViewModel = require('app/viewmodels/AccountViewModel');
import HttpRequest = require('libs/httprequest');
import Router = require('app/system/router');
import IMap = require('app/maps/IMap');
import angular = require('angular');
import ngRoute = require('ngRoute');

import BaseController = require('app/controllers/BaseController');
import HomeController = require('app/controllers/HomeController');
import NotificationListController = require('app/controllers/NotificationListController');
import LoginController = require('app/controllers/LoginController');
import GeofenceController = require('app/controllers/GeofenceController');
import GeofenceListController = require('app/controllers/GeofenceListController');
import GeofenceGroupController = require('app/controllers/GeofenceGroupController');
import GeofenceGroupListController = require('app/controllers/GeofenceGroupListController');

import DataService = require('app/services/DataService');

ngRoute;
var childCare = angular.module('ChildCare', ['ngRoute'/*, 'ngCookies'*/])
    .controller("BaseController", BaseController)
    .controller('HomeController', HomeController)
    .controller('NotificationListController', NotificationListController)
    .controller('LoginController', LoginController)
    .controller('GeofenceController', GeofenceController) 
    .controller('GeofenceListController', GeofenceListController) 
    .controller('GeofenceGroupController', GeofenceGroupController)
    .controller('GeofenceGroupListController', GeofenceGroupListController) 
    // Config routes
    .config(($routeProvider: ng.route.IRouteProvider) => {
        $routeProvider
            .when('/Notifications', {
                templateUrl: '/scripts/app/views/Notification/List.html',
                controller: 'NotificationListController'
            })
            .when('/Account/Login', {
                templateUrl: '/scripts/app/views/Account/Login.html',
                controller: 'LoginController'
            })
            .when('/GeofenceGroup/:id?', {
                templateUrl: '/scripts/app/views/GeofenceGroup/Edit.html',
                controller: 'GeofenceGroupController'
            })
            .when('/GeofenceGroups', {
                templateUrl: '/scripts/app/views/GeofenceGroup/List.html',
                controller: 'GeofenceGroupListController'
            })
            .when('/Geofence/:id?', {
                templateUrl: '/scripts/app/views/Geofence/Edit.html',
                controller: 'GeofenceController'
            })
            .when('/Geofences', {
                templateUrl: '/scripts/app/views/Geofence/List.html',
                controller: 'GeofenceListController'
            });
    })
    // Services
    .factory('dataService', ['$http', '$q', ($http, $q) => new DataService($http, $q)])
    .run(() => { });

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