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
                        {"district" :"Kiboga","value":200 },
                        {"district" :"Kibuku","value":800 },
                        {"district" :"Kiruhura","value":600 },
                        {"district" :"Kiryandongo","value":3000 },
                        {"district" :"Kisoro","value":500 },
                        {"district" :"Kitgum","value":300 },
                        {"district" :"Koboko","value":200 },
                        {"district" :"Kole ","value":300 },
                        {"district" :"Kotido ","value":3200 },
                        {"district" :"Kumi","value":400 },
                        {"district" :"Kween","value":200 },
                        {"district" :"Kyankwanzi","value":800 },
                        {"district" :"Kyegegwa ","value":250 },
                        {"district" :"Kyenjojo","value":2500 },
                        {"district" :"Lamwo","value":400 },
                        {"district" :"Lira","value":200 },
                        {"district" :"Luuka ","value":5850 },
                        {"district" :"Luwero ","value":1160 },
                        {"district" :"Lwengo","value":40 },
                        {"district" :"Lyantonde","value":400 },
                        {"district" :"Manafwa","value":30},
                        {"district" :"Maracha ","value":400 },
                        {"district" :"Masaka","value":800 },
                        {"district" :"Masindi","value":1000 },
                        {"district" :"Mayuge","value":2900 },
                        {"district" :"Mbale","value":1600 },
                        {"district" :"Mbarara","value":100 },
                        {"district" :"Mitooma ","value":200 },
                        {"district" :"Mityana","value":500 },
                        {"district" :"Moroto","value":100 },
                        {"district" :"Moyo","value":4850 },
                        {"district" :"Mpigi","value":1000 },
                        {"district" :"Mubende","value":200 },
                        {"district" :"Mukono","value":110 },
                        {"district" :"Nakapiripirit","value":1000 },
                        {"district" :"Nakaseke ","value":200 },
                        {"district" :"Nakasongola","value":300 },
                        {"district" :"Namayingo ","value":200 },
                        {"district" :"Namutumba ","value":500 },
                        {"district" :"Napak","value":1300 },
                        {"district" :"Nebbi","value":1000 },
                        {"district" :"Ngora","value":800 },
                        {"district" :"Ntoroko ","value":500 },
                        {"district" :"Ntungamo","value":1000 },
                        {"district" :"Nwoya ","value":1000 },
                        {"district" :"Otuke","value":400 },
                        {"district" :"Oyam","value":1000 },
                        {"district" :"Pader","value":100 },
                        {"district" :"Pallisa ","value":200 },
                        {"district" :"Rakai ","value":200 },
                        {"district" :"Rubirizi ","value":100 },
                        {"district" :"Rukungiri","value":590 },
                        {"district" :"Sembabule","value":1000 },
                        {"district" :"Serere","value":200 },
                        {"district" :"Sheema","value":30 },
                        {"district" :"Sironko ","value":1300 },
                        {"district" :"Soroti ","value":1000 },
                        {"district" :"Tororo","value":200 },
                        {"district" :"Wakiso","value":200 },
                        {"district" :"Yumbe","value":7600 },
                        {"district" :"Zombo","value":700 }

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
