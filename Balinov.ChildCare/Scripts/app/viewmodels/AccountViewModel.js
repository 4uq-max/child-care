define(["require", "exports", 'knockout'], function(require, exports, ko) {
    var AccountViewModel = (function () {
        function AccountViewModel(isAuthenticated) {
            this.IsAuthenticated = ko.observable(isAuthenticated);
        }
        return AccountViewModel;
    })();
    
    return AccountViewModel;
});
//# sourceMappingURL=AccountViewModel.js.map
