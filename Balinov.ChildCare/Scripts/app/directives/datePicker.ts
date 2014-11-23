module App.Directives {
    childCare.directive("datepicker", () => {
        return {
            restrict: "A",
            link: function (scope, element: ng.IAugmentedJQuery, attrs) {
                element.datepicker({ dateFormat: 'dd.mm.yy' });
			}
        };
    });
}