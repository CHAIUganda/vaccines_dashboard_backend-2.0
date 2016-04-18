angular.module('dashboard').controller('HomeController', ['$scope', 'ReportService', '$httpParamSerializer', 'NgTableParams',
    function($scope, ReportService, $httpParamSerializer, NgTableParams) {
        $scope.vaccine = "MEASLES";
        $scope.displayCycle = function(cycle) {
            return "MONTH " + cycle.number + " '" + cycle.year;
        };

        $scope.selectBest = function(name) {
            $scope.bestPerforming = name;
        };

        $scope.selectWorst = function(name) {
            $scope.worstPerforming = name;
        };
        ReportService.getCycles().then(function(data) {
            $scope.cycles = data.values;
            $scope.startMonth = $scope.cycles[6 - 1];
            $scope.endMonth = $scope.selectedCycle = data.most_recent_cycle;
        });

        $scope.$watch('startMonth', function(start) {
            if (start) {
                var pos = _.findIndex($scope.cycles, function(item) {
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

        $scope.downloadWorst = function() {
            var query = $httpParamSerializer({
                level: $scope.worstPerforming,
                cycle: $scope.selectedCycle
            });
            var url = "/api/test/ranking/worst/csv?" + query;
            downloadURL(url, 'worst.csv');
        };

        var updateWorstList = function() {
            ReportService.getWorstRankings($scope.worstPerforming, $scope.selectedCycle, $scope.vaccine).then(function(data) {
                $scope.worstTableParams = new NgTableParams({
                    page: 1,
                    count: 10
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: data.values
                });
            });
        };

        var updateBestList = function() {
            ReportService.getBestRankings($scope.bestPerforming, $scope.selectedCycle, $scope.vaccine).then(function(data) {
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

        $scope.$watch('selectedCycle', function(cycle) {
            if (cycle) {
                updateWorstList();
                updateBestList();
            }
        });

        $scope.$watch('bestPerforming', function() {
            updateBestList();
        });

        $scope.$watch('worstPerforming', function() {
            updateWorstList();
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
          $scope.rankingLevels = data.values;
          $scope.bestPerforming = $scope.rankingLevels[0];
          $scope.worstPerforming = $scope.rankingLevels[0];
        });
    }
]);
