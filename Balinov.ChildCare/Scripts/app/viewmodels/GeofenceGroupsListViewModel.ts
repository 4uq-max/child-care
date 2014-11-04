import $ = require('jquery');
import ko = require('knockout');
import HttpRequest = require('libs/httprequest');
import Dialog = require('app/system/dialog');
import View = require('app/system/view');
import GeofenceGroupViewModel = require('app/viewmodels/GeofenceGroupViewModel');

class GeofenceGroupsListViewModel {
    private geofenceGroups = ko.observableArray(null);

    constructor() {
        var apiUrl = 'api/geofencegroup';
        HttpRequest.getJSON(apiUrl)
        .then((data) => {
            ko.utils.arrayPushAll(this.geofenceGroups, data);
        });
    }
    create = () => {
        this.createEdit();
    }

    edit = (item) => {
        this.createEdit(item);
    }

    private createEdit = (item?) => {
        View.render('GeofenceGroup/Edit', $('.data-col'))
        .then(() => {
            var viewModel = new GeofenceGroupViewModel(item);
            ko.applyBindings(viewModel, ko.cleanNode($('.data-col')[0]));
        });
    }

    remove = (item) => { 
        Dialog.confirm('Сигурни ли сте, че исате да изтриете избраият елемент?')
        .then(() => {
            HttpRequest.delete('api/geofencegroup/' + item.Id)
            .then((data) => {
                if (data.Success) {
                    this.geofenceGroups.remove(item);
                } else {
                    Dialog.alert('Елементът не може да бъде изтрит, тъй като се използва.');
                }
            });
        });
    }

    list = () => {
        View.render('GeofenceGroup/List', $('.data-col'))
        .then(() => {
            ko.applyBindings(this, ko.cleanNode($('.data-col')[0]));
        });
    }
}
export = GeofenceGroupsListViewModel;