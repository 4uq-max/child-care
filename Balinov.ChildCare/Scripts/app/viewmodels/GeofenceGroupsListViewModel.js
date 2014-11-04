define(["require", "exports", 'jquery', 'knockout', 'libs/httprequest', 'app/system/dialog', 'app/system/view', 'app/viewmodels/GeofenceGroupViewModel'], function(require, exports, $, ko, HttpRequest, Dialog, View, GeofenceGroupViewModel) {
    var GeofenceGroupsListViewModel = (function () {
        function GeofenceGroupsListViewModel() {
            var _this = this;
            this.geofenceGroups = ko.observableArray(null);
            this.create = function () {
                _this.createEdit();
            };
            this.edit = function (item) {
                _this.createEdit(item);
            };
            this.createEdit = function (item) {
                View.render('GeofenceGroup/Edit', $('.data-col')).then(function () {
                    var viewModel = new GeofenceGroupViewModel(item);
                    ko.applyBindings(viewModel, ko.cleanNode($('.data-col')[0]));
                });
            };
            this.remove = function (item) {
                Dialog.confirm('Сигурни ли сте, че исате да изтриете избраият елемент?').then(function () {
                    HttpRequest.delete('api/geofencegroup/' + item.Id).then(function (data) {
                        if (data.Success) {
                            _this.geofenceGroups.remove(item);
                        } else {
                            Dialog.alert('Елементът не може да бъде изтрит, тъй като се използва.');
                        }
                    });
                });
            };
            this.list = function () {
                View.render('GeofenceGroup/List', $('.data-col')).then(function () {
                    ko.applyBindings(_this, ko.cleanNode($('.data-col')[0]));
                });
            };
            var apiUrl = 'api/geofencegroup';
            HttpRequest.getJSON(apiUrl).then(function (data) {
                ko.utils.arrayPushAll(_this.geofenceGroups, data);
            });
        }
        return GeofenceGroupsListViewModel;
    })();
    
    return GeofenceGroupsListViewModel;
});
//# sourceMappingURL=GeofenceGroupsListViewModel.js.map
