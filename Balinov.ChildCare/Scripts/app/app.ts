var childCare = angular.module('ChildCare', ['ngRoute', 'angular-loading-bar', 'ngAnimate'])
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
            .when('/Account/Register', {
                templateUrl: '/scripts/app/views/Account/Register.html',
                controller: 'RegisterController'
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
                templateUrl: '/scripts/app/views/UserDevice/History.html',
                controller: 'UserDeviceHistoryController'
            });
    })
    .config(['cfpLoadingBarProvider', (cfpLoadingBarProvider) => {
        cfpLoadingBarProvider.includeSpinner = false;
    }])
// Controllers
    .controller('BaseController', App.Controllers.BaseController)
    .controller('AlarmController', App.Controllers.AlarmController)
    .controller('AlarmListController', App.Controllers.AlarmListController)
    .controller('HomeController', App.Controllers.HomeController)
    .controller('NotificationListController', App.Controllers.NotificationListController)
    .controller('LoginController', App.Controllers.LoginController)
    .controller('RegisterController', App.Controllers.RegisterController)
    .controller('GeofenceController', App.Controllers.GeofenceController)
    .controller('GeofenceListController', App.Controllers.GeofenceListController)
    .controller('GeofenceGroupController', App.Controllers.GeofenceGroupController)
    .controller('GeofenceGroupListController', App.Controllers.GeofenceGroupListController)
    .controller('UserDeviceListController', App.Controllers.UserDeviceListController)
    .controller('UserDeviceHistoryController', App.Controllers.UserDeviceHistoryController)
// Services
    .factory('messageService', ['$q', ($q) => new App.Services.MessageService($q)])
    .factory('dataService', ['$http', '$q', 'messageService',
        ($http, $q, messageService) => new App.Services.DataService($http, $q, messageService)])
    .factory('mapService', [() => new App.Services.MapService()])
    .factory('gpsPlayerService', ['mapService', (mapService) => new App.Services.GpsPlayerService(mapService)])
    .run(($rootScope: ng.IRootScopeService) => {
        // Prevent two request at the same time by blocking the screen.
        $rootScope.$on('cfpLoadingBar:started', (evt, e, ee) => {
            $.blockUI({ message: null, overlayCSS: { opacity: 0 } });
        });
        $rootScope.$on('cfpLoadingBar:completed', (evt) => {
            $.unblockUI();
        });
    });