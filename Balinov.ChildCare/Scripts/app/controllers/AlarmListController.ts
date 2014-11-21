'use strict';
import IScope = require('../app.d');
import BaseController = require('app/controllers/BaseController');
import Dialog = require('app/system/dialog');
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
        Dialog.confirm('Сигурни ли сте, че исате да изтриете избраият елемент?')
            .then(() => this.dataService.deleteAlarm(alarm.Id));
    }
}

export = AlarmListController; 