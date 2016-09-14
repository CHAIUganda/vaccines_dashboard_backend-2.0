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

                var tabledata_so = [];
                var tabledata_bm = [];
                var tabledata_wr = [];
                var tabledata_am = [];

                vm.data = angular.copy(data);

                tabledata_so = vm.data.filter(
                    function(value){
                        return value.at_hand == 0;
                });

                tabledata_am = vm.data.filter(
                    function(value){
                        return value.at_hand > value.stock_requirement__maximum;
                });

                tabledata_wr = vm.data.filter(
                    function(value){
                        return ((value.at_hand > value.stock_requirement__minimum) && (value.at_hand < value.stock_requirement__maximum));
                });

                tabledata_bm = vm.data.filter(
                    function(value){
                        return ((value.at_hand < value.stock_requirement__minimum) && (value.at_hand > 0));
                });

                tabledataAlldistricts = vm.data.filter(
                    function(value){
                        return value;
                });

                vm.tableParamsAlldistricts = new NgTableParams({
                    page: 1,
                    count: 10
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: tabledataAlldistricts,
                });

                vm.tableParams_so = new NgTableParams({
                    page: 1,
                    count: 10
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: tabledata_so,
                });

                vm.tableParams_bm = new NgTableParams({
                    page: 1,
                    count: 10
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: tabledata_bm,
                });

                vm.tableParams_wr = new NgTableParams({
                    page: 1,
                    count: 10
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: tabledata_wr,
                });

                vm.tableParams_am = new NgTableParams({
                    page: 1,
                    count: 10
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: tabledata_am,
                });

                // calculate totals
                var nothing = 0;
                var within = 0;
                var belowminimum = 0;
                var abovemaximum = 0;
                for(var i = 0; i < vm.data.length; i++){
                    if (vm.data[i].at_hand == 0)
                        nothing++;
                    if ((vm.data[i].at_hand > vm.data[i].stock_requirement__minimum) && (vm.data[i].at_hand < vm.data[i].stock_requirement__maximum))
                        within++;
                    if ((vm.data[i].at_hand < vm.data[i].stock_requirement__minimum) && (vm.data[i].at_hand > 0))
                        belowminimum++;
                    if (vm.data[i].at_hand > vm.data[i].stock_requirement__maximum)
                        abovemaximum++;
                }

                shellScope.child.stockedout = (nothing / vm.data.length) * 100;
                shellScope.child.themonth = endMonth;
                shellScope.child.vaccine = vaccine;

                // construct graph data
                var graphdata = [];
                var series = [];
                var min_series = [];
                var max_series = [];
                var chartdata = [];

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

                //vm.graph = graphdata;

                // update graph
                vm.options = {
                    chart: {
                        type: 'pieChart',
                        height: 500,
                        x: function(d){return d.key;},
                        y: function(d){return d.y;},
                        showLabels: true,
                        duration: 500,
                        labelThreshold: 0.01,
                        labelSunbeamLayout: true,
                        legend: {
                            margin: {
                                top: 5,
                                right: 35,
                                bottom: 5,
                                left: 0
                            }
                        }
                    }
                };

                vm.chartdata = [
                    {
                        key: "Stocked Out",
                        y: (nothing / vm.data.length) * 100
                    },
                    {
                        key: "Within Range",
                        y: (within / vm.data.length) * 100
                    },
                    {
                        key: "Below Minimum",
                        y: (belowminimum / vm.data.length) * 100
                    },
                    {
                        key: "Above Maximum",
                        y: (abovemaximum / vm.data.length) * 100
                    }
                ];

                vm.graph = vm.chartdata;

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
                shellScope.child.themonth = endMonth;
                shellScope.child.vaccine = vaccine;

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
            }
        });

    }

]);

