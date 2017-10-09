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

                /*
                Cold Chain & Unepi District filters used different data sources
                For that reason to use the Cold Chain api, the district name
                has to be reformatted to match the cold chain district filter.
                @Todo: Standardize the district values
                */
                vm.parseDistrict = function(district) {
                    return district.replace(" District", "").toUpperCase();
                };

                vm.getUnepiColdChainCapacity = function(endMonth, district) {
                    district = vm.parseDistrict(district);

                    FridgeService.getFridgeFacilityCapacity(undefined, endMonth, district, undefined)
                    .then(function(data) {
                        var metrics = FridgeService.getFridgeCapacityMetrics(data);

                        shellScope.child.cold_chain_total = metrics.total;

                        shellScope.child.cold_chain_surplus =
                            appHelpers.per(metrics.surplus, metrics.total);

                        shellScope.child.cold_chain_sufficient =
                            appHelpers.per(metrics.sufficient, metrics.total);

                        shellScope.child.cold_chain_shortage =
                            appHelpers.per(metrics.shortage, metrics.total);
                    });
                };

                vm.getUnepiColdChainFunctionality = function(endMonth, district) {
                    district = vm.parseDistrict(district);

                    FridgeService.getFridgeDistrictRefrigerator(undefined, endMonth, district, undefined)
                    .then(function(data) {

                        var total_working = data[0].number_existing - data[0].not_working;
                        var total_existing = data[0].number_existing

                        shellScope.child.cold_chain_functionality =
                            appHelpers.per(total_working, total_existing);
                    });
                };

                vm.enablePDFDownload = function() {
                        shellScope.child.downloadPDF = function() {
                            var pdf = new jsPDF('p', 'mm');
                            pdf.addHTML(document.getElementById("unepiReport"), function() {
                              pdf.save('unepi-report.pdf');
                            });
                        }
                };

                $scope.$on('refresh', function(e, startMonth, endMonth, district, vaccine) {
                    if(startMonth.name && endMonth.name && district.name && vaccine.name)
                    {
                        /* Quick hack should be fixed in the future.
                        Coverage needs to default to ALL and yet this requires a district*/
                        if (district.name == 'ALL') {
                            district.name = 'Abim District';
                        }
                        vm.getUnepiCoverage(endMonth.period, district.name, vaccine.name);
                        vm.getUnepiStock(endMonth.name, district.name, vaccine.name);
                        vm.getUnepiColdChainCapacity(endMonth.name, district.name);
                        vm.getUnepiColdChainFunctionality(endMonth.name, district.name);
                        vm.enablePDFDownload();
                    }
                });

            }
        ]);
