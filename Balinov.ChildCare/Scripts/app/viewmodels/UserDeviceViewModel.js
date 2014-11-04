define(["require", "exports", 'knockout', 'libs/httprequest', 'app/system/utils'], function(require, exports, ko, HttpRequest, Utils) {
    var apiUri = 'api/userdevice';
    var platforms;

    var UserDeviceViewModel = (function () {
        function UserDeviceViewModel() {
            var _this = this;
            this.Name = ko.observable('');
            this.Platform = ko.observable('');
            this.Uuid = ko.observable('');
            this.platforms = ko.observableArray();
            this.submit = function (viewModel, event) {
                var data = JSON.parse(ko.toJSON(viewModel));
                delete data.platforms;
                var listViewModel = app.getViewModel('UserDevicesList');
                HttpRequest.postJSON(apiUri, data).then(function (data) {
                    listViewModel.devices.push(data);
                    listViewModel.list();
                }, function (err) {
                    var form = $(event.currentTarget).parents('form');
                    Utils.displayErrors(form, err.responseJSON);
                });
            };
            this.list = function () {
                app.getViewModel('UserDevicesList').list();
            };
            if (!platforms) {
                HttpRequest.getJSON(apiUri + '/getplatforms').then(function (data) {
                    platforms = data;
                    ko.utils.arrayPushAll(_this.platforms, data);
                });
            } else {
                ko.utils.arrayPushAll(this.platforms, platforms);
            }
        }
        return UserDeviceViewModel;
    })();

    
    return UserDeviceViewModel;
});
//# sourceMappingURL=UserDeviceViewModel.js.map
