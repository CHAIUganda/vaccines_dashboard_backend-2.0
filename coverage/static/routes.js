coverage.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $urlRouterProvider.when("", "coverage/coveragerate");


        $stateProvider
            .state("coverage", {
                url: "/coverage",
                templateUrl: "coverage/templates/coverage.html",
                controller: "CoverageController"
            })
            .state("coverage.coveragerate", {
                url: "/coveragerate",
                templateUrl: "coverage/templates/coveragerate.html",
                controller: "CoverageController"
            })
            .state("coverage.dropoutrate", {
                url: "/dropoutrate",
                templateUrl: "coverage/templates/dropoutrate.html",
                controller: "CoverageController"
            })
            .state("coverage.underimmunized", {
                url: "/underimmunized",
                templateUrl: "coverage/templates/underimmunized.html",
                controller: "CoverageController"
            })

            .state("coverage.unimmunized", {
                url: "/unimmunized",
                templateUrl: "coverage/templates/unimmunized.html",
                controller: "CoverageController"
            })

        }
]);

var services = angular.module("services", []);
