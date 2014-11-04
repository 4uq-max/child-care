define(["require", "exports", 'knockout', 'libs/httprequest', 'app/system/utils'], function(require, exports, ko, HttpRequest, Utils) {
    var apiUri = 'api/geofencegroup';

    var GeofenceGroupViewModel = (function () {
        function GeofenceGroupViewModel(item) {
            var _this = this;
            this.Id = ko.observable(0);
            this.Name = ko.observable('');
            this.IsUserItem = ko.observable(true);
            this.IsEdit = ko.computed(function () {
                return _this.Id() > 0;
            });
            this.submit = function (viewModel, event) {
                var data = JSON.parse(ko.toJSON(viewModel));
                var listViewModel = app.getViewModel('GeofenceGroupsList');

                var promise;
                if (!_this.IsEdit()) {
                    promise = HttpRequest.postJSON(apiUri, data).then(function (data) {
                        listViewModel.geofenceGroups.push(data);
                    });
                } else {
                    promise = HttpRequest.putJSON(apiUri + '/' + _this.Id(), data).then(function (data) {
                        var groups = listViewModel.geofenceGroups;
                        var oldGroup = ko.utils.arrayFirst(groups(), function (g) {
                            return g.Id == data.Id;
                        });
                        groups.replace(oldGroup, data);
                    });
                }
                promise.then(function () {
                    listViewModel.list();
                }, function (err) {
                    var form = $(event.currentTarget).parents('form');
                    Utils.displayErrors(form, err.responseJSON);
                });
            };
            this.list = function () {
                app.getViewModel('GeofenceGroupsList').list();
            };
            if (item) {
                this.Id(item.Id);
                this.Name(item.Name);
            }
        }
        return GeofenceGroupViewModel;
    })();

    
    return GeofenceGroupViewModel;
});
//# sourceMappingURL=GeofenceGroupViewModel.js.map
