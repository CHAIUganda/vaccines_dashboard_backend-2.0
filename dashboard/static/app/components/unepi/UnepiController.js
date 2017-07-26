angular.module('dashboard')
    .controller('UnepiController', ['$scope','$location', 'StockService', '$rootScope', 'NgTableParams', 'FilterService', 'MonthService', 'CoverageService',
    function($scope,$location, StockService, $rootScope, NgTableParams, FilterService, MonthService, CoverageService)
    {
        var vm = this;
        var shellScope = $scope.$parent;
        shellScope.child = $scope;

        vm.getVaccineDosesByDistrict = function(period, district, vaccine) {
            district = ""
            vm.district = district;
            vm.vaccine = vaccine;

            CoverageService.getVaccineDosesByDistrict(period, district, vaccine)
                .then(function(data) {
                    tabledataAlldoses = vm.data.filter(
                        function (value) {
                            return value;
                        });

                    vm.tableParamsDoses = new NgTableParams({
                        page: 1,
                        count: 10
                    }, {
                        filterDelay: 0,
                        counts: [],
                        data: tabledataAlldoses,
                    });


                });
        };

        $scope.$on('refreshUnepi', function(e, startMonth, endMonth, district, vaccine) {
            if(startMonth.name && endMonth.name && district.name && vaccine.name)
            {
                vm.getVaccineDosesByDistrict(endMonth.period, district.name, vaccine.name);


            }
        });

    }

]);
