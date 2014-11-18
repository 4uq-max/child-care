import ko = require('knockout');
import HttpRequest = require('libs/httprequest');

declare var app;
var apiUri = 'api/account/register';

class RegisterViewModel {
    Email = ko.observable('');
    FirstName = ko.observable('');
    LastName = ko.observable('');
    Password = ko.observable('');
    ConfirmPassword = ko.observable('');
    private errors: Array<string>;

    submit(viewModel, e: Event) {
        var data = JSON.parse(ko.toJSON(this));
        HttpRequest.postJSON(apiUri, data)
            .done(() => {
                app.route('Account/Login');
            }, (errors) => {
                this.errors = errors;
            });
    }
}

export = RegisterViewModel;