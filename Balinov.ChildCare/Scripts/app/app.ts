import $ = require('jquery');
import ko = require('knockout');
import AccountViewModel = require('app/viewmodels/AccountViewModel');
import HttpRequest = require('libs/httprequest');
import Router = require('app/system/router');
import IMap = require('app/maps/IMap');

class App {
    private router;
    private map: IMap;
    private viewModels = {};

    constructor() {
        this.setViewModel('Account', new AccountViewModel(false));
    }

    run = () => {
        HttpRequest.getJSON('api/account').then((data) => {
            this.getViewModel('Account').IsAuthenticated(data.IsAuthenticated);
            ko.applyBindings(this.getViewModel('Account'), $('nav')[0]);
            this.router = new Router(this);
            var routeTo = data.IsAuthenticated ?
                (window.location.hash == '' ? '#Home' : window.location.hash)
                : '#Account/Login';
            this.route(routeTo);
        });
    }

    route = (to: string) => {
        this.router.route(to);
    }

    getViewModel = (key) => {
        var result = this.viewModels[key];
        return result;
    }

    setViewModel = (key, value) => {
        this.viewModels[key] = value;
    }

    getMap = () => {
        return this.map;
    }

    setMap = (map: IMap) => {
        this.map = map;
    }
}

export = App;