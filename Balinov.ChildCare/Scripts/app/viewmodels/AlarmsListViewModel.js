define(["require", "exports", 'jquery', 'knockout', 'libs/httprequest', 'app/system/dialog', 'app/system/view', 'app/viewmodels/AlarmViewModel'], function(require, exports, $, ko, HttpRequest, Dialog, View, AlarmViewModel) {
    var AlarmsListViewModel = (function () {
        function AlarmsListViewModel() {
            var _this = this;
            this.alarms = ko.observableArray(null);
            this.create = function () {
                _this.createEdit();
            };
            this.edit = function (item) {
                _this.createEdit(item);
            };
            this.createEdit = function (item) {
                View.render('Alarm/Edit', $('.data-col')).then(function () {
                    var viewModel = new AlarmViewModel(item);
                    ko.applyBindings(viewModel, ko.cleanNode($('.data-col')[0]));
                });
            };
            this.remove = function (item) {
                Dialog.confirm('Сигурни ли сте, че исате да изтриете избраият елемент?').then(function () {
                    HttpRequest.delete('api/alarm/' + item.Id).then(function (data) {
                        if (data.Success) {
                            _this.alarms.remove(item);
                        } else {
                            Dialog.alert('Елементът не може да бъде изтрит, тъй като се използва.');
                        }
                    });
                });
            };
            this.list = function () {
                View.render('Alarm/List', $('.data-col')).then(function () {
                    ko.applyBindings(_this, ko.cleanNode($('.data-col')[0]));
                });
            };
            var apiUrl = 'api/alarm';
            HttpRequest.getJSON(apiUrl).then(function (data) {
                ko.utils.arrayPushAll(_this.alarms, data);
            });
        }
        return AlarmsListViewModel;
    })();
    
    return AlarmsListViewModel;
});
//# sourceMappingURL=AlarmsListViewModel.js.map
