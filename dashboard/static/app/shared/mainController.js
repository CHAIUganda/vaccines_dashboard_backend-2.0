angular.module('dashboard')
    .controller('MainController', ['$scope', 'FilterService', '$rootScope',
    function($scope, FilterService, $rootScope)
    {
        var shell = this;

        FilterService.getMonths().then(function(data) {
            shell.months = data;
            shell.startMonth = $scope.months[0];
            shell.endMonth = $scope.months[0];

        });

        FilterService.getDistricts().then(function(data) {
            shell.districts = data;
            shell.districts.unshift({"name": ""});
            shell.selectedDistrict = $scope.districts[0];
        });

        FilterService.getVaccines().then(function(data) {
            shell.vaccines = data;
            shell.vaccines.unshift({"name": ""});
            shell.selectedVaccine = $scope.vaccines[0];
        });

        shell.selectedVaccine = "";
        shell.selectedDistrict = "";
        shell.startMonth = "";
        shell.startMonth = "";

    }
]);
