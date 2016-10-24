angular.module('dashboard')
    .controller('MainController', ['$scope', 'FilterService', '$rootScope',
    function($scope, FilterService, $rootScope)
    {
        $scope.sortType     = 'name'; // set the default sort type
        $scope.sortReverse  = false;  // set the default sort order
        $scope.searchText   = '';     // set the default search/filter term

        $scope.root = {};
        var shell = this;

        //=== Stock Management =======
        shell.startMonth = shell.startMonth ? shell.startMonth.name : "Nov 2015";
        shell.endMonth = shell.endMonth ? shell.endMonth.name : "Dec 2015";
        shell.selectedVaccine = "";
        shell.selectedDistrict = "";

        var date = new Date();
        defaultMonth = date.getMonth() - 2;

        shell.myname = "Stephen";
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

        //==== End Stock Management =====

        //=== Cold chain ======
        shell.startQuarter = shell.startQuarter ? shell.startQuarter.name : "201601";
        shell.endQuarter = shell.endQuarter ? shell.endQuarter.name : "201603";
        shell.selectedFridgeDistrict = "";
        shell.thefridge = "";
        shell.selectedFridgeCareLevel = "";


        FilterService.getFridgeDistricts().then(function(data) {
            shell.fridgeDistricts = data;
            shell.thefridge = shell.fridgeDistricts[1].district;
            shell.selectedFridgeDistrict = shell.fridgeDistricts[1];
        });

        FilterService.getFridgeCareLevels().then(function(data) {
            shell.fridgeCareLevels = data;
            //shell.selectedFridgeCareLevel = shell.fridgeCareLevels[0];
        });

        FilterService.getFridgeQuarters().then(function(data) {
            shell.fridgeQuarters = data;
            //shell.selectedFridgeQuarter = shell.fridgeQuarters[0];
        });

        //==== End Cold Chain =======


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

        $scope.$watch('shell.endQuarter', function() {
            if (shell.endQuarter) {
                $rootScope.$broadcast('refreshCapacity', shell.startQuarter, shell.endQuarter, shell.thefridge, shell.selectedFridgeCareLevel);
            }
        }, true);

        $scope.$watchGroup(['shell.endQuarter', 'shell.selectedFridgeCareLevel', 'shell.thefridge'], function(data){
            if(data[0] && data[1] && data[2]){
                if (shell.endQuarter) {
                    $rootScope.$broadcast('refreshCapacity', shell.startQuarter, shell.endQuarter, shell.thefridge, shell.selectedFridgeCareLevel);
                }
            }
        });
    }
]);
