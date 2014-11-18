var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'app/controllers/BaseController', 'app/system/dialog'], function(require, exports, BaseController, Dialog) {
    var NotificationListController = (function (_super) {
        __extends(NotificationListController, _super);
        function NotificationListController($scope, dataService) {
            var _this = this;
            _super.call(this, $scope);
            this.dataService = dataService;

            this.dataService.getNotifications().then(function (notifications) {
                _this.notifications = notifications;
            });
        }
        NotificationListController.prototype.remove = function (item) {
            var _this = this;
            Dialog.confirm('Сигурни ли сте, че исате да изтриете избраият елемент?').then(function () {
                return _this.dataService.deleteNotification(item.Id);
            });
        };
        return NotificationListController;
    })(BaseController);

    
    return NotificationListController;
});
//# sourceMappingURL=NotificationListController.js.map
