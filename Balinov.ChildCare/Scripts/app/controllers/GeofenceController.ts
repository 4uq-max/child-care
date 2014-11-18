'use strict';
import IScope = require('../app.d');
import BaseController = require('app/controllers/BaseController');
import Geofence = require('app/models/Geofence');
import GeofenceGroup = require('app/models/GeofenceGroup');
import DataService = require('app/services/DataService');
import Dialog = require('app/system/dialog');

class GeofenceController extends BaseController {
    private geofence: Geofence;
    private errors: Array<string>;
    private groups: Array<GeofenceGroup>;
    private drawingMode = false;
    private isEdit = false;

    constructor($scope: IScope<GeofenceController>,
        private $routeParams: ng.route.IRouteParamsService,
        private $location: ng.ILocationService,
        private dataService: DataService) {
        super($scope);

        var id = $routeParams['id'];
        if (id) {
            this.isEdit = true;
            var item = this.dataService.getGeofence(id);
            this.geofence = {
                Id: item.Id,
                Name: item.Name,
                BufferRadius: item.BufferRadius,
                GroupId: item.GroupId,
                Type: item.Type,
                Visible: item.Visible
            };
        } else {
            this.geofence = {
                Id: 0,
                Name: '',
                BufferRadius: '',
                GroupId: 0,
                Type: 'None',
                Visible: false
            };
        }

        this.dataService.getGeofenceGroups()
            .then((groups) => this.groups = groups);
    }

    submit() {
        //viewModel = $.extend({}, viewModel, { map: null, UserId: 0, oldType: null, typeScubsciption: null, groups: null });
        //var data = JSON.parse(ko.toJSON(viewModel));

        //var features = this.map.getLayer('drawing').getSource().getFeatures();
        //var clonedGeometries = [];
        //var transformFn = ol.proj.getTransform('EPSG:3857', 'EPSG:4326');
        //for (var i = 0; i < features.length; i++) {
        //    clonedGeometries.push(features[i].getGeometry().clone());
        //    clonedGeometries[i].transform(transformFn);
        //}
        //var geoJsonFormat = new ol.format.GeoJSON();
        //data.GeoJSON = geoJsonFormat.writeGeometry(new ol.geom.GeometryCollection(clonedGeometries));

        //var listViewModel = app.getViewModel('GeofencesList');

        //var promise;
        //if (!this.isEdit) {
        //    promise = this.$http.post(apiUri, data)
        //        .then((data) => {
        //            data.Visible = false;
        //            listViewModel.geofences.push(data);
        //        });
        //} else {
        //    promise = this.$http.put(apiUri + '/' + this.Id, data)
        //        .then((data) => {
        //            var geofences = listViewModel.geofences;
        //            var oldGeofence = ko.utils.arrayFirst<any>(geofences(), g => { return g.Id == data.Id; });
        //            data.Visible = ko.observable(oldGeofence.Visible());
        //            if (oldGeofence.Visible()) {
        //                var map = app.getMap();
        //                map.removeFeature(oldGeofence.Feature);
        //                data.Feature = map.addFeature(data.GeoJSONBuffered);
        //            }
        //            geofences.replace(oldGeofence, data);
        //        });
        //}
        //this.dataService.saveGeofence(this.geofence)
        //    .then(() => { this.$location.path('/Geofences'); },
        //    (errors) => { this.errors = errors; });
    }

    draw = () => {
        if (this.geofence.Type == "None") {
            Dialog.alert('Моля, първо изберете тип зона.');
            return false;
        }

        this.drawingMode = true;
        //this.map.activateDrawing(this.Type);
    }
}

export = GeofenceController; 