import $ = require('jquery');
import ko = require('knockout');
import HttpRequest = require('libs/httprequest');
import Utils = require('app/system/utils');

declare var app;
var apiUri = 'api/account/login';

class LoginViewModel {
    Email = ko.observable('');
    Password = ko.observable('');
    RememberMe = ko.observable(false);

    submit(viewModel, e: Event) {
        var data = ko.toJSON(this);
        var promise = HttpRequest.postJSON(apiUri, JSON.parse(data));
        promise.done(() => {
             app.route('Home');
             app.getViewModel('Account').IsAuthenticated(true);
        }, (err) => {
            var form = $(e.currentTarget).parents('form');
            Utils.displayErrors(form, err.responseJSON);
        });
    }
}

export = LoginViewModel;