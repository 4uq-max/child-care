import Q = require('q');
import ViewCache = require('app/system/viewcache');
import HttpRequest = require('libs/httprequest');
import OpenLayersMap = require('app/maps/OpenLayersMap');

var path = 'Scripts/app/Views/';
declare var app;
class View {
    private static viewCache= new ViewCache(10);

    static render = (name, container) => {
        if (container.length == 0) {
            console.log('load view: ', name);
            return View.render('Home', $('main'))
            .then(() => {
                var map = new OpenLayersMap('map');
                app.setMap(map);
                container = $('.data-col');
                success();
            });
        } else {
            return success();
        }

        function success() {
            var promise = null;
            var view = View.viewCache.getView(name);
            if (view) {
                promise = Q.promise(function (resolve, reject) { resolve(view); });
            } else {
                var url = path + name + '.html';
                promise = HttpRequest.getHTML(url);
                promise.then(function (view) {
                    View.viewCache.addView(name, view);
                });
            }

            if (container != null) {
                promise.then((view) => { container.html(view); });
            }
            return promise;
        }
    }
}
export = View;