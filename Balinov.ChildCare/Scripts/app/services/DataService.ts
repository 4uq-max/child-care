import Alarm = require('app/models/Alarm');
import Device = require('app/models/Device');
import Notification = require('app/models/Notification');
import Geofence = require('app/models/Geofence');
import GeofenceGroup = require('app/models/GeofenceGroup');
import Dialog = require('app/system/dialog');

class DataService {
    private alarms: Alarm[] = null;
    private devices: Device[] = null;
    private notifications: Notification[] = null;
    private geofences: Geofence[] = null;
    private geofenceGroups: GeofenceGroup[] = null;

    constructor(private $http: ng.IHttpService,
        private $q: ng.IQService) {
    }

    getAlarms(): ng.IPromise<any> {
        var defer = this.$q.defer<Alarm[]>();
        if (this.alarms == null) {
            defer = this.getAll<Alarm>('api/alarm', defer);
            defer.promise.then(alarms => this.alarms = alarms);
        } else {
            defer.resolve(this.alarms);
        }

        return defer.promise;
    }

    getDevices(): ng.IPromise<any> {
        var defer = this.$q.defer<Device[]>();
        if (this.devices == null) {
            defer = this.getAll<Device>('api/userdevice', defer);
            defer.promise.then((devices) => this.devices = devices);
        } else {
            defer.resolve(this.devices);
        }

        return defer.promise;
    }

    getNotifications(): ng.IPromise<any> {
        var defer = this.$q.defer<Notification[]>();
        if (this.notifications == null) {
            defer = this.getAll<Notification>('api/notification', defer);
            defer.promise.then((notifications) => this.notifications = notifications);
        } else {
            defer.resolve(this.notifications);
        }
        return defer.promise;
    }

    getGeofenceGroups(): ng.IPromise<GeofenceGroup[]> {
        var defer = this.$q.defer<GeofenceGroup[]>();
        if (this.geofenceGroups == null) {
            defer = this.getAll<GeofenceGroup>('api/geofencegroup', defer);
            defer.promise.then((geofenceGroups) => this.geofenceGroups = geofenceGroups);
        } else {
            defer.resolve(this.geofenceGroups);
        }
        return defer.promise;
    }

    getAll<T>(url: string, defer: ng.IDeferred<T[]>) {
        this.$http.get<T[]>(url)
            .success((data) => defer.resolve(data))
            .error((error) => defer.reject(error));
        return defer;
    }

    getGeofences(): ng.IPromise<Geofence[]> {
        var defer = this.$q.defer<Geofence[]>();
        if (this.geofences == null) {
            this.$http.get<Geofence[]>('api/geofence')
                .success((geofences) => {
                    this.geofences = geofences;
                    defer.resolve(geofences);
                })
                .error(error => defer.reject(error));
        } else {
            defer.resolve(this.geofences);
        }

        return defer.promise;
    }

    deleteAlarm(id: number) {
        return this.$http.delete('api/alarm/' + id)
            .success((data: any) => {
                if (data.Success) {
                    this.removeItem(this.alarms, id);
                } else {
                    Dialog.alert('Елементът не може да бъде изтрит, тъй като се използва.');
                }
            });
    }

    deleteDevice(id: number) {
        return this.$http.delete('api/userdevice/?deviceId=' + id)
            .success((data: any) => {
                if (data.Success) {
                    this.removeItem(this.devices, id, item => item.DeviceId);
                } else {
                    Dialog.alert('Елементът не може да бъде изтрит, тъй като се използва.');
                }
            });
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


    login(data) {
        var defer = this.$q.defer();
        
        var promise = this.$http.post('api/account/login', data)
            .success(() => defer.resolve())
            .error((errors: any) => defer.reject(errors));
        return defer.promise;
    }

    // Common
    private getItem(array: { Id: any }[], id) : any {
        for (var i = 0; i < array.length; i++) {
            if (array[i].Id == id) {
                return array[i];
            }
        }
    }

    private removeItem(array: any[], id, getId?) {
        if (!getId) {
            getId = this.getId;
        }

        var index = null;
        for (var i = 0; i < array.length; i++) {
            if (getId(array[i]) == id) {
                index = i;
            }
        }

        if (index !== null) {
            array.splice(index, 1);
        }
    }

    private getId(item: any) {
        return item.Id;
    }
}

export = DataService; 