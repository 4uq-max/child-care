define(["require", "exports", 'knockout', 'libs/httprequest', 'app/system/utils', 'app/system/dialog'], function(require, exports, ko, HttpRequest, Utils, Dialog) {
    
    var apiUri = 'api/geofence';

    var GeofenceViewModel = (function () {
        function GeofenceViewModel(item) {
            var _this = this;
            this.drawingMode = false;
            this.map = app.getMap();
            this.Id = ko.observable(0);
            this.Name = ko.observable('');
            this.BufferRadius = ko.observable('');
            this.GroupId = ko.observable(0);
            this.Type = ko.observable('None');
            this.Visible = ko.observable(false);
            this.IsEdit = ko.computed(function () {
                return _this.Id() > 0;
            });
            this.onChange = function (newType) {
                if (!_this.drawingMode || _this.oldType == newType)
                    return;

                Dialog.confirm('Сигурни ли сте, че искате да промените типа на зоната? ' + 'Изчертаните до сега обекти върху картата ще бъдат изтрити.').then(function () {
                    _this.map.deactivateDrawing();
                    _this.draw();
                }, function () {
                    _this.typeScubsciption.dispose();
                    _this.Type(_this.oldType);
                    _this.typeScubsciption = _this.Type.subscribe(_this.onChange);
                });
            };
            this.submit = function (viewModel, event) {
                viewModel = $.extend({}, viewModel, { map: null, UserId: 0, oldType: null, typeScubsciption: null, groups: null });
                var data = JSON.parse(ko.toJSON(viewModel));

                var features = _this.map.getLayer('drawing').getSource().getFeatures();
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
                if (!_this.IsEdit()) {
                    promise = HttpRequest.postJSON(apiUri, data).then(function (data) {
                        data.Visible = ko.observable(false);
                        listViewModel.geofences.push(data);
                    });
                } else {
                    promise = HttpRequest.putJSON(apiUri + '/' + _this.Id(), data).then(function (data) {
                        var geofences = listViewModel.geofences;
                        var oldGeofence = ko.utils.arrayFirst(geofences(), function (g) {
                            return g.Id == data.Id;
                        });
                        data.Visible = ko.observable(oldGeofence.Visible());
                        if (oldGeofence.Visible()) {
                            var map = app.getMap();
                            map.removeFeature(oldGeofence.Feature);
                            data.Feature = map.addFeature(data.GeoJSONBuffered);
                        }
                        geofences.replace(oldGeofence, data);
                    });
                }
                promise.then(function () {
                    listViewModel.list();
                }, function (err) {
                    var form = $(event.currentTarget).parents('form');
                    Utils.displayErrors(form, err.responseJSON);
                });
            };
            this.list = function () {
                app.getMap().deactivateDrawing();
                app.getViewModel('GeofencesList').list();
            };
            this.draw = function () {
                if (_this.Type() == "None") {
                    Dialog.alert('Моля, първо изберете тип зона.');
                    return false;
                }

                _this.drawingMode = true;
                _this.map.activateDrawing(_this.Type());
            };
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
            this.Type.subscribe(function (oldType) {
                _this.oldType = oldType;
            }, null, 'beforeChange');
            this.typeScubsciption = this.Type.subscribe(this.onChange);
        }
        return GeofenceViewModel;
    })();

    
    return GeofenceViewModel;
});
//# sourceMappingURL=GeofenceViewModel.js.map
