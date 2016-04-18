angular.module('services').service('ReportService', ['$http',
    function($http) {
        var handleResponse = function(response) {
            return response.data;
        };
        var getCycles = function() {
            return $http.get('/api/months').then(handleResponse);
        };

        var getMetrics = function(guideline_type) {
            return $http.get('/api/vaccine', {params:{adh: guideline_type}}).then(handleResponse);
        };

        var getBestRankings = function(level, selectedMonth, vaccine) {
            return $http.get('/api/vaccine', {
                params: {
                    level: level,
                    cycle: selectedMonth,
                    vaccine: vaccine

                }
            }).then(handleResponse);
        };

        var getWorstRankings = function(level, selectedMonth, vaccine) {
            return $http.get('/api/vaccine', {
                params: {
                    level: level,
                    cycle: selectedMonth,
                    vaccine: vaccine
                }
            }).then(handleResponse);
        };

        var getDataForTest = function(test, params) {
            return $http.get('/api/vaccine/' + test, {
                params: params
            }).then(handleResponse);
        };

        var getScores = function(params) {
            return $http.get('/api/vaccine/', {
                params: params
            }).then(handleResponse);
        };

        var getFilters = function(test) {
            return $http.get('/api/filters/').then(handleResponse);
        };

        var getRankingsAccess = function() {
            return $http.get('/api/vaccine/').then(handleResponse);
        };

        return {
            "getCycles": getCycles,
            "getMetrics": getMetrics,
            "getBestRankings": getBestRankings,
            "getWorstRankings": getWorstRankings,
            "getDataForTest": getDataForTest,
            "getScores": getScores,
            "getFilters": getFilters,
            "getRankingsAccess": getRankingsAccess,
        };
    }
])
