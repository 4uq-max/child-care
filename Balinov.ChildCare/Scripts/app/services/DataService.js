define(["require", "exports", 'app/system/dialog'], function(require, exports, Dialog) {
    var DataService = (function () {
        function DataService($http, $q) {
            this.$http = $http;
            this.$q = $q;
            this.notifications = null;
            this.geofenceGroups = null;
        }
        DataService.prototype.getNotifications = function () {
            var _this = this;
            var defer = this.$q.defer();

            if (this.notifications == null) {
                this.$http.get('api/notification').success(function (notifications) {
                    _this.notifications = notifications;
                    defer.resolve(notifications);
                }).error(function (error) {
                    defer.reject(error);
                });
            } else {
                defer.resolve(this.notifications);
            }

            return defer.promise;
        };

        DataService.prototype.deleteNotification = function (id) {
            var _this = this;
            return this.$http.delete('api/notification/' + id).success(function (data) {
                if (data.Success) {
                    _this.removeItem(_this.notifications, id);
                } else {
                    Dialog.alert('Елементът не може да бъде изтрит, тъй като се използва.');
                }
            });
        };

        DataService.prototype.getGeofenceGroups = function () {
            var _this = this;
            var defer = this.$q.defer();

            if (this.geofenceGroups == null) {
                this.$http.get('api/geofencegroup').success(function (geofenceGroups) {
                    _this.geofenceGroups = geofenceGroups;
                    defer.resolve(geofenceGroups);
                }).error(function (error) {
                    defer.reject(error);
                });
            } else {
                defer.resolve(this.geofenceGroups);
            }

            return defer.promise;
        };

        DataService.prototype.deleteGeofenceGroup = function (id) {
            var _this = this;
            return this.$http.delete('api/geofencegroup/' + id).success(function (data) {
                if (data.Success) {
                    _this.removeItem(_this.geofenceGroups, id);
                } else {
                    Dialog.alert('Елементът не може да бъде изтрит, тъй като се използва.');
                }
            });
        };

        DataService.prototype.saveGeofenceGroup = function (item) {
            var _this = this;
            var difer = this.$q.defer();

            if (item.Id == 0) {
                this.$http.post('api/geofencegroup/', item).success(function (geofenceGroup) {
                    _this.geofenceGroups.push(geofenceGroup);
                    difer.resolve(geofenceGroup);
                }).error(function (error) {
                    return difer.reject(error);
                });
            } else {
                this.$http.put('api/geofencegroup/' + item.Id, item).success(function (geofenceGroup) {
                    for (var i = 0; i < _this.geofenceGroups.length; i++) {
                        if (_this.geofenceGroups[i].Id == item.Id) {
                            _this.geofenceGroups[i] = item;
                            break;
                        }
                    }

                    difer.resolve(geofenceGroup);
                }).error(function (error) {
                    return difer.reject(error);
                });
            }

            return difer.promise;
        };

        DataService.prototype.getGeofenceGroup = function (id) {
            return this.getItem(this.geofenceGroups, id);
        };

        // Common
        DataService.prototype.getItem = function (array, id) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].Id == id) {
                    return array[i];
                }
            }
        };

        DataService.prototype.removeItem = function (array, id) {
            var index = null;
            for (var i = 0; i < array.length; i++) {
                if (array[i].Id == id) {
                    index = i;
                }
            }

            if (index !== null) {
                array.splice(index, 1);
            }
        };
        return DataService;
    })();

    
    return DataService;
});
//# sourceMappingURL=DataService.js.map
