var dashboard = angular.module("dashboard", ["ui.router", "chart.js", "ui.bootstrap", "checklist-model", "angularChart", "ngTable", "services"]);
dashboard.config(["$stateProvider", "$urlRouterProvider",
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/coverage");
        $urlRouterProvider.when("", "/coverage");
        $stateProvider
            .state("home", {
                url: "",
                templateUrl: "/static/views/coverage/main.html",
                controller: "HomeController"
            }).state("home.coverage", {
                url: "/coverage",
                templateUrl: "/static/views/coverage/coverage.html"
            }).state("home.dropoutrate", {
                url: "/dropoutrate",
                templateUrl: "/static/views/coverage/dropoutrate.html"
            }).state("home.underimmunized", {
                url: "/underimmunized",
                templateUrl: "/static/views/coverage/underimmunized.html"
            });
            //.state("home.addTests", {
            //    url: "/addTests",
            //    templateUrl: "/static/views/coverage/addTests.html"
            //});
    }
]);

var services = angular.module("services", []);