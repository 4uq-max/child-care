//import $ = require('jquery');
//import ko = require('knockout');
//import AccountViewModel = require('app/viewmodels/AccountViewModel');
//import HttpRequest = require('libs/httprequest');
//import Router = require('app/system/router');
//import IMap = require('app/maps/IMap');
//import angular = require('angular');
//import ngRoute = require('ngRoute');

var childCare = angular.module('ChildCare', ['ngRoute', 'angular-loading-bar'/*, 'ngCookies'*/])
    .controller('BaseController', App.Controllers.BaseController)
    .controller('AlarmController', App.Controllers.AlarmController)
    .controller('AlarmListController', App.Controllers.AlarmListController)
    .controller('HomeController', App.Controllers.HomeController)
    .controller('NotificationListController', App.Controllers.NotificationListController)
    .controller('LoginController', App.Controllers.LoginController)
    .controller('GeofenceController', App.Controllers.GeofenceController)
    .controller('GeofenceListController', App.Controllers.GeofenceListController)
    .controller('GeofenceGroupController', App.Controllers.GeofenceGroupController)
    .controller('GeofenceGroupListController', App.Controllers.GeofenceGroupListController)
    .controller('UserDeviceListController', App.Controllers.UserDeviceListController)
    // Config routes
    .config(($routeProvider: ng.route.IRouteProvider) => {
        $routeProvider
            .when('/Alarm/List', {
                templateUrl: '/scripts/app/views/Alarm/List.html',
                controller: 'AlarmListController'
            })
            .when('/Alarm/Edit/:id?', {
                templateUrl: '/scripts/app/views/Alarm/Edit.html',
                controller: 'AlarmController'
            })
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
            })
            .when('/UserDevice/Edit', {
                templateUrl: '/scripts/app/views/UserDevice/Edit.html'
            })
            .when('/UserDevice/List', {
                templateUrl: '/scripts/app/views/UserDevice/List.html',
                controller: 'UserDeviceListController'
            })
            .when('/UserDevice/History/:id', {
                templateUrl: '/scripts/app/views/UserDevice/History.html'
            });
    })
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }])
    // Services
    .factory('messageService', ['$q', ($q) => new App.Services.MessageService($q)])
    .factory('dataService', ['$http', '$q', 'messageService',
        ($http, $q, messageService) => new App.Services.DataService($http, $q, messageService)])
    .run(() => { });

//class Appl {
//    private router;
//    private map: IMap;
//    private viewModels = {};

//    route = (to: string) => {
//        this.router.route(to);
//    }

//    getViewModel = (key) => {
//        return this.viewModels[key];
//    }

//    setViewModel = (key, value) => {
//        this.viewModels[key] = value;
//    }

//    getMap = () => {
//        return this.map;
//    }

//    setMap = (map: IMap) => {
//        this.map = map;
//    }
//}

//var app = new Appl();