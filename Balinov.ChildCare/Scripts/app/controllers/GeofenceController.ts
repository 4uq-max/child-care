'use strict';
module App.Controllers {
    declare var ol;

    export class GeofenceController extends BaseController {
        private geofence: Geofence;
        private errors: string[];
        private groups: GeofenceGroup[];
        private drawingMode = false;
        private isEdit = false;
        private oldType;

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
            var features = this.mapService.getLayer('drawing').getSource().getFeatures();
            var clonedGeometries = [];
            var transformFn = ol.proj.getTransform('EPSG:3857', 'EPSG:4326');
            for (var i = 0; i < features.length; i++) {
                clonedGeometries.push(features[i].getGeometry().clone());
                clonedGeometries[i].transform(transformFn);
            }
            var geoJsonFormat = new ol.format.GeoJSON();
            this.geofence.GeoJSON = geoJsonFormat.writeGeometry(new ol.geom.GeometryCollection(clonedGeometries));

            this.dataService.saveGeofence(this.geofence)
                .then(() => this.list(),
                errors => this.errors = errors);
        }

        draw = () => {
            if (this.geofence.Type == "None") {
                this.messageService.alert('Моля, първо изберете тип зона.');
                return false;
            }

            this.drawingMode = true;
            this.mapService.activateDrawing(this.geofence.Type);
        }

        onFocus() {
            this.oldType = this.geofence.Type;
        }
        
        onChange() {
            if (!this.drawingMode) {
                return;
            }

            this.messageService.confirm(
                'Сигурни ли сте, че искате да промените типа на зоната? ' +
                'Изчертаните до сега обекти върху картата ще бъдат изтрити.')
                .then(() => {
                    this.mapService.deactivateDrawing();
                    this.draw();
                }, () => {
                    this.geofence.Type = this.oldType;
                });
        }

        list() {
            this.mapService.deactivateDrawing();
            this.$location.path('/Geofences');;
        }
    }
}