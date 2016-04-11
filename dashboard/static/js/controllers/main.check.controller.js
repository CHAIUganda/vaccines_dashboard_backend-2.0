angular.module('dashboard').controller('MainChecksController', ['$scope',
    function($scope) {
        $scope.tests = [{
            "url": "orderFormFreeOfGaps",
            "desc": "NO BLANKS: Order form free of blanks?",
            "hasRegimen": false,
            "hasChart": true,
            "testNumber": 3,
            "template": "/static/views/chart.html"
        }, {
            "url": "facilitiesMultiple",
            "desc": "MULTIPLE ORDERS: Submitted more than one order during the cycle?",
            "hasRegimen": false,
            "hasChart": false,
            "hasCycle": true,
            "testNumber": 4,
            "template": "/static/views/table.html"
        }, {
            "url": "orderFormFreeOfNegativeNumbers",
            "desc": "NO NEGATIVES: Order free of negative inputs?",
            "hasRegimen": true,
            "hasChart": true,
            "testNumber": 5,
            "template": "/static/views/chart.html"
        }, {
            "url": "consumptionAndPatients",
            "desc": "VOLUME TALLY: Consumption and patient volumes within 30%?",
            "hasRegimen": true,
            "hasChart": true,
            "testNumber": 6,
            "template": "/static/views/chart.html"
        }, {
            "url": "differentOrdersOverTime",
            "desc": "NON-REPEATING: Order changes in consecutive cycles?",
            "hasRegimen": true,
            "hasChart": true,
            "testNumber": 7,
            "template": "/static/views/chart.html"
        }, {
            "url": "closingBalance",
            "desc": "OPENING = CLOSING: Opening  balance = Closing balance from previous cycle?",
            "hasRegimen": true,
            "hasChart": true,
            "testNumber": 8,
            "template": "/static/views/chart.html"
        }, {
            "url": "stableConsumption",
            "desc": "STABLE CONSUMPTION: Consumption changes by less than 50% vs. previous cycle?",
            "hasRegimen": true,
            "hasChart": true,
            "testNumber": 9,
            "template": "/static/views/chart.html"
        }, {
            "url": "stablePatientVolumes",
            "desc": "STABLE PATIENTS: Patient volumes change by less than 50% vs. previous cycle?",
            "hasRegimen": true,
            "hasChart": true,
            "testNumber": 11,
            "template": "/static/views/chart.html"
        }, {
            "url": "warehouseFulfilment",
            "desc": "WAREHOUSE FULFILMENT: Volume delivered = volume ordered in previous cycle?",
            "hasRegimen": true,
            "hasChart": true,
            "testNumber": 10,
            "template": "/static/views/chart.html"
        }, {
            "url": "nnrtiCurrentAdults",
            "desc": "NRTI and NNRTI/PI patient volumes (ADULT - CURRENT): Differ by <30%?",
            "hasRegimen": false,
            "hasChart": true,
            "testNumber": 15,
            "template": "/static/views/chart.html"
        }, {
            "url": "nnrtiCurrentPaed",
            "desc": "NRTI and NNRTI/PI patient volumes (PAED - CURRENT): Differ by <30%?",
            "hasRegimen": false,
            "hasChart": true,
            "testNumber": 16,
            "template": "/static/views/chart.html"
        }, {
            "url": "nnrtiNewAdults",
            "desc": "NRTI and NNRTI/PI patient volumes (ADULT - ESTIMATED NEW): Differ by <30%?",
            "hasRegimen": false,
            "hasChart": true,
            "testNumber": 17,
            "template": "/static/views/chart.html"
        }, {
            "url": "nnrtiNewPaed",
            "desc": "NRTI and NNRTI/PI patient volumes (PAED - ESTIMATED NEW): Differ by <30%?",
            "hasRegimen": false,
            "hasChart": true,
            "testNumber": 18,
            "template": "/static/views/chart.html"
        }];
        $scope.regimens = [{
            name: "TDF/3TC/EFV (Adult)",
            value: "TDF/3TC/EFV"
        }, {
            name: "ABC/3TC (Paed)",
            value: "ABC/3TC"
        }, {
            name: "EFV200 (Paed)",
            value: "EFV200 (Paed)"
        }];
        $scope.selectedRegimen = $scope.regimens[0];

        $scope.selectedTest = $scope.tests[0];

    }
]);
angular.module('dashboard').controller('MultipleOrdersController', ['$scope', 'ReportService', 'NgTableParams',
    function($scope, ReportService, NgTableParams) {
        var updateData = function() {
            ReportService.getDataForTest('facilitiesMultiple', {
                'cycle': $scope.selectedCycle
            }).then(function(data) {
                var values = data.values;
                $scope.tableParams = new NgTableParams({
                    page: 1,
                    count: 10
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: values
                });
            });
        }

        updateData();

        $scope.$watch('selectedCycle', function() {
            updateData();
        }, true);


    }
]);
angular.module('dashboard').controller('LineChartController', ['$scope', 'ReportService',
    function($scope, ReportService) {
        var update = function(start, end) {
            var test = $scope.selectedTest.url;
            var regimen = undefined;
            if ($scope.selectedRegimen) {
                regimen = $scope.selectedRegimen.value;
            }
            ReportService.getDataForTest(test, {
                start: start,
                end: end,
                regimen: regimen
            }).then(function(data) {
                var values = data.values;
                $scope.options = {
                    data: values,
                    chart: {
                        legend: {
                          position: 'right'
                        },
                        grid:{
                          y:{
                            show: true
                          }
                        },
                        axis: {
                            y: {
                                max: 100,
                                min: 0,
                                tick: {
                                  count: 5
                                },
                                padding: {
                                    top: 0,
                                    bottom: 0
                                }
                            }
                        }
                    },
                    dimensions: {
                        cycle: {
                            axis: 'x',
                            type: 'line'
                        },
                        yes: {
                            axis: 'y',
                            type: 'line',
                            name: 'Pass',
                            color: '#27ae60',
                            dataType: 'numeric',
                            displayFormat: d3.format(".1f")
                        },
                        no: {
                            axis: 'y',
                            type: 'line',
                            name: 'Fail',
                            color: 'red',
                            dataType: 'numeric',
                            displayFormat: d3.format(".1f")
                        },
                        not_reporting: {
                            axis: 'y',
                            type: 'line',
                            color: 'gray',
                            name: 'Insufficient Data',
                            dataType: 'numeric',
                            displayFormat: d3.format(".1f")
                        }
                    }
                };
            });


        };
        $scope.$watch('startCycle', function(start) {
            if (start && $scope.selectedTest) {
                update($scope.startCycle, $scope.endCycle);
            }

        }, true);

        $scope.$watch('endCycle', function(end) {
            if (end && $scope.selectedTest) {
                update($scope.startCycle, $scope.endCycle);
            }

        }, true);

        $scope.$watch('selectedTest', function(test) {
            if (test) {
                update($scope.startCycle, $scope.endCycle);
            }

        }, true);

        $scope.$watch('selectedRegimen', function(regimen) {
            if (regimen) {
                update($scope.startCycle, $scope.endCycle);
            }

        }, true);
    }
]);
