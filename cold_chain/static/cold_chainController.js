angular.module('cold_chain')
    .controller('FridgeController', ['$scope', 'StockService', '$rootScope', 'FilterService',
    function($scope, StockService, $rootScope, FilterService)
    {
        $scope.selectedDistrict = "";

    }


]);
