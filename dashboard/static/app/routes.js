dashboard.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $urlRouterProvider.when("", "stock/stockonhand");

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
                controller: "CoverageController"
            })
            .state("coverage.redcategory", {
                url: "/redcategory",
                templateUrl: "static/app/components/coverage/redcategory.html",
                controller: "CoverageController"
            })
            .state("coverage.notimmunized", {
                url: "/notimmunized",
                templateUrl: "static/app/components/coverage/notimmunized.html",
                controller: "CoverageController"
            })

            .state("stock", {
                url: "/stock",
                templateUrl: "static/app/components/stock/stock.html",
                controller: "StockController"
            })
            .state("stock.stockonhand", {
                url: "/stockonhand",
                templateUrl: "static/app/components/stock/stockonhand.html",
                controller: "StockController"
             })
            .state("stock.distribution", {
                url: "/distribution",
                templateUrl: "static/app/components/stock/distribution.html",
                controller: "StockController"
            })
            //.state("stock.consumption", {
            //    url: "/consumption",
            //    templateUrl: "static/app/components/stock/consumption.html",
            //    controller: "StockController"
            //})
            .state("stock.monthsleft", {
                url: "/monthsleft",
                templateUrl: "static/app/components/stock/monthsstockleft.html",
                controller: "MonthsStockLeftController"
            })
            .state("stock.uptakerate", {
                url: "/uptakerate",
                templateUrl: "static/app/components/stock/uptakerate.html",
                controller: "StockController"
            })

            .state("fridge", {
                url: "/fridge",
                templateUrl: "static/app/components/fridge/fridge.html",
                controller: "FridgeController"
            })
            .state("fridge.facilities", {
                url: "/facilities",
                templateUrl: "static/app/components/fridge/facilities.html",
                controller: "FridgeController"
            })
            .state("fridge.coverage", {
                url: "/coverage",
                templateUrl: "static/app/components/fridge/coverage.html",
                controller: "FridgeController"
            })
            .state("fridge.workingstatus", {
                url: "/workingstatus",
                templateUrl: "static/app/components/fridge/workingstatus.html",
                controller: "FridgeController"
            })
            .state("fridge.capacity", {
                url: "/capacity",
                templateUrl: "static/app/components/fridge/capacity.html",
                controller: "FridgeController"
            })

            .state("surveillance", {
                url: "/surveillance",
                templateUrl: "static/app/components/surveillance/surveillance.html",
                controller: "SurveillanceController"
            })
            .state("surveillance.cases", {
                url: "/cases",
                templateUrl: "static/app/components/surveillance/cases.html",
                controller: "SurveillanceController"
            })
        ;
    }
]);

var services = angular.module("services", []);
