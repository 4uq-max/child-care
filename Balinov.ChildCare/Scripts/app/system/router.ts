import View = require('app/system/view');
//import LoginViewModel = require('app/viewmodels/LoginViewModel');

class Router {
    app;
    constructor(app) {
        this.app = app;

    //routie('/Account/Login', () => {
    //    var main = $("main");
    //    var promise = View.render(this.getRoute(), main);
    //    promise.done(() => {
    //    //var container = main.find('#LoginForm')[0];
    //    //var viewModel = new LoginViewModel();
    //    //ko.applyBindings(viewModel, ko.cleanNode(container));
    //    });
    //});

    //routie('/Account/LogOff', () => {
    //    $http.post('api/account/logout')
    //    .then((isLoggedOff: boolean) => {
    //        if (isLoggedOff) {
    //            this.route("Account/Login");
    //            this.app.getViewModel('Account').IsAuthenticated(false);
    //        }
    //    });
    //});
    }

    getRoute = () => {
        return window.location.hash.replace('#', '');
    }

    getViewModel = (key, type) => {
        var viewModel = this.app.getViewModel(key);
        if (!viewModel) {
            viewModel = new type();
            //this.app.setViewModel(key, viewModel);
        }
        return viewModel;
    }

}

export = Router;