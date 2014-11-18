define(["require", "exports"], function(require, exports) {
    var BaseController = (function () {
        function BaseController($scope) {
            this.$scope = $scope;
            $scope.model = this;
        }
        return BaseController;
    })();

    
    return BaseController;
});
//# sourceMappingURL=BaseController.js.map
