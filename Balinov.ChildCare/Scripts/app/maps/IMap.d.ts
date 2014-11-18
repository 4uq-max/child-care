interface IMap {
    activateDrawing(type: string);
    deactivateDrawing();
    addFeature(geoJSON, focus);
    removeFeature(feature);
    teleport(id);
}

export = IMap;