dashboard.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $urlRouterProvider.when("", "unepi/download");

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

            .state("planning", {
                url: "/planning",
                templateUrl: "static/app/components/planning/plan.html",
                controller: "PlanningController"
            })
            .state("planning.awp", {
                url: "/awp",
                templateUrl: "static/app/components/planning/awp.html",
                controller: "PlanningController"
            })
            .state("planning.priority", {
                url: "/priority",
                templateUrl: "static/app/components/planning/priority.html",
                controller: "PlanningController"
            })
            .state("unepi", {
                url: "/unepi",
                templateUrl: "static/app/components/unepi/report.html",
                controller: "UnepiController"
            })
            .state("unepi.download", {
                url: "/download",
                templateUrl: "static/app/components/unepi/download.html",
                controller: "UnepiController"
            })
        ;
    }
]);

var services = angular.module("services", []);
