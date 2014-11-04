define(["require", "exports", 'jquery', 'q', 'blockUI'], function(require, exports, $, Q, initBlockUI) {
    $.blockUI.defaults.overlayCSS.color = "#ccc";
    $.blockUI.defaults.overlayCSS.cursor = 'poiter';

    var Dialog = (function () {
        function Dialog(message) {
            var _this = this;
            this.addButton = function (text, click) {
                var button = $('<button class="btn btn-default">' + text + '</button> ').on('click', click);
                _this.dialogHtml.find('#dialog-buttons').append(button);
                return _this;
            };
            this.close = function () {
                _this.dialogHtml.remove();
                $.unblockUI();
            };
            this.dialogHtml = '<div id="dialog">' + ' <div id="dialog-message">' + message + '</div>' + ' <div id="dialog-buttons"></div>' + '</div>';
            this.dialogHtml = $(this.dialogHtml);
            $.blockUI({ message: this.dialogHtml, css: { width: '100%', border: 0, left: 0 } });
            initBlockUI;
        }
        Dialog.alert = function (message) {
            var defer = Q.defer();
            var dialog = new Dialog(message).addButton('Добре', defer.resolve);
            defer.promise.then(dialog.close);
            return defer.promise;
        };

        Dialog.confirm = function (message) {
            var defer = Q.defer();
            var dialog = new Dialog(message).addButton('Да', defer.resolve).addButton('Не', defer.reject);
            defer.promise.then(dialog.close, dialog.close);
            return defer.promise;
        };
        return Dialog;
    })();

    
    return Dialog;
});
//# sourceMappingURL=dialog.js.map
