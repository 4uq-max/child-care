//"use strict";
import IScope = require("../app.d");

class BaseController {
    constructor(public $scope: IScope<BaseController>) {
        $scope.model = this;
    }
}

export = BaseController;