define(["require", "exports", 'jquery', 'knockout', 'libs/httprequest', 'app/system/utils'], function(require, exports, $, ko, HttpRequest, Utils) {
    var apiUri = 'api/account/login';

    var LoginViewModel = (function () {
        function LoginViewModel() {
            this.Email = ko.observable('');
            this.Password = ko.observable('');
            this.RememberMe = ko.observable(false);
        }
        LoginViewModel.prototype.submit = function (viewModel, e) {
            var data = ko.toJSON(this);
            var promise = HttpRequest.postJSON(apiUri, JSON.parse(data));
            promise.done(function () {
                app.route('Home');
                app.getViewModel('Account').IsAuthenticated(true);
            }, function (err) {
                var form = $(e.currentTarget).parents('form');
                Utils.displayErrors(form, err.responseJSON);
            });
        };
        return LoginViewModel;
    })();

    
    return LoginViewModel;
});
//# sourceMappingURL=LoginViewModel.js.map
