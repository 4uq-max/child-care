define(["require", "exports", 'jquery', 'JqueryUI', 'knockout', 'libs/httprequest', 'app/system/utils', 'app/viewmodels/LocationPlayerViewModel'], function(require, exports, $, initJqueryUI, ko, HttpRequest, Utils, LocationPlayerViewModel) {
    var apiUri = 'api/userdevice';

    var UserDeviceHistoryViewModel = (function () {
        function UserDeviceHistoryViewModel(item) {
            this.DeviceId = ko.observable(0);
            this.submit = function (viewModel, event) {
                var data = JSON.parse(ko.toJSON(viewModel));
                var listViewModel = app.getViewModel('GeofenceGroupsList');

                var date = $.datepicker.parseDate("dd.mm.yy", $('#Date').val());
                if (!date)
                    date = new Date(0);
                var timestamp = ~~(date.getTime() / 1000);
                var url = apiUri + '/' + data.DeviceId + '?timestamp=' + timestamp;
                var promise = HttpRequest.getJSON(url).then(function (data) {
                    var player = new LocationPlayerViewModel(data);
                    player.show();
                }, function (err) {
                    var form = $(event.currentTarget).parents('form');
                    Utils.displayErrors(form, err.responseJSON);
                });
            };
            this.list = function () {
                app.getViewModel('UserDevicesList').list();
            };
            this.DeviceId(item.DeviceId);
            initJqueryUI;
            $('#Date').val($.datepicker.formatDate('dd.mm.yy', new Date()));
        }
        return UserDeviceHistoryViewModel;
    })();

    
    return UserDeviceHistoryViewModel;
});
//# sourceMappingURL=UserDeviceHistoryViewModel.js.map
