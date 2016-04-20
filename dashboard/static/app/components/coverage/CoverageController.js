angular.module('CoverageApp').
controller('CoverageController', ['$scope', 'ReportService', '$httpParamSerializer', 'NgTableParams',
    function($scope, ReportService, $httpParamSerializer, NgTableParams) {
        $scope.vaccine = "MEASLES";
        $scope.displayMonth = function(month) {
            return "MONTH " + month.number + " '" + month.year;
        };

        $scope.selectBest = function(name) {
            $scope.bestPerforming = name;
        };

        ReportService.getMonths().then(function(data) {
            $scope.months = data;
            //$scope.months = data.values;
            //$scope.startMonth = $scope.months[6 - 1];
            //$scope.endMonth = $scope.selectedCycle = data.most_recent_cycle;
        });

    }
]);

angular.module('CoverageApp')
    .controller('DropoutRateController', ['$scope', 'ReportService', '$rootScope',
    function($scope, ReportService, $rootScope)
    {
    }


]);


angular.module('CoverageApp')
    .controller('UnderImmunizedController', ['$scope', 'ReportService', '$rootScope',
    function($scope, ReportService, $rootScope)
    {
    }


]);