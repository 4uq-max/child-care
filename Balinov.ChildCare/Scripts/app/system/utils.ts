import $ = require('jquery');

class Utils {
    public static displayErrors = (node, data: Array<string>) => {
        var errorsDiv = $('.errors');
        if (errorsDiv.length == 0) {
            errorsDiv = $('<div class="errors"></div>');
            $(node).prepend(errorsDiv);
        }
        var html = data.length == 0 ? '' :
            '<ul>\n<li>' + data.join('</li>\n<li>') + '</li>\n</ul>';
        errorsDiv.html(html);
    }
}

export = Utils;