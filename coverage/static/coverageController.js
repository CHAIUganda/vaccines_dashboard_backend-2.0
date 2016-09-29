angular.module('coverage').
controller('coverageController', ['$scope', 'coverageService', '$httpParamSerializer', 'FilterService',
    function($scope, coverageService, $httpParamSerializer, FilterService) {
        $scope.vaccine = "MEASLES";
        $scope.displayMonth = function(month) {
            return "MONTH " + month.number + " '" + month.year;
        };


    }
]);
