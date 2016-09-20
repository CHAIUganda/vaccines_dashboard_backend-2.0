angular.module('dashboard').
controller('CoverageController', ['$scope', 'StockService', '$httpParamSerializer', 'FilterService',
    function($scope, StockService, $httpParamSerializer, FilterService) {
        $scope.vaccine = "MEASLES";
        $scope.displayMonth = function(month) {
            return "MONTH " + month.number + " '" + month.year;
        };


    }
]);

angular.module('dashboard')
    .controller('DropoutRateController', ['$scope', 'StockService', '$rootScope', 'FilterService',
    function($scope, StockService, $rootScope, FilterService)
    {
    }


]);


angular.module('dashboard')
    .controller('UnderImmunizedController', ['$scope', 'StockService', '$rootScope', 'FilterService',
    function($scope, StockService, $rootScope, FilterService)
    {
    }


]);