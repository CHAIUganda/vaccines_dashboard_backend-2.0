angular.module('dashboard')
    .controller('UnepiController', ['$scope', 'CoverageService','StockService', 'MonthService', '$rootScope', 'NgTableParams', 'FilterService',
    function($scope, CoverageService, StockService, MonthService, $rootScope, NgTableParams, FilterService)
    {
        var vm = this;
        var shellScope = $scope.$parent;
        shellScope.child = $scope;

        function periodDisplay(period)
        {
            var month = parseInt(period.slice(4,6));
            return MonthService.getMonthName(month) + " " + period.slice(0,4)
        }


        vm.getUnepiCoverage = function(period, district) {
            vm.endMonth=period;

            for (var i = 0; i <= period ; i++)
            {}
            shellScope.child.periodMonth = periodDisplay(vm.endMonth);

            CoverageService.getUnepiCoverage(period, district)
                .then(function (data) {



                    var tabledataAlldoses = [];

                    vm.data = angular.copy(data);

                    for (var j = 0; j < vm.data.length ; j++){
                        if (vm.data[j].vaccine == "PENTA"){
                            vm.data[j].vaccine="DPT3"
                        }
                        else if  (vm.data[j].vaccine == "HPV")  {
                            vm.data[j].vaccine="HPV2"
                        }
                        else if  (vm.data[j].vaccine == "PCV")  {
                            vm.data[j].vaccine="PCV3"
                        }
                        else if  (vm.data[j].vaccine == "TT")  {
                            vm.data[j].vaccine="TT2+Pregnant"
                        }
                    }

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

                    for (var j = 0; j < vm.data.length ; j++){
                        if (vm.data[j].vaccine == "PENTA"){
                            vm.data[j].vaccine="DPT3"
                        }
                    }

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




        $scope.$on('refresh', function(e, startMonth, endMonth, district, vaccine) {
            if(startMonth.name && endMonth.name && district.name && vaccine.name)
                {

                    vm.getUnepiCoverage(endMonth.period, district.name, vaccine.name);
                    vm.getUnepiStock(endMonth.name, district.name, vaccine.name);


                }
            });

        }
    ]);
