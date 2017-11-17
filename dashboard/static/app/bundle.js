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

function ChartPDFExport() {
    var service = {'export': exportPDF};
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

        var pdf = new jsPDF('l', 'mm');
        var options = { format : 'PNG' };

        pdf.addHTML(document.getElementById("pdfReport"), 0, 0, options, function() {
          pdf.save(filename);
        });
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
            shell.startYear = startYear;
            shell.endYear = endYear;
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
            "ALL": [],
            "HPV": ["HPV1", "HPV2"],
            "DPT": ["DPT1", "DPT2", "DPT3"],
            "PCV": ["PCV1", "PCV2", "PCV3"],
            "IPV": [],
            "OPV": ["OPV1", "OPV2", "OPV3"],
            "BCG": [],
            "MEASLES": [],
            "TT": ["TT1", "TT2"]
        }

        shell.updateDoses = function() {
            shell.dose = undefined;
            shell.doses = ['Dose 1', 'Dose 2', 'Dose 3'];//antigens[shell.antigen]

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

        $scope.$watch('shell.endQuarter', function() {
            if (shell.endQuarter) {
                $rootScope.$broadcast('refreshCapacity', shell.startQuarter, shell.endQuarter, shell.selectedFridgeDistrict, shell.selectedFridgeCareLevel);
            }
        }, true);

        $scope.$watchGroup(['shell.endQuarter', 'shell.selectedFridgeDistrict', 'shell.selectedFridgeCareLevel'], function(data){
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
    vm.exportPDF = ChartPDFExport.export;
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
                        totalLastDose: 0,
                        totalPlanned: 0,
                        totalSecondDose: 0
                    };

                acc[vaccine][year].totalActual += item.total_actual;
                acc[vaccine][year].totalFirstDose += item.total_first_dose;
                acc[vaccine][year].totalLastDose += item.total_last_dose;
                acc[vaccine][year].totalPlanned += item.total_planned;
                acc[vaccine][year].totalSecondDose += item.total_second_dose;

                return acc;
            }, {});

            /* Calculate Rates for the results */
            var chartData = [];
            for (var vaccine in result) {
                var vaccineData = [];
                for (var year in result[vaccine]) {
                    var coverageRate = CoverageCalculator.calculateCoverageRate(
                        result[vaccine][year].totalLastDose,
                        result[vaccine][year].totalPlanned
                    );
                    var i = vm.yearIndexes.indexOf(year);
                    vaccineData.push({x: i, y: coverageRate})
                }
                chartData.push({key: vaccine, values: vaccineData});
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
                width: 650,
                stacked: false,
                showControls: false,
                groupSpacing: 0.2,
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
        'FilterService', 'MonthService', 'CoverageService', 'MapSupportService',
    function($scope,$location, StockService, $rootScope, NgTableParams,
        FilterService, MonthService, CoverageService, MapSupportService)
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
                var antigenLabel = vm.activeDose != undefined ? vm.activeDose : vaccine;

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
                        // if (vm.activeDose != undefined)
                            // key = vm.activeDose ;
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
            return {
                chart: {
                    type: 'lineChart',
                    height: 450,
                    width: 450,
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
            var antigenLabel = vm.activeDose != undefined ? vm.activeDose : vaccine;
            antigenLabel = (vaccine == "ALL") ? "antigens" : antigenLabel;
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
                shellScope.child.downloadPDF = function() {
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
                }
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
    vm.exportPDF = ChartPDFExport.export;
    vm.graphOptions = getOptions();
    vm.yearIndexes = [];
    vm.activeToggle = 'GAVI';

    resetGraphData();
    setYearFilterOptions();
    $scope.$watch('vm.activeToggle', changeTabs);
    $scope.$on('refreshCoverage3', updateChart);

    function resetGraphData() {
        vm.graphData = getDefaultGraphData();
        vm.allocGraphData = [];
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
    function updateChart(e, params) {
        resetGraphData();
        FinanceService.getFinanceData(params).then(function(data) {
            for (var i in data) {
                var yearIndex = getYearIndex(data[i].period)

                vm.graphData.allOblig[0].values.push({x: yearIndex, y: data[i].gavi_approved});
                vm.graphData.allOblig[1].values.push({x: yearIndex, y: data[i].gou_approved});

                vm.graphData.gaviAlloc[0].values.push({x: yearIndex, y: data[i].gavi_approved});
                vm.graphData.gaviAlloc[1].values.push({x: yearIndex, y: data[i].gavi_disbursed});

                vm.graphData.gouAlloc[0].values.push({x: yearIndex, y: data[i].gou_approved});
                vm.graphData.gouAlloc[1].values.push({x: yearIndex, y: data[i].gou_disbursed});
            }
            /*Trigger the loading of the inital Tab, with random values*/
            changeTabs(0,1);
        });
    }

    function getOptions() {
        var chartOptions = ChartSupportService.getOptions('multiBarChart');
        chartOptions.chart.color = ["green", "DodgerBlue"];
        chartOptions.chart.width = 900;
        chartOptions.chart.margin = {left: 70, top: 70};
        chartOptions.chart.legend.width = 900;
        chartOptions.chart.xAxis.axisLabel = "years";
        chartOptions.chart.yAxis.axisLabel = "";
        chartOptions.chart.xAxis.tickFormat = function(d){
            return vm.yearIndexes[d];
        };
        chartOptions.chart.valueFormat = function(d){
            return tickFormat(d3.format('.0f'));
        };
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
                                color:'#FFFF00'
                            },
                            {
                                key: "Below MIN",
                                y: (belowminimum / vm.data.length) * 100,
                                color:'#FFA500'
                            },
                            {
                                key: "Above MAX",
                                y: (abovemaximum / vm.data.length) * 100,
                                color:'#008000'
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
    vm.exportPDF = ChartPDFExport.export;


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

            graphdataUptake.push({key: 'Available Stock', type: 'bar', yAxis: 1, values: stockData});
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
        uptakeOptions.chart.margin = {left: 70, top: 70};
        uptakeOptions.chart.legend.width = 900;
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
    vm.exportPDF = ChartPDFExport.export;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9oZWxwZXJzLmpzIiwic2hhcmVkL2FubnVhbFNlcnZpY2UuanMiLCJzaGFyZWQvY2hhcnRQREZFeHBvcnRTZXJ2aWNlLmpzIiwic2hhcmVkL2NoYXJ0U3VwcG9ydFNlcnZpY2UuanMiLCJzaGFyZWQvY292ZXJhZ2VDYWxjdWxhdG9yU2VydmljZS5qcyIsInNoYXJlZC9jb3ZlcmFnZVNlcnZpY2UuanMiLCJzaGFyZWQvZmlsdGVyU2VydmljZS5qcyIsInNoYXJlZC9maW5hbmNlU2VydmljZS5qcyIsInNoYXJlZC9mcmlkZ2VTZXJ2aWNlLmpzIiwic2hhcmVkL21haW5Db250cm9sbGVyLmpzIiwic2hhcmVkL21hcFN1cHBvcnRTZXJ2aWNlLmpzIiwic2hhcmVkL3N0b2NrU2VydmljZS5qcyIsImNvbXBvbmVudHMvY292ZXJhZ2UvYW5udWFsQ292ZXJhZ2VDb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9jb3ZlcmFnZS9jb3ZlcmFnZUNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL2ZpbmFuY2UvZmluYW5jZURhdGFDb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9maW5hbmNlL21haW5GaW5hbmNlQ29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvZnJpZGdlL2ZyaWRnZUNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL3BsYW5uaW5nL1BsYW5uaW5nQ29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvc3RvY2svc3RvY2tDb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9zdG9jay9zdG9ja1VwdGFrZUNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL3N0b2NrL3N0b2Nrb3V0VHJlbmRDb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy91bmVwaS9VbmVwaUNvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2b0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2ZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKHdpbmRvdywgZG9jdW1lbnQpIHtcbiAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgIHZhciBhcHBIZWxwZXJzID0gd2luZG93LmFwcEhlbHBlcnMgfHwgKHdpbmRvdy5hcHBIZWxwZXJzID0ge30pO1xuXG4gICAgIHZhciBwZXIgPSBmdW5jdGlvbih2YWx1ZSwgdG90YWwpIHtcbiAgICAgICAgIHZhciBwZXJjZW50YWdlID0gKHZhbHVlL3RvdGFsKSAqIDEwMDtcbiAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHBlcmNlbnRhZ2UgKiAxMCkgLyAxMDtcbiAgICAgfTtcblxuICAgICB2YXIgZ2VuZXJhdGVMYWJlbEZyb21QZXJpb2QgPSBmdW5jdGlvbihwZXJpb2QpIHtcbiAgICAgICAgIHBlcmlvZCA9IHBlcmlvZC50b1N0cmluZygpO1xuICAgICAgICAgdmFyIHllYXIgPSBwZXJpb2Quc3Vic3RyKDIsMik7XG4gICAgICAgICB2YXIgbW9udGggPSBOdW1iZXIocGVyaW9kLnN1YnN0cig0LDIpKTtcblxuICAgICAgICAgdmFyIG1vbnRocyA9IFsnJywgJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwdCcsICdPY3QnLCAnTm92JywgJ0RlYyddO1xuICAgICAgICAgcmV0dXJuIG1vbnRoc1ttb250aF0gKyBcIidcIit5ZWFyO1xuICAgIH07XG5cbiAgICB2YXIgZ2VuZXJhdGVGdWxsTGFiZWxGcm9tUGVyaW9kID0gZnVuY3Rpb24ocGVyaW9kKSB7XG4gICAgICAgIHBlcmlvZCA9IHBlcmlvZC50b1N0cmluZygpO1xuICAgICAgICB2YXIgeWVhciA9IHBlcmlvZC5zdWJzdHIoMCw0KTtcbiAgICAgICAgdmFyIG1vbnRoID0gTnVtYmVyKHBlcmlvZC5zdWJzdHIoNCwyKSk7XG5cbiAgICAgICAgdmFyIG1vbnRocyA9IFsnJywgJ0phbnVhcnknLCAnRmVicnVhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLFxuICAgICAgICAgICAgJ0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJywgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJ107XG4gICAgICAgIHJldHVybiBtb250aHNbbW9udGhdICsgXCIgXCIreWVhcjtcbiAgIH07XG5cbiAgICB2YXIgZ2V0TW9udGhGcm9tTnVtYmVyID0gZnVuY3Rpb24odmFsdWUsIHllYXJUeXBlKSB7XG4gICAgICAgIHZhciBtb250aHMgPSBbJycsICdKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcHQnLCAnT2N0JywgJ05vdicsICdEZWMnXTtcbiAgICAgICAgdmFyIG1vbnRoc0ZZID0gWycnLCAnSnVsJywgJ0F1ZycsICdTZXB0JywgJ09jdCcsICdOb3YnLCAnRGVjJywgJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJ107XG5cbiAgICAgICAgaWYgKHllYXJUeXBlID09ICdDWScpIHtcbiAgICAgICAgICAgIHJldHVybiBtb250aHNbdmFsdWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG1vbnRoc0ZZW3ZhbHVlXTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZ2V0UGVyaW9kU3RyaW5nID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgICAgICAgaWYgKG1vbnRoIDwgMTApIHtcbiAgICAgICAgICAgIHJldHVybiB5ZWFyICsgXCIwXCIgKyBtb250aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB5ZWFyICsgXCJcIiArICBtb250aDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZ2V0TW9udGhJbmRleEZyb21QZXJpb2QgPSBmdW5jdGlvbihwZXJpb2QsIHllYXJUeXBlKSB7XG4gICAgICAgIHBlcmlvZCA9IHBlcmlvZC50b1N0cmluZygpO1xuICAgICAgICB2YXIgbW9udGggPSBOdW1iZXIocGVyaW9kLnN1YnN0cig0LDIpKTtcblxuICAgICAgICBpZiAoeWVhclR5cGUgPT0gJ0NZJykge1xuICAgICAgICAgICAgcmV0dXJuIG1vbnRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG1vbnRoID49IDcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMobW9udGggLSA3KSArIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAobW9udGggKyA2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZ2V0TW9udGhGcm9tUGVyaW9kID0gZnVuY3Rpb24ocGVyaW9kLCB5ZWFyVHlwZSkge1xuICAgICAgICBwZXJpb2QgPSBwZXJpb2QudG9TdHJpbmcoKTtcbiAgICAgICAgcmV0dXJuIE51bWJlcihwZXJpb2Quc3Vic3RyKDQsMikpO1xuICAgIH07XG5cbiAgICB2YXIgZ2V0WWVhckZyb21QZXJpb2QgPSBmdW5jdGlvbihwZXJpb2QsIHllYXJUeXBlKSB7XG4gICAgICAgIHBlcmlvZCA9IHBlcmlvZC50b1N0cmluZygpO1xuICAgICAgICByZXR1cm4gTnVtYmVyKHBlcmlvZC5zdWJzdHIoMCw0KSk7XG4gICAgfTtcblxuICAgIHZhciBnZXRZZWFyTGFiZWxGcm9tUGVyaW9kID0gZnVuY3Rpb24ocGVyaW9kLCB5ZWFyVHlwZSkge1xuICAgICAgICBwZXJpb2QgPSBwZXJpb2QudG9TdHJpbmcoKTtcbiAgICAgICAgdmFyIHllYXIgPSBwZXJpb2Quc3Vic3RyKDAsNCk7XG4gICAgICAgIHZhciBtb250aCA9IE51bWJlcihwZXJpb2Quc3Vic3RyKDQsMikpO1xuXG4gICAgICAgIGlmICh5ZWFyVHlwZSA9PSAnQ1knKSB7XG4gICAgICAgICAgICByZXR1cm4geWVhcjtcbiAgICAgICAgfSBlbHNlIGlmICh5ZWFyVHlwZSA9PSAnRlknKSB7XG4gICAgICAgICAgICBpZiAobW9udGggPD0gNikge1xuICAgICAgICAgICAgICAgIHZhciBwcmV2WWVhciA9IE51bWJlcih5ZWFyKSAtIDE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZXZZZWFyICsgXCItXCIgKyB5ZWFyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFllYXIgPSBOdW1iZXIoeWVhcikgKyAxO1xuICAgICAgICAgICAgICAgIHJldHVybiB5ZWFyICsgXCItXCIgKyBuZXh0WWVhcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgICAvLyBwdWJsaXNoIGV4dGVybmFsIEFQSSBieSBleHRlbmRpbmcgYXBwSGVscGVyc1xuICAgICBmdW5jdGlvbiBwdWJsaXNoRXh0ZXJuYWxBUEkoYXBwSGVscGVycykge1xuICAgICAgICAgYW5ndWxhci5leHRlbmQoYXBwSGVscGVycywge1xuICAgICAgICAgICAgICdwZXInOiBwZXIsXG4gICAgICAgICAgICAgJ2dlbmVyYXRlTGFiZWxGcm9tUGVyaW9kJzogZ2VuZXJhdGVMYWJlbEZyb21QZXJpb2QsXG4gICAgICAgICAgICAgJ2dlbmVyYXRlRnVsbExhYmVsRnJvbVBlcmlvZCc6IGdlbmVyYXRlRnVsbExhYmVsRnJvbVBlcmlvZCxcbiAgICAgICAgICAgICAnZ2V0UGVyaW9kU3RyaW5nJzogZ2V0UGVyaW9kU3RyaW5nLFxuICAgICAgICAgICAgICdnZXRZZWFyTGFiZWxGcm9tUGVyaW9kJzogZ2V0WWVhckxhYmVsRnJvbVBlcmlvZCxcbiAgICAgICAgICAgICAnZ2V0TW9udGhGcm9tUGVyaW9kJzogZ2V0TW9udGhGcm9tUGVyaW9kLFxuICAgICAgICAgICAgICdnZXRZZWFyRnJvbVBlcmlvZCc6IGdldFllYXJGcm9tUGVyaW9kLFxuICAgICAgICAgICAgICdnZXRNb250aEluZGV4RnJvbVBlcmlvZCc6IGdldE1vbnRoSW5kZXhGcm9tUGVyaW9kLFxuICAgICAgICAgICAgICdnZXRNb250aEZyb21OdW1iZXInOiBnZXRNb250aEZyb21OdW1iZXJcbiAgICAgICAgIH0pO1xuICAgICB9XG5cbiAgICAgcHVibGlzaEV4dGVybmFsQVBJKGFwcEhlbHBlcnMpO1xuXG4gfSkod2luZG93LCBkb2N1bWVudCk7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG4vKipcbiAqIENyZWF0ZWQgYnkgYndhbWFsYSBvbiA2LzIvMjAxNy5cbiAqL1xuYW5ndWxhci5tb2R1bGUoJ3NlcnZpY2VzJykuc2VydmljZSgnQW5udWFsU2VydmljZScsIFsnJGh0dHAnLFxuICAgIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgICAgIHZhciBoYW5kbGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0QXdwQWN0aXZpdGllcyA9IGZ1bmN0aW9uKHllYXIpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgncGxhbm5pbmcvYXBpL2F3cGFjdGl2aXRpZXMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHllYXI6IHllYXJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0RnVuZEFjdGl2aXRpZXMgPSBmdW5jdGlvbih5ZWFyKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ3BsYW5uaW5nL2FwaS9mdW5kYWN0aXZpdGllcycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgeWVhcjogeWVhcixcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0UHJpb3JpdHlBY3Rpdml0aWVzID0gZnVuY3Rpb24oeWVhcil7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdwbGFubmluZy9hcGkvcHJpb3JpdHlhY3Rpdml0aWVzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICB5ZWFyOiB5ZWFyLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgICdnZXRBd3BBY3Rpdml0aWVzJzpnZXRBd3BBY3Rpdml0aWVzLFxuICAgICAgICAgICAgJ2dldEZ1bmRBY3Rpdml0aWVzJzogZ2V0RnVuZEFjdGl2aXRpZXMsXG4gICAgICAgICAgICAnZ2V0UHJpb3JpdHlBY3Rpdml0aWVzJzpnZXRQcmlvcml0eUFjdGl2aXRpZXNcbiAgICAgICAgfTtcbiAgICB9XG5cbl0pXG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnc2VydmljZXMnKVxuICAgIC5zZXJ2aWNlKCdDaGFydFBERkV4cG9ydCcsIENoYXJ0UERGRXhwb3J0KTtcblxuZnVuY3Rpb24gQ2hhcnRQREZFeHBvcnQoKSB7XG4gICAgdmFyIHNlcnZpY2UgPSB7J2V4cG9ydCc6IGV4cG9ydFBERn07XG4gICAgcmV0dXJuIHNlcnZpY2U7XG5cbiAgICBmdW5jdGlvbiBleHBvcnRQREYoZmlsZW5hbWUpIHtcbiAgICAgICAgZDMuc2VsZWN0QWxsKFwic3ZnIC5udi1saW5lXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwiI2ZmZmZmZlwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIDApO1xuXG4gICAgICAgIGQzLnNlbGVjdEFsbChcIi5udmQzIC5udi1iYWNrZ3JvdW5kXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwiI2ZmZmZmZlwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIDApO1xuXG4gICAgICAgIGQzLnNlbGVjdEFsbChcIi5udmQzIC5udi1heGlzIGxpbmVcIilcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBcIiNlNWU1ZTVcIik7XG5cbiAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52ZDMgdGV4dFwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiZm9udFwiLCBcIm5vcm1hbCAxM3B4IEFyaWFsLCBzYW5zLXNlcmlmXCIpO1xuXG4gICAgICAgIGQzLnNlbGVjdEFsbChcIi5udmQzIC5udi1ncm91cHMgLm52LXBvaW50XCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMClcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZS13aWR0aFwiLCBcIjBweFwiKTtcblxuICAgICAgICBkMy5zZWxlY3RBbGwoXCIubnZkMyAubnYteSAuemVybyBsaW5lXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgXCIjNDA0MDQwXCIpO1xuXG4gICAgICAgIGQzLnNlbGVjdEFsbChcIi5udi15IC5udi1heGlzIGcgcGF0aC5kb21haW5cIilcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBcIiM0MDQwNDBcIik7XG5cbiAgICAgICAgZDMuc2VsZWN0QWxsKFwiLmxlZ2VuZFF1YW50IC5sYWJlbFwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiZm9udFwiLCBcIm5vcm1hbCAxMnB4IEFyaWFsLCBzYW5zLXNlcmlmXCIpO1xuXG4gICAgICAgIHZhciBwZGYgPSBuZXcganNQREYoJ2wnLCAnbW0nKTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7IGZvcm1hdCA6ICdQTkcnIH07XG5cbiAgICAgICAgcGRmLmFkZEhUTUwoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwZGZSZXBvcnRcIiksIDAsIDAsIG9wdGlvbnMsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHBkZi5zYXZlKGZpbGVuYW1lKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhclxuICAgIC5tb2R1bGUoJ3NlcnZpY2VzJylcbiAgICAuc2VydmljZSgnQ2hhcnRTdXBwb3J0U2VydmljZScsIENoYXJ0U3VwcG9ydFNlcnZpY2UpO1xuXG5mdW5jdGlvbiBDaGFydFN1cHBvcnRTZXJ2aWNlKCkge1xuICAgIHZhciBzZXJ2aWNlID0ge1xuICAgICAgICAnZ2V0T3B0aW9ucyc6IGdldE9wdGlvbnMsXG4gICAgICAgICdpbml0TGFiZWxzJzogaW5pdExhYmVscyxcbiAgICAgICAgJ2NsZWFyTGFiZWxzJzogY2xlYXJMYWJlbHNcbiAgICB9O1xuXG4gICAgcmV0dXJuIHNlcnZpY2U7XG5cbiAgICBmdW5jdGlvbiBnZXRPcHRpb25zKGNoYXJ0VHlwZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBjaGFydFR5cGUsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA0NTAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY1MCxcbiAgICAgICAgICAgICAgICAvLyBtYXJnaW46IHt0b3A6IDEwMH0sXG4gICAgICAgICAgICAgICAgc3RhY2tlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2hvd0NvbnRyb2xzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBncm91cFNwYWNpbmc6IDAuMixcbiAgICAgICAgICAgICAgICBjbGlwRWRnZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgLy8gdXNlSW50ZXJhY3RpdmVHdWlkZWxpbmU6IHRydWUsXG4gICAgICAgICAgICAgICAgaW50ZXJhY3RpdmVMYXllcjoge2dyYXZpdHk6ICdzJ30sXG4gICAgICAgICAgICAgICAgeDogZnVuY3Rpb24oZCl7IHJldHVybiBkLng7IH0sXG4gICAgICAgICAgICAgICAgeTogZnVuY3Rpb24oZCl7IHJldHVybiBkLnk7IH0sXG4gICAgICAgICAgICAgICAgZm9yY2VZOiBbMCwxMTBdLFxuICAgICAgICAgICAgICAgIHhBeGlzOiB7XG4gICAgICAgICAgICAgICAgICAgIGF4aXNMYWJlbDogJ1llYXJzJyxcbiAgICAgICAgICAgICAgICAgICAgdGlja0Zvcm1hdDogZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeUF4aXM6IHtcbiAgICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiAnQ292ZXJhZ2UgUmF0ZSAoJSknLFxuICAgICAgICAgICAgICAgICAgICB0aWNrczogMTBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRpc3BhdGNoOiB7XG4gICAgICAgICAgICAgICAgICAgIHJlbmRlckVuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbml0TGFiZWxzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihjaGFydCl7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCIhISEgbGluZUNoYXJ0IGNhbGxiYWNrICEhIVwiKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVDaGFuZ2U6IGZ1bmN0aW9uKCkge31cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0TGFiZWxzKCkge1xuICAgICAgICAvLyBZb3UgbmVlZCB0byBhcHBseSB0aGlzIG9uY2UgYWxsIHRoZSBhbmltYXRpb25zIGFyZSBhbHJlYWR5IGZpbmlzaGVkLiBPdGhlcndpc2UgbGFiZWxzIHdpbGwgYmUgcGxhY2VkIHdyb25nbHkuXG4gICAgICAgIGQzLnNlbGVjdEFsbCgnLm52LW11bHRpYmFyIC5udi1ncm91cCcpLmVhY2goZnVuY3Rpb24oZ3JvdXApe1xuICAgICAgICAgIHZhciBnID0gZDMuc2VsZWN0KHRoaXMpO1xuXG4gICAgICAgICAgLy8gUmVtb3ZlIHByZXZpb3VzIGxhYmVscyBpZiB0aGVyZSBpcyBhbnlcbiAgICAgICAgICBnLnNlbGVjdEFsbCgndGV4dCcpLnJlbW92ZSgpO1xuICAgICAgICAgIGcuc2VsZWN0QWxsKCcubnYtYmFyJykuZWFjaChmdW5jdGlvbihiYXIpe1xuICAgICAgICAgICAgdmFyIGIgPSBkMy5zZWxlY3QodGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFyV2lkdGggPSBiLmF0dHIoJ3dpZHRoJyk7XG4gICAgICAgICAgICB2YXIgYmFySGVpZ2h0ID0gYi5hdHRyKCdoZWlnaHQnKTtcblxuICAgICAgICAgICAgZy5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgICAvLyBUcmFuc2Zvcm1zIHNoaWZ0IHRoZSBvcmlnaW4gcG9pbnQgdGhlbiB0aGUgeCBhbmQgeSBvZiB0aGUgYmFyXG4gICAgICAgICAgICAgIC8vIGlzIGFsdGVyZWQgYnkgdGhpcyB0cmFuc2Zvcm0uIEluIG9yZGVyIHRvIGFsaWduIHRoZSBsYWJlbHNcbiAgICAgICAgICAgICAgLy8gd2UgbmVlZCB0byBhcHBseSB0aGlzIHRyYW5zZm9ybSB0byB0aG9zZS5cbiAgICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGIuYXR0cigndHJhbnNmb3JtJykpXG4gICAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy8gVHdvIGRlY2ltYWxzIGZvcm1hdFxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGJhci55KS50b0ZpeGVkKDApO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuYXR0cigneScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy8gQ2VudGVyIGxhYmVsIHZlcnRpY2FsbHlcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5nZXRCQm94KCkuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGIuYXR0cigneScpKSAtIDEwOyAvLyAxMCBpcyB0aGUgbGFiZWwncyBtYWdpbiBmcm9tIHRoZSBiYXJcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8vIENlbnRlciBsYWJlbCBob3Jpem9udGFsbHlcbiAgICAgICAgICAgICAgICB2YXIgd2lkdGggPSB0aGlzLmdldEJCb3goKS53aWR0aDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChiLmF0dHIoJ3gnKSkgKyAocGFyc2VGbG9hdChiYXJXaWR0aCkgLyAyKSAtICh3aWR0aCAvIDIpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYmFyLXZhbHVlcycpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckxhYmVscygpIHtcbiAgICAgICAgZDMuc2VsZWN0QWxsKCcubnYtbXVsdGliYXIgLm52LWdyb3VwJykuZWFjaChmdW5jdGlvbihncm91cCl7XG4gICAgICAgICAgdmFyIGcgPSBkMy5zZWxlY3QodGhpcyk7XG4gICAgICAgICAgLy8gUmVtb3ZlIHByZXZpb3VzIGxhYmVscyBpZiB0aGVyZSBpcyBhbnlcbiAgICAgICAgICBnLnNlbGVjdEFsbCgndGV4dCcpLnJlbW92ZSgpO1xuICAgICAgfSk7XG4gICAgfVxufVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhclxuICAgIC5tb2R1bGUoJ3NlcnZpY2VzJylcbiAgICAuc2VydmljZSgnQ292ZXJhZ2VDYWxjdWxhdG9yJywgQ292ZXJhZ2VDYWxjdWxhdG9yKTtcblxuZnVuY3Rpb24gQ292ZXJhZ2VDYWxjdWxhdG9yKCkge1xuXG4gICAgdmFyIHNlcnZpY2UgPSAge1xuICAgICAgICAnY2FsY3VsYXRlQ292ZXJhZ2VSYXRlJzogY2FsY3VsYXRlQ292ZXJhZ2VSYXRlLFxuICAgICAgICAnY2FsY3VsYXRlRHJvcG91dFJhdGUnOiBjYWxjdWxhdGVEcm9wb3V0UmF0ZSxcbiAgICAgICAgJ2NhbGN1bGF0ZVJlZENhdGVnb3J5JzogY2FsY3VsYXRlUmVkQ2F0ZWdvcnlcbiAgICB9O1xuXG4gICAgcmV0dXJuIHNlcnZpY2U7XG5cbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVDb3ZlcmFnZVJhdGUoY29uc3VtcHRpb24sIHBsYW5uZWQpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoKGNvbnN1bXB0aW9uIC8gcGxhbm5lZCkgKiAxMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZURyb3BvdXRSYXRlKGZpcnN0RG9zZSwgbGFzdERvc2UpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoKChmaXJzdERvc2UgLSBsYXN0RG9zZSkgLyBmaXJzdERvc2UpICogMTAwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVSZWRDYXRlZ29yeShmaXJzdERvc2UsIGxhc3REb3NlLCBwbGFubmVkKSB7XG4gICAgICAgIHZhciBhY2Nlc3MgPSBjYWxjdWxhdGVDb3ZlcmFnZVJhdGUoZmlyc3REb3NlLCBwbGFubmVkKTtcbiAgICAgICAgdmFyIGRyb3BvdXRSYXRlID0gY2FsY3VsYXRlRHJvcG91dFJhdGUoZmlyc3REb3NlLCBsYXN0RG9zZSk7XG5cbiAgICAgICAgaWYgKGFjY2VzcyA+PSA5MCAmJiBkcm9wb3V0UmF0ZSA+PSAwICYmIGRyb3BvdXRSYXRlIDw9IDEwKSByZXR1cm4gMTtcbiAgICAgICAgZWxzZSBpZiAoYWNjZXNzID49IDkwICYmIChkcm9wb3V0UmF0ZSA8IDAgfHwgZHJvcG91dFJhdGUgPiAxMCkpIHJldHVybiAyO1xuICAgICAgICBlbHNlIGlmIChhY2Nlc3MgPCA5MCAmJiBkcm9wb3V0UmF0ZSA+PSAwICYmIGRyb3BvdXRSYXRlIDw9IDEwKSByZXR1cm4gMztcbiAgICAgICAgZWxzZSBpZiAoYWNjZXNzIDwgOTAgJiYgKGRyb3BvdXRSYXRlIDwgMCB8fCBkcm9wb3V0UmF0ZSA+IDEwKSkgcmV0dXJuIDQ7XG4gICAgICAgIGVsc2UgcmV0dXJuIDA7XG4gICAgfVxufVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ3NlcnZpY2VzJykuc2VydmljZSgnQ292ZXJhZ2VTZXJ2aWNlJywgWyckaHR0cCcsXG4gICAgZnVuY3Rpb24oJGh0dHApIHtcbiAgICAgICAgdmFyIGhhbmRsZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRESElTMlZhY2NpbmVEb3NlcyA9IGZ1bmN0aW9uKHBlcmlvZCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvdmVyYWdlL2FwaS9kaGlzMnZhY2NpbmVkb3NlcycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kOiBwZXJpb2QsXG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmU6IHZhY2NpbmUsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRWYWNjaW5lRG9zZXMgPSBmdW5jdGlvbihwZXJpb2QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvdmVyYWdlL2FwaS92YWNjaW5lZG9zZXMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZDogcGVyaW9kLFxuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lOiB2YWNjaW5lXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBnZXRSZWRWYWNjaW5lRG9zZXMgPSBmdW5jdGlvbihwZXJpb2QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvdmVyYWdlL2FwaS92YWNjaW5lZG9zZXMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZDogcGVyaW9kLFxuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lOiB2YWNjaW5lXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cblxuICAgICAgICB2YXIgZ2V0VmFjY2luZURvc2VzQnlEaXN0cmljdCA9IGZ1bmN0aW9uKHBlcmlvZCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvdmVyYWdlL2FwaS92YWNjaW5lZG9zZXMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZDogcGVyaW9kLFxuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lOiB2YWNjaW5lLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3RcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0VmFjY2luZURvc2VzQnlQZXJpb2QgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvdmVyYWdlL2FwaS92YWNjaW5lZG9zZXNfYnlfcGVyaW9kJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydFllYXI6IHBhcmFtcy5zdGFydFllYXIsXG4gICAgICAgICAgICAgICAgICAgIGVuZFllYXI6IHBhcmFtcy5lbmRZZWFyLFxuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lOiBwYXJhbXMuYW50aWdlbixcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kOiBwYXJhbXMucGVyaW9kLFxuICAgICAgICAgICAgICAgICAgICBkb3NlOiBwYXJhbXMuZG9zZSxcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IHBhcmFtcy5kaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IHBhcmFtcy5kYXRhVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlRGlzdHJpY3RHcm91cGluZzogcGFyYW1zLmVuYWJsZURpc3RyaWN0R3JvdXBpbmdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0VW5lcGlDb3ZlcmFnZSA9IGZ1bmN0aW9uKHBlcmlvZCwgZGlzdHJpY3QpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvdmVyYWdlL2FwaS9jb3ZlcmFnZWFubnVhbGl6ZWQnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZDogcGVyaW9kLFxuXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXREaXN0cmljdE1hcCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdzdGF0aWMvVWdhbmRhX2FkbWluLmpzb24nKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJnZXRESElTMlZhY2NpbmVEb3Nlc1wiOiBnZXRESElTMlZhY2NpbmVEb3NlcyxcbiAgICAgICAgICAgIFwiZ2V0VmFjY2luZURvc2VzXCI6IGdldFZhY2NpbmVEb3NlcyxcbiAgICAgICAgICAgIFwiZ2V0VmFjY2luZURvc2VzQnlEaXN0cmljdFwiOiBnZXRWYWNjaW5lRG9zZXNCeURpc3RyaWN0LFxuICAgICAgICAgICAgXCJnZXRWYWNjaW5lRG9zZXNCeVBlcmlvZFwiOiBnZXRWYWNjaW5lRG9zZXNCeVBlcmlvZCxcbiAgICAgICAgICAgIFwiZ2V0VW5lcGlDb3ZlcmFnZVwiOmdldFVuZXBpQ292ZXJhZ2UsXG4gICAgICAgICAgICBcImdldERpc3RyaWN0TWFwXCI6IGdldERpc3RyaWN0TWFwLFxuICAgICAgICAgICAgXCJnZXRSZWRWYWNjaW5lRG9zZXNcIjpnZXRSZWRWYWNjaW5lRG9zZXNcbiAgICAgICAgfTtcbiAgICB9XG5dKVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ3NlcnZpY2VzJykuc2VydmljZSgnRmlsdGVyU2VydmljZScsIFsnJGh0dHAnLFxuICAgIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgICAgIHZhciBoYW5kbGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0TW9udGhzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL21vbnRocycpLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXREaXN0cmljdHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvZGlzdHJpY3RzJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldFZhY2NpbmVzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3ZhY2NpbmVzLycpLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGdldEZyaWRnZURpc3RyaWN0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY29sZGNoYWluL2FwaS9kaXN0cmljdHMnKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0RnJpZGdlQ2FyZUxldmVscyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY29sZGNoYWluL2FwaS9jYXJlbGV2ZWxzJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldEZyaWRnZVF1YXJ0ZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb2xkY2hhaW4vYXBpL3F1YXJ0ZXJzJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldExhc3RQZXJpb2QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvbGFzdHBlcmlvZCcpLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRQZXJpb2RSYW5nZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvdmVyYWdlL2FwaS9wZXJpb2RfcmFuZ2VzJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZ2V0QXdwQWN0aXZpdGllcz0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ3BsYW5uaW5nL2FwaS9hd3BhY3Rpdml0aWVzJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldEZ1bmRBY3Rpdml0aWVzPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgncGxhbm5pbmcvYXBpL2Z1bmRhY3Rpdml0aWVzJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBnZXRVbmVwaUNvdmVyYWdlPWZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb3ZlcmFnZS9hcGkvY292ZXJhZ2Vhbm51YWxpemVkJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBnZXRVbmVwaVN0b2NrPWZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdhcGkvc3RvY2svYXRoYW5kYnlkaXN0cmljdCcpLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRZZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdwbGFubmluZy9hcGkvYWN0aXZpdHl5ZWFyJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJnZXRNb250aHNcIjogZ2V0TW9udGhzLFxuICAgICAgICAgICAgXCJnZXRZZWFyXCI6IGdldFllYXIsXG4gICAgICAgICAgICBcImdldFZhY2NpbmVzXCI6IGdldFZhY2NpbmVzLFxuICAgICAgICAgICAgXCJnZXREaXN0cmljdHNcIjogZ2V0RGlzdHJpY3RzLFxuICAgICAgICAgICAgXCJnZXRGcmlkZ2VEaXN0cmljdHNcIjogZ2V0RnJpZGdlRGlzdHJpY3RzLFxuICAgICAgICAgICAgXCJnZXRGcmlkZ2VDYXJlTGV2ZWxzXCI6IGdldEZyaWRnZUNhcmVMZXZlbHMsXG4gICAgICAgICAgICBcImdldEZyaWRnZVF1YXJ0ZXJzXCI6IGdldEZyaWRnZVF1YXJ0ZXJzLFxuICAgICAgICAgICAgXCJnZXRMYXN0UGVyaW9kXCI6IGdldExhc3RQZXJpb2QsXG4gICAgICAgICAgICBcImdldFBlcmlvZFJhbmdlc1wiOiBnZXRQZXJpb2RSYW5nZXMsXG4gICAgICAgICAgICBcImdldEF3cEFjdGl2aXRpZXNcIjogZ2V0QXdwQWN0aXZpdGllcyxcbiAgICAgICAgICAgIFwiZ2V0RnVuZEFjdGl2aXRpZXNcIjogZ2V0RnVuZEFjdGl2aXRpZXMsXG4gICAgICAgICAgICBcImdldFVuZXBpQ292ZXJhZ2VcIjpnZXRVbmVwaUNvdmVyYWdlLFxuICAgICAgICAgICAgXCJnZXRVbmVwaVN0b2NrXCI6Z2V0VW5lcGlTdG9ja1xuICAgICAgICB9O1xuICAgIH1cbl0pXG5cbmFuZ3VsYXIubW9kdWxlKCdzZXJ2aWNlcycpLnNlcnZpY2UoJ01vbnRoU2VydmljZScsIFtcbiAgICBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgZ2V0TW9udGhOYW1lID0gZnVuY3Rpb24obW9udGgpIHtcbiAgICAgICAgICAgIHZhciBtb250aHMgPSB7fTtcbiAgICAgICAgICAgIG1vbnRoc1snMSddID0gXCJKYW5cIjtcbiAgICAgICAgICAgIG1vbnRoc1snMiddID0gXCJGZWJcIjtcbiAgICAgICAgICAgIG1vbnRoc1snMyddID0gXCJNYXJcIjtcbiAgICAgICAgICAgIG1vbnRoc1snNCddID0gXCJBcHJcIjtcbiAgICAgICAgICAgIG1vbnRoc1snNSddID0gXCJNYXlcIjtcbiAgICAgICAgICAgIG1vbnRoc1snNiddID0gXCJKdW5cIjtcbiAgICAgICAgICAgIG1vbnRoc1snNyddID0gXCJKdWxcIjtcbiAgICAgICAgICAgIG1vbnRoc1snOCddID0gXCJBdWdcIjtcbiAgICAgICAgICAgIG1vbnRoc1snOSddID0gXCJTZXBcIjtcbiAgICAgICAgICAgIG1vbnRoc1snMTAnXSA9IFwiT2N0XCI7XG4gICAgICAgICAgICBtb250aHNbJzExJ10gPSBcIk5vdlwiO1xuICAgICAgICAgICAgbW9udGhzWycxMiddID0gXCJEZWNcIjtcbiAgICAgICAgICAgIHJldHVybiBtb250aHNbbW9udGhdO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRNb250aE51bWJlciA9IGZ1bmN0aW9uKG1vbnRoKSB7XG4gICAgICAgICAgICB2YXIgbW9udGhzID0ge307XG4gICAgICAgICAgICBtb250aHNbJ0phbiddID0gMTtcbiAgICAgICAgICAgIG1vbnRoc1snRmViJ10gPSAyO1xuICAgICAgICAgICAgbW9udGhzWydNYXInXSA9IDM7XG4gICAgICAgICAgICBtb250aHNbJ0FwciddID0gNDtcbiAgICAgICAgICAgIG1vbnRoc1snTWF5J10gPSA1O1xuICAgICAgICAgICAgbW9udGhzWydKdW4nXSA9IDY7XG4gICAgICAgICAgICBtb250aHNbJ0p1bCddID0gNztcbiAgICAgICAgICAgIG1vbnRoc1snQXVnJ10gPSA4O1xuICAgICAgICAgICAgbW9udGhzWydTZXAnXSA9IDk7XG4gICAgICAgICAgICBtb250aHNbJ09jdCddID0gMTA7XG4gICAgICAgICAgICBtb250aHNbJ05vdiddID0gMTE7XG4gICAgICAgICAgICBtb250aHNbJ0RlYyddID0gMTI7XG4gICAgICAgICAgICByZXR1cm4gbW9udGhzW21vbnRoXTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbW9udGhUb0RhdGUgPSBmdW5jdGlvbihtb250aFllYXIpIHtcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IG1vbnRoWWVhci5zcGxpdChcIiBcIik7XG4gICAgICAgICAgICB2YXIgbW9udGggPSBnZXRNb250aE51bWJlcihwYXJ0c1swXSk7XG4gICAgICAgICAgICB2YXIgeWVhciA9IHBhcnNlSW50KHBhcnRzWzFdKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgbW9udGhEaWZmID0gZnVuY3Rpb24gKHN0YXJ0RGF0ZSwgZW5kRGF0ZSkge1xuICAgICAgICAgICAgdmFyIG1vbnRocztcbiAgICAgICAgICAgIG1vbnRocyA9IChlbmREYXRlLmdldEZ1bGxZZWFyKCkgLSBzdGFydERhdGUuZ2V0RnVsbFllYXIoKSkgKiAxMjtcbiAgICAgICAgICAgIG1vbnRocyAtPSBzdGFydERhdGUuZ2V0TW9udGgoKSArIDE7XG4gICAgICAgICAgICBtb250aHMgKz0gZW5kRGF0ZS5nZXRNb250aCgpO1xuICAgICAgICAgICAgcmV0dXJuIG1vbnRocyA8PSAwID8gMCA6IG1vbnRocztcbiAgICAgICAgfTtcblxuICAgICAgICBtb250aFJhbmdlRGlmZiA9IGZ1bmN0aW9uIChzdGFydERhdGUsIGVuZERhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiBtb250aERpZmYobW9udGhUb0RhdGUoc3RhcnREYXRlKSwgbW9udGhUb0RhdGUoZW5kRGF0ZSkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBcImdldE1vbnRoTmFtZVwiOiBnZXRNb250aE5hbWUsXG4gICAgICAgICAgICBcImdldE1vbnRoTnVtYmVyXCI6IGdldE1vbnRoTnVtYmVyLFxuICAgICAgICAgICAgXCJtb250aFRvRGF0ZVwiOiBtb250aFRvRGF0ZSxcbiAgICAgICAgICAgIFwibW9udGhEaWZmXCI6IG1vbnRoRGlmZixcbiAgICAgICAgICAgIFwibW9udGhSYW5nZURpZmZcIjogbW9udGhSYW5nZURpZmYsXG4gICAgICAgIH07XG4gICAgfVxuXSlcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbiAgICBhbmd1bGFyLm1vZHVsZSgnc2VydmljZXMnKS5zZXJ2aWNlKCdGaW5hbmNlU2VydmljZScsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCkge1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBcImdldEZpbmFuY2VEYXRhXCI6IGdldEZpbmFuY2VEYXRhLFxuICAgICAgICAgICAgXCJnZXRGaW5hbmNlWWVhcnNcIjogZ2V0RmluYW5jZVllYXJzXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlUmVzcG9uc2UocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0RmluYW5jZURhdGEocGFyYW1zKSB7XG4gICAgICAgICAgICB2YXIgY29uZmlnID0ge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydFllYXI6IHBhcmFtcyA9PSB1bmRlZmluZWQgPyAxOTkwIDogcGFyYW1zLnN0YXJ0WWVhcixcbiAgICAgICAgICAgICAgICAgICAgZW5kWWVhcjogcGFyYW1zID09IHVuZGVmaW5lZCA/IDMwMDAgOiBwYXJhbXMuZW5kWWVhclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvZmluYW5jZS9saXN0JywgY29uZmlnKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEZpbmFuY2VZZWFycygpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9maW5hbmNlL3llYXJzJywge30pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9XG5cbiAgICB9XSlcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdzZXJ2aWNlcycpLnNlcnZpY2UoJ0ZyaWRnZVNlcnZpY2UnLCBbJyRodHRwJyxcbiAgICBmdW5jdGlvbigkaHR0cCkge1xuICAgICAgICB2YXIgaGFuZGxlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldEZyaWRnZUNhcGFjaXR5ID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBkaXN0cmljdCwgY2FyZWxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb2xkY2hhaW4vYXBpL2NhcGFjaXRpZXMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0UXVhcnRlcjogc3RhcnRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBlbmRRdWFydGVyOiBlbmRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3QsXG4gICAgICAgICAgICAgICAgICAgIGNhcmVsZXZlbDogY2FyZWxldmVsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldEZyaWRnZURpc3RyaWN0Q2FwYWNpdHkgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGRpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvbGRjaGFpbi9hcGkvZGlzdHJpY3RjYXBhY2l0aWVzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydFF1YXJ0ZXI6IHN0YXJ0UXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZW5kUXVhcnRlcjogZW5kUXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICBjYXJlbGV2ZWw6IGNhcmVsZXZlbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRGcmlkZ2VGYWNpbGl0eUNhcGFjaXR5ID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBkaXN0cmljdCwgY2FyZWxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb2xkY2hhaW4vYXBpL2ZhY2lsaXR5Y2FwYWNpdGllcycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRRdWFydGVyOiBzdGFydFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGVuZFF1YXJ0ZXI6IGVuZFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgY2FyZWxldmVsOiBjYXJlbGV2ZWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0RnJpZGdlRnVuY3Rpb25hbGl0eSA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY29sZGNoYWluL2FwaS9yZWZyaWdlcmF0b3JzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydFF1YXJ0ZXI6IHN0YXJ0UXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZW5kUXVhcnRlcjogZW5kUXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICBjYXJlbGV2ZWw6IGNhcmVsZXZlbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgZ2V0RnJpZGdlRGlzdHJpY3RSZWZyaWdlcmF0b3IgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGRpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvbGRjaGFpbi9hcGkvZGlzdHJpY3RyZWZyaWdlcmF0b3JzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydFF1YXJ0ZXI6IHN0YXJ0UXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZW5kUXVhcnRlcjogZW5kUXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICBjYXJlbGV2ZWw6IGNhcmVsZXZlbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRGcmlkZ2VGYWNpbGl0eVJlZnJpZ2VyYXRvciA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY29sZGNoYWluL2FwaS9mYWNpbGl0eXJlZnJpZ2VyYXRvcnMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0UXVhcnRlcjogc3RhcnRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBlbmRRdWFydGVyOiBlbmRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3QsXG4gICAgICAgICAgICAgICAgICAgIGNhcmVsZXZlbDogY2FyZWxldmVsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldEZyaWRnZUltbXVuaXppbmdGYWNpbGl0eSA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY29sZGNoYWluL2FwaS9pbW11bml6aW5nZmFjaWxpdGllcycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRRdWFydGVyOiBzdGFydFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGVuZFF1YXJ0ZXI6IGVuZFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgY2FyZWxldmVsOiBjYXJlbGV2ZWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGdldEZyaWRnZURpc3RyaWN0SW1tdW5pemluZ0ZhY2lsaXR5ID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBkaXN0cmljdCwgY2FyZWxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb2xkY2hhaW4vYXBpL2Rpc3RyaWN0aW1tdW5pemluZ2ZhY2lsaXRpZXMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0UXVhcnRlcjogc3RhcnRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBlbmRRdWFydGVyOiBlbmRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3QsXG4gICAgICAgICAgICAgICAgICAgIGNhcmVsZXZlbDogY2FyZWxldmVsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldEZyaWRnZUNhcGFjaXR5TWV0cmljcyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBzdXJwID0gMDtcbiAgICAgICAgICAgIHZhciBzdWZmaWNpZW50ID0gMDtcbiAgICAgICAgICAgIHZhciBzaG9ydGFnZSA9IDA7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpIDwgZGF0YS5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgdmFyIHN1cnBsdXNWYWx1ZSA9IGRhdGFbaV0uc3VycGx1c1xuICAgICAgICAgICAgICAgIGlmIChzdXJwbHVzVmFsdWUgPiAzMCkgc3VycCsrO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYoc3VycGx1c1ZhbHVlIDwzMCAmJiBzdXJwbHVzVmFsdWUgPj0gMCkgc3VmZmljaWVudCsrO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYoc3VycGx1c1ZhbHVlIDwgMCkgc2hvcnRhZ2UrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAnc3VycGx1cyc6IHN1cnAsXG4gICAgICAgICAgICAgICAgJ3N1ZmZpY2llbnQnOiBzdWZmaWNpZW50LFxuICAgICAgICAgICAgICAgICdzaG9ydGFnZSc6IHNob3J0YWdlLFxuICAgICAgICAgICAgICAgICd0b3RhbCc6IHN1cnAgKyBzdWZmaWNpZW50ICsgc2hvcnRhZ2VcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwiZ2V0RnJpZGdlQ2FwYWNpdHlcIjogZ2V0RnJpZGdlQ2FwYWNpdHksXG4gICAgICAgICAgICBcImdldEZyaWRnZURpc3RyaWN0Q2FwYWNpdHlcIjogZ2V0RnJpZGdlRGlzdHJpY3RDYXBhY2l0eSxcbiAgICAgICAgICAgIFwiZ2V0RnJpZGdlRmFjaWxpdHlDYXBhY2l0eVwiOiBnZXRGcmlkZ2VGYWNpbGl0eUNhcGFjaXR5LFxuICAgICAgICAgICAgXCJnZXRGcmlkZ2VGdW5jdGlvbmFsaXR5XCI6IGdldEZyaWRnZUZ1bmN0aW9uYWxpdHksXG4gICAgICAgICAgICBcImdldEZyaWRnZUltbXVuaXppbmdGYWNpbGl0eVwiOiBnZXRGcmlkZ2VJbW11bml6aW5nRmFjaWxpdHksXG4gICAgICAgICAgICBcImdldEZyaWRnZURpc3RyaWN0UmVmcmlnZXJhdG9yXCI6Z2V0RnJpZGdlRGlzdHJpY3RSZWZyaWdlcmF0b3IsXG4gICAgICAgICAgICBcImdldEZyaWRnZUZhY2lsaXR5UmVmcmlnZXJhdG9yXCI6Z2V0RnJpZGdlRmFjaWxpdHlSZWZyaWdlcmF0b3IsXG4gICAgICAgICAgICBcImdldEZyaWRnZURpc3RyaWN0SW1tdW5pemluZ0ZhY2lsaXR5XCI6Z2V0RnJpZGdlRGlzdHJpY3RJbW11bml6aW5nRmFjaWxpdHksXG4gICAgICAgICAgICBcImdldEZyaWRnZUNhcGFjaXR5TWV0cmljc1wiOiBnZXRGcmlkZ2VDYXBhY2l0eU1ldHJpY3NcbiAgICAgICAgfTtcbiAgICB9XG5dKVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpXG4gICAgLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgWyckc2NvcGUnLCAnRmlsdGVyU2VydmljZScsICdNb250aFNlcnZpY2UnLCAnJHJvb3RTY29wZScsICckbG9jYXRpb24nLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgRmlsdGVyU2VydmljZSwgTW9udGhTZXJ2aWNlLCAkcm9vdFNjb3BlLCAkbG9jYXRpb24pXG4gICAge1xuICAgICAgICAkc2NvcGUuc29ydFR5cGUgICAgID0gJ25hbWUnOyAvLyBzZXQgdGhlIGRlZmF1bHQgc29ydCB0eXBlXG4gICAgICAgICRzY29wZS5zb3J0UmV2ZXJzZSAgPSBmYWxzZTsgIC8vIHNldCB0aGUgZGVmYXVsdCBzb3J0IG9yZGVyXG4gICAgICAgICRzY29wZS5zZWFyY2hUZXh0ICAgPSAnJzsgICAgIC8vIHNldCB0aGUgZGVmYXVsdCBzZWFyY2gvZmlsdGVyIHRlcm1cblxuICAgICAgICAkc2NvcGUucm9vdCA9IHt9O1xuICAgICAgICB2YXIgc2hlbGwgPSB0aGlzO1xuXG4gICAgICAgICRzY29wZS4kb24oJ3NldERlZmF1bHRZZWFycycsIGZ1bmN0aW9uKGUsIHN0YXJ0WWVhciwgZW5kWWVhcikge1xuICAgICAgICAgICAgc2hlbGwuc3RhcnRZZWFyID0gc3RhcnRZZWFyO1xuICAgICAgICAgICAgc2hlbGwuZW5kWWVhciA9IGVuZFllYXI7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vPT09IFN0b2NrIE1hbmFnZW1lbnQgPT09PT09PVxuICAgICAgICBzaGVsbC5zdGFydE1vbnRoID0gc2hlbGwuc3RhcnRNb250aCA/IHNoZWxsLnN0YXJ0TW9udGgubmFtZSA6IFwiTm92IDIwMTVcIjtcbiAgICAgICAgc2hlbGwuZW5kTW9udGggPSBzaGVsbC5lbmRNb250aCA/IHNoZWxsLmVuZE1vbnRoLm5hbWUgOiBcIkRlYyAyMDE1XCI7XG4gICAgICAgIHNoZWxsLnNlbGVjdGVkVmFjY2luZSA9IFwiXCI7XG4gICAgICAgIHNoZWxsLnNlbGVjdGVkRGlzdHJpY3QgPSBcIlwiO1xuICAgICAgICBzaGVsbC5kZWZhdWx0UGVyaW9kID0gXCJcIjtcblxuICAgICAgICBGaWx0ZXJTZXJ2aWNlLmdldE1vbnRocygpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgc2hlbGwubW9udGhzID0gZGF0YTtcbiAgICAgICAgICAgIHNoZWxsLnN0YXJ0TW9udGggPSBzaGVsbC5tb250aHNbMF07XG4gICAgICAgICAgICAvL3NoZWxsLmVuZE1vbnRoID0gc2hlbGwubW9udGhzW2RlZmF1bHRNb250aF07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEFkZCBBbnRpZ2VuIGZpbHRlcnMgdmFsdWVzXG4gICAgICAgIHZhciBhbnRpZ2VucyA9IHtcbiAgICAgICAgICAgIFwiQUxMXCI6IFtdLFxuICAgICAgICAgICAgXCJIUFZcIjogW1wiSFBWMVwiLCBcIkhQVjJcIl0sXG4gICAgICAgICAgICBcIkRQVFwiOiBbXCJEUFQxXCIsIFwiRFBUMlwiLCBcIkRQVDNcIl0sXG4gICAgICAgICAgICBcIlBDVlwiOiBbXCJQQ1YxXCIsIFwiUENWMlwiLCBcIlBDVjNcIl0sXG4gICAgICAgICAgICBcIklQVlwiOiBbXSxcbiAgICAgICAgICAgIFwiT1BWXCI6IFtcIk9QVjFcIiwgXCJPUFYyXCIsIFwiT1BWM1wiXSxcbiAgICAgICAgICAgIFwiQkNHXCI6IFtdLFxuICAgICAgICAgICAgXCJNRUFTTEVTXCI6IFtdLFxuICAgICAgICAgICAgXCJUVFwiOiBbXCJUVDFcIiwgXCJUVDJcIl1cbiAgICAgICAgfVxuXG4gICAgICAgIHNoZWxsLnVwZGF0ZURvc2VzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzaGVsbC5kb3NlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgc2hlbGwuZG9zZXMgPSBbJ0Rvc2UgMScsICdEb3NlIDInLCAnRG9zZSAzJ107Ly9hbnRpZ2Vuc1tzaGVsbC5hbnRpZ2VuXVxuXG4gICAgICAgICAgICBpZiAoc2hlbGwuZG9zZXMubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgICAgICBzaGVsbC5kb3NlID0gc2hlbGwuZG9zZXNbc2hlbGwuZG9zZXMubGVuZ3RoLTFdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHNoZWxsLmFudGlnZW5zID0gT2JqZWN0LmtleXMoYW50aWdlbnMpO1xuXG4gICAgICAgIGlmICgkbG9jYXRpb24ucGF0aCgpID09ICcvY292ZXJhZ2UvcmVkY2F0ZWdvcnknKSB7XG4gICAgICAgICAgICBzaGVsbC5hbnRpZ2VuID0gXCJEUFRcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNoZWxsLmFudGlnZW4gPSBcIkFMTFwiO1xuICAgICAgICB9XG4gICAgICAgIHNoZWxsLnVwZGF0ZURvc2VzKCk7XG5cbiAgICAgICAgRmlsdGVyU2VydmljZS5nZXRQZXJpb2RSYW5nZXMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHNoZWxsLmNvdmVyYWdlWWVhcnMgPSBkYXRhLnllYXJzXG4gICAgICAgICAgICBzaGVsbC5zdGFydFllYXIgPSBkYXRhLnllYXJzW2RhdGEueWVhcnMubGVuZ3RoLTFdXG4gICAgICAgICAgICBzaGVsbC5lbmRZZWFyID0gZGF0YS55ZWFyc1tkYXRhLnllYXJzLmxlbmd0aC0xXVxuICAgICAgICAgICAgc2hlbGwuYWN0aXZlQ292ZXJhZ2VZZWFyID0gZGF0YS55ZWFyc1tkYXRhLnllYXJzLmxlbmd0aC0xXVxuICAgICAgICB9KTtcblxuXG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgRmlsdGVyU2VydmljZS5nZXRMYXN0UGVyaW9kKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBzaGVsbC5kZWZhdWx0UGVyaW9kID0gZGF0YTtcbiAgICAgICAgICAgIHNoZWxsLmRlZmF1bHRNb250aCA9IHBhcnNlSW50KGRhdGEucGVyaW9kLnRvU3RyaW5nKCkuc3Vic3RyaW5nKDQsIDYpKTtcbiAgICAgICAgICAgICRzY29wZS5kZWZhdWx0TW9udGggPSBzaGVsbC5kZWZhdWx0TW9udGg7XG4gICAgICAgICAgICAkc2NvcGUuZGVmYXVsdFBlcmlvZCA9IGRhdGEucGVyaW9kLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIHZhciBwZXJpb2QgPSBkYXRhLnBlcmlvZC50b1N0cmluZygpO1xuICAgICAgICAgICAgdmFyIG1vbnRoX251bWJlciA9IHBhcnNlSW50KHBlcmlvZC5zdWJzdHJpbmcoNCw2KSk7XG4gICAgICAgICAgICB2YXIgbW9udGhfbGFiZWwgPSBNb250aFNlcnZpY2UuZ2V0TW9udGhOYW1lKG1vbnRoX251bWJlcik7XG4gICAgICAgICAgICAvL3NoZWxsLmVuZE1vbnRoID0ge3llYXI6cGVyaW9kLnN1YnN0cmluZygwLDQpLCBwZXJpb2Q6cGVyaW9kLCBuYW1lOm1vbnRoX2xhYmVsLCBtb250aDptb250aF9udW1iZXIsIFwiJCRoYXNoS2V5XCI6XCJvYmplY3Q6MTg2XCJ9XG4gICAgICAgICAgICAvL3NoZWxsLmVuZE1vbnRoID0gc2hlbGwubW9udGhzW3NoZWxsLmRlZmF1bHRNb250aC0xXTtcblxuICAgICAgICAgICAgdmFyIGVuZE1vbnRoSW5kZXggPSAwO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHNoZWxsLm1vbnRocykge1xuICAgICAgICAgICAgICAgIGlmIChzaGVsbC5tb250aHNbaV0ucGVyaW9kID09IHBlcmlvZCkge1xuICAgICAgICAgICAgICAgICAgICBzaGVsbC5lbmRNb250aCA9IHNoZWxsLm1vbnRoc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgZW5kTW9udGhJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9zZXQgdGhlIHN0YXJ0IHBlcmlvZCB0byA2IG1vbnRocyBiYWNrIGJ5IGRlZmF1bHRcbiAgICAgICAgICAgIHZhciBzdGFydE1vbnRoSW5kZXggPSAoZW5kTW9udGhJbmRleCAtIDYpICsgMTtcbiAgICAgICAgICAgIGlmIChzdGFydE1vbnRoSW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgICAgc3RhcnRNb250aEluZGV4ID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNoZWxsLm1vbnRocyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBzaGVsbC5zdGFydE1vbnRoID0gc2hlbGwubW9udGhzW3N0YXJ0TW9udGhJbmRleF07XG4gICAgICAgICAgICB9XG5cblxuXG5cblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImRlcmVcIitKU09OLnN0cmluZ2lmeShzaGVsbC5tb250aHNbMTNdKSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2hlbGwuc3RvY2thdGhhbmQgPSAwO1xuXG5cblxuICAgICAgICBGaWx0ZXJTZXJ2aWNlLmdldERpc3RyaWN0cygpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgdmFyIGRpc3RyaWN0U3BlY2lmaWNQYXRocyA9IFtcbiAgICAgICAgICAgICAgICAnL3N0b2NrL2Rpc3RyaWJ1dGlvbicsXG4gICAgICAgICAgICAgICAgLy8gJy9zdG9jay91cHRha2VyYXRlJyxcbiAgICAgICAgICAgICAgICAvLyAnL3VuZXBpL2Rvd25sb2FkJ1xuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIGlmIChkaXN0cmljdFNwZWNpZmljUGF0aHMuaW5kZXhPZigkbG9jYXRpb24ucGF0aCgpKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIGRhdGEudW5zaGlmdCh7J25hbWUnOiAnTmF0aW9uYWwnfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNoZWxsLmRpc3RyaWN0cyA9IGRhdGE7XG4gICAgICAgICAgICBzaGVsbC5zZWxlY3RlZERpc3RyaWN0ID0gc2hlbGwuZGlzdHJpY3RzWzBdO1xuICAgICAgICAgICAgc2hlbGwuZGlzdHJpY3QgPSBzaGVsbC5kaXN0cmljdHNbMF0ubmFtZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgRmlsdGVyU2VydmljZS5nZXRWYWNjaW5lcygpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgc2hlbGwudmFjY2luZXMgPSBkYXRhO1xuICAgICAgICAgICAgc2hlbGwuc2VsZWN0ZWRWYWNjaW5lID0gc2hlbGwudmFjY2luZXNbNV07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vPT09PSBFbmQgU3RvY2sgTWFuYWdlbWVudCA9PT09PVxuXG5cbiAgICAgICAgLy89PT09PT09PVBsYW5uaW5nPT09PT09PT09XG4gICAgICAgIHNoZWxsLnNlbGVjdGVkWWVhciA9IFwiXCI7XG4gICAgICAgIEZpbHRlclNlcnZpY2UuZ2V0WWVhcigpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBzaGVsbC55ZWFycyA9IGRhdGE7XG4gICAgICAgICAgICBzaGVsbC5zZWxlY3RlZFllYXIgPSBzaGVsbC55ZWFyc1swXTtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICAvLz09PSBDb2xkIGNoYWluID09PT09PVxuICAgICAgICBzaGVsbC5zdGFydFF1YXJ0ZXIgPSBzaGVsbC5zdGFydFF1YXJ0ZXIgPyBzaGVsbC5zdGFydFF1YXJ0ZXIubmFtZSA6IFwiMjAxNjAxXCI7XG4gICAgICAgIHNoZWxsLmVuZFF1YXJ0ZXIgPSBzaGVsbC5lbmRRdWFydGVyID8gc2hlbGwuZW5kUXVhcnRlci5uYW1lIDogXCIyMDE2MDNcIjtcbiAgICAgICAgc2hlbGwuc2VsZWN0ZWRGcmlkZ2VEaXN0cmljdCA9IFwiXCI7XG4gICAgICAgIHNoZWxsLnNlbGVjdGVkRnJpZGdlQ2FyZUxldmVsID0gXCJcIjtcblxuXG4gICAgICAgIEZpbHRlclNlcnZpY2UuZ2V0RnJpZGdlRGlzdHJpY3RzKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBzaGVsbC5mcmlkZ2VEaXN0cmljdHMgPSBkYXRhO1xuICAgICAgICAgICAgc2hlbGwuc2VsZWN0ZWRGcmlkZ2VEaXN0cmljdCA9IHNoZWxsLmZyaWRnZURpc3RyaWN0c1swXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgRmlsdGVyU2VydmljZS5nZXRGcmlkZ2VDYXJlTGV2ZWxzKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBzaGVsbC5mcmlkZ2VDYXJlTGV2ZWxzID0gZGF0YTtcbiAgICAgICAgICAgIC8vc2hlbGwuc2VsZWN0ZWRGcmlkZ2VDYXJlTGV2ZWwgPSBzaGVsbC5mcmlkZ2VDYXJlTGV2ZWxzWzBdO1xuICAgICAgICB9KTtcblxuICAgICAgICBGaWx0ZXJTZXJ2aWNlLmdldEZyaWRnZVF1YXJ0ZXJzKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBzaGVsbC5mcmlkZ2VRdWFydGVycyA9IGRhdGE7XG4gICAgICAgICAgIC8vIHNoZWxsLnNlbGVjdGVkRnJpZGdlUXVhcnRlciA9IHNoZWxsLmZyaWRnZVF1YXJ0ZXJzWzNdO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLz09PT0gRW5kIENvbGQgQ2hhaW4gPT09PT09PVxuXG5cbi8vICAgICAgICAkc2NvcGUuJHdhdGNoKCdzaGVsbC5lbmRNb250aCcsIGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICBpZiAoc2hlbGwuZW5kTW9udGgpIHtcbi8vICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncmVmcmVzaCcsIHNoZWxsLnN0YXJ0TW9udGgsIHNoZWxsLmVuZE1vbnRoLCBzaGVsbC5zZWxlY3RlZERpc3RyaWN0LCBzaGVsbC5zZWxlY3RlZFZhY2NpbmUpO1xuLy8gICAgICAgICAgICB9XG4vLyAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaEdyb3VwKFsnc2hlbGwuZW5kTW9udGgnLCAnc2hlbGwuc2VsZWN0ZWRWYWNjaW5lJywgJ3NoZWxsLnNlbGVjdGVkRGlzdHJpY3QnXSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgIGlmKGRhdGFbMF0gJiYgZGF0YVsxXSAmJiBkYXRhWzJdKXtcbiAgICAgICAgICAgICAgICBpZiAoc2hlbGwuZW5kTW9udGgpIHtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdyZWZyZXNoJywgc2hlbGwuc3RhcnRNb250aCwgc2hlbGwuZW5kTW9udGgsIHNoZWxsLnNlbGVjdGVkRGlzdHJpY3QsIHNoZWxsLnNlbGVjdGVkVmFjY2luZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoR3JvdXAoXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ3NoZWxsLnN0YXJ0WWVhcicsXG4gICAgICAgICAgICAgICAgJ3NoZWxsLmVuZFllYXInLFxuICAgICAgICAgICAgICAgICdzaGVsbC5hY3RpdmVDb3ZlcmFnZVllYXInLFxuICAgICAgICAgICAgICAgICdzaGVsbC5hbnRpZ2VuJyxcbiAgICAgICAgICAgICAgICAnc2hlbGwuZG9zZScsXG4gICAgICAgICAgICAgICAgJ3NoZWxsLmRpc3RyaWN0J1xuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIGlmKGRhdGFbMF0pe1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2hlbGwuZW5kTW9udGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncmVmcmVzaENvdmVyYWdlMicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGwuZW5kTW9udGgsIC8vQmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbC5zdGFydFllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGwuZW5kWWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbC5hY3RpdmVDb3ZlcmFnZVllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGwuYW50aWdlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbC5kb3NlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsLmRpc3RyaWN0XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3JlZnJlc2hDb3ZlcmFnZTMnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kTW9udGg6IHNoZWxsLmVuZE1vbnRoLCAvL0JhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRZZWFyOiBzaGVsbC5zdGFydFllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kWWVhcjogc2hlbGwuZW5kWWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVDb3ZlcmFnZVllYXI6IHNoZWxsLmFjdGl2ZUNvdmVyYWdlWWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbnRpZ2VuOiBzaGVsbC5hbnRpZ2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvc2U6IHNoZWxsLmRvc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IHNoZWxsLmRpc3RyaWN0XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0cnVlXG4gICAgICAgICk7XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaCgnc2hlbGwuZW5kUXVhcnRlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHNoZWxsLmVuZFF1YXJ0ZXIpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3JlZnJlc2hDYXBhY2l0eScsIHNoZWxsLnN0YXJ0UXVhcnRlciwgc2hlbGwuZW5kUXVhcnRlciwgc2hlbGwuc2VsZWN0ZWRGcmlkZ2VEaXN0cmljdCwgc2hlbGwuc2VsZWN0ZWRGcmlkZ2VDYXJlTGV2ZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoR3JvdXAoWydzaGVsbC5lbmRRdWFydGVyJywgJ3NoZWxsLnNlbGVjdGVkRnJpZGdlRGlzdHJpY3QnLCAnc2hlbGwuc2VsZWN0ZWRGcmlkZ2VDYXJlTGV2ZWwnXSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBpZihkYXRhWzBdICYmIGRhdGFbMV0pe1xuICAgICAgICAgICAgICAgIGlmIChzaGVsbC5lbmRRdWFydGVyICYmIHNoZWxsLnNlbGVjdGVkRnJpZGdlRGlzdHJpY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdyZWZyZXNoQ2FwYWNpdHknLCBzaGVsbC5zdGFydFF1YXJ0ZXIsIHNoZWxsLmVuZFF1YXJ0ZXIsIHNoZWxsLnNlbGVjdGVkRnJpZGdlRGlzdHJpY3QsIHNoZWxsLnNlbGVjdGVkRnJpZGdlQ2FyZUxldmVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAkc2NvcGUuJHdhdGNoKCdzaGVsbC55ZWFycycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZiAoc2hlbGwuc2VsZWN0ZWRZZWFyKXtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3JlZnJlc2hBd3AnLCBzaGVsbC5zZWxlY3RlZFllYXIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2hHcm91cChbJ3NoZWxsLnllYXJzJ10sIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgaWYoZGF0YVswXSAmJiBkYXRhWzFdKXtcbiAgICAgICAgICAgICAgICBpZiAoc2hlbGwuc2VsZWN0ZWRZZWFyKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncmVmcmVzaEF3cCcsIHNoZWxsLnNlbGVjdGVkWWVhcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoKCdzaGVsbC5jb3ZlcmFnZVBlcmlvZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHNoZWxsLmNvdmVyYWdlUGVyaW9kKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdyZWZyZXNoQ292ZXJhZ2UnLCBzaGVsbC5jb3ZlcmFnZVBlcmlvZCwgc2hlbGwuc2VsZWN0ZWREaXN0cmljdCwgc2hlbGwuc2VsZWN0ZWRWYWNjaW5lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaEdyb3VwKFsnc2hlbGwuY292ZXJhZ2VQZXJpb2QnLCAnc2hlbGwuc2VsZWN0ZWREaXN0cmljdCcsICdzaGVsbC5zZWxlY3RlZFZhY2NpbmUnXSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBpZihkYXRhWzBdICYmIGRhdGFbMV0gJiYgZGF0YVsyXSl7XG4gICAgICAgICAgICAgICAgaWYgKHNoZWxsLmNvdmVyYWdlUGVyaW9kKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncmVmcmVzaENvdmVyYWdlJywgc2hlbGwuY292ZXJhZ2VQZXJpb2QsIHNoZWxsLnNlbGVjdGVkRGlzdHJpY3QsIHNoZWxsLnNlbGVjdGVkVmFjY2luZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoKCdzaGVsbC5jb3ZlcmFnZVBlcmlvZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHNoZWxsLmNvdmVyYWdlUGVyaW9kICYmIHNoZWxsLnNlbGVjdGVkRGlzdHJpY3QpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3JlZnJlc2hVbmVwaScsIHNoZWxsLmNvdmVyYWdlUGVyaW9kLCBzaGVsbC5zZWxlY3RlZERpc3RyaWN0LCBzaGVsbC5zZWxlY3RlZFZhY2NpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoR3JvdXAoWydzaGVsbC5jb3ZlcmFnZVBlcmlvZCcsICdzaGVsbC5zZWxlY3RlZERpc3RyaWN0JywgJ3NoZWxsLnNlbGVjdGVkVmFjY2luZSddLCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGlmKGRhdGFbMF0gJiYgZGF0YVsxXSAmJiBkYXRhWzJdKXtcbiAgICAgICAgICAgICAgICBpZiAoc2hlbGwuY292ZXJhZ2VQZXJpb2QgJiYgc2hlbGwuc2VsZWN0ZWREaXN0cmljdCkge1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3JlZnJlc2hVbmVwaScsIHNoZWxsLmNvdmVyYWdlUGVyaW9kLCBzaGVsbC5zZWxlY3RlZERpc3RyaWN0LCBzaGVsbC5zZWxlY3RlZFZhY2NpbmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cblxuICAgIH1cbl0pO1xufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ3NlcnZpY2VzJykuc2VydmljZSgnTWFwU3VwcG9ydFNlcnZpY2UnLCBbXG4gICAgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIGNyZWF0ZURpc3RyaWN0RGF0YU1hcCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBkYXRhRGlzdHJpY3RNYXAgPSB7fTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBlcmlvZCA9IGRhdGFbaV0ucGVyaW9kO1xuICAgICAgICAgICAgICAgIHZhciBmaXJzdF9kb3NlID0gZGF0YVtpXS50b3RhbF9maXJzdF9kb3NlO1xuICAgICAgICAgICAgICAgIHZhciBzZWNvbmRfZG9zZSA9IGRhdGFbaV0udG90YWxfc2Vjb25kX2Rvc2U7XG4gICAgICAgICAgICAgICAgdmFyIHRoaXJkX2Rvc2UgPSBkYXRhW2ldLnRvdGFsX3RoaXJkX2Rvc2U7XG4gICAgICAgICAgICAgICAgdmFyIGxhc3RfZG9zZSA9IGRhdGFbaV0udG90YWxfbGFzdF9kb3NlO1xuICAgICAgICAgICAgICAgIHZhciBwbGFubmVkID0gZGF0YVtpXS50b3RhbF9wbGFubmVkO1xuICAgICAgICAgICAgICAgIHZhciB2YWNjaW5lID0gZGF0YVtpXS52YWNjaW5lX19uYW1lO1xuICAgICAgICAgICAgICAgIHZhciBkaXN0cmljdCA9IGRhdGFbaV0uZGlzdHJpY3RfX25hbWU7XG4gICAgICAgICAgICAgICAgdmFyIHBlcmlvZFllYXIgPSBOdW1iZXIocGVyaW9kLnRvU3RyaW5nKCkuc3Vic3RyKDAsIDQpKTtcbiAgICAgICAgICAgICAgICB2YXIgcGVyaW9kTW9udGggPSBOdW1iZXIocGVyaW9kLnRvU3RyaW5nKCkuc3Vic3RyKDQsIDYpKTtcblxuICAgICAgICAgICAgICAgIGlmICghIChkaXN0cmljdCBpbiBkYXRhRGlzdHJpY3RNYXApKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFEaXN0cmljdE1hcFtkaXN0cmljdF0gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoISAodmFjY2luZSBpbiBkYXRhRGlzdHJpY3RNYXBbZGlzdHJpY3RdKSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhRGlzdHJpY3RNYXBbZGlzdHJpY3RdW3ZhY2NpbmVdID0ge307XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCEgKHBlcmlvZFllYXIgaW4gZGF0YURpc3RyaWN0TWFwW2Rpc3RyaWN0XVt2YWNjaW5lXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YURpc3RyaWN0TWFwW2Rpc3RyaWN0XVt2YWNjaW5lXVtwZXJpb2RZZWFyXSA9IHt9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghIChwZXJpb2RNb250aCBpbiBkYXRhRGlzdHJpY3RNYXBbZGlzdHJpY3RdW3ZhY2NpbmVdW3BlcmlvZFllYXJdKSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhRGlzdHJpY3RNYXBbZGlzdHJpY3RdW3ZhY2NpbmVdW3BlcmlvZFllYXJdW3BlcmlvZE1vbnRoXSA9IHt9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRhdGFEaXN0cmljdE1hcFtkaXN0cmljdF1bdmFjY2luZV1bcGVyaW9kWWVhcl1bcGVyaW9kTW9udGhdLmZpcnN0X2Rvc2UgPSBmaXJzdF9kb3NlO1xuICAgICAgICAgICAgICAgIGRhdGFEaXN0cmljdE1hcFtkaXN0cmljdF1bdmFjY2luZV1bcGVyaW9kWWVhcl1bcGVyaW9kTW9udGhdLmxhc3RfZG9zZSA9IGxhc3RfZG9zZTtcbiAgICAgICAgICAgICAgICBkYXRhRGlzdHJpY3RNYXBbZGlzdHJpY3RdW3ZhY2NpbmVdW3BlcmlvZFllYXJdW3BlcmlvZE1vbnRoXS5zZWNvbmRfZG9zZSA9IHNlY29uZF9kb3NlO1xuICAgICAgICAgICAgICAgIGRhdGFEaXN0cmljdE1hcFtkaXN0cmljdF1bdmFjY2luZV1bcGVyaW9kWWVhcl1bcGVyaW9kTW9udGhdLnRoaXJkX2Rvc2UgPSB0aGlyZF9kb3NlO1xuICAgICAgICAgICAgICAgIGRhdGFEaXN0cmljdE1hcFtkaXN0cmljdF1bdmFjY2luZV1bcGVyaW9kWWVhcl1bcGVyaW9kTW9udGhdLnBsYW5uZWQgPSBwbGFubmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZGF0YURpc3RyaWN0TWFwO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRQZXJpb2RMaXN0ID0gZnVuY3Rpb24oZGF0YSwgZW5kWWVhciwgcmVwb3J0VG9nZ2xlKSB7XG4gICAgICAgICAgICB2YXIgcGVyaW9kTGlzdCA9IFtdO1xuXG4gICAgICAgICAgICBpZiAocmVwb3J0VG9nZ2xlID09ICdNQ1knKSB7XG4gICAgICAgICAgICAgICAgcGVyaW9kTGlzdC5wdXNoKFxuICAgICAgICAgICAgICAgICAgICBbZW5kWWVhci50b1N0cmluZygpLCAgZ2V0TGFzdFZhbHVlKGRhdGFbZW5kWWVhcl0sIDEyKV1cbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlcG9ydFRvZ2dsZSA9PSAnTUZZJykge1xuICAgICAgICAgICAgICAgIHZhciBuZXh0WWVhciA9IGVuZFllYXIgKyAxO1xuICAgICAgICAgICAgICAgIHZhciBsYXN0VmFsdWU7XG5cbiAgICAgICAgICAgICAgICBpZiAobmV4dFllYXIgaW4gZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBnZXRMYXN0VmFsdWUoZGF0YVtuZXh0WWVhcl0sIDYpO1xuICAgICAgICAgICAgICAgICAgICBwZXJpb2RMaXN0LnB1c2goW25leHRZZWFyLnRvU3RyaW5nKCksIGxhc3RWYWx1ZV0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IGdldExhc3RWYWx1ZShkYXRhW2VuZFllYXJdLCAxMik7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZExpc3QucHVzaChbZW5kWWVhci50b1N0cmluZygpLCBsYXN0VmFsdWVdKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVwb3J0VG9nZ2xlID09ICdBQ1knKSB7XG4gICAgICAgICAgICAgICAgcGVyaW9kTGlzdC5wdXNoLmFwcGx5KHBlcmlvZExpc3QsXG4gICAgICAgICAgICAgICAgICAgIGdldFZhbHVlc0luUmFuZ2UoXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kWWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRZZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TGFzdFZhbHVlKGRhdGFbZW5kWWVhcl0sIDEyKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXBvcnRUb2dnbGUgPT0gJ0FGWScpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFllYXIgPSBlbmRZZWFyICsgMTtcblxuICAgICAgICAgICAgICAgIGlmIChuZXh0WWVhciBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZExpc3QucHVzaC5hcHBseShwZXJpb2RMaXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0VmFsdWVzSW5SYW5nZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgNyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0WWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRMYXN0VmFsdWUoZGF0YVtuZXh0WWVhcl0sIDYpXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kTGlzdC5wdXNoLmFwcGx5KHBlcmlvZExpc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRWYWx1ZXNJblJhbmdlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kWWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TGFzdFZhbHVlKGRhdGFbZW5kWWVhcl0sIDEyKVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcGVyaW9kTGlzdDtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRBZ2dyZWdhdGVzKGRhdGEsIHBlcmlvZExpc3QpIHtcbiAgICAgICAgICAgIHJldHVybiBwZXJpb2RMaXN0LnJlZHVjZShmdW5jdGlvbihhY2MsIHBlcmlvZCkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhID09IHVuZGVmaW5lZCB8fCBkYXRhW3BlcmlvZFswXV0gPT0gdW5kZWZpbmVkIHx8IGRhdGFbcGVyaW9kWzBdXVtwZXJpb2RbMV1dID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGRhdGFbcGVyaW9kWzBdXVtwZXJpb2RbMV1dO1xuICAgICAgICAgICAgICAgIGFjYy50b3RhbFBsYW5uZWQgKz0gaXRlbS5wbGFubmVkO1xuICAgICAgICAgICAgICAgIGFjYy50b3RhbEZpcnN0RG9zZSArPSBpdGVtLmZpcnN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgYWNjLnRvdGFsU2Vjb25kRG9zZSArPSBpdGVtLnNlY29uZF9kb3NlO1xuICAgICAgICAgICAgICAgIGFjYy50b3RhbFRoaXJkRG9zZSArPSBpdGVtLnRoaXJkX2Rvc2U7XG4gICAgICAgICAgICAgICAgYWNjLnRvdGFsTGFzdERvc2UgKz0gaXRlbS5sYXN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgIH0sIHt0b3RhbFBsYW5uZWQ6IDAsIHRvdGFsRmlyc3REb3NlOjAsIHRvdGFsU2Vjb25kRG9zZTowLCB0b3RhbFRoaXJkRG9zZTowLCB0b3RhbExhc3REb3NlOjB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjYWxjdWxhdGVDb3ZlcmFnZVJhdGUgPSBmdW5jdGlvbihkYXRhLCBwZXJpb2RMaXN0LCBkb3NlTnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZ2V0QWdncmVnYXRlcyhkYXRhLCBwZXJpb2RMaXN0KTtcbiAgICAgICAgICAgIHZhciBkb3NlVmFsdWUgPSByZXN1bHQudG90YWxMYXN0RG9zZTtcbiAgICAgICAgICAgIGlmIChkb3NlTnVtYmVyID09IDEpIGRvc2VWYWx1ZSA9IHJlc3VsdC50b3RhbEZpcnN0RG9zZTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGRvc2VOdW1iZXIgPT0gMikgZG9zZVZhbHVlID0gcmVzdWx0LnRvdGFsU2Vjb25kRG9zZTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGRvc2VOdW1iZXIgPT0gMykgZG9zZVZhbHVlID0gcmVzdWx0LnRvdGFsVGhpcmREb3NlO1xuICAgICAgICAgICAgcmV0dXJuIChkb3NlVmFsdWUgLyByZXN1bHQudG90YWxQbGFubmVkKSAqIDEwMDtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgY2FsY3VsYXRlRHJvcG91dFJhdGUgPSBmdW5jdGlvbihkYXRhLCBwZXJpb2RMaXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZ2V0QWdncmVnYXRlcyhkYXRhLCBwZXJpb2RMaXN0KTtcbiAgICAgICAgICAgIHJldHVybiAoKHJlc3VsdC50b3RhbEZpcnN0RG9zZSAtIHJlc3VsdC50b3RhbExhc3REb3NlKSAvIHJlc3VsdC50b3RhbEZpcnN0RG9zZSkgKiAxMDA7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGNhbGN1bGF0ZVJlZENhdGVnb3J5VmFsdWUgPSBmdW5jdGlvbihkYXRhLCBwZXJpb2RMaXN0KSB7XG4gICAgICAgICAgICB2YXIgciA9IGdldEFnZ3JlZ2F0ZXMoZGF0YSwgcGVyaW9kTGlzdCk7XG4gICAgICAgICAgICB2YXIgYWNjZXNzID0gKHIudG90YWxGaXJzdERvc2UgLyByLnRvdGFsUGxhbm5lZCkgKiAxMDA7XG4gICAgICAgICAgICB2YXIgZHJvcG91dFJhdGUgPSAoKHIudG90YWxGaXJzdERvc2UgLSByLnRvdGFsTGFzdERvc2UpIC8gci50b3RhbEZpcnN0RG9zZSkgKiAxMDA7XG5cbiAgICAgICAgICAgIGlmIChhY2Nlc3MgPj0gOTAgJiYgZHJvcG91dFJhdGUgPj0gMCAmJiBkcm9wb3V0UmF0ZSA8PSAxMCkgcmV0dXJuIDE7XG4gICAgICAgICAgICBlbHNlIGlmIChhY2Nlc3MgPj0gOTAgJiYgKGRyb3BvdXRSYXRlIDwgMCB8fCBkcm9wb3V0UmF0ZSA+IDEwKSkgcmV0dXJuIDI7XG4gICAgICAgICAgICBlbHNlIGlmIChhY2Nlc3MgPCA5MCAmJiBkcm9wb3V0UmF0ZSA+PSAwICYmIGRyb3BvdXRSYXRlIDw9IDEwKSByZXR1cm4gMztcbiAgICAgICAgICAgIGVsc2UgaWYgKGFjY2VzcyA8IDkwICYmIChkcm9wb3V0UmF0ZSA8IDAgfHwgZHJvcG91dFJhdGUgPiAxMCkpIHJldHVybiA0O1xuICAgICAgICAgICAgZWxzZSByZXR1cm4gMDtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0TGFzdFZhbHVlID0gZnVuY3Rpb24oZCwgZGVmYXVsdFZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoZCA9PSB1bmRlZmluZWQpIHJldHVybjtcbiAgICAgICAgICAgIGlmIChkZWZhdWx0VmFsdWUgaW4gZCkgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZCk7XG4gICAgICAgICAgICByZXR1cm4ga2V5c1trZXlzLmxlbmd0aC0xXTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0VmFsdWVzSW5SYW5nZSA9IGZ1bmN0aW9uKGRhdGEsIHN0YXJ0WWVhciwgc3RhcnRNb250aCwgZW5kWWVhciwgZW5kTW9udGgpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoeWVhckluZGV4IGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoeWVhckluZGV4IDwgc3RhcnRZZWFyIHx8IHllYXJJbmRleCA+IGVuZFllYXIpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgZm9yIChtb250aEluZGV4IGluIGRhdGFbeWVhckluZGV4XSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoeWVhckluZGV4ID09IHN0YXJ0WWVhciAmJiBtb250aEluZGV4IDwgc3RhcnRNb250aCkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh5ZWFySW5kZXggPT0gZW5kWWVhciAmJiBtb250aEluZGV4ID4gZW5kTW9udGgpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaChbeWVhckluZGV4LCBtb250aEluZGV4XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJjcmVhdGVEaXN0cmljdERhdGFNYXBcIjogY3JlYXRlRGlzdHJpY3REYXRhTWFwLFxuICAgICAgICAgICAgXCJnZXRQZXJpb2RMaXN0XCI6IGdldFBlcmlvZExpc3QsXG4gICAgICAgICAgICBcImNhbGN1bGF0ZUNvdmVyYWdlUmF0ZVwiOiBjYWxjdWxhdGVDb3ZlcmFnZVJhdGUsXG4gICAgICAgICAgICBcImNhbGN1bGF0ZURyb3BvdXRSYXRlXCI6IGNhbGN1bGF0ZURyb3BvdXRSYXRlLFxuICAgICAgICAgICAgXCJjYWxjdWxhdGVSZWRDYXRlZ29yeVZhbHVlXCI6IGNhbGN1bGF0ZVJlZENhdGVnb3J5VmFsdWVcbiAgICAgICAgfTtcbiAgICB9XG5dKVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ3NlcnZpY2VzJykuc2VydmljZSgnU3RvY2tTZXJ2aWNlJywgWyckaHR0cCcsXG4gICAgZnVuY3Rpb24oJGh0dHApIHtcbiAgICAgICAgdmFyIGhhbmRsZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRTdG9ja0J5RGlzdHJpY3QgPSBmdW5jdGlvbihzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2FwaS9zdG9jay9hdGhhbmRieWRpc3RyaWN0Jywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydE1vbnRoOiBzdGFydE1vbnRoLFxuICAgICAgICAgICAgICAgICAgICBlbmRNb250aDogZW5kTW9udGgsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZTogdmFjY2luZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgZ2V0VW5lcGlTdG9jayA9IGZ1bmN0aW9uKGVuZE1vbnRoLCBkaXN0cmljdCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnYXBpL3N0b2NrL2F0aGFuZGJ5ZGlzdHJpY3QnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIGVuZE1vbnRoOiBlbmRNb250aCxcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldFN0b2NrQnlNb250aCA9IGZ1bmN0aW9uKHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnYXBpL3N0b2NrL2F0aGFuZGJ5bW9udGgnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0TW9udGg6IHN0YXJ0TW9udGgsXG4gICAgICAgICAgICAgICAgICAgIGVuZE1vbnRoOiBlbmRNb250aCxcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lOiB2YWNjaW5lXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICAgICB2YXIgZ2V0U3RvY2tCeURpc3RyaWN0VmFjY2luZSA9IGZ1bmN0aW9uKHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9zdG9jay9zdG9ja2J5ZGlzdHJpY3R2YWNjaW5lJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydE1vbnRoOiBzdGFydE1vbnRoLFxuICAgICAgICAgICAgICAgICAgICBlbmRNb250aDogZW5kTW9udGgsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZTogdmFjY2luZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICAgIHZhciBnZXRTdG9ja2VkT3V0ID0gZnVuY3Rpb24oc3RhcnRNb250aCwgZW5kTW9udGgsIGRpc3RyaWN0LCB2YWNjaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3N0b2NrZWRvdXQnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0TW9udGg6IHN0YXJ0TW9udGgsXG4gICAgICAgICAgICAgICAgICAgIGVuZE1vbnRoOiBlbmRNb250aCxcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lOiB2YWNjaW5lXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBnZXRTdG9ja01vbnRoc0xlZnQgPSBmdW5jdGlvbihkaXN0cmljdCwgdmFjY2luZSkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnYXBpL3N0b2NrL3N0b2NrbW9udGhzbGVmdCcsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lOiB2YWNjaW5lXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBcImdldFN0b2NrQnlEaXN0cmljdFwiOiBnZXRTdG9ja0J5RGlzdHJpY3QsXG4gICAgICAgICAgICBcImdldFN0b2NrQnlNb250aFwiOiBnZXRTdG9ja0J5TW9udGgsXG4gICAgICAgICAgICBcImdldFN0b2NrTW9udGhzTGVmdFwiOiBnZXRTdG9ja01vbnRoc0xlZnQsXG4gICAgICAgICAgICBcImdldFN0b2NrQnlEaXN0cmljdFZhY2NpbmVcIjogZ2V0U3RvY2tCeURpc3RyaWN0VmFjY2luZSxcbiAgICAgICAgICAgIFwiZ2V0U3RvY2tlZE91dFwiOiBnZXRTdG9ja2VkT3V0LFxuICAgICAgICAgICAgXCJnZXRVbmVwaVN0b2NrXCI6Z2V0VW5lcGlTdG9ja1xuICAgICAgICB9O1xuICAgIH1cbl0pXG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJykuY29udHJvbGxlcignQW5udWFsQ292ZXJhZ2VDb250cm9sbGVyJywgQW5udWFsQ292ZXJhZ2VDb250cm9sbGVyKTtcblxuQW5udWFsQ292ZXJhZ2VDb250cm9sbGVyLiRpbmplY3QgPSBbXG4gICAgJyRzY29wZScsXG4gICAgJ0NvdmVyYWdlU2VydmljZScsXG4gICAgJ0NvdmVyYWdlQ2FsY3VsYXRvcicsXG4gICAgJ0NoYXJ0UERGRXhwb3J0JyxcbiAgICAnJHRpbWVvdXQnXG5dO1xuZnVuY3Rpb24gQW5udWFsQ292ZXJhZ2VDb250cm9sbGVyKCRzY29wZSwgQ292ZXJhZ2VTZXJ2aWNlLCBDb3ZlcmFnZUNhbGN1bGF0b3IsIENoYXJ0UERGRXhwb3J0LCAkdGltZW91dCkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgJHNjb3BlLiRvbigncmVmcmVzaENvdmVyYWdlMycsIHVwZGF0ZUNoYXJ0KTtcblxuICAgIHZtLmNoYXJ0T3B0aW9ucyA9IGdldENoYXJ0T3B0aW9ucygpO1xuICAgIHZtLmNoYXJ0RGF0YSA9IFtdO1xuICAgIHZtLnllYXJJbmRleGVzID0gW107XG4gICAgdm0uZXhwb3J0UERGID0gQ2hhcnRQREZFeHBvcnQuZXhwb3J0O1xuICAgIHZtLmluaXRMYWJlbHMgPSBpbml0TGFiZWxzO1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlQ2hhcnQoZSwgcGFyYW1zKSB7XG4gICAgICAgIHZhciBhbnRpZ2VuTGFiZWwgPSBwYXJhbXMuYW50aWdlbiA9PSAnQUxMJyA/ICdBbnRpZ2VucycgOiBwYXJhbXMuYW50aWdlbjtcbiAgICAgICAgdmFyIHllYXJQZXJpb2QgPSBwYXJhbXMuc3RhcnRZZWFyID09IHBhcmFtcy5lbmRZZWFyXG4gICAgICAgICAgICA/IHBhcmFtcy5zdGFydFllYXIgOiBgJHtwYXJhbXMuc3RhcnRZZWFyfSAtICR7cGFyYW1zLmVuZFllYXJ9YDtcbiAgICAgICAgdm0uY2hhcnRUaXRsZSA9IGAke2FudGlnZW5MYWJlbH0gQ292ZXJhZ2UgZm9yICR7eWVhclBlcmlvZH1gO1xuICAgICAgICBjbGVhckxhYmVscygpO1xuXG4gICAgICAgIENvdmVyYWdlU2VydmljZS5nZXRWYWNjaW5lRG9zZXNCeVBlcmlvZChwYXJhbXMpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgLyogQWdncmVnYXRlIHRoZSBkYXRhIGJhc2VkIG9uIHBlcmlvZCAqL1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGRhdGEucmVkdWNlKGZ1bmN0aW9uKGFjYywgaXRlbSkge1xuICAgICAgICAgICAgICAgIHZhciB2YWNjaW5lID0gaXRlbS52YWNjaW5lX19uYW1lO1xuICAgICAgICAgICAgICAgIHZhciB5ZWFyID0gaXRlbS5wZXJpb2QudG9TdHJpbmcoKS5zdWJzdHIoMCw0KTtcbiAgICAgICAgICAgICAgICBpZiAodm0ueWVhckluZGV4ZXMuaW5kZXhPZih5ZWFyKSA9PSAtMSkgdm0ueWVhckluZGV4ZXMucHVzaCh5ZWFyKTtcbiAgICAgICAgICAgICAgICBpZiAoISAodmFjY2luZSBpbiBhY2MpKSBhY2NbdmFjY2luZV0gPSB7fTtcbiAgICAgICAgICAgICAgICBpZiAoISAoeWVhciBpbiBhY2NbdmFjY2luZV0pKVxuICAgICAgICAgICAgICAgICAgICBhY2NbdmFjY2luZV1beWVhcl0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbEFjdHVhbDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsRmlyc3REb3NlOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxMYXN0RG9zZTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsUGxhbm5lZDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsU2Vjb25kRG9zZTogMFxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgYWNjW3ZhY2NpbmVdW3llYXJdLnRvdGFsQWN0dWFsICs9IGl0ZW0udG90YWxfYWN0dWFsO1xuICAgICAgICAgICAgICAgIGFjY1t2YWNjaW5lXVt5ZWFyXS50b3RhbEZpcnN0RG9zZSArPSBpdGVtLnRvdGFsX2ZpcnN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgYWNjW3ZhY2NpbmVdW3llYXJdLnRvdGFsTGFzdERvc2UgKz0gaXRlbS50b3RhbF9sYXN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgYWNjW3ZhY2NpbmVdW3llYXJdLnRvdGFsUGxhbm5lZCArPSBpdGVtLnRvdGFsX3BsYW5uZWQ7XG4gICAgICAgICAgICAgICAgYWNjW3ZhY2NpbmVdW3llYXJdLnRvdGFsU2Vjb25kRG9zZSArPSBpdGVtLnRvdGFsX3NlY29uZF9kb3NlO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgIH0sIHt9KTtcblxuICAgICAgICAgICAgLyogQ2FsY3VsYXRlIFJhdGVzIGZvciB0aGUgcmVzdWx0cyAqL1xuICAgICAgICAgICAgdmFyIGNoYXJ0RGF0YSA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgdmFjY2luZSBpbiByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFjY2luZURhdGEgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB5ZWFyIGluIHJlc3VsdFt2YWNjaW5lXSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY292ZXJhZ2VSYXRlID0gQ292ZXJhZ2VDYWxjdWxhdG9yLmNhbGN1bGF0ZUNvdmVyYWdlUmF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFt2YWNjaW5lXVt5ZWFyXS50b3RhbExhc3REb3NlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W3ZhY2NpbmVdW3llYXJdLnRvdGFsUGxhbm5lZFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaSA9IHZtLnllYXJJbmRleGVzLmluZGV4T2YoeWVhcik7XG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmVEYXRhLnB1c2goe3g6IGksIHk6IGNvdmVyYWdlUmF0ZX0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNoYXJ0RGF0YS5wdXNoKHtrZXk6IHZhY2NpbmUsIHZhbHVlczogdmFjY2luZURhdGF9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdm0uY2hhcnREYXRhID0gY2hhcnREYXRhO1xuICAgICAgICAgICAgLy8gJHRpbWVvdXQoZnVuY3Rpb24oKSB7KCk7IH0sIDIwMDApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRDaGFydE9wdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdtdWx0aUJhckNoYXJ0JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDQ1MCxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjUwLFxuICAgICAgICAgICAgICAgIHN0YWNrZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNob3dDb250cm9sczogZmFsc2UsXG4gICAgICAgICAgICAgICAgZ3JvdXBTcGFjaW5nOiAwLjIsXG4gICAgICAgICAgICAgICAgLy8gdXNlSW50ZXJhY3RpdmVHdWlkZWxpbmU6IHRydWUsXG4gICAgICAgICAgICAgICAgaW50ZXJhY3RpdmVMYXllcjoge2dyYXZpdHk6ICdzJ30sXG4gICAgICAgICAgICAgICAgeDogZnVuY3Rpb24oZCl7IHJldHVybiBkLng7IH0sXG4gICAgICAgICAgICAgICAgeTogZnVuY3Rpb24oZCl7IHJldHVybiBkLnk7IH0sXG4gICAgICAgICAgICAgICAgZm9yY2VZOiBbMCwxMTBdLFxuICAgICAgICAgICAgICAgIHhBeGlzOiB7XG4gICAgICAgICAgICAgICAgICAgIGF4aXNMYWJlbDogJ1llYXJzJyxcbiAgICAgICAgICAgICAgICAgICAgdGlja0Zvcm1hdDogZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm0ueWVhckluZGV4ZXNbZF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHlBeGlzOiB7XG4gICAgICAgICAgICAgICAgICAgIGF4aXNMYWJlbDogJ0NvdmVyYWdlIFJhdGUgKCUpJyxcbiAgICAgICAgICAgICAgICAgICAgdGlja3M6IDEwXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkaXNwYXRjaDoge1xuICAgICAgICAgICAgICAgICAgICByZW5kZXJFbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdExhYmVscygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXRMYWJlbHMoKSB7XG4gICAgICAgIC8vIFlvdSBuZWVkIHRvIGFwcGx5IHRoaXMgb25jZSBhbGwgdGhlIGFuaW1hdGlvbnMgYXJlIGFscmVhZHkgZmluaXNoZWQuIE90aGVyd2lzZSBsYWJlbHMgd2lsbCBiZSBwbGFjZWQgd3JvbmdseS5cbiAgICAgICAgZDMuc2VsZWN0QWxsKCcubnYtbXVsdGliYXIgLm52LWdyb3VwJykuZWFjaChmdW5jdGlvbihncm91cCl7XG4gICAgICAgICAgdmFyIGcgPSBkMy5zZWxlY3QodGhpcyk7XG5cbiAgICAgICAgICAvLyBSZW1vdmUgcHJldmlvdXMgbGFiZWxzIGlmIHRoZXJlIGlzIGFueVxuICAgICAgICAgIGcuc2VsZWN0QWxsKCd0ZXh0JykucmVtb3ZlKCk7XG4gICAgICAgICAgZy5zZWxlY3RBbGwoJy5udi1iYXInKS5lYWNoKGZ1bmN0aW9uKGJhcil7XG4gICAgICAgICAgICB2YXIgYiA9IGQzLnNlbGVjdCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYXJXaWR0aCA9IGIuYXR0cignd2lkdGgnKTtcbiAgICAgICAgICAgIHZhciBiYXJIZWlnaHQgPSBiLmF0dHIoJ2hlaWdodCcpO1xuXG4gICAgICAgICAgICBnLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgICAgIC8vIFRyYW5zZm9ybXMgc2hpZnQgdGhlIG9yaWdpbiBwb2ludCB0aGVuIHRoZSB4IGFuZCB5IG9mIHRoZSBiYXJcbiAgICAgICAgICAgICAgLy8gaXMgYWx0ZXJlZCBieSB0aGlzIHRyYW5zZm9ybS4gSW4gb3JkZXIgdG8gYWxpZ24gdGhlIGxhYmVsc1xuICAgICAgICAgICAgICAvLyB3ZSBuZWVkIHRvIGFwcGx5IHRoaXMgdHJhbnNmb3JtIHRvIHRob3NlLlxuICAgICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYi5hdHRyKCd0cmFuc2Zvcm0nKSlcbiAgICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvLyBUd28gZGVjaW1hbHMgZm9ybWF0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoYmFyLnkpLnRvRml4ZWQoMCkgKyBcIiVcIjtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3knLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8vIENlbnRlciBsYWJlbCB2ZXJ0aWNhbGx5XG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IHRoaXMuZ2V0QkJveCgpLmhlaWdodDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChiLmF0dHIoJ3knKSkgLSAxMDsgLy8gMTAgaXMgdGhlIGxhYmVsJ3MgbWFnaW4gZnJvbSB0aGUgYmFyXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvLyBDZW50ZXIgbGFiZWwgaG9yaXpvbnRhbGx5XG4gICAgICAgICAgICAgICAgdmFyIHdpZHRoID0gdGhpcy5nZXRCQm94KCkud2lkdGg7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoYi5hdHRyKCd4JykpICsgKHBhcnNlRmxvYXQoYmFyV2lkdGgpIC8gMikgLSAod2lkdGggLyAyKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2Jhci12YWx1ZXMnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJMYWJlbHMoKSB7XG4gICAgICAgIGQzLnNlbGVjdEFsbCgnLm52LW11bHRpYmFyIC5udi1ncm91cCcpLmVhY2goZnVuY3Rpb24oZ3JvdXApe1xuICAgICAgICAgIHZhciBnID0gZDMuc2VsZWN0KHRoaXMpO1xuICAgICAgICAgIC8vIFJlbW92ZSBwcmV2aW91cyBsYWJlbHMgaWYgdGhlcmUgaXMgYW55XG4gICAgICAgICAgZy5zZWxlY3RBbGwoJ3RleHQnKS5yZW1vdmUoKTtcbiAgICAgIH0pO1xuICAgIH1cbn1cbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKVxuICAgIC5jb250cm9sbGVyKCdDb3ZlcmFnZUNvbnRyb2xsZXInLCBbXG4gICAgICAgICckc2NvcGUnLCckbG9jYXRpb24nLCAnU3RvY2tTZXJ2aWNlJywgJyRyb290U2NvcGUnLCAnTmdUYWJsZVBhcmFtcycsXG4gICAgICAgICdGaWx0ZXJTZXJ2aWNlJywgJ01vbnRoU2VydmljZScsICdDb3ZlcmFnZVNlcnZpY2UnLCAnTWFwU3VwcG9ydFNlcnZpY2UnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwkbG9jYXRpb24sIFN0b2NrU2VydmljZSwgJHJvb3RTY29wZSwgTmdUYWJsZVBhcmFtcyxcbiAgICAgICAgRmlsdGVyU2VydmljZSwgTW9udGhTZXJ2aWNlLCBDb3ZlcmFnZVNlcnZpY2UsIE1hcFN1cHBvcnRTZXJ2aWNlKVxuICAgIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdmFyIHNoZWxsU2NvcGUgPSAkc2NvcGUuJHBhcmVudDtcbiAgICAgICAgc2hlbGxTY29wZS5jaGlsZCA9ICRzY29wZTtcbiAgICAgICAgdm0ucGF0aCA9ICRsb2NhdGlvbi5wYXRoKCk7XG4gICAgICAgIHZtLmVuZHR4dD1cIlwiO1xuICAgICAgICB2bS5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdm0uYWN0aXZlUmVwb3J0VG9nZ2xlID0gXCJBQ1lcIjtcbiAgICAgICAgdm0uYWN0aXZlUmVwb3J0WWVhciA9IFwiQ1lcIjtcbiAgICAgICAgdm0uYWN0aXZlRGlzdHJpY3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHZtLnNhbXBsZURpc3RyaWN0RGF0YSA9IHt9O1xuXG4gICAgICAgICRzY29wZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uKHZpZXdMb2NhdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHZpZXdMb2NhdGlvbiA9PT0gJGxvY2F0aW9uLnBhdGgoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBwZXJpb2REaXNwbGF5KHBlcmlvZClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHBlcmlvZCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBtb250aCA9IHBhcnNlSW50KHBlcmlvZC5zbGljZSg0LDYpKTtcbiAgICAgICAgICAgIHJldHVybiBNb250aFNlcnZpY2UuZ2V0TW9udGhOYW1lKG1vbnRoKSArIFwiIFwiICsgcGVyaW9kLnNsaWNlKDAsNClcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS51cGRhdGVSZXBvcnRUb2dnbGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdm0uYWN0aXZlUmVwb3J0VG9nZ2xlID0gdmFsdWU7XG4gICAgICAgICAgICB2bS5hY3RpdmVSZXBvcnRZZWFyID0gdm0uYWN0aXZlUmVwb3J0VG9nZ2xlLnN1YnN0cigxLDIpO1xuICAgICAgICAgICAgdm0udXBkYXRlTWFwV2l0aFZhY2NpbmUodm0uYWN0aXZlVmFjY2luZSk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7d2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdyZXNpemUnKSl9LCAzMDAwKTtcblxuICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5jaGFydFRpdGxlID0gdm0uZ2V0Q2hhcnRUaXRsZSh2bS5zZWxlY3RlZEFudGlnZW4pO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5pc0FjdGl2ZVJlcG9ydFRvZ2dsZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdm0uYWN0aXZlUmVwb3J0VG9nZ2xlID09IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdm0uZ2V0VmFjY2luZURvc2VzID0gZnVuY3Rpb24oZW5kWWVhciwgdmFjY2luZSwgZGlzdHJpY3QpIHtcbiAgICAgICAgICAgIC8vICQoJyNzcGlubmVyLW1vZGFsJykubW9kYWwoJ3Nob3cnKTtcblxuICAgICAgICAgICAgLy8gdm0uZW5kTW9udGg9cGVyaW9kO1xuXG4gICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmhpZGVNYXAgPSB0cnVlO1xuICAgICAgICAgICAgLy8gaWYgKGRpc3RyaWN0ICE9IHVuZGVmaW5lZCAmJiBkaXN0cmljdCAhPSBcIk5hdGlvbmFsXCIpIHtcbiAgICAgICAgICAgIC8vICAgICBzaGVsbFNjb3BlLmNoaWxkLm1hcFBsYWNlaG9sZGVyTWVzc2FnZSA9IFwiTm8gbWFwIGF2YWlsYWJsZS5cIjtcbiAgICAgICAgICAgIC8vICAgICByZXR1cm47XG4gICAgICAgICAgICAvLyB9XG5cblxuICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5tYXBQbGFjZWhvbGRlck1lc3NhZ2UgPSBcIk1hcCBsb2FkaW5nLiBQbGVhc2Ugd2FpdC4uLlwiO1xuXG4gICAgICAgICAgICAvL1RvZG86IFRlbXBvcmFyaWx5IGRpc2FibGUgZmlsdGVyaW5nIGJ5IGRpc3RyaWN0IGZvciB0aGUgdGFibGVcbiAgICAgICAgICAgIGRpc3RyaWN0ID0gXCJcIlxuICAgICAgICAgICAgdm0uZGlzdHJpY3QgPSBkaXN0cmljdDtcbiAgICAgICAgICAgIHZtLnZhY2NpbmUgPSB2YWNjaW5lOy8vdm0uc2VsZWN0ZWRWYWNjaW5lID8gdm0uc2VsZWN0ZWRWYWNjaW5lLm5hbWUgOiBcInZhXCI7XG4gICAgICAgICAgICB2bS5hY3RpdmVWYWNjaW5lID0gdmFjY2luZTtcblxuICAgICAgICAgICAgaWYgKHZhY2NpbmUgPT0gXCJEUFRcIiB8fCB2YWNjaW5lID09IFwiQUxMXCIpIHtcbiAgICAgICAgICAgICAgICB2bS5hY3RpdmVWYWNjaW5lID0gXCJQRU5UQVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBc3NpZ24gZGltZW5zaW9ucyBmb3IgbWFwIGNvbnRhaW5lclxuICAgICAgICAgICAgdmFyIHdpZHRoID0gNTAwLFxuICAgICAgICAgICAgICAgIGhlaWdodCA9IDUwMDtcbiAgICAgICAgICAgIHZhciBmaWVsZCA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgZG9zZTEgPSBcIlwiO1xuXG4gICAgICAgICAgICB2YXIgaW50ZXJwb2xhdGVGdW5jdGlvbjtcblxuICAgICAgICAgICAgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL3JlZGNhdGVnb3J5XCIpe1xuICAgICAgICAgICAgICAgIGludGVycG9sYXRlRnVuY3Rpb24gPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgPSAodCAqIDEwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodCA9PSAwICkgcmV0dXJuICdMaWdodEdyYXknO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQgPT0gMSkgcmV0dXJuICdEYXJrR3JlZW4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQgPT0gMikgcmV0dXJuICdZZWxsb3cnO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQgPT0gMykgcmV0dXJuICdPcmFuZ2UnO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQgPT0gNCkgcmV0dXJuICdSZWQnO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL2Ryb3BvdXRyYXRlXCIpe1xuICAgICAgICAgICAgICAgIGludGVycG9sYXRlRnVuY3Rpb24gPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ID0gdCAqIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ID09IDAgKSByZXR1cm4gJ0xpZ2h0R3JheSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHQgPj0gMCkgJiYgKHQgPD0gMTApKSByZXR1cm4gJ0dyZWVuJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgodCA+PSAtMTAgJiYgdCA8IDApIHx8ICh0ID4gMTAgJiYgdCA8PSAyMCkpIHJldHVybiAnWWVsbG93JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgodCA8IC0xMCkgfHwgKHQgPiAyMCkpIHJldHVybiAnUmVkJztcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbnRlcnBvbGF0ZUZ1bmN0aW9uID0gZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdCA9IHQgKiAxMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodCA9PSAwKSByZXR1cm4gJ0xpZ2h0R3JheSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodCA8IDUwKSByZXR1cm4gJ1JlZCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodD49IDUwICYmIHQ8OTApIHJldHVybiAnWWVsbG93JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ID49IDkwKSByZXR1cm4gJ0RhcmtHcmVlbic7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjb2xvciA9IGQzLnNjYWxlLmxpbmVhcigpXG4gICAgICAgICAgICAgICAgLmRvbWFpbihbMCwgMTAwXSlcbiAgICAgICAgICAgICAgICAuaW50ZXJwb2xhdGUoaW50ZXJwb2xhdGVGdW5jdGlvbik7XG5cbiAgICAgICAgICAgIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9kcm9wb3V0cmF0ZVwiKXtcbiAgICAgICAgICAgICAgICBmaWVsZD1cImRyb3Bfb3V0X3JhdGVcIjtcbiAgICAgICAgICAgICAgICB2bS5lbmR0eHQ9XCIlXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsc2UgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL2NvdmVyYWdlXCIpe1xuICAgICAgICAgICAgICAgIGZpZWxkPVwiY292ZXJhZ2VfcmF0ZVwiO1xuICAgICAgICAgICAgICAgIHZtLmVuZHR4dD1cIiVcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9zZTEgPSBcIkxPV1wiICsgXCIuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlwiKyBcIkhJR0hcIjtcblxuICAgICAgICAgICAgaWYgKHZhY2NpbmU9PVwiUEVOVEFcIil7XG4gICAgICAgICAgICAgICAgdm0udmFjY2luZT1cIkRQVDNcIjtcbiAgICAgICAgICAgICAgICB2bS52YWNkb3NlPVwiRFBUMS1EUFQzXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh2YWNjaW5lPT1cIlBDVlwiKXtcbiAgICAgICAgICAgICAgICB2bS52YWNjaW5lPVwiUENWM1wiO1xuICAgICAgICAgICAgICAgIHZtLnZhY2Rvc2U9XCJQQ1YxLVBDVjNcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHZhY2NpbmU9PVwiQkNHXCIpe1xuICAgICAgICAgICAgICAgIHZtLnZhY2NpbmU9XCJCQ0dcIjtcbiAgICAgICAgICAgICAgICB2bS52YWNkb3NlPVwiQkNHLU1FQVNMRVNcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHZhY2NpbmU9PVwiT1BWXCIpe1xuICAgICAgICAgICAgICAgIHZtLnZhY2NpbmU9XCJPUFYzXCI7XG4gICAgICAgICAgICAgICAgdm0udmFjZG9zZT1cIk9QVjAtT1BWM1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodmFjY2luZT09XCJIUFZcIil7XG4gICAgICAgICAgICAgICAgdm0udmFjY2luZT1cIkhQVjJcIjtcbiAgICAgICAgICAgICAgICB2bS52YWNkb3NlPVwiSFBWMS1IUFYyXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAgZWxzZSBpZiAodmFjY2luZT09XCJNRUFTTEVTXCIpe1xuICAgICAgICAgICAgICAgIHZtLnZhY2NpbmU9XCJNRUFTTEVTXCI7XG4gICAgICAgICAgICAgICAgdm0udmFjZG9zZT1cIkJDRy1NRUFTTEVTXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh2YWNjaW5lPT1cIlRUXCIpe1xuICAgICAgICAgICAgICAgIHZtLnZhY2NpbmU9XCJUVDJcIjtcbiAgICAgICAgICAgICAgICB2bS52YWNkb3NlPVwiVFQxLVRUMlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5wZXJpb2RNb250aCA9IHBlcmlvZERpc3BsYXkodm0uZW5kTW9udGgpO1xuXG4gICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnRoZWRvc2UgPSB2bS52YWNjaW5lO1xuICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC50aGV2YWNkb3NlID0gdm0udmFjZG9zZTtcblxuXG4gICAgICAgICAgICB2YXIgdmFsdWVGb3JtYXQgPSBkMy5mb3JtYXQoXCIsXCIpO1xuXG4gICAgICAgICAgICAvLyBEZWZpbmUgYSBnZW9ncmFwaGljYWwgcHJvamVjdGlvblxuICAgICAgICAgICAgLy8gQWxzbywgc2V0IGluaXRpYWwgem9vbSB0byBzaG93IHRoZSBmZWF0dXJlc1xuICAgICAgICAgICAgdmFyIHByb2plY3Rpb25cdD0gZDMuZ2VvLm1lcmNhdG9yKClcbiAgICAgICAgICAgICAgICAuc2NhbGUoMSk7XG5cbiAgICAgICAgICAgIC8vIFByZXBhcmUgYSBwYXRoIG9iamVjdCBhbmQgYXBwbHkgdGhlIHByb2plY3Rpb24gdG8gaXRcbiAgICAgICAgICAgIHZhciBwYXRoID0gZDMuZ2VvLnBhdGgoKVxuICAgICAgICAgICAgICAgIC5wcm9qZWN0aW9uKHByb2plY3Rpb24pO1xuXG4gICAgICAgICAgICAvLyBXZSBwcmVwYXJlIGFuIG9iamVjdCB0byBsYXRlciBoYXZlIGVhc2llciBhY2Nlc3MgdG8gdGhlIGRhdGEuXG4gICAgICAgICAgICB2YXIgZGF0YUJ5SWQgPSBkMy5tYXAoKTtcblxuICAgICAgICAgICAgLy9EZWZpbmUgcXVhbnRpemUgc2NhbGUgdG8gc29ydCBkYXRhIHZhbHVlcyBpbnRvIGJ1Y2tldHMgb2YgY29sb3JcbiAgICAgICAgICAgIC8vQ29sb3JzIGJ5IEN5bnRoaWEgQnJld2VyIChjb2xvcmJyZXdlcjIub3JnKSwgOS1jbGFzcyBZbEduQnVcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLnJhbmdlKGQzLnJhbmdlKDkpLG1hcChmdW5jdGlvbihpKSB7IHJldHVybiAncScgKyBpICsgJy05Jzt9KSk7XG5cblxuICAgICAgICAgICAgLy8gQ292ZXJhZ2VTZXJ2aWNlLmdldFZhY2NpbmVEb3NlcyhwZXJpb2QsIHZhY2NpbmUpXG4gICAgICAgICAgICB2YXIgcGFyYW1zID0ge1xuICAgICAgICAgICAgICAgIGVuZFllYXI6IGVuZFllYXIsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdtYXAnXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBDb3ZlcmFnZVNlcnZpY2UuZ2V0VmFjY2luZURvc2VzQnlQZXJpb2QocGFyYW1zKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFEaXN0cmljdE1hcCA9IE1hcFN1cHBvcnRTZXJ2aWNlLmNyZWF0ZURpc3RyaWN0RGF0YU1hcChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdm0uc2FtcGxlRGlzdHJpY3REYXRhID0gZGF0YURpc3RyaWN0TWFwW09iamVjdC5rZXlzKGRhdGFEaXN0cmljdE1hcClbMF1dO1xuICAgICAgICAgICAgICAgICAgICAvLyB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIG1hcHMgdGhlIGRhdGEgb2YgdGhlIENTViBzbyBpdCBjYW4gYmUgZWFzaWx5IGFjY2Vzc2VkIGJ5XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBJRCBvZiB0aGUgZGlzdHJpY3QsIGZvciBleGFtcGxlOiBkYXRhQnlJZFsyMTk2XVxuICAgICAgICAgICAgICAgICAgICBkYXRhQnlJZCA9IGQzLm5lc3QoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmtleShmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5pZDsgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yb2xsdXAoZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGRbMF07IH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIExvYWQgZmVhdHVyZXMgZnJvbSBHZW9KU09OXG4gICAgICAgICAgICAgICAgICAgIGQzLmpzb24oJ3N0YXRpYy9hcHAvY29tcG9uZW50cy9jb3ZlcmFnZS9kYXRhL3VnX2Rpc3RyaWN0czIuZ2VvanNvbicsIGZ1bmN0aW9uIChlcnJvciwganNvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjYWxlQ2VudGVyID0gY2FsY3VsYXRlU2NhbGVDZW50ZXIoanNvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uLnNjYWxlKHNjYWxlQ2VudGVyLnNjYWxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jZW50ZXIoc2NhbGVDZW50ZXIuY2VudGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmFuc2xhdGUoW3dpZHRoIC8gMiwgaGVpZ2h0IC8gMl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBkaXN0IGluIGRhdGFEaXN0cmljdE1hcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3MgPSBkaXN0LmluZGV4T2YoXCIgXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhRGlzdHJpY3QgPSBkaXN0LnN1YnN0cmluZygwLCBwb3MpLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGpzb24uZmVhdHVyZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGpzb25EaXN0cmljdCA9IGpzb24uZmVhdHVyZXNbal0ucHJvcGVydGllcy5kaXN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YURpc3RyaWN0ID09IGpzb25EaXN0cmljdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbi5mZWF0dXJlc1tqXS5wcm9wZXJ0aWVzLmZpZWxkID0gZGF0YURpc3RyaWN0TWFwW2Rpc3RdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiNtYXBcIikuc2VsZWN0QWxsKFwiKlwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdmcgPSBkMy5zZWxlY3QoXCIjbWFwXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdmZWF0dXJlcycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzdmcuc2VsZWN0QWxsKFwicGF0aFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kYXRhKGpzb24uZmVhdHVyZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmVudGVyKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBwYXRoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBob3Zlcm9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGhvdmVyb3V0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgXCIjNzc3XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS51cGRhdGVNYXBXaXRoVmFjY2luZSh2bS5hY3RpdmVWYWNjaW5lKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5oaWRlTWFwID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLiRhcHBseSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBob3Zlcm9uID0gZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b29sdGlwJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUubGVmdCA9IGV2ZW50LnBhZ2VYICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS50b3AgPSBldmVudC5wYWdlWSArICdweCc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcImZpbGxcIiwgXCJ3aGl0ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiN0b29sdGlwXCIpLnN0eWxlKFwib3BhY2l0eVwiLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiN0b29sdGlwIC5uYW1lXCIpLnRleHQoZC5wcm9wZXJ0aWVzLmRpc3QpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QoXCIjdG9vbHRpcCAudmFsdWVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGV4dCAoZDMuZm9ybWF0KCcuMDFmJykodm0uZ2V0RGlzdHJpY3RWYWx1ZShkKSkrIHZtLmVuZHR4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgaG92ZXJvdXQgPSBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIHZtLmdldEZpbGxDb2xvcik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiN0b29sdGlwXCIpLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZtLmRyYXdMZWdlbmQgPSBmdW5jdGlvbihjb2xvckNvdW50cykge1xuICAgICAgICAgICAgICAgIC8vIFNldHVwIExlZ2VuZFxuICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiNnZW5kXCIpLnNlbGVjdEFsbChcIipcIikucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgdmFyIGxlZ2VuZFN2ZyA9IGQzLnNlbGVjdCgnI2dlbmQnKS5hcHBlbmQoJ3N2ZycpO1xuXG4gICAgICAgICAgICAgICAgbGVnZW5kU3ZnLmFwcGVuZChcImdcIilcbiAgICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJsZWdlbmRRdWFudFwiKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMjAsMjApXCIpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGxlZ2VuZCA9IGQzLmxlZ2VuZC5jb2xvcigpXG4gICAgICAgICAgICAgICAgICAubGFiZWxGb3JtYXQoZDMuZm9ybWF0KFwiLjJmXCIpKVxuICAgICAgICAgICAgICAgICAgLnNoYXBlV2lkdGgoNDApXG4gICAgICAgICAgICAgICAgICAuc2hhcGVIZWlnaHQoMjApO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL3JlZGNhdGVnb3J5XCIpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgZ2V0TGFiZWwgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgdG90YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwZXJjZW50YWdlID0gKHZhbHVlL3RvdGFsKSAqIDEwMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWUgKyAnICgnK3ZhbHVlKycpICgnICsgcGVyY2VudGFnZS50b0ZpeGVkKCkgKyAnJSknO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0b3RhbHMgPSBjb2xvckNvdW50cy5MaWdodEdyYXkgKyBjb2xvckNvdW50cy5EYXJrR3JlZW4gK1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3JDb3VudHMuWWVsbG93ICsgY29sb3JDb3VudHMuT3JhbmdlICsgY29sb3JDb3VudHMuUmVkO1xuXG4gICAgICAgICAgICAgICAgICAgIGxlZ2VuZC5jZWxscyhbMCwgMSwgMiwgMywgNF0pXG4gICAgICAgICAgICAgICAgICAgICAgICAubGFiZWxzKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRMYWJlbCgnTm8gZGF0YScsIGNvbG9yQ291bnRzLkxpZ2h0R3JheSwgdG90YWxzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRMYWJlbCgnQ0FUMScsIGNvbG9yQ291bnRzLkRhcmtHcmVlbiwgdG90YWxzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRMYWJlbCgnQ0FUMicsIGNvbG9yQ291bnRzLlllbGxvdywgdG90YWxzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRMYWJlbCgnQ0FUMycsIGNvbG9yQ291bnRzLk9yYW5nZSwgdG90YWxzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRMYWJlbCgnQ0FUNCcsIGNvbG9yQ291bnRzLlJlZCwgdG90YWxzKVxuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9kcm9wb3V0cmF0ZVwiKXtcbiAgICAgICAgICAgICAgICAgICAgbGVnZW5kLmNlbGxzKFswLCAzMCwgMTUsIDVdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmxhYmVscyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ05vIGRhdGEgKCcrY29sb3JDb3VudHMuTGlnaHRHcmF5KycpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC0xMCAmID4yMCAoJytjb2xvckNvdW50cy5SZWQrJyknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcoLTEwLTApICYgKDEwLTIwKSAoJytjb2xvckNvdW50cy5ZZWxsb3crJyknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcwLTEwICgnK2NvbG9yQ291bnRzLkRhcmtHcmVlbisnKSdcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZ2VuZC5jZWxscyg0KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmxhYmVscyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ05vIGRhdGEgKCcrY29sb3JDb3VudHMuTGlnaHRHcmF5KycpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPDUwJSAoJytjb2xvckNvdW50cy5SZWQrJyknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc1MC04OSUgKCcrY29sb3JDb3VudHMuWWVsbG93KycpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPj05MCUgKCcrY29sb3JDb3VudHMuRGFya0dyZWVuKycpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGVnZW5kLnNjYWxlKGNvbG9yKTtcblxuICAgICAgICAgICAgICAgIGxlZ2VuZFN2Zy5zZWxlY3QoXCIubGVnZW5kUXVhbnRcIilcbiAgICAgICAgICAgICAgICAgIC5jYWxsKGxlZ2VuZCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2bS5nZXRNYXBUaXRsZSA9IGZ1bmN0aW9uKHZhY2NpbmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZHVyYXRpb24gPSB2bS5hY3RpdmVSZXBvcnRUb2dnbGVbMF0gPT0gJ0EnID8gXCJBbm51YWxpemVkXCIgOiBcIk1vbnRobHlcIjtcbiAgICAgICAgICAgICAgICB2YXIgcGVyaW9kID0gdm0uZ2V0TGFzdE1hcFBlcmlvZCgpO1xuICAgICAgICAgICAgICAgIHZhciBmdWxsUGVyaW9kID0gYXBwSGVscGVycy5nZW5lcmF0ZUZ1bGxMYWJlbEZyb21QZXJpb2QocGVyaW9kWzBdK3BlcmlvZFsxXSk7XG4gICAgICAgICAgICAgICAgdmFyIGFudGlnZW5MYWJlbCA9IHZtLmFjdGl2ZURvc2UgIT0gdW5kZWZpbmVkID8gdm0uYWN0aXZlRG9zZSA6IHZhY2NpbmU7XG5cbiAgICAgICAgICAgICAgICB2YXIgdGFiID0gXCJDb3ZlcmFnZVwiO1xuICAgICAgICAgICAgICAgIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9kcm9wb3V0cmF0ZVwiKSB0YWIgPSBcIkRyb3BvdXQgUmF0ZVwiO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL3JlZGNhdGVnb3J5XCIpIHRhYiA9IFwiUmVkIENhdGVnb3JpemF0aW9uXCI7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7ZHVyYXRpb259ICR7dGFifSBvZiAke2FudGlnZW5MYWJlbH0gZm9yICR7ZnVsbFBlcmlvZH1gO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdm0udXBkYXRlTWFwV2l0aFZhY2NpbmUgPSBmdW5jdGlvbih2YWNjaW5lKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgKHZtLmFjdGl2ZURpc3RyaWN0ICE9IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIC8vICAgICAmJiB2bS5hY3RpdmVEaXN0cmljdCAhPSBcIkFMTFwiXG4gICAgICAgICAgICAgICAgLy8gICAgICYmIHZtLmFjdGl2ZURpc3RyaWN0ICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuaGlkZU1hcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLm1hcFBsYWNlaG9sZGVyTWVzc2FnZSA9IFwiTm8gbWFwIGF2YWlsYWJsZS5cIjtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vICAgICBzaGVsbFNjb3BlLmNoaWxkLmhpZGVNYXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgICAvLyBzaGVsbFNjb3BlLmNoaWxkLmhpZGVNYXAgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmICh2YWNjaW5lID09IFwiRFBUXCIgfHwgdmFjY2luZSA9PSBcIkFMTFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmUgPSBcIlBFTlRBXCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdm0uYWN0aXZlVmFjY2luZSA9IHZhY2NpbmU7XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5tYXBUaXRsZSA9IHZtLmdldE1hcFRpdGxlKHZhY2NpbmUpO1xuXG4gICAgICAgICAgICAgICAgY29sb3JDb3VudHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFJlZDogMCxcbiAgICAgICAgICAgICAgICAgICAgWWVsbG93OiAwLFxuICAgICAgICAgICAgICAgICAgICBEYXJrR3JlZW46IDAsXG4gICAgICAgICAgICAgICAgICAgIExpZ2h0R3JheTogMCxcbiAgICAgICAgICAgICAgICAgICAgT3JhbmdlOiAwXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZhciBwYXRocyA9IGQzLnNlbGVjdChcIiNtYXAgc3ZnXCIpLnNlbGVjdEFsbChcInBhdGhcIik7XG4gICAgICAgICAgICAgICAgcGF0aHMuc3R5bGUoXCJmaWxsXCIsIHZtLmdldEZpbGxDb2xvcik7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge3ZtLmRyYXdMZWdlbmQoY29sb3JDb3VudHMpOyB9LCAxMCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2bS5nZXRGaWxsQ29sb3IgPSBmdW5jdGlvbihkKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB2bS5nZXREaXN0cmljdFZhbHVlKGQpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yVmFsdWUgPSBjb2xvcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKGNvbG9yVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbG9yVmFsdWUgaW4gY29sb3JDb3VudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yQ291bnRzW2NvbG9yVmFsdWVdICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbG9yVmFsdWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiTGlnaHRHcmF5XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdm0uZ2V0TGFzdE1hcFBlcmlvZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciB2YWNjaW5lRGF0YSA9IHZtLnNhbXBsZURpc3RyaWN0RGF0YVt2bS5hY3RpdmVWYWNjaW5lXTtcbiAgICAgICAgICAgICAgICB2YXIgcGVyaW9kTGlzdCA9IE1hcFN1cHBvcnRTZXJ2aWNlLmdldFBlcmlvZExpc3QoXG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmVEYXRhLFxuICAgICAgICAgICAgICAgICAgICBlbmRZZWFyLFxuICAgICAgICAgICAgICAgICAgICB2bS5hY3RpdmVSZXBvcnRUb2dnbGVcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJldHVybiBwZXJpb2RMaXN0W3BlcmlvZExpc3QubGVuZ3RoLTFdO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdm0uZ2V0RGlzdHJpY3RWYWx1ZSA9IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdHJpY3REYXRhID0gZC5wcm9wZXJ0aWVzLmZpZWxkO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRpc3RyaWN0RGF0YSA9PSB1bmRlZmluZWQgfHwgKCEgKHZtLmFjdGl2ZVZhY2NpbmUgaW4gZGlzdHJpY3REYXRhKSkgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yQ291bnRzWydMaWdodEdyYXknXSArPSAxO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ0xpZ2h0R3JheSc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHZhY2NpbmVEYXRhID0gZGlzdHJpY3REYXRhW3ZtLmFjdGl2ZVZhY2NpbmVdO1xuXG4gICAgICAgICAgICAgICAgdmFyIHBlcmlvZExpc3QgPSBNYXBTdXBwb3J0U2VydmljZS5nZXRQZXJpb2RMaXN0KFxuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgZW5kWWVhcixcbiAgICAgICAgICAgICAgICAgICAgdm0uYWN0aXZlUmVwb3J0VG9nZ2xlXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9jb3ZlcmFnZVwiKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1hcFN1cHBvcnRTZXJ2aWNlLmNhbGN1bGF0ZUNvdmVyYWdlUmF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhY2NpbmVEYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kTGlzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldEFjdGl2ZURvc2VOdW1iZXIoKVxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9kcm9wb3V0cmF0ZVwiKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1hcFN1cHBvcnRTZXJ2aWNlLmNhbGN1bGF0ZURyb3BvdXRSYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFjY2luZURhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJpb2RMaXN0XG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL3JlZGNhdGVnb3J5XCIpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWFwU3VwcG9ydFNlcnZpY2UuY2FsY3VsYXRlUmVkQ2F0ZWdvcnlWYWx1ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhY2NpbmVEYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kTGlzdFxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9O1xuXG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVNjYWxlQ2VudGVyKGZlYXR1cmVzKSB7XG4gICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBib3VuZGluZyBib3ggb2YgdGhlIHBhdGhzIChpbiBwaXhlbHMpIGFuZCBjYWxjdWxhdGUgYSBzY2FsZSBmYWN0b3IgYmFzZWQgb24gYm94IGFuZCBtYXAgc2l6ZVxuICAgICAgICAgICAgICAgIHZhciBiYm94X3BhdGggPSBwYXRoLmJvdW5kcyhmZWF0dXJlcyksXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlID0gMC45NSAvIE1hdGgubWF4KFxuICAgICAgICAgICAgICAgICAgICAgICAgKGJib3hfcGF0aFsxXVswXSAtIGJib3hfcGF0aFswXVswXSkgLyB3aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIChiYm94X3BhdGhbMV1bMV0gLSBiYm94X3BhdGhbMF1bMV0pIC8gaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBib3VuZGluZyBib3ggb2YgdGhlIGZlYXR1cmVzIChpbiBtYXAgdW5pdHMpIGFuZCB1c2UgaXQgdG8gY2FsY3VsYXRlIHRoZSBjZW50ZXIgb2YgdGhlIGZlYXR1cmVzLlxuICAgICAgICAgICAgICAgIHZhciBiYm94X2ZlYXR1cmUgPSBkMy5nZW8uYm91bmRzKGZlYXR1cmVzKSxcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgKGJib3hfZmVhdHVyZVsxXVswXSArIGJib3hfZmVhdHVyZVswXVswXSkgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgKGJib3hfZmVhdHVyZVsxXVsxXSArIGJib3hfZmVhdHVyZVswXVsxXSkgLyAyXTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICdzY2FsZSc6c2NhbGUsXG4gICAgICAgICAgICAgICAgICAgICdjZW50ZXInOmNlbnRlclxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAvLyBORVc6IERlZmluaW5nIGdldElkT2ZGZWF0dXJlXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRJZE9mRmVhdHVyZShmKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmLnByb3BlcnRpZXMuaWR1ZztcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgIH07XG5cblxuICAgICAgICB2bS5nZXRSZWRWYWNjaW5lRG9zZXMgPSBmdW5jdGlvbihwZXJpb2QsIHZhY2NpbmUsIGRpc3RyaWN0KSB7XG5cblxuICAgICAgICAgICAgLy9Ub2RvOiBUZW1wb3JhcmlseSBkaXNhYmxlIGZpbHRlcmluZyBieSBkaXN0cmljdCBmb3IgdGhlIHRhYmxlXG4gICAgICAgICAgICBkaXN0cmljdCA9IFwiXCJcbiAgICAgICAgICAgIHZtLmRpc3RyaWN0ID0gZGlzdHJpY3Q7XG4gICAgICAgICAgICB2bS52YWNjaW5lID0gdmFjY2luZTsvL3ZtLnNlbGVjdGVkVmFjY2luZSA/IHZtLnNlbGVjdGVkVmFjY2luZS5uYW1lIDogXCJ2YVwiO1xuXG4gICAgICAgICAgICAvLyBBc3NpZ24gZGltZW5zaW9ucyBmb3IgbWFwIGNvbnRhaW5lclxuICAgICAgICAgICAgdmFyIHdpZHRoID0gNTAwLFxuICAgICAgICAgICAgICAgIGhlaWdodCA9IDUwMDtcbiAgICAgICAgICAgIHZhciBmaWVsZCA9IFwiUmVkX2NhdGVnb3J5XCI7XG4gICAgICAgICAgICAvL2lmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9yZWRjYXRlZ29yeVwiKXtcbiAgICAgICAgICAgIC8vICAgIGZpZWxkPVwiUmVkX2NhdGVnb3J5XCJcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvL31cblxuICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5kaXN0cmljdCA9IHZtLmRpc3RyaWN0O1xuICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC52YWNjaW5lID0gICB2bS52YWNjaW5lO1xuXG4gICAgICAgICAgICB2YXIgdmFsdWVGb3JtYXQgPSBkMy5mb3JtYXQoXCIsXCIpO1xuXG4gICAgICAgICAgICAvLyBEZWZpbmUgYSBnZW9ncmFwaGljYWwgcHJvamVjdGlvblxuICAgICAgICAgICAgLy8gQWxzbywgc2V0IGluaXRpYWwgem9vbSB0byBzaG93IHRoZSBmZWF0dXJlc1xuICAgICAgICAgICAgdmFyIHByb2plY3Rpb25cdD0gZDMuZ2VvLm1lcmNhdG9yKClcbiAgICAgICAgICAgICAgICAuc2NhbGUoMSk7XG5cbiAgICAgICAgICAgIC8vIFByZXBhcmUgYSBwYXRoIG9iamVjdCBhbmQgYXBwbHkgdGhlIHByb2plY3Rpb24gdG8gaXRcbiAgICAgICAgICAgIHZhciBwYXRoID0gZDMuZ2VvLnBhdGgoKVxuICAgICAgICAgICAgICAgIC5wcm9qZWN0aW9uKHByb2plY3Rpb24pO1xuXG4gICAgICAgICAgICAvLyBXZSBwcmVwYXJlIGFuIG9iamVjdCB0byBsYXRlciBoYXZlIGVhc2llciBhY2Nlc3MgdG8gdGhlIGRhdGEuXG4gICAgICAgICAgICB2YXIgZGF0YUJ5SWQgPSBkMy5tYXAoKTtcblxuICAgICAgICAgICAgLy9EZWZpbmUgcXVhbnRpemUgc2NhbGUgdG8gc29ydCBkYXRhIHZhbHVlcyBpbnRvIGJ1Y2tldHMgb2YgY29sb3JcbiAgICAgICAgICAgIC8vQ29sb3JzIGJ5IEN5bnRoaWEgQnJld2VyIChjb2xvcmJyZXdlcjIub3JnKSwgOS1jbGFzcyBZbEduQnVcblxuICAgICAgICAgICAgdmFyIGNvbG9yID0gZDMuc2NhbGUucXVhbnRpemUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy5yYW5nZShkMy5yYW5nZSg5KSxtYXAoZnVuY3Rpb24oaSkgeyByZXR1cm4gJ3EnICsgaSArICctOSc7fSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJhbmdlKFsgICAgXCIjMDA4MDAwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIjRkZGRjAwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIjRkZBNTAwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIjRkYwMDAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgQ292ZXJhZ2VTZXJ2aWNlLmdldFJlZFZhY2NpbmVEb3NlcyhwZXJpb2QsIHZhY2NpbmUpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9TZXQgaW5wdXQgZG9tYWluIGZvciBjb2xvciBzY2FsZVxuICAgICAgICAgICAgICAgICAgICBjb2xvci5kb21haW4oW1xuICAgICAgICAgICAgICAgICAgICAgICAgZDMubWluKGRhdGEsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuICtkW2ZpZWxkXTsgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBkMy5tYXgoZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gK2RbZmllbGRdOyB9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIG1hcHMgdGhlIGRhdGEgb2YgdGhlIENTViBzbyBpdCBjYW4gYmUgZWFzaWx5IGFjY2Vzc2VkIGJ5XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBJRCBvZiB0aGUgZGlzdHJpY3QsIGZvciBleGFtcGxlOiBkYXRhQnlJZFsyMTk2XVxuICAgICAgICAgICAgICAgICAgICBkYXRhQnlJZCA9IGQzLm5lc3QoKVxuICAgICAgICAgICAgICAgICAgICAgIC5rZXkoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDsgfSlcbiAgICAgICAgICAgICAgICAgICAgICAucm9sbHVwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRbMF07IH0pXG4gICAgICAgICAgICAgICAgICAgICAgLm1hcChkYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgbGVnZW5kID0gZDMuc2VsZWN0KCcjbGVnZW5kJylcblxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xpc3QtaW5saW5lJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleXMgPSBsZWdlbmQuc2VsZWN0QWxsKCdsaS5rZXknKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRhdGEoY29sb3IucmFuZ2UoKSk7XG5cbiAgICAgICAgICAgICAgICAgICAga2V5cy5lbnRlcigpLmFwcGVuZCgnbGknKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2tleScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoJ2JvcmRlci10b3AtY29sb3InLCBTdHJpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGV4dChmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZD09XCIjMDA4MDAwXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnQ0FUMSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZD09XCIjRkZGRjAwXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ0NBVDInXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGQ9PVwiI0ZGQTUwMFwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdDQVQzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZD09XCIjRkYwMDAwXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ0NBVDQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gTG9hZCBmZWF0dXJlcyBmcm9tIEdlb0pTT05cbiAgICAgICAgICAgICAgICAgICAgZDMuanNvbignc3RhdGljL2FwcC9jb21wb25lbnRzL2NvdmVyYWdlL2RhdGEvdWdfZGlzdHJpY3RzMi5nZW9qc29uJywgZnVuY3Rpb24oZXJyb3IsIGpzb24pIHtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIHNjYWxlIGFuZCBjZW50ZXIgcGFyYW1ldGVycyBmcm9tIHRoZSBmZWF0dXJlcy5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzY2FsZUNlbnRlciA9IGNhbGN1bGF0ZVNjYWxlQ2VudGVyKGpzb24pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBcHBseSBzY2FsZSwgY2VudGVyIGFuZCB0cmFuc2xhdGUgcGFyYW1ldGVycy5cbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb24uc2NhbGUoc2NhbGVDZW50ZXIuc2NhbGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jZW50ZXIoc2NhbGVDZW50ZXIuY2VudGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJhbnNsYXRlKFt3aWR0aC8yLCBoZWlnaHQvMl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNZXJnZSB0aGUgY292ZXJhZ2UgZGF0YSBhbWQgR2VvSlNPTiBpbnRvIGEgc2luZ2xlIGFycmF5XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBbHNvIGxvb3AgdGhyb3VnaCBvbmNlIGZvciBlYWNoIGNvdmVyYWdlIHNjb3JlIGRhdGEgdmFsdWVcblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgZGF0YS5sZW5ndGggOyBpKysgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHcmFiIGRpc3RyaWN0IG5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGlzdCA9IGRhdGFbaV0uZGlzdHJpY3RfX25hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBvcyA9IGRpc3QuaW5kZXhPZihcIiBcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFEaXN0cmljdCA9IGRpc3Quc3Vic3RyaW5nKDAsIHBvcykudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3ZhciBkYXRhRGlzdHJpY3QgPSBkYXRhW2ldLmRpc3RyaWN0O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9HcmFiIGRhdGEgdmFsdWUsIGFuZCBjb252ZXJ0IGZyb20gc3RyaW5nIHRvIGZsb2F0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFWYWx1ZSA9ICtkYXRhW2ldW2ZpZWxkXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vRmluZCB0aGUgY29ycmVzcG9uZGluZyBkaXN0cmljdCBpbnNpZGUgR2VvSlNPTlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGo9MDsgaiA8IGpzb24uZmVhdHVyZXMubGVuZ3RoIDsgaisrICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIHRoZSBkaXN0cmljdCByZWZlcmVuY2UgaW4ganNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIganNvbkRpc3RyaWN0ID0ganNvbi5mZWF0dXJlc1tqXS5wcm9wZXJ0aWVzLmRpc3Q7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFEaXN0cmljdCA9PSBqc29uRGlzdHJpY3QpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9Db3B5IHRoZSBkYXRhIHZhbHVlIGludG8gdGhlIEdlb0pTT05cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uZmVhdHVyZXNbal0ucHJvcGVydGllcy5maWVsZCA9IGRhdGFWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9TdG9wIGxvb2tpbmcgdGhyb3VnaCBKU09OXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBTVkcgaW5zaWRlIG1hcCBjb250YWluZXIgYW5kIGFzc2lnbiBkaW1lbnNpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3N2Zy5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KFwiI3JlZFwiKS5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN2ZyA9IGQzLnNlbGVjdChcIiNyZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWRkIGEgPGc+IGVsZW1lbnQgdG8gdGhlIFNWRyBlbGVtZW50IGFuZCBnaXZlIGEgY2xhc3MgdG8gc3R5bGUgbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdmZWF0dXJlcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBCaW5kIGRhdGEgYW5kIGNyZWF0ZSBvbmUgcGF0aCBwZXIgR2VvSlNPTiBmZWF0dXJlXG4gICAgICAgICAgICAgICAgICAgICAgICBzdmcuc2VsZWN0QWxsKFwicGF0aFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kYXRhKGpzb24uZmVhdHVyZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmVudGVyKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBwYXRoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBob3Zlcm9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGhvdmVyb3V0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgXCIjNzc3XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGRhdGEgdmFsdWVcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBkLnByb3BlcnRpZXMuZmllbGQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB2YWx1ZSBleGlzdHMgLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29sb3IodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdmFsdWUgaXMgdW5kZWZpbmVzIC4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiI2NjY1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cblxuXG4gICAgICAgICAgICAgICAgICAgIH0pOyAvLyBFbmQgZDMuanNvblxuXG4gICAgICAgICAgICAgICAgICAgIC8vIExvZ2ljIHRvIGhhbmRsZSBob3ZlciBldmVudCB3aGVuIGl0cyBmaXJlZHVwXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaG92ZXJvbiA9IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rvb2x0aXAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUubGVmdCA9IGV2ZW50LnBhZ2VYICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUudG9wID0gZXZlbnQucGFnZVkgKyAncHgnO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0ZpbGwgeWVsbG93IHRvIGhpZ2hsaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwid2hpdGVcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1Nob3cgdGhlIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QoXCIjdG9vbHRpcFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9Qb3B1bGF0ZSBuYW1lIGluIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QoXCIjdG9vbHRpcCAubmFtZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGV4dChkLnByb3BlcnRpZXMuZGlzdCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1BvcHVsYXRlIHZhbHVlIGluIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWQucHJvcGVydGllcy5maWVsZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiN0b29sdGlwIC52YWx1ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGV4dChcIk5vIERhdGFcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiN0b29sdGlwIC52YWx1ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRleHQoJ0NBVCcgKyAodmFsdWVGb3JtYXQoZC5wcm9wZXJ0aWVzLmZpZWxkKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBob3Zlcm91dCA9IGZ1bmN0aW9uKGQpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vUmVzdG9yZSBvcmlnaW5hbCBjaG9yb3BsZXRoIGZpbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBkLnByb3BlcnRpZXMuZmllbGQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29sb3IodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCIjY2NjXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9IaWRlIHRoZSB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KFwiI3Rvb2x0aXBcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YUFsbGRvc2VzID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc0Rvc2VzID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFBbGxkb3NlcyxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBjYWxjdWxhdGVTY2FsZUNlbnRlcihmZWF0dXJlcykge1xuICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBwYXRocyAoaW4gcGl4ZWxzKSBhbmQgY2FsY3VsYXRlIGEgc2NhbGUgZmFjdG9yIGJhc2VkIG9uIGJveCBhbmQgbWFwIHNpemVcbiAgICAgICAgICAgICAgICB2YXIgYmJveF9wYXRoID0gcGF0aC5ib3VuZHMoZmVhdHVyZXMpLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZSA9IDAuOTUgLyBNYXRoLm1heChcbiAgICAgICAgICAgICAgICAgICAgICAgIChiYm94X3BhdGhbMV1bMF0gLSBiYm94X3BhdGhbMF1bMF0pIC8gd2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAoYmJveF9wYXRoWzFdWzFdIC0gYmJveF9wYXRoWzBdWzFdKSAvIGhlaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBmZWF0dXJlcyAoaW4gbWFwIHVuaXRzKSBhbmQgdXNlIGl0IHRvIGNhbGN1bGF0ZSB0aGUgY2VudGVyIG9mIHRoZSBmZWF0dXJlcy5cbiAgICAgICAgICAgICAgICB2YXIgYmJveF9mZWF0dXJlID0gZDMuZ2VvLmJvdW5kcyhmZWF0dXJlcyksXG4gICAgICAgICAgICAgICAgICAgIGNlbnRlciA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIChiYm94X2ZlYXR1cmVbMV1bMF0gKyBiYm94X2ZlYXR1cmVbMF1bMF0pIC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgIChiYm94X2ZlYXR1cmVbMV1bMV0gKyBiYm94X2ZlYXR1cmVbMF1bMV0pIC8gMl07XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAnc2NhbGUnOnNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAnY2VudGVyJzpjZW50ZXJcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgLy8gTkVXOiBEZWZpbmluZyBnZXRJZE9mRmVhdHVyZVxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0SWRPZkZlYXR1cmUoZikge1xuICAgICAgICAgICAgICByZXR1cm4gZi5wcm9wZXJ0aWVzLmlkdWc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cblxuICAgICAgICB2bS5nZXRWYWNjaW5lRG9zZXNCeURpc3RyaWN0ID0gZnVuY3Rpb24ocGVyaW9kLCBkaXN0cmljdCwgdmFjY2luZSkge1xuXG5cbiAgICAgICAgICAgIENvdmVyYWdlU2VydmljZS5nZXRWYWNjaW5lRG9zZXNCeURpc3RyaWN0KHBlcmlvZCwgZGlzdHJpY3QsIHZhY2NpbmUpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5kcm9wZWRvdXQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZih2bS5kYXRhLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5kcm9wZWRvdXQgPSB2bS5kYXRhWzBdLmRyb3Bfb3V0X3JhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnVuZGVyaW1tdW5pemVkID0gdm0uZGF0YVswXS51bmRlcl9pbW11bml6ZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBBY2Nlc3MgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHZtLmRhdGFbMF0uYWNjZXNzID49IDkwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmFjY2VzcyA9IFwiR29vZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuYWNjZXNzID0gXCJQb29yXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFV0aWxpemF0aW9uICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzaGVsbFNjb3BlLmNoaWxkLmRyb3BlZG91dCA8PSAxMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC51dGlsaXphdGlvbiA9IFwiR29vZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudXRpbGl6YXRpb24gPSBcIlBvb3JcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLyogUmVkIENhdGVnb3JpemF0aW9uKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCh2bS5kYXRhWzBdLmFjY2VzcyA+PSA5MCkgJiYgKHZtLmRhdGFbMF0uZHJvcF9vdXRfcmF0ZSA8PTEwKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5yZWRjYXRlZ29yeSA9IFwiQ0FUMVwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKHZtLmRhdGFbMF0uYWNjZXNzID49IDkwICYmIHZtLmRhdGFbMF0uZHJvcF9vdXRfcmF0ZSA+IDEwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLnJlZGNhdGVnb3J5ID0gXCJDQVQyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYodm0uZGF0YVswXS5hY2Nlc3MgPCA5MCAmJiB2bS5kYXRhWzBdLmRyb3Bfb3V0X3JhdGUgPD0gMTApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUucmVkY2F0ZWdvcnkgPSBcIkNBVDNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZih2bS5kYXRhWzBdLmFjY2VzcyA8IDkwICYmIHZtLmRhdGFbMF0uZHJvcF9vdXRfcmF0ZSA+IDEwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLnJlZGNhdGVnb3J5ID0gXCJDQVQ0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uZ2V0QWN0aXZlRG9zZU51bWJlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHZtLmFjdGl2ZURvc2UgIT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJldHVybiBOdW1iZXIodm0uYWN0aXZlRG9zZS5zdWJzdHIodm0uYWN0aXZlRG9zZS5sZW5ndGgtMSwgMSkpO1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uY29tcHV0ZVJhdGUgPSBmdW5jdGlvbihkb3NlcywgcGxhbm5lZCkge1xuICAgICAgICAgICAgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL2NvdmVyYWdlXCIpe1xuICAgICAgICAgICAgICAgIHZhciBhY3RpdmVEb3NlTnVtYmVyID0gdm0uZ2V0QWN0aXZlRG9zZU51bWJlcigpO1xuICAgICAgICAgICAgICAgIHZhciBkb3NlVmFsdWUgPSBkb3Nlcy5sYXN0O1xuXG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZURvc2VOdW1iZXIgPT0gMSkgZG9zZVZhbHVlID0gZG9zZXMuZmlyc3Q7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYWN0aXZlRG9zZU51bWJlciA9PSAyKSBkb3NlVmFsdWUgPSBkb3Nlcy5zZWNvbmQ7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYWN0aXZlRG9zZU51bWJlciA9PSAzKSBkb3NlVmFsdWUgPSBkb3Nlcy50aGlyZDtcblxuICAgICAgICAgICAgICAgIHJldHVybiAoZG9zZVZhbHVlIC8gcGxhbm5lZCkgKiAxMDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL2Ryb3BvdXRyYXRlXCIpe1xuICAgICAgICAgICAgICAgIHJldHVybiAoKGRvc2VzLmZpcnN0IC0gZG9zZXMubGFzdCkgLyBkb3Nlcy5maXJzdCkgKiAxMDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL3JlZGNhdGVnb3J5XCIpe1xuICAgICAgICAgICAgICAgIHZhciBhY2Nlc3MgPSAoZG9zZXMuZmlyc3QvcGxhbm5lZCkgKiAxMDA7XG4gICAgICAgICAgICAgICAgdmFyIGRyb3BvdXRSYXRlID0gKChkb3Nlcy5maXJzdCAtIGRvc2VzLmxhc3QpIC8gZG9zZXMuZmlyc3QpICogMTAwO1xuXG4gICAgICAgICAgICAgICAgaWYgKGFjY2VzcyA+PSA5MCAmJiBkcm9wb3V0UmF0ZSA+PSAwICYmIGRyb3BvdXRSYXRlIDw9IDEwKSByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChhY2Nlc3MgPj0gOTAgJiYgKGRyb3BvdXRSYXRlIDwgMCB8fCBkcm9wb3V0UmF0ZSA+IDEwKSkgcmV0dXJuIDI7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYWNjZXNzIDwgOTAgJiYgZHJvcG91dFJhdGUgPj0gMCAmJiBkcm9wb3V0UmF0ZSA8PSAxMCkgcmV0dXJuIDM7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYWNjZXNzIDwgOTAgJiYgKGRyb3BvdXRSYXRlIDwgMCB8fCBkcm9wb3V0UmF0ZSA+IDEwKSkgcmV0dXJuIDQ7XG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB2bS5nZXRDaGFydERhdGEgPSBmdW5jdGlvbihwYXJhbXMsIGRhdGEsIHJlcG9ydFllYXIsIGN1bXVsYXRpdmUpIHtcblxuICAgICAgICAgICAgdmFyIHBlcmlvZFZhbHVlcyA9IHt9O1xuICAgICAgICAgICAgdmFyIHJlZENhdGVnb3J5VmFsdWVzID0ge307XG4gICAgICAgICAgICB2YXIgdG90YWxzID0ge307XG4gICAgICAgICAgICB2YXIgcmVkQ2F0ZWdvcnlUb3RhbHMgPSB7fTtcbiAgICAgICAgICAgIHZhciByYXRlO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGVyaW9kID0gZGF0YVtpXS5wZXJpb2Q7XG4gICAgICAgICAgICAgICAgdmFyIGxhc3RfZG9zZSA9IGRhdGFbaV0udG90YWxfbGFzdF9kb3NlO1xuICAgICAgICAgICAgICAgIHZhciBmaXJzdF9kb3NlID0gZGF0YVtpXS50b3RhbF9maXJzdF9kb3NlO1xuICAgICAgICAgICAgICAgIHZhciBzZWNvbmRfZG9zZSA9IGRhdGFbaV0udG90YWxfc2Vjb25kX2Rvc2U7XG4gICAgICAgICAgICAgICAgdmFyIHRoaXJkX2Rvc2UgPSBkYXRhW2ldLnRvdGFsX3RoaXJkX2Rvc2U7XG4gICAgICAgICAgICAgICAgdmFyIHBsYW5uZWQgPSBkYXRhW2ldLnRvdGFsX3BsYW5uZWQ7XG4gICAgICAgICAgICAgICAgdmFyIHZhY2NpbmUgPSBkYXRhW2ldLnZhY2NpbmVfX25hbWU7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RyaWN0ID0gZGF0YVtpXS5kaXN0cmljdF9fbmFtZTtcblxuICAgICAgICAgICAgICAgIHZhciBkYXRhTW9udGggPSBhcHBIZWxwZXJzLmdldE1vbnRoRnJvbVBlcmlvZChwZXJpb2QsIHJlcG9ydFllYXIpO1xuICAgICAgICAgICAgICAgIHZhciBkYXRhWWVhciA9IGFwcEhlbHBlcnMuZ2V0WWVhckZyb21QZXJpb2QocGVyaW9kLCByZXBvcnRZZWFyKTtcblxuICAgICAgICAgICAgICAgIHZhciB5ZWFyTGFiZWwgPSBhcHBIZWxwZXJzLmdldFllYXJMYWJlbEZyb21QZXJpb2QocGVyaW9kLCByZXBvcnRZZWFyKTtcbiAgICAgICAgICAgICAgICB2YXIgbW9udGhJbmRleCA9IGFwcEhlbHBlcnMuZ2V0TW9udGhJbmRleEZyb21QZXJpb2QocGVyaW9kLCByZXBvcnRZZWFyKTtcblxuICAgICAgICAgICAgICAgIC8qIFRoZSB2aWV3IHJldHVybnMgZXh0cmEgZGF0YSB0byBjYXRlciBmb3IgdGhlIGZpbmFuY2lhbCB5ZWFyXG4gICAgICAgICAgICAgICAgU2luY2UgaXRzIGlnbm9yYW50IG9mIHRoZSBwZXJpb2RzLCB3ZSBkbyB0aGUgZmlsdGVycyBvdXJzZWx2ZXNcbiAgICAgICAgICAgICAgICBEaWRuJ3Qgd2FudCB0byBjcmVhdGUgYSBuZXcgQVBJIGNhbGwgZm9yIGEgY2hhbmdlIGluIHJlcG9ydCB5ZWFyXG4gICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpZiAoKHJlcG9ydFllYXIgPT0gXCJDWVwiKSAmJiAoZGF0YVllYXIgPiBwYXJhbXMuZW5kWWVhcikpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIC8vIGlmICgocmVwb3J0WWVhciA9PSBcIkZZXCIpICYmIChkYXRhWWVhciA9PSBwYXJhbXMuZW5kWWVhcikgJiYgKGRhdGFNb250aCA+IDYpKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBpZiAoKHJlcG9ydFllYXIgPT0gXCJGWVwiKSAmJiAoZGF0YVllYXIgPT0gcGFyYW1zLnN0YXJ0WWVhcikgJiYgKGRhdGFNb250aCA8PSA2KSkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICBpZiAoISAoeWVhckxhYmVsIGluIHBlcmlvZFZhbHVlcykpIHtcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kVmFsdWVzW3llYXJMYWJlbF0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgcmVkQ2F0ZWdvcnlWYWx1ZXNbeWVhckxhYmVsXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICB0b3RhbHNbeWVhckxhYmVsXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICByZWRDYXRlZ29yeVRvdGFsc1t5ZWFyTGFiZWxdID0ge307XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCEgKHZhY2NpbmUgaW4gcGVyaW9kVmFsdWVzW3llYXJMYWJlbF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZFZhbHVlc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdID0gW107XG4gICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgdG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0gPSB7Zmlyc3RfZG9zZTogMCwgc2Vjb25kX2Rvc2U6MCwgdGhpcmRfZG9zZTowLCBsYXN0X2Rvc2U6IDAsIHBsYW5uZWQ6IDB9O1xuICAgICAgICAgICAgICAgICAgICByZWRDYXRlZ29yeVRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdID0ge307XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGRpc3RyaWN0ICE9IHVuZGVmaW5lZCAmJiAhKGRpc3RyaWN0IGluIHJlZENhdGVnb3J5VG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV1bZGlzdHJpY3RdID0ge2ZpcnN0X2Rvc2U6IDAsIGxhc3RfZG9zZTogMCwgcGxhbm5lZDogMH07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGN1bXVsYXRpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZtLnBhdGggPT0gJy9jb3ZlcmFnZS9yZWRjYXRlZ29yeScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb21iaW5lZEZpcnN0RG9zZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVkQ2F0ZWdvcnlUb3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXVtkaXN0cmljdF0uZmlyc3RfZG9zZSArIGZpcnN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29tYmluZWRMYXN0RG9zZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVkQ2F0ZWdvcnlUb3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXVtkaXN0cmljdF0ubGFzdF9kb3NlICsgbGFzdF9kb3NlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbWJpbmVkUGxhbm5lZCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVkQ2F0ZWdvcnlUb3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXVtkaXN0cmljdF0ucGxhbm5lZCArIHBsYW5uZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV1bZGlzdHJpY3RdLmZpcnN0X2Rvc2UgPSBjb21iaW5lZEZpcnN0RG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV1bZGlzdHJpY3RdLmxhc3RfZG9zZSA9IGNvbWJpbmVkTGFzdERvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWRDYXRlZ29yeVRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdW2Rpc3RyaWN0XS5wbGFubmVkID0gY29tYmluZWRQbGFubmVkO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbWJpbmVkRmlyc3REb3NlID0gdG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0uZmlyc3RfZG9zZSArIGZpcnN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29tYmluZWRMYXN0RG9zZSA9IHRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLmxhc3RfZG9zZSArIGxhc3RfZG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb21iaW5lZFNlY29uZERvc2UgPSB0b3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXS5zZWNvbmRfZG9zZSArIHNlY29uZF9kb3NlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbWJpbmVkVGhpcmREb3NlID0gdG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0udGhpcmRfZG9zZSArIHRoaXJkX2Rvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29tYmluZWRQbGFubmVkID0gdG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0ucGxhbm5lZCArIHBsYW5uZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLmZpcnN0X2Rvc2UgPSBjb21iaW5lZEZpcnN0RG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLmxhc3RfZG9zZSA9IGNvbWJpbmVkTGFzdERvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXS5zZWNvbmRfZG9zZSA9IGNvbWJpbmVkU2Vjb25kRG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLnRoaXJkX2Rvc2UgPSBjb21iaW5lZFRoaXJkRG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLnBsYW5uZWQgPSBjb21iaW5lZFBsYW5uZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByYXRlID0gdm0uY29tcHV0ZVJhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3Q6IGNvbWJpbmVkRmlyc3REb3NlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kOiBjb21iaW5lZFNlY29uZERvc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlyZDogY29tYmluZWRUaGlyZERvc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0OiBjb21iaW5lZExhc3REb3NlXG4gICAgICAgICAgICAgICAgICAgIH0sIGNvbWJpbmVkUGxhbm5lZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmF0ZSA9IHZtLmNvbXB1dGVSYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0OmZpcnN0X2Rvc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWNvbmQ6c2Vjb25kX2Rvc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlyZDogdGhpcmRfZG9zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3Q6IGxhc3RfZG9zZX1cbiAgICAgICAgICAgICAgICAgICAgLCBwbGFubmVkKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodm0ucGF0aCA9PSAnL2NvdmVyYWdlL3JlZGNhdGVnb3J5Jykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2F0ZWdvcnkgPSByYXRlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoISAobW9udGhJbmRleCBpbiByZWRDYXRlZ29yeVZhbHVlc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV1bbW9udGhJbmRleF0gPSB7fTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoISAoY2F0ZWdvcnkgaW4gcmVkQ2F0ZWdvcnlWYWx1ZXNbeWVhckxhYmVsXVt2YWNjaW5lXVttb250aEluZGV4XSkpXG4gICAgICAgICAgICAgICAgICAgICAgICByZWRDYXRlZ29yeVZhbHVlc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdW21vbnRoSW5kZXhdW2NhdGVnb3J5XSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV1bbW9udGhJbmRleF1bY2F0ZWdvcnldLnB1c2goZGlzdHJpY3QpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZFZhbHVlc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLnB1c2goe3g6IG1vbnRoSW5kZXgsIHk6IGQzLmZvcm1hdCgnLjAxZicpKHJhdGUpfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY2hhcnREYXRhID0gW107XG5cbiAgICAgICAgICAgIGlmICh2bS5wYXRoID09ICcvY292ZXJhZ2UvcmVkY2F0ZWdvcnknKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdldFJlZENhdGVnb3J5VmFsdWVzID0gZnVuY3Rpb24obW9udGhJbmRleCwgY2F0RGlzdHJpY3RzLCB0b3RhbERpc3RyaWN0cykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IE51bWJlcihtb250aEluZGV4KSwgeTogZDMuZm9ybWF0KCcuMDFmJykoKGNhdERpc3RyaWN0cyAvIHRvdGFsRGlzdHJpY3RzKSAqIDEwMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB4OiBOdW1iZXIobW9udGhJbmRleCksIHk6IGQzLmZvcm1hdCgnLjAxZicpKGNhdERpc3RyaWN0cylcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdmFyIGdldFRvdGFsUmVkQ2F0ZWdvcnlEaXN0cmljdHMgPSBmdW5jdGlvbihjYXQsIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhdCBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YVtjYXRdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdmFyIGNhdGVnb3J5VmFsdWVzID0ge1xuICAgICAgICAgICAgICAgICAgICAxOiBbXSwgMjogW10sIDM6IFtdLCA0OiBbXVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciB5ZWFyTGFiZWwgaW4gcmVkQ2F0ZWdvcnlWYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgdmFjY2luZSBpbiByZWRDYXRlZ29yeVZhbHVlc1t5ZWFyTGFiZWxdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBtb250aEluZGV4IGluIHJlZENhdGVnb3J5VmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV0pIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWNjaW5lRGF0YSA9IHJlZENhdGVnb3J5VmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV1bbW9udGhJbmRleF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh5ZWFyTGFiZWwgKyBcIi1cIiArIG1vbnRoSW5kZXggKyBcIi1cIiArIHZhY2NpbmUgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh2YWNjaW5lRGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2F0MURpc3RyaWN0cyA9IGdldFRvdGFsUmVkQ2F0ZWdvcnlEaXN0cmljdHMoMSwgdmFjY2luZURhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjYXQyRGlzdHJpY3RzID0gZ2V0VG90YWxSZWRDYXRlZ29yeURpc3RyaWN0cygyLCB2YWNjaW5lRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNhdDNEaXN0cmljdHMgPSBnZXRUb3RhbFJlZENhdGVnb3J5RGlzdHJpY3RzKDMsIHZhY2NpbmVEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2F0NERpc3RyaWN0cyA9IGdldFRvdGFsUmVkQ2F0ZWdvcnlEaXN0cmljdHMoNCwgdmFjY2luZURhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRvdGFsRGlzdHJpY3RzID0gY2F0MURpc3RyaWN0cyArIGNhdDJEaXN0cmljdHMgKyBjYXQzRGlzdHJpY3RzICsgY2F0NERpc3RyaWN0cztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5VmFsdWVzWzFdLnB1c2goZ2V0UmVkQ2F0ZWdvcnlWYWx1ZXMobW9udGhJbmRleCwgY2F0MURpc3RyaWN0cywgdG90YWxEaXN0cmljdHMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeVZhbHVlc1syXS5wdXNoKGdldFJlZENhdGVnb3J5VmFsdWVzKG1vbnRoSW5kZXgsIGNhdDJEaXN0cmljdHMsIHRvdGFsRGlzdHJpY3RzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlWYWx1ZXNbM10ucHVzaChnZXRSZWRDYXRlZ29yeVZhbHVlcyhtb250aEluZGV4LCBjYXQzRGlzdHJpY3RzLCB0b3RhbERpc3RyaWN0cykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5VmFsdWVzWzRdLnB1c2goZ2V0UmVkQ2F0ZWdvcnlWYWx1ZXMobW9udGhJbmRleCwgY2F0NERpc3RyaWN0cywgdG90YWxEaXN0cmljdHMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNoYXJ0RGF0YS5wdXNoKHtrZXk6ICdDQVQxJywgY29sb3I6ICdEYXJrR3JlZW4nLCB2YWx1ZXM6IHZtLmZpbGxNaXNzaW5nVmFsdWVzKGNhdGVnb3J5VmFsdWVzWzFdKX0pO1xuICAgICAgICAgICAgICAgIGNoYXJ0RGF0YS5wdXNoKHtrZXk6ICdDQVQyJywgY29sb3I6ICdZZWxsb3cnLCB2YWx1ZXM6IHZtLmZpbGxNaXNzaW5nVmFsdWVzKGNhdGVnb3J5VmFsdWVzWzJdKX0pO1xuICAgICAgICAgICAgICAgIGNoYXJ0RGF0YS5wdXNoKHtrZXk6ICdDQVQzJywgY29sb3I6ICdPcmFuZ2UnLCB2YWx1ZXM6IHZtLmZpbGxNaXNzaW5nVmFsdWVzKGNhdGVnb3J5VmFsdWVzWzNdKX0pO1xuICAgICAgICAgICAgICAgIGNoYXJ0RGF0YS5wdXNoKHtrZXk6ICdDQVQ0JywgY29sb3I6ICdSZWQnLCB2YWx1ZXM6IHZtLmZpbGxNaXNzaW5nVmFsdWVzKGNhdGVnb3J5VmFsdWVzWzRdKX0pO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHllYXJMYWJlbCBpbiBwZXJpb2RWYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgdmFjY2luZSBpbiBwZXJpb2RWYWx1ZXNbeWVhckxhYmVsXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IHZhY2NpbmU7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAodm0uYWN0aXZlRG9zZSAhPSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8ga2V5ID0gdm0uYWN0aXZlRG9zZSA7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVzID0gdm0uZmlsbE1pc3NpbmdWYWx1ZXMocGVyaW9kVmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnREYXRhLnB1c2goe2tleToga2V5LCB2YWx1ZXM6IHZhbHVlc30pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2hhcnREYXRhO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmZpbGxNaXNzaW5nVmFsdWVzID0gZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICAgICAgICB2YXIgbW9udGhJbmRleGVzID0gXy5yYW5nZSgxLCAxMyk7XG4gICAgICAgICAgICB2YXIgZXhpc3RpbmdJbmRleGVzID0gdmFsdWVzLm1hcChmdW5jdGlvbihpdGVtKSB7IHJldHVybiBpdGVtLng7IH0pO1xuICAgICAgICAgICAgdmFyIG5ld0luZGV4ZXMgPSBtb250aEluZGV4ZXMuZmlsdGVyKGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXhpc3RpbmdJbmRleGVzLmluZGV4T2YodikgPCAwO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBuZXdJbmRleGVzLmZvckVhY2goZnVuY3Rpb24obW9udGhJbmRleCkge1xuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHt4OiBtb250aEluZGV4LCB5OiAwfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZXMuc29ydChmdW5jdGlvbihhLCBiKSB7cmV0dXJuIGEueCAtIGIueH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmdldENoYXJ0T3B0aW9ucyA9IGZ1bmN0aW9uKHJlcG9ydFllYXIpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2xpbmVDaGFydCcsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogNDUwLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogNDUwLFxuICAgICAgICAgICAgICAgICAgICB1c2VJbnRlcmFjdGl2ZUd1aWRlbGluZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJhY3RpdmVMYXllcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3Jhdml0eTogJ3MnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHg6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZC54OyB9LFxuICAgICAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbihkKXsgcmV0dXJuIGQueTsgfSxcbiAgICAgICAgICAgICAgICAgICAgZm9yY2VZOiBbLTEwLDE1MF0sXG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZUNoYW5nZTogZnVuY3Rpb24oZSl7IGNvbnNvbGUubG9nKFwic3RhdGVDaGFuZ2VcIik7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VTdGF0ZTogZnVuY3Rpb24oZSl7IGNvbnNvbGUubG9nKFwiY2hhbmdlU3RhdGVcIik7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwU2hvdzogZnVuY3Rpb24oZSl7IGNvbnNvbGUubG9nKFwidG9vbHRpcFNob3dcIik7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwSGlkZTogZnVuY3Rpb24oZSl7IGNvbnNvbGUubG9nKFwidG9vbHRpcEhpZGVcIik7IH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgeEF4aXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNMYWJlbDogJ01vbnRocycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBwSGVscGVycy5nZXRNb250aEZyb21OdW1iZXIoZCwgcmVwb3J0WWVhcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHlBeGlzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWw6ICdQZXJjZW50YWdlICglKSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGNoYXJ0KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCIhISEgbGluZUNoYXJ0IGNhbGxiYWNrICEhIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uZ2V0Q2hhcnRUaXRsZSA9IGZ1bmN0aW9uKHZhY2NpbmUpIHtcbiAgICAgICAgICAgIHZhciBkdXJhdGlvbiA9IHZtLmFjdGl2ZVJlcG9ydFRvZ2dsZVswXSA9PSAnQScgPyBcIkFubnVhbGl6ZWRcIiA6IFwiTW9udGhseVwiO1xuICAgICAgICAgICAgdmFyIGFudGlnZW5MYWJlbCA9IHZtLmFjdGl2ZURvc2UgIT0gdW5kZWZpbmVkID8gdm0uYWN0aXZlRG9zZSA6IHZhY2NpbmU7XG4gICAgICAgICAgICBhbnRpZ2VuTGFiZWwgPSAodmFjY2luZSA9PSBcIkFMTFwiKSA/IFwiYW50aWdlbnNcIiA6IGFudGlnZW5MYWJlbDtcbiAgICAgICAgICAgIHZhciB5ZWFyVHlwZSA9IHZtLmFjdGl2ZVJlcG9ydFllYXIgPT0gJ0NZJyA/ICdDYWxlbmRhciBZZWFyJyA6ICdGaW5hbmNpYWwgeWVhcic7XG5cbiAgICAgICAgICAgIHZhciB0YWIgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAodm0ucGF0aD09XCIvY292ZXJhZ2UvZHJvcG91dHJhdGVcIilcbiAgICAgICAgICAgICAgICB0YWIgPSBcIkRyb3BvdXQgUmF0ZVwiO1xuICAgICAgICAgICAgZWxzZSBpZiAodm0ucGF0aD09XCIvY292ZXJhZ2UvcmVkY2F0ZWdvcnlcIilcbiAgICAgICAgICAgICAgICB0YWIgPSBcIlJlZCBDYXRlZ29yaXphdGlvblwiO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRhYiA9IFwiQ292ZXJhZ2VcIjtcblxuICAgICAgICAgICAgcmV0dXJuIFwiVHJlbmQgb2YgXCIgKyBkdXJhdGlvbiArIFwiIFwiICsgdGFiICsgXCIgb2YgXCIgK1xuICAgICAgICAgICAgICAgIGFudGlnZW5MYWJlbCArIFwiIGZvciBcIiArIHZtLmFjdGl2ZUNvdmVyYWdlWWVhciArIFwiIFwiICsgeWVhclR5cGU7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uZ2V0VmFjY2luZURvc2VzQnlQZXJpb2QgPSBmdW5jdGlvbihwYXJhbXMpIHtcblxuICAgICAgICAgICAgQ292ZXJhZ2VTZXJ2aWNlLmdldFZhY2NpbmVEb3Nlc0J5UGVyaW9kKHBhcmFtcylcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm9wdGlvbnNNQ1kgPSB2bS5nZXRDaGFydE9wdGlvbnMoXCJDWVwiKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm9wdGlvbnNBQ1kgPSB2bS5nZXRDaGFydE9wdGlvbnMoXCJDWVwiKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm9wdGlvbnNNRlkgPSB2bS5nZXRDaGFydE9wdGlvbnMoXCJGWVwiKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm9wdGlvbnNBRlkgPSB2bS5nZXRDaGFydE9wdGlvbnMoXCJGWVwiKTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YU1DWSA9IHZtLmdldENoYXJ0RGF0YShwYXJhbXMsIGRhdGEsIFwiQ1lcIiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YUFDWSA9IHZtLmdldENoYXJ0RGF0YShwYXJhbXMsIGRhdGEsIFwiQ1lcIiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhTUZZID0gdm0uZ2V0Q2hhcnREYXRhKHBhcmFtcywgZGF0YSwgXCJGWVwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhQUZZID0gdm0uZ2V0Q2hhcnREYXRhKHBhcmFtcywgZGF0YSwgXCJGWVwiLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmNoYXJ0VGl0bGUgPSB2bS5nZXRDaGFydFRpdGxlKHZtLnNlbGVjdGVkQW50aWdlbik7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2bS5lbmFibGVQREZEb3dubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZG93bmxvYWRQREYgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9GaXggY2hhcnQgYmVmb3JlIGRvd25sb2FkXG4gICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdEFsbChcInN2ZyAubnYtbGluZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIiNmZmZmZmZcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAwKTtcblxuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3RBbGwoXCIubnZkMyAubnYtYmFja2dyb3VuZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIiNmZmZmZmZcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAwKTtcblxuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3RBbGwoXCIubnZkMyAubnYtYXhpcyBsaW5lXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgXCIjZTVlNWU1XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdEFsbChcIi5udmQzIHRleHRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZvbnRcIiwgXCJub3JtYWwgMTNweCBBcmlhbCwgc2Fucy1zZXJpZlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3RBbGwoXCIubnZkMyAubnYtZ3JvdXBzIC5udi1wb2ludFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIDApXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2Utd2lkdGhcIiwgXCIwcHhcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52ZDMgLm52LWF4aXMgLnplcm8gbGluZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIFwiIzQwNDA0MFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3RBbGwoXCIubnYteSAubnYtYXhpcyBnIHBhdGguZG9tYWluXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgXCIjNDA0MDQwXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdEFsbChcIi5sZWdlbmRRdWFudCAubGFiZWxcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZvbnRcIiwgXCJub3JtYWwgMTJweCBBcmlhbCwgc2Fucy1zZXJpZlwiKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgcGRmID0gbmV3IGpzUERGKCdsJywgJ21tJyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0geyBmb3JtYXQgOiAnUE5HJyB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHBkZi5hZGRIVE1MKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGRmUmVwb3J0XCIpLCAwLCAwLCBvcHRpb25zLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICBwZGYuc2F2ZSgnY292ZXJhZ2UtcmVwb3J0LnBkZicpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gJHNjb3BlLiRvbigncmVmcmVzaCcsIGZ1bmN0aW9uKGUsIHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSkge1xuICAgICAgICAvLyAgICAgaWYoc3RhcnRNb250aC5uYW1lICYmIGVuZE1vbnRoLm5hbWUgJiYgZGlzdHJpY3QubmFtZSAmJiB2YWNjaW5lLm5hbWUpIHtcbiAgICAgICAgJHNjb3BlLiRvbihcbiAgICAgICAgICAgICdyZWZyZXNoQ292ZXJhZ2UyJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uKGUsIGVuZE1vbnRoLCBzdGFydFllYXIsIGVuZFllYXIsIGFjdGl2ZUNvdmVyYWdlWWVhciwgYW50aWdlbiwgZG9zZSwgZGlzdHJpY3QpIHtcbiAgICAgICAgICAgICAgICAvKiBieSBGZWxpeDsgTXVsdGlwbGUgR2VvSnNvbiByZXF1ZXN0cyB3ZXJlIGJlaW5nIHNlbnQsXG4gICAgICAgICAgICAgICAgdHJhY2VkIHRoZSBwcm9ibGVtIHRvIG11bHRpcGxlIENvdmVyYWdlQ29udHJvbGxlciBjYWxscy5cbiAgICAgICAgICAgICAgICBGb3VuZCBzb2x1dGlvbiBieSBjaGVja2luZyBjdXJyZW50U2NvcGUgYXMgc2hvd25cbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGlmICgndm0nIGluIGUuY3VycmVudFNjb3BlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vdm0uZ2V0U3RvY2tCeURpc3RyaWN0KHN0YXJ0TW9udGgubmFtZSwgZW5kTW9udGgubmFtZSwgZGlzdHJpY3QubmFtZSwgdmFjY2luZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgLy92bS5nZXRTdG9ja0J5RGlzdHJpY3RWYWNjaW5lKHN0YXJ0TW9udGgubmFtZSwgZW5kTW9udGgubmFtZSwgZGlzdHJpY3QubmFtZSwgdmFjY2luZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgLy92bS5nZXRESElTMlZhY2NpbmVEb3NlcyhlbmRNb250aC5wZXJpb2QsIGRpc3RyaWN0Lm5hbWUsIHZhY2NpbmUubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHZtLmFjdGl2ZURpc3RyaWN0ID0gZGlzdHJpY3Q7XG4gICAgICAgICAgICAgICAgICAgIHZtLmFjdGl2ZURvc2UgPSBkb3NlO1xuICAgICAgICAgICAgICAgICAgICB2bS5hY3RpdmVTdGFydFllYXIgPSBzdGFydFllYXI7XG4gICAgICAgICAgICAgICAgICAgIHZtLmFjdGl2ZUVuZFllYXIgPSBlbmRZZWFyO1xuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEFudGlnZW4gPSBhbnRpZ2VuO1xuICAgICAgICAgICAgICAgICAgICB2bS5hY3RpdmVDb3ZlcmFnZVllYXIgPSBhY3RpdmVDb3ZlcmFnZVllYXI7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGVuYWJsZURpc3RyaWN0R3JvdXBpbmcgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAodm0ucGF0aCA9PSAnL2NvdmVyYWdlL3JlZGNhdGVnb3J5JylcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZURpc3RyaWN0R3JvdXBpbmcgPSAxO1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLmVuYWJsZVBERkRvd25sb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgIHZtLmdldFZhY2NpbmVEb3Nlc0J5RGlzdHJpY3QoZW5kTW9udGgucGVyaW9kLCBkaXN0cmljdCwgYW50aWdlbik7XG4gICAgICAgICAgICAgICAgICAgIHZtLmdldFZhY2NpbmVEb3Nlc0J5UGVyaW9kKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0WWVhcjogYWN0aXZlQ292ZXJhZ2VZZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kWWVhcjogYWN0aXZlQ292ZXJhZ2VZZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgYW50aWdlbjogYW50aWdlbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvc2U6IGRvc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVEaXN0cmljdEdyb3VwaW5nOiBlbmFibGVEaXN0cmljdEdyb3VwaW5nXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHZtLmdldFZhY2NpbmVEb3NlcyhlbmRNb250aC5wZXJpb2QsIGFudGlnZW4sIGRpc3RyaWN0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUNvdmVyYWdlWWVhciAhPSB2bS5sYXN0RW5kWWVhcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0VmFjY2luZURvc2VzKGFjdGl2ZUNvdmVyYWdlWWVhciwgYW50aWdlbiwgZGlzdHJpY3QpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0udXBkYXRlTWFwV2l0aFZhY2NpbmUoYW50aWdlbik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyB2bS5nZXRSZWRWYWNjaW5lRG9zZXMoZW5kTW9udGgucGVyaW9kLCBhbnRpZ2VuKTtcblxuXG4gICAgICAgICAgICAgICAgICAgIHZtLmxhc3RFbmRZZWFyID0gYWN0aXZlQ292ZXJhZ2VZZWFyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgIH1cblxuXSlcbiAgICAuZGlyZWN0aXZlKFwicmVwb3J0WWVhclRvZ2dsZXNcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3N0YXRpYy9hcHAvY29tcG9uZW50cy9jb3ZlcmFnZS9yZXBvcnQteWVhci10b2dnbGVzLmh0bWwnXG4gICAgICAgIH1cbiAgICB9KTtcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKS5jb250cm9sbGVyKCdGaW5hbmNlRGF0YUNvbnRyb2xsZXInLCBGaW5hbmNlRGF0YUNvbnRyb2xsZXIpO1xuXG5GaW5hbmNlRGF0YUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRodHRwJywgJ0ZpbmFuY2VTZXJ2aWNlJ107XG5mdW5jdGlvbiBGaW5hbmNlRGF0YUNvbnRyb2xsZXIoJHNjb3BlLCAkaHR0cCwgRmluYW5jZVNlcnZpY2UpIHtcblxuICAgICRzY29wZS5hZGROZXdSb3cgPSBhZGROZXdSb3c7XG4gICAgJHNjb3BlLnNhdmVSb3cgPSBzYXZlUm93O1xuXG4gICAgJHNjb3BlLmdyaWRPcHRpb25zID0ge307XG4gICAgJHNjb3BlLmdyaWRPcHRpb25zLmRhdGEgPSBbXTtcbiAgICAkc2NvcGUuZ3JpZE9wdGlvbnMuY29sdW1uRGVmcyA9IFtcbiAgICAgICAge25hbWU6ICdwZXJpb2QnLCBlbmFibGVDZWxsRWRpdDogdHJ1ZSB9LFxuICAgICAgICB7bmFtZTogJ2dhdmlfYXBwcm92ZWQnLCBlbmFibGVDZWxsRWRpdDogdHJ1ZSB9LFxuICAgICAgICB7bmFtZTogJ2dhdmlfZGlzYnVyc2VkJywgZW5hYmxlQ2VsbEVkaXQ6IHRydWUgfSxcbiAgICAgICAge25hbWU6ICdnb3VfYXBwcm92ZWQnLCBlbmFibGVDZWxsRWRpdDogdHJ1ZSB9LFxuICAgICAgICB7bmFtZTogJ2dvdV9kaXNidXJzZWQnLCBlbmFibGVDZWxsRWRpdDogdHJ1ZSB9XG4gICAgXTtcblxuICAgIC8vICRodHRwLmdldCgnL2ZpbmFuY2UvbGlzdCcsIHt9KVxuICAgIC8vICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgIC8vICAgICAgICAgdmFyIGRhdGEgPSBhbmd1bGFyLmZyb21Kc29uKHJlc3BvbnNlLmRhdGEpO1xuICAgIC8vICAgICAgICAgZGF0YS5tYXAoZnVuY3Rpb24oZCkge1xuICAgIC8vICAgICAgICAgICAgICRzY29wZS5ncmlkT3B0aW9ucy5kYXRhLnB1c2goZC5maWVsZHMpO1xuICAgIC8vICAgICAgICAgfSk7XG4gICAgLy8gICAgIH0pXG4gICAgRmluYW5jZVNlcnZpY2UuZ2V0RmluYW5jZURhdGEoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgZGF0YS5tYXAoZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgJHNjb3BlLmdyaWRPcHRpb25zLmRhdGEucHVzaChkKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuZ3JpZE9wdGlvbnMub25SZWdpc3RlckFwaSA9IGZ1bmN0aW9uKGdyaWRBcGkpe1xuICAgICAgICAkc2NvcGUuZ3JpZEFwaSA9IGdyaWRBcGk7XG4gICAgICAgIGdyaWRBcGkucm93RWRpdC5vbi5zYXZlUm93KCRzY29wZSwgJHNjb3BlLnNhdmVSb3cpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBhZGROZXdSb3coKSB7XG4gICAgICAgICRzY29wZS5ncmlkT3B0aW9ucy5kYXRhLnB1c2goe1xuICAgICAgICAgICAgcGVyaW9kOiAwLFxuICAgICAgICAgICAgZ2F2aV9hcHByb3ZlZDogMCxcbiAgICAgICAgICAgIGdhdmlfZGlzYnVyc2VkOiAwLFxuICAgICAgICAgICAgZ291X2FwcHJvdmVkOiAwLFxuICAgICAgICAgICAgZ291X2Rpc2J1cnNlZDogMFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzYXZlUm93KHJvd0VudGl0eSkge1xuICAgICAgICAkaHR0cC5kZWZhdWx0cy54c3JmQ29va2llTmFtZSA9ICdjc3JmdG9rZW4nO1xuICAgICAgICAkaHR0cC5kZWZhdWx0cy54c3JmSGVhZGVyTmFtZSA9ICdYLUNTUkZUb2tlbic7XG4gICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAucG9zdCgnL2ZpbmFuY2UvdXBkYXRlJywgcm93RW50aXR5KVxuXG4gICAgICAgICRzY29wZS5ncmlkQXBpLnJvd0VkaXQuc2V0U2F2ZVByb21pc2Uocm93RW50aXR5LCBwcm9taXNlLnByb21pc2UpO1xuICAgICAgICBjb25zb2xlLmxvZyhyb3dFbnRpdHkpO1xuICAgIH1cbn1cblxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpLmNvbnRyb2xsZXIoJ01haW5GaW5hbmNlQ29udHJvbGxlcicsIE1haW5GaW5hbmNlQ29udHJvbGxlcik7XG5cbk1haW5GaW5hbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnQ2hhcnRQREZFeHBvcnQnLCAnQ2hhcnRTdXBwb3J0U2VydmljZScsICdGaW5hbmNlU2VydmljZSddO1xuZnVuY3Rpb24gTWFpbkZpbmFuY2VDb250cm9sbGVyKCRzY29wZSwgQ2hhcnRQREZFeHBvcnQsIENoYXJ0U3VwcG9ydFNlcnZpY2UsIEZpbmFuY2VTZXJ2aWNlKSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5leHBvcnRQREYgPSBDaGFydFBERkV4cG9ydC5leHBvcnQ7XG4gICAgdm0uZ3JhcGhPcHRpb25zID0gZ2V0T3B0aW9ucygpO1xuICAgIHZtLnllYXJJbmRleGVzID0gW107XG4gICAgdm0uYWN0aXZlVG9nZ2xlID0gJ0dBVkknO1xuXG4gICAgcmVzZXRHcmFwaERhdGEoKTtcbiAgICBzZXRZZWFyRmlsdGVyT3B0aW9ucygpO1xuICAgICRzY29wZS4kd2F0Y2goJ3ZtLmFjdGl2ZVRvZ2dsZScsIGNoYW5nZVRhYnMpO1xuICAgICRzY29wZS4kb24oJ3JlZnJlc2hDb3ZlcmFnZTMnLCB1cGRhdGVDaGFydCk7XG5cbiAgICBmdW5jdGlvbiByZXNldEdyYXBoRGF0YSgpIHtcbiAgICAgICAgdm0uZ3JhcGhEYXRhID0gZ2V0RGVmYXVsdEdyYXBoRGF0YSgpO1xuICAgICAgICB2bS5hbGxvY0dyYXBoRGF0YSA9IFtdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFllYXJGaWx0ZXJPcHRpb25zKCkge1xuICAgICAgICBGaW5hbmNlU2VydmljZS5nZXRGaW5hbmNlWWVhcnMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICRzY29wZS4kcGFyZW50LmZpbmFuY2VZZWFycyA9IGRhdGE7XG4gICAgICAgICAgICAkc2NvcGUuJGVtaXQoJ3NldERlZmF1bHRZZWFycycsIGRhdGFbMF0sIGRhdGFbZGF0YS5sZW5ndGgtMV0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXREZWZhdWx0R3JhcGhEYXRhKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2F2aUFsbG9jOiBbXG4gICAgICAgICAgICAgICAge2tleTogJ0FwcHJvdmVkJywgdmFsdWVzOiBbXX0sXG4gICAgICAgICAgICAgICAge2tleTogJ0Rpc2J1cnNlZCcsIHZhbHVlczogW119XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgZ291QWxsb2M6IFtcbiAgICAgICAgICAgICAgICB7a2V5OiAnQXBwcm92ZWQnLCB2YWx1ZXM6IFtdfSxcbiAgICAgICAgICAgICAgICB7a2V5OiAnRGlzYnVyc2VkJywgdmFsdWVzOiBbXX1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBhbGxPYmxpZzogW1xuICAgICAgICAgICAgICAgIHtrZXk6ICdHYXZpIEZ1bmRzJywgdmFsdWVzOiBbXX0sXG4gICAgICAgICAgICAgICAge2tleTogJ0dPVSBGdW5kcycsIHZhbHVlczogW119XG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZGF0ZUNoYXJ0KGUsIHBhcmFtcykge1xuICAgICAgICByZXNldEdyYXBoRGF0YSgpO1xuICAgICAgICBGaW5hbmNlU2VydmljZS5nZXRGaW5hbmNlRGF0YShwYXJhbXMpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIHllYXJJbmRleCA9IGdldFllYXJJbmRleChkYXRhW2ldLnBlcmlvZClcblxuICAgICAgICAgICAgICAgIHZtLmdyYXBoRGF0YS5hbGxPYmxpZ1swXS52YWx1ZXMucHVzaCh7eDogeWVhckluZGV4LCB5OiBkYXRhW2ldLmdhdmlfYXBwcm92ZWR9KTtcbiAgICAgICAgICAgICAgICB2bS5ncmFwaERhdGEuYWxsT2JsaWdbMV0udmFsdWVzLnB1c2goe3g6IHllYXJJbmRleCwgeTogZGF0YVtpXS5nb3VfYXBwcm92ZWR9KTtcblxuICAgICAgICAgICAgICAgIHZtLmdyYXBoRGF0YS5nYXZpQWxsb2NbMF0udmFsdWVzLnB1c2goe3g6IHllYXJJbmRleCwgeTogZGF0YVtpXS5nYXZpX2FwcHJvdmVkfSk7XG4gICAgICAgICAgICAgICAgdm0uZ3JhcGhEYXRhLmdhdmlBbGxvY1sxXS52YWx1ZXMucHVzaCh7eDogeWVhckluZGV4LCB5OiBkYXRhW2ldLmdhdmlfZGlzYnVyc2VkfSk7XG5cbiAgICAgICAgICAgICAgICB2bS5ncmFwaERhdGEuZ291QWxsb2NbMF0udmFsdWVzLnB1c2goe3g6IHllYXJJbmRleCwgeTogZGF0YVtpXS5nb3VfYXBwcm92ZWR9KTtcbiAgICAgICAgICAgICAgICB2bS5ncmFwaERhdGEuZ291QWxsb2NbMV0udmFsdWVzLnB1c2goe3g6IHllYXJJbmRleCwgeTogZGF0YVtpXS5nb3VfZGlzYnVyc2VkfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKlRyaWdnZXIgdGhlIGxvYWRpbmcgb2YgdGhlIGluaXRhbCBUYWIsIHdpdGggcmFuZG9tIHZhbHVlcyovXG4gICAgICAgICAgICBjaGFuZ2VUYWJzKDAsMSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE9wdGlvbnMoKSB7XG4gICAgICAgIHZhciBjaGFydE9wdGlvbnMgPSBDaGFydFN1cHBvcnRTZXJ2aWNlLmdldE9wdGlvbnMoJ211bHRpQmFyQ2hhcnQnKTtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LmNvbG9yID0gW1wiZ3JlZW5cIiwgXCJEb2RnZXJCbHVlXCJdO1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQud2lkdGggPSA5MDA7XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC5tYXJnaW4gPSB7bGVmdDogNzAsIHRvcDogNzB9O1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQubGVnZW5kLndpZHRoID0gOTAwO1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQueEF4aXMuYXhpc0xhYmVsID0gXCJ5ZWFyc1wiO1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQueUF4aXMuYXhpc0xhYmVsID0gXCJcIjtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LnhBeGlzLnRpY2tGb3JtYXQgPSBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgIHJldHVybiB2bS55ZWFySW5kZXhlc1tkXTtcbiAgICAgICAgfTtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LnZhbHVlRm9ybWF0ID0gZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICByZXR1cm4gdGlja0Zvcm1hdChkMy5mb3JtYXQoJy4wZicpKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGNoYXJ0T3B0aW9ucztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRZZWFySW5kZXgoeWVhcikge1xuICAgICAgICBpZiAodm0ueWVhckluZGV4ZXMuaW5kZXhPZih5ZWFyKSA9PSAtMSkgdm0ueWVhckluZGV4ZXMucHVzaCh5ZWFyKTtcbiAgICAgICAgcmV0dXJuIHZtLnllYXJJbmRleGVzLmluZGV4T2YoeWVhcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hhbmdlVGFicyhuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgaWYgKG5ld1ZhbHVlICE9IG9sZFZhbHVlKSB7XG4gICAgICAgICAgICBDaGFydFN1cHBvcnRTZXJ2aWNlLmNsZWFyTGFiZWxzKCk7XG4gICAgICAgICAgICBpZiAodm0uYWN0aXZlVG9nZ2xlID09ICdHQVZJJylcbiAgICAgICAgICAgICAgICB2bS5hbGxvY0dyYXBoRGF0YSA9IHZtLmdyYXBoRGF0YS5nYXZpQWxsb2M7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdm0uYWxsb2NHcmFwaERhdGEgPSB2bS5ncmFwaERhdGEuZ291QWxsb2M7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpXG4uY29udHJvbGxlcignRnJpZGdlQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0ZyaWRnZVNlcnZpY2UnLCAnJHJvb3RTY29wZScsICdOZ1RhYmxlUGFyYW1zJywgJ0ZpbHRlclNlcnZpY2UnLFxuZnVuY3Rpb24oJHNjb3BlLCBGcmlkZ2VTZXJ2aWNlLCAkcm9vdFNjb3BlLCBOZ1RhYmxlUGFyYW1zLCBGaWx0ZXJTZXJ2aWNlKVxue1xuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2YXIgc2hlbGxTY29wZSA9ICRzY29wZS4kcGFyZW50O1xuICAgIHNoZWxsU2NvcGUuY2hpbGQgPSAkc2NvcGU7XG5cbiAgICB2bS5nZXRGcmlkZ2VBbGxEaXN0cmljdENhcGFjaXR5ID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKSB7XG5cbiAgICAgICAgdm0uc3RhcnRRdWFydGVyID0gdm0uc3RhcnRRdWFydGVyID8gdm0uc3RhcnRRdWFydGVyIDogXCIyMDE2MDFcIjtcbiAgICAgICAgdm0uZW5kUXVhcnRlciA9IHZtLmVuZFF1YXJ0ZXIgPyB2bS5lbmRRdWFydGVyIDogXCIyMDE2MDRcIjtcbiAgICAgICAgZnJpZGdlRGlzdHJpY3QgPSBcIlwiO1xuICAgICAgICB2bS5jYXJlbGV2ZWwgPSBjYXJlbGV2ZWw7XG5cbiAgICAgICAgRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VEaXN0cmljdENhcGFjaXR5KHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuXG4gICAgICAgICAgICB0YWJsZWRhdGFBbGxkaXN0cmljdHMgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zQ2FwYWNpdHlBbGxkaXN0cmljdHMgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YUFsbGRpc3RyaWN0cyxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vPT09PUFkZGl0aW9uYWwgTWV0cmljcz09PT1cblxuICAgICAgICAgICAgICAgIHZhciBtZXRyaWNzID0gRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VDYXBhY2l0eU1ldHJpY3Modm0uZGF0YSk7XG5cbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnVzdXJwID0gbWV0cmljcy5zdXJwbHVzO1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudXN1ZmZpY2llbnQgPSBtZXRyaWNzLnN1ZmZpY2llbnQ7XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC51c2hvcnRhZ2U9IG1ldHJpY3Muc2hvcnRhZ2U7XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uZ2V0RnJpZGdlRGlzdHJpY3RDYXBhY2l0eSA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuXG4gICAgICAgICAgICB2bS5zdGFydFF1YXJ0ZXIgPyB2bS5zdGFydFF1YXJ0ZXIgOiBcIjIwMTYwMVwiO1xuICAgICAgICAgICAgdm0uZW5kUXVhcnRlciA9IHZtLmVuZFF1YXJ0ZXIgPyB2bS5lbmRRdWFydGVyIDogXCIyMDE2MDRcIjtcbiAgICAgICAgICAgIGRpc3RyaWN0ID0gXCJcIjtcbiAgICAgICAgICAgIHZtLmZyaWRnZURpc3RyaWN0ID0gZnJpZGdlRGlzdHJpY3Q7XG4gICAgICAgICAgICB2bS5jYXJlbGV2ZWwgPSBjYXJlbGV2ZWw7XG5cbiAgICAgICAgICAgIEZyaWRnZVNlcnZpY2UuZ2V0RnJpZGdlRGlzdHJpY3RDYXBhY2l0eShzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuXG5cbiAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdG90YWxzXG5cbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmZyaWRnZURpc3RyaWN0ID0gZGlzdHJpY3Q7XG5cblxuXG5cbiAgICAgICAgICAgICAgICAvLyBjb25zdHJ1Y3QgRGlzdHJpY3QgZ3JhcGggZGF0YVxuICAgICAgICAgICAgICAgIHZhciBncmFwaGRhdGEgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgc2VyaWVzUmVxdWlyZWQgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgc2VyaWVzQXZhaWxhYmxlID0gW107XG4gICAgICAgICAgICAgICAgdmFyIHNlcmllc0dhcCA9IFtdO1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuYXZhaWxhYmxlID0gMDtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uZGF0YS5sZW5ndGggOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgc2VyaWVzUmVxdWlyZWQucHVzaChbdm0uZGF0YVtpXS5xdWFydGVyLnNsaWNlKDAsNCkgKyBcIi1RXCIgKyB2bS5kYXRhW2ldLnF1YXJ0ZXIuc2xpY2UoNSw2KSwgdm0uZGF0YVtpXS5yZXF1aXJlZF0pXG4gICAgICAgICAgICAgICAgICAgIHNlcmllc0F2YWlsYWJsZS5wdXNoKFt2bS5kYXRhW2ldLnF1YXJ0ZXIuc2xpY2UoMCw0KSArIFwiLVFcIiArIHZtLmRhdGFbaV0ucXVhcnRlci5zbGljZSg1LDYpLCB2bS5kYXRhW2ldLmF2YWlsYWJsZV0pXG4gICAgICAgICAgICAgICAgICAgIHNlcmllc0dhcC5wdXNoKFt2bS5kYXRhW2ldLnF1YXJ0ZXIuc2xpY2UoMCw0KSArIFwiLVFcIiArIHZtLmRhdGFbaV0ucXVhcnRlci5zbGljZSg1LDYpLCB2bS5kYXRhW2ldLmdhcF0pXG4gICAgICAgICAgICAgICAgICAgIGlmICh2bS5kYXRhW2ldLnF1YXJ0ZXIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5hdmFpbGFibGUgPSB2bS5kYXRhW2ldLmF2YWlsYWJsZVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICBzZXJpZXNSZXF1aXJlZCA9IFtbMjAxNjAyLCAzMF0sIFsyMDE2MDMsIDMwXV07XG4gICAgICAgICAgICAgICAgc2VyaWVzQXZhaWxhYmxlID0gW1syMDE2MDIsIDYwXSwgWzIwMTYwMywgMjBdXTtcbiAgICAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAgICAgZ3JhcGhkYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBrZXk6IFwiUmVxdWlyZWRcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBzZXJpZXNSZXF1aXJlZCxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6JyMyQTQ0OEEnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZ3JhcGhkYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBrZXk6IFwiQXZhaWxhYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlczogc2VyaWVzQXZhaWxhYmxlLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjonZ3JlZW4nXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB2bS5ncmFwaCA9IGdyYXBoZGF0YTtcblxuXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIGdyYXBoXG4gICAgICAgICAgICAgICAgdm0ub3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibXVsdGlCYXJDaGFydFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA0NTAsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDIwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3R0b206IDQ1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IDQ1XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpcEVkZ2U6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgeDogZnVuY3Rpb24oZCl7IHJldHVybiBkWzBdOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogZnVuY3Rpb24oZCl7IHJldHVybiBkWzFdOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dZQXhpczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbG9yOiBmdW5jdGlvbihkKXsgcmV0dXJuICdncmVlbid9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFsdWVGb3JtYXQ6IGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgcmV0dXJuIHRpY2tGb3JtYXQoZDMuZm9ybWF0KCcsLjFmJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfTtcblxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIHZtLmdldEZyaWRnZUZhY2lsaXR5Q2FwYWNpdHkgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcblxuICAgICAgICAgICAgdm0uc3RhcnRRdWFydGVyID8gdm0uc3RhcnRRdWFydGVyIDogXCIyMDE2MDFcIjtcbiAgICAgICAgICAgIHZtLmVuZFF1YXJ0ZXIgPSB2bS5lbmRRdWFydGVyID8gdm0uZW5kUXVhcnRlciA6IFwiMjAxNjA0XCI7XG4gICAgICAgICAgICBkaXN0cmljdCA9IFwiXCI7XG4gICAgICAgICAgICB2bS5kaXN0cmljdCA9IGZyaWRnZURpc3RyaWN0O1xuICAgICAgICAgICAgdm0uY2FyZWxldmVsID0gY2FyZWxldmVsO1xuXG4gICAgICAgICAgICBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZUZhY2lsaXR5Q2FwYWNpdHkoc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcbiAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc19mID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb3VudDogMTVcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB2bS5kYXRhLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRvdGFsc1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZnJpZGdlRGlzdHJpY3QgPSB2bS5mcmlkZ2VEaXN0cmljdDtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmNhcmVsZXZlbCA9IHZtLmNhcmVsZXZlbDtcblxuICAgICAgICAgICAgICAgIC8vPT09PUFkZGl0aW9uYWwgTWV0cmljcz09PT1cblxuICAgICAgICAgICAgICAgIHZhciBtZXRyaWNzID0gRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VDYXBhY2l0eU1ldHJpY3Modm0uZGF0YSk7XG5cbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnV0c3VycCA9IChtZXRyaWNzLnN1cnBsdXMvbWV0cmljcy50b3RhbCkqMTAwO1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudXRzdWZmaWNpZW50ID0gKG1ldHJpY3Muc3VmZmljaWVudC9tZXRyaWNzLnRvdGFsKSoxMDA7XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC51dHNob3J0YWdlPSAobWV0cmljcy5zaG9ydGFnZS9tZXRyaWNzLnRvdGFsKSoxMDA7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgdm0uZ2V0RnJpZGdlQWxsRGlzdHJpY3RSZWZyaWdlcmF0b3IgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcblxuICAgICAgICAgICAgdm0uc3RhcnRRdWFydGVyID0gdm0uc3RhcnRRdWFydGVyID8gdm0uc3RhcnRRdWFydGVyIDogXCIyMDE2MDFcIjtcbiAgICAgICAgICAgIHZtLmVuZFF1YXJ0ZXIgPSB2bS5lbmRRdWFydGVyID8gdm0uZW5kUXVhcnRlciA6IFwiMjAxNjA0XCI7XG4gICAgICAgICAgICBmcmlkZ2VEaXN0cmljdCA9IFwiXCI7XG4gICAgICAgICAgICB2bS5mcmlkZ2VEaXN0cmljdCA9IGZyaWRnZURpc3RyaWN0O1xuICAgICAgICAgICAgdm0uY2FyZWxldmVsID0gY2FyZWxldmVsO1xuXG4gICAgICAgICAgICBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZURpc3RyaWN0UmVmcmlnZXJhdG9yKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG4gICAgICAgICAgICAgICAgdGFibGVkYXRhQWxsZGlzdHJpY3RzID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNGdW5jdGlvbmFsaXR5QWxsZGlzdHJpY3RzID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFBbGxkaXN0cmljdHMsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2bS5nZXRGcmlkZ2VEaXN0cmljdFJlZnJpZ2VyYXRvciA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuXG4gICAgICAgICAgICAgICAgdm0uc3RhcnRRdWFydGVyID0gdm0uc3RhcnRRdWFydGVyID8gdm0uc3RhcnRRdWFydGVyIDogXCIyMDE2MDFcIjtcbiAgICAgICAgICAgICAgICB2bS5lbmRRdWFydGVyID0gdm0uZW5kUXVhcnRlciA/IHZtLmVuZFF1YXJ0ZXIgOiBcIjIwMTYwNFwiO1xuICAgICAgICAgICAgICAgIGRpc3RyaWN0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICB2bS5jYXJlbGV2ZWwgPSBjYXJlbGV2ZWw7XG5cbiAgICAgICAgICAgICAgICBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZURpc3RyaWN0UmVmcmlnZXJhdG9yKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhQWxsZGlzdHJpY3RzID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zQWxsZGlzdHJpY3RzID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFBbGxkaXN0cmljdHMsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfZCA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxNVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdm0uZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zdHJ1Y3QgRGlzdHJpY3QgZ3JhcGggZGF0YVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ3JhcGhmdW5jdGlvbmFsaXR5ZGF0YSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlcmllc0V4aXN0aW5nID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VyaWVzTm90V29ya2luZyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlcmllc21haW50ZW5hbmNlID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZnVuY3Rpb25hbGl0eSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmZyaWRnZURpc3RyaWN0ID0gZGlzdHJpY3Q7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5kYXRhLmxlbmd0aCA7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcmllc0V4aXN0aW5nLnB1c2goW3ZtLmRhdGFbaV0ucXVhcnRlci5zbGljZSgwLDQpICsgXCItUVwiICsgdm0uZGF0YVtpXS5xdWFydGVyLnNsaWNlKDUsNiksIHZtLmRhdGFbaV0ubnVtYmVyX2V4aXN0aW5nXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpZXNOb3RXb3JraW5nLnB1c2goW3ZtLmRhdGFbaV0ucXVhcnRlci5zbGljZSgwLDQpICsgXCItUVwiICsgdm0uZGF0YVtpXS5xdWFydGVyLnNsaWNlKDUsNiksIHZtLmRhdGFbaV0ubm90X3dvcmtpbmddKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcmllc21haW50ZW5hbmNlLnB1c2goW3ZtLmRhdGFbaV0ucXVhcnRlci5zbGljZSgwLDQpICsgXCItUVwiICsgdm0uZGF0YVtpXS5xdWFydGVyLnNsaWNlKDUsNiksIHZtLmRhdGFbaV0ubmVlZHNfbWFpbnRlbmFuY2VdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2bS5kYXRhW2ldLnF1YXJ0ZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5mdW5jdGlvbmFsaXR5ID0gKHZtLmRhdGFbaV0ubnVtYmVyX2V4aXN0aW5nIC0gdm0uZGF0YVtpXS5ub3Rfd29ya2luZykvdm0uZGF0YVtpXS5udW1iZXJfZXhpc3RpbmcqMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBncmFwaGZ1bmN0aW9uYWxpdHlkYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJFeGlzdGluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogc2VyaWVzRXhpc3RpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J2dyZWVuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBncmFwaGZ1bmN0aW9uYWxpdHlkYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJOb3QgV29ya2luZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogc2VyaWVzTm90V29ya2luZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjonIzJBNDQ4QSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhmdW5jdGlvbmFsaXR5ZGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiTmVlZHMgbWFpbnRlbmFuY2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IHNlcmllc21haW50ZW5hbmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOidyZWQnXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ3JhcGhmdW5jdGlvbmFsaXR5ID0gZ3JhcGhmdW5jdGlvbmFsaXR5ZGF0YTtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGUgZ3JhcGhcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLm9wdGlvbnNmdW5jdGlvbmFsaXR5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibXVsdGlCYXJDaGFydFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDQ1MCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDIwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IDIwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiA0NSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IDQ1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dDb250cm9sczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaXBFZGdlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbihkKXsgcmV0dXJuIGRbMF07IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFsxXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1lBeGlzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy92YWx1ZUZvcm1hdDogZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgIHJldHVybiB0aWNrRm9ybWF0KGQzLmZvcm1hdCgnLC4xZicpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cblxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdm0uZ2V0RnJpZGdlRmFjaWxpdHlSZWZyaWdlcmF0b3IgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcblxuICAgICAgICAgICAgICAgICAgICB2bS5zdGFydFF1YXJ0ZXIgPyB2bS5zdGFydFF1YXJ0ZXIgOiBcIjIwMTYwMVwiO1xuICAgICAgICAgICAgICAgICAgICB2bS5lbmRRdWFydGVyID0gdm0uZW5kUXVhcnRlciA/IHZtLmVuZFF1YXJ0ZXIgOiBcIjIwMTYwNFwiO1xuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIHZtLmRpc3RyaWN0ID0gZnJpZGdlRGlzdHJpY3Q7XG4gICAgICAgICAgICAgICAgICAgIHZtLmNhcmVsZXZlbCA9IGNhcmVsZXZlbDtcblxuICAgICAgICAgICAgICAgICAgICBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZUZhY2lsaXR5UmVmcmlnZXJhdG9yKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhQWxsZmFjaWxpdGllcyA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc0FsbGZhY2lsaXRpZXMgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YUFsbGZhY2lsaXRpZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc19mID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB2bS5kYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRvdGFsc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZnJpZGdlRGlzdHJpY3QgPSB2bS5mcmlkZ2VEaXN0cmljdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmNhcmVsZXZlbCA9IHZtLmNhcmVsZXZlbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgdm0uZ2V0RnJpZGdlQWxsRGlzdHJpY3RJbW11bml6aW5nRmFjaWxpdHkgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uc3RhcnRRdWFydGVyID0gdm0uc3RhcnRRdWFydGVyID8gdm0uc3RhcnRRdWFydGVyIDogXCIyMDE2MDFcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmVuZFF1YXJ0ZXIgPSB2bS5lbmRRdWFydGVyID8gdm0uZW5kUXVhcnRlciA6IFwiMjAxNjA0XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcmlkZ2VEaXN0cmljdCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5jYXJlbGV2ZWwgPSBjYXJlbGV2ZWw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIEZyaWRnZVNlcnZpY2UuZ2V0RnJpZGdlRGlzdHJpY3RJbW11bml6aW5nRmFjaWxpdHkoc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxEYXRhID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFBbGxkaXN0cmljdHMgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc0ltbXVuaXppbmdBbGxkaXN0cmljdHMgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YUFsbGRpc3RyaWN0cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldEZyaWRnZURpc3RyaWN0SW1tdW5pemluZ0ZhY2lsaXR5ID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5zdGFydFF1YXJ0ZXIgPyB2bS5zdGFydFF1YXJ0ZXIgOiBcIjIwMTYwMVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmVuZFF1YXJ0ZXIgPSBlbmRRdWFydGVyLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3QgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRpc3RyaWN0ID0gZnJpZGdlRGlzdHJpY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uY2FyZWxldmVsID0gY2FyZWxldmVsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VEaXN0cmljdEltbXVuaXppbmdGYWNpbGl0eShzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YUFsbGZyaWRnZSA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc0FsbGZyaWRnZSA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhQWxsZnJpZGdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zX2QgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHZtLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRvdGFsc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5mcmlkZ2VEaXN0cmljdCA9IGRpc3RyaWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5xdWFydGVyID0gZW5kUXVhcnRlci5uYW1lIC0gMjtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zdHJ1Y3QgRGlzdHJpY3QgZ3JhcGggZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdyYXBoZGF0YWltbXVuaXppbmcgPSBbXTtcblxuXG5cblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmRhdGEubGVuZ3RoIDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIEltbXVuaXppbmcgPSB2bS5kYXRhW2ldLmltbXVuaXppbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIE5vdEltbXVuaXppbmcgPSB2bS5kYXRhW2ldLlRvdGFsX2ZhY2lsaXRpZXMgLSB2bS5kYXRhW2ldLmltbXVuaXppbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmZhY2lsaXR5ID0gdm0uZGF0YVtpXS5pbW11bml6aW5nO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGUgZ3JhcGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLm9wdGlvbnNpbW11bml6aW5nID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwaWVDaGFydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQua2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQueTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0xhYmVsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxUaHJlc2hvbGQ6IDAuMDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsU3VuYmVhbUxheW91dDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ3JhcGhpbW11bml6aW5nID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIkltbXVuaXppbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogSW1tdW5pemluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J2dyZWVuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiTm90IEltbXVuaXppbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogTm90SW1tdW5pemluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6JyMyQTQ0OEEnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kb24oJ3JlZnJlc2hDYXBhY2l0eScsIGZ1bmN0aW9uKGUsIHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihzdGFydFF1YXJ0ZXIgJiYgZW5kUXVhcnRlciAmJiBmcmlkZ2VEaXN0cmljdC5kaXN0cmljdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0RnJpZGdlRGlzdHJpY3RSZWZyaWdlcmF0b3Ioc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdC5kaXN0cmljdCwgY2FyZWxldmVsLmdyb3VwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldEZyaWRnZUFsbERpc3RyaWN0UmVmcmlnZXJhdG9yKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QuZGlzdHJpY3QsIGNhcmVsZXZlbC5ncm91cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRGcmlkZ2VGYWNpbGl0eVJlZnJpZ2VyYXRvcihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LmRpc3RyaWN0LCBjYXJlbGV2ZWwuZ3JvdXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0RnJpZGdlQWxsRGlzdHJpY3RJbW11bml6aW5nRmFjaWxpdHkoc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdC5kaXN0cmljdCwgY2FyZWxldmVsLmdyb3VwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldEZyaWRnZURpc3RyaWN0SW1tdW5pemluZ0ZhY2lsaXR5KHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QuZGlzdHJpY3QsIGNhcmVsZXZlbC5ncm91cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRGcmlkZ2VBbGxEaXN0cmljdENhcGFjaXR5KHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QuZGlzdHJpY3QsIGNhcmVsZXZlbC5ncm91cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRGcmlkZ2VEaXN0cmljdENhcGFjaXR5KHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QuZGlzdHJpY3QsIGNhcmVsZXZlbC5ncm91cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRGcmlkZ2VGYWNpbGl0eUNhcGFjaXR5KHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QuZGlzdHJpY3QsIGNhcmVsZXZlbC5ncm91cCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgXSk7XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJylcbiAgICAuY29udHJvbGxlcignUGxhbm5pbmdDb250cm9sbGVyJywgWyckc2NvcGUnLCAnQW5udWFsU2VydmljZScsICckcm9vdFNjb3BlJywgJ05nVGFibGVQYXJhbXMnLCAnRmlsdGVyU2VydmljZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCBBbm51YWxTZXJ2aWNlLCAkcm9vdFNjb3BlLCBOZ1RhYmxlUGFyYW1zLCBGaWx0ZXJTZXJ2aWNlKVxuICAgIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdmFyIHNoZWxsU2NvcGUgPSAkc2NvcGUuJHBhcmVudDtcbiAgICAgICAgc2hlbGxTY29wZS5jaGlsZCA9ICRzY29wZTtcblxuICAgICAgICB2bS5nZXRGdW5kQWN0aXZpdGllcyA9IGZ1bmN0aW9uKHllYXIpIHtcbiAgICAgICAgICAgIHllYXIgPSBcIlwiXG4gICAgICAgICAgICB2bS55ZWFyID0geWVhcjtcblxuICAgICAgICAgICAgQW5udWFsU2VydmljZS5nZXRGdW5kQWN0aXZpdGllcyh5ZWFyKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlZGF0YV9mdW5kZWQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlZGF0YV91bmZ1bmRlZCA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG5cblxuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFfZnVuZGVkID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuZnVuZCA9PSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YV91bmZ1bmRlZCA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmZ1bmQgPT0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG5cblxuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFmdW5kID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNmdW5kZWQgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDE1XG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YWZ1bmQsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0b3RhbHNcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZ3JhcGhkYXRhZnVuZCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZnVuZGVkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVuZnVuZGVkID0gMDtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2bS5kYXRhW2ldLmZ1bmQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmRlZCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodm0uZGF0YVtpXS5mdW5kID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5mdW5kZWQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG5cblxuXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBncmFwaFxuICAgICAgICAgICAgICAgICAgICB2bS5mdW5kYWN0aXZpdHkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwaWVDaGFydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC5rZXk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC55O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0xhYmVsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsVGhyZXNob2xkOiAwLjAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsU3VuYmVhbUxheW91dDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByaWdodDogMzUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3R0b206IDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGZ1bmRlZCA9PSB2bS5kYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ3JhcGhmdW5kZWRhY3Rpdml0aWVzID0gW107XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc19mdW5kZWQgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YV9mdW5kZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfdW5mdW5kZWQgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YV91bmZ1bmRlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdyYXBoZnVuZGVkYWN0aXZpdGllcyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJGdW5kZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogKGZ1bmRlZCAvIHZtLmRhdGEubGVuZ3RoKSAqIDEwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J2dyZWVuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiVW5mdW5kZWQgQWN0aXZpdGllc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiAodW5mdW5kZWQgLyB2bS5kYXRhLmxlbmd0aCkgKiAxMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOidyZWQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB2bS5nZXRQcmlvcml0eUFjdGl2aXRpZXMgPSBmdW5jdGlvbih5ZWFyKSB7XG4gICAgICAgICAgICB5ZWFyID0gXCJcIlxuICAgICAgICAgICAgdm0ueWVhciA9IHllYXI7XG5cbiAgICAgICAgICAgIEFubnVhbFNlcnZpY2UuZ2V0UHJpb3JpdHlBY3Rpdml0aWVzKHllYXIpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGVkYXRhX3ByaW9yaXR5ZnVuZCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGVkYXRhX3ByaW9yaXR5dW5mdW5kZWQgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhX3ByaW9yaXR5ZnVuZCA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmZ1bmQgPT0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFfcHJpb3JpdHl1bmZ1bmRlZCA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmZ1bmQgPT0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG5cblxuXG5cblxuICAgICAgICAgICAgICAgICAgICBpZiAoZnVuZGVkID09IHZtLmRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5ncmFwaGZ1bmRlZGFjdGl2aXRpZXMgPSBbXTtcblxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc19wcmlvcml0eWZ1bmQ9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxNVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhX3ByaW9yaXR5ZnVuZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc19wcmlvcml0eXVuZnVuZGVkID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDE1XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFfcHJpb3JpdHl1bmZ1bmRlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zdHJ1Y3QgRGlzdHJpY3QgZ3JhcGggZGF0YVxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJpb3JpdHlkYXRhID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciBwcmlvcml0eWRhdGF1biA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgSGlnaHByaW9yaXR5ID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciBNZWRpdW1wcmlvcml0eSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgTG93cHJpb3JpdHkgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIEhpZ2hwcmlvcml0eXVuID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciBNZWRpdW1wcmlvcml0eXVuID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciBMb3dwcmlvcml0eXVuID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5kYXRhLmxlbmd0aCA7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZtLmRhdGFbaV0uZnVuZCA9PSB0cnVlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBIaWdocHJpb3JpdHkucHVzaChbdm0uZGF0YVtpXS5hcmVhLCB2bS5kYXRhW2ldLkhpZ2hdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1lZGl1bXByaW9yaXR5LnB1c2goW3ZtLmRhdGFbaV0uYXJlYSwgdm0uZGF0YVtpXS5NZWRpdW1dKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIExvd3ByaW9yaXR5LnB1c2goW3ZtLmRhdGFbaV0uYXJlYSwgdm0uZGF0YVtpXS5Mb3ddKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSGlnaHByaW9yaXR5dW4ucHVzaChbdm0uZGF0YVtpXS5hcmVhLCB2bS5kYXRhW2ldLkhpZ2hdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1lZGl1bXByaW9yaXR5dW4ucHVzaChbdm0uZGF0YVtpXS5hcmVhLCB2bS5kYXRhW2ldLk1lZGl1bV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTG93cHJpb3JpdHl1bi5wdXNoKFt2bS5kYXRhW2ldLmFyZWEsIHZtLmRhdGFbaV0uTG93XSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHlkYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJISUdIXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBIaWdocHJpb3JpdHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6JyMyQTQ0OEEnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eWRhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIk1FRElVTVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogTWVkaXVtcHJpb3JpdHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J2dyZWVuJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHlkYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJMT1dcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IExvd3ByaW9yaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOid5ZWxsb3cnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLnByaW9yaXR5Z3JhcGggPSBwcmlvcml0eWRhdGE7XG5cblxuICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGUgZ3JhcGhcbiAgICAgICAgICAgICAgICAgICAgdm0ucHJpb3JpdHlvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibXVsdGlCYXJDaGFydFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDQ1MCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6NTAwLFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaXBFZGdlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbihkKXsgcmV0dXJuIGRbMF07IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFsxXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1lBeGlzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93WEF4aXM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdGF0ZUxhYmVsczogNTUsXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eWRhdGF1bi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiSElHSFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogSGlnaHByaW9yaXR5dW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6JyMyQTQ0OEEnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eWRhdGF1bi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiTUVESVVNXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBNZWRpdW1wcmlvcml0eXVuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOidncmVlbidcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5ZGF0YXVuLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJMT1dcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IExvd3ByaW9yaXR5dW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J3llbGxvdydcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdm0ucHJpb3JpdHlncmFwaHVuID0gcHJpb3JpdHlkYXRhdW47XG5cbiAgICAgICAgICAgICAgICAgICAgdm0ucHJpb3JpdHlvcHRpb25zdW4gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJtdWx0aUJhckNoYXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogNDUwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDo1MDAsXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpcEVkZ2U6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFswXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogZnVuY3Rpb24oZCl7IHJldHVybiBkWzFdOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93VmFsdWVzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93WUF4aXM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dYQXhpczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm90YXRlTGFiZWxzOiA1NSxcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJ3JlZnJlc2hBd3AnLCBmdW5jdGlvbihlLCB5ZWFyKSB7XG4gICAgICAgICAgICAgICAgaWYoeWVhci55ZWFyKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uZ2V0RnVuZEFjdGl2aXRpZXMoeWVhci55ZWFyKTtcbiAgICAgICAgICAgICAgICAgICAgdm0uZ2V0UHJpb3JpdHlBY3Rpdml0aWVzKHllYXIueWVhcik7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgXSk7XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJylcbiAgICAuY29udHJvbGxlcignU3RvY2tDb250cm9sbGVyJywgWyckc2NvcGUnLCAnU3RvY2tTZXJ2aWNlJywgJyRyb290U2NvcGUnLCAnTmdUYWJsZVBhcmFtcycsXG4gICAgJ0ZpbHRlclNlcnZpY2UnLCAnTW9udGhTZXJ2aWNlJywgJyRsb2NhdGlvbicsICdDaGFydFN1cHBvcnRTZXJ2aWNlJywgJ0NoYXJ0UERGRXhwb3J0JywgJyR0aW1lb3V0JyxcbiAgICBmdW5jdGlvbigkc2NvcGUsIFN0b2NrU2VydmljZSwgJHJvb3RTY29wZSwgTmdUYWJsZVBhcmFtcywgRmlsdGVyU2VydmljZSwgTW9udGhTZXJ2aWNlLFxuICAgICAgICAkbG9jYXRpb24sIENoYXJ0U3VwcG9ydFNlcnZpY2UsIENoYXJ0UERGRXhwb3J0LCAkdGltZW91dClcbiAgICB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZhciBzaGVsbFNjb3BlID0gJHNjb3BlLiRwYXJlbnQ7XG4gICAgICAgIHNoZWxsU2NvcGUuY2hpbGQgPSAkc2NvcGU7XG4gICAgICAgIHZtLmV4cG9ydFBERiA9IENoYXJ0UERGRXhwb3J0LmV4cG9ydDtcblxuICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmlzQWN0aXZlID0gZnVuY3Rpb24odmlld0xvY2F0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdmlld0xvY2F0aW9uID09PSAkbG9jYXRpb24ucGF0aCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFRvZG86IFVzZSB0aGlzIHRvIHNvcnQgYnkgcGVyZm9ybWFuY2UgKE1hbGlzYSlcbiAgICAgICAgdm0uU29ydEJ5S2V5ID0gZnVuY3Rpb24oYXJyYXksIGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5LnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIHZhciB4ID0gYVtrZXldOyB2YXIgeSA9IGJba2V5XTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCh4IDwgeSkgPyAtMSA6ICgoeCA+IHkpID8gMSA6IDApKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmdldFN0b2NrQnlEaXN0cmljdCA9IGZ1bmN0aW9uKHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSkge1xuXG4gICAgICAgICAgICB2bS5zdGFydE1vbnRoID8gdm0uc3RhcnRNb250aCA6IFwiXCI7XG4gICAgICAgICAgICB2bS5lbmRNb250aCA9IHZtLmVuZE1vbnRoID8gdm0uZW5kTW9udGggOiBcIlwiO1xuICAgICAgICAgICAgLy9Ub2RvOiBUZW1wb3JhcmlseSBkaXNhYmxlIGZpbHRlcmluZyBieSBkaXN0cmljdCBmb3IgdGhlIHRhYmxlXG4gICAgICAgICAgICBkaXN0cmljdCA9IFwiXCJcbiAgICAgICAgICAgIHZtLmRpc3RyaWN0ID0gXCJcIjtcbiAgICAgICAgICAgIHZtLnZhY2NpbmUgPSB2bS5zZWxlY3RlZFZhY2NpbmUgPyB2bS5zZWxlY3RlZFZhY2NpbmUubmFtZSA6IFwiXCI7XG5cbiAgICAgICAgICAgIFN0b2NrU2VydmljZS5nZXRTdG9ja0J5RGlzdHJpY3Qoc3RhcnRNb250aCwgZW5kTW9udGgsIGRpc3RyaWN0LCB2YWNjaW5lKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGVkYXRhX3NvID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZWRhdGFfYm0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlZGF0YV93ciA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGVkYXRhX2FtID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZWRhdGFfc2VhcmNoID1bXTtcblxuICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YV9zbyA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmF0X2hhbmQgPT0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YV9hbSA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmF0X2hhbmQgPiB2YWx1ZS5zdG9ja19yZXF1aXJlbWVudF9fbWF4aW11bTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YV93ciA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgodmFsdWUuYXRfaGFuZCA+IHZhbHVlLnN0b2NrX3JlcXVpcmVtZW50X19taW5pbXVtKSAmJiAodmFsdWUuYXRfaGFuZCA8IHZhbHVlLnN0b2NrX3JlcXVpcmVtZW50X19tYXhpbXVtKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFfYm0gPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoKHZhbHVlLmF0X2hhbmQgPCB2YWx1ZS5zdG9ja19yZXF1aXJlbWVudF9fbWluaW11bSkgJiYgKHZhbHVlLmF0X2hhbmQgPiAwKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhX3NlYXJjaCA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhQWxsZGlzdHJpY3RzID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc0FsbGRpc3RyaWN0cyA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTBcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhQWxsZGlzdHJpY3RzLFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdG90YWxzXG4gICAgICAgICAgICAgICAgICAgIHZhciBub3RoaW5nID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdpdGhpbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBiZWxvd21pbmltdW0gPSAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWJvdmVtYXhpbXVtID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXR1cyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZtLmRhdGFbaV0uYXRfaGFuZCA9PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdGhpbmcrKyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM9XCJTdG9ja2VkIE91dFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoKHZtLmRhdGFbaV0uYXRfaGFuZCA+IHZtLmRhdGFbaV0uc3RvY2tfcmVxdWlyZW1lbnRfX21pbmltdW0pICYmICh2bS5kYXRhW2ldLmF0X2hhbmQgPCB2bS5kYXRhW2ldLnN0b2NrX3JlcXVpcmVtZW50X19tYXhpbXVtKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRoaW4rKyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM9XCJXaXRoaW4gUmFuZ2VcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCh2bS5kYXRhW2ldLmF0X2hhbmQgPCB2bS5kYXRhW2ldLnN0b2NrX3JlcXVpcmVtZW50X19taW5pbXVtKSAmJiAodm0uZGF0YVtpXS5hdF9oYW5kID4gMCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVsb3dtaW5pbXVtKyssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzPVwiQmVsb3cgTUlOXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh2bS5kYXRhW2ldLmF0X2hhbmQgPiB2bS5kYXRhW2ldLnN0b2NrX3JlcXVpcmVtZW50X19tYXhpbXVtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFib3ZlbWF4aW11bSsrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cz1cIkFib3ZlIE1BWFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZGF0YVtpXS5zdGF0dXM9c3RhdHVzO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5zdG9ja2Vkb3V0ID0gKG5vdGhpbmcgLyB2bS5kYXRhLmxlbmd0aCkgKiAxMDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBiYWxhbmNlTW9udGggPSBuZXcgRGF0ZShNb250aFNlcnZpY2UubW9udGhUb0RhdGUoZW5kTW9udGgpKTtcbiAgICAgICAgICAgICAgICAgICAgYmFsYW5jZU1vbnRoLnNldE1vbnRoKGJhbGFuY2VNb250aC5nZXRNb250aCgpIC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudGhlbW9udGggPSBiYWxhbmNlTW9udGg7XG4gICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudmFjY2luZSA9IHZhY2NpbmU7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlIGdyYXBoXG4gICAgICAgICAgICAgICAgICAgIHZtLm9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwaWVDaGFydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC5rZXk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC55O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0xhYmVsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsVGhyZXNob2xkOiAwLjAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsU3VuYmVhbUxheW91dDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByaWdodDogMzUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3R0b206IDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vdGhpbmcgPT0gdm0uZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdyYXBoID0gW107XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc19zbyA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhX3NvLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zX2JtID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFfYm0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfd3IgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YV93cixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc19hbSA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhX2FtLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc19zZWFyY2ggPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YV9zZWFyY2gsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ3JhcGggPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiU3RvY2tlZCBPdXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogKG5vdGhpbmcgLyB2bS5kYXRhLmxlbmd0aCkgKiAxMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjRkYwMDAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiV2l0aGluIFJhbmdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6ICh3aXRoaW4gLyB2bS5kYXRhLmxlbmd0aCkgKiAxMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjRkZGRjAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiQmVsb3cgTUlOXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IChiZWxvd21pbmltdW0gLyB2bS5kYXRhLmxlbmd0aCkgKiAxMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjRkZBNTAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiQWJvdmUgTUFYXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IChhYm92ZW1heGltdW0gLyB2bS5kYXRhLmxlbmd0aCkgKiAxMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjMDA4MDAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uZ2V0U3RvY2tCeURpc3RyaWN0VmFjY2luZSA9IGZ1bmN0aW9uKHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSkge1xuXG4gICAgICAgICAgICB2bS5zdGFydE1vbnRoID8gdm0uc3RhcnRNb250aCA6IFwiTm92IDIwMTVcIjtcbiAgICAgICAgICAgIHZtLmVuZE1vbnRoID0gdm0uZW5kTW9udGggPyB2bS5lbmRNb250aCA6IFwiRGVjIDIwMTZcIjtcbiAgICAgICAgICAgIC8vVG9kbzogVGVtcG9yYXJpbHkgZGlzYWJsZSBmaWx0ZXJpbmcgYnkgZGlzdHJpY3QgZm9yIHRoZSB0YWJsZVxuICAgICAgICAgICAgLy9kaXN0cmljdCA9IFwiXCJcbiAgICAgICAgICAgIHZtLmRpc3RyaWN0ID0gZGlzdHJpY3Q7XG4gICAgICAgICAgICB2bS52YWNjaW5lID0gdmFjY2luZTsgLy92bS5zZWxlY3RlZFZhY2NpbmUgPyB2bS5zZWxlY3RlZFZhY2NpbmUubmFtZSA6IFwiXCI7XG5cbiAgICAgICAgICAgIFN0b2NrU2VydmljZS5nZXRTdG9ja0J5RGlzdHJpY3RWYWNjaW5lKHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb3VudDogMTVcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB2bS5kYXRhLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRvdGFsc1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZGlzdHJpY3QgPSB2bS5kaXN0cmljdDtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnZhY2NpbmUgPSB2bS52YWNjaW5lO1xuXG5cbiAgICAgICAgICAgICAgICAvLyBjb25zdHJ1Y3QgRGlzdHJpYnV0aW9uIGdyYXBoIGRhdGFcbiAgICAgICAgICAgICAgICB2YXIgZ3JhcGhkYXRhRGlzdHJpYnV0aW9uID0gW107XG4gICAgICAgICAgICAgICAgdmFyIHNlcmllc0Rpc3RyaWJ1dGlvbiA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBzZXJpZXNPcmRlcnMgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgbWluX3Nlcmllc0Rpc3RyaWJ1dGlvbiA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBtYXhfc2VyaWVzRGlzdHJpYnV0aW9uID0gW107XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5yZWZyZXNocmF0ZSA9IDA7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmRhdGEubGVuZ3RoIDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcmllc0Rpc3RyaWJ1dGlvbi5wdXNoKFt2bS5kYXRhW2ldLm1vbnRoLCBwYXJzZUludCh2bS5kYXRhW2ldLnJlY2VpdmVkKV0pXG4gICAgICAgICAgICAgICAgICAgIHNlcmllc09yZGVycy5wdXNoKFt2bS5kYXRhW2ldLm1vbnRoLCB2bS5kYXRhW2ldLm9yZGVyZWRdKVxuICAgICAgICAgICAgICAgICAgICBtaW5fc2VyaWVzRGlzdHJpYnV0aW9uLnB1c2goW3ZtLmRhdGFbaV0ubW9udGgsIHZtLmRhdGFbaV0uc3RvY2tfcmVxdWlyZW1lbnRfX21pbmltdW1dKVxuICAgICAgICAgICAgICAgICAgICBtYXhfc2VyaWVzRGlzdHJpYnV0aW9uLnB1c2goW3ZtLmRhdGFbaV0ubW9udGgsIHZtLmRhdGFbaV0uc3RvY2tfcmVxdWlyZW1lbnRfX21heGltdW1dKVxuICAgICAgICAgICAgICAgICAgICBpZiAodm0uZGF0YVtpXS5tb250aCA9PSBNb250aFNlcnZpY2UuZ2V0TW9udGhOdW1iZXIoZW5kTW9udGguc3BsaXQoXCIgXCIpWzBdKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnJlZnJlc2hyYXRlID0gdm0uZGF0YVtpXS5vcmRlcmVkID09IDAgPyAwIDp2bS5kYXRhW2ldLnJlY2VpdmVkL3ZtLmRhdGFbaV0ub3JkZXJlZCoxMDAgO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGdyYXBoZGF0YURpc3RyaWJ1dGlvbi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJNaW5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogbWluX3Nlcmllc0Rpc3RyaWJ1dGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjQTVFODE2J1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGdyYXBoZGF0YURpc3RyaWJ1dGlvbi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJJc3N1ZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogc2VyaWVzRGlzdHJpYnV0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6JyMxRjc3QjQnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZ3JhcGhkYXRhRGlzdHJpYnV0aW9uLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIk9yZGVyZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogc2VyaWVzT3JkZXJzLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J3JlZCdcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGdyYXBoZGF0YURpc3RyaWJ1dGlvbi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJNYXhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogbWF4X3Nlcmllc0Rpc3RyaWJ1dGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjRkY3RjBFJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdm0uZ3JhcGhEaXN0cmlidXRpb24gPSBncmFwaGRhdGFEaXN0cmlidXRpb247XG5cblxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBEaXN0cmlidXRpb24gZ3JhcGhcbiAgICAgICAgICAgICAgICB2bS5vcHRpb25zRGlzdHJpYnV0aW9uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbGluZUNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCA6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdBYmltJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0xlZ2VuZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dDb250cm9sczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW4gOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiA4NSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogNjVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlWTogKFswLDEwMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWdnZXJMYWJlbHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZnVuY3Rpb24oZCl7IHJldHVybiBkWzBdOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFsxXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWw6ICdNb250aHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWNrRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBNb250aFNlcnZpY2UuZ2V0TW9udGhOYW1lKGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWxEaXN0YW5jZTogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZUludGVyYWN0aXZlR3VpZGVsaW5lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVDaGFuZ2U6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInN0YXRlQ2hhbmdlXCIpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZVN0YXRlOiBmdW5jdGlvbihlKXsgY29uc29sZS5sb2coXCJjaGFuZ2VTdGF0ZVwiKTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwU2hvdzogZnVuY3Rpb24oZSl7IGNvbnNvbGUubG9nKFwidG9vbHRpcFNob3dcIik7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcEhpZGU6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInRvb2x0aXBIaWRlXCIpOyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93VmFsdWVzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpY2tGb3JtYXQoZDMuZm9ybWF0KCcsLjFmJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8vIGNvbnN0cnVjdCBVcHRha2UgZ3JhcGggZGF0YVxuXG5cbiAgICAgICAgICAgICAgICAvLyBjb25zdHJ1Y3QgQ29uc3VtcHRpb24gZ3JhcGggZGF0YVxuICAgICAgICAgICAgICAgIHZhciBncmFwaGRhdGFDb25zdW1wdGlvbiA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBzZXJpZXNDb25zdW1wdGlvbiA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXRfc2VyaWVzQ29uc3VtcHRpb24gPSBbXTtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmNvdmVyYWdlID0gMDtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uZGF0YS5sZW5ndGggOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgc2VyaWVzQ29uc3VtcHRpb24ucHVzaChbdm0uZGF0YVtpXS5tb250aCwgdm0uZGF0YVtpXS5jb25zdW1lZF0pXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldF9zZXJpZXNDb25zdW1wdGlvbi5wdXNoKFt2bS5kYXRhW2ldLm1vbnRoLCB2bS5kYXRhW2ldLnN0b2NrX3JlcXVpcmVtZW50X190YXJnZXRdKVxuICAgICAgICAgICAgICAgICAgICBpZiAodm0uZGF0YVtpXS5tb250aCA9PSBNb250aFNlcnZpY2UuZ2V0TW9udGhOdW1iZXIoZW5kTW9udGguc3BsaXQoXCIgXCIpWzBdKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmNvdmVyYWdlID0gdm0uZGF0YVtpXS5zdG9ja19yZXF1aXJlbWVudF9fdGFyZ2V0ID09IDAgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAgOnZtLmRhdGFbaV0uY29uc3VtZWQvdm0uZGF0YVtpXS5zdG9ja19yZXF1aXJlbWVudF9fdGFyZ2V0KjEwMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZ3JhcGhkYXRhQ29uc3VtcHRpb24ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiQWN0dWFsIENvbnN1bXB0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IHNlcmllc0NvbnN1bXB0aW9uXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZ3JhcGhkYXRhQ29uc3VtcHRpb24ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiUGxhbm5lZCBjb25zdW1wdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiB0YXJnZXRfc2VyaWVzQ29uc3VtcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNGRjdGMEUnXG4gICAgICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgICAgIHZtLmdyYXBoQ29uc3VtcHRpb24gPSBncmFwaGRhdGFDb25zdW1wdGlvbjtcblxuXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIENvbnN1bXB0aW9uIGdyYXBoXG4gICAgICAgICAgICAgICAgdm0ub3B0aW9uc0NvbnN1bXB0aW9uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbGluZUNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCA6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdBYmltJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0xlZ2VuZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dDb250cm9sczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW4gOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiA4NSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogNjVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlWTogKFswLDEwMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWdnZXJMYWJlbHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZnVuY3Rpb24oZCl7IHJldHVybiBkWzBdOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFsxXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWw6ICdNb250aHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWNrRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBNb250aFNlcnZpY2UuZ2V0TW9udGhOYW1lKGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWxEaXN0YW5jZTogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZUludGVyYWN0aXZlR3VpZGVsaW5lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVDaGFuZ2U6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInN0YXRlQ2hhbmdlXCIpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZVN0YXRlOiBmdW5jdGlvbihlKXsgY29uc29sZS5sb2coXCJjaGFuZ2VTdGF0ZVwiKTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwU2hvdzogZnVuY3Rpb24oZSl7IGNvbnNvbGUubG9nKFwidG9vbHRpcFNob3dcIik7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcEhpZGU6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInRvb2x0aXBIaWRlXCIpOyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93VmFsdWVzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpY2tGb3JtYXQoZDMuZm9ybWF0KCcsLjFmJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS4kb24oJ3JlZnJlc2gnLCBmdW5jdGlvbihlLCBzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIGlmKHN0YXJ0TW9udGgubmFtZSAmJiBlbmRNb250aC5uYW1lICYmIGRpc3RyaWN0Lm5hbWUgJiYgdmFjY2luZS5uYW1lKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZtLmdldFN0b2NrQnlEaXN0cmljdChzdGFydE1vbnRoLm5hbWUsIGVuZE1vbnRoLm5hbWUsIGRpc3RyaWN0Lm5hbWUsIHZhY2NpbmUubmFtZSk7XG4gICAgICAgICAgICAgICAgdm0uZ2V0U3RvY2tCeURpc3RyaWN0VmFjY2luZShzdGFydE1vbnRoLm5hbWUsIGVuZE1vbnRoLm5hbWUsIGRpc3RyaWN0Lm5hbWUsIHZhY2NpbmUubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG5dKTtcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKS5jb250cm9sbGVyKCdTdG9ja1VwdGFrZUNvbnRyb2xsZXInLCBTdG9ja1VwdGFrZUNvbnRyb2xsZXIpO1xuXG5TdG9ja1VwdGFrZUNvbnRyb2xsZXIuJGluamVjdCA9IFtcbiAgICAnJHNjb3BlJyxcbiAgICAnU3RvY2tTZXJ2aWNlJyxcbiAgICAnTW9udGhTZXJ2aWNlJyxcbiAgICAnQ2hhcnRTdXBwb3J0U2VydmljZScsXG4gICAgJ0NoYXJ0UERGRXhwb3J0JyxcbiAgICAnJHRpbWVvdXQnXG5dO1xuZnVuY3Rpb24gU3RvY2tVcHRha2VDb250cm9sbGVyKCRzY29wZSwgU3RvY2tTZXJ2aWNlLCBNb250aFNlcnZpY2UsIENoYXJ0U3VwcG9ydFNlcnZpY2UsIENoYXJ0UERGRXhwb3J0LCAkdGltZW91dCkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdmFyIHNoZWxsU2NvcGUgPSAkc2NvcGUuJHBhcmVudDtcbiAgICBzaGVsbFNjb3BlLmNoaWxkID0gJHNjb3BlO1xuXG4gICAgc2hlbGxTY29wZS5jaGlsZC51cHRha2UgPSAwO1xuICAgIHZtLmV4cG9ydFBERiA9IENoYXJ0UERGRXhwb3J0LmV4cG9ydDtcblxuXG4gICAgdm0ub3B0aW9uc1VwdGFrZSA9IGdldE9wdGlvbnMoKTtcblxuICAgICRzY29wZS4kb24oJ3JlZnJlc2gnLCB1cGRhdGVDaGFydCk7XG4gICAgZnVuY3Rpb24gdXBkYXRlQ2hhcnQoZSwgc3RhcnRNb250aCwgZW5kTW9udGgsIGRpc3RyaWN0LCB2YWNjaW5lKSB7XG4gICAgICAgIFN0b2NrU2VydmljZS5nZXRTdG9ja0J5RGlzdHJpY3RWYWNjaW5lKHN0YXJ0TW9udGgubmFtZSwgZW5kTW9udGgubmFtZSwgZGlzdHJpY3QubmFtZSwgdmFjY2luZS5uYW1lKVxuICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuXG4gICAgICAgICAgICB2YXIgZ3JhcGhkYXRhVXB0YWtlID0gW107XG4gICAgICAgICAgICB2YXIgc2VyaWVzVXB0YWtlID0gW107XG4gICAgICAgICAgICB2YXIgc3RvY2tEYXRhID0gW107XG4gICAgICAgICAgICB2YXIgaW1tdW5pc2F0aW9uRGF0YSA9IFtdO1xuICAgICAgICAgICAgdmFyIG1vbnRobHlUYXJnZXREYXRhID0gW107XG4gICAgICAgICAgICB2YXIgZm9yY2VTdGFydFplcm9EYXRhID0gW107XG4gICAgICAgICAgICB2YXIgbWF4TW9udGhseVRhcmdldCA9IDA7XG4gICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnVwdGFrZSA9IFwiMFwiO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmRhdGEubGVuZ3RoIDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB2bS5kYXRhW2ldO1xuICAgICAgICAgICAgICAgIC8qIENlcnRhaW4gZGF0YSBoYWQgaW52YWxpZCBwZXJpb2RzIGxpa2UgMjAxNzIgaW5zdGVhZCBvZlxuICAgICAgICAgICAgICAgICAgICAyMDE3MDIgd2hpY2ggd2VyZSBjYXVzaW5nIGVycm9ycy4gSGVuY2UgdGhlIGZpbHRlciBiZWxvdy4gKi9cbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5wZXJpb2QudG9TdHJpbmcoKS5sZW5ndGggPT0gNSkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICB2YXIgbW9udGhJbmRleCA9IGFwcEhlbHBlcnMuZ2V0TW9udGhJbmRleEZyb21QZXJpb2QoaXRlbS5wZXJpb2QsICdDWScpO1xuICAgICAgICAgICAgICAgIHZhciBhdEhhbmQgPSBpdGVtLmF0X2hhbmQgPT0gdW5kZWZpbmVkID8gaXRlbS50b3RhbF9hdF9oYW5kIDogaXRlbS5hdF9oYW5kO1xuICAgICAgICAgICAgICAgIHZhciByZWNlaXZlZCA9IGl0ZW0ucmVjZWl2ZWQgPT0gdW5kZWZpbmVkID8gaXRlbS50b3RhbF9yZWNlaXZlZCA6IGl0ZW0ucmVjZWl2ZWQ7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnN1bWVkID0gaXRlbS5jb25zdW1lZCA9PSB1bmRlZmluZWQgPyBpdGVtLnRvdGFsX2NvbnN1bWVkIDogaXRlbS5jb25zdW1lZDtcbiAgICAgICAgICAgICAgICB2YXIgbW9udGhseVRhcmdldCA9IGl0ZW0uc3RvY2tfcmVxdWlyZW1lbnRfX3RhcmdldCA9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgPyBpdGVtLnRvdGFsX3RhcmdldCA6IGl0ZW0uc3RvY2tfcmVxdWlyZW1lbnRfX3RhcmdldDtcbiAgICAgICAgICAgICAgICB2YXIgdG90YWxTdG9jayA9IGF0SGFuZCArIHJlY2VpdmVkO1xuXG4gICAgICAgICAgICAgICAgbWF4TW9udGhseVRhcmdldCA9IE1hdGgubWF4KG1heE1vbnRobHlUYXJnZXQsIE51bWJlcihtb250aGx5VGFyZ2V0LnRvRml4ZWQoMCkpKTtcbiAgICAgICAgICAgICAgICBzdG9ja0RhdGEucHVzaCh7eDogbW9udGhJbmRleCwgeTogTnVtYmVyKHRvdGFsU3RvY2sudG9GaXhlZCgwKSl9KTtcbiAgICAgICAgICAgICAgICBpbW11bmlzYXRpb25EYXRhLnB1c2goe3g6IG1vbnRoSW5kZXgsIHk6IE51bWJlcihjb25zdW1lZC50b0ZpeGVkKDApKX0pO1xuICAgICAgICAgICAgICAgIG1vbnRobHlUYXJnZXREYXRhLnB1c2goe3g6IG1vbnRoSW5kZXgsIHk6IE51bWJlcihtb250aGx5VGFyZ2V0LnRvRml4ZWQoMCkpfSk7XG4gICAgICAgICAgICAgICAgZm9yY2VTdGFydFplcm9EYXRhLnB1c2goe3g6IG1vbnRoSW5kZXgsIHk6IDB9KTtcblxuICAgICAgICAgICAgICAgIGlmICh2bS5kYXRhW2ldLm1vbnRoID09IE1vbnRoU2VydmljZS5nZXRNb250aE51bWJlcihlbmRNb250aC5uYW1lLnNwbGl0KFwiIFwiKVswXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC51cHRha2UgPSByZWNlaXZlZCA9PSAwICYmIGF0SGFuZCA9PSAwID9cbiAgICAgICAgICAgICAgICAgICAgICAgIDAgOiBNYXRoLnJvdW5kKGNvbnN1bWVkLyh0b3RhbFN0b2NrKSoxMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZ3JhcGhkYXRhVXB0YWtlLnB1c2goe2tleTogJ0F2YWlsYWJsZSBTdG9jaycsIHR5cGU6ICdiYXInLCB5QXhpczogMSwgdmFsdWVzOiBzdG9ja0RhdGF9KTtcbiAgICAgICAgICAgIGdyYXBoZGF0YVVwdGFrZS5wdXNoKHtrZXk6ICdDaGlsZHJlbiBJbW11bmlzZWQnLCB0eXBlOiAnYmFyJywgeUF4aXM6IDEsIHZhbHVlczogaW1tdW5pc2F0aW9uRGF0YX0pO1xuICAgICAgICAgICAgZ3JhcGhkYXRhVXB0YWtlLnB1c2goe2tleTogJ01vbnRobHkgVGFyZ2V0cycsIHR5cGU6ICdsaW5lJywgeUF4aXM6IDEsIHZhbHVlczogbW9udGhseVRhcmdldERhdGF9KTtcbiAgICAgICAgICAgIGdyYXBoZGF0YVVwdGFrZS5wdXNoKHtrZXk6ICcnLCB0eXBlOiAnbGluZScsIHlBeGlzOiAxLCBzdHJva2VXaWR0aDogMCwgdmFsdWVzOiBmb3JjZVN0YXJ0WmVyb0RhdGF9KTtcbiAgICAgICAgICAgIHZtLmdyYXBoVXB0YWtlID0gZ3JhcGhkYXRhVXB0YWtlO1xuICAgICAgICAgICAgdm0ubWF4TW9udGhseVRhcmdldCA9IG1heE1vbnRobHlUYXJnZXQ7XG5cbiAgICAgICAgICAgIHVwZGF0ZUxhYmVscygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRPcHRpb25zKCkge1xuICAgICAgICB2YXIgdXB0YWtlT3B0aW9ucyA9IENoYXJ0U3VwcG9ydFNlcnZpY2UuZ2V0T3B0aW9ucygnbXVsdGlDaGFydCcpO1xuICAgICAgICB1cHRha2VPcHRpb25zLmNoYXJ0LmNvbG9yID0gW1wiZ3JlZW5cIiwgXCJEb2RnZXJCbHVlXCIsIFwicmVkXCIsIFwid2hpdGVcIl07XG4gICAgICAgIHVwdGFrZU9wdGlvbnMuY2hhcnQud2lkdGggPSA5MDA7XG4gICAgICAgIHVwdGFrZU9wdGlvbnMuY2hhcnQubWFyZ2luID0ge2xlZnQ6IDcwLCB0b3A6IDcwfTtcbiAgICAgICAgdXB0YWtlT3B0aW9ucy5jaGFydC5sZWdlbmQud2lkdGggPSA5MDA7XG4gICAgICAgIHVwdGFrZU9wdGlvbnMuY2hhcnQueEF4aXMuYXhpc0xhYmVsID0gXCJNb250aHNcIjtcbiAgICAgICAgdXB0YWtlT3B0aW9ucy5jaGFydC55QXhpcy5heGlzTGFiZWwgPSBcIlwiO1xuICAgICAgICB1cHRha2VPcHRpb25zLmNoYXJ0LnhBeGlzLnRpY2tGb3JtYXQgPSBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgIHJldHVybiBhcHBIZWxwZXJzLmdldE1vbnRoRnJvbU51bWJlcihkLCAnQ1knKTtcbiAgICAgICAgfTtcbiAgICAgICAgdXB0YWtlT3B0aW9ucy5jaGFydC52YWx1ZUZvcm1hdCA9IGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgcmV0dXJuIHRpY2tGb3JtYXQoZDMuZm9ybWF0KCcuMGYnKSk7XG4gICAgICAgIH07XG4gICAgICAgIHVwdGFrZU9wdGlvbnMuY2hhcnQubGVnZW5kLmRpc3BhdGNoLnN0YXRlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB1cGRhdGVMYWJlbHMoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHVwdGFrZU9wdGlvbnM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlTGFiZWxzKCkge1xuICAgICAgICBDaGFydFN1cHBvcnRTZXJ2aWNlLmNsZWFyTGFiZWxzKCk7XG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgQ2hhcnRTdXBwb3J0U2VydmljZS5pbml0TGFiZWxzKCk7XG4gICAgICAgICAgICAvKiBjaGFydC5jbGlwRWRnZSBzZWVtcyBub3QgdG8gYmUgd29ya2luZyxcbiAgICAgICAgICAgIHRoaXMgc2hvdWxkIHNlcnZlIGFzIGEgaGFjayAqL1xuICAgICAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52LW11bHRpYmFyIGdcIikuYXR0cihcImNsaXAtcGF0aFwiLCBcIlwiKTtcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgfVxufVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpLmNvbnRyb2xsZXIoJ1N0b2Nrb3V0VHJlbmRDb250cm9sbGVyJywgU3RvY2tvdXRUcmVuZENvbnRyb2xsZXIpO1xuXG5TdG9ja291dFRyZW5kQ29udHJvbGxlci4kaW5qZWN0ID0gW1xuICAgICckc2NvcGUnLFxuICAgICdTdG9ja1NlcnZpY2UnLFxuICAgICdNb250aFNlcnZpY2UnLFxuICAgICdDaGFydFN1cHBvcnRTZXJ2aWNlJyxcbiAgICAnQ2hhcnRQREZFeHBvcnQnLFxuICAgICckdGltZW91dCdcbl07XG5mdW5jdGlvbiBTdG9ja291dFRyZW5kQ29udHJvbGxlcigkc2NvcGUsIFN0b2NrU2VydmljZSwgTW9udGhTZXJ2aWNlLCBDaGFydFN1cHBvcnRTZXJ2aWNlLCBDaGFydFBERkV4cG9ydCwgJHRpbWVvdXQpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmV4cG9ydFBERiA9IENoYXJ0UERGRXhwb3J0LmV4cG9ydDtcbiAgICB2bS5ncmFwaE9wdGlvbnMgPSBnZXRPcHRpb25zKCk7XG4gICAgdm0uZ3JhcGhEYXRhID0gW107XG5cbiAgICAkc2NvcGUuJG9uKCdyZWZyZXNoJywgdXBkYXRlQ2hhcnQpO1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlQ2hhcnQoZSwgc3RhcnRNb250aCwgZW5kTW9udGgsIGRpc3RyaWN0LCB2YWNjaW5lKSB7XG4gICAgICAgIFN0b2NrU2VydmljZS5nZXRTdG9ja0J5RGlzdHJpY3RWYWNjaW5lKHN0YXJ0TW9udGgubmFtZSwgZW5kTW9udGgubmFtZSwgZGlzdHJpY3QubmFtZSwgdmFjY2luZS5uYW1lKVxuICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuXG4gICAgICAgICAgICB2YXIgZ3JhcGhEYXRhID0gW107XG4gICAgICAgICAgICB2YXIgc3RvY2tEYXRhID0gW107XG4gICAgICAgICAgICB2YXIgc3VwcGx5RGF0YSA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmRhdGEubGVuZ3RoIDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB2bS5kYXRhW2ldO1xuICAgICAgICAgICAgICAgIC8qIENlcnRhaW4gZGF0YSBoYWQgaW52YWxpZCBwZXJpb2RzIGxpa2UgMjAxNzIgaW5zdGVhZCBvZlxuICAgICAgICAgICAgICAgICAgICAyMDE3MDIgd2hpY2ggd2VyZSBjYXVzaW5nIGVycm9ycy4gSGVuY2UgdGhlIGZpbHRlciBiZWxvdy4gKi9cbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5wZXJpb2QudG9TdHJpbmcoKS5sZW5ndGggPT0gNSkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICB2YXIgbW9udGhJbmRleCA9IGFwcEhlbHBlcnMuZ2V0TW9udGhJbmRleEZyb21QZXJpb2QoaXRlbS5wZXJpb2QsICdDWScpO1xuICAgICAgICAgICAgICAgIHZhciBhdEhhbmQgPSBpdGVtLmF0X2hhbmQgPT0gdW5kZWZpbmVkID8gaXRlbS50b3RhbF9hdF9oYW5kIDogaXRlbS5hdF9oYW5kO1xuICAgICAgICAgICAgICAgIHZhciByZWNlaXZlZCA9IGl0ZW0ucmVjZWl2ZWQgPT0gdW5kZWZpbmVkID8gaXRlbS50b3RhbF9yZWNlaXZlZCA6IGl0ZW0ucmVjZWl2ZWQ7XG5cbiAgICAgICAgICAgICAgICBzdG9ja0RhdGEucHVzaCh7eDogbW9udGhJbmRleCwgeTogTnVtYmVyKGF0SGFuZC50b0ZpeGVkKDApKX0pO1xuICAgICAgICAgICAgICAgIHN1cHBseURhdGEucHVzaCh7eDogbW9udGhJbmRleCwgeTogTnVtYmVyKHJlY2VpdmVkLnRvRml4ZWQoMCkpfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGdyYXBoRGF0YS5wdXNoKHtrZXk6ICdTdG9jayBCYWxhbmNlJywgdmFsdWVzOiBzdG9ja0RhdGF9KTtcbiAgICAgICAgICAgIGdyYXBoRGF0YS5wdXNoKHtrZXk6ICdTdXBwbHkgQnkgTk1TJywgdmFsdWVzOiBzdXBwbHlEYXRhfSk7XG4gICAgICAgICAgICB2bS5ncmFwaERhdGEgPSBncmFwaERhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE9wdGlvbnMoKSB7XG4gICAgICAgIHZhciBjaGFydE9wdGlvbnMgPSBDaGFydFN1cHBvcnRTZXJ2aWNlLmdldE9wdGlvbnMoJ211bHRpQmFyQ2hhcnQnKTtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LmNvbG9yID0gW1wiZ3JlZW5cIiwgXCJEb2RnZXJCbHVlXCJdO1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQud2lkdGggPSA5MDA7XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC5tYXJnaW4gPSB7bGVmdDogNzAsIHRvcDogNzB9O1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQubGVnZW5kLndpZHRoID0gOTAwO1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQueEF4aXMuYXhpc0xhYmVsID0gXCJNb250aHNcIjtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LnlBeGlzLmF4aXNMYWJlbCA9IFwiXCI7XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC54QXhpcy50aWNrRm9ybWF0ID0gZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICByZXR1cm4gYXBwSGVscGVycy5nZXRNb250aEZyb21OdW1iZXIoZCwgJ0NZJyk7XG4gICAgICAgIH07XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC52YWx1ZUZvcm1hdCA9IGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgcmV0dXJuIHRpY2tGb3JtYXQoZDMuZm9ybWF0KCcuMGYnKSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBjaGFydE9wdGlvbnM7XG4gICAgfVxuXG59XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJylcbi5jb250cm9sbGVyKCdVbmVwaUNvbnRyb2xsZXInLCBbXG4gICAgJyRzY29wZScsICdDb3ZlcmFnZVNlcnZpY2UnLCdTdG9ja1NlcnZpY2UnLFxuICAgICdNb250aFNlcnZpY2UnLCAnJHJvb3RTY29wZScsICdOZ1RhYmxlUGFyYW1zJyxcbiAgICAnRmlsdGVyU2VydmljZScsICdGcmlkZ2VTZXJ2aWNlJywgJ0NvdmVyYWdlQ2FsY3VsYXRvcicsICckdGltZW91dCcsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCBDb3ZlcmFnZVNlcnZpY2UsIFN0b2NrU2VydmljZSxcbiAgICAgICAgTW9udGhTZXJ2aWNlLCAkcm9vdFNjb3BlLCBOZ1RhYmxlUGFyYW1zLFxuICAgICAgICBGaWx0ZXJTZXJ2aWNlLCBGcmlkZ2VTZXJ2aWNlLCBDb3ZlcmFnZUNhbGN1bGF0b3IsICR0aW1lb3V0KVxuICAgIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdmFyIHNoZWxsU2NvcGUgPSAkc2NvcGUuJHBhcmVudDtcbiAgICAgICAgc2hlbGxTY29wZS5jaGlsZCA9ICRzY29wZTtcblxuICAgICAgICBmdW5jdGlvbiBwZXJpb2REaXNwbGF5KHBlcmlvZClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIG1vbnRoID0gcGFyc2VJbnQocGVyaW9kLnNsaWNlKDQsNikpO1xuICAgICAgICAgICAgcmV0dXJuIE1vbnRoU2VydmljZS5nZXRNb250aE5hbWUobW9udGgpICsgXCIgXCIgKyBwZXJpb2Quc2xpY2UoMCw0KVxuICAgICAgICB9XG5cbiAgICAgICAgdm0uZ2V0VW5lcGlDb3ZlcmFnZSA9IGZ1bmN0aW9uKHBlcmlvZCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB7cGVyaW9kLCBkaXN0cmljdH07XG5cbiAgICAgICAgICAgIHZhciBnZXRWYWx1ZVN1bSA9IGZ1bmN0aW9uKGRhdGEsIG5hbWUsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YS5yZWR1Y2UoZnVuY3Rpb24oYWNjdW11bGF0b3IsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS52YWNjaW5lX19uYW1lID09IHZhY2NpbmUpIHJldHVybiBhY2N1bXVsYXRvciArIHZhbHVlW25hbWVdXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIENvdmVyYWdlU2VydmljZS5nZXRWYWNjaW5lRG9zZXNCeVBlcmlvZChwYXJhbXMpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciB0YWJsZURhdGEgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgcGVudGFDUiA9IDAsXG4gICAgICAgICAgICAgICAgICAgIHBjdkNSID0gMDtcblxuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZGlzdHJpY3QgPSBkaXN0cmljdDtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLkdhcCA9IDA7XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5kcm9wb3V0X1BlbnRhID0gMDtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmRyb3BvdXRfaHB2ID0gMDtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmNhdGVnb3J5ID0gMDtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnBlcmlvZE1vbnRoID0gcGVyaW9kRGlzcGxheShwZXJpb2QpO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhUGVyaW9kID0gZGF0YVtpXS5wZXJpb2RcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3REb3NlID0gZGF0YVtpXS50b3RhbF9sYXN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmaXJzdERvc2UgPSBkYXRhW2ldLnRvdGFsX2ZpcnN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWNvbmREb3NlID0gZGF0YVtpXS50b3RhbF9zZWNvbmRfZG9zZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBsYW5uZWQgPSBkYXRhW2ldLnRvdGFsX3BsYW5uZWQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWNjaW5lID0gZGF0YVtpXS52YWNjaW5lX19uYW1lO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhUGVyaW9kICE9IHBlcmlvZCkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogU3VtIHVwIHRoZSB2YWx1ZXMgZnJvbSBzdGFydCBvZiB5ZWFyIHRvIHNlbGVjdGVkIHBlcmlvZFxuICAgICAgICAgICAgICAgICAgICAgdG8gY2FsY3VsYXRlIEFubnVhbGl6ZWQgQ292ZXJhZ2UgKGF2b2MpICovXG4gICAgICAgICAgICAgICAgICAgIHZhciB0b3RhbExhc3REb3NlID0gZ2V0VmFsdWVTdW0oZGF0YSwgJ3RvdGFsX2xhc3RfZG9zZScsIHZhY2NpbmUpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG90YWxQbGFubmVkID0gZ2V0VmFsdWVTdW0oZGF0YSwgJ3RvdGFsX3BsYW5uZWQnLCB2YWNjaW5lKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgY292ZXJhZ2VSYXRlID0gQ292ZXJhZ2VDYWxjdWxhdG9yLmNhbGN1bGF0ZUNvdmVyYWdlUmF0ZShsYXN0RG9zZSwgcGxhbm5lZCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkcm9wb3V0UmF0ZSA9IENvdmVyYWdlQ2FsY3VsYXRvci5jYWxjdWxhdGVEcm9wb3V0UmF0ZShmaXJzdERvc2UsIGxhc3REb3NlKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlZENhdGVnb3J5ID0gQ292ZXJhZ2VDYWxjdWxhdG9yLmNhbGN1bGF0ZVJlZENhdGVnb3J5KGZpcnN0RG9zZSwgbGFzdERvc2UsIHBsYW5uZWQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXZvYyA9IENvdmVyYWdlQ2FsY3VsYXRvci5jYWxjdWxhdGVDb3ZlcmFnZVJhdGUodG90YWxMYXN0RG9zZSwgdG90YWxQbGFubmVkKTtcblxuICAgICAgICAgICAgICAgICAgICB0YWJsZURhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAndmFjY2luZSc6IHZhY2NpbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAncGxhbm5lZF9jb25zdW1wdGlvbic6IHBsYW5uZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAnY292ZXJhZ2VfcmF0ZSc6IGNvdmVyYWdlUmF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdhdm9jJzogYXZvY1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHZhY2NpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJQRU5UQVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlbnRhQ1IgPSBjb3ZlcmFnZVJhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5kcm9wb3V0X1BlbnRhID0gZHJvcG91dFJhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5jYXRlZ29yeSA9IHJlZENhdGVnb3J5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlBDVlwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBjdkNSID0gY292ZXJhZ2VSYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkhQVlwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZHJvcG91dF9ocHYgPSBkcm9wb3V0UmF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuR2FwID0gcGVudGFDUiAtIHBjdkNSO1xuXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHtwYWdlOiAxLCBjb3VudDogMTB9O1xuICAgICAgICAgICAgICAgIHZhciBzZXR0aW5ncyA9IHtmaWx0ZXJEZWxheTogMCwgY291bnRzOiBbXSwgZGF0YTogdGFibGVEYXRhfTtcbiAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc0Rvc2VzID0gbmV3IE5nVGFibGVQYXJhbXMocGFyYW1zLCBzZXR0aW5ncyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZtLmdldFVuZXBpTmF0aW9uYWxTdG9jayA9IGZ1bmN0aW9uKGVuZE1vbnRoLCBkaXN0cmljdCkge1xuICAgICAgICAgICAgU3RvY2tTZXJ2aWNlLmdldFVuZXBpU3RvY2soZW5kTW9udGgsIGRpc3RyaWN0KS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFibGVkYXRhQWxsc3RvY2sgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgc3RvY2tlZE91dEFudGlnZW5zID0gMDtcblxuICAgICAgICAgICAgICAgIC8qIFR1cm4gdGhlIGRpc3RyaWN0IGJhc2VkIGRhdGEgaW50byBhZ2dyZWdhdGVkXG4gICAgICAgICAgICAgICAgdmFjY2luZSBiYXNlZCBkYXRhICovXG4gICAgICAgICAgICAgICAgdmFyIHZhY2NpbmVEYXRhID0gZGF0YS5yZWR1Y2UoZnVuY3Rpb24oYWNjLCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghIChpdGVtLnZhY2NpbmUgaW4gYWNjKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY1tpdGVtLnZhY2NpbmVdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0X2hhbmQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvY2tfcmVxdWlyZW1lbnRfX21pbmltdW06IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJlZDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdW1lZDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVfc3RvY2s6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgYWNjW2l0ZW0udmFjY2luZV0uYXRfaGFuZCArPSBpdGVtLmF0X2hhbmQ7XG4gICAgICAgICAgICAgICAgICAgIGFjY1tpdGVtLnZhY2NpbmVdLnN0b2NrX3JlcXVpcmVtZW50X19taW5pbXVtICs9IGl0ZW0uc3RvY2tfcmVxdWlyZW1lbnRfX21pbmltdW07XG4gICAgICAgICAgICAgICAgICAgIGFjY1tpdGVtLnZhY2NpbmVdLnJlY2VpdmVkICs9IGl0ZW0ucmVjZWl2ZWQ7XG4gICAgICAgICAgICAgICAgICAgIGFjY1tpdGVtLnZhY2NpbmVdLm9yZGVyZWQgKz0gaXRlbS5vcmRlcmVkO1xuICAgICAgICAgICAgICAgICAgICBhY2NbaXRlbS52YWNjaW5lXS5jb25zdW1lZCArPSBpdGVtLmNvbnN1bWVkO1xuICAgICAgICAgICAgICAgICAgICBhY2NbaXRlbS52YWNjaW5lXS5hdmFpbGFibGVfc3RvY2sgKz0gaXRlbS5hdmFpbGFibGVfc3RvY2s7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgICAgICB9LCB7fSk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciB2YWNjaW5lIGluIHZhY2NpbmVEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdEhhbmQgPSB2YWNjaW5lRGF0YVt2YWNjaW5lXS5hdF9oYW5kO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWluU3RvY2sgPSB2YWNjaW5lRGF0YVt2YWNjaW5lXS5zdG9ja19yZXF1aXJlbWVudF9fbWluaW11bTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9yZGVyZWQgPSB2YWNjaW5lRGF0YVt2YWNjaW5lXS5vcmRlcmVkO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVjZWl2ZWQgPSB2YWNjaW5lRGF0YVt2YWNjaW5lXS5yZWNlaXZlZDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnN1bWVkID0gdmFjY2luZURhdGFbdmFjY2luZV0uY29uc3VtZWQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdmFpbGFibGVTdG9jayA9IGF0SGFuZCArIHJlY2VpdmVkO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbW9udGhzU3RvY2sgPSBNYXRoLnJvdW5kKGF0SGFuZCAvIG1pblN0b2NrKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobW9udGhzU3RvY2sgPT0gMCkgc3RvY2tlZE91dEFudGlnZW5zKys7XG5cbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhQWxsc3RvY2sucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWNjaW5lOiB2YWNjaW5lLFxuICAgICAgICAgICAgICAgICAgICAgICAgTW9udGhzX3N0b2NrOiBtb250aHNTdG9jayxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlZmlsbF9yYXRlOiAob3JkZXJlZCA9PSAwKSA/IDAgOiBNYXRoLnJvdW5kKChyZWNlaXZlZCAvIG9yZGVyZWQpICogMTAwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwdGFrZV9yYXRlOiAoYXZhaWxhYmxlU3RvY2sgPT0gMCkgPyAwIDogTWF0aC5yb3VuZCgoY29uc3VtZWQgLyBhdmFpbGFibGVTdG9jaykgKiAxMDApXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuQW50aWdlbl9zdG9ja2Vkb3V0ID0gc3RvY2tlZE91dEFudGlnZW5zO1xuXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHtwYWdlOiAxLCBjb3VudDogMTB9O1xuICAgICAgICAgICAgICAgIHZhciBzZXR0aW5ncyA9IHtmaWx0ZXJEZWxheTogMCwgY291bnRzOiBbXSwgZGF0YTogdGFibGVkYXRhQWxsc3RvY2t9O1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zU3RvY2sgPSBuZXcgTmdUYWJsZVBhcmFtcyhwYXJhbXMsIHNldHRpbmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICAgICB2bS5nZXRVbmVwaVN0b2NrID0gZnVuY3Rpb24oZW5kTW9udGgsIGRpc3RyaWN0KSB7XG5cbiAgICAgICAgICAgICAgICB2bS5lbmRNb250aCA9IHZtLmVuZE1vbnRoID8gdm0uZW5kTW9udGggOiBcIlwiO1xuXG4gICAgICAgICAgICAgICAgU3RvY2tTZXJ2aWNlLmdldFVuZXBpU3RvY2soIGVuZE1vbnRoLCBkaXN0cmljdClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlZGF0YUFsbHN0b2NrID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG5cblxuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YUFsbHN0b2NrID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNTdG9jayA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhQWxsc3RvY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5BbnRpZ2VuX3N0b2NrZWRvdXQgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmRhdGEubGVuZ3RoIDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodm0uZGF0YVtpXS5Nb250aHNfc3RvY2sgPT0gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuQW50aWdlbl9zdG9ja2Vkb3V0Kys7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIENvbGQgQ2hhaW4gJiBVbmVwaSBEaXN0cmljdCBmaWx0ZXJzIHVzZWQgZGlmZmVyZW50IGRhdGEgc291cmNlc1xuICAgICAgICAgICAgICAgIEZvciB0aGF0IHJlYXNvbiB0byB1c2UgdGhlIENvbGQgQ2hhaW4gYXBpLCB0aGUgZGlzdHJpY3QgbmFtZVxuICAgICAgICAgICAgICAgIGhhcyB0byBiZSByZWZvcm1hdHRlZCB0byBtYXRjaCB0aGUgY29sZCBjaGFpbiBkaXN0cmljdCBmaWx0ZXIuXG4gICAgICAgICAgICAgICAgQFRvZG86IFN0YW5kYXJkaXplIHRoZSBkaXN0cmljdCB2YWx1ZXNcbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHZtLnBhcnNlRGlzdHJpY3QgPSBmdW5jdGlvbihkaXN0cmljdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGlzdHJpY3QucmVwbGFjZShcIiBEaXN0cmljdFwiLCBcIlwiKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2bS5nZXRVbmVwaUNvbGRDaGFpbkNhcGFjaXR5ID0gZnVuY3Rpb24oZW5kTW9udGgsIGRpc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0ID0gdm0ucGFyc2VEaXN0cmljdChkaXN0cmljdCk7XG5cbiAgICAgICAgICAgICAgICAgICAgRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VGYWNpbGl0eUNhcGFjaXR5KHVuZGVmaW5lZCwgZW5kTW9udGgsIGRpc3RyaWN0LCB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtZXRyaWNzID0gRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VDYXBhY2l0eU1ldHJpY3MoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLm1ldHJpY3MgPSBtZXRyaWNzO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5wZXIgPSBhcHBIZWxwZXJzLnBlcjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZtLmdldFVuZXBpQ29sZENoYWluRnVuY3Rpb25hbGl0eSA9IGZ1bmN0aW9uKGVuZE1vbnRoLCBkaXN0cmljdCkge1xuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdCA9IHZtLnBhcnNlRGlzdHJpY3QoZGlzdHJpY3QpO1xuXG4gICAgICAgICAgICAgICAgICAgIEZyaWRnZVNlcnZpY2UuZ2V0RnJpZGdlRGlzdHJpY3RSZWZyaWdlcmF0b3IodW5kZWZpbmVkLCBlbmRNb250aCwgZGlzdHJpY3QsIHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWdncmVnYXRlcyA9IGRhdGEucmVkdWNlKGZ1bmN0aW9uKGFjYywgaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjYy50b3RhbEVxdWlwbWVudCArPSBpdGVtLm51bWJlcl9leGlzdGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2MudG90YWxXb3JraW5nV2VsbCArPSBpdGVtLndvcmtpbmdfd2VsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2MudG90YWxOb3RXb3JraW5nV2VsbCArPSBpdGVtLm5vdF93b3JraW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjYy50b3RhbE5lZWRNYWludGVuYW5jZSArPSBpdGVtLm5lZWRzX21haW50ZW5hbmNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjYy50b3RhbEZhY2lsaXRpZXMgKz0gaXRlbS50b3RhbF9mYWNpbGl0aWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7dG90YWxFcXVpcG1lbnQ6MCwgdG90YWxGYWNpbGl0aWVzOjAsIHRvdGFsV29ya2luZ1dlbGw6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxOb3RXb3JraW5nV2VsbDowLCB0b3RhbE5lZWRNYWludGVuYW5jZTogMH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLm51bWJlck9mQ29sZGNoYWluRXF1aXBtZW50ID0gYWdncmVnYXRlcy50b3RhbEVxdWlwbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQubnVtYmVyT2ZGYWNpbGl0aWVzID0gYWdncmVnYXRlcy50b3RhbEZhY2lsaXRpZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLm51bWJlcldvcmtpbmdXZWxsID0gYWdncmVnYXRlcy50b3RhbFdvcmtpbmdXZWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5udW1iZXJOb3RXb3JraW5nV2VsbCA9IGFnZ3JlZ2F0ZXMudG90YWxOb3RXb3JraW5nV2VsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQubnVtYmVyTmVlZE1haW50ZW5hbmNlID0gYWdncmVnYXRlcy50b3RhbE5lZWRNYWludGVuYW5jZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQucGVyID0gYXBwSGVscGVycy5wZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLm51bWJlcldvcmtpbmcgPSBhZ2dyZWdhdGVzLnRvdGFsRXF1aXBtZW50IC0gYWdncmVnYXRlcy50b3RhbE5vdFdvcmtpbmdXZWxsO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdm0uZW5hYmxlUERGRG93bmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZG93bmxvYWRQREYgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnByaW50VmlldyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwZGYgPSBuZXcganNQREYoJ3AnLCAnbW0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGRmLmFkZEhUTUwoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmVwaVJlcG9ydFwiKSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGRmLnNhdmUoJ3VuZXBpLXJlcG9ydC5wZGYnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxMDApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQucHJpbnRWaWV3ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICRzY29wZS4kb24oJ3JlZnJlc2gnLCBmdW5jdGlvbihlLCBzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoc3RhcnRNb250aC5uYW1lICYmIGVuZE1vbnRoLm5hbWUgJiYgZGlzdHJpY3QubmFtZSAmJiB2YWNjaW5lLm5hbWUpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldFVuZXBpQ292ZXJhZ2UoZW5kTW9udGgucGVyaW9kLCBkaXN0cmljdC5uYW1lLCB2YWNjaW5lLm5hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlzdHJpY3QubmFtZSA9PSBcIk5hdGlvbmFsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRVbmVwaU5hdGlvbmFsU3RvY2soZW5kTW9udGgubmFtZSwgZGlzdHJpY3QubmFtZSwgdmFjY2luZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0VW5lcGlTdG9jayhlbmRNb250aC5uYW1lLCBkaXN0cmljdC5uYW1lLCB2YWNjaW5lLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0VW5lcGlDb2xkQ2hhaW5DYXBhY2l0eShlbmRNb250aC5uYW1lLCBkaXN0cmljdC5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldFVuZXBpQ29sZENoYWluRnVuY3Rpb25hbGl0eShlbmRNb250aC5uYW1lLCBkaXN0cmljdC5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmVuYWJsZVBERkRvd25sb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuICAgICAgICBdKTtcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiJdfQ==
