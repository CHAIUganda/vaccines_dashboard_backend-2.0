angular.module('dashboard')
    .controller('StockController', ['$scope', 'ReportService', '$rootScope', 'NgTableParams', 'FilterService', 'MonthService',
    function($scope, ReportService, $rootScope, NgTableParams, FilterService, MonthService)
    {
        var vm = this;
        var shellScope = $scope.$parent;
        shellScope.child = $scope;

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
                    var units = vm.data[i].consumed;
                    total += units;
                }

                shellScope.child.consumed = total;

                // construct graph data
                var graphdata = [];
                for (var i = 0; i < 3   ; i++) {
                    if(vm.data.length == 0)
                        break;

                    var month = vm.data[i].period.toString().substr(4, 2)
                    graphdata.push({
                        key: vm.data[i].period,
                        values: [
                            [ vm.getMonthName(month), vm.data[i].consumed]
                        ]
                    });
                }
                vm.graph = null;
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
                                left: 65
                            },
                            groupSpacing: 0,
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
