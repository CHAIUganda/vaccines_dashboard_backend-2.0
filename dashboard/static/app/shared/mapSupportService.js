angular.module('services').service('MapSupportService', [
    function() {

        var createDistrictDataMap = function(data) {
            var dataDistrictMap = {};

            for (var i in data) {
                var period = data[i].period;
                var first_dose = data[i].total_first_dose;
                var second_dose = data[i].total_second_dose;
                var last_dose = data[i].total_last_dose;
                var planned = data[i].total_planned;
                var vaccine = data[i].vaccine__name;
                var district = data[i].district__name;
                var periodYear = Number(period.toString().substr(0, 4));
                var periodMonth = Number(period.toString().substr(4, 6));

                if (! (district in dataDistrictMap)) {
                    dataDistrictMap[district] = {};
                }

                if (! (vaccine in dataDistrictMap[district])) {
                    dataDistrictMap[district][vaccine] = {};
                }

                if (! (periodYear in dataDistrictMap[district][vaccine])) {
                    dataDistrictMap[district][vaccine][periodYear] = {};
                }

                if (! (periodMonth in dataDistrictMap[district][vaccine][periodYear])) {
                    dataDistrictMap[district][vaccine][periodYear][periodMonth] = {};
                }

                dataDistrictMap[district][vaccine][periodYear][periodMonth].first_dose = first_dose;
                dataDistrictMap[district][vaccine][periodYear][periodMonth].last_dose = last_dose;
                dataDistrictMap[district][vaccine][periodYear][periodMonth].second_dose = second_dose;
                dataDistrictMap[district][vaccine][periodYear][periodMonth].planned = planned;
            }

            return dataDistrictMap;
        };

        var getPeriodList = function(data, endYear, reportToggle) {
            var periodList = [];

            if (reportToggle == 'MCY') {
                periodList.push(
                    [endYear.toString(),  getLastValue(data[endYear], 12)]
                );

            } else if (reportToggle == 'MFY') {
                var nextYear = endYear + 1;
                var lastValue;

                if (nextYear in data) {
                    lastValue = getLastValue(data[nextYear], 6);
                    periodList.push([nextYear.toString(), lastValue]);
                } else {
                    lastValue = getLastValue(data[endYear], 12);
                    periodList.push([endYear.toString(), lastValue]);
                }

            } else if (reportToggle == 'ACY') {
                periodList.push.apply(periodList,
                    getValuesInRange(
                        data,
                        endYear,
                        1,
                        endYear,
                        getLastValue(data[endYear], 12)
                    )
                );

            } else if (reportToggle == 'AFY') {
                var nextYear = endYear + 1;

                if (nextYear in data) {
                    periodList.push.apply(periodList,
                        getValuesInRange(
                            data,
                            endYear,
                            7,
                            nextYear,
                            getLastValue(data[nextYear], 6)
                        )
                    );
                } else {
                    periodList.push.apply(periodList,
                        getValuesInRange(
                            data,
                            endYear,
                            7,
                            endYear,
                            getLastValue(data[endYear], 12)
                        )
                    );
                }

            }

            return periodList;
        };

        var calculateCoverageRate = function(data, periodList, doseNumber) {
            
            var totalPlanned = periodList.reduce(function(total, v) {
                return total + data[v[0]][v[1]].planned;
            }, 0);

            var totalFirstDose = periodList.reduce(function(total, v) {
                return total + data[v[0]][v[1]].first_dose;
            }, 0);

            var totalSecondDose = periodList.reduce(function(total, v) {
                return total + data[v[0]][v[1]].second_dose;
            }, 0);

            var totalLastDose = periodList.reduce(function(total, v) {
                return total + data[v[0]][v[1]].last_dose;
            }, 0);

            var doseValue = totalLastDose;

            if (doseNumber == 1) {
                doseValue = totalFirstDose;
            } else if (doseNumber == 2) {
                doseValue = totalSecondDose;
            }

            return (doseValue / totalPlanned) * 100;
        };

        var calculateDropoutRate = function(data, periodList) {
            var totalPlanned = periodList.reduce(function(total, v) {
                return total + data[v[0]][v[1]].planned;
            }, 0);

            var totalLastDose = periodList.reduce(function(total, v) {
                return total + data[v[0]][v[1]].last_dose;
            }, 0);

            var totalFirstDose = periodList.reduce(function(total, v) {
                return total + data[v[0]][v[1]].first_dose;
            }, 0);

            return ((totalFirstDose - totalLastDose) / totalFirstDose) * 100;
        };

        var calculateRedCategoryValue = function(data, periodList) {
            var totalPlanned = periodList.reduce(function(total, v) {
                return total + data[v[0]][v[1]].planned;
            }, 0);

            var totalLastDose = periodList.reduce(function(total, v) {
                return total + data[v[0]][v[1]].last_dose;
            }, 0);

            var totalFirstDose = periodList.reduce(function(total, v) {
                return total + data[v[0]][v[1]].first_dose;
            }, 0);

            var access = (totalFirstDose / totalPlanned) * 100;
            var dropoutRate = ((totalFirstDose - totalLastDose) / totalFirstDose) * 100;

            if (access >= 90 && dropoutRate >= 0 && dropoutRate <= 10) {
                return 1;
            } else if (access >= 90 && (dropoutRate < 0 || dropoutRate > 10)) {
                return 2;
            } else if (access < 90 && dropoutRate >= 0 && dropoutRate <= 10) {
                return 3;
            } else if (access < 90 && (dropoutRate < 0 || dropoutRate > 10)) {
                return 4;
            } else {
                return 0;
            }
        };

        var getLastValue = function(d, defaultValue) {
            if (defaultValue in d) return defaultValue;

            var keys = Object.keys(d);
            return keys[keys.length-1];
        };

        var getValuesInRange = function(data, startYear, startMonth, endYear, endMonth) {
            var values = [];

            for (yearIndex in data) {
                if (yearIndex < startYear || yearIndex > endYear) {
                    continue;
                }

                for (monthIndex in data[yearIndex]) {
                    if (yearIndex == startYear && monthIndex < startMonth) {
                        continue;
                    }

                    if (yearIndex == endYear && monthIndex > endMonth) {
                        continue;
                    }

                    values.push([yearIndex, monthIndex]);
                }
            }

            return values;
        };


        return {
            "createDistrictDataMap": createDistrictDataMap,
            "getPeriodList": getPeriodList,
            "calculateCoverageRate": calculateCoverageRate,
            "calculateDropoutRate": calculateDropoutRate,
            "calculateRedCategoryValue": calculateRedCategoryValue
        };
    }
])
