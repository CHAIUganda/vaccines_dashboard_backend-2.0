angular.module('dashboard').controller('WebBasedRateController', ['$scope', 'ReportService',
    function($scope, ReportService) {

        var update = function(start, end) {
            ReportService.getDataForTest('orderType', {
                start: start,
                end: end
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
                        web: {
                            axis: 'y',
                            type: 'line',
                            name: 'Web',
                            color: '#27ae60',
                            dataType: 'numeric',
                            displayFormat: d3.format(".1f")
                        },
                        paper: {
                            axis: 'y',
                            type: 'line',
                            name: 'Paper',
                            color: 'red',
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

        $scope.$watch('endCycle', function(end) {
            if (end) {
                update($scope.startCycle, $scope.endCycle);
            }

        }, true);
    }
]);
