import ko = require('knockout');
import HttpRequest = require('libs/httprequest');
import Dialog = require('app/system/dialog');
//import GeofenceGroupsListViewModel = require('app/viewmodels/GeofenceGroupsListViewModel');

declare var app;
var apiUri = 'api/geofence';

class GeofenceViewModel {
    
    private map = app.getMap();
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
                this.map.deactivateDrawing();
                this.draw();
            }, () => {
                this.typeScubsciption.dispose();
                this.Type(this.oldType);
                this.typeScubsciption = this.Type.subscribe(this.onChange);
            });
    };

    list = () => {
        app.getMap().deactivateDrawing();
        app.getViewModel('GeofencesList').list();
    }
    */
}

export = GeofenceViewModel;