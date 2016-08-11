angular.module('dashboard')
    .controller('StockController', ['$scope', 'ReportService', '$rootScope', 'NgTableParams', 'FilterService', 'MonthService',
    function($scope, ReportService, $rootScope, NgTableParams, FilterService, MonthService)
    {
        var vm = this;
        var shellScope = $scope.$parent;
        shellScope.child = $scope;

        vm.SortByKey = function(array, key) {
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        };

        vm.ValueOf = function(value) {
            return value >= 0;
        }

        vm.getMonthName = function(month){
            return MonthService.getMonthName(month);
        };

        vm.getStockTotals = function(startMonth, endMonth, district, vaccine) {
            vm.startMonth ? vm.startMonth : "Nov 2015";
            vm.endMonth = vm.endMonth ? vm.endMonth : "Dec 2016";
            vm.district = vm.selectedDistrict ? vm.selectedDistrict.name : "";
            vm.vaccine = vm.selectedVaccine ? vm.selectedVaccine.name : "";

            ReportService.getStockTotals(startMonth, endMonth, district, vaccine)
                .then(function(data) {

                vm.data = angular.copy(data);
                vm.tableParams = new NgTableParams({
                    page: 1,
                    count: 15
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: vm.data,
                });


                // calculate totals
                var total = 0;
                for(var i = 0; i < vm.data.length; i++){
                    var units = vm.data[i].at_hand;
                    total += units;
                }

                shellScope.child.stockathand = total;
                var worstPerforming = vm.SortByKey(vm.data, 'min_variance')
                        .filter(function IfGreatetThanZero(value, index, ar) {
                                        if (value == 0) {
                                            return false;
                                        }
                                    return true;
                                }).slice(0, 10)

                // construct graph data
                var graphdata = [];
                var at_hand_values = []
                for (var i = 0; i < 10 ; i++) {
                    at_hand_values.push([worstPerforming[i].district_name, worstPerforming[i].at_hand])
                }
                graphdata.push({
                        key: "At Hand",
                        values: at_hand_values
                });

                var min_variance_values = []
                for (var i = 0; i < 10 ; i++) {
                    min_variance_values.push([worstPerforming.district_name, worstPerforming.stock_requirement__minimum])
                }
                graphdata.push({
                        key: "Max",
                        values: min_variance_values
                });
                vm.graph = graphdata;

                // update graph
                vm.options = {
                        chart: {
                            type: 'multiBarChart',
                            height: 600,

                            title: {
                                enable: true,
                                text: 'VACCINE STOCK ON HAND'
                            },
                            showLegend: true,
                            stacked: true,
                            showControls: false,
                            margin : {
                                top: 20,
                                right: 20,
                                bottom: 45,
                                left: 65
                            },
                            groupSpacing: 0.2,
                            rotateLabels: -45,
                            staggerLabels: true,
                            x: function(d){ return d[0]; },
                            y: function(d){ return d[1]; },
                            showValues: true,
                            valueFormat: function(d){
                                return d3.format(',.1f')(d);
                            },
                            transitionDuration: 500,
                        }
                };


            });
        }

        $scope.$on('refresh', function(e, startMonth, endMonth, district, vaccine) {
            if(startMonth.name)
            {
                vm.getStockTotals(startMonth.name, endMonth.name, district.name, vaccine.name);
            }
        });


    }

]);


angular.module('dashboard')
    .controller('AmcController', ['$scope', 'ReportService', '$rootScope', 'NgTableParams', 'FilterService',
    function($scope, ReportService, $rootScope, NgTableParams, FilterService)
       {
    var vm = this;
        var shellScope = $scope.$parent;
        shellScope.child = $scope;

        vm.getAmc = function(startMonth, endMonth, district, vaccine) {
            vm.startMonth ? vm.startMonth : "Nov 2015";
            vm.endMonth = vm.endMonth ? vm.endMonth : "Dec 2015";
            vm.district = vm.selectedDistrict ? vm.selectedDistrict.name : "";
            vm.vaccine = vm.selectedVaccine ? vm.selectedVaccine.name : "";

            ReportService.getAmc(startMonth, endMonth, district, vaccine)
                .then(function(data) {

                vm.data = angular.copy(data);
                vm.tableParams = new NgTableParams({
                    page: 1,
                    count: 15
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: vm.data,
                });





                // construct graph data
                var graphdata = [];
                for (var j = 0; j < 5   ; j++) {
                    graphdata.push({
                        key: vm.data[j].vaccine_category__vaccine__name,
                        values: [
                            [ vm.data[j].vaccine_category__vaccine__name , vm.data[j].consumption ]
                        ]
                    });
                }
                vm.graph = graphdata;

                // update graph
                vm.options = {
                        chart: {
                            type: 'multiBarChart',
                            height: 600,
                            title: {
                                enable: true,
                                text: 'VACCINE STOCK ON HAND'
                            },
                            showLegend: true,

                            showControls: false,
                            margin : {
                                top: 20,
                                right: 20,
                                bottom: 45,
                                left: 45
                            },
                            groupSpacing: 0,
                            rotateLabels: -45,
                            staggerLabels: true,
                            x: function(d){ return d[0]; },
                            y: function(d){ return d[1]; },
                            showValues: true,
                            valueFormat: function(d){
                                return d3.format(',.4f')(d);
                            },
                            transitionDuration: 500
                        }
                };


            });
        };

        $scope.$on('refresh', function(startMonth, endMonth, district, vaccine) {
            if(startMonth.name)
            {
                vm.getAmc(startMonth.name, endMonth.name, district.name, vaccine.name);
            }
        });


    }

]);

angular.module('dashboard')
    .controller('MonthsStockLeftController', ['$scope', 'ReportService', '$rootScope',
    function($scope, ReportService, $rootScope)
    {
    }


]);



angular.module('dashboard')
    .controller('UptakeRateController', ['$scope', 'ReportService', '$rootScope',
    function($scope, ReportService, $rootScope)
    {
    }


]);



angular.module('dashboard')
    .controller('WastageRateController', ['$scope', 'ReportService', '$rootScope',
    function($scope, ReportService, $rootScope)
    {
    }


]);
