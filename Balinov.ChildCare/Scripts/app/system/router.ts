/// <reference path="../../libs/typings/routie.d.ts" />
import $ = require('jquery');
import ko = require('knockout');
import initRoutie = require('routie');
import View = require('app/system/view');
import HttpRequest = require('libs/httprequest');
//import LoginViewModel = require('app/viewmodels/LoginViewModel');
import RegisterViewModel = require('app/viewmodels/RegisterViewModel');
import OpenLayersMap = require('app/maps/OpenLayersMap');

class Router {
    app;
    constructor(app) {
        this.app = app;
        initRoutes(this);
        initRoutie;
    }

    route = (to: string) => {
        routie(to);
    }

    getRoute = () => {
        return window.location.hash.replace('#', '');
    }

    getViewModel = (key, type) => {
        var viewModel = this.app.getViewModel(key);
        if (!viewModel) {
            viewModel = new type();
            this.app.setViewModel(key, viewModel);
        }
        return viewModel;
    }

}

export = Router;


function initRoutes(router) {
    routie('/Home', () => {
        if (!router.app.getViewModel('Account').IsAuthenticated()) {
            router.route('/Account/Login');
            return;
        }
        
        View.render(router.getRoute(), $('main')).then(() => {
            var map = new OpenLayersMap('map');
            router.app.setMap(map);
        });
    });

    routie('/Account/Login', () => {
        var main = $("main");
        var promise = View.render(router.getRoute(), main);
        //promise.done(() => {
        //var container = main.find('#LoginForm')[0];
        //var viewModel = new LoginViewModel();
        //ko.applyBindings(viewModel, ko.cleanNode(container));
        //});
    });

    routie('/Account/LogOff', () => {
        var promise = HttpRequest.postJSON('api/account/logout', {});
        promise.done((isLoggedOff: boolean) => {
            if (isLoggedOff) {
                router.route("Account/Login");
                router.app.getViewModel('Account').IsAuthenticated(false);
            }
        });
    });

    routie('/Account/Register', () => {
        var main = $("main");
        var promise = View.render(router.getRoute(), main);
        promise.done(() => {
            var container = main.find('#RegisterForm')[0];
            var viewModel = new RegisterViewModel();
            ko.applyBindings(viewModel, ko.cleanNode(container));
        });
    });
}
