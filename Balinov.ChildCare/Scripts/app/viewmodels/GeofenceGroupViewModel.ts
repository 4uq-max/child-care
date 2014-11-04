import ko = require('knockout');
import HttpRequest = require('libs/httprequest');
import Utils = require('app/system/utils');

declare var app;
var apiUri = 'api/geofencegroup';

class GeofenceGroupViewModel {
    Id = ko.observable(0);
    Name = ko.observable('');
    IsUserItem = ko.observable(true);

    IsEdit = ko.computed(() => {
        return this.Id() > 0;
    });

    constructor(item?) {
        if (item) {
            this.Id(item.Id);
            this.Name(item.Name);
        }
    }

    submit = (viewModel, event: Event) => {
        var data = JSON.parse(ko.toJSON(viewModel));
        var listViewModel = app.getViewModel('GeofenceGroupsList');

        var promise;
        if (!this.IsEdit()) {
            promise = HttpRequest.postJSON(apiUri, data)
                .then((data) => { listViewModel.geofenceGroups.push(data); });
        } else {
            promise = HttpRequest.putJSON(apiUri + '/' + this.Id(), data)
                .then((data) => {
                    var groups = listViewModel.geofenceGroups;
                    var oldGroup = ko.utils.arrayFirst<any>(groups(), g => { return g.Id == data.Id; });
                    groups.replace(oldGroup, data);
                });
        }
        promise.then(() => { listViewModel.list(); }, (err) => {
            var form = $(event.currentTarget).parents('form');
            Utils.displayErrors(form, err.responseJSON);
        });
    }

    list = () => {
        app.getViewModel('GeofenceGroupsList').list();
    }
}

export = GeofenceGroupViewModel;