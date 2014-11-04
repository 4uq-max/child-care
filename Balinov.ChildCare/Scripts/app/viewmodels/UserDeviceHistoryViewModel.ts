import $ = require('jquery');
import initJqueryUI = require('JqueryUI');
import ko = require('knockout');
import HttpRequest = require('libs/httprequest');
import Utils = require('app/system/utils');
import LocationPlayerViewModel = require('app/viewmodels/LocationPlayerViewModel');


declare var app;
var apiUri = 'api/userdevice';

class UserDeviceHistoryViewModel {
    DeviceId = ko.observable(0);

    constructor(item) {
        this.DeviceId(item.DeviceId);
        initJqueryUI;
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
        }, (err) => {
            var form = $(event.currentTarget).parents('form');
            Utils.displayErrors(form, err.responseJSON);
        });
    }

    list = () => {
        app.getViewModel('UserDevicesList').list();
    }
}

export = UserDeviceHistoryViewModel;