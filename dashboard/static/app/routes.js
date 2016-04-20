angular.module
    .config(["$stateProvider", "$urlRouterProvider",
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/coverage");
        $urlRouterProvider.when("", "/coverage");
        $stateProvider
            .state("coverage.home", {
                url: "/coverage",
                templateUrl: "/static/app/coverage/coverage.html",
                controller: "CoverageController"
            })
            .state("coverage.dropoutrate", {
                url: "/dropoutrate",
                templateUrl: "/static/app/coverage/dropoutrate.html",
                controller: "DropoutRateController"
            })
            .state("coverage.underimmunized", {
                url: "/underimmunized",
                templateUrl: "/static/app/coverage/underimmunized.html",
                controller: "UnderImmunizedController"
            });
    }
]);

var services = angular.module("services", []);
