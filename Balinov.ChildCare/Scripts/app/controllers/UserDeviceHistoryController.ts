'use strict';
module App.Controllers {
    export class UserDeviceHistoryController extends BaseController {
        private history: History;
        private errors: string[];
        private data: any;

        constructor($scope: IScope<UserDeviceHistoryController>,
            private $routeParams: ng.route.IRouteParamsService,
            private dataService: Services.DataService,
            private $compile: ng.ICompileService) {
            super($scope);

            this.history = {
                DeviceId: $routeParams['id'],
                Date: $.datepicker.formatDate('dd.mm.yy', new Date())
            };
        }

        submit() {
            var date = $.datepicker.parseDate("dd.mm.yy", $('#Date').val());
            if (!date) date = new Date(0);
            var timestamp = ~~(date.getTime() / 1000);

            this.dataService.getHistory(this.history.DeviceId, timestamp)
                .then(data => {
                    var scope: any = this.$scope;
                    scope.data = data;
                    var dialog = this.$compile('<div id="player-container" location-player></div>')(scope);
                    scope.dialog = dialog;
                    $('body').append(dialog);
                },
                errors => this.errors = errors);
        }
    }
} 