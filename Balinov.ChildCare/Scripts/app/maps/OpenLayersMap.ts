import IMap = require('app/maps/IMap');

class OpenLayersMap /*implements IMap*/ {

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

    //private drawInteraction;
    //activateDrawing = (type: string) => {
    //    if (type == "Circle") type = "Point"
    //    else if (type == "Strip") type = "LineString";
    //    else type = "Polygon";

    //    this.drawInteraction = new ol.interaction.Draw({
    //        source: this.getLayer('drawing').getSource(),
    //        type: type
    //    });
    //    this.map.addInteraction(this.drawInteraction);
    //}

    //deactivateDrawing = () => {
    //    if (!this.drawInteraction) return;
    //    this.map.removeInteraction(this.drawInteraction);
    //    this.getLayer('drawing').getSource().clear();
    //}

    //teleport = (id) => {
    //    this.map.setTarget(id);
    //}
}

export = OpenLayersMap;