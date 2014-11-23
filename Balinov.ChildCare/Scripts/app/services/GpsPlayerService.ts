module App.Services {
    export class GpsPlayerService {
        private data;
        private dialog;

        constructor(private mapService: Services.MapService) {
        }

        show(data) {
            this.data = data;

            $.blockUI.defaults.overlayCSS.color = "#ccc";
            $.blockUI.defaults.overlayCSS.cursor = 'pointer';
            $.blockUI({ message: '' });
            //this.dialog = $('<div id="player-container" ng-include></div>');
            $('body').append(this.dialog);

           //this.dialog.attr('src', "'./Scripts/app/views/UserDevice/Player.html'");
        }
    }
}