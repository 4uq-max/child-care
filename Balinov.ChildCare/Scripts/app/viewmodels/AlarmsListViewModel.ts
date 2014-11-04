import $ = require('jquery');
import ko = require('knockout');
import HttpRequest = require('libs/httprequest');
import Dialog = require('app/system/dialog');
import View = require('app/system/view');
import AlarmViewModel = require('app/viewmodels/AlarmViewModel');

class AlarmsListViewModel {
    private alarms = ko.observableArray(null);

    constructor() {
        var apiUrl = 'api/alarm';
        HttpRequest.getJSON(apiUrl)
            .then((data) => {
                ko.utils.arrayPushAll(this.alarms, data);
            });
    }
    create = () => {
        this.createEdit();
    }

    edit = (item) => {
        this.createEdit(item);
    }

    private createEdit = (item?) => {
        View.render('Alarm/Edit', $('.data-col'))
            .then(() => {
                var viewModel = new AlarmViewModel(item);
                ko.applyBindings(viewModel, ko.cleanNode($('.data-col')[0]));
            });
    }

    remove = (item) => {
        Dialog.confirm('Сигурни ли сте, че исате да изтриете избраият елемент?')
            .then(() => {
                HttpRequest.delete('api/alarm/' + item.Id)
                    .then((data) => {
                        if (data.Success) {
                            this.alarms.remove(item);
                        } else {
                            Dialog.alert('Елементът не може да бъде изтрит, тъй като се използва.');
                        }
                    });
            });
    }

    list = () => {
        View.render('Alarm/List', $('.data-col'))
            .then(() => {
                ko.applyBindings(this, ko.cleanNode($('.data-col')[0]));
            });
    }
}
export = AlarmsListViewModel;