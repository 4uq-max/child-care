import ko = require('knockout');
import HttpRequest = require('libs/httprequest');

declare var app;
var apiUri = 'api/userdevice';
var platforms;

class UserDeviceViewModel {
    Name = ko.observable('');
    Platform = ko.observable('');
    Uuid = ko.observable('');
    platforms = ko.observableArray();
    private errors: Array<string>;

    constructor() {
        if (!platforms) {
            HttpRequest.getJSON(apiUri + '/getplatforms')
            .then((data) => {
                platforms = data;
                ko.utils.arrayPushAll(this.platforms, data);
            });
        } else {
            ko.utils.arrayPushAll(this.platforms, platforms);
        }
    }

    submit = (viewModel, event: Event) => {
        var data = JSON.parse(ko.toJSON(viewModel));
        delete data.platforms;
        var listViewModel = app.getViewModel('UserDevicesList');
        HttpRequest.postJSON(apiUri, data)
        .then((data) => { 
            listViewModel.devices.push(data);
            listViewModel.list();
        }, (errors) => { this.errors = errors; });
    }

    list = () => {
        app.getViewModel('UserDevicesList').list();
    }
}

export = UserDeviceViewModel;