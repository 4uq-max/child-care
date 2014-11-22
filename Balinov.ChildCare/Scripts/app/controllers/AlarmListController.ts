'use strict';
module App.Controllers {
    export class AlarmListController extends BaseController {
        private alarms: Alarm[];

        constructor($scope: IScope<AlarmListController>,
            private dataService: Services.DataService) {
            super($scope);

            this.dataService.getAlarms()
                .then(alarms => this.alarms = alarms);
        }

        remove(alarm: Alarm) {
            this.dataService.deleteAlarm(alarm.Id);
        }
    }
}
