angular.module('dashboard')
.controller('UnepiController', [
    '$scope', 'CoverageService','StockService',
    'MonthService', '$rootScope', 'NgTableParams',
    'FilterService', 'FridgeService',
    function($scope, CoverageService, StockService,
        MonthService, $rootScope, NgTableParams,
        FilterService, FridgeService)
    {
        var vm = this;
        var shellScope = $scope.$parent;
        shellScope.child = $scope;

        function periodDisplay(period)
        {
            var month = parseInt(period.slice(4,6));
            return MonthService.getMonthName(month) + " " + period.slice(0,4)
        }


        vm.getUnepiCoverage = function(period, district, vaccine) {
            vm.endMonth=period;


            for (var i = 0; i <= period ; i++)
            {}
            shellScope.child.periodMonth = periodDisplay(vm.endMonth);

            CoverageService.getUnepiCoverage(period, district, vaccine)
            .then(function (data) {

                vm.vaccine = "";


                if (vm.vaccine = "PENTA"){
                    vaccine = 'DPT3'

                }


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
                    shellScope.child.district = district;

                    var Pent3 =[];
                    var pc3 = [];
                    shellScope.child.Gap = 0;
                    shellScope.child.dropout_Penta = 0;
                    shellScope.child.dropout_hpv = 0;
                    shellScope.child.category = 0;

                    for (var i = 0; i < vm.data.length ; i++){
                        if (vm.data[i].vaccine == "PENTA"){
                            Pent3 = vm.data[i].coverage_rate
                            shellScope.child.dropout_Penta = vm.data[i].drop_out_rate
                            shellScope.child.category = vm.data[i].red_category
                        }
                        else if (vm.data[i].vaccine == "PCV"){
                            pc3 = vm.data[i].coverage_rate
                        }
                        else if (vm.data[i].vaccine == "HPV"){
                            shellScope.child.dropout_hpv = vm.data[i].drop_out_rate
                        }
                        shellScope.child.Gap = Pent3 - pc3;
                    }


                });
            };

            vm.getUnepiStock = function(endMonth, district) {

                vm.endMonth = vm.endMonth ? vm.endMonth : "";

                StockService.getUnepiStock( endMonth, district)
                .then(function(data) {

                    var tabledataAllstock = [];
                    vm.data = angular.copy(data);



                    tabledataAllstock = vm.data.filter(
                        function (value) {
                            return value;
                        });

                        vm.tableParamsStock = new NgTableParams({
                            page: 1,
                            count: 10
                        }, {
                            filterDelay: 0,
                            counts: [],
                            data: tabledataAllstock,
                        });

                        shellScope.child.Antigen_stockedout = 0;

                        for (var i = 0; i < vm.data.length ; i++){
                            if (vm.data[i].Months_stock == 0){
                                shellScope.child.Antigen_stockedout++;

                            }


                        }

                    });
                };

                vm.getUnepiColdChain = function(endMonth, district) {

                    //Change the district name to match Cold Chain District filter
                    //Probably a bug that can be solved in the future
                    district = district.replace(" District", "").toUpperCase()

                    var per = function(value, total) {
                        var percentage = (value/total) * 100;
                        return Math.round(percentage * 10) / 10;
                    }

                    FridgeService.getFridgeFacilityCapacity(undefined, endMonth, district, undefined)
                    .then(function(data) {
                        var metrics = FridgeService.getFridgeCapacityMetrics(data);

                        shellScope.child.cold_chain_total = metrics.total;

                        shellScope.child.cold_chain_surplus = per(metrics.surplus, metrics.total);
                        shellScope.child.cold_chain_sufficient = per(metrics.sufficient, metrics.total);
                        shellScope.child.cold_chain_shortage = per(metrics.shortage, metrics.total);
                    });
                };


                $scope.$on('refresh', function(e, startMonth, endMonth, district, vaccine) {
                    if(startMonth.name && endMonth.name && district.name && vaccine.name)
                    {

                        vm.getUnepiCoverage(endMonth.period, district.name, vaccine.name);
                        vm.getUnepiStock(endMonth.name, district.name, vaccine.name);
                        vm.getUnepiColdChain(endMonth.name, district.name);

                    }
                });

            }
        ]);
