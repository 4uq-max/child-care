import $ = require('jquery');
import ko = require('knockout');
import HttpRequest = require('libs/httprequest');
import Dialog = require('app/system/dialog');
import View = require('app/system/view');

declare var app;
class NotificationsListViewModel {
    private notifications = ko.observableArray([]);

    constructor() {
        var apiUrl = 'api/notification';
        HttpRequest.getJSON(apiUrl)
        .then((data) => {
            ko.utils.arrayPushAll(this.notifications, data);
        });
    }

    remove = (item) => {
        Dialog.confirm('Сигурни ли сте, че исате да изтриете избраият елемент?')
        .then(() => {
            HttpRequest.delete('api/notification/' + item.Id)
                .then((data) => {
                    if (data.Success) {
                        this.notifications.remove(item);
                    } else {
                        Dialog.alert('Елементът не може да бъде изтрит, тъй като се използва.');
                    }
                });
        });
    }

    list = () => {
         View.render('Notification/List', $('.data-col'))
             .then(() => {
                 ko.applyBindings(this, ko.cleanNode($('.data-col')[0]));
             });
     }
}

export =  NotificationsListViewModel;