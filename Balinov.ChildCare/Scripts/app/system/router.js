define(["require", "exports", 'jquery', 'knockout', 'routie', 'app/system/view', 'libs/httprequest', 'app/viewmodels/LoginViewModel', 'app/viewmodels/RegisterViewModel', 'app/viewmodels/GeofenceGroupsListViewModel', 'app/viewmodels/GeofencesListViewModel', 'app/viewmodels/UserDevicesListViewModel', 'app/viewmodels/AlarmsListViewModel', 'app/viewmodels/NotificationsListViewModel', 'app/maps/OpenLayersMap'], function(require, exports, $, ko, initRoutie, View, HttpRequest, LoginViewModel, RegisterViewModel, GeofenceGroupsListViewModel, GeofencesListViewModel, UserDevicesListViewModel, AlarmsListViewModel, NotificationsListViewModel, OpenLayersMap) {
    var Router = (function () {
        function Router(app) {
            var _this = this;
            this.route = function (to) {
                routie(to);
            };
            this.getRoute = function () {
                return window.location.hash.replace('#', '');
            };
            this.getViewModel = function (key, type) {
                var viewModel = _this.app.getViewModel(key);
                if (!viewModel) {
                    viewModel = new type();
                    _this.app.setViewModel(key, viewModel);
                }
                return viewModel;
            };
            this.app = app;
            initRoutes(this);
            initRoutie;
        }
        return Router;
    })();

    

    function initRoutes(router) {
        routie('Home', function () {
            if (!router.app.getViewModel('Account').IsAuthenticated()) {
                router.route('Account/Login');
                return;
            }

            View.render(router.getRoute(), $('main')).then(function () {
                var map = new OpenLayersMap('map');
                router.app.setMap(map);
            });
        });
        initAccount(router);

        routie('GeofenceGroups', function () {
            router.getViewModel('GeofenceGroupsList', GeofenceGroupsListViewModel).list();
        });
        routie('Geofences', function () {
            router.getViewModel('GeofencesList', GeofencesListViewModel).list();
        });
        routie('UserDevices', function () {
            router.getViewModel('UserDevicesList', UserDevicesListViewModel).list();
        });
        routie('Alarms', function () {
            router.getViewModel('AlarmsList', AlarmsListViewModel).list();
        });

        routie('Notifications', function () {
            router.getViewModel('NotificationsList', NotificationsListViewModel).list();
        });
    }

    function initAccount(router) {
        routie('Account/Login', function () {
            var main = $("main");
            var promise = View.render(router.getRoute(), main);
            promise.done(function () {
                var container = main.find('#LoginForm')[0];
                var viewModel = new LoginViewModel();
                ko.applyBindings(viewModel, ko.cleanNode(container));
            });
        });

        routie('Account/LogOff', function () {
            var promise = HttpRequest.postJSON('api/account/logout', {});
            promise.done(function (isLoggedOff) {
                if (isLoggedOff) {
                    router.route("Account/Login");
                    router.app.getViewModel('Account').IsAuthenticated(false);
                }
            });
        });

        routie('Account/Register', function () {
            var main = $("main");
            var promise = View.render(router.getRoute(), main);
            promise.done(function () {
                var container = main.find('#RegisterForm')[0];
                var viewModel = new RegisterViewModel();
                ko.applyBindings(viewModel, ko.cleanNode(container));
            });
        });
    }
    return Router;
});
//# sourceMappingURL=router.js.map
