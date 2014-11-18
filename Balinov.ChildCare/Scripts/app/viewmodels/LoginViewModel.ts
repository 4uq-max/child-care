import $ = require('jquery');
import ko = require('knockout');
import HttpRequest = require('libs/httprequest');

declare var app;
var apiUri = 'api/account/login';

class LoginViewModel {
    Email = ko.observable('');
    Password = ko.observable('');
    RememberMe = ko.observable(false);
    private errors: Array<string>;

    submit(viewModel, e: Event) {
        var data = ko.toJSON(this);
        var promise = HttpRequest.postJSON(apiUri, JSON.parse(data));
        promise.done(() => {
             app.route('Home');
             app.getViewModel('Account').IsAuthenticated(true);
        },
            (errors) => { this.errors = errors; });
    }
}

export = LoginViewModel;