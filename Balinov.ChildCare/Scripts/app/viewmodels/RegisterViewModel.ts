import ko = require('knockout');
import HttpRequest = require('libs/httprequest');

declare var app;

class RegisterViewModel {
    Email = '';
    FirstName = '';
    LastName = '';
    Password = '';
    ConfirmPassword = '';
    private errors: string[];

    submit(viewModel, e: Event) {
        var data = JSON.parse(ko.toJSON(this));
        HttpRequest.postJSON('api/account/register', data)
            .done(() => app.route('Account/Login'),
            errors => this.errors = errors);
    }
}

export = RegisterViewModel;