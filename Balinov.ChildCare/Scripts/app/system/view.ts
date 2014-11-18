import Q = require('q');
import HttpRequest = require('libs/httprequest');
import OpenLayersMap = require('app/maps/OpenLayersMap');

declare var app;
class View {
    static render = (name, container) => {
        if (container.length == 0) {
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

        var success = () => {
            return HttpRequest.getHTML('Scripts/app/Views/' + name + '.html')
                .then((view) => {
                    if (container != null) {
                        container.html(view);
                    }
                });
        };
    }
}
export = View;