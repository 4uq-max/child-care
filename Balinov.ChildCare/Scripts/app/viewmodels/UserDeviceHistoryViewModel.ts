import $ = require('jquery');
import ko = require('knockout');
import HttpRequest = require('libs/httprequest');
import LocationPlayerViewModel = require('app/viewmodels/LocationPlayerViewModel');

declare var app;
var apiUri = 'api/userdevice';

class UserDeviceHistoryViewModel {
    DeviceId = 0;
    private errors: Array<string>;

    constructor(item) {
        this.DeviceId = item.DeviceId;
        $('#Date').val($.datepicker.formatDate('dd.mm.yy', new Date()));
    }

    submit = (viewModel, event: Event) => {
        var data = JSON.parse(ko.toJSON(viewModel));
        var listViewModel = app.getViewModel('GeofenceGroupsList');

        var date = $.datepicker.parseDate("dd.mm.yy", $('#Date').val());
        if (!date) date = new Date(0);
        var timestamp = ~~(date.getTime() / 1000);
        var url = apiUri + '/' + data.DeviceId + '?timestamp=' + timestamp;
        var promise = HttpRequest.getJSON(url)
        .then((data) => {
            var player = new LocationPlayerViewModel(data);
            player.show();
        }, errors => this.errors = errors);
    }
}

export = UserDeviceHistoryViewModel;