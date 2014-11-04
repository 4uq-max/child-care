define(["require", "exports", 'jquery', 'knockout', 'libs/httprequest', 'app/system/dialog', 'app/system/view', 'app/viewmodels/GeofenceViewModel'], function(require, exports, $, ko, HttpRequest, Dialog, View, GeofenceViewModel) {
    var GeofencesListViewModel = (function () {
        function GeofencesListViewModel() {
            var _this = this;
            this.geofences = ko.observableArray([]);
            this.create = function () {
                _this.createEdit();
            };
            this.edit = function (item) {
                _this.createEdit(item);
            };
            this.createEdit = function (item) {
                View.render('Geofence/Edit', $('.data-col')).then(function () {
                    var viewModel = new GeofenceViewModel(item);
                    ko.applyBindings(viewModel, ko.cleanNode($('.data-col')[0]));
                });
            };
            this.remove = function (item) {
                Dialog.confirm('Сигурни ли сте, че исате да изтриете избраият елемент?').then(function () {
                    HttpRequest.delete('api/geofence/' + item.Id).then(function (data) {
                        if (data.Success) {
                            if (item.Feature) {
                                app.getMap().removeFeature(item.Feature);
                            }
                            _this.geofences.remove(item);
                        } else {
                            Dialog.alert('Елементът не може да бъде изтрит, тъй като се използва.');
                        }
                    });
                });
            };
            this.toggle = function (item) {
                var map = app.getMap();
                if (!item.Visible()) {
                    item.Feature = map.addFeature(item.GeoJSONBuffered);
                    item.Visible(true);
                } else {
                    map.removeFeature(item.Feature);
                    delete item.Feature;
                    item.Visible(false);
                }
            };
            this.list = function () {
                View.render('Geofence/List', $('.data-col')).then(function () {
                    ko.applyBindings(_this, ko.cleanNode($('.data-col')[0]));
                });
            };
            var apiUrl = 'api/geofence';
            HttpRequest.getJSON(apiUrl).then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    var geofence = data[i];
                    geofence.Visible = ko.observable(false);
                    _this.geofences.push(geofence);
                }
            });
        }
        return GeofencesListViewModel;
    })();

    
    return GeofencesListViewModel;
});
//# sourceMappingURL=GeofencesListViewModel.js.map
