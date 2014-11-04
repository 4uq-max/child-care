import $ = require('jquery');
import ko = require('knockout');
import HttpRequest = require('libs/httprequest');
import Utils = require('app/system/utils');

declare var app;
var apiUri = 'api/account/register';

class RegisterViewModel {
    Email = ko.observable('');
    FirstName = ko.observable('');
    LastName = ko.observable('');
    Password = ko.observable('');
    ConfirmPassword = ko.observable('');

    submit(viewModel, e: Event) {
        var data = JSON.parse(ko.toJSON(this));
        var promise = HttpRequest.postJSON(apiUri, data);
        promise.done(() => {
            app.route('Account/Login');
        }, (data) => {
            var form = $(e.currentTarget).parents('form');
            Utils.displayErrors(form, data.responseJSON);
        });
    }
}

export = RegisterViewModel;