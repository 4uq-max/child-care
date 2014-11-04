define(["require", "exports", 'jquery', 'knockout', 'app/viewmodels/AccountViewModel', 'libs/httprequest', 'app/system/router'], function(require, exports, $, ko, AccountViewModel, HttpRequest, Router) {
    var App = (function () {
        function App() {
            var _this = this;
            this.viewModels = {};
            this.run = function () {
                HttpRequest.getJSON('api/account').then(function (data) {
                    _this.getViewModel('Account').IsAuthenticated(data.IsAuthenticated);
                    ko.applyBindings(_this.getViewModel('Account'), $('nav')[0]);
                    _this.router = new Router(_this);
                    var routeTo = data.IsAuthenticated ? (window.location.hash == '' ? '#Home' : window.location.hash) : '#Account/Login';
                    _this.route(routeTo);
                });
            };
            this.route = function (to) {
                _this.router.route(to);
            };
            this.getViewModel = function (key) {
                var result = _this.viewModels[key];
                return result;
            };
            this.setViewModel = function (key, value) {
                _this.viewModels[key] = value;
            };
            this.getMap = function () {
                return _this.map;
            };
            this.setMap = function (map) {
                _this.map = map;
            };
            this.setViewModel('Account', new AccountViewModel(false));
        }
        return App;
    })();

    
    return App;
});
//# sourceMappingURL=app.js.map
