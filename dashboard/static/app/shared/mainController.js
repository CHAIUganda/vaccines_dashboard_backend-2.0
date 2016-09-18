angular.module('dashboard')
    .controller('MainController', ['$scope', 'FilterService', '$rootScope',
    function($scope, FilterService, $rootScope)
    {
        $scope.sortType     = 'name'; // set the default sort type
        $scope.sortReverse  = false;  // set the default sort order
        $scope.searchText   = '';     // set the default search/filter term

        $scope.root = {};
        var shell = this;
        shell.startMonth = shell.startMonth ? shell.startMonth.name : "Nov 2015";
        shell.endMonth = shell.endMonth ? shell.endMonth.name : "Dec 2015";
        shell.selectedVaccine = "";
        shell.selectedDistrict = "";

        var date = new Date();
        defaultMonth = date.getMonth() - 2;

        shell.stockathand = 0;

        FilterService.getMonths().then(function(data) {
            shell.months = data;
            shell.startMonth = shell.months[0];
            shell.endMonth = shell.months[defaultMonth];
        });

        FilterService.getDistricts().then(function(data) {
            shell.districts = data;
            shell.selectedDistrict = shell.districts[0];
        });

        FilterService.getVaccines().then(function(data) {
            shell.vaccines = data;
            shell.selectedVaccine = shell.vaccines[6];
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
