angular.module('dashboard')
    .controller('StockController', ['$scope', 'ReportService', '$rootScope',
    function($scope, ReportService, $rootScope)
    {



        ReportService.getMonths().then(function(data) {
            $scope.months = data;
            //$scope.months = data.values;
            //$scope.startMonth = $scope.months[6 - 1];
            //$scope.endMonth = $scope.selectedCycle = data.most_recent_cycle;
        });

        ReportService.getVaccines().then(function(data) {
            $scope.vaccines = data;
            //$scope.months = data.values;
            //$scope.startMonth = $scope.months[6 - 1];
            //$scope.endMonth = $scope.selectedCycle = data.most_recent_cycle;
        });



        $scope.startMonth = "";
        $scope.endMonth = "";
        $scope.vaccine = "";

    }


]);



angular.module('dashboard')
    .controller('AmcController', ['$scope', 'ReportService', '$rootScope',
    function($scope, ReportService, $rootScope)
    {
    }


]);



angular.module('dashboard')
    .controller('MonthsStockLeftController', ['$scope', 'ReportService', '$rootScope',
    function($scope, ReportService, $rootScope)
    {
    }


]);



angular.module('dashboard')
    .controller('UptakeRateController', ['$scope', 'ReportService', '$rootScope',
    function($scope, ReportService, $rootScope)
    {
    }


]);



angular.module('dashboard')
    .controller('WastageRateController', ['$scope', 'ReportService', '$rootScope',
    function($scope, ReportService, $rootScope)
    {
    }


]);
