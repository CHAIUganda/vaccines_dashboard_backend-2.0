(function (window, document) {
     'use strict';

     var appHelpers = window.appHelpers || (window.appHelpers = {});

     var per = function(value, total) {
         var percentage = (value/total) * 100;
         return Math.round(percentage * 10) / 10;
     };

     var generateLabelFromPeriod = function(period) {
         period = period.toString();
         var year = period.substr(2,2);
         var month = Number(period.substr(4,2));

         var months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
         return months[month] + "'"+year;
    };

    var generateFullLabelFromPeriod = function(period) {
        period = period.toString();
        var year = period.substr(0,4);
        var month = Number(period.substr(4,2));

        var months = ['', 'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        return months[month] + " "+year;
   };

    var getMonthFromNumber = function(value, yearType) {
        var months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        var monthsFY = ['', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

        if (yearType == 'CY') {
            return months[value];
        } else {
            return monthsFY[value];
        }
    };

    var getPeriodString = function(year, month) {
        if (month < 10) {
            return year + "0" + month;
        } else {
            return year + "" +  month;
        }
    };

    var getMonthIndexFromPeriod = function(period, yearType) {
        period = period.toString();
        var month = Number(period.substr(4,2));

        if (yearType == 'CY') {
            return month;
        } else {
            if (month >= 7) {
                return Math.abs(month - 7) + 1;
            } else {
                return (month + 6);
            }
        }
    };

    var getMonthFromPeriod = function(period, yearType) {
        period = period.toString();
        return Number(period.substr(4,2));
    };

    var getYearFromPeriod = function(period, yearType) {
        period = period.toString();
        return Number(period.substr(0,4));
    };

    var getYearLabelFromPeriod = function(period, yearType) {
        period = period.toString();
        var year = period.substr(0,4);
        var month = Number(period.substr(4,2));

        if (yearType == 'CY') {
            return year;
        } else if (yearType == 'FY') {
            if (month <= 6) {
                var prevYear = Number(year) - 1;
                return prevYear + "-" + year;
            } else {
                var nextYear = Number(year) + 1;
                return year + "-" + nextYear;
            }
        }
    };


     // publish external API by extending appHelpers
     function publishExternalAPI(appHelpers) {
         angular.extend(appHelpers, {
             'per': per,
             'generateLabelFromPeriod': generateLabelFromPeriod,
             'generateFullLabelFromPeriod': generateFullLabelFromPeriod,
             'getPeriodString': getPeriodString,
             'getYearLabelFromPeriod': getYearLabelFromPeriod,
             'getMonthFromPeriod': getMonthFromPeriod,
             'getYearFromPeriod': getYearFromPeriod,
             'getMonthIndexFromPeriod': getMonthIndexFromPeriod,
             'getMonthFromNumber': getMonthFromNumber
         });
     }

     publishExternalAPI(appHelpers);

 })(window, document);

(function (angular) {
    // 'use strict';
/**
 * Created by bwamala on 6/2/2017.
 */
angular.module('services').service('AnnualService', ['$http',
    function($http) {
        var handleResponse = function(response) {
            return response.data;
        };

        var getAwpActivities = function(year){
            return $http.get('planning/api/awpactivities', {
                params: {
                    year: year
                }
            }).then(handleResponse);
        };

        var getFundActivities = function(year){
            return $http.get('planning/api/fundactivities', {
                params: {
                    year: year,
                }
            }).then(handleResponse);
        };

        var getPriorityActivities = function(year){
            return $http.get('planning/api/priorityactivities', {
                params: {
                    year: year,
                }
            }).then(handleResponse);
        };

        return{
            'getAwpActivities':getAwpActivities,
            'getFundActivities': getFundActivities,
            'getPriorityActivities':getPriorityActivities
        };
    }

])
})(window.angular);

(function (angular) {
    // 'use strict';
angular
    .module('services')
    .service('ChartPDFExport', ChartPDFExport);

ChartPDFExport.$inject = ['$timeout'];
function ChartPDFExport($timeout) {
    var service = {
        'export': exportPDF,
        'exportWithStyler': exportWithStyler
    };
    return service;

    function exportPDF(filename) {
        d3.selectAll("svg .nv-line")
            .style("fill", "#ffffff")
            .style("fill-opacity", 0);

        d3.selectAll(".nvd3 .nv-background")
            .style("fill", "#ffffff")
            .style("fill-opacity", 0);

        d3.selectAll(".nvd3 .nv-axis line")
            .style("stroke", "#e5e5e5");

        d3.selectAll(".nvd3 text")
            .style("font", "normal 13px Arial, sans-serif");

        d3.selectAll(".nvd3 .nv-groups .nv-point")
            .style("fill-opacity", 0)
            .style("stroke-width", "0px");

        d3.selectAll(".nvd3 .nv-y .zero line")
            .style("stroke", "#404040");

        d3.selectAll(".nv-y .nv-axis g path.domain")
            .style("stroke", "#404040");

        d3.selectAll(".legendQuant .label")
            .style("font", "normal 12px Arial, sans-serif");

        // var pdf = new jsPDF('l', 'mm');
        var pdf=new jsPDF("l", "mm", "a4");
        var options = { format : 'PNG' };

        pdf.addHTML(document.getElementById("pdfReport"), 0, 0, options, function() {
          pdf.save(filename);
        });
    }

    function exportWithStyler(vm, filename) {
        vm.printView = true;
        $timeout(function() {exportPDF(filename); }, 100);
        $timeout(function() {vm.printView = false;}, 1000);
    }
}
})(window.angular);

(function (angular) {
    // 'use strict';
angular
    .module('services')
    .service('ChartSupportService', ChartSupportService);

function ChartSupportService() {
    var service = {
        'getOptions': getOptions,
        'initLabels': initLabels,
        'clearLabels': clearLabels
    };

    return service;

    function getOptions(chartType) {
        return {
            chart: {
                type: chartType,
                height: 450,
                width: 650,
                // margin: {top: 100},
                stacked: false,
                showControls: false,
                groupSpacing: 0.2,
                clipEdge: false,
                // useInteractiveGuideline: true,
                interactiveLayer: {gravity: 's'},
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                forceY: [0,110],
                xAxis: {
                    axisLabel: 'Years',
                    tickFormat: function(d){
                        return d;
                    }
                },
                yAxis: {
                    axisLabel: 'Coverage Rate (%)',
                    ticks: 10
                },
                dispatch: {
                    renderEnd: function() {
                        initLabels();
                    }
                },
                callback: function(chart){
                    //console.log("!!! lineChart callback !!!");
                },
                legend: {
                    dispatch: {
                        stateChange: function() {}
                    }
                }
            }
        };
    }

    function initLabels(humanize=false) {
        // You need to apply this once all the animations are already finished. Otherwise labels will be placed wrongly.
        d3.selectAll('.nv-multibar .nv-group').each(function(group){
          var g = d3.select(this);

          // Remove previous labels if there is any
          g.selectAll('text').remove();
          g.selectAll('.nv-bar').each(function(bar){
            var b = d3.select(this);
            var barWidth = b.attr('width');
            var barHeight = b.attr('height');

            g.append('text')
              // Transforms shift the origin point then the x and y of the bar
              // is altered by this transform. In order to align the labels
              // we need to apply this transform to those.
              .attr('transform', b.attr('transform'))
              .text(function(){
                // Two decimals format
                if (humanize)
                    return Humanize.compactInteger(parseFloat(bar.y).toFixed(0), 1);
                return parseFloat(bar.y).toFixed(0);
                
              })
              .attr('y', function(){
                // Center label vertically
                var height = this.getBBox().height;
                return parseFloat(b.attr('y')) - 10; // 10 is the label's magin from the bar
              })
              .attr('x', function(){
                // Center label horizontally
                var width = this.getBBox().width;
                return parseFloat(b.attr('x')) + (parseFloat(barWidth) / 2) - (width / 2);
              })
              .attr('class', 'bar-values');
          });
        });
    }

    function clearLabels() {
        d3.selectAll('.nv-multibar .nv-group').each(function(group){
          var g = d3.select(this);
          // Remove previous labels if there is any
          g.selectAll('text').remove();
      });
    }
}
})(window.angular);

(function (angular) {
    // 'use strict';
angular
    .module('services')
    .service('CoverageCalculator', CoverageCalculator);

function CoverageCalculator() {

    var service =  {
        'calculateCoverageRate': calculateCoverageRate,
        'calculateDropoutRate': calculateDropoutRate,
        'calculateRedCategory': calculateRedCategory
    };

    return service;

    function calculateCoverageRate(consumption, planned) {
        return Math.round((consumption / planned) * 100);
    }

    function calculateDropoutRate(firstDose, lastDose) {
        return Math.round(((firstDose - lastDose) / firstDose) * 100);
    }

    function calculateRedCategory(firstDose, lastDose, planned) {
        var access = calculateCoverageRate(firstDose, planned);
        var dropoutRate = calculateDropoutRate(firstDose, lastDose);

        if (access >= 90 && dropoutRate >= 0 && dropoutRate <= 10) return 1;
        else if (access >= 90 && (dropoutRate < 0 || dropoutRate > 10)) return 2;
        else if (access < 90 && dropoutRate >= 0 && dropoutRate <= 10) return 3;
        else if (access < 90 && (dropoutRate < 0 || dropoutRate > 10)) return 4;
        else return 0;
    }
}
})(window.angular);

(function (angular) {
    // 'use strict';
angular.module('services').service('CoverageService', ['$http',
    function($http) {
        var handleResponse = function(response) {
            return response.data;
        };

        var getDHIS2VaccineDoses = function(period, district, vaccine) {
            return $http.get('coverage/api/dhis2vaccinedoses', {
                params: {
                    period: period,
                    vaccine: vaccine,
                    district: district
                }
            }).then(handleResponse);
        };

        var getVaccineDoses = function(period, vaccine) {
            return $http.get('coverage/api/vaccinedoses', {
                params: {
                    period: period,
                    vaccine: vaccine
                }
            }).then(handleResponse);
        };
        var getRedVaccineDoses = function(period, vaccine) {
            return $http.get('coverage/api/vaccinedoses', {
                params: {
                    period: period,
                    vaccine: vaccine
                }
            }).then(handleResponse);
        };


        var getVaccineDosesByDistrict = function(period, district, vaccine) {
            return $http.get('coverage/api/vaccinedoses', {
                params: {
                    period: period,
                    vaccine: vaccine,
                    district: district
                }
            }).then(handleResponse);
        };

        var getVaccineDosesByPeriod = function(params) {
            return $http.get('coverage/api/vaccinedoses_by_period', {
                params: {
                    startYear: params.startYear,
                    endYear: params.endYear,
                    vaccine: params.antigen,
                    period: params.period,
                    dose: params.dose,
                    district: params.district,
                    dataType: params.dataType,
                    enableDistrictGrouping: params.enableDistrictGrouping
                }
            }).then(handleResponse);
        };

        var getUnepiCoverage = function(period, district) {
            return $http.get('coverage/api/coverageannualized', {
                params: {
                    period: period,

                    district: district
                }
            }).then(handleResponse);
        };

        var getDistrictMap = function(){
            return $http.get('static/Uganda_admin.json').then(handleResponse);
        };

        return {
            "getDHIS2VaccineDoses": getDHIS2VaccineDoses,
            "getVaccineDoses": getVaccineDoses,
            "getVaccineDosesByDistrict": getVaccineDosesByDistrict,
            "getVaccineDosesByPeriod": getVaccineDosesByPeriod,
            "getUnepiCoverage":getUnepiCoverage,
            "getDistrictMap": getDistrictMap,
            "getRedVaccineDoses":getRedVaccineDoses
        };
    }
])
})(window.angular);

(function (angular) {
    // 'use strict';
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

        var getPeriodRanges = function() {
            return $http.get('coverage/api/period_ranges').then(handleResponse);
        }

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
            "getPeriodRanges": getPeriodRanges,
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
})(window.angular);

(function (angular) {
    // 'use strict';
    angular.module('services').service('FinanceService', ['$http', function($http) {

        return {
            "getFinanceData": getFinanceData,
            "getFinanceYears": getFinanceYears
        };

        function handleResponse(response) {
            return response.data;
        }

        function getFinanceData(params) {
            var config = {
                params: {
                    startYear: params == undefined ? 1990 : params.startYear,
                    endYear: params == undefined ? 3000 : params.endYear
                }
            };
            return $http.get('/finance/list', config).then(handleResponse);
        }

        function getFinanceYears() {
            return $http.get('/finance/years', {}).then(handleResponse);
        }

    }])
})(window.angular);

(function (angular) {
    // 'use strict';
angular.module('services').service('FridgeService', ['$http',
    function($http) {
        var handleResponse = function(response) {
            return response.data;
        };

        var getFridgeCapacity = function(startQuarter, endQuarter, district, carelevel) {
            return $http.get('coldchain/api/capacities', {
                params: {
                    startQuarter: startQuarter,
                    endQuarter: endQuarter,
                    district: district,
                    carelevel: carelevel
                }
            }).then(handleResponse);
        };

        var getFridgeDistrictCapacity = function(startQuarter, endQuarter, district, carelevel) {
            return $http.get('coldchain/api/districtcapacities', {
                params: {
                    startQuarter: startQuarter,
                    endQuarter: endQuarter,
                    district: district,
                    carelevel: carelevel
                }
            }).then(handleResponse);
        };

        var getFridgeFacilityCapacity = function(startQuarter, endQuarter, district, carelevel) {
            return $http.get('coldchain/api/facilitycapacities', {
                params: {
                    startQuarter: startQuarter,
                    endQuarter: endQuarter,
                    district: district,
                    carelevel: carelevel
                }
            }).then(handleResponse);
        };

        var getFridgeFunctionality = function(startQuarter, endQuarter, district, carelevel) {
            return $http.get('coldchain/api/refrigerators', {
                params: {
                    startQuarter: startQuarter,
                    endQuarter: endQuarter,
                    district: district,
                    carelevel: carelevel
                }
            }).then(handleResponse);
        };
        var getFridgeDistrictRefrigerator = function(startQuarter, endQuarter, district, carelevel) {
            return $http.get('coldchain/api/districtrefrigerators', {
                params: {
                    startQuarter: startQuarter,
                    endQuarter: endQuarter,
                    district: district,
                    carelevel: carelevel
                }
            }).then(handleResponse);
        };

        var getFacilityTypes = function(district) {
            return $http.get('coldchain/api/facilitytypes', {
                params: {district: district}
            }).then(handleResponse);
        };

        var getFridgeFacilityRefrigerator = function(startQuarter, endQuarter, district, carelevel) {
            return $http.get('coldchain/api/facilityrefrigerators', {
                params: {
                    startQuarter: startQuarter,
                    endQuarter: endQuarter,
                    district: district,
                    carelevel: carelevel
                }
            }).then(handleResponse);
        };

        var getFridgeImmunizingFacility = function(startQuarter, endQuarter, district, carelevel) {
            return $http.get('coldchain/api/immunizingfacilities', {
                params: {
                    startQuarter: startQuarter,
                    endQuarter: endQuarter,
                    district: district,
                    carelevel: carelevel
                }
            }).then(handleResponse);
        };
        var getFridgeDistrictImmunizingFacility = function(startQuarter, endQuarter, district, carelevel) {
            return $http.get('coldchain/api/districtimmunizingfacilities', {
                params: {
                    startQuarter: startQuarter,
                    endQuarter: endQuarter,
                    district: district,
                    carelevel: carelevel
                }
            }).then(handleResponse);
        };

        var getFridgeCapacityMetrics = function(data) {
            var surp = 0;
            var sufficient = 0;
            var shortage = 0;

            for(var i=0; i < data.length; i++){
                var surplusValue = data[i].surplus
                if (surplusValue > 30) surp++;
                else if(surplusValue <30 && surplusValue >= 0) sufficient++;
                else if(surplusValue < 0) shortage++;
            }

            return {
                'surplus': surp,
                'sufficient': sufficient,
                'shortage': shortage,
                'total': surp + sufficient + shortage
            };
        };

        return {
            "getFridgeCapacity": getFridgeCapacity,
            "getFacilityTypes": getFacilityTypes,
            "getFridgeDistrictCapacity": getFridgeDistrictCapacity,
            "getFridgeFacilityCapacity": getFridgeFacilityCapacity,
            "getFridgeFunctionality": getFridgeFunctionality,
            "getFridgeImmunizingFacility": getFridgeImmunizingFacility,
            "getFridgeDistrictRefrigerator":getFridgeDistrictRefrigerator,
            "getFridgeFacilityRefrigerator":getFridgeFacilityRefrigerator,
            "getFridgeDistrictImmunizingFacility":getFridgeDistrictImmunizingFacility,
            "getFridgeCapacityMetrics": getFridgeCapacityMetrics
        };
    }
])
})(window.angular);

(function (angular) {
    // 'use strict';
angular.module('dashboard')
    .controller('MainController', ['$scope', 'FilterService', 'MonthService', '$rootScope', '$location',
    function($scope, FilterService, MonthService, $rootScope, $location)
    {
        $scope.sortType     = 'name'; // set the default sort type
        $scope.sortReverse  = false;  // set the default sort order
        $scope.searchText   = '';     // set the default search/filter term

        $scope.root = {};
        var shell = this;

        $scope.$on('setDefaultYears', function(e, startYear, endYear) {
            shell.financeStartYear = startYear;
            shell.financeEndYear = endYear;
        });

        //=== Stock Management =======
        shell.startMonth = shell.startMonth ? shell.startMonth.name : "Nov 2015";
        shell.endMonth = shell.endMonth ? shell.endMonth.name : "Dec 2015";
        shell.selectedVaccine = "";
        shell.selectedDistrict = "";
        shell.defaultPeriod = "";

        FilterService.getMonths().then(function(data) {
            shell.months = data;
            shell.startMonth = shell.months[0];
            //shell.endMonth = shell.months[defaultMonth];
        });

        // Add Antigen filters values
        var antigens = {
            "ALL": ['Dose 1', 'Dose 2', 'Dose 3'],
            "HPV": ['Dose 1', 'Dose 2'],
            "DPT": ['Dose 1', 'Dose 2', 'Dose 3'],
            "PCV": ['Dose 1', 'Dose 2', 'Dose 3'],
            "IPV": ['Dose 1'],
            "OPV": ['Dose 1', 'Dose 2', 'Dose 3'],
            "BCG": ['Dose 1'],
            "MEASLES": ['Dose 1'],
            "TT": ['Dose 1', 'Dose 2']
        }

        shell.updateDoses = function() {
            shell.dose = undefined;
            shell.doses = antigens[shell.antigen]
            //shell.doses = ['Dose 1', 'Dose 2', 'Dose 3'];//antigens[shell.antigen]

            if (shell.doses.length != 0) {
                shell.dose = shell.doses[shell.doses.length-1];
            }
        };

        shell.antigens = Object.keys(antigens);

        if ($location.path() == '/coverage/redcategory') {
            shell.antigen = "DPT";
        } else {
            shell.antigen = "ALL";
        }
        shell.updateDoses();

        FilterService.getPeriodRanges().then(function(data) {
            shell.coverageYears = data.years
            shell.startYear = data.years[data.years.length-1]
            shell.endYear = data.years[data.years.length-1]
            shell.activeCoverageYear = data.years[data.years.length-1]
        });


        var date = new Date();
        FilterService.getLastPeriod().then(function(data) {
            shell.defaultPeriod = data;
            shell.defaultMonth = parseInt(data.period.toString().substring(4, 6));
            $scope.defaultMonth = shell.defaultMonth;
            $scope.defaultPeriod = data.period.toString();

            var period = data.period.toString();
            var month_number = parseInt(period.substring(4,6));
            var month_label = MonthService.getMonthName(month_number);
            //shell.endMonth = {year:period.substring(0,4), period:period, name:month_label, month:month_number, "$$hashKey":"object:186"}
            //shell.endMonth = shell.months[shell.defaultMonth-1];

            var endMonthIndex = 0;

            for (var i in shell.months) {
                if (shell.months[i].period == period) {
                    shell.endMonth = shell.months[i];
                    endMonthIndex = i;
                    break;
                }
            }

            //set the start period to 6 months back by default
            var startMonthIndex = (endMonthIndex - 6) + 1;
            if (startMonthIndex < 0) {
                startMonthIndex = 0;
            }

            if (shell.months != undefined) {
                shell.startMonth = shell.months[startMonthIndex];
            }





            //console.log("dere"+JSON.stringify(shell.months[13]));

        });

        shell.stockathand = 0;



        FilterService.getDistricts().then(function(data) {
            var districtSpecificPaths = [
                '/stock/distribution',
                // '/stock/uptakerate',
                // '/unepi/download'
            ];
            if (districtSpecificPaths.indexOf($location.path()) == -1) {
                data.unshift({'name': 'National'});
            }

            shell.districts = data;
            shell.selectedDistrict = shell.districts[0];
            shell.district = shell.districts[0].name;
        });

        FilterService.getVaccines().then(function(data) {
            shell.vaccines = data;
            shell.selectedVaccine = shell.vaccines[5];
        });

        //==== End Stock Management =====


        //========Planning=========
        shell.selectedYear = "";
        FilterService.getYear().then(function(data){
            shell.years = data;
            shell.selectedYear = shell.years[0];
        });


        //=== Cold chain ======
        shell.startQuarter = shell.startQuarter ? shell.startQuarter.name : "201601";
        shell.endQuarter = shell.endQuarter ? shell.endQuarter.name : "201603";
        shell.selectedFridgeDistrict = "";
        shell.selectedFridgeCareLevel = "";


        FilterService.getFridgeDistricts().then(function(data) {
            shell.fridgeDistricts = data;
            shell.selectedFridgeDistrict = shell.fridgeDistricts[0];
        });

        FilterService.getFridgeCareLevels().then(function(data) {
            shell.fridgeCareLevels = data;
            //shell.selectedFridgeCareLevel = shell.fridgeCareLevels[0];
        });

        FilterService.getFridgeQuarters().then(function(data) {
            shell.fridgeQuarters = data;
           // shell.selectedFridgeQuarter = shell.fridgeQuarters[3];
        });

        //==== End Cold Chain =======


//        $scope.$watch('shell.endMonth', function() {
//            if (shell.endMonth) {
//                $rootScope.$broadcast('refresh', shell.startMonth, shell.endMonth, shell.selectedDistrict, shell.selectedVaccine);
//            }
//        }, true);

        $scope.$watchGroup(['shell.endMonth', 'shell.selectedVaccine', 'shell.selectedDistrict'], function(data){
            // console.log(data);
            if(data[0] && data[1] && data[2]){
                if (shell.endMonth) {
                    $rootScope.$broadcast('refresh', shell.startMonth, shell.endMonth, shell.selectedDistrict, shell.selectedVaccine);
                }
            }
        });

        $scope.$watchGroup(['shell.financeStartYear', 'shell.financeEndYear'], function(data, oldData) {
            $rootScope.$broadcast('refreshFinance', {
                startYear: shell.financeStartYear,
                endYear: shell.financeEndYear,
            });
        });

        $scope.$watchGroup(
            [
                'shell.startYear',
                'shell.endYear',
                'shell.activeCoverageYear',
                'shell.antigen',
                'shell.dose',
                'shell.district'
            ],
            function(data){
                if(data[0]){
                    if (shell.endMonth) {
                        $rootScope.$broadcast(
                            'refreshCoverage2',
                            shell.endMonth, //Backwards compatibility
                            shell.startYear,
                            shell.endYear,
                            shell.activeCoverageYear,
                            shell.antigen,
                            shell.dose,
                            shell.district
                        );

                        $rootScope.$broadcast('refreshCoverage3', {
                            endMonth: shell.endMonth, //Backwards compatibility
                            startYear: shell.startYear,
                            endYear: shell.endYear,
                            activeCoverageYear: shell.activeCoverageYear,
                            antigen: shell.antigen,
                            dose: shell.dose,
                            district: shell.district
                        });
                    }
                }
            },
            true
        );

        // Disabled because it looks like a duplication
        /*$scope.$watch('shell.endQuarter', function() {
            if (shell.endQuarter) {
                $rootScope.$broadcast('refreshCapacity', shell.startQuarter, shell.endQuarter, shell.selectedFridgeDistrict, shell.selectedFridgeCareLevel);
            }
        }, true);*/

        $scope.$watchGroup(['shell.endQuarter', 'shell.selectedFridgeDistrict', 'shell.selectedFridgeCareLevel', 'shell.startQuarter'], function(data){
            if(data[0] && data[1]){
                if (shell.endQuarter && shell.selectedFridgeDistrict) {
                    $rootScope.$broadcast('refreshCapacity', shell.startQuarter, shell.endQuarter, shell.selectedFridgeDistrict, shell.selectedFridgeCareLevel);
                }
            }
        });
        $scope.$watch('shell.years', function(){
            if (shell.selectedYear){
                $rootScope.$broadcast('refreshAwp', shell.selectedYear)
            }
        }, true);

        $scope.$watchGroup(['shell.years'], function(data){
            if(data[0] && data[1]){
                if (shell.selectedYear) {
                    $rootScope.$broadcast('refreshAwp', shell.selectedYear);
                }
            }
        });

        $scope.$watch('shell.coveragePeriod', function() {
            if (shell.coveragePeriod) {
                $rootScope.$broadcast('refreshCoverage', shell.coveragePeriod, shell.selectedDistrict, shell.selectedVaccine);
            }
        }, true);

        $scope.$watchGroup(['shell.coveragePeriod', 'shell.selectedDistrict', 'shell.selectedVaccine'], function(data){
            if(data[0] && data[1] && data[2]){
                if (shell.coveragePeriod) {
                    $rootScope.$broadcast('refreshCoverage', shell.coveragePeriod, shell.selectedDistrict, shell.selectedVaccine);
                }
            }
        });

        $scope.$watch('shell.coveragePeriod', function() {
            if (shell.coveragePeriod && shell.selectedDistrict) {
                $rootScope.$broadcast('refreshUnepi', shell.coveragePeriod, shell.selectedDistrict, shell.selectedVaccine);
            }
        }, true);

        $scope.$watchGroup(['shell.coveragePeriod', 'shell.selectedDistrict', 'shell.selectedVaccine'], function(data){
            if(data[0] && data[1] && data[2]){
                if (shell.coveragePeriod && shell.selectedDistrict) {
                    $rootScope.$broadcast('refreshUnepi', shell.coveragePeriod, shell.selectedDistrict, shell.selectedVaccine);
                }
            }
        });


    }
]);
})(window.angular);

(function (angular) {
    // 'use strict';
angular.module('services').service('MapSupportService', [
    function() {

        var createDistrictDataMap = function(data) {
            var dataDistrictMap = {};

            for (var i in data) {
                var period = data[i].period;
                var first_dose = data[i].total_first_dose;
                var second_dose = data[i].total_second_dose;
                var third_dose = data[i].total_third_dose;
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
                dataDistrictMap[district][vaccine][periodYear][periodMonth].third_dose = third_dose;
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

        function getAggregates(data, periodList) {
            return periodList.reduce(function(acc, period) {
                if (data == undefined || data[period[0]] == undefined || data[period[0]][period[1]] == undefined)
                    return acc;
                var item = data[period[0]][period[1]];
                acc.totalPlanned += item.planned;
                acc.totalFirstDose += item.first_dose;
                acc.totalSecondDose += item.second_dose;
                acc.totalThirdDose += item.third_dose;
                acc.totalLastDose += item.last_dose;
                return acc;
            }, {totalPlanned: 0, totalFirstDose:0, totalSecondDose:0, totalThirdDose:0, totalLastDose:0});
        }

        var calculateCoverageRate = function(data, periodList, doseNumber) {
            var result = getAggregates(data, periodList);
            var doseValue = result.totalLastDose;
            if (doseNumber == 1) doseValue = result.totalFirstDose;
            else if (doseNumber == 2) doseValue = result.totalSecondDose;
            else if (doseNumber == 3) doseValue = result.totalThirdDose;
            return (doseValue / result.totalPlanned) * 100;
        };

        var calculateDropoutRate = function(data, periodList) {
            var result = getAggregates(data, periodList);
            return ((result.totalFirstDose - result.totalLastDose) / result.totalFirstDose) * 100;
        };

        var calculateRedCategoryValue = function(data, periodList) {
            var r = getAggregates(data, periodList);
            var access = (r.totalFirstDose / r.totalPlanned) * 100;
            var dropoutRate = ((r.totalFirstDose - r.totalLastDose) / r.totalFirstDose) * 100;

            if (access >= 90 && dropoutRate >= 0 && dropoutRate <= 10) return 1;
            else if (access >= 90 && (dropoutRate < 0 || dropoutRate > 10)) return 2;
            else if (access < 90 && dropoutRate >= 0 && dropoutRate <= 10) return 3;
            else if (access < 90 && (dropoutRate < 0 || dropoutRate > 10)) return 4;
            else return 0;
        };

        var getLastValue = function(d, defaultValue) {
            if (d == undefined) return;
            if (defaultValue in d) return defaultValue;
            var keys = Object.keys(d);
            return keys[keys.length-1];
        };

        var getValuesInRange = function(data, startYear, startMonth, endYear, endMonth) {
            var values = [];
            for (yearIndex in data) {
                if (yearIndex < startYear || yearIndex > endYear) continue;

                for (monthIndex in data[yearIndex]) {
                    if (yearIndex == startYear && monthIndex < startMonth) continue;
                    if (yearIndex == endYear && monthIndex > endMonth) continue;
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
})(window.angular);

(function (angular) {
    // 'use strict';
angular.module('services').service('StockService', ['$http',
    function($http) {
        var handleResponse = function(response) {
            return response.data;
        };

        var getStockByDistrict = function(startMonth, endMonth, district, vaccine) {
            return $http.get('api/stock/athandbydistrict', {
                params: {
                    startMonth: startMonth,
                    endMonth: endMonth,
                    district: district,
                    vaccine: vaccine
                }
            }).then(handleResponse);
        };
        var getUnepiStock = function(endMonth, district) {
            return $http.get('api/stock/athandbydistrict', {
                params: {
                    endMonth: endMonth,
                    district: district
                }
            }).then(handleResponse);
        };

        var getStockByMonth = function(startMonth, endMonth, district, vaccine) {
            return $http.get('api/stock/athandbymonth', {
                params: {
                    startMonth: startMonth,
                    endMonth: endMonth,
                    district: district,
                    vaccine: vaccine
                }
            }).then(handleResponse);
        };
         var getStockByDistrictVaccine = function(startMonth, endMonth, district, vaccine) {
            return $http.get('/api/stock/stockbydistrictvaccine', {
                params: {
                    startMonth: startMonth,
                    endMonth: endMonth,
                    district: district,
                    vaccine: vaccine
                }
            }).then(handleResponse);
        };
          var getStockedOut = function(startMonth, endMonth, district, vaccine) {
            return $http.get('/api/stockedout', {
                params: {
                    startMonth: startMonth,
                    endMonth: endMonth,
                    district: district,
                    vaccine: vaccine
                }
            }).then(handleResponse);
        };
        var getStockMonthsLeft = function(district, vaccine) {
            return $http.get('api/stock/stockmonthsleft', {
                params: {
                    district: district,
                    vaccine: vaccine
                }
            }).then(handleResponse);
        };
        return {
            "getStockByDistrict": getStockByDistrict,
            "getStockByMonth": getStockByMonth,
            "getStockMonthsLeft": getStockMonthsLeft,
            "getStockByDistrictVaccine": getStockByDistrictVaccine,
            "getStockedOut": getStockedOut,
            "getUnepiStock":getUnepiStock
        };
    }
])
})(window.angular);

(function (angular) {
    'use strict';
angular.module('dashboard').controller('AnnualCoverageController', AnnualCoverageController);

AnnualCoverageController.$inject = [
    '$scope',
    'CoverageService',
    'CoverageCalculator',
    'ChartPDFExport',
    '$timeout'
];
function AnnualCoverageController($scope, CoverageService, CoverageCalculator, ChartPDFExport, $timeout) {
    var vm = this;
    $scope.$on('refreshCoverage3', updateChart);

    vm.chartOptions = getChartOptions();
    vm.chartData = [];
    vm.yearIndexes = [];
    vm.exportPDF = function(name) { ChartPDFExport.exportWithStyler(vm, name); };
    vm.initLabels = initLabels;

    function updateChart(e, params) {
        var antigenLabel = params.antigen == 'ALL' ? 'Antigens' : params.antigen;
        var yearPeriod = params.startYear == params.endYear
            ? params.startYear : `${params.startYear} - ${params.endYear}`;
        vm.chartTitle = `${antigenLabel} Coverage for ${yearPeriod}`;
        clearLabels();

        CoverageService.getVaccineDosesByPeriod(params).then(function(data) {
            /* Aggregate the data based on period */
            var result = data.reduce(function(acc, item) {
                var vaccine = item.vaccine__name;
                var year = item.period.toString().substr(0,4);
                if (vm.yearIndexes.indexOf(year) == -1) vm.yearIndexes.push(year);
                if (! (vaccine in acc)) acc[vaccine] = {};
                if (! (year in acc[vaccine]))
                    acc[vaccine][year] = {
                        totalActual: 0,
                        totalFirstDose: 0,
                        totalThirdDose: 0,
                        totalLastDose: 0,
                        totalPlanned: 0,
                        totalSecondDose: 0
                    };

                acc[vaccine][year].totalActual += item.total_actual;
                acc[vaccine][year].totalFirstDose += item.total_first_dose;
                acc[vaccine][year].totalLastDose += item.total_last_dose;
                acc[vaccine][year].totalPlanned += item.total_planned;
                acc[vaccine][year].totalSecondDose += item.total_second_dose;
                acc[vaccine][year].totalThirdDose += item.total_third_dose;

                return acc;
            }, {});

            /* Calculate Rates for the results */
            var chartData = [];
            for (var vaccine in result) {
                var vaccineData = {cR: [], cR1: [], cR2: [], cR3: []};

                for (var year in result[vaccine]) {
                    var planned = result[vaccine][year].totalPlanned;
                    var item = result[vaccine][year];

                    var cR1 = CoverageCalculator.calculateCoverageRate(item.totalFirstDose, planned);
                    var cR2 = CoverageCalculator.calculateCoverageRate(item.totalSecondDose, planned);
                    var cR = CoverageCalculator.calculateCoverageRate(item.totalLastDose, planned);
                    var cR3 = CoverageCalculator.calculateCoverageRate(item.totalThirdDose, planned);

                    var i = vm.yearIndexes.indexOf(year);
                    vaccineData.cR.push({x: i, y: cR});
                    vaccineData.cR1.push({x: i, y: cR1});
                    vaccineData.cR2.push({x: i, y: cR2});
                    vaccineData.cR3.push({x: i, y: cR3});
                }

                if (params.antigen != "ALL") {
                    /* Show coverages for the different doses */
                    chartData.push({key: 'Dose 1', values: vaccineData.cR1});  
                    
                    if ($.inArray(vaccine, ['PENTA', 'PCV', 'OPV', 'HPV', 'TT']) != -1)
                        chartData.push({key: 'Dose 2', values: vaccineData.cR2});  
                    
                    if ($.inArray(params.antigen, ['PENTA', 'PCV', 'OPV', 'DPT']) != -1)
                        chartData.push({key: 'Dose 3', values: vaccineData.cR3});    
                } else {
                    chartData.push({key: vaccine, values: vaccineData.cR});    
                }
            }

            vm.chartData = chartData;
            // $timeout(function() {(); }, 2000);
        });
    }

    function getChartOptions() {
        return {
            chart: {
                type: 'multiBarChart',
                height: 450,
                width: 900,
                stacked: false,
                showControls: false,
                groupSpacing: 0.2,
                clipEdge: false,
                margin: {top: 70},
                // useInteractiveGuideline: true,
                interactiveLayer: {gravity: 's'},
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                forceY: [0,110],
                xAxis: {
                    axisLabel: 'Years',
                    tickFormat: function(d){
                        return vm.yearIndexes[d];
                    }
                },
                yAxis: {
                    axisLabel: 'Coverage Rate (%)',
                    ticks: 10
                },
                dispatch: {
                    renderEnd: function() {
                        initLabels();
                    }
                }
            }
        };
    }

    function initLabels() {
        // You need to apply this once all the animations are already finished. Otherwise labels will be placed wrongly.
        d3.selectAll('.nv-multibar .nv-group').each(function(group){
          var g = d3.select(this);

          // Remove previous labels if there is any
          g.selectAll('text').remove();
          g.selectAll('.nv-bar').each(function(bar){
            var b = d3.select(this);
            var barWidth = b.attr('width');
            var barHeight = b.attr('height');

            g.append('text')
              // Transforms shift the origin point then the x and y of the bar
              // is altered by this transform. In order to align the labels
              // we need to apply this transform to those.
              .attr('transform', b.attr('transform'))
              .text(function(){
                // Two decimals format
                return parseFloat(bar.y).toFixed(0) + "%";
              })
              .attr('y', function(){
                // Center label vertically
                var height = this.getBBox().height;
                return parseFloat(b.attr('y')) - 10; // 10 is the label's magin from the bar
              })
              .attr('x', function(){
                // Center label horizontally
                var width = this.getBBox().width;
                return parseFloat(b.attr('x')) + (parseFloat(barWidth) / 2) - (width / 2);
              })
              .attr('class', 'bar-values');
          });
        });
    }

    function clearLabels() {
        d3.selectAll('.nv-multibar .nv-group').each(function(group){
          var g = d3.select(this);
          // Remove previous labels if there is any
          g.selectAll('text').remove();
      });
    }
}
})(window.angular);

(function (angular) {
    // 'use strict';
angular.module('dashboard')
    .controller('CoverageController', [
        '$scope','$location', 'StockService', '$rootScope', 'NgTableParams',
        'FilterService', 'MonthService', 'CoverageService', 'MapSupportService', 'ChartPDFExport',
    function($scope,$location, StockService, $rootScope, NgTableParams,
        FilterService, MonthService, CoverageService, MapSupportService, ChartPDFExport)
    {
        var vm = this;
        var shellScope = $scope.$parent;
        shellScope.child = $scope;
        vm.path = $location.path();
        vm.endtxt="";
        vm.isLoading = false;
        vm.activeReportToggle = "ACY";
        vm.activeReportYear = "CY";
        vm.activeDistrict = undefined;
        vm.sampleDistrictData = {};

        $scope.isActive = function(viewLocation) {
            return viewLocation === $location.path();
        };

        function periodDisplay(period)
        {
            if (period == undefined) {
                return "";
            }
            var month = parseInt(period.slice(4,6));
            return MonthService.getMonthName(month) + " " + period.slice(0,4)
        }

        $scope.updateReportToggle = function(value) {
            vm.activeReportToggle = value;
            vm.activeReportYear = vm.activeReportToggle.substr(1,2);
            vm.updateMapWithVaccine(vm.activeVaccine);
            setTimeout(function(){window.dispatchEvent(new Event('resize'))}, 3000);

            shellScope.child.chartTitle = vm.getChartTitle(vm.selectedAntigen);
        };

        $scope.isActiveReportToggle = function(value) {
            return vm.activeReportToggle == value;
        }

        vm.getVaccineDoses = function(endYear, vaccine, district) {
            // $('#spinner-modal').modal('show');

            // vm.endMonth=period;

            shellScope.child.hideMap = true;
            // if (district != undefined && district != "National") {
            //     shellScope.child.mapPlaceholderMessage = "No map available.";
            //     return;
            // }


            shellScope.child.mapPlaceholderMessage = "Map loading. Please wait...";

            //Todo: Temporarily disable filtering by district for the table
            district = ""
            vm.district = district;
            vm.vaccine = vaccine;//vm.selectedVaccine ? vm.selectedVaccine.name : "va";
            vm.activeVaccine = vaccine;

            if (vaccine == "DPT" || vaccine == "ALL") {
                vm.activeVaccine = "PENTA";
            }

            // Assign dimensions for map container
            var width = 500,
                height = 500;
            var field = "";
            var dose1 = "";

            var interpolateFunction;

            if (vm.path=="/coverage/redcategory"){
                interpolateFunction = function(start, end) {
                    return function(t) {
                        // console.log(t);
                        t = (t * 100);
                        if (t == 0 ) return 'LightGray';
                        if (t == 1) return 'DarkGreen';
                        if (t == 2) return 'Yellow';
                        if (t == 3) return 'Orange';
                        if (t == 4) return 'Red';
                    };
                };
            } else if (vm.path=="/coverage/dropoutrate"){
                interpolateFunction = function(start, end) {
                    return function(t) {
                        t = t * 100;
                        if (t == 0 ) return 'LightGray';
                        if ((t >= 0) && (t <= 10)) return 'Green';
                        if ((t >= -10 && t < 0) || (t > 10 && t <= 20)) return 'Yellow';
                        if ((t < -10) || (t > 20)) return 'Red';
                    };
                };
            } else {
                interpolateFunction = function(start, end) {
                    return function(t) {
                        t = t * 100;
                        if (t == 0) return 'LightGray';
                        if (t < 50) return 'Red';
                        if (t>= 50 && t<90) return 'Yellow';
                        if (t >= 90) return 'DarkGreen';
                    };
                };
            }
            var color = d3.scale.linear()
                .domain([0, 100])
                .interpolate(interpolateFunction);

            if (vm.path=="/coverage/dropoutrate"){
                field="drop_out_rate";
                vm.endtxt="%";
            }

            else if (vm.path=="/coverage/coverage"){
                field="coverage_rate";
                vm.endtxt="%";
            }

            dose1 = "LOW" + "...................................................................."+ "HIGH";

            if (vaccine=="PENTA"){
                vm.vaccine="DPT3";
                vm.vacdose="DPT1-DPT3";
            }
            else if (vaccine=="PCV"){
                vm.vaccine="PCV3";
                vm.vacdose="PCV1-PCV3";
            }
            else if (vaccine=="BCG"){
                vm.vaccine="BCG";
                vm.vacdose="BCG-MEASLES";
            }
            else if (vaccine=="OPV"){
                vm.vaccine="OPV3";
                vm.vacdose="OPV0-OPV3";
            }
            else if (vaccine=="HPV"){
                vm.vaccine="HPV2";
                vm.vacdose="HPV1-HPV2";
            }
             else if (vaccine=="MEASLES"){
                vm.vaccine="MEASLES";
                vm.vacdose="BCG-MEASLES";
            }
            else if (vaccine=="TT"){
                vm.vaccine="TT2";
                vm.vacdose="TT1-TT2";
            }
            shellScope.child.periodMonth = periodDisplay(vm.endMonth);

            shellScope.child.thedose = vm.vaccine;
            shellScope.child.thevacdose = vm.vacdose;


            var valueFormat = d3.format(",");

            // Define a geographical projection
            // Also, set initial zoom to show the features
            var projection	= d3.geo.mercator()
                .scale(1);

            // Prepare a path object and apply the projection to it
            var path = d3.geo.path()
                .projection(projection);

            // We prepare an object to later have easier access to the data.
            var dataById = d3.map();

            //Define quantize scale to sort data values into buckets of color
            //Colors by Cynthia Brewer (colorbrewer2.org), 9-class YlGnBu


                                //.range(d3.range(9),map(function(i) { return 'q' + i + '-9';}));


            // CoverageService.getVaccineDoses(period, vaccine)
            var params = {
                endYear: endYear,
                dataType: 'map'
            };

            CoverageService.getVaccineDosesByPeriod(params)
                .then(function(data) {
                    var dataDistrictMap = MapSupportService.createDistrictDataMap(data);
                    vm.sampleDistrictData = dataDistrictMap[Object.keys(dataDistrictMap)[0]];
                    // vm.data = angular.copy(data);
                    // This maps the data of the CSV so it can be easily accessed by
                    // the ID of the district, for example: dataById[2196]
                    dataById = d3.nest()
                        .key(function (d) { return d.id; })
                        .rollup(function (d) { return d[0]; })
                        .map(data);

                    // Load features from GeoJSON
                    d3.json('static/app/components/coverage/data/ug_districts2.geojson', function (error, json) {
                        var scaleCenter = calculateScaleCenter(json);
                        projection.scale(scaleCenter.scale)
                            .center(scaleCenter.center)
                            .translate([width / 2, height / 2]);

                        for (var dist in dataDistrictMap) {
                            var pos = dist.indexOf(" ");
                            var dataDistrict = dist.substring(0, pos).toUpperCase();

                            for (var j = 0; j < json.features.length; j++) {
                                var jsonDistrict = json.features[j].properties.dist;
                                if (dataDistrict == jsonDistrict) {
                                    json.features[j].properties.field = dataDistrictMap[dist];
                                    break;
                                }
                            }
                        }

                        d3.select("#map").selectAll("*").remove();
                        var svg = d3.select("#map")
                            .append('svg')
                            .attr("width", width)
                            .attr("height", height);

                        svg.append('g')
                            .attr('class', 'features');

                        svg.selectAll("path")
                            .data(json.features)
                            .enter()
                            .append("path")
                            .attr("d", path)
                            .on("mouseover", hoveron)
                            .on("mouseout", hoverout)
                            .style("cursor", "pointer")
                            .style("stroke", "#777");

                        vm.updateMapWithVaccine(vm.activeVaccine);

                        shellScope.child.hideMap = false;
                        shellScope.child.$apply();

                    });

                    var hoveron = function(d) {
                        var div = document.getElementById('tooltip');
                        div.style.left = event.pageX + 'px';
                        div.style.top = event.pageY + 'px';

                        d3.select(this).style("fill", "white");
                        d3.select("#tooltip").style("opacity", 1);
                        d3.select("#tooltip .name").text(d.properties.dist);

                        d3.select("#tooltip .value")
                            .text (d3.format('.01f')(vm.getDistrictValue(d))+ vm.endtxt);
                    }

                    var hoverout = function(d) {
                        d3.select(this)
                            .style("fill", vm.getFillColor);

                        d3.select("#tooltip").style("opacity", 0);
                    }
            });

            vm.drawLegend = function(colorCounts) {
                // Setup Legend
                d3.select("#gend").selectAll("*").remove();
                var legendSvg = d3.select('#gend').append('svg');

                legendSvg.append("g")
                  .attr("class", "legendQuant")
                  .attr("transform", "translate(20,20)");

                var legend = d3.legend.color()
                  .labelFormat(d3.format(".2f"))
                  .shapeWidth(40)
                  .shapeHeight(20);

                if (vm.path=="/coverage/redcategory"){
                    var getLabel = function(name, value, total) {
                        var percentage = (value/total) * 100;

                        return name + ' ('+value+') (' + percentage.toFixed() + '%)';
                    };

                    var totals = colorCounts.LightGray + colorCounts.DarkGreen +
                        colorCounts.Yellow + colorCounts.Orange + colorCounts.Red;

                    legend.cells([0, 1, 2, 3, 4])
                        .labels([
                            getLabel('No data', colorCounts.LightGray, totals),
                            getLabel('CAT1', colorCounts.DarkGreen, totals),
                            getLabel('CAT2', colorCounts.Yellow, totals),
                            getLabel('CAT3', colorCounts.Orange, totals),
                            getLabel('CAT4', colorCounts.Red, totals)
                        ]);
                } else if (vm.path=="/coverage/dropoutrate"){
                    legend.cells([0, 30, 15, 5])
                        .labels([
                            'No data ('+colorCounts.LightGray+')',
                            '<-10 & >20 ('+colorCounts.Red+')',
                            '(-10-0) & (10-20) ('+colorCounts.Yellow+')',
                            '0-10 ('+colorCounts.DarkGreen+')'
                        ]);
                } else {
                    legend.cells(4)
                        .labels([
                            'No data ('+colorCounts.LightGray+')',
                            '<50% ('+colorCounts.Red+')',
                            '50-89% ('+colorCounts.Yellow+')',
                            '>=90% ('+colorCounts.DarkGreen+')'
                        ]);
                }

                legend.scale(color);

                legendSvg.select(".legendQuant")
                  .call(legend);
            };

            vm.getMapTitle = function(vaccine) {
                var duration = vm.activeReportToggle[0] == 'A' ? "Annualized" : "Monthly";
                var period = vm.getLastMapPeriod();
                var fullPeriod = appHelpers.generateFullLabelFromPeriod(period[0]+period[1]);
                var doseNumber = vm.activeDose.replace("Dose ", "");
                var antigenLabel = vm.activeDose != undefined ? 
                    `${vaccine}${doseNumber}` : vaccine;

                var tab = "Coverage";
                if (vm.path=="/coverage/dropoutrate") tab = "Dropout Rate";
                else if (vm.path=="/coverage/redcategory") tab = "Red Categorization";

                return `${duration} ${tab} of ${antigenLabel} for ${fullPeriod}`;
            };

            vm.updateMapWithVaccine = function(vaccine) {
                // if (vm.activeDistrict != undefined
                //     && vm.activeDistrict != "ALL"
                //     && vm.activeDistrict != "") {
                //         shellScope.child.hideMap = true;
                //         shellScope.child.mapPlaceholderMessage = "No map available.";
                //         return;
                // } else {
                //     shellScope.child.hideMap = false;
                // }

                // shellScope.child.hideMap = false;

                if (vaccine == "DPT" || vaccine == "ALL") {
                    vaccine = "PENTA";
                }

                vm.activeVaccine = vaccine;
                shellScope.child.mapTitle = vm.getMapTitle(vaccine);

                colorCounts = {
                    Red: 0,
                    Yellow: 0,
                    DarkGreen: 0,
                    LightGray: 0,
                    Orange: 0
                };

                var paths = d3.select("#map svg").selectAll("path");
                paths.style("fill", vm.getFillColor);

                setTimeout(function() {vm.drawLegend(colorCounts); }, 10);
            };

            vm.getFillColor = function(d) {

                var value = vm.getDistrictValue(d);

                var colorValue = color(value);
                if (colorValue) {
                    if (colorValue in colorCounts) {
                        colorCounts[colorValue] += 1;
                    }
                    return colorValue;
                } else {
                    return "LightGray";
                }
            };

            vm.getLastMapPeriod = function() {
                var vaccineData = vm.sampleDistrictData[vm.activeVaccine];
                var periodList = MapSupportService.getPeriodList(
                    vaccineData,
                    endYear,
                    vm.activeReportToggle
                );
                return periodList[periodList.length-1];
            };

            vm.getDistrictValue = function(d) {
                var districtData = d.properties.field;

                if (districtData == undefined || (! (vm.activeVaccine in districtData)) ) {
                    colorCounts['LightGray'] += 1;
                    return 'LightGray';
                }

                var vaccineData = districtData[vm.activeVaccine];

                var periodList = MapSupportService.getPeriodList(
                    vaccineData,
                    endYear,
                    vm.activeReportToggle
                );

                if (vm.path=="/coverage/coverage"){
                    return MapSupportService.calculateCoverageRate(
                        vaccineData,
                        periodList,
                        vm.getActiveDoseNumber()
                    );

                } else if (vm.path=="/coverage/dropoutrate"){
                    return MapSupportService.calculateDropoutRate(
                        vaccineData,
                        periodList
                    );

                } else if (vm.path=="/coverage/redcategory"){
                    return MapSupportService.calculateRedCategoryValue(
                        vaccineData,
                        periodList
                    );

                }

            };


            function calculateScaleCenter(features) {
                // Get the bounding box of the paths (in pixels) and calculate a scale factor based on box and map size
                var bbox_path = path.bounds(features),
                    scale = 0.95 / Math.max(
                        (bbox_path[1][0] - bbox_path[0][0]) / width,
                        (bbox_path[1][1] - bbox_path[0][1]) / height
                        );

                // Get the bounding box of the features (in map units) and use it to calculate the center of the features.
                var bbox_feature = d3.geo.bounds(features),
                    center = [
                        (bbox_feature[1][0] + bbox_feature[0][0]) / 2,
                        (bbox_feature[1][1] + bbox_feature[0][1]) / 2];

                return {
                    'scale':scale,
                    'center':center
                };
            }

             // NEW: Defining getIdOfFeature
            function getIdOfFeature(f) {
              return f.properties.idug;
            }


        };


        vm.getRedVaccineDoses = function(period, vaccine, district) {


            //Todo: Temporarily disable filtering by district for the table
            district = ""
            vm.district = district;
            vm.vaccine = vaccine;//vm.selectedVaccine ? vm.selectedVaccine.name : "va";

            // Assign dimensions for map container
            var width = 500,
                height = 500;
            var field = "Red_category";
            //if (vm.path=="/coverage/redcategory"){
            //    field="Red_category"
            //
            //}

            shellScope.child.district = vm.district;
            shellScope.child.vaccine =   vm.vaccine;

            var valueFormat = d3.format(",");

            // Define a geographical projection
            // Also, set initial zoom to show the features
            var projection	= d3.geo.mercator()
                .scale(1);

            // Prepare a path object and apply the projection to it
            var path = d3.geo.path()
                .projection(projection);

            // We prepare an object to later have easier access to the data.
            var dataById = d3.map();

            //Define quantize scale to sort data values into buckets of color
            //Colors by Cynthia Brewer (colorbrewer2.org), 9-class YlGnBu

            var color = d3.scale.quantize()
                                //.range(d3.range(9),map(function(i) { return 'q' + i + '-9';}));

                            .range([    "#008000",
                                        "#FFFF00",
                                        "#FFA500",
                                        "#FF0000"
                                                 ]);

            CoverageService.getRedVaccineDoses(period, vaccine)
                .then(function(data) {

                    vm.data = angular.copy(data);

                    //Set input domain for color scale
                    color.domain([
                        d3.min(data, function(d) { return +d[field]; }),
                        d3.max(data, function(d) { return +d[field]; })

                        ]);

                    // This maps the data of the CSV so it can be easily accessed by
                    // the ID of the district, for example: dataById[2196]
                    dataById = d3.nest()
                      .key(function(d) { return d.id; })
                      .rollup(function(d) { return d[0]; })
                      .map(data);

                    var legend = d3.select('#legend')

                        .attr('class', 'list-inline');

                    var keys = legend.selectAll('li.key')
                        .data(color.range());

                    keys.enter().append('li')
                        .attr('class', 'key')
                        .style('border-top-color', String)
                        .text(function(d){
                            if (d=="#008000"){
                               return 'CAT1'
                            }
                            else if (d=="#FFFF00"){
                                return 'CAT2'
                            }
                            else if (d=="#FFA500"){
                                return 'CAT3'
                            }
                            if (d=="#FF0000"){
                                return 'CAT4'
                            }
                         });


                    // Load features from GeoJSON
                    d3.json('static/app/components/coverage/data/ug_districts2.geojson', function(error, json) {


                        // Get the scale and center parameters from the features.
                        var scaleCenter = calculateScaleCenter(json);

                        // Apply scale, center and translate parameters.
                        projection.scale(scaleCenter.scale)
                                .center(scaleCenter.center)
                                .translate([width/2, height/2]);

                        // Merge the coverage data amd GeoJSON into a single array
                        // Also loop through once for each coverage score data value

                        for (var i=0; i < data.length ; i++ ) {

                            // Grab district name
                            var dist = data[i].district__name;
                            var pos = dist.indexOf(" ");
                            var dataDistrict = dist.substring(0, pos).toUpperCase();
                            //var dataDistrict = data[i].district;

                            //Grab data value, and convert from string to float
                            var dataValue = +data[i][field];

                            //Find the corresponding district inside GeoJSON
                            for (var j=0; j < json.features.length ; j++ ) {

                                // Check the district reference in json
                                var jsonDistrict = json.features[j].properties.dist;

                                if (dataDistrict == jsonDistrict) {

                                    //Copy the data value into the GeoJSON
                                    json.features[j].properties.field = dataValue;

                                    //Stop looking through JSON
                                    break;
                                }
                            }
                        }



                        // Create SVG inside map container and assign dimensions
                        //svg.selectAll("*").remove();
                        d3.select("#red").selectAll("*").remove();
                        var svg = d3.select("#red")
                            .append('svg')
                            .attr("width", width)
                            .attr("height", height);

                        // Add a <g> element to the SVG element and give a class to style later
                        svg.append('g')
                            .attr('class', 'features')
                        // Bind data and create one path per GeoJSON feature
                        svg.selectAll("path")
                            .data(json.features)
                            .enter()
                            .append("path")
                            .attr("d", path)
                            .on("mouseover", hoveron)
                            .on("mouseout", hoverout)
                            .style("cursor", "pointer")
                            .style("stroke", "#777")
                            .style("fill", function(d) {

                                // Get data value

                                var value = d.properties.field;

                                if (value) {
                                    // If value exists ...
                                    return color(value);
                                } else {
                                    // If value is undefines ...
                                    return "#ccc";
                                }
                            });



                    }); // End d3.json

                    // Logic to handle hover event when its firedup
                        var hoveron = function(d) {
                            var div = document.getElementById('tooltip');
                            div.style.left = event.pageX + 'px';
                            div.style.top = event.pageY + 'px';


                            //Fill yellow to highlight
                            d3.select(this)
                                .style("fill", "white");

                            //Show the tooltip
                            d3.select("#tooltip")
                                .style("opacity", 1);

                            //Populate name in tooltip
                            d3.select("#tooltip .name")
                                .text(d.properties.dist);

                            //Populate value in tooltip
                            if (!d.properties.field){
                                d3.select("#tooltip .value")
                                .text("No Data");

                            }
                            else {
                                d3.select("#tooltip .value")
                                    .text('CAT' + (valueFormat(d.properties.field)));
                            }
                            }

                        var hoverout = function(d) {

                            //Restore original choropleth fill
                            d3.select(this)
                                .style("fill", function(d) {
                                    var value = d.properties.field;
                                    if (value) {
                                        return color(value);
                                    } else {
                                        return "#ccc";
                                    }
                                });

                            //Hide the tooltip
                            d3.select("#tooltip")
                                .style("opacity", 0);

                        }

                    tabledataAlldoses = vm.data.filter(
                        function (value) {
                            return value;
                        });

                    vm.tableParamsDoses = new NgTableParams({
                        page: 1,
                        count: 10
                    }, {
                        filterDelay: 0,
                        counts: [],
                        data: tabledataAlldoses,
                    });

            });

            function calculateScaleCenter(features) {
                // Get the bounding box of the paths (in pixels) and calculate a scale factor based on box and map size
                var bbox_path = path.bounds(features),
                    scale = 0.95 / Math.max(
                        (bbox_path[1][0] - bbox_path[0][0]) / width,
                        (bbox_path[1][1] - bbox_path[0][1]) / height
                        );

                // Get the bounding box of the features (in map units) and use it to calculate the center of the features.
                var bbox_feature = d3.geo.bounds(features),
                    center = [
                        (bbox_feature[1][0] + bbox_feature[0][0]) / 2,
                        (bbox_feature[1][1] + bbox_feature[0][1]) / 2];

                return {
                    'scale':scale,
                    'center':center
                };
            }

             // NEW: Defining getIdOfFeature
            function getIdOfFeature(f) {
              return f.properties.idug;
            }
        };


        vm.getVaccineDosesByDistrict = function(period, district, vaccine) {


            CoverageService.getVaccineDosesByDistrict(period, district, vaccine)
                .then(function(data) {

                    vm.data = angular.copy(data);

                    shellScope.child.dropedout = 0;
                    if(vm.data.length > 0){
                        shellScope.child.dropedout = vm.data[0].drop_out_rate;
                        shellScope.child.underimmunized = vm.data[0].under_immunized;
                        /* Access */
                        if(vm.data[0].access >= 90){
                            shellScope.child.access = "Good"
                        }
                        else{
                            shellScope.child.access = "Poor"
                        }
                        /* Utilization */
                        if(shellScope.child.dropedout <= 10){
                            shellScope.child.utilization = "Good"
                        }
                        else{
                            shellScope.child.utilization = "Poor"
                        }
                        /* Red Categorization*/
                        if((vm.data[0].access >= 90) && (vm.data[0].drop_out_rate <=10)){
                            shellScope.redcategory = "CAT1"
                        }
                        else if(vm.data[0].access >= 90 && vm.data[0].drop_out_rate > 10){
                            shellScope.redcategory = "CAT2"
                        }
                        else if(vm.data[0].access < 90 && vm.data[0].drop_out_rate <= 10){
                            shellScope.redcategory = "CAT3"
                        }
                        else if(vm.data[0].access < 90 && vm.data[0].drop_out_rate > 10){
                            shellScope.redcategory = "CAT4"
                        }
                    }

                });
        };

        vm.getActiveDoseNumber = function() {
            if (vm.activeDose != undefined)
                return Number(vm.activeDose.substr(vm.activeDose.length-1, 1));
            return 0;
        };

        vm.computeRate = function(doses, planned) {
            if (vm.path=="/coverage/coverage"){
                var activeDoseNumber = vm.getActiveDoseNumber();
                var doseValue = doses.last;

                if (activeDoseNumber == 1) doseValue = doses.first;
                else if (activeDoseNumber == 2) doseValue = doses.second;
                else if (activeDoseNumber == 3) doseValue = doses.third;

                return (doseValue / planned) * 100;
            } else if (vm.path=="/coverage/dropoutrate"){
                return ((doses.first - doses.last) / doses.first) * 100;
            } else if (vm.path=="/coverage/redcategory"){
                var access = (doses.first/planned) * 100;
                var dropoutRate = ((doses.first - doses.last) / doses.first) * 100;

                if (access >= 90 && dropoutRate >= 0 && dropoutRate <= 10) return 1;
                else if (access >= 90 && (dropoutRate < 0 || dropoutRate > 10)) return 2;
                else if (access < 90 && dropoutRate >= 0 && dropoutRate <= 10) return 3;
                else if (access < 90 && (dropoutRate < 0 || dropoutRate > 10)) return 4;
                else return 0;
            }
        };

        vm.getChartData = function(params, data, reportYear, cumulative) {

            var periodValues = {};
            var redCategoryValues = {};
            var totals = {};
            var redCategoryTotals = {};
            var rate;

            for (var i in data) {
                var period = data[i].period;
                var last_dose = data[i].total_last_dose;
                var first_dose = data[i].total_first_dose;
                var second_dose = data[i].total_second_dose;
                var third_dose = data[i].total_third_dose;
                var planned = data[i].total_planned;
                var vaccine = data[i].vaccine__name;
                var district = data[i].district__name;

                var dataMonth = appHelpers.getMonthFromPeriod(period, reportYear);
                var dataYear = appHelpers.getYearFromPeriod(period, reportYear);

                var yearLabel = appHelpers.getYearLabelFromPeriod(period, reportYear);
                var monthIndex = appHelpers.getMonthIndexFromPeriod(period, reportYear);

                /* The view returns extra data to cater for the financial year
                Since its ignorant of the periods, we do the filters ourselves
                Didn't want to create a new API call for a change in report year
                */
                if ((reportYear == "CY") && (dataYear > params.endYear)) continue;
                // if ((reportYear == "FY") && (dataYear == params.endYear) && (dataMonth > 6)) continue;
                if ((reportYear == "FY") && (dataYear == params.startYear) && (dataMonth <= 6)) continue;

                if (! (yearLabel in periodValues)) {
                    periodValues[yearLabel] = {};
                    redCategoryValues[yearLabel] = {};
                    totals[yearLabel] = {};
                    redCategoryTotals[yearLabel] = {};
                }

                if (! (vaccine in periodValues[yearLabel])) {
                    periodValues[yearLabel][vaccine] = [];
                    redCategoryValues[yearLabel][vaccine] = {};
                    totals[yearLabel][vaccine] = {first_dose: 0, second_dose:0, third_dose:0, last_dose: 0, planned: 0};
                    redCategoryTotals[yearLabel][vaccine] = {};
                }

                if (district != undefined && !(district in redCategoryTotals[yearLabel][vaccine])) {
                    redCategoryTotals[yearLabel][vaccine][district] = {first_dose: 0, last_dose: 0, planned: 0};
                }

                if (cumulative) {
                    if (vm.path == '/coverage/redcategory') {
                        var combinedFirstDose =
                            redCategoryTotals[yearLabel][vaccine][district].first_dose + first_dose;
                        var combinedLastDose =
                            redCategoryTotals[yearLabel][vaccine][district].last_dose + last_dose;
                        var combinedPlanned =
                            redCategoryTotals[yearLabel][vaccine][district].planned + planned;

                        redCategoryTotals[yearLabel][vaccine][district].first_dose = combinedFirstDose;
                        redCategoryTotals[yearLabel][vaccine][district].last_dose = combinedLastDose;
                        redCategoryTotals[yearLabel][vaccine][district].planned = combinedPlanned;
                    } else {
                        var combinedFirstDose = totals[yearLabel][vaccine].first_dose + first_dose;
                        var combinedLastDose = totals[yearLabel][vaccine].last_dose + last_dose;
                        var combinedSecondDose = totals[yearLabel][vaccine].second_dose + second_dose;
                        var combinedThirdDose = totals[yearLabel][vaccine].third_dose + third_dose;
                        var combinedPlanned = totals[yearLabel][vaccine].planned + planned;

                        totals[yearLabel][vaccine].first_dose = combinedFirstDose;
                        totals[yearLabel][vaccine].last_dose = combinedLastDose;
                        totals[yearLabel][vaccine].second_dose = combinedSecondDose;
                        totals[yearLabel][vaccine].third_dose = combinedThirdDose;
                        totals[yearLabel][vaccine].planned = combinedPlanned;
                    }

                    rate = vm.computeRate({
                        first: combinedFirstDose,
                        second: combinedSecondDose,
                        third: combinedThirdDose,
                        last: combinedLastDose
                    }, combinedPlanned);
                } else {
                    rate = vm.computeRate({
                        first:first_dose,
                        second:second_dose,
                        third: third_dose,
                        last: last_dose}
                    , planned);
                }

                if (vm.path == '/coverage/redcategory') {
                    var category = rate;
                    if (! (monthIndex in redCategoryValues[yearLabel][vaccine]))
                        redCategoryValues[yearLabel][vaccine][monthIndex] = {};

                    if (! (category in redCategoryValues[yearLabel][vaccine][monthIndex]))
                        redCategoryValues[yearLabel][vaccine][monthIndex][category] = [];

                    redCategoryValues[yearLabel][vaccine][monthIndex][category].push(district);
                } else {
                    periodValues[yearLabel][vaccine].push({x: monthIndex, y: d3.format('.01f')(rate)});
                }
            }

            var chartData = [];

            if (vm.path == '/coverage/redcategory') {
                var getRedCategoryValues = function(monthIndex, catDistricts, totalDistricts) {
                    return {
                            x: Number(monthIndex), y: d3.format('.01f')((catDistricts / totalDistricts) * 100)
                            // x: Number(monthIndex), y: d3.format('.01f')(catDistricts)
                    };
                };

                var getTotalRedCategoryDistricts = function(cat, data) {
                    if (cat in data) {
                        return data[cat].length;
                    }
                    return 0;
                };

                var categoryValues = {
                    1: [], 2: [], 3: [], 4: []
                };

                for (var yearLabel in redCategoryValues) {
                    for (var vaccine in redCategoryValues[yearLabel]) {
                        for (var monthIndex in redCategoryValues[yearLabel][vaccine]) {

                            var vaccineData = redCategoryValues[yearLabel][vaccine][monthIndex];

                            // console.log(yearLabel + "-" + monthIndex + "-" + vaccine );
                            // console.log(vaccineData);

                            var cat1Districts = getTotalRedCategoryDistricts(1, vaccineData);
                            var cat2Districts = getTotalRedCategoryDistricts(2, vaccineData);
                            var cat3Districts = getTotalRedCategoryDistricts(3, vaccineData);
                            var cat4Districts = getTotalRedCategoryDistricts(4, vaccineData);

                            var totalDistricts = cat1Districts + cat2Districts + cat3Districts + cat4Districts;

                            categoryValues[1].push(getRedCategoryValues(monthIndex, cat1Districts, totalDistricts));
                            categoryValues[2].push(getRedCategoryValues(monthIndex, cat2Districts, totalDistricts));
                            categoryValues[3].push(getRedCategoryValues(monthIndex, cat3Districts, totalDistricts));
                            categoryValues[4].push(getRedCategoryValues(monthIndex, cat4Districts, totalDistricts));
                        }
                    }
                }

                chartData.push({key: 'CAT1', color: 'DarkGreen', values: vm.fillMissingValues(categoryValues[1])});
                chartData.push({key: 'CAT2', color: 'Yellow', values: vm.fillMissingValues(categoryValues[2])});
                chartData.push({key: 'CAT3', color: 'Orange', values: vm.fillMissingValues(categoryValues[3])});
                chartData.push({key: 'CAT4', color: 'Red', values: vm.fillMissingValues(categoryValues[4])});

            } else {
                for (var yearLabel in periodValues) {
                    for (var vaccine in periodValues[yearLabel]) {
                        var key = vaccine;
                        /* Remove antigens that lack value for particular dose on Coverage */
                        if (vm.path == '/coverage/coverage') {
                            if (vm.activeDose == "Dose 3" && $.inArray(vaccine, ['PENTA', 'PCV', 'OPV']) == -1)
                                continue;
                            else if (vm.activeDose == "Dose 2" && 
                                        $.inArray(vaccine, ['PENTA', 'PCV', 'OPV', 'HPV', 'TT']) == -1)
                                continue;
                        }

                        var values = vm.fillMissingValues(periodValues[yearLabel][vaccine]);
                        chartData.push({key: key, values: values})
                    }
                }
            }
            return chartData;
        };

        vm.fillMissingValues = function(values) {
            var monthIndexes = _.range(1, 13);
            var existingIndexes = values.map(function(item) { return item.x; });
            var newIndexes = monthIndexes.filter(function(v) {
                return existingIndexes.indexOf(v) < 0;
            });
            newIndexes.forEach(function(monthIndex) {
                values.push({x: monthIndex, y: 0});
            });
            return values.sort(function(a, b) {return a.x - b.x});
        };

        vm.getChartOptions = function(reportYear) {
            var width = (vm.activeDistrict == 'National') ? 450 : 900;
                 
            return {
                chart: {
                    type: 'lineChart',
                    height: 450,
                    width: width,
                    useInteractiveGuideline: true,
                    interactiveLayer: {
                        gravity: 's'
                    },
                    x: function(d){ return d.x; },
                    y: function(d){ return d.y; },
                    forceY: [-10,150],
                    dispatch: {
                        stateChange: function(e){ console.log("stateChange"); },
                        changeState: function(e){ console.log("changeState"); },
                        tooltipShow: function(e){ console.log("tooltipShow"); },
                        tooltipHide: function(e){ console.log("tooltipHide"); }
                    },
                    xAxis: {
                        axisLabel: 'Months',
                        tickFormat: function(d){
                            return appHelpers.getMonthFromNumber(d, reportYear);
                        }
                    },
                    yAxis: {
                        axisLabel: 'Percentage (%)'
                    },
                    callback: function(chart){
                        //console.log("!!! lineChart callback !!!");
                    }
                }
            };
        };

        vm.getChartTitle = function(vaccine) {
            var duration = vm.activeReportToggle[0] == 'A' ? "Annualized" : "Monthly";
            var vaccineName = (vaccine == "ALL") ? "antigens" : vaccine;
            var doseNumber = vm.activeDose.replace("Dose ", "");
            if (vaccine == "ALL") doseNumber = "";
            var antigenLabel = vm.activeDose != undefined ? 
                `${vaccineName}${doseNumber}` : vaccineName;
            
            var yearType = vm.activeReportYear == 'CY' ? 'Calendar Year' : 'Financial year';

            var tab = undefined;
            if (vm.path=="/coverage/dropoutrate")
                tab = "Dropout Rate";
            else if (vm.path=="/coverage/redcategory")
                tab = "Red Categorization";
            else
                tab = "Coverage";

            return "Trend of " + duration + " " + tab + " of " +
                antigenLabel + " for " + vm.activeCoverageYear + " " + yearType;
        };

        vm.getVaccineDosesByPeriod = function(params) {

            CoverageService.getVaccineDosesByPeriod(params)
                .then(function(data) {

                    $scope.optionsMCY = vm.getChartOptions("CY");
                    $scope.optionsACY = vm.getChartOptions("CY");
                    $scope.optionsMFY = vm.getChartOptions("FY");
                    $scope.optionsAFY = vm.getChartOptions("FY");

                    $scope.dataMCY = vm.getChartData(params, data, "CY", false);
                    $scope.dataACY = vm.getChartData(params, data, "CY", true);
                    $scope.dataMFY = vm.getChartData(params, data, "FY", false);
                    $scope.dataAFY = vm.getChartData(params, data, "FY", true);

                    shellScope.child.chartTitle = vm.getChartTitle(vm.selectedAntigen);

                });
        };

        vm.enablePDFDownload = function() {
            shellScope.child.downloadPDF = function(name) { ChartPDFExport.exportWithStyler(vm, name); };
                /*shellScope.child.downloadPDF = function() {
                    //Fix chart before download
                    d3.selectAll("svg .nv-line")
                        .style("fill", "#ffffff")
                        .style("fill-opacity", 0);

                    d3.selectAll(".nvd3 .nv-background")
                        .style("fill", "#ffffff")
                        .style("fill-opacity", 0);

                    d3.selectAll(".nvd3 .nv-axis line")
                        .style("stroke", "#e5e5e5");

                    d3.selectAll(".nvd3 text")
                        .style("font", "normal 13px Arial, sans-serif");

                    d3.selectAll(".nvd3 .nv-groups .nv-point")
                        .style("fill-opacity", 0)
                        .style("stroke-width", "0px");

                    d3.selectAll(".nvd3 .nv-axis .zero line")
                        .style("stroke", "#404040");

                    d3.selectAll(".nv-y .nv-axis g path.domain")
                        .style("stroke", "#404040");

                    d3.selectAll(".legendQuant .label")
                        .style("font", "normal 12px Arial, sans-serif");

                    var pdf = new jsPDF('l', 'mm');
                    var options = { format : 'PNG' };

                    pdf.addHTML(document.getElementById("pdfReport"), 0, 0, options, function() {
                      pdf.save('coverage-report.pdf');
                    });
                }*/
        };

        // $scope.$on('refresh', function(e, startMonth, endMonth, district, vaccine) {
        //     if(startMonth.name && endMonth.name && district.name && vaccine.name) {
        $scope.$on(
            'refreshCoverage2',
            function(e, endMonth, startYear, endYear, activeCoverageYear, antigen, dose, district) {
                /* by Felix; Multiple GeoJson requests were being sent,
                traced the problem to multiple CoverageController calls.
                Found solution by checking currentScope as shown
                */
                if ('vm' in e.currentScope) {
                    //vm.getStockByDistrict(startMonth.name, endMonth.name, district.name, vaccine.name);
                    //vm.getStockByDistrictVaccine(startMonth.name, endMonth.name, district.name, vaccine.name);
                    //vm.getDHIS2VaccineDoses(endMonth.period, district.name, vaccine.name);
                    vm.activeDistrict = district;
                    vm.activeDose = dose;
                    vm.activeStartYear = startYear;
                    vm.activeEndYear = endYear;
                    vm.selectedAntigen = antigen;
                    vm.activeCoverageYear = activeCoverageYear;

                    var enableDistrictGrouping = 0;
                    if (vm.path == '/coverage/redcategory')
                        enableDistrictGrouping = 1;

                    vm.enablePDFDownload();
                    vm.getVaccineDosesByDistrict(endMonth.period, district, antigen);
                    vm.getVaccineDosesByPeriod({
                        startYear: activeCoverageYear,
                        endYear: activeCoverageYear,
                        antigen: antigen,
                        dose: dose,
                        district: district,
                        enableDistrictGrouping: enableDistrictGrouping
                    });

                    // vm.getVaccineDoses(endMonth.period, antigen, district);
                    if (activeCoverageYear != vm.lastEndYear) {
                        vm.getVaccineDoses(activeCoverageYear, antigen, district);
                    } else {
                        vm.updateMapWithVaccine(antigen);
                    }

                    // vm.getRedVaccineDoses(endMonth.period, antigen);


                    vm.lastEndYear = activeCoverageYear;
                }
            }
        );

    }

])
    .directive("reportYearToggles", function() {
        return {
            templateUrl: 'static/app/components/coverage/report-year-toggles.html'
        }
    });
})(window.angular);

(function (angular) {
    'use strict';
angular.module('dashboard').controller('FinanceDataController', FinanceDataController);

FinanceDataController.$inject = ['$scope', '$http', 'FinanceService'];
function FinanceDataController($scope, $http, FinanceService) {

    $scope.addNewRow = addNewRow;
    $scope.saveRow = saveRow;

    $scope.gridOptions = {};
    $scope.gridOptions.data = [];
    $scope.gridOptions.columnDefs = [
        {name: 'period', enableCellEdit: true },
        {name: 'gavi_approved', enableCellEdit: true },
        {name: 'gavi_disbursed', enableCellEdit: true },
        {name: 'gou_approved', enableCellEdit: true },
        {name: 'gou_disbursed', enableCellEdit: true }
    ];

    // $http.get('/finance/list', {})
    //     .then(function(response) {
    //         var data = angular.fromJson(response.data);
    //         data.map(function(d) {
    //             $scope.gridOptions.data.push(d.fields);
    //         });
    //     })
    FinanceService.getFinanceData().then(function(data) {
        data.map(function(d) {
            $scope.gridOptions.data.push(d);
        });
    });

    $scope.gridOptions.onRegisterApi = function(gridApi){
        $scope.gridApi = gridApi;
        gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
    };

    function addNewRow() {
        $scope.gridOptions.data.push({
            period: 0,
            gavi_approved: 0,
            gavi_disbursed: 0,
            gou_approved: 0,
            gou_disbursed: 0
        });
    }

    function saveRow(rowEntity) {
        $http.defaults.xsrfCookieName = 'csrftoken';
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        var promise = $http.post('/finance/update', rowEntity)

        $scope.gridApi.rowEdit.setSavePromise(rowEntity, promise.promise);
        console.log(rowEntity);
    }
}

})(window.angular);

(function (angular) {
    'use strict';
angular.module('dashboard').controller('MainFinanceController', MainFinanceController);

MainFinanceController.$inject = ['$scope', 'ChartPDFExport', 'ChartSupportService', 'FinanceService'];
function MainFinanceController($scope, ChartPDFExport, ChartSupportService, FinanceService) {
    var vm = this;
    vm.exportPDF = function(name) { ChartPDFExport.exportWithStyler(vm, name); };
    vm.graphOptions = getOptions();
    vm.apiData = undefined;
    vm.chartInstance = undefined;
    vm.yearIndexes = [];
    vm.activeToggle = 'GAVI';
    vm.graphCurrency = 'USD';
    vm.compactAmounts = false;

    resetGraphData();
    setYearFilterOptions();
    $scope.$watch('vm.activeToggle', changeTabs);
    $scope.$on('refreshFinance', updateChart);
    $scope.$watch('vm.graphCurrency', changeCurrency);
    $scope.$watch('vm.compactAmounts', compactAmounts);

    function resetGraphData() {
        vm.graphData = getDefaultGraphData();
        vm.allocGraphData = [];
    }

    function changeCurrency(newValue, oldValue) {
        if (newValue != oldValue) {
            resetGraphData();
            updateChartWithData(vm.apiData);
        }
    }

    function compactAmounts(newValue, oldValue) {
        if (newValue != oldValue) {
            resetGraphData();
            updateChartWithData(vm.apiData);
        }
    }

    function setYearFilterOptions() {
        FinanceService.getFinanceYears().then(function(data) {
            $scope.$parent.financeYears = data;
            $scope.$emit('setDefaultYears', data[0], data[data.length-1]);
        });
    }

    function getDefaultGraphData() {
        return {
            gaviAlloc: [
                {key: 'Approved', values: []},
                {key: 'Disbursed', values: []}
            ],
            gouAlloc: [
                {key: 'Approved', values: []},
                {key: 'Disbursed', values: []}
            ],
            allOblig: [
                {key: 'Gavi Funds', values: []},
                {key: 'GOU Funds', values: []}
            ]
        };
    }

    function _cur(amount) {
        if (vm.graphCurrency == 'UGX')
            return amount * 3600;
        return amount;
    }

    function updateChart(e, params) {
        resetGraphData();
        FinanceService.getFinanceData(params).then(function(data) {
            vm.apiData = data;
            updateChartWithData(data);
        });
    }

    function updateChartWithData(data) {
        vm.yearIndexes = [];
        for (var i in data) {
            var yearIndex = getYearIndex(data[i].period)

            vm.graphData.allOblig[0].values.push({x: yearIndex, y: _cur(data[i].gavi_approved)});
            vm.graphData.allOblig[1].values.push({x: yearIndex, y: _cur(data[i].gou_approved)});

            vm.graphData.gaviAlloc[0].values.push({x: yearIndex, y: _cur(data[i].gavi_approved)});
            vm.graphData.gaviAlloc[1].values.push({x: yearIndex, y: _cur(data[i].gavi_disbursed)});

            vm.graphData.gouAlloc[0].values.push({x: yearIndex, y: _cur(data[i].gou_approved)});
            vm.graphData.gouAlloc[1].values.push({x: yearIndex, y: _cur(data[i].gou_disbursed)});
        }
        /*Trigger the loading of the inital Tab, with random values*/
        changeTabs(0,1);
    }

    function getOptions() {
        var chartOptions = ChartSupportService.getOptions('multiBarChart');
        chartOptions.chart.color = ["green", "DodgerBlue"];
        chartOptions.chart.width = 900;
        chartOptions.chart.margin = {left: 80, top: 70};
        chartOptions.chart.legend.width = 900;
        chartOptions.chart.xAxis.axisLabel = "years";
        chartOptions.chart.yAxis.axisLabel = "";
        chartOptions.chart.xAxis.tickFormat = function(d){
            return vm.yearIndexes[d];
        };
        chartOptions.chart.valueFormat = function(d){
            return tickFormat(d3.format('.0f'));
        };
        //Humanize the labels
        chartOptions.chart.dispatch.renderEnd = function() {
            if (vm.compactAmounts)
                ChartSupportService.initLabels(true);
            else
                ChartSupportService.initLabels();
        }

        return chartOptions;
    }

    function getYearIndex(year) {
        if (vm.yearIndexes.indexOf(year) == -1) vm.yearIndexes.push(year);
        return vm.yearIndexes.indexOf(year);
    }

    function changeTabs(newValue, oldValue) {
        if (newValue != oldValue) {
            ChartSupportService.clearLabels();
            if (vm.activeToggle == 'GAVI')
                vm.allocGraphData = vm.graphData.gaviAlloc;
            else
                vm.allocGraphData = vm.graphData.gouAlloc;
        }
    }

}

})(window.angular);
(function (angular) {
    // 'use strict';
angular.module('dashboard')
.controller('FridgeController', ['$scope', 'FridgeService', '$rootScope', 'NgTableParams', 'FilterService',
function($scope, FridgeService, $rootScope, NgTableParams, FilterService)
{

    var vm = this;
    var shellScope = $scope.$parent;
    shellScope.child = $scope;

    vm.getFridgeAllDistrictCapacity = function(startQuarter, endQuarter, fridgeDistrict, carelevel) {

        vm.startQuarter = vm.startQuarter ? vm.startQuarter : "201601";
        vm.endQuarter = vm.endQuarter ? vm.endQuarter : "201604";
        fridgeDistrict = "";
        vm.carelevel = carelevel;

        FridgeService.getFridgeDistrictCapacity(startQuarter, endQuarter, fridgeDistrict, carelevel)
        .then(function(data) {

            vm.data = angular.copy(data);

            tabledataAlldistricts = vm.data.filter(
                function (value) {
                    return value;
                });
                vm.tableParamsCapacityAlldistricts = new NgTableParams({
                    page: 1,
                    count: 10
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: tabledataAlldistricts,
                });

                //====Additional Metrics====

                var metrics = FridgeService.getFridgeCapacityMetrics(vm.data);

                shellScope.child.usurp = metrics.surplus;
                shellScope.child.usufficient = metrics.sufficient;
                shellScope.child.ushortage= metrics.shortage;
            });


        };

        vm.getFridgeDistrictCapacity = function(startQuarter, endQuarter, fridgeDistrict, carelevel) {

            vm.startQuarter ? vm.startQuarter : "201601";
            vm.endQuarter = vm.endQuarter ? vm.endQuarter : "201604";
            district = "";
            vm.fridgeDistrict = fridgeDistrict;
            vm.carelevel = carelevel;

            FridgeService.getFridgeDistrictCapacity(startQuarter, endQuarter, fridgeDistrict, carelevel)
            .then(function(data) {

                vm.data = angular.copy(data);


                // calculate totals

                shellScope.child.fridgeDistrict = district;




                // construct District graph data
                var graphdata = [];
                var seriesRequired = [];
                var seriesAvailable = [];
                var seriesGap = [];
                shellScope.child.available = 0;

                for (var i = 0; i < vm.data.length ; i++) {
                    seriesRequired.push([vm.data[i].quarter.slice(0,4) + "-Q" + vm.data[i].quarter.slice(5,6), vm.data[i].required])
                    seriesAvailable.push([vm.data[i].quarter.slice(0,4) + "-Q" + vm.data[i].quarter.slice(5,6), vm.data[i].available])
                    seriesGap.push([vm.data[i].quarter.slice(0,4) + "-Q" + vm.data[i].quarter.slice(5,6), vm.data[i].gap])
                    if (vm.data[i].quarter){
                        shellScope.child.available = vm.data[i].available
                    }

                }
                /*
                seriesRequired = [[201602, 30], [201603, 30]];
                seriesAvailable = [[201602, 60], [201603, 20]];
                */

                graphdata.push({
                    key: "Required",
                    values: seriesRequired,
                    color:'#2A448A'
                });
                graphdata.push({
                    key: "Available",
                    values: seriesAvailable,
                    color:'green'
                });

                vm.graph = graphdata;


                // update graph
                vm.options = {
                    chart: {
                        type: "multiBarChart",
                        height: 450,
                        margin: {
                            top: 20,
                            right: 20,
                            bottom: 45,
                            left: 45
                        },
                        clipEdge: true,
                        stacked: true,
                        x: function(d){ return d[0]; },
                        y: function(d){ return d[1]; },
                        showValues: true,
                        showYAxis: false,
                        //color: function(d){ return 'green'}

                        //valueFormat: function(d){
                        //    return tickFormat(d3.format(',.1f'));
                        //}
                    },
                };


            });
        };


        vm.getFridgeFacilityCapacity = function(startQuarter, endQuarter, fridgeDistrict, carelevel) {

            vm.startQuarter ? vm.startQuarter : "201601";
            vm.endQuarter = vm.endQuarter ? vm.endQuarter : "201604";
            district = "";
            vm.district = fridgeDistrict;
            vm.carelevel = carelevel;

            FridgeService.getFridgeFacilityCapacity(startQuarter, endQuarter, fridgeDistrict, carelevel)
            .then(function(data) {

                vm.data = angular.copy(data);
                vm.tableParams_f = new NgTableParams({
                    page: 1,
                    count: 15
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: vm.data,
                });

                // calculate totals
                shellScope.child.fridgeDistrict = vm.fridgeDistrict;
                shellScope.child.carelevel = vm.carelevel;

                //====Additional Metrics====

                var metrics = FridgeService.getFridgeCapacityMetrics(vm.data);

                shellScope.child.utsurp = (metrics.surplus/metrics.total)*100;
                shellScope.child.utsufficient = (metrics.sufficient/metrics.total)*100;
                shellScope.child.utshortage= (metrics.shortage/metrics.total)*100;

            });
        };


        vm.getFridgeAllDistrictRefrigerator = function(startQuarter, endQuarter, fridgeDistrict, carelevel) {

            vm.startQuarter = vm.startQuarter ? vm.startQuarter : "201601";
            vm.endQuarter = vm.endQuarter ? vm.endQuarter : "201604";
            fridgeDistrict = "";
            vm.fridgeDistrict = fridgeDistrict;
            vm.carelevel = carelevel;

            FridgeService.getFridgeDistrictRefrigerator(startQuarter, endQuarter, fridgeDistrict, carelevel)
            .then(function(data) {

                vm.data = angular.copy(data);
                tabledataAlldistricts = vm.data.filter(
                    function (value) {
                        return value;
                    });
                    vm.tableParamsFunctionalityAlldistricts = new NgTableParams({
                        page: 1,
                        count: 10
                    }, {
                        filterDelay: 0,
                        counts: [],
                        data: tabledataAlldistricts,
                    });

                });
            };

            vm.getFridgeDistrictRefrigerator = function(startQuarter, endQuarter, fridgeDistrict, carelevel) {

                vm.startQuarter = vm.startQuarter ? vm.startQuarter : "201601";
                vm.endQuarter = vm.endQuarter ? vm.endQuarter : "201604";
                district = "";
                vm.carelevel = carelevel;

                FridgeService.getFridgeDistrictRefrigerator(startQuarter, endQuarter, fridgeDistrict, carelevel)
                .then(function(data) {

                    vm.data = angular.copy(data);
                    tabledataAlldistricts = vm.data.filter(
                        function (value) {
                            return value;
                        });
                        vm.tableParamsAlldistricts = new NgTableParams({
                            page: 1,
                            count: 10
                        }, {
                            filterDelay: 0,
                            counts: [],
                            data: tabledataAlldistricts,
                        });

                        vm.tableParams_d = new NgTableParams({
                            page: 1,
                            count: 15
                        }, {
                            filterDelay: 0,
                            counts: [],
                            data: vm.data,
                        });

                        // construct District graph data

                        var graphfunctionalitydata = [];
                        var seriesExisting = [];
                        var seriesNotWorking = [];
                        var seriesmaintenance = [];

                        shellScope.child.functionality = 0;
                        shellScope.child.fridgeDistrict = district;


                        for (var i = 0; i < vm.data.length ; i++) {
                            seriesExisting.push([vm.data[i].quarter.slice(0,4) + "-Q" + vm.data[i].quarter.slice(5,6), vm.data[i].number_existing])
                            seriesNotWorking.push([vm.data[i].quarter.slice(0,4) + "-Q" + vm.data[i].quarter.slice(5,6), vm.data[i].not_working])
                            seriesmaintenance.push([vm.data[i].quarter.slice(0,4) + "-Q" + vm.data[i].quarter.slice(5,6), vm.data[i].needs_maintenance])
                            if (vm.data[i].quarter)
                            shellScope.child.functionality = (vm.data[i].number_existing - vm.data[i].not_working)/vm.data[i].number_existing*100;
                        }

                        graphfunctionalitydata.push({
                            key: "Existing",
                            values: seriesExisting,
                            color:'green'
                        });
                        graphfunctionalitydata.push({
                            key: "Not Working",
                            values: seriesNotWorking,
                            color:'#2A448A'
                        });
                        graphfunctionalitydata.push({
                            key: "Needs maintenance",
                            values: seriesmaintenance,
                            color:'red'
                        });

                        vm.graphfunctionality = graphfunctionalitydata;


                        // update graph
                        vm.optionsfunctionality = {
                            chart: {
                                type: "multiBarChart",
                                height: 450,
                                margin: {
                                    top: 20,
                                    right: 20,
                                    bottom: 45,
                                    left: 45
                                },
                                showControls: false,
                                clipEdge: true,
                                stacked: true,
                                x: function(d){ return d[0]; },
                                y: function(d){ return d[1]; },
                                showValues: true,
                                showYAxis: false,
                                //valueFormat: function(d){
                                //    return tickFormat(d3.format(',.1f'));
                                //}
                            },
                        };


                    });
                };

                vm.getFridgeFacilityRefrigerator = function(startQuarter, endQuarter, fridgeDistrict, carelevel) {

                    vm.startQuarter ? vm.startQuarter : "201601";
                    vm.endQuarter = vm.endQuarter ? vm.endQuarter : "201604";
                    district = "";
                    vm.district = fridgeDistrict;
                    vm.carelevel = carelevel;

                    FridgeService.getFridgeFacilityRefrigerator(startQuarter, endQuarter, fridgeDistrict, carelevel)
                    .then(function(data) {

                        vm.data = angular.copy(data);
                        tabledataAllfacilities = vm.data.filter(
                            function (value) {
                                return value;
                            });

                            vm.tableParamsAllfacilities = new NgTableParams({
                                page: 1,
                                count: 10
                            }, {
                                filterDelay: 0,
                                counts: [],
                                data: tabledataAllfacilities,
                            });

                            vm.tableParams_f = new NgTableParams({
                                page: 1,
                                count: 15
                            }, {
                                filterDelay: 0,
                                counts: [],
                                data: vm.data,
                            });

                            // calculate totals
                            shellScope.child.fridgeDistrict = vm.fridgeDistrict;
                            shellScope.child.carelevel = vm.carelevel;

                        });
                    };

                    vm.getFridgeAllDistrictImmunizingFacility = function(startQuarter, endQuarter, fridgeDistrict, carelevel) {

                        vm.startQuarter = vm.startQuarter ? vm.startQuarter : "201601";
                        vm.endQuarter = vm.endQuarter ? vm.endQuarter : "201604";
                        fridgeDistrict = "";
                        vm.carelevel = carelevel;

                        FridgeService.getFridgeDistrictImmunizingFacility(startQuarter, endQuarter, fridgeDistrict, carelevel)
                        .then(function(data) {

                            vm.data = angular.copy(data);
                            allData =
                            tabledataAlldistricts = vm.data.filter(
                                function (value) {
                                    return value;
                                });
                                vm.tableParamsImmunizingAlldistricts = new NgTableParams({
                                    page: 1,
                                    count: 10
                                }, {
                                    filterDelay: 0,
                                    counts: [],
                                    data: tabledataAlldistricts,
                                });

                            });
                        };

                        vm.getFridgeDistrictImmunizingFacility = function(startQuarter, endQuarter, fridgeDistrict, carelevel) {

                            vm.startQuarter ? vm.startQuarter : "201601";
                            vm.endQuarter = endQuarter.name;
                            district = "";
                            vm.district = fridgeDistrict;
                            vm.carelevel = carelevel;

                            FridgeService.getFridgeDistrictImmunizingFacility(startQuarter, endQuarter, fridgeDistrict, carelevel)
                            .then(function(data) {

                                vm.data = angular.copy(data);
                                tabledataAllfridge = vm.data.filter(
                                    function (value) {
                                        return value;
                                    });
                                    vm.tableParamsAllfridge = new NgTableParams({
                                        page: 1,
                                        count: 10
                                    }, {
                                        filterDelay: 0,
                                        counts: [],
                                        data: tabledataAllfridge,
                                    });

                                    vm.tableParams_d = new NgTableParams({
                                        page: 1,
                                        count: 15
                                    }, {
                                        filterDelay: 0,
                                        counts: [],
                                        data: vm.data,
                                    });

                                    // calculate totals
                                    shellScope.child.fridgeDistrict = district;
                                    shellScope.child.quarter = endQuarter.name - 2;


                                    // construct District graph data
                                    var graphdataimmunizing = [];





                                    for (var i = 0; i < vm.data.length ; i++) {
                                        var Immunizing = vm.data[i].immunizing;
                                        var NotImmunizing = vm.data[i].Total_facilities - vm.data[i].immunizing;

                                        shellScope.child.facility = vm.data[i].immunizing;

                                    }



                                    // update graph
                                    vm.optionsimmunizing = {
                                        chart: {
                                            type: 'pieChart',
                                            height: 500,
                                            width: 500,
                                            x: function (d) {
                                                return d.key;
                                            },
                                            y: function (d) {
                                                return d.y;
                                            },
                                            showLabels: true,
                                            duration: 500,
                                            labelThreshold: 0.01,
                                            labelSunbeamLayout: true,
                                            legend: {
                                                margin: {
                                                    top: 5,
                                                    right: 35,
                                                    bottom: 5,
                                                    left: 0
                                                }
                                            }
                                        }
                                    };
                                    vm.graphimmunizing = [
                                        {
                                            key: "Immunizing",
                                            y: Immunizing,
                                            color:'green'
                                        },
                                        {
                                            key: "Not Immunizing",
                                            y: NotImmunizing,
                                            color:'#2A448A'
                                        }

                                    ];


                                });
                            };

                            $scope.$on('refreshCapacity', function(e, startQuarter, endQuarter, fridgeDistrict, carelevel) {
                                if(startQuarter && endQuarter && fridgeDistrict.district)
                                {
                                    vm.getFridgeDistrictRefrigerator(startQuarter, endQuarter, fridgeDistrict.district, carelevel.group);
                                    vm.getFridgeAllDistrictRefrigerator(startQuarter, endQuarter, fridgeDistrict.district, carelevel.group);
                                    vm.getFridgeFacilityRefrigerator(startQuarter, endQuarter, fridgeDistrict.district, carelevel.group);
                                    vm.getFridgeAllDistrictImmunizingFacility(startQuarter, endQuarter, fridgeDistrict.district, carelevel.group);
                                    vm.getFridgeDistrictImmunizingFacility(startQuarter, endQuarter, fridgeDistrict.district, carelevel.group);
                                    vm.getFridgeAllDistrictCapacity(startQuarter, endQuarter, fridgeDistrict.district, carelevel.group);
                                    vm.getFridgeDistrictCapacity(startQuarter, endQuarter, fridgeDistrict.district, carelevel.group);
                                    vm.getFridgeFacilityCapacity(startQuarter, endQuarter, fridgeDistrict.district, carelevel.group);

                                }
                            });

                        }

                    ]);
})(window.angular);

(function (angular) {
    //'use strict';
angular.module('dashboard').controller('GenericImportController', GenericImportController);

GenericImportController.$inject = ['$scope', '$uibModal'];
function GenericImportController($scope, $uibModal) {
    var vm = this;
    vm.importDataFile = showImportModal;
    vm.animationsEnabled = true;

    function showImportModal(size, parentSelector) {
        var parentElem = parentSelector ? 
        angular.element($document[0].querySelector('.generic-import ' + parentSelector)) : undefined;

        var modalInstance = $uibModal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'importModalContent.html',
            controller: 'ModalInstanceCtrl',
            controllerAs: 'vm',
            size: size,
            appendTo: parentElem
        });

        modalInstance.result.then(function () {
            importDataFile();
        }, function () {
            //alert('Canceleld');
        });

    }

    function importDataFile() {
        alert('Import in progress');
    }
}

})(window.angular);

(function (angular) {
    angular.module('dashboard').controller('ModalInstanceCtrl', function ($uibModalInstance) {
        var vm = this;
        
        vm.ok = function () {
            $uibModalInstance.close('done');
        };
    
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})(window.angular);
(function (angular) {
    // 'use strict';
angular.module('dashboard')
    .controller('PlanningController', ['$scope', 'AnnualService', '$rootScope', 'NgTableParams', 'FilterService',
    function($scope, AnnualService, $rootScope, NgTableParams, FilterService)
    {
        var vm = this;
        var shellScope = $scope.$parent;
        shellScope.child = $scope;

        vm.getFundActivities = function(year) {
            year = ""
            vm.year = year;

            AnnualService.getFundActivities(year)
                .then(function (data) {

                    var tabledata_funded = [];
                    var tabledata_unfunded = [];

                    vm.data = angular.copy(data);


                    tabledata_funded = vm.data.filter(
                        function (value) {
                            return value.fund == true;
                        }
                    );

                    tabledata_unfunded = vm.data.filter(
                        function (value) {
                            return value.fund == false;
                        }
                    );


                    tabledatafund = vm.data.filter(
                        function (value) {
                            return value;
                        });
                    vm.tableParamsfunded = new NgTableParams({
                        page: 1,
                        count: 15
                    }, {
                        filterDelay: 0,
                        counts: [],
                        data: tabledatafund,
                    });

                    // calculate totals

                    var graphdatafund = [];
                    var funded = 0;
                    var unfunded = 0;

                    for (var i = 0; i < vm.data.length; i++) {
                        if (vm.data[i].fund == true) {
                            funded++;
                        }
                        else if (vm.data[i].fund == false) {
                            unfunded++;
                        }

                    }



                    // update graph
                    vm.fundactivity = {
                        chart: {
                            type: 'pieChart',
                            height: 500,
                            width: 500,
                            x: function (d) {
                                return d.key;
                            },
                            y: function (d) {
                                return d.y;
                            },
                            showLabels: true,
                            duration: 500,
                            labelThreshold: 0.01,
                            labelSunbeamLayout: true,
                            legend: {
                                margin: {
                                    top: 5,
                                    right: 35,
                                    bottom: 5,
                                    left: 0
                                }
                            }
                        }
                    };

                    if (funded == vm.data.length) {
                        vm.graphfundedactivities = [];
                    } else {
                        vm.tableParams_funded = new NgTableParams({
                            page: 1,
                            count: 15
                        }, {
                            filterDelay: 0,
                            counts: [],
                            data: tabledata_funded,
                        });

                        vm.tableParams_unfunded = new NgTableParams({
                            page: 1,
                            count: 15
                        }, {
                            filterDelay: 0,
                            counts: [],
                            data: tabledata_unfunded,
                        });


                        vm.graphfundedactivities = [
                            {
                                key: "Funded",
                                y: (funded / vm.data.length) * 100,
                                color:'green'
                            },
                            {
                                key: "Unfunded Activities",
                                y: (unfunded / vm.data.length) * 100,
                                color:'red'
                            }
                        ];
                    }

                });
            };
        vm.getPriorityActivities = function(year) {
            year = ""
            vm.year = year;

            AnnualService.getPriorityActivities(year)
                .then(function (data) {

                    var tabledata_priorityfund = [];
                    var tabledata_priorityunfunded = [];

                    vm.data = angular.copy(data);


                    tabledata_priorityfund = vm.data.filter(
                        function (value) {
                            return value.fund == true;
                        }
                    );

                    tabledata_priorityunfunded = vm.data.filter(
                        function (value) {
                            return value.fund == false;
                        }
                    );





                    if (funded == vm.data.length) {
                        vm.graphfundedactivities = [];


                    }
                    else {
                        vm.tableParams_priorityfund= new NgTableParams({
                            page: 1,
                            count: 15
                        }, {
                            filterDelay: 0,
                            counts: [],
                            data: tabledata_priorityfund,
                        });

                        vm.tableParams_priorityunfunded = new NgTableParams({
                            page: 1,
                            count: 15
                        }, {
                            filterDelay: 0,
                            counts: [],
                            data: tabledata_priorityunfunded,
                        });

                    }

                    // construct District graph data
                    var prioritydata = [];
                    var prioritydataun = [];
                    var Highpriority = [];
                    var Mediumpriority = [];
                    var Lowpriority = [];
                    var Highpriorityun = [];
                    var Mediumpriorityun = [];
                    var Lowpriorityun = [];

                    for (var i = 0; i < vm.data.length ; i++) {
                        if (vm.data[i].fund == true){
                            Highpriority.push([vm.data[i].area, vm.data[i].High])
                            Mediumpriority.push([vm.data[i].area, vm.data[i].Medium])
                            Lowpriority.push([vm.data[i].area, vm.data[i].Low])
                        }
                        else {
                            Highpriorityun.push([vm.data[i].area, vm.data[i].High])
                            Mediumpriorityun.push([vm.data[i].area, vm.data[i].Medium])
                            Lowpriorityun.push([vm.data[i].area, vm.data[i].Low])
                        }

                    }

                    prioritydata.push({
                            key: "HIGH",
                            values: Highpriority,
                            color:'#2A448A'
                    });
                    prioritydata.push({
                            key: "MEDIUM",
                            values: Mediumpriority,
                            color:'green'
                    });
                    prioritydata.push({
                            key: "LOW",
                            values: Lowpriority,
                            color:'yellow'
                    });

                    vm.prioritygraph = prioritydata;


                    // update graph
                    vm.priorityoptions = {
                            chart: {
                                type: "multiBarChart",
                                height: 450,
                                width:500,

                                clipEdge: true,
                                stacked: true,
                                x: function(d){ return d[0]; },
                                y: function(d){ return d[1]; },
                                showValues: true,
                                showYAxis: true,
                                showXAxis: true,
                                rotateLabels: 55,

                            },
                    };
                    prioritydataun.push({
                            key: "HIGH",
                            values: Highpriorityun,
                            color:'#2A448A'
                    });
                    prioritydataun.push({
                            key: "MEDIUM",
                            values: Mediumpriorityun,
                            color:'green'
                    });
                    prioritydataun.push({
                            key: "LOW",
                            values: Lowpriorityun,
                            color:'yellow'
                    });

                    vm.prioritygraphun = prioritydataun;

                    vm.priorityoptionsun = {
                            chart: {
                                type: "multiBarChart",
                                height: 450,
                                width:500,

                                clipEdge: true,
                                stacked: true,
                                x: function(d){ return d[0]; },
                                y: function(d){ return d[1]; },
                                showValues: true,
                                showYAxis: true,
                                showXAxis: true,
                                rotateLabels: 55,

                            },
                    };

                });
            };

            $scope.$on('refreshAwp', function(e, year) {
                if(year.year)
                {
                    vm.getFundActivities(year.year);
                    vm.getPriorityActivities(year.year);

                }
            });

        }
    ]);
})(window.angular);

(function (angular) {
    // 'use strict';
angular.module('dashboard')
    .controller('StockController', ['$scope', 'StockService', '$rootScope', 'NgTableParams',
    'FilterService', 'MonthService', '$location', 'ChartSupportService', 'ChartPDFExport', '$timeout',
    function($scope, StockService, $rootScope, NgTableParams, FilterService, MonthService,
        $location, ChartSupportService, ChartPDFExport, $timeout)
    {
        var vm = this;
        var shellScope = $scope.$parent;
        shellScope.child = $scope;
        vm.exportPDF = ChartPDFExport.export;

        shellScope.child.isActive = function(viewLocation) {
            return viewLocation === $location.path();
        };

        // Todo: Use this to sort by performance (Malisa)
        vm.SortByKey = function(array, key) {
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        };

        vm.getStockByDistrict = function(startMonth, endMonth, district, vaccine) {

            vm.startMonth ? vm.startMonth : "";
            vm.endMonth = vm.endMonth ? vm.endMonth : "";
            //Todo: Temporarily disable filtering by district for the table
            district = ""
            vm.district = "";
            vm.vaccine = vm.selectedVaccine ? vm.selectedVaccine.name : "";

            StockService.getStockByDistrict(startMonth, endMonth, district, vaccine)
                .then(function(data) {

                    var tabledata_so = [];
                    var tabledata_bm = [];
                    var tabledata_wr = [];
                    var tabledata_am = [];
                    var tabledata_search =[];

                    vm.data = angular.copy(data);

                    tabledata_so = vm.data.filter(
                        function (value) {
                            return value.at_hand == 0;
                        });

                    tabledata_am = vm.data.filter(
                        function (value) {
                            return value.at_hand > value.stock_requirement__maximum;
                        });

                    tabledata_wr = vm.data.filter(
                        function (value) {
                            return ((value.at_hand > value.stock_requirement__minimum) && (value.at_hand < value.stock_requirement__maximum));
                        });

                    tabledata_bm = vm.data.filter(
                        function (value) {
                            return ((value.at_hand < value.stock_requirement__minimum) && (value.at_hand > 0));
                        });
                    tabledata_search = vm.data.filter(
                        function (value) {
                            return value;
                        });

                    tabledataAlldistricts = vm.data.filter(
                        function (value) {
                            return value;
                        });

                    vm.tableParamsAlldistricts = new NgTableParams({
                        page: 1,
                        count: 10
                    }, {
                        filterDelay: 0,
                        counts: [],
                        data: tabledataAlldistricts,
                    });

                    // calculate totals
                    var nothing = 0;
                    var within = 0;
                    var belowminimum = 0;
                    var abovemaximum = 0;
                    var status = "";
                    for (var i = 0; i < vm.data.length; i++) {
                        if (vm.data[i].at_hand == 0)
                            nothing++,
                            status="Stocked Out";
                        else if ((vm.data[i].at_hand > vm.data[i].stock_requirement__minimum) && (vm.data[i].at_hand < vm.data[i].stock_requirement__maximum))
                            within++,
                            status="Within Range";
                        else if ((vm.data[i].at_hand < vm.data[i].stock_requirement__minimum) && (vm.data[i].at_hand > 0))
                            belowminimum++,
                            status="Below MIN";
                        else if (vm.data[i].at_hand > vm.data[i].stock_requirement__maximum)
                            abovemaximum++,
                            status="Above MAX";
                        vm.data[i].status=status;
                    }

                    shellScope.child.stockedout = (nothing / vm.data.length) * 100;
                    var balanceMonth = new Date(MonthService.monthToDate(endMonth));
                    balanceMonth.setMonth(balanceMonth.getMonth() - 1);
                    shellScope.child.themonth = balanceMonth;
                    shellScope.child.vaccine = vaccine;

                    // update graph
                    vm.options = {
                        chart: {
                            type: 'pieChart',
                            height: 480,
                            width: 480,
                            x: function (d) {
                                return d.key;
                            },
                            y: function (d) {
                                return d.y;
                            },
                            showLabels: true,
                            duration: 500,
                            labelThreshold: 0.01,
                            labelSunbeamLayout: true,
                            legend: {
                                margin: {
                                    top: 5,
                                    right: 35,
                                    bottom: 5,
                                    left: 0
                                }
                            }
                        }
                    };

                    if (nothing == vm.data.length) {
                        vm.graph = [];
                    } else {
                        vm.tableParams_so = new NgTableParams({
                            page: 1,
                            count: 10
                        }, {
                            filterDelay: 0,
                            counts: [],
                            data: tabledata_so,
                        });

                        vm.tableParams_bm = new NgTableParams({
                            page: 1,
                            count: 10
                        }, {
                            filterDelay: 0,
                            counts: [],
                            data: tabledata_bm,
                        });

                        vm.tableParams_wr = new NgTableParams({
                            page: 1,
                            count: 10
                        }, {
                            filterDelay: 0,
                            counts: [],
                            data: tabledata_wr,
                        });

                        vm.tableParams_am = new NgTableParams({
                            page: 1,
                            count: 10
                        }, {
                            filterDelay: 0,
                            counts: [],
                            data: tabledata_am,
                        });
                        vm.tableParams_search = new NgTableParams({
                            page: 1,
                            count: 10
                        }, {
                            filterDelay: 0,
                            counts: [],
                            data: tabledata_search,
                        });

                        vm.graph = [
                            {
                                key: "Stocked Out",
                                y: (nothing / vm.data.length) * 100,
                                color:'#FF0000'
                            },
                            {
                                key: "Within Range",
                                y: (within / vm.data.length) * 100,
                                color:'#008000'
                                // color:'#FFFF00'
                            },
                            {
                                key: "Below MIN",
                                y: (belowminimum / vm.data.length) * 100,
                                color:'#FFA500'
                            },
                            {
                                key: "Above MAX",
                                y: (abovemaximum / vm.data.length) * 100,
                                color:'#90EE90'
                                // color:'#008000'
                            }
                        ];
                    }

            });
        };

        vm.getStockByDistrictVaccine = function(startMonth, endMonth, district, vaccine) {

            vm.startMonth ? vm.startMonth : "Nov 2015";
            vm.endMonth = vm.endMonth ? vm.endMonth : "Dec 2016";
            //Todo: Temporarily disable filtering by district for the table
            //district = ""
            vm.district = district;
            vm.vaccine = vaccine; //vm.selectedVaccine ? vm.selectedVaccine.name : "";

            StockService.getStockByDistrictVaccine(startMonth, endMonth, district, vaccine)
                .then(function(data) {

                vm.data = angular.copy(data);
                vm.tableParams = new NgTableParams({
                    page: 1,
                    count: 15
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: vm.data,
                });

                // calculate totals
                shellScope.child.district = vm.district;
                shellScope.child.vaccine = vm.vaccine;


                // construct Distribution graph data
                var graphdataDistribution = [];
                var seriesDistribution = [];
                var seriesOrders = [];
                var min_seriesDistribution = [];
                var max_seriesDistribution = [];
                shellScope.child.refreshrate = 0;

                for (var i = 0; i < vm.data.length ; i++) {
                    seriesDistribution.push([vm.data[i].month, parseInt(vm.data[i].received)])
                    seriesOrders.push([vm.data[i].month, vm.data[i].ordered])
                    min_seriesDistribution.push([vm.data[i].month, vm.data[i].stock_requirement__minimum])
                    max_seriesDistribution.push([vm.data[i].month, vm.data[i].stock_requirement__maximum])
                    if (vm.data[i].month == MonthService.getMonthNumber(endMonth.split(" ")[0])){
                        shellScope.child.refreshrate = vm.data[i].ordered == 0 ? 0 :vm.data[i].received/vm.data[i].ordered*100 ;
                    }
                }
                graphdataDistribution.push({
                        key: "Min",
                        values: min_seriesDistribution,
                        color:'#A5E816'
                });
                graphdataDistribution.push({
                        key: "Issued",
                        values: seriesDistribution,
                        color:'#1F77B4'
                });
                graphdataDistribution.push({
                        key: "Ordered",
                        values: seriesOrders,
                        color:'red'
                });

                graphdataDistribution.push({
                        key: "Max",
                        values: max_seriesDistribution,
                        color:'#FF7F0E'
                });

                vm.graphDistribution = graphdataDistribution;


                // update Distribution graph
                vm.optionsDistribution = {
                        chart: {
                            type: 'lineChart',
                            height: 500,
                            width : 500,
                            title: {
                                enable: true,
                                text: 'Abim'
                            },
                            showLegend: true,
                            stacked: true,
                            showControls: true,
                            margin : {
                                top: 20,
                                right: 20,
                                bottom: 85,
                                left: 65
                            },
                            forceY: ([0,100]),
                            staggerLabels: true,
                            x: function(d){ return d[0]; },
                            y: function(d){ return d[1]; },
                            xAxis: {
                                axisLabel: 'Months',
                                tickFormat: function(d){
                                                return MonthService.getMonthName(d);
                                            },
                                axisLabelDistance: 10
                            },
                            useInteractiveGuideline: true,
                            dispatch: {
                            stateChange: function(e){ console.log("stateChange"); },
                            changeState: function(e){ console.log("changeState"); },
                            tooltipShow: function(e){ console.log("tooltipShow"); },
                            tooltipHide: function(e){ console.log("tooltipHide"); }
                            },
                            showValues: true,
                            valueFormat: function(d){
                                return tickFormat(d3.format(',.1f'));
                            },
                            transitionDuration: 500,
                        }
                };

                // construct Uptake graph data


                // construct Consumption graph data
                var graphdataConsumption = [];
                var seriesConsumption = [];
                var target_seriesConsumption = [];
                shellScope.child.coverage = 0;

                for (var i = 0; i < vm.data.length ; i++) {
                    seriesConsumption.push([vm.data[i].month, vm.data[i].consumed])
                    target_seriesConsumption.push([vm.data[i].month, vm.data[i].stock_requirement__target])
                    if (vm.data[i].month == MonthService.getMonthNumber(endMonth.split(" ")[0])){
                        shellScope.child.coverage = vm.data[i].stock_requirement__target == 0 ?
                            0 :vm.data[i].consumed/vm.data[i].stock_requirement__target*100;
                    }

                }

                graphdataConsumption.push({
                        key: "Actual Consumption",
                        values: seriesConsumption
                });
                graphdataConsumption.push({
                        key: "Planned consumption",
                        values: target_seriesConsumption,
                        color: '#FF7F0E'
                });


                vm.graphConsumption = graphdataConsumption;


                // update Consumption graph
                vm.optionsConsumption = {
                        chart: {
                            type: 'lineChart',
                            height: 500,
                            width : 500,
                            title: {
                                enable: true,
                                text: 'Abim'
                            },
                            showLegend: true,
                            stacked: true,
                            showControls: true,
                            margin : {
                                top: 20,
                                right: 20,
                                bottom: 85,
                                left: 65
                            },
                            forceY: ([0,100]),
                            staggerLabels: true,
                            x: function(d){ return d[0]; },
                            y: function(d){ return d[1]; },
                            xAxis: {
                                axisLabel: 'Months',
                                tickFormat: function(d){
                                                return MonthService.getMonthName(d);
                                            },
                                axisLabelDistance: 10
                            },
                            useInteractiveGuideline: true,
                            dispatch: {
                            stateChange: function(e){ console.log("stateChange"); },
                            changeState: function(e){ console.log("changeState"); },
                            tooltipShow: function(e){ console.log("tooltipShow"); },
                            tooltipHide: function(e){ console.log("tooltipHide"); }
                            },
                            showValues: true,
                            valueFormat: function(d){
                                return tickFormat(d3.format(',.1f'));
                            },
                            transitionDuration: 500,
                        }
                };
            });
        };

        $scope.$on('refresh', function(e, startMonth, endMonth, district, vaccine) {
            if(startMonth.name && endMonth.name && district.name && vaccine.name)
            {
                vm.getStockByDistrict(startMonth.name, endMonth.name, district.name, vaccine.name);
                vm.getStockByDistrictVaccine(startMonth.name, endMonth.name, district.name, vaccine.name);
            }
        });

    }

]);
})(window.angular);

(function (angular) {
    'use strict';
angular.module('dashboard').controller('StockUptakeController', StockUptakeController);

StockUptakeController.$inject = [
    '$scope',
    'StockService',
    'MonthService',
    'ChartSupportService',
    'ChartPDFExport',
    '$timeout'
];
function StockUptakeController($scope, StockService, MonthService, ChartSupportService, ChartPDFExport, $timeout) {
    var vm = this;
    var shellScope = $scope.$parent;
    shellScope.child = $scope;

    shellScope.child.uptake = 0;
    vm.exportPDF = function(name) { ChartPDFExport.exportWithStyler(vm, name); };

    vm.optionsUptake = getOptions();
    vm.periodIndexes = [];

    $scope.$on('refresh', updateChart);
    function updateChart(e, startMonth, endMonth, district, vaccine) {
        StockService.getStockByDistrictVaccine(startMonth.name, endMonth.name, district.name, vaccine.name)
        .then(function(data) {
            vm.data = angular.copy(data);

            var graphdataUptake = [];
            var seriesUptake = [];
            var stockData = [];
            var immunisationData = [];
            var monthlyTargetData = [];
            var forceStartZeroData = [];
            var maxMonthlyTarget = 0;
            shellScope.child.uptake = "0";

            vm.periodIndexes = [];

            for (var i = 0; i < vm.data.length ; i++) {
                var item = vm.data[i];
                /* Certain data had invalid periods like 20172 instead of
                    201702 which were causing errors. Hence the filter below. */
                if (item.period.toString().length == 5) continue;

                // console.log(monthIndex, item);
                //var monthIndex = appHelpers.getMonthIndexFromPeriod(item.period, 'CY');
                var periodIndex = getPeriodIndex(item.period)
                var atHand = item.at_hand == undefined ? item.total_at_hand : item.at_hand;
                var received = item.received == undefined ? item.total_received : item.received;
                var consumed = item.consumed == undefined ? item.total_consumed : item.consumed;
                var monthlyTarget = item.stock_requirement__target == undefined
                    ? item.total_target : item.stock_requirement__target;
                var totalStock = atHand + received;

                maxMonthlyTarget = Math.max(maxMonthlyTarget, Number(monthlyTarget.toFixed(0)));
                stockData.push({x: periodIndex, y: Number(totalStock.toFixed(0))});
                immunisationData.push({x: periodIndex, y: Number(consumed.toFixed(0))});
                monthlyTargetData.push({x: periodIndex, y: Number(monthlyTarget.toFixed(0))});
                forceStartZeroData.push({x: periodIndex, y: 0});

                if (vm.data[i].month == MonthService.getMonthNumber(endMonth.name.split(" ")[0])) {
                    shellScope.child.uptake = received == 0 && atHand == 0 ?
                        0 : Math.round(consumed/(totalStock)*100);
                }
            }

            graphdataUptake.push({key: 'Available Stock (Stock balance + Issues)', type: 'bar', yAxis: 1, values: stockData});
            graphdataUptake.push({key: 'Children Immunised', type: 'bar', yAxis: 1, values: immunisationData});
            graphdataUptake.push({key: 'Monthly Targets', type: 'line', yAxis: 1, values: monthlyTargetData});
            graphdataUptake.push({key: '', type: 'line', yAxis: 1, strokeWidth: 0, values: forceStartZeroData});
            vm.graphUptake = graphdataUptake;
            vm.maxMonthlyTarget = maxMonthlyTarget;

            updateLabels();
        });
    }

    function getOptions() {
        var uptakeOptions = ChartSupportService.getOptions('multiChart');
        uptakeOptions.chart.color = ["green", "DodgerBlue", "red", "white"];
        uptakeOptions.chart.width = 900;
        uptakeOptions.chart.margin = {left: 70, top: 90};
        uptakeOptions.chart.legend.width = 900;
        uptakeOptions.chart.legend.maxKeyLength = 50;
        uptakeOptions.chart.xAxis.axisLabel = "Months";
        uptakeOptions.chart.yAxis.axisLabel = "";
        uptakeOptions.chart.xAxis.tickFormat = function(d){
            return appHelpers.generateLabelFromPeriod(vm.periodIndexes[d], 'CY');
        };
        uptakeOptions.chart.valueFormat = function(d){
            return tickFormat(d3.format('.0f'));
        };
        uptakeOptions.chart.legend.dispatch.stateChange = function() {
            updateLabels();
        };
        return uptakeOptions;
    }

    function updateLabels() {
        ChartSupportService.clearLabels();
        $timeout(function() {
            ChartSupportService.initLabels();
            /* chart.clipEdge seems not to be working,
            this should serve as a hack */
            d3.selectAll(".nv-multibar g").attr("clip-path", "");
        }, 1000);
    }

    function getPeriodIndex(period) {
        if (vm.periodIndexes.indexOf(period) == -1) vm.periodIndexes.push(period);
        return vm.periodIndexes.indexOf(period);
    }
}
})(window.angular);

(function (angular) {
    // 'use strict';
angular.module('dashboard').controller('StockoutTrendController', StockoutTrendController);

StockoutTrendController.$inject = [
    '$scope',
    'StockService',
    'MonthService',
    'ChartSupportService',
    'ChartPDFExport',
    '$timeout'
];
function StockoutTrendController($scope, StockService, MonthService, ChartSupportService, ChartPDFExport, $timeout) {
    var vm = this;
    vm.exportPDF = function(name) { ChartPDFExport.exportWithStyler(vm, name); };
    vm.graphOptions = getOptions();
    vm.graphData = [];
    vm.periodIndexes = [];
    vm.compactValues = false;

    $scope.$on('refresh', updateChart);
    $scope.$watch('vm.compactValues', function() {
        updateChartWithData(vm.data);
    });

    function updateChart(e, startMonth, endMonth, district, vaccine) {
        StockService.getStockByDistrictVaccine(startMonth.name, endMonth.name, district.name, vaccine.name)
        .then(function(data) {
            vm.data = angular.copy(data);
            updateChartWithData(vm.data);
        });
    }

    function updateChartWithData(data) {
        var graphData = [];
        var stockData = [];
        var supplyData = [];
        var orderedData = [];

        vm.periodIndexes = [];

        for (var i = 0; i < vm.data.length ; i++) {
            var item = vm.data[i];
            /* Certain data had invalid periods like 20172 instead of
                201702 which were causing errors. Hence the filter below. */
            if (item.period.toString().length == 5) continue;

            //var monthIndex = appHelpers.getMonthIndexFromPeriod(item.period, 'CY');
            var periodIndex = getPeriodIndex(item.period)
            var atHand = item.at_hand == undefined ? item.total_at_hand : item.at_hand;
            var ordered = item.ordered == undefined ? item.total_ordered : item.ordered;
            var received = item.received == undefined ? item.total_received : item.received;

            stockData.push({x: periodIndex, y: Number(atHand.toFixed(0))});
            orderedData.push({x: periodIndex, y: Number(ordered.toFixed(0))});
            supplyData.push({x: periodIndex, y: Number(received.toFixed(0))});
        }

        graphData.push({key: 'Stock Balance', values: stockData});
        graphData.push({key: 'Orders', values: orderedData});
        graphData.push({key: 'Supply By NMS', values: supplyData});
        vm.graphData = graphData;
    }

    function getOptions() {
        var chartOptions = ChartSupportService.getOptions('multiBarChart');
        chartOptions.chart.color = ["green", "DodgerBlue", "Orange"];
        chartOptions.chart.width = 900;
        chartOptions.chart.margin = {left: 70, top: 70};
        chartOptions.chart.legend.width = 900;
        chartOptions.chart.xAxis.axisLabel = "Months";
        chartOptions.chart.yAxis.axisLabel = "";
        chartOptions.chart.xAxis.tickFormat = function(d){
            return appHelpers.generateLabelFromPeriod(vm.periodIndexes[d], 'CY');
            //return appHelpers.getMonthFromNumber(d, 'CY');
        };
        chartOptions.chart.valueFormat = function(d){
            return tickFormat(d3.format('.0f'));
        };
        chartOptions.chart.dispatch.renderEnd = function() {
            if (vm.compactValues) ChartSupportService.initLabels(true);
            else ChartSupportService.initLabels();
        }
        return chartOptions;
    }

    function getPeriodIndex(period) {
        if (vm.periodIndexes.indexOf(period) == -1) vm.periodIndexes.push(period);
        return vm.periodIndexes.indexOf(period);
    }

}
})(window.angular);

(function (angular) {
    // 'use strict';
angular.module('dashboard')
.controller('UnepiController', [
    '$scope', 'CoverageService','StockService',
    'MonthService', '$rootScope', 'NgTableParams',
    'FilterService', 'FridgeService', 'CoverageCalculator', '$timeout',
    function($scope, CoverageService, StockService,
        MonthService, $rootScope, NgTableParams,
        FilterService, FridgeService, CoverageCalculator, $timeout)
    {
        var vm = this;
        var shellScope = $scope.$parent;
        shellScope.child = $scope;

        function periodDisplay(period)
        {
            var month = parseInt(period.slice(4,6));
            return MonthService.getMonthName(month) + " " + period.slice(0,4)
        }

        vm.getUnepiCoverage = function(period, district, vaccine) {
            var params = {period, district};

            var getValueSum = function(data, name, vaccine) {
                return data.reduce(function(accumulator, value) {
                    if (value.vaccine__name == vaccine) return accumulator + value[name]
                    return accumulator;
                }, 0);
            };

            CoverageService.getVaccineDosesByPeriod(params).then(function(data) {
                var tableData = [];
                var pentaCR = 0,
                    pcvCR = 0;

                shellScope.child.district = district;
                shellScope.child.Gap = 0;
                shellScope.child.dropout_Penta = 0;
                shellScope.child.dropout_hpv = 0;
                shellScope.child.category = 0;
                shellScope.child.periodMonth = periodDisplay(period);

                for (var i in data) {
                    var dataPeriod = data[i].period
                    var lastDose = data[i].total_last_dose;
                    var firstDose = data[i].total_first_dose;
                    var secondDose = data[i].total_second_dose;
                    var planned = data[i].total_planned;
                    var vaccine = data[i].vaccine__name;

                    if (dataPeriod != period) continue;

                    /* Sum up the values from start of year to selected period
                     to calculate Annualized Coverage (avoc) */
                    var totalLastDose = getValueSum(data, 'total_last_dose', vaccine);
                    var totalPlanned = getValueSum(data, 'total_planned', vaccine);

                    var coverageRate = CoverageCalculator.calculateCoverageRate(lastDose, planned);
                    var dropoutRate = CoverageCalculator.calculateDropoutRate(firstDose, lastDose);
                    var redCategory = CoverageCalculator.calculateRedCategory(firstDose, lastDose, planned);
                    var avoc = CoverageCalculator.calculateCoverageRate(totalLastDose, totalPlanned);

                    tableData.push({
                        'vaccine': vaccine,
                        'planned_consumption': planned,
                        'coverage_rate': coverageRate,
                        'avoc': avoc
                    });

                    switch (vaccine) {
                        case "PENTA":
                            pentaCR = coverageRate;
                            shellScope.child.dropout_Penta = dropoutRate;
                            shellScope.child.category = redCategory;
                            break;
                        case "PCV":
                            pcvCR = coverageRate;
                            break;
                        case "HPV":
                            shellScope.child.dropout_hpv = dropoutRate;
                            break;
                    }
                }

                shellScope.child.Gap = pentaCR - pcvCR;

                var params = {page: 1, count: 10};
                var settings = {filterDelay: 0, counts: [], data: tableData};
                vm.tableParamsDoses = new NgTableParams(params, settings);
            });
        }

        vm.getUnepiNationalStock = function(endMonth, district) {
            StockService.getUnepiStock(endMonth, district).then(function(data) {
                var tabledataAllstock = [];
                var stockedOutAntigens = 0;

                /* Turn the district based data into aggregated
                vaccine based data */
                var vaccineData = data.reduce(function(acc, item) {
                    if (! (item.vaccine in acc))
                        acc[item.vaccine] = {
                            at_hand: 0,
                            stock_requirement__minimum: 0,
                            received: 0,
                            ordered: 0,
                            consumed: 0,
                            available_stock: 0
                        };

                    acc[item.vaccine].at_hand += item.at_hand;
                    acc[item.vaccine].stock_requirement__minimum += item.stock_requirement__minimum;
                    acc[item.vaccine].received += item.received;
                    acc[item.vaccine].ordered += item.ordered;
                    acc[item.vaccine].consumed += item.consumed;
                    acc[item.vaccine].available_stock += item.available_stock;

                    return acc;
                }, {});

                for (var vaccine in vaccineData) {
                    var atHand = vaccineData[vaccine].at_hand;
                    var minStock = vaccineData[vaccine].stock_requirement__minimum;
                    var ordered = vaccineData[vaccine].ordered;
                    var received = vaccineData[vaccine].received;
                    var consumed = vaccineData[vaccine].consumed;
                    var availableStock = atHand + received;
                    var monthsStock = Math.round(atHand / minStock);

                    if (monthsStock == 0) stockedOutAntigens++;

                    tabledataAllstock.push({
                        vaccine: vaccine,
                        Months_stock: monthsStock,
                        Refill_rate: (ordered == 0) ? 0 : Math.round((received / ordered) * 100),
                        uptake_rate: (availableStock == 0) ? 0 : Math.round((consumed / availableStock) * 100)
                    });
                }

                shellScope.child.Antigen_stockedout = stockedOutAntigens;

                var params = {page: 1, count: 10};
                var settings = {filterDelay: 0, counts: [], data: tabledataAllstock};
                vm.tableParamsStock = new NgTableParams(params, settings);
            });
        };

            vm.getUnepiStock = function(endMonth, district) {

                vm.endMonth = vm.endMonth ? vm.endMonth : "";

                StockService.getUnepiStock( endMonth, district)
                .then(function(data) {

                    var tabledataAllstock = [];
                    vm.data = angular.copy(data);



                    tabledataAllstock = vm.data.filter(
                        function (value) {
                            return value;
                        });

                        vm.tableParamsStock = new NgTableParams({
                            page: 1,
                            count: 10
                        }, {
                            filterDelay: 0,
                            counts: [],
                            data: tabledataAllstock,
                        });

                        shellScope.child.Antigen_stockedout = 0;

                        for (var i = 0; i < vm.data.length ; i++){
                            if (vm.data[i].Months_stock == 0){
                                shellScope.child.Antigen_stockedout++;

                            }


                        }

                    });
                };

                /*
                Cold Chain & Unepi District filters used different data sources
                For that reason to use the Cold Chain api, the district name
                has to be reformatted to match the cold chain district filter.
                @Todo: Standardize the district values
                */
                vm.parseDistrict = function(district) {
                    return district.replace(" District", "").toUpperCase();
                };

                vm.getUnepiColdChainCapacity = function(endMonth, district) {
                    district = vm.parseDistrict(district);

                    FridgeService.getFridgeFacilityCapacity(undefined, endMonth, district, undefined)
                    .then(function(data) {
                        var metrics = FridgeService.getFridgeCapacityMetrics(data);
                        shellScope.child.metrics = metrics;
                        shellScope.child.per = appHelpers.per;
                    });
                };

                vm.getUnepiColdChainFunctionality = function(endMonth, district) {
                    district = vm.parseDistrict(district);

                    FridgeService.getFridgeDistrictRefrigerator(undefined, endMonth, district, undefined)
                    .then(function(data) {

                        var aggregates = data.reduce(function(acc, item) {
                            acc.totalEquipment += item.number_existing;
                            acc.totalWorkingWell += item.working_well;
                            acc.totalNotWorkingWell += item.not_working;
                            acc.totalNeedMaintenance += item.needs_maintenance;
                            acc.totalFacilities += item.total_facilities;
                            if (item.facility__type__group == 'District Store')
                                acc.totalDistrictStores += 1;
                            return acc;
                        }, {totalEquipment:0, totalFacilities:0, totalWorkingWell: 0,
                            totalNotWorkingWell:0, totalNeedMaintenance: 0, totalDistrictStores: 0});

                        shellScope.child.numberOfColdchainEquipment = aggregates.totalEquipment;
                        
                        shellScope.child.numberWorkingWell = aggregates.totalWorkingWell;
                        shellScope.child.numberNotWorkingWell = aggregates.totalNotWorkingWell;
                        shellScope.child.numberNeedMaintenance = aggregates.totalNeedMaintenance;
                        shellScope.child.per = appHelpers.per;
                        shellScope.child.numberWorking = aggregates.totalEquipment - aggregates.totalNotWorkingWell;
                    });

                    FridgeService.getFacilityTypes(district).then(function(data) {
                        var result = data.reduce(function(acc, item) {
                            if (item.type__group == 'District Store') acc.dvs = item.count;
                            else acc.others += item.count;
                            return acc;
                        }, {dvs: 0, others: 0});
                        
                        shellScope.child.numberOfDistrictStores = result.dvs;
                        shellScope.child.numberOfFacilities = result.others;
                    });
                };

                vm.enablePDFDownload = function() {
                        shellScope.child.downloadPDF = function() {
                            shellScope.child.printView = true;
                            $timeout(function() {
                                var pdf = new jsPDF('p', 'mm');
                                pdf.addHTML(document.getElementById("unepiReport"), function() {
                                  pdf.save('unepi-report.pdf');

                                });
                            }, 100);

                            $timeout(function() {
                                shellScope.child.printView = false;
                            }, 1000);
                        }
                };

                $scope.$on('refresh', function(e, startMonth, endMonth, district, vaccine) {
                    if(startMonth.name && endMonth.name && district.name && vaccine.name)
                    {
                        vm.getUnepiCoverage(endMonth.period, district.name, vaccine.name);

                        if (district.name == "National") {
                            vm.getUnepiNationalStock(endMonth.name, district.name, vaccine.name);
                        } else {
                            vm.getUnepiStock(endMonth.name, district.name, vaccine.name);
                        }
                        vm.getUnepiColdChainCapacity(endMonth.name, district.name);
                        vm.getUnepiColdChainFunctionality(endMonth.name, district.name);
                        vm.enablePDFDownload();
                    }
                });

            }
        ]);
})(window.angular);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9oZWxwZXJzLmpzIiwic2hhcmVkL2FubnVhbFNlcnZpY2UuanMiLCJzaGFyZWQvY2hhcnRQREZFeHBvcnRTZXJ2aWNlLmpzIiwic2hhcmVkL2NoYXJ0U3VwcG9ydFNlcnZpY2UuanMiLCJzaGFyZWQvY292ZXJhZ2VDYWxjdWxhdG9yU2VydmljZS5qcyIsInNoYXJlZC9jb3ZlcmFnZVNlcnZpY2UuanMiLCJzaGFyZWQvZmlsdGVyU2VydmljZS5qcyIsInNoYXJlZC9maW5hbmNlU2VydmljZS5qcyIsInNoYXJlZC9mcmlkZ2VTZXJ2aWNlLmpzIiwic2hhcmVkL21haW5Db250cm9sbGVyLmpzIiwic2hhcmVkL21hcFN1cHBvcnRTZXJ2aWNlLmpzIiwic2hhcmVkL3N0b2NrU2VydmljZS5qcyIsImNvbXBvbmVudHMvY292ZXJhZ2UvYW5udWFsQ292ZXJhZ2VDb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9jb3ZlcmFnZS9jb3ZlcmFnZUNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL2ZpbmFuY2UvZmluYW5jZURhdGFDb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9maW5hbmNlL21haW5GaW5hbmNlQ29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvZnJpZGdlL2ZyaWRnZUNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL2ltcG9ydC9nZW5lcmljSW1wb3J0Q29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvcGxhbm5pbmcvUGxhbm5pbmdDb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9zdG9jay9zdG9ja0NvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL3N0b2NrL3N0b2NrVXB0YWtlQ29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvc3RvY2svc3RvY2tvdXRUcmVuZENvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL3VuZXBpL1VuZXBpQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdnBDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2ZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAod2luZG93LCBkb2N1bWVudCkge1xuICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgdmFyIGFwcEhlbHBlcnMgPSB3aW5kb3cuYXBwSGVscGVycyB8fCAod2luZG93LmFwcEhlbHBlcnMgPSB7fSk7XG5cbiAgICAgdmFyIHBlciA9IGZ1bmN0aW9uKHZhbHVlLCB0b3RhbCkge1xuICAgICAgICAgdmFyIHBlcmNlbnRhZ2UgPSAodmFsdWUvdG90YWwpICogMTAwO1xuICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQocGVyY2VudGFnZSAqIDEwKSAvIDEwO1xuICAgICB9O1xuXG4gICAgIHZhciBnZW5lcmF0ZUxhYmVsRnJvbVBlcmlvZCA9IGZ1bmN0aW9uKHBlcmlvZCkge1xuICAgICAgICAgcGVyaW9kID0gcGVyaW9kLnRvU3RyaW5nKCk7XG4gICAgICAgICB2YXIgeWVhciA9IHBlcmlvZC5zdWJzdHIoMiwyKTtcbiAgICAgICAgIHZhciBtb250aCA9IE51bWJlcihwZXJpb2Quc3Vic3RyKDQsMikpO1xuXG4gICAgICAgICB2YXIgbW9udGhzID0gWycnLCAnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXB0JywgJ09jdCcsICdOb3YnLCAnRGVjJ107XG4gICAgICAgICByZXR1cm4gbW9udGhzW21vbnRoXSArIFwiJ1wiK3llYXI7XG4gICAgfTtcblxuICAgIHZhciBnZW5lcmF0ZUZ1bGxMYWJlbEZyb21QZXJpb2QgPSBmdW5jdGlvbihwZXJpb2QpIHtcbiAgICAgICAgcGVyaW9kID0gcGVyaW9kLnRvU3RyaW5nKCk7XG4gICAgICAgIHZhciB5ZWFyID0gcGVyaW9kLnN1YnN0cigwLDQpO1xuICAgICAgICB2YXIgbW9udGggPSBOdW1iZXIocGVyaW9kLnN1YnN0cig0LDIpKTtcblxuICAgICAgICB2YXIgbW9udGhzID0gWycnLCAnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsXG4gICAgICAgICAgICAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInXTtcbiAgICAgICAgcmV0dXJuIG1vbnRoc1ttb250aF0gKyBcIiBcIit5ZWFyO1xuICAgfTtcblxuICAgIHZhciBnZXRNb250aEZyb21OdW1iZXIgPSBmdW5jdGlvbih2YWx1ZSwgeWVhclR5cGUpIHtcbiAgICAgICAgdmFyIG1vbnRocyA9IFsnJywgJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwdCcsICdPY3QnLCAnTm92JywgJ0RlYyddO1xuICAgICAgICB2YXIgbW9udGhzRlkgPSBbJycsICdKdWwnLCAnQXVnJywgJ1NlcHQnLCAnT2N0JywgJ05vdicsICdEZWMnLCAnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nXTtcblxuICAgICAgICBpZiAoeWVhclR5cGUgPT0gJ0NZJykge1xuICAgICAgICAgICAgcmV0dXJuIG1vbnRoc1t2YWx1ZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbW9udGhzRllbdmFsdWVdO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBnZXRQZXJpb2RTdHJpbmcgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICAgICAgICBpZiAobW9udGggPCAxMCkge1xuICAgICAgICAgICAgcmV0dXJuIHllYXIgKyBcIjBcIiArIG1vbnRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHllYXIgKyBcIlwiICsgIG1vbnRoO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBnZXRNb250aEluZGV4RnJvbVBlcmlvZCA9IGZ1bmN0aW9uKHBlcmlvZCwgeWVhclR5cGUpIHtcbiAgICAgICAgcGVyaW9kID0gcGVyaW9kLnRvU3RyaW5nKCk7XG4gICAgICAgIHZhciBtb250aCA9IE51bWJlcihwZXJpb2Quc3Vic3RyKDQsMikpO1xuXG4gICAgICAgIGlmICh5ZWFyVHlwZSA9PSAnQ1knKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9udGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobW9udGggPj0gNykge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyhtb250aCAtIDcpICsgMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChtb250aCArIDYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBnZXRNb250aEZyb21QZXJpb2QgPSBmdW5jdGlvbihwZXJpb2QsIHllYXJUeXBlKSB7XG4gICAgICAgIHBlcmlvZCA9IHBlcmlvZC50b1N0cmluZygpO1xuICAgICAgICByZXR1cm4gTnVtYmVyKHBlcmlvZC5zdWJzdHIoNCwyKSk7XG4gICAgfTtcblxuICAgIHZhciBnZXRZZWFyRnJvbVBlcmlvZCA9IGZ1bmN0aW9uKHBlcmlvZCwgeWVhclR5cGUpIHtcbiAgICAgICAgcGVyaW9kID0gcGVyaW9kLnRvU3RyaW5nKCk7XG4gICAgICAgIHJldHVybiBOdW1iZXIocGVyaW9kLnN1YnN0cigwLDQpKTtcbiAgICB9O1xuXG4gICAgdmFyIGdldFllYXJMYWJlbEZyb21QZXJpb2QgPSBmdW5jdGlvbihwZXJpb2QsIHllYXJUeXBlKSB7XG4gICAgICAgIHBlcmlvZCA9IHBlcmlvZC50b1N0cmluZygpO1xuICAgICAgICB2YXIgeWVhciA9IHBlcmlvZC5zdWJzdHIoMCw0KTtcbiAgICAgICAgdmFyIG1vbnRoID0gTnVtYmVyKHBlcmlvZC5zdWJzdHIoNCwyKSk7XG5cbiAgICAgICAgaWYgKHllYXJUeXBlID09ICdDWScpIHtcbiAgICAgICAgICAgIHJldHVybiB5ZWFyO1xuICAgICAgICB9IGVsc2UgaWYgKHllYXJUeXBlID09ICdGWScpIHtcbiAgICAgICAgICAgIGlmIChtb250aCA8PSA2KSB7XG4gICAgICAgICAgICAgICAgdmFyIHByZXZZZWFyID0gTnVtYmVyKHllYXIpIC0gMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJldlllYXIgKyBcIi1cIiArIHllYXI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBuZXh0WWVhciA9IE51bWJlcih5ZWFyKSArIDE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHllYXIgKyBcIi1cIiArIG5leHRZZWFyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgIC8vIHB1Ymxpc2ggZXh0ZXJuYWwgQVBJIGJ5IGV4dGVuZGluZyBhcHBIZWxwZXJzXG4gICAgIGZ1bmN0aW9uIHB1Ymxpc2hFeHRlcm5hbEFQSShhcHBIZWxwZXJzKSB7XG4gICAgICAgICBhbmd1bGFyLmV4dGVuZChhcHBIZWxwZXJzLCB7XG4gICAgICAgICAgICAgJ3Blcic6IHBlcixcbiAgICAgICAgICAgICAnZ2VuZXJhdGVMYWJlbEZyb21QZXJpb2QnOiBnZW5lcmF0ZUxhYmVsRnJvbVBlcmlvZCxcbiAgICAgICAgICAgICAnZ2VuZXJhdGVGdWxsTGFiZWxGcm9tUGVyaW9kJzogZ2VuZXJhdGVGdWxsTGFiZWxGcm9tUGVyaW9kLFxuICAgICAgICAgICAgICdnZXRQZXJpb2RTdHJpbmcnOiBnZXRQZXJpb2RTdHJpbmcsXG4gICAgICAgICAgICAgJ2dldFllYXJMYWJlbEZyb21QZXJpb2QnOiBnZXRZZWFyTGFiZWxGcm9tUGVyaW9kLFxuICAgICAgICAgICAgICdnZXRNb250aEZyb21QZXJpb2QnOiBnZXRNb250aEZyb21QZXJpb2QsXG4gICAgICAgICAgICAgJ2dldFllYXJGcm9tUGVyaW9kJzogZ2V0WWVhckZyb21QZXJpb2QsXG4gICAgICAgICAgICAgJ2dldE1vbnRoSW5kZXhGcm9tUGVyaW9kJzogZ2V0TW9udGhJbmRleEZyb21QZXJpb2QsXG4gICAgICAgICAgICAgJ2dldE1vbnRoRnJvbU51bWJlcic6IGdldE1vbnRoRnJvbU51bWJlclxuICAgICAgICAgfSk7XG4gICAgIH1cblxuICAgICBwdWJsaXNoRXh0ZXJuYWxBUEkoYXBwSGVscGVycyk7XG5cbiB9KSh3aW5kb3csIGRvY3VtZW50KTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0Jztcbi8qKlxuICogQ3JlYXRlZCBieSBid2FtYWxhIG9uIDYvMi8yMDE3LlxuICovXG5hbmd1bGFyLm1vZHVsZSgnc2VydmljZXMnKS5zZXJ2aWNlKCdBbm51YWxTZXJ2aWNlJywgWyckaHR0cCcsXG4gICAgZnVuY3Rpb24oJGh0dHApIHtcbiAgICAgICAgdmFyIGhhbmRsZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRBd3BBY3Rpdml0aWVzID0gZnVuY3Rpb24oeWVhcil7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdwbGFubmluZy9hcGkvYXdwYWN0aXZpdGllcycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgeWVhcjogeWVhclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRGdW5kQWN0aXZpdGllcyA9IGZ1bmN0aW9uKHllYXIpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgncGxhbm5pbmcvYXBpL2Z1bmRhY3Rpdml0aWVzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICB5ZWFyOiB5ZWFyLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRQcmlvcml0eUFjdGl2aXRpZXMgPSBmdW5jdGlvbih5ZWFyKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ3BsYW5uaW5nL2FwaS9wcmlvcml0eWFjdGl2aXRpZXMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHllYXI6IHllYXIsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgJ2dldEF3cEFjdGl2aXRpZXMnOmdldEF3cEFjdGl2aXRpZXMsXG4gICAgICAgICAgICAnZ2V0RnVuZEFjdGl2aXRpZXMnOiBnZXRGdW5kQWN0aXZpdGllcyxcbiAgICAgICAgICAgICdnZXRQcmlvcml0eUFjdGl2aXRpZXMnOmdldFByaW9yaXR5QWN0aXZpdGllc1xuICAgICAgICB9O1xuICAgIH1cblxuXSlcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdzZXJ2aWNlcycpXG4gICAgLnNlcnZpY2UoJ0NoYXJ0UERGRXhwb3J0JywgQ2hhcnRQREZFeHBvcnQpO1xuXG5DaGFydFBERkV4cG9ydC4kaW5qZWN0ID0gWyckdGltZW91dCddO1xuZnVuY3Rpb24gQ2hhcnRQREZFeHBvcnQoJHRpbWVvdXQpIHtcbiAgICB2YXIgc2VydmljZSA9IHtcbiAgICAgICAgJ2V4cG9ydCc6IGV4cG9ydFBERixcbiAgICAgICAgJ2V4cG9ydFdpdGhTdHlsZXInOiBleHBvcnRXaXRoU3R5bGVyXG4gICAgfTtcbiAgICByZXR1cm4gc2VydmljZTtcblxuICAgIGZ1bmN0aW9uIGV4cG9ydFBERihmaWxlbmFtZSkge1xuICAgICAgICBkMy5zZWxlY3RBbGwoXCJzdmcgLm52LWxpbmVcIilcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCIjZmZmZmZmXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMCk7XG5cbiAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52ZDMgLm52LWJhY2tncm91bmRcIilcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCIjZmZmZmZmXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMCk7XG5cbiAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52ZDMgLm52LWF4aXMgbGluZVwiKVxuICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIFwiI2U1ZTVlNVwiKTtcblxuICAgICAgICBkMy5zZWxlY3RBbGwoXCIubnZkMyB0ZXh0XCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJmb250XCIsIFwibm9ybWFsIDEzcHggQXJpYWwsIHNhbnMtc2VyaWZcIik7XG5cbiAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52ZDMgLm52LWdyb3VwcyAubnYtcG9pbnRcIilcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAwKVxuICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlLXdpZHRoXCIsIFwiMHB4XCIpO1xuXG4gICAgICAgIGQzLnNlbGVjdEFsbChcIi5udmQzIC5udi15IC56ZXJvIGxpbmVcIilcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBcIiM0MDQwNDBcIik7XG5cbiAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52LXkgLm52LWF4aXMgZyBwYXRoLmRvbWFpblwiKVxuICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIFwiIzQwNDA0MFwiKTtcblxuICAgICAgICBkMy5zZWxlY3RBbGwoXCIubGVnZW5kUXVhbnQgLmxhYmVsXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJmb250XCIsIFwibm9ybWFsIDEycHggQXJpYWwsIHNhbnMtc2VyaWZcIik7XG5cbiAgICAgICAgLy8gdmFyIHBkZiA9IG5ldyBqc1BERignbCcsICdtbScpO1xuICAgICAgICB2YXIgcGRmPW5ldyBqc1BERihcImxcIiwgXCJtbVwiLCBcImE0XCIpO1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHsgZm9ybWF0IDogJ1BORycgfTtcblxuICAgICAgICBwZGYuYWRkSFRNTChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBkZlJlcG9ydFwiKSwgMCwgMCwgb3B0aW9ucywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcGRmLnNhdmUoZmlsZW5hbWUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHBvcnRXaXRoU3R5bGVyKHZtLCBmaWxlbmFtZSkge1xuICAgICAgICB2bS5wcmludFZpZXcgPSB0cnVlO1xuICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtleHBvcnRQREYoZmlsZW5hbWUpOyB9LCAxMDApO1xuICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHt2bS5wcmludFZpZXcgPSBmYWxzZTt9LCAxMDAwKTtcbiAgICB9XG59XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnc2VydmljZXMnKVxuICAgIC5zZXJ2aWNlKCdDaGFydFN1cHBvcnRTZXJ2aWNlJywgQ2hhcnRTdXBwb3J0U2VydmljZSk7XG5cbmZ1bmN0aW9uIENoYXJ0U3VwcG9ydFNlcnZpY2UoKSB7XG4gICAgdmFyIHNlcnZpY2UgPSB7XG4gICAgICAgICdnZXRPcHRpb25zJzogZ2V0T3B0aW9ucyxcbiAgICAgICAgJ2luaXRMYWJlbHMnOiBpbml0TGFiZWxzLFxuICAgICAgICAnY2xlYXJMYWJlbHMnOiBjbGVhckxhYmVsc1xuICAgIH07XG5cbiAgICByZXR1cm4gc2VydmljZTtcblxuICAgIGZ1bmN0aW9uIGdldE9wdGlvbnMoY2hhcnRUeXBlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgIHR5cGU6IGNoYXJ0VHlwZSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDQ1MCxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjUwLFxuICAgICAgICAgICAgICAgIC8vIG1hcmdpbjoge3RvcDogMTAwfSxcbiAgICAgICAgICAgICAgICBzdGFja2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzaG93Q29udHJvbHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGdyb3VwU3BhY2luZzogMC4yLFxuICAgICAgICAgICAgICAgIGNsaXBFZGdlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAvLyB1c2VJbnRlcmFjdGl2ZUd1aWRlbGluZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpbnRlcmFjdGl2ZUxheWVyOiB7Z3Jhdml0eTogJ3MnfSxcbiAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbihkKXsgcmV0dXJuIGQueDsgfSxcbiAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbihkKXsgcmV0dXJuIGQueTsgfSxcbiAgICAgICAgICAgICAgICBmb3JjZVk6IFswLDExMF0sXG4gICAgICAgICAgICAgICAgeEF4aXM6IHtcbiAgICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiAnWWVhcnMnLFxuICAgICAgICAgICAgICAgICAgICB0aWNrRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB5QXhpczoge1xuICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWw6ICdDb3ZlcmFnZSBSYXRlICglKScsXG4gICAgICAgICAgICAgICAgICAgIHRpY2tzOiAxMFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2g6IHtcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyRW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluaXRMYWJlbHMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGNoYXJ0KXtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIiEhISBsaW5lQ2hhcnQgY2FsbGJhY2sgISEhXCIpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZUNoYW5nZTogZnVuY3Rpb24oKSB7fVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXRMYWJlbHMoaHVtYW5pemU9ZmFsc2UpIHtcbiAgICAgICAgLy8gWW91IG5lZWQgdG8gYXBwbHkgdGhpcyBvbmNlIGFsbCB0aGUgYW5pbWF0aW9ucyBhcmUgYWxyZWFkeSBmaW5pc2hlZC4gT3RoZXJ3aXNlIGxhYmVscyB3aWxsIGJlIHBsYWNlZCB3cm9uZ2x5LlxuICAgICAgICBkMy5zZWxlY3RBbGwoJy5udi1tdWx0aWJhciAubnYtZ3JvdXAnKS5lYWNoKGZ1bmN0aW9uKGdyb3VwKXtcbiAgICAgICAgICB2YXIgZyA9IGQzLnNlbGVjdCh0aGlzKTtcblxuICAgICAgICAgIC8vIFJlbW92ZSBwcmV2aW91cyBsYWJlbHMgaWYgdGhlcmUgaXMgYW55XG4gICAgICAgICAgZy5zZWxlY3RBbGwoJ3RleHQnKS5yZW1vdmUoKTtcbiAgICAgICAgICBnLnNlbGVjdEFsbCgnLm52LWJhcicpLmVhY2goZnVuY3Rpb24oYmFyKXtcbiAgICAgICAgICAgIHZhciBiID0gZDMuc2VsZWN0KHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhcldpZHRoID0gYi5hdHRyKCd3aWR0aCcpO1xuICAgICAgICAgICAgdmFyIGJhckhlaWdodCA9IGIuYXR0cignaGVpZ2h0Jyk7XG5cbiAgICAgICAgICAgIGcuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAgICAgLy8gVHJhbnNmb3JtcyBzaGlmdCB0aGUgb3JpZ2luIHBvaW50IHRoZW4gdGhlIHggYW5kIHkgb2YgdGhlIGJhclxuICAgICAgICAgICAgICAvLyBpcyBhbHRlcmVkIGJ5IHRoaXMgdHJhbnNmb3JtLiBJbiBvcmRlciB0byBhbGlnbiB0aGUgbGFiZWxzXG4gICAgICAgICAgICAgIC8vIHdlIG5lZWQgdG8gYXBwbHkgdGhpcyB0cmFuc2Zvcm0gdG8gdGhvc2UuXG4gICAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBiLmF0dHIoJ3RyYW5zZm9ybScpKVxuICAgICAgICAgICAgICAudGV4dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8vIFR3byBkZWNpbWFscyBmb3JtYXRcbiAgICAgICAgICAgICAgICBpZiAoaHVtYW5pemUpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBIdW1hbml6ZS5jb21wYWN0SW50ZWdlcihwYXJzZUZsb2F0KGJhci55KS50b0ZpeGVkKDApLCAxKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChiYXIueSkudG9GaXhlZCgwKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3knLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8vIENlbnRlciBsYWJlbCB2ZXJ0aWNhbGx5XG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IHRoaXMuZ2V0QkJveCgpLmhlaWdodDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChiLmF0dHIoJ3knKSkgLSAxMDsgLy8gMTAgaXMgdGhlIGxhYmVsJ3MgbWFnaW4gZnJvbSB0aGUgYmFyXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvLyBDZW50ZXIgbGFiZWwgaG9yaXpvbnRhbGx5XG4gICAgICAgICAgICAgICAgdmFyIHdpZHRoID0gdGhpcy5nZXRCQm94KCkud2lkdGg7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoYi5hdHRyKCd4JykpICsgKHBhcnNlRmxvYXQoYmFyV2lkdGgpIC8gMikgLSAod2lkdGggLyAyKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2Jhci12YWx1ZXMnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJMYWJlbHMoKSB7XG4gICAgICAgIGQzLnNlbGVjdEFsbCgnLm52LW11bHRpYmFyIC5udi1ncm91cCcpLmVhY2goZnVuY3Rpb24oZ3JvdXApe1xuICAgICAgICAgIHZhciBnID0gZDMuc2VsZWN0KHRoaXMpO1xuICAgICAgICAgIC8vIFJlbW92ZSBwcmV2aW91cyBsYWJlbHMgaWYgdGhlcmUgaXMgYW55XG4gICAgICAgICAgZy5zZWxlY3RBbGwoJ3RleHQnKS5yZW1vdmUoKTtcbiAgICAgIH0pO1xuICAgIH1cbn1cbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdzZXJ2aWNlcycpXG4gICAgLnNlcnZpY2UoJ0NvdmVyYWdlQ2FsY3VsYXRvcicsIENvdmVyYWdlQ2FsY3VsYXRvcik7XG5cbmZ1bmN0aW9uIENvdmVyYWdlQ2FsY3VsYXRvcigpIHtcblxuICAgIHZhciBzZXJ2aWNlID0gIHtcbiAgICAgICAgJ2NhbGN1bGF0ZUNvdmVyYWdlUmF0ZSc6IGNhbGN1bGF0ZUNvdmVyYWdlUmF0ZSxcbiAgICAgICAgJ2NhbGN1bGF0ZURyb3BvdXRSYXRlJzogY2FsY3VsYXRlRHJvcG91dFJhdGUsXG4gICAgICAgICdjYWxjdWxhdGVSZWRDYXRlZ29yeSc6IGNhbGN1bGF0ZVJlZENhdGVnb3J5XG4gICAgfTtcblxuICAgIHJldHVybiBzZXJ2aWNlO1xuXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlQ292ZXJhZ2VSYXRlKGNvbnN1bXB0aW9uLCBwbGFubmVkKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKChjb25zdW1wdGlvbiAvIHBsYW5uZWQpICogMTAwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVEcm9wb3V0UmF0ZShmaXJzdERvc2UsIGxhc3REb3NlKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKCgoZmlyc3REb3NlIC0gbGFzdERvc2UpIC8gZmlyc3REb3NlKSAqIDEwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlUmVkQ2F0ZWdvcnkoZmlyc3REb3NlLCBsYXN0RG9zZSwgcGxhbm5lZCkge1xuICAgICAgICB2YXIgYWNjZXNzID0gY2FsY3VsYXRlQ292ZXJhZ2VSYXRlKGZpcnN0RG9zZSwgcGxhbm5lZCk7XG4gICAgICAgIHZhciBkcm9wb3V0UmF0ZSA9IGNhbGN1bGF0ZURyb3BvdXRSYXRlKGZpcnN0RG9zZSwgbGFzdERvc2UpO1xuXG4gICAgICAgIGlmIChhY2Nlc3MgPj0gOTAgJiYgZHJvcG91dFJhdGUgPj0gMCAmJiBkcm9wb3V0UmF0ZSA8PSAxMCkgcmV0dXJuIDE7XG4gICAgICAgIGVsc2UgaWYgKGFjY2VzcyA+PSA5MCAmJiAoZHJvcG91dFJhdGUgPCAwIHx8IGRyb3BvdXRSYXRlID4gMTApKSByZXR1cm4gMjtcbiAgICAgICAgZWxzZSBpZiAoYWNjZXNzIDwgOTAgJiYgZHJvcG91dFJhdGUgPj0gMCAmJiBkcm9wb3V0UmF0ZSA8PSAxMCkgcmV0dXJuIDM7XG4gICAgICAgIGVsc2UgaWYgKGFjY2VzcyA8IDkwICYmIChkcm9wb3V0UmF0ZSA8IDAgfHwgZHJvcG91dFJhdGUgPiAxMCkpIHJldHVybiA0O1xuICAgICAgICBlbHNlIHJldHVybiAwO1xuICAgIH1cbn1cbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdzZXJ2aWNlcycpLnNlcnZpY2UoJ0NvdmVyYWdlU2VydmljZScsIFsnJGh0dHAnLFxuICAgIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgICAgIHZhciBoYW5kbGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0REhJUzJWYWNjaW5lRG9zZXMgPSBmdW5jdGlvbihwZXJpb2QsIGRpc3RyaWN0LCB2YWNjaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb3ZlcmFnZS9hcGkvZGhpczJ2YWNjaW5lZG9zZXMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZDogcGVyaW9kLFxuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lOiB2YWNjaW5lLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3RcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0VmFjY2luZURvc2VzID0gZnVuY3Rpb24ocGVyaW9kLCB2YWNjaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb3ZlcmFnZS9hcGkvdmFjY2luZWRvc2VzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBwZXJpb2Q6IHBlcmlvZCxcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZTogdmFjY2luZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgZ2V0UmVkVmFjY2luZURvc2VzID0gZnVuY3Rpb24ocGVyaW9kLCB2YWNjaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb3ZlcmFnZS9hcGkvdmFjY2luZWRvc2VzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBwZXJpb2Q6IHBlcmlvZCxcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZTogdmFjY2luZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgdmFyIGdldFZhY2NpbmVEb3Nlc0J5RGlzdHJpY3QgPSBmdW5jdGlvbihwZXJpb2QsIGRpc3RyaWN0LCB2YWNjaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb3ZlcmFnZS9hcGkvdmFjY2luZWRvc2VzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBwZXJpb2Q6IHBlcmlvZCxcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZTogdmFjY2luZSxcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldFZhY2NpbmVEb3Nlc0J5UGVyaW9kID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb3ZlcmFnZS9hcGkvdmFjY2luZWRvc2VzX2J5X3BlcmlvZCcsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRZZWFyOiBwYXJhbXMuc3RhcnRZZWFyLFxuICAgICAgICAgICAgICAgICAgICBlbmRZZWFyOiBwYXJhbXMuZW5kWWVhcixcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZTogcGFyYW1zLmFudGlnZW4sXG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZDogcGFyYW1zLnBlcmlvZCxcbiAgICAgICAgICAgICAgICAgICAgZG9zZTogcGFyYW1zLmRvc2UsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBwYXJhbXMuZGlzdHJpY3QsXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBwYXJhbXMuZGF0YVR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZURpc3RyaWN0R3JvdXBpbmc6IHBhcmFtcy5lbmFibGVEaXN0cmljdEdyb3VwaW5nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldFVuZXBpQ292ZXJhZ2UgPSBmdW5jdGlvbihwZXJpb2QsIGRpc3RyaWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb3ZlcmFnZS9hcGkvY292ZXJhZ2Vhbm51YWxpemVkJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBwZXJpb2Q6IHBlcmlvZCxcblxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3RcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0RGlzdHJpY3RNYXAgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnc3RhdGljL1VnYW5kYV9hZG1pbi5qc29uJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwiZ2V0REhJUzJWYWNjaW5lRG9zZXNcIjogZ2V0REhJUzJWYWNjaW5lRG9zZXMsXG4gICAgICAgICAgICBcImdldFZhY2NpbmVEb3Nlc1wiOiBnZXRWYWNjaW5lRG9zZXMsXG4gICAgICAgICAgICBcImdldFZhY2NpbmVEb3Nlc0J5RGlzdHJpY3RcIjogZ2V0VmFjY2luZURvc2VzQnlEaXN0cmljdCxcbiAgICAgICAgICAgIFwiZ2V0VmFjY2luZURvc2VzQnlQZXJpb2RcIjogZ2V0VmFjY2luZURvc2VzQnlQZXJpb2QsXG4gICAgICAgICAgICBcImdldFVuZXBpQ292ZXJhZ2VcIjpnZXRVbmVwaUNvdmVyYWdlLFxuICAgICAgICAgICAgXCJnZXREaXN0cmljdE1hcFwiOiBnZXREaXN0cmljdE1hcCxcbiAgICAgICAgICAgIFwiZ2V0UmVkVmFjY2luZURvc2VzXCI6Z2V0UmVkVmFjY2luZURvc2VzXG4gICAgICAgIH07XG4gICAgfVxuXSlcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdzZXJ2aWNlcycpLnNlcnZpY2UoJ0ZpbHRlclNlcnZpY2UnLCBbJyRodHRwJyxcbiAgICBmdW5jdGlvbigkaHR0cCkge1xuICAgICAgICB2YXIgaGFuZGxlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldE1vbnRocyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9tb250aHMnKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0RGlzdHJpY3RzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2Rpc3RyaWN0cycpLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRWYWNjaW5lcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS92YWNjaW5lcy8nKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBnZXRGcmlkZ2VEaXN0cmljdHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvbGRjaGFpbi9hcGkvZGlzdHJpY3RzJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldEZyaWRnZUNhcmVMZXZlbHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvbGRjaGFpbi9hcGkvY2FyZWxldmVscycpLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRGcmlkZ2VRdWFydGVycyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY29sZGNoYWluL2FwaS9xdWFydGVycycpLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRMYXN0UGVyaW9kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2xhc3RwZXJpb2QnKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0UGVyaW9kUmFuZ2VzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb3ZlcmFnZS9hcGkvcGVyaW9kX3JhbmdlcycpLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGdldEF3cEFjdGl2aXRpZXM9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdwbGFubmluZy9hcGkvYXdwYWN0aXZpdGllcycpLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRGdW5kQWN0aXZpdGllcz0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ3BsYW5uaW5nL2FwaS9mdW5kYWN0aXZpdGllcycpLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgZ2V0VW5lcGlDb3ZlcmFnZT1mdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY292ZXJhZ2UvYXBpL2NvdmVyYWdlYW5udWFsaXplZCcpLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgZ2V0VW5lcGlTdG9jaz1mdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnYXBpL3N0b2NrL2F0aGFuZGJ5ZGlzdHJpY3QnKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0WWVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgncGxhbm5pbmcvYXBpL2FjdGl2aXR5eWVhcicpLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwiZ2V0TW9udGhzXCI6IGdldE1vbnRocyxcbiAgICAgICAgICAgIFwiZ2V0WWVhclwiOiBnZXRZZWFyLFxuICAgICAgICAgICAgXCJnZXRWYWNjaW5lc1wiOiBnZXRWYWNjaW5lcyxcbiAgICAgICAgICAgIFwiZ2V0RGlzdHJpY3RzXCI6IGdldERpc3RyaWN0cyxcbiAgICAgICAgICAgIFwiZ2V0RnJpZGdlRGlzdHJpY3RzXCI6IGdldEZyaWRnZURpc3RyaWN0cyxcbiAgICAgICAgICAgIFwiZ2V0RnJpZGdlQ2FyZUxldmVsc1wiOiBnZXRGcmlkZ2VDYXJlTGV2ZWxzLFxuICAgICAgICAgICAgXCJnZXRGcmlkZ2VRdWFydGVyc1wiOiBnZXRGcmlkZ2VRdWFydGVycyxcbiAgICAgICAgICAgIFwiZ2V0TGFzdFBlcmlvZFwiOiBnZXRMYXN0UGVyaW9kLFxuICAgICAgICAgICAgXCJnZXRQZXJpb2RSYW5nZXNcIjogZ2V0UGVyaW9kUmFuZ2VzLFxuICAgICAgICAgICAgXCJnZXRBd3BBY3Rpdml0aWVzXCI6IGdldEF3cEFjdGl2aXRpZXMsXG4gICAgICAgICAgICBcImdldEZ1bmRBY3Rpdml0aWVzXCI6IGdldEZ1bmRBY3Rpdml0aWVzLFxuICAgICAgICAgICAgXCJnZXRVbmVwaUNvdmVyYWdlXCI6Z2V0VW5lcGlDb3ZlcmFnZSxcbiAgICAgICAgICAgIFwiZ2V0VW5lcGlTdG9ja1wiOmdldFVuZXBpU3RvY2tcbiAgICAgICAgfTtcbiAgICB9XG5dKVxuXG5hbmd1bGFyLm1vZHVsZSgnc2VydmljZXMnKS5zZXJ2aWNlKCdNb250aFNlcnZpY2UnLCBbXG4gICAgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIGdldE1vbnRoTmFtZSA9IGZ1bmN0aW9uKG1vbnRoKSB7XG4gICAgICAgICAgICB2YXIgbW9udGhzID0ge307XG4gICAgICAgICAgICBtb250aHNbJzEnXSA9IFwiSmFuXCI7XG4gICAgICAgICAgICBtb250aHNbJzInXSA9IFwiRmViXCI7XG4gICAgICAgICAgICBtb250aHNbJzMnXSA9IFwiTWFyXCI7XG4gICAgICAgICAgICBtb250aHNbJzQnXSA9IFwiQXByXCI7XG4gICAgICAgICAgICBtb250aHNbJzUnXSA9IFwiTWF5XCI7XG4gICAgICAgICAgICBtb250aHNbJzYnXSA9IFwiSnVuXCI7XG4gICAgICAgICAgICBtb250aHNbJzcnXSA9IFwiSnVsXCI7XG4gICAgICAgICAgICBtb250aHNbJzgnXSA9IFwiQXVnXCI7XG4gICAgICAgICAgICBtb250aHNbJzknXSA9IFwiU2VwXCI7XG4gICAgICAgICAgICBtb250aHNbJzEwJ10gPSBcIk9jdFwiO1xuICAgICAgICAgICAgbW9udGhzWycxMSddID0gXCJOb3ZcIjtcbiAgICAgICAgICAgIG1vbnRoc1snMTInXSA9IFwiRGVjXCI7XG4gICAgICAgICAgICByZXR1cm4gbW9udGhzW21vbnRoXTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0TW9udGhOdW1iZXIgPSBmdW5jdGlvbihtb250aCkge1xuICAgICAgICAgICAgdmFyIG1vbnRocyA9IHt9O1xuICAgICAgICAgICAgbW9udGhzWydKYW4nXSA9IDE7XG4gICAgICAgICAgICBtb250aHNbJ0ZlYiddID0gMjtcbiAgICAgICAgICAgIG1vbnRoc1snTWFyJ10gPSAzO1xuICAgICAgICAgICAgbW9udGhzWydBcHInXSA9IDQ7XG4gICAgICAgICAgICBtb250aHNbJ01heSddID0gNTtcbiAgICAgICAgICAgIG1vbnRoc1snSnVuJ10gPSA2O1xuICAgICAgICAgICAgbW9udGhzWydKdWwnXSA9IDc7XG4gICAgICAgICAgICBtb250aHNbJ0F1ZyddID0gODtcbiAgICAgICAgICAgIG1vbnRoc1snU2VwJ10gPSA5O1xuICAgICAgICAgICAgbW9udGhzWydPY3QnXSA9IDEwO1xuICAgICAgICAgICAgbW9udGhzWydOb3YnXSA9IDExO1xuICAgICAgICAgICAgbW9udGhzWydEZWMnXSA9IDEyO1xuICAgICAgICAgICAgcmV0dXJuIG1vbnRoc1ttb250aF07XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIG1vbnRoVG9EYXRlID0gZnVuY3Rpb24obW9udGhZZWFyKSB7XG4gICAgICAgICAgICB2YXIgcGFydHMgPSBtb250aFllYXIuc3BsaXQoXCIgXCIpO1xuICAgICAgICAgICAgdmFyIG1vbnRoID0gZ2V0TW9udGhOdW1iZXIocGFydHNbMF0pO1xuICAgICAgICAgICAgdmFyIHllYXIgPSBwYXJzZUludChwYXJ0c1sxXSk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICAgICAgICB9O1xuXG4gICAgICAgIG1vbnRoRGlmZiA9IGZ1bmN0aW9uIChzdGFydERhdGUsIGVuZERhdGUpIHtcbiAgICAgICAgICAgIHZhciBtb250aHM7XG4gICAgICAgICAgICBtb250aHMgPSAoZW5kRGF0ZS5nZXRGdWxsWWVhcigpIC0gc3RhcnREYXRlLmdldEZ1bGxZZWFyKCkpICogMTI7XG4gICAgICAgICAgICBtb250aHMgLT0gc3RhcnREYXRlLmdldE1vbnRoKCkgKyAxO1xuICAgICAgICAgICAgbW9udGhzICs9IGVuZERhdGUuZ2V0TW9udGgoKTtcbiAgICAgICAgICAgIHJldHVybiBtb250aHMgPD0gMCA/IDAgOiBtb250aHM7XG4gICAgICAgIH07XG5cbiAgICAgICAgbW9udGhSYW5nZURpZmYgPSBmdW5jdGlvbiAoc3RhcnREYXRlLCBlbmREYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9udGhEaWZmKG1vbnRoVG9EYXRlKHN0YXJ0RGF0ZSksIG1vbnRoVG9EYXRlKGVuZERhdGUpKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJnZXRNb250aE5hbWVcIjogZ2V0TW9udGhOYW1lLFxuICAgICAgICAgICAgXCJnZXRNb250aE51bWJlclwiOiBnZXRNb250aE51bWJlcixcbiAgICAgICAgICAgIFwibW9udGhUb0RhdGVcIjogbW9udGhUb0RhdGUsXG4gICAgICAgICAgICBcIm1vbnRoRGlmZlwiOiBtb250aERpZmYsXG4gICAgICAgICAgICBcIm1vbnRoUmFuZ2VEaWZmXCI6IG1vbnRoUmFuZ2VEaWZmLFxuICAgICAgICB9O1xuICAgIH1cbl0pXG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3NlcnZpY2VzJykuc2VydmljZSgnRmluYW5jZVNlcnZpY2UnLCBbJyRodHRwJywgZnVuY3Rpb24oJGh0dHApIHtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJnZXRGaW5hbmNlRGF0YVwiOiBnZXRGaW5hbmNlRGF0YSxcbiAgICAgICAgICAgIFwiZ2V0RmluYW5jZVllYXJzXCI6IGdldEZpbmFuY2VZZWFyc1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVJlc3BvbnNlKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEZpbmFuY2VEYXRhKHBhcmFtcykge1xuICAgICAgICAgICAgdmFyIGNvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRZZWFyOiBwYXJhbXMgPT0gdW5kZWZpbmVkID8gMTk5MCA6IHBhcmFtcy5zdGFydFllYXIsXG4gICAgICAgICAgICAgICAgICAgIGVuZFllYXI6IHBhcmFtcyA9PSB1bmRlZmluZWQgPyAzMDAwIDogcGFyYW1zLmVuZFllYXJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2ZpbmFuY2UvbGlzdCcsIGNvbmZpZykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRGaW5hbmNlWWVhcnMoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvZmluYW5jZS95ZWFycycsIHt9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfVxuXG4gICAgfV0pXG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnc2VydmljZXMnKS5zZXJ2aWNlKCdGcmlkZ2VTZXJ2aWNlJywgWyckaHR0cCcsXG4gICAgZnVuY3Rpb24oJGh0dHApIHtcbiAgICAgICAgdmFyIGhhbmRsZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRGcmlkZ2VDYXBhY2l0eSA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY29sZGNoYWluL2FwaS9jYXBhY2l0aWVzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydFF1YXJ0ZXI6IHN0YXJ0UXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZW5kUXVhcnRlcjogZW5kUXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICBjYXJlbGV2ZWw6IGNhcmVsZXZlbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRGcmlkZ2VEaXN0cmljdENhcGFjaXR5ID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBkaXN0cmljdCwgY2FyZWxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb2xkY2hhaW4vYXBpL2Rpc3RyaWN0Y2FwYWNpdGllcycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRRdWFydGVyOiBzdGFydFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGVuZFF1YXJ0ZXI6IGVuZFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgY2FyZWxldmVsOiBjYXJlbGV2ZWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0RnJpZGdlRmFjaWxpdHlDYXBhY2l0eSA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY29sZGNoYWluL2FwaS9mYWNpbGl0eWNhcGFjaXRpZXMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0UXVhcnRlcjogc3RhcnRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBlbmRRdWFydGVyOiBlbmRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3QsXG4gICAgICAgICAgICAgICAgICAgIGNhcmVsZXZlbDogY2FyZWxldmVsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldEZyaWRnZUZ1bmN0aW9uYWxpdHkgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGRpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvbGRjaGFpbi9hcGkvcmVmcmlnZXJhdG9ycycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRRdWFydGVyOiBzdGFydFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGVuZFF1YXJ0ZXI6IGVuZFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgY2FyZWxldmVsOiBjYXJlbGV2ZWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGdldEZyaWRnZURpc3RyaWN0UmVmcmlnZXJhdG9yID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBkaXN0cmljdCwgY2FyZWxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb2xkY2hhaW4vYXBpL2Rpc3RyaWN0cmVmcmlnZXJhdG9ycycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRRdWFydGVyOiBzdGFydFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGVuZFF1YXJ0ZXI6IGVuZFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgY2FyZWxldmVsOiBjYXJlbGV2ZWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0RmFjaWxpdHlUeXBlcyA9IGZ1bmN0aW9uKGRpc3RyaWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb2xkY2hhaW4vYXBpL2ZhY2lsaXR5dHlwZXMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7ZGlzdHJpY3Q6IGRpc3RyaWN0fVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldEZyaWRnZUZhY2lsaXR5UmVmcmlnZXJhdG9yID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBkaXN0cmljdCwgY2FyZWxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb2xkY2hhaW4vYXBpL2ZhY2lsaXR5cmVmcmlnZXJhdG9ycycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRRdWFydGVyOiBzdGFydFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGVuZFF1YXJ0ZXI6IGVuZFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgY2FyZWxldmVsOiBjYXJlbGV2ZWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0RnJpZGdlSW1tdW5pemluZ0ZhY2lsaXR5ID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBkaXN0cmljdCwgY2FyZWxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb2xkY2hhaW4vYXBpL2ltbXVuaXppbmdmYWNpbGl0aWVzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydFF1YXJ0ZXI6IHN0YXJ0UXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZW5kUXVhcnRlcjogZW5kUXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICBjYXJlbGV2ZWw6IGNhcmVsZXZlbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgZ2V0RnJpZGdlRGlzdHJpY3RJbW11bml6aW5nRmFjaWxpdHkgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGRpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvbGRjaGFpbi9hcGkvZGlzdHJpY3RpbW11bml6aW5nZmFjaWxpdGllcycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRRdWFydGVyOiBzdGFydFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGVuZFF1YXJ0ZXI6IGVuZFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgY2FyZWxldmVsOiBjYXJlbGV2ZWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0RnJpZGdlQ2FwYWNpdHlNZXRyaWNzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgdmFyIHN1cnAgPSAwO1xuICAgICAgICAgICAgdmFyIHN1ZmZpY2llbnQgPSAwO1xuICAgICAgICAgICAgdmFyIHNob3J0YWdlID0gMDtcblxuICAgICAgICAgICAgZm9yKHZhciBpPTA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICB2YXIgc3VycGx1c1ZhbHVlID0gZGF0YVtpXS5zdXJwbHVzXG4gICAgICAgICAgICAgICAgaWYgKHN1cnBsdXNWYWx1ZSA+IDMwKSBzdXJwKys7XG4gICAgICAgICAgICAgICAgZWxzZSBpZihzdXJwbHVzVmFsdWUgPDMwICYmIHN1cnBsdXNWYWx1ZSA+PSAwKSBzdWZmaWNpZW50Kys7XG4gICAgICAgICAgICAgICAgZWxzZSBpZihzdXJwbHVzVmFsdWUgPCAwKSBzaG9ydGFnZSsrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICdzdXJwbHVzJzogc3VycCxcbiAgICAgICAgICAgICAgICAnc3VmZmljaWVudCc6IHN1ZmZpY2llbnQsXG4gICAgICAgICAgICAgICAgJ3Nob3J0YWdlJzogc2hvcnRhZ2UsXG4gICAgICAgICAgICAgICAgJ3RvdGFsJzogc3VycCArIHN1ZmZpY2llbnQgKyBzaG9ydGFnZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJnZXRGcmlkZ2VDYXBhY2l0eVwiOiBnZXRGcmlkZ2VDYXBhY2l0eSxcbiAgICAgICAgICAgIFwiZ2V0RmFjaWxpdHlUeXBlc1wiOiBnZXRGYWNpbGl0eVR5cGVzLFxuICAgICAgICAgICAgXCJnZXRGcmlkZ2VEaXN0cmljdENhcGFjaXR5XCI6IGdldEZyaWRnZURpc3RyaWN0Q2FwYWNpdHksXG4gICAgICAgICAgICBcImdldEZyaWRnZUZhY2lsaXR5Q2FwYWNpdHlcIjogZ2V0RnJpZGdlRmFjaWxpdHlDYXBhY2l0eSxcbiAgICAgICAgICAgIFwiZ2V0RnJpZGdlRnVuY3Rpb25hbGl0eVwiOiBnZXRGcmlkZ2VGdW5jdGlvbmFsaXR5LFxuICAgICAgICAgICAgXCJnZXRGcmlkZ2VJbW11bml6aW5nRmFjaWxpdHlcIjogZ2V0RnJpZGdlSW1tdW5pemluZ0ZhY2lsaXR5LFxuICAgICAgICAgICAgXCJnZXRGcmlkZ2VEaXN0cmljdFJlZnJpZ2VyYXRvclwiOmdldEZyaWRnZURpc3RyaWN0UmVmcmlnZXJhdG9yLFxuICAgICAgICAgICAgXCJnZXRGcmlkZ2VGYWNpbGl0eVJlZnJpZ2VyYXRvclwiOmdldEZyaWRnZUZhY2lsaXR5UmVmcmlnZXJhdG9yLFxuICAgICAgICAgICAgXCJnZXRGcmlkZ2VEaXN0cmljdEltbXVuaXppbmdGYWNpbGl0eVwiOmdldEZyaWRnZURpc3RyaWN0SW1tdW5pemluZ0ZhY2lsaXR5LFxuICAgICAgICAgICAgXCJnZXRGcmlkZ2VDYXBhY2l0eU1ldHJpY3NcIjogZ2V0RnJpZGdlQ2FwYWNpdHlNZXRyaWNzXG4gICAgICAgIH07XG4gICAgfVxuXSlcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKVxuICAgIC5jb250cm9sbGVyKCdNYWluQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0ZpbHRlclNlcnZpY2UnLCAnTW9udGhTZXJ2aWNlJywgJyRyb290U2NvcGUnLCAnJGxvY2F0aW9uJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsIEZpbHRlclNlcnZpY2UsIE1vbnRoU2VydmljZSwgJHJvb3RTY29wZSwgJGxvY2F0aW9uKVxuICAgIHtcbiAgICAgICAgJHNjb3BlLnNvcnRUeXBlICAgICA9ICduYW1lJzsgLy8gc2V0IHRoZSBkZWZhdWx0IHNvcnQgdHlwZVxuICAgICAgICAkc2NvcGUuc29ydFJldmVyc2UgID0gZmFsc2U7ICAvLyBzZXQgdGhlIGRlZmF1bHQgc29ydCBvcmRlclxuICAgICAgICAkc2NvcGUuc2VhcmNoVGV4dCAgID0gJyc7ICAgICAvLyBzZXQgdGhlIGRlZmF1bHQgc2VhcmNoL2ZpbHRlciB0ZXJtXG5cbiAgICAgICAgJHNjb3BlLnJvb3QgPSB7fTtcbiAgICAgICAgdmFyIHNoZWxsID0gdGhpcztcblxuICAgICAgICAkc2NvcGUuJG9uKCdzZXREZWZhdWx0WWVhcnMnLCBmdW5jdGlvbihlLCBzdGFydFllYXIsIGVuZFllYXIpIHtcbiAgICAgICAgICAgIHNoZWxsLmZpbmFuY2VTdGFydFllYXIgPSBzdGFydFllYXI7XG4gICAgICAgICAgICBzaGVsbC5maW5hbmNlRW5kWWVhciA9IGVuZFllYXI7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vPT09IFN0b2NrIE1hbmFnZW1lbnQgPT09PT09PVxuICAgICAgICBzaGVsbC5zdGFydE1vbnRoID0gc2hlbGwuc3RhcnRNb250aCA/IHNoZWxsLnN0YXJ0TW9udGgubmFtZSA6IFwiTm92IDIwMTVcIjtcbiAgICAgICAgc2hlbGwuZW5kTW9udGggPSBzaGVsbC5lbmRNb250aCA/IHNoZWxsLmVuZE1vbnRoLm5hbWUgOiBcIkRlYyAyMDE1XCI7XG4gICAgICAgIHNoZWxsLnNlbGVjdGVkVmFjY2luZSA9IFwiXCI7XG4gICAgICAgIHNoZWxsLnNlbGVjdGVkRGlzdHJpY3QgPSBcIlwiO1xuICAgICAgICBzaGVsbC5kZWZhdWx0UGVyaW9kID0gXCJcIjtcblxuICAgICAgICBGaWx0ZXJTZXJ2aWNlLmdldE1vbnRocygpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgc2hlbGwubW9udGhzID0gZGF0YTtcbiAgICAgICAgICAgIHNoZWxsLnN0YXJ0TW9udGggPSBzaGVsbC5tb250aHNbMF07XG4gICAgICAgICAgICAvL3NoZWxsLmVuZE1vbnRoID0gc2hlbGwubW9udGhzW2RlZmF1bHRNb250aF07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEFkZCBBbnRpZ2VuIGZpbHRlcnMgdmFsdWVzXG4gICAgICAgIHZhciBhbnRpZ2VucyA9IHtcbiAgICAgICAgICAgIFwiQUxMXCI6IFsnRG9zZSAxJywgJ0Rvc2UgMicsICdEb3NlIDMnXSxcbiAgICAgICAgICAgIFwiSFBWXCI6IFsnRG9zZSAxJywgJ0Rvc2UgMiddLFxuICAgICAgICAgICAgXCJEUFRcIjogWydEb3NlIDEnLCAnRG9zZSAyJywgJ0Rvc2UgMyddLFxuICAgICAgICAgICAgXCJQQ1ZcIjogWydEb3NlIDEnLCAnRG9zZSAyJywgJ0Rvc2UgMyddLFxuICAgICAgICAgICAgXCJJUFZcIjogWydEb3NlIDEnXSxcbiAgICAgICAgICAgIFwiT1BWXCI6IFsnRG9zZSAxJywgJ0Rvc2UgMicsICdEb3NlIDMnXSxcbiAgICAgICAgICAgIFwiQkNHXCI6IFsnRG9zZSAxJ10sXG4gICAgICAgICAgICBcIk1FQVNMRVNcIjogWydEb3NlIDEnXSxcbiAgICAgICAgICAgIFwiVFRcIjogWydEb3NlIDEnLCAnRG9zZSAyJ11cbiAgICAgICAgfVxuXG4gICAgICAgIHNoZWxsLnVwZGF0ZURvc2VzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzaGVsbC5kb3NlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgc2hlbGwuZG9zZXMgPSBhbnRpZ2Vuc1tzaGVsbC5hbnRpZ2VuXVxuICAgICAgICAgICAgLy9zaGVsbC5kb3NlcyA9IFsnRG9zZSAxJywgJ0Rvc2UgMicsICdEb3NlIDMnXTsvL2FudGlnZW5zW3NoZWxsLmFudGlnZW5dXG5cbiAgICAgICAgICAgIGlmIChzaGVsbC5kb3Nlcy5sZW5ndGggIT0gMCkge1xuICAgICAgICAgICAgICAgIHNoZWxsLmRvc2UgPSBzaGVsbC5kb3Nlc1tzaGVsbC5kb3Nlcy5sZW5ndGgtMV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgc2hlbGwuYW50aWdlbnMgPSBPYmplY3Qua2V5cyhhbnRpZ2Vucyk7XG5cbiAgICAgICAgaWYgKCRsb2NhdGlvbi5wYXRoKCkgPT0gJy9jb3ZlcmFnZS9yZWRjYXRlZ29yeScpIHtcbiAgICAgICAgICAgIHNoZWxsLmFudGlnZW4gPSBcIkRQVFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2hlbGwuYW50aWdlbiA9IFwiQUxMXCI7XG4gICAgICAgIH1cbiAgICAgICAgc2hlbGwudXBkYXRlRG9zZXMoKTtcblxuICAgICAgICBGaWx0ZXJTZXJ2aWNlLmdldFBlcmlvZFJhbmdlcygpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgc2hlbGwuY292ZXJhZ2VZZWFycyA9IGRhdGEueWVhcnNcbiAgICAgICAgICAgIHNoZWxsLnN0YXJ0WWVhciA9IGRhdGEueWVhcnNbZGF0YS55ZWFycy5sZW5ndGgtMV1cbiAgICAgICAgICAgIHNoZWxsLmVuZFllYXIgPSBkYXRhLnllYXJzW2RhdGEueWVhcnMubGVuZ3RoLTFdXG4gICAgICAgICAgICBzaGVsbC5hY3RpdmVDb3ZlcmFnZVllYXIgPSBkYXRhLnllYXJzW2RhdGEueWVhcnMubGVuZ3RoLTFdXG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBGaWx0ZXJTZXJ2aWNlLmdldExhc3RQZXJpb2QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHNoZWxsLmRlZmF1bHRQZXJpb2QgPSBkYXRhO1xuICAgICAgICAgICAgc2hlbGwuZGVmYXVsdE1vbnRoID0gcGFyc2VJbnQoZGF0YS5wZXJpb2QudG9TdHJpbmcoKS5zdWJzdHJpbmcoNCwgNikpO1xuICAgICAgICAgICAgJHNjb3BlLmRlZmF1bHRNb250aCA9IHNoZWxsLmRlZmF1bHRNb250aDtcbiAgICAgICAgICAgICRzY29wZS5kZWZhdWx0UGVyaW9kID0gZGF0YS5wZXJpb2QudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgdmFyIHBlcmlvZCA9IGRhdGEucGVyaW9kLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB2YXIgbW9udGhfbnVtYmVyID0gcGFyc2VJbnQocGVyaW9kLnN1YnN0cmluZyg0LDYpKTtcbiAgICAgICAgICAgIHZhciBtb250aF9sYWJlbCA9IE1vbnRoU2VydmljZS5nZXRNb250aE5hbWUobW9udGhfbnVtYmVyKTtcbiAgICAgICAgICAgIC8vc2hlbGwuZW5kTW9udGggPSB7eWVhcjpwZXJpb2Quc3Vic3RyaW5nKDAsNCksIHBlcmlvZDpwZXJpb2QsIG5hbWU6bW9udGhfbGFiZWwsIG1vbnRoOm1vbnRoX251bWJlciwgXCIkJGhhc2hLZXlcIjpcIm9iamVjdDoxODZcIn1cbiAgICAgICAgICAgIC8vc2hlbGwuZW5kTW9udGggPSBzaGVsbC5tb250aHNbc2hlbGwuZGVmYXVsdE1vbnRoLTFdO1xuXG4gICAgICAgICAgICB2YXIgZW5kTW9udGhJbmRleCA9IDA7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gc2hlbGwubW9udGhzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNoZWxsLm1vbnRoc1tpXS5wZXJpb2QgPT0gcGVyaW9kKSB7XG4gICAgICAgICAgICAgICAgICAgIHNoZWxsLmVuZE1vbnRoID0gc2hlbGwubW9udGhzW2ldO1xuICAgICAgICAgICAgICAgICAgICBlbmRNb250aEluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL3NldCB0aGUgc3RhcnQgcGVyaW9kIHRvIDYgbW9udGhzIGJhY2sgYnkgZGVmYXVsdFxuICAgICAgICAgICAgdmFyIHN0YXJ0TW9udGhJbmRleCA9IChlbmRNb250aEluZGV4IC0gNikgKyAxO1xuICAgICAgICAgICAgaWYgKHN0YXJ0TW9udGhJbmRleCA8IDApIHtcbiAgICAgICAgICAgICAgICBzdGFydE1vbnRoSW5kZXggPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2hlbGwubW9udGhzICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHNoZWxsLnN0YXJ0TW9udGggPSBzaGVsbC5tb250aHNbc3RhcnRNb250aEluZGV4XTtcbiAgICAgICAgICAgIH1cblxuXG5cblxuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiZGVyZVwiK0pTT04uc3RyaW5naWZ5KHNoZWxsLm1vbnRoc1sxM10pKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICBzaGVsbC5zdG9ja2F0aGFuZCA9IDA7XG5cblxuXG4gICAgICAgIEZpbHRlclNlcnZpY2UuZ2V0RGlzdHJpY3RzKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB2YXIgZGlzdHJpY3RTcGVjaWZpY1BhdGhzID0gW1xuICAgICAgICAgICAgICAgICcvc3RvY2svZGlzdHJpYnV0aW9uJyxcbiAgICAgICAgICAgICAgICAvLyAnL3N0b2NrL3VwdGFrZXJhdGUnLFxuICAgICAgICAgICAgICAgIC8vICcvdW5lcGkvZG93bmxvYWQnXG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgaWYgKGRpc3RyaWN0U3BlY2lmaWNQYXRocy5pbmRleE9mKCRsb2NhdGlvbi5wYXRoKCkpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgZGF0YS51bnNoaWZ0KHsnbmFtZSc6ICdOYXRpb25hbCd9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2hlbGwuZGlzdHJpY3RzID0gZGF0YTtcbiAgICAgICAgICAgIHNoZWxsLnNlbGVjdGVkRGlzdHJpY3QgPSBzaGVsbC5kaXN0cmljdHNbMF07XG4gICAgICAgICAgICBzaGVsbC5kaXN0cmljdCA9IHNoZWxsLmRpc3RyaWN0c1swXS5uYW1lO1xuICAgICAgICB9KTtcblxuICAgICAgICBGaWx0ZXJTZXJ2aWNlLmdldFZhY2NpbmVzKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBzaGVsbC52YWNjaW5lcyA9IGRhdGE7XG4gICAgICAgICAgICBzaGVsbC5zZWxlY3RlZFZhY2NpbmUgPSBzaGVsbC52YWNjaW5lc1s1XTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy89PT09IEVuZCBTdG9jayBNYW5hZ2VtZW50ID09PT09XG5cblxuICAgICAgICAvLz09PT09PT09UGxhbm5pbmc9PT09PT09PT1cbiAgICAgICAgc2hlbGwuc2VsZWN0ZWRZZWFyID0gXCJcIjtcbiAgICAgICAgRmlsdGVyU2VydmljZS5nZXRZZWFyKCkudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIHNoZWxsLnllYXJzID0gZGF0YTtcbiAgICAgICAgICAgIHNoZWxsLnNlbGVjdGVkWWVhciA9IHNoZWxsLnllYXJzWzBdO1xuICAgICAgICB9KTtcblxuXG4gICAgICAgIC8vPT09IENvbGQgY2hhaW4gPT09PT09XG4gICAgICAgIHNoZWxsLnN0YXJ0UXVhcnRlciA9IHNoZWxsLnN0YXJ0UXVhcnRlciA/IHNoZWxsLnN0YXJ0UXVhcnRlci5uYW1lIDogXCIyMDE2MDFcIjtcbiAgICAgICAgc2hlbGwuZW5kUXVhcnRlciA9IHNoZWxsLmVuZFF1YXJ0ZXIgPyBzaGVsbC5lbmRRdWFydGVyLm5hbWUgOiBcIjIwMTYwM1wiO1xuICAgICAgICBzaGVsbC5zZWxlY3RlZEZyaWRnZURpc3RyaWN0ID0gXCJcIjtcbiAgICAgICAgc2hlbGwuc2VsZWN0ZWRGcmlkZ2VDYXJlTGV2ZWwgPSBcIlwiO1xuXG5cbiAgICAgICAgRmlsdGVyU2VydmljZS5nZXRGcmlkZ2VEaXN0cmljdHMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHNoZWxsLmZyaWRnZURpc3RyaWN0cyA9IGRhdGE7XG4gICAgICAgICAgICBzaGVsbC5zZWxlY3RlZEZyaWRnZURpc3RyaWN0ID0gc2hlbGwuZnJpZGdlRGlzdHJpY3RzWzBdO1xuICAgICAgICB9KTtcblxuICAgICAgICBGaWx0ZXJTZXJ2aWNlLmdldEZyaWRnZUNhcmVMZXZlbHMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHNoZWxsLmZyaWRnZUNhcmVMZXZlbHMgPSBkYXRhO1xuICAgICAgICAgICAgLy9zaGVsbC5zZWxlY3RlZEZyaWRnZUNhcmVMZXZlbCA9IHNoZWxsLmZyaWRnZUNhcmVMZXZlbHNbMF07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIEZpbHRlclNlcnZpY2UuZ2V0RnJpZGdlUXVhcnRlcnMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHNoZWxsLmZyaWRnZVF1YXJ0ZXJzID0gZGF0YTtcbiAgICAgICAgICAgLy8gc2hlbGwuc2VsZWN0ZWRGcmlkZ2VRdWFydGVyID0gc2hlbGwuZnJpZGdlUXVhcnRlcnNbM107XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vPT09PSBFbmQgQ29sZCBDaGFpbiA9PT09PT09XG5cblxuLy8gICAgICAgICRzY29wZS4kd2F0Y2goJ3NoZWxsLmVuZE1vbnRoJywgZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgIGlmIChzaGVsbC5lbmRNb250aCkge1xuLy8gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdyZWZyZXNoJywgc2hlbGwuc3RhcnRNb250aCwgc2hlbGwuZW5kTW9udGgsIHNoZWxsLnNlbGVjdGVkRGlzdHJpY3QsIHNoZWxsLnNlbGVjdGVkVmFjY2luZSk7XG4vLyAgICAgICAgICAgIH1cbi8vICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoR3JvdXAoWydzaGVsbC5lbmRNb250aCcsICdzaGVsbC5zZWxlY3RlZFZhY2NpbmUnLCAnc2hlbGwuc2VsZWN0ZWREaXN0cmljdCddLCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgaWYoZGF0YVswXSAmJiBkYXRhWzFdICYmIGRhdGFbMl0pe1xuICAgICAgICAgICAgICAgIGlmIChzaGVsbC5lbmRNb250aCkge1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3JlZnJlc2gnLCBzaGVsbC5zdGFydE1vbnRoLCBzaGVsbC5lbmRNb250aCwgc2hlbGwuc2VsZWN0ZWREaXN0cmljdCwgc2hlbGwuc2VsZWN0ZWRWYWNjaW5lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2hHcm91cChbJ3NoZWxsLmZpbmFuY2VTdGFydFllYXInLCAnc2hlbGwuZmluYW5jZUVuZFllYXInXSwgZnVuY3Rpb24oZGF0YSwgb2xkRGF0YSkge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdyZWZyZXNoRmluYW5jZScsIHtcbiAgICAgICAgICAgICAgICBzdGFydFllYXI6IHNoZWxsLmZpbmFuY2VTdGFydFllYXIsXG4gICAgICAgICAgICAgICAgZW5kWWVhcjogc2hlbGwuZmluYW5jZUVuZFllYXIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaEdyb3VwKFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdzaGVsbC5zdGFydFllYXInLFxuICAgICAgICAgICAgICAgICdzaGVsbC5lbmRZZWFyJyxcbiAgICAgICAgICAgICAgICAnc2hlbGwuYWN0aXZlQ292ZXJhZ2VZZWFyJyxcbiAgICAgICAgICAgICAgICAnc2hlbGwuYW50aWdlbicsXG4gICAgICAgICAgICAgICAgJ3NoZWxsLmRvc2UnLFxuICAgICAgICAgICAgICAgICdzaGVsbC5kaXN0cmljdCdcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICBpZihkYXRhWzBdKXtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNoZWxsLmVuZE1vbnRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3JlZnJlc2hDb3ZlcmFnZTInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsLmVuZE1vbnRoLCAvL0JhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGwuc3RhcnRZZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsLmVuZFllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGwuYWN0aXZlQ292ZXJhZ2VZZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsLmFudGlnZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGwuZG9zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbC5kaXN0cmljdFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdyZWZyZXNoQ292ZXJhZ2UzJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZE1vbnRoOiBzaGVsbC5lbmRNb250aCwgLy9CYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0WWVhcjogc2hlbGwuc3RhcnRZZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFllYXI6IHNoZWxsLmVuZFllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlQ292ZXJhZ2VZZWFyOiBzaGVsbC5hY3RpdmVDb3ZlcmFnZVllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW50aWdlbjogc2hlbGwuYW50aWdlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb3NlOiBzaGVsbC5kb3NlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBzaGVsbC5kaXN0cmljdFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHJ1ZVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIERpc2FibGVkIGJlY2F1c2UgaXQgbG9va3MgbGlrZSBhIGR1cGxpY2F0aW9uXG4gICAgICAgIC8qJHNjb3BlLiR3YXRjaCgnc2hlbGwuZW5kUXVhcnRlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHNoZWxsLmVuZFF1YXJ0ZXIpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3JlZnJlc2hDYXBhY2l0eScsIHNoZWxsLnN0YXJ0UXVhcnRlciwgc2hlbGwuZW5kUXVhcnRlciwgc2hlbGwuc2VsZWN0ZWRGcmlkZ2VEaXN0cmljdCwgc2hlbGwuc2VsZWN0ZWRGcmlkZ2VDYXJlTGV2ZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTsqL1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2hHcm91cChbJ3NoZWxsLmVuZFF1YXJ0ZXInLCAnc2hlbGwuc2VsZWN0ZWRGcmlkZ2VEaXN0cmljdCcsICdzaGVsbC5zZWxlY3RlZEZyaWRnZUNhcmVMZXZlbCcsICdzaGVsbC5zdGFydFF1YXJ0ZXInXSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBpZihkYXRhWzBdICYmIGRhdGFbMV0pe1xuICAgICAgICAgICAgICAgIGlmIChzaGVsbC5lbmRRdWFydGVyICYmIHNoZWxsLnNlbGVjdGVkRnJpZGdlRGlzdHJpY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdyZWZyZXNoQ2FwYWNpdHknLCBzaGVsbC5zdGFydFF1YXJ0ZXIsIHNoZWxsLmVuZFF1YXJ0ZXIsIHNoZWxsLnNlbGVjdGVkRnJpZGdlRGlzdHJpY3QsIHNoZWxsLnNlbGVjdGVkRnJpZGdlQ2FyZUxldmVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAkc2NvcGUuJHdhdGNoKCdzaGVsbC55ZWFycycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZiAoc2hlbGwuc2VsZWN0ZWRZZWFyKXtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3JlZnJlc2hBd3AnLCBzaGVsbC5zZWxlY3RlZFllYXIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2hHcm91cChbJ3NoZWxsLnllYXJzJ10sIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgaWYoZGF0YVswXSAmJiBkYXRhWzFdKXtcbiAgICAgICAgICAgICAgICBpZiAoc2hlbGwuc2VsZWN0ZWRZZWFyKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncmVmcmVzaEF3cCcsIHNoZWxsLnNlbGVjdGVkWWVhcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoKCdzaGVsbC5jb3ZlcmFnZVBlcmlvZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHNoZWxsLmNvdmVyYWdlUGVyaW9kKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdyZWZyZXNoQ292ZXJhZ2UnLCBzaGVsbC5jb3ZlcmFnZVBlcmlvZCwgc2hlbGwuc2VsZWN0ZWREaXN0cmljdCwgc2hlbGwuc2VsZWN0ZWRWYWNjaW5lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaEdyb3VwKFsnc2hlbGwuY292ZXJhZ2VQZXJpb2QnLCAnc2hlbGwuc2VsZWN0ZWREaXN0cmljdCcsICdzaGVsbC5zZWxlY3RlZFZhY2NpbmUnXSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBpZihkYXRhWzBdICYmIGRhdGFbMV0gJiYgZGF0YVsyXSl7XG4gICAgICAgICAgICAgICAgaWYgKHNoZWxsLmNvdmVyYWdlUGVyaW9kKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncmVmcmVzaENvdmVyYWdlJywgc2hlbGwuY292ZXJhZ2VQZXJpb2QsIHNoZWxsLnNlbGVjdGVkRGlzdHJpY3QsIHNoZWxsLnNlbGVjdGVkVmFjY2luZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoKCdzaGVsbC5jb3ZlcmFnZVBlcmlvZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHNoZWxsLmNvdmVyYWdlUGVyaW9kICYmIHNoZWxsLnNlbGVjdGVkRGlzdHJpY3QpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3JlZnJlc2hVbmVwaScsIHNoZWxsLmNvdmVyYWdlUGVyaW9kLCBzaGVsbC5zZWxlY3RlZERpc3RyaWN0LCBzaGVsbC5zZWxlY3RlZFZhY2NpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoR3JvdXAoWydzaGVsbC5jb3ZlcmFnZVBlcmlvZCcsICdzaGVsbC5zZWxlY3RlZERpc3RyaWN0JywgJ3NoZWxsLnNlbGVjdGVkVmFjY2luZSddLCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGlmKGRhdGFbMF0gJiYgZGF0YVsxXSAmJiBkYXRhWzJdKXtcbiAgICAgICAgICAgICAgICBpZiAoc2hlbGwuY292ZXJhZ2VQZXJpb2QgJiYgc2hlbGwuc2VsZWN0ZWREaXN0cmljdCkge1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3JlZnJlc2hVbmVwaScsIHNoZWxsLmNvdmVyYWdlUGVyaW9kLCBzaGVsbC5zZWxlY3RlZERpc3RyaWN0LCBzaGVsbC5zZWxlY3RlZFZhY2NpbmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cblxuICAgIH1cbl0pO1xufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ3NlcnZpY2VzJykuc2VydmljZSgnTWFwU3VwcG9ydFNlcnZpY2UnLCBbXG4gICAgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIGNyZWF0ZURpc3RyaWN0RGF0YU1hcCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBkYXRhRGlzdHJpY3RNYXAgPSB7fTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBlcmlvZCA9IGRhdGFbaV0ucGVyaW9kO1xuICAgICAgICAgICAgICAgIHZhciBmaXJzdF9kb3NlID0gZGF0YVtpXS50b3RhbF9maXJzdF9kb3NlO1xuICAgICAgICAgICAgICAgIHZhciBzZWNvbmRfZG9zZSA9IGRhdGFbaV0udG90YWxfc2Vjb25kX2Rvc2U7XG4gICAgICAgICAgICAgICAgdmFyIHRoaXJkX2Rvc2UgPSBkYXRhW2ldLnRvdGFsX3RoaXJkX2Rvc2U7XG4gICAgICAgICAgICAgICAgdmFyIGxhc3RfZG9zZSA9IGRhdGFbaV0udG90YWxfbGFzdF9kb3NlO1xuICAgICAgICAgICAgICAgIHZhciBwbGFubmVkID0gZGF0YVtpXS50b3RhbF9wbGFubmVkO1xuICAgICAgICAgICAgICAgIHZhciB2YWNjaW5lID0gZGF0YVtpXS52YWNjaW5lX19uYW1lO1xuICAgICAgICAgICAgICAgIHZhciBkaXN0cmljdCA9IGRhdGFbaV0uZGlzdHJpY3RfX25hbWU7XG4gICAgICAgICAgICAgICAgdmFyIHBlcmlvZFllYXIgPSBOdW1iZXIocGVyaW9kLnRvU3RyaW5nKCkuc3Vic3RyKDAsIDQpKTtcbiAgICAgICAgICAgICAgICB2YXIgcGVyaW9kTW9udGggPSBOdW1iZXIocGVyaW9kLnRvU3RyaW5nKCkuc3Vic3RyKDQsIDYpKTtcblxuICAgICAgICAgICAgICAgIGlmICghIChkaXN0cmljdCBpbiBkYXRhRGlzdHJpY3RNYXApKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFEaXN0cmljdE1hcFtkaXN0cmljdF0gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoISAodmFjY2luZSBpbiBkYXRhRGlzdHJpY3RNYXBbZGlzdHJpY3RdKSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhRGlzdHJpY3RNYXBbZGlzdHJpY3RdW3ZhY2NpbmVdID0ge307XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCEgKHBlcmlvZFllYXIgaW4gZGF0YURpc3RyaWN0TWFwW2Rpc3RyaWN0XVt2YWNjaW5lXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YURpc3RyaWN0TWFwW2Rpc3RyaWN0XVt2YWNjaW5lXVtwZXJpb2RZZWFyXSA9IHt9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghIChwZXJpb2RNb250aCBpbiBkYXRhRGlzdHJpY3RNYXBbZGlzdHJpY3RdW3ZhY2NpbmVdW3BlcmlvZFllYXJdKSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhRGlzdHJpY3RNYXBbZGlzdHJpY3RdW3ZhY2NpbmVdW3BlcmlvZFllYXJdW3BlcmlvZE1vbnRoXSA9IHt9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRhdGFEaXN0cmljdE1hcFtkaXN0cmljdF1bdmFjY2luZV1bcGVyaW9kWWVhcl1bcGVyaW9kTW9udGhdLmZpcnN0X2Rvc2UgPSBmaXJzdF9kb3NlO1xuICAgICAgICAgICAgICAgIGRhdGFEaXN0cmljdE1hcFtkaXN0cmljdF1bdmFjY2luZV1bcGVyaW9kWWVhcl1bcGVyaW9kTW9udGhdLmxhc3RfZG9zZSA9IGxhc3RfZG9zZTtcbiAgICAgICAgICAgICAgICBkYXRhRGlzdHJpY3RNYXBbZGlzdHJpY3RdW3ZhY2NpbmVdW3BlcmlvZFllYXJdW3BlcmlvZE1vbnRoXS5zZWNvbmRfZG9zZSA9IHNlY29uZF9kb3NlO1xuICAgICAgICAgICAgICAgIGRhdGFEaXN0cmljdE1hcFtkaXN0cmljdF1bdmFjY2luZV1bcGVyaW9kWWVhcl1bcGVyaW9kTW9udGhdLnRoaXJkX2Rvc2UgPSB0aGlyZF9kb3NlO1xuICAgICAgICAgICAgICAgIGRhdGFEaXN0cmljdE1hcFtkaXN0cmljdF1bdmFjY2luZV1bcGVyaW9kWWVhcl1bcGVyaW9kTW9udGhdLnBsYW5uZWQgPSBwbGFubmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZGF0YURpc3RyaWN0TWFwO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRQZXJpb2RMaXN0ID0gZnVuY3Rpb24oZGF0YSwgZW5kWWVhciwgcmVwb3J0VG9nZ2xlKSB7XG4gICAgICAgICAgICB2YXIgcGVyaW9kTGlzdCA9IFtdO1xuXG4gICAgICAgICAgICBpZiAocmVwb3J0VG9nZ2xlID09ICdNQ1knKSB7XG4gICAgICAgICAgICAgICAgcGVyaW9kTGlzdC5wdXNoKFxuICAgICAgICAgICAgICAgICAgICBbZW5kWWVhci50b1N0cmluZygpLCAgZ2V0TGFzdFZhbHVlKGRhdGFbZW5kWWVhcl0sIDEyKV1cbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlcG9ydFRvZ2dsZSA9PSAnTUZZJykge1xuICAgICAgICAgICAgICAgIHZhciBuZXh0WWVhciA9IGVuZFllYXIgKyAxO1xuICAgICAgICAgICAgICAgIHZhciBsYXN0VmFsdWU7XG5cbiAgICAgICAgICAgICAgICBpZiAobmV4dFllYXIgaW4gZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBnZXRMYXN0VmFsdWUoZGF0YVtuZXh0WWVhcl0sIDYpO1xuICAgICAgICAgICAgICAgICAgICBwZXJpb2RMaXN0LnB1c2goW25leHRZZWFyLnRvU3RyaW5nKCksIGxhc3RWYWx1ZV0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IGdldExhc3RWYWx1ZShkYXRhW2VuZFllYXJdLCAxMik7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZExpc3QucHVzaChbZW5kWWVhci50b1N0cmluZygpLCBsYXN0VmFsdWVdKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVwb3J0VG9nZ2xlID09ICdBQ1knKSB7XG4gICAgICAgICAgICAgICAgcGVyaW9kTGlzdC5wdXNoLmFwcGx5KHBlcmlvZExpc3QsXG4gICAgICAgICAgICAgICAgICAgIGdldFZhbHVlc0luUmFuZ2UoXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kWWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRZZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TGFzdFZhbHVlKGRhdGFbZW5kWWVhcl0sIDEyKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXBvcnRUb2dnbGUgPT0gJ0FGWScpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFllYXIgPSBlbmRZZWFyICsgMTtcblxuICAgICAgICAgICAgICAgIGlmIChuZXh0WWVhciBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZExpc3QucHVzaC5hcHBseShwZXJpb2RMaXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0VmFsdWVzSW5SYW5nZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgNyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0WWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRMYXN0VmFsdWUoZGF0YVtuZXh0WWVhcl0sIDYpXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kTGlzdC5wdXNoLmFwcGx5KHBlcmlvZExpc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRWYWx1ZXNJblJhbmdlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kWWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TGFzdFZhbHVlKGRhdGFbZW5kWWVhcl0sIDEyKVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcGVyaW9kTGlzdDtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRBZ2dyZWdhdGVzKGRhdGEsIHBlcmlvZExpc3QpIHtcbiAgICAgICAgICAgIHJldHVybiBwZXJpb2RMaXN0LnJlZHVjZShmdW5jdGlvbihhY2MsIHBlcmlvZCkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhID09IHVuZGVmaW5lZCB8fCBkYXRhW3BlcmlvZFswXV0gPT0gdW5kZWZpbmVkIHx8IGRhdGFbcGVyaW9kWzBdXVtwZXJpb2RbMV1dID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGRhdGFbcGVyaW9kWzBdXVtwZXJpb2RbMV1dO1xuICAgICAgICAgICAgICAgIGFjYy50b3RhbFBsYW5uZWQgKz0gaXRlbS5wbGFubmVkO1xuICAgICAgICAgICAgICAgIGFjYy50b3RhbEZpcnN0RG9zZSArPSBpdGVtLmZpcnN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgYWNjLnRvdGFsU2Vjb25kRG9zZSArPSBpdGVtLnNlY29uZF9kb3NlO1xuICAgICAgICAgICAgICAgIGFjYy50b3RhbFRoaXJkRG9zZSArPSBpdGVtLnRoaXJkX2Rvc2U7XG4gICAgICAgICAgICAgICAgYWNjLnRvdGFsTGFzdERvc2UgKz0gaXRlbS5sYXN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgIH0sIHt0b3RhbFBsYW5uZWQ6IDAsIHRvdGFsRmlyc3REb3NlOjAsIHRvdGFsU2Vjb25kRG9zZTowLCB0b3RhbFRoaXJkRG9zZTowLCB0b3RhbExhc3REb3NlOjB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjYWxjdWxhdGVDb3ZlcmFnZVJhdGUgPSBmdW5jdGlvbihkYXRhLCBwZXJpb2RMaXN0LCBkb3NlTnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZ2V0QWdncmVnYXRlcyhkYXRhLCBwZXJpb2RMaXN0KTtcbiAgICAgICAgICAgIHZhciBkb3NlVmFsdWUgPSByZXN1bHQudG90YWxMYXN0RG9zZTtcbiAgICAgICAgICAgIGlmIChkb3NlTnVtYmVyID09IDEpIGRvc2VWYWx1ZSA9IHJlc3VsdC50b3RhbEZpcnN0RG9zZTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGRvc2VOdW1iZXIgPT0gMikgZG9zZVZhbHVlID0gcmVzdWx0LnRvdGFsU2Vjb25kRG9zZTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGRvc2VOdW1iZXIgPT0gMykgZG9zZVZhbHVlID0gcmVzdWx0LnRvdGFsVGhpcmREb3NlO1xuICAgICAgICAgICAgcmV0dXJuIChkb3NlVmFsdWUgLyByZXN1bHQudG90YWxQbGFubmVkKSAqIDEwMDtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgY2FsY3VsYXRlRHJvcG91dFJhdGUgPSBmdW5jdGlvbihkYXRhLCBwZXJpb2RMaXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZ2V0QWdncmVnYXRlcyhkYXRhLCBwZXJpb2RMaXN0KTtcbiAgICAgICAgICAgIHJldHVybiAoKHJlc3VsdC50b3RhbEZpcnN0RG9zZSAtIHJlc3VsdC50b3RhbExhc3REb3NlKSAvIHJlc3VsdC50b3RhbEZpcnN0RG9zZSkgKiAxMDA7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGNhbGN1bGF0ZVJlZENhdGVnb3J5VmFsdWUgPSBmdW5jdGlvbihkYXRhLCBwZXJpb2RMaXN0KSB7XG4gICAgICAgICAgICB2YXIgciA9IGdldEFnZ3JlZ2F0ZXMoZGF0YSwgcGVyaW9kTGlzdCk7XG4gICAgICAgICAgICB2YXIgYWNjZXNzID0gKHIudG90YWxGaXJzdERvc2UgLyByLnRvdGFsUGxhbm5lZCkgKiAxMDA7XG4gICAgICAgICAgICB2YXIgZHJvcG91dFJhdGUgPSAoKHIudG90YWxGaXJzdERvc2UgLSByLnRvdGFsTGFzdERvc2UpIC8gci50b3RhbEZpcnN0RG9zZSkgKiAxMDA7XG5cbiAgICAgICAgICAgIGlmIChhY2Nlc3MgPj0gOTAgJiYgZHJvcG91dFJhdGUgPj0gMCAmJiBkcm9wb3V0UmF0ZSA8PSAxMCkgcmV0dXJuIDE7XG4gICAgICAgICAgICBlbHNlIGlmIChhY2Nlc3MgPj0gOTAgJiYgKGRyb3BvdXRSYXRlIDwgMCB8fCBkcm9wb3V0UmF0ZSA+IDEwKSkgcmV0dXJuIDI7XG4gICAgICAgICAgICBlbHNlIGlmIChhY2Nlc3MgPCA5MCAmJiBkcm9wb3V0UmF0ZSA+PSAwICYmIGRyb3BvdXRSYXRlIDw9IDEwKSByZXR1cm4gMztcbiAgICAgICAgICAgIGVsc2UgaWYgKGFjY2VzcyA8IDkwICYmIChkcm9wb3V0UmF0ZSA8IDAgfHwgZHJvcG91dFJhdGUgPiAxMCkpIHJldHVybiA0O1xuICAgICAgICAgICAgZWxzZSByZXR1cm4gMDtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0TGFzdFZhbHVlID0gZnVuY3Rpb24oZCwgZGVmYXVsdFZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoZCA9PSB1bmRlZmluZWQpIHJldHVybjtcbiAgICAgICAgICAgIGlmIChkZWZhdWx0VmFsdWUgaW4gZCkgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZCk7XG4gICAgICAgICAgICByZXR1cm4ga2V5c1trZXlzLmxlbmd0aC0xXTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0VmFsdWVzSW5SYW5nZSA9IGZ1bmN0aW9uKGRhdGEsIHN0YXJ0WWVhciwgc3RhcnRNb250aCwgZW5kWWVhciwgZW5kTW9udGgpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoeWVhckluZGV4IGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoeWVhckluZGV4IDwgc3RhcnRZZWFyIHx8IHllYXJJbmRleCA+IGVuZFllYXIpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgZm9yIChtb250aEluZGV4IGluIGRhdGFbeWVhckluZGV4XSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoeWVhckluZGV4ID09IHN0YXJ0WWVhciAmJiBtb250aEluZGV4IDwgc3RhcnRNb250aCkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh5ZWFySW5kZXggPT0gZW5kWWVhciAmJiBtb250aEluZGV4ID4gZW5kTW9udGgpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaChbeWVhckluZGV4LCBtb250aEluZGV4XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJjcmVhdGVEaXN0cmljdERhdGFNYXBcIjogY3JlYXRlRGlzdHJpY3REYXRhTWFwLFxuICAgICAgICAgICAgXCJnZXRQZXJpb2RMaXN0XCI6IGdldFBlcmlvZExpc3QsXG4gICAgICAgICAgICBcImNhbGN1bGF0ZUNvdmVyYWdlUmF0ZVwiOiBjYWxjdWxhdGVDb3ZlcmFnZVJhdGUsXG4gICAgICAgICAgICBcImNhbGN1bGF0ZURyb3BvdXRSYXRlXCI6IGNhbGN1bGF0ZURyb3BvdXRSYXRlLFxuICAgICAgICAgICAgXCJjYWxjdWxhdGVSZWRDYXRlZ29yeVZhbHVlXCI6IGNhbGN1bGF0ZVJlZENhdGVnb3J5VmFsdWVcbiAgICAgICAgfTtcbiAgICB9XG5dKVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ3NlcnZpY2VzJykuc2VydmljZSgnU3RvY2tTZXJ2aWNlJywgWyckaHR0cCcsXG4gICAgZnVuY3Rpb24oJGh0dHApIHtcbiAgICAgICAgdmFyIGhhbmRsZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRTdG9ja0J5RGlzdHJpY3QgPSBmdW5jdGlvbihzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2FwaS9zdG9jay9hdGhhbmRieWRpc3RyaWN0Jywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydE1vbnRoOiBzdGFydE1vbnRoLFxuICAgICAgICAgICAgICAgICAgICBlbmRNb250aDogZW5kTW9udGgsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZTogdmFjY2luZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgZ2V0VW5lcGlTdG9jayA9IGZ1bmN0aW9uKGVuZE1vbnRoLCBkaXN0cmljdCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnYXBpL3N0b2NrL2F0aGFuZGJ5ZGlzdHJpY3QnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIGVuZE1vbnRoOiBlbmRNb250aCxcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldFN0b2NrQnlNb250aCA9IGZ1bmN0aW9uKHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnYXBpL3N0b2NrL2F0aGFuZGJ5bW9udGgnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0TW9udGg6IHN0YXJ0TW9udGgsXG4gICAgICAgICAgICAgICAgICAgIGVuZE1vbnRoOiBlbmRNb250aCxcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lOiB2YWNjaW5lXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICAgICB2YXIgZ2V0U3RvY2tCeURpc3RyaWN0VmFjY2luZSA9IGZ1bmN0aW9uKHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9zdG9jay9zdG9ja2J5ZGlzdHJpY3R2YWNjaW5lJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydE1vbnRoOiBzdGFydE1vbnRoLFxuICAgICAgICAgICAgICAgICAgICBlbmRNb250aDogZW5kTW9udGgsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZTogdmFjY2luZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICAgIHZhciBnZXRTdG9ja2VkT3V0ID0gZnVuY3Rpb24oc3RhcnRNb250aCwgZW5kTW9udGgsIGRpc3RyaWN0LCB2YWNjaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3N0b2NrZWRvdXQnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0TW9udGg6IHN0YXJ0TW9udGgsXG4gICAgICAgICAgICAgICAgICAgIGVuZE1vbnRoOiBlbmRNb250aCxcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lOiB2YWNjaW5lXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBnZXRTdG9ja01vbnRoc0xlZnQgPSBmdW5jdGlvbihkaXN0cmljdCwgdmFjY2luZSkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnYXBpL3N0b2NrL3N0b2NrbW9udGhzbGVmdCcsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lOiB2YWNjaW5lXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBcImdldFN0b2NrQnlEaXN0cmljdFwiOiBnZXRTdG9ja0J5RGlzdHJpY3QsXG4gICAgICAgICAgICBcImdldFN0b2NrQnlNb250aFwiOiBnZXRTdG9ja0J5TW9udGgsXG4gICAgICAgICAgICBcImdldFN0b2NrTW9udGhzTGVmdFwiOiBnZXRTdG9ja01vbnRoc0xlZnQsXG4gICAgICAgICAgICBcImdldFN0b2NrQnlEaXN0cmljdFZhY2NpbmVcIjogZ2V0U3RvY2tCeURpc3RyaWN0VmFjY2luZSxcbiAgICAgICAgICAgIFwiZ2V0U3RvY2tlZE91dFwiOiBnZXRTdG9ja2VkT3V0LFxuICAgICAgICAgICAgXCJnZXRVbmVwaVN0b2NrXCI6Z2V0VW5lcGlTdG9ja1xuICAgICAgICB9O1xuICAgIH1cbl0pXG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJykuY29udHJvbGxlcignQW5udWFsQ292ZXJhZ2VDb250cm9sbGVyJywgQW5udWFsQ292ZXJhZ2VDb250cm9sbGVyKTtcblxuQW5udWFsQ292ZXJhZ2VDb250cm9sbGVyLiRpbmplY3QgPSBbXG4gICAgJyRzY29wZScsXG4gICAgJ0NvdmVyYWdlU2VydmljZScsXG4gICAgJ0NvdmVyYWdlQ2FsY3VsYXRvcicsXG4gICAgJ0NoYXJ0UERGRXhwb3J0JyxcbiAgICAnJHRpbWVvdXQnXG5dO1xuZnVuY3Rpb24gQW5udWFsQ292ZXJhZ2VDb250cm9sbGVyKCRzY29wZSwgQ292ZXJhZ2VTZXJ2aWNlLCBDb3ZlcmFnZUNhbGN1bGF0b3IsIENoYXJ0UERGRXhwb3J0LCAkdGltZW91dCkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgJHNjb3BlLiRvbigncmVmcmVzaENvdmVyYWdlMycsIHVwZGF0ZUNoYXJ0KTtcblxuICAgIHZtLmNoYXJ0T3B0aW9ucyA9IGdldENoYXJ0T3B0aW9ucygpO1xuICAgIHZtLmNoYXJ0RGF0YSA9IFtdO1xuICAgIHZtLnllYXJJbmRleGVzID0gW107XG4gICAgdm0uZXhwb3J0UERGID0gZnVuY3Rpb24obmFtZSkgeyBDaGFydFBERkV4cG9ydC5leHBvcnRXaXRoU3R5bGVyKHZtLCBuYW1lKTsgfTtcbiAgICB2bS5pbml0TGFiZWxzID0gaW5pdExhYmVscztcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUNoYXJ0KGUsIHBhcmFtcykge1xuICAgICAgICB2YXIgYW50aWdlbkxhYmVsID0gcGFyYW1zLmFudGlnZW4gPT0gJ0FMTCcgPyAnQW50aWdlbnMnIDogcGFyYW1zLmFudGlnZW47XG4gICAgICAgIHZhciB5ZWFyUGVyaW9kID0gcGFyYW1zLnN0YXJ0WWVhciA9PSBwYXJhbXMuZW5kWWVhclxuICAgICAgICAgICAgPyBwYXJhbXMuc3RhcnRZZWFyIDogYCR7cGFyYW1zLnN0YXJ0WWVhcn0gLSAke3BhcmFtcy5lbmRZZWFyfWA7XG4gICAgICAgIHZtLmNoYXJ0VGl0bGUgPSBgJHthbnRpZ2VuTGFiZWx9IENvdmVyYWdlIGZvciAke3llYXJQZXJpb2R9YDtcbiAgICAgICAgY2xlYXJMYWJlbHMoKTtcblxuICAgICAgICBDb3ZlcmFnZVNlcnZpY2UuZ2V0VmFjY2luZURvc2VzQnlQZXJpb2QocGFyYW1zKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIC8qIEFnZ3JlZ2F0ZSB0aGUgZGF0YSBiYXNlZCBvbiBwZXJpb2QgKi9cbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBkYXRhLnJlZHVjZShmdW5jdGlvbihhY2MsIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFjY2luZSA9IGl0ZW0udmFjY2luZV9fbmFtZTtcbiAgICAgICAgICAgICAgICB2YXIgeWVhciA9IGl0ZW0ucGVyaW9kLnRvU3RyaW5nKCkuc3Vic3RyKDAsNCk7XG4gICAgICAgICAgICAgICAgaWYgKHZtLnllYXJJbmRleGVzLmluZGV4T2YoeWVhcikgPT0gLTEpIHZtLnllYXJJbmRleGVzLnB1c2goeWVhcik7XG4gICAgICAgICAgICAgICAgaWYgKCEgKHZhY2NpbmUgaW4gYWNjKSkgYWNjW3ZhY2NpbmVdID0ge307XG4gICAgICAgICAgICAgICAgaWYgKCEgKHllYXIgaW4gYWNjW3ZhY2NpbmVdKSlcbiAgICAgICAgICAgICAgICAgICAgYWNjW3ZhY2NpbmVdW3llYXJdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxBY3R1YWw6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbEZpcnN0RG9zZTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsVGhpcmREb3NlOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxMYXN0RG9zZTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsUGxhbm5lZDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsU2Vjb25kRG9zZTogMFxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgYWNjW3ZhY2NpbmVdW3llYXJdLnRvdGFsQWN0dWFsICs9IGl0ZW0udG90YWxfYWN0dWFsO1xuICAgICAgICAgICAgICAgIGFjY1t2YWNjaW5lXVt5ZWFyXS50b3RhbEZpcnN0RG9zZSArPSBpdGVtLnRvdGFsX2ZpcnN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgYWNjW3ZhY2NpbmVdW3llYXJdLnRvdGFsTGFzdERvc2UgKz0gaXRlbS50b3RhbF9sYXN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgYWNjW3ZhY2NpbmVdW3llYXJdLnRvdGFsUGxhbm5lZCArPSBpdGVtLnRvdGFsX3BsYW5uZWQ7XG4gICAgICAgICAgICAgICAgYWNjW3ZhY2NpbmVdW3llYXJdLnRvdGFsU2Vjb25kRG9zZSArPSBpdGVtLnRvdGFsX3NlY29uZF9kb3NlO1xuICAgICAgICAgICAgICAgIGFjY1t2YWNjaW5lXVt5ZWFyXS50b3RhbFRoaXJkRG9zZSArPSBpdGVtLnRvdGFsX3RoaXJkX2Rvc2U7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgfSwge30pO1xuXG4gICAgICAgICAgICAvKiBDYWxjdWxhdGUgUmF0ZXMgZm9yIHRoZSByZXN1bHRzICovXG4gICAgICAgICAgICB2YXIgY2hhcnREYXRhID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciB2YWNjaW5lIGluIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHZhciB2YWNjaW5lRGF0YSA9IHtjUjogW10sIGNSMTogW10sIGNSMjogW10sIGNSMzogW119O1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeWVhciBpbiByZXN1bHRbdmFjY2luZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBsYW5uZWQgPSByZXN1bHRbdmFjY2luZV1beWVhcl0udG90YWxQbGFubmVkO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHJlc3VsdFt2YWNjaW5lXVt5ZWFyXTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgY1IxID0gQ292ZXJhZ2VDYWxjdWxhdG9yLmNhbGN1bGF0ZUNvdmVyYWdlUmF0ZShpdGVtLnRvdGFsRmlyc3REb3NlLCBwbGFubmVkKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNSMiA9IENvdmVyYWdlQ2FsY3VsYXRvci5jYWxjdWxhdGVDb3ZlcmFnZVJhdGUoaXRlbS50b3RhbFNlY29uZERvc2UsIHBsYW5uZWQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY1IgPSBDb3ZlcmFnZUNhbGN1bGF0b3IuY2FsY3VsYXRlQ292ZXJhZ2VSYXRlKGl0ZW0udG90YWxMYXN0RG9zZSwgcGxhbm5lZCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjUjMgPSBDb3ZlcmFnZUNhbGN1bGF0b3IuY2FsY3VsYXRlQ292ZXJhZ2VSYXRlKGl0ZW0udG90YWxUaGlyZERvc2UsIHBsYW5uZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBpID0gdm0ueWVhckluZGV4ZXMuaW5kZXhPZih5ZWFyKTtcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZURhdGEuY1IucHVzaCh7eDogaSwgeTogY1J9KTtcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZURhdGEuY1IxLnB1c2goe3g6IGksIHk6IGNSMX0pO1xuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lRGF0YS5jUjIucHVzaCh7eDogaSwgeTogY1IyfSk7XG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmVEYXRhLmNSMy5wdXNoKHt4OiBpLCB5OiBjUjN9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocGFyYW1zLmFudGlnZW4gIT0gXCJBTExcIikge1xuICAgICAgICAgICAgICAgICAgICAvKiBTaG93IGNvdmVyYWdlcyBmb3IgdGhlIGRpZmZlcmVudCBkb3NlcyAqL1xuICAgICAgICAgICAgICAgICAgICBjaGFydERhdGEucHVzaCh7a2V5OiAnRG9zZSAxJywgdmFsdWVzOiB2YWNjaW5lRGF0YS5jUjF9KTsgIFxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheSh2YWNjaW5lLCBbJ1BFTlRBJywgJ1BDVicsICdPUFYnLCAnSFBWJywgJ1RUJ10pICE9IC0xKVxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnREYXRhLnB1c2goe2tleTogJ0Rvc2UgMicsIHZhbHVlczogdmFjY2luZURhdGEuY1IyfSk7ICBcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmICgkLmluQXJyYXkocGFyYW1zLmFudGlnZW4sIFsnUEVOVEEnLCAnUENWJywgJ09QVicsICdEUFQnXSkgIT0gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydERhdGEucHVzaCh7a2V5OiAnRG9zZSAzJywgdmFsdWVzOiB2YWNjaW5lRGF0YS5jUjN9KTsgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnREYXRhLnB1c2goe2tleTogdmFjY2luZSwgdmFsdWVzOiB2YWNjaW5lRGF0YS5jUn0pOyAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZtLmNoYXJ0RGF0YSA9IGNoYXJ0RGF0YTtcbiAgICAgICAgICAgIC8vICR0aW1lb3V0KGZ1bmN0aW9uKCkgeygpOyB9LCAyMDAwKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Q2hhcnRPcHRpb25zKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnbXVsdGlCYXJDaGFydCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA0NTAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDkwMCxcbiAgICAgICAgICAgICAgICBzdGFja2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzaG93Q29udHJvbHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGdyb3VwU3BhY2luZzogMC4yLFxuICAgICAgICAgICAgICAgIGNsaXBFZGdlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBtYXJnaW46IHt0b3A6IDcwfSxcbiAgICAgICAgICAgICAgICAvLyB1c2VJbnRlcmFjdGl2ZUd1aWRlbGluZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpbnRlcmFjdGl2ZUxheWVyOiB7Z3Jhdml0eTogJ3MnfSxcbiAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbihkKXsgcmV0dXJuIGQueDsgfSxcbiAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbihkKXsgcmV0dXJuIGQueTsgfSxcbiAgICAgICAgICAgICAgICBmb3JjZVk6IFswLDExMF0sXG4gICAgICAgICAgICAgICAgeEF4aXM6IHtcbiAgICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiAnWWVhcnMnLFxuICAgICAgICAgICAgICAgICAgICB0aWNrRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2bS55ZWFySW5kZXhlc1tkXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeUF4aXM6IHtcbiAgICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiAnQ292ZXJhZ2UgUmF0ZSAoJSknLFxuICAgICAgICAgICAgICAgICAgICB0aWNrczogMTBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRpc3BhdGNoOiB7XG4gICAgICAgICAgICAgICAgICAgIHJlbmRlckVuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbml0TGFiZWxzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdExhYmVscygpIHtcbiAgICAgICAgLy8gWW91IG5lZWQgdG8gYXBwbHkgdGhpcyBvbmNlIGFsbCB0aGUgYW5pbWF0aW9ucyBhcmUgYWxyZWFkeSBmaW5pc2hlZC4gT3RoZXJ3aXNlIGxhYmVscyB3aWxsIGJlIHBsYWNlZCB3cm9uZ2x5LlxuICAgICAgICBkMy5zZWxlY3RBbGwoJy5udi1tdWx0aWJhciAubnYtZ3JvdXAnKS5lYWNoKGZ1bmN0aW9uKGdyb3VwKXtcbiAgICAgICAgICB2YXIgZyA9IGQzLnNlbGVjdCh0aGlzKTtcblxuICAgICAgICAgIC8vIFJlbW92ZSBwcmV2aW91cyBsYWJlbHMgaWYgdGhlcmUgaXMgYW55XG4gICAgICAgICAgZy5zZWxlY3RBbGwoJ3RleHQnKS5yZW1vdmUoKTtcbiAgICAgICAgICBnLnNlbGVjdEFsbCgnLm52LWJhcicpLmVhY2goZnVuY3Rpb24oYmFyKXtcbiAgICAgICAgICAgIHZhciBiID0gZDMuc2VsZWN0KHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhcldpZHRoID0gYi5hdHRyKCd3aWR0aCcpO1xuICAgICAgICAgICAgdmFyIGJhckhlaWdodCA9IGIuYXR0cignaGVpZ2h0Jyk7XG5cbiAgICAgICAgICAgIGcuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAgICAgLy8gVHJhbnNmb3JtcyBzaGlmdCB0aGUgb3JpZ2luIHBvaW50IHRoZW4gdGhlIHggYW5kIHkgb2YgdGhlIGJhclxuICAgICAgICAgICAgICAvLyBpcyBhbHRlcmVkIGJ5IHRoaXMgdHJhbnNmb3JtLiBJbiBvcmRlciB0byBhbGlnbiB0aGUgbGFiZWxzXG4gICAgICAgICAgICAgIC8vIHdlIG5lZWQgdG8gYXBwbHkgdGhpcyB0cmFuc2Zvcm0gdG8gdGhvc2UuXG4gICAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBiLmF0dHIoJ3RyYW5zZm9ybScpKVxuICAgICAgICAgICAgICAudGV4dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8vIFR3byBkZWNpbWFscyBmb3JtYXRcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChiYXIueSkudG9GaXhlZCgwKSArIFwiJVwiO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuYXR0cigneScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy8gQ2VudGVyIGxhYmVsIHZlcnRpY2FsbHlcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5nZXRCQm94KCkuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGIuYXR0cigneScpKSAtIDEwOyAvLyAxMCBpcyB0aGUgbGFiZWwncyBtYWdpbiBmcm9tIHRoZSBiYXJcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8vIENlbnRlciBsYWJlbCBob3Jpem9udGFsbHlcbiAgICAgICAgICAgICAgICB2YXIgd2lkdGggPSB0aGlzLmdldEJCb3goKS53aWR0aDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChiLmF0dHIoJ3gnKSkgKyAocGFyc2VGbG9hdChiYXJXaWR0aCkgLyAyKSAtICh3aWR0aCAvIDIpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYmFyLXZhbHVlcycpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckxhYmVscygpIHtcbiAgICAgICAgZDMuc2VsZWN0QWxsKCcubnYtbXVsdGliYXIgLm52LWdyb3VwJykuZWFjaChmdW5jdGlvbihncm91cCl7XG4gICAgICAgICAgdmFyIGcgPSBkMy5zZWxlY3QodGhpcyk7XG4gICAgICAgICAgLy8gUmVtb3ZlIHByZXZpb3VzIGxhYmVscyBpZiB0aGVyZSBpcyBhbnlcbiAgICAgICAgICBnLnNlbGVjdEFsbCgndGV4dCcpLnJlbW92ZSgpO1xuICAgICAgfSk7XG4gICAgfVxufVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpXG4gICAgLmNvbnRyb2xsZXIoJ0NvdmVyYWdlQ29udHJvbGxlcicsIFtcbiAgICAgICAgJyRzY29wZScsJyRsb2NhdGlvbicsICdTdG9ja1NlcnZpY2UnLCAnJHJvb3RTY29wZScsICdOZ1RhYmxlUGFyYW1zJyxcbiAgICAgICAgJ0ZpbHRlclNlcnZpY2UnLCAnTW9udGhTZXJ2aWNlJywgJ0NvdmVyYWdlU2VydmljZScsICdNYXBTdXBwb3J0U2VydmljZScsICdDaGFydFBERkV4cG9ydCcsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCRsb2NhdGlvbiwgU3RvY2tTZXJ2aWNlLCAkcm9vdFNjb3BlLCBOZ1RhYmxlUGFyYW1zLFxuICAgICAgICBGaWx0ZXJTZXJ2aWNlLCBNb250aFNlcnZpY2UsIENvdmVyYWdlU2VydmljZSwgTWFwU3VwcG9ydFNlcnZpY2UsIENoYXJ0UERGRXhwb3J0KVxuICAgIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdmFyIHNoZWxsU2NvcGUgPSAkc2NvcGUuJHBhcmVudDtcbiAgICAgICAgc2hlbGxTY29wZS5jaGlsZCA9ICRzY29wZTtcbiAgICAgICAgdm0ucGF0aCA9ICRsb2NhdGlvbi5wYXRoKCk7XG4gICAgICAgIHZtLmVuZHR4dD1cIlwiO1xuICAgICAgICB2bS5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdm0uYWN0aXZlUmVwb3J0VG9nZ2xlID0gXCJBQ1lcIjtcbiAgICAgICAgdm0uYWN0aXZlUmVwb3J0WWVhciA9IFwiQ1lcIjtcbiAgICAgICAgdm0uYWN0aXZlRGlzdHJpY3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHZtLnNhbXBsZURpc3RyaWN0RGF0YSA9IHt9O1xuXG4gICAgICAgICRzY29wZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uKHZpZXdMb2NhdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHZpZXdMb2NhdGlvbiA9PT0gJGxvY2F0aW9uLnBhdGgoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBwZXJpb2REaXNwbGF5KHBlcmlvZClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHBlcmlvZCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBtb250aCA9IHBhcnNlSW50KHBlcmlvZC5zbGljZSg0LDYpKTtcbiAgICAgICAgICAgIHJldHVybiBNb250aFNlcnZpY2UuZ2V0TW9udGhOYW1lKG1vbnRoKSArIFwiIFwiICsgcGVyaW9kLnNsaWNlKDAsNClcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS51cGRhdGVSZXBvcnRUb2dnbGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdm0uYWN0aXZlUmVwb3J0VG9nZ2xlID0gdmFsdWU7XG4gICAgICAgICAgICB2bS5hY3RpdmVSZXBvcnRZZWFyID0gdm0uYWN0aXZlUmVwb3J0VG9nZ2xlLnN1YnN0cigxLDIpO1xuICAgICAgICAgICAgdm0udXBkYXRlTWFwV2l0aFZhY2NpbmUodm0uYWN0aXZlVmFjY2luZSk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7d2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdyZXNpemUnKSl9LCAzMDAwKTtcblxuICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5jaGFydFRpdGxlID0gdm0uZ2V0Q2hhcnRUaXRsZSh2bS5zZWxlY3RlZEFudGlnZW4pO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5pc0FjdGl2ZVJlcG9ydFRvZ2dsZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdm0uYWN0aXZlUmVwb3J0VG9nZ2xlID09IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdm0uZ2V0VmFjY2luZURvc2VzID0gZnVuY3Rpb24oZW5kWWVhciwgdmFjY2luZSwgZGlzdHJpY3QpIHtcbiAgICAgICAgICAgIC8vICQoJyNzcGlubmVyLW1vZGFsJykubW9kYWwoJ3Nob3cnKTtcblxuICAgICAgICAgICAgLy8gdm0uZW5kTW9udGg9cGVyaW9kO1xuXG4gICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmhpZGVNYXAgPSB0cnVlO1xuICAgICAgICAgICAgLy8gaWYgKGRpc3RyaWN0ICE9IHVuZGVmaW5lZCAmJiBkaXN0cmljdCAhPSBcIk5hdGlvbmFsXCIpIHtcbiAgICAgICAgICAgIC8vICAgICBzaGVsbFNjb3BlLmNoaWxkLm1hcFBsYWNlaG9sZGVyTWVzc2FnZSA9IFwiTm8gbWFwIGF2YWlsYWJsZS5cIjtcbiAgICAgICAgICAgIC8vICAgICByZXR1cm47XG4gICAgICAgICAgICAvLyB9XG5cblxuICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5tYXBQbGFjZWhvbGRlck1lc3NhZ2UgPSBcIk1hcCBsb2FkaW5nLiBQbGVhc2Ugd2FpdC4uLlwiO1xuXG4gICAgICAgICAgICAvL1RvZG86IFRlbXBvcmFyaWx5IGRpc2FibGUgZmlsdGVyaW5nIGJ5IGRpc3RyaWN0IGZvciB0aGUgdGFibGVcbiAgICAgICAgICAgIGRpc3RyaWN0ID0gXCJcIlxuICAgICAgICAgICAgdm0uZGlzdHJpY3QgPSBkaXN0cmljdDtcbiAgICAgICAgICAgIHZtLnZhY2NpbmUgPSB2YWNjaW5lOy8vdm0uc2VsZWN0ZWRWYWNjaW5lID8gdm0uc2VsZWN0ZWRWYWNjaW5lLm5hbWUgOiBcInZhXCI7XG4gICAgICAgICAgICB2bS5hY3RpdmVWYWNjaW5lID0gdmFjY2luZTtcblxuICAgICAgICAgICAgaWYgKHZhY2NpbmUgPT0gXCJEUFRcIiB8fCB2YWNjaW5lID09IFwiQUxMXCIpIHtcbiAgICAgICAgICAgICAgICB2bS5hY3RpdmVWYWNjaW5lID0gXCJQRU5UQVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBc3NpZ24gZGltZW5zaW9ucyBmb3IgbWFwIGNvbnRhaW5lclxuICAgICAgICAgICAgdmFyIHdpZHRoID0gNTAwLFxuICAgICAgICAgICAgICAgIGhlaWdodCA9IDUwMDtcbiAgICAgICAgICAgIHZhciBmaWVsZCA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgZG9zZTEgPSBcIlwiO1xuXG4gICAgICAgICAgICB2YXIgaW50ZXJwb2xhdGVGdW5jdGlvbjtcblxuICAgICAgICAgICAgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL3JlZGNhdGVnb3J5XCIpe1xuICAgICAgICAgICAgICAgIGludGVycG9sYXRlRnVuY3Rpb24gPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgPSAodCAqIDEwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodCA9PSAwICkgcmV0dXJuICdMaWdodEdyYXknO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQgPT0gMSkgcmV0dXJuICdEYXJrR3JlZW4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQgPT0gMikgcmV0dXJuICdZZWxsb3cnO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQgPT0gMykgcmV0dXJuICdPcmFuZ2UnO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQgPT0gNCkgcmV0dXJuICdSZWQnO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL2Ryb3BvdXRyYXRlXCIpe1xuICAgICAgICAgICAgICAgIGludGVycG9sYXRlRnVuY3Rpb24gPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ID0gdCAqIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ID09IDAgKSByZXR1cm4gJ0xpZ2h0R3JheSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHQgPj0gMCkgJiYgKHQgPD0gMTApKSByZXR1cm4gJ0dyZWVuJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgodCA+PSAtMTAgJiYgdCA8IDApIHx8ICh0ID4gMTAgJiYgdCA8PSAyMCkpIHJldHVybiAnWWVsbG93JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgodCA8IC0xMCkgfHwgKHQgPiAyMCkpIHJldHVybiAnUmVkJztcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbnRlcnBvbGF0ZUZ1bmN0aW9uID0gZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdCA9IHQgKiAxMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodCA9PSAwKSByZXR1cm4gJ0xpZ2h0R3JheSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodCA8IDUwKSByZXR1cm4gJ1JlZCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodD49IDUwICYmIHQ8OTApIHJldHVybiAnWWVsbG93JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ID49IDkwKSByZXR1cm4gJ0RhcmtHcmVlbic7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjb2xvciA9IGQzLnNjYWxlLmxpbmVhcigpXG4gICAgICAgICAgICAgICAgLmRvbWFpbihbMCwgMTAwXSlcbiAgICAgICAgICAgICAgICAuaW50ZXJwb2xhdGUoaW50ZXJwb2xhdGVGdW5jdGlvbik7XG5cbiAgICAgICAgICAgIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9kcm9wb3V0cmF0ZVwiKXtcbiAgICAgICAgICAgICAgICBmaWVsZD1cImRyb3Bfb3V0X3JhdGVcIjtcbiAgICAgICAgICAgICAgICB2bS5lbmR0eHQ9XCIlXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsc2UgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL2NvdmVyYWdlXCIpe1xuICAgICAgICAgICAgICAgIGZpZWxkPVwiY292ZXJhZ2VfcmF0ZVwiO1xuICAgICAgICAgICAgICAgIHZtLmVuZHR4dD1cIiVcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9zZTEgPSBcIkxPV1wiICsgXCIuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlwiKyBcIkhJR0hcIjtcblxuICAgICAgICAgICAgaWYgKHZhY2NpbmU9PVwiUEVOVEFcIil7XG4gICAgICAgICAgICAgICAgdm0udmFjY2luZT1cIkRQVDNcIjtcbiAgICAgICAgICAgICAgICB2bS52YWNkb3NlPVwiRFBUMS1EUFQzXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh2YWNjaW5lPT1cIlBDVlwiKXtcbiAgICAgICAgICAgICAgICB2bS52YWNjaW5lPVwiUENWM1wiO1xuICAgICAgICAgICAgICAgIHZtLnZhY2Rvc2U9XCJQQ1YxLVBDVjNcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHZhY2NpbmU9PVwiQkNHXCIpe1xuICAgICAgICAgICAgICAgIHZtLnZhY2NpbmU9XCJCQ0dcIjtcbiAgICAgICAgICAgICAgICB2bS52YWNkb3NlPVwiQkNHLU1FQVNMRVNcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHZhY2NpbmU9PVwiT1BWXCIpe1xuICAgICAgICAgICAgICAgIHZtLnZhY2NpbmU9XCJPUFYzXCI7XG4gICAgICAgICAgICAgICAgdm0udmFjZG9zZT1cIk9QVjAtT1BWM1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodmFjY2luZT09XCJIUFZcIil7XG4gICAgICAgICAgICAgICAgdm0udmFjY2luZT1cIkhQVjJcIjtcbiAgICAgICAgICAgICAgICB2bS52YWNkb3NlPVwiSFBWMS1IUFYyXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAgZWxzZSBpZiAodmFjY2luZT09XCJNRUFTTEVTXCIpe1xuICAgICAgICAgICAgICAgIHZtLnZhY2NpbmU9XCJNRUFTTEVTXCI7XG4gICAgICAgICAgICAgICAgdm0udmFjZG9zZT1cIkJDRy1NRUFTTEVTXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh2YWNjaW5lPT1cIlRUXCIpe1xuICAgICAgICAgICAgICAgIHZtLnZhY2NpbmU9XCJUVDJcIjtcbiAgICAgICAgICAgICAgICB2bS52YWNkb3NlPVwiVFQxLVRUMlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5wZXJpb2RNb250aCA9IHBlcmlvZERpc3BsYXkodm0uZW5kTW9udGgpO1xuXG4gICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnRoZWRvc2UgPSB2bS52YWNjaW5lO1xuICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC50aGV2YWNkb3NlID0gdm0udmFjZG9zZTtcblxuXG4gICAgICAgICAgICB2YXIgdmFsdWVGb3JtYXQgPSBkMy5mb3JtYXQoXCIsXCIpO1xuXG4gICAgICAgICAgICAvLyBEZWZpbmUgYSBnZW9ncmFwaGljYWwgcHJvamVjdGlvblxuICAgICAgICAgICAgLy8gQWxzbywgc2V0IGluaXRpYWwgem9vbSB0byBzaG93IHRoZSBmZWF0dXJlc1xuICAgICAgICAgICAgdmFyIHByb2plY3Rpb25cdD0gZDMuZ2VvLm1lcmNhdG9yKClcbiAgICAgICAgICAgICAgICAuc2NhbGUoMSk7XG5cbiAgICAgICAgICAgIC8vIFByZXBhcmUgYSBwYXRoIG9iamVjdCBhbmQgYXBwbHkgdGhlIHByb2plY3Rpb24gdG8gaXRcbiAgICAgICAgICAgIHZhciBwYXRoID0gZDMuZ2VvLnBhdGgoKVxuICAgICAgICAgICAgICAgIC5wcm9qZWN0aW9uKHByb2plY3Rpb24pO1xuXG4gICAgICAgICAgICAvLyBXZSBwcmVwYXJlIGFuIG9iamVjdCB0byBsYXRlciBoYXZlIGVhc2llciBhY2Nlc3MgdG8gdGhlIGRhdGEuXG4gICAgICAgICAgICB2YXIgZGF0YUJ5SWQgPSBkMy5tYXAoKTtcblxuICAgICAgICAgICAgLy9EZWZpbmUgcXVhbnRpemUgc2NhbGUgdG8gc29ydCBkYXRhIHZhbHVlcyBpbnRvIGJ1Y2tldHMgb2YgY29sb3JcbiAgICAgICAgICAgIC8vQ29sb3JzIGJ5IEN5bnRoaWEgQnJld2VyIChjb2xvcmJyZXdlcjIub3JnKSwgOS1jbGFzcyBZbEduQnVcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLnJhbmdlKGQzLnJhbmdlKDkpLG1hcChmdW5jdGlvbihpKSB7IHJldHVybiAncScgKyBpICsgJy05Jzt9KSk7XG5cblxuICAgICAgICAgICAgLy8gQ292ZXJhZ2VTZXJ2aWNlLmdldFZhY2NpbmVEb3NlcyhwZXJpb2QsIHZhY2NpbmUpXG4gICAgICAgICAgICB2YXIgcGFyYW1zID0ge1xuICAgICAgICAgICAgICAgIGVuZFllYXI6IGVuZFllYXIsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdtYXAnXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBDb3ZlcmFnZVNlcnZpY2UuZ2V0VmFjY2luZURvc2VzQnlQZXJpb2QocGFyYW1zKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFEaXN0cmljdE1hcCA9IE1hcFN1cHBvcnRTZXJ2aWNlLmNyZWF0ZURpc3RyaWN0RGF0YU1hcChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdm0uc2FtcGxlRGlzdHJpY3REYXRhID0gZGF0YURpc3RyaWN0TWFwW09iamVjdC5rZXlzKGRhdGFEaXN0cmljdE1hcClbMF1dO1xuICAgICAgICAgICAgICAgICAgICAvLyB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIG1hcHMgdGhlIGRhdGEgb2YgdGhlIENTViBzbyBpdCBjYW4gYmUgZWFzaWx5IGFjY2Vzc2VkIGJ5XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBJRCBvZiB0aGUgZGlzdHJpY3QsIGZvciBleGFtcGxlOiBkYXRhQnlJZFsyMTk2XVxuICAgICAgICAgICAgICAgICAgICBkYXRhQnlJZCA9IGQzLm5lc3QoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmtleShmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5pZDsgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yb2xsdXAoZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGRbMF07IH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIExvYWQgZmVhdHVyZXMgZnJvbSBHZW9KU09OXG4gICAgICAgICAgICAgICAgICAgIGQzLmpzb24oJ3N0YXRpYy9hcHAvY29tcG9uZW50cy9jb3ZlcmFnZS9kYXRhL3VnX2Rpc3RyaWN0czIuZ2VvanNvbicsIGZ1bmN0aW9uIChlcnJvciwganNvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjYWxlQ2VudGVyID0gY2FsY3VsYXRlU2NhbGVDZW50ZXIoanNvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uLnNjYWxlKHNjYWxlQ2VudGVyLnNjYWxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jZW50ZXIoc2NhbGVDZW50ZXIuY2VudGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmFuc2xhdGUoW3dpZHRoIC8gMiwgaGVpZ2h0IC8gMl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBkaXN0IGluIGRhdGFEaXN0cmljdE1hcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3MgPSBkaXN0LmluZGV4T2YoXCIgXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhRGlzdHJpY3QgPSBkaXN0LnN1YnN0cmluZygwLCBwb3MpLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGpzb24uZmVhdHVyZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGpzb25EaXN0cmljdCA9IGpzb24uZmVhdHVyZXNbal0ucHJvcGVydGllcy5kaXN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YURpc3RyaWN0ID09IGpzb25EaXN0cmljdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbi5mZWF0dXJlc1tqXS5wcm9wZXJ0aWVzLmZpZWxkID0gZGF0YURpc3RyaWN0TWFwW2Rpc3RdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiNtYXBcIikuc2VsZWN0QWxsKFwiKlwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdmcgPSBkMy5zZWxlY3QoXCIjbWFwXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdmZWF0dXJlcycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzdmcuc2VsZWN0QWxsKFwicGF0aFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kYXRhKGpzb24uZmVhdHVyZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmVudGVyKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBwYXRoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBob3Zlcm9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGhvdmVyb3V0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgXCIjNzc3XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS51cGRhdGVNYXBXaXRoVmFjY2luZSh2bS5hY3RpdmVWYWNjaW5lKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5oaWRlTWFwID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLiRhcHBseSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBob3Zlcm9uID0gZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b29sdGlwJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUubGVmdCA9IGV2ZW50LnBhZ2VYICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS50b3AgPSBldmVudC5wYWdlWSArICdweCc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcImZpbGxcIiwgXCJ3aGl0ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiN0b29sdGlwXCIpLnN0eWxlKFwib3BhY2l0eVwiLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiN0b29sdGlwIC5uYW1lXCIpLnRleHQoZC5wcm9wZXJ0aWVzLmRpc3QpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QoXCIjdG9vbHRpcCAudmFsdWVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGV4dCAoZDMuZm9ybWF0KCcuMDFmJykodm0uZ2V0RGlzdHJpY3RWYWx1ZShkKSkrIHZtLmVuZHR4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgaG92ZXJvdXQgPSBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIHZtLmdldEZpbGxDb2xvcik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiN0b29sdGlwXCIpLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZtLmRyYXdMZWdlbmQgPSBmdW5jdGlvbihjb2xvckNvdW50cykge1xuICAgICAgICAgICAgICAgIC8vIFNldHVwIExlZ2VuZFxuICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiNnZW5kXCIpLnNlbGVjdEFsbChcIipcIikucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgdmFyIGxlZ2VuZFN2ZyA9IGQzLnNlbGVjdCgnI2dlbmQnKS5hcHBlbmQoJ3N2ZycpO1xuXG4gICAgICAgICAgICAgICAgbGVnZW5kU3ZnLmFwcGVuZChcImdcIilcbiAgICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJsZWdlbmRRdWFudFwiKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMjAsMjApXCIpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGxlZ2VuZCA9IGQzLmxlZ2VuZC5jb2xvcigpXG4gICAgICAgICAgICAgICAgICAubGFiZWxGb3JtYXQoZDMuZm9ybWF0KFwiLjJmXCIpKVxuICAgICAgICAgICAgICAgICAgLnNoYXBlV2lkdGgoNDApXG4gICAgICAgICAgICAgICAgICAuc2hhcGVIZWlnaHQoMjApO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL3JlZGNhdGVnb3J5XCIpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgZ2V0TGFiZWwgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgdG90YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwZXJjZW50YWdlID0gKHZhbHVlL3RvdGFsKSAqIDEwMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWUgKyAnICgnK3ZhbHVlKycpICgnICsgcGVyY2VudGFnZS50b0ZpeGVkKCkgKyAnJSknO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0b3RhbHMgPSBjb2xvckNvdW50cy5MaWdodEdyYXkgKyBjb2xvckNvdW50cy5EYXJrR3JlZW4gK1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3JDb3VudHMuWWVsbG93ICsgY29sb3JDb3VudHMuT3JhbmdlICsgY29sb3JDb3VudHMuUmVkO1xuXG4gICAgICAgICAgICAgICAgICAgIGxlZ2VuZC5jZWxscyhbMCwgMSwgMiwgMywgNF0pXG4gICAgICAgICAgICAgICAgICAgICAgICAubGFiZWxzKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRMYWJlbCgnTm8gZGF0YScsIGNvbG9yQ291bnRzLkxpZ2h0R3JheSwgdG90YWxzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRMYWJlbCgnQ0FUMScsIGNvbG9yQ291bnRzLkRhcmtHcmVlbiwgdG90YWxzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRMYWJlbCgnQ0FUMicsIGNvbG9yQ291bnRzLlllbGxvdywgdG90YWxzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRMYWJlbCgnQ0FUMycsIGNvbG9yQ291bnRzLk9yYW5nZSwgdG90YWxzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRMYWJlbCgnQ0FUNCcsIGNvbG9yQ291bnRzLlJlZCwgdG90YWxzKVxuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9kcm9wb3V0cmF0ZVwiKXtcbiAgICAgICAgICAgICAgICAgICAgbGVnZW5kLmNlbGxzKFswLCAzMCwgMTUsIDVdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmxhYmVscyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ05vIGRhdGEgKCcrY29sb3JDb3VudHMuTGlnaHRHcmF5KycpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC0xMCAmID4yMCAoJytjb2xvckNvdW50cy5SZWQrJyknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcoLTEwLTApICYgKDEwLTIwKSAoJytjb2xvckNvdW50cy5ZZWxsb3crJyknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcwLTEwICgnK2NvbG9yQ291bnRzLkRhcmtHcmVlbisnKSdcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZ2VuZC5jZWxscyg0KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmxhYmVscyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ05vIGRhdGEgKCcrY29sb3JDb3VudHMuTGlnaHRHcmF5KycpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPDUwJSAoJytjb2xvckNvdW50cy5SZWQrJyknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc1MC04OSUgKCcrY29sb3JDb3VudHMuWWVsbG93KycpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPj05MCUgKCcrY29sb3JDb3VudHMuRGFya0dyZWVuKycpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGVnZW5kLnNjYWxlKGNvbG9yKTtcblxuICAgICAgICAgICAgICAgIGxlZ2VuZFN2Zy5zZWxlY3QoXCIubGVnZW5kUXVhbnRcIilcbiAgICAgICAgICAgICAgICAgIC5jYWxsKGxlZ2VuZCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2bS5nZXRNYXBUaXRsZSA9IGZ1bmN0aW9uKHZhY2NpbmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZHVyYXRpb24gPSB2bS5hY3RpdmVSZXBvcnRUb2dnbGVbMF0gPT0gJ0EnID8gXCJBbm51YWxpemVkXCIgOiBcIk1vbnRobHlcIjtcbiAgICAgICAgICAgICAgICB2YXIgcGVyaW9kID0gdm0uZ2V0TGFzdE1hcFBlcmlvZCgpO1xuICAgICAgICAgICAgICAgIHZhciBmdWxsUGVyaW9kID0gYXBwSGVscGVycy5nZW5lcmF0ZUZ1bGxMYWJlbEZyb21QZXJpb2QocGVyaW9kWzBdK3BlcmlvZFsxXSk7XG4gICAgICAgICAgICAgICAgdmFyIGRvc2VOdW1iZXIgPSB2bS5hY3RpdmVEb3NlLnJlcGxhY2UoXCJEb3NlIFwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICB2YXIgYW50aWdlbkxhYmVsID0gdm0uYWN0aXZlRG9zZSAhPSB1bmRlZmluZWQgPyBcbiAgICAgICAgICAgICAgICAgICAgYCR7dmFjY2luZX0ke2Rvc2VOdW1iZXJ9YCA6IHZhY2NpbmU7XG5cbiAgICAgICAgICAgICAgICB2YXIgdGFiID0gXCJDb3ZlcmFnZVwiO1xuICAgICAgICAgICAgICAgIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9kcm9wb3V0cmF0ZVwiKSB0YWIgPSBcIkRyb3BvdXQgUmF0ZVwiO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL3JlZGNhdGVnb3J5XCIpIHRhYiA9IFwiUmVkIENhdGVnb3JpemF0aW9uXCI7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7ZHVyYXRpb259ICR7dGFifSBvZiAke2FudGlnZW5MYWJlbH0gZm9yICR7ZnVsbFBlcmlvZH1gO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdm0udXBkYXRlTWFwV2l0aFZhY2NpbmUgPSBmdW5jdGlvbih2YWNjaW5lKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgKHZtLmFjdGl2ZURpc3RyaWN0ICE9IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIC8vICAgICAmJiB2bS5hY3RpdmVEaXN0cmljdCAhPSBcIkFMTFwiXG4gICAgICAgICAgICAgICAgLy8gICAgICYmIHZtLmFjdGl2ZURpc3RyaWN0ICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuaGlkZU1hcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLm1hcFBsYWNlaG9sZGVyTWVzc2FnZSA9IFwiTm8gbWFwIGF2YWlsYWJsZS5cIjtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vICAgICBzaGVsbFNjb3BlLmNoaWxkLmhpZGVNYXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgICAvLyBzaGVsbFNjb3BlLmNoaWxkLmhpZGVNYXAgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmICh2YWNjaW5lID09IFwiRFBUXCIgfHwgdmFjY2luZSA9PSBcIkFMTFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmUgPSBcIlBFTlRBXCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdm0uYWN0aXZlVmFjY2luZSA9IHZhY2NpbmU7XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5tYXBUaXRsZSA9IHZtLmdldE1hcFRpdGxlKHZhY2NpbmUpO1xuXG4gICAgICAgICAgICAgICAgY29sb3JDb3VudHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFJlZDogMCxcbiAgICAgICAgICAgICAgICAgICAgWWVsbG93OiAwLFxuICAgICAgICAgICAgICAgICAgICBEYXJrR3JlZW46IDAsXG4gICAgICAgICAgICAgICAgICAgIExpZ2h0R3JheTogMCxcbiAgICAgICAgICAgICAgICAgICAgT3JhbmdlOiAwXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZhciBwYXRocyA9IGQzLnNlbGVjdChcIiNtYXAgc3ZnXCIpLnNlbGVjdEFsbChcInBhdGhcIik7XG4gICAgICAgICAgICAgICAgcGF0aHMuc3R5bGUoXCJmaWxsXCIsIHZtLmdldEZpbGxDb2xvcik7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge3ZtLmRyYXdMZWdlbmQoY29sb3JDb3VudHMpOyB9LCAxMCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2bS5nZXRGaWxsQ29sb3IgPSBmdW5jdGlvbihkKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB2bS5nZXREaXN0cmljdFZhbHVlKGQpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yVmFsdWUgPSBjb2xvcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKGNvbG9yVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbG9yVmFsdWUgaW4gY29sb3JDb3VudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yQ291bnRzW2NvbG9yVmFsdWVdICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbG9yVmFsdWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiTGlnaHRHcmF5XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdm0uZ2V0TGFzdE1hcFBlcmlvZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciB2YWNjaW5lRGF0YSA9IHZtLnNhbXBsZURpc3RyaWN0RGF0YVt2bS5hY3RpdmVWYWNjaW5lXTtcbiAgICAgICAgICAgICAgICB2YXIgcGVyaW9kTGlzdCA9IE1hcFN1cHBvcnRTZXJ2aWNlLmdldFBlcmlvZExpc3QoXG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmVEYXRhLFxuICAgICAgICAgICAgICAgICAgICBlbmRZZWFyLFxuICAgICAgICAgICAgICAgICAgICB2bS5hY3RpdmVSZXBvcnRUb2dnbGVcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJldHVybiBwZXJpb2RMaXN0W3BlcmlvZExpc3QubGVuZ3RoLTFdO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdm0uZ2V0RGlzdHJpY3RWYWx1ZSA9IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdHJpY3REYXRhID0gZC5wcm9wZXJ0aWVzLmZpZWxkO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRpc3RyaWN0RGF0YSA9PSB1bmRlZmluZWQgfHwgKCEgKHZtLmFjdGl2ZVZhY2NpbmUgaW4gZGlzdHJpY3REYXRhKSkgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yQ291bnRzWydMaWdodEdyYXknXSArPSAxO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ0xpZ2h0R3JheSc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHZhY2NpbmVEYXRhID0gZGlzdHJpY3REYXRhW3ZtLmFjdGl2ZVZhY2NpbmVdO1xuXG4gICAgICAgICAgICAgICAgdmFyIHBlcmlvZExpc3QgPSBNYXBTdXBwb3J0U2VydmljZS5nZXRQZXJpb2RMaXN0KFxuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgZW5kWWVhcixcbiAgICAgICAgICAgICAgICAgICAgdm0uYWN0aXZlUmVwb3J0VG9nZ2xlXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9jb3ZlcmFnZVwiKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1hcFN1cHBvcnRTZXJ2aWNlLmNhbGN1bGF0ZUNvdmVyYWdlUmF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhY2NpbmVEYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kTGlzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldEFjdGl2ZURvc2VOdW1iZXIoKVxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9kcm9wb3V0cmF0ZVwiKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1hcFN1cHBvcnRTZXJ2aWNlLmNhbGN1bGF0ZURyb3BvdXRSYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFjY2luZURhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJpb2RMaXN0XG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL3JlZGNhdGVnb3J5XCIpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWFwU3VwcG9ydFNlcnZpY2UuY2FsY3VsYXRlUmVkQ2F0ZWdvcnlWYWx1ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhY2NpbmVEYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kTGlzdFxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9O1xuXG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVNjYWxlQ2VudGVyKGZlYXR1cmVzKSB7XG4gICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBib3VuZGluZyBib3ggb2YgdGhlIHBhdGhzIChpbiBwaXhlbHMpIGFuZCBjYWxjdWxhdGUgYSBzY2FsZSBmYWN0b3IgYmFzZWQgb24gYm94IGFuZCBtYXAgc2l6ZVxuICAgICAgICAgICAgICAgIHZhciBiYm94X3BhdGggPSBwYXRoLmJvdW5kcyhmZWF0dXJlcyksXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlID0gMC45NSAvIE1hdGgubWF4KFxuICAgICAgICAgICAgICAgICAgICAgICAgKGJib3hfcGF0aFsxXVswXSAtIGJib3hfcGF0aFswXVswXSkgLyB3aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIChiYm94X3BhdGhbMV1bMV0gLSBiYm94X3BhdGhbMF1bMV0pIC8gaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBib3VuZGluZyBib3ggb2YgdGhlIGZlYXR1cmVzIChpbiBtYXAgdW5pdHMpIGFuZCB1c2UgaXQgdG8gY2FsY3VsYXRlIHRoZSBjZW50ZXIgb2YgdGhlIGZlYXR1cmVzLlxuICAgICAgICAgICAgICAgIHZhciBiYm94X2ZlYXR1cmUgPSBkMy5nZW8uYm91bmRzKGZlYXR1cmVzKSxcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgKGJib3hfZmVhdHVyZVsxXVswXSArIGJib3hfZmVhdHVyZVswXVswXSkgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgKGJib3hfZmVhdHVyZVsxXVsxXSArIGJib3hfZmVhdHVyZVswXVsxXSkgLyAyXTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICdzY2FsZSc6c2NhbGUsXG4gICAgICAgICAgICAgICAgICAgICdjZW50ZXInOmNlbnRlclxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAvLyBORVc6IERlZmluaW5nIGdldElkT2ZGZWF0dXJlXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRJZE9mRmVhdHVyZShmKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmLnByb3BlcnRpZXMuaWR1ZztcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgIH07XG5cblxuICAgICAgICB2bS5nZXRSZWRWYWNjaW5lRG9zZXMgPSBmdW5jdGlvbihwZXJpb2QsIHZhY2NpbmUsIGRpc3RyaWN0KSB7XG5cblxuICAgICAgICAgICAgLy9Ub2RvOiBUZW1wb3JhcmlseSBkaXNhYmxlIGZpbHRlcmluZyBieSBkaXN0cmljdCBmb3IgdGhlIHRhYmxlXG4gICAgICAgICAgICBkaXN0cmljdCA9IFwiXCJcbiAgICAgICAgICAgIHZtLmRpc3RyaWN0ID0gZGlzdHJpY3Q7XG4gICAgICAgICAgICB2bS52YWNjaW5lID0gdmFjY2luZTsvL3ZtLnNlbGVjdGVkVmFjY2luZSA/IHZtLnNlbGVjdGVkVmFjY2luZS5uYW1lIDogXCJ2YVwiO1xuXG4gICAgICAgICAgICAvLyBBc3NpZ24gZGltZW5zaW9ucyBmb3IgbWFwIGNvbnRhaW5lclxuICAgICAgICAgICAgdmFyIHdpZHRoID0gNTAwLFxuICAgICAgICAgICAgICAgIGhlaWdodCA9IDUwMDtcbiAgICAgICAgICAgIHZhciBmaWVsZCA9IFwiUmVkX2NhdGVnb3J5XCI7XG4gICAgICAgICAgICAvL2lmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9yZWRjYXRlZ29yeVwiKXtcbiAgICAgICAgICAgIC8vICAgIGZpZWxkPVwiUmVkX2NhdGVnb3J5XCJcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvL31cblxuICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5kaXN0cmljdCA9IHZtLmRpc3RyaWN0O1xuICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC52YWNjaW5lID0gICB2bS52YWNjaW5lO1xuXG4gICAgICAgICAgICB2YXIgdmFsdWVGb3JtYXQgPSBkMy5mb3JtYXQoXCIsXCIpO1xuXG4gICAgICAgICAgICAvLyBEZWZpbmUgYSBnZW9ncmFwaGljYWwgcHJvamVjdGlvblxuICAgICAgICAgICAgLy8gQWxzbywgc2V0IGluaXRpYWwgem9vbSB0byBzaG93IHRoZSBmZWF0dXJlc1xuICAgICAgICAgICAgdmFyIHByb2plY3Rpb25cdD0gZDMuZ2VvLm1lcmNhdG9yKClcbiAgICAgICAgICAgICAgICAuc2NhbGUoMSk7XG5cbiAgICAgICAgICAgIC8vIFByZXBhcmUgYSBwYXRoIG9iamVjdCBhbmQgYXBwbHkgdGhlIHByb2plY3Rpb24gdG8gaXRcbiAgICAgICAgICAgIHZhciBwYXRoID0gZDMuZ2VvLnBhdGgoKVxuICAgICAgICAgICAgICAgIC5wcm9qZWN0aW9uKHByb2plY3Rpb24pO1xuXG4gICAgICAgICAgICAvLyBXZSBwcmVwYXJlIGFuIG9iamVjdCB0byBsYXRlciBoYXZlIGVhc2llciBhY2Nlc3MgdG8gdGhlIGRhdGEuXG4gICAgICAgICAgICB2YXIgZGF0YUJ5SWQgPSBkMy5tYXAoKTtcblxuICAgICAgICAgICAgLy9EZWZpbmUgcXVhbnRpemUgc2NhbGUgdG8gc29ydCBkYXRhIHZhbHVlcyBpbnRvIGJ1Y2tldHMgb2YgY29sb3JcbiAgICAgICAgICAgIC8vQ29sb3JzIGJ5IEN5bnRoaWEgQnJld2VyIChjb2xvcmJyZXdlcjIub3JnKSwgOS1jbGFzcyBZbEduQnVcblxuICAgICAgICAgICAgdmFyIGNvbG9yID0gZDMuc2NhbGUucXVhbnRpemUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy5yYW5nZShkMy5yYW5nZSg5KSxtYXAoZnVuY3Rpb24oaSkgeyByZXR1cm4gJ3EnICsgaSArICctOSc7fSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJhbmdlKFsgICAgXCIjMDA4MDAwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIjRkZGRjAwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIjRkZBNTAwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIjRkYwMDAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgQ292ZXJhZ2VTZXJ2aWNlLmdldFJlZFZhY2NpbmVEb3NlcyhwZXJpb2QsIHZhY2NpbmUpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9TZXQgaW5wdXQgZG9tYWluIGZvciBjb2xvciBzY2FsZVxuICAgICAgICAgICAgICAgICAgICBjb2xvci5kb21haW4oW1xuICAgICAgICAgICAgICAgICAgICAgICAgZDMubWluKGRhdGEsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuICtkW2ZpZWxkXTsgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBkMy5tYXgoZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gK2RbZmllbGRdOyB9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIG1hcHMgdGhlIGRhdGEgb2YgdGhlIENTViBzbyBpdCBjYW4gYmUgZWFzaWx5IGFjY2Vzc2VkIGJ5XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBJRCBvZiB0aGUgZGlzdHJpY3QsIGZvciBleGFtcGxlOiBkYXRhQnlJZFsyMTk2XVxuICAgICAgICAgICAgICAgICAgICBkYXRhQnlJZCA9IGQzLm5lc3QoKVxuICAgICAgICAgICAgICAgICAgICAgIC5rZXkoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDsgfSlcbiAgICAgICAgICAgICAgICAgICAgICAucm9sbHVwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRbMF07IH0pXG4gICAgICAgICAgICAgICAgICAgICAgLm1hcChkYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgbGVnZW5kID0gZDMuc2VsZWN0KCcjbGVnZW5kJylcblxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xpc3QtaW5saW5lJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleXMgPSBsZWdlbmQuc2VsZWN0QWxsKCdsaS5rZXknKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRhdGEoY29sb3IucmFuZ2UoKSk7XG5cbiAgICAgICAgICAgICAgICAgICAga2V5cy5lbnRlcigpLmFwcGVuZCgnbGknKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2tleScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoJ2JvcmRlci10b3AtY29sb3InLCBTdHJpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGV4dChmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZD09XCIjMDA4MDAwXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnQ0FUMSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZD09XCIjRkZGRjAwXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ0NBVDInXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGQ9PVwiI0ZGQTUwMFwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdDQVQzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZD09XCIjRkYwMDAwXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ0NBVDQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gTG9hZCBmZWF0dXJlcyBmcm9tIEdlb0pTT05cbiAgICAgICAgICAgICAgICAgICAgZDMuanNvbignc3RhdGljL2FwcC9jb21wb25lbnRzL2NvdmVyYWdlL2RhdGEvdWdfZGlzdHJpY3RzMi5nZW9qc29uJywgZnVuY3Rpb24oZXJyb3IsIGpzb24pIHtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIHNjYWxlIGFuZCBjZW50ZXIgcGFyYW1ldGVycyBmcm9tIHRoZSBmZWF0dXJlcy5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzY2FsZUNlbnRlciA9IGNhbGN1bGF0ZVNjYWxlQ2VudGVyKGpzb24pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBcHBseSBzY2FsZSwgY2VudGVyIGFuZCB0cmFuc2xhdGUgcGFyYW1ldGVycy5cbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb24uc2NhbGUoc2NhbGVDZW50ZXIuc2NhbGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jZW50ZXIoc2NhbGVDZW50ZXIuY2VudGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJhbnNsYXRlKFt3aWR0aC8yLCBoZWlnaHQvMl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNZXJnZSB0aGUgY292ZXJhZ2UgZGF0YSBhbWQgR2VvSlNPTiBpbnRvIGEgc2luZ2xlIGFycmF5XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBbHNvIGxvb3AgdGhyb3VnaCBvbmNlIGZvciBlYWNoIGNvdmVyYWdlIHNjb3JlIGRhdGEgdmFsdWVcblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgZGF0YS5sZW5ndGggOyBpKysgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHcmFiIGRpc3RyaWN0IG5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGlzdCA9IGRhdGFbaV0uZGlzdHJpY3RfX25hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBvcyA9IGRpc3QuaW5kZXhPZihcIiBcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFEaXN0cmljdCA9IGRpc3Quc3Vic3RyaW5nKDAsIHBvcykudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3ZhciBkYXRhRGlzdHJpY3QgPSBkYXRhW2ldLmRpc3RyaWN0O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9HcmFiIGRhdGEgdmFsdWUsIGFuZCBjb252ZXJ0IGZyb20gc3RyaW5nIHRvIGZsb2F0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFWYWx1ZSA9ICtkYXRhW2ldW2ZpZWxkXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vRmluZCB0aGUgY29ycmVzcG9uZGluZyBkaXN0cmljdCBpbnNpZGUgR2VvSlNPTlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGo9MDsgaiA8IGpzb24uZmVhdHVyZXMubGVuZ3RoIDsgaisrICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIHRoZSBkaXN0cmljdCByZWZlcmVuY2UgaW4ganNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIganNvbkRpc3RyaWN0ID0ganNvbi5mZWF0dXJlc1tqXS5wcm9wZXJ0aWVzLmRpc3Q7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFEaXN0cmljdCA9PSBqc29uRGlzdHJpY3QpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9Db3B5IHRoZSBkYXRhIHZhbHVlIGludG8gdGhlIEdlb0pTT05cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uZmVhdHVyZXNbal0ucHJvcGVydGllcy5maWVsZCA9IGRhdGFWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9TdG9wIGxvb2tpbmcgdGhyb3VnaCBKU09OXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBTVkcgaW5zaWRlIG1hcCBjb250YWluZXIgYW5kIGFzc2lnbiBkaW1lbnNpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3N2Zy5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KFwiI3JlZFwiKS5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN2ZyA9IGQzLnNlbGVjdChcIiNyZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWRkIGEgPGc+IGVsZW1lbnQgdG8gdGhlIFNWRyBlbGVtZW50IGFuZCBnaXZlIGEgY2xhc3MgdG8gc3R5bGUgbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdmZWF0dXJlcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBCaW5kIGRhdGEgYW5kIGNyZWF0ZSBvbmUgcGF0aCBwZXIgR2VvSlNPTiBmZWF0dXJlXG4gICAgICAgICAgICAgICAgICAgICAgICBzdmcuc2VsZWN0QWxsKFwicGF0aFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kYXRhKGpzb24uZmVhdHVyZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmVudGVyKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBwYXRoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBob3Zlcm9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGhvdmVyb3V0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgXCIjNzc3XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGRhdGEgdmFsdWVcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBkLnByb3BlcnRpZXMuZmllbGQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB2YWx1ZSBleGlzdHMgLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29sb3IodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdmFsdWUgaXMgdW5kZWZpbmVzIC4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiI2NjY1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cblxuXG4gICAgICAgICAgICAgICAgICAgIH0pOyAvLyBFbmQgZDMuanNvblxuXG4gICAgICAgICAgICAgICAgICAgIC8vIExvZ2ljIHRvIGhhbmRsZSBob3ZlciBldmVudCB3aGVuIGl0cyBmaXJlZHVwXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaG92ZXJvbiA9IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rvb2x0aXAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUubGVmdCA9IGV2ZW50LnBhZ2VYICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUudG9wID0gZXZlbnQucGFnZVkgKyAncHgnO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0ZpbGwgeWVsbG93IHRvIGhpZ2hsaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwid2hpdGVcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1Nob3cgdGhlIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QoXCIjdG9vbHRpcFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9Qb3B1bGF0ZSBuYW1lIGluIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QoXCIjdG9vbHRpcCAubmFtZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGV4dChkLnByb3BlcnRpZXMuZGlzdCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1BvcHVsYXRlIHZhbHVlIGluIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWQucHJvcGVydGllcy5maWVsZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiN0b29sdGlwIC52YWx1ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGV4dChcIk5vIERhdGFcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiN0b29sdGlwIC52YWx1ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRleHQoJ0NBVCcgKyAodmFsdWVGb3JtYXQoZC5wcm9wZXJ0aWVzLmZpZWxkKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBob3Zlcm91dCA9IGZ1bmN0aW9uKGQpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vUmVzdG9yZSBvcmlnaW5hbCBjaG9yb3BsZXRoIGZpbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBkLnByb3BlcnRpZXMuZmllbGQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29sb3IodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCIjY2NjXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9IaWRlIHRoZSB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KFwiI3Rvb2x0aXBcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YUFsbGRvc2VzID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc0Rvc2VzID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFBbGxkb3NlcyxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBjYWxjdWxhdGVTY2FsZUNlbnRlcihmZWF0dXJlcykge1xuICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBwYXRocyAoaW4gcGl4ZWxzKSBhbmQgY2FsY3VsYXRlIGEgc2NhbGUgZmFjdG9yIGJhc2VkIG9uIGJveCBhbmQgbWFwIHNpemVcbiAgICAgICAgICAgICAgICB2YXIgYmJveF9wYXRoID0gcGF0aC5ib3VuZHMoZmVhdHVyZXMpLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZSA9IDAuOTUgLyBNYXRoLm1heChcbiAgICAgICAgICAgICAgICAgICAgICAgIChiYm94X3BhdGhbMV1bMF0gLSBiYm94X3BhdGhbMF1bMF0pIC8gd2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAoYmJveF9wYXRoWzFdWzFdIC0gYmJveF9wYXRoWzBdWzFdKSAvIGhlaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBmZWF0dXJlcyAoaW4gbWFwIHVuaXRzKSBhbmQgdXNlIGl0IHRvIGNhbGN1bGF0ZSB0aGUgY2VudGVyIG9mIHRoZSBmZWF0dXJlcy5cbiAgICAgICAgICAgICAgICB2YXIgYmJveF9mZWF0dXJlID0gZDMuZ2VvLmJvdW5kcyhmZWF0dXJlcyksXG4gICAgICAgICAgICAgICAgICAgIGNlbnRlciA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIChiYm94X2ZlYXR1cmVbMV1bMF0gKyBiYm94X2ZlYXR1cmVbMF1bMF0pIC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgIChiYm94X2ZlYXR1cmVbMV1bMV0gKyBiYm94X2ZlYXR1cmVbMF1bMV0pIC8gMl07XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAnc2NhbGUnOnNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAnY2VudGVyJzpjZW50ZXJcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgLy8gTkVXOiBEZWZpbmluZyBnZXRJZE9mRmVhdHVyZVxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0SWRPZkZlYXR1cmUoZikge1xuICAgICAgICAgICAgICByZXR1cm4gZi5wcm9wZXJ0aWVzLmlkdWc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cblxuICAgICAgICB2bS5nZXRWYWNjaW5lRG9zZXNCeURpc3RyaWN0ID0gZnVuY3Rpb24ocGVyaW9kLCBkaXN0cmljdCwgdmFjY2luZSkge1xuXG5cbiAgICAgICAgICAgIENvdmVyYWdlU2VydmljZS5nZXRWYWNjaW5lRG9zZXNCeURpc3RyaWN0KHBlcmlvZCwgZGlzdHJpY3QsIHZhY2NpbmUpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5kcm9wZWRvdXQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZih2bS5kYXRhLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5kcm9wZWRvdXQgPSB2bS5kYXRhWzBdLmRyb3Bfb3V0X3JhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnVuZGVyaW1tdW5pemVkID0gdm0uZGF0YVswXS51bmRlcl9pbW11bml6ZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBBY2Nlc3MgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHZtLmRhdGFbMF0uYWNjZXNzID49IDkwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmFjY2VzcyA9IFwiR29vZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuYWNjZXNzID0gXCJQb29yXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFV0aWxpemF0aW9uICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzaGVsbFNjb3BlLmNoaWxkLmRyb3BlZG91dCA8PSAxMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC51dGlsaXphdGlvbiA9IFwiR29vZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudXRpbGl6YXRpb24gPSBcIlBvb3JcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLyogUmVkIENhdGVnb3JpemF0aW9uKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCh2bS5kYXRhWzBdLmFjY2VzcyA+PSA5MCkgJiYgKHZtLmRhdGFbMF0uZHJvcF9vdXRfcmF0ZSA8PTEwKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5yZWRjYXRlZ29yeSA9IFwiQ0FUMVwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKHZtLmRhdGFbMF0uYWNjZXNzID49IDkwICYmIHZtLmRhdGFbMF0uZHJvcF9vdXRfcmF0ZSA+IDEwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLnJlZGNhdGVnb3J5ID0gXCJDQVQyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYodm0uZGF0YVswXS5hY2Nlc3MgPCA5MCAmJiB2bS5kYXRhWzBdLmRyb3Bfb3V0X3JhdGUgPD0gMTApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUucmVkY2F0ZWdvcnkgPSBcIkNBVDNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZih2bS5kYXRhWzBdLmFjY2VzcyA8IDkwICYmIHZtLmRhdGFbMF0uZHJvcF9vdXRfcmF0ZSA+IDEwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLnJlZGNhdGVnb3J5ID0gXCJDQVQ0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uZ2V0QWN0aXZlRG9zZU51bWJlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHZtLmFjdGl2ZURvc2UgIT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJldHVybiBOdW1iZXIodm0uYWN0aXZlRG9zZS5zdWJzdHIodm0uYWN0aXZlRG9zZS5sZW5ndGgtMSwgMSkpO1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uY29tcHV0ZVJhdGUgPSBmdW5jdGlvbihkb3NlcywgcGxhbm5lZCkge1xuICAgICAgICAgICAgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL2NvdmVyYWdlXCIpe1xuICAgICAgICAgICAgICAgIHZhciBhY3RpdmVEb3NlTnVtYmVyID0gdm0uZ2V0QWN0aXZlRG9zZU51bWJlcigpO1xuICAgICAgICAgICAgICAgIHZhciBkb3NlVmFsdWUgPSBkb3Nlcy5sYXN0O1xuXG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZURvc2VOdW1iZXIgPT0gMSkgZG9zZVZhbHVlID0gZG9zZXMuZmlyc3Q7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYWN0aXZlRG9zZU51bWJlciA9PSAyKSBkb3NlVmFsdWUgPSBkb3Nlcy5zZWNvbmQ7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYWN0aXZlRG9zZU51bWJlciA9PSAzKSBkb3NlVmFsdWUgPSBkb3Nlcy50aGlyZDtcblxuICAgICAgICAgICAgICAgIHJldHVybiAoZG9zZVZhbHVlIC8gcGxhbm5lZCkgKiAxMDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL2Ryb3BvdXRyYXRlXCIpe1xuICAgICAgICAgICAgICAgIHJldHVybiAoKGRvc2VzLmZpcnN0IC0gZG9zZXMubGFzdCkgLyBkb3Nlcy5maXJzdCkgKiAxMDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL3JlZGNhdGVnb3J5XCIpe1xuICAgICAgICAgICAgICAgIHZhciBhY2Nlc3MgPSAoZG9zZXMuZmlyc3QvcGxhbm5lZCkgKiAxMDA7XG4gICAgICAgICAgICAgICAgdmFyIGRyb3BvdXRSYXRlID0gKChkb3Nlcy5maXJzdCAtIGRvc2VzLmxhc3QpIC8gZG9zZXMuZmlyc3QpICogMTAwO1xuXG4gICAgICAgICAgICAgICAgaWYgKGFjY2VzcyA+PSA5MCAmJiBkcm9wb3V0UmF0ZSA+PSAwICYmIGRyb3BvdXRSYXRlIDw9IDEwKSByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChhY2Nlc3MgPj0gOTAgJiYgKGRyb3BvdXRSYXRlIDwgMCB8fCBkcm9wb3V0UmF0ZSA+IDEwKSkgcmV0dXJuIDI7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYWNjZXNzIDwgOTAgJiYgZHJvcG91dFJhdGUgPj0gMCAmJiBkcm9wb3V0UmF0ZSA8PSAxMCkgcmV0dXJuIDM7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYWNjZXNzIDwgOTAgJiYgKGRyb3BvdXRSYXRlIDwgMCB8fCBkcm9wb3V0UmF0ZSA+IDEwKSkgcmV0dXJuIDQ7XG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB2bS5nZXRDaGFydERhdGEgPSBmdW5jdGlvbihwYXJhbXMsIGRhdGEsIHJlcG9ydFllYXIsIGN1bXVsYXRpdmUpIHtcblxuICAgICAgICAgICAgdmFyIHBlcmlvZFZhbHVlcyA9IHt9O1xuICAgICAgICAgICAgdmFyIHJlZENhdGVnb3J5VmFsdWVzID0ge307XG4gICAgICAgICAgICB2YXIgdG90YWxzID0ge307XG4gICAgICAgICAgICB2YXIgcmVkQ2F0ZWdvcnlUb3RhbHMgPSB7fTtcbiAgICAgICAgICAgIHZhciByYXRlO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGVyaW9kID0gZGF0YVtpXS5wZXJpb2Q7XG4gICAgICAgICAgICAgICAgdmFyIGxhc3RfZG9zZSA9IGRhdGFbaV0udG90YWxfbGFzdF9kb3NlO1xuICAgICAgICAgICAgICAgIHZhciBmaXJzdF9kb3NlID0gZGF0YVtpXS50b3RhbF9maXJzdF9kb3NlO1xuICAgICAgICAgICAgICAgIHZhciBzZWNvbmRfZG9zZSA9IGRhdGFbaV0udG90YWxfc2Vjb25kX2Rvc2U7XG4gICAgICAgICAgICAgICAgdmFyIHRoaXJkX2Rvc2UgPSBkYXRhW2ldLnRvdGFsX3RoaXJkX2Rvc2U7XG4gICAgICAgICAgICAgICAgdmFyIHBsYW5uZWQgPSBkYXRhW2ldLnRvdGFsX3BsYW5uZWQ7XG4gICAgICAgICAgICAgICAgdmFyIHZhY2NpbmUgPSBkYXRhW2ldLnZhY2NpbmVfX25hbWU7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RyaWN0ID0gZGF0YVtpXS5kaXN0cmljdF9fbmFtZTtcblxuICAgICAgICAgICAgICAgIHZhciBkYXRhTW9udGggPSBhcHBIZWxwZXJzLmdldE1vbnRoRnJvbVBlcmlvZChwZXJpb2QsIHJlcG9ydFllYXIpO1xuICAgICAgICAgICAgICAgIHZhciBkYXRhWWVhciA9IGFwcEhlbHBlcnMuZ2V0WWVhckZyb21QZXJpb2QocGVyaW9kLCByZXBvcnRZZWFyKTtcblxuICAgICAgICAgICAgICAgIHZhciB5ZWFyTGFiZWwgPSBhcHBIZWxwZXJzLmdldFllYXJMYWJlbEZyb21QZXJpb2QocGVyaW9kLCByZXBvcnRZZWFyKTtcbiAgICAgICAgICAgICAgICB2YXIgbW9udGhJbmRleCA9IGFwcEhlbHBlcnMuZ2V0TW9udGhJbmRleEZyb21QZXJpb2QocGVyaW9kLCByZXBvcnRZZWFyKTtcblxuICAgICAgICAgICAgICAgIC8qIFRoZSB2aWV3IHJldHVybnMgZXh0cmEgZGF0YSB0byBjYXRlciBmb3IgdGhlIGZpbmFuY2lhbCB5ZWFyXG4gICAgICAgICAgICAgICAgU2luY2UgaXRzIGlnbm9yYW50IG9mIHRoZSBwZXJpb2RzLCB3ZSBkbyB0aGUgZmlsdGVycyBvdXJzZWx2ZXNcbiAgICAgICAgICAgICAgICBEaWRuJ3Qgd2FudCB0byBjcmVhdGUgYSBuZXcgQVBJIGNhbGwgZm9yIGEgY2hhbmdlIGluIHJlcG9ydCB5ZWFyXG4gICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpZiAoKHJlcG9ydFllYXIgPT0gXCJDWVwiKSAmJiAoZGF0YVllYXIgPiBwYXJhbXMuZW5kWWVhcikpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIC8vIGlmICgocmVwb3J0WWVhciA9PSBcIkZZXCIpICYmIChkYXRhWWVhciA9PSBwYXJhbXMuZW5kWWVhcikgJiYgKGRhdGFNb250aCA+IDYpKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBpZiAoKHJlcG9ydFllYXIgPT0gXCJGWVwiKSAmJiAoZGF0YVllYXIgPT0gcGFyYW1zLnN0YXJ0WWVhcikgJiYgKGRhdGFNb250aCA8PSA2KSkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICBpZiAoISAoeWVhckxhYmVsIGluIHBlcmlvZFZhbHVlcykpIHtcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kVmFsdWVzW3llYXJMYWJlbF0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgcmVkQ2F0ZWdvcnlWYWx1ZXNbeWVhckxhYmVsXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICB0b3RhbHNbeWVhckxhYmVsXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICByZWRDYXRlZ29yeVRvdGFsc1t5ZWFyTGFiZWxdID0ge307XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCEgKHZhY2NpbmUgaW4gcGVyaW9kVmFsdWVzW3llYXJMYWJlbF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZFZhbHVlc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdID0gW107XG4gICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgdG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0gPSB7Zmlyc3RfZG9zZTogMCwgc2Vjb25kX2Rvc2U6MCwgdGhpcmRfZG9zZTowLCBsYXN0X2Rvc2U6IDAsIHBsYW5uZWQ6IDB9O1xuICAgICAgICAgICAgICAgICAgICByZWRDYXRlZ29yeVRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdID0ge307XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGRpc3RyaWN0ICE9IHVuZGVmaW5lZCAmJiAhKGRpc3RyaWN0IGluIHJlZENhdGVnb3J5VG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV1bZGlzdHJpY3RdID0ge2ZpcnN0X2Rvc2U6IDAsIGxhc3RfZG9zZTogMCwgcGxhbm5lZDogMH07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGN1bXVsYXRpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZtLnBhdGggPT0gJy9jb3ZlcmFnZS9yZWRjYXRlZ29yeScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb21iaW5lZEZpcnN0RG9zZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVkQ2F0ZWdvcnlUb3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXVtkaXN0cmljdF0uZmlyc3RfZG9zZSArIGZpcnN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29tYmluZWRMYXN0RG9zZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVkQ2F0ZWdvcnlUb3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXVtkaXN0cmljdF0ubGFzdF9kb3NlICsgbGFzdF9kb3NlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbWJpbmVkUGxhbm5lZCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVkQ2F0ZWdvcnlUb3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXVtkaXN0cmljdF0ucGxhbm5lZCArIHBsYW5uZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV1bZGlzdHJpY3RdLmZpcnN0X2Rvc2UgPSBjb21iaW5lZEZpcnN0RG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV1bZGlzdHJpY3RdLmxhc3RfZG9zZSA9IGNvbWJpbmVkTGFzdERvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWRDYXRlZ29yeVRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdW2Rpc3RyaWN0XS5wbGFubmVkID0gY29tYmluZWRQbGFubmVkO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbWJpbmVkRmlyc3REb3NlID0gdG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0uZmlyc3RfZG9zZSArIGZpcnN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29tYmluZWRMYXN0RG9zZSA9IHRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLmxhc3RfZG9zZSArIGxhc3RfZG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb21iaW5lZFNlY29uZERvc2UgPSB0b3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXS5zZWNvbmRfZG9zZSArIHNlY29uZF9kb3NlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbWJpbmVkVGhpcmREb3NlID0gdG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0udGhpcmRfZG9zZSArIHRoaXJkX2Rvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29tYmluZWRQbGFubmVkID0gdG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0ucGxhbm5lZCArIHBsYW5uZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLmZpcnN0X2Rvc2UgPSBjb21iaW5lZEZpcnN0RG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLmxhc3RfZG9zZSA9IGNvbWJpbmVkTGFzdERvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXS5zZWNvbmRfZG9zZSA9IGNvbWJpbmVkU2Vjb25kRG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLnRoaXJkX2Rvc2UgPSBjb21iaW5lZFRoaXJkRG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLnBsYW5uZWQgPSBjb21iaW5lZFBsYW5uZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByYXRlID0gdm0uY29tcHV0ZVJhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3Q6IGNvbWJpbmVkRmlyc3REb3NlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kOiBjb21iaW5lZFNlY29uZERvc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlyZDogY29tYmluZWRUaGlyZERvc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0OiBjb21iaW5lZExhc3REb3NlXG4gICAgICAgICAgICAgICAgICAgIH0sIGNvbWJpbmVkUGxhbm5lZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmF0ZSA9IHZtLmNvbXB1dGVSYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0OmZpcnN0X2Rvc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWNvbmQ6c2Vjb25kX2Rvc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlyZDogdGhpcmRfZG9zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3Q6IGxhc3RfZG9zZX1cbiAgICAgICAgICAgICAgICAgICAgLCBwbGFubmVkKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodm0ucGF0aCA9PSAnL2NvdmVyYWdlL3JlZGNhdGVnb3J5Jykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2F0ZWdvcnkgPSByYXRlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoISAobW9udGhJbmRleCBpbiByZWRDYXRlZ29yeVZhbHVlc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV1bbW9udGhJbmRleF0gPSB7fTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoISAoY2F0ZWdvcnkgaW4gcmVkQ2F0ZWdvcnlWYWx1ZXNbeWVhckxhYmVsXVt2YWNjaW5lXVttb250aEluZGV4XSkpXG4gICAgICAgICAgICAgICAgICAgICAgICByZWRDYXRlZ29yeVZhbHVlc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdW21vbnRoSW5kZXhdW2NhdGVnb3J5XSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV1bbW9udGhJbmRleF1bY2F0ZWdvcnldLnB1c2goZGlzdHJpY3QpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZFZhbHVlc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLnB1c2goe3g6IG1vbnRoSW5kZXgsIHk6IGQzLmZvcm1hdCgnLjAxZicpKHJhdGUpfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY2hhcnREYXRhID0gW107XG5cbiAgICAgICAgICAgIGlmICh2bS5wYXRoID09ICcvY292ZXJhZ2UvcmVkY2F0ZWdvcnknKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdldFJlZENhdGVnb3J5VmFsdWVzID0gZnVuY3Rpb24obW9udGhJbmRleCwgY2F0RGlzdHJpY3RzLCB0b3RhbERpc3RyaWN0cykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IE51bWJlcihtb250aEluZGV4KSwgeTogZDMuZm9ybWF0KCcuMDFmJykoKGNhdERpc3RyaWN0cyAvIHRvdGFsRGlzdHJpY3RzKSAqIDEwMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB4OiBOdW1iZXIobW9udGhJbmRleCksIHk6IGQzLmZvcm1hdCgnLjAxZicpKGNhdERpc3RyaWN0cylcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdmFyIGdldFRvdGFsUmVkQ2F0ZWdvcnlEaXN0cmljdHMgPSBmdW5jdGlvbihjYXQsIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhdCBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YVtjYXRdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdmFyIGNhdGVnb3J5VmFsdWVzID0ge1xuICAgICAgICAgICAgICAgICAgICAxOiBbXSwgMjogW10sIDM6IFtdLCA0OiBbXVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciB5ZWFyTGFiZWwgaW4gcmVkQ2F0ZWdvcnlWYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgdmFjY2luZSBpbiByZWRDYXRlZ29yeVZhbHVlc1t5ZWFyTGFiZWxdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBtb250aEluZGV4IGluIHJlZENhdGVnb3J5VmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV0pIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWNjaW5lRGF0YSA9IHJlZENhdGVnb3J5VmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV1bbW9udGhJbmRleF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh5ZWFyTGFiZWwgKyBcIi1cIiArIG1vbnRoSW5kZXggKyBcIi1cIiArIHZhY2NpbmUgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh2YWNjaW5lRGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2F0MURpc3RyaWN0cyA9IGdldFRvdGFsUmVkQ2F0ZWdvcnlEaXN0cmljdHMoMSwgdmFjY2luZURhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjYXQyRGlzdHJpY3RzID0gZ2V0VG90YWxSZWRDYXRlZ29yeURpc3RyaWN0cygyLCB2YWNjaW5lRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNhdDNEaXN0cmljdHMgPSBnZXRUb3RhbFJlZENhdGVnb3J5RGlzdHJpY3RzKDMsIHZhY2NpbmVEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2F0NERpc3RyaWN0cyA9IGdldFRvdGFsUmVkQ2F0ZWdvcnlEaXN0cmljdHMoNCwgdmFjY2luZURhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRvdGFsRGlzdHJpY3RzID0gY2F0MURpc3RyaWN0cyArIGNhdDJEaXN0cmljdHMgKyBjYXQzRGlzdHJpY3RzICsgY2F0NERpc3RyaWN0cztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5VmFsdWVzWzFdLnB1c2goZ2V0UmVkQ2F0ZWdvcnlWYWx1ZXMobW9udGhJbmRleCwgY2F0MURpc3RyaWN0cywgdG90YWxEaXN0cmljdHMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeVZhbHVlc1syXS5wdXNoKGdldFJlZENhdGVnb3J5VmFsdWVzKG1vbnRoSW5kZXgsIGNhdDJEaXN0cmljdHMsIHRvdGFsRGlzdHJpY3RzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlWYWx1ZXNbM10ucHVzaChnZXRSZWRDYXRlZ29yeVZhbHVlcyhtb250aEluZGV4LCBjYXQzRGlzdHJpY3RzLCB0b3RhbERpc3RyaWN0cykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5VmFsdWVzWzRdLnB1c2goZ2V0UmVkQ2F0ZWdvcnlWYWx1ZXMobW9udGhJbmRleCwgY2F0NERpc3RyaWN0cywgdG90YWxEaXN0cmljdHMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNoYXJ0RGF0YS5wdXNoKHtrZXk6ICdDQVQxJywgY29sb3I6ICdEYXJrR3JlZW4nLCB2YWx1ZXM6IHZtLmZpbGxNaXNzaW5nVmFsdWVzKGNhdGVnb3J5VmFsdWVzWzFdKX0pO1xuICAgICAgICAgICAgICAgIGNoYXJ0RGF0YS5wdXNoKHtrZXk6ICdDQVQyJywgY29sb3I6ICdZZWxsb3cnLCB2YWx1ZXM6IHZtLmZpbGxNaXNzaW5nVmFsdWVzKGNhdGVnb3J5VmFsdWVzWzJdKX0pO1xuICAgICAgICAgICAgICAgIGNoYXJ0RGF0YS5wdXNoKHtrZXk6ICdDQVQzJywgY29sb3I6ICdPcmFuZ2UnLCB2YWx1ZXM6IHZtLmZpbGxNaXNzaW5nVmFsdWVzKGNhdGVnb3J5VmFsdWVzWzNdKX0pO1xuICAgICAgICAgICAgICAgIGNoYXJ0RGF0YS5wdXNoKHtrZXk6ICdDQVQ0JywgY29sb3I6ICdSZWQnLCB2YWx1ZXM6IHZtLmZpbGxNaXNzaW5nVmFsdWVzKGNhdGVnb3J5VmFsdWVzWzRdKX0pO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHllYXJMYWJlbCBpbiBwZXJpb2RWYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgdmFjY2luZSBpbiBwZXJpb2RWYWx1ZXNbeWVhckxhYmVsXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IHZhY2NpbmU7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBSZW1vdmUgYW50aWdlbnMgdGhhdCBsYWNrIHZhbHVlIGZvciBwYXJ0aWN1bGFyIGRvc2Ugb24gQ292ZXJhZ2UgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2bS5wYXRoID09ICcvY292ZXJhZ2UvY292ZXJhZ2UnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZtLmFjdGl2ZURvc2UgPT0gXCJEb3NlIDNcIiAmJiAkLmluQXJyYXkodmFjY2luZSwgWydQRU5UQScsICdQQ1YnLCAnT1BWJ10pID09IC0xKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh2bS5hY3RpdmVEb3NlID09IFwiRG9zZSAyXCIgJiYgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5pbkFycmF5KHZhY2NpbmUsIFsnUEVOVEEnLCAnUENWJywgJ09QVicsICdIUFYnLCAnVFQnXSkgPT0gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVzID0gdm0uZmlsbE1pc3NpbmdWYWx1ZXMocGVyaW9kVmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnREYXRhLnB1c2goe2tleToga2V5LCB2YWx1ZXM6IHZhbHVlc30pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2hhcnREYXRhO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmZpbGxNaXNzaW5nVmFsdWVzID0gZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICAgICAgICB2YXIgbW9udGhJbmRleGVzID0gXy5yYW5nZSgxLCAxMyk7XG4gICAgICAgICAgICB2YXIgZXhpc3RpbmdJbmRleGVzID0gdmFsdWVzLm1hcChmdW5jdGlvbihpdGVtKSB7IHJldHVybiBpdGVtLng7IH0pO1xuICAgICAgICAgICAgdmFyIG5ld0luZGV4ZXMgPSBtb250aEluZGV4ZXMuZmlsdGVyKGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXhpc3RpbmdJbmRleGVzLmluZGV4T2YodikgPCAwO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBuZXdJbmRleGVzLmZvckVhY2goZnVuY3Rpb24obW9udGhJbmRleCkge1xuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHt4OiBtb250aEluZGV4LCB5OiAwfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZXMuc29ydChmdW5jdGlvbihhLCBiKSB7cmV0dXJuIGEueCAtIGIueH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmdldENoYXJ0T3B0aW9ucyA9IGZ1bmN0aW9uKHJlcG9ydFllYXIpIHtcbiAgICAgICAgICAgIHZhciB3aWR0aCA9ICh2bS5hY3RpdmVEaXN0cmljdCA9PSAnTmF0aW9uYWwnKSA/IDQ1MCA6IDkwMDtcbiAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdsaW5lQ2hhcnQnLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDQ1MCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgICAgICAgICB1c2VJbnRlcmFjdGl2ZUd1aWRlbGluZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJhY3RpdmVMYXllcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3Jhdml0eTogJ3MnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHg6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZC54OyB9LFxuICAgICAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbihkKXsgcmV0dXJuIGQueTsgfSxcbiAgICAgICAgICAgICAgICAgICAgZm9yY2VZOiBbLTEwLDE1MF0sXG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZUNoYW5nZTogZnVuY3Rpb24oZSl7IGNvbnNvbGUubG9nKFwic3RhdGVDaGFuZ2VcIik7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VTdGF0ZTogZnVuY3Rpb24oZSl7IGNvbnNvbGUubG9nKFwiY2hhbmdlU3RhdGVcIik7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwU2hvdzogZnVuY3Rpb24oZSl7IGNvbnNvbGUubG9nKFwidG9vbHRpcFNob3dcIik7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwSGlkZTogZnVuY3Rpb24oZSl7IGNvbnNvbGUubG9nKFwidG9vbHRpcEhpZGVcIik7IH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgeEF4aXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNMYWJlbDogJ01vbnRocycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBwSGVscGVycy5nZXRNb250aEZyb21OdW1iZXIoZCwgcmVwb3J0WWVhcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHlBeGlzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWw6ICdQZXJjZW50YWdlICglKSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGNoYXJ0KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCIhISEgbGluZUNoYXJ0IGNhbGxiYWNrICEhIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uZ2V0Q2hhcnRUaXRsZSA9IGZ1bmN0aW9uKHZhY2NpbmUpIHtcbiAgICAgICAgICAgIHZhciBkdXJhdGlvbiA9IHZtLmFjdGl2ZVJlcG9ydFRvZ2dsZVswXSA9PSAnQScgPyBcIkFubnVhbGl6ZWRcIiA6IFwiTW9udGhseVwiO1xuICAgICAgICAgICAgdmFyIHZhY2NpbmVOYW1lID0gKHZhY2NpbmUgPT0gXCJBTExcIikgPyBcImFudGlnZW5zXCIgOiB2YWNjaW5lO1xuICAgICAgICAgICAgdmFyIGRvc2VOdW1iZXIgPSB2bS5hY3RpdmVEb3NlLnJlcGxhY2UoXCJEb3NlIFwiLCBcIlwiKTtcbiAgICAgICAgICAgIGlmICh2YWNjaW5lID09IFwiQUxMXCIpIGRvc2VOdW1iZXIgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIGFudGlnZW5MYWJlbCA9IHZtLmFjdGl2ZURvc2UgIT0gdW5kZWZpbmVkID8gXG4gICAgICAgICAgICAgICAgYCR7dmFjY2luZU5hbWV9JHtkb3NlTnVtYmVyfWAgOiB2YWNjaW5lTmFtZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHllYXJUeXBlID0gdm0uYWN0aXZlUmVwb3J0WWVhciA9PSAnQ1knID8gJ0NhbGVuZGFyIFllYXInIDogJ0ZpbmFuY2lhbCB5ZWFyJztcblxuICAgICAgICAgICAgdmFyIHRhYiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9kcm9wb3V0cmF0ZVwiKVxuICAgICAgICAgICAgICAgIHRhYiA9IFwiRHJvcG91dCBSYXRlXCI7XG4gICAgICAgICAgICBlbHNlIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9yZWRjYXRlZ29yeVwiKVxuICAgICAgICAgICAgICAgIHRhYiA9IFwiUmVkIENhdGVnb3JpemF0aW9uXCI7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGFiID0gXCJDb3ZlcmFnZVwiO1xuXG4gICAgICAgICAgICByZXR1cm4gXCJUcmVuZCBvZiBcIiArIGR1cmF0aW9uICsgXCIgXCIgKyB0YWIgKyBcIiBvZiBcIiArXG4gICAgICAgICAgICAgICAgYW50aWdlbkxhYmVsICsgXCIgZm9yIFwiICsgdm0uYWN0aXZlQ292ZXJhZ2VZZWFyICsgXCIgXCIgKyB5ZWFyVHlwZTtcbiAgICAgICAgfTtcblxuICAgICAgICB2bS5nZXRWYWNjaW5lRG9zZXNCeVBlcmlvZCA9IGZ1bmN0aW9uKHBhcmFtcykge1xuXG4gICAgICAgICAgICBDb3ZlcmFnZVNlcnZpY2UuZ2V0VmFjY2luZURvc2VzQnlQZXJpb2QocGFyYW1zKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUub3B0aW9uc01DWSA9IHZtLmdldENoYXJ0T3B0aW9ucyhcIkNZXCIpO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUub3B0aW9uc0FDWSA9IHZtLmdldENoYXJ0T3B0aW9ucyhcIkNZXCIpO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUub3B0aW9uc01GWSA9IHZtLmdldENoYXJ0T3B0aW9ucyhcIkZZXCIpO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUub3B0aW9uc0FGWSA9IHZtLmdldENoYXJ0T3B0aW9ucyhcIkZZXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhTUNZID0gdm0uZ2V0Q2hhcnREYXRhKHBhcmFtcywgZGF0YSwgXCJDWVwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhQUNZID0gdm0uZ2V0Q2hhcnREYXRhKHBhcmFtcywgZGF0YSwgXCJDWVwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGFNRlkgPSB2bS5nZXRDaGFydERhdGEocGFyYW1zLCBkYXRhLCBcIkZZXCIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGFBRlkgPSB2bS5nZXRDaGFydERhdGEocGFyYW1zLCBkYXRhLCBcIkZZXCIsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuY2hhcnRUaXRsZSA9IHZtLmdldENoYXJ0VGl0bGUodm0uc2VsZWN0ZWRBbnRpZ2VuKTtcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmVuYWJsZVBERkRvd25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmRvd25sb2FkUERGID0gZnVuY3Rpb24obmFtZSkgeyBDaGFydFBERkV4cG9ydC5leHBvcnRXaXRoU3R5bGVyKHZtLCBuYW1lKTsgfTtcbiAgICAgICAgICAgICAgICAvKnNoZWxsU2NvcGUuY2hpbGQuZG93bmxvYWRQREYgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9GaXggY2hhcnQgYmVmb3JlIGRvd25sb2FkXG4gICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdEFsbChcInN2ZyAubnYtbGluZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIiNmZmZmZmZcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAwKTtcblxuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3RBbGwoXCIubnZkMyAubnYtYmFja2dyb3VuZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIiNmZmZmZmZcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAwKTtcblxuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3RBbGwoXCIubnZkMyAubnYtYXhpcyBsaW5lXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgXCIjZTVlNWU1XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdEFsbChcIi5udmQzIHRleHRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZvbnRcIiwgXCJub3JtYWwgMTNweCBBcmlhbCwgc2Fucy1zZXJpZlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3RBbGwoXCIubnZkMyAubnYtZ3JvdXBzIC5udi1wb2ludFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIDApXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2Utd2lkdGhcIiwgXCIwcHhcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52ZDMgLm52LWF4aXMgLnplcm8gbGluZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIFwiIzQwNDA0MFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3RBbGwoXCIubnYteSAubnYtYXhpcyBnIHBhdGguZG9tYWluXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgXCIjNDA0MDQwXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdEFsbChcIi5sZWdlbmRRdWFudCAubGFiZWxcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZvbnRcIiwgXCJub3JtYWwgMTJweCBBcmlhbCwgc2Fucy1zZXJpZlwiKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgcGRmID0gbmV3IGpzUERGKCdsJywgJ21tJyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0geyBmb3JtYXQgOiAnUE5HJyB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHBkZi5hZGRIVE1MKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGRmUmVwb3J0XCIpLCAwLCAwLCBvcHRpb25zLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICBwZGYuc2F2ZSgnY292ZXJhZ2UtcmVwb3J0LnBkZicpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgfTtcblxuICAgICAgICAvLyAkc2NvcGUuJG9uKCdyZWZyZXNoJywgZnVuY3Rpb24oZSwgc3RhcnRNb250aCwgZW5kTW9udGgsIGRpc3RyaWN0LCB2YWNjaW5lKSB7XG4gICAgICAgIC8vICAgICBpZihzdGFydE1vbnRoLm5hbWUgJiYgZW5kTW9udGgubmFtZSAmJiBkaXN0cmljdC5uYW1lICYmIHZhY2NpbmUubmFtZSkge1xuICAgICAgICAkc2NvcGUuJG9uKFxuICAgICAgICAgICAgJ3JlZnJlc2hDb3ZlcmFnZTInLFxuICAgICAgICAgICAgZnVuY3Rpb24oZSwgZW5kTW9udGgsIHN0YXJ0WWVhciwgZW5kWWVhciwgYWN0aXZlQ292ZXJhZ2VZZWFyLCBhbnRpZ2VuLCBkb3NlLCBkaXN0cmljdCkge1xuICAgICAgICAgICAgICAgIC8qIGJ5IEZlbGl4OyBNdWx0aXBsZSBHZW9Kc29uIHJlcXVlc3RzIHdlcmUgYmVpbmcgc2VudCxcbiAgICAgICAgICAgICAgICB0cmFjZWQgdGhlIHByb2JsZW0gdG8gbXVsdGlwbGUgQ292ZXJhZ2VDb250cm9sbGVyIGNhbGxzLlxuICAgICAgICAgICAgICAgIEZvdW5kIHNvbHV0aW9uIGJ5IGNoZWNraW5nIGN1cnJlbnRTY29wZSBhcyBzaG93blxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaWYgKCd2bScgaW4gZS5jdXJyZW50U2NvcGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy92bS5nZXRTdG9ja0J5RGlzdHJpY3Qoc3RhcnRNb250aC5uYW1lLCBlbmRNb250aC5uYW1lLCBkaXN0cmljdC5uYW1lLCB2YWNjaW5lLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAvL3ZtLmdldFN0b2NrQnlEaXN0cmljdFZhY2NpbmUoc3RhcnRNb250aC5uYW1lLCBlbmRNb250aC5uYW1lLCBkaXN0cmljdC5uYW1lLCB2YWNjaW5lLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAvL3ZtLmdldERISVMyVmFjY2luZURvc2VzKGVuZE1vbnRoLnBlcmlvZCwgZGlzdHJpY3QubmFtZSwgdmFjY2luZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgdm0uYWN0aXZlRGlzdHJpY3QgPSBkaXN0cmljdDtcbiAgICAgICAgICAgICAgICAgICAgdm0uYWN0aXZlRG9zZSA9IGRvc2U7XG4gICAgICAgICAgICAgICAgICAgIHZtLmFjdGl2ZVN0YXJ0WWVhciA9IHN0YXJ0WWVhcjtcbiAgICAgICAgICAgICAgICAgICAgdm0uYWN0aXZlRW5kWWVhciA9IGVuZFllYXI7XG4gICAgICAgICAgICAgICAgICAgIHZtLnNlbGVjdGVkQW50aWdlbiA9IGFudGlnZW47XG4gICAgICAgICAgICAgICAgICAgIHZtLmFjdGl2ZUNvdmVyYWdlWWVhciA9IGFjdGl2ZUNvdmVyYWdlWWVhcjtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZW5hYmxlRGlzdHJpY3RHcm91cGluZyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2bS5wYXRoID09ICcvY292ZXJhZ2UvcmVkY2F0ZWdvcnknKVxuICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlRGlzdHJpY3RHcm91cGluZyA9IDE7XG5cbiAgICAgICAgICAgICAgICAgICAgdm0uZW5hYmxlUERGRG93bmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgdm0uZ2V0VmFjY2luZURvc2VzQnlEaXN0cmljdChlbmRNb250aC5wZXJpb2QsIGRpc3RyaWN0LCBhbnRpZ2VuKTtcbiAgICAgICAgICAgICAgICAgICAgdm0uZ2V0VmFjY2luZURvc2VzQnlQZXJpb2Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRZZWFyOiBhY3RpdmVDb3ZlcmFnZVllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRZZWFyOiBhY3RpdmVDb3ZlcmFnZVllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBhbnRpZ2VuOiBhbnRpZ2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgZG9zZTogZG9zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZURpc3RyaWN0R3JvdXBpbmc6IGVuYWJsZURpc3RyaWN0R3JvdXBpbmdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gdm0uZ2V0VmFjY2luZURvc2VzKGVuZE1vbnRoLnBlcmlvZCwgYW50aWdlbiwgZGlzdHJpY3QpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQ292ZXJhZ2VZZWFyICE9IHZtLmxhc3RFbmRZZWFyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRWYWNjaW5lRG9zZXMoYWN0aXZlQ292ZXJhZ2VZZWFyLCBhbnRpZ2VuLCBkaXN0cmljdCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS51cGRhdGVNYXBXaXRoVmFjY2luZShhbnRpZ2VuKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIHZtLmdldFJlZFZhY2NpbmVEb3NlcyhlbmRNb250aC5wZXJpb2QsIGFudGlnZW4pO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgdm0ubGFzdEVuZFllYXIgPSBhY3RpdmVDb3ZlcmFnZVllYXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgfVxuXG5dKVxuICAgIC5kaXJlY3RpdmUoXCJyZXBvcnRZZWFyVG9nZ2xlc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3RhdGljL2FwcC9jb21wb25lbnRzL2NvdmVyYWdlL3JlcG9ydC15ZWFyLXRvZ2dsZXMuaHRtbCdcbiAgICAgICAgfVxuICAgIH0pO1xufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpLmNvbnRyb2xsZXIoJ0ZpbmFuY2VEYXRhQ29udHJvbGxlcicsIEZpbmFuY2VEYXRhQ29udHJvbGxlcik7XG5cbkZpbmFuY2VEYXRhQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGh0dHAnLCAnRmluYW5jZVNlcnZpY2UnXTtcbmZ1bmN0aW9uIEZpbmFuY2VEYXRhQ29udHJvbGxlcigkc2NvcGUsICRodHRwLCBGaW5hbmNlU2VydmljZSkge1xuXG4gICAgJHNjb3BlLmFkZE5ld1JvdyA9IGFkZE5ld1JvdztcbiAgICAkc2NvcGUuc2F2ZVJvdyA9IHNhdmVSb3c7XG5cbiAgICAkc2NvcGUuZ3JpZE9wdGlvbnMgPSB7fTtcbiAgICAkc2NvcGUuZ3JpZE9wdGlvbnMuZGF0YSA9IFtdO1xuICAgICRzY29wZS5ncmlkT3B0aW9ucy5jb2x1bW5EZWZzID0gW1xuICAgICAgICB7bmFtZTogJ3BlcmlvZCcsIGVuYWJsZUNlbGxFZGl0OiB0cnVlIH0sXG4gICAgICAgIHtuYW1lOiAnZ2F2aV9hcHByb3ZlZCcsIGVuYWJsZUNlbGxFZGl0OiB0cnVlIH0sXG4gICAgICAgIHtuYW1lOiAnZ2F2aV9kaXNidXJzZWQnLCBlbmFibGVDZWxsRWRpdDogdHJ1ZSB9LFxuICAgICAgICB7bmFtZTogJ2dvdV9hcHByb3ZlZCcsIGVuYWJsZUNlbGxFZGl0OiB0cnVlIH0sXG4gICAgICAgIHtuYW1lOiAnZ291X2Rpc2J1cnNlZCcsIGVuYWJsZUNlbGxFZGl0OiB0cnVlIH1cbiAgICBdO1xuXG4gICAgLy8gJGh0dHAuZ2V0KCcvZmluYW5jZS9saXN0Jywge30pXG4gICAgLy8gICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgLy8gICAgICAgICB2YXIgZGF0YSA9IGFuZ3VsYXIuZnJvbUpzb24ocmVzcG9uc2UuZGF0YSk7XG4gICAgLy8gICAgICAgICBkYXRhLm1hcChmdW5jdGlvbihkKSB7XG4gICAgLy8gICAgICAgICAgICAgJHNjb3BlLmdyaWRPcHRpb25zLmRhdGEucHVzaChkLmZpZWxkcyk7XG4gICAgLy8gICAgICAgICB9KTtcbiAgICAvLyAgICAgfSlcbiAgICBGaW5hbmNlU2VydmljZS5nZXRGaW5hbmNlRGF0YSgpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBkYXRhLm1hcChmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAkc2NvcGUuZ3JpZE9wdGlvbnMuZGF0YS5wdXNoKGQpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICRzY29wZS5ncmlkT3B0aW9ucy5vblJlZ2lzdGVyQXBpID0gZnVuY3Rpb24oZ3JpZEFwaSl7XG4gICAgICAgICRzY29wZS5ncmlkQXBpID0gZ3JpZEFwaTtcbiAgICAgICAgZ3JpZEFwaS5yb3dFZGl0Lm9uLnNhdmVSb3coJHNjb3BlLCAkc2NvcGUuc2F2ZVJvdyk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGFkZE5ld1JvdygpIHtcbiAgICAgICAgJHNjb3BlLmdyaWRPcHRpb25zLmRhdGEucHVzaCh7XG4gICAgICAgICAgICBwZXJpb2Q6IDAsXG4gICAgICAgICAgICBnYXZpX2FwcHJvdmVkOiAwLFxuICAgICAgICAgICAgZ2F2aV9kaXNidXJzZWQ6IDAsXG4gICAgICAgICAgICBnb3VfYXBwcm92ZWQ6IDAsXG4gICAgICAgICAgICBnb3VfZGlzYnVyc2VkOiAwXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNhdmVSb3cocm93RW50aXR5KSB7XG4gICAgICAgICRodHRwLmRlZmF1bHRzLnhzcmZDb29raWVOYW1lID0gJ2NzcmZ0b2tlbic7XG4gICAgICAgICRodHRwLmRlZmF1bHRzLnhzcmZIZWFkZXJOYW1lID0gJ1gtQ1NSRlRva2VuJztcbiAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5wb3N0KCcvZmluYW5jZS91cGRhdGUnLCByb3dFbnRpdHkpXG5cbiAgICAgICAgJHNjb3BlLmdyaWRBcGkucm93RWRpdC5zZXRTYXZlUHJvbWlzZShyb3dFbnRpdHksIHByb21pc2UucHJvbWlzZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJvd0VudGl0eSk7XG4gICAgfVxufVxuXG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJykuY29udHJvbGxlcignTWFpbkZpbmFuY2VDb250cm9sbGVyJywgTWFpbkZpbmFuY2VDb250cm9sbGVyKTtcblxuTWFpbkZpbmFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdDaGFydFBERkV4cG9ydCcsICdDaGFydFN1cHBvcnRTZXJ2aWNlJywgJ0ZpbmFuY2VTZXJ2aWNlJ107XG5mdW5jdGlvbiBNYWluRmluYW5jZUNvbnRyb2xsZXIoJHNjb3BlLCBDaGFydFBERkV4cG9ydCwgQ2hhcnRTdXBwb3J0U2VydmljZSwgRmluYW5jZVNlcnZpY2UpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmV4cG9ydFBERiA9IGZ1bmN0aW9uKG5hbWUpIHsgQ2hhcnRQREZFeHBvcnQuZXhwb3J0V2l0aFN0eWxlcih2bSwgbmFtZSk7IH07XG4gICAgdm0uZ3JhcGhPcHRpb25zID0gZ2V0T3B0aW9ucygpO1xuICAgIHZtLmFwaURhdGEgPSB1bmRlZmluZWQ7XG4gICAgdm0uY2hhcnRJbnN0YW5jZSA9IHVuZGVmaW5lZDtcbiAgICB2bS55ZWFySW5kZXhlcyA9IFtdO1xuICAgIHZtLmFjdGl2ZVRvZ2dsZSA9ICdHQVZJJztcbiAgICB2bS5ncmFwaEN1cnJlbmN5ID0gJ1VTRCc7XG4gICAgdm0uY29tcGFjdEFtb3VudHMgPSBmYWxzZTtcblxuICAgIHJlc2V0R3JhcGhEYXRhKCk7XG4gICAgc2V0WWVhckZpbHRlck9wdGlvbnMoKTtcbiAgICAkc2NvcGUuJHdhdGNoKCd2bS5hY3RpdmVUb2dnbGUnLCBjaGFuZ2VUYWJzKTtcbiAgICAkc2NvcGUuJG9uKCdyZWZyZXNoRmluYW5jZScsIHVwZGF0ZUNoYXJ0KTtcbiAgICAkc2NvcGUuJHdhdGNoKCd2bS5ncmFwaEN1cnJlbmN5JywgY2hhbmdlQ3VycmVuY3kpO1xuICAgICRzY29wZS4kd2F0Y2goJ3ZtLmNvbXBhY3RBbW91bnRzJywgY29tcGFjdEFtb3VudHMpO1xuXG4gICAgZnVuY3Rpb24gcmVzZXRHcmFwaERhdGEoKSB7XG4gICAgICAgIHZtLmdyYXBoRGF0YSA9IGdldERlZmF1bHRHcmFwaERhdGEoKTtcbiAgICAgICAgdm0uYWxsb2NHcmFwaERhdGEgPSBbXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGFuZ2VDdXJyZW5jeShuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgaWYgKG5ld1ZhbHVlICE9IG9sZFZhbHVlKSB7XG4gICAgICAgICAgICByZXNldEdyYXBoRGF0YSgpO1xuICAgICAgICAgICAgdXBkYXRlQ2hhcnRXaXRoRGF0YSh2bS5hcGlEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXBhY3RBbW91bnRzKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICBpZiAobmV3VmFsdWUgIT0gb2xkVmFsdWUpIHtcbiAgICAgICAgICAgIHJlc2V0R3JhcGhEYXRhKCk7XG4gICAgICAgICAgICB1cGRhdGVDaGFydFdpdGhEYXRhKHZtLmFwaURhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0WWVhckZpbHRlck9wdGlvbnMoKSB7XG4gICAgICAgIEZpbmFuY2VTZXJ2aWNlLmdldEZpbmFuY2VZZWFycygpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgJHNjb3BlLiRwYXJlbnQuZmluYW5jZVllYXJzID0gZGF0YTtcbiAgICAgICAgICAgICRzY29wZS4kZW1pdCgnc2V0RGVmYXVsdFllYXJzJywgZGF0YVswXSwgZGF0YVtkYXRhLmxlbmd0aC0xXSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERlZmF1bHRHcmFwaERhdGEoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnYXZpQWxsb2M6IFtcbiAgICAgICAgICAgICAgICB7a2V5OiAnQXBwcm92ZWQnLCB2YWx1ZXM6IFtdfSxcbiAgICAgICAgICAgICAgICB7a2V5OiAnRGlzYnVyc2VkJywgdmFsdWVzOiBbXX1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBnb3VBbGxvYzogW1xuICAgICAgICAgICAgICAgIHtrZXk6ICdBcHByb3ZlZCcsIHZhbHVlczogW119LFxuICAgICAgICAgICAgICAgIHtrZXk6ICdEaXNidXJzZWQnLCB2YWx1ZXM6IFtdfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGFsbE9ibGlnOiBbXG4gICAgICAgICAgICAgICAge2tleTogJ0dhdmkgRnVuZHMnLCB2YWx1ZXM6IFtdfSxcbiAgICAgICAgICAgICAgICB7a2V5OiAnR09VIEZ1bmRzJywgdmFsdWVzOiBbXX1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfY3VyKGFtb3VudCkge1xuICAgICAgICBpZiAodm0uZ3JhcGhDdXJyZW5jeSA9PSAnVUdYJylcbiAgICAgICAgICAgIHJldHVybiBhbW91bnQgKiAzNjAwO1xuICAgICAgICByZXR1cm4gYW1vdW50O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUNoYXJ0KGUsIHBhcmFtcykge1xuICAgICAgICByZXNldEdyYXBoRGF0YSgpO1xuICAgICAgICBGaW5hbmNlU2VydmljZS5nZXRGaW5hbmNlRGF0YShwYXJhbXMpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgdm0uYXBpRGF0YSA9IGRhdGE7XG4gICAgICAgICAgICB1cGRhdGVDaGFydFdpdGhEYXRhKGRhdGEpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVDaGFydFdpdGhEYXRhKGRhdGEpIHtcbiAgICAgICAgdm0ueWVhckluZGV4ZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBkYXRhKSB7XG4gICAgICAgICAgICB2YXIgeWVhckluZGV4ID0gZ2V0WWVhckluZGV4KGRhdGFbaV0ucGVyaW9kKVxuXG4gICAgICAgICAgICB2bS5ncmFwaERhdGEuYWxsT2JsaWdbMF0udmFsdWVzLnB1c2goe3g6IHllYXJJbmRleCwgeTogX2N1cihkYXRhW2ldLmdhdmlfYXBwcm92ZWQpfSk7XG4gICAgICAgICAgICB2bS5ncmFwaERhdGEuYWxsT2JsaWdbMV0udmFsdWVzLnB1c2goe3g6IHllYXJJbmRleCwgeTogX2N1cihkYXRhW2ldLmdvdV9hcHByb3ZlZCl9KTtcblxuICAgICAgICAgICAgdm0uZ3JhcGhEYXRhLmdhdmlBbGxvY1swXS52YWx1ZXMucHVzaCh7eDogeWVhckluZGV4LCB5OiBfY3VyKGRhdGFbaV0uZ2F2aV9hcHByb3ZlZCl9KTtcbiAgICAgICAgICAgIHZtLmdyYXBoRGF0YS5nYXZpQWxsb2NbMV0udmFsdWVzLnB1c2goe3g6IHllYXJJbmRleCwgeTogX2N1cihkYXRhW2ldLmdhdmlfZGlzYnVyc2VkKX0pO1xuXG4gICAgICAgICAgICB2bS5ncmFwaERhdGEuZ291QWxsb2NbMF0udmFsdWVzLnB1c2goe3g6IHllYXJJbmRleCwgeTogX2N1cihkYXRhW2ldLmdvdV9hcHByb3ZlZCl9KTtcbiAgICAgICAgICAgIHZtLmdyYXBoRGF0YS5nb3VBbGxvY1sxXS52YWx1ZXMucHVzaCh7eDogeWVhckluZGV4LCB5OiBfY3VyKGRhdGFbaV0uZ291X2Rpc2J1cnNlZCl9KTtcbiAgICAgICAgfVxuICAgICAgICAvKlRyaWdnZXIgdGhlIGxvYWRpbmcgb2YgdGhlIGluaXRhbCBUYWIsIHdpdGggcmFuZG9tIHZhbHVlcyovXG4gICAgICAgIGNoYW5nZVRhYnMoMCwxKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRPcHRpb25zKCkge1xuICAgICAgICB2YXIgY2hhcnRPcHRpb25zID0gQ2hhcnRTdXBwb3J0U2VydmljZS5nZXRPcHRpb25zKCdtdWx0aUJhckNoYXJ0Jyk7XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC5jb2xvciA9IFtcImdyZWVuXCIsIFwiRG9kZ2VyQmx1ZVwiXTtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LndpZHRoID0gOTAwO1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQubWFyZ2luID0ge2xlZnQ6IDgwLCB0b3A6IDcwfTtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LmxlZ2VuZC53aWR0aCA9IDkwMDtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LnhBeGlzLmF4aXNMYWJlbCA9IFwieWVhcnNcIjtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LnlBeGlzLmF4aXNMYWJlbCA9IFwiXCI7XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC54QXhpcy50aWNrRm9ybWF0ID0gZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICByZXR1cm4gdm0ueWVhckluZGV4ZXNbZF07XG4gICAgICAgIH07XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC52YWx1ZUZvcm1hdCA9IGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgcmV0dXJuIHRpY2tGb3JtYXQoZDMuZm9ybWF0KCcuMGYnKSk7XG4gICAgICAgIH07XG4gICAgICAgIC8vSHVtYW5pemUgdGhlIGxhYmVsc1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQuZGlzcGF0Y2gucmVuZGVyRW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodm0uY29tcGFjdEFtb3VudHMpXG4gICAgICAgICAgICAgICAgQ2hhcnRTdXBwb3J0U2VydmljZS5pbml0TGFiZWxzKHRydWUpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIENoYXJ0U3VwcG9ydFNlcnZpY2UuaW5pdExhYmVscygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNoYXJ0T3B0aW9ucztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRZZWFySW5kZXgoeWVhcikge1xuICAgICAgICBpZiAodm0ueWVhckluZGV4ZXMuaW5kZXhPZih5ZWFyKSA9PSAtMSkgdm0ueWVhckluZGV4ZXMucHVzaCh5ZWFyKTtcbiAgICAgICAgcmV0dXJuIHZtLnllYXJJbmRleGVzLmluZGV4T2YoeWVhcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hhbmdlVGFicyhuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgaWYgKG5ld1ZhbHVlICE9IG9sZFZhbHVlKSB7XG4gICAgICAgICAgICBDaGFydFN1cHBvcnRTZXJ2aWNlLmNsZWFyTGFiZWxzKCk7XG4gICAgICAgICAgICBpZiAodm0uYWN0aXZlVG9nZ2xlID09ICdHQVZJJylcbiAgICAgICAgICAgICAgICB2bS5hbGxvY0dyYXBoRGF0YSA9IHZtLmdyYXBoRGF0YS5nYXZpQWxsb2M7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdm0uYWxsb2NHcmFwaERhdGEgPSB2bS5ncmFwaERhdGEuZ291QWxsb2M7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxufSkod2luZG93LmFuZ3VsYXIpOyIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKVxuLmNvbnRyb2xsZXIoJ0ZyaWRnZUNvbnRyb2xsZXInLCBbJyRzY29wZScsICdGcmlkZ2VTZXJ2aWNlJywgJyRyb290U2NvcGUnLCAnTmdUYWJsZVBhcmFtcycsICdGaWx0ZXJTZXJ2aWNlJyxcbmZ1bmN0aW9uKCRzY29wZSwgRnJpZGdlU2VydmljZSwgJHJvb3RTY29wZSwgTmdUYWJsZVBhcmFtcywgRmlsdGVyU2VydmljZSlcbntcblxuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdmFyIHNoZWxsU2NvcGUgPSAkc2NvcGUuJHBhcmVudDtcbiAgICBzaGVsbFNjb3BlLmNoaWxkID0gJHNjb3BlO1xuXG4gICAgdm0uZ2V0RnJpZGdlQWxsRGlzdHJpY3RDYXBhY2l0eSA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuXG4gICAgICAgIHZtLnN0YXJ0UXVhcnRlciA9IHZtLnN0YXJ0UXVhcnRlciA/IHZtLnN0YXJ0UXVhcnRlciA6IFwiMjAxNjAxXCI7XG4gICAgICAgIHZtLmVuZFF1YXJ0ZXIgPSB2bS5lbmRRdWFydGVyID8gdm0uZW5kUXVhcnRlciA6IFwiMjAxNjA0XCI7XG4gICAgICAgIGZyaWRnZURpc3RyaWN0ID0gXCJcIjtcbiAgICAgICAgdm0uY2FyZWxldmVsID0gY2FyZWxldmVsO1xuXG4gICAgICAgIEZyaWRnZVNlcnZpY2UuZ2V0RnJpZGdlRGlzdHJpY3RDYXBhY2l0eShzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcblxuICAgICAgICAgICAgdGFibGVkYXRhQWxsZGlzdHJpY3RzID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc0NhcGFjaXR5QWxsZGlzdHJpY3RzID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb3VudDogMTBcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFBbGxkaXN0cmljdHMsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLz09PT1BZGRpdGlvbmFsIE1ldHJpY3M9PT09XG5cbiAgICAgICAgICAgICAgICB2YXIgbWV0cmljcyA9IEZyaWRnZVNlcnZpY2UuZ2V0RnJpZGdlQ2FwYWNpdHlNZXRyaWNzKHZtLmRhdGEpO1xuXG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC51c3VycCA9IG1ldHJpY3Muc3VycGx1cztcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnVzdWZmaWNpZW50ID0gbWV0cmljcy5zdWZmaWNpZW50O1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudXNob3J0YWdlPSBtZXRyaWNzLnNob3J0YWdlO1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmdldEZyaWRnZURpc3RyaWN0Q2FwYWNpdHkgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcblxuICAgICAgICAgICAgdm0uc3RhcnRRdWFydGVyID8gdm0uc3RhcnRRdWFydGVyIDogXCIyMDE2MDFcIjtcbiAgICAgICAgICAgIHZtLmVuZFF1YXJ0ZXIgPSB2bS5lbmRRdWFydGVyID8gdm0uZW5kUXVhcnRlciA6IFwiMjAxNjA0XCI7XG4gICAgICAgICAgICBkaXN0cmljdCA9IFwiXCI7XG4gICAgICAgICAgICB2bS5mcmlkZ2VEaXN0cmljdCA9IGZyaWRnZURpc3RyaWN0O1xuICAgICAgICAgICAgdm0uY2FyZWxldmVsID0gY2FyZWxldmVsO1xuXG4gICAgICAgICAgICBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZURpc3RyaWN0Q2FwYWNpdHkoc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcblxuXG4gICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRvdGFsc1xuXG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5mcmlkZ2VEaXN0cmljdCA9IGRpc3RyaWN0O1xuXG5cblxuXG4gICAgICAgICAgICAgICAgLy8gY29uc3RydWN0IERpc3RyaWN0IGdyYXBoIGRhdGFcbiAgICAgICAgICAgICAgICB2YXIgZ3JhcGhkYXRhID0gW107XG4gICAgICAgICAgICAgICAgdmFyIHNlcmllc1JlcXVpcmVkID0gW107XG4gICAgICAgICAgICAgICAgdmFyIHNlcmllc0F2YWlsYWJsZSA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBzZXJpZXNHYXAgPSBbXTtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmF2YWlsYWJsZSA9IDA7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmRhdGEubGVuZ3RoIDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcmllc1JlcXVpcmVkLnB1c2goW3ZtLmRhdGFbaV0ucXVhcnRlci5zbGljZSgwLDQpICsgXCItUVwiICsgdm0uZGF0YVtpXS5xdWFydGVyLnNsaWNlKDUsNiksIHZtLmRhdGFbaV0ucmVxdWlyZWRdKVxuICAgICAgICAgICAgICAgICAgICBzZXJpZXNBdmFpbGFibGUucHVzaChbdm0uZGF0YVtpXS5xdWFydGVyLnNsaWNlKDAsNCkgKyBcIi1RXCIgKyB2bS5kYXRhW2ldLnF1YXJ0ZXIuc2xpY2UoNSw2KSwgdm0uZGF0YVtpXS5hdmFpbGFibGVdKVxuICAgICAgICAgICAgICAgICAgICBzZXJpZXNHYXAucHVzaChbdm0uZGF0YVtpXS5xdWFydGVyLnNsaWNlKDAsNCkgKyBcIi1RXCIgKyB2bS5kYXRhW2ldLnF1YXJ0ZXIuc2xpY2UoNSw2KSwgdm0uZGF0YVtpXS5nYXBdKVxuICAgICAgICAgICAgICAgICAgICBpZiAodm0uZGF0YVtpXS5xdWFydGVyKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuYXZhaWxhYmxlID0gdm0uZGF0YVtpXS5hdmFpbGFibGVcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgc2VyaWVzUmVxdWlyZWQgPSBbWzIwMTYwMiwgMzBdLCBbMjAxNjAzLCAzMF1dO1xuICAgICAgICAgICAgICAgIHNlcmllc0F2YWlsYWJsZSA9IFtbMjAxNjAyLCA2MF0sIFsyMDE2MDMsIDIwXV07XG4gICAgICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgICAgIGdyYXBoZGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBcIlJlcXVpcmVkXCIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlczogc2VyaWVzUmVxdWlyZWQsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOicjMkE0NDhBJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGdyYXBoZGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBcIkF2YWlsYWJsZVwiLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IHNlcmllc0F2YWlsYWJsZSxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6J2dyZWVuJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdm0uZ3JhcGggPSBncmFwaGRhdGE7XG5cblxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBncmFwaFxuICAgICAgICAgICAgICAgIHZtLm9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm11bHRpQmFyQ2hhcnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogNDUwLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAyMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByaWdodDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiA0NSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiA0NVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaXBFZGdlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFswXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFsxXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dWYWx1ZXM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93WUF4aXM6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb2xvcjogZnVuY3Rpb24oZCl7IHJldHVybiAnZ3JlZW4nfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3ZhbHVlRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgIHJldHVybiB0aWNrRm9ybWF0KGQzLmZvcm1hdCgnLC4xZicpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH07XG5cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cblxuICAgICAgICB2bS5nZXRGcmlkZ2VGYWNpbGl0eUNhcGFjaXR5ID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKSB7XG5cbiAgICAgICAgICAgIHZtLnN0YXJ0UXVhcnRlciA/IHZtLnN0YXJ0UXVhcnRlciA6IFwiMjAxNjAxXCI7XG4gICAgICAgICAgICB2bS5lbmRRdWFydGVyID0gdm0uZW5kUXVhcnRlciA/IHZtLmVuZFF1YXJ0ZXIgOiBcIjIwMTYwNFwiO1xuICAgICAgICAgICAgZGlzdHJpY3QgPSBcIlwiO1xuICAgICAgICAgICAgdm0uZGlzdHJpY3QgPSBmcmlkZ2VEaXN0cmljdDtcbiAgICAgICAgICAgIHZtLmNhcmVsZXZlbCA9IGNhcmVsZXZlbDtcblxuICAgICAgICAgICAgRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VGYWNpbGl0eUNhcGFjaXR5KHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG4gICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfZiA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgY291bnQ6IDE1XG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdm0uZGF0YSxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0b3RhbHNcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmZyaWRnZURpc3RyaWN0ID0gdm0uZnJpZGdlRGlzdHJpY3Q7XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5jYXJlbGV2ZWwgPSB2bS5jYXJlbGV2ZWw7XG5cbiAgICAgICAgICAgICAgICAvLz09PT1BZGRpdGlvbmFsIE1ldHJpY3M9PT09XG5cbiAgICAgICAgICAgICAgICB2YXIgbWV0cmljcyA9IEZyaWRnZVNlcnZpY2UuZ2V0RnJpZGdlQ2FwYWNpdHlNZXRyaWNzKHZtLmRhdGEpO1xuXG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC51dHN1cnAgPSAobWV0cmljcy5zdXJwbHVzL21ldHJpY3MudG90YWwpKjEwMDtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnV0c3VmZmljaWVudCA9IChtZXRyaWNzLnN1ZmZpY2llbnQvbWV0cmljcy50b3RhbCkqMTAwO1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudXRzaG9ydGFnZT0gKG1ldHJpY3Muc2hvcnRhZ2UvbWV0cmljcy50b3RhbCkqMTAwO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIHZtLmdldEZyaWRnZUFsbERpc3RyaWN0UmVmcmlnZXJhdG9yID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKSB7XG5cbiAgICAgICAgICAgIHZtLnN0YXJ0UXVhcnRlciA9IHZtLnN0YXJ0UXVhcnRlciA/IHZtLnN0YXJ0UXVhcnRlciA6IFwiMjAxNjAxXCI7XG4gICAgICAgICAgICB2bS5lbmRRdWFydGVyID0gdm0uZW5kUXVhcnRlciA/IHZtLmVuZFF1YXJ0ZXIgOiBcIjIwMTYwNFwiO1xuICAgICAgICAgICAgZnJpZGdlRGlzdHJpY3QgPSBcIlwiO1xuICAgICAgICAgICAgdm0uZnJpZGdlRGlzdHJpY3QgPSBmcmlkZ2VEaXN0cmljdDtcbiAgICAgICAgICAgIHZtLmNhcmVsZXZlbCA9IGNhcmVsZXZlbDtcblxuICAgICAgICAgICAgRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VEaXN0cmljdFJlZnJpZ2VyYXRvcihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuICAgICAgICAgICAgICAgIHRhYmxlZGF0YUFsbGRpc3RyaWN0cyA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zRnVuY3Rpb25hbGl0eUFsbGRpc3RyaWN0cyA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTBcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhQWxsZGlzdHJpY3RzLFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdm0uZ2V0RnJpZGdlRGlzdHJpY3RSZWZyaWdlcmF0b3IgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcblxuICAgICAgICAgICAgICAgIHZtLnN0YXJ0UXVhcnRlciA9IHZtLnN0YXJ0UXVhcnRlciA/IHZtLnN0YXJ0UXVhcnRlciA6IFwiMjAxNjAxXCI7XG4gICAgICAgICAgICAgICAgdm0uZW5kUXVhcnRlciA9IHZtLmVuZFF1YXJ0ZXIgPyB2bS5lbmRRdWFydGVyIDogXCIyMDE2MDRcIjtcbiAgICAgICAgICAgICAgICBkaXN0cmljdCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgdm0uY2FyZWxldmVsID0gY2FyZWxldmVsO1xuXG4gICAgICAgICAgICAgICAgRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VEaXN0cmljdFJlZnJpZ2VyYXRvcihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YUFsbGRpc3RyaWN0cyA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc0FsbGRpc3RyaWN0cyA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhQWxsZGlzdHJpY3RzLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zX2QgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHZtLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc3RydWN0IERpc3RyaWN0IGdyYXBoIGRhdGFcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdyYXBoZnVuY3Rpb25hbGl0eWRhdGEgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZXJpZXNFeGlzdGluZyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlcmllc05vdFdvcmtpbmcgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZXJpZXNtYWludGVuYW5jZSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmZ1bmN0aW9uYWxpdHkgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5mcmlkZ2VEaXN0cmljdCA9IGRpc3RyaWN0O1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uZGF0YS5sZW5ndGggOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpZXNFeGlzdGluZy5wdXNoKFt2bS5kYXRhW2ldLnF1YXJ0ZXIuc2xpY2UoMCw0KSArIFwiLVFcIiArIHZtLmRhdGFbaV0ucXVhcnRlci5zbGljZSg1LDYpLCB2bS5kYXRhW2ldLm51bWJlcl9leGlzdGluZ10pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VyaWVzTm90V29ya2luZy5wdXNoKFt2bS5kYXRhW2ldLnF1YXJ0ZXIuc2xpY2UoMCw0KSArIFwiLVFcIiArIHZtLmRhdGFbaV0ucXVhcnRlci5zbGljZSg1LDYpLCB2bS5kYXRhW2ldLm5vdF93b3JraW5nXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpZXNtYWludGVuYW5jZS5wdXNoKFt2bS5kYXRhW2ldLnF1YXJ0ZXIuc2xpY2UoMCw0KSArIFwiLVFcIiArIHZtLmRhdGFbaV0ucXVhcnRlci5zbGljZSg1LDYpLCB2bS5kYXRhW2ldLm5lZWRzX21haW50ZW5hbmNlXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodm0uZGF0YVtpXS5xdWFydGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZnVuY3Rpb25hbGl0eSA9ICh2bS5kYXRhW2ldLm51bWJlcl9leGlzdGluZyAtIHZtLmRhdGFbaV0ubm90X3dvcmtpbmcpL3ZtLmRhdGFbaV0ubnVtYmVyX2V4aXN0aW5nKjEwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhmdW5jdGlvbmFsaXR5ZGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiRXhpc3RpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IHNlcmllc0V4aXN0aW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOidncmVlbidcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhmdW5jdGlvbmFsaXR5ZGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiTm90IFdvcmtpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IHNlcmllc05vdFdvcmtpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6JyMyQTQ0OEEnXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoZnVuY3Rpb25hbGl0eWRhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIk5lZWRzIG1haW50ZW5hbmNlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBzZXJpZXNtYWludGVuYW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjoncmVkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdyYXBoZnVuY3Rpb25hbGl0eSA9IGdyYXBoZnVuY3Rpb25hbGl0eWRhdGE7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlIGdyYXBoXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5vcHRpb25zZnVuY3Rpb25hbGl0eSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm11bHRpQmFyQ2hhcnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA0NTAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAyMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogNDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiA0NVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93Q29udHJvbHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlwRWRnZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZnVuY3Rpb24oZCl7IHJldHVybiBkWzBdOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbihkKXsgcmV0dXJuIGRbMV07IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dWYWx1ZXM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dZQXhpczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFsdWVGb3JtYXQ6IGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICByZXR1cm4gdGlja0Zvcm1hdChkMy5mb3JtYXQoJywuMWYnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZtLmdldEZyaWRnZUZhY2lsaXR5UmVmcmlnZXJhdG9yID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdm0uc3RhcnRRdWFydGVyID8gdm0uc3RhcnRRdWFydGVyIDogXCIyMDE2MDFcIjtcbiAgICAgICAgICAgICAgICAgICAgdm0uZW5kUXVhcnRlciA9IHZtLmVuZFF1YXJ0ZXIgPyB2bS5lbmRRdWFydGVyIDogXCIyMDE2MDRcIjtcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3QgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB2bS5kaXN0cmljdCA9IGZyaWRnZURpc3RyaWN0O1xuICAgICAgICAgICAgICAgICAgICB2bS5jYXJlbGV2ZWwgPSBjYXJlbGV2ZWw7XG5cbiAgICAgICAgICAgICAgICAgICAgRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VGYWNpbGl0eVJlZnJpZ2VyYXRvcihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YUFsbGZhY2lsaXRpZXMgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNBbGxmYWNpbGl0aWVzID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFBbGxmYWNpbGl0aWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfZiA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDE1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdm0uZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0b3RhbHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmZyaWRnZURpc3RyaWN0ID0gdm0uZnJpZGdlRGlzdHJpY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5jYXJlbGV2ZWwgPSB2bS5jYXJlbGV2ZWw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLmdldEZyaWRnZUFsbERpc3RyaWN0SW1tdW5pemluZ0ZhY2lsaXR5ID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnN0YXJ0UXVhcnRlciA9IHZtLnN0YXJ0UXVhcnRlciA/IHZtLnN0YXJ0UXVhcnRlciA6IFwiMjAxNjAxXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5lbmRRdWFydGVyID0gdm0uZW5kUXVhcnRlciA/IHZtLmVuZFF1YXJ0ZXIgOiBcIjIwMTYwNFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJpZGdlRGlzdHJpY3QgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uY2FyZWxldmVsID0gY2FyZWxldmVsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZURpc3RyaWN0SW1tdW5pemluZ0ZhY2lsaXR5KHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsRGF0YSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhQWxsZGlzdHJpY3RzID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNJbW11bml6aW5nQWxsZGlzdHJpY3RzID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFBbGxkaXN0cmljdHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRGcmlkZ2VEaXN0cmljdEltbXVuaXppbmdGYWNpbGl0eSA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uc3RhcnRRdWFydGVyID8gdm0uc3RhcnRRdWFydGVyIDogXCIyMDE2MDFcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5lbmRRdWFydGVyID0gZW5kUXVhcnRlci5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5kaXN0cmljdCA9IGZyaWRnZURpc3RyaWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmNhcmVsZXZlbCA9IGNhcmVsZXZlbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZyaWRnZVNlcnZpY2UuZ2V0RnJpZGdlRGlzdHJpY3RJbW11bml6aW5nRmFjaWxpdHkoc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFBbGxmcmlkZ2UgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNBbGxmcmlkZ2UgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YUFsbGZyaWRnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc19kID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDE1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB2bS5kYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0b3RhbHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZnJpZGdlRGlzdHJpY3QgPSBkaXN0cmljdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQucXVhcnRlciA9IGVuZFF1YXJ0ZXIubmFtZSAtIDI7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc3RydWN0IERpc3RyaWN0IGdyYXBoIGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBncmFwaGRhdGFpbW11bml6aW5nID0gW107XG5cblxuXG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5kYXRhLmxlbmd0aCA7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBJbW11bml6aW5nID0gdm0uZGF0YVtpXS5pbW11bml6aW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBOb3RJbW11bml6aW5nID0gdm0uZGF0YVtpXS5Ub3RhbF9mYWNpbGl0aWVzIC0gdm0uZGF0YVtpXS5pbW11bml6aW5nO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5mYWNpbGl0eSA9IHZtLmRhdGFbaV0uaW1tdW5pemluZztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlIGdyYXBoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5vcHRpb25zaW1tdW5pemluZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncGllQ2hhcnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkLmtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkLnk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dMYWJlbHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsVGhyZXNob2xkOiAwLjAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN1bmJlYW1MYXlvdXQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAzNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3R0b206IDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdyYXBoaW1tdW5pemluZyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJJbW11bml6aW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IEltbXVuaXppbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOidncmVlbidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIk5vdCBJbW11bml6aW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IE5vdEltbXVuaXppbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjMkE0NDhBJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXTtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJG9uKCdyZWZyZXNoQ2FwYWNpdHknLCBmdW5jdGlvbihlLCBzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoc3RhcnRRdWFydGVyICYmIGVuZFF1YXJ0ZXIgJiYgZnJpZGdlRGlzdHJpY3QuZGlzdHJpY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldEZyaWRnZURpc3RyaWN0UmVmcmlnZXJhdG9yKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QuZGlzdHJpY3QsIGNhcmVsZXZlbC5ncm91cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRGcmlkZ2VBbGxEaXN0cmljdFJlZnJpZ2VyYXRvcihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LmRpc3RyaWN0LCBjYXJlbGV2ZWwuZ3JvdXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0RnJpZGdlRmFjaWxpdHlSZWZyaWdlcmF0b3Ioc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdC5kaXN0cmljdCwgY2FyZWxldmVsLmdyb3VwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldEZyaWRnZUFsbERpc3RyaWN0SW1tdW5pemluZ0ZhY2lsaXR5KHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QuZGlzdHJpY3QsIGNhcmVsZXZlbC5ncm91cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRGcmlkZ2VEaXN0cmljdEltbXVuaXppbmdGYWNpbGl0eShzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LmRpc3RyaWN0LCBjYXJlbGV2ZWwuZ3JvdXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0RnJpZGdlQWxsRGlzdHJpY3RDYXBhY2l0eShzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LmRpc3RyaWN0LCBjYXJlbGV2ZWwuZ3JvdXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0RnJpZGdlRGlzdHJpY3RDYXBhY2l0eShzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LmRpc3RyaWN0LCBjYXJlbGV2ZWwuZ3JvdXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0RnJpZGdlRmFjaWxpdHlDYXBhY2l0eShzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LmRpc3RyaWN0LCBjYXJlbGV2ZWwuZ3JvdXApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIF0pO1xufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8ndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJykuY29udHJvbGxlcignR2VuZXJpY0ltcG9ydENvbnRyb2xsZXInLCBHZW5lcmljSW1wb3J0Q29udHJvbGxlcik7XG5cbkdlbmVyaWNJbXBvcnRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckdWliTW9kYWwnXTtcbmZ1bmN0aW9uIEdlbmVyaWNJbXBvcnRDb250cm9sbGVyKCRzY29wZSwgJHVpYk1vZGFsKSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5pbXBvcnREYXRhRmlsZSA9IHNob3dJbXBvcnRNb2RhbDtcbiAgICB2bS5hbmltYXRpb25zRW5hYmxlZCA9IHRydWU7XG5cbiAgICBmdW5jdGlvbiBzaG93SW1wb3J0TW9kYWwoc2l6ZSwgcGFyZW50U2VsZWN0b3IpIHtcbiAgICAgICAgdmFyIHBhcmVudEVsZW0gPSBwYXJlbnRTZWxlY3RvciA/IFxuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJGRvY3VtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJy5nZW5lcmljLWltcG9ydCAnICsgcGFyZW50U2VsZWN0b3IpKSA6IHVuZGVmaW5lZDtcblxuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdm0uYW5pbWF0aW9uc0VuYWJsZWQsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2ltcG9ydE1vZGFsQ29udGVudC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNb2RhbEluc3RhbmNlQ3RybCcsXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICBzaXplOiBzaXplLFxuICAgICAgICAgICAgYXBwZW5kVG86IHBhcmVudEVsZW1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpbXBvcnREYXRhRmlsZSgpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvL2FsZXJ0KCdDYW5jZWxlbGQnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbXBvcnREYXRhRmlsZSgpIHtcbiAgICAgICAgYWxlcnQoJ0ltcG9ydCBpbiBwcm9ncmVzcycpO1xuICAgIH1cbn1cblxufSkod2luZG93LmFuZ3VsYXIpO1xuXG4oZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJykuY29udHJvbGxlcignTW9kYWxJbnN0YW5jZUN0cmwnLCBmdW5jdGlvbiAoJHVpYk1vZGFsSW5zdGFuY2UpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIHZtLm9rID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UoJ2RvbmUnKTtcbiAgICAgICAgfTtcbiAgICBcbiAgICAgICAgdm0uY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgICAgIH07XG4gICAgfSk7XG59KSh3aW5kb3cuYW5ndWxhcik7IiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpXG4gICAgLmNvbnRyb2xsZXIoJ1BsYW5uaW5nQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0FubnVhbFNlcnZpY2UnLCAnJHJvb3RTY29wZScsICdOZ1RhYmxlUGFyYW1zJywgJ0ZpbHRlclNlcnZpY2UnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgQW5udWFsU2VydmljZSwgJHJvb3RTY29wZSwgTmdUYWJsZVBhcmFtcywgRmlsdGVyU2VydmljZSlcbiAgICB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZhciBzaGVsbFNjb3BlID0gJHNjb3BlLiRwYXJlbnQ7XG4gICAgICAgIHNoZWxsU2NvcGUuY2hpbGQgPSAkc2NvcGU7XG5cbiAgICAgICAgdm0uZ2V0RnVuZEFjdGl2aXRpZXMgPSBmdW5jdGlvbih5ZWFyKSB7XG4gICAgICAgICAgICB5ZWFyID0gXCJcIlxuICAgICAgICAgICAgdm0ueWVhciA9IHllYXI7XG5cbiAgICAgICAgICAgIEFubnVhbFNlcnZpY2UuZ2V0RnVuZEFjdGl2aXRpZXMoeWVhcilcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZWRhdGFfZnVuZGVkID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZWRhdGFfdW5mdW5kZWQgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhX2Z1bmRlZCA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmZ1bmQgPT0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFfdW5mdW5kZWQgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5mdW5kID09IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhZnVuZCA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zZnVuZGVkID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxNVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFmdW5kLFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdG90YWxzXG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGdyYXBoZGF0YWZ1bmQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZ1bmRlZCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciB1bmZ1bmRlZCA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodm0uZGF0YVtpXS5mdW5kID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5kZWQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZtLmRhdGFbaV0uZnVuZCA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZnVuZGVkKys7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG5cblxuICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGUgZ3JhcGhcbiAgICAgICAgICAgICAgICAgICAgdm0uZnVuZGFjdGl2aXR5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncGllQ2hhcnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQua2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQueTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dMYWJlbHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFRocmVzaG9sZDogMC4wMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN1bmJlYW1MYXlvdXQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChmdW5kZWQgPT0gdm0uZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdyYXBoZnVuZGVkYWN0aXZpdGllcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfZnVuZGVkID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDE1XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFfZnVuZGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zX3VuZnVuZGVkID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDE1XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFfdW5mdW5kZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5ncmFwaGZ1bmRlZGFjdGl2aXRpZXMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiRnVuZGVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IChmdW5kZWQgLyB2bS5kYXRhLmxlbmd0aCkgKiAxMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOidncmVlbidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIlVuZnVuZGVkIEFjdGl2aXRpZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogKHVuZnVuZGVkIC8gdm0uZGF0YS5sZW5ndGgpICogMTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjoncmVkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgdm0uZ2V0UHJpb3JpdHlBY3Rpdml0aWVzID0gZnVuY3Rpb24oeWVhcikge1xuICAgICAgICAgICAgeWVhciA9IFwiXCJcbiAgICAgICAgICAgIHZtLnllYXIgPSB5ZWFyO1xuXG4gICAgICAgICAgICBBbm51YWxTZXJ2aWNlLmdldFByaW9yaXR5QWN0aXZpdGllcyh5ZWFyKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlZGF0YV9wcmlvcml0eWZ1bmQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlZGF0YV9wcmlvcml0eXVuZnVuZGVkID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcblxuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YV9wcmlvcml0eWZ1bmQgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5mdW5kID09IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhX3ByaW9yaXR5dW5mdW5kZWQgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5mdW5kID09IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuXG5cblxuXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGZ1bmRlZCA9PSB2bS5kYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ3JhcGhmdW5kZWRhY3Rpdml0aWVzID0gW107XG5cblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfcHJpb3JpdHlmdW5kPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YV9wcmlvcml0eWZ1bmQsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfcHJpb3JpdHl1bmZ1bmRlZCA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxNVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhX3ByaW9yaXR5dW5mdW5kZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc3RydWN0IERpc3RyaWN0IGdyYXBoIGRhdGFcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByaW9yaXR5ZGF0YSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcHJpb3JpdHlkYXRhdW4gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIEhpZ2hwcmlvcml0eSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgTWVkaXVtcHJpb3JpdHkgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIExvd3ByaW9yaXR5ID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciBIaWdocHJpb3JpdHl1biA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgTWVkaXVtcHJpb3JpdHl1biA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgTG93cHJpb3JpdHl1biA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uZGF0YS5sZW5ndGggOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2bS5kYXRhW2ldLmZ1bmQgPT0gdHJ1ZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSGlnaHByaW9yaXR5LnB1c2goW3ZtLmRhdGFbaV0uYXJlYSwgdm0uZGF0YVtpXS5IaWdoXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNZWRpdW1wcmlvcml0eS5wdXNoKFt2bS5kYXRhW2ldLmFyZWEsIHZtLmRhdGFbaV0uTWVkaXVtXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBMb3dwcmlvcml0eS5wdXNoKFt2bS5kYXRhW2ldLmFyZWEsIHZtLmRhdGFbaV0uTG93XSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEhpZ2hwcmlvcml0eXVuLnB1c2goW3ZtLmRhdGFbaV0uYXJlYSwgdm0uZGF0YVtpXS5IaWdoXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNZWRpdW1wcmlvcml0eXVuLnB1c2goW3ZtLmRhdGFbaV0uYXJlYSwgdm0uZGF0YVtpXS5NZWRpdW1dKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIExvd3ByaW9yaXR5dW4ucHVzaChbdm0uZGF0YVtpXS5hcmVhLCB2bS5kYXRhW2ldLkxvd10pXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5ZGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiSElHSFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogSGlnaHByaW9yaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjMkE0NDhBJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHlkYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJNRURJVU1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IE1lZGl1bXByaW9yaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOidncmVlbidcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5ZGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiTE9XXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBMb3dwcmlvcml0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjoneWVsbG93J1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB2bS5wcmlvcml0eWdyYXBoID0gcHJpb3JpdHlkYXRhO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlIGdyYXBoXG4gICAgICAgICAgICAgICAgICAgIHZtLnByaW9yaXR5b3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm11bHRpQmFyQ2hhcnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA0NTAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOjUwMCxcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlwRWRnZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZnVuY3Rpb24oZCl7IHJldHVybiBkWzBdOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbihkKXsgcmV0dXJuIGRbMV07IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dWYWx1ZXM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dZQXhpczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1hBeGlzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3RhdGVMYWJlbHM6IDU1LFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHlkYXRhdW4ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIkhJR0hcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IEhpZ2hwcmlvcml0eXVuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjMkE0NDhBJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHlkYXRhdW4ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIk1FRElVTVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogTWVkaXVtcHJpb3JpdHl1bixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjonZ3JlZW4nXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eWRhdGF1bi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiTE9XXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBMb3dwcmlvcml0eXVuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOid5ZWxsb3cnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLnByaW9yaXR5Z3JhcGh1biA9IHByaW9yaXR5ZGF0YXVuO1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLnByaW9yaXR5b3B0aW9uc3VuID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibXVsdGlCYXJDaGFydFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDQ1MCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6NTAwLFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaXBFZGdlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbihkKXsgcmV0dXJuIGRbMF07IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFsxXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1lBeGlzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93WEF4aXM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdGF0ZUxhYmVsczogNTUsXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCdyZWZyZXNoQXdwJywgZnVuY3Rpb24oZSwgeWVhcikge1xuICAgICAgICAgICAgICAgIGlmKHllYXIueWVhcilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZtLmdldEZ1bmRBY3Rpdml0aWVzKHllYXIueWVhcik7XG4gICAgICAgICAgICAgICAgICAgIHZtLmdldFByaW9yaXR5QWN0aXZpdGllcyh5ZWFyLnllYXIpO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgIF0pO1xufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpXG4gICAgLmNvbnRyb2xsZXIoJ1N0b2NrQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ1N0b2NrU2VydmljZScsICckcm9vdFNjb3BlJywgJ05nVGFibGVQYXJhbXMnLFxuICAgICdGaWx0ZXJTZXJ2aWNlJywgJ01vbnRoU2VydmljZScsICckbG9jYXRpb24nLCAnQ2hhcnRTdXBwb3J0U2VydmljZScsICdDaGFydFBERkV4cG9ydCcsICckdGltZW91dCcsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCBTdG9ja1NlcnZpY2UsICRyb290U2NvcGUsIE5nVGFibGVQYXJhbXMsIEZpbHRlclNlcnZpY2UsIE1vbnRoU2VydmljZSxcbiAgICAgICAgJGxvY2F0aW9uLCBDaGFydFN1cHBvcnRTZXJ2aWNlLCBDaGFydFBERkV4cG9ydCwgJHRpbWVvdXQpXG4gICAge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2YXIgc2hlbGxTY29wZSA9ICRzY29wZS4kcGFyZW50O1xuICAgICAgICBzaGVsbFNjb3BlLmNoaWxkID0gJHNjb3BlO1xuICAgICAgICB2bS5leHBvcnRQREYgPSBDaGFydFBERkV4cG9ydC5leHBvcnQ7XG5cbiAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5pc0FjdGl2ZSA9IGZ1bmN0aW9uKHZpZXdMb2NhdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHZpZXdMb2NhdGlvbiA9PT0gJGxvY2F0aW9uLnBhdGgoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBUb2RvOiBVc2UgdGhpcyB0byBzb3J0IGJ5IHBlcmZvcm1hbmNlIChNYWxpc2EpXG4gICAgICAgIHZtLlNvcnRCeUtleSA9IGZ1bmN0aW9uKGFycmF5LCBrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBhcnJheS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICB2YXIgeCA9IGFba2V5XTsgdmFyIHkgPSBiW2tleV07XG4gICAgICAgICAgICAgICAgcmV0dXJuICgoeCA8IHkpID8gLTEgOiAoKHggPiB5KSA/IDEgOiAwKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2bS5nZXRTdG9ja0J5RGlzdHJpY3QgPSBmdW5jdGlvbihzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcblxuICAgICAgICAgICAgdm0uc3RhcnRNb250aCA/IHZtLnN0YXJ0TW9udGggOiBcIlwiO1xuICAgICAgICAgICAgdm0uZW5kTW9udGggPSB2bS5lbmRNb250aCA/IHZtLmVuZE1vbnRoIDogXCJcIjtcbiAgICAgICAgICAgIC8vVG9kbzogVGVtcG9yYXJpbHkgZGlzYWJsZSBmaWx0ZXJpbmcgYnkgZGlzdHJpY3QgZm9yIHRoZSB0YWJsZVxuICAgICAgICAgICAgZGlzdHJpY3QgPSBcIlwiXG4gICAgICAgICAgICB2bS5kaXN0cmljdCA9IFwiXCI7XG4gICAgICAgICAgICB2bS52YWNjaW5lID0gdm0uc2VsZWN0ZWRWYWNjaW5lID8gdm0uc2VsZWN0ZWRWYWNjaW5lLm5hbWUgOiBcIlwiO1xuXG4gICAgICAgICAgICBTdG9ja1NlcnZpY2UuZ2V0U3RvY2tCeURpc3RyaWN0KHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlZGF0YV9zbyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGVkYXRhX2JtID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZWRhdGFfd3IgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlZGF0YV9hbSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGVkYXRhX3NlYXJjaCA9W107XG5cbiAgICAgICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFfc28gPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5hdF9oYW5kID09IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFfYW0gPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5hdF9oYW5kID4gdmFsdWUuc3RvY2tfcmVxdWlyZW1lbnRfX21heGltdW07XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFfd3IgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoKHZhbHVlLmF0X2hhbmQgPiB2YWx1ZS5zdG9ja19yZXF1aXJlbWVudF9fbWluaW11bSkgJiYgKHZhbHVlLmF0X2hhbmQgPCB2YWx1ZS5zdG9ja19yZXF1aXJlbWVudF9fbWF4aW11bSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhX2JtID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCh2YWx1ZS5hdF9oYW5kIDwgdmFsdWUuc3RvY2tfcmVxdWlyZW1lbnRfX21pbmltdW0pICYmICh2YWx1ZS5hdF9oYW5kID4gMCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YV9zZWFyY2ggPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YUFsbGRpc3RyaWN0cyA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNBbGxkaXN0cmljdHMgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YUFsbGRpc3RyaWN0cyxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRvdGFsc1xuICAgICAgICAgICAgICAgICAgICB2YXIgbm90aGluZyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciB3aXRoaW4gPSAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmVsb3dtaW5pbXVtID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFib3ZlbWF4aW11bSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0dXMgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2bS5kYXRhW2ldLmF0X2hhbmQgPT0gMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3RoaW5nKyssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzPVwiU3RvY2tlZCBPdXRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCh2bS5kYXRhW2ldLmF0X2hhbmQgPiB2bS5kYXRhW2ldLnN0b2NrX3JlcXVpcmVtZW50X19taW5pbXVtKSAmJiAodm0uZGF0YVtpXS5hdF9oYW5kIDwgdm0uZGF0YVtpXS5zdG9ja19yZXF1aXJlbWVudF9fbWF4aW11bSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2l0aGluKyssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzPVwiV2l0aGluIFJhbmdlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgodm0uZGF0YVtpXS5hdF9oYW5kIDwgdm0uZGF0YVtpXS5zdG9ja19yZXF1aXJlbWVudF9fbWluaW11bSkgJiYgKHZtLmRhdGFbaV0uYXRfaGFuZCA+IDApKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlbG93bWluaW11bSsrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cz1cIkJlbG93IE1JTlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodm0uZGF0YVtpXS5hdF9oYW5kID4gdm0uZGF0YVtpXS5zdG9ja19yZXF1aXJlbWVudF9fbWF4aW11bSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhYm92ZW1heGltdW0rKyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM9XCJBYm92ZSBNQVhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRhdGFbaV0uc3RhdHVzPXN0YXR1cztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuc3RvY2tlZG91dCA9IChub3RoaW5nIC8gdm0uZGF0YS5sZW5ndGgpICogMTAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmFsYW5jZU1vbnRoID0gbmV3IERhdGUoTW9udGhTZXJ2aWNlLm1vbnRoVG9EYXRlKGVuZE1vbnRoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJhbGFuY2VNb250aC5zZXRNb250aChiYWxhbmNlTW9udGguZ2V0TW9udGgoKSAtIDEpO1xuICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnRoZW1vbnRoID0gYmFsYW5jZU1vbnRoO1xuICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnZhY2NpbmUgPSB2YWNjaW5lO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBncmFwaFxuICAgICAgICAgICAgICAgICAgICB2bS5vcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncGllQ2hhcnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogNDgwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiA0ODAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQua2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQueTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dMYWJlbHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFRocmVzaG9sZDogMC4wMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN1bmJlYW1MYXlvdXQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChub3RoaW5nID09IHZtLmRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5ncmFwaCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfc28gPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YV9zbyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc19ibSA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhX2JtLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zX3dyID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFfd3IsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfYW0gPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YV9hbSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfc2VhcmNoID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFfc2VhcmNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdyYXBoID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIlN0b2NrZWQgT3V0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IChub3RoaW5nIC8gdm0uZGF0YS5sZW5ndGgpICogMTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjonI0ZGMDAwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIldpdGhpbiBSYW5nZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiAod2l0aGluIC8gdm0uZGF0YS5sZW5ndGgpICogMTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjonIzAwODAwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29sb3I6JyNGRkZGMDAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJCZWxvdyBNSU5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogKGJlbG93bWluaW11bSAvIHZtLmRhdGEubGVuZ3RoKSAqIDEwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6JyNGRkE1MDAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJBYm92ZSBNQVhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogKGFib3ZlbWF4aW11bSAvIHZtLmRhdGEubGVuZ3RoKSAqIDEwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6JyM5MEVFOTAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbG9yOicjMDA4MDAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uZ2V0U3RvY2tCeURpc3RyaWN0VmFjY2luZSA9IGZ1bmN0aW9uKHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSkge1xuXG4gICAgICAgICAgICB2bS5zdGFydE1vbnRoID8gdm0uc3RhcnRNb250aCA6IFwiTm92IDIwMTVcIjtcbiAgICAgICAgICAgIHZtLmVuZE1vbnRoID0gdm0uZW5kTW9udGggPyB2bS5lbmRNb250aCA6IFwiRGVjIDIwMTZcIjtcbiAgICAgICAgICAgIC8vVG9kbzogVGVtcG9yYXJpbHkgZGlzYWJsZSBmaWx0ZXJpbmcgYnkgZGlzdHJpY3QgZm9yIHRoZSB0YWJsZVxuICAgICAgICAgICAgLy9kaXN0cmljdCA9IFwiXCJcbiAgICAgICAgICAgIHZtLmRpc3RyaWN0ID0gZGlzdHJpY3Q7XG4gICAgICAgICAgICB2bS52YWNjaW5lID0gdmFjY2luZTsgLy92bS5zZWxlY3RlZFZhY2NpbmUgPyB2bS5zZWxlY3RlZFZhY2NpbmUubmFtZSA6IFwiXCI7XG5cbiAgICAgICAgICAgIFN0b2NrU2VydmljZS5nZXRTdG9ja0J5RGlzdHJpY3RWYWNjaW5lKHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb3VudDogMTVcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB2bS5kYXRhLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRvdGFsc1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZGlzdHJpY3QgPSB2bS5kaXN0cmljdDtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnZhY2NpbmUgPSB2bS52YWNjaW5lO1xuXG5cbiAgICAgICAgICAgICAgICAvLyBjb25zdHJ1Y3QgRGlzdHJpYnV0aW9uIGdyYXBoIGRhdGFcbiAgICAgICAgICAgICAgICB2YXIgZ3JhcGhkYXRhRGlzdHJpYnV0aW9uID0gW107XG4gICAgICAgICAgICAgICAgdmFyIHNlcmllc0Rpc3RyaWJ1dGlvbiA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBzZXJpZXNPcmRlcnMgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgbWluX3Nlcmllc0Rpc3RyaWJ1dGlvbiA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBtYXhfc2VyaWVzRGlzdHJpYnV0aW9uID0gW107XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5yZWZyZXNocmF0ZSA9IDA7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmRhdGEubGVuZ3RoIDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcmllc0Rpc3RyaWJ1dGlvbi5wdXNoKFt2bS5kYXRhW2ldLm1vbnRoLCBwYXJzZUludCh2bS5kYXRhW2ldLnJlY2VpdmVkKV0pXG4gICAgICAgICAgICAgICAgICAgIHNlcmllc09yZGVycy5wdXNoKFt2bS5kYXRhW2ldLm1vbnRoLCB2bS5kYXRhW2ldLm9yZGVyZWRdKVxuICAgICAgICAgICAgICAgICAgICBtaW5fc2VyaWVzRGlzdHJpYnV0aW9uLnB1c2goW3ZtLmRhdGFbaV0ubW9udGgsIHZtLmRhdGFbaV0uc3RvY2tfcmVxdWlyZW1lbnRfX21pbmltdW1dKVxuICAgICAgICAgICAgICAgICAgICBtYXhfc2VyaWVzRGlzdHJpYnV0aW9uLnB1c2goW3ZtLmRhdGFbaV0ubW9udGgsIHZtLmRhdGFbaV0uc3RvY2tfcmVxdWlyZW1lbnRfX21heGltdW1dKVxuICAgICAgICAgICAgICAgICAgICBpZiAodm0uZGF0YVtpXS5tb250aCA9PSBNb250aFNlcnZpY2UuZ2V0TW9udGhOdW1iZXIoZW5kTW9udGguc3BsaXQoXCIgXCIpWzBdKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnJlZnJlc2hyYXRlID0gdm0uZGF0YVtpXS5vcmRlcmVkID09IDAgPyAwIDp2bS5kYXRhW2ldLnJlY2VpdmVkL3ZtLmRhdGFbaV0ub3JkZXJlZCoxMDAgO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGdyYXBoZGF0YURpc3RyaWJ1dGlvbi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJNaW5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogbWluX3Nlcmllc0Rpc3RyaWJ1dGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjQTVFODE2J1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGdyYXBoZGF0YURpc3RyaWJ1dGlvbi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJJc3N1ZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogc2VyaWVzRGlzdHJpYnV0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6JyMxRjc3QjQnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZ3JhcGhkYXRhRGlzdHJpYnV0aW9uLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIk9yZGVyZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogc2VyaWVzT3JkZXJzLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J3JlZCdcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGdyYXBoZGF0YURpc3RyaWJ1dGlvbi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJNYXhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogbWF4X3Nlcmllc0Rpc3RyaWJ1dGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjRkY3RjBFJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdm0uZ3JhcGhEaXN0cmlidXRpb24gPSBncmFwaGRhdGFEaXN0cmlidXRpb247XG5cblxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBEaXN0cmlidXRpb24gZ3JhcGhcbiAgICAgICAgICAgICAgICB2bS5vcHRpb25zRGlzdHJpYnV0aW9uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbGluZUNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCA6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdBYmltJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0xlZ2VuZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dDb250cm9sczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW4gOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiA4NSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogNjVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlWTogKFswLDEwMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWdnZXJMYWJlbHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZnVuY3Rpb24oZCl7IHJldHVybiBkWzBdOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFsxXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWw6ICdNb250aHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWNrRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBNb250aFNlcnZpY2UuZ2V0TW9udGhOYW1lKGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWxEaXN0YW5jZTogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZUludGVyYWN0aXZlR3VpZGVsaW5lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVDaGFuZ2U6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInN0YXRlQ2hhbmdlXCIpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZVN0YXRlOiBmdW5jdGlvbihlKXsgY29uc29sZS5sb2coXCJjaGFuZ2VTdGF0ZVwiKTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwU2hvdzogZnVuY3Rpb24oZSl7IGNvbnNvbGUubG9nKFwidG9vbHRpcFNob3dcIik7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcEhpZGU6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInRvb2x0aXBIaWRlXCIpOyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93VmFsdWVzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpY2tGb3JtYXQoZDMuZm9ybWF0KCcsLjFmJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8vIGNvbnN0cnVjdCBVcHRha2UgZ3JhcGggZGF0YVxuXG5cbiAgICAgICAgICAgICAgICAvLyBjb25zdHJ1Y3QgQ29uc3VtcHRpb24gZ3JhcGggZGF0YVxuICAgICAgICAgICAgICAgIHZhciBncmFwaGRhdGFDb25zdW1wdGlvbiA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBzZXJpZXNDb25zdW1wdGlvbiA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXRfc2VyaWVzQ29uc3VtcHRpb24gPSBbXTtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmNvdmVyYWdlID0gMDtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uZGF0YS5sZW5ndGggOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgc2VyaWVzQ29uc3VtcHRpb24ucHVzaChbdm0uZGF0YVtpXS5tb250aCwgdm0uZGF0YVtpXS5jb25zdW1lZF0pXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldF9zZXJpZXNDb25zdW1wdGlvbi5wdXNoKFt2bS5kYXRhW2ldLm1vbnRoLCB2bS5kYXRhW2ldLnN0b2NrX3JlcXVpcmVtZW50X190YXJnZXRdKVxuICAgICAgICAgICAgICAgICAgICBpZiAodm0uZGF0YVtpXS5tb250aCA9PSBNb250aFNlcnZpY2UuZ2V0TW9udGhOdW1iZXIoZW5kTW9udGguc3BsaXQoXCIgXCIpWzBdKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmNvdmVyYWdlID0gdm0uZGF0YVtpXS5zdG9ja19yZXF1aXJlbWVudF9fdGFyZ2V0ID09IDAgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAgOnZtLmRhdGFbaV0uY29uc3VtZWQvdm0uZGF0YVtpXS5zdG9ja19yZXF1aXJlbWVudF9fdGFyZ2V0KjEwMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZ3JhcGhkYXRhQ29uc3VtcHRpb24ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiQWN0dWFsIENvbnN1bXB0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IHNlcmllc0NvbnN1bXB0aW9uXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZ3JhcGhkYXRhQ29uc3VtcHRpb24ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiUGxhbm5lZCBjb25zdW1wdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiB0YXJnZXRfc2VyaWVzQ29uc3VtcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNGRjdGMEUnXG4gICAgICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgICAgIHZtLmdyYXBoQ29uc3VtcHRpb24gPSBncmFwaGRhdGFDb25zdW1wdGlvbjtcblxuXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIENvbnN1bXB0aW9uIGdyYXBoXG4gICAgICAgICAgICAgICAgdm0ub3B0aW9uc0NvbnN1bXB0aW9uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbGluZUNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCA6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdBYmltJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0xlZ2VuZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dDb250cm9sczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW4gOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiA4NSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogNjVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlWTogKFswLDEwMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWdnZXJMYWJlbHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZnVuY3Rpb24oZCl7IHJldHVybiBkWzBdOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFsxXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWw6ICdNb250aHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWNrRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBNb250aFNlcnZpY2UuZ2V0TW9udGhOYW1lKGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWxEaXN0YW5jZTogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZUludGVyYWN0aXZlR3VpZGVsaW5lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVDaGFuZ2U6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInN0YXRlQ2hhbmdlXCIpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZVN0YXRlOiBmdW5jdGlvbihlKXsgY29uc29sZS5sb2coXCJjaGFuZ2VTdGF0ZVwiKTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwU2hvdzogZnVuY3Rpb24oZSl7IGNvbnNvbGUubG9nKFwidG9vbHRpcFNob3dcIik7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcEhpZGU6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInRvb2x0aXBIaWRlXCIpOyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93VmFsdWVzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpY2tGb3JtYXQoZDMuZm9ybWF0KCcsLjFmJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS4kb24oJ3JlZnJlc2gnLCBmdW5jdGlvbihlLCBzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIGlmKHN0YXJ0TW9udGgubmFtZSAmJiBlbmRNb250aC5uYW1lICYmIGRpc3RyaWN0Lm5hbWUgJiYgdmFjY2luZS5uYW1lKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZtLmdldFN0b2NrQnlEaXN0cmljdChzdGFydE1vbnRoLm5hbWUsIGVuZE1vbnRoLm5hbWUsIGRpc3RyaWN0Lm5hbWUsIHZhY2NpbmUubmFtZSk7XG4gICAgICAgICAgICAgICAgdm0uZ2V0U3RvY2tCeURpc3RyaWN0VmFjY2luZShzdGFydE1vbnRoLm5hbWUsIGVuZE1vbnRoLm5hbWUsIGRpc3RyaWN0Lm5hbWUsIHZhY2NpbmUubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG5dKTtcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKS5jb250cm9sbGVyKCdTdG9ja1VwdGFrZUNvbnRyb2xsZXInLCBTdG9ja1VwdGFrZUNvbnRyb2xsZXIpO1xuXG5TdG9ja1VwdGFrZUNvbnRyb2xsZXIuJGluamVjdCA9IFtcbiAgICAnJHNjb3BlJyxcbiAgICAnU3RvY2tTZXJ2aWNlJyxcbiAgICAnTW9udGhTZXJ2aWNlJyxcbiAgICAnQ2hhcnRTdXBwb3J0U2VydmljZScsXG4gICAgJ0NoYXJ0UERGRXhwb3J0JyxcbiAgICAnJHRpbWVvdXQnXG5dO1xuZnVuY3Rpb24gU3RvY2tVcHRha2VDb250cm9sbGVyKCRzY29wZSwgU3RvY2tTZXJ2aWNlLCBNb250aFNlcnZpY2UsIENoYXJ0U3VwcG9ydFNlcnZpY2UsIENoYXJ0UERGRXhwb3J0LCAkdGltZW91dCkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdmFyIHNoZWxsU2NvcGUgPSAkc2NvcGUuJHBhcmVudDtcbiAgICBzaGVsbFNjb3BlLmNoaWxkID0gJHNjb3BlO1xuXG4gICAgc2hlbGxTY29wZS5jaGlsZC51cHRha2UgPSAwO1xuICAgIHZtLmV4cG9ydFBERiA9IGZ1bmN0aW9uKG5hbWUpIHsgQ2hhcnRQREZFeHBvcnQuZXhwb3J0V2l0aFN0eWxlcih2bSwgbmFtZSk7IH07XG5cbiAgICB2bS5vcHRpb25zVXB0YWtlID0gZ2V0T3B0aW9ucygpO1xuICAgIHZtLnBlcmlvZEluZGV4ZXMgPSBbXTtcblxuICAgICRzY29wZS4kb24oJ3JlZnJlc2gnLCB1cGRhdGVDaGFydCk7XG4gICAgZnVuY3Rpb24gdXBkYXRlQ2hhcnQoZSwgc3RhcnRNb250aCwgZW5kTW9udGgsIGRpc3RyaWN0LCB2YWNjaW5lKSB7XG4gICAgICAgIFN0b2NrU2VydmljZS5nZXRTdG9ja0J5RGlzdHJpY3RWYWNjaW5lKHN0YXJ0TW9udGgubmFtZSwgZW5kTW9udGgubmFtZSwgZGlzdHJpY3QubmFtZSwgdmFjY2luZS5uYW1lKVxuICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuXG4gICAgICAgICAgICB2YXIgZ3JhcGhkYXRhVXB0YWtlID0gW107XG4gICAgICAgICAgICB2YXIgc2VyaWVzVXB0YWtlID0gW107XG4gICAgICAgICAgICB2YXIgc3RvY2tEYXRhID0gW107XG4gICAgICAgICAgICB2YXIgaW1tdW5pc2F0aW9uRGF0YSA9IFtdO1xuICAgICAgICAgICAgdmFyIG1vbnRobHlUYXJnZXREYXRhID0gW107XG4gICAgICAgICAgICB2YXIgZm9yY2VTdGFydFplcm9EYXRhID0gW107XG4gICAgICAgICAgICB2YXIgbWF4TW9udGhseVRhcmdldCA9IDA7XG4gICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnVwdGFrZSA9IFwiMFwiO1xuXG4gICAgICAgICAgICB2bS5wZXJpb2RJbmRleGVzID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uZGF0YS5sZW5ndGggOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHZtLmRhdGFbaV07XG4gICAgICAgICAgICAgICAgLyogQ2VydGFpbiBkYXRhIGhhZCBpbnZhbGlkIHBlcmlvZHMgbGlrZSAyMDE3MiBpbnN0ZWFkIG9mXG4gICAgICAgICAgICAgICAgICAgIDIwMTcwMiB3aGljaCB3ZXJlIGNhdXNpbmcgZXJyb3JzLiBIZW5jZSB0aGUgZmlsdGVyIGJlbG93LiAqL1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLnBlcmlvZC50b1N0cmluZygpLmxlbmd0aCA9PSA1KSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1vbnRoSW5kZXgsIGl0ZW0pO1xuICAgICAgICAgICAgICAgIC8vdmFyIG1vbnRoSW5kZXggPSBhcHBIZWxwZXJzLmdldE1vbnRoSW5kZXhGcm9tUGVyaW9kKGl0ZW0ucGVyaW9kLCAnQ1knKTtcbiAgICAgICAgICAgICAgICB2YXIgcGVyaW9kSW5kZXggPSBnZXRQZXJpb2RJbmRleChpdGVtLnBlcmlvZClcbiAgICAgICAgICAgICAgICB2YXIgYXRIYW5kID0gaXRlbS5hdF9oYW5kID09IHVuZGVmaW5lZCA/IGl0ZW0udG90YWxfYXRfaGFuZCA6IGl0ZW0uYXRfaGFuZDtcbiAgICAgICAgICAgICAgICB2YXIgcmVjZWl2ZWQgPSBpdGVtLnJlY2VpdmVkID09IHVuZGVmaW5lZCA/IGl0ZW0udG90YWxfcmVjZWl2ZWQgOiBpdGVtLnJlY2VpdmVkO1xuICAgICAgICAgICAgICAgIHZhciBjb25zdW1lZCA9IGl0ZW0uY29uc3VtZWQgPT0gdW5kZWZpbmVkID8gaXRlbS50b3RhbF9jb25zdW1lZCA6IGl0ZW0uY29uc3VtZWQ7XG4gICAgICAgICAgICAgICAgdmFyIG1vbnRobHlUYXJnZXQgPSBpdGVtLnN0b2NrX3JlcXVpcmVtZW50X190YXJnZXQgPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgID8gaXRlbS50b3RhbF90YXJnZXQgOiBpdGVtLnN0b2NrX3JlcXVpcmVtZW50X190YXJnZXQ7XG4gICAgICAgICAgICAgICAgdmFyIHRvdGFsU3RvY2sgPSBhdEhhbmQgKyByZWNlaXZlZDtcblxuICAgICAgICAgICAgICAgIG1heE1vbnRobHlUYXJnZXQgPSBNYXRoLm1heChtYXhNb250aGx5VGFyZ2V0LCBOdW1iZXIobW9udGhseVRhcmdldC50b0ZpeGVkKDApKSk7XG4gICAgICAgICAgICAgICAgc3RvY2tEYXRhLnB1c2goe3g6IHBlcmlvZEluZGV4LCB5OiBOdW1iZXIodG90YWxTdG9jay50b0ZpeGVkKDApKX0pO1xuICAgICAgICAgICAgICAgIGltbXVuaXNhdGlvbkRhdGEucHVzaCh7eDogcGVyaW9kSW5kZXgsIHk6IE51bWJlcihjb25zdW1lZC50b0ZpeGVkKDApKX0pO1xuICAgICAgICAgICAgICAgIG1vbnRobHlUYXJnZXREYXRhLnB1c2goe3g6IHBlcmlvZEluZGV4LCB5OiBOdW1iZXIobW9udGhseVRhcmdldC50b0ZpeGVkKDApKX0pO1xuICAgICAgICAgICAgICAgIGZvcmNlU3RhcnRaZXJvRGF0YS5wdXNoKHt4OiBwZXJpb2RJbmRleCwgeTogMH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZtLmRhdGFbaV0ubW9udGggPT0gTW9udGhTZXJ2aWNlLmdldE1vbnRoTnVtYmVyKGVuZE1vbnRoLm5hbWUuc3BsaXQoXCIgXCIpWzBdKSkge1xuICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnVwdGFrZSA9IHJlY2VpdmVkID09IDAgJiYgYXRIYW5kID09IDAgP1xuICAgICAgICAgICAgICAgICAgICAgICAgMCA6IE1hdGgucm91bmQoY29uc3VtZWQvKHRvdGFsU3RvY2spKjEwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBncmFwaGRhdGFVcHRha2UucHVzaCh7a2V5OiAnQXZhaWxhYmxlIFN0b2NrIChTdG9jayBiYWxhbmNlICsgSXNzdWVzKScsIHR5cGU6ICdiYXInLCB5QXhpczogMSwgdmFsdWVzOiBzdG9ja0RhdGF9KTtcbiAgICAgICAgICAgIGdyYXBoZGF0YVVwdGFrZS5wdXNoKHtrZXk6ICdDaGlsZHJlbiBJbW11bmlzZWQnLCB0eXBlOiAnYmFyJywgeUF4aXM6IDEsIHZhbHVlczogaW1tdW5pc2F0aW9uRGF0YX0pO1xuICAgICAgICAgICAgZ3JhcGhkYXRhVXB0YWtlLnB1c2goe2tleTogJ01vbnRobHkgVGFyZ2V0cycsIHR5cGU6ICdsaW5lJywgeUF4aXM6IDEsIHZhbHVlczogbW9udGhseVRhcmdldERhdGF9KTtcbiAgICAgICAgICAgIGdyYXBoZGF0YVVwdGFrZS5wdXNoKHtrZXk6ICcnLCB0eXBlOiAnbGluZScsIHlBeGlzOiAxLCBzdHJva2VXaWR0aDogMCwgdmFsdWVzOiBmb3JjZVN0YXJ0WmVyb0RhdGF9KTtcbiAgICAgICAgICAgIHZtLmdyYXBoVXB0YWtlID0gZ3JhcGhkYXRhVXB0YWtlO1xuICAgICAgICAgICAgdm0ubWF4TW9udGhseVRhcmdldCA9IG1heE1vbnRobHlUYXJnZXQ7XG5cbiAgICAgICAgICAgIHVwZGF0ZUxhYmVscygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRPcHRpb25zKCkge1xuICAgICAgICB2YXIgdXB0YWtlT3B0aW9ucyA9IENoYXJ0U3VwcG9ydFNlcnZpY2UuZ2V0T3B0aW9ucygnbXVsdGlDaGFydCcpO1xuICAgICAgICB1cHRha2VPcHRpb25zLmNoYXJ0LmNvbG9yID0gW1wiZ3JlZW5cIiwgXCJEb2RnZXJCbHVlXCIsIFwicmVkXCIsIFwid2hpdGVcIl07XG4gICAgICAgIHVwdGFrZU9wdGlvbnMuY2hhcnQud2lkdGggPSA5MDA7XG4gICAgICAgIHVwdGFrZU9wdGlvbnMuY2hhcnQubWFyZ2luID0ge2xlZnQ6IDcwLCB0b3A6IDkwfTtcbiAgICAgICAgdXB0YWtlT3B0aW9ucy5jaGFydC5sZWdlbmQud2lkdGggPSA5MDA7XG4gICAgICAgIHVwdGFrZU9wdGlvbnMuY2hhcnQubGVnZW5kLm1heEtleUxlbmd0aCA9IDUwO1xuICAgICAgICB1cHRha2VPcHRpb25zLmNoYXJ0LnhBeGlzLmF4aXNMYWJlbCA9IFwiTW9udGhzXCI7XG4gICAgICAgIHVwdGFrZU9wdGlvbnMuY2hhcnQueUF4aXMuYXhpc0xhYmVsID0gXCJcIjtcbiAgICAgICAgdXB0YWtlT3B0aW9ucy5jaGFydC54QXhpcy50aWNrRm9ybWF0ID0gZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICByZXR1cm4gYXBwSGVscGVycy5nZW5lcmF0ZUxhYmVsRnJvbVBlcmlvZCh2bS5wZXJpb2RJbmRleGVzW2RdLCAnQ1knKTtcbiAgICAgICAgfTtcbiAgICAgICAgdXB0YWtlT3B0aW9ucy5jaGFydC52YWx1ZUZvcm1hdCA9IGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgcmV0dXJuIHRpY2tGb3JtYXQoZDMuZm9ybWF0KCcuMGYnKSk7XG4gICAgICAgIH07XG4gICAgICAgIHVwdGFrZU9wdGlvbnMuY2hhcnQubGVnZW5kLmRpc3BhdGNoLnN0YXRlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB1cGRhdGVMYWJlbHMoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHVwdGFrZU9wdGlvbnM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlTGFiZWxzKCkge1xuICAgICAgICBDaGFydFN1cHBvcnRTZXJ2aWNlLmNsZWFyTGFiZWxzKCk7XG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgQ2hhcnRTdXBwb3J0U2VydmljZS5pbml0TGFiZWxzKCk7XG4gICAgICAgICAgICAvKiBjaGFydC5jbGlwRWRnZSBzZWVtcyBub3QgdG8gYmUgd29ya2luZyxcbiAgICAgICAgICAgIHRoaXMgc2hvdWxkIHNlcnZlIGFzIGEgaGFjayAqL1xuICAgICAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52LW11bHRpYmFyIGdcIikuYXR0cihcImNsaXAtcGF0aFwiLCBcIlwiKTtcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UGVyaW9kSW5kZXgocGVyaW9kKSB7XG4gICAgICAgIGlmICh2bS5wZXJpb2RJbmRleGVzLmluZGV4T2YocGVyaW9kKSA9PSAtMSkgdm0ucGVyaW9kSW5kZXhlcy5wdXNoKHBlcmlvZCk7XG4gICAgICAgIHJldHVybiB2bS5wZXJpb2RJbmRleGVzLmluZGV4T2YocGVyaW9kKTtcbiAgICB9XG59XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJykuY29udHJvbGxlcignU3RvY2tvdXRUcmVuZENvbnRyb2xsZXInLCBTdG9ja291dFRyZW5kQ29udHJvbGxlcik7XG5cblN0b2Nrb3V0VHJlbmRDb250cm9sbGVyLiRpbmplY3QgPSBbXG4gICAgJyRzY29wZScsXG4gICAgJ1N0b2NrU2VydmljZScsXG4gICAgJ01vbnRoU2VydmljZScsXG4gICAgJ0NoYXJ0U3VwcG9ydFNlcnZpY2UnLFxuICAgICdDaGFydFBERkV4cG9ydCcsXG4gICAgJyR0aW1lb3V0J1xuXTtcbmZ1bmN0aW9uIFN0b2Nrb3V0VHJlbmRDb250cm9sbGVyKCRzY29wZSwgU3RvY2tTZXJ2aWNlLCBNb250aFNlcnZpY2UsIENoYXJ0U3VwcG9ydFNlcnZpY2UsIENoYXJ0UERGRXhwb3J0LCAkdGltZW91dCkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uZXhwb3J0UERGID0gZnVuY3Rpb24obmFtZSkgeyBDaGFydFBERkV4cG9ydC5leHBvcnRXaXRoU3R5bGVyKHZtLCBuYW1lKTsgfTtcbiAgICB2bS5ncmFwaE9wdGlvbnMgPSBnZXRPcHRpb25zKCk7XG4gICAgdm0uZ3JhcGhEYXRhID0gW107XG4gICAgdm0ucGVyaW9kSW5kZXhlcyA9IFtdO1xuICAgIHZtLmNvbXBhY3RWYWx1ZXMgPSBmYWxzZTtcblxuICAgICRzY29wZS4kb24oJ3JlZnJlc2gnLCB1cGRhdGVDaGFydCk7XG4gICAgJHNjb3BlLiR3YXRjaCgndm0uY29tcGFjdFZhbHVlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB1cGRhdGVDaGFydFdpdGhEYXRhKHZtLmRhdGEpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlQ2hhcnQoZSwgc3RhcnRNb250aCwgZW5kTW9udGgsIGRpc3RyaWN0LCB2YWNjaW5lKSB7XG4gICAgICAgIFN0b2NrU2VydmljZS5nZXRTdG9ja0J5RGlzdHJpY3RWYWNjaW5lKHN0YXJ0TW9udGgubmFtZSwgZW5kTW9udGgubmFtZSwgZGlzdHJpY3QubmFtZSwgdmFjY2luZS5uYW1lKVxuICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuICAgICAgICAgICAgdXBkYXRlQ2hhcnRXaXRoRGF0YSh2bS5kYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlQ2hhcnRXaXRoRGF0YShkYXRhKSB7XG4gICAgICAgIHZhciBncmFwaERhdGEgPSBbXTtcbiAgICAgICAgdmFyIHN0b2NrRGF0YSA9IFtdO1xuICAgICAgICB2YXIgc3VwcGx5RGF0YSA9IFtdO1xuICAgICAgICB2YXIgb3JkZXJlZERhdGEgPSBbXTtcblxuICAgICAgICB2bS5wZXJpb2RJbmRleGVzID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5kYXRhLmxlbmd0aCA7IGkrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSB2bS5kYXRhW2ldO1xuICAgICAgICAgICAgLyogQ2VydGFpbiBkYXRhIGhhZCBpbnZhbGlkIHBlcmlvZHMgbGlrZSAyMDE3MiBpbnN0ZWFkIG9mXG4gICAgICAgICAgICAgICAgMjAxNzAyIHdoaWNoIHdlcmUgY2F1c2luZyBlcnJvcnMuIEhlbmNlIHRoZSBmaWx0ZXIgYmVsb3cuICovXG4gICAgICAgICAgICBpZiAoaXRlbS5wZXJpb2QudG9TdHJpbmcoKS5sZW5ndGggPT0gNSkgY29udGludWU7XG5cbiAgICAgICAgICAgIC8vdmFyIG1vbnRoSW5kZXggPSBhcHBIZWxwZXJzLmdldE1vbnRoSW5kZXhGcm9tUGVyaW9kKGl0ZW0ucGVyaW9kLCAnQ1knKTtcbiAgICAgICAgICAgIHZhciBwZXJpb2RJbmRleCA9IGdldFBlcmlvZEluZGV4KGl0ZW0ucGVyaW9kKVxuICAgICAgICAgICAgdmFyIGF0SGFuZCA9IGl0ZW0uYXRfaGFuZCA9PSB1bmRlZmluZWQgPyBpdGVtLnRvdGFsX2F0X2hhbmQgOiBpdGVtLmF0X2hhbmQ7XG4gICAgICAgICAgICB2YXIgb3JkZXJlZCA9IGl0ZW0ub3JkZXJlZCA9PSB1bmRlZmluZWQgPyBpdGVtLnRvdGFsX29yZGVyZWQgOiBpdGVtLm9yZGVyZWQ7XG4gICAgICAgICAgICB2YXIgcmVjZWl2ZWQgPSBpdGVtLnJlY2VpdmVkID09IHVuZGVmaW5lZCA/IGl0ZW0udG90YWxfcmVjZWl2ZWQgOiBpdGVtLnJlY2VpdmVkO1xuXG4gICAgICAgICAgICBzdG9ja0RhdGEucHVzaCh7eDogcGVyaW9kSW5kZXgsIHk6IE51bWJlcihhdEhhbmQudG9GaXhlZCgwKSl9KTtcbiAgICAgICAgICAgIG9yZGVyZWREYXRhLnB1c2goe3g6IHBlcmlvZEluZGV4LCB5OiBOdW1iZXIob3JkZXJlZC50b0ZpeGVkKDApKX0pO1xuICAgICAgICAgICAgc3VwcGx5RGF0YS5wdXNoKHt4OiBwZXJpb2RJbmRleCwgeTogTnVtYmVyKHJlY2VpdmVkLnRvRml4ZWQoMCkpfSk7XG4gICAgICAgIH1cblxuICAgICAgICBncmFwaERhdGEucHVzaCh7a2V5OiAnU3RvY2sgQmFsYW5jZScsIHZhbHVlczogc3RvY2tEYXRhfSk7XG4gICAgICAgIGdyYXBoRGF0YS5wdXNoKHtrZXk6ICdPcmRlcnMnLCB2YWx1ZXM6IG9yZGVyZWREYXRhfSk7XG4gICAgICAgIGdyYXBoRGF0YS5wdXNoKHtrZXk6ICdTdXBwbHkgQnkgTk1TJywgdmFsdWVzOiBzdXBwbHlEYXRhfSk7XG4gICAgICAgIHZtLmdyYXBoRGF0YSA9IGdyYXBoRGF0YTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRPcHRpb25zKCkge1xuICAgICAgICB2YXIgY2hhcnRPcHRpb25zID0gQ2hhcnRTdXBwb3J0U2VydmljZS5nZXRPcHRpb25zKCdtdWx0aUJhckNoYXJ0Jyk7XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC5jb2xvciA9IFtcImdyZWVuXCIsIFwiRG9kZ2VyQmx1ZVwiLCBcIk9yYW5nZVwiXTtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LndpZHRoID0gOTAwO1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQubWFyZ2luID0ge2xlZnQ6IDcwLCB0b3A6IDcwfTtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LmxlZ2VuZC53aWR0aCA9IDkwMDtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LnhBeGlzLmF4aXNMYWJlbCA9IFwiTW9udGhzXCI7XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC55QXhpcy5heGlzTGFiZWwgPSBcIlwiO1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQueEF4aXMudGlja0Zvcm1hdCA9IGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgcmV0dXJuIGFwcEhlbHBlcnMuZ2VuZXJhdGVMYWJlbEZyb21QZXJpb2Qodm0ucGVyaW9kSW5kZXhlc1tkXSwgJ0NZJyk7XG4gICAgICAgICAgICAvL3JldHVybiBhcHBIZWxwZXJzLmdldE1vbnRoRnJvbU51bWJlcihkLCAnQ1knKTtcbiAgICAgICAgfTtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LnZhbHVlRm9ybWF0ID0gZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICByZXR1cm4gdGlja0Zvcm1hdChkMy5mb3JtYXQoJy4wZicpKTtcbiAgICAgICAgfTtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LmRpc3BhdGNoLnJlbmRlckVuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHZtLmNvbXBhY3RWYWx1ZXMpIENoYXJ0U3VwcG9ydFNlcnZpY2UuaW5pdExhYmVscyh0cnVlKTtcbiAgICAgICAgICAgIGVsc2UgQ2hhcnRTdXBwb3J0U2VydmljZS5pbml0TGFiZWxzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNoYXJ0T3B0aW9ucztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQZXJpb2RJbmRleChwZXJpb2QpIHtcbiAgICAgICAgaWYgKHZtLnBlcmlvZEluZGV4ZXMuaW5kZXhPZihwZXJpb2QpID09IC0xKSB2bS5wZXJpb2RJbmRleGVzLnB1c2gocGVyaW9kKTtcbiAgICAgICAgcmV0dXJuIHZtLnBlcmlvZEluZGV4ZXMuaW5kZXhPZihwZXJpb2QpO1xuICAgIH1cblxufVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpXG4uY29udHJvbGxlcignVW5lcGlDb250cm9sbGVyJywgW1xuICAgICckc2NvcGUnLCAnQ292ZXJhZ2VTZXJ2aWNlJywnU3RvY2tTZXJ2aWNlJyxcbiAgICAnTW9udGhTZXJ2aWNlJywgJyRyb290U2NvcGUnLCAnTmdUYWJsZVBhcmFtcycsXG4gICAgJ0ZpbHRlclNlcnZpY2UnLCAnRnJpZGdlU2VydmljZScsICdDb3ZlcmFnZUNhbGN1bGF0b3InLCAnJHRpbWVvdXQnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgQ292ZXJhZ2VTZXJ2aWNlLCBTdG9ja1NlcnZpY2UsXG4gICAgICAgIE1vbnRoU2VydmljZSwgJHJvb3RTY29wZSwgTmdUYWJsZVBhcmFtcyxcbiAgICAgICAgRmlsdGVyU2VydmljZSwgRnJpZGdlU2VydmljZSwgQ292ZXJhZ2VDYWxjdWxhdG9yLCAkdGltZW91dClcbiAgICB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZhciBzaGVsbFNjb3BlID0gJHNjb3BlLiRwYXJlbnQ7XG4gICAgICAgIHNoZWxsU2NvcGUuY2hpbGQgPSAkc2NvcGU7XG5cbiAgICAgICAgZnVuY3Rpb24gcGVyaW9kRGlzcGxheShwZXJpb2QpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBtb250aCA9IHBhcnNlSW50KHBlcmlvZC5zbGljZSg0LDYpKTtcbiAgICAgICAgICAgIHJldHVybiBNb250aFNlcnZpY2UuZ2V0TW9udGhOYW1lKG1vbnRoKSArIFwiIFwiICsgcGVyaW9kLnNsaWNlKDAsNClcbiAgICAgICAgfVxuXG4gICAgICAgIHZtLmdldFVuZXBpQ292ZXJhZ2UgPSBmdW5jdGlvbihwZXJpb2QsIGRpc3RyaWN0LCB2YWNjaW5lKSB7XG4gICAgICAgICAgICB2YXIgcGFyYW1zID0ge3BlcmlvZCwgZGlzdHJpY3R9O1xuXG4gICAgICAgICAgICB2YXIgZ2V0VmFsdWVTdW0gPSBmdW5jdGlvbihkYXRhLCBuYW1lLCB2YWNjaW5lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEucmVkdWNlKGZ1bmN0aW9uKGFjY3VtdWxhdG9yLCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUudmFjY2luZV9fbmFtZSA9PSB2YWNjaW5lKSByZXR1cm4gYWNjdW11bGF0b3IgKyB2YWx1ZVtuYW1lXVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBDb3ZlcmFnZVNlcnZpY2UuZ2V0VmFjY2luZURvc2VzQnlQZXJpb2QocGFyYW1zKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFibGVEYXRhID0gW107XG4gICAgICAgICAgICAgICAgdmFyIHBlbnRhQ1IgPSAwLFxuICAgICAgICAgICAgICAgICAgICBwY3ZDUiA9IDA7XG5cbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmRpc3RyaWN0ID0gZGlzdHJpY3Q7XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5HYXAgPSAwO1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZHJvcG91dF9QZW50YSA9IDA7XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5kcm9wb3V0X2hwdiA9IDA7XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5jYXRlZ29yeSA9IDA7XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5wZXJpb2RNb250aCA9IHBlcmlvZERpc3BsYXkocGVyaW9kKTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YVBlcmlvZCA9IGRhdGFbaV0ucGVyaW9kXG4gICAgICAgICAgICAgICAgICAgIHZhciBsYXN0RG9zZSA9IGRhdGFbaV0udG90YWxfbGFzdF9kb3NlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmlyc3REb3NlID0gZGF0YVtpXS50b3RhbF9maXJzdF9kb3NlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2Vjb25kRG9zZSA9IGRhdGFbaV0udG90YWxfc2Vjb25kX2Rvc2U7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwbGFubmVkID0gZGF0YVtpXS50b3RhbF9wbGFubmVkO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmFjY2luZSA9IGRhdGFbaV0udmFjY2luZV9fbmFtZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YVBlcmlvZCAhPSBwZXJpb2QpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIFN1bSB1cCB0aGUgdmFsdWVzIGZyb20gc3RhcnQgb2YgeWVhciB0byBzZWxlY3RlZCBwZXJpb2RcbiAgICAgICAgICAgICAgICAgICAgIHRvIGNhbGN1bGF0ZSBBbm51YWxpemVkIENvdmVyYWdlIChhdm9jKSAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG90YWxMYXN0RG9zZSA9IGdldFZhbHVlU3VtKGRhdGEsICd0b3RhbF9sYXN0X2Rvc2UnLCB2YWNjaW5lKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvdGFsUGxhbm5lZCA9IGdldFZhbHVlU3VtKGRhdGEsICd0b3RhbF9wbGFubmVkJywgdmFjY2luZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvdmVyYWdlUmF0ZSA9IENvdmVyYWdlQ2FsY3VsYXRvci5jYWxjdWxhdGVDb3ZlcmFnZVJhdGUobGFzdERvc2UsIHBsYW5uZWQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZHJvcG91dFJhdGUgPSBDb3ZlcmFnZUNhbGN1bGF0b3IuY2FsY3VsYXRlRHJvcG91dFJhdGUoZmlyc3REb3NlLCBsYXN0RG9zZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZWRDYXRlZ29yeSA9IENvdmVyYWdlQ2FsY3VsYXRvci5jYWxjdWxhdGVSZWRDYXRlZ29yeShmaXJzdERvc2UsIGxhc3REb3NlLCBwbGFubmVkKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF2b2MgPSBDb3ZlcmFnZUNhbGN1bGF0b3IuY2FsY3VsYXRlQ292ZXJhZ2VSYXRlKHRvdGFsTGFzdERvc2UsIHRvdGFsUGxhbm5lZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGFibGVEYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3ZhY2NpbmUnOiB2YWNjaW5lLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3BsYW5uZWRfY29uc3VtcHRpb24nOiBwbGFubmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvdmVyYWdlX3JhdGUnOiBjb3ZlcmFnZVJhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXZvYyc6IGF2b2NcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh2YWNjaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiUEVOVEFcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZW50YUNSID0gY292ZXJhZ2VSYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZHJvcG91dF9QZW50YSA9IGRyb3BvdXRSYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuY2F0ZWdvcnkgPSByZWRDYXRlZ29yeTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJQQ1ZcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwY3ZDUiA9IGNvdmVyYWdlUmF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJIUFZcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmRyb3BvdXRfaHB2ID0gZHJvcG91dFJhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLkdhcCA9IHBlbnRhQ1IgLSBwY3ZDUjtcblxuICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSB7cGFnZTogMSwgY291bnQ6IDEwfTtcbiAgICAgICAgICAgICAgICB2YXIgc2V0dGluZ3MgPSB7ZmlsdGVyRGVsYXk6IDAsIGNvdW50czogW10sIGRhdGE6IHRhYmxlRGF0YX07XG4gICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNEb3NlcyA9IG5ldyBOZ1RhYmxlUGFyYW1zKHBhcmFtcywgc2V0dGluZ3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB2bS5nZXRVbmVwaU5hdGlvbmFsU3RvY2sgPSBmdW5jdGlvbihlbmRNb250aCwgZGlzdHJpY3QpIHtcbiAgICAgICAgICAgIFN0b2NrU2VydmljZS5nZXRVbmVwaVN0b2NrKGVuZE1vbnRoLCBkaXN0cmljdCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRhYmxlZGF0YUFsbHN0b2NrID0gW107XG4gICAgICAgICAgICAgICAgdmFyIHN0b2NrZWRPdXRBbnRpZ2VucyA9IDA7XG5cbiAgICAgICAgICAgICAgICAvKiBUdXJuIHRoZSBkaXN0cmljdCBiYXNlZCBkYXRhIGludG8gYWdncmVnYXRlZFxuICAgICAgICAgICAgICAgIHZhY2NpbmUgYmFzZWQgZGF0YSAqL1xuICAgICAgICAgICAgICAgIHZhciB2YWNjaW5lRGF0YSA9IGRhdGEucmVkdWNlKGZ1bmN0aW9uKGFjYywgaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoISAoaXRlbS52YWNjaW5lIGluIGFjYykpXG4gICAgICAgICAgICAgICAgICAgICAgICBhY2NbaXRlbS52YWNjaW5lXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdF9oYW5kOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b2NrX3JlcXVpcmVtZW50X19taW5pbXVtOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY2VpdmVkOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyZWQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3VtZWQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlX3N0b2NrOiAwXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGFjY1tpdGVtLnZhY2NpbmVdLmF0X2hhbmQgKz0gaXRlbS5hdF9oYW5kO1xuICAgICAgICAgICAgICAgICAgICBhY2NbaXRlbS52YWNjaW5lXS5zdG9ja19yZXF1aXJlbWVudF9fbWluaW11bSArPSBpdGVtLnN0b2NrX3JlcXVpcmVtZW50X19taW5pbXVtO1xuICAgICAgICAgICAgICAgICAgICBhY2NbaXRlbS52YWNjaW5lXS5yZWNlaXZlZCArPSBpdGVtLnJlY2VpdmVkO1xuICAgICAgICAgICAgICAgICAgICBhY2NbaXRlbS52YWNjaW5lXS5vcmRlcmVkICs9IGl0ZW0ub3JkZXJlZDtcbiAgICAgICAgICAgICAgICAgICAgYWNjW2l0ZW0udmFjY2luZV0uY29uc3VtZWQgKz0gaXRlbS5jb25zdW1lZDtcbiAgICAgICAgICAgICAgICAgICAgYWNjW2l0ZW0udmFjY2luZV0uYXZhaWxhYmxlX3N0b2NrICs9IGl0ZW0uYXZhaWxhYmxlX3N0b2NrO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICAgICAgfSwge30pO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgdmFjY2luZSBpbiB2YWNjaW5lRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXRIYW5kID0gdmFjY2luZURhdGFbdmFjY2luZV0uYXRfaGFuZDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1pblN0b2NrID0gdmFjY2luZURhdGFbdmFjY2luZV0uc3RvY2tfcmVxdWlyZW1lbnRfX21pbmltdW07XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcmRlcmVkID0gdmFjY2luZURhdGFbdmFjY2luZV0ub3JkZXJlZDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlY2VpdmVkID0gdmFjY2luZURhdGFbdmFjY2luZV0ucmVjZWl2ZWQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb25zdW1lZCA9IHZhY2NpbmVEYXRhW3ZhY2NpbmVdLmNvbnN1bWVkO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXZhaWxhYmxlU3RvY2sgPSBhdEhhbmQgKyByZWNlaXZlZDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1vbnRoc1N0b2NrID0gTWF0aC5yb3VuZChhdEhhbmQgLyBtaW5TdG9jayk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vbnRoc1N0b2NrID09IDApIHN0b2NrZWRPdXRBbnRpZ2VucysrO1xuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YUFsbHN0b2NrLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFjY2luZTogdmFjY2luZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIE1vbnRoc19zdG9jazogbW9udGhzU3RvY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWZpbGxfcmF0ZTogKG9yZGVyZWQgPT0gMCkgPyAwIDogTWF0aC5yb3VuZCgocmVjZWl2ZWQgLyBvcmRlcmVkKSAqIDEwMCksXG4gICAgICAgICAgICAgICAgICAgICAgICB1cHRha2VfcmF0ZTogKGF2YWlsYWJsZVN0b2NrID09IDApID8gMCA6IE1hdGgucm91bmQoKGNvbnN1bWVkIC8gYXZhaWxhYmxlU3RvY2spICogMTAwKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLkFudGlnZW5fc3RvY2tlZG91dCA9IHN0b2NrZWRPdXRBbnRpZ2VucztcblxuICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSB7cGFnZTogMSwgY291bnQ6IDEwfTtcbiAgICAgICAgICAgICAgICB2YXIgc2V0dGluZ3MgPSB7ZmlsdGVyRGVsYXk6IDAsIGNvdW50czogW10sIGRhdGE6IHRhYmxlZGF0YUFsbHN0b2NrfTtcbiAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc1N0b2NrID0gbmV3IE5nVGFibGVQYXJhbXMocGFyYW1zLCBzZXR0aW5ncyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAgICAgdm0uZ2V0VW5lcGlTdG9jayA9IGZ1bmN0aW9uKGVuZE1vbnRoLCBkaXN0cmljdCkge1xuXG4gICAgICAgICAgICAgICAgdm0uZW5kTW9udGggPSB2bS5lbmRNb250aCA/IHZtLmVuZE1vbnRoIDogXCJcIjtcblxuICAgICAgICAgICAgICAgIFN0b2NrU2VydmljZS5nZXRVbmVwaVN0b2NrKCBlbmRNb250aCwgZGlzdHJpY3QpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZWRhdGFBbGxzdG9jayA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuXG5cblxuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFBbGxzdG9jayA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zU3RvY2sgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YUFsbHN0b2NrLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuQW50aWdlbl9zdG9ja2Vkb3V0ID0gMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5kYXRhLmxlbmd0aCA7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZtLmRhdGFbaV0uTW9udGhzX3N0b2NrID09IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLkFudGlnZW5fc3RvY2tlZG91dCsrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICBDb2xkIENoYWluICYgVW5lcGkgRGlzdHJpY3QgZmlsdGVycyB1c2VkIGRpZmZlcmVudCBkYXRhIHNvdXJjZXNcbiAgICAgICAgICAgICAgICBGb3IgdGhhdCByZWFzb24gdG8gdXNlIHRoZSBDb2xkIENoYWluIGFwaSwgdGhlIGRpc3RyaWN0IG5hbWVcbiAgICAgICAgICAgICAgICBoYXMgdG8gYmUgcmVmb3JtYXR0ZWQgdG8gbWF0Y2ggdGhlIGNvbGQgY2hhaW4gZGlzdHJpY3QgZmlsdGVyLlxuICAgICAgICAgICAgICAgIEBUb2RvOiBTdGFuZGFyZGl6ZSB0aGUgZGlzdHJpY3QgdmFsdWVzXG4gICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB2bS5wYXJzZURpc3RyaWN0ID0gZnVuY3Rpb24oZGlzdHJpY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRpc3RyaWN0LnJlcGxhY2UoXCIgRGlzdHJpY3RcIiwgXCJcIikudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdm0uZ2V0VW5lcGlDb2xkQ2hhaW5DYXBhY2l0eSA9IGZ1bmN0aW9uKGVuZE1vbnRoLCBkaXN0cmljdCkge1xuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdCA9IHZtLnBhcnNlRGlzdHJpY3QoZGlzdHJpY3QpO1xuXG4gICAgICAgICAgICAgICAgICAgIEZyaWRnZVNlcnZpY2UuZ2V0RnJpZGdlRmFjaWxpdHlDYXBhY2l0eSh1bmRlZmluZWQsIGVuZE1vbnRoLCBkaXN0cmljdCwgdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWV0cmljcyA9IEZyaWRnZVNlcnZpY2UuZ2V0RnJpZGdlQ2FwYWNpdHlNZXRyaWNzKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5tZXRyaWNzID0gbWV0cmljcztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQucGVyID0gYXBwSGVscGVycy5wZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2bS5nZXRVbmVwaUNvbGRDaGFpbkZ1bmN0aW9uYWxpdHkgPSBmdW5jdGlvbihlbmRNb250aCwgZGlzdHJpY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3QgPSB2bS5wYXJzZURpc3RyaWN0KGRpc3RyaWN0KTtcblxuICAgICAgICAgICAgICAgICAgICBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZURpc3RyaWN0UmVmcmlnZXJhdG9yKHVuZGVmaW5lZCwgZW5kTW9udGgsIGRpc3RyaWN0LCB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFnZ3JlZ2F0ZXMgPSBkYXRhLnJlZHVjZShmdW5jdGlvbihhY2MsIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2MudG90YWxFcXVpcG1lbnQgKz0gaXRlbS5udW1iZXJfZXhpc3Rpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjLnRvdGFsV29ya2luZ1dlbGwgKz0gaXRlbS53b3JraW5nX3dlbGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjLnRvdGFsTm90V29ya2luZ1dlbGwgKz0gaXRlbS5ub3Rfd29ya2luZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2MudG90YWxOZWVkTWFpbnRlbmFuY2UgKz0gaXRlbS5uZWVkc19tYWludGVuYW5jZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2MudG90YWxGYWNpbGl0aWVzICs9IGl0ZW0udG90YWxfZmFjaWxpdGllcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5mYWNpbGl0eV9fdHlwZV9fZ3JvdXAgPT0gJ0Rpc3RyaWN0IFN0b3JlJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjLnRvdGFsRGlzdHJpY3RTdG9yZXMgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwge3RvdGFsRXF1aXBtZW50OjAsIHRvdGFsRmFjaWxpdGllczowLCB0b3RhbFdvcmtpbmdXZWxsOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsTm90V29ya2luZ1dlbGw6MCwgdG90YWxOZWVkTWFpbnRlbmFuY2U6IDAsIHRvdGFsRGlzdHJpY3RTdG9yZXM6IDB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5udW1iZXJPZkNvbGRjaGFpbkVxdWlwbWVudCA9IGFnZ3JlZ2F0ZXMudG90YWxFcXVpcG1lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQubnVtYmVyV29ya2luZ1dlbGwgPSBhZ2dyZWdhdGVzLnRvdGFsV29ya2luZ1dlbGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLm51bWJlck5vdFdvcmtpbmdXZWxsID0gYWdncmVnYXRlcy50b3RhbE5vdFdvcmtpbmdXZWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5udW1iZXJOZWVkTWFpbnRlbmFuY2UgPSBhZ2dyZWdhdGVzLnRvdGFsTmVlZE1haW50ZW5hbmNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5wZXIgPSBhcHBIZWxwZXJzLnBlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQubnVtYmVyV29ya2luZyA9IGFnZ3JlZ2F0ZXMudG90YWxFcXVpcG1lbnQgLSBhZ2dyZWdhdGVzLnRvdGFsTm90V29ya2luZ1dlbGw7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIEZyaWRnZVNlcnZpY2UuZ2V0RmFjaWxpdHlUeXBlcyhkaXN0cmljdCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZGF0YS5yZWR1Y2UoZnVuY3Rpb24oYWNjLCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0udHlwZV9fZ3JvdXAgPT0gJ0Rpc3RyaWN0IFN0b3JlJykgYWNjLmR2cyA9IGl0ZW0uY291bnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBhY2Mub3RoZXJzICs9IGl0ZW0uY291bnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtkdnM6IDAsIG90aGVyczogMH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLm51bWJlck9mRGlzdHJpY3RTdG9yZXMgPSByZXN1bHQuZHZzO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5udW1iZXJPZkZhY2lsaXRpZXMgPSByZXN1bHQub3RoZXJzO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdm0uZW5hYmxlUERGRG93bmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZG93bmxvYWRQREYgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnByaW50VmlldyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwZGYgPSBuZXcganNQREYoJ3AnLCAnbW0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGRmLmFkZEhUTUwoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmVwaVJlcG9ydFwiKSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGRmLnNhdmUoJ3VuZXBpLXJlcG9ydC5wZGYnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxMDApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQucHJpbnRWaWV3ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICRzY29wZS4kb24oJ3JlZnJlc2gnLCBmdW5jdGlvbihlLCBzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoc3RhcnRNb250aC5uYW1lICYmIGVuZE1vbnRoLm5hbWUgJiYgZGlzdHJpY3QubmFtZSAmJiB2YWNjaW5lLm5hbWUpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldFVuZXBpQ292ZXJhZ2UoZW5kTW9udGgucGVyaW9kLCBkaXN0cmljdC5uYW1lLCB2YWNjaW5lLm5hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlzdHJpY3QubmFtZSA9PSBcIk5hdGlvbmFsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRVbmVwaU5hdGlvbmFsU3RvY2soZW5kTW9udGgubmFtZSwgZGlzdHJpY3QubmFtZSwgdmFjY2luZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0VW5lcGlTdG9jayhlbmRNb250aC5uYW1lLCBkaXN0cmljdC5uYW1lLCB2YWNjaW5lLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0VW5lcGlDb2xkQ2hhaW5DYXBhY2l0eShlbmRNb250aC5uYW1lLCBkaXN0cmljdC5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldFVuZXBpQ29sZENoYWluRnVuY3Rpb25hbGl0eShlbmRNb250aC5uYW1lLCBkaXN0cmljdC5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmVuYWJsZVBERkRvd25sb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuICAgICAgICBdKTtcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiJdfQ==
