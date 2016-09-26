angular.module('coverage').
controller('CoverageController', ['$scope', 'StockService', '$httpParamSerializer', 'FilterService',
    function($scope, StockService, $httpParamSerializer, FilterService) {
        $scope.vaccine = "MEASLES";
        $scope.displayMonth = function(month) {
            return "MONTH " + month.number + " '" + month.year;
        };


    }
]);

angular.module('coverage')
    .controller('DropoutRateController', ['$scope', 'StockService', '$rootScope', 'FilterService',
    function($scope, StockService, $rootScope, FilterService)
    {
    }


]);


angular.module('coverage')
    .controller('UnderImmunizedController', ['$scope', 'StockService', '$rootScope', 'FilterService',
    function($scope, StockService, $rootScope, FilterService)
    {
    }


]);