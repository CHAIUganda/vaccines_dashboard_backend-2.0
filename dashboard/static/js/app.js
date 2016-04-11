var dashboard = angular.module("dashboard", ["ui.router", "chart.js", "ui.bootstrap", "checklist-model", "angularChart", "ngTable", "services"]);
dashboard.config(["$stateProvider", "$urlRouterProvider",
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/reportingRate");
        $urlRouterProvider.when("", "/reportingRate");
        $stateProvider
            .state("home", {
                url: "",
                templateUrl: "/static/views/main.html",
                controller: "HomeController"
            }).state("home.reportingRate", {
                url: "/reportingRate",
                templateUrl: "/static/views/reporting_rate.html"
            }).state("home.webVsPaper", {
                url: "/webVsPaper",
                templateUrl: "/static/views/web_vs_paper.html"
            }).state("home.guidlineAdherenceRate", {
                url: "/guidlineAdherenceRate",
                templateUrl: "/static/views/guidlineAdherenceRate.html"
            }).state("home.addTests", {
                url: "/addTests",
                templateUrl: "/static/views/addTests.html"
            });
    }
]);

var services = angular.module("services", []);