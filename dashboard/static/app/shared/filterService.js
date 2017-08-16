angular.module('services').service('FilterService', ['$http',
    function($http) {
        var handleResponse = function(response) {
            return response.data;
        };

        var getMonths = function() {
            return $http.get('/api/months').then(handleResponse);
        };

        var getDistricts = function() {
            return $http.get('/api/districts').then(handleResponse);
        };

        var getVaccines = function() {
            return $http.get('/api/vaccines/').then(handleResponse);
        }

        var getFridgeDistricts = function() {
            return $http.get('coldchain/api/districts').then(handleResponse);
        };

        var getFridgeCareLevels = function() {
            return $http.get('coldchain/api/carelevels').then(handleResponse);
        };

        var getFridgeQuarters = function() {
            return $http.get('coldchain/api/quarters').then(handleResponse);
        };

        var getLastPeriod = function() {
            return $http.get('/api/lastperiod').then(handleResponse);
        };

        var getAwpActivities= function(){
            return $http.get('planning/api/awpactivities').then(handleResponse);
        };

        var getFundActivities= function(){
            return $http.get('planning/api/fundactivities').then(handleResponse);
        };
        var getUnepiCoverage=function(){
            return $http.get('coverage/api/coverageannualized').then(handleResponse);
        };
        var getUnepiStock=function(){
            return $http.get('api/stock/athandbydistrict').then(handleResponse);
        };

        var getYear = function() {
            return $http.get('planning/api/activityyear').then(handleResponse);
        };


        return {
            "getMonths": getMonths,
            "getYear": getYear,
            "getVaccines": getVaccines,
            "getDistricts": getDistricts,
            "getFridgeDistricts": getFridgeDistricts,
            "getFridgeCareLevels": getFridgeCareLevels,
            "getFridgeQuarters": getFridgeQuarters,
            "getLastPeriod": getLastPeriod,
            "getAwpActivities": getAwpActivities,
            "getFundActivities": getFundActivities,
            "getUnepiCoverage":getUnepiCoverage,
            "getUnepiStock":getUnepiStock
        };
    }
])

angular.module('services').service('MonthService', [
    function() {

        var getMonthName = function(month) {
            var months = {};
            months['1'] = "Jan";
            months['2'] = "Feb";
            months['3'] = "Mar";
            months['4'] = "Apr";
            months['5'] = "May";
            months['6'] = "Jun";
            months['7'] = "Jul";
            months['8'] = "Aug";
            months['9'] = "Sep";
            months['10'] = "Oct";
            months['11'] = "Nov";
            months['12'] = "Dec";
            return months[month];        
        };

        var getMonthNumber = function(month) {
            var months = {};
            months['Jan'] = 1;
            months['Feb'] = 2;
            months['Mar'] = 3;
            months['Apr'] = 4;
            months['May'] = 5;
            months['Jun'] = 6;
            months['Jul'] = 7;
            months['Aug'] = 8;
            months['Sep'] = 9;
            months['Oct'] = 10;
            months['Nov'] = 11;
            months['Dec'] = 12;
            return months[month];
        };

        var monthToDate = function(monthYear) {
            var parts = monthYear.split(" ");
            var month = getMonthNumber(parts[0]);
            var year = parseInt(parts[1]);
            return new Date(year, month, 1);
        };

        monthDiff = function (startDate, endDate) {
            var months;
            months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
            months -= startDate.getMonth() + 1;
            months += endDate.getMonth();
            return months <= 0 ? 0 : months;
        };

        monthRangeDiff = function (startDate, endDate) {
            return monthDiff(monthToDate(startDate), monthToDate(endDate));
        };

        return {
            "getMonthName": getMonthName,
            "getMonthNumber": getMonthNumber,
            "monthToDate": monthToDate,
            "monthDiff": monthDiff,
            "monthRangeDiff": monthRangeDiff,
        };
    }
])
