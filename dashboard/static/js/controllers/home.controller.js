angular.module('dashboard').controller('HomeController', ['$scope', 'ReportService', '$httpParamSerializer', 'NgTableParams',
    function($scope, ReportService, $httpParamSerializer, NgTableParams) {
        $scope.vaccine = "MEASLES";
        $scope.displayMonth = function(month) {
            return "MONTH " + month.number + " '" + month.year;
        };

        $scope.selectBest = function(name) {
            $scope.bestPerforming = name;
        };

        ReportService.getMonths().then(function(data) {
            $scope.months = data;
            //$scope.months = data.values;
            //$scope.startMonth = $scope.months[6 - 1];
            //$scope.endMonth = $scope.selectedCycle = data.most_recent_cycle;
        });

        $scope.$watch('startMonth', function(start) {
            if (start) {
                var pos = _.findIndex($scope.months, function(item) {
                    return item == start;
                });
                $scope.endCycles = $scope.cycles.slice(0, pos + 1);
            }

        }, true);

        function downloadURL(url, name) {
            var link = document.createElement("a");
            link.download = name;
            link.href = url;
            link.click();
        }

        $scope.downloadBest = function() {
            var query = $httpParamSerializer({
                level: $scope.bestPerforming,
                cycle: $scope.selectedCycle
            });
            var url = "/api/test/ranking/best/csv?" + query;
            downloadURL(url, 'best.csv');
        };

        var updateDistrictList = function() {
            ReportService.getDistricts($scope.bestPerforming, $scope.selectedCycle, $scope.vaccine).then(function(data) {
                $scope.bestTableParams = new NgTableParams({
                    page: 1,
                    count: 10
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: data.values
                });
            });
        };

        $scope.$watch('selectedMonth', function(month) {
            if (month) {
                updateDistrictList();
            }
        });

        $scope.$watch('bestPerforming', function() {
            updateDistrictList();
        });

        var setupMetrics = function(guidelineType){
          ReportService.getMetrics(guidelineType).then(function(data) {
            $scope.underimmunized = data.underimmunized;
            $scope.coverage = data.coverage;
            $scope.dropoutrate = data.dropoutrate;
          });
        };

        $scope.$on('GUIDELINE_TYPE', function(event, data) { setupMetrics(data); });

        setupMetrics();

        ReportService.getRankingsAccess().then(function(data) {
          //$scope.rankingLevels = data.values;
          //$scope.bestPerforming = $scope.rankingLevels[0];
        });
    }
]);
