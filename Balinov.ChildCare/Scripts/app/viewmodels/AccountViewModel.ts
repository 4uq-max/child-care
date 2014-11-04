import ko = require('knockout');

class AccountViewModel {
    IsAuthenticated;

    constructor(isAuthenticated) {
        this.IsAuthenticated = ko.observable(isAuthenticated);
    }
}
export = AccountViewModel;