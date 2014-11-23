'use strict';
module App.Controllers {
    export class GpsPlayerController extends BaseController {
        public player: GpsPlayer;

        constructor($scope: IScope<GpsPlayerController>,
            //private $location: ng.ILocationService,
            //private $timeout: ng.ITimeoutService,
            //private dataService: Services.DataService,
            private gpsPlayerService: Services.GpsPlayerService) {
            super($scope);
            

        }
    }
} 