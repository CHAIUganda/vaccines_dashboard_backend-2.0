angular.module('services').service('ReportService', ['$http',
    function($http) {
        var handleResponse = function(response) {
            return response.data;
        };

        var getCycles = function() {
            return $http.get('/api/months').then(handleResponse);
        };

        var getMonths = function(level, selectedMonth, vaccine) {
            return $http.get('/api/months', {
                params: {
                    level: level,
                    cycle: selectedMonth,
                    vaccine: vaccine

                }
            }).then(handleResponse);
        };

        var getDistricts = function(level, selectedMonth, vaccine) {
            return $http.get('/api/districts').then(handleResponse);
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

        var getDistrictTotals = function(startMonth, endMonth, district, vaccine) {
            return $http.get('/api/stock', {
                params: {
                    startMonth:startMonth,
                    endMonth:endMonth,
                    district:district,
                    vaccine:vaccine
                }
            }).then(handleResponse);
        };

        var getRankingsAccess = function() {
            return $http.get('/api/vaccine/').then(handleResponse);
        };

        var getVaccines = function() {
            return $http.get('/api/vaccines/').then(handleResponse);
        }

        return {
            "getMonths": getMonths,
            "getVaccines": getVaccines,
            "getDistricts": getDistricts,
            "getDataForTest": getDataForTest,
            "getScores": getScores,
            "getDistrictTotals": getDistrictTotals,
            "getRankingsAccess": getRankingsAccess,
        };
    }
])
