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
                    
                    if ($.inArray(vaccine, ['PENTA', 'PCV', 'OPV', 'HPV', 'IPV', 'TT']) != -1)
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
                                        $.inArray(vaccine, ['PENTA', 'PCV', 'OPV', 'HPV', 'IPV', 'TT']) == -1)
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

    $scope.$on('refresh', updateChart);

    function updateChart(e, startMonth, endMonth, district, vaccine) {
        StockService.getStockByDistrictVaccine(startMonth.name, endMonth.name, district.name, vaccine.name)
        .then(function(data) {
            vm.data = angular.copy(data);

            var graphData = [];
            var stockData = [];
            var supplyData = [];

            vm.periodIndexes = [];

            for (var i = 0; i < vm.data.length ; i++) {
                var item = vm.data[i];
                /* Certain data had invalid periods like 20172 instead of
                    201702 which were causing errors. Hence the filter below. */
                if (item.period.toString().length == 5) continue;

                //var monthIndex = appHelpers.getMonthIndexFromPeriod(item.period, 'CY');
                var periodIndex = getPeriodIndex(item.period)
                var atHand = item.at_hand == undefined ? item.total_at_hand : item.at_hand;
                var received = item.received == undefined ? item.total_received : item.received;

                stockData.push({x: periodIndex, y: Number(atHand.toFixed(0))});
                supplyData.push({x: periodIndex, y: Number(received.toFixed(0))});
            }

            graphData.push({key: 'Stock Balance', values: stockData});
            graphData.push({key: 'Supply By NMS', values: supplyData});
            vm.graphData = graphData;
        });
    }

    function getOptions() {
        var chartOptions = ChartSupportService.getOptions('multiBarChart');
        chartOptions.chart.color = ["green", "DodgerBlue"];
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
                            return acc;
                        }, {totalEquipment:0, totalFacilities:0, totalWorkingWell: 0,
                            totalNotWorkingWell:0, totalNeedMaintenance: 0});

                        shellScope.child.numberOfColdchainEquipment = aggregates.totalEquipment;
                        shellScope.child.numberOfFacilities = aggregates.totalFacilities;
                        shellScope.child.numberWorkingWell = aggregates.totalWorkingWell;
                        shellScope.child.numberNotWorkingWell = aggregates.totalNotWorkingWell;
                        shellScope.child.numberNeedMaintenance = aggregates.totalNeedMaintenance;
                        shellScope.child.per = appHelpers.per;
                        shellScope.child.numberWorking = aggregates.totalEquipment - aggregates.totalNotWorkingWell;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9oZWxwZXJzLmpzIiwic2hhcmVkL2FubnVhbFNlcnZpY2UuanMiLCJzaGFyZWQvY2hhcnRQREZFeHBvcnRTZXJ2aWNlLmpzIiwic2hhcmVkL2NoYXJ0U3VwcG9ydFNlcnZpY2UuanMiLCJzaGFyZWQvY292ZXJhZ2VDYWxjdWxhdG9yU2VydmljZS5qcyIsInNoYXJlZC9jb3ZlcmFnZVNlcnZpY2UuanMiLCJzaGFyZWQvZmlsdGVyU2VydmljZS5qcyIsInNoYXJlZC9maW5hbmNlU2VydmljZS5qcyIsInNoYXJlZC9mcmlkZ2VTZXJ2aWNlLmpzIiwic2hhcmVkL21haW5Db250cm9sbGVyLmpzIiwic2hhcmVkL21hcFN1cHBvcnRTZXJ2aWNlLmpzIiwic2hhcmVkL3N0b2NrU2VydmljZS5qcyIsImNvbXBvbmVudHMvY292ZXJhZ2UvYW5udWFsQ292ZXJhZ2VDb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9jb3ZlcmFnZS9jb3ZlcmFnZUNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL2ZpbmFuY2UvZmluYW5jZURhdGFDb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9maW5hbmNlL21haW5GaW5hbmNlQ29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvZnJpZGdlL2ZyaWRnZUNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL2ltcG9ydC9nZW5lcmljSW1wb3J0Q29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvcGxhbm5pbmcvUGxhbm5pbmdDb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9zdG9jay9zdG9ja0NvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL3N0b2NrL3N0b2NrVXB0YWtlQ29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvc3RvY2svc3RvY2tvdXRUcmVuZENvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL3VuZXBpL1VuZXBpQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdmVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICh3aW5kb3csIGRvY3VtZW50KSB7XG4gICAgICd1c2Ugc3RyaWN0JztcblxuICAgICB2YXIgYXBwSGVscGVycyA9IHdpbmRvdy5hcHBIZWxwZXJzIHx8ICh3aW5kb3cuYXBwSGVscGVycyA9IHt9KTtcblxuICAgICB2YXIgcGVyID0gZnVuY3Rpb24odmFsdWUsIHRvdGFsKSB7XG4gICAgICAgICB2YXIgcGVyY2VudGFnZSA9ICh2YWx1ZS90b3RhbCkgKiAxMDA7XG4gICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChwZXJjZW50YWdlICogMTApIC8gMTA7XG4gICAgIH07XG5cbiAgICAgdmFyIGdlbmVyYXRlTGFiZWxGcm9tUGVyaW9kID0gZnVuY3Rpb24ocGVyaW9kKSB7XG4gICAgICAgICBwZXJpb2QgPSBwZXJpb2QudG9TdHJpbmcoKTtcbiAgICAgICAgIHZhciB5ZWFyID0gcGVyaW9kLnN1YnN0cigyLDIpO1xuICAgICAgICAgdmFyIG1vbnRoID0gTnVtYmVyKHBlcmlvZC5zdWJzdHIoNCwyKSk7XG5cbiAgICAgICAgIHZhciBtb250aHMgPSBbJycsICdKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcHQnLCAnT2N0JywgJ05vdicsICdEZWMnXTtcbiAgICAgICAgIHJldHVybiBtb250aHNbbW9udGhdICsgXCInXCIreWVhcjtcbiAgICB9O1xuXG4gICAgdmFyIGdlbmVyYXRlRnVsbExhYmVsRnJvbVBlcmlvZCA9IGZ1bmN0aW9uKHBlcmlvZCkge1xuICAgICAgICBwZXJpb2QgPSBwZXJpb2QudG9TdHJpbmcoKTtcbiAgICAgICAgdmFyIHllYXIgPSBwZXJpb2Quc3Vic3RyKDAsNCk7XG4gICAgICAgIHZhciBtb250aCA9IE51bWJlcihwZXJpb2Quc3Vic3RyKDQsMikpO1xuXG4gICAgICAgIHZhciBtb250aHMgPSBbJycsICdKYW51YXJ5JywgJ0ZlYnJ1YXJ5JywgJ01hcmNoJywgJ0FwcmlsJywgJ01heScsICdKdW5lJyxcbiAgICAgICAgICAgICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsICdOb3ZlbWJlcicsICdEZWNlbWJlciddO1xuICAgICAgICByZXR1cm4gbW9udGhzW21vbnRoXSArIFwiIFwiK3llYXI7XG4gICB9O1xuXG4gICAgdmFyIGdldE1vbnRoRnJvbU51bWJlciA9IGZ1bmN0aW9uKHZhbHVlLCB5ZWFyVHlwZSkge1xuICAgICAgICB2YXIgbW9udGhzID0gWycnLCAnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXB0JywgJ09jdCcsICdOb3YnLCAnRGVjJ107XG4gICAgICAgIHZhciBtb250aHNGWSA9IFsnJywgJ0p1bCcsICdBdWcnLCAnU2VwdCcsICdPY3QnLCAnTm92JywgJ0RlYycsICdKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1biddO1xuXG4gICAgICAgIGlmICh5ZWFyVHlwZSA9PSAnQ1knKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9udGhzW3ZhbHVlXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBtb250aHNGWVt2YWx1ZV07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGdldFBlcmlvZFN0cmluZyA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gICAgICAgIGlmIChtb250aCA8IDEwKSB7XG4gICAgICAgICAgICByZXR1cm4geWVhciArIFwiMFwiICsgbW9udGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4geWVhciArIFwiXCIgKyAgbW9udGg7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGdldE1vbnRoSW5kZXhGcm9tUGVyaW9kID0gZnVuY3Rpb24ocGVyaW9kLCB5ZWFyVHlwZSkge1xuICAgICAgICBwZXJpb2QgPSBwZXJpb2QudG9TdHJpbmcoKTtcbiAgICAgICAgdmFyIG1vbnRoID0gTnVtYmVyKHBlcmlvZC5zdWJzdHIoNCwyKSk7XG5cbiAgICAgICAgaWYgKHllYXJUeXBlID09ICdDWScpIHtcbiAgICAgICAgICAgIHJldHVybiBtb250aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChtb250aCA+PSA3KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguYWJzKG1vbnRoIC0gNykgKyAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKG1vbnRoICsgNik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGdldE1vbnRoRnJvbVBlcmlvZCA9IGZ1bmN0aW9uKHBlcmlvZCwgeWVhclR5cGUpIHtcbiAgICAgICAgcGVyaW9kID0gcGVyaW9kLnRvU3RyaW5nKCk7XG4gICAgICAgIHJldHVybiBOdW1iZXIocGVyaW9kLnN1YnN0cig0LDIpKTtcbiAgICB9O1xuXG4gICAgdmFyIGdldFllYXJGcm9tUGVyaW9kID0gZnVuY3Rpb24ocGVyaW9kLCB5ZWFyVHlwZSkge1xuICAgICAgICBwZXJpb2QgPSBwZXJpb2QudG9TdHJpbmcoKTtcbiAgICAgICAgcmV0dXJuIE51bWJlcihwZXJpb2Quc3Vic3RyKDAsNCkpO1xuICAgIH07XG5cbiAgICB2YXIgZ2V0WWVhckxhYmVsRnJvbVBlcmlvZCA9IGZ1bmN0aW9uKHBlcmlvZCwgeWVhclR5cGUpIHtcbiAgICAgICAgcGVyaW9kID0gcGVyaW9kLnRvU3RyaW5nKCk7XG4gICAgICAgIHZhciB5ZWFyID0gcGVyaW9kLnN1YnN0cigwLDQpO1xuICAgICAgICB2YXIgbW9udGggPSBOdW1iZXIocGVyaW9kLnN1YnN0cig0LDIpKTtcblxuICAgICAgICBpZiAoeWVhclR5cGUgPT0gJ0NZJykge1xuICAgICAgICAgICAgcmV0dXJuIHllYXI7XG4gICAgICAgIH0gZWxzZSBpZiAoeWVhclR5cGUgPT0gJ0ZZJykge1xuICAgICAgICAgICAgaWYgKG1vbnRoIDw9IDYpIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJldlllYXIgPSBOdW1iZXIoeWVhcikgLSAxO1xuICAgICAgICAgICAgICAgIHJldHVybiBwcmV2WWVhciArIFwiLVwiICsgeWVhcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRZZWFyID0gTnVtYmVyKHllYXIpICsgMTtcbiAgICAgICAgICAgICAgICByZXR1cm4geWVhciArIFwiLVwiICsgbmV4dFllYXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICAgLy8gcHVibGlzaCBleHRlcm5hbCBBUEkgYnkgZXh0ZW5kaW5nIGFwcEhlbHBlcnNcbiAgICAgZnVuY3Rpb24gcHVibGlzaEV4dGVybmFsQVBJKGFwcEhlbHBlcnMpIHtcbiAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKGFwcEhlbHBlcnMsIHtcbiAgICAgICAgICAgICAncGVyJzogcGVyLFxuICAgICAgICAgICAgICdnZW5lcmF0ZUxhYmVsRnJvbVBlcmlvZCc6IGdlbmVyYXRlTGFiZWxGcm9tUGVyaW9kLFxuICAgICAgICAgICAgICdnZW5lcmF0ZUZ1bGxMYWJlbEZyb21QZXJpb2QnOiBnZW5lcmF0ZUZ1bGxMYWJlbEZyb21QZXJpb2QsXG4gICAgICAgICAgICAgJ2dldFBlcmlvZFN0cmluZyc6IGdldFBlcmlvZFN0cmluZyxcbiAgICAgICAgICAgICAnZ2V0WWVhckxhYmVsRnJvbVBlcmlvZCc6IGdldFllYXJMYWJlbEZyb21QZXJpb2QsXG4gICAgICAgICAgICAgJ2dldE1vbnRoRnJvbVBlcmlvZCc6IGdldE1vbnRoRnJvbVBlcmlvZCxcbiAgICAgICAgICAgICAnZ2V0WWVhckZyb21QZXJpb2QnOiBnZXRZZWFyRnJvbVBlcmlvZCxcbiAgICAgICAgICAgICAnZ2V0TW9udGhJbmRleEZyb21QZXJpb2QnOiBnZXRNb250aEluZGV4RnJvbVBlcmlvZCxcbiAgICAgICAgICAgICAnZ2V0TW9udGhGcm9tTnVtYmVyJzogZ2V0TW9udGhGcm9tTnVtYmVyXG4gICAgICAgICB9KTtcbiAgICAgfVxuXG4gICAgIHB1Ymxpc2hFeHRlcm5hbEFQSShhcHBIZWxwZXJzKTtcblxuIH0pKHdpbmRvdywgZG9jdW1lbnQpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBDcmVhdGVkIGJ5IGJ3YW1hbGEgb24gNi8yLzIwMTcuXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdzZXJ2aWNlcycpLnNlcnZpY2UoJ0FubnVhbFNlcnZpY2UnLCBbJyRodHRwJyxcbiAgICBmdW5jdGlvbigkaHR0cCkge1xuICAgICAgICB2YXIgaGFuZGxlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldEF3cEFjdGl2aXRpZXMgPSBmdW5jdGlvbih5ZWFyKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ3BsYW5uaW5nL2FwaS9hd3BhY3Rpdml0aWVzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICB5ZWFyOiB5ZWFyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldEZ1bmRBY3Rpdml0aWVzID0gZnVuY3Rpb24oeWVhcil7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdwbGFubmluZy9hcGkvZnVuZGFjdGl2aXRpZXMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHllYXI6IHllYXIsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldFByaW9yaXR5QWN0aXZpdGllcyA9IGZ1bmN0aW9uKHllYXIpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgncGxhbm5pbmcvYXBpL3ByaW9yaXR5YWN0aXZpdGllcycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgeWVhcjogeWVhcixcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICAnZ2V0QXdwQWN0aXZpdGllcyc6Z2V0QXdwQWN0aXZpdGllcyxcbiAgICAgICAgICAgICdnZXRGdW5kQWN0aXZpdGllcyc6IGdldEZ1bmRBY3Rpdml0aWVzLFxuICAgICAgICAgICAgJ2dldFByaW9yaXR5QWN0aXZpdGllcyc6Z2V0UHJpb3JpdHlBY3Rpdml0aWVzXG4gICAgICAgIH07XG4gICAgfVxuXG5dKVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhclxuICAgIC5tb2R1bGUoJ3NlcnZpY2VzJylcbiAgICAuc2VydmljZSgnQ2hhcnRQREZFeHBvcnQnLCBDaGFydFBERkV4cG9ydCk7XG5cbkNoYXJ0UERGRXhwb3J0LiRpbmplY3QgPSBbJyR0aW1lb3V0J107XG5mdW5jdGlvbiBDaGFydFBERkV4cG9ydCgkdGltZW91dCkge1xuICAgIHZhciBzZXJ2aWNlID0ge1xuICAgICAgICAnZXhwb3J0JzogZXhwb3J0UERGLFxuICAgICAgICAnZXhwb3J0V2l0aFN0eWxlcic6IGV4cG9ydFdpdGhTdHlsZXJcbiAgICB9O1xuICAgIHJldHVybiBzZXJ2aWNlO1xuXG4gICAgZnVuY3Rpb24gZXhwb3J0UERGKGZpbGVuYW1lKSB7XG4gICAgICAgIGQzLnNlbGVjdEFsbChcInN2ZyAubnYtbGluZVwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIiNmZmZmZmZcIilcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAwKTtcblxuICAgICAgICBkMy5zZWxlY3RBbGwoXCIubnZkMyAubnYtYmFja2dyb3VuZFwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIiNmZmZmZmZcIilcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAwKTtcblxuICAgICAgICBkMy5zZWxlY3RBbGwoXCIubnZkMyAubnYtYXhpcyBsaW5lXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgXCIjZTVlNWU1XCIpO1xuXG4gICAgICAgIGQzLnNlbGVjdEFsbChcIi5udmQzIHRleHRcIilcbiAgICAgICAgICAgIC5zdHlsZShcImZvbnRcIiwgXCJub3JtYWwgMTNweCBBcmlhbCwgc2Fucy1zZXJpZlwiKTtcblxuICAgICAgICBkMy5zZWxlY3RBbGwoXCIubnZkMyAubnYtZ3JvdXBzIC5udi1wb2ludFwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIDApXG4gICAgICAgICAgICAuc3R5bGUoXCJzdHJva2Utd2lkdGhcIiwgXCIwcHhcIik7XG5cbiAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52ZDMgLm52LXkgLnplcm8gbGluZVwiKVxuICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIFwiIzQwNDA0MFwiKTtcblxuICAgICAgICBkMy5zZWxlY3RBbGwoXCIubnYteSAubnYtYXhpcyBnIHBhdGguZG9tYWluXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgXCIjNDA0MDQwXCIpO1xuXG4gICAgICAgIGQzLnNlbGVjdEFsbChcIi5sZWdlbmRRdWFudCAubGFiZWxcIilcbiAgICAgICAgICAgIC5zdHlsZShcImZvbnRcIiwgXCJub3JtYWwgMTJweCBBcmlhbCwgc2Fucy1zZXJpZlwiKTtcblxuICAgICAgICAvLyB2YXIgcGRmID0gbmV3IGpzUERGKCdsJywgJ21tJyk7XG4gICAgICAgIHZhciBwZGY9bmV3IGpzUERGKFwibFwiLCBcIm1tXCIsIFwiYTRcIik7XG4gICAgICAgIHZhciBvcHRpb25zID0geyBmb3JtYXQgOiAnUE5HJyB9O1xuXG4gICAgICAgIHBkZi5hZGRIVE1MKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGRmUmVwb3J0XCIpLCAwLCAwLCBvcHRpb25zLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBwZGYuc2F2ZShmaWxlbmFtZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4cG9ydFdpdGhTdHlsZXIodm0sIGZpbGVuYW1lKSB7XG4gICAgICAgIHZtLnByaW50VmlldyA9IHRydWU7XG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge2V4cG9ydFBERihmaWxlbmFtZSk7IH0sIDEwMCk7XG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge3ZtLnByaW50VmlldyA9IGZhbHNlO30sIDEwMDApO1xuICAgIH1cbn1cbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdzZXJ2aWNlcycpXG4gICAgLnNlcnZpY2UoJ0NoYXJ0U3VwcG9ydFNlcnZpY2UnLCBDaGFydFN1cHBvcnRTZXJ2aWNlKTtcblxuZnVuY3Rpb24gQ2hhcnRTdXBwb3J0U2VydmljZSgpIHtcbiAgICB2YXIgc2VydmljZSA9IHtcbiAgICAgICAgJ2dldE9wdGlvbnMnOiBnZXRPcHRpb25zLFxuICAgICAgICAnaW5pdExhYmVscyc6IGluaXRMYWJlbHMsXG4gICAgICAgICdjbGVhckxhYmVscyc6IGNsZWFyTGFiZWxzXG4gICAgfTtcblxuICAgIHJldHVybiBzZXJ2aWNlO1xuXG4gICAgZnVuY3Rpb24gZ2V0T3B0aW9ucyhjaGFydFR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogY2hhcnRUeXBlLFxuICAgICAgICAgICAgICAgIGhlaWdodDogNDUwLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NTAsXG4gICAgICAgICAgICAgICAgLy8gbWFyZ2luOiB7dG9wOiAxMDB9LFxuICAgICAgICAgICAgICAgIHN0YWNrZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNob3dDb250cm9sczogZmFsc2UsXG4gICAgICAgICAgICAgICAgZ3JvdXBTcGFjaW5nOiAwLjIsXG4gICAgICAgICAgICAgICAgY2xpcEVkZ2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgIC8vIHVzZUludGVyYWN0aXZlR3VpZGVsaW5lOiB0cnVlLFxuICAgICAgICAgICAgICAgIGludGVyYWN0aXZlTGF5ZXI6IHtncmF2aXR5OiAncyd9LFxuICAgICAgICAgICAgICAgIHg6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZC54OyB9LFxuICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZC55OyB9LFxuICAgICAgICAgICAgICAgIGZvcmNlWTogWzAsMTEwXSxcbiAgICAgICAgICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWw6ICdZZWFycycsXG4gICAgICAgICAgICAgICAgICAgIHRpY2tGb3JtYXQ6IGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHlBeGlzOiB7XG4gICAgICAgICAgICAgICAgICAgIGF4aXNMYWJlbDogJ0NvdmVyYWdlIFJhdGUgKCUpJyxcbiAgICAgICAgICAgICAgICAgICAgdGlja3M6IDEwXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkaXNwYXRjaDoge1xuICAgICAgICAgICAgICAgICAgICByZW5kZXJFbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdExhYmVscygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oY2hhcnQpe1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiISEhIGxpbmVDaGFydCBjYWxsYmFjayAhISFcIik7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2g6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlQ2hhbmdlOiBmdW5jdGlvbigpIHt9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdExhYmVscyhodW1hbml6ZT1mYWxzZSkge1xuICAgICAgICAvLyBZb3UgbmVlZCB0byBhcHBseSB0aGlzIG9uY2UgYWxsIHRoZSBhbmltYXRpb25zIGFyZSBhbHJlYWR5IGZpbmlzaGVkLiBPdGhlcndpc2UgbGFiZWxzIHdpbGwgYmUgcGxhY2VkIHdyb25nbHkuXG4gICAgICAgIGQzLnNlbGVjdEFsbCgnLm52LW11bHRpYmFyIC5udi1ncm91cCcpLmVhY2goZnVuY3Rpb24oZ3JvdXApe1xuICAgICAgICAgIHZhciBnID0gZDMuc2VsZWN0KHRoaXMpO1xuXG4gICAgICAgICAgLy8gUmVtb3ZlIHByZXZpb3VzIGxhYmVscyBpZiB0aGVyZSBpcyBhbnlcbiAgICAgICAgICBnLnNlbGVjdEFsbCgndGV4dCcpLnJlbW92ZSgpO1xuICAgICAgICAgIGcuc2VsZWN0QWxsKCcubnYtYmFyJykuZWFjaChmdW5jdGlvbihiYXIpe1xuICAgICAgICAgICAgdmFyIGIgPSBkMy5zZWxlY3QodGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFyV2lkdGggPSBiLmF0dHIoJ3dpZHRoJyk7XG4gICAgICAgICAgICB2YXIgYmFySGVpZ2h0ID0gYi5hdHRyKCdoZWlnaHQnKTtcblxuICAgICAgICAgICAgZy5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgICAvLyBUcmFuc2Zvcm1zIHNoaWZ0IHRoZSBvcmlnaW4gcG9pbnQgdGhlbiB0aGUgeCBhbmQgeSBvZiB0aGUgYmFyXG4gICAgICAgICAgICAgIC8vIGlzIGFsdGVyZWQgYnkgdGhpcyB0cmFuc2Zvcm0uIEluIG9yZGVyIHRvIGFsaWduIHRoZSBsYWJlbHNcbiAgICAgICAgICAgICAgLy8gd2UgbmVlZCB0byBhcHBseSB0aGlzIHRyYW5zZm9ybSB0byB0aG9zZS5cbiAgICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGIuYXR0cigndHJhbnNmb3JtJykpXG4gICAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy8gVHdvIGRlY2ltYWxzIGZvcm1hdFxuICAgICAgICAgICAgICAgIGlmIChodW1hbml6ZSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEh1bWFuaXplLmNvbXBhY3RJbnRlZ2VyKHBhcnNlRmxvYXQoYmFyLnkpLnRvRml4ZWQoMCksIDEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGJhci55KS50b0ZpeGVkKDApO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuYXR0cigneScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy8gQ2VudGVyIGxhYmVsIHZlcnRpY2FsbHlcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5nZXRCQm94KCkuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGIuYXR0cigneScpKSAtIDEwOyAvLyAxMCBpcyB0aGUgbGFiZWwncyBtYWdpbiBmcm9tIHRoZSBiYXJcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8vIENlbnRlciBsYWJlbCBob3Jpem9udGFsbHlcbiAgICAgICAgICAgICAgICB2YXIgd2lkdGggPSB0aGlzLmdldEJCb3goKS53aWR0aDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChiLmF0dHIoJ3gnKSkgKyAocGFyc2VGbG9hdChiYXJXaWR0aCkgLyAyKSAtICh3aWR0aCAvIDIpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYmFyLXZhbHVlcycpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckxhYmVscygpIHtcbiAgICAgICAgZDMuc2VsZWN0QWxsKCcubnYtbXVsdGliYXIgLm52LWdyb3VwJykuZWFjaChmdW5jdGlvbihncm91cCl7XG4gICAgICAgICAgdmFyIGcgPSBkMy5zZWxlY3QodGhpcyk7XG4gICAgICAgICAgLy8gUmVtb3ZlIHByZXZpb3VzIGxhYmVscyBpZiB0aGVyZSBpcyBhbnlcbiAgICAgICAgICBnLnNlbGVjdEFsbCgndGV4dCcpLnJlbW92ZSgpO1xuICAgICAgfSk7XG4gICAgfVxufVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhclxuICAgIC5tb2R1bGUoJ3NlcnZpY2VzJylcbiAgICAuc2VydmljZSgnQ292ZXJhZ2VDYWxjdWxhdG9yJywgQ292ZXJhZ2VDYWxjdWxhdG9yKTtcblxuZnVuY3Rpb24gQ292ZXJhZ2VDYWxjdWxhdG9yKCkge1xuXG4gICAgdmFyIHNlcnZpY2UgPSAge1xuICAgICAgICAnY2FsY3VsYXRlQ292ZXJhZ2VSYXRlJzogY2FsY3VsYXRlQ292ZXJhZ2VSYXRlLFxuICAgICAgICAnY2FsY3VsYXRlRHJvcG91dFJhdGUnOiBjYWxjdWxhdGVEcm9wb3V0UmF0ZSxcbiAgICAgICAgJ2NhbGN1bGF0ZVJlZENhdGVnb3J5JzogY2FsY3VsYXRlUmVkQ2F0ZWdvcnlcbiAgICB9O1xuXG4gICAgcmV0dXJuIHNlcnZpY2U7XG5cbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVDb3ZlcmFnZVJhdGUoY29uc3VtcHRpb24sIHBsYW5uZWQpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoKGNvbnN1bXB0aW9uIC8gcGxhbm5lZCkgKiAxMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZURyb3BvdXRSYXRlKGZpcnN0RG9zZSwgbGFzdERvc2UpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoKChmaXJzdERvc2UgLSBsYXN0RG9zZSkgLyBmaXJzdERvc2UpICogMTAwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVSZWRDYXRlZ29yeShmaXJzdERvc2UsIGxhc3REb3NlLCBwbGFubmVkKSB7XG4gICAgICAgIHZhciBhY2Nlc3MgPSBjYWxjdWxhdGVDb3ZlcmFnZVJhdGUoZmlyc3REb3NlLCBwbGFubmVkKTtcbiAgICAgICAgdmFyIGRyb3BvdXRSYXRlID0gY2FsY3VsYXRlRHJvcG91dFJhdGUoZmlyc3REb3NlLCBsYXN0RG9zZSk7XG5cbiAgICAgICAgaWYgKGFjY2VzcyA+PSA5MCAmJiBkcm9wb3V0UmF0ZSA+PSAwICYmIGRyb3BvdXRSYXRlIDw9IDEwKSByZXR1cm4gMTtcbiAgICAgICAgZWxzZSBpZiAoYWNjZXNzID49IDkwICYmIChkcm9wb3V0UmF0ZSA8IDAgfHwgZHJvcG91dFJhdGUgPiAxMCkpIHJldHVybiAyO1xuICAgICAgICBlbHNlIGlmIChhY2Nlc3MgPCA5MCAmJiBkcm9wb3V0UmF0ZSA+PSAwICYmIGRyb3BvdXRSYXRlIDw9IDEwKSByZXR1cm4gMztcbiAgICAgICAgZWxzZSBpZiAoYWNjZXNzIDwgOTAgJiYgKGRyb3BvdXRSYXRlIDwgMCB8fCBkcm9wb3V0UmF0ZSA+IDEwKSkgcmV0dXJuIDQ7XG4gICAgICAgIGVsc2UgcmV0dXJuIDA7XG4gICAgfVxufVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ3NlcnZpY2VzJykuc2VydmljZSgnQ292ZXJhZ2VTZXJ2aWNlJywgWyckaHR0cCcsXG4gICAgZnVuY3Rpb24oJGh0dHApIHtcbiAgICAgICAgdmFyIGhhbmRsZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRESElTMlZhY2NpbmVEb3NlcyA9IGZ1bmN0aW9uKHBlcmlvZCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvdmVyYWdlL2FwaS9kaGlzMnZhY2NpbmVkb3NlcycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kOiBwZXJpb2QsXG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmU6IHZhY2NpbmUsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRWYWNjaW5lRG9zZXMgPSBmdW5jdGlvbihwZXJpb2QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvdmVyYWdlL2FwaS92YWNjaW5lZG9zZXMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZDogcGVyaW9kLFxuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lOiB2YWNjaW5lXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBnZXRSZWRWYWNjaW5lRG9zZXMgPSBmdW5jdGlvbihwZXJpb2QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvdmVyYWdlL2FwaS92YWNjaW5lZG9zZXMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZDogcGVyaW9kLFxuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lOiB2YWNjaW5lXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cblxuICAgICAgICB2YXIgZ2V0VmFjY2luZURvc2VzQnlEaXN0cmljdCA9IGZ1bmN0aW9uKHBlcmlvZCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvdmVyYWdlL2FwaS92YWNjaW5lZG9zZXMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZDogcGVyaW9kLFxuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lOiB2YWNjaW5lLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3RcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0VmFjY2luZURvc2VzQnlQZXJpb2QgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvdmVyYWdlL2FwaS92YWNjaW5lZG9zZXNfYnlfcGVyaW9kJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydFllYXI6IHBhcmFtcy5zdGFydFllYXIsXG4gICAgICAgICAgICAgICAgICAgIGVuZFllYXI6IHBhcmFtcy5lbmRZZWFyLFxuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lOiBwYXJhbXMuYW50aWdlbixcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kOiBwYXJhbXMucGVyaW9kLFxuICAgICAgICAgICAgICAgICAgICBkb3NlOiBwYXJhbXMuZG9zZSxcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IHBhcmFtcy5kaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IHBhcmFtcy5kYXRhVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlRGlzdHJpY3RHcm91cGluZzogcGFyYW1zLmVuYWJsZURpc3RyaWN0R3JvdXBpbmdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0VW5lcGlDb3ZlcmFnZSA9IGZ1bmN0aW9uKHBlcmlvZCwgZGlzdHJpY3QpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvdmVyYWdlL2FwaS9jb3ZlcmFnZWFubnVhbGl6ZWQnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZDogcGVyaW9kLFxuXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXREaXN0cmljdE1hcCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdzdGF0aWMvVWdhbmRhX2FkbWluLmpzb24nKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJnZXRESElTMlZhY2NpbmVEb3Nlc1wiOiBnZXRESElTMlZhY2NpbmVEb3NlcyxcbiAgICAgICAgICAgIFwiZ2V0VmFjY2luZURvc2VzXCI6IGdldFZhY2NpbmVEb3NlcyxcbiAgICAgICAgICAgIFwiZ2V0VmFjY2luZURvc2VzQnlEaXN0cmljdFwiOiBnZXRWYWNjaW5lRG9zZXNCeURpc3RyaWN0LFxuICAgICAgICAgICAgXCJnZXRWYWNjaW5lRG9zZXNCeVBlcmlvZFwiOiBnZXRWYWNjaW5lRG9zZXNCeVBlcmlvZCxcbiAgICAgICAgICAgIFwiZ2V0VW5lcGlDb3ZlcmFnZVwiOmdldFVuZXBpQ292ZXJhZ2UsXG4gICAgICAgICAgICBcImdldERpc3RyaWN0TWFwXCI6IGdldERpc3RyaWN0TWFwLFxuICAgICAgICAgICAgXCJnZXRSZWRWYWNjaW5lRG9zZXNcIjpnZXRSZWRWYWNjaW5lRG9zZXNcbiAgICAgICAgfTtcbiAgICB9XG5dKVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ3NlcnZpY2VzJykuc2VydmljZSgnRmlsdGVyU2VydmljZScsIFsnJGh0dHAnLFxuICAgIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgICAgIHZhciBoYW5kbGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0TW9udGhzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL21vbnRocycpLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXREaXN0cmljdHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvZGlzdHJpY3RzJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldFZhY2NpbmVzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3ZhY2NpbmVzLycpLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGdldEZyaWRnZURpc3RyaWN0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY29sZGNoYWluL2FwaS9kaXN0cmljdHMnKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0RnJpZGdlQ2FyZUxldmVscyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY29sZGNoYWluL2FwaS9jYXJlbGV2ZWxzJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldEZyaWRnZVF1YXJ0ZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb2xkY2hhaW4vYXBpL3F1YXJ0ZXJzJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldExhc3RQZXJpb2QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvbGFzdHBlcmlvZCcpLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRQZXJpb2RSYW5nZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvdmVyYWdlL2FwaS9wZXJpb2RfcmFuZ2VzJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZ2V0QXdwQWN0aXZpdGllcz0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ3BsYW5uaW5nL2FwaS9hd3BhY3Rpdml0aWVzJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldEZ1bmRBY3Rpdml0aWVzPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgncGxhbm5pbmcvYXBpL2Z1bmRhY3Rpdml0aWVzJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBnZXRVbmVwaUNvdmVyYWdlPWZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb3ZlcmFnZS9hcGkvY292ZXJhZ2Vhbm51YWxpemVkJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBnZXRVbmVwaVN0b2NrPWZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdhcGkvc3RvY2svYXRoYW5kYnlkaXN0cmljdCcpLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRZZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdwbGFubmluZy9hcGkvYWN0aXZpdHl5ZWFyJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJnZXRNb250aHNcIjogZ2V0TW9udGhzLFxuICAgICAgICAgICAgXCJnZXRZZWFyXCI6IGdldFllYXIsXG4gICAgICAgICAgICBcImdldFZhY2NpbmVzXCI6IGdldFZhY2NpbmVzLFxuICAgICAgICAgICAgXCJnZXREaXN0cmljdHNcIjogZ2V0RGlzdHJpY3RzLFxuICAgICAgICAgICAgXCJnZXRGcmlkZ2VEaXN0cmljdHNcIjogZ2V0RnJpZGdlRGlzdHJpY3RzLFxuICAgICAgICAgICAgXCJnZXRGcmlkZ2VDYXJlTGV2ZWxzXCI6IGdldEZyaWRnZUNhcmVMZXZlbHMsXG4gICAgICAgICAgICBcImdldEZyaWRnZVF1YXJ0ZXJzXCI6IGdldEZyaWRnZVF1YXJ0ZXJzLFxuICAgICAgICAgICAgXCJnZXRMYXN0UGVyaW9kXCI6IGdldExhc3RQZXJpb2QsXG4gICAgICAgICAgICBcImdldFBlcmlvZFJhbmdlc1wiOiBnZXRQZXJpb2RSYW5nZXMsXG4gICAgICAgICAgICBcImdldEF3cEFjdGl2aXRpZXNcIjogZ2V0QXdwQWN0aXZpdGllcyxcbiAgICAgICAgICAgIFwiZ2V0RnVuZEFjdGl2aXRpZXNcIjogZ2V0RnVuZEFjdGl2aXRpZXMsXG4gICAgICAgICAgICBcImdldFVuZXBpQ292ZXJhZ2VcIjpnZXRVbmVwaUNvdmVyYWdlLFxuICAgICAgICAgICAgXCJnZXRVbmVwaVN0b2NrXCI6Z2V0VW5lcGlTdG9ja1xuICAgICAgICB9O1xuICAgIH1cbl0pXG5cbmFuZ3VsYXIubW9kdWxlKCdzZXJ2aWNlcycpLnNlcnZpY2UoJ01vbnRoU2VydmljZScsIFtcbiAgICBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgZ2V0TW9udGhOYW1lID0gZnVuY3Rpb24obW9udGgpIHtcbiAgICAgICAgICAgIHZhciBtb250aHMgPSB7fTtcbiAgICAgICAgICAgIG1vbnRoc1snMSddID0gXCJKYW5cIjtcbiAgICAgICAgICAgIG1vbnRoc1snMiddID0gXCJGZWJcIjtcbiAgICAgICAgICAgIG1vbnRoc1snMyddID0gXCJNYXJcIjtcbiAgICAgICAgICAgIG1vbnRoc1snNCddID0gXCJBcHJcIjtcbiAgICAgICAgICAgIG1vbnRoc1snNSddID0gXCJNYXlcIjtcbiAgICAgICAgICAgIG1vbnRoc1snNiddID0gXCJKdW5cIjtcbiAgICAgICAgICAgIG1vbnRoc1snNyddID0gXCJKdWxcIjtcbiAgICAgICAgICAgIG1vbnRoc1snOCddID0gXCJBdWdcIjtcbiAgICAgICAgICAgIG1vbnRoc1snOSddID0gXCJTZXBcIjtcbiAgICAgICAgICAgIG1vbnRoc1snMTAnXSA9IFwiT2N0XCI7XG4gICAgICAgICAgICBtb250aHNbJzExJ10gPSBcIk5vdlwiO1xuICAgICAgICAgICAgbW9udGhzWycxMiddID0gXCJEZWNcIjtcbiAgICAgICAgICAgIHJldHVybiBtb250aHNbbW9udGhdO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRNb250aE51bWJlciA9IGZ1bmN0aW9uKG1vbnRoKSB7XG4gICAgICAgICAgICB2YXIgbW9udGhzID0ge307XG4gICAgICAgICAgICBtb250aHNbJ0phbiddID0gMTtcbiAgICAgICAgICAgIG1vbnRoc1snRmViJ10gPSAyO1xuICAgICAgICAgICAgbW9udGhzWydNYXInXSA9IDM7XG4gICAgICAgICAgICBtb250aHNbJ0FwciddID0gNDtcbiAgICAgICAgICAgIG1vbnRoc1snTWF5J10gPSA1O1xuICAgICAgICAgICAgbW9udGhzWydKdW4nXSA9IDY7XG4gICAgICAgICAgICBtb250aHNbJ0p1bCddID0gNztcbiAgICAgICAgICAgIG1vbnRoc1snQXVnJ10gPSA4O1xuICAgICAgICAgICAgbW9udGhzWydTZXAnXSA9IDk7XG4gICAgICAgICAgICBtb250aHNbJ09jdCddID0gMTA7XG4gICAgICAgICAgICBtb250aHNbJ05vdiddID0gMTE7XG4gICAgICAgICAgICBtb250aHNbJ0RlYyddID0gMTI7XG4gICAgICAgICAgICByZXR1cm4gbW9udGhzW21vbnRoXTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbW9udGhUb0RhdGUgPSBmdW5jdGlvbihtb250aFllYXIpIHtcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IG1vbnRoWWVhci5zcGxpdChcIiBcIik7XG4gICAgICAgICAgICB2YXIgbW9udGggPSBnZXRNb250aE51bWJlcihwYXJ0c1swXSk7XG4gICAgICAgICAgICB2YXIgeWVhciA9IHBhcnNlSW50KHBhcnRzWzFdKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgbW9udGhEaWZmID0gZnVuY3Rpb24gKHN0YXJ0RGF0ZSwgZW5kRGF0ZSkge1xuICAgICAgICAgICAgdmFyIG1vbnRocztcbiAgICAgICAgICAgIG1vbnRocyA9IChlbmREYXRlLmdldEZ1bGxZZWFyKCkgLSBzdGFydERhdGUuZ2V0RnVsbFllYXIoKSkgKiAxMjtcbiAgICAgICAgICAgIG1vbnRocyAtPSBzdGFydERhdGUuZ2V0TW9udGgoKSArIDE7XG4gICAgICAgICAgICBtb250aHMgKz0gZW5kRGF0ZS5nZXRNb250aCgpO1xuICAgICAgICAgICAgcmV0dXJuIG1vbnRocyA8PSAwID8gMCA6IG1vbnRocztcbiAgICAgICAgfTtcblxuICAgICAgICBtb250aFJhbmdlRGlmZiA9IGZ1bmN0aW9uIChzdGFydERhdGUsIGVuZERhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiBtb250aERpZmYobW9udGhUb0RhdGUoc3RhcnREYXRlKSwgbW9udGhUb0RhdGUoZW5kRGF0ZSkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBcImdldE1vbnRoTmFtZVwiOiBnZXRNb250aE5hbWUsXG4gICAgICAgICAgICBcImdldE1vbnRoTnVtYmVyXCI6IGdldE1vbnRoTnVtYmVyLFxuICAgICAgICAgICAgXCJtb250aFRvRGF0ZVwiOiBtb250aFRvRGF0ZSxcbiAgICAgICAgICAgIFwibW9udGhEaWZmXCI6IG1vbnRoRGlmZixcbiAgICAgICAgICAgIFwibW9udGhSYW5nZURpZmZcIjogbW9udGhSYW5nZURpZmYsXG4gICAgICAgIH07XG4gICAgfVxuXSlcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbiAgICBhbmd1bGFyLm1vZHVsZSgnc2VydmljZXMnKS5zZXJ2aWNlKCdGaW5hbmNlU2VydmljZScsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCkge1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBcImdldEZpbmFuY2VEYXRhXCI6IGdldEZpbmFuY2VEYXRhLFxuICAgICAgICAgICAgXCJnZXRGaW5hbmNlWWVhcnNcIjogZ2V0RmluYW5jZVllYXJzXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlUmVzcG9uc2UocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0RmluYW5jZURhdGEocGFyYW1zKSB7XG4gICAgICAgICAgICB2YXIgY29uZmlnID0ge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydFllYXI6IHBhcmFtcyA9PSB1bmRlZmluZWQgPyAxOTkwIDogcGFyYW1zLnN0YXJ0WWVhcixcbiAgICAgICAgICAgICAgICAgICAgZW5kWWVhcjogcGFyYW1zID09IHVuZGVmaW5lZCA/IDMwMDAgOiBwYXJhbXMuZW5kWWVhclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvZmluYW5jZS9saXN0JywgY29uZmlnKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEZpbmFuY2VZZWFycygpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9maW5hbmNlL3llYXJzJywge30pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9XG5cbiAgICB9XSlcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdzZXJ2aWNlcycpLnNlcnZpY2UoJ0ZyaWRnZVNlcnZpY2UnLCBbJyRodHRwJyxcbiAgICBmdW5jdGlvbigkaHR0cCkge1xuICAgICAgICB2YXIgaGFuZGxlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldEZyaWRnZUNhcGFjaXR5ID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBkaXN0cmljdCwgY2FyZWxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb2xkY2hhaW4vYXBpL2NhcGFjaXRpZXMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0UXVhcnRlcjogc3RhcnRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBlbmRRdWFydGVyOiBlbmRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3QsXG4gICAgICAgICAgICAgICAgICAgIGNhcmVsZXZlbDogY2FyZWxldmVsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldEZyaWRnZURpc3RyaWN0Q2FwYWNpdHkgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGRpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvbGRjaGFpbi9hcGkvZGlzdHJpY3RjYXBhY2l0aWVzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydFF1YXJ0ZXI6IHN0YXJ0UXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZW5kUXVhcnRlcjogZW5kUXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICBjYXJlbGV2ZWw6IGNhcmVsZXZlbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRGcmlkZ2VGYWNpbGl0eUNhcGFjaXR5ID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBkaXN0cmljdCwgY2FyZWxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb2xkY2hhaW4vYXBpL2ZhY2lsaXR5Y2FwYWNpdGllcycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRRdWFydGVyOiBzdGFydFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGVuZFF1YXJ0ZXI6IGVuZFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgY2FyZWxldmVsOiBjYXJlbGV2ZWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0RnJpZGdlRnVuY3Rpb25hbGl0eSA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY29sZGNoYWluL2FwaS9yZWZyaWdlcmF0b3JzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydFF1YXJ0ZXI6IHN0YXJ0UXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZW5kUXVhcnRlcjogZW5kUXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICBjYXJlbGV2ZWw6IGNhcmVsZXZlbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgZ2V0RnJpZGdlRGlzdHJpY3RSZWZyaWdlcmF0b3IgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGRpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvbGRjaGFpbi9hcGkvZGlzdHJpY3RyZWZyaWdlcmF0b3JzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydFF1YXJ0ZXI6IHN0YXJ0UXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZW5kUXVhcnRlcjogZW5kUXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICBjYXJlbGV2ZWw6IGNhcmVsZXZlbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRGcmlkZ2VGYWNpbGl0eVJlZnJpZ2VyYXRvciA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY29sZGNoYWluL2FwaS9mYWNpbGl0eXJlZnJpZ2VyYXRvcnMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0UXVhcnRlcjogc3RhcnRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBlbmRRdWFydGVyOiBlbmRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3QsXG4gICAgICAgICAgICAgICAgICAgIGNhcmVsZXZlbDogY2FyZWxldmVsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldEZyaWRnZUltbXVuaXppbmdGYWNpbGl0eSA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY29sZGNoYWluL2FwaS9pbW11bml6aW5nZmFjaWxpdGllcycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRRdWFydGVyOiBzdGFydFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGVuZFF1YXJ0ZXI6IGVuZFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgY2FyZWxldmVsOiBjYXJlbGV2ZWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGdldEZyaWRnZURpc3RyaWN0SW1tdW5pemluZ0ZhY2lsaXR5ID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBkaXN0cmljdCwgY2FyZWxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb2xkY2hhaW4vYXBpL2Rpc3RyaWN0aW1tdW5pemluZ2ZhY2lsaXRpZXMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0UXVhcnRlcjogc3RhcnRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBlbmRRdWFydGVyOiBlbmRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3QsXG4gICAgICAgICAgICAgICAgICAgIGNhcmVsZXZlbDogY2FyZWxldmVsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldEZyaWRnZUNhcGFjaXR5TWV0cmljcyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBzdXJwID0gMDtcbiAgICAgICAgICAgIHZhciBzdWZmaWNpZW50ID0gMDtcbiAgICAgICAgICAgIHZhciBzaG9ydGFnZSA9IDA7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpIDwgZGF0YS5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgdmFyIHN1cnBsdXNWYWx1ZSA9IGRhdGFbaV0uc3VycGx1c1xuICAgICAgICAgICAgICAgIGlmIChzdXJwbHVzVmFsdWUgPiAzMCkgc3VycCsrO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYoc3VycGx1c1ZhbHVlIDwzMCAmJiBzdXJwbHVzVmFsdWUgPj0gMCkgc3VmZmljaWVudCsrO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYoc3VycGx1c1ZhbHVlIDwgMCkgc2hvcnRhZ2UrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAnc3VycGx1cyc6IHN1cnAsXG4gICAgICAgICAgICAgICAgJ3N1ZmZpY2llbnQnOiBzdWZmaWNpZW50LFxuICAgICAgICAgICAgICAgICdzaG9ydGFnZSc6IHNob3J0YWdlLFxuICAgICAgICAgICAgICAgICd0b3RhbCc6IHN1cnAgKyBzdWZmaWNpZW50ICsgc2hvcnRhZ2VcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwiZ2V0RnJpZGdlQ2FwYWNpdHlcIjogZ2V0RnJpZGdlQ2FwYWNpdHksXG4gICAgICAgICAgICBcImdldEZyaWRnZURpc3RyaWN0Q2FwYWNpdHlcIjogZ2V0RnJpZGdlRGlzdHJpY3RDYXBhY2l0eSxcbiAgICAgICAgICAgIFwiZ2V0RnJpZGdlRmFjaWxpdHlDYXBhY2l0eVwiOiBnZXRGcmlkZ2VGYWNpbGl0eUNhcGFjaXR5LFxuICAgICAgICAgICAgXCJnZXRGcmlkZ2VGdW5jdGlvbmFsaXR5XCI6IGdldEZyaWRnZUZ1bmN0aW9uYWxpdHksXG4gICAgICAgICAgICBcImdldEZyaWRnZUltbXVuaXppbmdGYWNpbGl0eVwiOiBnZXRGcmlkZ2VJbW11bml6aW5nRmFjaWxpdHksXG4gICAgICAgICAgICBcImdldEZyaWRnZURpc3RyaWN0UmVmcmlnZXJhdG9yXCI6Z2V0RnJpZGdlRGlzdHJpY3RSZWZyaWdlcmF0b3IsXG4gICAgICAgICAgICBcImdldEZyaWRnZUZhY2lsaXR5UmVmcmlnZXJhdG9yXCI6Z2V0RnJpZGdlRmFjaWxpdHlSZWZyaWdlcmF0b3IsXG4gICAgICAgICAgICBcImdldEZyaWRnZURpc3RyaWN0SW1tdW5pemluZ0ZhY2lsaXR5XCI6Z2V0RnJpZGdlRGlzdHJpY3RJbW11bml6aW5nRmFjaWxpdHksXG4gICAgICAgICAgICBcImdldEZyaWRnZUNhcGFjaXR5TWV0cmljc1wiOiBnZXRGcmlkZ2VDYXBhY2l0eU1ldHJpY3NcbiAgICAgICAgfTtcbiAgICB9XG5dKVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpXG4gICAgLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgWyckc2NvcGUnLCAnRmlsdGVyU2VydmljZScsICdNb250aFNlcnZpY2UnLCAnJHJvb3RTY29wZScsICckbG9jYXRpb24nLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgRmlsdGVyU2VydmljZSwgTW9udGhTZXJ2aWNlLCAkcm9vdFNjb3BlLCAkbG9jYXRpb24pXG4gICAge1xuICAgICAgICAkc2NvcGUuc29ydFR5cGUgICAgID0gJ25hbWUnOyAvLyBzZXQgdGhlIGRlZmF1bHQgc29ydCB0eXBlXG4gICAgICAgICRzY29wZS5zb3J0UmV2ZXJzZSAgPSBmYWxzZTsgIC8vIHNldCB0aGUgZGVmYXVsdCBzb3J0IG9yZGVyXG4gICAgICAgICRzY29wZS5zZWFyY2hUZXh0ICAgPSAnJzsgICAgIC8vIHNldCB0aGUgZGVmYXVsdCBzZWFyY2gvZmlsdGVyIHRlcm1cblxuICAgICAgICAkc2NvcGUucm9vdCA9IHt9O1xuICAgICAgICB2YXIgc2hlbGwgPSB0aGlzO1xuXG4gICAgICAgICRzY29wZS4kb24oJ3NldERlZmF1bHRZZWFycycsIGZ1bmN0aW9uKGUsIHN0YXJ0WWVhciwgZW5kWWVhcikge1xuICAgICAgICAgICAgc2hlbGwuZmluYW5jZVN0YXJ0WWVhciA9IHN0YXJ0WWVhcjtcbiAgICAgICAgICAgIHNoZWxsLmZpbmFuY2VFbmRZZWFyID0gZW5kWWVhcjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy89PT0gU3RvY2sgTWFuYWdlbWVudCA9PT09PT09XG4gICAgICAgIHNoZWxsLnN0YXJ0TW9udGggPSBzaGVsbC5zdGFydE1vbnRoID8gc2hlbGwuc3RhcnRNb250aC5uYW1lIDogXCJOb3YgMjAxNVwiO1xuICAgICAgICBzaGVsbC5lbmRNb250aCA9IHNoZWxsLmVuZE1vbnRoID8gc2hlbGwuZW5kTW9udGgubmFtZSA6IFwiRGVjIDIwMTVcIjtcbiAgICAgICAgc2hlbGwuc2VsZWN0ZWRWYWNjaW5lID0gXCJcIjtcbiAgICAgICAgc2hlbGwuc2VsZWN0ZWREaXN0cmljdCA9IFwiXCI7XG4gICAgICAgIHNoZWxsLmRlZmF1bHRQZXJpb2QgPSBcIlwiO1xuXG4gICAgICAgIEZpbHRlclNlcnZpY2UuZ2V0TW9udGhzKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBzaGVsbC5tb250aHMgPSBkYXRhO1xuICAgICAgICAgICAgc2hlbGwuc3RhcnRNb250aCA9IHNoZWxsLm1vbnRoc1swXTtcbiAgICAgICAgICAgIC8vc2hlbGwuZW5kTW9udGggPSBzaGVsbC5tb250aHNbZGVmYXVsdE1vbnRoXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQWRkIEFudGlnZW4gZmlsdGVycyB2YWx1ZXNcbiAgICAgICAgdmFyIGFudGlnZW5zID0ge1xuICAgICAgICAgICAgXCJBTExcIjogWydEb3NlIDEnLCAnRG9zZSAyJywgJ0Rvc2UgMyddLFxuICAgICAgICAgICAgXCJIUFZcIjogWydEb3NlIDEnLCAnRG9zZSAyJ10sXG4gICAgICAgICAgICBcIkRQVFwiOiBbJ0Rvc2UgMScsICdEb3NlIDInLCAnRG9zZSAzJ10sXG4gICAgICAgICAgICBcIlBDVlwiOiBbJ0Rvc2UgMScsICdEb3NlIDInLCAnRG9zZSAzJ10sXG4gICAgICAgICAgICBcIklQVlwiOiBbJ0Rvc2UgMSddLFxuICAgICAgICAgICAgXCJPUFZcIjogWydEb3NlIDEnLCAnRG9zZSAyJywgJ0Rvc2UgMyddLFxuICAgICAgICAgICAgXCJCQ0dcIjogWydEb3NlIDEnXSxcbiAgICAgICAgICAgIFwiTUVBU0xFU1wiOiBbJ0Rvc2UgMSddLFxuICAgICAgICAgICAgXCJUVFwiOiBbJ0Rvc2UgMScsICdEb3NlIDInXVxuICAgICAgICB9XG5cbiAgICAgICAgc2hlbGwudXBkYXRlRG9zZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNoZWxsLmRvc2UgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBzaGVsbC5kb3NlcyA9IGFudGlnZW5zW3NoZWxsLmFudGlnZW5dXG4gICAgICAgICAgICAvL3NoZWxsLmRvc2VzID0gWydEb3NlIDEnLCAnRG9zZSAyJywgJ0Rvc2UgMyddOy8vYW50aWdlbnNbc2hlbGwuYW50aWdlbl1cblxuICAgICAgICAgICAgaWYgKHNoZWxsLmRvc2VzLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICAgICAgc2hlbGwuZG9zZSA9IHNoZWxsLmRvc2VzW3NoZWxsLmRvc2VzLmxlbmd0aC0xXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBzaGVsbC5hbnRpZ2VucyA9IE9iamVjdC5rZXlzKGFudGlnZW5zKTtcblxuICAgICAgICBpZiAoJGxvY2F0aW9uLnBhdGgoKSA9PSAnL2NvdmVyYWdlL3JlZGNhdGVnb3J5Jykge1xuICAgICAgICAgICAgc2hlbGwuYW50aWdlbiA9IFwiRFBUXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzaGVsbC5hbnRpZ2VuID0gXCJBTExcIjtcbiAgICAgICAgfVxuICAgICAgICBzaGVsbC51cGRhdGVEb3NlcygpO1xuXG4gICAgICAgIEZpbHRlclNlcnZpY2UuZ2V0UGVyaW9kUmFuZ2VzKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBzaGVsbC5jb3ZlcmFnZVllYXJzID0gZGF0YS55ZWFyc1xuICAgICAgICAgICAgc2hlbGwuc3RhcnRZZWFyID0gZGF0YS55ZWFyc1tkYXRhLnllYXJzLmxlbmd0aC0xXVxuICAgICAgICAgICAgc2hlbGwuZW5kWWVhciA9IGRhdGEueWVhcnNbZGF0YS55ZWFycy5sZW5ndGgtMV1cbiAgICAgICAgICAgIHNoZWxsLmFjdGl2ZUNvdmVyYWdlWWVhciA9IGRhdGEueWVhcnNbZGF0YS55ZWFycy5sZW5ndGgtMV1cbiAgICAgICAgfSk7XG5cblxuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIEZpbHRlclNlcnZpY2UuZ2V0TGFzdFBlcmlvZCgpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgc2hlbGwuZGVmYXVsdFBlcmlvZCA9IGRhdGE7XG4gICAgICAgICAgICBzaGVsbC5kZWZhdWx0TW9udGggPSBwYXJzZUludChkYXRhLnBlcmlvZC50b1N0cmluZygpLnN1YnN0cmluZyg0LCA2KSk7XG4gICAgICAgICAgICAkc2NvcGUuZGVmYXVsdE1vbnRoID0gc2hlbGwuZGVmYXVsdE1vbnRoO1xuICAgICAgICAgICAgJHNjb3BlLmRlZmF1bHRQZXJpb2QgPSBkYXRhLnBlcmlvZC50b1N0cmluZygpO1xuXG4gICAgICAgICAgICB2YXIgcGVyaW9kID0gZGF0YS5wZXJpb2QudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIHZhciBtb250aF9udW1iZXIgPSBwYXJzZUludChwZXJpb2Quc3Vic3RyaW5nKDQsNikpO1xuICAgICAgICAgICAgdmFyIG1vbnRoX2xhYmVsID0gTW9udGhTZXJ2aWNlLmdldE1vbnRoTmFtZShtb250aF9udW1iZXIpO1xuICAgICAgICAgICAgLy9zaGVsbC5lbmRNb250aCA9IHt5ZWFyOnBlcmlvZC5zdWJzdHJpbmcoMCw0KSwgcGVyaW9kOnBlcmlvZCwgbmFtZTptb250aF9sYWJlbCwgbW9udGg6bW9udGhfbnVtYmVyLCBcIiQkaGFzaEtleVwiOlwib2JqZWN0OjE4NlwifVxuICAgICAgICAgICAgLy9zaGVsbC5lbmRNb250aCA9IHNoZWxsLm1vbnRoc1tzaGVsbC5kZWZhdWx0TW9udGgtMV07XG5cbiAgICAgICAgICAgIHZhciBlbmRNb250aEluZGV4ID0gMDtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBzaGVsbC5tb250aHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2hlbGwubW9udGhzW2ldLnBlcmlvZCA9PSBwZXJpb2QpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hlbGwuZW5kTW9udGggPSBzaGVsbC5tb250aHNbaV07XG4gICAgICAgICAgICAgICAgICAgIGVuZE1vbnRoSW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vc2V0IHRoZSBzdGFydCBwZXJpb2QgdG8gNiBtb250aHMgYmFjayBieSBkZWZhdWx0XG4gICAgICAgICAgICB2YXIgc3RhcnRNb250aEluZGV4ID0gKGVuZE1vbnRoSW5kZXggLSA2KSArIDE7XG4gICAgICAgICAgICBpZiAoc3RhcnRNb250aEluZGV4IDwgMCkge1xuICAgICAgICAgICAgICAgIHN0YXJ0TW9udGhJbmRleCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzaGVsbC5tb250aHMgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgc2hlbGwuc3RhcnRNb250aCA9IHNoZWxsLm1vbnRoc1tzdGFydE1vbnRoSW5kZXhdO1xuICAgICAgICAgICAgfVxuXG5cblxuXG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJkZXJlXCIrSlNPTi5zdHJpbmdpZnkoc2hlbGwubW9udGhzWzEzXSkpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNoZWxsLnN0b2NrYXRoYW5kID0gMDtcblxuXG5cbiAgICAgICAgRmlsdGVyU2VydmljZS5nZXREaXN0cmljdHMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBkaXN0cmljdFNwZWNpZmljUGF0aHMgPSBbXG4gICAgICAgICAgICAgICAgJy9zdG9jay9kaXN0cmlidXRpb24nLFxuICAgICAgICAgICAgICAgIC8vICcvc3RvY2svdXB0YWtlcmF0ZScsXG4gICAgICAgICAgICAgICAgLy8gJy91bmVwaS9kb3dubG9hZCdcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBpZiAoZGlzdHJpY3RTcGVjaWZpY1BhdGhzLmluZGV4T2YoJGxvY2F0aW9uLnBhdGgoKSkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnVuc2hpZnQoeyduYW1lJzogJ05hdGlvbmFsJ30pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzaGVsbC5kaXN0cmljdHMgPSBkYXRhO1xuICAgICAgICAgICAgc2hlbGwuc2VsZWN0ZWREaXN0cmljdCA9IHNoZWxsLmRpc3RyaWN0c1swXTtcbiAgICAgICAgICAgIHNoZWxsLmRpc3RyaWN0ID0gc2hlbGwuZGlzdHJpY3RzWzBdLm5hbWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIEZpbHRlclNlcnZpY2UuZ2V0VmFjY2luZXMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHNoZWxsLnZhY2NpbmVzID0gZGF0YTtcbiAgICAgICAgICAgIHNoZWxsLnNlbGVjdGVkVmFjY2luZSA9IHNoZWxsLnZhY2NpbmVzWzVdO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLz09PT0gRW5kIFN0b2NrIE1hbmFnZW1lbnQgPT09PT1cblxuXG4gICAgICAgIC8vPT09PT09PT1QbGFubmluZz09PT09PT09PVxuICAgICAgICBzaGVsbC5zZWxlY3RlZFllYXIgPSBcIlwiO1xuICAgICAgICBGaWx0ZXJTZXJ2aWNlLmdldFllYXIoKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgc2hlbGwueWVhcnMgPSBkYXRhO1xuICAgICAgICAgICAgc2hlbGwuc2VsZWN0ZWRZZWFyID0gc2hlbGwueWVhcnNbMF07XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgLy89PT0gQ29sZCBjaGFpbiA9PT09PT1cbiAgICAgICAgc2hlbGwuc3RhcnRRdWFydGVyID0gc2hlbGwuc3RhcnRRdWFydGVyID8gc2hlbGwuc3RhcnRRdWFydGVyLm5hbWUgOiBcIjIwMTYwMVwiO1xuICAgICAgICBzaGVsbC5lbmRRdWFydGVyID0gc2hlbGwuZW5kUXVhcnRlciA/IHNoZWxsLmVuZFF1YXJ0ZXIubmFtZSA6IFwiMjAxNjAzXCI7XG4gICAgICAgIHNoZWxsLnNlbGVjdGVkRnJpZGdlRGlzdHJpY3QgPSBcIlwiO1xuICAgICAgICBzaGVsbC5zZWxlY3RlZEZyaWRnZUNhcmVMZXZlbCA9IFwiXCI7XG5cblxuICAgICAgICBGaWx0ZXJTZXJ2aWNlLmdldEZyaWRnZURpc3RyaWN0cygpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgc2hlbGwuZnJpZGdlRGlzdHJpY3RzID0gZGF0YTtcbiAgICAgICAgICAgIHNoZWxsLnNlbGVjdGVkRnJpZGdlRGlzdHJpY3QgPSBzaGVsbC5mcmlkZ2VEaXN0cmljdHNbMF07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIEZpbHRlclNlcnZpY2UuZ2V0RnJpZGdlQ2FyZUxldmVscygpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgc2hlbGwuZnJpZGdlQ2FyZUxldmVscyA9IGRhdGE7XG4gICAgICAgICAgICAvL3NoZWxsLnNlbGVjdGVkRnJpZGdlQ2FyZUxldmVsID0gc2hlbGwuZnJpZGdlQ2FyZUxldmVsc1swXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgRmlsdGVyU2VydmljZS5nZXRGcmlkZ2VRdWFydGVycygpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgc2hlbGwuZnJpZGdlUXVhcnRlcnMgPSBkYXRhO1xuICAgICAgICAgICAvLyBzaGVsbC5zZWxlY3RlZEZyaWRnZVF1YXJ0ZXIgPSBzaGVsbC5mcmlkZ2VRdWFydGVyc1szXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy89PT09IEVuZCBDb2xkIENoYWluID09PT09PT1cblxuXG4vLyAgICAgICAgJHNjb3BlLiR3YXRjaCgnc2hlbGwuZW5kTW9udGgnLCBmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgaWYgKHNoZWxsLmVuZE1vbnRoKSB7XG4vLyAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3JlZnJlc2gnLCBzaGVsbC5zdGFydE1vbnRoLCBzaGVsbC5lbmRNb250aCwgc2hlbGwuc2VsZWN0ZWREaXN0cmljdCwgc2hlbGwuc2VsZWN0ZWRWYWNjaW5lKTtcbi8vICAgICAgICAgICAgfVxuLy8gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2hHcm91cChbJ3NoZWxsLmVuZE1vbnRoJywgJ3NoZWxsLnNlbGVjdGVkVmFjY2luZScsICdzaGVsbC5zZWxlY3RlZERpc3RyaWN0J10sIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICBpZihkYXRhWzBdICYmIGRhdGFbMV0gJiYgZGF0YVsyXSl7XG4gICAgICAgICAgICAgICAgaWYgKHNoZWxsLmVuZE1vbnRoKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncmVmcmVzaCcsIHNoZWxsLnN0YXJ0TW9udGgsIHNoZWxsLmVuZE1vbnRoLCBzaGVsbC5zZWxlY3RlZERpc3RyaWN0LCBzaGVsbC5zZWxlY3RlZFZhY2NpbmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaEdyb3VwKFsnc2hlbGwuZmluYW5jZVN0YXJ0WWVhcicsICdzaGVsbC5maW5hbmNlRW5kWWVhciddLCBmdW5jdGlvbihkYXRhLCBvbGREYXRhKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3JlZnJlc2hGaW5hbmNlJywge1xuICAgICAgICAgICAgICAgIHN0YXJ0WWVhcjogc2hlbGwuZmluYW5jZVN0YXJ0WWVhcixcbiAgICAgICAgICAgICAgICBlbmRZZWFyOiBzaGVsbC5maW5hbmNlRW5kWWVhcixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoR3JvdXAoXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ3NoZWxsLnN0YXJ0WWVhcicsXG4gICAgICAgICAgICAgICAgJ3NoZWxsLmVuZFllYXInLFxuICAgICAgICAgICAgICAgICdzaGVsbC5hY3RpdmVDb3ZlcmFnZVllYXInLFxuICAgICAgICAgICAgICAgICdzaGVsbC5hbnRpZ2VuJyxcbiAgICAgICAgICAgICAgICAnc2hlbGwuZG9zZScsXG4gICAgICAgICAgICAgICAgJ3NoZWxsLmRpc3RyaWN0J1xuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIGlmKGRhdGFbMF0pe1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2hlbGwuZW5kTW9udGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncmVmcmVzaENvdmVyYWdlMicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGwuZW5kTW9udGgsIC8vQmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbC5zdGFydFllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGwuZW5kWWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbC5hY3RpdmVDb3ZlcmFnZVllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGwuYW50aWdlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbC5kb3NlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsLmRpc3RyaWN0XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3JlZnJlc2hDb3ZlcmFnZTMnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kTW9udGg6IHNoZWxsLmVuZE1vbnRoLCAvL0JhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRZZWFyOiBzaGVsbC5zdGFydFllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kWWVhcjogc2hlbGwuZW5kWWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVDb3ZlcmFnZVllYXI6IHNoZWxsLmFjdGl2ZUNvdmVyYWdlWWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbnRpZ2VuOiBzaGVsbC5hbnRpZ2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvc2U6IHNoZWxsLmRvc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IHNoZWxsLmRpc3RyaWN0XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0cnVlXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gRGlzYWJsZWQgYmVjYXVzZSBpdCBsb29rcyBsaWtlIGEgZHVwbGljYXRpb25cbiAgICAgICAgLyokc2NvcGUuJHdhdGNoKCdzaGVsbC5lbmRRdWFydGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoc2hlbGwuZW5kUXVhcnRlcikge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncmVmcmVzaENhcGFjaXR5Jywgc2hlbGwuc3RhcnRRdWFydGVyLCBzaGVsbC5lbmRRdWFydGVyLCBzaGVsbC5zZWxlY3RlZEZyaWRnZURpc3RyaWN0LCBzaGVsbC5zZWxlY3RlZEZyaWRnZUNhcmVMZXZlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpOyovXG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaEdyb3VwKFsnc2hlbGwuZW5kUXVhcnRlcicsICdzaGVsbC5zZWxlY3RlZEZyaWRnZURpc3RyaWN0JywgJ3NoZWxsLnNlbGVjdGVkRnJpZGdlQ2FyZUxldmVsJywgJ3NoZWxsLnN0YXJ0UXVhcnRlciddLCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGlmKGRhdGFbMF0gJiYgZGF0YVsxXSl7XG4gICAgICAgICAgICAgICAgaWYgKHNoZWxsLmVuZFF1YXJ0ZXIgJiYgc2hlbGwuc2VsZWN0ZWRGcmlkZ2VEaXN0cmljdCkge1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3JlZnJlc2hDYXBhY2l0eScsIHNoZWxsLnN0YXJ0UXVhcnRlciwgc2hlbGwuZW5kUXVhcnRlciwgc2hlbGwuc2VsZWN0ZWRGcmlkZ2VEaXN0cmljdCwgc2hlbGwuc2VsZWN0ZWRGcmlkZ2VDYXJlTGV2ZWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgICRzY29wZS4kd2F0Y2goJ3NoZWxsLnllYXJzJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmIChzaGVsbC5zZWxlY3RlZFllYXIpe1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncmVmcmVzaEF3cCcsIHNoZWxsLnNlbGVjdGVkWWVhcilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaEdyb3VwKFsnc2hlbGwueWVhcnMnXSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBpZihkYXRhWzBdICYmIGRhdGFbMV0pe1xuICAgICAgICAgICAgICAgIGlmIChzaGVsbC5zZWxlY3RlZFllYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdyZWZyZXNoQXdwJywgc2hlbGwuc2VsZWN0ZWRZZWFyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ3NoZWxsLmNvdmVyYWdlUGVyaW9kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoc2hlbGwuY292ZXJhZ2VQZXJpb2QpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3JlZnJlc2hDb3ZlcmFnZScsIHNoZWxsLmNvdmVyYWdlUGVyaW9kLCBzaGVsbC5zZWxlY3RlZERpc3RyaWN0LCBzaGVsbC5zZWxlY3RlZFZhY2NpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoR3JvdXAoWydzaGVsbC5jb3ZlcmFnZVBlcmlvZCcsICdzaGVsbC5zZWxlY3RlZERpc3RyaWN0JywgJ3NoZWxsLnNlbGVjdGVkVmFjY2luZSddLCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGlmKGRhdGFbMF0gJiYgZGF0YVsxXSAmJiBkYXRhWzJdKXtcbiAgICAgICAgICAgICAgICBpZiAoc2hlbGwuY292ZXJhZ2VQZXJpb2QpIHtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdyZWZyZXNoQ292ZXJhZ2UnLCBzaGVsbC5jb3ZlcmFnZVBlcmlvZCwgc2hlbGwuc2VsZWN0ZWREaXN0cmljdCwgc2hlbGwuc2VsZWN0ZWRWYWNjaW5lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ3NoZWxsLmNvdmVyYWdlUGVyaW9kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoc2hlbGwuY292ZXJhZ2VQZXJpb2QgJiYgc2hlbGwuc2VsZWN0ZWREaXN0cmljdCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncmVmcmVzaFVuZXBpJywgc2hlbGwuY292ZXJhZ2VQZXJpb2QsIHNoZWxsLnNlbGVjdGVkRGlzdHJpY3QsIHNoZWxsLnNlbGVjdGVkVmFjY2luZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2hHcm91cChbJ3NoZWxsLmNvdmVyYWdlUGVyaW9kJywgJ3NoZWxsLnNlbGVjdGVkRGlzdHJpY3QnLCAnc2hlbGwuc2VsZWN0ZWRWYWNjaW5lJ10sIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgaWYoZGF0YVswXSAmJiBkYXRhWzFdICYmIGRhdGFbMl0pe1xuICAgICAgICAgICAgICAgIGlmIChzaGVsbC5jb3ZlcmFnZVBlcmlvZCAmJiBzaGVsbC5zZWxlY3RlZERpc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncmVmcmVzaFVuZXBpJywgc2hlbGwuY292ZXJhZ2VQZXJpb2QsIHNoZWxsLnNlbGVjdGVkRGlzdHJpY3QsIHNoZWxsLnNlbGVjdGVkVmFjY2luZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuXG4gICAgfVxuXSk7XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnc2VydmljZXMnKS5zZXJ2aWNlKCdNYXBTdXBwb3J0U2VydmljZScsIFtcbiAgICBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgY3JlYXRlRGlzdHJpY3REYXRhTWFwID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgdmFyIGRhdGFEaXN0cmljdE1hcCA9IHt9O1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGVyaW9kID0gZGF0YVtpXS5wZXJpb2Q7XG4gICAgICAgICAgICAgICAgdmFyIGZpcnN0X2Rvc2UgPSBkYXRhW2ldLnRvdGFsX2ZpcnN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgdmFyIHNlY29uZF9kb3NlID0gZGF0YVtpXS50b3RhbF9zZWNvbmRfZG9zZTtcbiAgICAgICAgICAgICAgICB2YXIgdGhpcmRfZG9zZSA9IGRhdGFbaV0udG90YWxfdGhpcmRfZG9zZTtcbiAgICAgICAgICAgICAgICB2YXIgbGFzdF9kb3NlID0gZGF0YVtpXS50b3RhbF9sYXN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgdmFyIHBsYW5uZWQgPSBkYXRhW2ldLnRvdGFsX3BsYW5uZWQ7XG4gICAgICAgICAgICAgICAgdmFyIHZhY2NpbmUgPSBkYXRhW2ldLnZhY2NpbmVfX25hbWU7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RyaWN0ID0gZGF0YVtpXS5kaXN0cmljdF9fbmFtZTtcbiAgICAgICAgICAgICAgICB2YXIgcGVyaW9kWWVhciA9IE51bWJlcihwZXJpb2QudG9TdHJpbmcoKS5zdWJzdHIoMCwgNCkpO1xuICAgICAgICAgICAgICAgIHZhciBwZXJpb2RNb250aCA9IE51bWJlcihwZXJpb2QudG9TdHJpbmcoKS5zdWJzdHIoNCwgNikpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEgKGRpc3RyaWN0IGluIGRhdGFEaXN0cmljdE1hcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YURpc3RyaWN0TWFwW2Rpc3RyaWN0XSA9IHt9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghICh2YWNjaW5lIGluIGRhdGFEaXN0cmljdE1hcFtkaXN0cmljdF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFEaXN0cmljdE1hcFtkaXN0cmljdF1bdmFjY2luZV0gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoISAocGVyaW9kWWVhciBpbiBkYXRhRGlzdHJpY3RNYXBbZGlzdHJpY3RdW3ZhY2NpbmVdKSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhRGlzdHJpY3RNYXBbZGlzdHJpY3RdW3ZhY2NpbmVdW3BlcmlvZFllYXJdID0ge307XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCEgKHBlcmlvZE1vbnRoIGluIGRhdGFEaXN0cmljdE1hcFtkaXN0cmljdF1bdmFjY2luZV1bcGVyaW9kWWVhcl0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFEaXN0cmljdE1hcFtkaXN0cmljdF1bdmFjY2luZV1bcGVyaW9kWWVhcl1bcGVyaW9kTW9udGhdID0ge307XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZGF0YURpc3RyaWN0TWFwW2Rpc3RyaWN0XVt2YWNjaW5lXVtwZXJpb2RZZWFyXVtwZXJpb2RNb250aF0uZmlyc3RfZG9zZSA9IGZpcnN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgZGF0YURpc3RyaWN0TWFwW2Rpc3RyaWN0XVt2YWNjaW5lXVtwZXJpb2RZZWFyXVtwZXJpb2RNb250aF0ubGFzdF9kb3NlID0gbGFzdF9kb3NlO1xuICAgICAgICAgICAgICAgIGRhdGFEaXN0cmljdE1hcFtkaXN0cmljdF1bdmFjY2luZV1bcGVyaW9kWWVhcl1bcGVyaW9kTW9udGhdLnNlY29uZF9kb3NlID0gc2Vjb25kX2Rvc2U7XG4gICAgICAgICAgICAgICAgZGF0YURpc3RyaWN0TWFwW2Rpc3RyaWN0XVt2YWNjaW5lXVtwZXJpb2RZZWFyXVtwZXJpb2RNb250aF0udGhpcmRfZG9zZSA9IHRoaXJkX2Rvc2U7XG4gICAgICAgICAgICAgICAgZGF0YURpc3RyaWN0TWFwW2Rpc3RyaWN0XVt2YWNjaW5lXVtwZXJpb2RZZWFyXVtwZXJpb2RNb250aF0ucGxhbm5lZCA9IHBsYW5uZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBkYXRhRGlzdHJpY3RNYXA7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldFBlcmlvZExpc3QgPSBmdW5jdGlvbihkYXRhLCBlbmRZZWFyLCByZXBvcnRUb2dnbGUpIHtcbiAgICAgICAgICAgIHZhciBwZXJpb2RMaXN0ID0gW107XG5cbiAgICAgICAgICAgIGlmIChyZXBvcnRUb2dnbGUgPT0gJ01DWScpIHtcbiAgICAgICAgICAgICAgICBwZXJpb2RMaXN0LnB1c2goXG4gICAgICAgICAgICAgICAgICAgIFtlbmRZZWFyLnRvU3RyaW5nKCksICBnZXRMYXN0VmFsdWUoZGF0YVtlbmRZZWFyXSwgMTIpXVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVwb3J0VG9nZ2xlID09ICdNRlknKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRZZWFyID0gZW5kWWVhciArIDE7XG4gICAgICAgICAgICAgICAgdmFyIGxhc3RWYWx1ZTtcblxuICAgICAgICAgICAgICAgIGlmIChuZXh0WWVhciBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IGdldExhc3RWYWx1ZShkYXRhW25leHRZZWFyXSwgNik7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZExpc3QucHVzaChbbmV4dFllYXIudG9TdHJpbmcoKSwgbGFzdFZhbHVlXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gZ2V0TGFzdFZhbHVlKGRhdGFbZW5kWWVhcl0sIDEyKTtcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kTGlzdC5wdXNoKFtlbmRZZWFyLnRvU3RyaW5nKCksIGxhc3RWYWx1ZV0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXBvcnRUb2dnbGUgPT0gJ0FDWScpIHtcbiAgICAgICAgICAgICAgICBwZXJpb2RMaXN0LnB1c2guYXBwbHkocGVyaW9kTGlzdCxcbiAgICAgICAgICAgICAgICAgICAgZ2V0VmFsdWVzSW5SYW5nZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRZZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRMYXN0VmFsdWUoZGF0YVtlbmRZZWFyXSwgMTIpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlcG9ydFRvZ2dsZSA9PSAnQUZZJykge1xuICAgICAgICAgICAgICAgIHZhciBuZXh0WWVhciA9IGVuZFllYXIgKyAxO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5leHRZZWFyIGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kTGlzdC5wdXNoLmFwcGx5KHBlcmlvZExpc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRWYWx1ZXNJblJhbmdlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kWWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRZZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldExhc3RWYWx1ZShkYXRhW25leHRZZWFyXSwgNilcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwZXJpb2RMaXN0LnB1c2guYXBwbHkocGVyaW9kTGlzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldFZhbHVlc0luUmFuZ2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRZZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kWWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRMYXN0VmFsdWUoZGF0YVtlbmRZZWFyXSwgMTIpXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBwZXJpb2RMaXN0O1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldEFnZ3JlZ2F0ZXMoZGF0YSwgcGVyaW9kTGlzdCkge1xuICAgICAgICAgICAgcmV0dXJuIHBlcmlvZExpc3QucmVkdWNlKGZ1bmN0aW9uKGFjYywgcGVyaW9kKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEgPT0gdW5kZWZpbmVkIHx8IGRhdGFbcGVyaW9kWzBdXSA9PSB1bmRlZmluZWQgfHwgZGF0YVtwZXJpb2RbMF1dW3BlcmlvZFsxXV0gPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gZGF0YVtwZXJpb2RbMF1dW3BlcmlvZFsxXV07XG4gICAgICAgICAgICAgICAgYWNjLnRvdGFsUGxhbm5lZCArPSBpdGVtLnBsYW5uZWQ7XG4gICAgICAgICAgICAgICAgYWNjLnRvdGFsRmlyc3REb3NlICs9IGl0ZW0uZmlyc3RfZG9zZTtcbiAgICAgICAgICAgICAgICBhY2MudG90YWxTZWNvbmREb3NlICs9IGl0ZW0uc2Vjb25kX2Rvc2U7XG4gICAgICAgICAgICAgICAgYWNjLnRvdGFsVGhpcmREb3NlICs9IGl0ZW0udGhpcmRfZG9zZTtcbiAgICAgICAgICAgICAgICBhY2MudG90YWxMYXN0RG9zZSArPSBpdGVtLmxhc3RfZG9zZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgfSwge3RvdGFsUGxhbm5lZDogMCwgdG90YWxGaXJzdERvc2U6MCwgdG90YWxTZWNvbmREb3NlOjAsIHRvdGFsVGhpcmREb3NlOjAsIHRvdGFsTGFzdERvc2U6MH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNhbGN1bGF0ZUNvdmVyYWdlUmF0ZSA9IGZ1bmN0aW9uKGRhdGEsIHBlcmlvZExpc3QsIGRvc2VOdW1iZXIpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBnZXRBZ2dyZWdhdGVzKGRhdGEsIHBlcmlvZExpc3QpO1xuICAgICAgICAgICAgdmFyIGRvc2VWYWx1ZSA9IHJlc3VsdC50b3RhbExhc3REb3NlO1xuICAgICAgICAgICAgaWYgKGRvc2VOdW1iZXIgPT0gMSkgZG9zZVZhbHVlID0gcmVzdWx0LnRvdGFsRmlyc3REb3NlO1xuICAgICAgICAgICAgZWxzZSBpZiAoZG9zZU51bWJlciA9PSAyKSBkb3NlVmFsdWUgPSByZXN1bHQudG90YWxTZWNvbmREb3NlO1xuICAgICAgICAgICAgZWxzZSBpZiAoZG9zZU51bWJlciA9PSAzKSBkb3NlVmFsdWUgPSByZXN1bHQudG90YWxUaGlyZERvc2U7XG4gICAgICAgICAgICByZXR1cm4gKGRvc2VWYWx1ZSAvIHJlc3VsdC50b3RhbFBsYW5uZWQpICogMTAwO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBjYWxjdWxhdGVEcm9wb3V0UmF0ZSA9IGZ1bmN0aW9uKGRhdGEsIHBlcmlvZExpc3QpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBnZXRBZ2dyZWdhdGVzKGRhdGEsIHBlcmlvZExpc3QpO1xuICAgICAgICAgICAgcmV0dXJuICgocmVzdWx0LnRvdGFsRmlyc3REb3NlIC0gcmVzdWx0LnRvdGFsTGFzdERvc2UpIC8gcmVzdWx0LnRvdGFsRmlyc3REb3NlKSAqIDEwMDtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgY2FsY3VsYXRlUmVkQ2F0ZWdvcnlWYWx1ZSA9IGZ1bmN0aW9uKGRhdGEsIHBlcmlvZExpc3QpIHtcbiAgICAgICAgICAgIHZhciByID0gZ2V0QWdncmVnYXRlcyhkYXRhLCBwZXJpb2RMaXN0KTtcbiAgICAgICAgICAgIHZhciBhY2Nlc3MgPSAoci50b3RhbEZpcnN0RG9zZSAvIHIudG90YWxQbGFubmVkKSAqIDEwMDtcbiAgICAgICAgICAgIHZhciBkcm9wb3V0UmF0ZSA9ICgoci50b3RhbEZpcnN0RG9zZSAtIHIudG90YWxMYXN0RG9zZSkgLyByLnRvdGFsRmlyc3REb3NlKSAqIDEwMDtcblxuICAgICAgICAgICAgaWYgKGFjY2VzcyA+PSA5MCAmJiBkcm9wb3V0UmF0ZSA+PSAwICYmIGRyb3BvdXRSYXRlIDw9IDEwKSByZXR1cm4gMTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGFjY2VzcyA+PSA5MCAmJiAoZHJvcG91dFJhdGUgPCAwIHx8IGRyb3BvdXRSYXRlID4gMTApKSByZXR1cm4gMjtcbiAgICAgICAgICAgIGVsc2UgaWYgKGFjY2VzcyA8IDkwICYmIGRyb3BvdXRSYXRlID49IDAgJiYgZHJvcG91dFJhdGUgPD0gMTApIHJldHVybiAzO1xuICAgICAgICAgICAgZWxzZSBpZiAoYWNjZXNzIDwgOTAgJiYgKGRyb3BvdXRSYXRlIDwgMCB8fCBkcm9wb3V0UmF0ZSA+IDEwKSkgcmV0dXJuIDQ7XG4gICAgICAgICAgICBlbHNlIHJldHVybiAwO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRMYXN0VmFsdWUgPSBmdW5jdGlvbihkLCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChkID09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKGRlZmF1bHRWYWx1ZSBpbiBkKSByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhkKTtcbiAgICAgICAgICAgIHJldHVybiBrZXlzW2tleXMubGVuZ3RoLTFdO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRWYWx1ZXNJblJhbmdlID0gZnVuY3Rpb24oZGF0YSwgc3RhcnRZZWFyLCBzdGFydE1vbnRoLCBlbmRZZWFyLCBlbmRNb250aCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh5ZWFySW5kZXggaW4gZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmICh5ZWFySW5kZXggPCBzdGFydFllYXIgfHwgeWVhckluZGV4ID4gZW5kWWVhcikgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICBmb3IgKG1vbnRoSW5kZXggaW4gZGF0YVt5ZWFySW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh5ZWFySW5kZXggPT0gc3RhcnRZZWFyICYmIG1vbnRoSW5kZXggPCBzdGFydE1vbnRoKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHllYXJJbmRleCA9PSBlbmRZZWFyICYmIG1vbnRoSW5kZXggPiBlbmRNb250aCkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKFt5ZWFySW5kZXgsIG1vbnRoSW5kZXhdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBcImNyZWF0ZURpc3RyaWN0RGF0YU1hcFwiOiBjcmVhdGVEaXN0cmljdERhdGFNYXAsXG4gICAgICAgICAgICBcImdldFBlcmlvZExpc3RcIjogZ2V0UGVyaW9kTGlzdCxcbiAgICAgICAgICAgIFwiY2FsY3VsYXRlQ292ZXJhZ2VSYXRlXCI6IGNhbGN1bGF0ZUNvdmVyYWdlUmF0ZSxcbiAgICAgICAgICAgIFwiY2FsY3VsYXRlRHJvcG91dFJhdGVcIjogY2FsY3VsYXRlRHJvcG91dFJhdGUsXG4gICAgICAgICAgICBcImNhbGN1bGF0ZVJlZENhdGVnb3J5VmFsdWVcIjogY2FsY3VsYXRlUmVkQ2F0ZWdvcnlWYWx1ZVxuICAgICAgICB9O1xuICAgIH1cbl0pXG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnc2VydmljZXMnKS5zZXJ2aWNlKCdTdG9ja1NlcnZpY2UnLCBbJyRodHRwJyxcbiAgICBmdW5jdGlvbigkaHR0cCkge1xuICAgICAgICB2YXIgaGFuZGxlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldFN0b2NrQnlEaXN0cmljdCA9IGZ1bmN0aW9uKHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnYXBpL3N0b2NrL2F0aGFuZGJ5ZGlzdHJpY3QnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0TW9udGg6IHN0YXJ0TW9udGgsXG4gICAgICAgICAgICAgICAgICAgIGVuZE1vbnRoOiBlbmRNb250aCxcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lOiB2YWNjaW5lXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBnZXRVbmVwaVN0b2NrID0gZnVuY3Rpb24oZW5kTW9udGgsIGRpc3RyaWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdhcGkvc3RvY2svYXRoYW5kYnlkaXN0cmljdCcsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgZW5kTW9udGg6IGVuZE1vbnRoLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3RcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0U3RvY2tCeU1vbnRoID0gZnVuY3Rpb24oc3RhcnRNb250aCwgZW5kTW9udGgsIGRpc3RyaWN0LCB2YWNjaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdhcGkvc3RvY2svYXRoYW5kYnltb250aCcsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRNb250aDogc3RhcnRNb250aCxcbiAgICAgICAgICAgICAgICAgICAgZW5kTW9udGg6IGVuZE1vbnRoLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3QsXG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmU6IHZhY2NpbmVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgIHZhciBnZXRTdG9ja0J5RGlzdHJpY3RWYWNjaW5lID0gZnVuY3Rpb24oc3RhcnRNb250aCwgZW5kTW9udGgsIGRpc3RyaWN0LCB2YWNjaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3N0b2NrL3N0b2NrYnlkaXN0cmljdHZhY2NpbmUnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0TW9udGg6IHN0YXJ0TW9udGgsXG4gICAgICAgICAgICAgICAgICAgIGVuZE1vbnRoOiBlbmRNb250aCxcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lOiB2YWNjaW5lXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICAgICAgdmFyIGdldFN0b2NrZWRPdXQgPSBmdW5jdGlvbihzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvc3RvY2tlZG91dCcsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRNb250aDogc3RhcnRNb250aCxcbiAgICAgICAgICAgICAgICAgICAgZW5kTW9udGg6IGVuZE1vbnRoLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3QsXG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmU6IHZhY2NpbmVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGdldFN0b2NrTW9udGhzTGVmdCA9IGZ1bmN0aW9uKGRpc3RyaWN0LCB2YWNjaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdhcGkvc3RvY2svc3RvY2ttb250aHNsZWZ0Jywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3QsXG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmU6IHZhY2NpbmVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwiZ2V0U3RvY2tCeURpc3RyaWN0XCI6IGdldFN0b2NrQnlEaXN0cmljdCxcbiAgICAgICAgICAgIFwiZ2V0U3RvY2tCeU1vbnRoXCI6IGdldFN0b2NrQnlNb250aCxcbiAgICAgICAgICAgIFwiZ2V0U3RvY2tNb250aHNMZWZ0XCI6IGdldFN0b2NrTW9udGhzTGVmdCxcbiAgICAgICAgICAgIFwiZ2V0U3RvY2tCeURpc3RyaWN0VmFjY2luZVwiOiBnZXRTdG9ja0J5RGlzdHJpY3RWYWNjaW5lLFxuICAgICAgICAgICAgXCJnZXRTdG9ja2VkT3V0XCI6IGdldFN0b2NrZWRPdXQsXG4gICAgICAgICAgICBcImdldFVuZXBpU3RvY2tcIjpnZXRVbmVwaVN0b2NrXG4gICAgICAgIH07XG4gICAgfVxuXSlcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKS5jb250cm9sbGVyKCdBbm51YWxDb3ZlcmFnZUNvbnRyb2xsZXInLCBBbm51YWxDb3ZlcmFnZUNvbnRyb2xsZXIpO1xuXG5Bbm51YWxDb3ZlcmFnZUNvbnRyb2xsZXIuJGluamVjdCA9IFtcbiAgICAnJHNjb3BlJyxcbiAgICAnQ292ZXJhZ2VTZXJ2aWNlJyxcbiAgICAnQ292ZXJhZ2VDYWxjdWxhdG9yJyxcbiAgICAnQ2hhcnRQREZFeHBvcnQnLFxuICAgICckdGltZW91dCdcbl07XG5mdW5jdGlvbiBBbm51YWxDb3ZlcmFnZUNvbnRyb2xsZXIoJHNjb3BlLCBDb3ZlcmFnZVNlcnZpY2UsIENvdmVyYWdlQ2FsY3VsYXRvciwgQ2hhcnRQREZFeHBvcnQsICR0aW1lb3V0KSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICAkc2NvcGUuJG9uKCdyZWZyZXNoQ292ZXJhZ2UzJywgdXBkYXRlQ2hhcnQpO1xuXG4gICAgdm0uY2hhcnRPcHRpb25zID0gZ2V0Q2hhcnRPcHRpb25zKCk7XG4gICAgdm0uY2hhcnREYXRhID0gW107XG4gICAgdm0ueWVhckluZGV4ZXMgPSBbXTtcbiAgICB2bS5leHBvcnRQREYgPSBmdW5jdGlvbihuYW1lKSB7IENoYXJ0UERGRXhwb3J0LmV4cG9ydFdpdGhTdHlsZXIodm0sIG5hbWUpOyB9O1xuICAgIHZtLmluaXRMYWJlbHMgPSBpbml0TGFiZWxzO1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlQ2hhcnQoZSwgcGFyYW1zKSB7XG4gICAgICAgIHZhciBhbnRpZ2VuTGFiZWwgPSBwYXJhbXMuYW50aWdlbiA9PSAnQUxMJyA/ICdBbnRpZ2VucycgOiBwYXJhbXMuYW50aWdlbjtcbiAgICAgICAgdmFyIHllYXJQZXJpb2QgPSBwYXJhbXMuc3RhcnRZZWFyID09IHBhcmFtcy5lbmRZZWFyXG4gICAgICAgICAgICA/IHBhcmFtcy5zdGFydFllYXIgOiBgJHtwYXJhbXMuc3RhcnRZZWFyfSAtICR7cGFyYW1zLmVuZFllYXJ9YDtcbiAgICAgICAgdm0uY2hhcnRUaXRsZSA9IGAke2FudGlnZW5MYWJlbH0gQ292ZXJhZ2UgZm9yICR7eWVhclBlcmlvZH1gO1xuICAgICAgICBjbGVhckxhYmVscygpO1xuXG4gICAgICAgIENvdmVyYWdlU2VydmljZS5nZXRWYWNjaW5lRG9zZXNCeVBlcmlvZChwYXJhbXMpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgLyogQWdncmVnYXRlIHRoZSBkYXRhIGJhc2VkIG9uIHBlcmlvZCAqL1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGRhdGEucmVkdWNlKGZ1bmN0aW9uKGFjYywgaXRlbSkge1xuICAgICAgICAgICAgICAgIHZhciB2YWNjaW5lID0gaXRlbS52YWNjaW5lX19uYW1lO1xuICAgICAgICAgICAgICAgIHZhciB5ZWFyID0gaXRlbS5wZXJpb2QudG9TdHJpbmcoKS5zdWJzdHIoMCw0KTtcbiAgICAgICAgICAgICAgICBpZiAodm0ueWVhckluZGV4ZXMuaW5kZXhPZih5ZWFyKSA9PSAtMSkgdm0ueWVhckluZGV4ZXMucHVzaCh5ZWFyKTtcbiAgICAgICAgICAgICAgICBpZiAoISAodmFjY2luZSBpbiBhY2MpKSBhY2NbdmFjY2luZV0gPSB7fTtcbiAgICAgICAgICAgICAgICBpZiAoISAoeWVhciBpbiBhY2NbdmFjY2luZV0pKVxuICAgICAgICAgICAgICAgICAgICBhY2NbdmFjY2luZV1beWVhcl0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbEFjdHVhbDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsRmlyc3REb3NlOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxUaGlyZERvc2U6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbExhc3REb3NlOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxQbGFubmVkOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxTZWNvbmREb3NlOiAwXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBhY2NbdmFjY2luZV1beWVhcl0udG90YWxBY3R1YWwgKz0gaXRlbS50b3RhbF9hY3R1YWw7XG4gICAgICAgICAgICAgICAgYWNjW3ZhY2NpbmVdW3llYXJdLnRvdGFsRmlyc3REb3NlICs9IGl0ZW0udG90YWxfZmlyc3RfZG9zZTtcbiAgICAgICAgICAgICAgICBhY2NbdmFjY2luZV1beWVhcl0udG90YWxMYXN0RG9zZSArPSBpdGVtLnRvdGFsX2xhc3RfZG9zZTtcbiAgICAgICAgICAgICAgICBhY2NbdmFjY2luZV1beWVhcl0udG90YWxQbGFubmVkICs9IGl0ZW0udG90YWxfcGxhbm5lZDtcbiAgICAgICAgICAgICAgICBhY2NbdmFjY2luZV1beWVhcl0udG90YWxTZWNvbmREb3NlICs9IGl0ZW0udG90YWxfc2Vjb25kX2Rvc2U7XG4gICAgICAgICAgICAgICAgYWNjW3ZhY2NpbmVdW3llYXJdLnRvdGFsVGhpcmREb3NlICs9IGl0ZW0udG90YWxfdGhpcmRfZG9zZTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICB9LCB7fSk7XG5cbiAgICAgICAgICAgIC8qIENhbGN1bGF0ZSBSYXRlcyBmb3IgdGhlIHJlc3VsdHMgKi9cbiAgICAgICAgICAgIHZhciBjaGFydERhdGEgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIHZhY2NpbmUgaW4gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhY2NpbmVEYXRhID0ge2NSOiBbXSwgY1IxOiBbXSwgY1IyOiBbXSwgY1IzOiBbXX07XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciB5ZWFyIGluIHJlc3VsdFt2YWNjaW5lXSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGxhbm5lZCA9IHJlc3VsdFt2YWNjaW5lXVt5ZWFyXS50b3RhbFBsYW5uZWQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gcmVzdWx0W3ZhY2NpbmVdW3llYXJdO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjUjEgPSBDb3ZlcmFnZUNhbGN1bGF0b3IuY2FsY3VsYXRlQ292ZXJhZ2VSYXRlKGl0ZW0udG90YWxGaXJzdERvc2UsIHBsYW5uZWQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY1IyID0gQ292ZXJhZ2VDYWxjdWxhdG9yLmNhbGN1bGF0ZUNvdmVyYWdlUmF0ZShpdGVtLnRvdGFsU2Vjb25kRG9zZSwgcGxhbm5lZCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjUiA9IENvdmVyYWdlQ2FsY3VsYXRvci5jYWxjdWxhdGVDb3ZlcmFnZVJhdGUoaXRlbS50b3RhbExhc3REb3NlLCBwbGFubmVkKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNSMyA9IENvdmVyYWdlQ2FsY3VsYXRvci5jYWxjdWxhdGVDb3ZlcmFnZVJhdGUoaXRlbS50b3RhbFRoaXJkRG9zZSwgcGxhbm5lZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSB2bS55ZWFySW5kZXhlcy5pbmRleE9mKHllYXIpO1xuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lRGF0YS5jUi5wdXNoKHt4OiBpLCB5OiBjUn0pO1xuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lRGF0YS5jUjEucHVzaCh7eDogaSwgeTogY1IxfSk7XG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmVEYXRhLmNSMi5wdXNoKHt4OiBpLCB5OiBjUjJ9KTtcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZURhdGEuY1IzLnB1c2goe3g6IGksIHk6IGNSM30pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChwYXJhbXMuYW50aWdlbiAhPSBcIkFMTFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFNob3cgY292ZXJhZ2VzIGZvciB0aGUgZGlmZmVyZW50IGRvc2VzICovXG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0RGF0YS5wdXNoKHtrZXk6ICdEb3NlIDEnLCB2YWx1ZXM6IHZhY2NpbmVEYXRhLmNSMX0pOyAgXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAoJC5pbkFycmF5KHZhY2NpbmUsIFsnUEVOVEEnLCAnUENWJywgJ09QVicsICdIUFYnLCAnSVBWJywgJ1RUJ10pICE9IC0xKVxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnREYXRhLnB1c2goe2tleTogJ0Rvc2UgMicsIHZhbHVlczogdmFjY2luZURhdGEuY1IyfSk7ICBcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmICgkLmluQXJyYXkocGFyYW1zLmFudGlnZW4sIFsnUEVOVEEnLCAnUENWJywgJ09QVicsICdEUFQnXSkgIT0gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydERhdGEucHVzaCh7a2V5OiAnRG9zZSAzJywgdmFsdWVzOiB2YWNjaW5lRGF0YS5jUjN9KTsgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnREYXRhLnB1c2goe2tleTogdmFjY2luZSwgdmFsdWVzOiB2YWNjaW5lRGF0YS5jUn0pOyAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZtLmNoYXJ0RGF0YSA9IGNoYXJ0RGF0YTtcbiAgICAgICAgICAgIC8vICR0aW1lb3V0KGZ1bmN0aW9uKCkgeygpOyB9LCAyMDAwKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Q2hhcnRPcHRpb25zKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnbXVsdGlCYXJDaGFydCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA0NTAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDkwMCxcbiAgICAgICAgICAgICAgICBzdGFja2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzaG93Q29udHJvbHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGdyb3VwU3BhY2luZzogMC4yLFxuICAgICAgICAgICAgICAgIGNsaXBFZGdlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBtYXJnaW46IHt0b3A6IDcwfSxcbiAgICAgICAgICAgICAgICAvLyB1c2VJbnRlcmFjdGl2ZUd1aWRlbGluZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpbnRlcmFjdGl2ZUxheWVyOiB7Z3Jhdml0eTogJ3MnfSxcbiAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbihkKXsgcmV0dXJuIGQueDsgfSxcbiAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbihkKXsgcmV0dXJuIGQueTsgfSxcbiAgICAgICAgICAgICAgICBmb3JjZVk6IFswLDExMF0sXG4gICAgICAgICAgICAgICAgeEF4aXM6IHtcbiAgICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiAnWWVhcnMnLFxuICAgICAgICAgICAgICAgICAgICB0aWNrRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2bS55ZWFySW5kZXhlc1tkXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeUF4aXM6IHtcbiAgICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiAnQ292ZXJhZ2UgUmF0ZSAoJSknLFxuICAgICAgICAgICAgICAgICAgICB0aWNrczogMTBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRpc3BhdGNoOiB7XG4gICAgICAgICAgICAgICAgICAgIHJlbmRlckVuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbml0TGFiZWxzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdExhYmVscygpIHtcbiAgICAgICAgLy8gWW91IG5lZWQgdG8gYXBwbHkgdGhpcyBvbmNlIGFsbCB0aGUgYW5pbWF0aW9ucyBhcmUgYWxyZWFkeSBmaW5pc2hlZC4gT3RoZXJ3aXNlIGxhYmVscyB3aWxsIGJlIHBsYWNlZCB3cm9uZ2x5LlxuICAgICAgICBkMy5zZWxlY3RBbGwoJy5udi1tdWx0aWJhciAubnYtZ3JvdXAnKS5lYWNoKGZ1bmN0aW9uKGdyb3VwKXtcbiAgICAgICAgICB2YXIgZyA9IGQzLnNlbGVjdCh0aGlzKTtcblxuICAgICAgICAgIC8vIFJlbW92ZSBwcmV2aW91cyBsYWJlbHMgaWYgdGhlcmUgaXMgYW55XG4gICAgICAgICAgZy5zZWxlY3RBbGwoJ3RleHQnKS5yZW1vdmUoKTtcbiAgICAgICAgICBnLnNlbGVjdEFsbCgnLm52LWJhcicpLmVhY2goZnVuY3Rpb24oYmFyKXtcbiAgICAgICAgICAgIHZhciBiID0gZDMuc2VsZWN0KHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhcldpZHRoID0gYi5hdHRyKCd3aWR0aCcpO1xuICAgICAgICAgICAgdmFyIGJhckhlaWdodCA9IGIuYXR0cignaGVpZ2h0Jyk7XG5cbiAgICAgICAgICAgIGcuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAgICAgLy8gVHJhbnNmb3JtcyBzaGlmdCB0aGUgb3JpZ2luIHBvaW50IHRoZW4gdGhlIHggYW5kIHkgb2YgdGhlIGJhclxuICAgICAgICAgICAgICAvLyBpcyBhbHRlcmVkIGJ5IHRoaXMgdHJhbnNmb3JtLiBJbiBvcmRlciB0byBhbGlnbiB0aGUgbGFiZWxzXG4gICAgICAgICAgICAgIC8vIHdlIG5lZWQgdG8gYXBwbHkgdGhpcyB0cmFuc2Zvcm0gdG8gdGhvc2UuXG4gICAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBiLmF0dHIoJ3RyYW5zZm9ybScpKVxuICAgICAgICAgICAgICAudGV4dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8vIFR3byBkZWNpbWFscyBmb3JtYXRcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChiYXIueSkudG9GaXhlZCgwKSArIFwiJVwiO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuYXR0cigneScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy8gQ2VudGVyIGxhYmVsIHZlcnRpY2FsbHlcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5nZXRCQm94KCkuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGIuYXR0cigneScpKSAtIDEwOyAvLyAxMCBpcyB0aGUgbGFiZWwncyBtYWdpbiBmcm9tIHRoZSBiYXJcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8vIENlbnRlciBsYWJlbCBob3Jpem9udGFsbHlcbiAgICAgICAgICAgICAgICB2YXIgd2lkdGggPSB0aGlzLmdldEJCb3goKS53aWR0aDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChiLmF0dHIoJ3gnKSkgKyAocGFyc2VGbG9hdChiYXJXaWR0aCkgLyAyKSAtICh3aWR0aCAvIDIpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYmFyLXZhbHVlcycpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckxhYmVscygpIHtcbiAgICAgICAgZDMuc2VsZWN0QWxsKCcubnYtbXVsdGliYXIgLm52LWdyb3VwJykuZWFjaChmdW5jdGlvbihncm91cCl7XG4gICAgICAgICAgdmFyIGcgPSBkMy5zZWxlY3QodGhpcyk7XG4gICAgICAgICAgLy8gUmVtb3ZlIHByZXZpb3VzIGxhYmVscyBpZiB0aGVyZSBpcyBhbnlcbiAgICAgICAgICBnLnNlbGVjdEFsbCgndGV4dCcpLnJlbW92ZSgpO1xuICAgICAgfSk7XG4gICAgfVxufVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpXG4gICAgLmNvbnRyb2xsZXIoJ0NvdmVyYWdlQ29udHJvbGxlcicsIFtcbiAgICAgICAgJyRzY29wZScsJyRsb2NhdGlvbicsICdTdG9ja1NlcnZpY2UnLCAnJHJvb3RTY29wZScsICdOZ1RhYmxlUGFyYW1zJyxcbiAgICAgICAgJ0ZpbHRlclNlcnZpY2UnLCAnTW9udGhTZXJ2aWNlJywgJ0NvdmVyYWdlU2VydmljZScsICdNYXBTdXBwb3J0U2VydmljZScsICdDaGFydFBERkV4cG9ydCcsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCRsb2NhdGlvbiwgU3RvY2tTZXJ2aWNlLCAkcm9vdFNjb3BlLCBOZ1RhYmxlUGFyYW1zLFxuICAgICAgICBGaWx0ZXJTZXJ2aWNlLCBNb250aFNlcnZpY2UsIENvdmVyYWdlU2VydmljZSwgTWFwU3VwcG9ydFNlcnZpY2UsIENoYXJ0UERGRXhwb3J0KVxuICAgIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdmFyIHNoZWxsU2NvcGUgPSAkc2NvcGUuJHBhcmVudDtcbiAgICAgICAgc2hlbGxTY29wZS5jaGlsZCA9ICRzY29wZTtcbiAgICAgICAgdm0ucGF0aCA9ICRsb2NhdGlvbi5wYXRoKCk7XG4gICAgICAgIHZtLmVuZHR4dD1cIlwiO1xuICAgICAgICB2bS5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdm0uYWN0aXZlUmVwb3J0VG9nZ2xlID0gXCJBQ1lcIjtcbiAgICAgICAgdm0uYWN0aXZlUmVwb3J0WWVhciA9IFwiQ1lcIjtcbiAgICAgICAgdm0uYWN0aXZlRGlzdHJpY3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHZtLnNhbXBsZURpc3RyaWN0RGF0YSA9IHt9O1xuXG4gICAgICAgICRzY29wZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uKHZpZXdMb2NhdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHZpZXdMb2NhdGlvbiA9PT0gJGxvY2F0aW9uLnBhdGgoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBwZXJpb2REaXNwbGF5KHBlcmlvZClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHBlcmlvZCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBtb250aCA9IHBhcnNlSW50KHBlcmlvZC5zbGljZSg0LDYpKTtcbiAgICAgICAgICAgIHJldHVybiBNb250aFNlcnZpY2UuZ2V0TW9udGhOYW1lKG1vbnRoKSArIFwiIFwiICsgcGVyaW9kLnNsaWNlKDAsNClcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS51cGRhdGVSZXBvcnRUb2dnbGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdm0uYWN0aXZlUmVwb3J0VG9nZ2xlID0gdmFsdWU7XG4gICAgICAgICAgICB2bS5hY3RpdmVSZXBvcnRZZWFyID0gdm0uYWN0aXZlUmVwb3J0VG9nZ2xlLnN1YnN0cigxLDIpO1xuICAgICAgICAgICAgdm0udXBkYXRlTWFwV2l0aFZhY2NpbmUodm0uYWN0aXZlVmFjY2luZSk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7d2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdyZXNpemUnKSl9LCAzMDAwKTtcblxuICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5jaGFydFRpdGxlID0gdm0uZ2V0Q2hhcnRUaXRsZSh2bS5zZWxlY3RlZEFudGlnZW4pO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5pc0FjdGl2ZVJlcG9ydFRvZ2dsZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdm0uYWN0aXZlUmVwb3J0VG9nZ2xlID09IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdm0uZ2V0VmFjY2luZURvc2VzID0gZnVuY3Rpb24oZW5kWWVhciwgdmFjY2luZSwgZGlzdHJpY3QpIHtcbiAgICAgICAgICAgIC8vICQoJyNzcGlubmVyLW1vZGFsJykubW9kYWwoJ3Nob3cnKTtcblxuICAgICAgICAgICAgLy8gdm0uZW5kTW9udGg9cGVyaW9kO1xuXG4gICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmhpZGVNYXAgPSB0cnVlO1xuICAgICAgICAgICAgLy8gaWYgKGRpc3RyaWN0ICE9IHVuZGVmaW5lZCAmJiBkaXN0cmljdCAhPSBcIk5hdGlvbmFsXCIpIHtcbiAgICAgICAgICAgIC8vICAgICBzaGVsbFNjb3BlLmNoaWxkLm1hcFBsYWNlaG9sZGVyTWVzc2FnZSA9IFwiTm8gbWFwIGF2YWlsYWJsZS5cIjtcbiAgICAgICAgICAgIC8vICAgICByZXR1cm47XG4gICAgICAgICAgICAvLyB9XG5cblxuICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5tYXBQbGFjZWhvbGRlck1lc3NhZ2UgPSBcIk1hcCBsb2FkaW5nLiBQbGVhc2Ugd2FpdC4uLlwiO1xuXG4gICAgICAgICAgICAvL1RvZG86IFRlbXBvcmFyaWx5IGRpc2FibGUgZmlsdGVyaW5nIGJ5IGRpc3RyaWN0IGZvciB0aGUgdGFibGVcbiAgICAgICAgICAgIGRpc3RyaWN0ID0gXCJcIlxuICAgICAgICAgICAgdm0uZGlzdHJpY3QgPSBkaXN0cmljdDtcbiAgICAgICAgICAgIHZtLnZhY2NpbmUgPSB2YWNjaW5lOy8vdm0uc2VsZWN0ZWRWYWNjaW5lID8gdm0uc2VsZWN0ZWRWYWNjaW5lLm5hbWUgOiBcInZhXCI7XG4gICAgICAgICAgICB2bS5hY3RpdmVWYWNjaW5lID0gdmFjY2luZTtcblxuICAgICAgICAgICAgaWYgKHZhY2NpbmUgPT0gXCJEUFRcIiB8fCB2YWNjaW5lID09IFwiQUxMXCIpIHtcbiAgICAgICAgICAgICAgICB2bS5hY3RpdmVWYWNjaW5lID0gXCJQRU5UQVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBc3NpZ24gZGltZW5zaW9ucyBmb3IgbWFwIGNvbnRhaW5lclxuICAgICAgICAgICAgdmFyIHdpZHRoID0gNTAwLFxuICAgICAgICAgICAgICAgIGhlaWdodCA9IDUwMDtcbiAgICAgICAgICAgIHZhciBmaWVsZCA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgZG9zZTEgPSBcIlwiO1xuXG4gICAgICAgICAgICB2YXIgaW50ZXJwb2xhdGVGdW5jdGlvbjtcblxuICAgICAgICAgICAgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL3JlZGNhdGVnb3J5XCIpe1xuICAgICAgICAgICAgICAgIGludGVycG9sYXRlRnVuY3Rpb24gPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgPSAodCAqIDEwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodCA9PSAwICkgcmV0dXJuICdMaWdodEdyYXknO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQgPT0gMSkgcmV0dXJuICdEYXJrR3JlZW4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQgPT0gMikgcmV0dXJuICdZZWxsb3cnO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQgPT0gMykgcmV0dXJuICdPcmFuZ2UnO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQgPT0gNCkgcmV0dXJuICdSZWQnO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL2Ryb3BvdXRyYXRlXCIpe1xuICAgICAgICAgICAgICAgIGludGVycG9sYXRlRnVuY3Rpb24gPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ID0gdCAqIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ID09IDAgKSByZXR1cm4gJ0xpZ2h0R3JheSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHQgPj0gMCkgJiYgKHQgPD0gMTApKSByZXR1cm4gJ0dyZWVuJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgodCA+PSAtMTAgJiYgdCA8IDApIHx8ICh0ID4gMTAgJiYgdCA8PSAyMCkpIHJldHVybiAnWWVsbG93JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgodCA8IC0xMCkgfHwgKHQgPiAyMCkpIHJldHVybiAnUmVkJztcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbnRlcnBvbGF0ZUZ1bmN0aW9uID0gZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdCA9IHQgKiAxMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodCA9PSAwKSByZXR1cm4gJ0xpZ2h0R3JheSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodCA8IDUwKSByZXR1cm4gJ1JlZCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodD49IDUwICYmIHQ8OTApIHJldHVybiAnWWVsbG93JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ID49IDkwKSByZXR1cm4gJ0RhcmtHcmVlbic7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjb2xvciA9IGQzLnNjYWxlLmxpbmVhcigpXG4gICAgICAgICAgICAgICAgLmRvbWFpbihbMCwgMTAwXSlcbiAgICAgICAgICAgICAgICAuaW50ZXJwb2xhdGUoaW50ZXJwb2xhdGVGdW5jdGlvbik7XG5cbiAgICAgICAgICAgIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9kcm9wb3V0cmF0ZVwiKXtcbiAgICAgICAgICAgICAgICBmaWVsZD1cImRyb3Bfb3V0X3JhdGVcIjtcbiAgICAgICAgICAgICAgICB2bS5lbmR0eHQ9XCIlXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsc2UgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL2NvdmVyYWdlXCIpe1xuICAgICAgICAgICAgICAgIGZpZWxkPVwiY292ZXJhZ2VfcmF0ZVwiO1xuICAgICAgICAgICAgICAgIHZtLmVuZHR4dD1cIiVcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9zZTEgPSBcIkxPV1wiICsgXCIuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlwiKyBcIkhJR0hcIjtcblxuICAgICAgICAgICAgaWYgKHZhY2NpbmU9PVwiUEVOVEFcIil7XG4gICAgICAgICAgICAgICAgdm0udmFjY2luZT1cIkRQVDNcIjtcbiAgICAgICAgICAgICAgICB2bS52YWNkb3NlPVwiRFBUMS1EUFQzXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh2YWNjaW5lPT1cIlBDVlwiKXtcbiAgICAgICAgICAgICAgICB2bS52YWNjaW5lPVwiUENWM1wiO1xuICAgICAgICAgICAgICAgIHZtLnZhY2Rvc2U9XCJQQ1YxLVBDVjNcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHZhY2NpbmU9PVwiQkNHXCIpe1xuICAgICAgICAgICAgICAgIHZtLnZhY2NpbmU9XCJCQ0dcIjtcbiAgICAgICAgICAgICAgICB2bS52YWNkb3NlPVwiQkNHLU1FQVNMRVNcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHZhY2NpbmU9PVwiT1BWXCIpe1xuICAgICAgICAgICAgICAgIHZtLnZhY2NpbmU9XCJPUFYzXCI7XG4gICAgICAgICAgICAgICAgdm0udmFjZG9zZT1cIk9QVjAtT1BWM1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodmFjY2luZT09XCJIUFZcIil7XG4gICAgICAgICAgICAgICAgdm0udmFjY2luZT1cIkhQVjJcIjtcbiAgICAgICAgICAgICAgICB2bS52YWNkb3NlPVwiSFBWMS1IUFYyXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAgZWxzZSBpZiAodmFjY2luZT09XCJNRUFTTEVTXCIpe1xuICAgICAgICAgICAgICAgIHZtLnZhY2NpbmU9XCJNRUFTTEVTXCI7XG4gICAgICAgICAgICAgICAgdm0udmFjZG9zZT1cIkJDRy1NRUFTTEVTXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh2YWNjaW5lPT1cIlRUXCIpe1xuICAgICAgICAgICAgICAgIHZtLnZhY2NpbmU9XCJUVDJcIjtcbiAgICAgICAgICAgICAgICB2bS52YWNkb3NlPVwiVFQxLVRUMlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5wZXJpb2RNb250aCA9IHBlcmlvZERpc3BsYXkodm0uZW5kTW9udGgpO1xuXG4gICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnRoZWRvc2UgPSB2bS52YWNjaW5lO1xuICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC50aGV2YWNkb3NlID0gdm0udmFjZG9zZTtcblxuXG4gICAgICAgICAgICB2YXIgdmFsdWVGb3JtYXQgPSBkMy5mb3JtYXQoXCIsXCIpO1xuXG4gICAgICAgICAgICAvLyBEZWZpbmUgYSBnZW9ncmFwaGljYWwgcHJvamVjdGlvblxuICAgICAgICAgICAgLy8gQWxzbywgc2V0IGluaXRpYWwgem9vbSB0byBzaG93IHRoZSBmZWF0dXJlc1xuICAgICAgICAgICAgdmFyIHByb2plY3Rpb25cdD0gZDMuZ2VvLm1lcmNhdG9yKClcbiAgICAgICAgICAgICAgICAuc2NhbGUoMSk7XG5cbiAgICAgICAgICAgIC8vIFByZXBhcmUgYSBwYXRoIG9iamVjdCBhbmQgYXBwbHkgdGhlIHByb2plY3Rpb24gdG8gaXRcbiAgICAgICAgICAgIHZhciBwYXRoID0gZDMuZ2VvLnBhdGgoKVxuICAgICAgICAgICAgICAgIC5wcm9qZWN0aW9uKHByb2plY3Rpb24pO1xuXG4gICAgICAgICAgICAvLyBXZSBwcmVwYXJlIGFuIG9iamVjdCB0byBsYXRlciBoYXZlIGVhc2llciBhY2Nlc3MgdG8gdGhlIGRhdGEuXG4gICAgICAgICAgICB2YXIgZGF0YUJ5SWQgPSBkMy5tYXAoKTtcblxuICAgICAgICAgICAgLy9EZWZpbmUgcXVhbnRpemUgc2NhbGUgdG8gc29ydCBkYXRhIHZhbHVlcyBpbnRvIGJ1Y2tldHMgb2YgY29sb3JcbiAgICAgICAgICAgIC8vQ29sb3JzIGJ5IEN5bnRoaWEgQnJld2VyIChjb2xvcmJyZXdlcjIub3JnKSwgOS1jbGFzcyBZbEduQnVcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLnJhbmdlKGQzLnJhbmdlKDkpLG1hcChmdW5jdGlvbihpKSB7IHJldHVybiAncScgKyBpICsgJy05Jzt9KSk7XG5cblxuICAgICAgICAgICAgLy8gQ292ZXJhZ2VTZXJ2aWNlLmdldFZhY2NpbmVEb3NlcyhwZXJpb2QsIHZhY2NpbmUpXG4gICAgICAgICAgICB2YXIgcGFyYW1zID0ge1xuICAgICAgICAgICAgICAgIGVuZFllYXI6IGVuZFllYXIsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdtYXAnXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBDb3ZlcmFnZVNlcnZpY2UuZ2V0VmFjY2luZURvc2VzQnlQZXJpb2QocGFyYW1zKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFEaXN0cmljdE1hcCA9IE1hcFN1cHBvcnRTZXJ2aWNlLmNyZWF0ZURpc3RyaWN0RGF0YU1hcChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdm0uc2FtcGxlRGlzdHJpY3REYXRhID0gZGF0YURpc3RyaWN0TWFwW09iamVjdC5rZXlzKGRhdGFEaXN0cmljdE1hcClbMF1dO1xuICAgICAgICAgICAgICAgICAgICAvLyB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIG1hcHMgdGhlIGRhdGEgb2YgdGhlIENTViBzbyBpdCBjYW4gYmUgZWFzaWx5IGFjY2Vzc2VkIGJ5XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBJRCBvZiB0aGUgZGlzdHJpY3QsIGZvciBleGFtcGxlOiBkYXRhQnlJZFsyMTk2XVxuICAgICAgICAgICAgICAgICAgICBkYXRhQnlJZCA9IGQzLm5lc3QoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmtleShmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5pZDsgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yb2xsdXAoZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGRbMF07IH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIExvYWQgZmVhdHVyZXMgZnJvbSBHZW9KU09OXG4gICAgICAgICAgICAgICAgICAgIGQzLmpzb24oJ3N0YXRpYy9hcHAvY29tcG9uZW50cy9jb3ZlcmFnZS9kYXRhL3VnX2Rpc3RyaWN0czIuZ2VvanNvbicsIGZ1bmN0aW9uIChlcnJvciwganNvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjYWxlQ2VudGVyID0gY2FsY3VsYXRlU2NhbGVDZW50ZXIoanNvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uLnNjYWxlKHNjYWxlQ2VudGVyLnNjYWxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jZW50ZXIoc2NhbGVDZW50ZXIuY2VudGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmFuc2xhdGUoW3dpZHRoIC8gMiwgaGVpZ2h0IC8gMl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBkaXN0IGluIGRhdGFEaXN0cmljdE1hcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3MgPSBkaXN0LmluZGV4T2YoXCIgXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhRGlzdHJpY3QgPSBkaXN0LnN1YnN0cmluZygwLCBwb3MpLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGpzb24uZmVhdHVyZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGpzb25EaXN0cmljdCA9IGpzb24uZmVhdHVyZXNbal0ucHJvcGVydGllcy5kaXN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YURpc3RyaWN0ID09IGpzb25EaXN0cmljdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbi5mZWF0dXJlc1tqXS5wcm9wZXJ0aWVzLmZpZWxkID0gZGF0YURpc3RyaWN0TWFwW2Rpc3RdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiNtYXBcIikuc2VsZWN0QWxsKFwiKlwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdmcgPSBkMy5zZWxlY3QoXCIjbWFwXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdmZWF0dXJlcycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzdmcuc2VsZWN0QWxsKFwicGF0aFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kYXRhKGpzb24uZmVhdHVyZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmVudGVyKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBwYXRoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBob3Zlcm9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGhvdmVyb3V0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgXCIjNzc3XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS51cGRhdGVNYXBXaXRoVmFjY2luZSh2bS5hY3RpdmVWYWNjaW5lKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5oaWRlTWFwID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLiRhcHBseSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBob3Zlcm9uID0gZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b29sdGlwJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUubGVmdCA9IGV2ZW50LnBhZ2VYICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS50b3AgPSBldmVudC5wYWdlWSArICdweCc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcImZpbGxcIiwgXCJ3aGl0ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiN0b29sdGlwXCIpLnN0eWxlKFwib3BhY2l0eVwiLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiN0b29sdGlwIC5uYW1lXCIpLnRleHQoZC5wcm9wZXJ0aWVzLmRpc3QpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QoXCIjdG9vbHRpcCAudmFsdWVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGV4dCAoZDMuZm9ybWF0KCcuMDFmJykodm0uZ2V0RGlzdHJpY3RWYWx1ZShkKSkrIHZtLmVuZHR4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgaG92ZXJvdXQgPSBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIHZtLmdldEZpbGxDb2xvcik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiN0b29sdGlwXCIpLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZtLmRyYXdMZWdlbmQgPSBmdW5jdGlvbihjb2xvckNvdW50cykge1xuICAgICAgICAgICAgICAgIC8vIFNldHVwIExlZ2VuZFxuICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiNnZW5kXCIpLnNlbGVjdEFsbChcIipcIikucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgdmFyIGxlZ2VuZFN2ZyA9IGQzLnNlbGVjdCgnI2dlbmQnKS5hcHBlbmQoJ3N2ZycpO1xuXG4gICAgICAgICAgICAgICAgbGVnZW5kU3ZnLmFwcGVuZChcImdcIilcbiAgICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJsZWdlbmRRdWFudFwiKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMjAsMjApXCIpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGxlZ2VuZCA9IGQzLmxlZ2VuZC5jb2xvcigpXG4gICAgICAgICAgICAgICAgICAubGFiZWxGb3JtYXQoZDMuZm9ybWF0KFwiLjJmXCIpKVxuICAgICAgICAgICAgICAgICAgLnNoYXBlV2lkdGgoNDApXG4gICAgICAgICAgICAgICAgICAuc2hhcGVIZWlnaHQoMjApO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL3JlZGNhdGVnb3J5XCIpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgZ2V0TGFiZWwgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgdG90YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwZXJjZW50YWdlID0gKHZhbHVlL3RvdGFsKSAqIDEwMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWUgKyAnICgnK3ZhbHVlKycpICgnICsgcGVyY2VudGFnZS50b0ZpeGVkKCkgKyAnJSknO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0b3RhbHMgPSBjb2xvckNvdW50cy5MaWdodEdyYXkgKyBjb2xvckNvdW50cy5EYXJrR3JlZW4gK1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3JDb3VudHMuWWVsbG93ICsgY29sb3JDb3VudHMuT3JhbmdlICsgY29sb3JDb3VudHMuUmVkO1xuXG4gICAgICAgICAgICAgICAgICAgIGxlZ2VuZC5jZWxscyhbMCwgMSwgMiwgMywgNF0pXG4gICAgICAgICAgICAgICAgICAgICAgICAubGFiZWxzKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRMYWJlbCgnTm8gZGF0YScsIGNvbG9yQ291bnRzLkxpZ2h0R3JheSwgdG90YWxzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRMYWJlbCgnQ0FUMScsIGNvbG9yQ291bnRzLkRhcmtHcmVlbiwgdG90YWxzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRMYWJlbCgnQ0FUMicsIGNvbG9yQ291bnRzLlllbGxvdywgdG90YWxzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRMYWJlbCgnQ0FUMycsIGNvbG9yQ291bnRzLk9yYW5nZSwgdG90YWxzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRMYWJlbCgnQ0FUNCcsIGNvbG9yQ291bnRzLlJlZCwgdG90YWxzKVxuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9kcm9wb3V0cmF0ZVwiKXtcbiAgICAgICAgICAgICAgICAgICAgbGVnZW5kLmNlbGxzKFswLCAzMCwgMTUsIDVdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmxhYmVscyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ05vIGRhdGEgKCcrY29sb3JDb3VudHMuTGlnaHRHcmF5KycpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC0xMCAmID4yMCAoJytjb2xvckNvdW50cy5SZWQrJyknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcoLTEwLTApICYgKDEwLTIwKSAoJytjb2xvckNvdW50cy5ZZWxsb3crJyknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcwLTEwICgnK2NvbG9yQ291bnRzLkRhcmtHcmVlbisnKSdcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZ2VuZC5jZWxscyg0KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmxhYmVscyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ05vIGRhdGEgKCcrY29sb3JDb3VudHMuTGlnaHRHcmF5KycpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPDUwJSAoJytjb2xvckNvdW50cy5SZWQrJyknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc1MC04OSUgKCcrY29sb3JDb3VudHMuWWVsbG93KycpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPj05MCUgKCcrY29sb3JDb3VudHMuRGFya0dyZWVuKycpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGVnZW5kLnNjYWxlKGNvbG9yKTtcblxuICAgICAgICAgICAgICAgIGxlZ2VuZFN2Zy5zZWxlY3QoXCIubGVnZW5kUXVhbnRcIilcbiAgICAgICAgICAgICAgICAgIC5jYWxsKGxlZ2VuZCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2bS5nZXRNYXBUaXRsZSA9IGZ1bmN0aW9uKHZhY2NpbmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZHVyYXRpb24gPSB2bS5hY3RpdmVSZXBvcnRUb2dnbGVbMF0gPT0gJ0EnID8gXCJBbm51YWxpemVkXCIgOiBcIk1vbnRobHlcIjtcbiAgICAgICAgICAgICAgICB2YXIgcGVyaW9kID0gdm0uZ2V0TGFzdE1hcFBlcmlvZCgpO1xuICAgICAgICAgICAgICAgIHZhciBmdWxsUGVyaW9kID0gYXBwSGVscGVycy5nZW5lcmF0ZUZ1bGxMYWJlbEZyb21QZXJpb2QocGVyaW9kWzBdK3BlcmlvZFsxXSk7XG4gICAgICAgICAgICAgICAgdmFyIGRvc2VOdW1iZXIgPSB2bS5hY3RpdmVEb3NlLnJlcGxhY2UoXCJEb3NlIFwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICB2YXIgYW50aWdlbkxhYmVsID0gdm0uYWN0aXZlRG9zZSAhPSB1bmRlZmluZWQgPyBcbiAgICAgICAgICAgICAgICAgICAgYCR7dmFjY2luZX0ke2Rvc2VOdW1iZXJ9YCA6IHZhY2NpbmU7XG5cbiAgICAgICAgICAgICAgICB2YXIgdGFiID0gXCJDb3ZlcmFnZVwiO1xuICAgICAgICAgICAgICAgIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9kcm9wb3V0cmF0ZVwiKSB0YWIgPSBcIkRyb3BvdXQgUmF0ZVwiO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL3JlZGNhdGVnb3J5XCIpIHRhYiA9IFwiUmVkIENhdGVnb3JpemF0aW9uXCI7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7ZHVyYXRpb259ICR7dGFifSBvZiAke2FudGlnZW5MYWJlbH0gZm9yICR7ZnVsbFBlcmlvZH1gO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdm0udXBkYXRlTWFwV2l0aFZhY2NpbmUgPSBmdW5jdGlvbih2YWNjaW5lKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgKHZtLmFjdGl2ZURpc3RyaWN0ICE9IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIC8vICAgICAmJiB2bS5hY3RpdmVEaXN0cmljdCAhPSBcIkFMTFwiXG4gICAgICAgICAgICAgICAgLy8gICAgICYmIHZtLmFjdGl2ZURpc3RyaWN0ICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuaGlkZU1hcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLm1hcFBsYWNlaG9sZGVyTWVzc2FnZSA9IFwiTm8gbWFwIGF2YWlsYWJsZS5cIjtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vICAgICBzaGVsbFNjb3BlLmNoaWxkLmhpZGVNYXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgICAvLyBzaGVsbFNjb3BlLmNoaWxkLmhpZGVNYXAgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmICh2YWNjaW5lID09IFwiRFBUXCIgfHwgdmFjY2luZSA9PSBcIkFMTFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmUgPSBcIlBFTlRBXCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdm0uYWN0aXZlVmFjY2luZSA9IHZhY2NpbmU7XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5tYXBUaXRsZSA9IHZtLmdldE1hcFRpdGxlKHZhY2NpbmUpO1xuXG4gICAgICAgICAgICAgICAgY29sb3JDb3VudHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFJlZDogMCxcbiAgICAgICAgICAgICAgICAgICAgWWVsbG93OiAwLFxuICAgICAgICAgICAgICAgICAgICBEYXJrR3JlZW46IDAsXG4gICAgICAgICAgICAgICAgICAgIExpZ2h0R3JheTogMCxcbiAgICAgICAgICAgICAgICAgICAgT3JhbmdlOiAwXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZhciBwYXRocyA9IGQzLnNlbGVjdChcIiNtYXAgc3ZnXCIpLnNlbGVjdEFsbChcInBhdGhcIik7XG4gICAgICAgICAgICAgICAgcGF0aHMuc3R5bGUoXCJmaWxsXCIsIHZtLmdldEZpbGxDb2xvcik7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge3ZtLmRyYXdMZWdlbmQoY29sb3JDb3VudHMpOyB9LCAxMCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2bS5nZXRGaWxsQ29sb3IgPSBmdW5jdGlvbihkKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB2bS5nZXREaXN0cmljdFZhbHVlKGQpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yVmFsdWUgPSBjb2xvcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKGNvbG9yVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbG9yVmFsdWUgaW4gY29sb3JDb3VudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yQ291bnRzW2NvbG9yVmFsdWVdICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbG9yVmFsdWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiTGlnaHRHcmF5XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdm0uZ2V0TGFzdE1hcFBlcmlvZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciB2YWNjaW5lRGF0YSA9IHZtLnNhbXBsZURpc3RyaWN0RGF0YVt2bS5hY3RpdmVWYWNjaW5lXTtcbiAgICAgICAgICAgICAgICB2YXIgcGVyaW9kTGlzdCA9IE1hcFN1cHBvcnRTZXJ2aWNlLmdldFBlcmlvZExpc3QoXG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmVEYXRhLFxuICAgICAgICAgICAgICAgICAgICBlbmRZZWFyLFxuICAgICAgICAgICAgICAgICAgICB2bS5hY3RpdmVSZXBvcnRUb2dnbGVcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJldHVybiBwZXJpb2RMaXN0W3BlcmlvZExpc3QubGVuZ3RoLTFdO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdm0uZ2V0RGlzdHJpY3RWYWx1ZSA9IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdHJpY3REYXRhID0gZC5wcm9wZXJ0aWVzLmZpZWxkO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRpc3RyaWN0RGF0YSA9PSB1bmRlZmluZWQgfHwgKCEgKHZtLmFjdGl2ZVZhY2NpbmUgaW4gZGlzdHJpY3REYXRhKSkgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yQ291bnRzWydMaWdodEdyYXknXSArPSAxO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ0xpZ2h0R3JheSc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHZhY2NpbmVEYXRhID0gZGlzdHJpY3REYXRhW3ZtLmFjdGl2ZVZhY2NpbmVdO1xuXG4gICAgICAgICAgICAgICAgdmFyIHBlcmlvZExpc3QgPSBNYXBTdXBwb3J0U2VydmljZS5nZXRQZXJpb2RMaXN0KFxuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgZW5kWWVhcixcbiAgICAgICAgICAgICAgICAgICAgdm0uYWN0aXZlUmVwb3J0VG9nZ2xlXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9jb3ZlcmFnZVwiKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1hcFN1cHBvcnRTZXJ2aWNlLmNhbGN1bGF0ZUNvdmVyYWdlUmF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhY2NpbmVEYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kTGlzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldEFjdGl2ZURvc2VOdW1iZXIoKVxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9kcm9wb3V0cmF0ZVwiKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1hcFN1cHBvcnRTZXJ2aWNlLmNhbGN1bGF0ZURyb3BvdXRSYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFjY2luZURhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJpb2RMaXN0XG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL3JlZGNhdGVnb3J5XCIpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWFwU3VwcG9ydFNlcnZpY2UuY2FsY3VsYXRlUmVkQ2F0ZWdvcnlWYWx1ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhY2NpbmVEYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kTGlzdFxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9O1xuXG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVNjYWxlQ2VudGVyKGZlYXR1cmVzKSB7XG4gICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBib3VuZGluZyBib3ggb2YgdGhlIHBhdGhzIChpbiBwaXhlbHMpIGFuZCBjYWxjdWxhdGUgYSBzY2FsZSBmYWN0b3IgYmFzZWQgb24gYm94IGFuZCBtYXAgc2l6ZVxuICAgICAgICAgICAgICAgIHZhciBiYm94X3BhdGggPSBwYXRoLmJvdW5kcyhmZWF0dXJlcyksXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlID0gMC45NSAvIE1hdGgubWF4KFxuICAgICAgICAgICAgICAgICAgICAgICAgKGJib3hfcGF0aFsxXVswXSAtIGJib3hfcGF0aFswXVswXSkgLyB3aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIChiYm94X3BhdGhbMV1bMV0gLSBiYm94X3BhdGhbMF1bMV0pIC8gaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBib3VuZGluZyBib3ggb2YgdGhlIGZlYXR1cmVzIChpbiBtYXAgdW5pdHMpIGFuZCB1c2UgaXQgdG8gY2FsY3VsYXRlIHRoZSBjZW50ZXIgb2YgdGhlIGZlYXR1cmVzLlxuICAgICAgICAgICAgICAgIHZhciBiYm94X2ZlYXR1cmUgPSBkMy5nZW8uYm91bmRzKGZlYXR1cmVzKSxcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgKGJib3hfZmVhdHVyZVsxXVswXSArIGJib3hfZmVhdHVyZVswXVswXSkgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgKGJib3hfZmVhdHVyZVsxXVsxXSArIGJib3hfZmVhdHVyZVswXVsxXSkgLyAyXTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICdzY2FsZSc6c2NhbGUsXG4gICAgICAgICAgICAgICAgICAgICdjZW50ZXInOmNlbnRlclxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAvLyBORVc6IERlZmluaW5nIGdldElkT2ZGZWF0dXJlXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRJZE9mRmVhdHVyZShmKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmLnByb3BlcnRpZXMuaWR1ZztcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgIH07XG5cblxuICAgICAgICB2bS5nZXRSZWRWYWNjaW5lRG9zZXMgPSBmdW5jdGlvbihwZXJpb2QsIHZhY2NpbmUsIGRpc3RyaWN0KSB7XG5cblxuICAgICAgICAgICAgLy9Ub2RvOiBUZW1wb3JhcmlseSBkaXNhYmxlIGZpbHRlcmluZyBieSBkaXN0cmljdCBmb3IgdGhlIHRhYmxlXG4gICAgICAgICAgICBkaXN0cmljdCA9IFwiXCJcbiAgICAgICAgICAgIHZtLmRpc3RyaWN0ID0gZGlzdHJpY3Q7XG4gICAgICAgICAgICB2bS52YWNjaW5lID0gdmFjY2luZTsvL3ZtLnNlbGVjdGVkVmFjY2luZSA/IHZtLnNlbGVjdGVkVmFjY2luZS5uYW1lIDogXCJ2YVwiO1xuXG4gICAgICAgICAgICAvLyBBc3NpZ24gZGltZW5zaW9ucyBmb3IgbWFwIGNvbnRhaW5lclxuICAgICAgICAgICAgdmFyIHdpZHRoID0gNTAwLFxuICAgICAgICAgICAgICAgIGhlaWdodCA9IDUwMDtcbiAgICAgICAgICAgIHZhciBmaWVsZCA9IFwiUmVkX2NhdGVnb3J5XCI7XG4gICAgICAgICAgICAvL2lmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9yZWRjYXRlZ29yeVwiKXtcbiAgICAgICAgICAgIC8vICAgIGZpZWxkPVwiUmVkX2NhdGVnb3J5XCJcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvL31cblxuICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5kaXN0cmljdCA9IHZtLmRpc3RyaWN0O1xuICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC52YWNjaW5lID0gICB2bS52YWNjaW5lO1xuXG4gICAgICAgICAgICB2YXIgdmFsdWVGb3JtYXQgPSBkMy5mb3JtYXQoXCIsXCIpO1xuXG4gICAgICAgICAgICAvLyBEZWZpbmUgYSBnZW9ncmFwaGljYWwgcHJvamVjdGlvblxuICAgICAgICAgICAgLy8gQWxzbywgc2V0IGluaXRpYWwgem9vbSB0byBzaG93IHRoZSBmZWF0dXJlc1xuICAgICAgICAgICAgdmFyIHByb2plY3Rpb25cdD0gZDMuZ2VvLm1lcmNhdG9yKClcbiAgICAgICAgICAgICAgICAuc2NhbGUoMSk7XG5cbiAgICAgICAgICAgIC8vIFByZXBhcmUgYSBwYXRoIG9iamVjdCBhbmQgYXBwbHkgdGhlIHByb2plY3Rpb24gdG8gaXRcbiAgICAgICAgICAgIHZhciBwYXRoID0gZDMuZ2VvLnBhdGgoKVxuICAgICAgICAgICAgICAgIC5wcm9qZWN0aW9uKHByb2plY3Rpb24pO1xuXG4gICAgICAgICAgICAvLyBXZSBwcmVwYXJlIGFuIG9iamVjdCB0byBsYXRlciBoYXZlIGVhc2llciBhY2Nlc3MgdG8gdGhlIGRhdGEuXG4gICAgICAgICAgICB2YXIgZGF0YUJ5SWQgPSBkMy5tYXAoKTtcblxuICAgICAgICAgICAgLy9EZWZpbmUgcXVhbnRpemUgc2NhbGUgdG8gc29ydCBkYXRhIHZhbHVlcyBpbnRvIGJ1Y2tldHMgb2YgY29sb3JcbiAgICAgICAgICAgIC8vQ29sb3JzIGJ5IEN5bnRoaWEgQnJld2VyIChjb2xvcmJyZXdlcjIub3JnKSwgOS1jbGFzcyBZbEduQnVcblxuICAgICAgICAgICAgdmFyIGNvbG9yID0gZDMuc2NhbGUucXVhbnRpemUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy5yYW5nZShkMy5yYW5nZSg5KSxtYXAoZnVuY3Rpb24oaSkgeyByZXR1cm4gJ3EnICsgaSArICctOSc7fSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJhbmdlKFsgICAgXCIjMDA4MDAwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIjRkZGRjAwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIjRkZBNTAwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIjRkYwMDAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgQ292ZXJhZ2VTZXJ2aWNlLmdldFJlZFZhY2NpbmVEb3NlcyhwZXJpb2QsIHZhY2NpbmUpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9TZXQgaW5wdXQgZG9tYWluIGZvciBjb2xvciBzY2FsZVxuICAgICAgICAgICAgICAgICAgICBjb2xvci5kb21haW4oW1xuICAgICAgICAgICAgICAgICAgICAgICAgZDMubWluKGRhdGEsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuICtkW2ZpZWxkXTsgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBkMy5tYXgoZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gK2RbZmllbGRdOyB9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIG1hcHMgdGhlIGRhdGEgb2YgdGhlIENTViBzbyBpdCBjYW4gYmUgZWFzaWx5IGFjY2Vzc2VkIGJ5XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBJRCBvZiB0aGUgZGlzdHJpY3QsIGZvciBleGFtcGxlOiBkYXRhQnlJZFsyMTk2XVxuICAgICAgICAgICAgICAgICAgICBkYXRhQnlJZCA9IGQzLm5lc3QoKVxuICAgICAgICAgICAgICAgICAgICAgIC5rZXkoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDsgfSlcbiAgICAgICAgICAgICAgICAgICAgICAucm9sbHVwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRbMF07IH0pXG4gICAgICAgICAgICAgICAgICAgICAgLm1hcChkYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgbGVnZW5kID0gZDMuc2VsZWN0KCcjbGVnZW5kJylcblxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xpc3QtaW5saW5lJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleXMgPSBsZWdlbmQuc2VsZWN0QWxsKCdsaS5rZXknKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRhdGEoY29sb3IucmFuZ2UoKSk7XG5cbiAgICAgICAgICAgICAgICAgICAga2V5cy5lbnRlcigpLmFwcGVuZCgnbGknKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2tleScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoJ2JvcmRlci10b3AtY29sb3InLCBTdHJpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGV4dChmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZD09XCIjMDA4MDAwXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnQ0FUMSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZD09XCIjRkZGRjAwXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ0NBVDInXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGQ9PVwiI0ZGQTUwMFwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdDQVQzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZD09XCIjRkYwMDAwXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ0NBVDQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gTG9hZCBmZWF0dXJlcyBmcm9tIEdlb0pTT05cbiAgICAgICAgICAgICAgICAgICAgZDMuanNvbignc3RhdGljL2FwcC9jb21wb25lbnRzL2NvdmVyYWdlL2RhdGEvdWdfZGlzdHJpY3RzMi5nZW9qc29uJywgZnVuY3Rpb24oZXJyb3IsIGpzb24pIHtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIHNjYWxlIGFuZCBjZW50ZXIgcGFyYW1ldGVycyBmcm9tIHRoZSBmZWF0dXJlcy5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzY2FsZUNlbnRlciA9IGNhbGN1bGF0ZVNjYWxlQ2VudGVyKGpzb24pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBcHBseSBzY2FsZSwgY2VudGVyIGFuZCB0cmFuc2xhdGUgcGFyYW1ldGVycy5cbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb24uc2NhbGUoc2NhbGVDZW50ZXIuc2NhbGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jZW50ZXIoc2NhbGVDZW50ZXIuY2VudGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJhbnNsYXRlKFt3aWR0aC8yLCBoZWlnaHQvMl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNZXJnZSB0aGUgY292ZXJhZ2UgZGF0YSBhbWQgR2VvSlNPTiBpbnRvIGEgc2luZ2xlIGFycmF5XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBbHNvIGxvb3AgdGhyb3VnaCBvbmNlIGZvciBlYWNoIGNvdmVyYWdlIHNjb3JlIGRhdGEgdmFsdWVcblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgZGF0YS5sZW5ndGggOyBpKysgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHcmFiIGRpc3RyaWN0IG5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGlzdCA9IGRhdGFbaV0uZGlzdHJpY3RfX25hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBvcyA9IGRpc3QuaW5kZXhPZihcIiBcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFEaXN0cmljdCA9IGRpc3Quc3Vic3RyaW5nKDAsIHBvcykudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3ZhciBkYXRhRGlzdHJpY3QgPSBkYXRhW2ldLmRpc3RyaWN0O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9HcmFiIGRhdGEgdmFsdWUsIGFuZCBjb252ZXJ0IGZyb20gc3RyaW5nIHRvIGZsb2F0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFWYWx1ZSA9ICtkYXRhW2ldW2ZpZWxkXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vRmluZCB0aGUgY29ycmVzcG9uZGluZyBkaXN0cmljdCBpbnNpZGUgR2VvSlNPTlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGo9MDsgaiA8IGpzb24uZmVhdHVyZXMubGVuZ3RoIDsgaisrICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIHRoZSBkaXN0cmljdCByZWZlcmVuY2UgaW4ganNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIganNvbkRpc3RyaWN0ID0ganNvbi5mZWF0dXJlc1tqXS5wcm9wZXJ0aWVzLmRpc3Q7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFEaXN0cmljdCA9PSBqc29uRGlzdHJpY3QpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9Db3B5IHRoZSBkYXRhIHZhbHVlIGludG8gdGhlIEdlb0pTT05cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uZmVhdHVyZXNbal0ucHJvcGVydGllcy5maWVsZCA9IGRhdGFWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9TdG9wIGxvb2tpbmcgdGhyb3VnaCBKU09OXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBTVkcgaW5zaWRlIG1hcCBjb250YWluZXIgYW5kIGFzc2lnbiBkaW1lbnNpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3N2Zy5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KFwiI3JlZFwiKS5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN2ZyA9IGQzLnNlbGVjdChcIiNyZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWRkIGEgPGc+IGVsZW1lbnQgdG8gdGhlIFNWRyBlbGVtZW50IGFuZCBnaXZlIGEgY2xhc3MgdG8gc3R5bGUgbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdmZWF0dXJlcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBCaW5kIGRhdGEgYW5kIGNyZWF0ZSBvbmUgcGF0aCBwZXIgR2VvSlNPTiBmZWF0dXJlXG4gICAgICAgICAgICAgICAgICAgICAgICBzdmcuc2VsZWN0QWxsKFwicGF0aFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kYXRhKGpzb24uZmVhdHVyZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmVudGVyKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBwYXRoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBob3Zlcm9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGhvdmVyb3V0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgXCIjNzc3XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGRhdGEgdmFsdWVcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBkLnByb3BlcnRpZXMuZmllbGQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB2YWx1ZSBleGlzdHMgLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29sb3IodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdmFsdWUgaXMgdW5kZWZpbmVzIC4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiI2NjY1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cblxuXG4gICAgICAgICAgICAgICAgICAgIH0pOyAvLyBFbmQgZDMuanNvblxuXG4gICAgICAgICAgICAgICAgICAgIC8vIExvZ2ljIHRvIGhhbmRsZSBob3ZlciBldmVudCB3aGVuIGl0cyBmaXJlZHVwXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaG92ZXJvbiA9IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rvb2x0aXAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUubGVmdCA9IGV2ZW50LnBhZ2VYICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUudG9wID0gZXZlbnQucGFnZVkgKyAncHgnO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0ZpbGwgeWVsbG93IHRvIGhpZ2hsaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwid2hpdGVcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1Nob3cgdGhlIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QoXCIjdG9vbHRpcFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9Qb3B1bGF0ZSBuYW1lIGluIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QoXCIjdG9vbHRpcCAubmFtZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGV4dChkLnByb3BlcnRpZXMuZGlzdCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1BvcHVsYXRlIHZhbHVlIGluIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWQucHJvcGVydGllcy5maWVsZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiN0b29sdGlwIC52YWx1ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGV4dChcIk5vIERhdGFcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiN0b29sdGlwIC52YWx1ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRleHQoJ0NBVCcgKyAodmFsdWVGb3JtYXQoZC5wcm9wZXJ0aWVzLmZpZWxkKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBob3Zlcm91dCA9IGZ1bmN0aW9uKGQpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vUmVzdG9yZSBvcmlnaW5hbCBjaG9yb3BsZXRoIGZpbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBkLnByb3BlcnRpZXMuZmllbGQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29sb3IodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCIjY2NjXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9IaWRlIHRoZSB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KFwiI3Rvb2x0aXBcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YUFsbGRvc2VzID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc0Rvc2VzID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFBbGxkb3NlcyxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBjYWxjdWxhdGVTY2FsZUNlbnRlcihmZWF0dXJlcykge1xuICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBwYXRocyAoaW4gcGl4ZWxzKSBhbmQgY2FsY3VsYXRlIGEgc2NhbGUgZmFjdG9yIGJhc2VkIG9uIGJveCBhbmQgbWFwIHNpemVcbiAgICAgICAgICAgICAgICB2YXIgYmJveF9wYXRoID0gcGF0aC5ib3VuZHMoZmVhdHVyZXMpLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZSA9IDAuOTUgLyBNYXRoLm1heChcbiAgICAgICAgICAgICAgICAgICAgICAgIChiYm94X3BhdGhbMV1bMF0gLSBiYm94X3BhdGhbMF1bMF0pIC8gd2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAoYmJveF9wYXRoWzFdWzFdIC0gYmJveF9wYXRoWzBdWzFdKSAvIGhlaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBmZWF0dXJlcyAoaW4gbWFwIHVuaXRzKSBhbmQgdXNlIGl0IHRvIGNhbGN1bGF0ZSB0aGUgY2VudGVyIG9mIHRoZSBmZWF0dXJlcy5cbiAgICAgICAgICAgICAgICB2YXIgYmJveF9mZWF0dXJlID0gZDMuZ2VvLmJvdW5kcyhmZWF0dXJlcyksXG4gICAgICAgICAgICAgICAgICAgIGNlbnRlciA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIChiYm94X2ZlYXR1cmVbMV1bMF0gKyBiYm94X2ZlYXR1cmVbMF1bMF0pIC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgIChiYm94X2ZlYXR1cmVbMV1bMV0gKyBiYm94X2ZlYXR1cmVbMF1bMV0pIC8gMl07XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAnc2NhbGUnOnNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAnY2VudGVyJzpjZW50ZXJcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgLy8gTkVXOiBEZWZpbmluZyBnZXRJZE9mRmVhdHVyZVxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0SWRPZkZlYXR1cmUoZikge1xuICAgICAgICAgICAgICByZXR1cm4gZi5wcm9wZXJ0aWVzLmlkdWc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cblxuICAgICAgICB2bS5nZXRWYWNjaW5lRG9zZXNCeURpc3RyaWN0ID0gZnVuY3Rpb24ocGVyaW9kLCBkaXN0cmljdCwgdmFjY2luZSkge1xuXG5cbiAgICAgICAgICAgIENvdmVyYWdlU2VydmljZS5nZXRWYWNjaW5lRG9zZXNCeURpc3RyaWN0KHBlcmlvZCwgZGlzdHJpY3QsIHZhY2NpbmUpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5kcm9wZWRvdXQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZih2bS5kYXRhLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5kcm9wZWRvdXQgPSB2bS5kYXRhWzBdLmRyb3Bfb3V0X3JhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnVuZGVyaW1tdW5pemVkID0gdm0uZGF0YVswXS51bmRlcl9pbW11bml6ZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBBY2Nlc3MgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHZtLmRhdGFbMF0uYWNjZXNzID49IDkwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmFjY2VzcyA9IFwiR29vZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuYWNjZXNzID0gXCJQb29yXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFV0aWxpemF0aW9uICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzaGVsbFNjb3BlLmNoaWxkLmRyb3BlZG91dCA8PSAxMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC51dGlsaXphdGlvbiA9IFwiR29vZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudXRpbGl6YXRpb24gPSBcIlBvb3JcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLyogUmVkIENhdGVnb3JpemF0aW9uKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCh2bS5kYXRhWzBdLmFjY2VzcyA+PSA5MCkgJiYgKHZtLmRhdGFbMF0uZHJvcF9vdXRfcmF0ZSA8PTEwKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5yZWRjYXRlZ29yeSA9IFwiQ0FUMVwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKHZtLmRhdGFbMF0uYWNjZXNzID49IDkwICYmIHZtLmRhdGFbMF0uZHJvcF9vdXRfcmF0ZSA+IDEwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLnJlZGNhdGVnb3J5ID0gXCJDQVQyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYodm0uZGF0YVswXS5hY2Nlc3MgPCA5MCAmJiB2bS5kYXRhWzBdLmRyb3Bfb3V0X3JhdGUgPD0gMTApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUucmVkY2F0ZWdvcnkgPSBcIkNBVDNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZih2bS5kYXRhWzBdLmFjY2VzcyA8IDkwICYmIHZtLmRhdGFbMF0uZHJvcF9vdXRfcmF0ZSA+IDEwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLnJlZGNhdGVnb3J5ID0gXCJDQVQ0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uZ2V0QWN0aXZlRG9zZU51bWJlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHZtLmFjdGl2ZURvc2UgIT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJldHVybiBOdW1iZXIodm0uYWN0aXZlRG9zZS5zdWJzdHIodm0uYWN0aXZlRG9zZS5sZW5ndGgtMSwgMSkpO1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uY29tcHV0ZVJhdGUgPSBmdW5jdGlvbihkb3NlcywgcGxhbm5lZCkge1xuICAgICAgICAgICAgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL2NvdmVyYWdlXCIpe1xuICAgICAgICAgICAgICAgIHZhciBhY3RpdmVEb3NlTnVtYmVyID0gdm0uZ2V0QWN0aXZlRG9zZU51bWJlcigpO1xuICAgICAgICAgICAgICAgIHZhciBkb3NlVmFsdWUgPSBkb3Nlcy5sYXN0O1xuXG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZURvc2VOdW1iZXIgPT0gMSkgZG9zZVZhbHVlID0gZG9zZXMuZmlyc3Q7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYWN0aXZlRG9zZU51bWJlciA9PSAyKSBkb3NlVmFsdWUgPSBkb3Nlcy5zZWNvbmQ7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYWN0aXZlRG9zZU51bWJlciA9PSAzKSBkb3NlVmFsdWUgPSBkb3Nlcy50aGlyZDtcblxuICAgICAgICAgICAgICAgIHJldHVybiAoZG9zZVZhbHVlIC8gcGxhbm5lZCkgKiAxMDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL2Ryb3BvdXRyYXRlXCIpe1xuICAgICAgICAgICAgICAgIHJldHVybiAoKGRvc2VzLmZpcnN0IC0gZG9zZXMubGFzdCkgLyBkb3Nlcy5maXJzdCkgKiAxMDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL3JlZGNhdGVnb3J5XCIpe1xuICAgICAgICAgICAgICAgIHZhciBhY2Nlc3MgPSAoZG9zZXMuZmlyc3QvcGxhbm5lZCkgKiAxMDA7XG4gICAgICAgICAgICAgICAgdmFyIGRyb3BvdXRSYXRlID0gKChkb3Nlcy5maXJzdCAtIGRvc2VzLmxhc3QpIC8gZG9zZXMuZmlyc3QpICogMTAwO1xuXG4gICAgICAgICAgICAgICAgaWYgKGFjY2VzcyA+PSA5MCAmJiBkcm9wb3V0UmF0ZSA+PSAwICYmIGRyb3BvdXRSYXRlIDw9IDEwKSByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChhY2Nlc3MgPj0gOTAgJiYgKGRyb3BvdXRSYXRlIDwgMCB8fCBkcm9wb3V0UmF0ZSA+IDEwKSkgcmV0dXJuIDI7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYWNjZXNzIDwgOTAgJiYgZHJvcG91dFJhdGUgPj0gMCAmJiBkcm9wb3V0UmF0ZSA8PSAxMCkgcmV0dXJuIDM7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYWNjZXNzIDwgOTAgJiYgKGRyb3BvdXRSYXRlIDwgMCB8fCBkcm9wb3V0UmF0ZSA+IDEwKSkgcmV0dXJuIDQ7XG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB2bS5nZXRDaGFydERhdGEgPSBmdW5jdGlvbihwYXJhbXMsIGRhdGEsIHJlcG9ydFllYXIsIGN1bXVsYXRpdmUpIHtcblxuICAgICAgICAgICAgdmFyIHBlcmlvZFZhbHVlcyA9IHt9O1xuICAgICAgICAgICAgdmFyIHJlZENhdGVnb3J5VmFsdWVzID0ge307XG4gICAgICAgICAgICB2YXIgdG90YWxzID0ge307XG4gICAgICAgICAgICB2YXIgcmVkQ2F0ZWdvcnlUb3RhbHMgPSB7fTtcbiAgICAgICAgICAgIHZhciByYXRlO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGVyaW9kID0gZGF0YVtpXS5wZXJpb2Q7XG4gICAgICAgICAgICAgICAgdmFyIGxhc3RfZG9zZSA9IGRhdGFbaV0udG90YWxfbGFzdF9kb3NlO1xuICAgICAgICAgICAgICAgIHZhciBmaXJzdF9kb3NlID0gZGF0YVtpXS50b3RhbF9maXJzdF9kb3NlO1xuICAgICAgICAgICAgICAgIHZhciBzZWNvbmRfZG9zZSA9IGRhdGFbaV0udG90YWxfc2Vjb25kX2Rvc2U7XG4gICAgICAgICAgICAgICAgdmFyIHRoaXJkX2Rvc2UgPSBkYXRhW2ldLnRvdGFsX3RoaXJkX2Rvc2U7XG4gICAgICAgICAgICAgICAgdmFyIHBsYW5uZWQgPSBkYXRhW2ldLnRvdGFsX3BsYW5uZWQ7XG4gICAgICAgICAgICAgICAgdmFyIHZhY2NpbmUgPSBkYXRhW2ldLnZhY2NpbmVfX25hbWU7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RyaWN0ID0gZGF0YVtpXS5kaXN0cmljdF9fbmFtZTtcblxuICAgICAgICAgICAgICAgIHZhciBkYXRhTW9udGggPSBhcHBIZWxwZXJzLmdldE1vbnRoRnJvbVBlcmlvZChwZXJpb2QsIHJlcG9ydFllYXIpO1xuICAgICAgICAgICAgICAgIHZhciBkYXRhWWVhciA9IGFwcEhlbHBlcnMuZ2V0WWVhckZyb21QZXJpb2QocGVyaW9kLCByZXBvcnRZZWFyKTtcblxuICAgICAgICAgICAgICAgIHZhciB5ZWFyTGFiZWwgPSBhcHBIZWxwZXJzLmdldFllYXJMYWJlbEZyb21QZXJpb2QocGVyaW9kLCByZXBvcnRZZWFyKTtcbiAgICAgICAgICAgICAgICB2YXIgbW9udGhJbmRleCA9IGFwcEhlbHBlcnMuZ2V0TW9udGhJbmRleEZyb21QZXJpb2QocGVyaW9kLCByZXBvcnRZZWFyKTtcblxuICAgICAgICAgICAgICAgIC8qIFRoZSB2aWV3IHJldHVybnMgZXh0cmEgZGF0YSB0byBjYXRlciBmb3IgdGhlIGZpbmFuY2lhbCB5ZWFyXG4gICAgICAgICAgICAgICAgU2luY2UgaXRzIGlnbm9yYW50IG9mIHRoZSBwZXJpb2RzLCB3ZSBkbyB0aGUgZmlsdGVycyBvdXJzZWx2ZXNcbiAgICAgICAgICAgICAgICBEaWRuJ3Qgd2FudCB0byBjcmVhdGUgYSBuZXcgQVBJIGNhbGwgZm9yIGEgY2hhbmdlIGluIHJlcG9ydCB5ZWFyXG4gICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpZiAoKHJlcG9ydFllYXIgPT0gXCJDWVwiKSAmJiAoZGF0YVllYXIgPiBwYXJhbXMuZW5kWWVhcikpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIC8vIGlmICgocmVwb3J0WWVhciA9PSBcIkZZXCIpICYmIChkYXRhWWVhciA9PSBwYXJhbXMuZW5kWWVhcikgJiYgKGRhdGFNb250aCA+IDYpKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBpZiAoKHJlcG9ydFllYXIgPT0gXCJGWVwiKSAmJiAoZGF0YVllYXIgPT0gcGFyYW1zLnN0YXJ0WWVhcikgJiYgKGRhdGFNb250aCA8PSA2KSkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICBpZiAoISAoeWVhckxhYmVsIGluIHBlcmlvZFZhbHVlcykpIHtcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kVmFsdWVzW3llYXJMYWJlbF0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgcmVkQ2F0ZWdvcnlWYWx1ZXNbeWVhckxhYmVsXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICB0b3RhbHNbeWVhckxhYmVsXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICByZWRDYXRlZ29yeVRvdGFsc1t5ZWFyTGFiZWxdID0ge307XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCEgKHZhY2NpbmUgaW4gcGVyaW9kVmFsdWVzW3llYXJMYWJlbF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZFZhbHVlc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdID0gW107XG4gICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgdG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0gPSB7Zmlyc3RfZG9zZTogMCwgc2Vjb25kX2Rvc2U6MCwgdGhpcmRfZG9zZTowLCBsYXN0X2Rvc2U6IDAsIHBsYW5uZWQ6IDB9O1xuICAgICAgICAgICAgICAgICAgICByZWRDYXRlZ29yeVRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdID0ge307XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGRpc3RyaWN0ICE9IHVuZGVmaW5lZCAmJiAhKGRpc3RyaWN0IGluIHJlZENhdGVnb3J5VG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV1bZGlzdHJpY3RdID0ge2ZpcnN0X2Rvc2U6IDAsIGxhc3RfZG9zZTogMCwgcGxhbm5lZDogMH07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGN1bXVsYXRpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZtLnBhdGggPT0gJy9jb3ZlcmFnZS9yZWRjYXRlZ29yeScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb21iaW5lZEZpcnN0RG9zZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVkQ2F0ZWdvcnlUb3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXVtkaXN0cmljdF0uZmlyc3RfZG9zZSArIGZpcnN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29tYmluZWRMYXN0RG9zZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVkQ2F0ZWdvcnlUb3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXVtkaXN0cmljdF0ubGFzdF9kb3NlICsgbGFzdF9kb3NlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbWJpbmVkUGxhbm5lZCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVkQ2F0ZWdvcnlUb3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXVtkaXN0cmljdF0ucGxhbm5lZCArIHBsYW5uZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV1bZGlzdHJpY3RdLmZpcnN0X2Rvc2UgPSBjb21iaW5lZEZpcnN0RG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV1bZGlzdHJpY3RdLmxhc3RfZG9zZSA9IGNvbWJpbmVkTGFzdERvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWRDYXRlZ29yeVRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdW2Rpc3RyaWN0XS5wbGFubmVkID0gY29tYmluZWRQbGFubmVkO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbWJpbmVkRmlyc3REb3NlID0gdG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0uZmlyc3RfZG9zZSArIGZpcnN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29tYmluZWRMYXN0RG9zZSA9IHRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLmxhc3RfZG9zZSArIGxhc3RfZG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb21iaW5lZFNlY29uZERvc2UgPSB0b3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXS5zZWNvbmRfZG9zZSArIHNlY29uZF9kb3NlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbWJpbmVkVGhpcmREb3NlID0gdG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0udGhpcmRfZG9zZSArIHRoaXJkX2Rvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29tYmluZWRQbGFubmVkID0gdG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0ucGxhbm5lZCArIHBsYW5uZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLmZpcnN0X2Rvc2UgPSBjb21iaW5lZEZpcnN0RG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLmxhc3RfZG9zZSA9IGNvbWJpbmVkTGFzdERvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXS5zZWNvbmRfZG9zZSA9IGNvbWJpbmVkU2Vjb25kRG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLnRoaXJkX2Rvc2UgPSBjb21iaW5lZFRoaXJkRG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLnBsYW5uZWQgPSBjb21iaW5lZFBsYW5uZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByYXRlID0gdm0uY29tcHV0ZVJhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3Q6IGNvbWJpbmVkRmlyc3REb3NlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kOiBjb21iaW5lZFNlY29uZERvc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlyZDogY29tYmluZWRUaGlyZERvc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0OiBjb21iaW5lZExhc3REb3NlXG4gICAgICAgICAgICAgICAgICAgIH0sIGNvbWJpbmVkUGxhbm5lZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmF0ZSA9IHZtLmNvbXB1dGVSYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0OmZpcnN0X2Rvc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWNvbmQ6c2Vjb25kX2Rvc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlyZDogdGhpcmRfZG9zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3Q6IGxhc3RfZG9zZX1cbiAgICAgICAgICAgICAgICAgICAgLCBwbGFubmVkKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodm0ucGF0aCA9PSAnL2NvdmVyYWdlL3JlZGNhdGVnb3J5Jykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2F0ZWdvcnkgPSByYXRlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoISAobW9udGhJbmRleCBpbiByZWRDYXRlZ29yeVZhbHVlc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV1bbW9udGhJbmRleF0gPSB7fTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoISAoY2F0ZWdvcnkgaW4gcmVkQ2F0ZWdvcnlWYWx1ZXNbeWVhckxhYmVsXVt2YWNjaW5lXVttb250aEluZGV4XSkpXG4gICAgICAgICAgICAgICAgICAgICAgICByZWRDYXRlZ29yeVZhbHVlc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdW21vbnRoSW5kZXhdW2NhdGVnb3J5XSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV1bbW9udGhJbmRleF1bY2F0ZWdvcnldLnB1c2goZGlzdHJpY3QpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZFZhbHVlc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLnB1c2goe3g6IG1vbnRoSW5kZXgsIHk6IGQzLmZvcm1hdCgnLjAxZicpKHJhdGUpfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY2hhcnREYXRhID0gW107XG5cbiAgICAgICAgICAgIGlmICh2bS5wYXRoID09ICcvY292ZXJhZ2UvcmVkY2F0ZWdvcnknKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdldFJlZENhdGVnb3J5VmFsdWVzID0gZnVuY3Rpb24obW9udGhJbmRleCwgY2F0RGlzdHJpY3RzLCB0b3RhbERpc3RyaWN0cykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IE51bWJlcihtb250aEluZGV4KSwgeTogZDMuZm9ybWF0KCcuMDFmJykoKGNhdERpc3RyaWN0cyAvIHRvdGFsRGlzdHJpY3RzKSAqIDEwMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB4OiBOdW1iZXIobW9udGhJbmRleCksIHk6IGQzLmZvcm1hdCgnLjAxZicpKGNhdERpc3RyaWN0cylcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdmFyIGdldFRvdGFsUmVkQ2F0ZWdvcnlEaXN0cmljdHMgPSBmdW5jdGlvbihjYXQsIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhdCBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YVtjYXRdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdmFyIGNhdGVnb3J5VmFsdWVzID0ge1xuICAgICAgICAgICAgICAgICAgICAxOiBbXSwgMjogW10sIDM6IFtdLCA0OiBbXVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciB5ZWFyTGFiZWwgaW4gcmVkQ2F0ZWdvcnlWYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgdmFjY2luZSBpbiByZWRDYXRlZ29yeVZhbHVlc1t5ZWFyTGFiZWxdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBtb250aEluZGV4IGluIHJlZENhdGVnb3J5VmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV0pIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWNjaW5lRGF0YSA9IHJlZENhdGVnb3J5VmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV1bbW9udGhJbmRleF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh5ZWFyTGFiZWwgKyBcIi1cIiArIG1vbnRoSW5kZXggKyBcIi1cIiArIHZhY2NpbmUgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh2YWNjaW5lRGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2F0MURpc3RyaWN0cyA9IGdldFRvdGFsUmVkQ2F0ZWdvcnlEaXN0cmljdHMoMSwgdmFjY2luZURhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjYXQyRGlzdHJpY3RzID0gZ2V0VG90YWxSZWRDYXRlZ29yeURpc3RyaWN0cygyLCB2YWNjaW5lRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNhdDNEaXN0cmljdHMgPSBnZXRUb3RhbFJlZENhdGVnb3J5RGlzdHJpY3RzKDMsIHZhY2NpbmVEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2F0NERpc3RyaWN0cyA9IGdldFRvdGFsUmVkQ2F0ZWdvcnlEaXN0cmljdHMoNCwgdmFjY2luZURhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRvdGFsRGlzdHJpY3RzID0gY2F0MURpc3RyaWN0cyArIGNhdDJEaXN0cmljdHMgKyBjYXQzRGlzdHJpY3RzICsgY2F0NERpc3RyaWN0cztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5VmFsdWVzWzFdLnB1c2goZ2V0UmVkQ2F0ZWdvcnlWYWx1ZXMobW9udGhJbmRleCwgY2F0MURpc3RyaWN0cywgdG90YWxEaXN0cmljdHMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeVZhbHVlc1syXS5wdXNoKGdldFJlZENhdGVnb3J5VmFsdWVzKG1vbnRoSW5kZXgsIGNhdDJEaXN0cmljdHMsIHRvdGFsRGlzdHJpY3RzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlWYWx1ZXNbM10ucHVzaChnZXRSZWRDYXRlZ29yeVZhbHVlcyhtb250aEluZGV4LCBjYXQzRGlzdHJpY3RzLCB0b3RhbERpc3RyaWN0cykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5VmFsdWVzWzRdLnB1c2goZ2V0UmVkQ2F0ZWdvcnlWYWx1ZXMobW9udGhJbmRleCwgY2F0NERpc3RyaWN0cywgdG90YWxEaXN0cmljdHMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNoYXJ0RGF0YS5wdXNoKHtrZXk6ICdDQVQxJywgY29sb3I6ICdEYXJrR3JlZW4nLCB2YWx1ZXM6IHZtLmZpbGxNaXNzaW5nVmFsdWVzKGNhdGVnb3J5VmFsdWVzWzFdKX0pO1xuICAgICAgICAgICAgICAgIGNoYXJ0RGF0YS5wdXNoKHtrZXk6ICdDQVQyJywgY29sb3I6ICdZZWxsb3cnLCB2YWx1ZXM6IHZtLmZpbGxNaXNzaW5nVmFsdWVzKGNhdGVnb3J5VmFsdWVzWzJdKX0pO1xuICAgICAgICAgICAgICAgIGNoYXJ0RGF0YS5wdXNoKHtrZXk6ICdDQVQzJywgY29sb3I6ICdPcmFuZ2UnLCB2YWx1ZXM6IHZtLmZpbGxNaXNzaW5nVmFsdWVzKGNhdGVnb3J5VmFsdWVzWzNdKX0pO1xuICAgICAgICAgICAgICAgIGNoYXJ0RGF0YS5wdXNoKHtrZXk6ICdDQVQ0JywgY29sb3I6ICdSZWQnLCB2YWx1ZXM6IHZtLmZpbGxNaXNzaW5nVmFsdWVzKGNhdGVnb3J5VmFsdWVzWzRdKX0pO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHllYXJMYWJlbCBpbiBwZXJpb2RWYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgdmFjY2luZSBpbiBwZXJpb2RWYWx1ZXNbeWVhckxhYmVsXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IHZhY2NpbmU7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBSZW1vdmUgYW50aWdlbnMgdGhhdCBsYWNrIHZhbHVlIGZvciBwYXJ0aWN1bGFyIGRvc2Ugb24gQ292ZXJhZ2UgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2bS5wYXRoID09ICcvY292ZXJhZ2UvY292ZXJhZ2UnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZtLmFjdGl2ZURvc2UgPT0gXCJEb3NlIDNcIiAmJiAkLmluQXJyYXkodmFjY2luZSwgWydQRU5UQScsICdQQ1YnLCAnT1BWJ10pID09IC0xKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh2bS5hY3RpdmVEb3NlID09IFwiRG9zZSAyXCIgJiYgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5pbkFycmF5KHZhY2NpbmUsIFsnUEVOVEEnLCAnUENWJywgJ09QVicsICdIUFYnLCAnSVBWJywgJ1RUJ10pID09IC0xKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlcyA9IHZtLmZpbGxNaXNzaW5nVmFsdWVzKHBlcmlvZFZhbHVlc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0RGF0YS5wdXNoKHtrZXk6IGtleSwgdmFsdWVzOiB2YWx1ZXN9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNoYXJ0RGF0YTtcbiAgICAgICAgfTtcblxuICAgICAgICB2bS5maWxsTWlzc2luZ1ZhbHVlcyA9IGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgICAgICAgdmFyIG1vbnRoSW5kZXhlcyA9IF8ucmFuZ2UoMSwgMTMpO1xuICAgICAgICAgICAgdmFyIGV4aXN0aW5nSW5kZXhlcyA9IHZhbHVlcy5tYXAoZnVuY3Rpb24oaXRlbSkgeyByZXR1cm4gaXRlbS54OyB9KTtcbiAgICAgICAgICAgIHZhciBuZXdJbmRleGVzID0gbW9udGhJbmRleGVzLmZpbHRlcihmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4aXN0aW5nSW5kZXhlcy5pbmRleE9mKHYpIDwgMDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbmV3SW5kZXhlcy5mb3JFYWNoKGZ1bmN0aW9uKG1vbnRoSW5kZXgpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaCh7eDogbW9udGhJbmRleCwgeTogMH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWVzLnNvcnQoZnVuY3Rpb24oYSwgYikge3JldHVybiBhLnggLSBiLnh9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2bS5nZXRDaGFydE9wdGlvbnMgPSBmdW5jdGlvbihyZXBvcnRZZWFyKSB7XG4gICAgICAgICAgICB2YXIgd2lkdGggPSAodm0uYWN0aXZlRGlzdHJpY3QgPT0gJ05hdGlvbmFsJykgPyA0NTAgOiA5MDA7XG4gICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbGluZUNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA0NTAsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgdXNlSW50ZXJhY3RpdmVHdWlkZWxpbmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGludGVyYWN0aXZlTGF5ZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXZpdHk6ICdzJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbihkKXsgcmV0dXJuIGQueDsgfSxcbiAgICAgICAgICAgICAgICAgICAgeTogZnVuY3Rpb24oZCl7IHJldHVybiBkLnk7IH0sXG4gICAgICAgICAgICAgICAgICAgIGZvcmNlWTogWy0xMCwxNTBdLFxuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVDaGFuZ2U6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInN0YXRlQ2hhbmdlXCIpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlU3RhdGU6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcImNoYW5nZVN0YXRlXCIpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcFNob3c6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInRvb2x0aXBTaG93XCIpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcEhpZGU6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInRvb2x0aXBIaWRlXCIpOyB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHhBeGlzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWw6ICdNb250aHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGlja0Zvcm1hdDogZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwcEhlbHBlcnMuZ2V0TW9udGhGcm9tTnVtYmVyKGQsIHJlcG9ydFllYXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB5QXhpczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiAnUGVyY2VudGFnZSAoJSknXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihjaGFydCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiISEhIGxpbmVDaGFydCBjYWxsYmFjayAhISFcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmdldENoYXJ0VGl0bGUgPSBmdW5jdGlvbih2YWNjaW5lKSB7XG4gICAgICAgICAgICB2YXIgZHVyYXRpb24gPSB2bS5hY3RpdmVSZXBvcnRUb2dnbGVbMF0gPT0gJ0EnID8gXCJBbm51YWxpemVkXCIgOiBcIk1vbnRobHlcIjtcbiAgICAgICAgICAgIHZhciB2YWNjaW5lTmFtZSA9ICh2YWNjaW5lID09IFwiQUxMXCIpID8gXCJhbnRpZ2Vuc1wiIDogdmFjY2luZTtcbiAgICAgICAgICAgIHZhciBkb3NlTnVtYmVyID0gdm0uYWN0aXZlRG9zZS5yZXBsYWNlKFwiRG9zZSBcIiwgXCJcIik7XG4gICAgICAgICAgICBpZiAodmFjY2luZSA9PSBcIkFMTFwiKSBkb3NlTnVtYmVyID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBhbnRpZ2VuTGFiZWwgPSB2bS5hY3RpdmVEb3NlICE9IHVuZGVmaW5lZCA/IFxuICAgICAgICAgICAgICAgIGAke3ZhY2NpbmVOYW1lfSR7ZG9zZU51bWJlcn1gIDogdmFjY2luZU5hbWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciB5ZWFyVHlwZSA9IHZtLmFjdGl2ZVJlcG9ydFllYXIgPT0gJ0NZJyA/ICdDYWxlbmRhciBZZWFyJyA6ICdGaW5hbmNpYWwgeWVhcic7XG5cbiAgICAgICAgICAgIHZhciB0YWIgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAodm0ucGF0aD09XCIvY292ZXJhZ2UvZHJvcG91dHJhdGVcIilcbiAgICAgICAgICAgICAgICB0YWIgPSBcIkRyb3BvdXQgUmF0ZVwiO1xuICAgICAgICAgICAgZWxzZSBpZiAodm0ucGF0aD09XCIvY292ZXJhZ2UvcmVkY2F0ZWdvcnlcIilcbiAgICAgICAgICAgICAgICB0YWIgPSBcIlJlZCBDYXRlZ29yaXphdGlvblwiO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRhYiA9IFwiQ292ZXJhZ2VcIjtcblxuICAgICAgICAgICAgcmV0dXJuIFwiVHJlbmQgb2YgXCIgKyBkdXJhdGlvbiArIFwiIFwiICsgdGFiICsgXCIgb2YgXCIgK1xuICAgICAgICAgICAgICAgIGFudGlnZW5MYWJlbCArIFwiIGZvciBcIiArIHZtLmFjdGl2ZUNvdmVyYWdlWWVhciArIFwiIFwiICsgeWVhclR5cGU7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uZ2V0VmFjY2luZURvc2VzQnlQZXJpb2QgPSBmdW5jdGlvbihwYXJhbXMpIHtcblxuICAgICAgICAgICAgQ292ZXJhZ2VTZXJ2aWNlLmdldFZhY2NpbmVEb3Nlc0J5UGVyaW9kKHBhcmFtcylcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm9wdGlvbnNNQ1kgPSB2bS5nZXRDaGFydE9wdGlvbnMoXCJDWVwiKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm9wdGlvbnNBQ1kgPSB2bS5nZXRDaGFydE9wdGlvbnMoXCJDWVwiKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm9wdGlvbnNNRlkgPSB2bS5nZXRDaGFydE9wdGlvbnMoXCJGWVwiKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm9wdGlvbnNBRlkgPSB2bS5nZXRDaGFydE9wdGlvbnMoXCJGWVwiKTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YU1DWSA9IHZtLmdldENoYXJ0RGF0YShwYXJhbXMsIGRhdGEsIFwiQ1lcIiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YUFDWSA9IHZtLmdldENoYXJ0RGF0YShwYXJhbXMsIGRhdGEsIFwiQ1lcIiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhTUZZID0gdm0uZ2V0Q2hhcnREYXRhKHBhcmFtcywgZGF0YSwgXCJGWVwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhQUZZID0gdm0uZ2V0Q2hhcnREYXRhKHBhcmFtcywgZGF0YSwgXCJGWVwiLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmNoYXJ0VGl0bGUgPSB2bS5nZXRDaGFydFRpdGxlKHZtLnNlbGVjdGVkQW50aWdlbik7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2bS5lbmFibGVQREZEb3dubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5kb3dubG9hZFBERiA9IGZ1bmN0aW9uKG5hbWUpIHsgQ2hhcnRQREZFeHBvcnQuZXhwb3J0V2l0aFN0eWxlcih2bSwgbmFtZSk7IH07XG4gICAgICAgICAgICAgICAgLypzaGVsbFNjb3BlLmNoaWxkLmRvd25sb2FkUERGID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vRml4IGNoYXJ0IGJlZm9yZSBkb3dubG9hZFxuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3RBbGwoXCJzdmcgLm52LWxpbmVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCIjZmZmZmZmXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52ZDMgLm52LWJhY2tncm91bmRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCIjZmZmZmZmXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52ZDMgLm52LWF4aXMgbGluZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIFwiI2U1ZTVlNVwiKTtcblxuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3RBbGwoXCIubnZkMyB0ZXh0XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmb250XCIsIFwibm9ybWFsIDEzcHggQXJpYWwsIHNhbnMtc2VyaWZcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52ZDMgLm52LWdyb3VwcyAubnYtcG9pbnRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlLXdpZHRoXCIsIFwiMHB4XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdEFsbChcIi5udmQzIC5udi1heGlzIC56ZXJvIGxpbmVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBcIiM0MDQwNDBcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52LXkgLm52LWF4aXMgZyBwYXRoLmRvbWFpblwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIFwiIzQwNDA0MFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3RBbGwoXCIubGVnZW5kUXVhbnQgLmxhYmVsXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmb250XCIsIFwibm9ybWFsIDEycHggQXJpYWwsIHNhbnMtc2VyaWZcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHBkZiA9IG5ldyBqc1BERignbCcsICdtbScpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHsgZm9ybWF0IDogJ1BORycgfTtcblxuICAgICAgICAgICAgICAgICAgICBwZGYuYWRkSFRNTChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBkZlJlcG9ydFwiKSwgMCwgMCwgb3B0aW9ucywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcGRmLnNhdmUoJ2NvdmVyYWdlLXJlcG9ydC5wZGYnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSovXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gJHNjb3BlLiRvbigncmVmcmVzaCcsIGZ1bmN0aW9uKGUsIHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSkge1xuICAgICAgICAvLyAgICAgaWYoc3RhcnRNb250aC5uYW1lICYmIGVuZE1vbnRoLm5hbWUgJiYgZGlzdHJpY3QubmFtZSAmJiB2YWNjaW5lLm5hbWUpIHtcbiAgICAgICAgJHNjb3BlLiRvbihcbiAgICAgICAgICAgICdyZWZyZXNoQ292ZXJhZ2UyJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uKGUsIGVuZE1vbnRoLCBzdGFydFllYXIsIGVuZFllYXIsIGFjdGl2ZUNvdmVyYWdlWWVhciwgYW50aWdlbiwgZG9zZSwgZGlzdHJpY3QpIHtcbiAgICAgICAgICAgICAgICAvKiBieSBGZWxpeDsgTXVsdGlwbGUgR2VvSnNvbiByZXF1ZXN0cyB3ZXJlIGJlaW5nIHNlbnQsXG4gICAgICAgICAgICAgICAgdHJhY2VkIHRoZSBwcm9ibGVtIHRvIG11bHRpcGxlIENvdmVyYWdlQ29udHJvbGxlciBjYWxscy5cbiAgICAgICAgICAgICAgICBGb3VuZCBzb2x1dGlvbiBieSBjaGVja2luZyBjdXJyZW50U2NvcGUgYXMgc2hvd25cbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGlmICgndm0nIGluIGUuY3VycmVudFNjb3BlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vdm0uZ2V0U3RvY2tCeURpc3RyaWN0KHN0YXJ0TW9udGgubmFtZSwgZW5kTW9udGgubmFtZSwgZGlzdHJpY3QubmFtZSwgdmFjY2luZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgLy92bS5nZXRTdG9ja0J5RGlzdHJpY3RWYWNjaW5lKHN0YXJ0TW9udGgubmFtZSwgZW5kTW9udGgubmFtZSwgZGlzdHJpY3QubmFtZSwgdmFjY2luZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgLy92bS5nZXRESElTMlZhY2NpbmVEb3NlcyhlbmRNb250aC5wZXJpb2QsIGRpc3RyaWN0Lm5hbWUsIHZhY2NpbmUubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHZtLmFjdGl2ZURpc3RyaWN0ID0gZGlzdHJpY3Q7XG4gICAgICAgICAgICAgICAgICAgIHZtLmFjdGl2ZURvc2UgPSBkb3NlO1xuICAgICAgICAgICAgICAgICAgICB2bS5hY3RpdmVTdGFydFllYXIgPSBzdGFydFllYXI7XG4gICAgICAgICAgICAgICAgICAgIHZtLmFjdGl2ZUVuZFllYXIgPSBlbmRZZWFyO1xuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEFudGlnZW4gPSBhbnRpZ2VuO1xuICAgICAgICAgICAgICAgICAgICB2bS5hY3RpdmVDb3ZlcmFnZVllYXIgPSBhY3RpdmVDb3ZlcmFnZVllYXI7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGVuYWJsZURpc3RyaWN0R3JvdXBpbmcgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAodm0ucGF0aCA9PSAnL2NvdmVyYWdlL3JlZGNhdGVnb3J5JylcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZURpc3RyaWN0R3JvdXBpbmcgPSAxO1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLmVuYWJsZVBERkRvd25sb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgIHZtLmdldFZhY2NpbmVEb3Nlc0J5RGlzdHJpY3QoZW5kTW9udGgucGVyaW9kLCBkaXN0cmljdCwgYW50aWdlbik7XG4gICAgICAgICAgICAgICAgICAgIHZtLmdldFZhY2NpbmVEb3Nlc0J5UGVyaW9kKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0WWVhcjogYWN0aXZlQ292ZXJhZ2VZZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kWWVhcjogYWN0aXZlQ292ZXJhZ2VZZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgYW50aWdlbjogYW50aWdlbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvc2U6IGRvc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVEaXN0cmljdEdyb3VwaW5nOiBlbmFibGVEaXN0cmljdEdyb3VwaW5nXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHZtLmdldFZhY2NpbmVEb3NlcyhlbmRNb250aC5wZXJpb2QsIGFudGlnZW4sIGRpc3RyaWN0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUNvdmVyYWdlWWVhciAhPSB2bS5sYXN0RW5kWWVhcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0VmFjY2luZURvc2VzKGFjdGl2ZUNvdmVyYWdlWWVhciwgYW50aWdlbiwgZGlzdHJpY3QpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0udXBkYXRlTWFwV2l0aFZhY2NpbmUoYW50aWdlbik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyB2bS5nZXRSZWRWYWNjaW5lRG9zZXMoZW5kTW9udGgucGVyaW9kLCBhbnRpZ2VuKTtcblxuXG4gICAgICAgICAgICAgICAgICAgIHZtLmxhc3RFbmRZZWFyID0gYWN0aXZlQ292ZXJhZ2VZZWFyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgIH1cblxuXSlcbiAgICAuZGlyZWN0aXZlKFwicmVwb3J0WWVhclRvZ2dsZXNcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3N0YXRpYy9hcHAvY29tcG9uZW50cy9jb3ZlcmFnZS9yZXBvcnQteWVhci10b2dnbGVzLmh0bWwnXG4gICAgICAgIH1cbiAgICB9KTtcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKS5jb250cm9sbGVyKCdGaW5hbmNlRGF0YUNvbnRyb2xsZXInLCBGaW5hbmNlRGF0YUNvbnRyb2xsZXIpO1xuXG5GaW5hbmNlRGF0YUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRodHRwJywgJ0ZpbmFuY2VTZXJ2aWNlJ107XG5mdW5jdGlvbiBGaW5hbmNlRGF0YUNvbnRyb2xsZXIoJHNjb3BlLCAkaHR0cCwgRmluYW5jZVNlcnZpY2UpIHtcblxuICAgICRzY29wZS5hZGROZXdSb3cgPSBhZGROZXdSb3c7XG4gICAgJHNjb3BlLnNhdmVSb3cgPSBzYXZlUm93O1xuXG4gICAgJHNjb3BlLmdyaWRPcHRpb25zID0ge307XG4gICAgJHNjb3BlLmdyaWRPcHRpb25zLmRhdGEgPSBbXTtcbiAgICAkc2NvcGUuZ3JpZE9wdGlvbnMuY29sdW1uRGVmcyA9IFtcbiAgICAgICAge25hbWU6ICdwZXJpb2QnLCBlbmFibGVDZWxsRWRpdDogdHJ1ZSB9LFxuICAgICAgICB7bmFtZTogJ2dhdmlfYXBwcm92ZWQnLCBlbmFibGVDZWxsRWRpdDogdHJ1ZSB9LFxuICAgICAgICB7bmFtZTogJ2dhdmlfZGlzYnVyc2VkJywgZW5hYmxlQ2VsbEVkaXQ6IHRydWUgfSxcbiAgICAgICAge25hbWU6ICdnb3VfYXBwcm92ZWQnLCBlbmFibGVDZWxsRWRpdDogdHJ1ZSB9LFxuICAgICAgICB7bmFtZTogJ2dvdV9kaXNidXJzZWQnLCBlbmFibGVDZWxsRWRpdDogdHJ1ZSB9XG4gICAgXTtcblxuICAgIC8vICRodHRwLmdldCgnL2ZpbmFuY2UvbGlzdCcsIHt9KVxuICAgIC8vICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgIC8vICAgICAgICAgdmFyIGRhdGEgPSBhbmd1bGFyLmZyb21Kc29uKHJlc3BvbnNlLmRhdGEpO1xuICAgIC8vICAgICAgICAgZGF0YS5tYXAoZnVuY3Rpb24oZCkge1xuICAgIC8vICAgICAgICAgICAgICRzY29wZS5ncmlkT3B0aW9ucy5kYXRhLnB1c2goZC5maWVsZHMpO1xuICAgIC8vICAgICAgICAgfSk7XG4gICAgLy8gICAgIH0pXG4gICAgRmluYW5jZVNlcnZpY2UuZ2V0RmluYW5jZURhdGEoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgZGF0YS5tYXAoZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgJHNjb3BlLmdyaWRPcHRpb25zLmRhdGEucHVzaChkKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuZ3JpZE9wdGlvbnMub25SZWdpc3RlckFwaSA9IGZ1bmN0aW9uKGdyaWRBcGkpe1xuICAgICAgICAkc2NvcGUuZ3JpZEFwaSA9IGdyaWRBcGk7XG4gICAgICAgIGdyaWRBcGkucm93RWRpdC5vbi5zYXZlUm93KCRzY29wZSwgJHNjb3BlLnNhdmVSb3cpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBhZGROZXdSb3coKSB7XG4gICAgICAgICRzY29wZS5ncmlkT3B0aW9ucy5kYXRhLnB1c2goe1xuICAgICAgICAgICAgcGVyaW9kOiAwLFxuICAgICAgICAgICAgZ2F2aV9hcHByb3ZlZDogMCxcbiAgICAgICAgICAgIGdhdmlfZGlzYnVyc2VkOiAwLFxuICAgICAgICAgICAgZ291X2FwcHJvdmVkOiAwLFxuICAgICAgICAgICAgZ291X2Rpc2J1cnNlZDogMFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzYXZlUm93KHJvd0VudGl0eSkge1xuICAgICAgICAkaHR0cC5kZWZhdWx0cy54c3JmQ29va2llTmFtZSA9ICdjc3JmdG9rZW4nO1xuICAgICAgICAkaHR0cC5kZWZhdWx0cy54c3JmSGVhZGVyTmFtZSA9ICdYLUNTUkZUb2tlbic7XG4gICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAucG9zdCgnL2ZpbmFuY2UvdXBkYXRlJywgcm93RW50aXR5KVxuXG4gICAgICAgICRzY29wZS5ncmlkQXBpLnJvd0VkaXQuc2V0U2F2ZVByb21pc2Uocm93RW50aXR5LCBwcm9taXNlLnByb21pc2UpO1xuICAgICAgICBjb25zb2xlLmxvZyhyb3dFbnRpdHkpO1xuICAgIH1cbn1cblxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpLmNvbnRyb2xsZXIoJ01haW5GaW5hbmNlQ29udHJvbGxlcicsIE1haW5GaW5hbmNlQ29udHJvbGxlcik7XG5cbk1haW5GaW5hbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnQ2hhcnRQREZFeHBvcnQnLCAnQ2hhcnRTdXBwb3J0U2VydmljZScsICdGaW5hbmNlU2VydmljZSddO1xuZnVuY3Rpb24gTWFpbkZpbmFuY2VDb250cm9sbGVyKCRzY29wZSwgQ2hhcnRQREZFeHBvcnQsIENoYXJ0U3VwcG9ydFNlcnZpY2UsIEZpbmFuY2VTZXJ2aWNlKSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5leHBvcnRQREYgPSBmdW5jdGlvbihuYW1lKSB7IENoYXJ0UERGRXhwb3J0LmV4cG9ydFdpdGhTdHlsZXIodm0sIG5hbWUpOyB9O1xuICAgIHZtLmdyYXBoT3B0aW9ucyA9IGdldE9wdGlvbnMoKTtcbiAgICB2bS5hcGlEYXRhID0gdW5kZWZpbmVkO1xuICAgIHZtLmNoYXJ0SW5zdGFuY2UgPSB1bmRlZmluZWQ7XG4gICAgdm0ueWVhckluZGV4ZXMgPSBbXTtcbiAgICB2bS5hY3RpdmVUb2dnbGUgPSAnR0FWSSc7XG4gICAgdm0uZ3JhcGhDdXJyZW5jeSA9ICdVU0QnO1xuICAgIHZtLmNvbXBhY3RBbW91bnRzID0gZmFsc2U7XG5cbiAgICByZXNldEdyYXBoRGF0YSgpO1xuICAgIHNldFllYXJGaWx0ZXJPcHRpb25zKCk7XG4gICAgJHNjb3BlLiR3YXRjaCgndm0uYWN0aXZlVG9nZ2xlJywgY2hhbmdlVGFicyk7XG4gICAgJHNjb3BlLiRvbigncmVmcmVzaEZpbmFuY2UnLCB1cGRhdGVDaGFydCk7XG4gICAgJHNjb3BlLiR3YXRjaCgndm0uZ3JhcGhDdXJyZW5jeScsIGNoYW5nZUN1cnJlbmN5KTtcbiAgICAkc2NvcGUuJHdhdGNoKCd2bS5jb21wYWN0QW1vdW50cycsIGNvbXBhY3RBbW91bnRzKTtcblxuICAgIGZ1bmN0aW9uIHJlc2V0R3JhcGhEYXRhKCkge1xuICAgICAgICB2bS5ncmFwaERhdGEgPSBnZXREZWZhdWx0R3JhcGhEYXRhKCk7XG4gICAgICAgIHZtLmFsbG9jR3JhcGhEYXRhID0gW107XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hhbmdlQ3VycmVuY3kobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgIGlmIChuZXdWYWx1ZSAhPSBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgcmVzZXRHcmFwaERhdGEoKTtcbiAgICAgICAgICAgIHVwZGF0ZUNoYXJ0V2l0aERhdGEodm0uYXBpRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wYWN0QW1vdW50cyhuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgaWYgKG5ld1ZhbHVlICE9IG9sZFZhbHVlKSB7XG4gICAgICAgICAgICByZXNldEdyYXBoRGF0YSgpO1xuICAgICAgICAgICAgdXBkYXRlQ2hhcnRXaXRoRGF0YSh2bS5hcGlEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFllYXJGaWx0ZXJPcHRpb25zKCkge1xuICAgICAgICBGaW5hbmNlU2VydmljZS5nZXRGaW5hbmNlWWVhcnMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICRzY29wZS4kcGFyZW50LmZpbmFuY2VZZWFycyA9IGRhdGE7XG4gICAgICAgICAgICAkc2NvcGUuJGVtaXQoJ3NldERlZmF1bHRZZWFycycsIGRhdGFbMF0sIGRhdGFbZGF0YS5sZW5ndGgtMV0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXREZWZhdWx0R3JhcGhEYXRhKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2F2aUFsbG9jOiBbXG4gICAgICAgICAgICAgICAge2tleTogJ0FwcHJvdmVkJywgdmFsdWVzOiBbXX0sXG4gICAgICAgICAgICAgICAge2tleTogJ0Rpc2J1cnNlZCcsIHZhbHVlczogW119XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgZ291QWxsb2M6IFtcbiAgICAgICAgICAgICAgICB7a2V5OiAnQXBwcm92ZWQnLCB2YWx1ZXM6IFtdfSxcbiAgICAgICAgICAgICAgICB7a2V5OiAnRGlzYnVyc2VkJywgdmFsdWVzOiBbXX1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBhbGxPYmxpZzogW1xuICAgICAgICAgICAgICAgIHtrZXk6ICdHYXZpIEZ1bmRzJywgdmFsdWVzOiBbXX0sXG4gICAgICAgICAgICAgICAge2tleTogJ0dPVSBGdW5kcycsIHZhbHVlczogW119XG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2N1cihhbW91bnQpIHtcbiAgICAgICAgaWYgKHZtLmdyYXBoQ3VycmVuY3kgPT0gJ1VHWCcpXG4gICAgICAgICAgICByZXR1cm4gYW1vdW50ICogMzYwMDtcbiAgICAgICAgcmV0dXJuIGFtb3VudDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVDaGFydChlLCBwYXJhbXMpIHtcbiAgICAgICAgcmVzZXRHcmFwaERhdGEoKTtcbiAgICAgICAgRmluYW5jZVNlcnZpY2UuZ2V0RmluYW5jZURhdGEocGFyYW1zKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHZtLmFwaURhdGEgPSBkYXRhO1xuICAgICAgICAgICAgdXBkYXRlQ2hhcnRXaXRoRGF0YShkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlQ2hhcnRXaXRoRGF0YShkYXRhKSB7XG4gICAgICAgIHZtLnllYXJJbmRleGVzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgaW4gZGF0YSkge1xuICAgICAgICAgICAgdmFyIHllYXJJbmRleCA9IGdldFllYXJJbmRleChkYXRhW2ldLnBlcmlvZClcblxuICAgICAgICAgICAgdm0uZ3JhcGhEYXRhLmFsbE9ibGlnWzBdLnZhbHVlcy5wdXNoKHt4OiB5ZWFySW5kZXgsIHk6IF9jdXIoZGF0YVtpXS5nYXZpX2FwcHJvdmVkKX0pO1xuICAgICAgICAgICAgdm0uZ3JhcGhEYXRhLmFsbE9ibGlnWzFdLnZhbHVlcy5wdXNoKHt4OiB5ZWFySW5kZXgsIHk6IF9jdXIoZGF0YVtpXS5nb3VfYXBwcm92ZWQpfSk7XG5cbiAgICAgICAgICAgIHZtLmdyYXBoRGF0YS5nYXZpQWxsb2NbMF0udmFsdWVzLnB1c2goe3g6IHllYXJJbmRleCwgeTogX2N1cihkYXRhW2ldLmdhdmlfYXBwcm92ZWQpfSk7XG4gICAgICAgICAgICB2bS5ncmFwaERhdGEuZ2F2aUFsbG9jWzFdLnZhbHVlcy5wdXNoKHt4OiB5ZWFySW5kZXgsIHk6IF9jdXIoZGF0YVtpXS5nYXZpX2Rpc2J1cnNlZCl9KTtcblxuICAgICAgICAgICAgdm0uZ3JhcGhEYXRhLmdvdUFsbG9jWzBdLnZhbHVlcy5wdXNoKHt4OiB5ZWFySW5kZXgsIHk6IF9jdXIoZGF0YVtpXS5nb3VfYXBwcm92ZWQpfSk7XG4gICAgICAgICAgICB2bS5ncmFwaERhdGEuZ291QWxsb2NbMV0udmFsdWVzLnB1c2goe3g6IHllYXJJbmRleCwgeTogX2N1cihkYXRhW2ldLmdvdV9kaXNidXJzZWQpfSk7XG4gICAgICAgIH1cbiAgICAgICAgLypUcmlnZ2VyIHRoZSBsb2FkaW5nIG9mIHRoZSBpbml0YWwgVGFiLCB3aXRoIHJhbmRvbSB2YWx1ZXMqL1xuICAgICAgICBjaGFuZ2VUYWJzKDAsMSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0T3B0aW9ucygpIHtcbiAgICAgICAgdmFyIGNoYXJ0T3B0aW9ucyA9IENoYXJ0U3VwcG9ydFNlcnZpY2UuZ2V0T3B0aW9ucygnbXVsdGlCYXJDaGFydCcpO1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQuY29sb3IgPSBbXCJncmVlblwiLCBcIkRvZGdlckJsdWVcIl07XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC53aWR0aCA9IDkwMDtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0Lm1hcmdpbiA9IHtsZWZ0OiA4MCwgdG9wOiA3MH07XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC5sZWdlbmQud2lkdGggPSA5MDA7XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC54QXhpcy5heGlzTGFiZWwgPSBcInllYXJzXCI7XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC55QXhpcy5heGlzTGFiZWwgPSBcIlwiO1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQueEF4aXMudGlja0Zvcm1hdCA9IGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgcmV0dXJuIHZtLnllYXJJbmRleGVzW2RdO1xuICAgICAgICB9O1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQudmFsdWVGb3JtYXQgPSBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgIHJldHVybiB0aWNrRm9ybWF0KGQzLmZvcm1hdCgnLjBmJykpO1xuICAgICAgICB9O1xuICAgICAgICAvL0h1bWFuaXplIHRoZSBsYWJlbHNcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LmRpc3BhdGNoLnJlbmRlckVuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHZtLmNvbXBhY3RBbW91bnRzKVxuICAgICAgICAgICAgICAgIENoYXJ0U3VwcG9ydFNlcnZpY2UuaW5pdExhYmVscyh0cnVlKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBDaGFydFN1cHBvcnRTZXJ2aWNlLmluaXRMYWJlbHMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjaGFydE9wdGlvbnM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0WWVhckluZGV4KHllYXIpIHtcbiAgICAgICAgaWYgKHZtLnllYXJJbmRleGVzLmluZGV4T2YoeWVhcikgPT0gLTEpIHZtLnllYXJJbmRleGVzLnB1c2goeWVhcik7XG4gICAgICAgIHJldHVybiB2bS55ZWFySW5kZXhlcy5pbmRleE9mKHllYXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoYW5nZVRhYnMobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgIGlmIChuZXdWYWx1ZSAhPSBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgQ2hhcnRTdXBwb3J0U2VydmljZS5jbGVhckxhYmVscygpO1xuICAgICAgICAgICAgaWYgKHZtLmFjdGl2ZVRvZ2dsZSA9PSAnR0FWSScpXG4gICAgICAgICAgICAgICAgdm0uYWxsb2NHcmFwaERhdGEgPSB2bS5ncmFwaERhdGEuZ2F2aUFsbG9jO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHZtLmFsbG9jR3JhcGhEYXRhID0gdm0uZ3JhcGhEYXRhLmdvdUFsbG9jO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cbn0pKHdpbmRvdy5hbmd1bGFyKTsiLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJylcbi5jb250cm9sbGVyKCdGcmlkZ2VDb250cm9sbGVyJywgWyckc2NvcGUnLCAnRnJpZGdlU2VydmljZScsICckcm9vdFNjb3BlJywgJ05nVGFibGVQYXJhbXMnLCAnRmlsdGVyU2VydmljZScsXG5mdW5jdGlvbigkc2NvcGUsIEZyaWRnZVNlcnZpY2UsICRyb290U2NvcGUsIE5nVGFibGVQYXJhbXMsIEZpbHRlclNlcnZpY2UpXG57XG5cbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZhciBzaGVsbFNjb3BlID0gJHNjb3BlLiRwYXJlbnQ7XG4gICAgc2hlbGxTY29wZS5jaGlsZCA9ICRzY29wZTtcblxuICAgIHZtLmdldEZyaWRnZUFsbERpc3RyaWN0Q2FwYWNpdHkgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcblxuICAgICAgICB2bS5zdGFydFF1YXJ0ZXIgPSB2bS5zdGFydFF1YXJ0ZXIgPyB2bS5zdGFydFF1YXJ0ZXIgOiBcIjIwMTYwMVwiO1xuICAgICAgICB2bS5lbmRRdWFydGVyID0gdm0uZW5kUXVhcnRlciA/IHZtLmVuZFF1YXJ0ZXIgOiBcIjIwMTYwNFwiO1xuICAgICAgICBmcmlkZ2VEaXN0cmljdCA9IFwiXCI7XG4gICAgICAgIHZtLmNhcmVsZXZlbCA9IGNhcmVsZXZlbDtcblxuICAgICAgICBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZURpc3RyaWN0Q2FwYWNpdHkoc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKVxuICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG5cbiAgICAgICAgICAgIHRhYmxlZGF0YUFsbGRpc3RyaWN0cyA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNDYXBhY2l0eUFsbGRpc3RyaWN0cyA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhQWxsZGlzdHJpY3RzLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy89PT09QWRkaXRpb25hbCBNZXRyaWNzPT09PVxuXG4gICAgICAgICAgICAgICAgdmFyIG1ldHJpY3MgPSBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZUNhcGFjaXR5TWV0cmljcyh2bS5kYXRhKTtcblxuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudXN1cnAgPSBtZXRyaWNzLnN1cnBsdXM7XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC51c3VmZmljaWVudCA9IG1ldHJpY3Muc3VmZmljaWVudDtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnVzaG9ydGFnZT0gbWV0cmljcy5zaG9ydGFnZTtcbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgfTtcblxuICAgICAgICB2bS5nZXRGcmlkZ2VEaXN0cmljdENhcGFjaXR5ID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKSB7XG5cbiAgICAgICAgICAgIHZtLnN0YXJ0UXVhcnRlciA/IHZtLnN0YXJ0UXVhcnRlciA6IFwiMjAxNjAxXCI7XG4gICAgICAgICAgICB2bS5lbmRRdWFydGVyID0gdm0uZW5kUXVhcnRlciA/IHZtLmVuZFF1YXJ0ZXIgOiBcIjIwMTYwNFwiO1xuICAgICAgICAgICAgZGlzdHJpY3QgPSBcIlwiO1xuICAgICAgICAgICAgdm0uZnJpZGdlRGlzdHJpY3QgPSBmcmlkZ2VEaXN0cmljdDtcbiAgICAgICAgICAgIHZtLmNhcmVsZXZlbCA9IGNhcmVsZXZlbDtcblxuICAgICAgICAgICAgRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VEaXN0cmljdENhcGFjaXR5KHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG5cblxuICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0b3RhbHNcblxuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZnJpZGdlRGlzdHJpY3QgPSBkaXN0cmljdDtcblxuXG5cblxuICAgICAgICAgICAgICAgIC8vIGNvbnN0cnVjdCBEaXN0cmljdCBncmFwaCBkYXRhXG4gICAgICAgICAgICAgICAgdmFyIGdyYXBoZGF0YSA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBzZXJpZXNSZXF1aXJlZCA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBzZXJpZXNBdmFpbGFibGUgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgc2VyaWVzR2FwID0gW107XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5hdmFpbGFibGUgPSAwO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5kYXRhLmxlbmd0aCA7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBzZXJpZXNSZXF1aXJlZC5wdXNoKFt2bS5kYXRhW2ldLnF1YXJ0ZXIuc2xpY2UoMCw0KSArIFwiLVFcIiArIHZtLmRhdGFbaV0ucXVhcnRlci5zbGljZSg1LDYpLCB2bS5kYXRhW2ldLnJlcXVpcmVkXSlcbiAgICAgICAgICAgICAgICAgICAgc2VyaWVzQXZhaWxhYmxlLnB1c2goW3ZtLmRhdGFbaV0ucXVhcnRlci5zbGljZSgwLDQpICsgXCItUVwiICsgdm0uZGF0YVtpXS5xdWFydGVyLnNsaWNlKDUsNiksIHZtLmRhdGFbaV0uYXZhaWxhYmxlXSlcbiAgICAgICAgICAgICAgICAgICAgc2VyaWVzR2FwLnB1c2goW3ZtLmRhdGFbaV0ucXVhcnRlci5zbGljZSgwLDQpICsgXCItUVwiICsgdm0uZGF0YVtpXS5xdWFydGVyLnNsaWNlKDUsNiksIHZtLmRhdGFbaV0uZ2FwXSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZtLmRhdGFbaV0ucXVhcnRlcil7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmF2YWlsYWJsZSA9IHZtLmRhdGFbaV0uYXZhaWxhYmxlXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIHNlcmllc1JlcXVpcmVkID0gW1syMDE2MDIsIDMwXSwgWzIwMTYwMywgMzBdXTtcbiAgICAgICAgICAgICAgICBzZXJpZXNBdmFpbGFibGUgPSBbWzIwMTYwMiwgNjBdLCBbMjAxNjAzLCAyMF1dO1xuICAgICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgICAgICBncmFwaGRhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGtleTogXCJSZXF1aXJlZFwiLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IHNlcmllc1JlcXVpcmVkLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjonIzJBNDQ4QSdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBncmFwaGRhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGtleTogXCJBdmFpbGFibGVcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBzZXJpZXNBdmFpbGFibGUsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOidncmVlbidcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZtLmdyYXBoID0gZ3JhcGhkYXRhO1xuXG5cbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgZ3JhcGhcbiAgICAgICAgICAgICAgICB2bS5vcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJtdWx0aUJhckNoYXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDQ1MCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IDIwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogNDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogNDVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGlwRWRnZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbihkKXsgcmV0dXJuIGRbMF07IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbihkKXsgcmV0dXJuIGRbMV07IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93VmFsdWVzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1lBeGlzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29sb3I6IGZ1bmN0aW9uKGQpeyByZXR1cm4gJ2dyZWVuJ31cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy92YWx1ZUZvcm1hdDogZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICByZXR1cm4gdGlja0Zvcm1hdChkMy5mb3JtYXQoJywuMWYnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL31cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9O1xuXG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgdm0uZ2V0RnJpZGdlRmFjaWxpdHlDYXBhY2l0eSA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuXG4gICAgICAgICAgICB2bS5zdGFydFF1YXJ0ZXIgPyB2bS5zdGFydFF1YXJ0ZXIgOiBcIjIwMTYwMVwiO1xuICAgICAgICAgICAgdm0uZW5kUXVhcnRlciA9IHZtLmVuZFF1YXJ0ZXIgPyB2bS5lbmRRdWFydGVyIDogXCIyMDE2MDRcIjtcbiAgICAgICAgICAgIGRpc3RyaWN0ID0gXCJcIjtcbiAgICAgICAgICAgIHZtLmRpc3RyaWN0ID0gZnJpZGdlRGlzdHJpY3Q7XG4gICAgICAgICAgICB2bS5jYXJlbGV2ZWwgPSBjYXJlbGV2ZWw7XG5cbiAgICAgICAgICAgIEZyaWRnZVNlcnZpY2UuZ2V0RnJpZGdlRmFjaWxpdHlDYXBhY2l0eShzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zX2YgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgIGNvdW50OiAxNVxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHZtLmRhdGEsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdG90YWxzXG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5mcmlkZ2VEaXN0cmljdCA9IHZtLmZyaWRnZURpc3RyaWN0O1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuY2FyZWxldmVsID0gdm0uY2FyZWxldmVsO1xuXG4gICAgICAgICAgICAgICAgLy89PT09QWRkaXRpb25hbCBNZXRyaWNzPT09PVxuXG4gICAgICAgICAgICAgICAgdmFyIG1ldHJpY3MgPSBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZUNhcGFjaXR5TWV0cmljcyh2bS5kYXRhKTtcblxuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudXRzdXJwID0gKG1ldHJpY3Muc3VycGx1cy9tZXRyaWNzLnRvdGFsKSoxMDA7XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC51dHN1ZmZpY2llbnQgPSAobWV0cmljcy5zdWZmaWNpZW50L21ldHJpY3MudG90YWwpKjEwMDtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnV0c2hvcnRhZ2U9IChtZXRyaWNzLnNob3J0YWdlL21ldHJpY3MudG90YWwpKjEwMDtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cblxuICAgICAgICB2bS5nZXRGcmlkZ2VBbGxEaXN0cmljdFJlZnJpZ2VyYXRvciA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuXG4gICAgICAgICAgICB2bS5zdGFydFF1YXJ0ZXIgPSB2bS5zdGFydFF1YXJ0ZXIgPyB2bS5zdGFydFF1YXJ0ZXIgOiBcIjIwMTYwMVwiO1xuICAgICAgICAgICAgdm0uZW5kUXVhcnRlciA9IHZtLmVuZFF1YXJ0ZXIgPyB2bS5lbmRRdWFydGVyIDogXCIyMDE2MDRcIjtcbiAgICAgICAgICAgIGZyaWRnZURpc3RyaWN0ID0gXCJcIjtcbiAgICAgICAgICAgIHZtLmZyaWRnZURpc3RyaWN0ID0gZnJpZGdlRGlzdHJpY3Q7XG4gICAgICAgICAgICB2bS5jYXJlbGV2ZWwgPSBjYXJlbGV2ZWw7XG5cbiAgICAgICAgICAgIEZyaWRnZVNlcnZpY2UuZ2V0RnJpZGdlRGlzdHJpY3RSZWZyaWdlcmF0b3Ioc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcbiAgICAgICAgICAgICAgICB0YWJsZWRhdGFBbGxkaXN0cmljdHMgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc0Z1bmN0aW9uYWxpdHlBbGxkaXN0cmljdHMgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YUFsbGRpc3RyaWN0cyxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZtLmdldEZyaWRnZURpc3RyaWN0UmVmcmlnZXJhdG9yID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKSB7XG5cbiAgICAgICAgICAgICAgICB2bS5zdGFydFF1YXJ0ZXIgPSB2bS5zdGFydFF1YXJ0ZXIgPyB2bS5zdGFydFF1YXJ0ZXIgOiBcIjIwMTYwMVwiO1xuICAgICAgICAgICAgICAgIHZtLmVuZFF1YXJ0ZXIgPSB2bS5lbmRRdWFydGVyID8gdm0uZW5kUXVhcnRlciA6IFwiMjAxNjA0XCI7XG4gICAgICAgICAgICAgICAgZGlzdHJpY3QgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHZtLmNhcmVsZXZlbCA9IGNhcmVsZXZlbDtcblxuICAgICAgICAgICAgICAgIEZyaWRnZVNlcnZpY2UuZ2V0RnJpZGdlRGlzdHJpY3RSZWZyaWdlcmF0b3Ioc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFBbGxkaXN0cmljdHMgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNBbGxkaXN0cmljdHMgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YUFsbGRpc3RyaWN0cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc19kID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDE1XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB2bS5kYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnN0cnVjdCBEaXN0cmljdCBncmFwaCBkYXRhXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBncmFwaGZ1bmN0aW9uYWxpdHlkYXRhID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VyaWVzRXhpc3RpbmcgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZXJpZXNOb3RXb3JraW5nID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VyaWVzbWFpbnRlbmFuY2UgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5mdW5jdGlvbmFsaXR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZnJpZGdlRGlzdHJpY3QgPSBkaXN0cmljdDtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmRhdGEubGVuZ3RoIDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VyaWVzRXhpc3RpbmcucHVzaChbdm0uZGF0YVtpXS5xdWFydGVyLnNsaWNlKDAsNCkgKyBcIi1RXCIgKyB2bS5kYXRhW2ldLnF1YXJ0ZXIuc2xpY2UoNSw2KSwgdm0uZGF0YVtpXS5udW1iZXJfZXhpc3RpbmddKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcmllc05vdFdvcmtpbmcucHVzaChbdm0uZGF0YVtpXS5xdWFydGVyLnNsaWNlKDAsNCkgKyBcIi1RXCIgKyB2bS5kYXRhW2ldLnF1YXJ0ZXIuc2xpY2UoNSw2KSwgdm0uZGF0YVtpXS5ub3Rfd29ya2luZ10pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VyaWVzbWFpbnRlbmFuY2UucHVzaChbdm0uZGF0YVtpXS5xdWFydGVyLnNsaWNlKDAsNCkgKyBcIi1RXCIgKyB2bS5kYXRhW2ldLnF1YXJ0ZXIuc2xpY2UoNSw2KSwgdm0uZGF0YVtpXS5uZWVkc19tYWludGVuYW5jZV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZtLmRhdGFbaV0ucXVhcnRlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmZ1bmN0aW9uYWxpdHkgPSAodm0uZGF0YVtpXS5udW1iZXJfZXhpc3RpbmcgLSB2bS5kYXRhW2ldLm5vdF93b3JraW5nKS92bS5kYXRhW2ldLm51bWJlcl9leGlzdGluZyoxMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoZnVuY3Rpb25hbGl0eWRhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIkV4aXN0aW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBzZXJpZXNFeGlzdGluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjonZ3JlZW4nXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoZnVuY3Rpb25hbGl0eWRhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIk5vdCBXb3JraW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBzZXJpZXNOb3RXb3JraW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjMkE0NDhBJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBncmFwaGZ1bmN0aW9uYWxpdHlkYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJOZWVkcyBtYWludGVuYW5jZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogc2VyaWVzbWFpbnRlbmFuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J3JlZCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5ncmFwaGZ1bmN0aW9uYWxpdHkgPSBncmFwaGZ1bmN0aW9uYWxpdHlkYXRhO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBncmFwaFxuICAgICAgICAgICAgICAgICAgICAgICAgdm0ub3B0aW9uc2Z1bmN0aW9uYWxpdHkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJtdWx0aUJhckNoYXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogNDUwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByaWdodDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3R0b206IDQ1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogNDVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0NvbnRyb2xzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpcEVkZ2U6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFswXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogZnVuY3Rpb24oZCl7IHJldHVybiBkWzFdOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93VmFsdWVzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93WUF4aXM6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3ZhbHVlRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgcmV0dXJuIHRpY2tGb3JtYXQoZDMuZm9ybWF0KCcsLjFmJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2bS5nZXRGcmlkZ2VGYWNpbGl0eVJlZnJpZ2VyYXRvciA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLnN0YXJ0UXVhcnRlciA/IHZtLnN0YXJ0UXVhcnRlciA6IFwiMjAxNjAxXCI7XG4gICAgICAgICAgICAgICAgICAgIHZtLmVuZFF1YXJ0ZXIgPSB2bS5lbmRRdWFydGVyID8gdm0uZW5kUXVhcnRlciA6IFwiMjAxNjA0XCI7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgdm0uZGlzdHJpY3QgPSBmcmlkZ2VEaXN0cmljdDtcbiAgICAgICAgICAgICAgICAgICAgdm0uY2FyZWxldmVsID0gY2FyZWxldmVsO1xuXG4gICAgICAgICAgICAgICAgICAgIEZyaWRnZVNlcnZpY2UuZ2V0RnJpZGdlRmFjaWxpdHlSZWZyaWdlcmF0b3Ioc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFBbGxmYWNpbGl0aWVzID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zQWxsZmFjaWxpdGllcyA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhQWxsZmFjaWxpdGllcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zX2YgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxNVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHZtLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdG90YWxzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5mcmlkZ2VEaXN0cmljdCA9IHZtLmZyaWRnZURpc3RyaWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuY2FyZWxldmVsID0gdm0uY2FyZWxldmVsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICB2bS5nZXRGcmlkZ2VBbGxEaXN0cmljdEltbXVuaXppbmdGYWNpbGl0eSA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5zdGFydFF1YXJ0ZXIgPSB2bS5zdGFydFF1YXJ0ZXIgPyB2bS5zdGFydFF1YXJ0ZXIgOiBcIjIwMTYwMVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZW5kUXVhcnRlciA9IHZtLmVuZFF1YXJ0ZXIgPyB2bS5lbmRRdWFydGVyIDogXCIyMDE2MDRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyaWRnZURpc3RyaWN0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmNhcmVsZXZlbCA9IGNhcmVsZXZlbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VEaXN0cmljdEltbXVuaXppbmdGYWNpbGl0eShzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbERhdGEgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YUFsbGRpc3RyaWN0cyA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zSW1tdW5pemluZ0FsbGRpc3RyaWN0cyA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhQWxsZGlzdHJpY3RzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0RnJpZGdlRGlzdHJpY3RJbW11bml6aW5nRmFjaWxpdHkgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnN0YXJ0UXVhcnRlciA/IHZtLnN0YXJ0UXVhcnRlciA6IFwiMjAxNjAxXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZW5kUXVhcnRlciA9IGVuZFF1YXJ0ZXIubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXN0cmljdCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZGlzdHJpY3QgPSBmcmlkZ2VEaXN0cmljdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5jYXJlbGV2ZWwgPSBjYXJlbGV2ZWw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZURpc3RyaWN0SW1tdW5pemluZ0ZhY2lsaXR5KHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhQWxsZnJpZGdlID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zQWxsZnJpZGdlID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFBbGxmcmlkZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfZCA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxNVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdm0uZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdG90YWxzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmZyaWRnZURpc3RyaWN0ID0gZGlzdHJpY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnF1YXJ0ZXIgPSBlbmRRdWFydGVyLm5hbWUgLSAyO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnN0cnVjdCBEaXN0cmljdCBncmFwaCBkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ3JhcGhkYXRhaW1tdW5pemluZyA9IFtdO1xuXG5cblxuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uZGF0YS5sZW5ndGggOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgSW1tdW5pemluZyA9IHZtLmRhdGFbaV0uaW1tdW5pemluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgTm90SW1tdW5pemluZyA9IHZtLmRhdGFbaV0uVG90YWxfZmFjaWxpdGllcyAtIHZtLmRhdGFbaV0uaW1tdW5pemluZztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZmFjaWxpdHkgPSB2bS5kYXRhW2ldLmltbXVuaXppbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBncmFwaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0ub3B0aW9uc2ltbXVuaXppbmcgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3BpZUNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC5rZXk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC55O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93TGFiZWxzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFRocmVzaG9sZDogMC4wMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxTdW5iZWFtTGF5b3V0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByaWdodDogMzUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5ncmFwaGltbXVuaXppbmcgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiSW1tdW5pemluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBJbW11bml6aW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjonZ3JlZW4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJOb3QgSW1tdW5pemluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBOb3RJbW11bml6aW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjonIzJBNDQ4QSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF07XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRvbigncmVmcmVzaENhcGFjaXR5JywgZnVuY3Rpb24oZSwgc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHN0YXJ0UXVhcnRlciAmJiBlbmRRdWFydGVyICYmIGZyaWRnZURpc3RyaWN0LmRpc3RyaWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRGcmlkZ2VEaXN0cmljdFJlZnJpZ2VyYXRvcihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LmRpc3RyaWN0LCBjYXJlbGV2ZWwuZ3JvdXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0RnJpZGdlQWxsRGlzdHJpY3RSZWZyaWdlcmF0b3Ioc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdC5kaXN0cmljdCwgY2FyZWxldmVsLmdyb3VwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldEZyaWRnZUZhY2lsaXR5UmVmcmlnZXJhdG9yKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QuZGlzdHJpY3QsIGNhcmVsZXZlbC5ncm91cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRGcmlkZ2VBbGxEaXN0cmljdEltbXVuaXppbmdGYWNpbGl0eShzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LmRpc3RyaWN0LCBjYXJlbGV2ZWwuZ3JvdXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0RnJpZGdlRGlzdHJpY3RJbW11bml6aW5nRmFjaWxpdHkoc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdC5kaXN0cmljdCwgY2FyZWxldmVsLmdyb3VwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldEZyaWRnZUFsbERpc3RyaWN0Q2FwYWNpdHkoc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdC5kaXN0cmljdCwgY2FyZWxldmVsLmdyb3VwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldEZyaWRnZURpc3RyaWN0Q2FwYWNpdHkoc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdC5kaXN0cmljdCwgY2FyZWxldmVsLmdyb3VwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldEZyaWRnZUZhY2lsaXR5Q2FwYWNpdHkoc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdC5kaXN0cmljdCwgY2FyZWxldmVsLmdyb3VwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBdKTtcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpLmNvbnRyb2xsZXIoJ0dlbmVyaWNJbXBvcnRDb250cm9sbGVyJywgR2VuZXJpY0ltcG9ydENvbnRyb2xsZXIpO1xuXG5HZW5lcmljSW1wb3J0Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHVpYk1vZGFsJ107XG5mdW5jdGlvbiBHZW5lcmljSW1wb3J0Q29udHJvbGxlcigkc2NvcGUsICR1aWJNb2RhbCkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uaW1wb3J0RGF0YUZpbGUgPSBzaG93SW1wb3J0TW9kYWw7XG4gICAgdm0uYW5pbWF0aW9uc0VuYWJsZWQgPSB0cnVlO1xuXG4gICAgZnVuY3Rpb24gc2hvd0ltcG9ydE1vZGFsKHNpemUsIHBhcmVudFNlbGVjdG9yKSB7XG4gICAgICAgIHZhciBwYXJlbnRFbGVtID0gcGFyZW50U2VsZWN0b3IgPyBcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KCRkb2N1bWVudFswXS5xdWVyeVNlbGVjdG9yKCcuZ2VuZXJpYy1pbXBvcnQgJyArIHBhcmVudFNlbGVjdG9yKSkgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkdWliTW9kYWwub3Blbih7XG4gICAgICAgICAgICBhbmltYXRpb246IHZtLmFuaW1hdGlvbnNFbmFibGVkLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdpbXBvcnRNb2RhbENvbnRlbnQuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnTW9kYWxJbnN0YW5jZUN0cmwnLFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgc2l6ZTogc2l6ZSxcbiAgICAgICAgICAgIGFwcGVuZFRvOiBwYXJlbnRFbGVtXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaW1wb3J0RGF0YUZpbGUoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy9hbGVydCgnQ2FuY2VsZWxkJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW1wb3J0RGF0YUZpbGUoKSB7XG4gICAgICAgIGFsZXJ0KCdJbXBvcnQgaW4gcHJvZ3Jlc3MnKTtcbiAgICB9XG59XG5cbn0pKHdpbmRvdy5hbmd1bGFyKTtcblxuKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpLmNvbnRyb2xsZXIoJ01vZGFsSW5zdGFuY2VDdHJsJywgZnVuY3Rpb24gKCR1aWJNb2RhbEluc3RhbmNlKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICB2bS5vayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCdkb25lJyk7XG4gICAgICAgIH07XG4gICAgXG4gICAgICAgIHZtLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xuICAgICAgICB9O1xuICAgIH0pO1xufSkod2luZG93LmFuZ3VsYXIpOyIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKVxuICAgIC5jb250cm9sbGVyKCdQbGFubmluZ0NvbnRyb2xsZXInLCBbJyRzY29wZScsICdBbm51YWxTZXJ2aWNlJywgJyRyb290U2NvcGUnLCAnTmdUYWJsZVBhcmFtcycsICdGaWx0ZXJTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsIEFubnVhbFNlcnZpY2UsICRyb290U2NvcGUsIE5nVGFibGVQYXJhbXMsIEZpbHRlclNlcnZpY2UpXG4gICAge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2YXIgc2hlbGxTY29wZSA9ICRzY29wZS4kcGFyZW50O1xuICAgICAgICBzaGVsbFNjb3BlLmNoaWxkID0gJHNjb3BlO1xuXG4gICAgICAgIHZtLmdldEZ1bmRBY3Rpdml0aWVzID0gZnVuY3Rpb24oeWVhcikge1xuICAgICAgICAgICAgeWVhciA9IFwiXCJcbiAgICAgICAgICAgIHZtLnllYXIgPSB5ZWFyO1xuXG4gICAgICAgICAgICBBbm51YWxTZXJ2aWNlLmdldEZ1bmRBY3Rpdml0aWVzKHllYXIpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGVkYXRhX2Z1bmRlZCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGVkYXRhX3VuZnVuZGVkID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcblxuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YV9mdW5kZWQgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5mdW5kID09IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhX3VuZnVuZGVkID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuZnVuZCA9PSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcblxuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YWZ1bmQgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc2Z1bmRlZCA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTVcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhZnVuZCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRvdGFsc1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBncmFwaGRhdGFmdW5kID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciBmdW5kZWQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdW5mdW5kZWQgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZtLmRhdGFbaV0uZnVuZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuZGVkKys7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh2bS5kYXRhW2ldLmZ1bmQgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmZ1bmRlZCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlIGdyYXBoXG4gICAgICAgICAgICAgICAgICAgIHZtLmZ1bmRhY3Rpdml0eSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3BpZUNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkLmtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkLnk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93TGFiZWxzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxUaHJlc2hvbGQ6IDAuMDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxTdW5iZWFtTGF5b3V0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAzNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZnVuZGVkID09IHZtLmRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5ncmFwaGZ1bmRlZGFjdGl2aXRpZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zX2Z1bmRlZCA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxNVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhX2Z1bmRlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc191bmZ1bmRlZCA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxNVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhX3VuZnVuZGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ3JhcGhmdW5kZWRhY3Rpdml0aWVzID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIkZ1bmRlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiAoZnVuZGVkIC8gdm0uZGF0YS5sZW5ndGgpICogMTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjonZ3JlZW4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJVbmZ1bmRlZCBBY3Rpdml0aWVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6ICh1bmZ1bmRlZCAvIHZtLmRhdGEubGVuZ3RoKSAqIDEwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J3JlZCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIHZtLmdldFByaW9yaXR5QWN0aXZpdGllcyA9IGZ1bmN0aW9uKHllYXIpIHtcbiAgICAgICAgICAgIHllYXIgPSBcIlwiXG4gICAgICAgICAgICB2bS55ZWFyID0geWVhcjtcblxuICAgICAgICAgICAgQW5udWFsU2VydmljZS5nZXRQcmlvcml0eUFjdGl2aXRpZXMoeWVhcilcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZWRhdGFfcHJpb3JpdHlmdW5kID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZWRhdGFfcHJpb3JpdHl1bmZ1bmRlZCA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG5cblxuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFfcHJpb3JpdHlmdW5kID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuZnVuZCA9PSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YV9wcmlvcml0eXVuZnVuZGVkID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuZnVuZCA9PSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcblxuXG5cblxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChmdW5kZWQgPT0gdm0uZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdyYXBoZnVuZGVkYWN0aXZpdGllcyA9IFtdO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zX3ByaW9yaXR5ZnVuZD0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDE1XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFfcHJpb3JpdHlmdW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zX3ByaW9yaXR5dW5mdW5kZWQgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YV9wcmlvcml0eXVuZnVuZGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnN0cnVjdCBEaXN0cmljdCBncmFwaCBkYXRhXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcmlvcml0eWRhdGEgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByaW9yaXR5ZGF0YXVuID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciBIaWdocHJpb3JpdHkgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIE1lZGl1bXByaW9yaXR5ID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciBMb3dwcmlvcml0eSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgSGlnaHByaW9yaXR5dW4gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIE1lZGl1bXByaW9yaXR5dW4gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIExvd3ByaW9yaXR5dW4gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmRhdGEubGVuZ3RoIDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodm0uZGF0YVtpXS5mdW5kID09IHRydWUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEhpZ2hwcmlvcml0eS5wdXNoKFt2bS5kYXRhW2ldLmFyZWEsIHZtLmRhdGFbaV0uSGlnaF0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWVkaXVtcHJpb3JpdHkucHVzaChbdm0uZGF0YVtpXS5hcmVhLCB2bS5kYXRhW2ldLk1lZGl1bV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTG93cHJpb3JpdHkucHVzaChbdm0uZGF0YVtpXS5hcmVhLCB2bS5kYXRhW2ldLkxvd10pXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBIaWdocHJpb3JpdHl1bi5wdXNoKFt2bS5kYXRhW2ldLmFyZWEsIHZtLmRhdGFbaV0uSGlnaF0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWVkaXVtcHJpb3JpdHl1bi5wdXNoKFt2bS5kYXRhW2ldLmFyZWEsIHZtLmRhdGFbaV0uTWVkaXVtXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBMb3dwcmlvcml0eXVuLnB1c2goW3ZtLmRhdGFbaV0uYXJlYSwgdm0uZGF0YVtpXS5Mb3ddKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eWRhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIkhJR0hcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IEhpZ2hwcmlvcml0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjonIzJBNDQ4QSdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5ZGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiTUVESVVNXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBNZWRpdW1wcmlvcml0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjonZ3JlZW4nXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eWRhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIkxPV1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogTG93cHJpb3JpdHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J3llbGxvdydcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdm0ucHJpb3JpdHlncmFwaCA9IHByaW9yaXR5ZGF0YTtcblxuXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBncmFwaFxuICAgICAgICAgICAgICAgICAgICB2bS5wcmlvcml0eW9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJtdWx0aUJhckNoYXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogNDUwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDo1MDAsXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpcEVkZ2U6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFswXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogZnVuY3Rpb24oZCl7IHJldHVybiBkWzFdOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93VmFsdWVzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93WUF4aXM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dYQXhpczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm90YXRlTGFiZWxzOiA1NSxcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5ZGF0YXVuLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJISUdIXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBIaWdocHJpb3JpdHl1bixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjonIzJBNDQ4QSdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5ZGF0YXVuLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJNRURJVU1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IE1lZGl1bXByaW9yaXR5dW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J2dyZWVuJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHlkYXRhdW4ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIkxPV1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogTG93cHJpb3JpdHl1bixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjoneWVsbG93J1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB2bS5wcmlvcml0eWdyYXBodW4gPSBwcmlvcml0eWRhdGF1bjtcblxuICAgICAgICAgICAgICAgICAgICB2bS5wcmlvcml0eW9wdGlvbnN1biA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm11bHRpQmFyQ2hhcnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA0NTAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOjUwMCxcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlwRWRnZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZnVuY3Rpb24oZCl7IHJldHVybiBkWzBdOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbihkKXsgcmV0dXJuIGRbMV07IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dWYWx1ZXM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dZQXhpczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1hBeGlzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3RhdGVMYWJlbHM6IDU1LFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbigncmVmcmVzaEF3cCcsIGZ1bmN0aW9uKGUsIHllYXIpIHtcbiAgICAgICAgICAgICAgICBpZih5ZWFyLnllYXIpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2bS5nZXRGdW5kQWN0aXZpdGllcyh5ZWFyLnllYXIpO1xuICAgICAgICAgICAgICAgICAgICB2bS5nZXRQcmlvcml0eUFjdGl2aXRpZXMoeWVhci55ZWFyKTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICBdKTtcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKVxuICAgIC5jb250cm9sbGVyKCdTdG9ja0NvbnRyb2xsZXInLCBbJyRzY29wZScsICdTdG9ja1NlcnZpY2UnLCAnJHJvb3RTY29wZScsICdOZ1RhYmxlUGFyYW1zJyxcbiAgICAnRmlsdGVyU2VydmljZScsICdNb250aFNlcnZpY2UnLCAnJGxvY2F0aW9uJywgJ0NoYXJ0U3VwcG9ydFNlcnZpY2UnLCAnQ2hhcnRQREZFeHBvcnQnLCAnJHRpbWVvdXQnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgU3RvY2tTZXJ2aWNlLCAkcm9vdFNjb3BlLCBOZ1RhYmxlUGFyYW1zLCBGaWx0ZXJTZXJ2aWNlLCBNb250aFNlcnZpY2UsXG4gICAgICAgICRsb2NhdGlvbiwgQ2hhcnRTdXBwb3J0U2VydmljZSwgQ2hhcnRQREZFeHBvcnQsICR0aW1lb3V0KVxuICAgIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdmFyIHNoZWxsU2NvcGUgPSAkc2NvcGUuJHBhcmVudDtcbiAgICAgICAgc2hlbGxTY29wZS5jaGlsZCA9ICRzY29wZTtcbiAgICAgICAgdm0uZXhwb3J0UERGID0gQ2hhcnRQREZFeHBvcnQuZXhwb3J0O1xuXG4gICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuaXNBY3RpdmUgPSBmdW5jdGlvbih2aWV3TG9jYXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB2aWV3TG9jYXRpb24gPT09ICRsb2NhdGlvbi5wYXRoKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gVG9kbzogVXNlIHRoaXMgdG8gc29ydCBieSBwZXJmb3JtYW5jZSAoTWFsaXNhKVxuICAgICAgICB2bS5Tb3J0QnlLZXkgPSBmdW5jdGlvbihhcnJheSwga2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXkuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgdmFyIHggPSBhW2tleV07IHZhciB5ID0gYltrZXldO1xuICAgICAgICAgICAgICAgIHJldHVybiAoKHggPCB5KSA/IC0xIDogKCh4ID4geSkgPyAxIDogMCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uZ2V0U3RvY2tCeURpc3RyaWN0ID0gZnVuY3Rpb24oc3RhcnRNb250aCwgZW5kTW9udGgsIGRpc3RyaWN0LCB2YWNjaW5lKSB7XG5cbiAgICAgICAgICAgIHZtLnN0YXJ0TW9udGggPyB2bS5zdGFydE1vbnRoIDogXCJcIjtcbiAgICAgICAgICAgIHZtLmVuZE1vbnRoID0gdm0uZW5kTW9udGggPyB2bS5lbmRNb250aCA6IFwiXCI7XG4gICAgICAgICAgICAvL1RvZG86IFRlbXBvcmFyaWx5IGRpc2FibGUgZmlsdGVyaW5nIGJ5IGRpc3RyaWN0IGZvciB0aGUgdGFibGVcbiAgICAgICAgICAgIGRpc3RyaWN0ID0gXCJcIlxuICAgICAgICAgICAgdm0uZGlzdHJpY3QgPSBcIlwiO1xuICAgICAgICAgICAgdm0udmFjY2luZSA9IHZtLnNlbGVjdGVkVmFjY2luZSA/IHZtLnNlbGVjdGVkVmFjY2luZS5uYW1lIDogXCJcIjtcblxuICAgICAgICAgICAgU3RvY2tTZXJ2aWNlLmdldFN0b2NrQnlEaXN0cmljdChzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZWRhdGFfc28gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlZGF0YV9ibSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGVkYXRhX3dyID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZWRhdGFfYW0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlZGF0YV9zZWFyY2ggPVtdO1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhX3NvID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuYXRfaGFuZCA9PSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhX2FtID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuYXRfaGFuZCA+IHZhbHVlLnN0b2NrX3JlcXVpcmVtZW50X19tYXhpbXVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhX3dyID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCh2YWx1ZS5hdF9oYW5kID4gdmFsdWUuc3RvY2tfcmVxdWlyZW1lbnRfX21pbmltdW0pICYmICh2YWx1ZS5hdF9oYW5kIDwgdmFsdWUuc3RvY2tfcmVxdWlyZW1lbnRfX21heGltdW0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YV9ibSA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgodmFsdWUuYXRfaGFuZCA8IHZhbHVlLnN0b2NrX3JlcXVpcmVtZW50X19taW5pbXVtKSAmJiAodmFsdWUuYXRfaGFuZCA+IDApKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFfc2VhcmNoID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFBbGxkaXN0cmljdHMgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zQWxsZGlzdHJpY3RzID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFBbGxkaXN0cmljdHMsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0b3RhbHNcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vdGhpbmcgPSAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgd2l0aGluID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJlbG93bWluaW11bSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhYm92ZW1heGltdW0gPSAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdHVzID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodm0uZGF0YVtpXS5hdF9oYW5kID09IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90aGluZysrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cz1cIlN0b2NrZWQgT3V0XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgodm0uZGF0YVtpXS5hdF9oYW5kID4gdm0uZGF0YVtpXS5zdG9ja19yZXF1aXJlbWVudF9fbWluaW11bSkgJiYgKHZtLmRhdGFbaV0uYXRfaGFuZCA8IHZtLmRhdGFbaV0uc3RvY2tfcmVxdWlyZW1lbnRfX21heGltdW0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGhpbisrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cz1cIldpdGhpbiBSYW5nZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoKHZtLmRhdGFbaV0uYXRfaGFuZCA8IHZtLmRhdGFbaV0uc3RvY2tfcmVxdWlyZW1lbnRfX21pbmltdW0pICYmICh2bS5kYXRhW2ldLmF0X2hhbmQgPiAwKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWxvd21pbmltdW0rKyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM9XCJCZWxvdyBNSU5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZtLmRhdGFbaV0uYXRfaGFuZCA+IHZtLmRhdGFbaV0uc3RvY2tfcmVxdWlyZW1lbnRfX21heGltdW0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWJvdmVtYXhpbXVtKyssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzPVwiQWJvdmUgTUFYXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5kYXRhW2ldLnN0YXR1cz1zdGF0dXM7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnN0b2NrZWRvdXQgPSAobm90aGluZyAvIHZtLmRhdGEubGVuZ3RoKSAqIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJhbGFuY2VNb250aCA9IG5ldyBEYXRlKE1vbnRoU2VydmljZS5tb250aFRvRGF0ZShlbmRNb250aCkpO1xuICAgICAgICAgICAgICAgICAgICBiYWxhbmNlTW9udGguc2V0TW9udGgoYmFsYW5jZU1vbnRoLmdldE1vbnRoKCkgLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC50aGVtb250aCA9IGJhbGFuY2VNb250aDtcbiAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC52YWNjaW5lID0gdmFjY2luZTtcblxuICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGUgZ3JhcGhcbiAgICAgICAgICAgICAgICAgICAgdm0ub3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3BpZUNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkLmtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkLnk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93TGFiZWxzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxUaHJlc2hvbGQ6IDAuMDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxTdW5iZWFtTGF5b3V0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAzNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobm90aGluZyA9PSB2bS5kYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ3JhcGggPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zX3NvID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFfc28sXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfYm0gPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YV9ibSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc193ciA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhX3dyLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zX2FtID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFfYW0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zX3NlYXJjaCA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhX3NlYXJjaCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5ncmFwaCA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJTdG9ja2VkIE91dFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiAobm90aGluZyAvIHZtLmRhdGEubGVuZ3RoKSAqIDEwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6JyNGRjAwMDAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJXaXRoaW4gUmFuZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogKHdpdGhpbiAvIHZtLmRhdGEubGVuZ3RoKSAqIDEwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6JyMwMDgwMDAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbG9yOicjRkZGRjAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiQmVsb3cgTUlOXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IChiZWxvd21pbmltdW0gLyB2bS5kYXRhLmxlbmd0aCkgKiAxMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjRkZBNTAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiQWJvdmUgTUFYXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IChhYm92ZW1heGltdW0gLyB2bS5kYXRhLmxlbmd0aCkgKiAxMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjOTBFRTkwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb2xvcjonIzAwODAwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmdldFN0b2NrQnlEaXN0cmljdFZhY2NpbmUgPSBmdW5jdGlvbihzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcblxuICAgICAgICAgICAgdm0uc3RhcnRNb250aCA/IHZtLnN0YXJ0TW9udGggOiBcIk5vdiAyMDE1XCI7XG4gICAgICAgICAgICB2bS5lbmRNb250aCA9IHZtLmVuZE1vbnRoID8gdm0uZW5kTW9udGggOiBcIkRlYyAyMDE2XCI7XG4gICAgICAgICAgICAvL1RvZG86IFRlbXBvcmFyaWx5IGRpc2FibGUgZmlsdGVyaW5nIGJ5IGRpc3RyaWN0IGZvciB0aGUgdGFibGVcbiAgICAgICAgICAgIC8vZGlzdHJpY3QgPSBcIlwiXG4gICAgICAgICAgICB2bS5kaXN0cmljdCA9IGRpc3RyaWN0O1xuICAgICAgICAgICAgdm0udmFjY2luZSA9IHZhY2NpbmU7IC8vdm0uc2VsZWN0ZWRWYWNjaW5lID8gdm0uc2VsZWN0ZWRWYWNjaW5lLm5hbWUgOiBcIlwiO1xuXG4gICAgICAgICAgICBTdG9ja1NlcnZpY2UuZ2V0U3RvY2tCeURpc3RyaWN0VmFjY2luZShzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcbiAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtcyA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgY291bnQ6IDE1XG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdm0uZGF0YSxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0b3RhbHNcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmRpc3RyaWN0ID0gdm0uZGlzdHJpY3Q7XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC52YWNjaW5lID0gdm0udmFjY2luZTtcblxuXG4gICAgICAgICAgICAgICAgLy8gY29uc3RydWN0IERpc3RyaWJ1dGlvbiBncmFwaCBkYXRhXG4gICAgICAgICAgICAgICAgdmFyIGdyYXBoZGF0YURpc3RyaWJ1dGlvbiA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBzZXJpZXNEaXN0cmlidXRpb24gPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgc2VyaWVzT3JkZXJzID0gW107XG4gICAgICAgICAgICAgICAgdmFyIG1pbl9zZXJpZXNEaXN0cmlidXRpb24gPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgbWF4X3Nlcmllc0Rpc3RyaWJ1dGlvbiA9IFtdO1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQucmVmcmVzaHJhdGUgPSAwO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5kYXRhLmxlbmd0aCA7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBzZXJpZXNEaXN0cmlidXRpb24ucHVzaChbdm0uZGF0YVtpXS5tb250aCwgcGFyc2VJbnQodm0uZGF0YVtpXS5yZWNlaXZlZCldKVxuICAgICAgICAgICAgICAgICAgICBzZXJpZXNPcmRlcnMucHVzaChbdm0uZGF0YVtpXS5tb250aCwgdm0uZGF0YVtpXS5vcmRlcmVkXSlcbiAgICAgICAgICAgICAgICAgICAgbWluX3Nlcmllc0Rpc3RyaWJ1dGlvbi5wdXNoKFt2bS5kYXRhW2ldLm1vbnRoLCB2bS5kYXRhW2ldLnN0b2NrX3JlcXVpcmVtZW50X19taW5pbXVtXSlcbiAgICAgICAgICAgICAgICAgICAgbWF4X3Nlcmllc0Rpc3RyaWJ1dGlvbi5wdXNoKFt2bS5kYXRhW2ldLm1vbnRoLCB2bS5kYXRhW2ldLnN0b2NrX3JlcXVpcmVtZW50X19tYXhpbXVtXSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZtLmRhdGFbaV0ubW9udGggPT0gTW9udGhTZXJ2aWNlLmdldE1vbnRoTnVtYmVyKGVuZE1vbnRoLnNwbGl0KFwiIFwiKVswXSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5yZWZyZXNocmF0ZSA9IHZtLmRhdGFbaV0ub3JkZXJlZCA9PSAwID8gMCA6dm0uZGF0YVtpXS5yZWNlaXZlZC92bS5kYXRhW2ldLm9yZGVyZWQqMTAwIDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBncmFwaGRhdGFEaXN0cmlidXRpb24ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiTWluXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IG1pbl9zZXJpZXNEaXN0cmlidXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjonI0E1RTgxNidcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBncmFwaGRhdGFEaXN0cmlidXRpb24ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiSXNzdWVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IHNlcmllc0Rpc3RyaWJ1dGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjMUY3N0I0J1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGdyYXBoZGF0YURpc3RyaWJ1dGlvbi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJPcmRlcmVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IHNlcmllc09yZGVycyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOidyZWQnXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBncmFwaGRhdGFEaXN0cmlidXRpb24ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiTWF4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IG1heF9zZXJpZXNEaXN0cmlidXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjonI0ZGN0YwRSdcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZtLmdyYXBoRGlzdHJpYnV0aW9uID0gZ3JhcGhkYXRhRGlzdHJpYnV0aW9uO1xuXG5cbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgRGlzdHJpYnV0aW9uIGdyYXBoXG4gICAgICAgICAgICAgICAgdm0ub3B0aW9uc0Rpc3RyaWJ1dGlvbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2xpbmVDaGFydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGggOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnQWJpbSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dMZWdlbmQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93Q29udHJvbHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDIwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByaWdodDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogODUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IDY1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JjZVk6IChbMCwxMDBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFnZ2VyTGFiZWxzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFswXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbihkKXsgcmV0dXJuIGRbMV07IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeEF4aXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiAnTW9udGhzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlja0Zvcm1hdDogZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gTW9udGhTZXJ2aWNlLmdldE1vbnRoTmFtZShkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsRGlzdGFuY2U6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VJbnRlcmFjdGl2ZUd1aWRlbGluZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlQ2hhbmdlOiBmdW5jdGlvbihlKXsgY29uc29sZS5sb2coXCJzdGF0ZUNoYW5nZVwiKTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VTdGF0ZTogZnVuY3Rpb24oZSl7IGNvbnNvbGUubG9nKFwiY2hhbmdlU3RhdGVcIik7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcFNob3c6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInRvb2x0aXBTaG93XCIpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXBIaWRlOiBmdW5jdGlvbihlKXsgY29uc29sZS5sb2coXCJ0b29sdGlwSGlkZVwiKTsgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZUZvcm1hdDogZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWNrRm9ybWF0KGQzLmZvcm1hdCgnLC4xZicpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25EdXJhdGlvbjogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvLyBjb25zdHJ1Y3QgVXB0YWtlIGdyYXBoIGRhdGFcblxuXG4gICAgICAgICAgICAgICAgLy8gY29uc3RydWN0IENvbnN1bXB0aW9uIGdyYXBoIGRhdGFcbiAgICAgICAgICAgICAgICB2YXIgZ3JhcGhkYXRhQ29uc3VtcHRpb24gPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgc2VyaWVzQ29uc3VtcHRpb24gPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0X3Nlcmllc0NvbnN1bXB0aW9uID0gW107XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5jb3ZlcmFnZSA9IDA7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmRhdGEubGVuZ3RoIDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcmllc0NvbnN1bXB0aW9uLnB1c2goW3ZtLmRhdGFbaV0ubW9udGgsIHZtLmRhdGFbaV0uY29uc3VtZWRdKVxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRfc2VyaWVzQ29uc3VtcHRpb24ucHVzaChbdm0uZGF0YVtpXS5tb250aCwgdm0uZGF0YVtpXS5zdG9ja19yZXF1aXJlbWVudF9fdGFyZ2V0XSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZtLmRhdGFbaV0ubW9udGggPT0gTW9udGhTZXJ2aWNlLmdldE1vbnRoTnVtYmVyKGVuZE1vbnRoLnNwbGl0KFwiIFwiKVswXSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5jb3ZlcmFnZSA9IHZtLmRhdGFbaV0uc3RvY2tfcmVxdWlyZW1lbnRfX3RhcmdldCA9PSAwID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAwIDp2bS5kYXRhW2ldLmNvbnN1bWVkL3ZtLmRhdGFbaV0uc3RvY2tfcmVxdWlyZW1lbnRfX3RhcmdldCoxMDA7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGdyYXBoZGF0YUNvbnN1bXB0aW9uLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIkFjdHVhbCBDb25zdW1wdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBzZXJpZXNDb25zdW1wdGlvblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGdyYXBoZGF0YUNvbnN1bXB0aW9uLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIlBsYW5uZWQgY29uc3VtcHRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogdGFyZ2V0X3Nlcmllc0NvbnN1bXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjRkY3RjBFJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgICAgICB2bS5ncmFwaENvbnN1bXB0aW9uID0gZ3JhcGhkYXRhQ29uc3VtcHRpb247XG5cblxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBDb25zdW1wdGlvbiBncmFwaFxuICAgICAgICAgICAgICAgIHZtLm9wdGlvbnNDb25zdW1wdGlvbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2xpbmVDaGFydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGggOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnQWJpbSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dMZWdlbmQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93Q29udHJvbHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDIwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByaWdodDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogODUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IDY1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JjZVk6IChbMCwxMDBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFnZ2VyTGFiZWxzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFswXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbihkKXsgcmV0dXJuIGRbMV07IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeEF4aXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiAnTW9udGhzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlja0Zvcm1hdDogZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gTW9udGhTZXJ2aWNlLmdldE1vbnRoTmFtZShkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsRGlzdGFuY2U6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VJbnRlcmFjdGl2ZUd1aWRlbGluZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlQ2hhbmdlOiBmdW5jdGlvbihlKXsgY29uc29sZS5sb2coXCJzdGF0ZUNoYW5nZVwiKTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VTdGF0ZTogZnVuY3Rpb24oZSl7IGNvbnNvbGUubG9nKFwiY2hhbmdlU3RhdGVcIik7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcFNob3c6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInRvb2x0aXBTaG93XCIpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXBIaWRlOiBmdW5jdGlvbihlKXsgY29uc29sZS5sb2coXCJ0b29sdGlwSGlkZVwiKTsgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZUZvcm1hdDogZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWNrRm9ybWF0KGQzLmZvcm1hdCgnLC4xZicpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25EdXJhdGlvbjogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuJG9uKCdyZWZyZXNoJywgZnVuY3Rpb24oZSwgc3RhcnRNb250aCwgZW5kTW9udGgsIGRpc3RyaWN0LCB2YWNjaW5lKSB7XG4gICAgICAgICAgICBpZihzdGFydE1vbnRoLm5hbWUgJiYgZW5kTW9udGgubmFtZSAmJiBkaXN0cmljdC5uYW1lICYmIHZhY2NpbmUubmFtZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2bS5nZXRTdG9ja0J5RGlzdHJpY3Qoc3RhcnRNb250aC5uYW1lLCBlbmRNb250aC5uYW1lLCBkaXN0cmljdC5uYW1lLCB2YWNjaW5lLm5hbWUpO1xuICAgICAgICAgICAgICAgIHZtLmdldFN0b2NrQnlEaXN0cmljdFZhY2NpbmUoc3RhcnRNb250aC5uYW1lLCBlbmRNb250aC5uYW1lLCBkaXN0cmljdC5uYW1lLCB2YWNjaW5lLm5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH1cblxuXSk7XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJykuY29udHJvbGxlcignU3RvY2tVcHRha2VDb250cm9sbGVyJywgU3RvY2tVcHRha2VDb250cm9sbGVyKTtcblxuU3RvY2tVcHRha2VDb250cm9sbGVyLiRpbmplY3QgPSBbXG4gICAgJyRzY29wZScsXG4gICAgJ1N0b2NrU2VydmljZScsXG4gICAgJ01vbnRoU2VydmljZScsXG4gICAgJ0NoYXJ0U3VwcG9ydFNlcnZpY2UnLFxuICAgICdDaGFydFBERkV4cG9ydCcsXG4gICAgJyR0aW1lb3V0J1xuXTtcbmZ1bmN0aW9uIFN0b2NrVXB0YWtlQ29udHJvbGxlcigkc2NvcGUsIFN0b2NrU2VydmljZSwgTW9udGhTZXJ2aWNlLCBDaGFydFN1cHBvcnRTZXJ2aWNlLCBDaGFydFBERkV4cG9ydCwgJHRpbWVvdXQpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZhciBzaGVsbFNjb3BlID0gJHNjb3BlLiRwYXJlbnQ7XG4gICAgc2hlbGxTY29wZS5jaGlsZCA9ICRzY29wZTtcblxuICAgIHNoZWxsU2NvcGUuY2hpbGQudXB0YWtlID0gMDtcbiAgICB2bS5leHBvcnRQREYgPSBmdW5jdGlvbihuYW1lKSB7IENoYXJ0UERGRXhwb3J0LmV4cG9ydFdpdGhTdHlsZXIodm0sIG5hbWUpOyB9O1xuXG4gICAgdm0ub3B0aW9uc1VwdGFrZSA9IGdldE9wdGlvbnMoKTtcbiAgICB2bS5wZXJpb2RJbmRleGVzID0gW107XG5cbiAgICAkc2NvcGUuJG9uKCdyZWZyZXNoJywgdXBkYXRlQ2hhcnQpO1xuICAgIGZ1bmN0aW9uIHVwZGF0ZUNoYXJ0KGUsIHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSkge1xuICAgICAgICBTdG9ja1NlcnZpY2UuZ2V0U3RvY2tCeURpc3RyaWN0VmFjY2luZShzdGFydE1vbnRoLm5hbWUsIGVuZE1vbnRoLm5hbWUsIGRpc3RyaWN0Lm5hbWUsIHZhY2NpbmUubmFtZSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcblxuICAgICAgICAgICAgdmFyIGdyYXBoZGF0YVVwdGFrZSA9IFtdO1xuICAgICAgICAgICAgdmFyIHNlcmllc1VwdGFrZSA9IFtdO1xuICAgICAgICAgICAgdmFyIHN0b2NrRGF0YSA9IFtdO1xuICAgICAgICAgICAgdmFyIGltbXVuaXNhdGlvbkRhdGEgPSBbXTtcbiAgICAgICAgICAgIHZhciBtb250aGx5VGFyZ2V0RGF0YSA9IFtdO1xuICAgICAgICAgICAgdmFyIGZvcmNlU3RhcnRaZXJvRGF0YSA9IFtdO1xuICAgICAgICAgICAgdmFyIG1heE1vbnRobHlUYXJnZXQgPSAwO1xuICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC51cHRha2UgPSBcIjBcIjtcblxuICAgICAgICAgICAgdm0ucGVyaW9kSW5kZXhlcyA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmRhdGEubGVuZ3RoIDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB2bS5kYXRhW2ldO1xuICAgICAgICAgICAgICAgIC8qIENlcnRhaW4gZGF0YSBoYWQgaW52YWxpZCBwZXJpb2RzIGxpa2UgMjAxNzIgaW5zdGVhZCBvZlxuICAgICAgICAgICAgICAgICAgICAyMDE3MDIgd2hpY2ggd2VyZSBjYXVzaW5nIGVycm9ycy4gSGVuY2UgdGhlIGZpbHRlciBiZWxvdy4gKi9cbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5wZXJpb2QudG9TdHJpbmcoKS5sZW5ndGggPT0gNSkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtb250aEluZGV4LCBpdGVtKTtcbiAgICAgICAgICAgICAgICAvL3ZhciBtb250aEluZGV4ID0gYXBwSGVscGVycy5nZXRNb250aEluZGV4RnJvbVBlcmlvZChpdGVtLnBlcmlvZCwgJ0NZJyk7XG4gICAgICAgICAgICAgICAgdmFyIHBlcmlvZEluZGV4ID0gZ2V0UGVyaW9kSW5kZXgoaXRlbS5wZXJpb2QpXG4gICAgICAgICAgICAgICAgdmFyIGF0SGFuZCA9IGl0ZW0uYXRfaGFuZCA9PSB1bmRlZmluZWQgPyBpdGVtLnRvdGFsX2F0X2hhbmQgOiBpdGVtLmF0X2hhbmQ7XG4gICAgICAgICAgICAgICAgdmFyIHJlY2VpdmVkID0gaXRlbS5yZWNlaXZlZCA9PSB1bmRlZmluZWQgPyBpdGVtLnRvdGFsX3JlY2VpdmVkIDogaXRlbS5yZWNlaXZlZDtcbiAgICAgICAgICAgICAgICB2YXIgY29uc3VtZWQgPSBpdGVtLmNvbnN1bWVkID09IHVuZGVmaW5lZCA/IGl0ZW0udG90YWxfY29uc3VtZWQgOiBpdGVtLmNvbnN1bWVkO1xuICAgICAgICAgICAgICAgIHZhciBtb250aGx5VGFyZ2V0ID0gaXRlbS5zdG9ja19yZXF1aXJlbWVudF9fdGFyZ2V0ID09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICA/IGl0ZW0udG90YWxfdGFyZ2V0IDogaXRlbS5zdG9ja19yZXF1aXJlbWVudF9fdGFyZ2V0O1xuICAgICAgICAgICAgICAgIHZhciB0b3RhbFN0b2NrID0gYXRIYW5kICsgcmVjZWl2ZWQ7XG5cbiAgICAgICAgICAgICAgICBtYXhNb250aGx5VGFyZ2V0ID0gTWF0aC5tYXgobWF4TW9udGhseVRhcmdldCwgTnVtYmVyKG1vbnRobHlUYXJnZXQudG9GaXhlZCgwKSkpO1xuICAgICAgICAgICAgICAgIHN0b2NrRGF0YS5wdXNoKHt4OiBwZXJpb2RJbmRleCwgeTogTnVtYmVyKHRvdGFsU3RvY2sudG9GaXhlZCgwKSl9KTtcbiAgICAgICAgICAgICAgICBpbW11bmlzYXRpb25EYXRhLnB1c2goe3g6IHBlcmlvZEluZGV4LCB5OiBOdW1iZXIoY29uc3VtZWQudG9GaXhlZCgwKSl9KTtcbiAgICAgICAgICAgICAgICBtb250aGx5VGFyZ2V0RGF0YS5wdXNoKHt4OiBwZXJpb2RJbmRleCwgeTogTnVtYmVyKG1vbnRobHlUYXJnZXQudG9GaXhlZCgwKSl9KTtcbiAgICAgICAgICAgICAgICBmb3JjZVN0YXJ0WmVyb0RhdGEucHVzaCh7eDogcGVyaW9kSW5kZXgsIHk6IDB9KTtcblxuICAgICAgICAgICAgICAgIGlmICh2bS5kYXRhW2ldLm1vbnRoID09IE1vbnRoU2VydmljZS5nZXRNb250aE51bWJlcihlbmRNb250aC5uYW1lLnNwbGl0KFwiIFwiKVswXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC51cHRha2UgPSByZWNlaXZlZCA9PSAwICYmIGF0SGFuZCA9PSAwID9cbiAgICAgICAgICAgICAgICAgICAgICAgIDAgOiBNYXRoLnJvdW5kKGNvbnN1bWVkLyh0b3RhbFN0b2NrKSoxMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZ3JhcGhkYXRhVXB0YWtlLnB1c2goe2tleTogJ0F2YWlsYWJsZSBTdG9jayAoU3RvY2sgYmFsYW5jZSArIElzc3VlcyknLCB0eXBlOiAnYmFyJywgeUF4aXM6IDEsIHZhbHVlczogc3RvY2tEYXRhfSk7XG4gICAgICAgICAgICBncmFwaGRhdGFVcHRha2UucHVzaCh7a2V5OiAnQ2hpbGRyZW4gSW1tdW5pc2VkJywgdHlwZTogJ2JhcicsIHlBeGlzOiAxLCB2YWx1ZXM6IGltbXVuaXNhdGlvbkRhdGF9KTtcbiAgICAgICAgICAgIGdyYXBoZGF0YVVwdGFrZS5wdXNoKHtrZXk6ICdNb250aGx5IFRhcmdldHMnLCB0eXBlOiAnbGluZScsIHlBeGlzOiAxLCB2YWx1ZXM6IG1vbnRobHlUYXJnZXREYXRhfSk7XG4gICAgICAgICAgICBncmFwaGRhdGFVcHRha2UucHVzaCh7a2V5OiAnJywgdHlwZTogJ2xpbmUnLCB5QXhpczogMSwgc3Ryb2tlV2lkdGg6IDAsIHZhbHVlczogZm9yY2VTdGFydFplcm9EYXRhfSk7XG4gICAgICAgICAgICB2bS5ncmFwaFVwdGFrZSA9IGdyYXBoZGF0YVVwdGFrZTtcbiAgICAgICAgICAgIHZtLm1heE1vbnRobHlUYXJnZXQgPSBtYXhNb250aGx5VGFyZ2V0O1xuXG4gICAgICAgICAgICB1cGRhdGVMYWJlbHMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0T3B0aW9ucygpIHtcbiAgICAgICAgdmFyIHVwdGFrZU9wdGlvbnMgPSBDaGFydFN1cHBvcnRTZXJ2aWNlLmdldE9wdGlvbnMoJ211bHRpQ2hhcnQnKTtcbiAgICAgICAgdXB0YWtlT3B0aW9ucy5jaGFydC5jb2xvciA9IFtcImdyZWVuXCIsIFwiRG9kZ2VyQmx1ZVwiLCBcInJlZFwiLCBcIndoaXRlXCJdO1xuICAgICAgICB1cHRha2VPcHRpb25zLmNoYXJ0LndpZHRoID0gOTAwO1xuICAgICAgICB1cHRha2VPcHRpb25zLmNoYXJ0Lm1hcmdpbiA9IHtsZWZ0OiA3MCwgdG9wOiA5MH07XG4gICAgICAgIHVwdGFrZU9wdGlvbnMuY2hhcnQubGVnZW5kLndpZHRoID0gOTAwO1xuICAgICAgICB1cHRha2VPcHRpb25zLmNoYXJ0LmxlZ2VuZC5tYXhLZXlMZW5ndGggPSA1MDtcbiAgICAgICAgdXB0YWtlT3B0aW9ucy5jaGFydC54QXhpcy5heGlzTGFiZWwgPSBcIk1vbnRoc1wiO1xuICAgICAgICB1cHRha2VPcHRpb25zLmNoYXJ0LnlBeGlzLmF4aXNMYWJlbCA9IFwiXCI7XG4gICAgICAgIHVwdGFrZU9wdGlvbnMuY2hhcnQueEF4aXMudGlja0Zvcm1hdCA9IGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgcmV0dXJuIGFwcEhlbHBlcnMuZ2VuZXJhdGVMYWJlbEZyb21QZXJpb2Qodm0ucGVyaW9kSW5kZXhlc1tkXSwgJ0NZJyk7XG4gICAgICAgIH07XG4gICAgICAgIHVwdGFrZU9wdGlvbnMuY2hhcnQudmFsdWVGb3JtYXQgPSBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgIHJldHVybiB0aWNrRm9ybWF0KGQzLmZvcm1hdCgnLjBmJykpO1xuICAgICAgICB9O1xuICAgICAgICB1cHRha2VPcHRpb25zLmNoYXJ0LmxlZ2VuZC5kaXNwYXRjaC5zdGF0ZUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdXBkYXRlTGFiZWxzKCk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB1cHRha2VPcHRpb25zO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUxhYmVscygpIHtcbiAgICAgICAgQ2hhcnRTdXBwb3J0U2VydmljZS5jbGVhckxhYmVscygpO1xuICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIENoYXJ0U3VwcG9ydFNlcnZpY2UuaW5pdExhYmVscygpO1xuICAgICAgICAgICAgLyogY2hhcnQuY2xpcEVkZ2Ugc2VlbXMgbm90IHRvIGJlIHdvcmtpbmcsXG4gICAgICAgICAgICB0aGlzIHNob3VsZCBzZXJ2ZSBhcyBhIGhhY2sgKi9cbiAgICAgICAgICAgIGQzLnNlbGVjdEFsbChcIi5udi1tdWx0aWJhciBnXCIpLmF0dHIoXCJjbGlwLXBhdGhcIiwgXCJcIik7XG4gICAgICAgIH0sIDEwMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFBlcmlvZEluZGV4KHBlcmlvZCkge1xuICAgICAgICBpZiAodm0ucGVyaW9kSW5kZXhlcy5pbmRleE9mKHBlcmlvZCkgPT0gLTEpIHZtLnBlcmlvZEluZGV4ZXMucHVzaChwZXJpb2QpO1xuICAgICAgICByZXR1cm4gdm0ucGVyaW9kSW5kZXhlcy5pbmRleE9mKHBlcmlvZCk7XG4gICAgfVxufVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpLmNvbnRyb2xsZXIoJ1N0b2Nrb3V0VHJlbmRDb250cm9sbGVyJywgU3RvY2tvdXRUcmVuZENvbnRyb2xsZXIpO1xuXG5TdG9ja291dFRyZW5kQ29udHJvbGxlci4kaW5qZWN0ID0gW1xuICAgICckc2NvcGUnLFxuICAgICdTdG9ja1NlcnZpY2UnLFxuICAgICdNb250aFNlcnZpY2UnLFxuICAgICdDaGFydFN1cHBvcnRTZXJ2aWNlJyxcbiAgICAnQ2hhcnRQREZFeHBvcnQnLFxuICAgICckdGltZW91dCdcbl07XG5mdW5jdGlvbiBTdG9ja291dFRyZW5kQ29udHJvbGxlcigkc2NvcGUsIFN0b2NrU2VydmljZSwgTW9udGhTZXJ2aWNlLCBDaGFydFN1cHBvcnRTZXJ2aWNlLCBDaGFydFBERkV4cG9ydCwgJHRpbWVvdXQpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmV4cG9ydFBERiA9IGZ1bmN0aW9uKG5hbWUpIHsgQ2hhcnRQREZFeHBvcnQuZXhwb3J0V2l0aFN0eWxlcih2bSwgbmFtZSk7IH07XG4gICAgdm0uZ3JhcGhPcHRpb25zID0gZ2V0T3B0aW9ucygpO1xuICAgIHZtLmdyYXBoRGF0YSA9IFtdO1xuICAgIHZtLnBlcmlvZEluZGV4ZXMgPSBbXTtcblxuICAgICRzY29wZS4kb24oJ3JlZnJlc2gnLCB1cGRhdGVDaGFydCk7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVDaGFydChlLCBzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgU3RvY2tTZXJ2aWNlLmdldFN0b2NrQnlEaXN0cmljdFZhY2NpbmUoc3RhcnRNb250aC5uYW1lLCBlbmRNb250aC5uYW1lLCBkaXN0cmljdC5uYW1lLCB2YWNjaW5lLm5hbWUpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG5cbiAgICAgICAgICAgIHZhciBncmFwaERhdGEgPSBbXTtcbiAgICAgICAgICAgIHZhciBzdG9ja0RhdGEgPSBbXTtcbiAgICAgICAgICAgIHZhciBzdXBwbHlEYXRhID0gW107XG5cbiAgICAgICAgICAgIHZtLnBlcmlvZEluZGV4ZXMgPSBbXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5kYXRhLmxlbmd0aCA7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gdm0uZGF0YVtpXTtcbiAgICAgICAgICAgICAgICAvKiBDZXJ0YWluIGRhdGEgaGFkIGludmFsaWQgcGVyaW9kcyBsaWtlIDIwMTcyIGluc3RlYWQgb2ZcbiAgICAgICAgICAgICAgICAgICAgMjAxNzAyIHdoaWNoIHdlcmUgY2F1c2luZyBlcnJvcnMuIEhlbmNlIHRoZSBmaWx0ZXIgYmVsb3cuICovXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0ucGVyaW9kLnRvU3RyaW5nKCkubGVuZ3RoID09IDUpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgLy92YXIgbW9udGhJbmRleCA9IGFwcEhlbHBlcnMuZ2V0TW9udGhJbmRleEZyb21QZXJpb2QoaXRlbS5wZXJpb2QsICdDWScpO1xuICAgICAgICAgICAgICAgIHZhciBwZXJpb2RJbmRleCA9IGdldFBlcmlvZEluZGV4KGl0ZW0ucGVyaW9kKVxuICAgICAgICAgICAgICAgIHZhciBhdEhhbmQgPSBpdGVtLmF0X2hhbmQgPT0gdW5kZWZpbmVkID8gaXRlbS50b3RhbF9hdF9oYW5kIDogaXRlbS5hdF9oYW5kO1xuICAgICAgICAgICAgICAgIHZhciByZWNlaXZlZCA9IGl0ZW0ucmVjZWl2ZWQgPT0gdW5kZWZpbmVkID8gaXRlbS50b3RhbF9yZWNlaXZlZCA6IGl0ZW0ucmVjZWl2ZWQ7XG5cbiAgICAgICAgICAgICAgICBzdG9ja0RhdGEucHVzaCh7eDogcGVyaW9kSW5kZXgsIHk6IE51bWJlcihhdEhhbmQudG9GaXhlZCgwKSl9KTtcbiAgICAgICAgICAgICAgICBzdXBwbHlEYXRhLnB1c2goe3g6IHBlcmlvZEluZGV4LCB5OiBOdW1iZXIocmVjZWl2ZWQudG9GaXhlZCgwKSl9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZ3JhcGhEYXRhLnB1c2goe2tleTogJ1N0b2NrIEJhbGFuY2UnLCB2YWx1ZXM6IHN0b2NrRGF0YX0pO1xuICAgICAgICAgICAgZ3JhcGhEYXRhLnB1c2goe2tleTogJ1N1cHBseSBCeSBOTVMnLCB2YWx1ZXM6IHN1cHBseURhdGF9KTtcbiAgICAgICAgICAgIHZtLmdyYXBoRGF0YSA9IGdyYXBoRGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0T3B0aW9ucygpIHtcbiAgICAgICAgdmFyIGNoYXJ0T3B0aW9ucyA9IENoYXJ0U3VwcG9ydFNlcnZpY2UuZ2V0T3B0aW9ucygnbXVsdGlCYXJDaGFydCcpO1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQuY29sb3IgPSBbXCJncmVlblwiLCBcIkRvZGdlckJsdWVcIl07XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC53aWR0aCA9IDkwMDtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0Lm1hcmdpbiA9IHtsZWZ0OiA3MCwgdG9wOiA3MH07XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC5sZWdlbmQud2lkdGggPSA5MDA7XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC54QXhpcy5heGlzTGFiZWwgPSBcIk1vbnRoc1wiO1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQueUF4aXMuYXhpc0xhYmVsID0gXCJcIjtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LnhBeGlzLnRpY2tGb3JtYXQgPSBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgIHJldHVybiBhcHBIZWxwZXJzLmdlbmVyYXRlTGFiZWxGcm9tUGVyaW9kKHZtLnBlcmlvZEluZGV4ZXNbZF0sICdDWScpO1xuICAgICAgICAgICAgLy9yZXR1cm4gYXBwSGVscGVycy5nZXRNb250aEZyb21OdW1iZXIoZCwgJ0NZJyk7XG4gICAgICAgIH07XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC52YWx1ZUZvcm1hdCA9IGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgcmV0dXJuIHRpY2tGb3JtYXQoZDMuZm9ybWF0KCcuMGYnKSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBjaGFydE9wdGlvbnM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UGVyaW9kSW5kZXgocGVyaW9kKSB7XG4gICAgICAgIGlmICh2bS5wZXJpb2RJbmRleGVzLmluZGV4T2YocGVyaW9kKSA9PSAtMSkgdm0ucGVyaW9kSW5kZXhlcy5wdXNoKHBlcmlvZCk7XG4gICAgICAgIHJldHVybiB2bS5wZXJpb2RJbmRleGVzLmluZGV4T2YocGVyaW9kKTtcbiAgICB9XG5cbn1cbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKVxuLmNvbnRyb2xsZXIoJ1VuZXBpQ29udHJvbGxlcicsIFtcbiAgICAnJHNjb3BlJywgJ0NvdmVyYWdlU2VydmljZScsJ1N0b2NrU2VydmljZScsXG4gICAgJ01vbnRoU2VydmljZScsICckcm9vdFNjb3BlJywgJ05nVGFibGVQYXJhbXMnLFxuICAgICdGaWx0ZXJTZXJ2aWNlJywgJ0ZyaWRnZVNlcnZpY2UnLCAnQ292ZXJhZ2VDYWxjdWxhdG9yJywgJyR0aW1lb3V0JyxcbiAgICBmdW5jdGlvbigkc2NvcGUsIENvdmVyYWdlU2VydmljZSwgU3RvY2tTZXJ2aWNlLFxuICAgICAgICBNb250aFNlcnZpY2UsICRyb290U2NvcGUsIE5nVGFibGVQYXJhbXMsXG4gICAgICAgIEZpbHRlclNlcnZpY2UsIEZyaWRnZVNlcnZpY2UsIENvdmVyYWdlQ2FsY3VsYXRvciwgJHRpbWVvdXQpXG4gICAge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2YXIgc2hlbGxTY29wZSA9ICRzY29wZS4kcGFyZW50O1xuICAgICAgICBzaGVsbFNjb3BlLmNoaWxkID0gJHNjb3BlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHBlcmlvZERpc3BsYXkocGVyaW9kKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgbW9udGggPSBwYXJzZUludChwZXJpb2Quc2xpY2UoNCw2KSk7XG4gICAgICAgICAgICByZXR1cm4gTW9udGhTZXJ2aWNlLmdldE1vbnRoTmFtZShtb250aCkgKyBcIiBcIiArIHBlcmlvZC5zbGljZSgwLDQpXG4gICAgICAgIH1cblxuICAgICAgICB2bS5nZXRVbmVwaUNvdmVyYWdlID0gZnVuY3Rpb24ocGVyaW9kLCBkaXN0cmljdCwgdmFjY2luZSkge1xuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHtwZXJpb2QsIGRpc3RyaWN0fTtcblxuICAgICAgICAgICAgdmFyIGdldFZhbHVlU3VtID0gZnVuY3Rpb24oZGF0YSwgbmFtZSwgdmFjY2luZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhLnJlZHVjZShmdW5jdGlvbihhY2N1bXVsYXRvciwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLnZhY2NpbmVfX25hbWUgPT0gdmFjY2luZSkgcmV0dXJuIGFjY3VtdWxhdG9yICsgdmFsdWVbbmFtZV1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICAgICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgQ292ZXJhZ2VTZXJ2aWNlLmdldFZhY2NpbmVEb3Nlc0J5UGVyaW9kKHBhcmFtcykudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRhYmxlRGF0YSA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBwZW50YUNSID0gMCxcbiAgICAgICAgICAgICAgICAgICAgcGN2Q1IgPSAwO1xuXG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5kaXN0cmljdCA9IGRpc3RyaWN0O1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuR2FwID0gMDtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmRyb3BvdXRfUGVudGEgPSAwO1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZHJvcG91dF9ocHYgPSAwO1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuY2F0ZWdvcnkgPSAwO1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQucGVyaW9kTW9udGggPSBwZXJpb2REaXNwbGF5KHBlcmlvZCk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFQZXJpb2QgPSBkYXRhW2ldLnBlcmlvZFxuICAgICAgICAgICAgICAgICAgICB2YXIgbGFzdERvc2UgPSBkYXRhW2ldLnRvdGFsX2xhc3RfZG9zZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZpcnN0RG9zZSA9IGRhdGFbaV0udG90YWxfZmlyc3RfZG9zZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlY29uZERvc2UgPSBkYXRhW2ldLnRvdGFsX3NlY29uZF9kb3NlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGxhbm5lZCA9IGRhdGFbaV0udG90YWxfcGxhbm5lZDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhY2NpbmUgPSBkYXRhW2ldLnZhY2NpbmVfX25hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFQZXJpb2QgIT0gcGVyaW9kKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBTdW0gdXAgdGhlIHZhbHVlcyBmcm9tIHN0YXJ0IG9mIHllYXIgdG8gc2VsZWN0ZWQgcGVyaW9kXG4gICAgICAgICAgICAgICAgICAgICB0byBjYWxjdWxhdGUgQW5udWFsaXplZCBDb3ZlcmFnZSAoYXZvYykgKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvdGFsTGFzdERvc2UgPSBnZXRWYWx1ZVN1bShkYXRhLCAndG90YWxfbGFzdF9kb3NlJywgdmFjY2luZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0b3RhbFBsYW5uZWQgPSBnZXRWYWx1ZVN1bShkYXRhLCAndG90YWxfcGxhbm5lZCcsIHZhY2NpbmUpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb3ZlcmFnZVJhdGUgPSBDb3ZlcmFnZUNhbGN1bGF0b3IuY2FsY3VsYXRlQ292ZXJhZ2VSYXRlKGxhc3REb3NlLCBwbGFubmVkKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRyb3BvdXRSYXRlID0gQ292ZXJhZ2VDYWxjdWxhdG9yLmNhbGN1bGF0ZURyb3BvdXRSYXRlKGZpcnN0RG9zZSwgbGFzdERvc2UpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVkQ2F0ZWdvcnkgPSBDb3ZlcmFnZUNhbGN1bGF0b3IuY2FsY3VsYXRlUmVkQ2F0ZWdvcnkoZmlyc3REb3NlLCBsYXN0RG9zZSwgcGxhbm5lZCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdm9jID0gQ292ZXJhZ2VDYWxjdWxhdG9yLmNhbGN1bGF0ZUNvdmVyYWdlUmF0ZSh0b3RhbExhc3REb3NlLCB0b3RhbFBsYW5uZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlRGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd2YWNjaW5lJzogdmFjY2luZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdwbGFubmVkX2NvbnN1bXB0aW9uJzogcGxhbm5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb3ZlcmFnZV9yYXRlJzogY292ZXJhZ2VSYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2F2b2MnOiBhdm9jXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodmFjY2luZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlBFTlRBXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVudGFDUiA9IGNvdmVyYWdlUmF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmRyb3BvdXRfUGVudGEgPSBkcm9wb3V0UmF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmNhdGVnb3J5ID0gcmVkQ2F0ZWdvcnk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiUENWXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGN2Q1IgPSBjb3ZlcmFnZVJhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiSFBWXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5kcm9wb3V0X2hwdiA9IGRyb3BvdXRSYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5HYXAgPSBwZW50YUNSIC0gcGN2Q1I7XG5cbiAgICAgICAgICAgICAgICB2YXIgcGFyYW1zID0ge3BhZ2U6IDEsIGNvdW50OiAxMH07XG4gICAgICAgICAgICAgICAgdmFyIHNldHRpbmdzID0ge2ZpbHRlckRlbGF5OiAwLCBjb3VudHM6IFtdLCBkYXRhOiB0YWJsZURhdGF9O1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zRG9zZXMgPSBuZXcgTmdUYWJsZVBhcmFtcyhwYXJhbXMsIHNldHRpbmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdm0uZ2V0VW5lcGlOYXRpb25hbFN0b2NrID0gZnVuY3Rpb24oZW5kTW9udGgsIGRpc3RyaWN0KSB7XG4gICAgICAgICAgICBTdG9ja1NlcnZpY2UuZ2V0VW5lcGlTdG9jayhlbmRNb250aCwgZGlzdHJpY3QpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciB0YWJsZWRhdGFBbGxzdG9jayA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBzdG9ja2VkT3V0QW50aWdlbnMgPSAwO1xuXG4gICAgICAgICAgICAgICAgLyogVHVybiB0aGUgZGlzdHJpY3QgYmFzZWQgZGF0YSBpbnRvIGFnZ3JlZ2F0ZWRcbiAgICAgICAgICAgICAgICB2YWNjaW5lIGJhc2VkIGRhdGEgKi9cbiAgICAgICAgICAgICAgICB2YXIgdmFjY2luZURhdGEgPSBkYXRhLnJlZHVjZShmdW5jdGlvbihhY2MsIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEgKGl0ZW0udmFjY2luZSBpbiBhY2MpKVxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjW2l0ZW0udmFjY2luZV0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXRfaGFuZDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9ja19yZXF1aXJlbWVudF9fbWluaW11bTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNlaXZlZDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmVkOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN1bWVkOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZV9zdG9jazogMFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBhY2NbaXRlbS52YWNjaW5lXS5hdF9oYW5kICs9IGl0ZW0uYXRfaGFuZDtcbiAgICAgICAgICAgICAgICAgICAgYWNjW2l0ZW0udmFjY2luZV0uc3RvY2tfcmVxdWlyZW1lbnRfX21pbmltdW0gKz0gaXRlbS5zdG9ja19yZXF1aXJlbWVudF9fbWluaW11bTtcbiAgICAgICAgICAgICAgICAgICAgYWNjW2l0ZW0udmFjY2luZV0ucmVjZWl2ZWQgKz0gaXRlbS5yZWNlaXZlZDtcbiAgICAgICAgICAgICAgICAgICAgYWNjW2l0ZW0udmFjY2luZV0ub3JkZXJlZCArPSBpdGVtLm9yZGVyZWQ7XG4gICAgICAgICAgICAgICAgICAgIGFjY1tpdGVtLnZhY2NpbmVdLmNvbnN1bWVkICs9IGl0ZW0uY29uc3VtZWQ7XG4gICAgICAgICAgICAgICAgICAgIGFjY1tpdGVtLnZhY2NpbmVdLmF2YWlsYWJsZV9zdG9jayArPSBpdGVtLmF2YWlsYWJsZV9zdG9jaztcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgICAgIH0sIHt9KTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIHZhY2NpbmUgaW4gdmFjY2luZURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0SGFuZCA9IHZhY2NpbmVEYXRhW3ZhY2NpbmVdLmF0X2hhbmQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtaW5TdG9jayA9IHZhY2NpbmVEYXRhW3ZhY2NpbmVdLnN0b2NrX3JlcXVpcmVtZW50X19taW5pbXVtO1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3JkZXJlZCA9IHZhY2NpbmVEYXRhW3ZhY2NpbmVdLm9yZGVyZWQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZWNlaXZlZCA9IHZhY2NpbmVEYXRhW3ZhY2NpbmVdLnJlY2VpdmVkO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29uc3VtZWQgPSB2YWNjaW5lRGF0YVt2YWNjaW5lXS5jb25zdW1lZDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF2YWlsYWJsZVN0b2NrID0gYXRIYW5kICsgcmVjZWl2ZWQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtb250aHNTdG9jayA9IE1hdGgucm91bmQoYXRIYW5kIC8gbWluU3RvY2spO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChtb250aHNTdG9jayA9PSAwKSBzdG9ja2VkT3V0QW50aWdlbnMrKztcblxuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFBbGxzdG9jay5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhY2NpbmU6IHZhY2NpbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICBNb250aHNfc3RvY2s6IG1vbnRoc1N0b2NrLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVmaWxsX3JhdGU6IChvcmRlcmVkID09IDApID8gMCA6IE1hdGgucm91bmQoKHJlY2VpdmVkIC8gb3JkZXJlZCkgKiAxMDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXB0YWtlX3JhdGU6IChhdmFpbGFibGVTdG9jayA9PSAwKSA/IDAgOiBNYXRoLnJvdW5kKChjb25zdW1lZCAvIGF2YWlsYWJsZVN0b2NrKSAqIDEwMClcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5BbnRpZ2VuX3N0b2NrZWRvdXQgPSBzdG9ja2VkT3V0QW50aWdlbnM7XG5cbiAgICAgICAgICAgICAgICB2YXIgcGFyYW1zID0ge3BhZ2U6IDEsIGNvdW50OiAxMH07XG4gICAgICAgICAgICAgICAgdmFyIHNldHRpbmdzID0ge2ZpbHRlckRlbGF5OiAwLCBjb3VudHM6IFtdLCBkYXRhOiB0YWJsZWRhdGFBbGxzdG9ja307XG4gICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNTdG9jayA9IG5ldyBOZ1RhYmxlUGFyYW1zKHBhcmFtcywgc2V0dGluZ3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgICAgIHZtLmdldFVuZXBpU3RvY2sgPSBmdW5jdGlvbihlbmRNb250aCwgZGlzdHJpY3QpIHtcblxuICAgICAgICAgICAgICAgIHZtLmVuZE1vbnRoID0gdm0uZW5kTW9udGggPyB2bS5lbmRNb250aCA6IFwiXCI7XG5cbiAgICAgICAgICAgICAgICBTdG9ja1NlcnZpY2UuZ2V0VW5lcGlTdG9jayggZW5kTW9udGgsIGRpc3RyaWN0KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGVkYXRhQWxsc3RvY2sgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcblxuXG5cbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhQWxsc3RvY2sgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc1N0b2NrID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFBbGxzdG9jayxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLkFudGlnZW5fc3RvY2tlZG91dCA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uZGF0YS5sZW5ndGggOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2bS5kYXRhW2ldLk1vbnRoc19zdG9jayA9PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5BbnRpZ2VuX3N0b2NrZWRvdXQrKztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgQ29sZCBDaGFpbiAmIFVuZXBpIERpc3RyaWN0IGZpbHRlcnMgdXNlZCBkaWZmZXJlbnQgZGF0YSBzb3VyY2VzXG4gICAgICAgICAgICAgICAgRm9yIHRoYXQgcmVhc29uIHRvIHVzZSB0aGUgQ29sZCBDaGFpbiBhcGksIHRoZSBkaXN0cmljdCBuYW1lXG4gICAgICAgICAgICAgICAgaGFzIHRvIGJlIHJlZm9ybWF0dGVkIHRvIG1hdGNoIHRoZSBjb2xkIGNoYWluIGRpc3RyaWN0IGZpbHRlci5cbiAgICAgICAgICAgICAgICBAVG9kbzogU3RhbmRhcmRpemUgdGhlIGRpc3RyaWN0IHZhbHVlc1xuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdm0ucGFyc2VEaXN0cmljdCA9IGZ1bmN0aW9uKGRpc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkaXN0cmljdC5yZXBsYWNlKFwiIERpc3RyaWN0XCIsIFwiXCIpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZtLmdldFVuZXBpQ29sZENoYWluQ2FwYWNpdHkgPSBmdW5jdGlvbihlbmRNb250aCwgZGlzdHJpY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3QgPSB2bS5wYXJzZURpc3RyaWN0KGRpc3RyaWN0KTtcblxuICAgICAgICAgICAgICAgICAgICBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZUZhY2lsaXR5Q2FwYWNpdHkodW5kZWZpbmVkLCBlbmRNb250aCwgZGlzdHJpY3QsIHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1ldHJpY3MgPSBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZUNhcGFjaXR5TWV0cmljcyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQubWV0cmljcyA9IG1ldHJpY3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnBlciA9IGFwcEhlbHBlcnMucGVyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdm0uZ2V0VW5lcGlDb2xkQ2hhaW5GdW5jdGlvbmFsaXR5ID0gZnVuY3Rpb24oZW5kTW9udGgsIGRpc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0ID0gdm0ucGFyc2VEaXN0cmljdChkaXN0cmljdCk7XG5cbiAgICAgICAgICAgICAgICAgICAgRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VEaXN0cmljdFJlZnJpZ2VyYXRvcih1bmRlZmluZWQsIGVuZE1vbnRoLCBkaXN0cmljdCwgdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhZ2dyZWdhdGVzID0gZGF0YS5yZWR1Y2UoZnVuY3Rpb24oYWNjLCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjLnRvdGFsRXF1aXBtZW50ICs9IGl0ZW0ubnVtYmVyX2V4aXN0aW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjYy50b3RhbFdvcmtpbmdXZWxsICs9IGl0ZW0ud29ya2luZ193ZWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjYy50b3RhbE5vdFdvcmtpbmdXZWxsICs9IGl0ZW0ubm90X3dvcmtpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjLnRvdGFsTmVlZE1haW50ZW5hbmNlICs9IGl0ZW0ubmVlZHNfbWFpbnRlbmFuY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjLnRvdGFsRmFjaWxpdGllcyArPSBpdGVtLnRvdGFsX2ZhY2lsaXRpZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHt0b3RhbEVxdWlwbWVudDowLCB0b3RhbEZhY2lsaXRpZXM6MCwgdG90YWxXb3JraW5nV2VsbDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbE5vdFdvcmtpbmdXZWxsOjAsIHRvdGFsTmVlZE1haW50ZW5hbmNlOiAwfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQubnVtYmVyT2ZDb2xkY2hhaW5FcXVpcG1lbnQgPSBhZ2dyZWdhdGVzLnRvdGFsRXF1aXBtZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5udW1iZXJPZkZhY2lsaXRpZXMgPSBhZ2dyZWdhdGVzLnRvdGFsRmFjaWxpdGllcztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQubnVtYmVyV29ya2luZ1dlbGwgPSBhZ2dyZWdhdGVzLnRvdGFsV29ya2luZ1dlbGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLm51bWJlck5vdFdvcmtpbmdXZWxsID0gYWdncmVnYXRlcy50b3RhbE5vdFdvcmtpbmdXZWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5udW1iZXJOZWVkTWFpbnRlbmFuY2UgPSBhZ2dyZWdhdGVzLnRvdGFsTmVlZE1haW50ZW5hbmNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5wZXIgPSBhcHBIZWxwZXJzLnBlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQubnVtYmVyV29ya2luZyA9IGFnZ3JlZ2F0ZXMudG90YWxFcXVpcG1lbnQgLSBhZ2dyZWdhdGVzLnRvdGFsTm90V29ya2luZ1dlbGw7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2bS5lbmFibGVQREZEb3dubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5kb3dubG9hZFBERiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQucHJpbnRWaWV3ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBkZiA9IG5ldyBqc1BERigncCcsICdtbScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZGYuYWRkSFRNTChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVuZXBpUmVwb3J0XCIpLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZGYuc2F2ZSgndW5lcGktcmVwb3J0LnBkZicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEwMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5wcmludFZpZXcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRvbigncmVmcmVzaCcsIGZ1bmN0aW9uKGUsIHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSkge1xuICAgICAgICAgICAgICAgICAgICBpZihzdGFydE1vbnRoLm5hbWUgJiYgZW5kTW9udGgubmFtZSAmJiBkaXN0cmljdC5uYW1lICYmIHZhY2NpbmUubmFtZSlcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0VW5lcGlDb3ZlcmFnZShlbmRNb250aC5wZXJpb2QsIGRpc3RyaWN0Lm5hbWUsIHZhY2NpbmUubmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkaXN0cmljdC5uYW1lID09IFwiTmF0aW9uYWxcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldFVuZXBpTmF0aW9uYWxTdG9jayhlbmRNb250aC5uYW1lLCBkaXN0cmljdC5uYW1lLCB2YWNjaW5lLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRVbmVwaVN0b2NrKGVuZE1vbnRoLm5hbWUsIGRpc3RyaWN0Lm5hbWUsIHZhY2NpbmUubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRVbmVwaUNvbGRDaGFpbkNhcGFjaXR5KGVuZE1vbnRoLm5hbWUsIGRpc3RyaWN0Lm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0VW5lcGlDb2xkQ2hhaW5GdW5jdGlvbmFsaXR5KGVuZE1vbnRoLm5hbWUsIGRpc3RyaWN0Lm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZW5hYmxlUERGRG93bmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIF0pO1xufSkod2luZG93LmFuZ3VsYXIpO1xuIl19
