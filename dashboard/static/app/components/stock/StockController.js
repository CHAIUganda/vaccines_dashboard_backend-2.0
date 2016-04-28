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
            $scope.districts.unshift({"name": "All Districts"});
            $scope.selectedDistrict = $scope.districts[0];
        });

        ReportService.getVaccines().then(function(data) {
            $scope.vaccines = data;
            $scope.vaccines.unshift({"name": "All Vaccines"});
            $scope.selectedVaccine = $scope.vaccines[0];

            $scope.options = {
                chart: {
                    type: 'discreteBarChart',
                    height: 450,
                    margin : {
                        top: 20,
                        right: 20,
                        bottom: 60,
                        left: 55
                    },
                    x: function(d){ return d.label; },
                    y: function(d){ return d.value; },
                    showValues: true,
                    valueFormat: function(d){
                        return d3.format(',.4f')(d);
                    },
                    transitionDuration: 500,
                    xAxis: {
                        axisLabel: 'X Axis'
                    },
                    yAxis: {
                        axisLabel: 'Y Axis',
                        axisLabelDistance: 30
                    }
                }
            };

            $scope.data = [{
                key: "Cumulative Return",
                values: [
                    { "label" : "A" , "value" : -29.765957771107 },
                    { "label" : "B" , "value" : 0 },
                    { "label" : "C" , "value" : 32.807804682612 },
                    { "label" : "D" , "value" : 196.45946739256 },
                    { "label" : "E" , "value" : 0.19434030906893 },
                    { "label" : "F" , "value" : -98.079782601442 },
                    { "label" : "G" , "value" : -13.925743130903 },
                    { "label" : "H" , "value" : -5.1387322875705 }
                ]
            }];

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






    }


]);



angular.module('dashboard')
    .controller('AmcController', ['$scope', 'ReportService', '$rootScope',
    function($scope, ReportService, $rootScope)
    {
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
