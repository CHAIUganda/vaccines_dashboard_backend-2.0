angular.module('dashboard').controller('GuidelineAdherenceController', ['$scope', 'ReportService', '$rootScope',
    function($scope, ReportService, $rootScope) {
        $scope.guidelineTypes = [
          {code: 'Adult 1L' , name: 'Adult First Line'},
          {code: 'Adult 2L' , name: 'Adult Second Line'},
          {code: 'Paed 1L' , name: 'Paed First Line'}
        ];
        $scope.guidelineType = $scope.guidelineTypes[0];
        var update = function(start, end) {
            ReportService.getDataForTest('guidelineAdherence', {
                start: start,
                end: end,
                regimen: $scope.guidelineType.code
            }).then(function(data) {
                var values = data.values;
                $scope.options = {
                    data: values,
                    chart: {
                        legend: {
                            position: 'right'
                        },
                        grid: {
                            y: {
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
            if (start) {
                update($scope.startCycle, $scope.endCycle);
            }

        }, true);

        $scope.$watch('guidelineType', function(guidelineType) {
            if (guidelineType) {
                update($scope.startCycle, $scope.endCycle);
                $rootScope.$broadcast('GUIDELINE_TYPE', guidelineType);
            }

        }, true);

        $scope.$watch('endCycle', function(end) {
            if (end) {
                update($scope.startCycle, $scope.endCycle);
            }

        }, true);
    }
]);
