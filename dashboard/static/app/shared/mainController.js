angular.module('dashboard')
    .controller('MainController', ['$scope', 'FilterService', '$rootScope',
    function($scope, FilterService, $rootScope)
    {
        $scope.root = {};
        var shell = this;
        shell.startMonth = shell.startMonth ? shell.startMonth.name : "Nov 2015";
        shell.endMonth = shell.endMonth ? shell.endMonth.name : "Dec 2015";
        shell.selectedVaccine = "";
        shell.selectedDistrict = "";

        shell.stockathand = 0;

        FilterService.getMonths().then(function(data) {
            shell.months = data;
            shell.startMonth = shell.months[0];
            shell.endMonth = shell.months[5];
        });

        FilterService.getDistricts().then(function(data) {
            shell.districts = data;
            shell.districts.unshift({"name": ""});
            shell.selectedDistrict = shell.districts[0];
        });

        FilterService.getVaccines().then(function(data) {
            shell.vaccines = data;
            shell.selectedVaccine = shell.vaccines[0];
        });


        $scope.$watch('shell.endMonth', function() {
            if (shell.endMonth) {
                $rootScope.$broadcast('refresh', shell.startMonth, shell.endMonth, shell.selectedDistrict, shell.selectedVaccine);
            }
        }, true);

        $scope.$watchGroup(['shell.endMonth', 'shell.selectedVaccine', 'shell.selectedDistrict'], function(data){
            if(data[0] && data[1] && data[2]){
                if (shell.endMonth) {
                    $rootScope.$broadcast('refresh', shell.startMonth, shell.endMonth, shell.selectedDistrict, shell.selectedVaccine);
                }
            }
        });
    }
]);
