'use strict';
module App.Controllers {
    export class NotificationListController extends BaseController {
        public notifications: Array<Notification>;

        constructor($scope: IScope<NotificationListController>,
            private dataService: Services.DataService) {
            super($scope);

            this.dataService.getNotifications()
                .then((notifications) => { this.notifications = notifications; });
        }

        public remove(item: Notification) {
            this.dataService.deleteNotification(item.Id);
        }
    }
}