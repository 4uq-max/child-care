import $ = require('jquery');
import ko = require('knockout');
import HttpRequest = require('libs/httprequest');
import Dialog = require('app/system/dialog');
import View = require('app/system/view');
import GeofenceViewModel = require('app/viewmodels/GeofenceViewModel');

declare var app;
class GeofencesListViewModel {
    private geofences = ko.observableArray([]);

    constructor() {
        var apiUrl = 'api/geofence';
        HttpRequest.getJSON(apiUrl)
        .then((data) => {
            for (var i = 0; i < data.length; i++) {
                var geofence = data[i];
                geofence.Visible = ko.observable(false);
                this.geofences.push(geofence);
            }
        });
    }

    create = () => {
        this.createEdit();
    }

    edit = (item) => {
        this.createEdit(item);
    }

    private createEdit = (item?) => {
        View.render('Geofence/Edit', $('.data-col'))
        .then(() => {
            var viewModel = new GeofenceViewModel(item);
            ko.applyBindings(viewModel, ko.cleanNode($('.data-col')[0]));
        });
    }

    remove = (item) => {
        Dialog.confirm('Сигурни ли сте, че исате да изтриете избраият елемент?')
        .then(() => {
            HttpRequest.delete('api/geofence/' + item.Id)
                .then((data) => {
                    if (data.Success) {
                        if (item.Feature) {
                            app.getMap().removeFeature(item.Feature);
                        }
                        this.geofences.remove(item);
                    } else {
                        Dialog.alert('Елементът не може да бъде изтрит, тъй като се използва.');
                    }
                });
        });
    }

    toggle = (item) => {
        var map = app.getMap();
        if (!item.Visible()) {
            item.Feature = map.addFeature(item.GeoJSONBuffered);
            item.Visible(true);
        } else {
            map.removeFeature(item.Feature);
            delete item.Feature;
            item.Visible(false);
        }
    }

    list = () => {
        View.render('Geofence/List', $('.data-col'))
        .then(() => {
            ko.applyBindings(this, ko.cleanNode($('.data-col')[0]));
        });
    }
}

export = GeofencesListViewModel;