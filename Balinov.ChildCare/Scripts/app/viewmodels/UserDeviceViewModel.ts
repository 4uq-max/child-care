import ko = require('knockout');
import HttpRequest = require('libs/httprequest');

declare var app;
var platforms;

class UserDeviceViewModel {
    Name = '';
    Platform = '';
    Uuid = '';
    platforms = [];
    private errors: string[];

    constructor() {
        if (!platforms) {
            HttpRequest.getJSON('api/userdevice/getplatforms')
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
        HttpRequest.postJSON('api/userdevice', data)
        .then((data) => { 
            listViewModel.devices.push(data);
            listViewModel.list();
        }, errors => this.errors = errors);
    }
}

export = UserDeviceViewModel;