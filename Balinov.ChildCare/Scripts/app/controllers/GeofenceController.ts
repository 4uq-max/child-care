'use strict';
module App.Controllers {
    declare var ol;

    export class GeofenceController extends BaseController {
        private geofence: Geofence;
        private errors: string[];
        private groups: GeofenceGroup[];
        private drawingMode = false;
        private isEdit = false;

        constructor($scope: IScope<GeofenceController>,
            private $routeParams: ng.route.IRouteParamsService,
            private $location: ng.ILocationService,
            private dataService: Services.DataService,
            private messageService: Services.MessageService,
            private mapService: Services.MapService) {
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
            //viewModel = extend(viewModel, { UserId: 0 });
            //var data = JSON.parse(ko.toJSON(viewModel));

            var features = this.mapService.getLayer('drawing').getSource().getFeatures();
            var clonedGeometries = [];
            var transformFn = ol.proj.getTransform('EPSG:3857', 'EPSG:4326');
            for (var i = 0; i < features.length; i++) {
                clonedGeometries.push(features[i].getGeometry().clone());
                clonedGeometries[i].transform(transformFn);
            }
            var geoJsonFormat = new ol.format.GeoJSON();
            this.geofence.GeoJSON = geoJsonFormat.writeGeometry(new ol.geom.GeometryCollection(clonedGeometries));

            //var listViewModel = app.getViewModel('GeofencesList');

            //var promise;
            // var apiUri = 'api/geofence';
            if (!this.isEdit) {
            //    promise = this.$http.post(apiUri, data)
            //        .then((data) => {
            //            data.Visible = false;
            //            listViewModel.geofences.push(data);
            //        });
            } else {
            //    promise = this.$http.put(apiUri + '/' + this.Id, data)
            //        .then((data) => {
            //            var geofences = listViewModel.geofences;
            //            var oldGeofence = ko.utils.arrayFirst<any>(geofences(), g => { return g.Id == data.Id; });
            //            data.Visible = ko.observable(oldGeofence.Visible());
            //            if (oldGeofence.Visible) {
            //                this.mapService.removeFeature(oldGeofence.Feature);
            //                data.Feature = this.mapService.addFeature(data.GeoJSONBuffered);
            //            }
            //            geofences.replace(oldGeofence, data);
            //        });
            }
            //this.dataService.saveGeofence(this.geofence)
            //    .then(() => { this.$location.path('/Geofences'); },
            //    (errors) => { this.errors = errors; });
        }

        draw = () => {
            if (this.geofence.Type == "None") {
                this.messageService.alert('Моля, първо изберете тип зона.');
                return false;
            }

            this.drawingMode = true;
            this.mapService.activateDrawing(this.geofence.Type);
        }

        private oldType;
        private typeScubsciption;
        /*
        constructor(item?) {
            this.Type.subscribe((oldType) => { this.oldType = oldType; }, null, 'beforeChange');
            this.typeScubsciption = this.Type.subscribe(this.onChange);
        }

        onChange = (newType) => {
            if (!this.drawingMode || this.oldType == newType) return;

            Dialog.confirm('Сигурни ли сте, че искате да промените типа на зоната? ' +
                'Изчертаните до сега обекти върху картата ще бъдат изтрити.')
                .then(() => {
                    this.mapService.deactivateDrawing();
                    this.draw();
                }, () => {
                    this.typeScubsciption.dispose();
                    this.Type(this.oldType);
                    this.typeScubsciption = this.Type.subscribe(this.onChange);
                });
        };

        list = () => {
            this.mapService.deactivateDrawing();
            $location.path('/Geofences');;
        }
        */
    }
}