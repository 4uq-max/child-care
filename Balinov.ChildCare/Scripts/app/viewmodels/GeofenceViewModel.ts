import ko = require('knockout');
import HttpRequest = require('libs/httprequest');
import Utils = require('app/system/utils');
import Dialog = require('app/system/dialog');
//import GeofenceGroupsListViewModel = require('app/viewmodels/GeofenceGroupsListViewModel');

declare var app;
var apiUri = 'api/geofence';

class GeofenceViewModel {
    private drawingMode = false;
    private map = app.getMap();
    private oldType;
    private typeScubsciption;

    Id = ko.observable(0);
    Name = ko.observable('');
    BufferRadius = ko.observable('');
    GroupId = ko.observable(0);
    Type = ko.observable('None');
    Visible = ko.observable(false);
    groups;

    IsEdit = ko.computed(() => {
        return this.Id() > 0;
    });

    constructor(item?) {
        if (item) {
            this.Id(item.Id);
            this.Name(item.Name);
            this.BufferRadius(item.BufferRadius);
            this.GroupId(item.GroupId);
            this.Type(item.Type);
        }

        var groupsViewModel = app.getViewModel('GeofenceGroupsList');
        //if (!groupsViewModel) groupsViewModel = new GeofenceGroupsListViewModel();
        //this.groups = groupsViewModel.geofenceGroups;

        this.Type.subscribe((oldType) => { this.oldType = oldType; }, null, 'beforeChange');
        this.typeScubsciption = this.Type.subscribe(this.onChange);
    }

    onChange = (newType) => {
        if (!this.drawingMode || this.oldType == newType) return;

        Dialog.confirm('Сигурни ли сте, че искате да промените типа на зоната? ' +
            'Изчертаните до сега обекти върху картата ще бъдат изтрити.')
            .then(() => {
                this.map.deactivateDrawing();
                this.draw();
            }, () => {
                this.typeScubsciption.dispose();
                this.Type(this.oldType);
                this.typeScubsciption = this.Type.subscribe(this.onChange);
            });
    };


    submit = (viewModel, event: Event) => {
        viewModel = $.extend({}, viewModel, { map: null, UserId: 0, oldType: null, typeScubsciption: null, groups: null });
        var data = JSON.parse(ko.toJSON(viewModel));
        
        var features = this.map.getLayer('drawing').getSource().getFeatures();
        var clonedGeometries = [];
        var transformFn = ol.proj.getTransform('EPSG:3857', 'EPSG:4326');
        for (var i = 0; i < features.length; i++) {
            clonedGeometries.push(features[i].getGeometry().clone());
            clonedGeometries[i].transform(transformFn);
        }
        var geoJsonFormat = new ol.format.GeoJSON();
        data.GeoJSON = geoJsonFormat.writeGeometry(new ol.geom.GeometryCollection(clonedGeometries));

        var listViewModel = app.getViewModel('GeofencesList');

        var promise;
        if (!this.IsEdit()) {
            promise = HttpRequest.postJSON(apiUri, data)
                .then((data) => {
                    data.Visible = ko.observable(false);
                    listViewModel.geofences.push(data);
                });
        } else {
            promise = HttpRequest.putJSON(apiUri + '/' + this.Id(), data)
                .then((data) => {
                    var geofences = listViewModel.geofences;
                    var oldGeofence = ko.utils.arrayFirst<any>(geofences(), g => { return g.Id == data.Id; });
                    data.Visible = ko.observable(oldGeofence.Visible());
                    if (oldGeofence.Visible()) {
                        var map = app.getMap();
                        map.removeFeature(oldGeofence.Feature);
                        data.Feature = map.addFeature(data.GeoJSONBuffered);
                    }
                    geofences.replace(oldGeofence, data);
                });
        }
        promise.then(() => { listViewModel.list(); }, (err) => {
            var form = $(event.currentTarget).parents('form');
            Utils.displayErrors(form, err.responseJSON);
        });
    }

    list = () => {
        app.getMap().deactivateDrawing();
        app.getViewModel('GeofencesList').list();
    }

    draw = () => {
        if (this.Type() == "None") {
            Dialog.alert('Моля, първо изберете тип зона.');
            return false;
        }

        this.drawingMode = true;
        this.map.activateDrawing(this.Type());
    }
}

export = GeofenceViewModel;