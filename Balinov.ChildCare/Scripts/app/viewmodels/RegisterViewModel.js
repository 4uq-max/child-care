define(["require", "exports", 'jquery', 'knockout', 'libs/httprequest', 'app/system/utils'], function(require, exports, $, ko, HttpRequest, Utils) {
    var apiUri = 'api/account/register';

    var RegisterViewModel = (function () {
        function RegisterViewModel() {
            this.Email = ko.observable('');
            this.FirstName = ko.observable('');
            this.LastName = ko.observable('');
            this.Password = ko.observable('');
            this.ConfirmPassword = ko.observable('');
        }
        RegisterViewModel.prototype.submit = function (viewModel, e) {
            var data = JSON.parse(ko.toJSON(this));
            var promise = HttpRequest.postJSON(apiUri, data);
            promise.done(function () {
                app.route('Account/Login');
            }, function (data) {
                var form = $(e.currentTarget).parents('form');
                Utils.displayErrors(form, data.responseJSON);
            });
        };
        return RegisterViewModel;
    })();

    
    return RegisterViewModel;
});
//# sourceMappingURL=RegisterViewModel.js.map
