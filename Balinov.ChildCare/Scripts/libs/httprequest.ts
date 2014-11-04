import $ = require('jquery');
import Q = require('q');

class HttpRequest {

    public static getJSON(url) {
        $.blockUI({ message: null, overlayCSS: { opacity: 0 } });
        var defer = Q.defer<any>();
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            success: defer.resolve,
            error: defer.reject
        }).always(() => {
            $.unblockUI();
        });
        return defer.promise;
    }

    public static postJSON(serviceUrl, data) {
        this.block();
        var defer = Q.defer<any>();
        $.ajax({
            url: serviceUrl,
            dataType: "json",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: defer.resolve,
            error: defer.reject
        }).always(() => {
            $.unblockUI();
        });
        return defer.promise;
    }

    public static putJSON(serviceUrl, data) {
        this.block();
        var defer = Q.defer<any>();
        $.ajax({
            url: serviceUrl,
            dataType: "json",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: defer.resolve,
            error: defer.reject
        }).always(() => {
            $.unblockUI();
        });
        return defer.promise;
    }

    public static delete(serviceUrl) {
        this.block();
        var defer = Q.defer<any>();
        $.ajax({
            url: serviceUrl,
            dataType: "json",
            type: "DELETE",
            success: defer.resolve,
            error: defer.reject
        }).always(() => {
            $.unblockUI();
        });
        return defer.promise;
    }

    public static getHTML(url) {
        var defer = Q.defer<any>();
        $.ajax({
            url: url,
            dataType: "html",
            cache: false,
            contentType: "text/html",
            success: defer.resolve,
            error: defer.reject
        });
        return defer.promise;
    }

    private static block = () => {
        $.blockUI({ message: null, overlayCSS: { opacity: 0, cursor: 'wait' } });
    }
}

export = HttpRequest;