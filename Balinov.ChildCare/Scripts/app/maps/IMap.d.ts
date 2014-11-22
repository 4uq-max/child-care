interface IMap {
    activateDrawing(type: string);
    deactivateDrawing();
    teleport(id);
}

export = IMap;