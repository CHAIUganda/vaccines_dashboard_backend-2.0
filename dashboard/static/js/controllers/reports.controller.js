angular.module('reports').controller('ReportsController', ['$scope', 'ReportService', 'DTOptionsBuilder',
    function ($scope, ReportService, DTOptionsBuilder) {
        $scope.page_count = 20;
        ReportService.getFilters().then(function (data) {
            $scope.filters = data;
            $scope.selectedFilter.cycle = data.cycles[0];
        });
        $scope.selectedFilter = {};
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('scrollX', '100%')
            .withOption('scrollCollapse', true)
            .withOption('bLengthChange', false)
            .withOption('paging', false)
            .withOption('info', false)
            //.withOption('ajax', {
            //    url: '/api/table/scores',
            //    type: 'POST'
            //})
            .withOption('processing', true)
            .withOption('serverSide', true)
            .withFixedColumns({
                leftColumns: 4,
                rightColumns: 0
            });
        $scope.formulations = [{
            name: "TDF/3TC/EFV (Adult)",
            value: "TDF/3TC/EFV (Adult)"
        }, {
            name: "ABC/3TC (Paed)",
            value: "ABC/3TC (Paed)"
        }, {
            name: "EFV200 (Paed)",
            value: "EFV200 (Paed)"
        }];
        $scope.selectedFilter.vaccine = $scope.formulations[0];
        var tests = [{
            'test': 'REPORTING',
            'display': 'REPORTING',
            "vaccine": false
        }, {
            'test': 'WEB_BASED',
            'display': 'WEB/PAPER',
            "vaccine": false
        }, {
            'test': 'guidelineAdherenceAdult1L',
            'display': 'Adult 1L',
            "vaccine": false
        }, {
            'test': 'guidelineAdherenceAdult2L',
            'display': 'Adult 2L',
            "vaccine": false
        }, {
            'test': 'guidelineAdherencePaed1L',
            'display': 'Adult 2L',
            "vaccine": false
        }, {
            'test': 'OrderFormFreeOfGaps',
            'display': 'Blanks',
            "vaccine": false
        }, {
            'test': 'MULTIPLE_ORDERS',
            'display': '>1 Order',
            "vaccine": false
        }, {
            'test': 'orderFormFreeOfNegativeNumbers',
            'display': 'Negatives',
            "vaccine": true
        }, {
            'test': 'consumptionAndPatients',
            'display': 'Cons. & Patients',
            "vaccine": true
        }, {
            'test': 'differentOrdersOverTime',
            'display': 'Repeat Ord.',
            "vaccine": true
        }, {
            'test': 'closingBalanceMatchesOpeningBalance',
            'display': 'Open/ Close',
            "vaccine": true
        }, {
            'test': 'stableConsumption',
            'display': 'Cons. Stable',
            "vaccine": true
        }, {
            'test': 'warehouseFulfilment',
            'display': 'Fulfillment',
            "vaccine": true
        }, {
            'test': 'stablePatientVolumes',
            'display': 'Patient Stability',
            "vaccine": true
        }, {
            'test': 'nnrtiCurrentAdults',
            'display': 'Adult NRTI',
            "vaccine": false
        }, {
            'test': 'nnrtiCurrentPaed',
            'display': 'PAED NRTI',
            "vaccine": false
        }, {
            'test': 'nnrtiNewAdults',
            'display': 'N. Adult NRTI',
            "vaccine": false
        }, {
            'test': 'nnrtiNewPaed',
            'display': 'N. PAED NRTI',
            "vaccine": false
        }];
        $scope.tests = tests;
        var calculateTotal = function (name) {
            var size = $scope.scores.length;
            var count = _.countBy($scope.scores, function (item) {
                if (item && name in item) {
                    var hash = item[name];
                    if (hash) {
                        if ('DEFAULT' in hash) {
                            return hash['DEFAULT'];
                        }
                        if ($scope.selectedFilter.vaccine.name in hash) {
                            var result = hash[$scope.selectedFilter.vaccine.name];
                            return hash[$scope.selectedFilter.vaccine.name];
                        }
                    }
                }
            });

            var yes_count = count.YES;
            if (!yes_count) {
                yes_count = 0;
            }
            var percentage = (yes_count / size) * 100;
            if (isNaN(percentage)) {
                return 0;
            } else {
                return percentage;
            }

        };
        var cleanScore = function (score) {
            var map = {
                "YES": "Pass",
                "NO": "Fail",
                "NOT_REPORTING": "N/A"
            }
            var newScore = map[score];
            if (!newScore) {
                return "N/A"
            }
            return newScore;
        }
        var cleanupData = function (data) {
            $scope.scores = data.results;
            $scope.scores_count = data.count;
            $scope.totals = {};
            _.forEach(tests, function (test) {
                $scope.totals[test.test] = calculateTotal(test.test);
            })
        };
        var updateTable = function (page) {
            $scope.page_number = page;
            var params = {
                page: page
            };
            if ($scope.selectedFilter.ip) {
                params['ip'] = $scope.selectedFilter.ip.name;
            }

            if ($scope.selectedFilter.district) {
                params['district'] = $scope.selectedFilter.district.name;
            }

            if ($scope.selectedFilter.warehouse) {
                params['warehouse'] = $scope.selectedFilter.warehouse.name;
            }

            if ($scope.selectedFilter.cycle) {
                params['cycle'] = $scope.selectedFilter.cycle.cycle;
            }
            //ReportService.getScores(params).then(cleanupData);
        };

        $scope.updateTable = updateTable;
        updateTable(1);
    }
]);

angular.module('reports').directive('score', function () {
    return {
        scope: {
            result: '=',
            vaccine: '='
        },
        controller: ['$scope', function ($scope) {
            if ($scope.result && $scope.vaccine) {
                if ($scope.vaccine in $scope.result) {
                    $scope.toDisplay = $scope.result[$scope.vaccine];
                } else if ('DEFAULT' in $scope.result) {
                    $scope.toDisplay = $scope.result['DEFAULT'];
                }
                var map = {
                    "YES": "PASS",
                    "NO": "FAIL",
                    "NOT_REPORTING": "N/A"
                };
                if ($scope.toDisplay) {
                    $scope.display = map[$scope.toDisplay];
                }
            }

        }],
        template: '<span class="score_{{display}}">{{display}}</span>'
    };
})