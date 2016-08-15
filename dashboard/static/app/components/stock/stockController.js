angular.module('dashboard')
    .controller('StockController', ['$scope', 'StockService', '$rootScope', 'NgTableParams', 'FilterService', 'MonthService',
    function($scope, StockService, $rootScope, NgTableParams, FilterService, MonthService)
    {
        var vm = this;
        var shellScope = $scope.$parent;
        shellScope.child = $scope;

        // Todo: Use this to sort by performance (Malisa)
        vm.SortByKey = function(array, key) {
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        };

        vm.getStockByDistrict = function(startMonth, endMonth, district, vaccine) {

            vm.startMonth ? vm.startMonth : "Nov 2015";
            vm.endMonth = vm.endMonth ? vm.endMonth : "Dec 2016";
            //Todo: Temporarily disable filtering by district for the table
            district = ""
            vm.district = "";
            vm.vaccine = vm.selectedVaccine ? vm.selectedVaccine.name : "";

            StockService.getStockByDistrict(startMonth, endMonth, district, vaccine)
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
            });
        };

        vm.getStockByMonth = function(startMonth, endMonth, district, vaccine) {
            vm.startMonth ? vm.startMonth : "Nov 2015";
            vm.endMonth = vm.endMonth ? vm.endMonth : "Dec 2016";
            vm.district = vm.selectedDistrict ? vm.selectedDistrict.name : "";
            vm.vaccine = vm.selectedVaccine ? vm.selectedVaccine.name : "";

            StockService.getStockByMonth(startMonth, endMonth, district, vaccine)
                .then(function(data) {

                vm.data = angular.copy(data);

                // construct graph data
                var graphdata = [];
                var series = [];
                for (var i = 0; i < vm.data.length ; i++) {
                    series.push([MonthService.getMonthName(vm.data[i].period_month), vm.data[i].at_hand])
                }
                graphdata.push({
                        key: "Stock At Hand",
                        values: series
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
                            stacked: false,
                            showControls: false,
                            margin : {
                                top: 20,
                                right: 20,
                                bottom: 45,
                                left: 65
                            },
                            groupSpacing: 0.2,
                            rotateLabels: 0,
                            staggerLabels: true,
                            x: function(d){ return d[0]; },
                            y: function(d){ return d[1]; },
                            showValues: true,
                            valueFormat: function(d){
                                return tickFormat(d3.format(',.1f'));
                            },
                            transitionDuration: 500,
                        }
                };

            });
        };

        $scope.$on('refresh', function(e, startMonth, endMonth, district, vaccine) {
            if(startMonth.name)
            {
                vm.getStockByDistrict(startMonth.name, endMonth.name, district.name, vaccine.name);
                vm.getStockByMonth(startMonth.name, endMonth.name, district.name, vaccine.name);
            }
        });

    }

]);


angular.module('dashboard')
    .controller('AmcController', ['$scope', 'StockService', '$rootScope', 'NgTableParams', 'FilterService',
    function($scope, StockService, $rootScope, NgTableParams, FilterService)
       {
    var vm = this;
        var shellScope = $scope.$parent;
        shellScope.child = $scope;

        vm.getAmc = function(startMonth, endMonth, district, vaccine) {
            vm.startMonth ? vm.startMonth : "Nov 2015";
            vm.endMonth = vm.endMonth ? vm.endMonth : "Dec 2015";
            vm.district = vm.selectedDistrict ? vm.selectedDistrict.name : "";
            vm.vaccine = vm.selectedVaccine ? vm.selectedVaccine.name : "";

            StockService.getAmc(startMonth, endMonth, district, vaccine)
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
    .controller('MonthsStockLeftController', ['$scope', 'StockService', '$rootScope',
    function($scope, StockService, $rootScope)
    {
    }


]);



angular.module('dashboard')
    .controller('UptakeRateController', ['$scope', 'StockService', '$rootScope',
    function($scope, StockService, $rootScope)
    {
    }


]);



angular.module('dashboard')
    .controller('WastageRateController', ['$scope', 'StockService', '$rootScope',
    function($scope, StockService, $rootScope)
    {
    }


]);
