import $ = require('jquery');
import ko = require('knockout');
import HttpRequest = require('libs/httprequest');
import Utils = require('app/system/utils');
import GeofencesListViewModel = require('app/viewmodels/GeofencesListViewModel');
import UserDevicesListViewModel = require('app/viewmodels/UserDevicesListViewModel');

declare var app;
var apiUri = 'api/alarm';

class AlarmViewModel {
    Id = ko.observable(0);
    GeofenceId = ko.observable(0);
    DeviceId = ko.observable(0);
    geofences;
    devices;

    IsEdit = ko.computed(() => {
        return this.Id() > 0;
    });

    constructor(item?) {
        if (item) {
            this.Id(item.Id);
            this.GeofenceId(item.GeofenceId);
            this.DeviceId(item.DeviceId);
        }
        var geofencesViewModel = app.getViewModel('GeofencesList');
        if (!geofencesViewModel) geofencesViewModel = new GeofencesListViewModel();
        this.geofences = geofencesViewModel.geofences;

        var devicesViewModel = app.getViewModel('UserDevicesList');
        if (!devicesViewModel) devicesViewModel = new UserDevicesListViewModel();
        this.devices = devicesViewModel.devices;
    }

    submit = (viewModel, event: Event) => {
        var data = JSON.parse(ko.toJSON(viewModel));
        delete data.geofences; delete data.devices;

        var listViewModel = app.getViewModel('AlarmsList');

        var promise;
        if (!this.IsEdit()) {
            promise = HttpRequest.postJSON(apiUri, data)
                .then((data) => { listViewModel.alarms.push(data); });
        } else {
            promise = HttpRequest.putJSON(apiUri + '/' + this.Id(), data)
                .then((data) => {
                    var alarms = listViewModel.alarms;
                    var oldAlarm = ko.utils.arrayFirst<any>(alarms(), g => { return g.Id == data.Id; });
                    alarms.replace(oldAlarm, data);
                });
        }
        promise.then(() => { listViewModel.list(); }, (err) => {
            var form = $(event.currentTarget).parents('form');
            Utils.displayErrors(form, err.responseJSON);
        });
    }

    list = () => {
        app.getViewModel('AlarmsList').list();
    }
}

export = AlarmViewModel;