angular.module('dashboard')
    .controller('UnepiController', ['$scope', 'CoverageService','StockService', '$rootScope', 'NgTableParams', 'FilterService',
    function($scope, CoverageService, StockService, $rootScope, NgTableParams, FilterService)
    {
        var vm = this;
        var shellScope = $scope.$parent;
        shellScope.child = $scope;


        vm.getUnepiCoverage = function(period, district) {
            vm.endMonth=period;


            CoverageService.getUnepiCoverage(period, district)
                .then(function (data) {

                    var tabledataAlldoses = [];

                    vm.data = angular.copy(data);

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

                    var Pent3 =[];
                    var pc3 = [];
                    shellScope.child.Gap = 0;
                    shellScope.child.dropout_Penta = 0;
                    shellScope.child.dropout_hpv = 0;
                    shellScope.child.category = 0;

                    for (var i = 0; i < vm.data.length ; i++){
                        if (vm.data[i].vaccine__name == "PENTA"){
                            Pent3 = vm.data[i].coverage_rate
                            shellScope.child.dropout_Penta = vm.data[i].drop_out_rate
                            shellScope.child.category = vm.data[i].Red_category
                        }
                        else if (vm.data[i].vaccine__name == "PCV"){
                            pc3 = vm.data[i].coverage_rate
                        }
                        else if (vm.data[i].vaccine__name == "HPV"){
                            shellScope.child.dropout_hpv = vm.data[i].drop_out_rate
                        }
                        shellScope.child.Gap = Pent3 - pc3;
                    }


                });
        };


        $scope.$on('refresh', function(e, startMonth, endMonth, district, vaccine) {
            if(startMonth.name && endMonth.name && district.name && vaccine.name)
                {

                    vm.getUnepiCoverage(endMonth.period, district.name, vaccine.name);


                }
            });

        }
    ]);
