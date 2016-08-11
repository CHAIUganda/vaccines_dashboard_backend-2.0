angular.module('dashboard')
    .controller('FridgeController', ['$scope', 'StockService', '$rootScope', 'FilterService',
    function($scope, StockService, $rootScope, FilterService)
    {
        $scope.selectedDistrict = "";

    }


]);
