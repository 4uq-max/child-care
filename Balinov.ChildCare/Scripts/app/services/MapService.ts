﻿module App.Services {
    declare var ol;

    export class MapService {
        private map;
        private layers = {};

        constructor() {
            this.initLayers();
        }

        init(id: string) {
            this.map = new ol.Map({
                target: id,
                layers: this.getLayers(),
                view: this.getView()
            });
        }

        addFeature = (geoJSON, focus?) => {
            if (typeof focus == 'undefined') focus = true;
            var geoJsonFormat = new ol.format.GeoJSON();
            var geometry = geoJsonFormat.readGeometry(geoJSON);
            var transformFn = ol.proj.getTransform('EPSG:4326', 'EPSG:3857');
            geometry.transform(transformFn);
            var feature = new ol.Feature(geometry);
            var source = this.layers['vector'].getSource();
            source.addFeature(feature);
            if (focus) {
                var extent = geometry.getExtent();
                this.map.getView().fitExtent(extent, this.map.getSize());
            }
            return feature;
        }

        removeFeature = (feature) => {
            var source = this.layers['vector'].getSource();
            source.removeFeature(feature);
        }

        private initLayers() {
            this.layers['osm'] = new ol.layer.Tile({
                source: new ol.source.OSM()
            });

            this.layers['drawing'] = new ol.layer.Vector({
                source: new ol.source.GeoJSON(),
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#ffcc33'
                        })
                    })
                })
            });

            this.layers['vector'] = new ol.layer.Vector({
                source: new ol.source.GeoJSON(),
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'red',
                        width: 2
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 0, 0, 0.1)'
                    }),
                    image: new ol.style.Icon({
                        src: 'Content/Images/marker.png'
                    })
                })
            });
        }

        private getLayers = () => {
            var result = [];
            for (var i in this.layers) {
                result.push(this.layers[i]);
            }
            return result;
        }

        private getView() {
            return new ol.View2D({
                center: ol.proj.transform([25.1, 42.8], 'EPSG:4326', 'EPSG:3857'),
                minZoom: 5,
                zoom: 6
            });
        }

        private getLayer = (name: string) => {
            return this.layers[name];
        }
    }
}