//import MessageService = require('app/services/MessageService');
module App.Services {
    export class DataService {
        private alarms: Alarm[] = null;
        private devices: Device[] = null;
        private notifications: Notification[] = null;
        private geofences: Geofence[] = null;
        private geofenceGroups: GeofenceGroup[] = null;
        private platforms: string[] = null;

        constructor(private $http: ng.IHttpService,
            private $q: ng.IQService,
            private messageService: Services.MessageService,
            private mapService: Services.MapService) {
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

        getPlatforms() {
            var defer = this.$q.defer<string[]>();
            if (this.platforms == null) {
                defer = this.getAll<string>('api/userdevice/getplatforms', defer);
                defer.promise.then((platforms) => this.platforms = platforms);
            } else {
                defer.resolve(this.platforms);
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

        // Delete
        deleteAlarm(id: number) {
            return this.deleteItem('api/alarm/' + id)
                .then(() => this.removeItem(this.alarms, id));
        }

        deleteDevice(id: number) {
            return this.deleteItem('api/userdevice/?deviceId=' + id)
                .then(() => this.removeItem(this.devices, id, item => item.DeviceId));
        }

        deleteGeofence(id: number) {
            return this.deleteItem('api/geofence/' + id)
                .then(() => {
                    var geofence = this.getGeofence(id);
                    if (geofence.Feature) {
                        this.mapService.removeFeature(geofence.Feature);
                    }

                    this.removeItem(this.geofences, id)
                });
        }

        deleteGeofenceGroup(id: number) {
            return this.deleteItem('api/geofencegroup/' + id)
                .then(() => this.removeItem(this.geofenceGroups, id));
        }

        deleteNotification(id: number) {
            return this.deleteItem('api/notification/' + id)
                .then(() => this.removeItem(this.notifications, id));
        }

        deleteItem(url) {
            var defer = this.$q.defer<any>();
            this.messageService.confirm('Сигурни ли сте, че исате да изтриете избраият елемент?')
                .then(() => this.$http.delete<any>(url)
                    .success(data => {
                        if (data.Success) {
                            defer.resolve(data);
                        } else {
                            this.messageService.alert('Елементът не може да бъде изтрит, тъй като се използва.');
                            data.reject();
                        }
                    })
                    .error(error => defer.reject(error))
                );

            return defer.promise;
        }

        // Get item

        getAlarm(id): Alarm {
            return this.getItem(this.alarms, id);
        }

        getGeofence(id): Geofence {
            return this.getItem(this.geofences, id);
        }

        getGeofenceGroup(id): GeofenceGroup {
            return this.getItem(this.geofenceGroups, id);
        }

        private getItem(array: { Id: any }[], id): any {
            for (var i = 0; i < array.length; i++) {
                if (array[i].Id == id) {
                    return array[i];
                }
            }
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

        getHistory(id, timestamp) {
            var url = 'api/userdevice/' + id + '?timestamp=' + timestamp;
            var defer = this.$q.defer<any>();
            this.$http.get(url)
                .success(data => defer.resolve(data))
                .error(error => defer.reject(error));
            return defer.promise;
        }

        saveAlarm(item: Alarm) {
            var difer = this.$q.defer<Alarm>();

            if (item.Id == 0) {
                this.$http.post<Alarm>('api/alarm', item)
                    .success((alarm) => {
                        this.alarms.push(alarm);
                        difer.resolve(alarm);
                    })
                    .error((error) => difer.reject(error));
            } else {
                this.$http.put<Alarm>('api/alarm/' + item.Id, item)
                    .success((alarm) => {
                        for (var i = 0; i < this.alarms.length; i++) {
                            if (this.alarms[i].Id == item.Id) {
                                this.alarms[i] = item;
                                break;
                            }
                        }

                        difer.resolve(alarm);
                    })
                    .error((error) => difer.reject(error));
            }

            return difer.promise;
        }

        saveGeofence(item: Geofence) {
            var difer = this.$q.defer<Geofence>();

            if (item.Id == 0) {
                this.$http.post<Geofence>('api/geofence', item)
                    .success((geofence) => {
                        geofence.Visible = false;
                        this.geofences.push(geofence);
                        difer.resolve(geofence);
                    })
                    .error((error) => difer.reject(error));
            } else {
                this.$http.put<Geofence>('api/geofence' + item.Id, item)
                    .success((geofence) => {
                        for (var i = 0; i < this.alarms.length; i++) {
                            if (this.geofences[i].Id == item.Id) {
                                var oldGeofence = this.geofences[i];
                                geofence.Visible = oldGeofence.Visible;
                                if (oldGeofence.Visible) {
                                    this.mapService.removeFeature(oldGeofence.Feature);
                                    geofence.Feature = this.mapService.addFeature(geofence.GeoJSONBuffered);
                                }
                                
                                this.geofences[i] = geofence;
                                break;
                            }
                        }

                        difer.resolve(geofence);
                    })
                    .error((error) => difer.reject(error));
            }

            return difer.promise;
        }

        saveDevice(device) {
            var difer = this.$q.defer<GeofenceGroup>();
            this.$http.post<any>('api/userdevice', device)
                .success((data) => {
                    this.devices.push(data);
                    difer.resolve(data);
                })
                .error((error) => difer.reject(error));
            return difer.promise;
        }
        private isLogged = false;

        isAuthenticated() {
            var defer = this.$q.defer<any>();
            this.$http.get('api/account')
                .success(data => defer.resolve(data))
                .error(error => defer.reject(error));
            return defer.promise;
        }

        login(data) {
            var defer = this.$q.defer();

            this.$http.post('api/account/login', data)
                .success(() => defer.resolve())
                .error((errors: any) => defer.reject(errors));
            return defer.promise;
        }

        logout() {
            var defer = this.$q.defer<any>();
            this.$http.post('api/account/logout', {})
                .success(data => defer.resolve(data))
                .error(error => defer.reject(error));
            return defer.promise;
        }

        register(data) {
            var defer = this.$q.defer();
            var promise = this.$http.post('api/account/register', data)
                .success(() => defer.resolve())
                .error((errors: any) => defer.reject(errors));
            return defer.promise;
        }



        // Common


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
}