dashboard.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/coverage");
        $urlRouterProvider.when("", "/coverage");
        $stateProvider
            .state("main", {
                url: "/coverage",
                templateUrl: "static/app/components/coverage/coverage.html",
                controller: "CoverageController"
            })
            .state("coverage.home", {
                url: "/coverage",
                templateUrl: "static/app/components/coverage/coverage.html",
                controller: "CoverageController"
            })
            .state("coverage.dropoutrate", {
                url: "/dropoutrate",
                templateUrl: "static/app/components/coverage/dropoutrate.html",
                controller: "DropoutRateController"
            })
            .state("coverage.underimmunized", {
                url: "/underimmunized",
                templateUrl: "static/app/components/coverage/underimmunized.html",
                controller: "UnderImmunizedController"
            });
    }
]);

var services = angular.module("services", []);
