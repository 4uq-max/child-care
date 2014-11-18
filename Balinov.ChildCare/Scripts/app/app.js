define(["require", "exports", 'jquery', 'knockout', 'app/viewmodels/AccountViewModel', 'libs/httprequest', 'app/system/router', 'angular', 'ngRoute', 'app/controllers/BaseController', 'app/controllers/NotificationListController', 'app/controllers/GeofenceGroupController', 'app/controllers/GeofenceGroupListController', 'app/services/DataService'], function(require, exports, $, ko, AccountViewModel, HttpRequest, Router, angular, ngRoute, BaseController, NotificationListController, GeofenceGroupController, GeofenceGroupListController, DataService) {
    ngRoute;
    var childCare = angular.module('ChildCare', ['ngRoute']).controller("BaseController", BaseController).controller('NotificationListController', NotificationListController).controller('GeofenceGroupController', GeofenceGroupController).controller('GeofenceGroupListController', GeofenceGroupListController).config(function ($routeProvider) {
        $routeProvider.when('/Notifications', {
            templateUrl: '/scripts/app/views/Notification/List.html',
            controller: 'NotificationListController'
        }).when('/GeofenceGroup/:id?', {
            templateUrl: '/scripts/app/views/GeofenceGroup/Edit.html',
            controller: 'GeofenceGroupController'
        }).when('/GeofenceGroups', {
            templateUrl: '/scripts/app/views/GeofenceGroup/List.html',
            controller: 'GeofenceGroupListController'
        });
    }).factory('dataService', ['$http', '$q', function ($http, $q) {
            return new DataService($http, $q);
        }]).run(function ($rootScope, $location) {
        //        $rootScope.$on("$locationChangeStart", function (event, next, current) {
        //            console.log(next, current);
        //        });
    });

    var App = (function () {
        function App() {
            var _this = this;
            this.viewModels = {};
            this.run = function () {
                HttpRequest.getJSON('api/account').then(function (data) {
                    _this.getViewModel('Account').IsAuthenticated(data.IsAuthenticated);
                    ko.applyBindings(_this.getViewModel('Account'), $('nav')[0]);
                    _this.router = new Router(_this);
                    var routeTo = data.IsAuthenticated ? (window.location.hash == '' ? '#Home' : window.location.hash) : '#Account/Login';
                    //this.route(routeTo);
                });
            };
            this.route = function (to) {
                _this.router.route(to);
            };
            this.getViewModel = function (key) {
                var result = _this.viewModels[key];
                return result;
            };
            this.setViewModel = function (key, value) {
                _this.viewModels[key] = value;
            };
            this.getMap = function () {
                return _this.map;
            };
            this.setMap = function (map) {
                _this.map = map;
            };
            this.setViewModel('Account', new AccountViewModel(false));
        }
        return App;
    })();

    
    return App;
});
//# sourceMappingURL=app.js.map
