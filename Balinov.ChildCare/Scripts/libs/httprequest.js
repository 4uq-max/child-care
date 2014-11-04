define(["require", "exports", 'jquery', 'q'], function(require, exports, $, Q) {
    var HttpRequest = (function () {
        function HttpRequest() {
        }
        HttpRequest.getJSON = function (url) {
            $.blockUI({ message: null, overlayCSS: { opacity: 0 } });
            var defer = Q.defer();
            $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                success: defer.resolve,
                error: defer.reject
            }).always(function () {
                $.unblockUI();
            });
            return defer.promise;
        };

        HttpRequest.postJSON = function (serviceUrl, data) {
            this.block();
            var defer = Q.defer();
            $.ajax({
                url: serviceUrl,
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: defer.resolve,
                error: defer.reject
            }).always(function () {
                $.unblockUI();
            });
            return defer.promise;
        };

        HttpRequest.putJSON = function (serviceUrl, data) {
            this.block();
            var defer = Q.defer();
            $.ajax({
                url: serviceUrl,
                dataType: "json",
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: defer.resolve,
                error: defer.reject
            }).always(function () {
                $.unblockUI();
            });
            return defer.promise;
        };

        HttpRequest.delete = function (serviceUrl) {
            this.block();
            var defer = Q.defer();
            $.ajax({
                url: serviceUrl,
                dataType: "json",
                type: "DELETE",
                success: defer.resolve,
                error: defer.reject
            }).always(function () {
                $.unblockUI();
            });
            return defer.promise;
        };

        HttpRequest.getHTML = function (url) {
            var defer = Q.defer();
            $.ajax({
                url: url,
                dataType: "html",
                cache: false,
                contentType: "text/html",
                success: defer.resolve,
                error: defer.reject
            });
            return defer.promise;
        };

        HttpRequest.block = function () {
            $.blockUI({ message: null, overlayCSS: { opacity: 0, cursor: 'wait' } });
        };
        return HttpRequest;
    })();

    
    return HttpRequest;
});
//# sourceMappingURL=httprequest.js.map
