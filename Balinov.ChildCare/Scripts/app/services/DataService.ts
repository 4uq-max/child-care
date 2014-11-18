import Notification = require('app/models/Notification');
import Geofence = require('app/models/Geofence');
import GeofenceGroup = require('app/models/GeofenceGroup');
import Dialog = require('app/system/dialog');

class DataService {
    private notifications: Array<Notification> = null;
    private geofences: Array<Geofence> = null;
    private geofenceGroups: Array<GeofenceGroup> = null;

    constructor(private $http: ng.IHttpService,
        private $q: ng.IQService) {
    }

    getNotifications(): ng.IPromise<any> {
        var defer = this.$q.defer<Array<Notification>>();

        if (this.notifications == null) {
            this.$http.get<Array<Notification>>('api/notification')
                .success((notifications) => {
                    this.notifications = notifications;
                    defer.resolve(notifications);
                })
                .error((error) => {
                    defer.reject(error);
                });
        } else {
            defer.resolve(this.notifications);
        }

        return defer.promise;
    }

    deleteNotification(id: number) {
        return this.$http.delete('api/notification/' + id)
            .success((data: any) => {
                if (data.Success) {
                    this.removeItem(this.notifications, id);
                } else {
                    Dialog.alert('Елементът не може да бъде изтрит, тъй като се използва.');
                }
            });
    }

    getGeofenceGroups(): ng.IPromise<Array<GeofenceGroup>> {
        var defer = this.$q.defer<Array<GeofenceGroup>>();

        if (this.geofenceGroups == null) {
            this.$http.get<Array<GeofenceGroup>>('api/geofencegroup')
                .success((geofenceGroups) => {
                    this.geofenceGroups = geofenceGroups;
                    defer.resolve(geofenceGroups);
                })
                .error((error) => {
                    defer.reject(error);
                });
        } else {
            defer.resolve(this.geofenceGroups);
        }

        return defer.promise;
    }

    deleteGeofenceGroup(id: number) {
        return this.$http.delete('api/geofencegroup/' + id)
            .success((data: any) => {
                if (data.Success) {
                    this.removeItem(this.geofenceGroups, id);
                } else {
                    Dialog.alert('Елементът не може да бъде изтрит, тъй като се използва.');
                }
            });
    }
    
    saveGeofenceGroup(item: GeofenceGroup) {
        var difer = this.$q.defer<GeofenceGroup>();

        if (item.Id == 0) {
            this.$http.post<GeofenceGroup>('api/geofencegroup', item)
                .success((geofenceGroup) => {
                    this.geofenceGroups.push(geofenceGroup);
                    difer.resolve(geofenceGroup);
                })
                .error((error) => difer.reject(error));
        } else {
            this.$http.put<GeofenceGroup>('api/geofencegroup/' + item.Id, item)
                .success((geofenceGroup) => {
                    for (var i = 0; i < this.geofenceGroups.length; i++) {
                        if (this.geofenceGroups[i].Id == item.Id) {
                            this.geofenceGroups[i] = item;
                            break;
                        }
                    }

                    difer.resolve(geofenceGroup);
                })
                .error((error) => difer.reject(error));
        }

        return difer.promise;
    }

    getGeofenceGroup(id) : GeofenceGroup {
        return this.getItem(this.geofenceGroups, id);
    }

    getGeofences(): ng.IPromise<Array<Geofence>> {
        var defer = this.$q.defer<Array<Geofence>>();
        if (this.geofences == null) {
            this.$http.get<Array<Geofence>>('api/geofence')
                .success((geofences) => {
                    this.geofences = geofences;
                    defer.resolve(geofences);
                })
                .error((error) => {
                    defer.reject(error);
                });
        } else {
            defer.resolve(this.geofences);
        }

        return defer.promise;
    }

    deleteGeofence(id: number) {
        return this.$http.delete('api/geofence/' + id)
            .success((data: any) => {
                if (data.Success) {
                    this.removeItem(this.geofences, id);
                } else {
                    Dialog.alert('Елементът не може да бъде изтрит, тъй като се използва.');
                }
            });
    }

    getGeofence(id): Geofence {
        return this.getItem(this.geofences, id);
    }

    // Common
    private getItem(array: Array<{ Id: any }>, id) : any {
        for (var i = 0; i < array.length; i++) {
            if (array[i].Id == id) {
                return array[i];
            }
        }
    }

    private removeItem(array: Array<{ Id: any }>, id) {
        var index = null;
        for (var i = 0; i < array.length; i++) {
            if (array[i].Id == id) {
                index = i;
            }
        }

        if (index !== null) {
            array.splice(index, 1);
        }
    }
}

export = DataService; 