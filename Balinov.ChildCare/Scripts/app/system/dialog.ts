/// <reference path="../../libs/typings/jquery.blockui.d.ts" />
import $ = require('jquery');
import Q = require('q');
import initBlockUI = require('blockUI');

$.blockUI.defaults.overlayCSS.color = "#ccc";
$.blockUI.defaults.overlayCSS.cursor = 'poiter';

class Dialog {
    private dialogHtml;

    constructor(message) {
        this.dialogHtml = '<div id="dialog">' +
            ' <div id="dialog-message">' + message + '</div>' +
            ' <div id="dialog-buttons"></div>' +
            '</div>';
        this.dialogHtml = $(this.dialogHtml);
        $.blockUI({ message: this.dialogHtml, css: { width: '100%', border: 0, left: 0 } });
        initBlockUI;
    }

    static alert(message) {
        var defer = Q.defer();
        var dialog = new Dialog(message)
            .addButton('Добре', defer.resolve);
        defer.promise.then(dialog.close);
        return defer.promise;
    }

    static confirm(message) {
        var defer = Q.defer();
        var dialog = new Dialog(message)
            .addButton('Да', defer.resolve)
            .addButton('Не', defer.reject);
        defer.promise.then(dialog.close, dialog.close);
        return defer.promise;
    }

    private addButton = (text, click) => {
        var button = $('<button class="btn btn-default">' + text + '</button> ')
            .on('click', click);
        this.dialogHtml.find('#dialog-buttons').append(button);
        return this;
    }

    private close = () => {
        this.dialogHtml.remove();
        $.unblockUI();
    }
}

export = Dialog;