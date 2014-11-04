define(["require", "exports", 'jquery', 'knockout', 'libs/httprequest', 'app/system/dialog', 'app/system/view'], function(require, exports, $, ko, HttpRequest, Dialog, View) {
    var NotificationsListViewModel = (function () {
        function NotificationsListViewModel() {
            var _this = this;
            this.notifications = ko.observableArray([]);
            this.remove = function (item) {
                Dialog.confirm('Сигурни ли сте, че исате да изтриете избраият елемент?').then(function () {
                    HttpRequest.delete('api/notification/' + item.Id).then(function (data) {
                        if (data.Success) {
                            _this.notifications.remove(item);
                        } else {
                            Dialog.alert('Елементът не може да бъде изтрит, тъй като се използва.');
                        }
                    });
                });
            };
            this.list = function () {
                View.render('Notification/List', $('.data-col')).then(function () {
                    ko.applyBindings(_this, ko.cleanNode($('.data-col')[0]));
                });
            };
            var apiUrl = 'api/notification';
            HttpRequest.getJSON(apiUrl).then(function (data) {
                ko.utils.arrayPushAll(_this.notifications, data);
            });
        }
        return NotificationsListViewModel;
    })();

    
    return NotificationsListViewModel;
});
//# sourceMappingURL=NotificationsListViewModel.js.map
