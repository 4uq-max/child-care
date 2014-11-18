require.config({
    paths: {
        jquery: 'libs/jquery-2.1.0.min',
        bootstrap: 'libs/bootstrap.min',
        JqueryUI: 'libs/jquery-ui.min', 
        blockUI: 'libs/jquery.blockUI',
        knockout: 'libs/knockout-3.1.0',
        routie: 'libs/routie.min',
        q: 'libs/q.min',
        httprequest: 'libs/httprequest',
        ol3: 'libs/ol-whitespace',
        'angular': 'libs/angular/angular.min',
        'ngRoute': 'libs/angular/angular-route.min',
    },
    shim: {
        'angular': { exports: 'angular' },
        'ngRoute': ['angular'],
        blockUI: ['jquery'], 
        JqueryUI: {
            exports: "$",
            deps: ['jquery']
        },
        bootstrap: {
            deps: ['jquery']
        }
    }
});

var app = null;
require(['jquery', 'app/app', 'q', 'bootstrap'], function ($, App, Q, b) {
    app = new App();
    $(function () { app.run(); });
    Q.stopUnhandledRejectionTracking();
});
