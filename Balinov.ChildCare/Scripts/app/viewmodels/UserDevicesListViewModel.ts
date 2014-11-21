import $ = require('jquery');
import View = require('app/system/view');
import UserDeviceViewModel = require('app/viewmodels/UserDeviceViewModel');
import UserDeviceHistoryViewModel = require('app/viewmodels/UserDeviceHistoryViewModel');

class UserDevicesListViewModel {

    create = () => {
        View.render('UserDevice/Edit', $('.data-col'))
            .then(() => new UserDeviceViewModel());
    }

    history = (item) => {
        View.render('UserDevice/History', $('.data-col'))
            .then(() => new UserDeviceHistoryViewModel(item));
    }
}
export = UserDevicesListViewModel;