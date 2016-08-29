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
                    if (vm.data[i].at_hand == 0)
                        total++;
                }

                shellScope.child.stockedout = (total / vm.data.length) * 100;

                // construct graph data
                var graphdata = [];
                var series = [];
                var min_series = [];
                var max_series = [];

                for (var i = 0; i < vm.data.length ; i++) {
                    series.push([vm.data[i].district_name, vm.data[i].at_hand])
                    min_series.push([vm.data[i].district_name, vm.data[i].stock_requirement__minimum])
                    max_series.push([vm.data[i].district_name, vm.data[i].stock_requirement__maximum])
                }
                graphdata.push({
                        key: "Min",
                        values: min_series
                });
                graphdata.push({
                        key: "Stock At Hand",
                        values: series
                });

                graphdata.push({
                        key: "Max",
                        values: max_series
                });

                vm.graph = graphdata;

                // update graph
                vm.options = {
                        chart: {
                            type: 'multiBarChart',
                            height: 500,

                            title: {
                                enable: true,
                                text: 'VACCINE STOCK ON HAND'
                            },
                            showLegend: true,
                            stacked: true,
                            showControls: true,
                            margin : {
                                top: 20,
                                right: 20,
                                bottom: 85,
                                left: 65
                            },
                            groupSpacing: 0.2,
                            rotateLabels: 45,
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
            if(startMonth.name && endMonth.name && district.name && vaccine.name)
            {
                vm.getStockByDistrict(startMonth.name, endMonth.name, district.name, vaccine.name);
            }
        });

    }

]);

angular.module('dashboard')
    .controller('MonthsStockLeftController', ['$scope', 'StockService', '$rootScope', 'NgTableParams', 'FilterService', 'MonthService',
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
                    if ((vm.data[i].at_hand/vm.data[i].stock_requirement__maximum) < 0.5)
                        total++;
                }

                shellScope.child.belowminimum = (total / vm.data.length) * 100;

                // construct graph data
                var graphdata = [];
                var series = [];
                var min_series = [];
                var max_series = [];

                for (var i = 0; i < vm.data.length ; i++) {
                    series.push([vm.data[i].district_name, vm.data[i].at_hand])
                    min_series.push([vm.data[i].district_name, vm.data[i].stock_requirement__minimum])
                    max_series.push([vm.data[i].district_name, vm.data[i].stock_requirement__maximum])
                }
                graphdata.push({
                        key: "Min",
                        values: min_series
                });
                graphdata.push({
                        key: "Stock At Hand",
                        values: series
                });

                graphdata.push({
                        key: "Max",
                        values: max_series
                });

                vm.graph = graphdata;

                // update graph
                vm.options = {
                        chart: {
                            type: 'multiBarChart',
                            height: 500,

                            title: {
                                enable: true,
                                text: 'VACCINE STOCK LEVELS'
                            },
                            showLegend: true,
                            stacked: true,
                            showControls: true,
                            margin : {
                                top: 20,
                                right: 20,
                                bottom: 85,
                                left: 65
                            },
                            groupSpacing: 0.2,
                            rotateLabels: 45,
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
            if(startMonth.name && endMonth.name && district.name && vaccine.name)
            {

                vm.getStockByDistrict(startMonth.name, endMonth.name, district.name, vaccine.name);
                vm.getStockByMonth(startMonth.name, endMonth.name, district.name, vaccine.name);
            }
        });

    }

]);

angular.module('dashboard')
    .controller('####', ['$scope', 'StockService', '$rootScope', 'NgTableParams', 'FilterService', 'MonthService',
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
                    count: 10
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
                    series.push([MonthService.getMonthName(vm.data[i].period_month), vm.data[i].consumed])
                }
                graphdata.push({
                        key: "Monthly Consumption",
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
            if(startMonth.name && endMonth.name && district.name && vaccine.name)
            {

                vm.getStockByDistrict(startMonth.name, endMonth.name, district.name, vaccine.name);
                vm.getStockByMonth(startMonth.name, endMonth.name, district.name, vaccine.name);
            }
        });

    }

]);

angular.module('dashboard')
    .controller('UptakeRateController', ['$scope', 'StockService', '$rootScope',
    function($scope, StockService, $rootScope)
    {
    }


]);

angular.module('dashboard')
    .controller('DistributionController', ['$scope', 'StockService', '$rootScope', 'NgTableParams', 'FilterService', 'MonthService',
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

                // construct graph data
                var graphdata = [];
                var series = [];
                var min_series = [];
                var max_series = [];

                for (var i = 0; i < vm.data.length ; i++) {
                    series.push([vm.data[i].district_name, vm.data[i].received])
                    min_series.push([vm.data[i].district_name, vm.data[i].stock_requirement__minimum])
                    max_series.push([vm.data[i].district_name, vm.data[i].stock_requirement__maximum])
                }
                graphdata.push({
                        key: "Min",
                        values: min_series
                });
                graphdata.push({
                        key: "Issued",
                        values: series
                });

                graphdata.push({
                        key: "Max",
                        values: max_series
                });

                vm.graph = graphdata;

                // update graph
                vm.options = {
                        chart: {
                            type: 'multiBarChart',
                            height: 500,

                            title: {
                                enable: true,
                                text: 'VACCINE DISTRIBUTION'
                            },
                            showLegend: true,
                            stacked: true,
                            showControls: true,
                            margin : {
                                top: 20,
                                right: 20,
                                bottom: 85,
                                left: 65
                            },
                            groupSpacing: 0.2,
                            rotateLabels: 45,
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
            if(startMonth.name && endMonth.name && district.name && vaccine.name)
            {

                vm.getStockByDistrict(startMonth.name, endMonth.name, district.name, vaccine.name);
                vm.getStockByMonth(startMonth.name, endMonth.name, district.name, vaccine.name);
            }
        });

    }

]);
