define(["require", "exports", 'jquery', 'knockout', 'libs/httprequest', 'app/system/dialog', 'app/system/view', 'app/viewmodels/UserDeviceViewModel', 'app/viewmodels/UserDeviceHistoryViewModel'], function(require, exports, $, ko, HttpRequest, Dialog, View, UserDeviceViewModel, UserDeviceHistoryViewModel) {
    var UserDevicesListViewModel = (function () {
        function UserDevicesListViewModel() {
            var _this = this;
            this.devices = ko.observableArray(null);
            this.create = function () {
                View.render('UserDevice/Edit', $('.data-col')).then(function () {
                    var viewModel = new UserDeviceViewModel();
                    ko.applyBindings(viewModel, ko.cleanNode($('.data-col')[0]));
                });
            };
            this.history = function (item) {
                View.render('UserDevice/History', $('.data-col')).then(function () {
                    var viewModel = new UserDeviceHistoryViewModel(item);
                    ko.applyBindings(viewModel, ko.cleanNode($('.data-col')[0]));
                });
            };
            this.remove = function (item) {
                Dialog.confirm('Сигурни ли сте, че исате да изтриете избраият елемент?').then(function () {
                    HttpRequest.delete('api/userdevice/?deviceId=' + item.DeviceId).then(function (data) {
                        if (data.Success) {
                            _this.devices.remove(item);
                        } else {
                            Dialog.alert('Елементът не може да бъде изтрит, тъй като се използва.');
                        }
                    });
                });
            };
            this.list = function () {
                View.render('UserDevice/List', $('.data-col')).then(function () {
                    ko.applyBindings(_this, ko.cleanNode($('.data-col')[0]));
                });
            };
            var apiUrl = 'api/userdevice';
            HttpRequest.getJSON(apiUrl).then(function (data) {
                ko.utils.arrayPushAll(_this.devices, data);
            });
        }
        return UserDevicesListViewModel;
    })();
    
    return UserDevicesListViewModel;
});
//# sourceMappingURL=UserDevicesListViewModel.js.map
