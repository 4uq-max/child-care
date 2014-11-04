import $ = require('jquery');
import ko = require('knockout');
import HttpRequest = require('libs/httprequest');
import Dialog = require('app/system/dialog');
import View = require('app/system/view');
import UserDeviceViewModel = require('app/viewmodels/UserDeviceViewModel');
import UserDeviceHistoryViewModel = require('app/viewmodels/UserDeviceHistoryViewModel');

class UserDevicesListViewModel {
    private devices = ko.observableArray(null);

    constructor() {
        var apiUrl = 'api/userdevice';
        HttpRequest.getJSON(apiUrl)
            .then((data) => {
                ko.utils.arrayPushAll(this.devices, data);
            });
    }
    create = () => {
        View.render('UserDevice/Edit', $('.data-col'))
            .then(() => {
                var viewModel = new UserDeviceViewModel();
                ko.applyBindings(viewModel, ko.cleanNode($('.data-col')[0]));
            });
    }
    history = (item) => {
        View.render('UserDevice/History', $('.data-col'))
            .then(() => {
                var viewModel = new UserDeviceHistoryViewModel(item);
                ko.applyBindings(viewModel, ko.cleanNode($('.data-col')[0]));
            });
    }
    remove = (item) => {
        Dialog.confirm('Сигурни ли сте, че исате да изтриете избраият елемент?')
            .then(() => {
                HttpRequest.delete('api/userdevice/?deviceId=' + item.DeviceId)
                    .then((data) => {
                        if (data.Success) {
                            this.devices.remove(item);
                        } else {
                            Dialog.alert('Елементът не може да бъде изтрит, тъй като се използва.');
                        }
                    });
            });
    }

    list = () => {
        View.render('UserDevice/List', $('.data-col'))
            .then(() => {
                ko.applyBindings(this, ko.cleanNode($('.data-col')[0]));
            });
    }
}
export = UserDevicesListViewModel;