angular.module('dashboard')
    .controller('UptakeRateController', ['$scope', 'StockService', '$rootScope', 'NgTableParams', 'FilterService', 'MonthService',
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

        vm.getStockByDistrictVaccine = function(startMonth, endMonth, district, vaccine) {

            vm.startMonth ? vm.startMonth : "Nov 2015";
            vm.endMonth = vm.endMonth ? vm.endMonth : "Dec 2016";
            //Todo: Temporarily disable filtering by district for the table
            //district = ""
            vm.district = district;
            vm.vaccine = vaccine; //vm.selectedVaccine ? vm.selectedVaccine.name : "";

            StockService.getStockByDistrictVaccine(startMonth, endMonth, district, vaccine)
                .then(function(data) {

                vm.data = angular.copy(data);

                shellScope.child.district = vm.district;
                shellScope.child.vaccine = vm.vaccine;


                // construct graph data
                var graphdata = [];
                var series = [];

                for (var i = 0; i < vm.data.length ; i++) {
                    if (vm.data[i].received == 0)
                    {series.push([vm.data[i].month, 0])}
                    else
                    {
                        var uptakeRate = Math.ceil(vm.data[i].consumed/vm.data[i].received*100);
                        series.push([vm.data[i].month, uptakeRate])
                    }

                }

                graphdata.push({
                        key: "Uptake Rate",
                        values: series
                });


                vm.graph = graphdata;


                // update graph
                vm.options = {
                        chart: {
                            type: 'lineChart',
                            height: 500,
                            width : 550,
                            title: {
                                enable: true,
                                text: 'Abim'
                            },
                            showLegend: false,
                            stacked: true,
                            showControls: true,
                            margin : {
                                top: 20,
                                right: 20,
                                bottom: 85,
                                left: 65
                            },
                            forceY: ([0,100]),
                            staggerLabels: true,
                            x: function(d){ return d[0]; },
                            y: function(d){ return d[1]; },
                            xAxis: {
                                axisLabel: 'Months',
                                tickFormat: function(d){
                                                return MonthService.getMonthName(d);
                                            },
                                axisLabelDistance: 10
                            },
                            useInteractiveGuideline: true,
                            dispatch: {
                            stateChange: function(e){ console.log("stateChange"); },
                            changeState: function(e){ console.log("changeState"); },
                            tooltipShow: function(e){ console.log("tooltipShow"); },
                            tooltipHide: function(e){ console.log("tooltipHide"); }
                            },
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
                vm.getStockByDistrictVaccine(startMonth.name, endMonth.name, district.name, vaccine.name);
            }
        });

    }

]);


angular.module('dashboard')
    .controller('ConsumptionController', ['$scope', 'StockService', '$rootScope', 'NgTableParams', 'FilterService', 'MonthService',
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

        vm.getStockByDistrictVaccine = function(startMonth, endMonth, district, vaccine) {

            vm.startMonth ? vm.startMonth : "Nov 2015";
            vm.endMonth = vm.endMonth ? vm.endMonth : "Dec 2016";
            //Todo: Temporarily disable filtering by district for the table
            //district = ""
            vm.district = district;
            vm.vaccine = vaccine; //vm.selectedVaccine ? vm.selectedVaccine.name : "";

            StockService.getStockByDistrictVaccine(startMonth, endMonth, district, vaccine)
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

                shellScope.child.district = vm.district;
                shellScope.child.vaccine = vm.vaccine;


                // construct graph data
                var graphdata = [];
                var series = [];
                var target_series = [];
                

                for (var i = 0; i < vm.data.length ; i++) {
                    series.push([vm.data[i].month, vm.data[i].consumed])
                    target_series.push([vm.data[i].month, vm.data[i].stock_requirement__target])

                }

                graphdata.push({
                        key: "Actual Consumption",
                        values: series
                });
                graphdata.push({
                        key: "Planned consumption",
                        values: target_series,
                        color: '#FF7F0E'
                });


                vm.graph = graphdata;


                // update graph
                vm.options = {
                        chart: {
                            type: 'lineChart',
                            height: 400,
                            title: {
                                enable: true,
                                text: 'Abim'
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
                            forceY: ([0,100]),
                            staggerLabels: true,
                            x: function(d){ return d[0]; },
                            y: function(d){ return d[1]; },
                            xAxis: {
                                axisLabel: 'Months',
                                tickFormat: function(d){
                                                return MonthService.getMonthName(d);
                                            },
                                axisLabelDistance: 10
                            },
                            useInteractiveGuideline: true,
                            dispatch: {
                            stateChange: function(e){ console.log("stateChange"); },
                            changeState: function(e){ console.log("changeState"); },
                            tooltipShow: function(e){ console.log("tooltipShow"); },
                            tooltipHide: function(e){ console.log("tooltipHide"); }
                            },
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
                vm.getStockByDistrictVaccine(startMonth.name, endMonth.name, district.name, vaccine.name);
            }
        });

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

        vm.getStockByDistrictVaccine = function(startMonth, endMonth, district, vaccine) {

            vm.startMonth ? vm.startMonth : "Nov 2015";
            vm.endMonth = vm.endMonth ? vm.endMonth : "Dec 2016";
            //Todo: Temporarily disable filtering by district for the table
            //district = ""
            vm.district = district;
            vm.vaccine = vaccine; //vm.selectedVaccine ? vm.selectedVaccine.name : "";

            StockService.getStockByDistrictVaccine(startMonth, endMonth, district, vaccine)
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
                var nothing = 0;
                for(var i = 0; i < vm.data.length; i++) {
                    if (vm.data[i].received == 0)
                        nothing++;
                }

                shellScope.child.noissues = (nothing / vm.data.length) * 100;
                shellScope.child.district = vm.district;
                shellScope.child.vaccine = vm.vaccine;


                // construct graph data
                var graphdata = [];
                var series = [];
                var min_series = [];
                var max_series = [];

                for (var i = 0; i < vm.data.length ; i++) {
                    series.push([vm.data[i].month, vm.data[i].received])
                    min_series.push([vm.data[i].month, vm.data[i].stock_requirement__minimum])
                    max_series.push([vm.data[i].month, vm.data[i].stock_requirement__maximum])
                }
                graphdata.push({
                        key: "Min",
                        values: min_series,
                        color:'#A5E816'
                });
                graphdata.push({
                        key: "Issued",
                        values: series,
                        color:'#1F77B4'
                });

                graphdata.push({
                        key: "Max",
                        values: max_series,
                        color:'#FF7F0E'
                });

                vm.graph = graphdata;


                // update graph
                vm.options = {
                        chart: {
                            type: 'lineChart',
                            height: 400,
                            title: {
                                enable: true,
                                text: 'Abim'
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
                            forceY: ([0,100]),
                            staggerLabels: true,
                            x: function(d){ return d[0]; },
                            y: function(d){ return d[1]; },
                            xAxis: {
                                axisLabel: 'Months',
                                tickFormat: function(d){
                                                return MonthService.getMonthName(d);
                                            },
                                axisLabelDistance: 10
                            },
                            useInteractiveGuideline: true,
                            dispatch: {
                            stateChange: function(e){ console.log("stateChange"); },
                            changeState: function(e){ console.log("changeState"); },
                            tooltipShow: function(e){ console.log("tooltipShow"); },
                            tooltipHide: function(e){ console.log("tooltipHide"); }
                            },
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
                vm.getStockByDistrictVaccine(startMonth.name, endMonth.name, district.name, vaccine.name);
            }
        });

    }

]);