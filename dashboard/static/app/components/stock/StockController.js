angular.module('dashboard')
    .controller('StockController', ['$scope', 'ReportService', '$rootScope', 'NgTableParams', 'FilterService',
    function($scope, ReportService, $rootScope, NgTableParams, FilterService)
    {
        var vm = this;
        var shellScope = $scope.$parent;
        shellScope.child = $scope;

        vm.getStockTotals = function(startMonth, endMonth, district, vaccine) {
            vm.startMonth ? vm.startMonth : "Nov 2015";
            vm.endMonth = vm.endMonth ? vm.endMonth : "Dec 2015";
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
                    var units = vm.data[i].stockathand;
                    total += units;
                }

                shellScope.child.stockathand = total;


                // construct graph data
                var graphdata = [];
                for (var i = 0; i < 5   ; i++) {
                    graphdata.push({
                        key: vm.data[i].district__name,
                        values: [
                            [ vm.data[i].district__name , vm.data[i].stockathand ]
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
    .controller('AmcController', ['$scope', 'ReportService', '$rootScope',
    function($scope, ReportService, $rootScope)
    {

        ReportService.getMonths().then(function(data) {
            $scope.months = data;
            $scope.startMonth = $scope.months[0];
            $scope.endMonth = $scope.months[0];

        });

        ReportService.getDistricts().then(function(data) {
            $scope.districts = data;
            $scope.districts.unshift({"name": "All Districts"});
            $scope.selectedDistrict = $scope.districts[0];
        });

        ReportService.getVaccines().then(function(data) {
            $scope.vaccines = data;
            $scope.vaccines.unshift({"name": "All Vaccines"});
            $scope.selectedVaccine = $scope.vaccines[0];

            $scope.options = {
                chart: {
                    type: 'multiBarChart',
                    height: 600,
                    title: {
                        enable: true,
                        text: 'VACCINE STOCK ON HAND'
                    },
                    showLegend: false,
                    showControls: false,
                    margin : {
                        top: 20,
                        right: 20,
                        bottom: 45,
                        left: 45
                    },
                    staggerLabels: true,
                    x: function(d){ return d[0]; },
                    y: function(d){ return d[1]; },
                    showValues: true,
                    valueFormat: function(d){
                        return d3.format(',.4f')(d);
                    },
                    transitionDuration: 500,
                }
            };

            $scope.data = [
                {
                    "key": "Kiboga",
                    "values": [
                        ["Jan 2015", 250000],
                        ["Feb 2015", 30000],
                        ["Mar 2015", 30000]
                    ]
                }, {
                    "key": "Kibuku",
                    "values": [
                        ["Jan 2015", 250000],
                        ["Feb 2015",400000],
                        ["Mar 2015", 30000]
                    ]
                }, {
                    "key": "Kisoro",
                    "values": [
                        ["Jan 2015",60000],
                        ["Feb 2015", 1000000],
                        ["Mar 2015", 400000]
                    ]
                }, {
                    "key": "Abim",
                    "values": [
                        ["Jan 2015",64000],
                        ["Feb 2015", 1060000],
                        ["Mar 2015", 40000]
                    ]
                }, {
                    "key": "Amuria",
                    "values": [
                        ["Jan 2015", 250000],
                        ["Feb 2015",400000],
                        ["Mar 2015", 30000]
                    ]
                }
            ];

            //$scope.tableParams = new NgTableParams({
            //        page: 1,
            //        count: 10
            //    }, {
            //        filterDelay: 0,
            //        counts: [],
            //        data: $scope.data[0].values
            //    });

        });

        $scope.startMonth = "";
        $scope.endMonth = "";
        $scope.vaccine = "";

        $scope.getTotal = function(district){
            if(!district)
              return 0;

            var total = 0;
            var curr_district = $scope.data.filter(function(a){ return a.key == district })[0]

            for(var i = 0; i < curr_district.values.length; i++){
                var units = curr_district.values[i][1];
                total += units;
            }
            return total;
        }

        $scope.getOverallTotal = function(){
            return 0;
        }

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
