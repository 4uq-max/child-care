import IScope = require('../app.d');
import BaseController = require('app/controllers/BaseController');
import Notification = require('app/models/Notification');
import DataService = require('app/services/DataService');

class NotificationListController extends BaseController {
    public notifications: Array<Notification>;

    constructor($scope: IScope<NotificationListController>,
        private dataService: DataService) {
        super($scope);

        this.dataService.getNotifications()
            .then((notifications) => { this.notifications = notifications; });
    }

    public remove(item: Notification) {
        this.dataService.deleteNotification(item.Id);
    }
}

export = NotificationListController;