define(["require", "exports", 'jquery', 'knockout', 'libs/httprequest', 'app/system/utils', 'app/viewmodels/GeofencesListViewModel', 'app/viewmodels/UserDevicesListViewModel'], function(require, exports, $, ko, HttpRequest, Utils, GeofencesListViewModel, UserDevicesListViewModel) {
    var apiUri = 'api/alarm';

    var AlarmViewModel = (function () {
        function AlarmViewModel(item) {
            var _this = this;
            this.Id = ko.observable(0);
            this.GeofenceId = ko.observable(0);
            this.DeviceId = ko.observable(0);
            this.IsEdit = ko.computed(function () {
                return _this.Id() > 0;
            });
            this.submit = function (viewModel, event) {
                var data = JSON.parse(ko.toJSON(viewModel));
                delete data.geofences;
                delete data.devices;

                var listViewModel = app.getViewModel('AlarmsList');

                var promise;
                if (!_this.IsEdit()) {
                    promise = HttpRequest.postJSON(apiUri, data).then(function (data) {
                        listViewModel.alarms.push(data);
                    });
                } else {
                    promise = HttpRequest.putJSON(apiUri + '/' + _this.Id(), data).then(function (data) {
                        var alarms = listViewModel.alarms;
                        var oldAlarm = ko.utils.arrayFirst(alarms(), function (g) {
                            return g.Id == data.Id;
                        });
                        alarms.replace(oldAlarm, data);
                    });
                }
                promise.then(function () {
                    listViewModel.list();
                }, function (err) {
                    var form = $(event.currentTarget).parents('form');
                    Utils.displayErrors(form, err.responseJSON);
                });
            };
            this.list = function () {
                app.getViewModel('AlarmsList').list();
            };
            if (item) {
                this.Id(item.Id);
                this.GeofenceId(item.GeofenceId);
                this.DeviceId(item.DeviceId);
            }
            var geofencesViewModel = app.getViewModel('GeofencesList');
            if (!geofencesViewModel)
                geofencesViewModel = new GeofencesListViewModel();
            this.geofences = geofencesViewModel.geofences;

            var devicesViewModel = app.getViewModel('UserDevicesList');
            if (!devicesViewModel)
                devicesViewModel = new UserDevicesListViewModel();
            this.devices = devicesViewModel.devices;
        }
        return AlarmViewModel;
    })();

    
    return AlarmViewModel;
});
//# sourceMappingURL=AlarmViewModel.js.map
