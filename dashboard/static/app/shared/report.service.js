angular.module('services').service('ReportService', ['$http',
    function($http) {
        var handleResponse = function(response) {
            return response.data;
        };

        var getMonths = function() {
            return $http.get('/api/months').then(handleResponse);
        };

        var getDistricts = function(level, selectedMonth, vaccine) {
            return $http.get('/api/districts').then(handleResponse);
        };

        var getStockTotals = function(startMonth, endMonth, district, vaccine) {
            return $http.get('/api/stock', {
                params: {
                    startMonth: startMonth,
                    endMonth: endMonth,
                    district: district,
                    vaccine: vaccine
                }
            }).then(handleResponse);
        };

        var getVaccines = function() {
            return $http.get('/api/vaccines/').then(handleResponse);
        }

        return {
            "getMonths": getMonths,
            "getVaccines": getVaccines,
            "getDistricts": getDistricts,
            "getStockTotals": getStockTotals,
        };
    }
])
