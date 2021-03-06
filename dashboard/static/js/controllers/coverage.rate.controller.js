angular.module('dashboard').controller('CoverageRateController', ['$scope', 'ReportService',
    function($scope, ReportService) {
        var update = function(start, end) {
            ReportService.getDataForTest('submittedOrder', {
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
                        reporting: {
                            axis: 'y',
                            type: 'line',
                            name: 'Reporting',
                            color: '#27ae60',
                            dataType: 'numeric',
                            displayFormat: d3.format(".1f")
                        },
                        not_reporting: {
                            axis: 'y',
                            type: 'line',
                            name: 'Not Reporting',
                            color: 'Red',
                            dataType: 'numeric',
                            displayFormat: d3.format(".1f")
                        }
                    }
                };
            });
        };
        $scope.$watch('startMonth', function(start) {
            if (start) {
                update($scope.startMonth, $scope.endMonth);
            }
        }, true);

        $scope.$watch('endMonth', function(end) {
            if (end) {
                update($scope.startMonth, $scope.endMonth);
            }
        }, true);
    }
]);
