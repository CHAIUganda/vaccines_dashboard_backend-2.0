angular.module('dashboard')
    .controller('StockController', ['$scope', 'ReportService', '$rootScope', 'NgTableParams',
    function($scope, ReportService, $rootScope, NgTableParams)
    {

        ReportService.getMonths().then(function(data) {
            $scope.months = data;
            $scope.startMonth = $scope.months[0];
            $scope.endMonth = $scope.months[0];

        });

        ReportService.getDistricts().then(function(data) {
            $scope.districts = data;
            $scope.districts.unshift({"name": ""});
            $scope.selectedDistrict = $scope.districts[0];
        });

        ReportService.getVaccines().then(function(data) {
            $scope.vaccines = data;
            $scope.vaccines.unshift({"name": ""});
            $scope.selectedVaccine = $scope.vaccines[0];
        });

        var updateData = function() {
            var startMonth = $scope.startMonth ? $scope.startMonth.name : "";
            var endMonth = $scope.endMonth ? $scope.endMonth.name : "";
            var district = $scope.selectedDistrict ? $scope.selectedDistrict.name : "";
            var vaccine = $scope.selectedVaccine ? $scope.selectedVaccine.name : "";

            ReportService.getDistrictTotals(startMonth, endMonth, district, vaccine).then(function(data) {

                $scope.data = angular.copy(data);

                $scope.tableParams = new NgTableParams({
                    page: 1,
                    count: 15
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: $scope.data
                });

                // calculate totals
                var total = 0;
                for(var i = 0; i < data.length; i++){
                    var units = data[i].stockathand;
                    total += units;
                }
                $scope.totalstockathand = total;

                // construct graph data
                var graphdata = [];
                for (var i = 0; i < 8; i++) {
                    graphdata.push({
                        key: data[i].district,
                        values: [
                            [ data[i].district , data[i].stockathand ]
                        ]
                    });
                }
                $scope.graph = graphdata;

                // update graph
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

            });
        }


        $scope.$watch('endMonth', function() {
            updateData();
            $scope.$apply();
        }, true);

        $scope.$watchGroup(['endMonth', 'selectedVaccine', 'selectedDistrict'], function(data){
            if(data[0] && data[1] && data[2]){
              updateData();
                $scope.$apply();
            }
        });


        $scope.startMonth = "";
        $scope.endMonth = "";
        $scope.vaccine = "";

        $scope.getOverallTotal = function(){
            return 0;
        }



    }

]);


angular.module('dashboard')
    .controller('AmcController', ['$scope', 'ReportService', '$rootScope', 'NgTableParams',
    function($scope, ReportService, $rootScope, NgTableParams)
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

            $scope.tableParams = new NgTableParams({
                    page: 1,
                    count: 10
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: $scope.data[0].values
                });

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
