import IMap = require('app/maps/IMap');
import ol3 = require('ol3');
declare var ol;

class OpenLayersMap implements IMap {
    private map;
    private layers = {};

    constructor(id: string) {
        ol3;
        this.initLayers();

        this.map = new ol.Map({
            target: id,
            layers: this.getLayers(),
            view: this.getView()
        });
    }

    /*
    if (navigator.geolocation) {
        var showPosition = function (position) {
            var coords = position.coords;
            view.setZoom(15);
            view.setCenter(ol.proj.transform([coords.longitude, coords.latitude], 'EPSG:4326', 'EPSG:3857'));
        };
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    */

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

    private drawInteraction;
    activateDrawing = (type: string) => {
        if (type == "Circle") type = "Point"
        else if (type == "Strip") type = "LineString";
        else type = "Polygon";

        this.drawInteraction = new ol.interaction.Draw({
            source: this.getLayer('drawing').getSource(),
            type: type
        });
        this.map.addInteraction(this.drawInteraction);
    }

    deactivateDrawing = () => {
        if (!this.drawInteraction) return;
        this.map.removeInteraction(this.drawInteraction);
        this.getLayer('drawing').getSource().clear();
    }

    addFeature = (geoJSON, focus) => {
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

    teleport = (id) => {
        this.map.setTarget(id);
    }

}

export = OpenLayersMap;