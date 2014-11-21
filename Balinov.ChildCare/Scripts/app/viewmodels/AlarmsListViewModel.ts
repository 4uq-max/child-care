import $ = require('jquery');
import ko = require('knockout');
import HttpRequest = require('libs/httprequest');
import Dialog = require('app/system/dialog');
import View = require('app/system/view');
import AlarmViewModel = require('app/viewmodels/AlarmViewModel');

class AlarmsListViewModel {
    
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


    list = () => {
        View.render('Alarm/List', $('.data-col'))
            .then(() => ko.applyBindings(this, ko.cleanNode($('.data-col')[0])));
    }
}
export = AlarmsListViewModel;