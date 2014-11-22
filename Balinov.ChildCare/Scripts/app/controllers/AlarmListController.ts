'use strict';
import IScope = require('../app.d');
import BaseController = require('app/controllers/BaseController');
import Alarm = require('app/models/Alarm');
import DataService = require('app/services/DataService');

class AlarmListController extends BaseController {
    private alarms: Alarm[];

    constructor($scope: IScope<AlarmListController>,
        private dataService: DataService) {
        super($scope);

        this.dataService.getAlarms()
            .then(alarms => this.alarms = alarms);
    }

    remove(alarm: Alarm) {
        this.dataService.deleteAlarm(alarm.Id);
    }
}

export = AlarmListController; 