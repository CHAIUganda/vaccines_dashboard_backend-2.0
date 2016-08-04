angular.module('dashboard').
controller('CoverageController', ['$scope', 'ReportService', '$httpParamSerializer', 'FilterService',
    function($scope, ReportService, $httpParamSerializer, FilterService) {
        $scope.vaccine = "MEASLES";
        $scope.displayMonth = function(month) {
            return "MONTH " + month.number + " '" + month.year;
        };


    }
]);

angular.module('dashboard')
    .controller('DropoutRateController', ['$scope', 'ReportService', '$rootScope', 'FilterService',
    function($scope, ReportService, $rootScope, FilterService)
    {
    }


]);


angular.module('dashboard')
    .controller('UnderImmunizedController', ['$scope', 'ReportService', '$rootScope', 'FilterService',
    function($scope, ReportService, $rootScope, FilterService)
    {
    }


]);