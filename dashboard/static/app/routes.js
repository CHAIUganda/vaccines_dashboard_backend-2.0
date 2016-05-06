dashboard.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $urlRouterProvider.when("", "coverage/coverage");

        $stateProvider
            .state("coverage", {
                url: "/coverage",
                templateUrl: "static/app/components/coverage/main.html",
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
            })
            .state("stock", {
                url: "/stock",
                templateUrl: "static/app/components/stock/stock.html",
                controller: "StockController"
            })
            .state("stock.home", {
                url: "/stockonhand",
                templateUrl: "static/app/components/stock/stockonhand.html",
                controller: "StockController"
            })
            .state("stock.amc", {
                url: "/amc",
                templateUrl: "static/app/components/stock/amc.html",
                controller: "AmcController"
            })
            .state("stock.monthsleft", {
                url: "/monthsleft",
                templateUrl: "static/app/components/stock/monthsstockleft.html",
                controller: "MonthsStockLeftController"
            })
            .state("stock.uptakerate", {
                url: "/uptakerate",
                templateUrl: "static/app/components/stock/uptakerate.html",
                controller: "UptakeRateController"
            })
            .state("stock.wastagerate", {
                url: "/wastagerate",
                templateUrl: "static/app/components/stock/wastagerate.html",
                controller: "WastageRateController"
            });
    }
]);

var services = angular.module("services", []);
