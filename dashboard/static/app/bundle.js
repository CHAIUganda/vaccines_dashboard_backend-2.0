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

            for (var i = 0; i < vm.data.length ; i++) {
                var item = vm.data[i];
                /* Certain data had invalid periods like 20172 instead of
                    201702 which were causing errors. Hence the filter below. */
                if (item.period.toString().length == 5) continue;

                var monthIndex = appHelpers.getMonthIndexFromPeriod(item.period, 'CY');
                var atHand = item.at_hand == undefined ? item.total_at_hand : item.at_hand;
                var received = item.received == undefined ? item.total_received : item.received;
                var consumed = item.consumed == undefined ? item.total_consumed : item.consumed;
                var monthlyTarget = item.stock_requirement__target == undefined
                    ? item.total_target : item.stock_requirement__target;
                var totalStock = atHand + received;

                maxMonthlyTarget = Math.max(maxMonthlyTarget, Number(monthlyTarget.toFixed(0)));
                stockData.push({x: monthIndex, y: Number(totalStock.toFixed(0))});
                immunisationData.push({x: monthIndex, y: Number(consumed.toFixed(0))});
                monthlyTargetData.push({x: monthIndex, y: Number(monthlyTarget.toFixed(0))});
                forceStartZeroData.push({x: monthIndex, y: 0});

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
            return appHelpers.getMonthFromNumber(d, 'CY');
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

    $scope.$on('refresh', updateChart);

    function updateChart(e, startMonth, endMonth, district, vaccine) {
        StockService.getStockByDistrictVaccine(startMonth.name, endMonth.name, district.name, vaccine.name)
        .then(function(data) {
            vm.data = angular.copy(data);

            var graphData = [];
            var stockData = [];
            var supplyData = [];

            for (var i = 0; i < vm.data.length ; i++) {
                var item = vm.data[i];
                /* Certain data had invalid periods like 20172 instead of
                    201702 which were causing errors. Hence the filter below. */
                if (item.period.toString().length == 5) continue;

                var monthIndex = appHelpers.getMonthIndexFromPeriod(item.period, 'CY');
                var atHand = item.at_hand == undefined ? item.total_at_hand : item.at_hand;
                var received = item.received == undefined ? item.total_received : item.received;

                stockData.push({x: monthIndex, y: Number(atHand.toFixed(0))});
                supplyData.push({x: monthIndex, y: Number(received.toFixed(0))});
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
            return appHelpers.getMonthFromNumber(d, 'CY');
        };
        chartOptions.chart.valueFormat = function(d){
            return tickFormat(d3.format('.0f'));
        };
        return chartOptions;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9oZWxwZXJzLmpzIiwic2hhcmVkL2FubnVhbFNlcnZpY2UuanMiLCJzaGFyZWQvY2hhcnRQREZFeHBvcnRTZXJ2aWNlLmpzIiwic2hhcmVkL2NoYXJ0U3VwcG9ydFNlcnZpY2UuanMiLCJzaGFyZWQvY292ZXJhZ2VDYWxjdWxhdG9yU2VydmljZS5qcyIsInNoYXJlZC9jb3ZlcmFnZVNlcnZpY2UuanMiLCJzaGFyZWQvZmlsdGVyU2VydmljZS5qcyIsInNoYXJlZC9maW5hbmNlU2VydmljZS5qcyIsInNoYXJlZC9mcmlkZ2VTZXJ2aWNlLmpzIiwic2hhcmVkL21haW5Db250cm9sbGVyLmpzIiwic2hhcmVkL21hcFN1cHBvcnRTZXJ2aWNlLmpzIiwic2hhcmVkL3N0b2NrU2VydmljZS5qcyIsImNvbXBvbmVudHMvY292ZXJhZ2UvYW5udWFsQ292ZXJhZ2VDb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9jb3ZlcmFnZS9jb3ZlcmFnZUNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL2ZyaWRnZS9mcmlkZ2VDb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9maW5hbmNlL2ZpbmFuY2VEYXRhQ29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvZmluYW5jZS9tYWluRmluYW5jZUNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL2ltcG9ydC9nZW5lcmljSW1wb3J0Q29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvcGxhbm5pbmcvUGxhbm5pbmdDb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9zdG9jay9zdG9ja0NvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL3N0b2NrL3N0b2NrVXB0YWtlQ29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvc3RvY2svc3RvY2tvdXRUcmVuZENvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL3VuZXBpL1VuZXBpQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKHdpbmRvdywgZG9jdW1lbnQpIHtcbiAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgIHZhciBhcHBIZWxwZXJzID0gd2luZG93LmFwcEhlbHBlcnMgfHwgKHdpbmRvdy5hcHBIZWxwZXJzID0ge30pO1xuXG4gICAgIHZhciBwZXIgPSBmdW5jdGlvbih2YWx1ZSwgdG90YWwpIHtcbiAgICAgICAgIHZhciBwZXJjZW50YWdlID0gKHZhbHVlL3RvdGFsKSAqIDEwMDtcbiAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHBlcmNlbnRhZ2UgKiAxMCkgLyAxMDtcbiAgICAgfTtcblxuICAgICB2YXIgZ2VuZXJhdGVMYWJlbEZyb21QZXJpb2QgPSBmdW5jdGlvbihwZXJpb2QpIHtcbiAgICAgICAgIHBlcmlvZCA9IHBlcmlvZC50b1N0cmluZygpO1xuICAgICAgICAgdmFyIHllYXIgPSBwZXJpb2Quc3Vic3RyKDIsMik7XG4gICAgICAgICB2YXIgbW9udGggPSBOdW1iZXIocGVyaW9kLnN1YnN0cig0LDIpKTtcblxuICAgICAgICAgdmFyIG1vbnRocyA9IFsnJywgJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwdCcsICdPY3QnLCAnTm92JywgJ0RlYyddO1xuICAgICAgICAgcmV0dXJuIG1vbnRoc1ttb250aF0gKyBcIidcIit5ZWFyO1xuICAgIH07XG5cbiAgICB2YXIgZ2VuZXJhdGVGdWxsTGFiZWxGcm9tUGVyaW9kID0gZnVuY3Rpb24ocGVyaW9kKSB7XG4gICAgICAgIHBlcmlvZCA9IHBlcmlvZC50b1N0cmluZygpO1xuICAgICAgICB2YXIgeWVhciA9IHBlcmlvZC5zdWJzdHIoMCw0KTtcbiAgICAgICAgdmFyIG1vbnRoID0gTnVtYmVyKHBlcmlvZC5zdWJzdHIoNCwyKSk7XG5cbiAgICAgICAgdmFyIG1vbnRocyA9IFsnJywgJ0phbnVhcnknLCAnRmVicnVhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLFxuICAgICAgICAgICAgJ0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJywgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJ107XG4gICAgICAgIHJldHVybiBtb250aHNbbW9udGhdICsgXCIgXCIreWVhcjtcbiAgIH07XG5cbiAgICB2YXIgZ2V0TW9udGhGcm9tTnVtYmVyID0gZnVuY3Rpb24odmFsdWUsIHllYXJUeXBlKSB7XG4gICAgICAgIHZhciBtb250aHMgPSBbJycsICdKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcHQnLCAnT2N0JywgJ05vdicsICdEZWMnXTtcbiAgICAgICAgdmFyIG1vbnRoc0ZZID0gWycnLCAnSnVsJywgJ0F1ZycsICdTZXB0JywgJ09jdCcsICdOb3YnLCAnRGVjJywgJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJ107XG5cbiAgICAgICAgaWYgKHllYXJUeXBlID09ICdDWScpIHtcbiAgICAgICAgICAgIHJldHVybiBtb250aHNbdmFsdWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG1vbnRoc0ZZW3ZhbHVlXTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZ2V0UGVyaW9kU3RyaW5nID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgICAgICAgaWYgKG1vbnRoIDwgMTApIHtcbiAgICAgICAgICAgIHJldHVybiB5ZWFyICsgXCIwXCIgKyBtb250aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB5ZWFyICsgXCJcIiArICBtb250aDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZ2V0TW9udGhJbmRleEZyb21QZXJpb2QgPSBmdW5jdGlvbihwZXJpb2QsIHllYXJUeXBlKSB7XG4gICAgICAgIHBlcmlvZCA9IHBlcmlvZC50b1N0cmluZygpO1xuICAgICAgICB2YXIgbW9udGggPSBOdW1iZXIocGVyaW9kLnN1YnN0cig0LDIpKTtcblxuICAgICAgICBpZiAoeWVhclR5cGUgPT0gJ0NZJykge1xuICAgICAgICAgICAgcmV0dXJuIG1vbnRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG1vbnRoID49IDcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMobW9udGggLSA3KSArIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAobW9udGggKyA2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZ2V0TW9udGhGcm9tUGVyaW9kID0gZnVuY3Rpb24ocGVyaW9kLCB5ZWFyVHlwZSkge1xuICAgICAgICBwZXJpb2QgPSBwZXJpb2QudG9TdHJpbmcoKTtcbiAgICAgICAgcmV0dXJuIE51bWJlcihwZXJpb2Quc3Vic3RyKDQsMikpO1xuICAgIH07XG5cbiAgICB2YXIgZ2V0WWVhckZyb21QZXJpb2QgPSBmdW5jdGlvbihwZXJpb2QsIHllYXJUeXBlKSB7XG4gICAgICAgIHBlcmlvZCA9IHBlcmlvZC50b1N0cmluZygpO1xuICAgICAgICByZXR1cm4gTnVtYmVyKHBlcmlvZC5zdWJzdHIoMCw0KSk7XG4gICAgfTtcblxuICAgIHZhciBnZXRZZWFyTGFiZWxGcm9tUGVyaW9kID0gZnVuY3Rpb24ocGVyaW9kLCB5ZWFyVHlwZSkge1xuICAgICAgICBwZXJpb2QgPSBwZXJpb2QudG9TdHJpbmcoKTtcbiAgICAgICAgdmFyIHllYXIgPSBwZXJpb2Quc3Vic3RyKDAsNCk7XG4gICAgICAgIHZhciBtb250aCA9IE51bWJlcihwZXJpb2Quc3Vic3RyKDQsMikpO1xuXG4gICAgICAgIGlmICh5ZWFyVHlwZSA9PSAnQ1knKSB7XG4gICAgICAgICAgICByZXR1cm4geWVhcjtcbiAgICAgICAgfSBlbHNlIGlmICh5ZWFyVHlwZSA9PSAnRlknKSB7XG4gICAgICAgICAgICBpZiAobW9udGggPD0gNikge1xuICAgICAgICAgICAgICAgIHZhciBwcmV2WWVhciA9IE51bWJlcih5ZWFyKSAtIDE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZXZZZWFyICsgXCItXCIgKyB5ZWFyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFllYXIgPSBOdW1iZXIoeWVhcikgKyAxO1xuICAgICAgICAgICAgICAgIHJldHVybiB5ZWFyICsgXCItXCIgKyBuZXh0WWVhcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgICAvLyBwdWJsaXNoIGV4dGVybmFsIEFQSSBieSBleHRlbmRpbmcgYXBwSGVscGVyc1xuICAgICBmdW5jdGlvbiBwdWJsaXNoRXh0ZXJuYWxBUEkoYXBwSGVscGVycykge1xuICAgICAgICAgYW5ndWxhci5leHRlbmQoYXBwSGVscGVycywge1xuICAgICAgICAgICAgICdwZXInOiBwZXIsXG4gICAgICAgICAgICAgJ2dlbmVyYXRlTGFiZWxGcm9tUGVyaW9kJzogZ2VuZXJhdGVMYWJlbEZyb21QZXJpb2QsXG4gICAgICAgICAgICAgJ2dlbmVyYXRlRnVsbExhYmVsRnJvbVBlcmlvZCc6IGdlbmVyYXRlRnVsbExhYmVsRnJvbVBlcmlvZCxcbiAgICAgICAgICAgICAnZ2V0UGVyaW9kU3RyaW5nJzogZ2V0UGVyaW9kU3RyaW5nLFxuICAgICAgICAgICAgICdnZXRZZWFyTGFiZWxGcm9tUGVyaW9kJzogZ2V0WWVhckxhYmVsRnJvbVBlcmlvZCxcbiAgICAgICAgICAgICAnZ2V0TW9udGhGcm9tUGVyaW9kJzogZ2V0TW9udGhGcm9tUGVyaW9kLFxuICAgICAgICAgICAgICdnZXRZZWFyRnJvbVBlcmlvZCc6IGdldFllYXJGcm9tUGVyaW9kLFxuICAgICAgICAgICAgICdnZXRNb250aEluZGV4RnJvbVBlcmlvZCc6IGdldE1vbnRoSW5kZXhGcm9tUGVyaW9kLFxuICAgICAgICAgICAgICdnZXRNb250aEZyb21OdW1iZXInOiBnZXRNb250aEZyb21OdW1iZXJcbiAgICAgICAgIH0pO1xuICAgICB9XG5cbiAgICAgcHVibGlzaEV4dGVybmFsQVBJKGFwcEhlbHBlcnMpO1xuXG4gfSkod2luZG93LCBkb2N1bWVudCk7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG4vKipcbiAqIENyZWF0ZWQgYnkgYndhbWFsYSBvbiA2LzIvMjAxNy5cbiAqL1xuYW5ndWxhci5tb2R1bGUoJ3NlcnZpY2VzJykuc2VydmljZSgnQW5udWFsU2VydmljZScsIFsnJGh0dHAnLFxuICAgIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgICAgIHZhciBoYW5kbGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0QXdwQWN0aXZpdGllcyA9IGZ1bmN0aW9uKHllYXIpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgncGxhbm5pbmcvYXBpL2F3cGFjdGl2aXRpZXMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHllYXI6IHllYXJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0RnVuZEFjdGl2aXRpZXMgPSBmdW5jdGlvbih5ZWFyKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ3BsYW5uaW5nL2FwaS9mdW5kYWN0aXZpdGllcycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgeWVhcjogeWVhcixcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0UHJpb3JpdHlBY3Rpdml0aWVzID0gZnVuY3Rpb24oeWVhcil7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdwbGFubmluZy9hcGkvcHJpb3JpdHlhY3Rpdml0aWVzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICB5ZWFyOiB5ZWFyLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgICdnZXRBd3BBY3Rpdml0aWVzJzpnZXRBd3BBY3Rpdml0aWVzLFxuICAgICAgICAgICAgJ2dldEZ1bmRBY3Rpdml0aWVzJzogZ2V0RnVuZEFjdGl2aXRpZXMsXG4gICAgICAgICAgICAnZ2V0UHJpb3JpdHlBY3Rpdml0aWVzJzpnZXRQcmlvcml0eUFjdGl2aXRpZXNcbiAgICAgICAgfTtcbiAgICB9XG5cbl0pXG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnc2VydmljZXMnKVxuICAgIC5zZXJ2aWNlKCdDaGFydFBERkV4cG9ydCcsIENoYXJ0UERGRXhwb3J0KTtcblxuQ2hhcnRQREZFeHBvcnQuJGluamVjdCA9IFsnJHRpbWVvdXQnXTtcbmZ1bmN0aW9uIENoYXJ0UERGRXhwb3J0KCR0aW1lb3V0KSB7XG4gICAgdmFyIHNlcnZpY2UgPSB7XG4gICAgICAgICdleHBvcnQnOiBleHBvcnRQREYsXG4gICAgICAgICdleHBvcnRXaXRoU3R5bGVyJzogZXhwb3J0V2l0aFN0eWxlclxuICAgIH07XG4gICAgcmV0dXJuIHNlcnZpY2U7XG5cbiAgICBmdW5jdGlvbiBleHBvcnRQREYoZmlsZW5hbWUpIHtcbiAgICAgICAgZDMuc2VsZWN0QWxsKFwic3ZnIC5udi1saW5lXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwiI2ZmZmZmZlwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIDApO1xuXG4gICAgICAgIGQzLnNlbGVjdEFsbChcIi5udmQzIC5udi1iYWNrZ3JvdW5kXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwiI2ZmZmZmZlwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIDApO1xuXG4gICAgICAgIGQzLnNlbGVjdEFsbChcIi5udmQzIC5udi1heGlzIGxpbmVcIilcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBcIiNlNWU1ZTVcIik7XG5cbiAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52ZDMgdGV4dFwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiZm9udFwiLCBcIm5vcm1hbCAxM3B4IEFyaWFsLCBzYW5zLXNlcmlmXCIpO1xuXG4gICAgICAgIGQzLnNlbGVjdEFsbChcIi5udmQzIC5udi1ncm91cHMgLm52LXBvaW50XCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMClcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZS13aWR0aFwiLCBcIjBweFwiKTtcblxuICAgICAgICBkMy5zZWxlY3RBbGwoXCIubnZkMyAubnYteSAuemVybyBsaW5lXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgXCIjNDA0MDQwXCIpO1xuXG4gICAgICAgIGQzLnNlbGVjdEFsbChcIi5udi15IC5udi1heGlzIGcgcGF0aC5kb21haW5cIilcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBcIiM0MDQwNDBcIik7XG5cbiAgICAgICAgZDMuc2VsZWN0QWxsKFwiLmxlZ2VuZFF1YW50IC5sYWJlbFwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiZm9udFwiLCBcIm5vcm1hbCAxMnB4IEFyaWFsLCBzYW5zLXNlcmlmXCIpO1xuXG4gICAgICAgIC8vIHZhciBwZGYgPSBuZXcganNQREYoJ2wnLCAnbW0nKTtcbiAgICAgICAgdmFyIHBkZj1uZXcganNQREYoXCJsXCIsIFwibW1cIiwgXCJhNFwiKTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7IGZvcm1hdCA6ICdQTkcnIH07XG5cbiAgICAgICAgcGRmLmFkZEhUTUwoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwZGZSZXBvcnRcIiksIDAsIDAsIG9wdGlvbnMsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHBkZi5zYXZlKGZpbGVuYW1lKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXhwb3J0V2l0aFN0eWxlcih2bSwgZmlsZW5hbWUpIHtcbiAgICAgICAgdm0ucHJpbnRWaWV3ID0gdHJ1ZTtcbiAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7ZXhwb3J0UERGKGZpbGVuYW1lKTsgfSwgMTAwKTtcbiAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7dm0ucHJpbnRWaWV3ID0gZmFsc2U7fSwgMTAwMCk7XG4gICAgfVxufVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhclxuICAgIC5tb2R1bGUoJ3NlcnZpY2VzJylcbiAgICAuc2VydmljZSgnQ2hhcnRTdXBwb3J0U2VydmljZScsIENoYXJ0U3VwcG9ydFNlcnZpY2UpO1xuXG5mdW5jdGlvbiBDaGFydFN1cHBvcnRTZXJ2aWNlKCkge1xuICAgIHZhciBzZXJ2aWNlID0ge1xuICAgICAgICAnZ2V0T3B0aW9ucyc6IGdldE9wdGlvbnMsXG4gICAgICAgICdpbml0TGFiZWxzJzogaW5pdExhYmVscyxcbiAgICAgICAgJ2NsZWFyTGFiZWxzJzogY2xlYXJMYWJlbHNcbiAgICB9O1xuXG4gICAgcmV0dXJuIHNlcnZpY2U7XG5cbiAgICBmdW5jdGlvbiBnZXRPcHRpb25zKGNoYXJ0VHlwZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBjaGFydFR5cGUsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA0NTAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY1MCxcbiAgICAgICAgICAgICAgICAvLyBtYXJnaW46IHt0b3A6IDEwMH0sXG4gICAgICAgICAgICAgICAgc3RhY2tlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2hvd0NvbnRyb2xzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBncm91cFNwYWNpbmc6IDAuMixcbiAgICAgICAgICAgICAgICBjbGlwRWRnZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgLy8gdXNlSW50ZXJhY3RpdmVHdWlkZWxpbmU6IHRydWUsXG4gICAgICAgICAgICAgICAgaW50ZXJhY3RpdmVMYXllcjoge2dyYXZpdHk6ICdzJ30sXG4gICAgICAgICAgICAgICAgeDogZnVuY3Rpb24oZCl7IHJldHVybiBkLng7IH0sXG4gICAgICAgICAgICAgICAgeTogZnVuY3Rpb24oZCl7IHJldHVybiBkLnk7IH0sXG4gICAgICAgICAgICAgICAgZm9yY2VZOiBbMCwxMTBdLFxuICAgICAgICAgICAgICAgIHhBeGlzOiB7XG4gICAgICAgICAgICAgICAgICAgIGF4aXNMYWJlbDogJ1llYXJzJyxcbiAgICAgICAgICAgICAgICAgICAgdGlja0Zvcm1hdDogZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeUF4aXM6IHtcbiAgICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiAnQ292ZXJhZ2UgUmF0ZSAoJSknLFxuICAgICAgICAgICAgICAgICAgICB0aWNrczogMTBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRpc3BhdGNoOiB7XG4gICAgICAgICAgICAgICAgICAgIHJlbmRlckVuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbml0TGFiZWxzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihjaGFydCl7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCIhISEgbGluZUNoYXJ0IGNhbGxiYWNrICEhIVwiKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVDaGFuZ2U6IGZ1bmN0aW9uKCkge31cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0TGFiZWxzKGh1bWFuaXplPWZhbHNlKSB7XG4gICAgICAgIC8vIFlvdSBuZWVkIHRvIGFwcGx5IHRoaXMgb25jZSBhbGwgdGhlIGFuaW1hdGlvbnMgYXJlIGFscmVhZHkgZmluaXNoZWQuIE90aGVyd2lzZSBsYWJlbHMgd2lsbCBiZSBwbGFjZWQgd3JvbmdseS5cbiAgICAgICAgZDMuc2VsZWN0QWxsKCcubnYtbXVsdGliYXIgLm52LWdyb3VwJykuZWFjaChmdW5jdGlvbihncm91cCl7XG4gICAgICAgICAgdmFyIGcgPSBkMy5zZWxlY3QodGhpcyk7XG5cbiAgICAgICAgICAvLyBSZW1vdmUgcHJldmlvdXMgbGFiZWxzIGlmIHRoZXJlIGlzIGFueVxuICAgICAgICAgIGcuc2VsZWN0QWxsKCd0ZXh0JykucmVtb3ZlKCk7XG4gICAgICAgICAgZy5zZWxlY3RBbGwoJy5udi1iYXInKS5lYWNoKGZ1bmN0aW9uKGJhcil7XG4gICAgICAgICAgICB2YXIgYiA9IGQzLnNlbGVjdCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYXJXaWR0aCA9IGIuYXR0cignd2lkdGgnKTtcbiAgICAgICAgICAgIHZhciBiYXJIZWlnaHQgPSBiLmF0dHIoJ2hlaWdodCcpO1xuXG4gICAgICAgICAgICBnLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgICAgIC8vIFRyYW5zZm9ybXMgc2hpZnQgdGhlIG9yaWdpbiBwb2ludCB0aGVuIHRoZSB4IGFuZCB5IG9mIHRoZSBiYXJcbiAgICAgICAgICAgICAgLy8gaXMgYWx0ZXJlZCBieSB0aGlzIHRyYW5zZm9ybS4gSW4gb3JkZXIgdG8gYWxpZ24gdGhlIGxhYmVsc1xuICAgICAgICAgICAgICAvLyB3ZSBuZWVkIHRvIGFwcGx5IHRoaXMgdHJhbnNmb3JtIHRvIHRob3NlLlxuICAgICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYi5hdHRyKCd0cmFuc2Zvcm0nKSlcbiAgICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvLyBUd28gZGVjaW1hbHMgZm9ybWF0XG4gICAgICAgICAgICAgICAgaWYgKGh1bWFuaXplKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gSHVtYW5pemUuY29tcGFjdEludGVnZXIocGFyc2VGbG9hdChiYXIueSkudG9GaXhlZCgwKSwgMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoYmFyLnkpLnRvRml4ZWQoMCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5hdHRyKCd5JywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvLyBDZW50ZXIgbGFiZWwgdmVydGljYWxseVxuICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSB0aGlzLmdldEJCb3goKS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoYi5hdHRyKCd5JykpIC0gMTA7IC8vIDEwIGlzIHRoZSBsYWJlbCdzIG1hZ2luIGZyb20gdGhlIGJhclxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuYXR0cigneCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy8gQ2VudGVyIGxhYmVsIGhvcml6b250YWxseVxuICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9IHRoaXMuZ2V0QkJveCgpLndpZHRoO1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGIuYXR0cigneCcpKSArIChwYXJzZUZsb2F0KGJhcldpZHRoKSAvIDIpIC0gKHdpZHRoIC8gMik7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdiYXItdmFsdWVzJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFyTGFiZWxzKCkge1xuICAgICAgICBkMy5zZWxlY3RBbGwoJy5udi1tdWx0aWJhciAubnYtZ3JvdXAnKS5lYWNoKGZ1bmN0aW9uKGdyb3VwKXtcbiAgICAgICAgICB2YXIgZyA9IGQzLnNlbGVjdCh0aGlzKTtcbiAgICAgICAgICAvLyBSZW1vdmUgcHJldmlvdXMgbGFiZWxzIGlmIHRoZXJlIGlzIGFueVxuICAgICAgICAgIGcuc2VsZWN0QWxsKCd0ZXh0JykucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICB9XG59XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnc2VydmljZXMnKVxuICAgIC5zZXJ2aWNlKCdDb3ZlcmFnZUNhbGN1bGF0b3InLCBDb3ZlcmFnZUNhbGN1bGF0b3IpO1xuXG5mdW5jdGlvbiBDb3ZlcmFnZUNhbGN1bGF0b3IoKSB7XG5cbiAgICB2YXIgc2VydmljZSA9ICB7XG4gICAgICAgICdjYWxjdWxhdGVDb3ZlcmFnZVJhdGUnOiBjYWxjdWxhdGVDb3ZlcmFnZVJhdGUsXG4gICAgICAgICdjYWxjdWxhdGVEcm9wb3V0UmF0ZSc6IGNhbGN1bGF0ZURyb3BvdXRSYXRlLFxuICAgICAgICAnY2FsY3VsYXRlUmVkQ2F0ZWdvcnknOiBjYWxjdWxhdGVSZWRDYXRlZ29yeVxuICAgIH07XG5cbiAgICByZXR1cm4gc2VydmljZTtcblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZUNvdmVyYWdlUmF0ZShjb25zdW1wdGlvbiwgcGxhbm5lZCkge1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCgoY29uc3VtcHRpb24gLyBwbGFubmVkKSAqIDEwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlRHJvcG91dFJhdGUoZmlyc3REb3NlLCBsYXN0RG9zZSkge1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCgoKGZpcnN0RG9zZSAtIGxhc3REb3NlKSAvIGZpcnN0RG9zZSkgKiAxMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVJlZENhdGVnb3J5KGZpcnN0RG9zZSwgbGFzdERvc2UsIHBsYW5uZWQpIHtcbiAgICAgICAgdmFyIGFjY2VzcyA9IGNhbGN1bGF0ZUNvdmVyYWdlUmF0ZShmaXJzdERvc2UsIHBsYW5uZWQpO1xuICAgICAgICB2YXIgZHJvcG91dFJhdGUgPSBjYWxjdWxhdGVEcm9wb3V0UmF0ZShmaXJzdERvc2UsIGxhc3REb3NlKTtcblxuICAgICAgICBpZiAoYWNjZXNzID49IDkwICYmIGRyb3BvdXRSYXRlID49IDAgJiYgZHJvcG91dFJhdGUgPD0gMTApIHJldHVybiAxO1xuICAgICAgICBlbHNlIGlmIChhY2Nlc3MgPj0gOTAgJiYgKGRyb3BvdXRSYXRlIDwgMCB8fCBkcm9wb3V0UmF0ZSA+IDEwKSkgcmV0dXJuIDI7XG4gICAgICAgIGVsc2UgaWYgKGFjY2VzcyA8IDkwICYmIGRyb3BvdXRSYXRlID49IDAgJiYgZHJvcG91dFJhdGUgPD0gMTApIHJldHVybiAzO1xuICAgICAgICBlbHNlIGlmIChhY2Nlc3MgPCA5MCAmJiAoZHJvcG91dFJhdGUgPCAwIHx8IGRyb3BvdXRSYXRlID4gMTApKSByZXR1cm4gNDtcbiAgICAgICAgZWxzZSByZXR1cm4gMDtcbiAgICB9XG59XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnc2VydmljZXMnKS5zZXJ2aWNlKCdDb3ZlcmFnZVNlcnZpY2UnLCBbJyRodHRwJyxcbiAgICBmdW5jdGlvbigkaHR0cCkge1xuICAgICAgICB2YXIgaGFuZGxlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldERISVMyVmFjY2luZURvc2VzID0gZnVuY3Rpb24ocGVyaW9kLCBkaXN0cmljdCwgdmFjY2luZSkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY292ZXJhZ2UvYXBpL2RoaXMydmFjY2luZWRvc2VzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBwZXJpb2Q6IHBlcmlvZCxcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZTogdmFjY2luZSxcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldFZhY2NpbmVEb3NlcyA9IGZ1bmN0aW9uKHBlcmlvZCwgdmFjY2luZSkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY292ZXJhZ2UvYXBpL3ZhY2NpbmVkb3NlcycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kOiBwZXJpb2QsXG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmU6IHZhY2NpbmVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGdldFJlZFZhY2NpbmVEb3NlcyA9IGZ1bmN0aW9uKHBlcmlvZCwgdmFjY2luZSkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY292ZXJhZ2UvYXBpL3ZhY2NpbmVkb3NlcycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kOiBwZXJpb2QsXG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmU6IHZhY2NpbmVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIHZhciBnZXRWYWNjaW5lRG9zZXNCeURpc3RyaWN0ID0gZnVuY3Rpb24ocGVyaW9kLCBkaXN0cmljdCwgdmFjY2luZSkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY292ZXJhZ2UvYXBpL3ZhY2NpbmVkb3NlcycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kOiBwZXJpb2QsXG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmU6IHZhY2NpbmUsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRWYWNjaW5lRG9zZXNCeVBlcmlvZCA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY292ZXJhZ2UvYXBpL3ZhY2NpbmVkb3Nlc19ieV9wZXJpb2QnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0WWVhcjogcGFyYW1zLnN0YXJ0WWVhcixcbiAgICAgICAgICAgICAgICAgICAgZW5kWWVhcjogcGFyYW1zLmVuZFllYXIsXG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmU6IHBhcmFtcy5hbnRpZ2VuLFxuICAgICAgICAgICAgICAgICAgICBwZXJpb2Q6IHBhcmFtcy5wZXJpb2QsXG4gICAgICAgICAgICAgICAgICAgIGRvc2U6IHBhcmFtcy5kb3NlLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogcGFyYW1zLmRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogcGFyYW1zLmRhdGFUeXBlLFxuICAgICAgICAgICAgICAgICAgICBlbmFibGVEaXN0cmljdEdyb3VwaW5nOiBwYXJhbXMuZW5hYmxlRGlzdHJpY3RHcm91cGluZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRVbmVwaUNvdmVyYWdlID0gZnVuY3Rpb24ocGVyaW9kLCBkaXN0cmljdCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY292ZXJhZ2UvYXBpL2NvdmVyYWdlYW5udWFsaXplZCcsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kOiBwZXJpb2QsXG5cbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldERpc3RyaWN0TWFwID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ3N0YXRpYy9VZ2FuZGFfYWRtaW4uanNvbicpLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBcImdldERISVMyVmFjY2luZURvc2VzXCI6IGdldERISVMyVmFjY2luZURvc2VzLFxuICAgICAgICAgICAgXCJnZXRWYWNjaW5lRG9zZXNcIjogZ2V0VmFjY2luZURvc2VzLFxuICAgICAgICAgICAgXCJnZXRWYWNjaW5lRG9zZXNCeURpc3RyaWN0XCI6IGdldFZhY2NpbmVEb3Nlc0J5RGlzdHJpY3QsXG4gICAgICAgICAgICBcImdldFZhY2NpbmVEb3Nlc0J5UGVyaW9kXCI6IGdldFZhY2NpbmVEb3Nlc0J5UGVyaW9kLFxuICAgICAgICAgICAgXCJnZXRVbmVwaUNvdmVyYWdlXCI6Z2V0VW5lcGlDb3ZlcmFnZSxcbiAgICAgICAgICAgIFwiZ2V0RGlzdHJpY3RNYXBcIjogZ2V0RGlzdHJpY3RNYXAsXG4gICAgICAgICAgICBcImdldFJlZFZhY2NpbmVEb3Nlc1wiOmdldFJlZFZhY2NpbmVEb3Nlc1xuICAgICAgICB9O1xuICAgIH1cbl0pXG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnc2VydmljZXMnKS5zZXJ2aWNlKCdGaWx0ZXJTZXJ2aWNlJywgWyckaHR0cCcsXG4gICAgZnVuY3Rpb24oJGh0dHApIHtcbiAgICAgICAgdmFyIGhhbmRsZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRNb250aHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvbW9udGhzJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldERpc3RyaWN0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9kaXN0cmljdHMnKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0VmFjY2luZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdmFjY2luZXMvJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZ2V0RnJpZGdlRGlzdHJpY3RzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb2xkY2hhaW4vYXBpL2Rpc3RyaWN0cycpLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRGcmlkZ2VDYXJlTGV2ZWxzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb2xkY2hhaW4vYXBpL2NhcmVsZXZlbHMnKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0RnJpZGdlUXVhcnRlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvbGRjaGFpbi9hcGkvcXVhcnRlcnMnKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0TGFzdFBlcmlvZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9sYXN0cGVyaW9kJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldFBlcmlvZFJhbmdlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY292ZXJhZ2UvYXBpL3BlcmlvZF9yYW5nZXMnKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBnZXRBd3BBY3Rpdml0aWVzPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgncGxhbm5pbmcvYXBpL2F3cGFjdGl2aXRpZXMnKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0RnVuZEFjdGl2aXRpZXM9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdwbGFubmluZy9hcGkvZnVuZGFjdGl2aXRpZXMnKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGdldFVuZXBpQ292ZXJhZ2U9ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvdmVyYWdlL2FwaS9jb3ZlcmFnZWFubnVhbGl6ZWQnKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGdldFVuZXBpU3RvY2s9ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2FwaS9zdG9jay9hdGhhbmRieWRpc3RyaWN0JykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldFllYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ3BsYW5uaW5nL2FwaS9hY3Rpdml0eXllYXInKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBcImdldE1vbnRoc1wiOiBnZXRNb250aHMsXG4gICAgICAgICAgICBcImdldFllYXJcIjogZ2V0WWVhcixcbiAgICAgICAgICAgIFwiZ2V0VmFjY2luZXNcIjogZ2V0VmFjY2luZXMsXG4gICAgICAgICAgICBcImdldERpc3RyaWN0c1wiOiBnZXREaXN0cmljdHMsXG4gICAgICAgICAgICBcImdldEZyaWRnZURpc3RyaWN0c1wiOiBnZXRGcmlkZ2VEaXN0cmljdHMsXG4gICAgICAgICAgICBcImdldEZyaWRnZUNhcmVMZXZlbHNcIjogZ2V0RnJpZGdlQ2FyZUxldmVscyxcbiAgICAgICAgICAgIFwiZ2V0RnJpZGdlUXVhcnRlcnNcIjogZ2V0RnJpZGdlUXVhcnRlcnMsXG4gICAgICAgICAgICBcImdldExhc3RQZXJpb2RcIjogZ2V0TGFzdFBlcmlvZCxcbiAgICAgICAgICAgIFwiZ2V0UGVyaW9kUmFuZ2VzXCI6IGdldFBlcmlvZFJhbmdlcyxcbiAgICAgICAgICAgIFwiZ2V0QXdwQWN0aXZpdGllc1wiOiBnZXRBd3BBY3Rpdml0aWVzLFxuICAgICAgICAgICAgXCJnZXRGdW5kQWN0aXZpdGllc1wiOiBnZXRGdW5kQWN0aXZpdGllcyxcbiAgICAgICAgICAgIFwiZ2V0VW5lcGlDb3ZlcmFnZVwiOmdldFVuZXBpQ292ZXJhZ2UsXG4gICAgICAgICAgICBcImdldFVuZXBpU3RvY2tcIjpnZXRVbmVwaVN0b2NrXG4gICAgICAgIH07XG4gICAgfVxuXSlcblxuYW5ndWxhci5tb2R1bGUoJ3NlcnZpY2VzJykuc2VydmljZSgnTW9udGhTZXJ2aWNlJywgW1xuICAgIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBnZXRNb250aE5hbWUgPSBmdW5jdGlvbihtb250aCkge1xuICAgICAgICAgICAgdmFyIG1vbnRocyA9IHt9O1xuICAgICAgICAgICAgbW9udGhzWycxJ10gPSBcIkphblwiO1xuICAgICAgICAgICAgbW9udGhzWycyJ10gPSBcIkZlYlwiO1xuICAgICAgICAgICAgbW9udGhzWyczJ10gPSBcIk1hclwiO1xuICAgICAgICAgICAgbW9udGhzWyc0J10gPSBcIkFwclwiO1xuICAgICAgICAgICAgbW9udGhzWyc1J10gPSBcIk1heVwiO1xuICAgICAgICAgICAgbW9udGhzWyc2J10gPSBcIkp1blwiO1xuICAgICAgICAgICAgbW9udGhzWyc3J10gPSBcIkp1bFwiO1xuICAgICAgICAgICAgbW9udGhzWyc4J10gPSBcIkF1Z1wiO1xuICAgICAgICAgICAgbW9udGhzWyc5J10gPSBcIlNlcFwiO1xuICAgICAgICAgICAgbW9udGhzWycxMCddID0gXCJPY3RcIjtcbiAgICAgICAgICAgIG1vbnRoc1snMTEnXSA9IFwiTm92XCI7XG4gICAgICAgICAgICBtb250aHNbJzEyJ10gPSBcIkRlY1wiO1xuICAgICAgICAgICAgcmV0dXJuIG1vbnRoc1ttb250aF07XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldE1vbnRoTnVtYmVyID0gZnVuY3Rpb24obW9udGgpIHtcbiAgICAgICAgICAgIHZhciBtb250aHMgPSB7fTtcbiAgICAgICAgICAgIG1vbnRoc1snSmFuJ10gPSAxO1xuICAgICAgICAgICAgbW9udGhzWydGZWInXSA9IDI7XG4gICAgICAgICAgICBtb250aHNbJ01hciddID0gMztcbiAgICAgICAgICAgIG1vbnRoc1snQXByJ10gPSA0O1xuICAgICAgICAgICAgbW9udGhzWydNYXknXSA9IDU7XG4gICAgICAgICAgICBtb250aHNbJ0p1biddID0gNjtcbiAgICAgICAgICAgIG1vbnRoc1snSnVsJ10gPSA3O1xuICAgICAgICAgICAgbW9udGhzWydBdWcnXSA9IDg7XG4gICAgICAgICAgICBtb250aHNbJ1NlcCddID0gOTtcbiAgICAgICAgICAgIG1vbnRoc1snT2N0J10gPSAxMDtcbiAgICAgICAgICAgIG1vbnRoc1snTm92J10gPSAxMTtcbiAgICAgICAgICAgIG1vbnRoc1snRGVjJ10gPSAxMjtcbiAgICAgICAgICAgIHJldHVybiBtb250aHNbbW9udGhdO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBtb250aFRvRGF0ZSA9IGZ1bmN0aW9uKG1vbnRoWWVhcikge1xuICAgICAgICAgICAgdmFyIHBhcnRzID0gbW9udGhZZWFyLnNwbGl0KFwiIFwiKTtcbiAgICAgICAgICAgIHZhciBtb250aCA9IGdldE1vbnRoTnVtYmVyKHBhcnRzWzBdKTtcbiAgICAgICAgICAgIHZhciB5ZWFyID0gcGFyc2VJbnQocGFydHNbMV0pO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbiAgICAgICAgfTtcblxuICAgICAgICBtb250aERpZmYgPSBmdW5jdGlvbiAoc3RhcnREYXRlLCBlbmREYXRlKSB7XG4gICAgICAgICAgICB2YXIgbW9udGhzO1xuICAgICAgICAgICAgbW9udGhzID0gKGVuZERhdGUuZ2V0RnVsbFllYXIoKSAtIHN0YXJ0RGF0ZS5nZXRGdWxsWWVhcigpKSAqIDEyO1xuICAgICAgICAgICAgbW9udGhzIC09IHN0YXJ0RGF0ZS5nZXRNb250aCgpICsgMTtcbiAgICAgICAgICAgIG1vbnRocyArPSBlbmREYXRlLmdldE1vbnRoKCk7XG4gICAgICAgICAgICByZXR1cm4gbW9udGhzIDw9IDAgPyAwIDogbW9udGhzO1xuICAgICAgICB9O1xuXG4gICAgICAgIG1vbnRoUmFuZ2VEaWZmID0gZnVuY3Rpb24gKHN0YXJ0RGF0ZSwgZW5kRGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbnRoRGlmZihtb250aFRvRGF0ZShzdGFydERhdGUpLCBtb250aFRvRGF0ZShlbmREYXRlKSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwiZ2V0TW9udGhOYW1lXCI6IGdldE1vbnRoTmFtZSxcbiAgICAgICAgICAgIFwiZ2V0TW9udGhOdW1iZXJcIjogZ2V0TW9udGhOdW1iZXIsXG4gICAgICAgICAgICBcIm1vbnRoVG9EYXRlXCI6IG1vbnRoVG9EYXRlLFxuICAgICAgICAgICAgXCJtb250aERpZmZcIjogbW9udGhEaWZmLFxuICAgICAgICAgICAgXCJtb250aFJhbmdlRGlmZlwiOiBtb250aFJhbmdlRGlmZixcbiAgICAgICAgfTtcbiAgICB9XG5dKVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdzZXJ2aWNlcycpLnNlcnZpY2UoJ0ZpbmFuY2VTZXJ2aWNlJywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKSB7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwiZ2V0RmluYW5jZURhdGFcIjogZ2V0RmluYW5jZURhdGEsXG4gICAgICAgICAgICBcImdldEZpbmFuY2VZZWFyc1wiOiBnZXRGaW5hbmNlWWVhcnNcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVSZXNwb25zZShyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRGaW5hbmNlRGF0YShwYXJhbXMpIHtcbiAgICAgICAgICAgIHZhciBjb25maWcgPSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0WWVhcjogcGFyYW1zID09IHVuZGVmaW5lZCA/IDE5OTAgOiBwYXJhbXMuc3RhcnRZZWFyLFxuICAgICAgICAgICAgICAgICAgICBlbmRZZWFyOiBwYXJhbXMgPT0gdW5kZWZpbmVkID8gMzAwMCA6IHBhcmFtcy5lbmRZZWFyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9maW5hbmNlL2xpc3QnLCBjb25maWcpLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0RmluYW5jZVllYXJzKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2ZpbmFuY2UveWVhcnMnLCB7fSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH1cblxuICAgIH1dKVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ3NlcnZpY2VzJykuc2VydmljZSgnRnJpZGdlU2VydmljZScsIFsnJGh0dHAnLFxuICAgIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgICAgIHZhciBoYW5kbGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0RnJpZGdlQ2FwYWNpdHkgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGRpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvbGRjaGFpbi9hcGkvY2FwYWNpdGllcycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRRdWFydGVyOiBzdGFydFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGVuZFF1YXJ0ZXI6IGVuZFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgY2FyZWxldmVsOiBjYXJlbGV2ZWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0RnJpZGdlRGlzdHJpY3RDYXBhY2l0eSA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY29sZGNoYWluL2FwaS9kaXN0cmljdGNhcGFjaXRpZXMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0UXVhcnRlcjogc3RhcnRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBlbmRRdWFydGVyOiBlbmRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3QsXG4gICAgICAgICAgICAgICAgICAgIGNhcmVsZXZlbDogY2FyZWxldmVsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldEZyaWRnZUZhY2lsaXR5Q2FwYWNpdHkgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGRpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvbGRjaGFpbi9hcGkvZmFjaWxpdHljYXBhY2l0aWVzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydFF1YXJ0ZXI6IHN0YXJ0UXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZW5kUXVhcnRlcjogZW5kUXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICBjYXJlbGV2ZWw6IGNhcmVsZXZlbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRGcmlkZ2VGdW5jdGlvbmFsaXR5ID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBkaXN0cmljdCwgY2FyZWxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb2xkY2hhaW4vYXBpL3JlZnJpZ2VyYXRvcnMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0UXVhcnRlcjogc3RhcnRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBlbmRRdWFydGVyOiBlbmRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3QsXG4gICAgICAgICAgICAgICAgICAgIGNhcmVsZXZlbDogY2FyZWxldmVsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBnZXRGcmlkZ2VEaXN0cmljdFJlZnJpZ2VyYXRvciA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY29sZGNoYWluL2FwaS9kaXN0cmljdHJlZnJpZ2VyYXRvcnMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0UXVhcnRlcjogc3RhcnRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBlbmRRdWFydGVyOiBlbmRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3QsXG4gICAgICAgICAgICAgICAgICAgIGNhcmVsZXZlbDogY2FyZWxldmVsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldEZyaWRnZUZhY2lsaXR5UmVmcmlnZXJhdG9yID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBkaXN0cmljdCwgY2FyZWxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb2xkY2hhaW4vYXBpL2ZhY2lsaXR5cmVmcmlnZXJhdG9ycycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRRdWFydGVyOiBzdGFydFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGVuZFF1YXJ0ZXI6IGVuZFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgY2FyZWxldmVsOiBjYXJlbGV2ZWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0RnJpZGdlSW1tdW5pemluZ0ZhY2lsaXR5ID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBkaXN0cmljdCwgY2FyZWxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb2xkY2hhaW4vYXBpL2ltbXVuaXppbmdmYWNpbGl0aWVzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydFF1YXJ0ZXI6IHN0YXJ0UXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZW5kUXVhcnRlcjogZW5kUXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICBjYXJlbGV2ZWw6IGNhcmVsZXZlbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgZ2V0RnJpZGdlRGlzdHJpY3RJbW11bml6aW5nRmFjaWxpdHkgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGRpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvbGRjaGFpbi9hcGkvZGlzdHJpY3RpbW11bml6aW5nZmFjaWxpdGllcycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRRdWFydGVyOiBzdGFydFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGVuZFF1YXJ0ZXI6IGVuZFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgY2FyZWxldmVsOiBjYXJlbGV2ZWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0RnJpZGdlQ2FwYWNpdHlNZXRyaWNzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgdmFyIHN1cnAgPSAwO1xuICAgICAgICAgICAgdmFyIHN1ZmZpY2llbnQgPSAwO1xuICAgICAgICAgICAgdmFyIHNob3J0YWdlID0gMDtcblxuICAgICAgICAgICAgZm9yKHZhciBpPTA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICB2YXIgc3VycGx1c1ZhbHVlID0gZGF0YVtpXS5zdXJwbHVzXG4gICAgICAgICAgICAgICAgaWYgKHN1cnBsdXNWYWx1ZSA+IDMwKSBzdXJwKys7XG4gICAgICAgICAgICAgICAgZWxzZSBpZihzdXJwbHVzVmFsdWUgPDMwICYmIHN1cnBsdXNWYWx1ZSA+PSAwKSBzdWZmaWNpZW50Kys7XG4gICAgICAgICAgICAgICAgZWxzZSBpZihzdXJwbHVzVmFsdWUgPCAwKSBzaG9ydGFnZSsrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICdzdXJwbHVzJzogc3VycCxcbiAgICAgICAgICAgICAgICAnc3VmZmljaWVudCc6IHN1ZmZpY2llbnQsXG4gICAgICAgICAgICAgICAgJ3Nob3J0YWdlJzogc2hvcnRhZ2UsXG4gICAgICAgICAgICAgICAgJ3RvdGFsJzogc3VycCArIHN1ZmZpY2llbnQgKyBzaG9ydGFnZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJnZXRGcmlkZ2VDYXBhY2l0eVwiOiBnZXRGcmlkZ2VDYXBhY2l0eSxcbiAgICAgICAgICAgIFwiZ2V0RnJpZGdlRGlzdHJpY3RDYXBhY2l0eVwiOiBnZXRGcmlkZ2VEaXN0cmljdENhcGFjaXR5LFxuICAgICAgICAgICAgXCJnZXRGcmlkZ2VGYWNpbGl0eUNhcGFjaXR5XCI6IGdldEZyaWRnZUZhY2lsaXR5Q2FwYWNpdHksXG4gICAgICAgICAgICBcImdldEZyaWRnZUZ1bmN0aW9uYWxpdHlcIjogZ2V0RnJpZGdlRnVuY3Rpb25hbGl0eSxcbiAgICAgICAgICAgIFwiZ2V0RnJpZGdlSW1tdW5pemluZ0ZhY2lsaXR5XCI6IGdldEZyaWRnZUltbXVuaXppbmdGYWNpbGl0eSxcbiAgICAgICAgICAgIFwiZ2V0RnJpZGdlRGlzdHJpY3RSZWZyaWdlcmF0b3JcIjpnZXRGcmlkZ2VEaXN0cmljdFJlZnJpZ2VyYXRvcixcbiAgICAgICAgICAgIFwiZ2V0RnJpZGdlRmFjaWxpdHlSZWZyaWdlcmF0b3JcIjpnZXRGcmlkZ2VGYWNpbGl0eVJlZnJpZ2VyYXRvcixcbiAgICAgICAgICAgIFwiZ2V0RnJpZGdlRGlzdHJpY3RJbW11bml6aW5nRmFjaWxpdHlcIjpnZXRGcmlkZ2VEaXN0cmljdEltbXVuaXppbmdGYWNpbGl0eSxcbiAgICAgICAgICAgIFwiZ2V0RnJpZGdlQ2FwYWNpdHlNZXRyaWNzXCI6IGdldEZyaWRnZUNhcGFjaXR5TWV0cmljc1xuICAgICAgICB9O1xuICAgIH1cbl0pXG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJylcbiAgICAuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCBbJyRzY29wZScsICdGaWx0ZXJTZXJ2aWNlJywgJ01vbnRoU2VydmljZScsICckcm9vdFNjb3BlJywgJyRsb2NhdGlvbicsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCBGaWx0ZXJTZXJ2aWNlLCBNb250aFNlcnZpY2UsICRyb290U2NvcGUsICRsb2NhdGlvbilcbiAgICB7XG4gICAgICAgICRzY29wZS5zb3J0VHlwZSAgICAgPSAnbmFtZSc7IC8vIHNldCB0aGUgZGVmYXVsdCBzb3J0IHR5cGVcbiAgICAgICAgJHNjb3BlLnNvcnRSZXZlcnNlICA9IGZhbHNlOyAgLy8gc2V0IHRoZSBkZWZhdWx0IHNvcnQgb3JkZXJcbiAgICAgICAgJHNjb3BlLnNlYXJjaFRleHQgICA9ICcnOyAgICAgLy8gc2V0IHRoZSBkZWZhdWx0IHNlYXJjaC9maWx0ZXIgdGVybVxuXG4gICAgICAgICRzY29wZS5yb290ID0ge307XG4gICAgICAgIHZhciBzaGVsbCA9IHRoaXM7XG5cbiAgICAgICAgJHNjb3BlLiRvbignc2V0RGVmYXVsdFllYXJzJywgZnVuY3Rpb24oZSwgc3RhcnRZZWFyLCBlbmRZZWFyKSB7XG4gICAgICAgICAgICBzaGVsbC5maW5hbmNlU3RhcnRZZWFyID0gc3RhcnRZZWFyO1xuICAgICAgICAgICAgc2hlbGwuZmluYW5jZUVuZFllYXIgPSBlbmRZZWFyO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLz09PSBTdG9jayBNYW5hZ2VtZW50ID09PT09PT1cbiAgICAgICAgc2hlbGwuc3RhcnRNb250aCA9IHNoZWxsLnN0YXJ0TW9udGggPyBzaGVsbC5zdGFydE1vbnRoLm5hbWUgOiBcIk5vdiAyMDE1XCI7XG4gICAgICAgIHNoZWxsLmVuZE1vbnRoID0gc2hlbGwuZW5kTW9udGggPyBzaGVsbC5lbmRNb250aC5uYW1lIDogXCJEZWMgMjAxNVwiO1xuICAgICAgICBzaGVsbC5zZWxlY3RlZFZhY2NpbmUgPSBcIlwiO1xuICAgICAgICBzaGVsbC5zZWxlY3RlZERpc3RyaWN0ID0gXCJcIjtcbiAgICAgICAgc2hlbGwuZGVmYXVsdFBlcmlvZCA9IFwiXCI7XG5cbiAgICAgICAgRmlsdGVyU2VydmljZS5nZXRNb250aHMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHNoZWxsLm1vbnRocyA9IGRhdGE7XG4gICAgICAgICAgICBzaGVsbC5zdGFydE1vbnRoID0gc2hlbGwubW9udGhzWzBdO1xuICAgICAgICAgICAgLy9zaGVsbC5lbmRNb250aCA9IHNoZWxsLm1vbnRoc1tkZWZhdWx0TW9udGhdO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBZGQgQW50aWdlbiBmaWx0ZXJzIHZhbHVlc1xuICAgICAgICB2YXIgYW50aWdlbnMgPSB7XG4gICAgICAgICAgICBcIkFMTFwiOiBbJ0Rvc2UgMScsICdEb3NlIDInLCAnRG9zZSAzJ10sXG4gICAgICAgICAgICBcIkhQVlwiOiBbJ0Rvc2UgMScsICdEb3NlIDInXSxcbiAgICAgICAgICAgIFwiRFBUXCI6IFsnRG9zZSAxJywgJ0Rvc2UgMicsICdEb3NlIDMnXSxcbiAgICAgICAgICAgIFwiUENWXCI6IFsnRG9zZSAxJywgJ0Rvc2UgMicsICdEb3NlIDMnXSxcbiAgICAgICAgICAgIFwiSVBWXCI6IFsnRG9zZSAxJ10sXG4gICAgICAgICAgICBcIk9QVlwiOiBbJ0Rvc2UgMScsICdEb3NlIDInLCAnRG9zZSAzJ10sXG4gICAgICAgICAgICBcIkJDR1wiOiBbJ0Rvc2UgMSddLFxuICAgICAgICAgICAgXCJNRUFTTEVTXCI6IFsnRG9zZSAxJ10sXG4gICAgICAgICAgICBcIlRUXCI6IFsnRG9zZSAxJywgJ0Rvc2UgMiddXG4gICAgICAgIH1cblxuICAgICAgICBzaGVsbC51cGRhdGVEb3NlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2hlbGwuZG9zZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHNoZWxsLmRvc2VzID0gYW50aWdlbnNbc2hlbGwuYW50aWdlbl1cbiAgICAgICAgICAgIC8vc2hlbGwuZG9zZXMgPSBbJ0Rvc2UgMScsICdEb3NlIDInLCAnRG9zZSAzJ107Ly9hbnRpZ2Vuc1tzaGVsbC5hbnRpZ2VuXVxuXG4gICAgICAgICAgICBpZiAoc2hlbGwuZG9zZXMubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgICAgICBzaGVsbC5kb3NlID0gc2hlbGwuZG9zZXNbc2hlbGwuZG9zZXMubGVuZ3RoLTFdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHNoZWxsLmFudGlnZW5zID0gT2JqZWN0LmtleXMoYW50aWdlbnMpO1xuXG4gICAgICAgIGlmICgkbG9jYXRpb24ucGF0aCgpID09ICcvY292ZXJhZ2UvcmVkY2F0ZWdvcnknKSB7XG4gICAgICAgICAgICBzaGVsbC5hbnRpZ2VuID0gXCJEUFRcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNoZWxsLmFudGlnZW4gPSBcIkFMTFwiO1xuICAgICAgICB9XG4gICAgICAgIHNoZWxsLnVwZGF0ZURvc2VzKCk7XG5cbiAgICAgICAgRmlsdGVyU2VydmljZS5nZXRQZXJpb2RSYW5nZXMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHNoZWxsLmNvdmVyYWdlWWVhcnMgPSBkYXRhLnllYXJzXG4gICAgICAgICAgICBzaGVsbC5zdGFydFllYXIgPSBkYXRhLnllYXJzW2RhdGEueWVhcnMubGVuZ3RoLTFdXG4gICAgICAgICAgICBzaGVsbC5lbmRZZWFyID0gZGF0YS55ZWFyc1tkYXRhLnllYXJzLmxlbmd0aC0xXVxuICAgICAgICAgICAgc2hlbGwuYWN0aXZlQ292ZXJhZ2VZZWFyID0gZGF0YS55ZWFyc1tkYXRhLnllYXJzLmxlbmd0aC0xXVxuICAgICAgICB9KTtcblxuXG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgRmlsdGVyU2VydmljZS5nZXRMYXN0UGVyaW9kKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBzaGVsbC5kZWZhdWx0UGVyaW9kID0gZGF0YTtcbiAgICAgICAgICAgIHNoZWxsLmRlZmF1bHRNb250aCA9IHBhcnNlSW50KGRhdGEucGVyaW9kLnRvU3RyaW5nKCkuc3Vic3RyaW5nKDQsIDYpKTtcbiAgICAgICAgICAgICRzY29wZS5kZWZhdWx0TW9udGggPSBzaGVsbC5kZWZhdWx0TW9udGg7XG4gICAgICAgICAgICAkc2NvcGUuZGVmYXVsdFBlcmlvZCA9IGRhdGEucGVyaW9kLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIHZhciBwZXJpb2QgPSBkYXRhLnBlcmlvZC50b1N0cmluZygpO1xuICAgICAgICAgICAgdmFyIG1vbnRoX251bWJlciA9IHBhcnNlSW50KHBlcmlvZC5zdWJzdHJpbmcoNCw2KSk7XG4gICAgICAgICAgICB2YXIgbW9udGhfbGFiZWwgPSBNb250aFNlcnZpY2UuZ2V0TW9udGhOYW1lKG1vbnRoX251bWJlcik7XG4gICAgICAgICAgICAvL3NoZWxsLmVuZE1vbnRoID0ge3llYXI6cGVyaW9kLnN1YnN0cmluZygwLDQpLCBwZXJpb2Q6cGVyaW9kLCBuYW1lOm1vbnRoX2xhYmVsLCBtb250aDptb250aF9udW1iZXIsIFwiJCRoYXNoS2V5XCI6XCJvYmplY3Q6MTg2XCJ9XG4gICAgICAgICAgICAvL3NoZWxsLmVuZE1vbnRoID0gc2hlbGwubW9udGhzW3NoZWxsLmRlZmF1bHRNb250aC0xXTtcblxuICAgICAgICAgICAgdmFyIGVuZE1vbnRoSW5kZXggPSAwO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHNoZWxsLm1vbnRocykge1xuICAgICAgICAgICAgICAgIGlmIChzaGVsbC5tb250aHNbaV0ucGVyaW9kID09IHBlcmlvZCkge1xuICAgICAgICAgICAgICAgICAgICBzaGVsbC5lbmRNb250aCA9IHNoZWxsLm1vbnRoc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgZW5kTW9udGhJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9zZXQgdGhlIHN0YXJ0IHBlcmlvZCB0byA2IG1vbnRocyBiYWNrIGJ5IGRlZmF1bHRcbiAgICAgICAgICAgIHZhciBzdGFydE1vbnRoSW5kZXggPSAoZW5kTW9udGhJbmRleCAtIDYpICsgMTtcbiAgICAgICAgICAgIGlmIChzdGFydE1vbnRoSW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgICAgc3RhcnRNb250aEluZGV4ID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNoZWxsLm1vbnRocyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBzaGVsbC5zdGFydE1vbnRoID0gc2hlbGwubW9udGhzW3N0YXJ0TW9udGhJbmRleF07XG4gICAgICAgICAgICB9XG5cblxuXG5cblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImRlcmVcIitKU09OLnN0cmluZ2lmeShzaGVsbC5tb250aHNbMTNdKSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2hlbGwuc3RvY2thdGhhbmQgPSAwO1xuXG5cblxuICAgICAgICBGaWx0ZXJTZXJ2aWNlLmdldERpc3RyaWN0cygpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgdmFyIGRpc3RyaWN0U3BlY2lmaWNQYXRocyA9IFtcbiAgICAgICAgICAgICAgICAnL3N0b2NrL2Rpc3RyaWJ1dGlvbicsXG4gICAgICAgICAgICAgICAgLy8gJy9zdG9jay91cHRha2VyYXRlJyxcbiAgICAgICAgICAgICAgICAvLyAnL3VuZXBpL2Rvd25sb2FkJ1xuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIGlmIChkaXN0cmljdFNwZWNpZmljUGF0aHMuaW5kZXhPZigkbG9jYXRpb24ucGF0aCgpKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIGRhdGEudW5zaGlmdCh7J25hbWUnOiAnTmF0aW9uYWwnfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNoZWxsLmRpc3RyaWN0cyA9IGRhdGE7XG4gICAgICAgICAgICBzaGVsbC5zZWxlY3RlZERpc3RyaWN0ID0gc2hlbGwuZGlzdHJpY3RzWzBdO1xuICAgICAgICAgICAgc2hlbGwuZGlzdHJpY3QgPSBzaGVsbC5kaXN0cmljdHNbMF0ubmFtZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgRmlsdGVyU2VydmljZS5nZXRWYWNjaW5lcygpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgc2hlbGwudmFjY2luZXMgPSBkYXRhO1xuICAgICAgICAgICAgc2hlbGwuc2VsZWN0ZWRWYWNjaW5lID0gc2hlbGwudmFjY2luZXNbNV07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vPT09PSBFbmQgU3RvY2sgTWFuYWdlbWVudCA9PT09PVxuXG5cbiAgICAgICAgLy89PT09PT09PVBsYW5uaW5nPT09PT09PT09XG4gICAgICAgIHNoZWxsLnNlbGVjdGVkWWVhciA9IFwiXCI7XG4gICAgICAgIEZpbHRlclNlcnZpY2UuZ2V0WWVhcigpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBzaGVsbC55ZWFycyA9IGRhdGE7XG4gICAgICAgICAgICBzaGVsbC5zZWxlY3RlZFllYXIgPSBzaGVsbC55ZWFyc1swXTtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICAvLz09PSBDb2xkIGNoYWluID09PT09PVxuICAgICAgICBzaGVsbC5zdGFydFF1YXJ0ZXIgPSBzaGVsbC5zdGFydFF1YXJ0ZXIgPyBzaGVsbC5zdGFydFF1YXJ0ZXIubmFtZSA6IFwiMjAxNjAxXCI7XG4gICAgICAgIHNoZWxsLmVuZFF1YXJ0ZXIgPSBzaGVsbC5lbmRRdWFydGVyID8gc2hlbGwuZW5kUXVhcnRlci5uYW1lIDogXCIyMDE2MDNcIjtcbiAgICAgICAgc2hlbGwuc2VsZWN0ZWRGcmlkZ2VEaXN0cmljdCA9IFwiXCI7XG4gICAgICAgIHNoZWxsLnNlbGVjdGVkRnJpZGdlQ2FyZUxldmVsID0gXCJcIjtcblxuXG4gICAgICAgIEZpbHRlclNlcnZpY2UuZ2V0RnJpZGdlRGlzdHJpY3RzKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBzaGVsbC5mcmlkZ2VEaXN0cmljdHMgPSBkYXRhO1xuICAgICAgICAgICAgc2hlbGwuc2VsZWN0ZWRGcmlkZ2VEaXN0cmljdCA9IHNoZWxsLmZyaWRnZURpc3RyaWN0c1swXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgRmlsdGVyU2VydmljZS5nZXRGcmlkZ2VDYXJlTGV2ZWxzKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBzaGVsbC5mcmlkZ2VDYXJlTGV2ZWxzID0gZGF0YTtcbiAgICAgICAgICAgIC8vc2hlbGwuc2VsZWN0ZWRGcmlkZ2VDYXJlTGV2ZWwgPSBzaGVsbC5mcmlkZ2VDYXJlTGV2ZWxzWzBdO1xuICAgICAgICB9KTtcblxuICAgICAgICBGaWx0ZXJTZXJ2aWNlLmdldEZyaWRnZVF1YXJ0ZXJzKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBzaGVsbC5mcmlkZ2VRdWFydGVycyA9IGRhdGE7XG4gICAgICAgICAgIC8vIHNoZWxsLnNlbGVjdGVkRnJpZGdlUXVhcnRlciA9IHNoZWxsLmZyaWRnZVF1YXJ0ZXJzWzNdO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLz09PT0gRW5kIENvbGQgQ2hhaW4gPT09PT09PVxuXG5cbi8vICAgICAgICAkc2NvcGUuJHdhdGNoKCdzaGVsbC5lbmRNb250aCcsIGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICBpZiAoc2hlbGwuZW5kTW9udGgpIHtcbi8vICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncmVmcmVzaCcsIHNoZWxsLnN0YXJ0TW9udGgsIHNoZWxsLmVuZE1vbnRoLCBzaGVsbC5zZWxlY3RlZERpc3RyaWN0LCBzaGVsbC5zZWxlY3RlZFZhY2NpbmUpO1xuLy8gICAgICAgICAgICB9XG4vLyAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaEdyb3VwKFsnc2hlbGwuZW5kTW9udGgnLCAnc2hlbGwuc2VsZWN0ZWRWYWNjaW5lJywgJ3NoZWxsLnNlbGVjdGVkRGlzdHJpY3QnXSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgIGlmKGRhdGFbMF0gJiYgZGF0YVsxXSAmJiBkYXRhWzJdKXtcbiAgICAgICAgICAgICAgICBpZiAoc2hlbGwuZW5kTW9udGgpIHtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdyZWZyZXNoJywgc2hlbGwuc3RhcnRNb250aCwgc2hlbGwuZW5kTW9udGgsIHNoZWxsLnNlbGVjdGVkRGlzdHJpY3QsIHNoZWxsLnNlbGVjdGVkVmFjY2luZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoR3JvdXAoWydzaGVsbC5maW5hbmNlU3RhcnRZZWFyJywgJ3NoZWxsLmZpbmFuY2VFbmRZZWFyJ10sIGZ1bmN0aW9uKGRhdGEsIG9sZERhdGEpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncmVmcmVzaEZpbmFuY2UnLCB7XG4gICAgICAgICAgICAgICAgc3RhcnRZZWFyOiBzaGVsbC5maW5hbmNlU3RhcnRZZWFyLFxuICAgICAgICAgICAgICAgIGVuZFllYXI6IHNoZWxsLmZpbmFuY2VFbmRZZWFyLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2hHcm91cChcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnc2hlbGwuc3RhcnRZZWFyJyxcbiAgICAgICAgICAgICAgICAnc2hlbGwuZW5kWWVhcicsXG4gICAgICAgICAgICAgICAgJ3NoZWxsLmFjdGl2ZUNvdmVyYWdlWWVhcicsXG4gICAgICAgICAgICAgICAgJ3NoZWxsLmFudGlnZW4nLFxuICAgICAgICAgICAgICAgICdzaGVsbC5kb3NlJyxcbiAgICAgICAgICAgICAgICAnc2hlbGwuZGlzdHJpY3QnXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgaWYoZGF0YVswXSl7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzaGVsbC5lbmRNb250aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdyZWZyZXNoQ292ZXJhZ2UyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbC5lbmRNb250aCwgLy9CYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsLnN0YXJ0WWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbC5lbmRZZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsLmFjdGl2ZUNvdmVyYWdlWWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbC5hbnRpZ2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsLmRvc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGwuZGlzdHJpY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncmVmcmVzaENvdmVyYWdlMycsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRNb250aDogc2hlbGwuZW5kTW9udGgsIC8vQmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFllYXI6IHNoZWxsLnN0YXJ0WWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRZZWFyOiBzaGVsbC5lbmRZZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZUNvdmVyYWdlWWVhcjogc2hlbGwuYWN0aXZlQ292ZXJhZ2VZZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFudGlnZW46IHNoZWxsLmFudGlnZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9zZTogc2hlbGwuZG9zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogc2hlbGwuZGlzdHJpY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRydWVcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBEaXNhYmxlZCBiZWNhdXNlIGl0IGxvb2tzIGxpa2UgYSBkdXBsaWNhdGlvblxuICAgICAgICAvKiRzY29wZS4kd2F0Y2goJ3NoZWxsLmVuZFF1YXJ0ZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChzaGVsbC5lbmRRdWFydGVyKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdyZWZyZXNoQ2FwYWNpdHknLCBzaGVsbC5zdGFydFF1YXJ0ZXIsIHNoZWxsLmVuZFF1YXJ0ZXIsIHNoZWxsLnNlbGVjdGVkRnJpZGdlRGlzdHJpY3QsIHNoZWxsLnNlbGVjdGVkRnJpZGdlQ2FyZUxldmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7Ki9cblxuICAgICAgICAkc2NvcGUuJHdhdGNoR3JvdXAoWydzaGVsbC5lbmRRdWFydGVyJywgJ3NoZWxsLnNlbGVjdGVkRnJpZGdlRGlzdHJpY3QnLCAnc2hlbGwuc2VsZWN0ZWRGcmlkZ2VDYXJlTGV2ZWwnLCAnc2hlbGwuc3RhcnRRdWFydGVyJ10sIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgaWYoZGF0YVswXSAmJiBkYXRhWzFdKXtcbiAgICAgICAgICAgICAgICBpZiAoc2hlbGwuZW5kUXVhcnRlciAmJiBzaGVsbC5zZWxlY3RlZEZyaWRnZURpc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncmVmcmVzaENhcGFjaXR5Jywgc2hlbGwuc3RhcnRRdWFydGVyLCBzaGVsbC5lbmRRdWFydGVyLCBzaGVsbC5zZWxlY3RlZEZyaWRnZURpc3RyaWN0LCBzaGVsbC5zZWxlY3RlZEZyaWRnZUNhcmVMZXZlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgJHNjb3BlLiR3YXRjaCgnc2hlbGwueWVhcnMnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYgKHNoZWxsLnNlbGVjdGVkWWVhcil7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdyZWZyZXNoQXdwJywgc2hlbGwuc2VsZWN0ZWRZZWFyKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoR3JvdXAoWydzaGVsbC55ZWFycyddLCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGlmKGRhdGFbMF0gJiYgZGF0YVsxXSl7XG4gICAgICAgICAgICAgICAgaWYgKHNoZWxsLnNlbGVjdGVkWWVhcikge1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3JlZnJlc2hBd3AnLCBzaGVsbC5zZWxlY3RlZFllYXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaCgnc2hlbGwuY292ZXJhZ2VQZXJpb2QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChzaGVsbC5jb3ZlcmFnZVBlcmlvZCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncmVmcmVzaENvdmVyYWdlJywgc2hlbGwuY292ZXJhZ2VQZXJpb2QsIHNoZWxsLnNlbGVjdGVkRGlzdHJpY3QsIHNoZWxsLnNlbGVjdGVkVmFjY2luZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2hHcm91cChbJ3NoZWxsLmNvdmVyYWdlUGVyaW9kJywgJ3NoZWxsLnNlbGVjdGVkRGlzdHJpY3QnLCAnc2hlbGwuc2VsZWN0ZWRWYWNjaW5lJ10sIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgaWYoZGF0YVswXSAmJiBkYXRhWzFdICYmIGRhdGFbMl0pe1xuICAgICAgICAgICAgICAgIGlmIChzaGVsbC5jb3ZlcmFnZVBlcmlvZCkge1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3JlZnJlc2hDb3ZlcmFnZScsIHNoZWxsLmNvdmVyYWdlUGVyaW9kLCBzaGVsbC5zZWxlY3RlZERpc3RyaWN0LCBzaGVsbC5zZWxlY3RlZFZhY2NpbmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaCgnc2hlbGwuY292ZXJhZ2VQZXJpb2QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChzaGVsbC5jb3ZlcmFnZVBlcmlvZCAmJiBzaGVsbC5zZWxlY3RlZERpc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdyZWZyZXNoVW5lcGknLCBzaGVsbC5jb3ZlcmFnZVBlcmlvZCwgc2hlbGwuc2VsZWN0ZWREaXN0cmljdCwgc2hlbGwuc2VsZWN0ZWRWYWNjaW5lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaEdyb3VwKFsnc2hlbGwuY292ZXJhZ2VQZXJpb2QnLCAnc2hlbGwuc2VsZWN0ZWREaXN0cmljdCcsICdzaGVsbC5zZWxlY3RlZFZhY2NpbmUnXSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBpZihkYXRhWzBdICYmIGRhdGFbMV0gJiYgZGF0YVsyXSl7XG4gICAgICAgICAgICAgICAgaWYgKHNoZWxsLmNvdmVyYWdlUGVyaW9kICYmIHNoZWxsLnNlbGVjdGVkRGlzdHJpY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdyZWZyZXNoVW5lcGknLCBzaGVsbC5jb3ZlcmFnZVBlcmlvZCwgc2hlbGwuc2VsZWN0ZWREaXN0cmljdCwgc2hlbGwuc2VsZWN0ZWRWYWNjaW5lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG5cbiAgICB9XG5dKTtcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdzZXJ2aWNlcycpLnNlcnZpY2UoJ01hcFN1cHBvcnRTZXJ2aWNlJywgW1xuICAgIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBjcmVhdGVEaXN0cmljdERhdGFNYXAgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB2YXIgZGF0YURpc3RyaWN0TWFwID0ge307XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gZGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciBwZXJpb2QgPSBkYXRhW2ldLnBlcmlvZDtcbiAgICAgICAgICAgICAgICB2YXIgZmlyc3RfZG9zZSA9IGRhdGFbaV0udG90YWxfZmlyc3RfZG9zZTtcbiAgICAgICAgICAgICAgICB2YXIgc2Vjb25kX2Rvc2UgPSBkYXRhW2ldLnRvdGFsX3NlY29uZF9kb3NlO1xuICAgICAgICAgICAgICAgIHZhciB0aGlyZF9kb3NlID0gZGF0YVtpXS50b3RhbF90aGlyZF9kb3NlO1xuICAgICAgICAgICAgICAgIHZhciBsYXN0X2Rvc2UgPSBkYXRhW2ldLnRvdGFsX2xhc3RfZG9zZTtcbiAgICAgICAgICAgICAgICB2YXIgcGxhbm5lZCA9IGRhdGFbaV0udG90YWxfcGxhbm5lZDtcbiAgICAgICAgICAgICAgICB2YXIgdmFjY2luZSA9IGRhdGFbaV0udmFjY2luZV9fbmFtZTtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdHJpY3QgPSBkYXRhW2ldLmRpc3RyaWN0X19uYW1lO1xuICAgICAgICAgICAgICAgIHZhciBwZXJpb2RZZWFyID0gTnVtYmVyKHBlcmlvZC50b1N0cmluZygpLnN1YnN0cigwLCA0KSk7XG4gICAgICAgICAgICAgICAgdmFyIHBlcmlvZE1vbnRoID0gTnVtYmVyKHBlcmlvZC50b1N0cmluZygpLnN1YnN0cig0LCA2KSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoISAoZGlzdHJpY3QgaW4gZGF0YURpc3RyaWN0TWFwKSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhRGlzdHJpY3RNYXBbZGlzdHJpY3RdID0ge307XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCEgKHZhY2NpbmUgaW4gZGF0YURpc3RyaWN0TWFwW2Rpc3RyaWN0XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YURpc3RyaWN0TWFwW2Rpc3RyaWN0XVt2YWNjaW5lXSA9IHt9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghIChwZXJpb2RZZWFyIGluIGRhdGFEaXN0cmljdE1hcFtkaXN0cmljdF1bdmFjY2luZV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFEaXN0cmljdE1hcFtkaXN0cmljdF1bdmFjY2luZV1bcGVyaW9kWWVhcl0gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoISAocGVyaW9kTW9udGggaW4gZGF0YURpc3RyaWN0TWFwW2Rpc3RyaWN0XVt2YWNjaW5lXVtwZXJpb2RZZWFyXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YURpc3RyaWN0TWFwW2Rpc3RyaWN0XVt2YWNjaW5lXVtwZXJpb2RZZWFyXVtwZXJpb2RNb250aF0gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkYXRhRGlzdHJpY3RNYXBbZGlzdHJpY3RdW3ZhY2NpbmVdW3BlcmlvZFllYXJdW3BlcmlvZE1vbnRoXS5maXJzdF9kb3NlID0gZmlyc3RfZG9zZTtcbiAgICAgICAgICAgICAgICBkYXRhRGlzdHJpY3RNYXBbZGlzdHJpY3RdW3ZhY2NpbmVdW3BlcmlvZFllYXJdW3BlcmlvZE1vbnRoXS5sYXN0X2Rvc2UgPSBsYXN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgZGF0YURpc3RyaWN0TWFwW2Rpc3RyaWN0XVt2YWNjaW5lXVtwZXJpb2RZZWFyXVtwZXJpb2RNb250aF0uc2Vjb25kX2Rvc2UgPSBzZWNvbmRfZG9zZTtcbiAgICAgICAgICAgICAgICBkYXRhRGlzdHJpY3RNYXBbZGlzdHJpY3RdW3ZhY2NpbmVdW3BlcmlvZFllYXJdW3BlcmlvZE1vbnRoXS50aGlyZF9kb3NlID0gdGhpcmRfZG9zZTtcbiAgICAgICAgICAgICAgICBkYXRhRGlzdHJpY3RNYXBbZGlzdHJpY3RdW3ZhY2NpbmVdW3BlcmlvZFllYXJdW3BlcmlvZE1vbnRoXS5wbGFubmVkID0gcGxhbm5lZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGRhdGFEaXN0cmljdE1hcDtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0UGVyaW9kTGlzdCA9IGZ1bmN0aW9uKGRhdGEsIGVuZFllYXIsIHJlcG9ydFRvZ2dsZSkge1xuICAgICAgICAgICAgdmFyIHBlcmlvZExpc3QgPSBbXTtcblxuICAgICAgICAgICAgaWYgKHJlcG9ydFRvZ2dsZSA9PSAnTUNZJykge1xuICAgICAgICAgICAgICAgIHBlcmlvZExpc3QucHVzaChcbiAgICAgICAgICAgICAgICAgICAgW2VuZFllYXIudG9TdHJpbmcoKSwgIGdldExhc3RWYWx1ZShkYXRhW2VuZFllYXJdLCAxMildXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXBvcnRUb2dnbGUgPT0gJ01GWScpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFllYXIgPSBlbmRZZWFyICsgMTtcbiAgICAgICAgICAgICAgICB2YXIgbGFzdFZhbHVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5leHRZZWFyIGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gZ2V0TGFzdFZhbHVlKGRhdGFbbmV4dFllYXJdLCA2KTtcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kTGlzdC5wdXNoKFtuZXh0WWVhci50b1N0cmluZygpLCBsYXN0VmFsdWVdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBnZXRMYXN0VmFsdWUoZGF0YVtlbmRZZWFyXSwgMTIpO1xuICAgICAgICAgICAgICAgICAgICBwZXJpb2RMaXN0LnB1c2goW2VuZFllYXIudG9TdHJpbmcoKSwgbGFzdFZhbHVlXSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlcG9ydFRvZ2dsZSA9PSAnQUNZJykge1xuICAgICAgICAgICAgICAgIHBlcmlvZExpc3QucHVzaC5hcHBseShwZXJpb2RMaXN0LFxuICAgICAgICAgICAgICAgICAgICBnZXRWYWx1ZXNJblJhbmdlKFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kWWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldExhc3RWYWx1ZShkYXRhW2VuZFllYXJdLCAxMilcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVwb3J0VG9nZ2xlID09ICdBRlknKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRZZWFyID0gZW5kWWVhciArIDE7XG5cbiAgICAgICAgICAgICAgICBpZiAobmV4dFllYXIgaW4gZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBwZXJpb2RMaXN0LnB1c2guYXBwbHkocGVyaW9kTGlzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldFZhbHVlc0luUmFuZ2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRZZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TGFzdFZhbHVlKGRhdGFbbmV4dFllYXJdLCA2KVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZExpc3QucHVzaC5hcHBseShwZXJpb2RMaXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0VmFsdWVzSW5SYW5nZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgNyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRZZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldExhc3RWYWx1ZShkYXRhW2VuZFllYXJdLCAxMilcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHBlcmlvZExpc3Q7XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QWdncmVnYXRlcyhkYXRhLCBwZXJpb2RMaXN0KSB7XG4gICAgICAgICAgICByZXR1cm4gcGVyaW9kTGlzdC5yZWR1Y2UoZnVuY3Rpb24oYWNjLCBwZXJpb2QpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSA9PSB1bmRlZmluZWQgfHwgZGF0YVtwZXJpb2RbMF1dID09IHVuZGVmaW5lZCB8fCBkYXRhW3BlcmlvZFswXV1bcGVyaW9kWzFdXSA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBkYXRhW3BlcmlvZFswXV1bcGVyaW9kWzFdXTtcbiAgICAgICAgICAgICAgICBhY2MudG90YWxQbGFubmVkICs9IGl0ZW0ucGxhbm5lZDtcbiAgICAgICAgICAgICAgICBhY2MudG90YWxGaXJzdERvc2UgKz0gaXRlbS5maXJzdF9kb3NlO1xuICAgICAgICAgICAgICAgIGFjYy50b3RhbFNlY29uZERvc2UgKz0gaXRlbS5zZWNvbmRfZG9zZTtcbiAgICAgICAgICAgICAgICBhY2MudG90YWxUaGlyZERvc2UgKz0gaXRlbS50aGlyZF9kb3NlO1xuICAgICAgICAgICAgICAgIGFjYy50b3RhbExhc3REb3NlICs9IGl0ZW0ubGFzdF9kb3NlO1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICB9LCB7dG90YWxQbGFubmVkOiAwLCB0b3RhbEZpcnN0RG9zZTowLCB0b3RhbFNlY29uZERvc2U6MCwgdG90YWxUaGlyZERvc2U6MCwgdG90YWxMYXN0RG9zZTowfSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2FsY3VsYXRlQ292ZXJhZ2VSYXRlID0gZnVuY3Rpb24oZGF0YSwgcGVyaW9kTGlzdCwgZG9zZU51bWJlcikge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGdldEFnZ3JlZ2F0ZXMoZGF0YSwgcGVyaW9kTGlzdCk7XG4gICAgICAgICAgICB2YXIgZG9zZVZhbHVlID0gcmVzdWx0LnRvdGFsTGFzdERvc2U7XG4gICAgICAgICAgICBpZiAoZG9zZU51bWJlciA9PSAxKSBkb3NlVmFsdWUgPSByZXN1bHQudG90YWxGaXJzdERvc2U7XG4gICAgICAgICAgICBlbHNlIGlmIChkb3NlTnVtYmVyID09IDIpIGRvc2VWYWx1ZSA9IHJlc3VsdC50b3RhbFNlY29uZERvc2U7XG4gICAgICAgICAgICBlbHNlIGlmIChkb3NlTnVtYmVyID09IDMpIGRvc2VWYWx1ZSA9IHJlc3VsdC50b3RhbFRoaXJkRG9zZTtcbiAgICAgICAgICAgIHJldHVybiAoZG9zZVZhbHVlIC8gcmVzdWx0LnRvdGFsUGxhbm5lZCkgKiAxMDA7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGNhbGN1bGF0ZURyb3BvdXRSYXRlID0gZnVuY3Rpb24oZGF0YSwgcGVyaW9kTGlzdCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGdldEFnZ3JlZ2F0ZXMoZGF0YSwgcGVyaW9kTGlzdCk7XG4gICAgICAgICAgICByZXR1cm4gKChyZXN1bHQudG90YWxGaXJzdERvc2UgLSByZXN1bHQudG90YWxMYXN0RG9zZSkgLyByZXN1bHQudG90YWxGaXJzdERvc2UpICogMTAwO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBjYWxjdWxhdGVSZWRDYXRlZ29yeVZhbHVlID0gZnVuY3Rpb24oZGF0YSwgcGVyaW9kTGlzdCkge1xuICAgICAgICAgICAgdmFyIHIgPSBnZXRBZ2dyZWdhdGVzKGRhdGEsIHBlcmlvZExpc3QpO1xuICAgICAgICAgICAgdmFyIGFjY2VzcyA9IChyLnRvdGFsRmlyc3REb3NlIC8gci50b3RhbFBsYW5uZWQpICogMTAwO1xuICAgICAgICAgICAgdmFyIGRyb3BvdXRSYXRlID0gKChyLnRvdGFsRmlyc3REb3NlIC0gci50b3RhbExhc3REb3NlKSAvIHIudG90YWxGaXJzdERvc2UpICogMTAwO1xuXG4gICAgICAgICAgICBpZiAoYWNjZXNzID49IDkwICYmIGRyb3BvdXRSYXRlID49IDAgJiYgZHJvcG91dFJhdGUgPD0gMTApIHJldHVybiAxO1xuICAgICAgICAgICAgZWxzZSBpZiAoYWNjZXNzID49IDkwICYmIChkcm9wb3V0UmF0ZSA8IDAgfHwgZHJvcG91dFJhdGUgPiAxMCkpIHJldHVybiAyO1xuICAgICAgICAgICAgZWxzZSBpZiAoYWNjZXNzIDwgOTAgJiYgZHJvcG91dFJhdGUgPj0gMCAmJiBkcm9wb3V0UmF0ZSA8PSAxMCkgcmV0dXJuIDM7XG4gICAgICAgICAgICBlbHNlIGlmIChhY2Nlc3MgPCA5MCAmJiAoZHJvcG91dFJhdGUgPCAwIHx8IGRyb3BvdXRSYXRlID4gMTApKSByZXR1cm4gNDtcbiAgICAgICAgICAgIGVsc2UgcmV0dXJuIDA7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldExhc3RWYWx1ZSA9IGZ1bmN0aW9uKGQsIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgICAgICAgaWYgKGQgPT0gdW5kZWZpbmVkKSByZXR1cm47XG4gICAgICAgICAgICBpZiAoZGVmYXVsdFZhbHVlIGluIGQpIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGQpO1xuICAgICAgICAgICAgcmV0dXJuIGtleXNba2V5cy5sZW5ndGgtMV07XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldFZhbHVlc0luUmFuZ2UgPSBmdW5jdGlvbihkYXRhLCBzdGFydFllYXIsIHN0YXJ0TW9udGgsIGVuZFllYXIsIGVuZE1vbnRoKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWVzID0gW107XG4gICAgICAgICAgICBmb3IgKHllYXJJbmRleCBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKHllYXJJbmRleCA8IHN0YXJ0WWVhciB8fCB5ZWFySW5kZXggPiBlbmRZZWFyKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIGZvciAobW9udGhJbmRleCBpbiBkYXRhW3llYXJJbmRleF0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHllYXJJbmRleCA9PSBzdGFydFllYXIgJiYgbW9udGhJbmRleCA8IHN0YXJ0TW9udGgpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoeWVhckluZGV4ID09IGVuZFllYXIgJiYgbW9udGhJbmRleCA+IGVuZE1vbnRoKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goW3llYXJJbmRleCwgbW9udGhJbmRleF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwiY3JlYXRlRGlzdHJpY3REYXRhTWFwXCI6IGNyZWF0ZURpc3RyaWN0RGF0YU1hcCxcbiAgICAgICAgICAgIFwiZ2V0UGVyaW9kTGlzdFwiOiBnZXRQZXJpb2RMaXN0LFxuICAgICAgICAgICAgXCJjYWxjdWxhdGVDb3ZlcmFnZVJhdGVcIjogY2FsY3VsYXRlQ292ZXJhZ2VSYXRlLFxuICAgICAgICAgICAgXCJjYWxjdWxhdGVEcm9wb3V0UmF0ZVwiOiBjYWxjdWxhdGVEcm9wb3V0UmF0ZSxcbiAgICAgICAgICAgIFwiY2FsY3VsYXRlUmVkQ2F0ZWdvcnlWYWx1ZVwiOiBjYWxjdWxhdGVSZWRDYXRlZ29yeVZhbHVlXG4gICAgICAgIH07XG4gICAgfVxuXSlcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdzZXJ2aWNlcycpLnNlcnZpY2UoJ1N0b2NrU2VydmljZScsIFsnJGh0dHAnLFxuICAgIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgICAgIHZhciBoYW5kbGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0U3RvY2tCeURpc3RyaWN0ID0gZnVuY3Rpb24oc3RhcnRNb250aCwgZW5kTW9udGgsIGRpc3RyaWN0LCB2YWNjaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdhcGkvc3RvY2svYXRoYW5kYnlkaXN0cmljdCcsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRNb250aDogc3RhcnRNb250aCxcbiAgICAgICAgICAgICAgICAgICAgZW5kTW9udGg6IGVuZE1vbnRoLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3QsXG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmU6IHZhY2NpbmVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGdldFVuZXBpU3RvY2sgPSBmdW5jdGlvbihlbmRNb250aCwgZGlzdHJpY3QpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2FwaS9zdG9jay9hdGhhbmRieWRpc3RyaWN0Jywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBlbmRNb250aDogZW5kTW9udGgsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRTdG9ja0J5TW9udGggPSBmdW5jdGlvbihzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2FwaS9zdG9jay9hdGhhbmRieW1vbnRoJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydE1vbnRoOiBzdGFydE1vbnRoLFxuICAgICAgICAgICAgICAgICAgICBlbmRNb250aDogZW5kTW9udGgsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZTogdmFjY2luZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICAgdmFyIGdldFN0b2NrQnlEaXN0cmljdFZhY2NpbmUgPSBmdW5jdGlvbihzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvc3RvY2svc3RvY2tieWRpc3RyaWN0dmFjY2luZScsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRNb250aDogc3RhcnRNb250aCxcbiAgICAgICAgICAgICAgICAgICAgZW5kTW9udGg6IGVuZE1vbnRoLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3QsXG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmU6IHZhY2NpbmVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgICB2YXIgZ2V0U3RvY2tlZE91dCA9IGZ1bmN0aW9uKHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9zdG9ja2Vkb3V0Jywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydE1vbnRoOiBzdGFydE1vbnRoLFxuICAgICAgICAgICAgICAgICAgICBlbmRNb250aDogZW5kTW9udGgsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZTogdmFjY2luZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgZ2V0U3RvY2tNb250aHNMZWZ0ID0gZnVuY3Rpb24oZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2FwaS9zdG9jay9zdG9ja21vbnRoc2xlZnQnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZTogdmFjY2luZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJnZXRTdG9ja0J5RGlzdHJpY3RcIjogZ2V0U3RvY2tCeURpc3RyaWN0LFxuICAgICAgICAgICAgXCJnZXRTdG9ja0J5TW9udGhcIjogZ2V0U3RvY2tCeU1vbnRoLFxuICAgICAgICAgICAgXCJnZXRTdG9ja01vbnRoc0xlZnRcIjogZ2V0U3RvY2tNb250aHNMZWZ0LFxuICAgICAgICAgICAgXCJnZXRTdG9ja0J5RGlzdHJpY3RWYWNjaW5lXCI6IGdldFN0b2NrQnlEaXN0cmljdFZhY2NpbmUsXG4gICAgICAgICAgICBcImdldFN0b2NrZWRPdXRcIjogZ2V0U3RvY2tlZE91dCxcbiAgICAgICAgICAgIFwiZ2V0VW5lcGlTdG9ja1wiOmdldFVuZXBpU3RvY2tcbiAgICAgICAgfTtcbiAgICB9XG5dKVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpLmNvbnRyb2xsZXIoJ0FubnVhbENvdmVyYWdlQ29udHJvbGxlcicsIEFubnVhbENvdmVyYWdlQ29udHJvbGxlcik7XG5cbkFubnVhbENvdmVyYWdlQ29udHJvbGxlci4kaW5qZWN0ID0gW1xuICAgICckc2NvcGUnLFxuICAgICdDb3ZlcmFnZVNlcnZpY2UnLFxuICAgICdDb3ZlcmFnZUNhbGN1bGF0b3InLFxuICAgICdDaGFydFBERkV4cG9ydCcsXG4gICAgJyR0aW1lb3V0J1xuXTtcbmZ1bmN0aW9uIEFubnVhbENvdmVyYWdlQ29udHJvbGxlcigkc2NvcGUsIENvdmVyYWdlU2VydmljZSwgQ292ZXJhZ2VDYWxjdWxhdG9yLCBDaGFydFBERkV4cG9ydCwgJHRpbWVvdXQpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgICRzY29wZS4kb24oJ3JlZnJlc2hDb3ZlcmFnZTMnLCB1cGRhdGVDaGFydCk7XG5cbiAgICB2bS5jaGFydE9wdGlvbnMgPSBnZXRDaGFydE9wdGlvbnMoKTtcbiAgICB2bS5jaGFydERhdGEgPSBbXTtcbiAgICB2bS55ZWFySW5kZXhlcyA9IFtdO1xuICAgIHZtLmV4cG9ydFBERiA9IGZ1bmN0aW9uKG5hbWUpIHsgQ2hhcnRQREZFeHBvcnQuZXhwb3J0V2l0aFN0eWxlcih2bSwgbmFtZSk7IH07XG4gICAgdm0uaW5pdExhYmVscyA9IGluaXRMYWJlbHM7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVDaGFydChlLCBwYXJhbXMpIHtcbiAgICAgICAgdmFyIGFudGlnZW5MYWJlbCA9IHBhcmFtcy5hbnRpZ2VuID09ICdBTEwnID8gJ0FudGlnZW5zJyA6IHBhcmFtcy5hbnRpZ2VuO1xuICAgICAgICB2YXIgeWVhclBlcmlvZCA9IHBhcmFtcy5zdGFydFllYXIgPT0gcGFyYW1zLmVuZFllYXJcbiAgICAgICAgICAgID8gcGFyYW1zLnN0YXJ0WWVhciA6IGAke3BhcmFtcy5zdGFydFllYXJ9IC0gJHtwYXJhbXMuZW5kWWVhcn1gO1xuICAgICAgICB2bS5jaGFydFRpdGxlID0gYCR7YW50aWdlbkxhYmVsfSBDb3ZlcmFnZSBmb3IgJHt5ZWFyUGVyaW9kfWA7XG4gICAgICAgIGNsZWFyTGFiZWxzKCk7XG5cbiAgICAgICAgQ292ZXJhZ2VTZXJ2aWNlLmdldFZhY2NpbmVEb3Nlc0J5UGVyaW9kKHBhcmFtcykudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAvKiBBZ2dyZWdhdGUgdGhlIGRhdGEgYmFzZWQgb24gcGVyaW9kICovXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZGF0YS5yZWR1Y2UoZnVuY3Rpb24oYWNjLCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhY2NpbmUgPSBpdGVtLnZhY2NpbmVfX25hbWU7XG4gICAgICAgICAgICAgICAgdmFyIHllYXIgPSBpdGVtLnBlcmlvZC50b1N0cmluZygpLnN1YnN0cigwLDQpO1xuICAgICAgICAgICAgICAgIGlmICh2bS55ZWFySW5kZXhlcy5pbmRleE9mKHllYXIpID09IC0xKSB2bS55ZWFySW5kZXhlcy5wdXNoKHllYXIpO1xuICAgICAgICAgICAgICAgIGlmICghICh2YWNjaW5lIGluIGFjYykpIGFjY1t2YWNjaW5lXSA9IHt9O1xuICAgICAgICAgICAgICAgIGlmICghICh5ZWFyIGluIGFjY1t2YWNjaW5lXSkpXG4gICAgICAgICAgICAgICAgICAgIGFjY1t2YWNjaW5lXVt5ZWFyXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsQWN0dWFsOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxGaXJzdERvc2U6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFRoaXJkRG9zZTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsTGFzdERvc2U6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFBsYW5uZWQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFNlY29uZERvc2U6IDBcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGFjY1t2YWNjaW5lXVt5ZWFyXS50b3RhbEFjdHVhbCArPSBpdGVtLnRvdGFsX2FjdHVhbDtcbiAgICAgICAgICAgICAgICBhY2NbdmFjY2luZV1beWVhcl0udG90YWxGaXJzdERvc2UgKz0gaXRlbS50b3RhbF9maXJzdF9kb3NlO1xuICAgICAgICAgICAgICAgIGFjY1t2YWNjaW5lXVt5ZWFyXS50b3RhbExhc3REb3NlICs9IGl0ZW0udG90YWxfbGFzdF9kb3NlO1xuICAgICAgICAgICAgICAgIGFjY1t2YWNjaW5lXVt5ZWFyXS50b3RhbFBsYW5uZWQgKz0gaXRlbS50b3RhbF9wbGFubmVkO1xuICAgICAgICAgICAgICAgIGFjY1t2YWNjaW5lXVt5ZWFyXS50b3RhbFNlY29uZERvc2UgKz0gaXRlbS50b3RhbF9zZWNvbmRfZG9zZTtcbiAgICAgICAgICAgICAgICBhY2NbdmFjY2luZV1beWVhcl0udG90YWxUaGlyZERvc2UgKz0gaXRlbS50b3RhbF90aGlyZF9kb3NlO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgIH0sIHt9KTtcblxuICAgICAgICAgICAgLyogQ2FsY3VsYXRlIFJhdGVzIGZvciB0aGUgcmVzdWx0cyAqL1xuICAgICAgICAgICAgdmFyIGNoYXJ0RGF0YSA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgdmFjY2luZSBpbiByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFjY2luZURhdGEgPSB7Y1I6IFtdLCBjUjE6IFtdLCBjUjI6IFtdLCBjUjM6IFtdfTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIHllYXIgaW4gcmVzdWx0W3ZhY2NpbmVdKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwbGFubmVkID0gcmVzdWx0W3ZhY2NpbmVdW3llYXJdLnRvdGFsUGxhbm5lZDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSByZXN1bHRbdmFjY2luZV1beWVhcl07XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNSMSA9IENvdmVyYWdlQ2FsY3VsYXRvci5jYWxjdWxhdGVDb3ZlcmFnZVJhdGUoaXRlbS50b3RhbEZpcnN0RG9zZSwgcGxhbm5lZCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjUjIgPSBDb3ZlcmFnZUNhbGN1bGF0b3IuY2FsY3VsYXRlQ292ZXJhZ2VSYXRlKGl0ZW0udG90YWxTZWNvbmREb3NlLCBwbGFubmVkKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNSID0gQ292ZXJhZ2VDYWxjdWxhdG9yLmNhbGN1bGF0ZUNvdmVyYWdlUmF0ZShpdGVtLnRvdGFsTGFzdERvc2UsIHBsYW5uZWQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY1IzID0gQ292ZXJhZ2VDYWxjdWxhdG9yLmNhbGN1bGF0ZUNvdmVyYWdlUmF0ZShpdGVtLnRvdGFsVGhpcmREb3NlLCBwbGFubmVkKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgaSA9IHZtLnllYXJJbmRleGVzLmluZGV4T2YoeWVhcik7XG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmVEYXRhLmNSLnB1c2goe3g6IGksIHk6IGNSfSk7XG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmVEYXRhLmNSMS5wdXNoKHt4OiBpLCB5OiBjUjF9KTtcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZURhdGEuY1IyLnB1c2goe3g6IGksIHk6IGNSMn0pO1xuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lRGF0YS5jUjMucHVzaCh7eDogaSwgeTogY1IzfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtcy5hbnRpZ2VuICE9IFwiQUxMXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogU2hvdyBjb3ZlcmFnZXMgZm9yIHRoZSBkaWZmZXJlbnQgZG9zZXMgKi9cbiAgICAgICAgICAgICAgICAgICAgY2hhcnREYXRhLnB1c2goe2tleTogJ0Rvc2UgMScsIHZhbHVlczogdmFjY2luZURhdGEuY1IxfSk7ICBcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmICgkLmluQXJyYXkodmFjY2luZSwgWydQRU5UQScsICdQQ1YnLCAnT1BWJywgJ0hQVicsICdJUFYnLCAnVFQnXSkgIT0gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydERhdGEucHVzaCh7a2V5OiAnRG9zZSAyJywgdmFsdWVzOiB2YWNjaW5lRGF0YS5jUjJ9KTsgIFxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShwYXJhbXMuYW50aWdlbiwgWydQRU5UQScsICdQQ1YnLCAnT1BWJywgJ0RQVCddKSAhPSAtMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0RGF0YS5wdXNoKHtrZXk6ICdEb3NlIDMnLCB2YWx1ZXM6IHZhY2NpbmVEYXRhLmNSM30pOyAgICBcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjaGFydERhdGEucHVzaCh7a2V5OiB2YWNjaW5lLCB2YWx1ZXM6IHZhY2NpbmVEYXRhLmNSfSk7ICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdm0uY2hhcnREYXRhID0gY2hhcnREYXRhO1xuICAgICAgICAgICAgLy8gJHRpbWVvdXQoZnVuY3Rpb24oKSB7KCk7IH0sIDIwMDApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRDaGFydE9wdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdtdWx0aUJhckNoYXJ0JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDQ1MCxcbiAgICAgICAgICAgICAgICB3aWR0aDogOTAwLFxuICAgICAgICAgICAgICAgIHN0YWNrZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNob3dDb250cm9sczogZmFsc2UsXG4gICAgICAgICAgICAgICAgZ3JvdXBTcGFjaW5nOiAwLjIsXG4gICAgICAgICAgICAgICAgY2xpcEVkZ2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG1hcmdpbjoge3RvcDogNzB9LFxuICAgICAgICAgICAgICAgIC8vIHVzZUludGVyYWN0aXZlR3VpZGVsaW5lOiB0cnVlLFxuICAgICAgICAgICAgICAgIGludGVyYWN0aXZlTGF5ZXI6IHtncmF2aXR5OiAncyd9LFxuICAgICAgICAgICAgICAgIHg6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZC54OyB9LFxuICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZC55OyB9LFxuICAgICAgICAgICAgICAgIGZvcmNlWTogWzAsMTEwXSxcbiAgICAgICAgICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWw6ICdZZWFycycsXG4gICAgICAgICAgICAgICAgICAgIHRpY2tGb3JtYXQ6IGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZtLnllYXJJbmRleGVzW2RdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB5QXhpczoge1xuICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWw6ICdDb3ZlcmFnZSBSYXRlICglKScsXG4gICAgICAgICAgICAgICAgICAgIHRpY2tzOiAxMFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2g6IHtcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyRW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluaXRMYWJlbHMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0TGFiZWxzKCkge1xuICAgICAgICAvLyBZb3UgbmVlZCB0byBhcHBseSB0aGlzIG9uY2UgYWxsIHRoZSBhbmltYXRpb25zIGFyZSBhbHJlYWR5IGZpbmlzaGVkLiBPdGhlcndpc2UgbGFiZWxzIHdpbGwgYmUgcGxhY2VkIHdyb25nbHkuXG4gICAgICAgIGQzLnNlbGVjdEFsbCgnLm52LW11bHRpYmFyIC5udi1ncm91cCcpLmVhY2goZnVuY3Rpb24oZ3JvdXApe1xuICAgICAgICAgIHZhciBnID0gZDMuc2VsZWN0KHRoaXMpO1xuXG4gICAgICAgICAgLy8gUmVtb3ZlIHByZXZpb3VzIGxhYmVscyBpZiB0aGVyZSBpcyBhbnlcbiAgICAgICAgICBnLnNlbGVjdEFsbCgndGV4dCcpLnJlbW92ZSgpO1xuICAgICAgICAgIGcuc2VsZWN0QWxsKCcubnYtYmFyJykuZWFjaChmdW5jdGlvbihiYXIpe1xuICAgICAgICAgICAgdmFyIGIgPSBkMy5zZWxlY3QodGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFyV2lkdGggPSBiLmF0dHIoJ3dpZHRoJyk7XG4gICAgICAgICAgICB2YXIgYmFySGVpZ2h0ID0gYi5hdHRyKCdoZWlnaHQnKTtcblxuICAgICAgICAgICAgZy5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgICAvLyBUcmFuc2Zvcm1zIHNoaWZ0IHRoZSBvcmlnaW4gcG9pbnQgdGhlbiB0aGUgeCBhbmQgeSBvZiB0aGUgYmFyXG4gICAgICAgICAgICAgIC8vIGlzIGFsdGVyZWQgYnkgdGhpcyB0cmFuc2Zvcm0uIEluIG9yZGVyIHRvIGFsaWduIHRoZSBsYWJlbHNcbiAgICAgICAgICAgICAgLy8gd2UgbmVlZCB0byBhcHBseSB0aGlzIHRyYW5zZm9ybSB0byB0aG9zZS5cbiAgICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGIuYXR0cigndHJhbnNmb3JtJykpXG4gICAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy8gVHdvIGRlY2ltYWxzIGZvcm1hdFxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGJhci55KS50b0ZpeGVkKDApICsgXCIlXCI7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5hdHRyKCd5JywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvLyBDZW50ZXIgbGFiZWwgdmVydGljYWxseVxuICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSB0aGlzLmdldEJCb3goKS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoYi5hdHRyKCd5JykpIC0gMTA7IC8vIDEwIGlzIHRoZSBsYWJlbCdzIG1hZ2luIGZyb20gdGhlIGJhclxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuYXR0cigneCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy8gQ2VudGVyIGxhYmVsIGhvcml6b250YWxseVxuICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9IHRoaXMuZ2V0QkJveCgpLndpZHRoO1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGIuYXR0cigneCcpKSArIChwYXJzZUZsb2F0KGJhcldpZHRoKSAvIDIpIC0gKHdpZHRoIC8gMik7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdiYXItdmFsdWVzJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFyTGFiZWxzKCkge1xuICAgICAgICBkMy5zZWxlY3RBbGwoJy5udi1tdWx0aWJhciAubnYtZ3JvdXAnKS5lYWNoKGZ1bmN0aW9uKGdyb3VwKXtcbiAgICAgICAgICB2YXIgZyA9IGQzLnNlbGVjdCh0aGlzKTtcbiAgICAgICAgICAvLyBSZW1vdmUgcHJldmlvdXMgbGFiZWxzIGlmIHRoZXJlIGlzIGFueVxuICAgICAgICAgIGcuc2VsZWN0QWxsKCd0ZXh0JykucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICB9XG59XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJylcbiAgICAuY29udHJvbGxlcignQ292ZXJhZ2VDb250cm9sbGVyJywgW1xuICAgICAgICAnJHNjb3BlJywnJGxvY2F0aW9uJywgJ1N0b2NrU2VydmljZScsICckcm9vdFNjb3BlJywgJ05nVGFibGVQYXJhbXMnLFxuICAgICAgICAnRmlsdGVyU2VydmljZScsICdNb250aFNlcnZpY2UnLCAnQ292ZXJhZ2VTZXJ2aWNlJywgJ01hcFN1cHBvcnRTZXJ2aWNlJywgJ0NoYXJ0UERGRXhwb3J0JyxcbiAgICBmdW5jdGlvbigkc2NvcGUsJGxvY2F0aW9uLCBTdG9ja1NlcnZpY2UsICRyb290U2NvcGUsIE5nVGFibGVQYXJhbXMsXG4gICAgICAgIEZpbHRlclNlcnZpY2UsIE1vbnRoU2VydmljZSwgQ292ZXJhZ2VTZXJ2aWNlLCBNYXBTdXBwb3J0U2VydmljZSwgQ2hhcnRQREZFeHBvcnQpXG4gICAge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2YXIgc2hlbGxTY29wZSA9ICRzY29wZS4kcGFyZW50O1xuICAgICAgICBzaGVsbFNjb3BlLmNoaWxkID0gJHNjb3BlO1xuICAgICAgICB2bS5wYXRoID0gJGxvY2F0aW9uLnBhdGgoKTtcbiAgICAgICAgdm0uZW5kdHh0PVwiXCI7XG4gICAgICAgIHZtLmlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB2bS5hY3RpdmVSZXBvcnRUb2dnbGUgPSBcIkFDWVwiO1xuICAgICAgICB2bS5hY3RpdmVSZXBvcnRZZWFyID0gXCJDWVwiO1xuICAgICAgICB2bS5hY3RpdmVEaXN0cmljdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdm0uc2FtcGxlRGlzdHJpY3REYXRhID0ge307XG5cbiAgICAgICAgJHNjb3BlLmlzQWN0aXZlID0gZnVuY3Rpb24odmlld0xvY2F0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdmlld0xvY2F0aW9uID09PSAkbG9jYXRpb24ucGF0aCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIHBlcmlvZERpc3BsYXkocGVyaW9kKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAocGVyaW9kID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG1vbnRoID0gcGFyc2VJbnQocGVyaW9kLnNsaWNlKDQsNikpO1xuICAgICAgICAgICAgcmV0dXJuIE1vbnRoU2VydmljZS5nZXRNb250aE5hbWUobW9udGgpICsgXCIgXCIgKyBwZXJpb2Quc2xpY2UoMCw0KVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnVwZGF0ZVJlcG9ydFRvZ2dsZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB2bS5hY3RpdmVSZXBvcnRUb2dnbGUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHZtLmFjdGl2ZVJlcG9ydFllYXIgPSB2bS5hY3RpdmVSZXBvcnRUb2dnbGUuc3Vic3RyKDEsMik7XG4gICAgICAgICAgICB2bS51cGRhdGVNYXBXaXRoVmFjY2luZSh2bS5hY3RpdmVWYWNjaW5lKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXt3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ3Jlc2l6ZScpKX0sIDMwMDApO1xuXG4gICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmNoYXJ0VGl0bGUgPSB2bS5nZXRDaGFydFRpdGxlKHZtLnNlbGVjdGVkQW50aWdlbik7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmlzQWN0aXZlUmVwb3J0VG9nZ2xlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2bS5hY3RpdmVSZXBvcnRUb2dnbGUgPT0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICB2bS5nZXRWYWNjaW5lRG9zZXMgPSBmdW5jdGlvbihlbmRZZWFyLCB2YWNjaW5lLCBkaXN0cmljdCkge1xuICAgICAgICAgICAgLy8gJCgnI3NwaW5uZXItbW9kYWwnKS5tb2RhbCgnc2hvdycpO1xuXG4gICAgICAgICAgICAvLyB2bS5lbmRNb250aD1wZXJpb2Q7XG5cbiAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuaGlkZU1hcCA9IHRydWU7XG4gICAgICAgICAgICAvLyBpZiAoZGlzdHJpY3QgIT0gdW5kZWZpbmVkICYmIGRpc3RyaWN0ICE9IFwiTmF0aW9uYWxcIikge1xuICAgICAgICAgICAgLy8gICAgIHNoZWxsU2NvcGUuY2hpbGQubWFwUGxhY2Vob2xkZXJNZXNzYWdlID0gXCJObyBtYXAgYXZhaWxhYmxlLlwiO1xuICAgICAgICAgICAgLy8gICAgIHJldHVybjtcbiAgICAgICAgICAgIC8vIH1cblxuXG4gICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLm1hcFBsYWNlaG9sZGVyTWVzc2FnZSA9IFwiTWFwIGxvYWRpbmcuIFBsZWFzZSB3YWl0Li4uXCI7XG5cbiAgICAgICAgICAgIC8vVG9kbzogVGVtcG9yYXJpbHkgZGlzYWJsZSBmaWx0ZXJpbmcgYnkgZGlzdHJpY3QgZm9yIHRoZSB0YWJsZVxuICAgICAgICAgICAgZGlzdHJpY3QgPSBcIlwiXG4gICAgICAgICAgICB2bS5kaXN0cmljdCA9IGRpc3RyaWN0O1xuICAgICAgICAgICAgdm0udmFjY2luZSA9IHZhY2NpbmU7Ly92bS5zZWxlY3RlZFZhY2NpbmUgPyB2bS5zZWxlY3RlZFZhY2NpbmUubmFtZSA6IFwidmFcIjtcbiAgICAgICAgICAgIHZtLmFjdGl2ZVZhY2NpbmUgPSB2YWNjaW5lO1xuXG4gICAgICAgICAgICBpZiAodmFjY2luZSA9PSBcIkRQVFwiIHx8IHZhY2NpbmUgPT0gXCJBTExcIikge1xuICAgICAgICAgICAgICAgIHZtLmFjdGl2ZVZhY2NpbmUgPSBcIlBFTlRBXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEFzc2lnbiBkaW1lbnNpb25zIGZvciBtYXAgY29udGFpbmVyXG4gICAgICAgICAgICB2YXIgd2lkdGggPSA1MDAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gNTAwO1xuICAgICAgICAgICAgdmFyIGZpZWxkID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBkb3NlMSA9IFwiXCI7XG5cbiAgICAgICAgICAgIHZhciBpbnRlcnBvbGF0ZUZ1bmN0aW9uO1xuXG4gICAgICAgICAgICBpZiAodm0ucGF0aD09XCIvY292ZXJhZ2UvcmVkY2F0ZWdvcnlcIil7XG4gICAgICAgICAgICAgICAgaW50ZXJwb2xhdGVGdW5jdGlvbiA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdCA9ICh0ICogMTAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ID09IDAgKSByZXR1cm4gJ0xpZ2h0R3JheSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodCA9PSAxKSByZXR1cm4gJ0RhcmtHcmVlbic7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodCA9PSAyKSByZXR1cm4gJ1llbGxvdyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodCA9PSAzKSByZXR1cm4gJ09yYW5nZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodCA9PSA0KSByZXR1cm4gJ1JlZCc7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodm0ucGF0aD09XCIvY292ZXJhZ2UvZHJvcG91dHJhdGVcIil7XG4gICAgICAgICAgICAgICAgaW50ZXJwb2xhdGVGdW5jdGlvbiA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgPSB0ICogMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQgPT0gMCApIHJldHVybiAnTGlnaHRHcmF5JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgodCA+PSAwKSAmJiAodCA8PSAxMCkpIHJldHVybiAnR3JlZW4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCh0ID49IC0xMCAmJiB0IDwgMCkgfHwgKHQgPiAxMCAmJiB0IDw9IDIwKSkgcmV0dXJuICdZZWxsb3cnO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCh0IDwgLTEwKSB8fCAodCA+IDIwKSkgcmV0dXJuICdSZWQnO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGludGVycG9sYXRlRnVuY3Rpb24gPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ID0gdCAqIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ID09IDApIHJldHVybiAnTGlnaHRHcmF5JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0IDwgNTApIHJldHVybiAnUmVkJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0Pj0gNTAgJiYgdDw5MCkgcmV0dXJuICdZZWxsb3cnO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQgPj0gOTApIHJldHVybiAnRGFya0dyZWVuJztcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGNvbG9yID0gZDMuc2NhbGUubGluZWFyKClcbiAgICAgICAgICAgICAgICAuZG9tYWluKFswLCAxMDBdKVxuICAgICAgICAgICAgICAgIC5pbnRlcnBvbGF0ZShpbnRlcnBvbGF0ZUZ1bmN0aW9uKTtcblxuICAgICAgICAgICAgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL2Ryb3BvdXRyYXRlXCIpe1xuICAgICAgICAgICAgICAgIGZpZWxkPVwiZHJvcF9vdXRfcmF0ZVwiO1xuICAgICAgICAgICAgICAgIHZtLmVuZHR4dD1cIiVcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZWxzZSBpZiAodm0ucGF0aD09XCIvY292ZXJhZ2UvY292ZXJhZ2VcIil7XG4gICAgICAgICAgICAgICAgZmllbGQ9XCJjb3ZlcmFnZV9yYXRlXCI7XG4gICAgICAgICAgICAgICAgdm0uZW5kdHh0PVwiJVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkb3NlMSA9IFwiTE9XXCIgKyBcIi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXCIrIFwiSElHSFwiO1xuXG4gICAgICAgICAgICBpZiAodmFjY2luZT09XCJQRU5UQVwiKXtcbiAgICAgICAgICAgICAgICB2bS52YWNjaW5lPVwiRFBUM1wiO1xuICAgICAgICAgICAgICAgIHZtLnZhY2Rvc2U9XCJEUFQxLURQVDNcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHZhY2NpbmU9PVwiUENWXCIpe1xuICAgICAgICAgICAgICAgIHZtLnZhY2NpbmU9XCJQQ1YzXCI7XG4gICAgICAgICAgICAgICAgdm0udmFjZG9zZT1cIlBDVjEtUENWM1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodmFjY2luZT09XCJCQ0dcIil7XG4gICAgICAgICAgICAgICAgdm0udmFjY2luZT1cIkJDR1wiO1xuICAgICAgICAgICAgICAgIHZtLnZhY2Rvc2U9XCJCQ0ctTUVBU0xFU1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodmFjY2luZT09XCJPUFZcIil7XG4gICAgICAgICAgICAgICAgdm0udmFjY2luZT1cIk9QVjNcIjtcbiAgICAgICAgICAgICAgICB2bS52YWNkb3NlPVwiT1BWMC1PUFYzXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh2YWNjaW5lPT1cIkhQVlwiKXtcbiAgICAgICAgICAgICAgICB2bS52YWNjaW5lPVwiSFBWMlwiO1xuICAgICAgICAgICAgICAgIHZtLnZhY2Rvc2U9XCJIUFYxLUhQVjJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICBlbHNlIGlmICh2YWNjaW5lPT1cIk1FQVNMRVNcIil7XG4gICAgICAgICAgICAgICAgdm0udmFjY2luZT1cIk1FQVNMRVNcIjtcbiAgICAgICAgICAgICAgICB2bS52YWNkb3NlPVwiQkNHLU1FQVNMRVNcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHZhY2NpbmU9PVwiVFRcIil7XG4gICAgICAgICAgICAgICAgdm0udmFjY2luZT1cIlRUMlwiO1xuICAgICAgICAgICAgICAgIHZtLnZhY2Rvc2U9XCJUVDEtVFQyXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnBlcmlvZE1vbnRoID0gcGVyaW9kRGlzcGxheSh2bS5lbmRNb250aCk7XG5cbiAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudGhlZG9zZSA9IHZtLnZhY2NpbmU7XG4gICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnRoZXZhY2Rvc2UgPSB2bS52YWNkb3NlO1xuXG5cbiAgICAgICAgICAgIHZhciB2YWx1ZUZvcm1hdCA9IGQzLmZvcm1hdChcIixcIik7XG5cbiAgICAgICAgICAgIC8vIERlZmluZSBhIGdlb2dyYXBoaWNhbCBwcm9qZWN0aW9uXG4gICAgICAgICAgICAvLyBBbHNvLCBzZXQgaW5pdGlhbCB6b29tIHRvIHNob3cgdGhlIGZlYXR1cmVzXG4gICAgICAgICAgICB2YXIgcHJvamVjdGlvblx0PSBkMy5nZW8ubWVyY2F0b3IoKVxuICAgICAgICAgICAgICAgIC5zY2FsZSgxKTtcblxuICAgICAgICAgICAgLy8gUHJlcGFyZSBhIHBhdGggb2JqZWN0IGFuZCBhcHBseSB0aGUgcHJvamVjdGlvbiB0byBpdFxuICAgICAgICAgICAgdmFyIHBhdGggPSBkMy5nZW8ucGF0aCgpXG4gICAgICAgICAgICAgICAgLnByb2plY3Rpb24ocHJvamVjdGlvbik7XG5cbiAgICAgICAgICAgIC8vIFdlIHByZXBhcmUgYW4gb2JqZWN0IHRvIGxhdGVyIGhhdmUgZWFzaWVyIGFjY2VzcyB0byB0aGUgZGF0YS5cbiAgICAgICAgICAgIHZhciBkYXRhQnlJZCA9IGQzLm1hcCgpO1xuXG4gICAgICAgICAgICAvL0RlZmluZSBxdWFudGl6ZSBzY2FsZSB0byBzb3J0IGRhdGEgdmFsdWVzIGludG8gYnVja2V0cyBvZiBjb2xvclxuICAgICAgICAgICAgLy9Db2xvcnMgYnkgQ3ludGhpYSBCcmV3ZXIgKGNvbG9yYnJld2VyMi5vcmcpLCA5LWNsYXNzIFlsR25CdVxuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8ucmFuZ2UoZDMucmFuZ2UoOSksbWFwKGZ1bmN0aW9uKGkpIHsgcmV0dXJuICdxJyArIGkgKyAnLTknO30pKTtcblxuXG4gICAgICAgICAgICAvLyBDb3ZlcmFnZVNlcnZpY2UuZ2V0VmFjY2luZURvc2VzKHBlcmlvZCwgdmFjY2luZSlcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB7XG4gICAgICAgICAgICAgICAgZW5kWWVhcjogZW5kWWVhcixcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ21hcCdcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIENvdmVyYWdlU2VydmljZS5nZXRWYWNjaW5lRG9zZXNCeVBlcmlvZChwYXJhbXMpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YURpc3RyaWN0TWFwID0gTWFwU3VwcG9ydFNlcnZpY2UuY3JlYXRlRGlzdHJpY3REYXRhTWFwKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB2bS5zYW1wbGVEaXN0cmljdERhdGEgPSBkYXRhRGlzdHJpY3RNYXBbT2JqZWN0LmtleXMoZGF0YURpc3RyaWN0TWFwKVswXV07XG4gICAgICAgICAgICAgICAgICAgIC8vIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgbWFwcyB0aGUgZGF0YSBvZiB0aGUgQ1NWIHNvIGl0IGNhbiBiZSBlYXNpbHkgYWNjZXNzZWQgYnlcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIElEIG9mIHRoZSBkaXN0cmljdCwgZm9yIGV4YW1wbGU6IGRhdGFCeUlkWzIxOTZdXG4gICAgICAgICAgICAgICAgICAgIGRhdGFCeUlkID0gZDMubmVzdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAua2V5KGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmlkOyB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJvbGx1cChmdW5jdGlvbiAoZCkgeyByZXR1cm4gZFswXTsgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gTG9hZCBmZWF0dXJlcyBmcm9tIEdlb0pTT05cbiAgICAgICAgICAgICAgICAgICAgZDMuanNvbignc3RhdGljL2FwcC9jb21wb25lbnRzL2NvdmVyYWdlL2RhdGEvdWdfZGlzdHJpY3RzMi5nZW9qc29uJywgZnVuY3Rpb24gKGVycm9yLCBqc29uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2NhbGVDZW50ZXIgPSBjYWxjdWxhdGVTY2FsZUNlbnRlcihqc29uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb24uc2NhbGUoc2NhbGVDZW50ZXIuc2NhbGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNlbnRlcihzY2FsZUNlbnRlci5jZW50ZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRyYW5zbGF0ZShbd2lkdGggLyAyLCBoZWlnaHQgLyAyXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGRpc3QgaW4gZGF0YURpc3RyaWN0TWFwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBvcyA9IGRpc3QuaW5kZXhPZihcIiBcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFEaXN0cmljdCA9IGRpc3Quc3Vic3RyaW5nKDAsIHBvcykudG9VcHBlckNhc2UoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwganNvbi5mZWF0dXJlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIganNvbkRpc3RyaWN0ID0ganNvbi5mZWF0dXJlc1tqXS5wcm9wZXJ0aWVzLmRpc3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhRGlzdHJpY3QgPT0ganNvbkRpc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLmZlYXR1cmVzW2pdLnByb3BlcnRpZXMuZmllbGQgPSBkYXRhRGlzdHJpY3RNYXBbZGlzdF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KFwiI21hcFwiKS5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN2ZyA9IGQzLnNlbGVjdChcIiNtYXBcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc3ZnLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ZlYXR1cmVzJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHN2Zy5zZWxlY3RBbGwoXCJwYXRoXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRhdGEoanNvbi5mZWF0dXJlcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZW50ZXIoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJkXCIsIHBhdGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGhvdmVyb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgaG92ZXJvdXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBcIiM3NzdcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnVwZGF0ZU1hcFdpdGhWYWNjaW5lKHZtLmFjdGl2ZVZhY2NpbmUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmhpZGVNYXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuJGFwcGx5KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGhvdmVyb24gPSBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rvb2x0aXAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS5sZWZ0ID0gZXZlbnQucGFnZVggKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2LnN0eWxlLnRvcCA9IGV2ZW50LnBhZ2VZICsgJ3B4JztcblxuICAgICAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwiZmlsbFwiLCBcIndoaXRlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KFwiI3Rvb2x0aXBcIikuc3R5bGUoXCJvcGFjaXR5XCIsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KFwiI3Rvb2x0aXAgLm5hbWVcIikudGV4dChkLnByb3BlcnRpZXMuZGlzdCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiN0b29sdGlwIC52YWx1ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0IChkMy5mb3JtYXQoJy4wMWYnKSh2bS5nZXREaXN0cmljdFZhbHVlKGQpKSsgdm0uZW5kdHh0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBob3Zlcm91dCA9IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgdm0uZ2V0RmlsbENvbG9yKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KFwiI3Rvb2x0aXBcIikuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdm0uZHJhd0xlZ2VuZCA9IGZ1bmN0aW9uKGNvbG9yQ291bnRzKSB7XG4gICAgICAgICAgICAgICAgLy8gU2V0dXAgTGVnZW5kXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KFwiI2dlbmRcIikuc2VsZWN0QWxsKFwiKlwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB2YXIgbGVnZW5kU3ZnID0gZDMuc2VsZWN0KCcjZ2VuZCcpLmFwcGVuZCgnc3ZnJyk7XG5cbiAgICAgICAgICAgICAgICBsZWdlbmRTdmcuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImxlZ2VuZFF1YW50XCIpXG4gICAgICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgyMCwyMClcIik7XG5cbiAgICAgICAgICAgICAgICB2YXIgbGVnZW5kID0gZDMubGVnZW5kLmNvbG9yKClcbiAgICAgICAgICAgICAgICAgIC5sYWJlbEZvcm1hdChkMy5mb3JtYXQoXCIuMmZcIikpXG4gICAgICAgICAgICAgICAgICAuc2hhcGVXaWR0aCg0MClcbiAgICAgICAgICAgICAgICAgIC5zaGFwZUhlaWdodCgyMCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodm0ucGF0aD09XCIvY292ZXJhZ2UvcmVkY2F0ZWdvcnlcIil7XG4gICAgICAgICAgICAgICAgICAgIHZhciBnZXRMYWJlbCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCB0b3RhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRhZ2UgPSAodmFsdWUvdG90YWwpICogMTAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmFtZSArICcgKCcrdmFsdWUrJykgKCcgKyBwZXJjZW50YWdlLnRvRml4ZWQoKSArICclKSc7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvdGFscyA9IGNvbG9yQ291bnRzLkxpZ2h0R3JheSArIGNvbG9yQ291bnRzLkRhcmtHcmVlbiArXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvckNvdW50cy5ZZWxsb3cgKyBjb2xvckNvdW50cy5PcmFuZ2UgKyBjb2xvckNvdW50cy5SZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgbGVnZW5kLmNlbGxzKFswLCAxLCAyLCAzLCA0XSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5sYWJlbHMoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldExhYmVsKCdObyBkYXRhJywgY29sb3JDb3VudHMuTGlnaHRHcmF5LCB0b3RhbHMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldExhYmVsKCdDQVQxJywgY29sb3JDb3VudHMuRGFya0dyZWVuLCB0b3RhbHMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldExhYmVsKCdDQVQyJywgY29sb3JDb3VudHMuWWVsbG93LCB0b3RhbHMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldExhYmVsKCdDQVQzJywgY29sb3JDb3VudHMuT3JhbmdlLCB0b3RhbHMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldExhYmVsKCdDQVQ0JywgY29sb3JDb3VudHMuUmVkLCB0b3RhbHMpXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL2Ryb3BvdXRyYXRlXCIpe1xuICAgICAgICAgICAgICAgICAgICBsZWdlbmQuY2VsbHMoWzAsIDMwLCAxNSwgNV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAubGFiZWxzKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnTm8gZGF0YSAoJytjb2xvckNvdW50cy5MaWdodEdyYXkrJyknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8LTEwICYgPjIwICgnK2NvbG9yQ291bnRzLlJlZCsnKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJygtMTAtMCkgJiAoMTAtMjApICgnK2NvbG9yQ291bnRzLlllbGxvdysnKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzAtMTAgKCcrY29sb3JDb3VudHMuRGFya0dyZWVuKycpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGVnZW5kLmNlbGxzKDQpXG4gICAgICAgICAgICAgICAgICAgICAgICAubGFiZWxzKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnTm8gZGF0YSAoJytjb2xvckNvdW50cy5MaWdodEdyYXkrJyknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8NTAlICgnK2NvbG9yQ291bnRzLlJlZCsnKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzUwLTg5JSAoJytjb2xvckNvdW50cy5ZZWxsb3crJyknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc+PTkwJSAoJytjb2xvckNvdW50cy5EYXJrR3JlZW4rJyknXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZWdlbmQuc2NhbGUoY29sb3IpO1xuXG4gICAgICAgICAgICAgICAgbGVnZW5kU3ZnLnNlbGVjdChcIi5sZWdlbmRRdWFudFwiKVxuICAgICAgICAgICAgICAgICAgLmNhbGwobGVnZW5kKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZtLmdldE1hcFRpdGxlID0gZnVuY3Rpb24odmFjY2luZSkge1xuICAgICAgICAgICAgICAgIHZhciBkdXJhdGlvbiA9IHZtLmFjdGl2ZVJlcG9ydFRvZ2dsZVswXSA9PSAnQScgPyBcIkFubnVhbGl6ZWRcIiA6IFwiTW9udGhseVwiO1xuICAgICAgICAgICAgICAgIHZhciBwZXJpb2QgPSB2bS5nZXRMYXN0TWFwUGVyaW9kKCk7XG4gICAgICAgICAgICAgICAgdmFyIGZ1bGxQZXJpb2QgPSBhcHBIZWxwZXJzLmdlbmVyYXRlRnVsbExhYmVsRnJvbVBlcmlvZChwZXJpb2RbMF0rcGVyaW9kWzFdKTtcbiAgICAgICAgICAgICAgICB2YXIgZG9zZU51bWJlciA9IHZtLmFjdGl2ZURvc2UucmVwbGFjZShcIkRvc2UgXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgIHZhciBhbnRpZ2VuTGFiZWwgPSB2bS5hY3RpdmVEb3NlICE9IHVuZGVmaW5lZCA/IFxuICAgICAgICAgICAgICAgICAgICBgJHt2YWNjaW5lfSR7ZG9zZU51bWJlcn1gIDogdmFjY2luZTtcblxuICAgICAgICAgICAgICAgIHZhciB0YWIgPSBcIkNvdmVyYWdlXCI7XG4gICAgICAgICAgICAgICAgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL2Ryb3BvdXRyYXRlXCIpIHRhYiA9IFwiRHJvcG91dCBSYXRlXCI7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodm0ucGF0aD09XCIvY292ZXJhZ2UvcmVkY2F0ZWdvcnlcIikgdGFiID0gXCJSZWQgQ2F0ZWdvcml6YXRpb25cIjtcblxuICAgICAgICAgICAgICAgIHJldHVybiBgJHtkdXJhdGlvbn0gJHt0YWJ9IG9mICR7YW50aWdlbkxhYmVsfSBmb3IgJHtmdWxsUGVyaW9kfWA7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2bS51cGRhdGVNYXBXaXRoVmFjY2luZSA9IGZ1bmN0aW9uKHZhY2NpbmUpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiAodm0uYWN0aXZlRGlzdHJpY3QgIT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgLy8gICAgICYmIHZtLmFjdGl2ZURpc3RyaWN0ICE9IFwiQUxMXCJcbiAgICAgICAgICAgICAgICAvLyAgICAgJiYgdm0uYWN0aXZlRGlzdHJpY3QgIT0gXCJcIikge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5oaWRlTWFwID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQubWFwUGxhY2Vob2xkZXJNZXNzYWdlID0gXCJObyBtYXAgYXZhaWxhYmxlLlwiO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIHNoZWxsU2NvcGUuY2hpbGQuaGlkZU1hcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgICAgIC8vIHNoZWxsU2NvcGUuY2hpbGQuaGlkZU1hcCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZhY2NpbmUgPT0gXCJEUFRcIiB8fCB2YWNjaW5lID09IFwiQUxMXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZSA9IFwiUEVOVEFcIjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2bS5hY3RpdmVWYWNjaW5lID0gdmFjY2luZTtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLm1hcFRpdGxlID0gdm0uZ2V0TWFwVGl0bGUodmFjY2luZSk7XG5cbiAgICAgICAgICAgICAgICBjb2xvckNvdW50cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgUmVkOiAwLFxuICAgICAgICAgICAgICAgICAgICBZZWxsb3c6IDAsXG4gICAgICAgICAgICAgICAgICAgIERhcmtHcmVlbjogMCxcbiAgICAgICAgICAgICAgICAgICAgTGlnaHRHcmF5OiAwLFxuICAgICAgICAgICAgICAgICAgICBPcmFuZ2U6IDBcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdmFyIHBhdGhzID0gZDMuc2VsZWN0KFwiI21hcCBzdmdcIikuc2VsZWN0QWxsKFwicGF0aFwiKTtcbiAgICAgICAgICAgICAgICBwYXRocy5zdHlsZShcImZpbGxcIiwgdm0uZ2V0RmlsbENvbG9yKTtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7dm0uZHJhd0xlZ2VuZChjb2xvckNvdW50cyk7IH0sIDEwKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZtLmdldEZpbGxDb2xvciA9IGZ1bmN0aW9uKGQpIHtcblxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHZtLmdldERpc3RyaWN0VmFsdWUoZCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgY29sb3JWYWx1ZSA9IGNvbG9yKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAoY29sb3JWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29sb3JWYWx1ZSBpbiBjb2xvckNvdW50cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3JDb3VudHNbY29sb3JWYWx1ZV0gKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29sb3JWYWx1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJMaWdodEdyYXlcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2bS5nZXRMYXN0TWFwUGVyaW9kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhY2NpbmVEYXRhID0gdm0uc2FtcGxlRGlzdHJpY3REYXRhW3ZtLmFjdGl2ZVZhY2NpbmVdO1xuICAgICAgICAgICAgICAgIHZhciBwZXJpb2RMaXN0ID0gTWFwU3VwcG9ydFNlcnZpY2UuZ2V0UGVyaW9kTGlzdChcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZURhdGEsXG4gICAgICAgICAgICAgICAgICAgIGVuZFllYXIsXG4gICAgICAgICAgICAgICAgICAgIHZtLmFjdGl2ZVJlcG9ydFRvZ2dsZVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBlcmlvZExpc3RbcGVyaW9kTGlzdC5sZW5ndGgtMV07XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2bS5nZXREaXN0cmljdFZhbHVlID0gZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgIHZhciBkaXN0cmljdERhdGEgPSBkLnByb3BlcnRpZXMuZmllbGQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGlzdHJpY3REYXRhID09IHVuZGVmaW5lZCB8fCAoISAodm0uYWN0aXZlVmFjY2luZSBpbiBkaXN0cmljdERhdGEpKSApIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3JDb3VudHNbJ0xpZ2h0R3JheSddICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnTGlnaHRHcmF5JztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgdmFjY2luZURhdGEgPSBkaXN0cmljdERhdGFbdm0uYWN0aXZlVmFjY2luZV07XG5cbiAgICAgICAgICAgICAgICB2YXIgcGVyaW9kTGlzdCA9IE1hcFN1cHBvcnRTZXJ2aWNlLmdldFBlcmlvZExpc3QoXG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmVEYXRhLFxuICAgICAgICAgICAgICAgICAgICBlbmRZZWFyLFxuICAgICAgICAgICAgICAgICAgICB2bS5hY3RpdmVSZXBvcnRUb2dnbGVcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL2NvdmVyYWdlXCIpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWFwU3VwcG9ydFNlcnZpY2UuY2FsY3VsYXRlQ292ZXJhZ2VSYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFjY2luZURhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJpb2RMaXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0QWN0aXZlRG9zZU51bWJlcigpXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL2Ryb3BvdXRyYXRlXCIpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWFwU3VwcG9ydFNlcnZpY2UuY2FsY3VsYXRlRHJvcG91dFJhdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWNjaW5lRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZExpc3RcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodm0ucGF0aD09XCIvY292ZXJhZ2UvcmVkY2F0ZWdvcnlcIil7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNYXBTdXBwb3J0U2VydmljZS5jYWxjdWxhdGVSZWRDYXRlZ29yeVZhbHVlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFjY2luZURhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJpb2RMaXN0XG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH07XG5cblxuICAgICAgICAgICAgZnVuY3Rpb24gY2FsY3VsYXRlU2NhbGVDZW50ZXIoZmVhdHVyZXMpIHtcbiAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGJvdW5kaW5nIGJveCBvZiB0aGUgcGF0aHMgKGluIHBpeGVscykgYW5kIGNhbGN1bGF0ZSBhIHNjYWxlIGZhY3RvciBiYXNlZCBvbiBib3ggYW5kIG1hcCBzaXplXG4gICAgICAgICAgICAgICAgdmFyIGJib3hfcGF0aCA9IHBhdGguYm91bmRzKGZlYXR1cmVzKSxcbiAgICAgICAgICAgICAgICAgICAgc2NhbGUgPSAwLjk1IC8gTWF0aC5tYXgoXG4gICAgICAgICAgICAgICAgICAgICAgICAoYmJveF9wYXRoWzFdWzBdIC0gYmJveF9wYXRoWzBdWzBdKSAvIHdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgKGJib3hfcGF0aFsxXVsxXSAtIGJib3hfcGF0aFswXVsxXSkgLyBoZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGJvdW5kaW5nIGJveCBvZiB0aGUgZmVhdHVyZXMgKGluIG1hcCB1bml0cykgYW5kIHVzZSBpdCB0byBjYWxjdWxhdGUgdGhlIGNlbnRlciBvZiB0aGUgZmVhdHVyZXMuXG4gICAgICAgICAgICAgICAgdmFyIGJib3hfZmVhdHVyZSA9IGQzLmdlby5ib3VuZHMoZmVhdHVyZXMpLFxuICAgICAgICAgICAgICAgICAgICBjZW50ZXIgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAoYmJveF9mZWF0dXJlWzFdWzBdICsgYmJveF9mZWF0dXJlWzBdWzBdKSAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAoYmJveF9mZWF0dXJlWzFdWzFdICsgYmJveF9mZWF0dXJlWzBdWzFdKSAvIDJdO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgJ3NjYWxlJzpzY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgJ2NlbnRlcic6Y2VudGVyXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgIC8vIE5FVzogRGVmaW5pbmcgZ2V0SWRPZkZlYXR1cmVcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldElkT2ZGZWF0dXJlKGYpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGYucHJvcGVydGllcy5pZHVnO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgfTtcblxuXG4gICAgICAgIHZtLmdldFJlZFZhY2NpbmVEb3NlcyA9IGZ1bmN0aW9uKHBlcmlvZCwgdmFjY2luZSwgZGlzdHJpY3QpIHtcblxuXG4gICAgICAgICAgICAvL1RvZG86IFRlbXBvcmFyaWx5IGRpc2FibGUgZmlsdGVyaW5nIGJ5IGRpc3RyaWN0IGZvciB0aGUgdGFibGVcbiAgICAgICAgICAgIGRpc3RyaWN0ID0gXCJcIlxuICAgICAgICAgICAgdm0uZGlzdHJpY3QgPSBkaXN0cmljdDtcbiAgICAgICAgICAgIHZtLnZhY2NpbmUgPSB2YWNjaW5lOy8vdm0uc2VsZWN0ZWRWYWNjaW5lID8gdm0uc2VsZWN0ZWRWYWNjaW5lLm5hbWUgOiBcInZhXCI7XG5cbiAgICAgICAgICAgIC8vIEFzc2lnbiBkaW1lbnNpb25zIGZvciBtYXAgY29udGFpbmVyXG4gICAgICAgICAgICB2YXIgd2lkdGggPSA1MDAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gNTAwO1xuICAgICAgICAgICAgdmFyIGZpZWxkID0gXCJSZWRfY2F0ZWdvcnlcIjtcbiAgICAgICAgICAgIC8vaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL3JlZGNhdGVnb3J5XCIpe1xuICAgICAgICAgICAgLy8gICAgZmllbGQ9XCJSZWRfY2F0ZWdvcnlcIlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vfVxuXG4gICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmRpc3RyaWN0ID0gdm0uZGlzdHJpY3Q7XG4gICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnZhY2NpbmUgPSAgIHZtLnZhY2NpbmU7XG5cbiAgICAgICAgICAgIHZhciB2YWx1ZUZvcm1hdCA9IGQzLmZvcm1hdChcIixcIik7XG5cbiAgICAgICAgICAgIC8vIERlZmluZSBhIGdlb2dyYXBoaWNhbCBwcm9qZWN0aW9uXG4gICAgICAgICAgICAvLyBBbHNvLCBzZXQgaW5pdGlhbCB6b29tIHRvIHNob3cgdGhlIGZlYXR1cmVzXG4gICAgICAgICAgICB2YXIgcHJvamVjdGlvblx0PSBkMy5nZW8ubWVyY2F0b3IoKVxuICAgICAgICAgICAgICAgIC5zY2FsZSgxKTtcblxuICAgICAgICAgICAgLy8gUHJlcGFyZSBhIHBhdGggb2JqZWN0IGFuZCBhcHBseSB0aGUgcHJvamVjdGlvbiB0byBpdFxuICAgICAgICAgICAgdmFyIHBhdGggPSBkMy5nZW8ucGF0aCgpXG4gICAgICAgICAgICAgICAgLnByb2plY3Rpb24ocHJvamVjdGlvbik7XG5cbiAgICAgICAgICAgIC8vIFdlIHByZXBhcmUgYW4gb2JqZWN0IHRvIGxhdGVyIGhhdmUgZWFzaWVyIGFjY2VzcyB0byB0aGUgZGF0YS5cbiAgICAgICAgICAgIHZhciBkYXRhQnlJZCA9IGQzLm1hcCgpO1xuXG4gICAgICAgICAgICAvL0RlZmluZSBxdWFudGl6ZSBzY2FsZSB0byBzb3J0IGRhdGEgdmFsdWVzIGludG8gYnVja2V0cyBvZiBjb2xvclxuICAgICAgICAgICAgLy9Db2xvcnMgYnkgQ3ludGhpYSBCcmV3ZXIgKGNvbG9yYnJld2VyMi5vcmcpLCA5LWNsYXNzIFlsR25CdVxuXG4gICAgICAgICAgICB2YXIgY29sb3IgPSBkMy5zY2FsZS5xdWFudGl6ZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLnJhbmdlKGQzLnJhbmdlKDkpLG1hcChmdW5jdGlvbihpKSB7IHJldHVybiAncScgKyBpICsgJy05Jzt9KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmFuZ2UoWyAgICBcIiMwMDgwMDBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiNGRkZGMDBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiNGRkE1MDBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiNGRjAwMDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICBDb3ZlcmFnZVNlcnZpY2UuZ2V0UmVkVmFjY2luZURvc2VzKHBlcmlvZCwgdmFjY2luZSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICAvL1NldCBpbnB1dCBkb21haW4gZm9yIGNvbG9yIHNjYWxlXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yLmRvbWFpbihbXG4gICAgICAgICAgICAgICAgICAgICAgICBkMy5taW4oZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gK2RbZmllbGRdOyB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQzLm1heChkYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiArZFtmaWVsZF07IH0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgbWFwcyB0aGUgZGF0YSBvZiB0aGUgQ1NWIHNvIGl0IGNhbiBiZSBlYXNpbHkgYWNjZXNzZWQgYnlcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIElEIG9mIHRoZSBkaXN0cmljdCwgZm9yIGV4YW1wbGU6IGRhdGFCeUlkWzIxOTZdXG4gICAgICAgICAgICAgICAgICAgIGRhdGFCeUlkID0gZDMubmVzdCgpXG4gICAgICAgICAgICAgICAgICAgICAgLmtleShmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkOyB9KVxuICAgICAgICAgICAgICAgICAgICAgIC5yb2xsdXAoZnVuY3Rpb24oZCkgeyByZXR1cm4gZFswXTsgfSlcbiAgICAgICAgICAgICAgICAgICAgICAubWFwKGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBsZWdlbmQgPSBkMy5zZWxlY3QoJyNsZWdlbmQnKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGlzdC1pbmxpbmUnKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIga2V5cyA9IGxlZ2VuZC5zZWxlY3RBbGwoJ2xpLmtleScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZGF0YShjb2xvci5yYW5nZSgpKTtcblxuICAgICAgICAgICAgICAgICAgICBrZXlzLmVudGVyKCkuYXBwZW5kKCdsaScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAna2V5JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZSgnYm9yZGVyLXRvcC1jb2xvcicsIFN0cmluZylcbiAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkPT1cIiMwMDgwMDBcIil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdDQVQxJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChkPT1cIiNGRkZGMDBcIil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnQ0FUMidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZD09XCIjRkZBNTAwXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ0NBVDMnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkPT1cIiNGRjAwMDBcIil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnQ0FUNCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgICAgICAgICAvLyBMb2FkIGZlYXR1cmVzIGZyb20gR2VvSlNPTlxuICAgICAgICAgICAgICAgICAgICBkMy5qc29uKCdzdGF0aWMvYXBwL2NvbXBvbmVudHMvY292ZXJhZ2UvZGF0YS91Z19kaXN0cmljdHMyLmdlb2pzb24nLCBmdW5jdGlvbihlcnJvciwganNvbikge1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgc2NhbGUgYW5kIGNlbnRlciBwYXJhbWV0ZXJzIGZyb20gdGhlIGZlYXR1cmVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjYWxlQ2VudGVyID0gY2FsY3VsYXRlU2NhbGVDZW50ZXIoanNvbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFwcGx5IHNjYWxlLCBjZW50ZXIgYW5kIHRyYW5zbGF0ZSBwYXJhbWV0ZXJzLlxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbi5zY2FsZShzY2FsZUNlbnRlci5zY2FsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNlbnRlcihzY2FsZUNlbnRlci5jZW50ZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmFuc2xhdGUoW3dpZHRoLzIsIGhlaWdodC8yXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1lcmdlIHRoZSBjb3ZlcmFnZSBkYXRhIGFtZCBHZW9KU09OIGludG8gYSBzaW5nbGUgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFsc28gbG9vcCB0aHJvdWdoIG9uY2UgZm9yIGVhY2ggY292ZXJhZ2Ugc2NvcmUgZGF0YSB2YWx1ZVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGkgPCBkYXRhLmxlbmd0aCA7IGkrKyApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdyYWIgZGlzdHJpY3QgbmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkaXN0ID0gZGF0YVtpXS5kaXN0cmljdF9fbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gZGlzdC5pbmRleE9mKFwiIFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YURpc3RyaWN0ID0gZGlzdC5zdWJzdHJpbmcoMCwgcG9zKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFyIGRhdGFEaXN0cmljdCA9IGRhdGFbaV0uZGlzdHJpY3Q7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0dyYWIgZGF0YSB2YWx1ZSwgYW5kIGNvbnZlcnQgZnJvbSBzdHJpbmcgdG8gZmxvYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YVZhbHVlID0gK2RhdGFbaV1bZmllbGRdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9GaW5kIHRoZSBjb3JyZXNwb25kaW5nIGRpc3RyaWN0IGluc2lkZSBHZW9KU09OXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaj0wOyBqIDwganNvbi5mZWF0dXJlcy5sZW5ndGggOyBqKysgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgdGhlIGRpc3RyaWN0IHJlZmVyZW5jZSBpbiBqc29uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBqc29uRGlzdHJpY3QgPSBqc29uLmZlYXR1cmVzW2pdLnByb3BlcnRpZXMuZGlzdDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YURpc3RyaWN0ID09IGpzb25EaXN0cmljdCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0NvcHkgdGhlIGRhdGEgdmFsdWUgaW50byB0aGUgR2VvSlNPTlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbi5mZWF0dXJlc1tqXS5wcm9wZXJ0aWVzLmZpZWxkID0gZGF0YVZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1N0b3AgbG9va2luZyB0aHJvdWdoIEpTT05cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIFNWRyBpbnNpZGUgbWFwIGNvbnRhaW5lciBhbmQgYXNzaWduIGRpbWVuc2lvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc3ZnLnNlbGVjdEFsbChcIipcIikucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QoXCIjcmVkXCIpLnNlbGVjdEFsbChcIipcIikucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3ZnID0gZDMuc2VsZWN0KFwiI3JlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBZGQgYSA8Zz4gZWxlbWVudCB0byB0aGUgU1ZHIGVsZW1lbnQgYW5kIGdpdmUgYSBjbGFzcyB0byBzdHlsZSBsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgc3ZnLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ZlYXR1cmVzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJpbmQgZGF0YSBhbmQgY3JlYXRlIG9uZSBwYXRoIHBlciBHZW9KU09OIGZlYXR1cmVcbiAgICAgICAgICAgICAgICAgICAgICAgIHN2Zy5zZWxlY3RBbGwoXCJwYXRoXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRhdGEoanNvbi5mZWF0dXJlcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZW50ZXIoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJkXCIsIHBhdGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGhvdmVyb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgaG92ZXJvdXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBcIiM3NzdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHZXQgZGF0YSB2YWx1ZVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGQucHJvcGVydGllcy5maWVsZDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHZhbHVlIGV4aXN0cyAuLi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb2xvcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB2YWx1ZSBpcyB1bmRlZmluZXMgLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCIjY2NjXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgICAgICAgICAgICAgfSk7IC8vIEVuZCBkMy5qc29uXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gTG9naWMgdG8gaGFuZGxlIGhvdmVyIGV2ZW50IHdoZW4gaXRzIGZpcmVkdXBcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBob3Zlcm9uID0gZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9vbHRpcCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS5sZWZ0ID0gZXZlbnQucGFnZVggKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS50b3AgPSBldmVudC5wYWdlWSArICdweCc7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vRmlsbCB5ZWxsb3cgdG8gaGlnaGxpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCJ3aGl0ZVwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vU2hvdyB0aGUgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiN0b29sdGlwXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1BvcHVsYXRlIG5hbWUgaW4gdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiN0b29sdGlwIC5uYW1lXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KGQucHJvcGVydGllcy5kaXN0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vUG9wdWxhdGUgdmFsdWUgaW4gdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZC5wcm9wZXJ0aWVzLmZpZWxkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KFwiI3Rvb2x0aXAgLnZhbHVlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KFwiTm8gRGF0YVwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KFwiI3Rvb2x0aXAgLnZhbHVlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGV4dCgnQ0FUJyArICh2YWx1ZUZvcm1hdChkLnByb3BlcnRpZXMuZmllbGQpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhvdmVyb3V0ID0gZnVuY3Rpb24oZCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9SZXN0b3JlIG9yaWdpbmFsIGNob3JvcGxldGggZmlsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGQucHJvcGVydGllcy5maWVsZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb2xvcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIiNjY2NcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0hpZGUgdGhlIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QoXCIjdG9vbHRpcFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhQWxsZG9zZXMgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zRG9zZXMgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YUFsbGRvc2VzLFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVNjYWxlQ2VudGVyKGZlYXR1cmVzKSB7XG4gICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBib3VuZGluZyBib3ggb2YgdGhlIHBhdGhzIChpbiBwaXhlbHMpIGFuZCBjYWxjdWxhdGUgYSBzY2FsZSBmYWN0b3IgYmFzZWQgb24gYm94IGFuZCBtYXAgc2l6ZVxuICAgICAgICAgICAgICAgIHZhciBiYm94X3BhdGggPSBwYXRoLmJvdW5kcyhmZWF0dXJlcyksXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlID0gMC45NSAvIE1hdGgubWF4KFxuICAgICAgICAgICAgICAgICAgICAgICAgKGJib3hfcGF0aFsxXVswXSAtIGJib3hfcGF0aFswXVswXSkgLyB3aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIChiYm94X3BhdGhbMV1bMV0gLSBiYm94X3BhdGhbMF1bMV0pIC8gaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBib3VuZGluZyBib3ggb2YgdGhlIGZlYXR1cmVzIChpbiBtYXAgdW5pdHMpIGFuZCB1c2UgaXQgdG8gY2FsY3VsYXRlIHRoZSBjZW50ZXIgb2YgdGhlIGZlYXR1cmVzLlxuICAgICAgICAgICAgICAgIHZhciBiYm94X2ZlYXR1cmUgPSBkMy5nZW8uYm91bmRzKGZlYXR1cmVzKSxcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgKGJib3hfZmVhdHVyZVsxXVswXSArIGJib3hfZmVhdHVyZVswXVswXSkgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgKGJib3hfZmVhdHVyZVsxXVsxXSArIGJib3hfZmVhdHVyZVswXVsxXSkgLyAyXTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICdzY2FsZSc6c2NhbGUsXG4gICAgICAgICAgICAgICAgICAgICdjZW50ZXInOmNlbnRlclxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAvLyBORVc6IERlZmluaW5nIGdldElkT2ZGZWF0dXJlXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRJZE9mRmVhdHVyZShmKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmLnByb3BlcnRpZXMuaWR1ZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuXG4gICAgICAgIHZtLmdldFZhY2NpbmVEb3Nlc0J5RGlzdHJpY3QgPSBmdW5jdGlvbihwZXJpb2QsIGRpc3RyaWN0LCB2YWNjaW5lKSB7XG5cblxuICAgICAgICAgICAgQ292ZXJhZ2VTZXJ2aWNlLmdldFZhY2NpbmVEb3Nlc0J5RGlzdHJpY3QocGVyaW9kLCBkaXN0cmljdCwgdmFjY2luZSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmRyb3BlZG91dCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmKHZtLmRhdGEubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmRyb3BlZG91dCA9IHZtLmRhdGFbMF0uZHJvcF9vdXRfcmF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudW5kZXJpbW11bml6ZWQgPSB2bS5kYXRhWzBdLnVuZGVyX2ltbXVuaXplZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFjY2VzcyAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodm0uZGF0YVswXS5hY2Nlc3MgPj0gOTApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuYWNjZXNzID0gXCJHb29kXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5hY2Nlc3MgPSBcIlBvb3JcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLyogVXRpbGl6YXRpb24gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHNoZWxsU2NvcGUuY2hpbGQuZHJvcGVkb3V0IDw9IDEwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnV0aWxpemF0aW9uID0gXCJHb29kXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC51dGlsaXphdGlvbiA9IFwiUG9vclwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBSZWQgQ2F0ZWdvcml6YXRpb24qL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoKHZtLmRhdGFbMF0uYWNjZXNzID49IDkwKSAmJiAodm0uZGF0YVswXS5kcm9wX291dF9yYXRlIDw9MTApKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLnJlZGNhdGVnb3J5ID0gXCJDQVQxXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYodm0uZGF0YVswXS5hY2Nlc3MgPj0gOTAgJiYgdm0uZGF0YVswXS5kcm9wX291dF9yYXRlID4gMTApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUucmVkY2F0ZWdvcnkgPSBcIkNBVDJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZih2bS5kYXRhWzBdLmFjY2VzcyA8IDkwICYmIHZtLmRhdGFbMF0uZHJvcF9vdXRfcmF0ZSA8PSAxMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5yZWRjYXRlZ29yeSA9IFwiQ0FUM1wiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKHZtLmRhdGFbMF0uYWNjZXNzIDwgOTAgJiYgdm0uZGF0YVswXS5kcm9wX291dF9yYXRlID4gMTApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUucmVkY2F0ZWdvcnkgPSBcIkNBVDRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2bS5nZXRBY3RpdmVEb3NlTnVtYmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodm0uYWN0aXZlRG9zZSAhPSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIE51bWJlcih2bS5hY3RpdmVEb3NlLnN1YnN0cih2bS5hY3RpdmVEb3NlLmxlbmd0aC0xLCAxKSk7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfTtcblxuICAgICAgICB2bS5jb21wdXRlUmF0ZSA9IGZ1bmN0aW9uKGRvc2VzLCBwbGFubmVkKSB7XG4gICAgICAgICAgICBpZiAodm0ucGF0aD09XCIvY292ZXJhZ2UvY292ZXJhZ2VcIil7XG4gICAgICAgICAgICAgICAgdmFyIGFjdGl2ZURvc2VOdW1iZXIgPSB2bS5nZXRBY3RpdmVEb3NlTnVtYmVyKCk7XG4gICAgICAgICAgICAgICAgdmFyIGRvc2VWYWx1ZSA9IGRvc2VzLmxhc3Q7XG5cbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlRG9zZU51bWJlciA9PSAxKSBkb3NlVmFsdWUgPSBkb3Nlcy5maXJzdDtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChhY3RpdmVEb3NlTnVtYmVyID09IDIpIGRvc2VWYWx1ZSA9IGRvc2VzLnNlY29uZDtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChhY3RpdmVEb3NlTnVtYmVyID09IDMpIGRvc2VWYWx1ZSA9IGRvc2VzLnRoaXJkO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIChkb3NlVmFsdWUgLyBwbGFubmVkKSAqIDEwMDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodm0ucGF0aD09XCIvY292ZXJhZ2UvZHJvcG91dHJhdGVcIil7XG4gICAgICAgICAgICAgICAgcmV0dXJuICgoZG9zZXMuZmlyc3QgLSBkb3Nlcy5sYXN0KSAvIGRvc2VzLmZpcnN0KSAqIDEwMDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodm0ucGF0aD09XCIvY292ZXJhZ2UvcmVkY2F0ZWdvcnlcIil7XG4gICAgICAgICAgICAgICAgdmFyIGFjY2VzcyA9IChkb3Nlcy5maXJzdC9wbGFubmVkKSAqIDEwMDtcbiAgICAgICAgICAgICAgICB2YXIgZHJvcG91dFJhdGUgPSAoKGRvc2VzLmZpcnN0IC0gZG9zZXMubGFzdCkgLyBkb3Nlcy5maXJzdCkgKiAxMDA7XG5cbiAgICAgICAgICAgICAgICBpZiAoYWNjZXNzID49IDkwICYmIGRyb3BvdXRSYXRlID49IDAgJiYgZHJvcG91dFJhdGUgPD0gMTApIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGFjY2VzcyA+PSA5MCAmJiAoZHJvcG91dFJhdGUgPCAwIHx8IGRyb3BvdXRSYXRlID4gMTApKSByZXR1cm4gMjtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChhY2Nlc3MgPCA5MCAmJiBkcm9wb3V0UmF0ZSA+PSAwICYmIGRyb3BvdXRSYXRlIDw9IDEwKSByZXR1cm4gMztcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChhY2Nlc3MgPCA5MCAmJiAoZHJvcG91dFJhdGUgPCAwIHx8IGRyb3BvdXRSYXRlID4gMTApKSByZXR1cm4gNDtcbiAgICAgICAgICAgICAgICBlbHNlIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmdldENoYXJ0RGF0YSA9IGZ1bmN0aW9uKHBhcmFtcywgZGF0YSwgcmVwb3J0WWVhciwgY3VtdWxhdGl2ZSkge1xuXG4gICAgICAgICAgICB2YXIgcGVyaW9kVmFsdWVzID0ge307XG4gICAgICAgICAgICB2YXIgcmVkQ2F0ZWdvcnlWYWx1ZXMgPSB7fTtcbiAgICAgICAgICAgIHZhciB0b3RhbHMgPSB7fTtcbiAgICAgICAgICAgIHZhciByZWRDYXRlZ29yeVRvdGFscyA9IHt9O1xuICAgICAgICAgICAgdmFyIHJhdGU7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gZGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciBwZXJpb2QgPSBkYXRhW2ldLnBlcmlvZDtcbiAgICAgICAgICAgICAgICB2YXIgbGFzdF9kb3NlID0gZGF0YVtpXS50b3RhbF9sYXN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgdmFyIGZpcnN0X2Rvc2UgPSBkYXRhW2ldLnRvdGFsX2ZpcnN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgdmFyIHNlY29uZF9kb3NlID0gZGF0YVtpXS50b3RhbF9zZWNvbmRfZG9zZTtcbiAgICAgICAgICAgICAgICB2YXIgdGhpcmRfZG9zZSA9IGRhdGFbaV0udG90YWxfdGhpcmRfZG9zZTtcbiAgICAgICAgICAgICAgICB2YXIgcGxhbm5lZCA9IGRhdGFbaV0udG90YWxfcGxhbm5lZDtcbiAgICAgICAgICAgICAgICB2YXIgdmFjY2luZSA9IGRhdGFbaV0udmFjY2luZV9fbmFtZTtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdHJpY3QgPSBkYXRhW2ldLmRpc3RyaWN0X19uYW1lO1xuXG4gICAgICAgICAgICAgICAgdmFyIGRhdGFNb250aCA9IGFwcEhlbHBlcnMuZ2V0TW9udGhGcm9tUGVyaW9kKHBlcmlvZCwgcmVwb3J0WWVhcik7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGFZZWFyID0gYXBwSGVscGVycy5nZXRZZWFyRnJvbVBlcmlvZChwZXJpb2QsIHJlcG9ydFllYXIpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHllYXJMYWJlbCA9IGFwcEhlbHBlcnMuZ2V0WWVhckxhYmVsRnJvbVBlcmlvZChwZXJpb2QsIHJlcG9ydFllYXIpO1xuICAgICAgICAgICAgICAgIHZhciBtb250aEluZGV4ID0gYXBwSGVscGVycy5nZXRNb250aEluZGV4RnJvbVBlcmlvZChwZXJpb2QsIHJlcG9ydFllYXIpO1xuXG4gICAgICAgICAgICAgICAgLyogVGhlIHZpZXcgcmV0dXJucyBleHRyYSBkYXRhIHRvIGNhdGVyIGZvciB0aGUgZmluYW5jaWFsIHllYXJcbiAgICAgICAgICAgICAgICBTaW5jZSBpdHMgaWdub3JhbnQgb2YgdGhlIHBlcmlvZHMsIHdlIGRvIHRoZSBmaWx0ZXJzIG91cnNlbHZlc1xuICAgICAgICAgICAgICAgIERpZG4ndCB3YW50IHRvIGNyZWF0ZSBhIG5ldyBBUEkgY2FsbCBmb3IgYSBjaGFuZ2UgaW4gcmVwb3J0IHllYXJcbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGlmICgocmVwb3J0WWVhciA9PSBcIkNZXCIpICYmIChkYXRhWWVhciA+IHBhcmFtcy5lbmRZZWFyKSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgLy8gaWYgKChyZXBvcnRZZWFyID09IFwiRllcIikgJiYgKGRhdGFZZWFyID09IHBhcmFtcy5lbmRZZWFyKSAmJiAoZGF0YU1vbnRoID4gNikpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGlmICgocmVwb3J0WWVhciA9PSBcIkZZXCIpICYmIChkYXRhWWVhciA9PSBwYXJhbXMuc3RhcnRZZWFyKSAmJiAoZGF0YU1vbnRoIDw9IDYpKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIGlmICghICh5ZWFyTGFiZWwgaW4gcGVyaW9kVmFsdWVzKSkge1xuICAgICAgICAgICAgICAgICAgICBwZXJpb2RWYWx1ZXNbeWVhckxhYmVsXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICByZWRDYXRlZ29yeVZhbHVlc1t5ZWFyTGFiZWxdID0ge307XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsc1t5ZWFyTGFiZWxdID0ge307XG4gICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VG90YWxzW3llYXJMYWJlbF0gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoISAodmFjY2luZSBpbiBwZXJpb2RWYWx1ZXNbeWVhckxhYmVsXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kVmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgcmVkQ2F0ZWdvcnlWYWx1ZXNbeWVhckxhYmVsXVt2YWNjaW5lXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICB0b3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXSA9IHtmaXJzdF9kb3NlOiAwLCBzZWNvbmRfZG9zZTowLCB0aGlyZF9kb3NlOjAsIGxhc3RfZG9zZTogMCwgcGxhbm5lZDogMH07XG4gICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZGlzdHJpY3QgIT0gdW5kZWZpbmVkICYmICEoZGlzdHJpY3QgaW4gcmVkQ2F0ZWdvcnlUb3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVkQ2F0ZWdvcnlUb3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXVtkaXN0cmljdF0gPSB7Zmlyc3RfZG9zZTogMCwgbGFzdF9kb3NlOiAwLCBwbGFubmVkOiAwfTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoY3VtdWxhdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodm0ucGF0aCA9PSAnL2NvdmVyYWdlL3JlZGNhdGVnb3J5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbWJpbmVkRmlyc3REb3NlID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWRDYXRlZ29yeVRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdW2Rpc3RyaWN0XS5maXJzdF9kb3NlICsgZmlyc3RfZG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb21iaW5lZExhc3REb3NlID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWRDYXRlZ29yeVRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdW2Rpc3RyaWN0XS5sYXN0X2Rvc2UgKyBsYXN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29tYmluZWRQbGFubmVkID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWRDYXRlZ29yeVRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdW2Rpc3RyaWN0XS5wbGFubmVkICsgcGxhbm5lZDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVkQ2F0ZWdvcnlUb3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXVtkaXN0cmljdF0uZmlyc3RfZG9zZSA9IGNvbWJpbmVkRmlyc3REb3NlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVkQ2F0ZWdvcnlUb3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXVtkaXN0cmljdF0ubGFzdF9kb3NlID0gY29tYmluZWRMYXN0RG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV1bZGlzdHJpY3RdLnBsYW5uZWQgPSBjb21iaW5lZFBsYW5uZWQ7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29tYmluZWRGaXJzdERvc2UgPSB0b3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXS5maXJzdF9kb3NlICsgZmlyc3RfZG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb21iaW5lZExhc3REb3NlID0gdG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0ubGFzdF9kb3NlICsgbGFzdF9kb3NlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbWJpbmVkU2Vjb25kRG9zZSA9IHRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLnNlY29uZF9kb3NlICsgc2Vjb25kX2Rvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29tYmluZWRUaGlyZERvc2UgPSB0b3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXS50aGlyZF9kb3NlICsgdGhpcmRfZG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb21iaW5lZFBsYW5uZWQgPSB0b3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXS5wbGFubmVkICsgcGxhbm5lZDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0uZmlyc3RfZG9zZSA9IGNvbWJpbmVkRmlyc3REb3NlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0ubGFzdF9kb3NlID0gY29tYmluZWRMYXN0RG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLnNlY29uZF9kb3NlID0gY29tYmluZWRTZWNvbmREb3NlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0udGhpcmRfZG9zZSA9IGNvbWJpbmVkVGhpcmREb3NlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0ucGxhbm5lZCA9IGNvbWJpbmVkUGxhbm5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJhdGUgPSB2bS5jb21wdXRlUmF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdDogY29tYmluZWRGaXJzdERvc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWNvbmQ6IGNvbWJpbmVkU2Vjb25kRG9zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXJkOiBjb21iaW5lZFRoaXJkRG9zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3Q6IGNvbWJpbmVkTGFzdERvc2VcbiAgICAgICAgICAgICAgICAgICAgfSwgY29tYmluZWRQbGFubmVkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByYXRlID0gdm0uY29tcHV0ZVJhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3Q6Zmlyc3RfZG9zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlY29uZDpzZWNvbmRfZG9zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXJkOiB0aGlyZF9kb3NlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdDogbGFzdF9kb3NlfVxuICAgICAgICAgICAgICAgICAgICAsIHBsYW5uZWQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh2bS5wYXRoID09ICcvY292ZXJhZ2UvcmVkY2F0ZWdvcnknKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjYXRlZ29yeSA9IHJhdGU7XG4gICAgICAgICAgICAgICAgICAgIGlmICghIChtb250aEluZGV4IGluIHJlZENhdGVnb3J5VmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVkQ2F0ZWdvcnlWYWx1ZXNbeWVhckxhYmVsXVt2YWNjaW5lXVttb250aEluZGV4XSA9IHt9O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghIChjYXRlZ29yeSBpbiByZWRDYXRlZ29yeVZhbHVlc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdW21vbnRoSW5kZXhdKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV1bbW9udGhJbmRleF1bY2F0ZWdvcnldID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgcmVkQ2F0ZWdvcnlWYWx1ZXNbeWVhckxhYmVsXVt2YWNjaW5lXVttb250aEluZGV4XVtjYXRlZ29yeV0ucHVzaChkaXN0cmljdCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kVmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV0ucHVzaCh7eDogbW9udGhJbmRleCwgeTogZDMuZm9ybWF0KCcuMDFmJykocmF0ZSl9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjaGFydERhdGEgPSBbXTtcblxuICAgICAgICAgICAgaWYgKHZtLnBhdGggPT0gJy9jb3ZlcmFnZS9yZWRjYXRlZ29yeScpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2V0UmVkQ2F0ZWdvcnlWYWx1ZXMgPSBmdW5jdGlvbihtb250aEluZGV4LCBjYXREaXN0cmljdHMsIHRvdGFsRGlzdHJpY3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogTnVtYmVyKG1vbnRoSW5kZXgpLCB5OiBkMy5mb3JtYXQoJy4wMWYnKSgoY2F0RGlzdHJpY3RzIC8gdG90YWxEaXN0cmljdHMpICogMTAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHg6IE51bWJlcihtb250aEluZGV4KSwgeTogZDMuZm9ybWF0KCcuMDFmJykoY2F0RGlzdHJpY3RzKVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2YXIgZ2V0VG90YWxSZWRDYXRlZ29yeURpc3RyaWN0cyA9IGZ1bmN0aW9uKGNhdCwgZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2F0IGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhW2NhdF0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2YXIgY2F0ZWdvcnlWYWx1ZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgIDE6IFtdLCAyOiBbXSwgMzogW10sIDQ6IFtdXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIHllYXJMYWJlbCBpbiByZWRDYXRlZ29yeVZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB2YWNjaW5lIGluIHJlZENhdGVnb3J5VmFsdWVzW3llYXJMYWJlbF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIG1vbnRoSW5kZXggaW4gcmVkQ2F0ZWdvcnlWYWx1ZXNbeWVhckxhYmVsXVt2YWNjaW5lXSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhY2NpbmVEYXRhID0gcmVkQ2F0ZWdvcnlWYWx1ZXNbeWVhckxhYmVsXVt2YWNjaW5lXVttb250aEluZGV4XTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHllYXJMYWJlbCArIFwiLVwiICsgbW9udGhJbmRleCArIFwiLVwiICsgdmFjY2luZSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHZhY2NpbmVEYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjYXQxRGlzdHJpY3RzID0gZ2V0VG90YWxSZWRDYXRlZ29yeURpc3RyaWN0cygxLCB2YWNjaW5lRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNhdDJEaXN0cmljdHMgPSBnZXRUb3RhbFJlZENhdGVnb3J5RGlzdHJpY3RzKDIsIHZhY2NpbmVEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2F0M0Rpc3RyaWN0cyA9IGdldFRvdGFsUmVkQ2F0ZWdvcnlEaXN0cmljdHMoMywgdmFjY2luZURhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjYXQ0RGlzdHJpY3RzID0gZ2V0VG90YWxSZWRDYXRlZ29yeURpc3RyaWN0cyg0LCB2YWNjaW5lRGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG90YWxEaXN0cmljdHMgPSBjYXQxRGlzdHJpY3RzICsgY2F0MkRpc3RyaWN0cyArIGNhdDNEaXN0cmljdHMgKyBjYXQ0RGlzdHJpY3RzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlWYWx1ZXNbMV0ucHVzaChnZXRSZWRDYXRlZ29yeVZhbHVlcyhtb250aEluZGV4LCBjYXQxRGlzdHJpY3RzLCB0b3RhbERpc3RyaWN0cykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5VmFsdWVzWzJdLnB1c2goZ2V0UmVkQ2F0ZWdvcnlWYWx1ZXMobW9udGhJbmRleCwgY2F0MkRpc3RyaWN0cywgdG90YWxEaXN0cmljdHMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeVZhbHVlc1szXS5wdXNoKGdldFJlZENhdGVnb3J5VmFsdWVzKG1vbnRoSW5kZXgsIGNhdDNEaXN0cmljdHMsIHRvdGFsRGlzdHJpY3RzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlWYWx1ZXNbNF0ucHVzaChnZXRSZWRDYXRlZ29yeVZhbHVlcyhtb250aEluZGV4LCBjYXQ0RGlzdHJpY3RzLCB0b3RhbERpc3RyaWN0cykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY2hhcnREYXRhLnB1c2goe2tleTogJ0NBVDEnLCBjb2xvcjogJ0RhcmtHcmVlbicsIHZhbHVlczogdm0uZmlsbE1pc3NpbmdWYWx1ZXMoY2F0ZWdvcnlWYWx1ZXNbMV0pfSk7XG4gICAgICAgICAgICAgICAgY2hhcnREYXRhLnB1c2goe2tleTogJ0NBVDInLCBjb2xvcjogJ1llbGxvdycsIHZhbHVlczogdm0uZmlsbE1pc3NpbmdWYWx1ZXMoY2F0ZWdvcnlWYWx1ZXNbMl0pfSk7XG4gICAgICAgICAgICAgICAgY2hhcnREYXRhLnB1c2goe2tleTogJ0NBVDMnLCBjb2xvcjogJ09yYW5nZScsIHZhbHVlczogdm0uZmlsbE1pc3NpbmdWYWx1ZXMoY2F0ZWdvcnlWYWx1ZXNbM10pfSk7XG4gICAgICAgICAgICAgICAgY2hhcnREYXRhLnB1c2goe2tleTogJ0NBVDQnLCBjb2xvcjogJ1JlZCcsIHZhbHVlczogdm0uZmlsbE1pc3NpbmdWYWx1ZXMoY2F0ZWdvcnlWYWx1ZXNbNF0pfSk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeWVhckxhYmVsIGluIHBlcmlvZFZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB2YWNjaW5lIGluIHBlcmlvZFZhbHVlc1t5ZWFyTGFiZWxdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gdmFjY2luZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFJlbW92ZSBhbnRpZ2VucyB0aGF0IGxhY2sgdmFsdWUgZm9yIHBhcnRpY3VsYXIgZG9zZSBvbiBDb3ZlcmFnZSAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZtLnBhdGggPT0gJy9jb3ZlcmFnZS9jb3ZlcmFnZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodm0uYWN0aXZlRG9zZSA9PSBcIkRvc2UgM1wiICYmICQuaW5BcnJheSh2YWNjaW5lLCBbJ1BFTlRBJywgJ1BDVicsICdPUFYnXSkgPT0gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZtLmFjdGl2ZURvc2UgPT0gXCJEb3NlIDJcIiAmJiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmluQXJyYXkodmFjY2luZSwgWydQRU5UQScsICdQQ1YnLCAnT1BWJywgJ0hQVicsICdJUFYnLCAnVFQnXSkgPT0gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVzID0gdm0uZmlsbE1pc3NpbmdWYWx1ZXMocGVyaW9kVmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnREYXRhLnB1c2goe2tleToga2V5LCB2YWx1ZXM6IHZhbHVlc30pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2hhcnREYXRhO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmZpbGxNaXNzaW5nVmFsdWVzID0gZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICAgICAgICB2YXIgbW9udGhJbmRleGVzID0gXy5yYW5nZSgxLCAxMyk7XG4gICAgICAgICAgICB2YXIgZXhpc3RpbmdJbmRleGVzID0gdmFsdWVzLm1hcChmdW5jdGlvbihpdGVtKSB7IHJldHVybiBpdGVtLng7IH0pO1xuICAgICAgICAgICAgdmFyIG5ld0luZGV4ZXMgPSBtb250aEluZGV4ZXMuZmlsdGVyKGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXhpc3RpbmdJbmRleGVzLmluZGV4T2YodikgPCAwO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBuZXdJbmRleGVzLmZvckVhY2goZnVuY3Rpb24obW9udGhJbmRleCkge1xuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHt4OiBtb250aEluZGV4LCB5OiAwfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZXMuc29ydChmdW5jdGlvbihhLCBiKSB7cmV0dXJuIGEueCAtIGIueH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmdldENoYXJ0T3B0aW9ucyA9IGZ1bmN0aW9uKHJlcG9ydFllYXIpIHtcbiAgICAgICAgICAgIHZhciB3aWR0aCA9ICh2bS5hY3RpdmVEaXN0cmljdCA9PSAnTmF0aW9uYWwnKSA/IDQ1MCA6IDkwMDtcbiAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdsaW5lQ2hhcnQnLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDQ1MCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgICAgICAgICB1c2VJbnRlcmFjdGl2ZUd1aWRlbGluZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJhY3RpdmVMYXllcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3Jhdml0eTogJ3MnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHg6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZC54OyB9LFxuICAgICAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbihkKXsgcmV0dXJuIGQueTsgfSxcbiAgICAgICAgICAgICAgICAgICAgZm9yY2VZOiBbLTEwLDE1MF0sXG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZUNoYW5nZTogZnVuY3Rpb24oZSl7IGNvbnNvbGUubG9nKFwic3RhdGVDaGFuZ2VcIik7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VTdGF0ZTogZnVuY3Rpb24oZSl7IGNvbnNvbGUubG9nKFwiY2hhbmdlU3RhdGVcIik7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwU2hvdzogZnVuY3Rpb24oZSl7IGNvbnNvbGUubG9nKFwidG9vbHRpcFNob3dcIik7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwSGlkZTogZnVuY3Rpb24oZSl7IGNvbnNvbGUubG9nKFwidG9vbHRpcEhpZGVcIik7IH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgeEF4aXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNMYWJlbDogJ01vbnRocycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBwSGVscGVycy5nZXRNb250aEZyb21OdW1iZXIoZCwgcmVwb3J0WWVhcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHlBeGlzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWw6ICdQZXJjZW50YWdlICglKSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGNoYXJ0KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCIhISEgbGluZUNoYXJ0IGNhbGxiYWNrICEhIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uZ2V0Q2hhcnRUaXRsZSA9IGZ1bmN0aW9uKHZhY2NpbmUpIHtcbiAgICAgICAgICAgIHZhciBkdXJhdGlvbiA9IHZtLmFjdGl2ZVJlcG9ydFRvZ2dsZVswXSA9PSAnQScgPyBcIkFubnVhbGl6ZWRcIiA6IFwiTW9udGhseVwiO1xuICAgICAgICAgICAgdmFyIHZhY2NpbmVOYW1lID0gKHZhY2NpbmUgPT0gXCJBTExcIikgPyBcImFudGlnZW5zXCIgOiB2YWNjaW5lO1xuICAgICAgICAgICAgdmFyIGRvc2VOdW1iZXIgPSB2bS5hY3RpdmVEb3NlLnJlcGxhY2UoXCJEb3NlIFwiLCBcIlwiKTtcbiAgICAgICAgICAgIGlmICh2YWNjaW5lID09IFwiQUxMXCIpIGRvc2VOdW1iZXIgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIGFudGlnZW5MYWJlbCA9IHZtLmFjdGl2ZURvc2UgIT0gdW5kZWZpbmVkID8gXG4gICAgICAgICAgICAgICAgYCR7dmFjY2luZU5hbWV9JHtkb3NlTnVtYmVyfWAgOiB2YWNjaW5lTmFtZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHllYXJUeXBlID0gdm0uYWN0aXZlUmVwb3J0WWVhciA9PSAnQ1knID8gJ0NhbGVuZGFyIFllYXInIDogJ0ZpbmFuY2lhbCB5ZWFyJztcblxuICAgICAgICAgICAgdmFyIHRhYiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9kcm9wb3V0cmF0ZVwiKVxuICAgICAgICAgICAgICAgIHRhYiA9IFwiRHJvcG91dCBSYXRlXCI7XG4gICAgICAgICAgICBlbHNlIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9yZWRjYXRlZ29yeVwiKVxuICAgICAgICAgICAgICAgIHRhYiA9IFwiUmVkIENhdGVnb3JpemF0aW9uXCI7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGFiID0gXCJDb3ZlcmFnZVwiO1xuXG4gICAgICAgICAgICByZXR1cm4gXCJUcmVuZCBvZiBcIiArIGR1cmF0aW9uICsgXCIgXCIgKyB0YWIgKyBcIiBvZiBcIiArXG4gICAgICAgICAgICAgICAgYW50aWdlbkxhYmVsICsgXCIgZm9yIFwiICsgdm0uYWN0aXZlQ292ZXJhZ2VZZWFyICsgXCIgXCIgKyB5ZWFyVHlwZTtcbiAgICAgICAgfTtcblxuICAgICAgICB2bS5nZXRWYWNjaW5lRG9zZXNCeVBlcmlvZCA9IGZ1bmN0aW9uKHBhcmFtcykge1xuXG4gICAgICAgICAgICBDb3ZlcmFnZVNlcnZpY2UuZ2V0VmFjY2luZURvc2VzQnlQZXJpb2QocGFyYW1zKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUub3B0aW9uc01DWSA9IHZtLmdldENoYXJ0T3B0aW9ucyhcIkNZXCIpO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUub3B0aW9uc0FDWSA9IHZtLmdldENoYXJ0T3B0aW9ucyhcIkNZXCIpO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUub3B0aW9uc01GWSA9IHZtLmdldENoYXJ0T3B0aW9ucyhcIkZZXCIpO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUub3B0aW9uc0FGWSA9IHZtLmdldENoYXJ0T3B0aW9ucyhcIkZZXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhTUNZID0gdm0uZ2V0Q2hhcnREYXRhKHBhcmFtcywgZGF0YSwgXCJDWVwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhQUNZID0gdm0uZ2V0Q2hhcnREYXRhKHBhcmFtcywgZGF0YSwgXCJDWVwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGFNRlkgPSB2bS5nZXRDaGFydERhdGEocGFyYW1zLCBkYXRhLCBcIkZZXCIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGFBRlkgPSB2bS5nZXRDaGFydERhdGEocGFyYW1zLCBkYXRhLCBcIkZZXCIsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuY2hhcnRUaXRsZSA9IHZtLmdldENoYXJ0VGl0bGUodm0uc2VsZWN0ZWRBbnRpZ2VuKTtcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmVuYWJsZVBERkRvd25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmRvd25sb2FkUERGID0gZnVuY3Rpb24obmFtZSkgeyBDaGFydFBERkV4cG9ydC5leHBvcnRXaXRoU3R5bGVyKHZtLCBuYW1lKTsgfTtcbiAgICAgICAgICAgICAgICAvKnNoZWxsU2NvcGUuY2hpbGQuZG93bmxvYWRQREYgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9GaXggY2hhcnQgYmVmb3JlIGRvd25sb2FkXG4gICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdEFsbChcInN2ZyAubnYtbGluZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIiNmZmZmZmZcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAwKTtcblxuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3RBbGwoXCIubnZkMyAubnYtYmFja2dyb3VuZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIiNmZmZmZmZcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAwKTtcblxuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3RBbGwoXCIubnZkMyAubnYtYXhpcyBsaW5lXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgXCIjZTVlNWU1XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdEFsbChcIi5udmQzIHRleHRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZvbnRcIiwgXCJub3JtYWwgMTNweCBBcmlhbCwgc2Fucy1zZXJpZlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3RBbGwoXCIubnZkMyAubnYtZ3JvdXBzIC5udi1wb2ludFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIDApXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2Utd2lkdGhcIiwgXCIwcHhcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52ZDMgLm52LWF4aXMgLnplcm8gbGluZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIFwiIzQwNDA0MFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3RBbGwoXCIubnYteSAubnYtYXhpcyBnIHBhdGguZG9tYWluXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgXCIjNDA0MDQwXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdEFsbChcIi5sZWdlbmRRdWFudCAubGFiZWxcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZvbnRcIiwgXCJub3JtYWwgMTJweCBBcmlhbCwgc2Fucy1zZXJpZlwiKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgcGRmID0gbmV3IGpzUERGKCdsJywgJ21tJyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0geyBmb3JtYXQgOiAnUE5HJyB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHBkZi5hZGRIVE1MKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGRmUmVwb3J0XCIpLCAwLCAwLCBvcHRpb25zLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICBwZGYuc2F2ZSgnY292ZXJhZ2UtcmVwb3J0LnBkZicpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgfTtcblxuICAgICAgICAvLyAkc2NvcGUuJG9uKCdyZWZyZXNoJywgZnVuY3Rpb24oZSwgc3RhcnRNb250aCwgZW5kTW9udGgsIGRpc3RyaWN0LCB2YWNjaW5lKSB7XG4gICAgICAgIC8vICAgICBpZihzdGFydE1vbnRoLm5hbWUgJiYgZW5kTW9udGgubmFtZSAmJiBkaXN0cmljdC5uYW1lICYmIHZhY2NpbmUubmFtZSkge1xuICAgICAgICAkc2NvcGUuJG9uKFxuICAgICAgICAgICAgJ3JlZnJlc2hDb3ZlcmFnZTInLFxuICAgICAgICAgICAgZnVuY3Rpb24oZSwgZW5kTW9udGgsIHN0YXJ0WWVhciwgZW5kWWVhciwgYWN0aXZlQ292ZXJhZ2VZZWFyLCBhbnRpZ2VuLCBkb3NlLCBkaXN0cmljdCkge1xuICAgICAgICAgICAgICAgIC8qIGJ5IEZlbGl4OyBNdWx0aXBsZSBHZW9Kc29uIHJlcXVlc3RzIHdlcmUgYmVpbmcgc2VudCxcbiAgICAgICAgICAgICAgICB0cmFjZWQgdGhlIHByb2JsZW0gdG8gbXVsdGlwbGUgQ292ZXJhZ2VDb250cm9sbGVyIGNhbGxzLlxuICAgICAgICAgICAgICAgIEZvdW5kIHNvbHV0aW9uIGJ5IGNoZWNraW5nIGN1cnJlbnRTY29wZSBhcyBzaG93blxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaWYgKCd2bScgaW4gZS5jdXJyZW50U2NvcGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy92bS5nZXRTdG9ja0J5RGlzdHJpY3Qoc3RhcnRNb250aC5uYW1lLCBlbmRNb250aC5uYW1lLCBkaXN0cmljdC5uYW1lLCB2YWNjaW5lLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAvL3ZtLmdldFN0b2NrQnlEaXN0cmljdFZhY2NpbmUoc3RhcnRNb250aC5uYW1lLCBlbmRNb250aC5uYW1lLCBkaXN0cmljdC5uYW1lLCB2YWNjaW5lLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAvL3ZtLmdldERISVMyVmFjY2luZURvc2VzKGVuZE1vbnRoLnBlcmlvZCwgZGlzdHJpY3QubmFtZSwgdmFjY2luZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgdm0uYWN0aXZlRGlzdHJpY3QgPSBkaXN0cmljdDtcbiAgICAgICAgICAgICAgICAgICAgdm0uYWN0aXZlRG9zZSA9IGRvc2U7XG4gICAgICAgICAgICAgICAgICAgIHZtLmFjdGl2ZVN0YXJ0WWVhciA9IHN0YXJ0WWVhcjtcbiAgICAgICAgICAgICAgICAgICAgdm0uYWN0aXZlRW5kWWVhciA9IGVuZFllYXI7XG4gICAgICAgICAgICAgICAgICAgIHZtLnNlbGVjdGVkQW50aWdlbiA9IGFudGlnZW47XG4gICAgICAgICAgICAgICAgICAgIHZtLmFjdGl2ZUNvdmVyYWdlWWVhciA9IGFjdGl2ZUNvdmVyYWdlWWVhcjtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZW5hYmxlRGlzdHJpY3RHcm91cGluZyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2bS5wYXRoID09ICcvY292ZXJhZ2UvcmVkY2F0ZWdvcnknKVxuICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlRGlzdHJpY3RHcm91cGluZyA9IDE7XG5cbiAgICAgICAgICAgICAgICAgICAgdm0uZW5hYmxlUERGRG93bmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgdm0uZ2V0VmFjY2luZURvc2VzQnlEaXN0cmljdChlbmRNb250aC5wZXJpb2QsIGRpc3RyaWN0LCBhbnRpZ2VuKTtcbiAgICAgICAgICAgICAgICAgICAgdm0uZ2V0VmFjY2luZURvc2VzQnlQZXJpb2Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRZZWFyOiBhY3RpdmVDb3ZlcmFnZVllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRZZWFyOiBhY3RpdmVDb3ZlcmFnZVllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBhbnRpZ2VuOiBhbnRpZ2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgZG9zZTogZG9zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZURpc3RyaWN0R3JvdXBpbmc6IGVuYWJsZURpc3RyaWN0R3JvdXBpbmdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gdm0uZ2V0VmFjY2luZURvc2VzKGVuZE1vbnRoLnBlcmlvZCwgYW50aWdlbiwgZGlzdHJpY3QpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQ292ZXJhZ2VZZWFyICE9IHZtLmxhc3RFbmRZZWFyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRWYWNjaW5lRG9zZXMoYWN0aXZlQ292ZXJhZ2VZZWFyLCBhbnRpZ2VuLCBkaXN0cmljdCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS51cGRhdGVNYXBXaXRoVmFjY2luZShhbnRpZ2VuKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIHZtLmdldFJlZFZhY2NpbmVEb3NlcyhlbmRNb250aC5wZXJpb2QsIGFudGlnZW4pO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgdm0ubGFzdEVuZFllYXIgPSBhY3RpdmVDb3ZlcmFnZVllYXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgfVxuXG5dKVxuICAgIC5kaXJlY3RpdmUoXCJyZXBvcnRZZWFyVG9nZ2xlc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3RhdGljL2FwcC9jb21wb25lbnRzL2NvdmVyYWdlL3JlcG9ydC15ZWFyLXRvZ2dsZXMuaHRtbCdcbiAgICAgICAgfVxuICAgIH0pO1xufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpXG4uY29udHJvbGxlcignRnJpZGdlQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0ZyaWRnZVNlcnZpY2UnLCAnJHJvb3RTY29wZScsICdOZ1RhYmxlUGFyYW1zJywgJ0ZpbHRlclNlcnZpY2UnLFxuZnVuY3Rpb24oJHNjb3BlLCBGcmlkZ2VTZXJ2aWNlLCAkcm9vdFNjb3BlLCBOZ1RhYmxlUGFyYW1zLCBGaWx0ZXJTZXJ2aWNlKVxue1xuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2YXIgc2hlbGxTY29wZSA9ICRzY29wZS4kcGFyZW50O1xuICAgIHNoZWxsU2NvcGUuY2hpbGQgPSAkc2NvcGU7XG5cbiAgICB2bS5nZXRGcmlkZ2VBbGxEaXN0cmljdENhcGFjaXR5ID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKSB7XG5cbiAgICAgICAgdm0uc3RhcnRRdWFydGVyID0gdm0uc3RhcnRRdWFydGVyID8gdm0uc3RhcnRRdWFydGVyIDogXCIyMDE2MDFcIjtcbiAgICAgICAgdm0uZW5kUXVhcnRlciA9IHZtLmVuZFF1YXJ0ZXIgPyB2bS5lbmRRdWFydGVyIDogXCIyMDE2MDRcIjtcbiAgICAgICAgZnJpZGdlRGlzdHJpY3QgPSBcIlwiO1xuICAgICAgICB2bS5jYXJlbGV2ZWwgPSBjYXJlbGV2ZWw7XG5cbiAgICAgICAgRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VEaXN0cmljdENhcGFjaXR5KHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuXG4gICAgICAgICAgICB0YWJsZWRhdGFBbGxkaXN0cmljdHMgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zQ2FwYWNpdHlBbGxkaXN0cmljdHMgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YUFsbGRpc3RyaWN0cyxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vPT09PUFkZGl0aW9uYWwgTWV0cmljcz09PT1cblxuICAgICAgICAgICAgICAgIHZhciBtZXRyaWNzID0gRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VDYXBhY2l0eU1ldHJpY3Modm0uZGF0YSk7XG5cbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnVzdXJwID0gbWV0cmljcy5zdXJwbHVzO1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudXN1ZmZpY2llbnQgPSBtZXRyaWNzLnN1ZmZpY2llbnQ7XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC51c2hvcnRhZ2U9IG1ldHJpY3Muc2hvcnRhZ2U7XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uZ2V0RnJpZGdlRGlzdHJpY3RDYXBhY2l0eSA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuXG4gICAgICAgICAgICB2bS5zdGFydFF1YXJ0ZXIgPyB2bS5zdGFydFF1YXJ0ZXIgOiBcIjIwMTYwMVwiO1xuICAgICAgICAgICAgdm0uZW5kUXVhcnRlciA9IHZtLmVuZFF1YXJ0ZXIgPyB2bS5lbmRRdWFydGVyIDogXCIyMDE2MDRcIjtcbiAgICAgICAgICAgIGRpc3RyaWN0ID0gXCJcIjtcbiAgICAgICAgICAgIHZtLmZyaWRnZURpc3RyaWN0ID0gZnJpZGdlRGlzdHJpY3Q7XG4gICAgICAgICAgICB2bS5jYXJlbGV2ZWwgPSBjYXJlbGV2ZWw7XG5cbiAgICAgICAgICAgIEZyaWRnZVNlcnZpY2UuZ2V0RnJpZGdlRGlzdHJpY3RDYXBhY2l0eShzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuXG5cbiAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdG90YWxzXG5cbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmZyaWRnZURpc3RyaWN0ID0gZGlzdHJpY3Q7XG5cblxuXG5cbiAgICAgICAgICAgICAgICAvLyBjb25zdHJ1Y3QgRGlzdHJpY3QgZ3JhcGggZGF0YVxuICAgICAgICAgICAgICAgIHZhciBncmFwaGRhdGEgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgc2VyaWVzUmVxdWlyZWQgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgc2VyaWVzQXZhaWxhYmxlID0gW107XG4gICAgICAgICAgICAgICAgdmFyIHNlcmllc0dhcCA9IFtdO1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuYXZhaWxhYmxlID0gMDtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uZGF0YS5sZW5ndGggOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgc2VyaWVzUmVxdWlyZWQucHVzaChbdm0uZGF0YVtpXS5xdWFydGVyLnNsaWNlKDAsNCkgKyBcIi1RXCIgKyB2bS5kYXRhW2ldLnF1YXJ0ZXIuc2xpY2UoNSw2KSwgdm0uZGF0YVtpXS5yZXF1aXJlZF0pXG4gICAgICAgICAgICAgICAgICAgIHNlcmllc0F2YWlsYWJsZS5wdXNoKFt2bS5kYXRhW2ldLnF1YXJ0ZXIuc2xpY2UoMCw0KSArIFwiLVFcIiArIHZtLmRhdGFbaV0ucXVhcnRlci5zbGljZSg1LDYpLCB2bS5kYXRhW2ldLmF2YWlsYWJsZV0pXG4gICAgICAgICAgICAgICAgICAgIHNlcmllc0dhcC5wdXNoKFt2bS5kYXRhW2ldLnF1YXJ0ZXIuc2xpY2UoMCw0KSArIFwiLVFcIiArIHZtLmRhdGFbaV0ucXVhcnRlci5zbGljZSg1LDYpLCB2bS5kYXRhW2ldLmdhcF0pXG4gICAgICAgICAgICAgICAgICAgIGlmICh2bS5kYXRhW2ldLnF1YXJ0ZXIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5hdmFpbGFibGUgPSB2bS5kYXRhW2ldLmF2YWlsYWJsZVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICBzZXJpZXNSZXF1aXJlZCA9IFtbMjAxNjAyLCAzMF0sIFsyMDE2MDMsIDMwXV07XG4gICAgICAgICAgICAgICAgc2VyaWVzQXZhaWxhYmxlID0gW1syMDE2MDIsIDYwXSwgWzIwMTYwMywgMjBdXTtcbiAgICAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAgICAgZ3JhcGhkYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBrZXk6IFwiUmVxdWlyZWRcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBzZXJpZXNSZXF1aXJlZCxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6JyMyQTQ0OEEnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZ3JhcGhkYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBrZXk6IFwiQXZhaWxhYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlczogc2VyaWVzQXZhaWxhYmxlLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjonZ3JlZW4nXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB2bS5ncmFwaCA9IGdyYXBoZGF0YTtcblxuXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIGdyYXBoXG4gICAgICAgICAgICAgICAgdm0ub3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibXVsdGlCYXJDaGFydFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA0NTAsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDIwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3R0b206IDQ1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IDQ1XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpcEVkZ2U6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgeDogZnVuY3Rpb24oZCl7IHJldHVybiBkWzBdOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogZnVuY3Rpb24oZCl7IHJldHVybiBkWzFdOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dZQXhpczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbG9yOiBmdW5jdGlvbihkKXsgcmV0dXJuICdncmVlbid9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFsdWVGb3JtYXQ6IGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgcmV0dXJuIHRpY2tGb3JtYXQoZDMuZm9ybWF0KCcsLjFmJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfTtcblxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIHZtLmdldEZyaWRnZUZhY2lsaXR5Q2FwYWNpdHkgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcblxuICAgICAgICAgICAgdm0uc3RhcnRRdWFydGVyID8gdm0uc3RhcnRRdWFydGVyIDogXCIyMDE2MDFcIjtcbiAgICAgICAgICAgIHZtLmVuZFF1YXJ0ZXIgPSB2bS5lbmRRdWFydGVyID8gdm0uZW5kUXVhcnRlciA6IFwiMjAxNjA0XCI7XG4gICAgICAgICAgICBkaXN0cmljdCA9IFwiXCI7XG4gICAgICAgICAgICB2bS5kaXN0cmljdCA9IGZyaWRnZURpc3RyaWN0O1xuICAgICAgICAgICAgdm0uY2FyZWxldmVsID0gY2FyZWxldmVsO1xuXG4gICAgICAgICAgICBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZUZhY2lsaXR5Q2FwYWNpdHkoc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcbiAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc19mID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb3VudDogMTVcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB2bS5kYXRhLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRvdGFsc1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZnJpZGdlRGlzdHJpY3QgPSB2bS5mcmlkZ2VEaXN0cmljdDtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmNhcmVsZXZlbCA9IHZtLmNhcmVsZXZlbDtcblxuICAgICAgICAgICAgICAgIC8vPT09PUFkZGl0aW9uYWwgTWV0cmljcz09PT1cblxuICAgICAgICAgICAgICAgIHZhciBtZXRyaWNzID0gRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VDYXBhY2l0eU1ldHJpY3Modm0uZGF0YSk7XG5cbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnV0c3VycCA9IChtZXRyaWNzLnN1cnBsdXMvbWV0cmljcy50b3RhbCkqMTAwO1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudXRzdWZmaWNpZW50ID0gKG1ldHJpY3Muc3VmZmljaWVudC9tZXRyaWNzLnRvdGFsKSoxMDA7XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC51dHNob3J0YWdlPSAobWV0cmljcy5zaG9ydGFnZS9tZXRyaWNzLnRvdGFsKSoxMDA7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgdm0uZ2V0RnJpZGdlQWxsRGlzdHJpY3RSZWZyaWdlcmF0b3IgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcblxuICAgICAgICAgICAgdm0uc3RhcnRRdWFydGVyID0gdm0uc3RhcnRRdWFydGVyID8gdm0uc3RhcnRRdWFydGVyIDogXCIyMDE2MDFcIjtcbiAgICAgICAgICAgIHZtLmVuZFF1YXJ0ZXIgPSB2bS5lbmRRdWFydGVyID8gdm0uZW5kUXVhcnRlciA6IFwiMjAxNjA0XCI7XG4gICAgICAgICAgICBmcmlkZ2VEaXN0cmljdCA9IFwiXCI7XG4gICAgICAgICAgICB2bS5mcmlkZ2VEaXN0cmljdCA9IGZyaWRnZURpc3RyaWN0O1xuICAgICAgICAgICAgdm0uY2FyZWxldmVsID0gY2FyZWxldmVsO1xuXG4gICAgICAgICAgICBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZURpc3RyaWN0UmVmcmlnZXJhdG9yKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG4gICAgICAgICAgICAgICAgdGFibGVkYXRhQWxsZGlzdHJpY3RzID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNGdW5jdGlvbmFsaXR5QWxsZGlzdHJpY3RzID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFBbGxkaXN0cmljdHMsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2bS5nZXRGcmlkZ2VEaXN0cmljdFJlZnJpZ2VyYXRvciA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuXG4gICAgICAgICAgICAgICAgdm0uc3RhcnRRdWFydGVyID0gdm0uc3RhcnRRdWFydGVyID8gdm0uc3RhcnRRdWFydGVyIDogXCIyMDE2MDFcIjtcbiAgICAgICAgICAgICAgICB2bS5lbmRRdWFydGVyID0gdm0uZW5kUXVhcnRlciA/IHZtLmVuZFF1YXJ0ZXIgOiBcIjIwMTYwNFwiO1xuICAgICAgICAgICAgICAgIGRpc3RyaWN0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICB2bS5jYXJlbGV2ZWwgPSBjYXJlbGV2ZWw7XG5cbiAgICAgICAgICAgICAgICBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZURpc3RyaWN0UmVmcmlnZXJhdG9yKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhQWxsZGlzdHJpY3RzID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zQWxsZGlzdHJpY3RzID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFBbGxkaXN0cmljdHMsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfZCA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxNVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdm0uZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zdHJ1Y3QgRGlzdHJpY3QgZ3JhcGggZGF0YVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ3JhcGhmdW5jdGlvbmFsaXR5ZGF0YSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlcmllc0V4aXN0aW5nID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VyaWVzTm90V29ya2luZyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlcmllc21haW50ZW5hbmNlID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZnVuY3Rpb25hbGl0eSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmZyaWRnZURpc3RyaWN0ID0gZGlzdHJpY3Q7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5kYXRhLmxlbmd0aCA7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcmllc0V4aXN0aW5nLnB1c2goW3ZtLmRhdGFbaV0ucXVhcnRlci5zbGljZSgwLDQpICsgXCItUVwiICsgdm0uZGF0YVtpXS5xdWFydGVyLnNsaWNlKDUsNiksIHZtLmRhdGFbaV0ubnVtYmVyX2V4aXN0aW5nXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpZXNOb3RXb3JraW5nLnB1c2goW3ZtLmRhdGFbaV0ucXVhcnRlci5zbGljZSgwLDQpICsgXCItUVwiICsgdm0uZGF0YVtpXS5xdWFydGVyLnNsaWNlKDUsNiksIHZtLmRhdGFbaV0ubm90X3dvcmtpbmddKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcmllc21haW50ZW5hbmNlLnB1c2goW3ZtLmRhdGFbaV0ucXVhcnRlci5zbGljZSgwLDQpICsgXCItUVwiICsgdm0uZGF0YVtpXS5xdWFydGVyLnNsaWNlKDUsNiksIHZtLmRhdGFbaV0ubmVlZHNfbWFpbnRlbmFuY2VdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2bS5kYXRhW2ldLnF1YXJ0ZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5mdW5jdGlvbmFsaXR5ID0gKHZtLmRhdGFbaV0ubnVtYmVyX2V4aXN0aW5nIC0gdm0uZGF0YVtpXS5ub3Rfd29ya2luZykvdm0uZGF0YVtpXS5udW1iZXJfZXhpc3RpbmcqMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBncmFwaGZ1bmN0aW9uYWxpdHlkYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJFeGlzdGluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogc2VyaWVzRXhpc3RpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J2dyZWVuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBncmFwaGZ1bmN0aW9uYWxpdHlkYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJOb3QgV29ya2luZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogc2VyaWVzTm90V29ya2luZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjonIzJBNDQ4QSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhmdW5jdGlvbmFsaXR5ZGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiTmVlZHMgbWFpbnRlbmFuY2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IHNlcmllc21haW50ZW5hbmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOidyZWQnXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ3JhcGhmdW5jdGlvbmFsaXR5ID0gZ3JhcGhmdW5jdGlvbmFsaXR5ZGF0YTtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGUgZ3JhcGhcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLm9wdGlvbnNmdW5jdGlvbmFsaXR5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibXVsdGlCYXJDaGFydFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDQ1MCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDIwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IDIwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiA0NSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IDQ1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dDb250cm9sczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaXBFZGdlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbihkKXsgcmV0dXJuIGRbMF07IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFsxXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1lBeGlzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy92YWx1ZUZvcm1hdDogZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgIHJldHVybiB0aWNrRm9ybWF0KGQzLmZvcm1hdCgnLC4xZicpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cblxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdm0uZ2V0RnJpZGdlRmFjaWxpdHlSZWZyaWdlcmF0b3IgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcblxuICAgICAgICAgICAgICAgICAgICB2bS5zdGFydFF1YXJ0ZXIgPyB2bS5zdGFydFF1YXJ0ZXIgOiBcIjIwMTYwMVwiO1xuICAgICAgICAgICAgICAgICAgICB2bS5lbmRRdWFydGVyID0gdm0uZW5kUXVhcnRlciA/IHZtLmVuZFF1YXJ0ZXIgOiBcIjIwMTYwNFwiO1xuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIHZtLmRpc3RyaWN0ID0gZnJpZGdlRGlzdHJpY3Q7XG4gICAgICAgICAgICAgICAgICAgIHZtLmNhcmVsZXZlbCA9IGNhcmVsZXZlbDtcblxuICAgICAgICAgICAgICAgICAgICBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZUZhY2lsaXR5UmVmcmlnZXJhdG9yKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhQWxsZmFjaWxpdGllcyA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc0FsbGZhY2lsaXRpZXMgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YUFsbGZhY2lsaXRpZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc19mID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB2bS5kYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRvdGFsc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZnJpZGdlRGlzdHJpY3QgPSB2bS5mcmlkZ2VEaXN0cmljdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmNhcmVsZXZlbCA9IHZtLmNhcmVsZXZlbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgdm0uZ2V0RnJpZGdlQWxsRGlzdHJpY3RJbW11bml6aW5nRmFjaWxpdHkgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uc3RhcnRRdWFydGVyID0gdm0uc3RhcnRRdWFydGVyID8gdm0uc3RhcnRRdWFydGVyIDogXCIyMDE2MDFcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmVuZFF1YXJ0ZXIgPSB2bS5lbmRRdWFydGVyID8gdm0uZW5kUXVhcnRlciA6IFwiMjAxNjA0XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcmlkZ2VEaXN0cmljdCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5jYXJlbGV2ZWwgPSBjYXJlbGV2ZWw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIEZyaWRnZVNlcnZpY2UuZ2V0RnJpZGdlRGlzdHJpY3RJbW11bml6aW5nRmFjaWxpdHkoc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxEYXRhID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFBbGxkaXN0cmljdHMgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc0ltbXVuaXppbmdBbGxkaXN0cmljdHMgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YUFsbGRpc3RyaWN0cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldEZyaWRnZURpc3RyaWN0SW1tdW5pemluZ0ZhY2lsaXR5ID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5zdGFydFF1YXJ0ZXIgPyB2bS5zdGFydFF1YXJ0ZXIgOiBcIjIwMTYwMVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmVuZFF1YXJ0ZXIgPSBlbmRRdWFydGVyLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3QgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRpc3RyaWN0ID0gZnJpZGdlRGlzdHJpY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uY2FyZWxldmVsID0gY2FyZWxldmVsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VEaXN0cmljdEltbXVuaXppbmdGYWNpbGl0eShzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YUFsbGZyaWRnZSA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc0FsbGZyaWRnZSA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhQWxsZnJpZGdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zX2QgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHZtLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRvdGFsc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5mcmlkZ2VEaXN0cmljdCA9IGRpc3RyaWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5xdWFydGVyID0gZW5kUXVhcnRlci5uYW1lIC0gMjtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zdHJ1Y3QgRGlzdHJpY3QgZ3JhcGggZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdyYXBoZGF0YWltbXVuaXppbmcgPSBbXTtcblxuXG5cblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmRhdGEubGVuZ3RoIDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIEltbXVuaXppbmcgPSB2bS5kYXRhW2ldLmltbXVuaXppbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIE5vdEltbXVuaXppbmcgPSB2bS5kYXRhW2ldLlRvdGFsX2ZhY2lsaXRpZXMgLSB2bS5kYXRhW2ldLmltbXVuaXppbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmZhY2lsaXR5ID0gdm0uZGF0YVtpXS5pbW11bml6aW5nO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGUgZ3JhcGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLm9wdGlvbnNpbW11bml6aW5nID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwaWVDaGFydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQua2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQueTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0xhYmVsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxUaHJlc2hvbGQ6IDAuMDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsU3VuYmVhbUxheW91dDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ3JhcGhpbW11bml6aW5nID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIkltbXVuaXppbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogSW1tdW5pemluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J2dyZWVuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiTm90IEltbXVuaXppbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogTm90SW1tdW5pemluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6JyMyQTQ0OEEnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kb24oJ3JlZnJlc2hDYXBhY2l0eScsIGZ1bmN0aW9uKGUsIHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihzdGFydFF1YXJ0ZXIgJiYgZW5kUXVhcnRlciAmJiBmcmlkZ2VEaXN0cmljdC5kaXN0cmljdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0RnJpZGdlRGlzdHJpY3RSZWZyaWdlcmF0b3Ioc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdC5kaXN0cmljdCwgY2FyZWxldmVsLmdyb3VwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldEZyaWRnZUFsbERpc3RyaWN0UmVmcmlnZXJhdG9yKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QuZGlzdHJpY3QsIGNhcmVsZXZlbC5ncm91cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRGcmlkZ2VGYWNpbGl0eVJlZnJpZ2VyYXRvcihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LmRpc3RyaWN0LCBjYXJlbGV2ZWwuZ3JvdXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0RnJpZGdlQWxsRGlzdHJpY3RJbW11bml6aW5nRmFjaWxpdHkoc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdC5kaXN0cmljdCwgY2FyZWxldmVsLmdyb3VwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldEZyaWRnZURpc3RyaWN0SW1tdW5pemluZ0ZhY2lsaXR5KHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QuZGlzdHJpY3QsIGNhcmVsZXZlbC5ncm91cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRGcmlkZ2VBbGxEaXN0cmljdENhcGFjaXR5KHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QuZGlzdHJpY3QsIGNhcmVsZXZlbC5ncm91cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRGcmlkZ2VEaXN0cmljdENhcGFjaXR5KHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QuZGlzdHJpY3QsIGNhcmVsZXZlbC5ncm91cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRGcmlkZ2VGYWNpbGl0eUNhcGFjaXR5KHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QuZGlzdHJpY3QsIGNhcmVsZXZlbC5ncm91cCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgXSk7XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJykuY29udHJvbGxlcignRmluYW5jZURhdGFDb250cm9sbGVyJywgRmluYW5jZURhdGFDb250cm9sbGVyKTtcblxuRmluYW5jZURhdGFDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckaHR0cCcsICdGaW5hbmNlU2VydmljZSddO1xuZnVuY3Rpb24gRmluYW5jZURhdGFDb250cm9sbGVyKCRzY29wZSwgJGh0dHAsIEZpbmFuY2VTZXJ2aWNlKSB7XG5cbiAgICAkc2NvcGUuYWRkTmV3Um93ID0gYWRkTmV3Um93O1xuICAgICRzY29wZS5zYXZlUm93ID0gc2F2ZVJvdztcblxuICAgICRzY29wZS5ncmlkT3B0aW9ucyA9IHt9O1xuICAgICRzY29wZS5ncmlkT3B0aW9ucy5kYXRhID0gW107XG4gICAgJHNjb3BlLmdyaWRPcHRpb25zLmNvbHVtbkRlZnMgPSBbXG4gICAgICAgIHtuYW1lOiAncGVyaW9kJywgZW5hYmxlQ2VsbEVkaXQ6IHRydWUgfSxcbiAgICAgICAge25hbWU6ICdnYXZpX2FwcHJvdmVkJywgZW5hYmxlQ2VsbEVkaXQ6IHRydWUgfSxcbiAgICAgICAge25hbWU6ICdnYXZpX2Rpc2J1cnNlZCcsIGVuYWJsZUNlbGxFZGl0OiB0cnVlIH0sXG4gICAgICAgIHtuYW1lOiAnZ291X2FwcHJvdmVkJywgZW5hYmxlQ2VsbEVkaXQ6IHRydWUgfSxcbiAgICAgICAge25hbWU6ICdnb3VfZGlzYnVyc2VkJywgZW5hYmxlQ2VsbEVkaXQ6IHRydWUgfVxuICAgIF07XG5cbiAgICAvLyAkaHR0cC5nZXQoJy9maW5hbmNlL2xpc3QnLCB7fSlcbiAgICAvLyAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAvLyAgICAgICAgIHZhciBkYXRhID0gYW5ndWxhci5mcm9tSnNvbihyZXNwb25zZS5kYXRhKTtcbiAgICAvLyAgICAgICAgIGRhdGEubWFwKGZ1bmN0aW9uKGQpIHtcbiAgICAvLyAgICAgICAgICAgICAkc2NvcGUuZ3JpZE9wdGlvbnMuZGF0YS5wdXNoKGQuZmllbGRzKTtcbiAgICAvLyAgICAgICAgIH0pO1xuICAgIC8vICAgICB9KVxuICAgIEZpbmFuY2VTZXJ2aWNlLmdldEZpbmFuY2VEYXRhKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIGRhdGEubWFwKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICRzY29wZS5ncmlkT3B0aW9ucy5kYXRhLnB1c2goZCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLmdyaWRPcHRpb25zLm9uUmVnaXN0ZXJBcGkgPSBmdW5jdGlvbihncmlkQXBpKXtcbiAgICAgICAgJHNjb3BlLmdyaWRBcGkgPSBncmlkQXBpO1xuICAgICAgICBncmlkQXBpLnJvd0VkaXQub24uc2F2ZVJvdygkc2NvcGUsICRzY29wZS5zYXZlUm93KTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gYWRkTmV3Um93KCkge1xuICAgICAgICAkc2NvcGUuZ3JpZE9wdGlvbnMuZGF0YS5wdXNoKHtcbiAgICAgICAgICAgIHBlcmlvZDogMCxcbiAgICAgICAgICAgIGdhdmlfYXBwcm92ZWQ6IDAsXG4gICAgICAgICAgICBnYXZpX2Rpc2J1cnNlZDogMCxcbiAgICAgICAgICAgIGdvdV9hcHByb3ZlZDogMCxcbiAgICAgICAgICAgIGdvdV9kaXNidXJzZWQ6IDBcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2F2ZVJvdyhyb3dFbnRpdHkpIHtcbiAgICAgICAgJGh0dHAuZGVmYXVsdHMueHNyZkNvb2tpZU5hbWUgPSAnY3NyZnRva2VuJztcbiAgICAgICAgJGh0dHAuZGVmYXVsdHMueHNyZkhlYWRlck5hbWUgPSAnWC1DU1JGVG9rZW4nO1xuICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJy9maW5hbmNlL3VwZGF0ZScsIHJvd0VudGl0eSlcblxuICAgICAgICAkc2NvcGUuZ3JpZEFwaS5yb3dFZGl0LnNldFNhdmVQcm9taXNlKHJvd0VudGl0eSwgcHJvbWlzZS5wcm9taXNlKTtcbiAgICAgICAgY29uc29sZS5sb2cocm93RW50aXR5KTtcbiAgICB9XG59XG5cbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKS5jb250cm9sbGVyKCdNYWluRmluYW5jZUNvbnRyb2xsZXInLCBNYWluRmluYW5jZUNvbnRyb2xsZXIpO1xuXG5NYWluRmluYW5jZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0NoYXJ0UERGRXhwb3J0JywgJ0NoYXJ0U3VwcG9ydFNlcnZpY2UnLCAnRmluYW5jZVNlcnZpY2UnXTtcbmZ1bmN0aW9uIE1haW5GaW5hbmNlQ29udHJvbGxlcigkc2NvcGUsIENoYXJ0UERGRXhwb3J0LCBDaGFydFN1cHBvcnRTZXJ2aWNlLCBGaW5hbmNlU2VydmljZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uZXhwb3J0UERGID0gZnVuY3Rpb24obmFtZSkgeyBDaGFydFBERkV4cG9ydC5leHBvcnRXaXRoU3R5bGVyKHZtLCBuYW1lKTsgfTtcbiAgICB2bS5ncmFwaE9wdGlvbnMgPSBnZXRPcHRpb25zKCk7XG4gICAgdm0uYXBpRGF0YSA9IHVuZGVmaW5lZDtcbiAgICB2bS5jaGFydEluc3RhbmNlID0gdW5kZWZpbmVkO1xuICAgIHZtLnllYXJJbmRleGVzID0gW107XG4gICAgdm0uYWN0aXZlVG9nZ2xlID0gJ0dBVkknO1xuICAgIHZtLmdyYXBoQ3VycmVuY3kgPSAnVVNEJztcbiAgICB2bS5jb21wYWN0QW1vdW50cyA9IGZhbHNlO1xuXG4gICAgcmVzZXRHcmFwaERhdGEoKTtcbiAgICBzZXRZZWFyRmlsdGVyT3B0aW9ucygpO1xuICAgICRzY29wZS4kd2F0Y2goJ3ZtLmFjdGl2ZVRvZ2dsZScsIGNoYW5nZVRhYnMpO1xuICAgICRzY29wZS4kb24oJ3JlZnJlc2hGaW5hbmNlJywgdXBkYXRlQ2hhcnQpO1xuICAgICRzY29wZS4kd2F0Y2goJ3ZtLmdyYXBoQ3VycmVuY3knLCBjaGFuZ2VDdXJyZW5jeSk7XG4gICAgJHNjb3BlLiR3YXRjaCgndm0uY29tcGFjdEFtb3VudHMnLCBjb21wYWN0QW1vdW50cyk7XG5cbiAgICBmdW5jdGlvbiByZXNldEdyYXBoRGF0YSgpIHtcbiAgICAgICAgdm0uZ3JhcGhEYXRhID0gZ2V0RGVmYXVsdEdyYXBoRGF0YSgpO1xuICAgICAgICB2bS5hbGxvY0dyYXBoRGF0YSA9IFtdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoYW5nZUN1cnJlbmN5KG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICBpZiAobmV3VmFsdWUgIT0gb2xkVmFsdWUpIHtcbiAgICAgICAgICAgIHJlc2V0R3JhcGhEYXRhKCk7XG4gICAgICAgICAgICB1cGRhdGVDaGFydFdpdGhEYXRhKHZtLmFwaURhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tcGFjdEFtb3VudHMobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgIGlmIChuZXdWYWx1ZSAhPSBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgcmVzZXRHcmFwaERhdGEoKTtcbiAgICAgICAgICAgIHVwZGF0ZUNoYXJ0V2l0aERhdGEodm0uYXBpRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRZZWFyRmlsdGVyT3B0aW9ucygpIHtcbiAgICAgICAgRmluYW5jZVNlcnZpY2UuZ2V0RmluYW5jZVllYXJzKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAkc2NvcGUuJHBhcmVudC5maW5hbmNlWWVhcnMgPSBkYXRhO1xuICAgICAgICAgICAgJHNjb3BlLiRlbWl0KCdzZXREZWZhdWx0WWVhcnMnLCBkYXRhWzBdLCBkYXRhW2RhdGEubGVuZ3RoLTFdKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RGVmYXVsdEdyYXBoRGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdhdmlBbGxvYzogW1xuICAgICAgICAgICAgICAgIHtrZXk6ICdBcHByb3ZlZCcsIHZhbHVlczogW119LFxuICAgICAgICAgICAgICAgIHtrZXk6ICdEaXNidXJzZWQnLCB2YWx1ZXM6IFtdfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGdvdUFsbG9jOiBbXG4gICAgICAgICAgICAgICAge2tleTogJ0FwcHJvdmVkJywgdmFsdWVzOiBbXX0sXG4gICAgICAgICAgICAgICAge2tleTogJ0Rpc2J1cnNlZCcsIHZhbHVlczogW119XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgYWxsT2JsaWc6IFtcbiAgICAgICAgICAgICAgICB7a2V5OiAnR2F2aSBGdW5kcycsIHZhbHVlczogW119LFxuICAgICAgICAgICAgICAgIHtrZXk6ICdHT1UgRnVuZHMnLCB2YWx1ZXM6IFtdfVxuICAgICAgICAgICAgXVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9jdXIoYW1vdW50KSB7XG4gICAgICAgIGlmICh2bS5ncmFwaEN1cnJlbmN5ID09ICdVR1gnKVxuICAgICAgICAgICAgcmV0dXJuIGFtb3VudCAqIDM2MDA7XG4gICAgICAgIHJldHVybiBhbW91bnQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlQ2hhcnQoZSwgcGFyYW1zKSB7XG4gICAgICAgIHJlc2V0R3JhcGhEYXRhKCk7XG4gICAgICAgIEZpbmFuY2VTZXJ2aWNlLmdldEZpbmFuY2VEYXRhKHBhcmFtcykudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB2bS5hcGlEYXRhID0gZGF0YTtcbiAgICAgICAgICAgIHVwZGF0ZUNoYXJ0V2l0aERhdGEoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUNoYXJ0V2l0aERhdGEoZGF0YSkge1xuICAgICAgICB2bS55ZWFySW5kZXhlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpIGluIGRhdGEpIHtcbiAgICAgICAgICAgIHZhciB5ZWFySW5kZXggPSBnZXRZZWFySW5kZXgoZGF0YVtpXS5wZXJpb2QpXG5cbiAgICAgICAgICAgIHZtLmdyYXBoRGF0YS5hbGxPYmxpZ1swXS52YWx1ZXMucHVzaCh7eDogeWVhckluZGV4LCB5OiBfY3VyKGRhdGFbaV0uZ2F2aV9hcHByb3ZlZCl9KTtcbiAgICAgICAgICAgIHZtLmdyYXBoRGF0YS5hbGxPYmxpZ1sxXS52YWx1ZXMucHVzaCh7eDogeWVhckluZGV4LCB5OiBfY3VyKGRhdGFbaV0uZ291X2FwcHJvdmVkKX0pO1xuXG4gICAgICAgICAgICB2bS5ncmFwaERhdGEuZ2F2aUFsbG9jWzBdLnZhbHVlcy5wdXNoKHt4OiB5ZWFySW5kZXgsIHk6IF9jdXIoZGF0YVtpXS5nYXZpX2FwcHJvdmVkKX0pO1xuICAgICAgICAgICAgdm0uZ3JhcGhEYXRhLmdhdmlBbGxvY1sxXS52YWx1ZXMucHVzaCh7eDogeWVhckluZGV4LCB5OiBfY3VyKGRhdGFbaV0uZ2F2aV9kaXNidXJzZWQpfSk7XG5cbiAgICAgICAgICAgIHZtLmdyYXBoRGF0YS5nb3VBbGxvY1swXS52YWx1ZXMucHVzaCh7eDogeWVhckluZGV4LCB5OiBfY3VyKGRhdGFbaV0uZ291X2FwcHJvdmVkKX0pO1xuICAgICAgICAgICAgdm0uZ3JhcGhEYXRhLmdvdUFsbG9jWzFdLnZhbHVlcy5wdXNoKHt4OiB5ZWFySW5kZXgsIHk6IF9jdXIoZGF0YVtpXS5nb3VfZGlzYnVyc2VkKX0pO1xuICAgICAgICB9XG4gICAgICAgIC8qVHJpZ2dlciB0aGUgbG9hZGluZyBvZiB0aGUgaW5pdGFsIFRhYiwgd2l0aCByYW5kb20gdmFsdWVzKi9cbiAgICAgICAgY2hhbmdlVGFicygwLDEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE9wdGlvbnMoKSB7XG4gICAgICAgIHZhciBjaGFydE9wdGlvbnMgPSBDaGFydFN1cHBvcnRTZXJ2aWNlLmdldE9wdGlvbnMoJ211bHRpQmFyQ2hhcnQnKTtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LmNvbG9yID0gW1wiZ3JlZW5cIiwgXCJEb2RnZXJCbHVlXCJdO1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQud2lkdGggPSA5MDA7XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC5tYXJnaW4gPSB7bGVmdDogODAsIHRvcDogNzB9O1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQubGVnZW5kLndpZHRoID0gOTAwO1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQueEF4aXMuYXhpc0xhYmVsID0gXCJ5ZWFyc1wiO1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQueUF4aXMuYXhpc0xhYmVsID0gXCJcIjtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LnhBeGlzLnRpY2tGb3JtYXQgPSBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgIHJldHVybiB2bS55ZWFySW5kZXhlc1tkXTtcbiAgICAgICAgfTtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LnZhbHVlRm9ybWF0ID0gZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICByZXR1cm4gdGlja0Zvcm1hdChkMy5mb3JtYXQoJy4wZicpKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy9IdW1hbml6ZSB0aGUgbGFiZWxzXG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC5kaXNwYXRjaC5yZW5kZXJFbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh2bS5jb21wYWN0QW1vdW50cylcbiAgICAgICAgICAgICAgICBDaGFydFN1cHBvcnRTZXJ2aWNlLmluaXRMYWJlbHModHJ1ZSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQ2hhcnRTdXBwb3J0U2VydmljZS5pbml0TGFiZWxzKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2hhcnRPcHRpb25zO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFllYXJJbmRleCh5ZWFyKSB7XG4gICAgICAgIGlmICh2bS55ZWFySW5kZXhlcy5pbmRleE9mKHllYXIpID09IC0xKSB2bS55ZWFySW5kZXhlcy5wdXNoKHllYXIpO1xuICAgICAgICByZXR1cm4gdm0ueWVhckluZGV4ZXMuaW5kZXhPZih5ZWFyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGFuZ2VUYWJzKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICBpZiAobmV3VmFsdWUgIT0gb2xkVmFsdWUpIHtcbiAgICAgICAgICAgIENoYXJ0U3VwcG9ydFNlcnZpY2UuY2xlYXJMYWJlbHMoKTtcbiAgICAgICAgICAgIGlmICh2bS5hY3RpdmVUb2dnbGUgPT0gJ0dBVkknKVxuICAgICAgICAgICAgICAgIHZtLmFsbG9jR3JhcGhEYXRhID0gdm0uZ3JhcGhEYXRhLmdhdmlBbGxvYztcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB2bS5hbGxvY0dyYXBoRGF0YSA9IHZtLmdyYXBoRGF0YS5nb3VBbGxvYztcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG59KSh3aW5kb3cuYW5ndWxhcik7IiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8ndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJykuY29udHJvbGxlcignR2VuZXJpY0ltcG9ydENvbnRyb2xsZXInLCBHZW5lcmljSW1wb3J0Q29udHJvbGxlcik7XG5cbkdlbmVyaWNJbXBvcnRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckdWliTW9kYWwnXTtcbmZ1bmN0aW9uIEdlbmVyaWNJbXBvcnRDb250cm9sbGVyKCRzY29wZSwgJHVpYk1vZGFsKSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5pbXBvcnREYXRhRmlsZSA9IHNob3dJbXBvcnRNb2RhbDtcbiAgICB2bS5hbmltYXRpb25zRW5hYmxlZCA9IHRydWU7XG5cbiAgICBmdW5jdGlvbiBzaG93SW1wb3J0TW9kYWwoc2l6ZSwgcGFyZW50U2VsZWN0b3IpIHtcbiAgICAgICAgdmFyIHBhcmVudEVsZW0gPSBwYXJlbnRTZWxlY3RvciA/IFxuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJGRvY3VtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJy5nZW5lcmljLWltcG9ydCAnICsgcGFyZW50U2VsZWN0b3IpKSA6IHVuZGVmaW5lZDtcblxuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdm0uYW5pbWF0aW9uc0VuYWJsZWQsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2ltcG9ydE1vZGFsQ29udGVudC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNb2RhbEluc3RhbmNlQ3RybCcsXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICBzaXplOiBzaXplLFxuICAgICAgICAgICAgYXBwZW5kVG86IHBhcmVudEVsZW1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpbXBvcnREYXRhRmlsZSgpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvL2FsZXJ0KCdDYW5jZWxlbGQnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbXBvcnREYXRhRmlsZSgpIHtcbiAgICAgICAgYWxlcnQoJ0ltcG9ydCBpbiBwcm9ncmVzcycpO1xuICAgIH1cbn1cblxufSkod2luZG93LmFuZ3VsYXIpO1xuXG4oZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJykuY29udHJvbGxlcignTW9kYWxJbnN0YW5jZUN0cmwnLCBmdW5jdGlvbiAoJHVpYk1vZGFsSW5zdGFuY2UpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIHZtLm9rID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UoJ2RvbmUnKTtcbiAgICAgICAgfTtcbiAgICBcbiAgICAgICAgdm0uY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgICAgIH07XG4gICAgfSk7XG59KSh3aW5kb3cuYW5ndWxhcik7IiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpXG4gICAgLmNvbnRyb2xsZXIoJ1BsYW5uaW5nQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0FubnVhbFNlcnZpY2UnLCAnJHJvb3RTY29wZScsICdOZ1RhYmxlUGFyYW1zJywgJ0ZpbHRlclNlcnZpY2UnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgQW5udWFsU2VydmljZSwgJHJvb3RTY29wZSwgTmdUYWJsZVBhcmFtcywgRmlsdGVyU2VydmljZSlcbiAgICB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZhciBzaGVsbFNjb3BlID0gJHNjb3BlLiRwYXJlbnQ7XG4gICAgICAgIHNoZWxsU2NvcGUuY2hpbGQgPSAkc2NvcGU7XG5cbiAgICAgICAgdm0uZ2V0RnVuZEFjdGl2aXRpZXMgPSBmdW5jdGlvbih5ZWFyKSB7XG4gICAgICAgICAgICB5ZWFyID0gXCJcIlxuICAgICAgICAgICAgdm0ueWVhciA9IHllYXI7XG5cbiAgICAgICAgICAgIEFubnVhbFNlcnZpY2UuZ2V0RnVuZEFjdGl2aXRpZXMoeWVhcilcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZWRhdGFfZnVuZGVkID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZWRhdGFfdW5mdW5kZWQgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhX2Z1bmRlZCA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmZ1bmQgPT0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFfdW5mdW5kZWQgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5mdW5kID09IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhZnVuZCA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zZnVuZGVkID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxNVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFmdW5kLFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdG90YWxzXG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGdyYXBoZGF0YWZ1bmQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZ1bmRlZCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciB1bmZ1bmRlZCA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodm0uZGF0YVtpXS5mdW5kID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5kZWQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZtLmRhdGFbaV0uZnVuZCA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZnVuZGVkKys7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG5cblxuICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGUgZ3JhcGhcbiAgICAgICAgICAgICAgICAgICAgdm0uZnVuZGFjdGl2aXR5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncGllQ2hhcnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQua2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQueTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dMYWJlbHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFRocmVzaG9sZDogMC4wMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN1bmJlYW1MYXlvdXQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChmdW5kZWQgPT0gdm0uZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdyYXBoZnVuZGVkYWN0aXZpdGllcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfZnVuZGVkID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDE1XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFfZnVuZGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zX3VuZnVuZGVkID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDE1XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFfdW5mdW5kZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5ncmFwaGZ1bmRlZGFjdGl2aXRpZXMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiRnVuZGVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IChmdW5kZWQgLyB2bS5kYXRhLmxlbmd0aCkgKiAxMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOidncmVlbidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIlVuZnVuZGVkIEFjdGl2aXRpZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogKHVuZnVuZGVkIC8gdm0uZGF0YS5sZW5ndGgpICogMTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjoncmVkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgdm0uZ2V0UHJpb3JpdHlBY3Rpdml0aWVzID0gZnVuY3Rpb24oeWVhcikge1xuICAgICAgICAgICAgeWVhciA9IFwiXCJcbiAgICAgICAgICAgIHZtLnllYXIgPSB5ZWFyO1xuXG4gICAgICAgICAgICBBbm51YWxTZXJ2aWNlLmdldFByaW9yaXR5QWN0aXZpdGllcyh5ZWFyKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlZGF0YV9wcmlvcml0eWZ1bmQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlZGF0YV9wcmlvcml0eXVuZnVuZGVkID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcblxuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YV9wcmlvcml0eWZ1bmQgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5mdW5kID09IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhX3ByaW9yaXR5dW5mdW5kZWQgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5mdW5kID09IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuXG5cblxuXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGZ1bmRlZCA9PSB2bS5kYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ3JhcGhmdW5kZWRhY3Rpdml0aWVzID0gW107XG5cblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfcHJpb3JpdHlmdW5kPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YV9wcmlvcml0eWZ1bmQsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfcHJpb3JpdHl1bmZ1bmRlZCA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxNVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhX3ByaW9yaXR5dW5mdW5kZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc3RydWN0IERpc3RyaWN0IGdyYXBoIGRhdGFcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByaW9yaXR5ZGF0YSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcHJpb3JpdHlkYXRhdW4gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIEhpZ2hwcmlvcml0eSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgTWVkaXVtcHJpb3JpdHkgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIExvd3ByaW9yaXR5ID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciBIaWdocHJpb3JpdHl1biA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgTWVkaXVtcHJpb3JpdHl1biA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgTG93cHJpb3JpdHl1biA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uZGF0YS5sZW5ndGggOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2bS5kYXRhW2ldLmZ1bmQgPT0gdHJ1ZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSGlnaHByaW9yaXR5LnB1c2goW3ZtLmRhdGFbaV0uYXJlYSwgdm0uZGF0YVtpXS5IaWdoXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNZWRpdW1wcmlvcml0eS5wdXNoKFt2bS5kYXRhW2ldLmFyZWEsIHZtLmRhdGFbaV0uTWVkaXVtXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBMb3dwcmlvcml0eS5wdXNoKFt2bS5kYXRhW2ldLmFyZWEsIHZtLmRhdGFbaV0uTG93XSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEhpZ2hwcmlvcml0eXVuLnB1c2goW3ZtLmRhdGFbaV0uYXJlYSwgdm0uZGF0YVtpXS5IaWdoXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNZWRpdW1wcmlvcml0eXVuLnB1c2goW3ZtLmRhdGFbaV0uYXJlYSwgdm0uZGF0YVtpXS5NZWRpdW1dKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIExvd3ByaW9yaXR5dW4ucHVzaChbdm0uZGF0YVtpXS5hcmVhLCB2bS5kYXRhW2ldLkxvd10pXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5ZGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiSElHSFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogSGlnaHByaW9yaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjMkE0NDhBJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHlkYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJNRURJVU1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IE1lZGl1bXByaW9yaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOidncmVlbidcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5ZGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiTE9XXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBMb3dwcmlvcml0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjoneWVsbG93J1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB2bS5wcmlvcml0eWdyYXBoID0gcHJpb3JpdHlkYXRhO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlIGdyYXBoXG4gICAgICAgICAgICAgICAgICAgIHZtLnByaW9yaXR5b3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm11bHRpQmFyQ2hhcnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA0NTAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOjUwMCxcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlwRWRnZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZnVuY3Rpb24oZCl7IHJldHVybiBkWzBdOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbihkKXsgcmV0dXJuIGRbMV07IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dWYWx1ZXM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dZQXhpczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1hBeGlzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3RhdGVMYWJlbHM6IDU1LFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHlkYXRhdW4ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIkhJR0hcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IEhpZ2hwcmlvcml0eXVuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjMkE0NDhBJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHlkYXRhdW4ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIk1FRElVTVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogTWVkaXVtcHJpb3JpdHl1bixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjonZ3JlZW4nXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eWRhdGF1bi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiTE9XXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBMb3dwcmlvcml0eXVuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOid5ZWxsb3cnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLnByaW9yaXR5Z3JhcGh1biA9IHByaW9yaXR5ZGF0YXVuO1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLnByaW9yaXR5b3B0aW9uc3VuID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibXVsdGlCYXJDaGFydFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDQ1MCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6NTAwLFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaXBFZGdlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbihkKXsgcmV0dXJuIGRbMF07IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFsxXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1lBeGlzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93WEF4aXM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdGF0ZUxhYmVsczogNTUsXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCdyZWZyZXNoQXdwJywgZnVuY3Rpb24oZSwgeWVhcikge1xuICAgICAgICAgICAgICAgIGlmKHllYXIueWVhcilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZtLmdldEZ1bmRBY3Rpdml0aWVzKHllYXIueWVhcik7XG4gICAgICAgICAgICAgICAgICAgIHZtLmdldFByaW9yaXR5QWN0aXZpdGllcyh5ZWFyLnllYXIpO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgIF0pO1xufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpXG4gICAgLmNvbnRyb2xsZXIoJ1N0b2NrQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ1N0b2NrU2VydmljZScsICckcm9vdFNjb3BlJywgJ05nVGFibGVQYXJhbXMnLFxuICAgICdGaWx0ZXJTZXJ2aWNlJywgJ01vbnRoU2VydmljZScsICckbG9jYXRpb24nLCAnQ2hhcnRTdXBwb3J0U2VydmljZScsICdDaGFydFBERkV4cG9ydCcsICckdGltZW91dCcsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCBTdG9ja1NlcnZpY2UsICRyb290U2NvcGUsIE5nVGFibGVQYXJhbXMsIEZpbHRlclNlcnZpY2UsIE1vbnRoU2VydmljZSxcbiAgICAgICAgJGxvY2F0aW9uLCBDaGFydFN1cHBvcnRTZXJ2aWNlLCBDaGFydFBERkV4cG9ydCwgJHRpbWVvdXQpXG4gICAge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2YXIgc2hlbGxTY29wZSA9ICRzY29wZS4kcGFyZW50O1xuICAgICAgICBzaGVsbFNjb3BlLmNoaWxkID0gJHNjb3BlO1xuICAgICAgICB2bS5leHBvcnRQREYgPSBDaGFydFBERkV4cG9ydC5leHBvcnQ7XG5cbiAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5pc0FjdGl2ZSA9IGZ1bmN0aW9uKHZpZXdMb2NhdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHZpZXdMb2NhdGlvbiA9PT0gJGxvY2F0aW9uLnBhdGgoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBUb2RvOiBVc2UgdGhpcyB0byBzb3J0IGJ5IHBlcmZvcm1hbmNlIChNYWxpc2EpXG4gICAgICAgIHZtLlNvcnRCeUtleSA9IGZ1bmN0aW9uKGFycmF5LCBrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBhcnJheS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICB2YXIgeCA9IGFba2V5XTsgdmFyIHkgPSBiW2tleV07XG4gICAgICAgICAgICAgICAgcmV0dXJuICgoeCA8IHkpID8gLTEgOiAoKHggPiB5KSA/IDEgOiAwKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2bS5nZXRTdG9ja0J5RGlzdHJpY3QgPSBmdW5jdGlvbihzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcblxuICAgICAgICAgICAgdm0uc3RhcnRNb250aCA/IHZtLnN0YXJ0TW9udGggOiBcIlwiO1xuICAgICAgICAgICAgdm0uZW5kTW9udGggPSB2bS5lbmRNb250aCA/IHZtLmVuZE1vbnRoIDogXCJcIjtcbiAgICAgICAgICAgIC8vVG9kbzogVGVtcG9yYXJpbHkgZGlzYWJsZSBmaWx0ZXJpbmcgYnkgZGlzdHJpY3QgZm9yIHRoZSB0YWJsZVxuICAgICAgICAgICAgZGlzdHJpY3QgPSBcIlwiXG4gICAgICAgICAgICB2bS5kaXN0cmljdCA9IFwiXCI7XG4gICAgICAgICAgICB2bS52YWNjaW5lID0gdm0uc2VsZWN0ZWRWYWNjaW5lID8gdm0uc2VsZWN0ZWRWYWNjaW5lLm5hbWUgOiBcIlwiO1xuXG4gICAgICAgICAgICBTdG9ja1NlcnZpY2UuZ2V0U3RvY2tCeURpc3RyaWN0KHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlZGF0YV9zbyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGVkYXRhX2JtID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZWRhdGFfd3IgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlZGF0YV9hbSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGVkYXRhX3NlYXJjaCA9W107XG5cbiAgICAgICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFfc28gPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5hdF9oYW5kID09IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFfYW0gPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5hdF9oYW5kID4gdmFsdWUuc3RvY2tfcmVxdWlyZW1lbnRfX21heGltdW07XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFfd3IgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoKHZhbHVlLmF0X2hhbmQgPiB2YWx1ZS5zdG9ja19yZXF1aXJlbWVudF9fbWluaW11bSkgJiYgKHZhbHVlLmF0X2hhbmQgPCB2YWx1ZS5zdG9ja19yZXF1aXJlbWVudF9fbWF4aW11bSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhX2JtID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCh2YWx1ZS5hdF9oYW5kIDwgdmFsdWUuc3RvY2tfcmVxdWlyZW1lbnRfX21pbmltdW0pICYmICh2YWx1ZS5hdF9oYW5kID4gMCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YV9zZWFyY2ggPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YUFsbGRpc3RyaWN0cyA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNBbGxkaXN0cmljdHMgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YUFsbGRpc3RyaWN0cyxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRvdGFsc1xuICAgICAgICAgICAgICAgICAgICB2YXIgbm90aGluZyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciB3aXRoaW4gPSAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmVsb3dtaW5pbXVtID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFib3ZlbWF4aW11bSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0dXMgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2bS5kYXRhW2ldLmF0X2hhbmQgPT0gMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3RoaW5nKyssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzPVwiU3RvY2tlZCBPdXRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCh2bS5kYXRhW2ldLmF0X2hhbmQgPiB2bS5kYXRhW2ldLnN0b2NrX3JlcXVpcmVtZW50X19taW5pbXVtKSAmJiAodm0uZGF0YVtpXS5hdF9oYW5kIDwgdm0uZGF0YVtpXS5zdG9ja19yZXF1aXJlbWVudF9fbWF4aW11bSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2l0aGluKyssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzPVwiV2l0aGluIFJhbmdlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgodm0uZGF0YVtpXS5hdF9oYW5kIDwgdm0uZGF0YVtpXS5zdG9ja19yZXF1aXJlbWVudF9fbWluaW11bSkgJiYgKHZtLmRhdGFbaV0uYXRfaGFuZCA+IDApKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlbG93bWluaW11bSsrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cz1cIkJlbG93IE1JTlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodm0uZGF0YVtpXS5hdF9oYW5kID4gdm0uZGF0YVtpXS5zdG9ja19yZXF1aXJlbWVudF9fbWF4aW11bSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhYm92ZW1heGltdW0rKyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM9XCJBYm92ZSBNQVhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRhdGFbaV0uc3RhdHVzPXN0YXR1cztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuc3RvY2tlZG91dCA9IChub3RoaW5nIC8gdm0uZGF0YS5sZW5ndGgpICogMTAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmFsYW5jZU1vbnRoID0gbmV3IERhdGUoTW9udGhTZXJ2aWNlLm1vbnRoVG9EYXRlKGVuZE1vbnRoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJhbGFuY2VNb250aC5zZXRNb250aChiYWxhbmNlTW9udGguZ2V0TW9udGgoKSAtIDEpO1xuICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnRoZW1vbnRoID0gYmFsYW5jZU1vbnRoO1xuICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnZhY2NpbmUgPSB2YWNjaW5lO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBncmFwaFxuICAgICAgICAgICAgICAgICAgICB2bS5vcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncGllQ2hhcnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQua2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQueTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dMYWJlbHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFRocmVzaG9sZDogMC4wMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN1bmJlYW1MYXlvdXQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChub3RoaW5nID09IHZtLmRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5ncmFwaCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfc28gPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YV9zbyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc19ibSA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhX2JtLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zX3dyID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFfd3IsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfYW0gPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YV9hbSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfc2VhcmNoID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFfc2VhcmNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdyYXBoID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIlN0b2NrZWQgT3V0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IChub3RoaW5nIC8gdm0uZGF0YS5sZW5ndGgpICogMTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjonI0ZGMDAwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIldpdGhpbiBSYW5nZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiAod2l0aGluIC8gdm0uZGF0YS5sZW5ndGgpICogMTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjonIzAwODAwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29sb3I6JyNGRkZGMDAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJCZWxvdyBNSU5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogKGJlbG93bWluaW11bSAvIHZtLmRhdGEubGVuZ3RoKSAqIDEwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6JyNGRkE1MDAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJBYm92ZSBNQVhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogKGFib3ZlbWF4aW11bSAvIHZtLmRhdGEubGVuZ3RoKSAqIDEwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6JyM5MEVFOTAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbG9yOicjMDA4MDAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uZ2V0U3RvY2tCeURpc3RyaWN0VmFjY2luZSA9IGZ1bmN0aW9uKHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSkge1xuXG4gICAgICAgICAgICB2bS5zdGFydE1vbnRoID8gdm0uc3RhcnRNb250aCA6IFwiTm92IDIwMTVcIjtcbiAgICAgICAgICAgIHZtLmVuZE1vbnRoID0gdm0uZW5kTW9udGggPyB2bS5lbmRNb250aCA6IFwiRGVjIDIwMTZcIjtcbiAgICAgICAgICAgIC8vVG9kbzogVGVtcG9yYXJpbHkgZGlzYWJsZSBmaWx0ZXJpbmcgYnkgZGlzdHJpY3QgZm9yIHRoZSB0YWJsZVxuICAgICAgICAgICAgLy9kaXN0cmljdCA9IFwiXCJcbiAgICAgICAgICAgIHZtLmRpc3RyaWN0ID0gZGlzdHJpY3Q7XG4gICAgICAgICAgICB2bS52YWNjaW5lID0gdmFjY2luZTsgLy92bS5zZWxlY3RlZFZhY2NpbmUgPyB2bS5zZWxlY3RlZFZhY2NpbmUubmFtZSA6IFwiXCI7XG5cbiAgICAgICAgICAgIFN0b2NrU2VydmljZS5nZXRTdG9ja0J5RGlzdHJpY3RWYWNjaW5lKHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb3VudDogMTVcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB2bS5kYXRhLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRvdGFsc1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZGlzdHJpY3QgPSB2bS5kaXN0cmljdDtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnZhY2NpbmUgPSB2bS52YWNjaW5lO1xuXG5cbiAgICAgICAgICAgICAgICAvLyBjb25zdHJ1Y3QgRGlzdHJpYnV0aW9uIGdyYXBoIGRhdGFcbiAgICAgICAgICAgICAgICB2YXIgZ3JhcGhkYXRhRGlzdHJpYnV0aW9uID0gW107XG4gICAgICAgICAgICAgICAgdmFyIHNlcmllc0Rpc3RyaWJ1dGlvbiA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBzZXJpZXNPcmRlcnMgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgbWluX3Nlcmllc0Rpc3RyaWJ1dGlvbiA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBtYXhfc2VyaWVzRGlzdHJpYnV0aW9uID0gW107XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5yZWZyZXNocmF0ZSA9IDA7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmRhdGEubGVuZ3RoIDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcmllc0Rpc3RyaWJ1dGlvbi5wdXNoKFt2bS5kYXRhW2ldLm1vbnRoLCBwYXJzZUludCh2bS5kYXRhW2ldLnJlY2VpdmVkKV0pXG4gICAgICAgICAgICAgICAgICAgIHNlcmllc09yZGVycy5wdXNoKFt2bS5kYXRhW2ldLm1vbnRoLCB2bS5kYXRhW2ldLm9yZGVyZWRdKVxuICAgICAgICAgICAgICAgICAgICBtaW5fc2VyaWVzRGlzdHJpYnV0aW9uLnB1c2goW3ZtLmRhdGFbaV0ubW9udGgsIHZtLmRhdGFbaV0uc3RvY2tfcmVxdWlyZW1lbnRfX21pbmltdW1dKVxuICAgICAgICAgICAgICAgICAgICBtYXhfc2VyaWVzRGlzdHJpYnV0aW9uLnB1c2goW3ZtLmRhdGFbaV0ubW9udGgsIHZtLmRhdGFbaV0uc3RvY2tfcmVxdWlyZW1lbnRfX21heGltdW1dKVxuICAgICAgICAgICAgICAgICAgICBpZiAodm0uZGF0YVtpXS5tb250aCA9PSBNb250aFNlcnZpY2UuZ2V0TW9udGhOdW1iZXIoZW5kTW9udGguc3BsaXQoXCIgXCIpWzBdKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnJlZnJlc2hyYXRlID0gdm0uZGF0YVtpXS5vcmRlcmVkID09IDAgPyAwIDp2bS5kYXRhW2ldLnJlY2VpdmVkL3ZtLmRhdGFbaV0ub3JkZXJlZCoxMDAgO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGdyYXBoZGF0YURpc3RyaWJ1dGlvbi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJNaW5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogbWluX3Nlcmllc0Rpc3RyaWJ1dGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjQTVFODE2J1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGdyYXBoZGF0YURpc3RyaWJ1dGlvbi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJJc3N1ZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogc2VyaWVzRGlzdHJpYnV0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6JyMxRjc3QjQnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZ3JhcGhkYXRhRGlzdHJpYnV0aW9uLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIk9yZGVyZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogc2VyaWVzT3JkZXJzLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J3JlZCdcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGdyYXBoZGF0YURpc3RyaWJ1dGlvbi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJNYXhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogbWF4X3Nlcmllc0Rpc3RyaWJ1dGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjRkY3RjBFJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdm0uZ3JhcGhEaXN0cmlidXRpb24gPSBncmFwaGRhdGFEaXN0cmlidXRpb247XG5cblxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBEaXN0cmlidXRpb24gZ3JhcGhcbiAgICAgICAgICAgICAgICB2bS5vcHRpb25zRGlzdHJpYnV0aW9uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbGluZUNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCA6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdBYmltJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0xlZ2VuZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dDb250cm9sczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW4gOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiA4NSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogNjVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlWTogKFswLDEwMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWdnZXJMYWJlbHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZnVuY3Rpb24oZCl7IHJldHVybiBkWzBdOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFsxXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWw6ICdNb250aHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWNrRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBNb250aFNlcnZpY2UuZ2V0TW9udGhOYW1lKGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWxEaXN0YW5jZTogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZUludGVyYWN0aXZlR3VpZGVsaW5lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVDaGFuZ2U6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInN0YXRlQ2hhbmdlXCIpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZVN0YXRlOiBmdW5jdGlvbihlKXsgY29uc29sZS5sb2coXCJjaGFuZ2VTdGF0ZVwiKTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwU2hvdzogZnVuY3Rpb24oZSl7IGNvbnNvbGUubG9nKFwidG9vbHRpcFNob3dcIik7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcEhpZGU6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInRvb2x0aXBIaWRlXCIpOyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93VmFsdWVzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpY2tGb3JtYXQoZDMuZm9ybWF0KCcsLjFmJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8vIGNvbnN0cnVjdCBVcHRha2UgZ3JhcGggZGF0YVxuXG5cbiAgICAgICAgICAgICAgICAvLyBjb25zdHJ1Y3QgQ29uc3VtcHRpb24gZ3JhcGggZGF0YVxuICAgICAgICAgICAgICAgIHZhciBncmFwaGRhdGFDb25zdW1wdGlvbiA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBzZXJpZXNDb25zdW1wdGlvbiA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXRfc2VyaWVzQ29uc3VtcHRpb24gPSBbXTtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmNvdmVyYWdlID0gMDtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uZGF0YS5sZW5ndGggOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgc2VyaWVzQ29uc3VtcHRpb24ucHVzaChbdm0uZGF0YVtpXS5tb250aCwgdm0uZGF0YVtpXS5jb25zdW1lZF0pXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldF9zZXJpZXNDb25zdW1wdGlvbi5wdXNoKFt2bS5kYXRhW2ldLm1vbnRoLCB2bS5kYXRhW2ldLnN0b2NrX3JlcXVpcmVtZW50X190YXJnZXRdKVxuICAgICAgICAgICAgICAgICAgICBpZiAodm0uZGF0YVtpXS5tb250aCA9PSBNb250aFNlcnZpY2UuZ2V0TW9udGhOdW1iZXIoZW5kTW9udGguc3BsaXQoXCIgXCIpWzBdKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmNvdmVyYWdlID0gdm0uZGF0YVtpXS5zdG9ja19yZXF1aXJlbWVudF9fdGFyZ2V0ID09IDAgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAgOnZtLmRhdGFbaV0uY29uc3VtZWQvdm0uZGF0YVtpXS5zdG9ja19yZXF1aXJlbWVudF9fdGFyZ2V0KjEwMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZ3JhcGhkYXRhQ29uc3VtcHRpb24ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiQWN0dWFsIENvbnN1bXB0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IHNlcmllc0NvbnN1bXB0aW9uXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZ3JhcGhkYXRhQ29uc3VtcHRpb24ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiUGxhbm5lZCBjb25zdW1wdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiB0YXJnZXRfc2VyaWVzQ29uc3VtcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNGRjdGMEUnXG4gICAgICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgICAgIHZtLmdyYXBoQ29uc3VtcHRpb24gPSBncmFwaGRhdGFDb25zdW1wdGlvbjtcblxuXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIENvbnN1bXB0aW9uIGdyYXBoXG4gICAgICAgICAgICAgICAgdm0ub3B0aW9uc0NvbnN1bXB0aW9uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbGluZUNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCA6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdBYmltJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0xlZ2VuZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dDb250cm9sczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW4gOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiA4NSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogNjVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlWTogKFswLDEwMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWdnZXJMYWJlbHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZnVuY3Rpb24oZCl7IHJldHVybiBkWzBdOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFsxXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWw6ICdNb250aHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWNrRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBNb250aFNlcnZpY2UuZ2V0TW9udGhOYW1lKGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWxEaXN0YW5jZTogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZUludGVyYWN0aXZlR3VpZGVsaW5lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVDaGFuZ2U6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInN0YXRlQ2hhbmdlXCIpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZVN0YXRlOiBmdW5jdGlvbihlKXsgY29uc29sZS5sb2coXCJjaGFuZ2VTdGF0ZVwiKTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwU2hvdzogZnVuY3Rpb24oZSl7IGNvbnNvbGUubG9nKFwidG9vbHRpcFNob3dcIik7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcEhpZGU6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInRvb2x0aXBIaWRlXCIpOyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93VmFsdWVzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpY2tGb3JtYXQoZDMuZm9ybWF0KCcsLjFmJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS4kb24oJ3JlZnJlc2gnLCBmdW5jdGlvbihlLCBzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIGlmKHN0YXJ0TW9udGgubmFtZSAmJiBlbmRNb250aC5uYW1lICYmIGRpc3RyaWN0Lm5hbWUgJiYgdmFjY2luZS5uYW1lKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZtLmdldFN0b2NrQnlEaXN0cmljdChzdGFydE1vbnRoLm5hbWUsIGVuZE1vbnRoLm5hbWUsIGRpc3RyaWN0Lm5hbWUsIHZhY2NpbmUubmFtZSk7XG4gICAgICAgICAgICAgICAgdm0uZ2V0U3RvY2tCeURpc3RyaWN0VmFjY2luZShzdGFydE1vbnRoLm5hbWUsIGVuZE1vbnRoLm5hbWUsIGRpc3RyaWN0Lm5hbWUsIHZhY2NpbmUubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG5dKTtcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKS5jb250cm9sbGVyKCdTdG9ja1VwdGFrZUNvbnRyb2xsZXInLCBTdG9ja1VwdGFrZUNvbnRyb2xsZXIpO1xuXG5TdG9ja1VwdGFrZUNvbnRyb2xsZXIuJGluamVjdCA9IFtcbiAgICAnJHNjb3BlJyxcbiAgICAnU3RvY2tTZXJ2aWNlJyxcbiAgICAnTW9udGhTZXJ2aWNlJyxcbiAgICAnQ2hhcnRTdXBwb3J0U2VydmljZScsXG4gICAgJ0NoYXJ0UERGRXhwb3J0JyxcbiAgICAnJHRpbWVvdXQnXG5dO1xuZnVuY3Rpb24gU3RvY2tVcHRha2VDb250cm9sbGVyKCRzY29wZSwgU3RvY2tTZXJ2aWNlLCBNb250aFNlcnZpY2UsIENoYXJ0U3VwcG9ydFNlcnZpY2UsIENoYXJ0UERGRXhwb3J0LCAkdGltZW91dCkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdmFyIHNoZWxsU2NvcGUgPSAkc2NvcGUuJHBhcmVudDtcbiAgICBzaGVsbFNjb3BlLmNoaWxkID0gJHNjb3BlO1xuXG4gICAgc2hlbGxTY29wZS5jaGlsZC51cHRha2UgPSAwO1xuICAgIHZtLmV4cG9ydFBERiA9IGZ1bmN0aW9uKG5hbWUpIHsgQ2hhcnRQREZFeHBvcnQuZXhwb3J0V2l0aFN0eWxlcih2bSwgbmFtZSk7IH07XG5cbiAgICB2bS5vcHRpb25zVXB0YWtlID0gZ2V0T3B0aW9ucygpO1xuXG4gICAgJHNjb3BlLiRvbigncmVmcmVzaCcsIHVwZGF0ZUNoYXJ0KTtcbiAgICBmdW5jdGlvbiB1cGRhdGVDaGFydChlLCBzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgU3RvY2tTZXJ2aWNlLmdldFN0b2NrQnlEaXN0cmljdFZhY2NpbmUoc3RhcnRNb250aC5uYW1lLCBlbmRNb250aC5uYW1lLCBkaXN0cmljdC5uYW1lLCB2YWNjaW5lLm5hbWUpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG5cbiAgICAgICAgICAgIHZhciBncmFwaGRhdGFVcHRha2UgPSBbXTtcbiAgICAgICAgICAgIHZhciBzZXJpZXNVcHRha2UgPSBbXTtcbiAgICAgICAgICAgIHZhciBzdG9ja0RhdGEgPSBbXTtcbiAgICAgICAgICAgIHZhciBpbW11bmlzYXRpb25EYXRhID0gW107XG4gICAgICAgICAgICB2YXIgbW9udGhseVRhcmdldERhdGEgPSBbXTtcbiAgICAgICAgICAgIHZhciBmb3JjZVN0YXJ0WmVyb0RhdGEgPSBbXTtcbiAgICAgICAgICAgIHZhciBtYXhNb250aGx5VGFyZ2V0ID0gMDtcbiAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudXB0YWtlID0gXCIwXCI7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uZGF0YS5sZW5ndGggOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHZtLmRhdGFbaV07XG4gICAgICAgICAgICAgICAgLyogQ2VydGFpbiBkYXRhIGhhZCBpbnZhbGlkIHBlcmlvZHMgbGlrZSAyMDE3MiBpbnN0ZWFkIG9mXG4gICAgICAgICAgICAgICAgICAgIDIwMTcwMiB3aGljaCB3ZXJlIGNhdXNpbmcgZXJyb3JzLiBIZW5jZSB0aGUgZmlsdGVyIGJlbG93LiAqL1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLnBlcmlvZC50b1N0cmluZygpLmxlbmd0aCA9PSA1KSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIHZhciBtb250aEluZGV4ID0gYXBwSGVscGVycy5nZXRNb250aEluZGV4RnJvbVBlcmlvZChpdGVtLnBlcmlvZCwgJ0NZJyk7XG4gICAgICAgICAgICAgICAgdmFyIGF0SGFuZCA9IGl0ZW0uYXRfaGFuZCA9PSB1bmRlZmluZWQgPyBpdGVtLnRvdGFsX2F0X2hhbmQgOiBpdGVtLmF0X2hhbmQ7XG4gICAgICAgICAgICAgICAgdmFyIHJlY2VpdmVkID0gaXRlbS5yZWNlaXZlZCA9PSB1bmRlZmluZWQgPyBpdGVtLnRvdGFsX3JlY2VpdmVkIDogaXRlbS5yZWNlaXZlZDtcbiAgICAgICAgICAgICAgICB2YXIgY29uc3VtZWQgPSBpdGVtLmNvbnN1bWVkID09IHVuZGVmaW5lZCA/IGl0ZW0udG90YWxfY29uc3VtZWQgOiBpdGVtLmNvbnN1bWVkO1xuICAgICAgICAgICAgICAgIHZhciBtb250aGx5VGFyZ2V0ID0gaXRlbS5zdG9ja19yZXF1aXJlbWVudF9fdGFyZ2V0ID09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICA/IGl0ZW0udG90YWxfdGFyZ2V0IDogaXRlbS5zdG9ja19yZXF1aXJlbWVudF9fdGFyZ2V0O1xuICAgICAgICAgICAgICAgIHZhciB0b3RhbFN0b2NrID0gYXRIYW5kICsgcmVjZWl2ZWQ7XG5cbiAgICAgICAgICAgICAgICBtYXhNb250aGx5VGFyZ2V0ID0gTWF0aC5tYXgobWF4TW9udGhseVRhcmdldCwgTnVtYmVyKG1vbnRobHlUYXJnZXQudG9GaXhlZCgwKSkpO1xuICAgICAgICAgICAgICAgIHN0b2NrRGF0YS5wdXNoKHt4OiBtb250aEluZGV4LCB5OiBOdW1iZXIodG90YWxTdG9jay50b0ZpeGVkKDApKX0pO1xuICAgICAgICAgICAgICAgIGltbXVuaXNhdGlvbkRhdGEucHVzaCh7eDogbW9udGhJbmRleCwgeTogTnVtYmVyKGNvbnN1bWVkLnRvRml4ZWQoMCkpfSk7XG4gICAgICAgICAgICAgICAgbW9udGhseVRhcmdldERhdGEucHVzaCh7eDogbW9udGhJbmRleCwgeTogTnVtYmVyKG1vbnRobHlUYXJnZXQudG9GaXhlZCgwKSl9KTtcbiAgICAgICAgICAgICAgICBmb3JjZVN0YXJ0WmVyb0RhdGEucHVzaCh7eDogbW9udGhJbmRleCwgeTogMH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZtLmRhdGFbaV0ubW9udGggPT0gTW9udGhTZXJ2aWNlLmdldE1vbnRoTnVtYmVyKGVuZE1vbnRoLm5hbWUuc3BsaXQoXCIgXCIpWzBdKSkge1xuICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnVwdGFrZSA9IHJlY2VpdmVkID09IDAgJiYgYXRIYW5kID09IDAgP1xuICAgICAgICAgICAgICAgICAgICAgICAgMCA6IE1hdGgucm91bmQoY29uc3VtZWQvKHRvdGFsU3RvY2spKjEwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBncmFwaGRhdGFVcHRha2UucHVzaCh7a2V5OiAnQXZhaWxhYmxlIFN0b2NrIChTdG9jayBiYWxhbmNlICsgSXNzdWVzKScsIHR5cGU6ICdiYXInLCB5QXhpczogMSwgdmFsdWVzOiBzdG9ja0RhdGF9KTtcbiAgICAgICAgICAgIGdyYXBoZGF0YVVwdGFrZS5wdXNoKHtrZXk6ICdDaGlsZHJlbiBJbW11bmlzZWQnLCB0eXBlOiAnYmFyJywgeUF4aXM6IDEsIHZhbHVlczogaW1tdW5pc2F0aW9uRGF0YX0pO1xuICAgICAgICAgICAgZ3JhcGhkYXRhVXB0YWtlLnB1c2goe2tleTogJ01vbnRobHkgVGFyZ2V0cycsIHR5cGU6ICdsaW5lJywgeUF4aXM6IDEsIHZhbHVlczogbW9udGhseVRhcmdldERhdGF9KTtcbiAgICAgICAgICAgIGdyYXBoZGF0YVVwdGFrZS5wdXNoKHtrZXk6ICcnLCB0eXBlOiAnbGluZScsIHlBeGlzOiAxLCBzdHJva2VXaWR0aDogMCwgdmFsdWVzOiBmb3JjZVN0YXJ0WmVyb0RhdGF9KTtcbiAgICAgICAgICAgIHZtLmdyYXBoVXB0YWtlID0gZ3JhcGhkYXRhVXB0YWtlO1xuICAgICAgICAgICAgdm0ubWF4TW9udGhseVRhcmdldCA9IG1heE1vbnRobHlUYXJnZXQ7XG5cbiAgICAgICAgICAgIHVwZGF0ZUxhYmVscygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRPcHRpb25zKCkge1xuICAgICAgICB2YXIgdXB0YWtlT3B0aW9ucyA9IENoYXJ0U3VwcG9ydFNlcnZpY2UuZ2V0T3B0aW9ucygnbXVsdGlDaGFydCcpO1xuICAgICAgICB1cHRha2VPcHRpb25zLmNoYXJ0LmNvbG9yID0gW1wiZ3JlZW5cIiwgXCJEb2RnZXJCbHVlXCIsIFwicmVkXCIsIFwid2hpdGVcIl07XG4gICAgICAgIHVwdGFrZU9wdGlvbnMuY2hhcnQud2lkdGggPSA5MDA7XG4gICAgICAgIHVwdGFrZU9wdGlvbnMuY2hhcnQubWFyZ2luID0ge2xlZnQ6IDcwLCB0b3A6IDkwfTtcbiAgICAgICAgdXB0YWtlT3B0aW9ucy5jaGFydC5sZWdlbmQud2lkdGggPSA5MDA7XG4gICAgICAgIHVwdGFrZU9wdGlvbnMuY2hhcnQubGVnZW5kLm1heEtleUxlbmd0aCA9IDUwO1xuICAgICAgICB1cHRha2VPcHRpb25zLmNoYXJ0LnhBeGlzLmF4aXNMYWJlbCA9IFwiTW9udGhzXCI7XG4gICAgICAgIHVwdGFrZU9wdGlvbnMuY2hhcnQueUF4aXMuYXhpc0xhYmVsID0gXCJcIjtcbiAgICAgICAgdXB0YWtlT3B0aW9ucy5jaGFydC54QXhpcy50aWNrRm9ybWF0ID0gZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICByZXR1cm4gYXBwSGVscGVycy5nZXRNb250aEZyb21OdW1iZXIoZCwgJ0NZJyk7XG4gICAgICAgIH07XG4gICAgICAgIHVwdGFrZU9wdGlvbnMuY2hhcnQudmFsdWVGb3JtYXQgPSBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgIHJldHVybiB0aWNrRm9ybWF0KGQzLmZvcm1hdCgnLjBmJykpO1xuICAgICAgICB9O1xuICAgICAgICB1cHRha2VPcHRpb25zLmNoYXJ0LmxlZ2VuZC5kaXNwYXRjaC5zdGF0ZUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdXBkYXRlTGFiZWxzKCk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB1cHRha2VPcHRpb25zO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUxhYmVscygpIHtcbiAgICAgICAgQ2hhcnRTdXBwb3J0U2VydmljZS5jbGVhckxhYmVscygpO1xuICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIENoYXJ0U3VwcG9ydFNlcnZpY2UuaW5pdExhYmVscygpO1xuICAgICAgICAgICAgLyogY2hhcnQuY2xpcEVkZ2Ugc2VlbXMgbm90IHRvIGJlIHdvcmtpbmcsXG4gICAgICAgICAgICB0aGlzIHNob3VsZCBzZXJ2ZSBhcyBhIGhhY2sgKi9cbiAgICAgICAgICAgIGQzLnNlbGVjdEFsbChcIi5udi1tdWx0aWJhciBnXCIpLmF0dHIoXCJjbGlwLXBhdGhcIiwgXCJcIik7XG4gICAgICAgIH0sIDEwMDApO1xuICAgIH1cbn1cbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKS5jb250cm9sbGVyKCdTdG9ja291dFRyZW5kQ29udHJvbGxlcicsIFN0b2Nrb3V0VHJlbmRDb250cm9sbGVyKTtcblxuU3RvY2tvdXRUcmVuZENvbnRyb2xsZXIuJGluamVjdCA9IFtcbiAgICAnJHNjb3BlJyxcbiAgICAnU3RvY2tTZXJ2aWNlJyxcbiAgICAnTW9udGhTZXJ2aWNlJyxcbiAgICAnQ2hhcnRTdXBwb3J0U2VydmljZScsXG4gICAgJ0NoYXJ0UERGRXhwb3J0JyxcbiAgICAnJHRpbWVvdXQnXG5dO1xuZnVuY3Rpb24gU3RvY2tvdXRUcmVuZENvbnRyb2xsZXIoJHNjb3BlLCBTdG9ja1NlcnZpY2UsIE1vbnRoU2VydmljZSwgQ2hhcnRTdXBwb3J0U2VydmljZSwgQ2hhcnRQREZFeHBvcnQsICR0aW1lb3V0KSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5leHBvcnRQREYgPSBmdW5jdGlvbihuYW1lKSB7IENoYXJ0UERGRXhwb3J0LmV4cG9ydFdpdGhTdHlsZXIodm0sIG5hbWUpOyB9O1xuICAgIHZtLmdyYXBoT3B0aW9ucyA9IGdldE9wdGlvbnMoKTtcbiAgICB2bS5ncmFwaERhdGEgPSBbXTtcblxuICAgICRzY29wZS4kb24oJ3JlZnJlc2gnLCB1cGRhdGVDaGFydCk7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVDaGFydChlLCBzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgU3RvY2tTZXJ2aWNlLmdldFN0b2NrQnlEaXN0cmljdFZhY2NpbmUoc3RhcnRNb250aC5uYW1lLCBlbmRNb250aC5uYW1lLCBkaXN0cmljdC5uYW1lLCB2YWNjaW5lLm5hbWUpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG5cbiAgICAgICAgICAgIHZhciBncmFwaERhdGEgPSBbXTtcbiAgICAgICAgICAgIHZhciBzdG9ja0RhdGEgPSBbXTtcbiAgICAgICAgICAgIHZhciBzdXBwbHlEYXRhID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uZGF0YS5sZW5ndGggOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHZtLmRhdGFbaV07XG4gICAgICAgICAgICAgICAgLyogQ2VydGFpbiBkYXRhIGhhZCBpbnZhbGlkIHBlcmlvZHMgbGlrZSAyMDE3MiBpbnN0ZWFkIG9mXG4gICAgICAgICAgICAgICAgICAgIDIwMTcwMiB3aGljaCB3ZXJlIGNhdXNpbmcgZXJyb3JzLiBIZW5jZSB0aGUgZmlsdGVyIGJlbG93LiAqL1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLnBlcmlvZC50b1N0cmluZygpLmxlbmd0aCA9PSA1KSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIHZhciBtb250aEluZGV4ID0gYXBwSGVscGVycy5nZXRNb250aEluZGV4RnJvbVBlcmlvZChpdGVtLnBlcmlvZCwgJ0NZJyk7XG4gICAgICAgICAgICAgICAgdmFyIGF0SGFuZCA9IGl0ZW0uYXRfaGFuZCA9PSB1bmRlZmluZWQgPyBpdGVtLnRvdGFsX2F0X2hhbmQgOiBpdGVtLmF0X2hhbmQ7XG4gICAgICAgICAgICAgICAgdmFyIHJlY2VpdmVkID0gaXRlbS5yZWNlaXZlZCA9PSB1bmRlZmluZWQgPyBpdGVtLnRvdGFsX3JlY2VpdmVkIDogaXRlbS5yZWNlaXZlZDtcblxuICAgICAgICAgICAgICAgIHN0b2NrRGF0YS5wdXNoKHt4OiBtb250aEluZGV4LCB5OiBOdW1iZXIoYXRIYW5kLnRvRml4ZWQoMCkpfSk7XG4gICAgICAgICAgICAgICAgc3VwcGx5RGF0YS5wdXNoKHt4OiBtb250aEluZGV4LCB5OiBOdW1iZXIocmVjZWl2ZWQudG9GaXhlZCgwKSl9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZ3JhcGhEYXRhLnB1c2goe2tleTogJ1N0b2NrIEJhbGFuY2UnLCB2YWx1ZXM6IHN0b2NrRGF0YX0pO1xuICAgICAgICAgICAgZ3JhcGhEYXRhLnB1c2goe2tleTogJ1N1cHBseSBCeSBOTVMnLCB2YWx1ZXM6IHN1cHBseURhdGF9KTtcbiAgICAgICAgICAgIHZtLmdyYXBoRGF0YSA9IGdyYXBoRGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0T3B0aW9ucygpIHtcbiAgICAgICAgdmFyIGNoYXJ0T3B0aW9ucyA9IENoYXJ0U3VwcG9ydFNlcnZpY2UuZ2V0T3B0aW9ucygnbXVsdGlCYXJDaGFydCcpO1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQuY29sb3IgPSBbXCJncmVlblwiLCBcIkRvZGdlckJsdWVcIl07XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC53aWR0aCA9IDkwMDtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0Lm1hcmdpbiA9IHtsZWZ0OiA3MCwgdG9wOiA3MH07XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC5sZWdlbmQud2lkdGggPSA5MDA7XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC54QXhpcy5heGlzTGFiZWwgPSBcIk1vbnRoc1wiO1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQueUF4aXMuYXhpc0xhYmVsID0gXCJcIjtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LnhBeGlzLnRpY2tGb3JtYXQgPSBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgIHJldHVybiBhcHBIZWxwZXJzLmdldE1vbnRoRnJvbU51bWJlcihkLCAnQ1knKTtcbiAgICAgICAgfTtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LnZhbHVlRm9ybWF0ID0gZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICByZXR1cm4gdGlja0Zvcm1hdChkMy5mb3JtYXQoJy4wZicpKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGNoYXJ0T3B0aW9ucztcbiAgICB9XG5cbn1cbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKVxuLmNvbnRyb2xsZXIoJ1VuZXBpQ29udHJvbGxlcicsIFtcbiAgICAnJHNjb3BlJywgJ0NvdmVyYWdlU2VydmljZScsJ1N0b2NrU2VydmljZScsXG4gICAgJ01vbnRoU2VydmljZScsICckcm9vdFNjb3BlJywgJ05nVGFibGVQYXJhbXMnLFxuICAgICdGaWx0ZXJTZXJ2aWNlJywgJ0ZyaWRnZVNlcnZpY2UnLCAnQ292ZXJhZ2VDYWxjdWxhdG9yJywgJyR0aW1lb3V0JyxcbiAgICBmdW5jdGlvbigkc2NvcGUsIENvdmVyYWdlU2VydmljZSwgU3RvY2tTZXJ2aWNlLFxuICAgICAgICBNb250aFNlcnZpY2UsICRyb290U2NvcGUsIE5nVGFibGVQYXJhbXMsXG4gICAgICAgIEZpbHRlclNlcnZpY2UsIEZyaWRnZVNlcnZpY2UsIENvdmVyYWdlQ2FsY3VsYXRvciwgJHRpbWVvdXQpXG4gICAge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2YXIgc2hlbGxTY29wZSA9ICRzY29wZS4kcGFyZW50O1xuICAgICAgICBzaGVsbFNjb3BlLmNoaWxkID0gJHNjb3BlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHBlcmlvZERpc3BsYXkocGVyaW9kKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgbW9udGggPSBwYXJzZUludChwZXJpb2Quc2xpY2UoNCw2KSk7XG4gICAgICAgICAgICByZXR1cm4gTW9udGhTZXJ2aWNlLmdldE1vbnRoTmFtZShtb250aCkgKyBcIiBcIiArIHBlcmlvZC5zbGljZSgwLDQpXG4gICAgICAgIH1cblxuICAgICAgICB2bS5nZXRVbmVwaUNvdmVyYWdlID0gZnVuY3Rpb24ocGVyaW9kLCBkaXN0cmljdCwgdmFjY2luZSkge1xuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHtwZXJpb2QsIGRpc3RyaWN0fTtcblxuICAgICAgICAgICAgdmFyIGdldFZhbHVlU3VtID0gZnVuY3Rpb24oZGF0YSwgbmFtZSwgdmFjY2luZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhLnJlZHVjZShmdW5jdGlvbihhY2N1bXVsYXRvciwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLnZhY2NpbmVfX25hbWUgPT0gdmFjY2luZSkgcmV0dXJuIGFjY3VtdWxhdG9yICsgdmFsdWVbbmFtZV1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICAgICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgQ292ZXJhZ2VTZXJ2aWNlLmdldFZhY2NpbmVEb3Nlc0J5UGVyaW9kKHBhcmFtcykudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRhYmxlRGF0YSA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBwZW50YUNSID0gMCxcbiAgICAgICAgICAgICAgICAgICAgcGN2Q1IgPSAwO1xuXG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5kaXN0cmljdCA9IGRpc3RyaWN0O1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuR2FwID0gMDtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmRyb3BvdXRfUGVudGEgPSAwO1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZHJvcG91dF9ocHYgPSAwO1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuY2F0ZWdvcnkgPSAwO1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQucGVyaW9kTW9udGggPSBwZXJpb2REaXNwbGF5KHBlcmlvZCk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFQZXJpb2QgPSBkYXRhW2ldLnBlcmlvZFxuICAgICAgICAgICAgICAgICAgICB2YXIgbGFzdERvc2UgPSBkYXRhW2ldLnRvdGFsX2xhc3RfZG9zZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZpcnN0RG9zZSA9IGRhdGFbaV0udG90YWxfZmlyc3RfZG9zZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlY29uZERvc2UgPSBkYXRhW2ldLnRvdGFsX3NlY29uZF9kb3NlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGxhbm5lZCA9IGRhdGFbaV0udG90YWxfcGxhbm5lZDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhY2NpbmUgPSBkYXRhW2ldLnZhY2NpbmVfX25hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFQZXJpb2QgIT0gcGVyaW9kKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBTdW0gdXAgdGhlIHZhbHVlcyBmcm9tIHN0YXJ0IG9mIHllYXIgdG8gc2VsZWN0ZWQgcGVyaW9kXG4gICAgICAgICAgICAgICAgICAgICB0byBjYWxjdWxhdGUgQW5udWFsaXplZCBDb3ZlcmFnZSAoYXZvYykgKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvdGFsTGFzdERvc2UgPSBnZXRWYWx1ZVN1bShkYXRhLCAndG90YWxfbGFzdF9kb3NlJywgdmFjY2luZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0b3RhbFBsYW5uZWQgPSBnZXRWYWx1ZVN1bShkYXRhLCAndG90YWxfcGxhbm5lZCcsIHZhY2NpbmUpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb3ZlcmFnZVJhdGUgPSBDb3ZlcmFnZUNhbGN1bGF0b3IuY2FsY3VsYXRlQ292ZXJhZ2VSYXRlKGxhc3REb3NlLCBwbGFubmVkKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRyb3BvdXRSYXRlID0gQ292ZXJhZ2VDYWxjdWxhdG9yLmNhbGN1bGF0ZURyb3BvdXRSYXRlKGZpcnN0RG9zZSwgbGFzdERvc2UpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVkQ2F0ZWdvcnkgPSBDb3ZlcmFnZUNhbGN1bGF0b3IuY2FsY3VsYXRlUmVkQ2F0ZWdvcnkoZmlyc3REb3NlLCBsYXN0RG9zZSwgcGxhbm5lZCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdm9jID0gQ292ZXJhZ2VDYWxjdWxhdG9yLmNhbGN1bGF0ZUNvdmVyYWdlUmF0ZSh0b3RhbExhc3REb3NlLCB0b3RhbFBsYW5uZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlRGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd2YWNjaW5lJzogdmFjY2luZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdwbGFubmVkX2NvbnN1bXB0aW9uJzogcGxhbm5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb3ZlcmFnZV9yYXRlJzogY292ZXJhZ2VSYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2F2b2MnOiBhdm9jXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodmFjY2luZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlBFTlRBXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVudGFDUiA9IGNvdmVyYWdlUmF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmRyb3BvdXRfUGVudGEgPSBkcm9wb3V0UmF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmNhdGVnb3J5ID0gcmVkQ2F0ZWdvcnk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiUENWXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGN2Q1IgPSBjb3ZlcmFnZVJhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiSFBWXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5kcm9wb3V0X2hwdiA9IGRyb3BvdXRSYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5HYXAgPSBwZW50YUNSIC0gcGN2Q1I7XG5cbiAgICAgICAgICAgICAgICB2YXIgcGFyYW1zID0ge3BhZ2U6IDEsIGNvdW50OiAxMH07XG4gICAgICAgICAgICAgICAgdmFyIHNldHRpbmdzID0ge2ZpbHRlckRlbGF5OiAwLCBjb3VudHM6IFtdLCBkYXRhOiB0YWJsZURhdGF9O1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zRG9zZXMgPSBuZXcgTmdUYWJsZVBhcmFtcyhwYXJhbXMsIHNldHRpbmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdm0uZ2V0VW5lcGlOYXRpb25hbFN0b2NrID0gZnVuY3Rpb24oZW5kTW9udGgsIGRpc3RyaWN0KSB7XG4gICAgICAgICAgICBTdG9ja1NlcnZpY2UuZ2V0VW5lcGlTdG9jayhlbmRNb250aCwgZGlzdHJpY3QpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciB0YWJsZWRhdGFBbGxzdG9jayA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBzdG9ja2VkT3V0QW50aWdlbnMgPSAwO1xuXG4gICAgICAgICAgICAgICAgLyogVHVybiB0aGUgZGlzdHJpY3QgYmFzZWQgZGF0YSBpbnRvIGFnZ3JlZ2F0ZWRcbiAgICAgICAgICAgICAgICB2YWNjaW5lIGJhc2VkIGRhdGEgKi9cbiAgICAgICAgICAgICAgICB2YXIgdmFjY2luZURhdGEgPSBkYXRhLnJlZHVjZShmdW5jdGlvbihhY2MsIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEgKGl0ZW0udmFjY2luZSBpbiBhY2MpKVxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjW2l0ZW0udmFjY2luZV0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXRfaGFuZDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9ja19yZXF1aXJlbWVudF9fbWluaW11bTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNlaXZlZDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmVkOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN1bWVkOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZV9zdG9jazogMFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBhY2NbaXRlbS52YWNjaW5lXS5hdF9oYW5kICs9IGl0ZW0uYXRfaGFuZDtcbiAgICAgICAgICAgICAgICAgICAgYWNjW2l0ZW0udmFjY2luZV0uc3RvY2tfcmVxdWlyZW1lbnRfX21pbmltdW0gKz0gaXRlbS5zdG9ja19yZXF1aXJlbWVudF9fbWluaW11bTtcbiAgICAgICAgICAgICAgICAgICAgYWNjW2l0ZW0udmFjY2luZV0ucmVjZWl2ZWQgKz0gaXRlbS5yZWNlaXZlZDtcbiAgICAgICAgICAgICAgICAgICAgYWNjW2l0ZW0udmFjY2luZV0ub3JkZXJlZCArPSBpdGVtLm9yZGVyZWQ7XG4gICAgICAgICAgICAgICAgICAgIGFjY1tpdGVtLnZhY2NpbmVdLmNvbnN1bWVkICs9IGl0ZW0uY29uc3VtZWQ7XG4gICAgICAgICAgICAgICAgICAgIGFjY1tpdGVtLnZhY2NpbmVdLmF2YWlsYWJsZV9zdG9jayArPSBpdGVtLmF2YWlsYWJsZV9zdG9jaztcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgICAgIH0sIHt9KTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIHZhY2NpbmUgaW4gdmFjY2luZURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0SGFuZCA9IHZhY2NpbmVEYXRhW3ZhY2NpbmVdLmF0X2hhbmQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtaW5TdG9jayA9IHZhY2NpbmVEYXRhW3ZhY2NpbmVdLnN0b2NrX3JlcXVpcmVtZW50X19taW5pbXVtO1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3JkZXJlZCA9IHZhY2NpbmVEYXRhW3ZhY2NpbmVdLm9yZGVyZWQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZWNlaXZlZCA9IHZhY2NpbmVEYXRhW3ZhY2NpbmVdLnJlY2VpdmVkO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29uc3VtZWQgPSB2YWNjaW5lRGF0YVt2YWNjaW5lXS5jb25zdW1lZDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF2YWlsYWJsZVN0b2NrID0gYXRIYW5kICsgcmVjZWl2ZWQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtb250aHNTdG9jayA9IE1hdGgucm91bmQoYXRIYW5kIC8gbWluU3RvY2spO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChtb250aHNTdG9jayA9PSAwKSBzdG9ja2VkT3V0QW50aWdlbnMrKztcblxuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFBbGxzdG9jay5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhY2NpbmU6IHZhY2NpbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICBNb250aHNfc3RvY2s6IG1vbnRoc1N0b2NrLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVmaWxsX3JhdGU6IChvcmRlcmVkID09IDApID8gMCA6IE1hdGgucm91bmQoKHJlY2VpdmVkIC8gb3JkZXJlZCkgKiAxMDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXB0YWtlX3JhdGU6IChhdmFpbGFibGVTdG9jayA9PSAwKSA/IDAgOiBNYXRoLnJvdW5kKChjb25zdW1lZCAvIGF2YWlsYWJsZVN0b2NrKSAqIDEwMClcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5BbnRpZ2VuX3N0b2NrZWRvdXQgPSBzdG9ja2VkT3V0QW50aWdlbnM7XG5cbiAgICAgICAgICAgICAgICB2YXIgcGFyYW1zID0ge3BhZ2U6IDEsIGNvdW50OiAxMH07XG4gICAgICAgICAgICAgICAgdmFyIHNldHRpbmdzID0ge2ZpbHRlckRlbGF5OiAwLCBjb3VudHM6IFtdLCBkYXRhOiB0YWJsZWRhdGFBbGxzdG9ja307XG4gICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNTdG9jayA9IG5ldyBOZ1RhYmxlUGFyYW1zKHBhcmFtcywgc2V0dGluZ3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgICAgIHZtLmdldFVuZXBpU3RvY2sgPSBmdW5jdGlvbihlbmRNb250aCwgZGlzdHJpY3QpIHtcblxuICAgICAgICAgICAgICAgIHZtLmVuZE1vbnRoID0gdm0uZW5kTW9udGggPyB2bS5lbmRNb250aCA6IFwiXCI7XG5cbiAgICAgICAgICAgICAgICBTdG9ja1NlcnZpY2UuZ2V0VW5lcGlTdG9jayggZW5kTW9udGgsIGRpc3RyaWN0KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGVkYXRhQWxsc3RvY2sgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcblxuXG5cbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhQWxsc3RvY2sgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc1N0b2NrID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFBbGxzdG9jayxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLkFudGlnZW5fc3RvY2tlZG91dCA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uZGF0YS5sZW5ndGggOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2bS5kYXRhW2ldLk1vbnRoc19zdG9jayA9PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5BbnRpZ2VuX3N0b2NrZWRvdXQrKztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgQ29sZCBDaGFpbiAmIFVuZXBpIERpc3RyaWN0IGZpbHRlcnMgdXNlZCBkaWZmZXJlbnQgZGF0YSBzb3VyY2VzXG4gICAgICAgICAgICAgICAgRm9yIHRoYXQgcmVhc29uIHRvIHVzZSB0aGUgQ29sZCBDaGFpbiBhcGksIHRoZSBkaXN0cmljdCBuYW1lXG4gICAgICAgICAgICAgICAgaGFzIHRvIGJlIHJlZm9ybWF0dGVkIHRvIG1hdGNoIHRoZSBjb2xkIGNoYWluIGRpc3RyaWN0IGZpbHRlci5cbiAgICAgICAgICAgICAgICBAVG9kbzogU3RhbmRhcmRpemUgdGhlIGRpc3RyaWN0IHZhbHVlc1xuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdm0ucGFyc2VEaXN0cmljdCA9IGZ1bmN0aW9uKGRpc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkaXN0cmljdC5yZXBsYWNlKFwiIERpc3RyaWN0XCIsIFwiXCIpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZtLmdldFVuZXBpQ29sZENoYWluQ2FwYWNpdHkgPSBmdW5jdGlvbihlbmRNb250aCwgZGlzdHJpY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3QgPSB2bS5wYXJzZURpc3RyaWN0KGRpc3RyaWN0KTtcblxuICAgICAgICAgICAgICAgICAgICBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZUZhY2lsaXR5Q2FwYWNpdHkodW5kZWZpbmVkLCBlbmRNb250aCwgZGlzdHJpY3QsIHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1ldHJpY3MgPSBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZUNhcGFjaXR5TWV0cmljcyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQubWV0cmljcyA9IG1ldHJpY3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnBlciA9IGFwcEhlbHBlcnMucGVyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdm0uZ2V0VW5lcGlDb2xkQ2hhaW5GdW5jdGlvbmFsaXR5ID0gZnVuY3Rpb24oZW5kTW9udGgsIGRpc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0ID0gdm0ucGFyc2VEaXN0cmljdChkaXN0cmljdCk7XG5cbiAgICAgICAgICAgICAgICAgICAgRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VEaXN0cmljdFJlZnJpZ2VyYXRvcih1bmRlZmluZWQsIGVuZE1vbnRoLCBkaXN0cmljdCwgdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhZ2dyZWdhdGVzID0gZGF0YS5yZWR1Y2UoZnVuY3Rpb24oYWNjLCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjLnRvdGFsRXF1aXBtZW50ICs9IGl0ZW0ubnVtYmVyX2V4aXN0aW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjYy50b3RhbFdvcmtpbmdXZWxsICs9IGl0ZW0ud29ya2luZ193ZWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjYy50b3RhbE5vdFdvcmtpbmdXZWxsICs9IGl0ZW0ubm90X3dvcmtpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjLnRvdGFsTmVlZE1haW50ZW5hbmNlICs9IGl0ZW0ubmVlZHNfbWFpbnRlbmFuY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjLnRvdGFsRmFjaWxpdGllcyArPSBpdGVtLnRvdGFsX2ZhY2lsaXRpZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHt0b3RhbEVxdWlwbWVudDowLCB0b3RhbEZhY2lsaXRpZXM6MCwgdG90YWxXb3JraW5nV2VsbDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbE5vdFdvcmtpbmdXZWxsOjAsIHRvdGFsTmVlZE1haW50ZW5hbmNlOiAwfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQubnVtYmVyT2ZDb2xkY2hhaW5FcXVpcG1lbnQgPSBhZ2dyZWdhdGVzLnRvdGFsRXF1aXBtZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5udW1iZXJPZkZhY2lsaXRpZXMgPSBhZ2dyZWdhdGVzLnRvdGFsRmFjaWxpdGllcztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQubnVtYmVyV29ya2luZ1dlbGwgPSBhZ2dyZWdhdGVzLnRvdGFsV29ya2luZ1dlbGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLm51bWJlck5vdFdvcmtpbmdXZWxsID0gYWdncmVnYXRlcy50b3RhbE5vdFdvcmtpbmdXZWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5udW1iZXJOZWVkTWFpbnRlbmFuY2UgPSBhZ2dyZWdhdGVzLnRvdGFsTmVlZE1haW50ZW5hbmNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5wZXIgPSBhcHBIZWxwZXJzLnBlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQubnVtYmVyV29ya2luZyA9IGFnZ3JlZ2F0ZXMudG90YWxFcXVpcG1lbnQgLSBhZ2dyZWdhdGVzLnRvdGFsTm90V29ya2luZ1dlbGw7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2bS5lbmFibGVQREZEb3dubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5kb3dubG9hZFBERiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQucHJpbnRWaWV3ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBkZiA9IG5ldyBqc1BERigncCcsICdtbScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZGYuYWRkSFRNTChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVuZXBpUmVwb3J0XCIpLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZGYuc2F2ZSgndW5lcGktcmVwb3J0LnBkZicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEwMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5wcmludFZpZXcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRvbigncmVmcmVzaCcsIGZ1bmN0aW9uKGUsIHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSkge1xuICAgICAgICAgICAgICAgICAgICBpZihzdGFydE1vbnRoLm5hbWUgJiYgZW5kTW9udGgubmFtZSAmJiBkaXN0cmljdC5uYW1lICYmIHZhY2NpbmUubmFtZSlcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0VW5lcGlDb3ZlcmFnZShlbmRNb250aC5wZXJpb2QsIGRpc3RyaWN0Lm5hbWUsIHZhY2NpbmUubmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkaXN0cmljdC5uYW1lID09IFwiTmF0aW9uYWxcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldFVuZXBpTmF0aW9uYWxTdG9jayhlbmRNb250aC5uYW1lLCBkaXN0cmljdC5uYW1lLCB2YWNjaW5lLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRVbmVwaVN0b2NrKGVuZE1vbnRoLm5hbWUsIGRpc3RyaWN0Lm5hbWUsIHZhY2NpbmUubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRVbmVwaUNvbGRDaGFpbkNhcGFjaXR5KGVuZE1vbnRoLm5hbWUsIGRpc3RyaWN0Lm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0VW5lcGlDb2xkQ2hhaW5GdW5jdGlvbmFsaXR5KGVuZE1vbnRoLm5hbWUsIGRpc3RyaWN0Lm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZW5hYmxlUERGRG93bmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIF0pO1xufSkod2luZG93LmFuZ3VsYXIpO1xuIl19
