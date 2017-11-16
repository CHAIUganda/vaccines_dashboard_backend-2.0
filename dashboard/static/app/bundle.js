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
                    startYear: params.startYear,
                    endYear: params.endYear
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9oZWxwZXJzLmpzIiwic2hhcmVkL2FubnVhbFNlcnZpY2UuanMiLCJzaGFyZWQvY2hhcnRQREZFeHBvcnRTZXJ2aWNlLmpzIiwic2hhcmVkL2NoYXJ0U3VwcG9ydFNlcnZpY2UuanMiLCJzaGFyZWQvY292ZXJhZ2VDYWxjdWxhdG9yU2VydmljZS5qcyIsInNoYXJlZC9jb3ZlcmFnZVNlcnZpY2UuanMiLCJzaGFyZWQvZmlsdGVyU2VydmljZS5qcyIsInNoYXJlZC9maW5hbmNlU2VydmljZS5qcyIsInNoYXJlZC9mcmlkZ2VTZXJ2aWNlLmpzIiwic2hhcmVkL21haW5Db250cm9sbGVyLmpzIiwic2hhcmVkL21hcFN1cHBvcnRTZXJ2aWNlLmpzIiwic2hhcmVkL3N0b2NrU2VydmljZS5qcyIsImNvbXBvbmVudHMvY292ZXJhZ2UvYW5udWFsQ292ZXJhZ2VDb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9jb3ZlcmFnZS9jb3ZlcmFnZUNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL2ZpbmFuY2UvZmluYW5jZURhdGFDb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9maW5hbmNlL21haW5GaW5hbmNlQ29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvZnJpZGdlL2ZyaWRnZUNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL3BsYW5uaW5nL1BsYW5uaW5nQ29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvc3RvY2svc3RvY2tDb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9zdG9jay9zdG9ja1VwdGFrZUNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL3N0b2NrL3N0b2Nrb3V0VHJlbmRDb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy91bmVwaS9VbmVwaUNvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2b0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAod2luZG93LCBkb2N1bWVudCkge1xuICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgdmFyIGFwcEhlbHBlcnMgPSB3aW5kb3cuYXBwSGVscGVycyB8fCAod2luZG93LmFwcEhlbHBlcnMgPSB7fSk7XG5cbiAgICAgdmFyIHBlciA9IGZ1bmN0aW9uKHZhbHVlLCB0b3RhbCkge1xuICAgICAgICAgdmFyIHBlcmNlbnRhZ2UgPSAodmFsdWUvdG90YWwpICogMTAwO1xuICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQocGVyY2VudGFnZSAqIDEwKSAvIDEwO1xuICAgICB9O1xuXG4gICAgIHZhciBnZW5lcmF0ZUxhYmVsRnJvbVBlcmlvZCA9IGZ1bmN0aW9uKHBlcmlvZCkge1xuICAgICAgICAgcGVyaW9kID0gcGVyaW9kLnRvU3RyaW5nKCk7XG4gICAgICAgICB2YXIgeWVhciA9IHBlcmlvZC5zdWJzdHIoMiwyKTtcbiAgICAgICAgIHZhciBtb250aCA9IE51bWJlcihwZXJpb2Quc3Vic3RyKDQsMikpO1xuXG4gICAgICAgICB2YXIgbW9udGhzID0gWycnLCAnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXB0JywgJ09jdCcsICdOb3YnLCAnRGVjJ107XG4gICAgICAgICByZXR1cm4gbW9udGhzW21vbnRoXSArIFwiJ1wiK3llYXI7XG4gICAgfTtcblxuICAgIHZhciBnZW5lcmF0ZUZ1bGxMYWJlbEZyb21QZXJpb2QgPSBmdW5jdGlvbihwZXJpb2QpIHtcbiAgICAgICAgcGVyaW9kID0gcGVyaW9kLnRvU3RyaW5nKCk7XG4gICAgICAgIHZhciB5ZWFyID0gcGVyaW9kLnN1YnN0cigwLDQpO1xuICAgICAgICB2YXIgbW9udGggPSBOdW1iZXIocGVyaW9kLnN1YnN0cig0LDIpKTtcblxuICAgICAgICB2YXIgbW9udGhzID0gWycnLCAnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsXG4gICAgICAgICAgICAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInXTtcbiAgICAgICAgcmV0dXJuIG1vbnRoc1ttb250aF0gKyBcIiBcIit5ZWFyO1xuICAgfTtcblxuICAgIHZhciBnZXRNb250aEZyb21OdW1iZXIgPSBmdW5jdGlvbih2YWx1ZSwgeWVhclR5cGUpIHtcbiAgICAgICAgdmFyIG1vbnRocyA9IFsnJywgJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwdCcsICdPY3QnLCAnTm92JywgJ0RlYyddO1xuICAgICAgICB2YXIgbW9udGhzRlkgPSBbJycsICdKdWwnLCAnQXVnJywgJ1NlcHQnLCAnT2N0JywgJ05vdicsICdEZWMnLCAnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nXTtcblxuICAgICAgICBpZiAoeWVhclR5cGUgPT0gJ0NZJykge1xuICAgICAgICAgICAgcmV0dXJuIG1vbnRoc1t2YWx1ZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbW9udGhzRllbdmFsdWVdO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBnZXRQZXJpb2RTdHJpbmcgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICAgICAgICBpZiAobW9udGggPCAxMCkge1xuICAgICAgICAgICAgcmV0dXJuIHllYXIgKyBcIjBcIiArIG1vbnRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHllYXIgKyBcIlwiICsgIG1vbnRoO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBnZXRNb250aEluZGV4RnJvbVBlcmlvZCA9IGZ1bmN0aW9uKHBlcmlvZCwgeWVhclR5cGUpIHtcbiAgICAgICAgcGVyaW9kID0gcGVyaW9kLnRvU3RyaW5nKCk7XG4gICAgICAgIHZhciBtb250aCA9IE51bWJlcihwZXJpb2Quc3Vic3RyKDQsMikpO1xuXG4gICAgICAgIGlmICh5ZWFyVHlwZSA9PSAnQ1knKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9udGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobW9udGggPj0gNykge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyhtb250aCAtIDcpICsgMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChtb250aCArIDYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBnZXRNb250aEZyb21QZXJpb2QgPSBmdW5jdGlvbihwZXJpb2QsIHllYXJUeXBlKSB7XG4gICAgICAgIHBlcmlvZCA9IHBlcmlvZC50b1N0cmluZygpO1xuICAgICAgICByZXR1cm4gTnVtYmVyKHBlcmlvZC5zdWJzdHIoNCwyKSk7XG4gICAgfTtcblxuICAgIHZhciBnZXRZZWFyRnJvbVBlcmlvZCA9IGZ1bmN0aW9uKHBlcmlvZCwgeWVhclR5cGUpIHtcbiAgICAgICAgcGVyaW9kID0gcGVyaW9kLnRvU3RyaW5nKCk7XG4gICAgICAgIHJldHVybiBOdW1iZXIocGVyaW9kLnN1YnN0cigwLDQpKTtcbiAgICB9O1xuXG4gICAgdmFyIGdldFllYXJMYWJlbEZyb21QZXJpb2QgPSBmdW5jdGlvbihwZXJpb2QsIHllYXJUeXBlKSB7XG4gICAgICAgIHBlcmlvZCA9IHBlcmlvZC50b1N0cmluZygpO1xuICAgICAgICB2YXIgeWVhciA9IHBlcmlvZC5zdWJzdHIoMCw0KTtcbiAgICAgICAgdmFyIG1vbnRoID0gTnVtYmVyKHBlcmlvZC5zdWJzdHIoNCwyKSk7XG5cbiAgICAgICAgaWYgKHllYXJUeXBlID09ICdDWScpIHtcbiAgICAgICAgICAgIHJldHVybiB5ZWFyO1xuICAgICAgICB9IGVsc2UgaWYgKHllYXJUeXBlID09ICdGWScpIHtcbiAgICAgICAgICAgIGlmIChtb250aCA8PSA2KSB7XG4gICAgICAgICAgICAgICAgdmFyIHByZXZZZWFyID0gTnVtYmVyKHllYXIpIC0gMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJldlllYXIgKyBcIi1cIiArIHllYXI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBuZXh0WWVhciA9IE51bWJlcih5ZWFyKSArIDE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHllYXIgKyBcIi1cIiArIG5leHRZZWFyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgIC8vIHB1Ymxpc2ggZXh0ZXJuYWwgQVBJIGJ5IGV4dGVuZGluZyBhcHBIZWxwZXJzXG4gICAgIGZ1bmN0aW9uIHB1Ymxpc2hFeHRlcm5hbEFQSShhcHBIZWxwZXJzKSB7XG4gICAgICAgICBhbmd1bGFyLmV4dGVuZChhcHBIZWxwZXJzLCB7XG4gICAgICAgICAgICAgJ3Blcic6IHBlcixcbiAgICAgICAgICAgICAnZ2VuZXJhdGVMYWJlbEZyb21QZXJpb2QnOiBnZW5lcmF0ZUxhYmVsRnJvbVBlcmlvZCxcbiAgICAgICAgICAgICAnZ2VuZXJhdGVGdWxsTGFiZWxGcm9tUGVyaW9kJzogZ2VuZXJhdGVGdWxsTGFiZWxGcm9tUGVyaW9kLFxuICAgICAgICAgICAgICdnZXRQZXJpb2RTdHJpbmcnOiBnZXRQZXJpb2RTdHJpbmcsXG4gICAgICAgICAgICAgJ2dldFllYXJMYWJlbEZyb21QZXJpb2QnOiBnZXRZZWFyTGFiZWxGcm9tUGVyaW9kLFxuICAgICAgICAgICAgICdnZXRNb250aEZyb21QZXJpb2QnOiBnZXRNb250aEZyb21QZXJpb2QsXG4gICAgICAgICAgICAgJ2dldFllYXJGcm9tUGVyaW9kJzogZ2V0WWVhckZyb21QZXJpb2QsXG4gICAgICAgICAgICAgJ2dldE1vbnRoSW5kZXhGcm9tUGVyaW9kJzogZ2V0TW9udGhJbmRleEZyb21QZXJpb2QsXG4gICAgICAgICAgICAgJ2dldE1vbnRoRnJvbU51bWJlcic6IGdldE1vbnRoRnJvbU51bWJlclxuICAgICAgICAgfSk7XG4gICAgIH1cblxuICAgICBwdWJsaXNoRXh0ZXJuYWxBUEkoYXBwSGVscGVycyk7XG5cbiB9KSh3aW5kb3csIGRvY3VtZW50KTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0Jztcbi8qKlxuICogQ3JlYXRlZCBieSBid2FtYWxhIG9uIDYvMi8yMDE3LlxuICovXG5hbmd1bGFyLm1vZHVsZSgnc2VydmljZXMnKS5zZXJ2aWNlKCdBbm51YWxTZXJ2aWNlJywgWyckaHR0cCcsXG4gICAgZnVuY3Rpb24oJGh0dHApIHtcbiAgICAgICAgdmFyIGhhbmRsZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRBd3BBY3Rpdml0aWVzID0gZnVuY3Rpb24oeWVhcil7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdwbGFubmluZy9hcGkvYXdwYWN0aXZpdGllcycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgeWVhcjogeWVhclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRGdW5kQWN0aXZpdGllcyA9IGZ1bmN0aW9uKHllYXIpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgncGxhbm5pbmcvYXBpL2Z1bmRhY3Rpdml0aWVzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICB5ZWFyOiB5ZWFyLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRQcmlvcml0eUFjdGl2aXRpZXMgPSBmdW5jdGlvbih5ZWFyKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ3BsYW5uaW5nL2FwaS9wcmlvcml0eWFjdGl2aXRpZXMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHllYXI6IHllYXIsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgJ2dldEF3cEFjdGl2aXRpZXMnOmdldEF3cEFjdGl2aXRpZXMsXG4gICAgICAgICAgICAnZ2V0RnVuZEFjdGl2aXRpZXMnOiBnZXRGdW5kQWN0aXZpdGllcyxcbiAgICAgICAgICAgICdnZXRQcmlvcml0eUFjdGl2aXRpZXMnOmdldFByaW9yaXR5QWN0aXZpdGllc1xuICAgICAgICB9O1xuICAgIH1cblxuXSlcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdzZXJ2aWNlcycpXG4gICAgLnNlcnZpY2UoJ0NoYXJ0UERGRXhwb3J0JywgQ2hhcnRQREZFeHBvcnQpO1xuXG5mdW5jdGlvbiBDaGFydFBERkV4cG9ydCgpIHtcbiAgICB2YXIgc2VydmljZSA9IHsnZXhwb3J0JzogZXhwb3J0UERGfTtcbiAgICByZXR1cm4gc2VydmljZTtcblxuICAgIGZ1bmN0aW9uIGV4cG9ydFBERihmaWxlbmFtZSkge1xuICAgICAgICBkMy5zZWxlY3RBbGwoXCJzdmcgLm52LWxpbmVcIilcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCIjZmZmZmZmXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMCk7XG5cbiAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52ZDMgLm52LWJhY2tncm91bmRcIilcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCIjZmZmZmZmXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMCk7XG5cbiAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52ZDMgLm52LWF4aXMgbGluZVwiKVxuICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIFwiI2U1ZTVlNVwiKTtcblxuICAgICAgICBkMy5zZWxlY3RBbGwoXCIubnZkMyB0ZXh0XCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJmb250XCIsIFwibm9ybWFsIDEzcHggQXJpYWwsIHNhbnMtc2VyaWZcIik7XG5cbiAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52ZDMgLm52LWdyb3VwcyAubnYtcG9pbnRcIilcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAwKVxuICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlLXdpZHRoXCIsIFwiMHB4XCIpO1xuXG4gICAgICAgIGQzLnNlbGVjdEFsbChcIi5udmQzIC5udi15IC56ZXJvIGxpbmVcIilcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBcIiM0MDQwNDBcIik7XG5cbiAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52LXkgLm52LWF4aXMgZyBwYXRoLmRvbWFpblwiKVxuICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIFwiIzQwNDA0MFwiKTtcblxuICAgICAgICBkMy5zZWxlY3RBbGwoXCIubGVnZW5kUXVhbnQgLmxhYmVsXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJmb250XCIsIFwibm9ybWFsIDEycHggQXJpYWwsIHNhbnMtc2VyaWZcIik7XG5cbiAgICAgICAgdmFyIHBkZiA9IG5ldyBqc1BERignbCcsICdtbScpO1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHsgZm9ybWF0IDogJ1BORycgfTtcblxuICAgICAgICBwZGYuYWRkSFRNTChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBkZlJlcG9ydFwiKSwgMCwgMCwgb3B0aW9ucywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcGRmLnNhdmUoZmlsZW5hbWUpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnc2VydmljZXMnKVxuICAgIC5zZXJ2aWNlKCdDaGFydFN1cHBvcnRTZXJ2aWNlJywgQ2hhcnRTdXBwb3J0U2VydmljZSk7XG5cbmZ1bmN0aW9uIENoYXJ0U3VwcG9ydFNlcnZpY2UoKSB7XG4gICAgdmFyIHNlcnZpY2UgPSB7XG4gICAgICAgICdnZXRPcHRpb25zJzogZ2V0T3B0aW9ucyxcbiAgICAgICAgJ2luaXRMYWJlbHMnOiBpbml0TGFiZWxzLFxuICAgICAgICAnY2xlYXJMYWJlbHMnOiBjbGVhckxhYmVsc1xuICAgIH07XG5cbiAgICByZXR1cm4gc2VydmljZTtcblxuICAgIGZ1bmN0aW9uIGdldE9wdGlvbnMoY2hhcnRUeXBlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgIHR5cGU6IGNoYXJ0VHlwZSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDQ1MCxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjUwLFxuICAgICAgICAgICAgICAgIC8vIG1hcmdpbjoge3RvcDogMTAwfSxcbiAgICAgICAgICAgICAgICBzdGFja2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzaG93Q29udHJvbHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGdyb3VwU3BhY2luZzogMC4yLFxuICAgICAgICAgICAgICAgIGNsaXBFZGdlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAvLyB1c2VJbnRlcmFjdGl2ZUd1aWRlbGluZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpbnRlcmFjdGl2ZUxheWVyOiB7Z3Jhdml0eTogJ3MnfSxcbiAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbihkKXsgcmV0dXJuIGQueDsgfSxcbiAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbihkKXsgcmV0dXJuIGQueTsgfSxcbiAgICAgICAgICAgICAgICBmb3JjZVk6IFswLDExMF0sXG4gICAgICAgICAgICAgICAgeEF4aXM6IHtcbiAgICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiAnWWVhcnMnLFxuICAgICAgICAgICAgICAgICAgICB0aWNrRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB5QXhpczoge1xuICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWw6ICdDb3ZlcmFnZSBSYXRlICglKScsXG4gICAgICAgICAgICAgICAgICAgIHRpY2tzOiAxMFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2g6IHtcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyRW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluaXRMYWJlbHMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGNoYXJ0KXtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIiEhISBsaW5lQ2hhcnQgY2FsbGJhY2sgISEhXCIpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZUNoYW5nZTogZnVuY3Rpb24oKSB7fVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXRMYWJlbHMoKSB7XG4gICAgICAgIC8vIFlvdSBuZWVkIHRvIGFwcGx5IHRoaXMgb25jZSBhbGwgdGhlIGFuaW1hdGlvbnMgYXJlIGFscmVhZHkgZmluaXNoZWQuIE90aGVyd2lzZSBsYWJlbHMgd2lsbCBiZSBwbGFjZWQgd3JvbmdseS5cbiAgICAgICAgZDMuc2VsZWN0QWxsKCcubnYtbXVsdGliYXIgLm52LWdyb3VwJykuZWFjaChmdW5jdGlvbihncm91cCl7XG4gICAgICAgICAgdmFyIGcgPSBkMy5zZWxlY3QodGhpcyk7XG5cbiAgICAgICAgICAvLyBSZW1vdmUgcHJldmlvdXMgbGFiZWxzIGlmIHRoZXJlIGlzIGFueVxuICAgICAgICAgIGcuc2VsZWN0QWxsKCd0ZXh0JykucmVtb3ZlKCk7XG4gICAgICAgICAgZy5zZWxlY3RBbGwoJy5udi1iYXInKS5lYWNoKGZ1bmN0aW9uKGJhcil7XG4gICAgICAgICAgICB2YXIgYiA9IGQzLnNlbGVjdCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYXJXaWR0aCA9IGIuYXR0cignd2lkdGgnKTtcbiAgICAgICAgICAgIHZhciBiYXJIZWlnaHQgPSBiLmF0dHIoJ2hlaWdodCcpO1xuXG4gICAgICAgICAgICBnLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgICAgIC8vIFRyYW5zZm9ybXMgc2hpZnQgdGhlIG9yaWdpbiBwb2ludCB0aGVuIHRoZSB4IGFuZCB5IG9mIHRoZSBiYXJcbiAgICAgICAgICAgICAgLy8gaXMgYWx0ZXJlZCBieSB0aGlzIHRyYW5zZm9ybS4gSW4gb3JkZXIgdG8gYWxpZ24gdGhlIGxhYmVsc1xuICAgICAgICAgICAgICAvLyB3ZSBuZWVkIHRvIGFwcGx5IHRoaXMgdHJhbnNmb3JtIHRvIHRob3NlLlxuICAgICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYi5hdHRyKCd0cmFuc2Zvcm0nKSlcbiAgICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvLyBUd28gZGVjaW1hbHMgZm9ybWF0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoYmFyLnkpLnRvRml4ZWQoMCk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5hdHRyKCd5JywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvLyBDZW50ZXIgbGFiZWwgdmVydGljYWxseVxuICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSB0aGlzLmdldEJCb3goKS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoYi5hdHRyKCd5JykpIC0gMTA7IC8vIDEwIGlzIHRoZSBsYWJlbCdzIG1hZ2luIGZyb20gdGhlIGJhclxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuYXR0cigneCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy8gQ2VudGVyIGxhYmVsIGhvcml6b250YWxseVxuICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9IHRoaXMuZ2V0QkJveCgpLndpZHRoO1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGIuYXR0cigneCcpKSArIChwYXJzZUZsb2F0KGJhcldpZHRoKSAvIDIpIC0gKHdpZHRoIC8gMik7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdiYXItdmFsdWVzJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFyTGFiZWxzKCkge1xuICAgICAgICBkMy5zZWxlY3RBbGwoJy5udi1tdWx0aWJhciAubnYtZ3JvdXAnKS5lYWNoKGZ1bmN0aW9uKGdyb3VwKXtcbiAgICAgICAgICB2YXIgZyA9IGQzLnNlbGVjdCh0aGlzKTtcbiAgICAgICAgICAvLyBSZW1vdmUgcHJldmlvdXMgbGFiZWxzIGlmIHRoZXJlIGlzIGFueVxuICAgICAgICAgIGcuc2VsZWN0QWxsKCd0ZXh0JykucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICB9XG59XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnc2VydmljZXMnKVxuICAgIC5zZXJ2aWNlKCdDb3ZlcmFnZUNhbGN1bGF0b3InLCBDb3ZlcmFnZUNhbGN1bGF0b3IpO1xuXG5mdW5jdGlvbiBDb3ZlcmFnZUNhbGN1bGF0b3IoKSB7XG5cbiAgICB2YXIgc2VydmljZSA9ICB7XG4gICAgICAgICdjYWxjdWxhdGVDb3ZlcmFnZVJhdGUnOiBjYWxjdWxhdGVDb3ZlcmFnZVJhdGUsXG4gICAgICAgICdjYWxjdWxhdGVEcm9wb3V0UmF0ZSc6IGNhbGN1bGF0ZURyb3BvdXRSYXRlLFxuICAgICAgICAnY2FsY3VsYXRlUmVkQ2F0ZWdvcnknOiBjYWxjdWxhdGVSZWRDYXRlZ29yeVxuICAgIH07XG5cbiAgICByZXR1cm4gc2VydmljZTtcblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZUNvdmVyYWdlUmF0ZShjb25zdW1wdGlvbiwgcGxhbm5lZCkge1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCgoY29uc3VtcHRpb24gLyBwbGFubmVkKSAqIDEwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlRHJvcG91dFJhdGUoZmlyc3REb3NlLCBsYXN0RG9zZSkge1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCgoKGZpcnN0RG9zZSAtIGxhc3REb3NlKSAvIGZpcnN0RG9zZSkgKiAxMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVJlZENhdGVnb3J5KGZpcnN0RG9zZSwgbGFzdERvc2UsIHBsYW5uZWQpIHtcbiAgICAgICAgdmFyIGFjY2VzcyA9IGNhbGN1bGF0ZUNvdmVyYWdlUmF0ZShmaXJzdERvc2UsIHBsYW5uZWQpO1xuICAgICAgICB2YXIgZHJvcG91dFJhdGUgPSBjYWxjdWxhdGVEcm9wb3V0UmF0ZShmaXJzdERvc2UsIGxhc3REb3NlKTtcblxuICAgICAgICBpZiAoYWNjZXNzID49IDkwICYmIGRyb3BvdXRSYXRlID49IDAgJiYgZHJvcG91dFJhdGUgPD0gMTApIHJldHVybiAxO1xuICAgICAgICBlbHNlIGlmIChhY2Nlc3MgPj0gOTAgJiYgKGRyb3BvdXRSYXRlIDwgMCB8fCBkcm9wb3V0UmF0ZSA+IDEwKSkgcmV0dXJuIDI7XG4gICAgICAgIGVsc2UgaWYgKGFjY2VzcyA8IDkwICYmIGRyb3BvdXRSYXRlID49IDAgJiYgZHJvcG91dFJhdGUgPD0gMTApIHJldHVybiAzO1xuICAgICAgICBlbHNlIGlmIChhY2Nlc3MgPCA5MCAmJiAoZHJvcG91dFJhdGUgPCAwIHx8IGRyb3BvdXRSYXRlID4gMTApKSByZXR1cm4gNDtcbiAgICAgICAgZWxzZSByZXR1cm4gMDtcbiAgICB9XG59XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnc2VydmljZXMnKS5zZXJ2aWNlKCdDb3ZlcmFnZVNlcnZpY2UnLCBbJyRodHRwJyxcbiAgICBmdW5jdGlvbigkaHR0cCkge1xuICAgICAgICB2YXIgaGFuZGxlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldERISVMyVmFjY2luZURvc2VzID0gZnVuY3Rpb24ocGVyaW9kLCBkaXN0cmljdCwgdmFjY2luZSkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY292ZXJhZ2UvYXBpL2RoaXMydmFjY2luZWRvc2VzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBwZXJpb2Q6IHBlcmlvZCxcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZTogdmFjY2luZSxcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldFZhY2NpbmVEb3NlcyA9IGZ1bmN0aW9uKHBlcmlvZCwgdmFjY2luZSkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY292ZXJhZ2UvYXBpL3ZhY2NpbmVkb3NlcycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kOiBwZXJpb2QsXG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmU6IHZhY2NpbmVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGdldFJlZFZhY2NpbmVEb3NlcyA9IGZ1bmN0aW9uKHBlcmlvZCwgdmFjY2luZSkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY292ZXJhZ2UvYXBpL3ZhY2NpbmVkb3NlcycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kOiBwZXJpb2QsXG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmU6IHZhY2NpbmVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIHZhciBnZXRWYWNjaW5lRG9zZXNCeURpc3RyaWN0ID0gZnVuY3Rpb24ocGVyaW9kLCBkaXN0cmljdCwgdmFjY2luZSkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY292ZXJhZ2UvYXBpL3ZhY2NpbmVkb3NlcycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kOiBwZXJpb2QsXG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmU6IHZhY2NpbmUsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRWYWNjaW5lRG9zZXNCeVBlcmlvZCA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY292ZXJhZ2UvYXBpL3ZhY2NpbmVkb3Nlc19ieV9wZXJpb2QnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0WWVhcjogcGFyYW1zLnN0YXJ0WWVhcixcbiAgICAgICAgICAgICAgICAgICAgZW5kWWVhcjogcGFyYW1zLmVuZFllYXIsXG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmU6IHBhcmFtcy5hbnRpZ2VuLFxuICAgICAgICAgICAgICAgICAgICBwZXJpb2Q6IHBhcmFtcy5wZXJpb2QsXG4gICAgICAgICAgICAgICAgICAgIGRvc2U6IHBhcmFtcy5kb3NlLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogcGFyYW1zLmRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogcGFyYW1zLmRhdGFUeXBlLFxuICAgICAgICAgICAgICAgICAgICBlbmFibGVEaXN0cmljdEdyb3VwaW5nOiBwYXJhbXMuZW5hYmxlRGlzdHJpY3RHcm91cGluZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRVbmVwaUNvdmVyYWdlID0gZnVuY3Rpb24ocGVyaW9kLCBkaXN0cmljdCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY292ZXJhZ2UvYXBpL2NvdmVyYWdlYW5udWFsaXplZCcsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kOiBwZXJpb2QsXG5cbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldERpc3RyaWN0TWFwID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ3N0YXRpYy9VZ2FuZGFfYWRtaW4uanNvbicpLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBcImdldERISVMyVmFjY2luZURvc2VzXCI6IGdldERISVMyVmFjY2luZURvc2VzLFxuICAgICAgICAgICAgXCJnZXRWYWNjaW5lRG9zZXNcIjogZ2V0VmFjY2luZURvc2VzLFxuICAgICAgICAgICAgXCJnZXRWYWNjaW5lRG9zZXNCeURpc3RyaWN0XCI6IGdldFZhY2NpbmVEb3Nlc0J5RGlzdHJpY3QsXG4gICAgICAgICAgICBcImdldFZhY2NpbmVEb3Nlc0J5UGVyaW9kXCI6IGdldFZhY2NpbmVEb3Nlc0J5UGVyaW9kLFxuICAgICAgICAgICAgXCJnZXRVbmVwaUNvdmVyYWdlXCI6Z2V0VW5lcGlDb3ZlcmFnZSxcbiAgICAgICAgICAgIFwiZ2V0RGlzdHJpY3RNYXBcIjogZ2V0RGlzdHJpY3RNYXAsXG4gICAgICAgICAgICBcImdldFJlZFZhY2NpbmVEb3Nlc1wiOmdldFJlZFZhY2NpbmVEb3Nlc1xuICAgICAgICB9O1xuICAgIH1cbl0pXG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnc2VydmljZXMnKS5zZXJ2aWNlKCdGaWx0ZXJTZXJ2aWNlJywgWyckaHR0cCcsXG4gICAgZnVuY3Rpb24oJGh0dHApIHtcbiAgICAgICAgdmFyIGhhbmRsZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRNb250aHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvbW9udGhzJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldERpc3RyaWN0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9kaXN0cmljdHMnKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0VmFjY2luZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdmFjY2luZXMvJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZ2V0RnJpZGdlRGlzdHJpY3RzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb2xkY2hhaW4vYXBpL2Rpc3RyaWN0cycpLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRGcmlkZ2VDYXJlTGV2ZWxzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb2xkY2hhaW4vYXBpL2NhcmVsZXZlbHMnKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0RnJpZGdlUXVhcnRlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvbGRjaGFpbi9hcGkvcXVhcnRlcnMnKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0TGFzdFBlcmlvZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9sYXN0cGVyaW9kJykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldFBlcmlvZFJhbmdlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY292ZXJhZ2UvYXBpL3BlcmlvZF9yYW5nZXMnKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBnZXRBd3BBY3Rpdml0aWVzPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgncGxhbm5pbmcvYXBpL2F3cGFjdGl2aXRpZXMnKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0RnVuZEFjdGl2aXRpZXM9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdwbGFubmluZy9hcGkvZnVuZGFjdGl2aXRpZXMnKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGdldFVuZXBpQ292ZXJhZ2U9ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvdmVyYWdlL2FwaS9jb3ZlcmFnZWFubnVhbGl6ZWQnKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGdldFVuZXBpU3RvY2s9ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2FwaS9zdG9jay9hdGhhbmRieWRpc3RyaWN0JykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldFllYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ3BsYW5uaW5nL2FwaS9hY3Rpdml0eXllYXInKS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBcImdldE1vbnRoc1wiOiBnZXRNb250aHMsXG4gICAgICAgICAgICBcImdldFllYXJcIjogZ2V0WWVhcixcbiAgICAgICAgICAgIFwiZ2V0VmFjY2luZXNcIjogZ2V0VmFjY2luZXMsXG4gICAgICAgICAgICBcImdldERpc3RyaWN0c1wiOiBnZXREaXN0cmljdHMsXG4gICAgICAgICAgICBcImdldEZyaWRnZURpc3RyaWN0c1wiOiBnZXRGcmlkZ2VEaXN0cmljdHMsXG4gICAgICAgICAgICBcImdldEZyaWRnZUNhcmVMZXZlbHNcIjogZ2V0RnJpZGdlQ2FyZUxldmVscyxcbiAgICAgICAgICAgIFwiZ2V0RnJpZGdlUXVhcnRlcnNcIjogZ2V0RnJpZGdlUXVhcnRlcnMsXG4gICAgICAgICAgICBcImdldExhc3RQZXJpb2RcIjogZ2V0TGFzdFBlcmlvZCxcbiAgICAgICAgICAgIFwiZ2V0UGVyaW9kUmFuZ2VzXCI6IGdldFBlcmlvZFJhbmdlcyxcbiAgICAgICAgICAgIFwiZ2V0QXdwQWN0aXZpdGllc1wiOiBnZXRBd3BBY3Rpdml0aWVzLFxuICAgICAgICAgICAgXCJnZXRGdW5kQWN0aXZpdGllc1wiOiBnZXRGdW5kQWN0aXZpdGllcyxcbiAgICAgICAgICAgIFwiZ2V0VW5lcGlDb3ZlcmFnZVwiOmdldFVuZXBpQ292ZXJhZ2UsXG4gICAgICAgICAgICBcImdldFVuZXBpU3RvY2tcIjpnZXRVbmVwaVN0b2NrXG4gICAgICAgIH07XG4gICAgfVxuXSlcblxuYW5ndWxhci5tb2R1bGUoJ3NlcnZpY2VzJykuc2VydmljZSgnTW9udGhTZXJ2aWNlJywgW1xuICAgIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBnZXRNb250aE5hbWUgPSBmdW5jdGlvbihtb250aCkge1xuICAgICAgICAgICAgdmFyIG1vbnRocyA9IHt9O1xuICAgICAgICAgICAgbW9udGhzWycxJ10gPSBcIkphblwiO1xuICAgICAgICAgICAgbW9udGhzWycyJ10gPSBcIkZlYlwiO1xuICAgICAgICAgICAgbW9udGhzWyczJ10gPSBcIk1hclwiO1xuICAgICAgICAgICAgbW9udGhzWyc0J10gPSBcIkFwclwiO1xuICAgICAgICAgICAgbW9udGhzWyc1J10gPSBcIk1heVwiO1xuICAgICAgICAgICAgbW9udGhzWyc2J10gPSBcIkp1blwiO1xuICAgICAgICAgICAgbW9udGhzWyc3J10gPSBcIkp1bFwiO1xuICAgICAgICAgICAgbW9udGhzWyc4J10gPSBcIkF1Z1wiO1xuICAgICAgICAgICAgbW9udGhzWyc5J10gPSBcIlNlcFwiO1xuICAgICAgICAgICAgbW9udGhzWycxMCddID0gXCJPY3RcIjtcbiAgICAgICAgICAgIG1vbnRoc1snMTEnXSA9IFwiTm92XCI7XG4gICAgICAgICAgICBtb250aHNbJzEyJ10gPSBcIkRlY1wiO1xuICAgICAgICAgICAgcmV0dXJuIG1vbnRoc1ttb250aF07XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldE1vbnRoTnVtYmVyID0gZnVuY3Rpb24obW9udGgpIHtcbiAgICAgICAgICAgIHZhciBtb250aHMgPSB7fTtcbiAgICAgICAgICAgIG1vbnRoc1snSmFuJ10gPSAxO1xuICAgICAgICAgICAgbW9udGhzWydGZWInXSA9IDI7XG4gICAgICAgICAgICBtb250aHNbJ01hciddID0gMztcbiAgICAgICAgICAgIG1vbnRoc1snQXByJ10gPSA0O1xuICAgICAgICAgICAgbW9udGhzWydNYXknXSA9IDU7XG4gICAgICAgICAgICBtb250aHNbJ0p1biddID0gNjtcbiAgICAgICAgICAgIG1vbnRoc1snSnVsJ10gPSA3O1xuICAgICAgICAgICAgbW9udGhzWydBdWcnXSA9IDg7XG4gICAgICAgICAgICBtb250aHNbJ1NlcCddID0gOTtcbiAgICAgICAgICAgIG1vbnRoc1snT2N0J10gPSAxMDtcbiAgICAgICAgICAgIG1vbnRoc1snTm92J10gPSAxMTtcbiAgICAgICAgICAgIG1vbnRoc1snRGVjJ10gPSAxMjtcbiAgICAgICAgICAgIHJldHVybiBtb250aHNbbW9udGhdO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBtb250aFRvRGF0ZSA9IGZ1bmN0aW9uKG1vbnRoWWVhcikge1xuICAgICAgICAgICAgdmFyIHBhcnRzID0gbW9udGhZZWFyLnNwbGl0KFwiIFwiKTtcbiAgICAgICAgICAgIHZhciBtb250aCA9IGdldE1vbnRoTnVtYmVyKHBhcnRzWzBdKTtcbiAgICAgICAgICAgIHZhciB5ZWFyID0gcGFyc2VJbnQocGFydHNbMV0pO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbiAgICAgICAgfTtcblxuICAgICAgICBtb250aERpZmYgPSBmdW5jdGlvbiAoc3RhcnREYXRlLCBlbmREYXRlKSB7XG4gICAgICAgICAgICB2YXIgbW9udGhzO1xuICAgICAgICAgICAgbW9udGhzID0gKGVuZERhdGUuZ2V0RnVsbFllYXIoKSAtIHN0YXJ0RGF0ZS5nZXRGdWxsWWVhcigpKSAqIDEyO1xuICAgICAgICAgICAgbW9udGhzIC09IHN0YXJ0RGF0ZS5nZXRNb250aCgpICsgMTtcbiAgICAgICAgICAgIG1vbnRocyArPSBlbmREYXRlLmdldE1vbnRoKCk7XG4gICAgICAgICAgICByZXR1cm4gbW9udGhzIDw9IDAgPyAwIDogbW9udGhzO1xuICAgICAgICB9O1xuXG4gICAgICAgIG1vbnRoUmFuZ2VEaWZmID0gZnVuY3Rpb24gKHN0YXJ0RGF0ZSwgZW5kRGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbnRoRGlmZihtb250aFRvRGF0ZShzdGFydERhdGUpLCBtb250aFRvRGF0ZShlbmREYXRlKSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwiZ2V0TW9udGhOYW1lXCI6IGdldE1vbnRoTmFtZSxcbiAgICAgICAgICAgIFwiZ2V0TW9udGhOdW1iZXJcIjogZ2V0TW9udGhOdW1iZXIsXG4gICAgICAgICAgICBcIm1vbnRoVG9EYXRlXCI6IG1vbnRoVG9EYXRlLFxuICAgICAgICAgICAgXCJtb250aERpZmZcIjogbW9udGhEaWZmLFxuICAgICAgICAgICAgXCJtb250aFJhbmdlRGlmZlwiOiBtb250aFJhbmdlRGlmZixcbiAgICAgICAgfTtcbiAgICB9XG5dKVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdzZXJ2aWNlcycpLnNlcnZpY2UoJ0ZpbmFuY2VTZXJ2aWNlJywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKSB7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwiZ2V0RmluYW5jZURhdGFcIjogZ2V0RmluYW5jZURhdGEsXG4gICAgICAgICAgICBcImdldEZpbmFuY2VZZWFyc1wiOiBnZXRGaW5hbmNlWWVhcnNcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVSZXNwb25zZShyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRGaW5hbmNlRGF0YShwYXJhbXMpIHtcbiAgICAgICAgICAgIHZhciBjb25maWcgPSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0WWVhcjogcGFyYW1zLnN0YXJ0WWVhcixcbiAgICAgICAgICAgICAgICAgICAgZW5kWWVhcjogcGFyYW1zLmVuZFllYXJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2ZpbmFuY2UvbGlzdCcsIGNvbmZpZykudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRGaW5hbmNlWWVhcnMoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvZmluYW5jZS95ZWFycycsIHt9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfVxuXG4gICAgfV0pXG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnc2VydmljZXMnKS5zZXJ2aWNlKCdGcmlkZ2VTZXJ2aWNlJywgWyckaHR0cCcsXG4gICAgZnVuY3Rpb24oJGh0dHApIHtcbiAgICAgICAgdmFyIGhhbmRsZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRGcmlkZ2VDYXBhY2l0eSA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY29sZGNoYWluL2FwaS9jYXBhY2l0aWVzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydFF1YXJ0ZXI6IHN0YXJ0UXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZW5kUXVhcnRlcjogZW5kUXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICBjYXJlbGV2ZWw6IGNhcmVsZXZlbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRGcmlkZ2VEaXN0cmljdENhcGFjaXR5ID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBkaXN0cmljdCwgY2FyZWxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb2xkY2hhaW4vYXBpL2Rpc3RyaWN0Y2FwYWNpdGllcycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRRdWFydGVyOiBzdGFydFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGVuZFF1YXJ0ZXI6IGVuZFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgY2FyZWxldmVsOiBjYXJlbGV2ZWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0RnJpZGdlRmFjaWxpdHlDYXBhY2l0eSA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY29sZGNoYWluL2FwaS9mYWNpbGl0eWNhcGFjaXRpZXMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0UXVhcnRlcjogc3RhcnRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBlbmRRdWFydGVyOiBlbmRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3QsXG4gICAgICAgICAgICAgICAgICAgIGNhcmVsZXZlbDogY2FyZWxldmVsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldEZyaWRnZUZ1bmN0aW9uYWxpdHkgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGRpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvbGRjaGFpbi9hcGkvcmVmcmlnZXJhdG9ycycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRRdWFydGVyOiBzdGFydFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGVuZFF1YXJ0ZXI6IGVuZFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgY2FyZWxldmVsOiBjYXJlbGV2ZWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGdldEZyaWRnZURpc3RyaWN0UmVmcmlnZXJhdG9yID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBkaXN0cmljdCwgY2FyZWxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdjb2xkY2hhaW4vYXBpL2Rpc3RyaWN0cmVmcmlnZXJhdG9ycycsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRRdWFydGVyOiBzdGFydFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGVuZFF1YXJ0ZXI6IGVuZFF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgY2FyZWxldmVsOiBjYXJlbGV2ZWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0RnJpZGdlRmFjaWxpdHlSZWZyaWdlcmF0b3IgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGRpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvbGRjaGFpbi9hcGkvZmFjaWxpdHlyZWZyaWdlcmF0b3JzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydFF1YXJ0ZXI6IHN0YXJ0UXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZW5kUXVhcnRlcjogZW5kUXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICBjYXJlbGV2ZWw6IGNhcmVsZXZlbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRGcmlkZ2VJbW11bml6aW5nRmFjaWxpdHkgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGRpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2NvbGRjaGFpbi9hcGkvaW1tdW5pemluZ2ZhY2lsaXRpZXMnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0UXVhcnRlcjogc3RhcnRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBlbmRRdWFydGVyOiBlbmRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3QsXG4gICAgICAgICAgICAgICAgICAgIGNhcmVsZXZlbDogY2FyZWxldmVsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihoYW5kbGVSZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBnZXRGcmlkZ2VEaXN0cmljdEltbXVuaXppbmdGYWNpbGl0eSA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnY29sZGNoYWluL2FwaS9kaXN0cmljdGltbXVuaXppbmdmYWNpbGl0aWVzJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydFF1YXJ0ZXI6IHN0YXJ0UXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZW5kUXVhcnRlcjogZW5kUXVhcnRlcixcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICBjYXJlbGV2ZWw6IGNhcmVsZXZlbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRGcmlkZ2VDYXBhY2l0eU1ldHJpY3MgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB2YXIgc3VycCA9IDA7XG4gICAgICAgICAgICB2YXIgc3VmZmljaWVudCA9IDA7XG4gICAgICAgICAgICB2YXIgc2hvcnRhZ2UgPSAwO1xuXG4gICAgICAgICAgICBmb3IodmFyIGk9MDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIHZhciBzdXJwbHVzVmFsdWUgPSBkYXRhW2ldLnN1cnBsdXNcbiAgICAgICAgICAgICAgICBpZiAoc3VycGx1c1ZhbHVlID4gMzApIHN1cnArKztcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHN1cnBsdXNWYWx1ZSA8MzAgJiYgc3VycGx1c1ZhbHVlID49IDApIHN1ZmZpY2llbnQrKztcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHN1cnBsdXNWYWx1ZSA8IDApIHNob3J0YWdlKys7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ3N1cnBsdXMnOiBzdXJwLFxuICAgICAgICAgICAgICAgICdzdWZmaWNpZW50Jzogc3VmZmljaWVudCxcbiAgICAgICAgICAgICAgICAnc2hvcnRhZ2UnOiBzaG9ydGFnZSxcbiAgICAgICAgICAgICAgICAndG90YWwnOiBzdXJwICsgc3VmZmljaWVudCArIHNob3J0YWdlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBcImdldEZyaWRnZUNhcGFjaXR5XCI6IGdldEZyaWRnZUNhcGFjaXR5LFxuICAgICAgICAgICAgXCJnZXRGcmlkZ2VEaXN0cmljdENhcGFjaXR5XCI6IGdldEZyaWRnZURpc3RyaWN0Q2FwYWNpdHksXG4gICAgICAgICAgICBcImdldEZyaWRnZUZhY2lsaXR5Q2FwYWNpdHlcIjogZ2V0RnJpZGdlRmFjaWxpdHlDYXBhY2l0eSxcbiAgICAgICAgICAgIFwiZ2V0RnJpZGdlRnVuY3Rpb25hbGl0eVwiOiBnZXRGcmlkZ2VGdW5jdGlvbmFsaXR5LFxuICAgICAgICAgICAgXCJnZXRGcmlkZ2VJbW11bml6aW5nRmFjaWxpdHlcIjogZ2V0RnJpZGdlSW1tdW5pemluZ0ZhY2lsaXR5LFxuICAgICAgICAgICAgXCJnZXRGcmlkZ2VEaXN0cmljdFJlZnJpZ2VyYXRvclwiOmdldEZyaWRnZURpc3RyaWN0UmVmcmlnZXJhdG9yLFxuICAgICAgICAgICAgXCJnZXRGcmlkZ2VGYWNpbGl0eVJlZnJpZ2VyYXRvclwiOmdldEZyaWRnZUZhY2lsaXR5UmVmcmlnZXJhdG9yLFxuICAgICAgICAgICAgXCJnZXRGcmlkZ2VEaXN0cmljdEltbXVuaXppbmdGYWNpbGl0eVwiOmdldEZyaWRnZURpc3RyaWN0SW1tdW5pemluZ0ZhY2lsaXR5LFxuICAgICAgICAgICAgXCJnZXRGcmlkZ2VDYXBhY2l0eU1ldHJpY3NcIjogZ2V0RnJpZGdlQ2FwYWNpdHlNZXRyaWNzXG4gICAgICAgIH07XG4gICAgfVxuXSlcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKVxuICAgIC5jb250cm9sbGVyKCdNYWluQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0ZpbHRlclNlcnZpY2UnLCAnTW9udGhTZXJ2aWNlJywgJyRyb290U2NvcGUnLCAnJGxvY2F0aW9uJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsIEZpbHRlclNlcnZpY2UsIE1vbnRoU2VydmljZSwgJHJvb3RTY29wZSwgJGxvY2F0aW9uKVxuICAgIHtcbiAgICAgICAgJHNjb3BlLnNvcnRUeXBlICAgICA9ICduYW1lJzsgLy8gc2V0IHRoZSBkZWZhdWx0IHNvcnQgdHlwZVxuICAgICAgICAkc2NvcGUuc29ydFJldmVyc2UgID0gZmFsc2U7ICAvLyBzZXQgdGhlIGRlZmF1bHQgc29ydCBvcmRlclxuICAgICAgICAkc2NvcGUuc2VhcmNoVGV4dCAgID0gJyc7ICAgICAvLyBzZXQgdGhlIGRlZmF1bHQgc2VhcmNoL2ZpbHRlciB0ZXJtXG5cbiAgICAgICAgJHNjb3BlLnJvb3QgPSB7fTtcbiAgICAgICAgdmFyIHNoZWxsID0gdGhpcztcblxuICAgICAgICAkc2NvcGUuJG9uKCdzZXREZWZhdWx0WWVhcnMnLCBmdW5jdGlvbihlLCBzdGFydFllYXIsIGVuZFllYXIpIHtcbiAgICAgICAgICAgIHNoZWxsLnN0YXJ0WWVhciA9IHN0YXJ0WWVhcjtcbiAgICAgICAgICAgIHNoZWxsLmVuZFllYXIgPSBlbmRZZWFyO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLz09PSBTdG9jayBNYW5hZ2VtZW50ID09PT09PT1cbiAgICAgICAgc2hlbGwuc3RhcnRNb250aCA9IHNoZWxsLnN0YXJ0TW9udGggPyBzaGVsbC5zdGFydE1vbnRoLm5hbWUgOiBcIk5vdiAyMDE1XCI7XG4gICAgICAgIHNoZWxsLmVuZE1vbnRoID0gc2hlbGwuZW5kTW9udGggPyBzaGVsbC5lbmRNb250aC5uYW1lIDogXCJEZWMgMjAxNVwiO1xuICAgICAgICBzaGVsbC5zZWxlY3RlZFZhY2NpbmUgPSBcIlwiO1xuICAgICAgICBzaGVsbC5zZWxlY3RlZERpc3RyaWN0ID0gXCJcIjtcbiAgICAgICAgc2hlbGwuZGVmYXVsdFBlcmlvZCA9IFwiXCI7XG5cbiAgICAgICAgRmlsdGVyU2VydmljZS5nZXRNb250aHMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHNoZWxsLm1vbnRocyA9IGRhdGE7XG4gICAgICAgICAgICBzaGVsbC5zdGFydE1vbnRoID0gc2hlbGwubW9udGhzWzBdO1xuICAgICAgICAgICAgLy9zaGVsbC5lbmRNb250aCA9IHNoZWxsLm1vbnRoc1tkZWZhdWx0TW9udGhdO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBZGQgQW50aWdlbiBmaWx0ZXJzIHZhbHVlc1xuICAgICAgICB2YXIgYW50aWdlbnMgPSB7XG4gICAgICAgICAgICBcIkFMTFwiOiBbXSxcbiAgICAgICAgICAgIFwiSFBWXCI6IFtcIkhQVjFcIiwgXCJIUFYyXCJdLFxuICAgICAgICAgICAgXCJEUFRcIjogW1wiRFBUMVwiLCBcIkRQVDJcIiwgXCJEUFQzXCJdLFxuICAgICAgICAgICAgXCJQQ1ZcIjogW1wiUENWMVwiLCBcIlBDVjJcIiwgXCJQQ1YzXCJdLFxuICAgICAgICAgICAgXCJJUFZcIjogW10sXG4gICAgICAgICAgICBcIk9QVlwiOiBbXCJPUFYxXCIsIFwiT1BWMlwiLCBcIk9QVjNcIl0sXG4gICAgICAgICAgICBcIkJDR1wiOiBbXSxcbiAgICAgICAgICAgIFwiTUVBU0xFU1wiOiBbXSxcbiAgICAgICAgICAgIFwiVFRcIjogW1wiVFQxXCIsIFwiVFQyXCJdXG4gICAgICAgIH1cblxuICAgICAgICBzaGVsbC51cGRhdGVEb3NlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2hlbGwuZG9zZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHNoZWxsLmRvc2VzID0gWydEb3NlIDEnLCAnRG9zZSAyJywgJ0Rvc2UgMyddOy8vYW50aWdlbnNbc2hlbGwuYW50aWdlbl1cblxuICAgICAgICAgICAgaWYgKHNoZWxsLmRvc2VzLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICAgICAgc2hlbGwuZG9zZSA9IHNoZWxsLmRvc2VzW3NoZWxsLmRvc2VzLmxlbmd0aC0xXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBzaGVsbC5hbnRpZ2VucyA9IE9iamVjdC5rZXlzKGFudGlnZW5zKTtcblxuICAgICAgICBpZiAoJGxvY2F0aW9uLnBhdGgoKSA9PSAnL2NvdmVyYWdlL3JlZGNhdGVnb3J5Jykge1xuICAgICAgICAgICAgc2hlbGwuYW50aWdlbiA9IFwiRFBUXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzaGVsbC5hbnRpZ2VuID0gXCJBTExcIjtcbiAgICAgICAgfVxuICAgICAgICBzaGVsbC51cGRhdGVEb3NlcygpO1xuXG4gICAgICAgIEZpbHRlclNlcnZpY2UuZ2V0UGVyaW9kUmFuZ2VzKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBzaGVsbC5jb3ZlcmFnZVllYXJzID0gZGF0YS55ZWFyc1xuICAgICAgICAgICAgc2hlbGwuc3RhcnRZZWFyID0gZGF0YS55ZWFyc1tkYXRhLnllYXJzLmxlbmd0aC0xXVxuICAgICAgICAgICAgc2hlbGwuZW5kWWVhciA9IGRhdGEueWVhcnNbZGF0YS55ZWFycy5sZW5ndGgtMV1cbiAgICAgICAgICAgIHNoZWxsLmFjdGl2ZUNvdmVyYWdlWWVhciA9IGRhdGEueWVhcnNbZGF0YS55ZWFycy5sZW5ndGgtMV1cbiAgICAgICAgfSk7XG5cblxuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIEZpbHRlclNlcnZpY2UuZ2V0TGFzdFBlcmlvZCgpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgc2hlbGwuZGVmYXVsdFBlcmlvZCA9IGRhdGE7XG4gICAgICAgICAgICBzaGVsbC5kZWZhdWx0TW9udGggPSBwYXJzZUludChkYXRhLnBlcmlvZC50b1N0cmluZygpLnN1YnN0cmluZyg0LCA2KSk7XG4gICAgICAgICAgICAkc2NvcGUuZGVmYXVsdE1vbnRoID0gc2hlbGwuZGVmYXVsdE1vbnRoO1xuICAgICAgICAgICAgJHNjb3BlLmRlZmF1bHRQZXJpb2QgPSBkYXRhLnBlcmlvZC50b1N0cmluZygpO1xuXG4gICAgICAgICAgICB2YXIgcGVyaW9kID0gZGF0YS5wZXJpb2QudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIHZhciBtb250aF9udW1iZXIgPSBwYXJzZUludChwZXJpb2Quc3Vic3RyaW5nKDQsNikpO1xuICAgICAgICAgICAgdmFyIG1vbnRoX2xhYmVsID0gTW9udGhTZXJ2aWNlLmdldE1vbnRoTmFtZShtb250aF9udW1iZXIpO1xuICAgICAgICAgICAgLy9zaGVsbC5lbmRNb250aCA9IHt5ZWFyOnBlcmlvZC5zdWJzdHJpbmcoMCw0KSwgcGVyaW9kOnBlcmlvZCwgbmFtZTptb250aF9sYWJlbCwgbW9udGg6bW9udGhfbnVtYmVyLCBcIiQkaGFzaEtleVwiOlwib2JqZWN0OjE4NlwifVxuICAgICAgICAgICAgLy9zaGVsbC5lbmRNb250aCA9IHNoZWxsLm1vbnRoc1tzaGVsbC5kZWZhdWx0TW9udGgtMV07XG5cbiAgICAgICAgICAgIHZhciBlbmRNb250aEluZGV4ID0gMDtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBzaGVsbC5tb250aHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2hlbGwubW9udGhzW2ldLnBlcmlvZCA9PSBwZXJpb2QpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hlbGwuZW5kTW9udGggPSBzaGVsbC5tb250aHNbaV07XG4gICAgICAgICAgICAgICAgICAgIGVuZE1vbnRoSW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vc2V0IHRoZSBzdGFydCBwZXJpb2QgdG8gNiBtb250aHMgYmFjayBieSBkZWZhdWx0XG4gICAgICAgICAgICB2YXIgc3RhcnRNb250aEluZGV4ID0gKGVuZE1vbnRoSW5kZXggLSA2KSArIDE7XG4gICAgICAgICAgICBpZiAoc3RhcnRNb250aEluZGV4IDwgMCkge1xuICAgICAgICAgICAgICAgIHN0YXJ0TW9udGhJbmRleCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzaGVsbC5tb250aHMgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgc2hlbGwuc3RhcnRNb250aCA9IHNoZWxsLm1vbnRoc1tzdGFydE1vbnRoSW5kZXhdO1xuICAgICAgICAgICAgfVxuXG5cblxuXG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJkZXJlXCIrSlNPTi5zdHJpbmdpZnkoc2hlbGwubW9udGhzWzEzXSkpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNoZWxsLnN0b2NrYXRoYW5kID0gMDtcblxuXG5cbiAgICAgICAgRmlsdGVyU2VydmljZS5nZXREaXN0cmljdHMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBkaXN0cmljdFNwZWNpZmljUGF0aHMgPSBbXG4gICAgICAgICAgICAgICAgJy9zdG9jay9kaXN0cmlidXRpb24nLFxuICAgICAgICAgICAgICAgIC8vICcvc3RvY2svdXB0YWtlcmF0ZScsXG4gICAgICAgICAgICAgICAgLy8gJy91bmVwaS9kb3dubG9hZCdcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBpZiAoZGlzdHJpY3RTcGVjaWZpY1BhdGhzLmluZGV4T2YoJGxvY2F0aW9uLnBhdGgoKSkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnVuc2hpZnQoeyduYW1lJzogJ05hdGlvbmFsJ30pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzaGVsbC5kaXN0cmljdHMgPSBkYXRhO1xuICAgICAgICAgICAgc2hlbGwuc2VsZWN0ZWREaXN0cmljdCA9IHNoZWxsLmRpc3RyaWN0c1swXTtcbiAgICAgICAgICAgIHNoZWxsLmRpc3RyaWN0ID0gc2hlbGwuZGlzdHJpY3RzWzBdLm5hbWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIEZpbHRlclNlcnZpY2UuZ2V0VmFjY2luZXMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHNoZWxsLnZhY2NpbmVzID0gZGF0YTtcbiAgICAgICAgICAgIHNoZWxsLnNlbGVjdGVkVmFjY2luZSA9IHNoZWxsLnZhY2NpbmVzWzVdO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLz09PT0gRW5kIFN0b2NrIE1hbmFnZW1lbnQgPT09PT1cblxuXG4gICAgICAgIC8vPT09PT09PT1QbGFubmluZz09PT09PT09PVxuICAgICAgICBzaGVsbC5zZWxlY3RlZFllYXIgPSBcIlwiO1xuICAgICAgICBGaWx0ZXJTZXJ2aWNlLmdldFllYXIoKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgc2hlbGwueWVhcnMgPSBkYXRhO1xuICAgICAgICAgICAgc2hlbGwuc2VsZWN0ZWRZZWFyID0gc2hlbGwueWVhcnNbMF07XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgLy89PT0gQ29sZCBjaGFpbiA9PT09PT1cbiAgICAgICAgc2hlbGwuc3RhcnRRdWFydGVyID0gc2hlbGwuc3RhcnRRdWFydGVyID8gc2hlbGwuc3RhcnRRdWFydGVyLm5hbWUgOiBcIjIwMTYwMVwiO1xuICAgICAgICBzaGVsbC5lbmRRdWFydGVyID0gc2hlbGwuZW5kUXVhcnRlciA/IHNoZWxsLmVuZFF1YXJ0ZXIubmFtZSA6IFwiMjAxNjAzXCI7XG4gICAgICAgIHNoZWxsLnNlbGVjdGVkRnJpZGdlRGlzdHJpY3QgPSBcIlwiO1xuICAgICAgICBzaGVsbC5zZWxlY3RlZEZyaWRnZUNhcmVMZXZlbCA9IFwiXCI7XG5cblxuICAgICAgICBGaWx0ZXJTZXJ2aWNlLmdldEZyaWRnZURpc3RyaWN0cygpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgc2hlbGwuZnJpZGdlRGlzdHJpY3RzID0gZGF0YTtcbiAgICAgICAgICAgIHNoZWxsLnNlbGVjdGVkRnJpZGdlRGlzdHJpY3QgPSBzaGVsbC5mcmlkZ2VEaXN0cmljdHNbMF07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIEZpbHRlclNlcnZpY2UuZ2V0RnJpZGdlQ2FyZUxldmVscygpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgc2hlbGwuZnJpZGdlQ2FyZUxldmVscyA9IGRhdGE7XG4gICAgICAgICAgICAvL3NoZWxsLnNlbGVjdGVkRnJpZGdlQ2FyZUxldmVsID0gc2hlbGwuZnJpZGdlQ2FyZUxldmVsc1swXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgRmlsdGVyU2VydmljZS5nZXRGcmlkZ2VRdWFydGVycygpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgc2hlbGwuZnJpZGdlUXVhcnRlcnMgPSBkYXRhO1xuICAgICAgICAgICAvLyBzaGVsbC5zZWxlY3RlZEZyaWRnZVF1YXJ0ZXIgPSBzaGVsbC5mcmlkZ2VRdWFydGVyc1szXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy89PT09IEVuZCBDb2xkIENoYWluID09PT09PT1cblxuXG4vLyAgICAgICAgJHNjb3BlLiR3YXRjaCgnc2hlbGwuZW5kTW9udGgnLCBmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgaWYgKHNoZWxsLmVuZE1vbnRoKSB7XG4vLyAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3JlZnJlc2gnLCBzaGVsbC5zdGFydE1vbnRoLCBzaGVsbC5lbmRNb250aCwgc2hlbGwuc2VsZWN0ZWREaXN0cmljdCwgc2hlbGwuc2VsZWN0ZWRWYWNjaW5lKTtcbi8vICAgICAgICAgICAgfVxuLy8gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2hHcm91cChbJ3NoZWxsLmVuZE1vbnRoJywgJ3NoZWxsLnNlbGVjdGVkVmFjY2luZScsICdzaGVsbC5zZWxlY3RlZERpc3RyaWN0J10sIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICBpZihkYXRhWzBdICYmIGRhdGFbMV0gJiYgZGF0YVsyXSl7XG4gICAgICAgICAgICAgICAgaWYgKHNoZWxsLmVuZE1vbnRoKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncmVmcmVzaCcsIHNoZWxsLnN0YXJ0TW9udGgsIHNoZWxsLmVuZE1vbnRoLCBzaGVsbC5zZWxlY3RlZERpc3RyaWN0LCBzaGVsbC5zZWxlY3RlZFZhY2NpbmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaEdyb3VwKFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdzaGVsbC5zdGFydFllYXInLFxuICAgICAgICAgICAgICAgICdzaGVsbC5lbmRZZWFyJyxcbiAgICAgICAgICAgICAgICAnc2hlbGwuYWN0aXZlQ292ZXJhZ2VZZWFyJyxcbiAgICAgICAgICAgICAgICAnc2hlbGwuYW50aWdlbicsXG4gICAgICAgICAgICAgICAgJ3NoZWxsLmRvc2UnLFxuICAgICAgICAgICAgICAgICdzaGVsbC5kaXN0cmljdCdcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICBpZihkYXRhWzBdKXtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNoZWxsLmVuZE1vbnRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3JlZnJlc2hDb3ZlcmFnZTInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsLmVuZE1vbnRoLCAvL0JhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGwuc3RhcnRZZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsLmVuZFllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGwuYWN0aXZlQ292ZXJhZ2VZZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsLmFudGlnZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGwuZG9zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbC5kaXN0cmljdFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdyZWZyZXNoQ292ZXJhZ2UzJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZE1vbnRoOiBzaGVsbC5lbmRNb250aCwgLy9CYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0WWVhcjogc2hlbGwuc3RhcnRZZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFllYXI6IHNoZWxsLmVuZFllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlQ292ZXJhZ2VZZWFyOiBzaGVsbC5hY3RpdmVDb3ZlcmFnZVllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW50aWdlbjogc2hlbGwuYW50aWdlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb3NlOiBzaGVsbC5kb3NlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBzaGVsbC5kaXN0cmljdFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHJ1ZVxuICAgICAgICApO1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ3NoZWxsLmVuZFF1YXJ0ZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChzaGVsbC5lbmRRdWFydGVyKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdyZWZyZXNoQ2FwYWNpdHknLCBzaGVsbC5zdGFydFF1YXJ0ZXIsIHNoZWxsLmVuZFF1YXJ0ZXIsIHNoZWxsLnNlbGVjdGVkRnJpZGdlRGlzdHJpY3QsIHNoZWxsLnNlbGVjdGVkRnJpZGdlQ2FyZUxldmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaEdyb3VwKFsnc2hlbGwuZW5kUXVhcnRlcicsICdzaGVsbC5zZWxlY3RlZEZyaWRnZURpc3RyaWN0JywgJ3NoZWxsLnNlbGVjdGVkRnJpZGdlQ2FyZUxldmVsJ10sIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgaWYoZGF0YVswXSAmJiBkYXRhWzFdKXtcbiAgICAgICAgICAgICAgICBpZiAoc2hlbGwuZW5kUXVhcnRlciAmJiBzaGVsbC5zZWxlY3RlZEZyaWRnZURpc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncmVmcmVzaENhcGFjaXR5Jywgc2hlbGwuc3RhcnRRdWFydGVyLCBzaGVsbC5lbmRRdWFydGVyLCBzaGVsbC5zZWxlY3RlZEZyaWRnZURpc3RyaWN0LCBzaGVsbC5zZWxlY3RlZEZyaWRnZUNhcmVMZXZlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgJHNjb3BlLiR3YXRjaCgnc2hlbGwueWVhcnMnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYgKHNoZWxsLnNlbGVjdGVkWWVhcil7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdyZWZyZXNoQXdwJywgc2hlbGwuc2VsZWN0ZWRZZWFyKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoR3JvdXAoWydzaGVsbC55ZWFycyddLCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGlmKGRhdGFbMF0gJiYgZGF0YVsxXSl7XG4gICAgICAgICAgICAgICAgaWYgKHNoZWxsLnNlbGVjdGVkWWVhcikge1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3JlZnJlc2hBd3AnLCBzaGVsbC5zZWxlY3RlZFllYXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaCgnc2hlbGwuY292ZXJhZ2VQZXJpb2QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChzaGVsbC5jb3ZlcmFnZVBlcmlvZCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncmVmcmVzaENvdmVyYWdlJywgc2hlbGwuY292ZXJhZ2VQZXJpb2QsIHNoZWxsLnNlbGVjdGVkRGlzdHJpY3QsIHNoZWxsLnNlbGVjdGVkVmFjY2luZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2hHcm91cChbJ3NoZWxsLmNvdmVyYWdlUGVyaW9kJywgJ3NoZWxsLnNlbGVjdGVkRGlzdHJpY3QnLCAnc2hlbGwuc2VsZWN0ZWRWYWNjaW5lJ10sIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgaWYoZGF0YVswXSAmJiBkYXRhWzFdICYmIGRhdGFbMl0pe1xuICAgICAgICAgICAgICAgIGlmIChzaGVsbC5jb3ZlcmFnZVBlcmlvZCkge1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3JlZnJlc2hDb3ZlcmFnZScsIHNoZWxsLmNvdmVyYWdlUGVyaW9kLCBzaGVsbC5zZWxlY3RlZERpc3RyaWN0LCBzaGVsbC5zZWxlY3RlZFZhY2NpbmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaCgnc2hlbGwuY292ZXJhZ2VQZXJpb2QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChzaGVsbC5jb3ZlcmFnZVBlcmlvZCAmJiBzaGVsbC5zZWxlY3RlZERpc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdyZWZyZXNoVW5lcGknLCBzaGVsbC5jb3ZlcmFnZVBlcmlvZCwgc2hlbGwuc2VsZWN0ZWREaXN0cmljdCwgc2hlbGwuc2VsZWN0ZWRWYWNjaW5lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaEdyb3VwKFsnc2hlbGwuY292ZXJhZ2VQZXJpb2QnLCAnc2hlbGwuc2VsZWN0ZWREaXN0cmljdCcsICdzaGVsbC5zZWxlY3RlZFZhY2NpbmUnXSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBpZihkYXRhWzBdICYmIGRhdGFbMV0gJiYgZGF0YVsyXSl7XG4gICAgICAgICAgICAgICAgaWYgKHNoZWxsLmNvdmVyYWdlUGVyaW9kICYmIHNoZWxsLnNlbGVjdGVkRGlzdHJpY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdyZWZyZXNoVW5lcGknLCBzaGVsbC5jb3ZlcmFnZVBlcmlvZCwgc2hlbGwuc2VsZWN0ZWREaXN0cmljdCwgc2hlbGwuc2VsZWN0ZWRWYWNjaW5lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG5cbiAgICB9XG5dKTtcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdzZXJ2aWNlcycpLnNlcnZpY2UoJ01hcFN1cHBvcnRTZXJ2aWNlJywgW1xuICAgIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBjcmVhdGVEaXN0cmljdERhdGFNYXAgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB2YXIgZGF0YURpc3RyaWN0TWFwID0ge307XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gZGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciBwZXJpb2QgPSBkYXRhW2ldLnBlcmlvZDtcbiAgICAgICAgICAgICAgICB2YXIgZmlyc3RfZG9zZSA9IGRhdGFbaV0udG90YWxfZmlyc3RfZG9zZTtcbiAgICAgICAgICAgICAgICB2YXIgc2Vjb25kX2Rvc2UgPSBkYXRhW2ldLnRvdGFsX3NlY29uZF9kb3NlO1xuICAgICAgICAgICAgICAgIHZhciB0aGlyZF9kb3NlID0gZGF0YVtpXS50b3RhbF90aGlyZF9kb3NlO1xuICAgICAgICAgICAgICAgIHZhciBsYXN0X2Rvc2UgPSBkYXRhW2ldLnRvdGFsX2xhc3RfZG9zZTtcbiAgICAgICAgICAgICAgICB2YXIgcGxhbm5lZCA9IGRhdGFbaV0udG90YWxfcGxhbm5lZDtcbiAgICAgICAgICAgICAgICB2YXIgdmFjY2luZSA9IGRhdGFbaV0udmFjY2luZV9fbmFtZTtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdHJpY3QgPSBkYXRhW2ldLmRpc3RyaWN0X19uYW1lO1xuICAgICAgICAgICAgICAgIHZhciBwZXJpb2RZZWFyID0gTnVtYmVyKHBlcmlvZC50b1N0cmluZygpLnN1YnN0cigwLCA0KSk7XG4gICAgICAgICAgICAgICAgdmFyIHBlcmlvZE1vbnRoID0gTnVtYmVyKHBlcmlvZC50b1N0cmluZygpLnN1YnN0cig0LCA2KSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoISAoZGlzdHJpY3QgaW4gZGF0YURpc3RyaWN0TWFwKSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhRGlzdHJpY3RNYXBbZGlzdHJpY3RdID0ge307XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCEgKHZhY2NpbmUgaW4gZGF0YURpc3RyaWN0TWFwW2Rpc3RyaWN0XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YURpc3RyaWN0TWFwW2Rpc3RyaWN0XVt2YWNjaW5lXSA9IHt9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghIChwZXJpb2RZZWFyIGluIGRhdGFEaXN0cmljdE1hcFtkaXN0cmljdF1bdmFjY2luZV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFEaXN0cmljdE1hcFtkaXN0cmljdF1bdmFjY2luZV1bcGVyaW9kWWVhcl0gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoISAocGVyaW9kTW9udGggaW4gZGF0YURpc3RyaWN0TWFwW2Rpc3RyaWN0XVt2YWNjaW5lXVtwZXJpb2RZZWFyXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YURpc3RyaWN0TWFwW2Rpc3RyaWN0XVt2YWNjaW5lXVtwZXJpb2RZZWFyXVtwZXJpb2RNb250aF0gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkYXRhRGlzdHJpY3RNYXBbZGlzdHJpY3RdW3ZhY2NpbmVdW3BlcmlvZFllYXJdW3BlcmlvZE1vbnRoXS5maXJzdF9kb3NlID0gZmlyc3RfZG9zZTtcbiAgICAgICAgICAgICAgICBkYXRhRGlzdHJpY3RNYXBbZGlzdHJpY3RdW3ZhY2NpbmVdW3BlcmlvZFllYXJdW3BlcmlvZE1vbnRoXS5sYXN0X2Rvc2UgPSBsYXN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgZGF0YURpc3RyaWN0TWFwW2Rpc3RyaWN0XVt2YWNjaW5lXVtwZXJpb2RZZWFyXVtwZXJpb2RNb250aF0uc2Vjb25kX2Rvc2UgPSBzZWNvbmRfZG9zZTtcbiAgICAgICAgICAgICAgICBkYXRhRGlzdHJpY3RNYXBbZGlzdHJpY3RdW3ZhY2NpbmVdW3BlcmlvZFllYXJdW3BlcmlvZE1vbnRoXS50aGlyZF9kb3NlID0gdGhpcmRfZG9zZTtcbiAgICAgICAgICAgICAgICBkYXRhRGlzdHJpY3RNYXBbZGlzdHJpY3RdW3ZhY2NpbmVdW3BlcmlvZFllYXJdW3BlcmlvZE1vbnRoXS5wbGFubmVkID0gcGxhbm5lZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGRhdGFEaXN0cmljdE1hcDtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0UGVyaW9kTGlzdCA9IGZ1bmN0aW9uKGRhdGEsIGVuZFllYXIsIHJlcG9ydFRvZ2dsZSkge1xuICAgICAgICAgICAgdmFyIHBlcmlvZExpc3QgPSBbXTtcblxuICAgICAgICAgICAgaWYgKHJlcG9ydFRvZ2dsZSA9PSAnTUNZJykge1xuICAgICAgICAgICAgICAgIHBlcmlvZExpc3QucHVzaChcbiAgICAgICAgICAgICAgICAgICAgW2VuZFllYXIudG9TdHJpbmcoKSwgIGdldExhc3RWYWx1ZShkYXRhW2VuZFllYXJdLCAxMildXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXBvcnRUb2dnbGUgPT0gJ01GWScpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFllYXIgPSBlbmRZZWFyICsgMTtcbiAgICAgICAgICAgICAgICB2YXIgbGFzdFZhbHVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5leHRZZWFyIGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gZ2V0TGFzdFZhbHVlKGRhdGFbbmV4dFllYXJdLCA2KTtcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kTGlzdC5wdXNoKFtuZXh0WWVhci50b1N0cmluZygpLCBsYXN0VmFsdWVdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBnZXRMYXN0VmFsdWUoZGF0YVtlbmRZZWFyXSwgMTIpO1xuICAgICAgICAgICAgICAgICAgICBwZXJpb2RMaXN0LnB1c2goW2VuZFllYXIudG9TdHJpbmcoKSwgbGFzdFZhbHVlXSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlcG9ydFRvZ2dsZSA9PSAnQUNZJykge1xuICAgICAgICAgICAgICAgIHBlcmlvZExpc3QucHVzaC5hcHBseShwZXJpb2RMaXN0LFxuICAgICAgICAgICAgICAgICAgICBnZXRWYWx1ZXNJblJhbmdlKFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kWWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldExhc3RWYWx1ZShkYXRhW2VuZFllYXJdLCAxMilcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVwb3J0VG9nZ2xlID09ICdBRlknKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRZZWFyID0gZW5kWWVhciArIDE7XG5cbiAgICAgICAgICAgICAgICBpZiAobmV4dFllYXIgaW4gZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBwZXJpb2RMaXN0LnB1c2guYXBwbHkocGVyaW9kTGlzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldFZhbHVlc0luUmFuZ2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRZZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TGFzdFZhbHVlKGRhdGFbbmV4dFllYXJdLCA2KVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZExpc3QucHVzaC5hcHBseShwZXJpb2RMaXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0VmFsdWVzSW5SYW5nZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFllYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgNyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRZZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldExhc3RWYWx1ZShkYXRhW2VuZFllYXJdLCAxMilcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHBlcmlvZExpc3Q7XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QWdncmVnYXRlcyhkYXRhLCBwZXJpb2RMaXN0KSB7XG4gICAgICAgICAgICByZXR1cm4gcGVyaW9kTGlzdC5yZWR1Y2UoZnVuY3Rpb24oYWNjLCBwZXJpb2QpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSA9PSB1bmRlZmluZWQgfHwgZGF0YVtwZXJpb2RbMF1dID09IHVuZGVmaW5lZCB8fCBkYXRhW3BlcmlvZFswXV1bcGVyaW9kWzFdXSA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBkYXRhW3BlcmlvZFswXV1bcGVyaW9kWzFdXTtcbiAgICAgICAgICAgICAgICBhY2MudG90YWxQbGFubmVkICs9IGl0ZW0ucGxhbm5lZDtcbiAgICAgICAgICAgICAgICBhY2MudG90YWxGaXJzdERvc2UgKz0gaXRlbS5maXJzdF9kb3NlO1xuICAgICAgICAgICAgICAgIGFjYy50b3RhbFNlY29uZERvc2UgKz0gaXRlbS5zZWNvbmRfZG9zZTtcbiAgICAgICAgICAgICAgICBhY2MudG90YWxUaGlyZERvc2UgKz0gaXRlbS50aGlyZF9kb3NlO1xuICAgICAgICAgICAgICAgIGFjYy50b3RhbExhc3REb3NlICs9IGl0ZW0ubGFzdF9kb3NlO1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICB9LCB7dG90YWxQbGFubmVkOiAwLCB0b3RhbEZpcnN0RG9zZTowLCB0b3RhbFNlY29uZERvc2U6MCwgdG90YWxUaGlyZERvc2U6MCwgdG90YWxMYXN0RG9zZTowfSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2FsY3VsYXRlQ292ZXJhZ2VSYXRlID0gZnVuY3Rpb24oZGF0YSwgcGVyaW9kTGlzdCwgZG9zZU51bWJlcikge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGdldEFnZ3JlZ2F0ZXMoZGF0YSwgcGVyaW9kTGlzdCk7XG4gICAgICAgICAgICB2YXIgZG9zZVZhbHVlID0gcmVzdWx0LnRvdGFsTGFzdERvc2U7XG4gICAgICAgICAgICBpZiAoZG9zZU51bWJlciA9PSAxKSBkb3NlVmFsdWUgPSByZXN1bHQudG90YWxGaXJzdERvc2U7XG4gICAgICAgICAgICBlbHNlIGlmIChkb3NlTnVtYmVyID09IDIpIGRvc2VWYWx1ZSA9IHJlc3VsdC50b3RhbFNlY29uZERvc2U7XG4gICAgICAgICAgICBlbHNlIGlmIChkb3NlTnVtYmVyID09IDMpIGRvc2VWYWx1ZSA9IHJlc3VsdC50b3RhbFRoaXJkRG9zZTtcbiAgICAgICAgICAgIHJldHVybiAoZG9zZVZhbHVlIC8gcmVzdWx0LnRvdGFsUGxhbm5lZCkgKiAxMDA7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGNhbGN1bGF0ZURyb3BvdXRSYXRlID0gZnVuY3Rpb24oZGF0YSwgcGVyaW9kTGlzdCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGdldEFnZ3JlZ2F0ZXMoZGF0YSwgcGVyaW9kTGlzdCk7XG4gICAgICAgICAgICByZXR1cm4gKChyZXN1bHQudG90YWxGaXJzdERvc2UgLSByZXN1bHQudG90YWxMYXN0RG9zZSkgLyByZXN1bHQudG90YWxGaXJzdERvc2UpICogMTAwO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBjYWxjdWxhdGVSZWRDYXRlZ29yeVZhbHVlID0gZnVuY3Rpb24oZGF0YSwgcGVyaW9kTGlzdCkge1xuICAgICAgICAgICAgdmFyIHIgPSBnZXRBZ2dyZWdhdGVzKGRhdGEsIHBlcmlvZExpc3QpO1xuICAgICAgICAgICAgdmFyIGFjY2VzcyA9IChyLnRvdGFsRmlyc3REb3NlIC8gci50b3RhbFBsYW5uZWQpICogMTAwO1xuICAgICAgICAgICAgdmFyIGRyb3BvdXRSYXRlID0gKChyLnRvdGFsRmlyc3REb3NlIC0gci50b3RhbExhc3REb3NlKSAvIHIudG90YWxGaXJzdERvc2UpICogMTAwO1xuXG4gICAgICAgICAgICBpZiAoYWNjZXNzID49IDkwICYmIGRyb3BvdXRSYXRlID49IDAgJiYgZHJvcG91dFJhdGUgPD0gMTApIHJldHVybiAxO1xuICAgICAgICAgICAgZWxzZSBpZiAoYWNjZXNzID49IDkwICYmIChkcm9wb3V0UmF0ZSA8IDAgfHwgZHJvcG91dFJhdGUgPiAxMCkpIHJldHVybiAyO1xuICAgICAgICAgICAgZWxzZSBpZiAoYWNjZXNzIDwgOTAgJiYgZHJvcG91dFJhdGUgPj0gMCAmJiBkcm9wb3V0UmF0ZSA8PSAxMCkgcmV0dXJuIDM7XG4gICAgICAgICAgICBlbHNlIGlmIChhY2Nlc3MgPCA5MCAmJiAoZHJvcG91dFJhdGUgPCAwIHx8IGRyb3BvdXRSYXRlID4gMTApKSByZXR1cm4gNDtcbiAgICAgICAgICAgIGVsc2UgcmV0dXJuIDA7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldExhc3RWYWx1ZSA9IGZ1bmN0aW9uKGQsIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgICAgICAgaWYgKGQgPT0gdW5kZWZpbmVkKSByZXR1cm47XG4gICAgICAgICAgICBpZiAoZGVmYXVsdFZhbHVlIGluIGQpIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGQpO1xuICAgICAgICAgICAgcmV0dXJuIGtleXNba2V5cy5sZW5ndGgtMV07XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdldFZhbHVlc0luUmFuZ2UgPSBmdW5jdGlvbihkYXRhLCBzdGFydFllYXIsIHN0YXJ0TW9udGgsIGVuZFllYXIsIGVuZE1vbnRoKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWVzID0gW107XG4gICAgICAgICAgICBmb3IgKHllYXJJbmRleCBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKHllYXJJbmRleCA8IHN0YXJ0WWVhciB8fCB5ZWFySW5kZXggPiBlbmRZZWFyKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIGZvciAobW9udGhJbmRleCBpbiBkYXRhW3llYXJJbmRleF0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHllYXJJbmRleCA9PSBzdGFydFllYXIgJiYgbW9udGhJbmRleCA8IHN0YXJ0TW9udGgpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoeWVhckluZGV4ID09IGVuZFllYXIgJiYgbW9udGhJbmRleCA+IGVuZE1vbnRoKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goW3llYXJJbmRleCwgbW9udGhJbmRleF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwiY3JlYXRlRGlzdHJpY3REYXRhTWFwXCI6IGNyZWF0ZURpc3RyaWN0RGF0YU1hcCxcbiAgICAgICAgICAgIFwiZ2V0UGVyaW9kTGlzdFwiOiBnZXRQZXJpb2RMaXN0LFxuICAgICAgICAgICAgXCJjYWxjdWxhdGVDb3ZlcmFnZVJhdGVcIjogY2FsY3VsYXRlQ292ZXJhZ2VSYXRlLFxuICAgICAgICAgICAgXCJjYWxjdWxhdGVEcm9wb3V0UmF0ZVwiOiBjYWxjdWxhdGVEcm9wb3V0UmF0ZSxcbiAgICAgICAgICAgIFwiY2FsY3VsYXRlUmVkQ2F0ZWdvcnlWYWx1ZVwiOiBjYWxjdWxhdGVSZWRDYXRlZ29yeVZhbHVlXG4gICAgICAgIH07XG4gICAgfVxuXSlcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdzZXJ2aWNlcycpLnNlcnZpY2UoJ1N0b2NrU2VydmljZScsIFsnJGh0dHAnLFxuICAgIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgICAgIHZhciBoYW5kbGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZ2V0U3RvY2tCeURpc3RyaWN0ID0gZnVuY3Rpb24oc3RhcnRNb250aCwgZW5kTW9udGgsIGRpc3RyaWN0LCB2YWNjaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdhcGkvc3RvY2svYXRoYW5kYnlkaXN0cmljdCcsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRNb250aDogc3RhcnRNb250aCxcbiAgICAgICAgICAgICAgICAgICAgZW5kTW9udGg6IGVuZE1vbnRoLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3QsXG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmU6IHZhY2NpbmVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGdldFVuZXBpU3RvY2sgPSBmdW5jdGlvbihlbmRNb250aCwgZGlzdHJpY3QpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2FwaS9zdG9jay9hdGhhbmRieWRpc3RyaWN0Jywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBlbmRNb250aDogZW5kTW9udGgsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRTdG9ja0J5TW9udGggPSBmdW5jdGlvbihzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2FwaS9zdG9jay9hdGhhbmRieW1vbnRoJywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydE1vbnRoOiBzdGFydE1vbnRoLFxuICAgICAgICAgICAgICAgICAgICBlbmRNb250aDogZW5kTW9udGgsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZTogdmFjY2luZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICAgdmFyIGdldFN0b2NrQnlEaXN0cmljdFZhY2NpbmUgPSBmdW5jdGlvbihzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvc3RvY2svc3RvY2tieWRpc3RyaWN0dmFjY2luZScsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRNb250aDogc3RhcnRNb250aCxcbiAgICAgICAgICAgICAgICAgICAgZW5kTW9udGg6IGVuZE1vbnRoLFxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogZGlzdHJpY3QsXG4gICAgICAgICAgICAgICAgICAgIHZhY2NpbmU6IHZhY2NpbmVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZVJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgICB2YXIgZ2V0U3RvY2tlZE91dCA9IGZ1bmN0aW9uKHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9zdG9ja2Vkb3V0Jywge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydE1vbnRoOiBzdGFydE1vbnRoLFxuICAgICAgICAgICAgICAgICAgICBlbmRNb250aDogZW5kTW9udGgsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZTogdmFjY2luZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgZ2V0U3RvY2tNb250aHNMZWZ0ID0gZnVuY3Rpb24oZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2FwaS9zdG9jay9zdG9ja21vbnRoc2xlZnQnLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkaXN0cmljdCxcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZTogdmFjY2luZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oaGFuZGxlUmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJnZXRTdG9ja0J5RGlzdHJpY3RcIjogZ2V0U3RvY2tCeURpc3RyaWN0LFxuICAgICAgICAgICAgXCJnZXRTdG9ja0J5TW9udGhcIjogZ2V0U3RvY2tCeU1vbnRoLFxuICAgICAgICAgICAgXCJnZXRTdG9ja01vbnRoc0xlZnRcIjogZ2V0U3RvY2tNb250aHNMZWZ0LFxuICAgICAgICAgICAgXCJnZXRTdG9ja0J5RGlzdHJpY3RWYWNjaW5lXCI6IGdldFN0b2NrQnlEaXN0cmljdFZhY2NpbmUsXG4gICAgICAgICAgICBcImdldFN0b2NrZWRPdXRcIjogZ2V0U3RvY2tlZE91dCxcbiAgICAgICAgICAgIFwiZ2V0VW5lcGlTdG9ja1wiOmdldFVuZXBpU3RvY2tcbiAgICAgICAgfTtcbiAgICB9XG5dKVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpLmNvbnRyb2xsZXIoJ0FubnVhbENvdmVyYWdlQ29udHJvbGxlcicsIEFubnVhbENvdmVyYWdlQ29udHJvbGxlcik7XG5cbkFubnVhbENvdmVyYWdlQ29udHJvbGxlci4kaW5qZWN0ID0gW1xuICAgICckc2NvcGUnLFxuICAgICdDb3ZlcmFnZVNlcnZpY2UnLFxuICAgICdDb3ZlcmFnZUNhbGN1bGF0b3InLFxuICAgICdDaGFydFBERkV4cG9ydCcsXG4gICAgJyR0aW1lb3V0J1xuXTtcbmZ1bmN0aW9uIEFubnVhbENvdmVyYWdlQ29udHJvbGxlcigkc2NvcGUsIENvdmVyYWdlU2VydmljZSwgQ292ZXJhZ2VDYWxjdWxhdG9yLCBDaGFydFBERkV4cG9ydCwgJHRpbWVvdXQpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgICRzY29wZS4kb24oJ3JlZnJlc2hDb3ZlcmFnZTMnLCB1cGRhdGVDaGFydCk7XG5cbiAgICB2bS5jaGFydE9wdGlvbnMgPSBnZXRDaGFydE9wdGlvbnMoKTtcbiAgICB2bS5jaGFydERhdGEgPSBbXTtcbiAgICB2bS55ZWFySW5kZXhlcyA9IFtdO1xuICAgIHZtLmV4cG9ydFBERiA9IENoYXJ0UERGRXhwb3J0LmV4cG9ydDtcbiAgICB2bS5pbml0TGFiZWxzID0gaW5pdExhYmVscztcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUNoYXJ0KGUsIHBhcmFtcykge1xuICAgICAgICB2YXIgYW50aWdlbkxhYmVsID0gcGFyYW1zLmFudGlnZW4gPT0gJ0FMTCcgPyAnQW50aWdlbnMnIDogcGFyYW1zLmFudGlnZW47XG4gICAgICAgIHZhciB5ZWFyUGVyaW9kID0gcGFyYW1zLnN0YXJ0WWVhciA9PSBwYXJhbXMuZW5kWWVhclxuICAgICAgICAgICAgPyBwYXJhbXMuc3RhcnRZZWFyIDogYCR7cGFyYW1zLnN0YXJ0WWVhcn0gLSAke3BhcmFtcy5lbmRZZWFyfWA7XG4gICAgICAgIHZtLmNoYXJ0VGl0bGUgPSBgJHthbnRpZ2VuTGFiZWx9IENvdmVyYWdlIGZvciAke3llYXJQZXJpb2R9YDtcbiAgICAgICAgY2xlYXJMYWJlbHMoKTtcblxuICAgICAgICBDb3ZlcmFnZVNlcnZpY2UuZ2V0VmFjY2luZURvc2VzQnlQZXJpb2QocGFyYW1zKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIC8qIEFnZ3JlZ2F0ZSB0aGUgZGF0YSBiYXNlZCBvbiBwZXJpb2QgKi9cbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBkYXRhLnJlZHVjZShmdW5jdGlvbihhY2MsIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFjY2luZSA9IGl0ZW0udmFjY2luZV9fbmFtZTtcbiAgICAgICAgICAgICAgICB2YXIgeWVhciA9IGl0ZW0ucGVyaW9kLnRvU3RyaW5nKCkuc3Vic3RyKDAsNCk7XG4gICAgICAgICAgICAgICAgaWYgKHZtLnllYXJJbmRleGVzLmluZGV4T2YoeWVhcikgPT0gLTEpIHZtLnllYXJJbmRleGVzLnB1c2goeWVhcik7XG4gICAgICAgICAgICAgICAgaWYgKCEgKHZhY2NpbmUgaW4gYWNjKSkgYWNjW3ZhY2NpbmVdID0ge307XG4gICAgICAgICAgICAgICAgaWYgKCEgKHllYXIgaW4gYWNjW3ZhY2NpbmVdKSlcbiAgICAgICAgICAgICAgICAgICAgYWNjW3ZhY2NpbmVdW3llYXJdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxBY3R1YWw6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbEZpcnN0RG9zZTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsTGFzdERvc2U6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFBsYW5uZWQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFNlY29uZERvc2U6IDBcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGFjY1t2YWNjaW5lXVt5ZWFyXS50b3RhbEFjdHVhbCArPSBpdGVtLnRvdGFsX2FjdHVhbDtcbiAgICAgICAgICAgICAgICBhY2NbdmFjY2luZV1beWVhcl0udG90YWxGaXJzdERvc2UgKz0gaXRlbS50b3RhbF9maXJzdF9kb3NlO1xuICAgICAgICAgICAgICAgIGFjY1t2YWNjaW5lXVt5ZWFyXS50b3RhbExhc3REb3NlICs9IGl0ZW0udG90YWxfbGFzdF9kb3NlO1xuICAgICAgICAgICAgICAgIGFjY1t2YWNjaW5lXVt5ZWFyXS50b3RhbFBsYW5uZWQgKz0gaXRlbS50b3RhbF9wbGFubmVkO1xuICAgICAgICAgICAgICAgIGFjY1t2YWNjaW5lXVt5ZWFyXS50b3RhbFNlY29uZERvc2UgKz0gaXRlbS50b3RhbF9zZWNvbmRfZG9zZTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICB9LCB7fSk7XG5cbiAgICAgICAgICAgIC8qIENhbGN1bGF0ZSBSYXRlcyBmb3IgdGhlIHJlc3VsdHMgKi9cbiAgICAgICAgICAgIHZhciBjaGFydERhdGEgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIHZhY2NpbmUgaW4gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhY2NpbmVEYXRhID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeWVhciBpbiByZXN1bHRbdmFjY2luZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvdmVyYWdlUmF0ZSA9IENvdmVyYWdlQ2FsY3VsYXRvci5jYWxjdWxhdGVDb3ZlcmFnZVJhdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbdmFjY2luZV1beWVhcl0udG90YWxMYXN0RG9zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFt2YWNjaW5lXVt5ZWFyXS50b3RhbFBsYW5uZWRcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSB2bS55ZWFySW5kZXhlcy5pbmRleE9mKHllYXIpO1xuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lRGF0YS5wdXNoKHt4OiBpLCB5OiBjb3ZlcmFnZVJhdGV9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjaGFydERhdGEucHVzaCh7a2V5OiB2YWNjaW5lLCB2YWx1ZXM6IHZhY2NpbmVEYXRhfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZtLmNoYXJ0RGF0YSA9IGNoYXJ0RGF0YTtcbiAgICAgICAgICAgIC8vICR0aW1lb3V0KGZ1bmN0aW9uKCkgeygpOyB9LCAyMDAwKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Q2hhcnRPcHRpb25zKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnbXVsdGlCYXJDaGFydCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA0NTAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY1MCxcbiAgICAgICAgICAgICAgICBzdGFja2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzaG93Q29udHJvbHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGdyb3VwU3BhY2luZzogMC4yLFxuICAgICAgICAgICAgICAgIC8vIHVzZUludGVyYWN0aXZlR3VpZGVsaW5lOiB0cnVlLFxuICAgICAgICAgICAgICAgIGludGVyYWN0aXZlTGF5ZXI6IHtncmF2aXR5OiAncyd9LFxuICAgICAgICAgICAgICAgIHg6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZC54OyB9LFxuICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZC55OyB9LFxuICAgICAgICAgICAgICAgIGZvcmNlWTogWzAsMTEwXSxcbiAgICAgICAgICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWw6ICdZZWFycycsXG4gICAgICAgICAgICAgICAgICAgIHRpY2tGb3JtYXQ6IGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZtLnllYXJJbmRleGVzW2RdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB5QXhpczoge1xuICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWw6ICdDb3ZlcmFnZSBSYXRlICglKScsXG4gICAgICAgICAgICAgICAgICAgIHRpY2tzOiAxMFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2g6IHtcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyRW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluaXRMYWJlbHMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0TGFiZWxzKCkge1xuICAgICAgICAvLyBZb3UgbmVlZCB0byBhcHBseSB0aGlzIG9uY2UgYWxsIHRoZSBhbmltYXRpb25zIGFyZSBhbHJlYWR5IGZpbmlzaGVkLiBPdGhlcndpc2UgbGFiZWxzIHdpbGwgYmUgcGxhY2VkIHdyb25nbHkuXG4gICAgICAgIGQzLnNlbGVjdEFsbCgnLm52LW11bHRpYmFyIC5udi1ncm91cCcpLmVhY2goZnVuY3Rpb24oZ3JvdXApe1xuICAgICAgICAgIHZhciBnID0gZDMuc2VsZWN0KHRoaXMpO1xuXG4gICAgICAgICAgLy8gUmVtb3ZlIHByZXZpb3VzIGxhYmVscyBpZiB0aGVyZSBpcyBhbnlcbiAgICAgICAgICBnLnNlbGVjdEFsbCgndGV4dCcpLnJlbW92ZSgpO1xuICAgICAgICAgIGcuc2VsZWN0QWxsKCcubnYtYmFyJykuZWFjaChmdW5jdGlvbihiYXIpe1xuICAgICAgICAgICAgdmFyIGIgPSBkMy5zZWxlY3QodGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFyV2lkdGggPSBiLmF0dHIoJ3dpZHRoJyk7XG4gICAgICAgICAgICB2YXIgYmFySGVpZ2h0ID0gYi5hdHRyKCdoZWlnaHQnKTtcblxuICAgICAgICAgICAgZy5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgICAvLyBUcmFuc2Zvcm1zIHNoaWZ0IHRoZSBvcmlnaW4gcG9pbnQgdGhlbiB0aGUgeCBhbmQgeSBvZiB0aGUgYmFyXG4gICAgICAgICAgICAgIC8vIGlzIGFsdGVyZWQgYnkgdGhpcyB0cmFuc2Zvcm0uIEluIG9yZGVyIHRvIGFsaWduIHRoZSBsYWJlbHNcbiAgICAgICAgICAgICAgLy8gd2UgbmVlZCB0byBhcHBseSB0aGlzIHRyYW5zZm9ybSB0byB0aG9zZS5cbiAgICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGIuYXR0cigndHJhbnNmb3JtJykpXG4gICAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy8gVHdvIGRlY2ltYWxzIGZvcm1hdFxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGJhci55KS50b0ZpeGVkKDApICsgXCIlXCI7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5hdHRyKCd5JywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvLyBDZW50ZXIgbGFiZWwgdmVydGljYWxseVxuICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSB0aGlzLmdldEJCb3goKS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoYi5hdHRyKCd5JykpIC0gMTA7IC8vIDEwIGlzIHRoZSBsYWJlbCdzIG1hZ2luIGZyb20gdGhlIGJhclxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuYXR0cigneCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy8gQ2VudGVyIGxhYmVsIGhvcml6b250YWxseVxuICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9IHRoaXMuZ2V0QkJveCgpLndpZHRoO1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGIuYXR0cigneCcpKSArIChwYXJzZUZsb2F0KGJhcldpZHRoKSAvIDIpIC0gKHdpZHRoIC8gMik7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdiYXItdmFsdWVzJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFyTGFiZWxzKCkge1xuICAgICAgICBkMy5zZWxlY3RBbGwoJy5udi1tdWx0aWJhciAubnYtZ3JvdXAnKS5lYWNoKGZ1bmN0aW9uKGdyb3VwKXtcbiAgICAgICAgICB2YXIgZyA9IGQzLnNlbGVjdCh0aGlzKTtcbiAgICAgICAgICAvLyBSZW1vdmUgcHJldmlvdXMgbGFiZWxzIGlmIHRoZXJlIGlzIGFueVxuICAgICAgICAgIGcuc2VsZWN0QWxsKCd0ZXh0JykucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICB9XG59XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJylcbiAgICAuY29udHJvbGxlcignQ292ZXJhZ2VDb250cm9sbGVyJywgW1xuICAgICAgICAnJHNjb3BlJywnJGxvY2F0aW9uJywgJ1N0b2NrU2VydmljZScsICckcm9vdFNjb3BlJywgJ05nVGFibGVQYXJhbXMnLFxuICAgICAgICAnRmlsdGVyU2VydmljZScsICdNb250aFNlcnZpY2UnLCAnQ292ZXJhZ2VTZXJ2aWNlJywgJ01hcFN1cHBvcnRTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsJGxvY2F0aW9uLCBTdG9ja1NlcnZpY2UsICRyb290U2NvcGUsIE5nVGFibGVQYXJhbXMsXG4gICAgICAgIEZpbHRlclNlcnZpY2UsIE1vbnRoU2VydmljZSwgQ292ZXJhZ2VTZXJ2aWNlLCBNYXBTdXBwb3J0U2VydmljZSlcbiAgICB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZhciBzaGVsbFNjb3BlID0gJHNjb3BlLiRwYXJlbnQ7XG4gICAgICAgIHNoZWxsU2NvcGUuY2hpbGQgPSAkc2NvcGU7XG4gICAgICAgIHZtLnBhdGggPSAkbG9jYXRpb24ucGF0aCgpO1xuICAgICAgICB2bS5lbmR0eHQ9XCJcIjtcbiAgICAgICAgdm0uaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHZtLmFjdGl2ZVJlcG9ydFRvZ2dsZSA9IFwiQUNZXCI7XG4gICAgICAgIHZtLmFjdGl2ZVJlcG9ydFllYXIgPSBcIkNZXCI7XG4gICAgICAgIHZtLmFjdGl2ZURpc3RyaWN0ID0gdW5kZWZpbmVkO1xuICAgICAgICB2bS5zYW1wbGVEaXN0cmljdERhdGEgPSB7fTtcblxuICAgICAgICAkc2NvcGUuaXNBY3RpdmUgPSBmdW5jdGlvbih2aWV3TG9jYXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB2aWV3TG9jYXRpb24gPT09ICRsb2NhdGlvbi5wYXRoKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gcGVyaW9kRGlzcGxheShwZXJpb2QpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChwZXJpb2QgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbW9udGggPSBwYXJzZUludChwZXJpb2Quc2xpY2UoNCw2KSk7XG4gICAgICAgICAgICByZXR1cm4gTW9udGhTZXJ2aWNlLmdldE1vbnRoTmFtZShtb250aCkgKyBcIiBcIiArIHBlcmlvZC5zbGljZSgwLDQpXG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUudXBkYXRlUmVwb3J0VG9nZ2xlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHZtLmFjdGl2ZVJlcG9ydFRvZ2dsZSA9IHZhbHVlO1xuICAgICAgICAgICAgdm0uYWN0aXZlUmVwb3J0WWVhciA9IHZtLmFjdGl2ZVJlcG9ydFRvZ2dsZS5zdWJzdHIoMSwyKTtcbiAgICAgICAgICAgIHZtLnVwZGF0ZU1hcFdpdGhWYWNjaW5lKHZtLmFjdGl2ZVZhY2NpbmUpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe3dpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgncmVzaXplJykpfSwgMzAwMCk7XG5cbiAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuY2hhcnRUaXRsZSA9IHZtLmdldENoYXJ0VGl0bGUodm0uc2VsZWN0ZWRBbnRpZ2VuKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaXNBY3RpdmVSZXBvcnRUb2dnbGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZtLmFjdGl2ZVJlcG9ydFRvZ2dsZSA9PSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZtLmdldFZhY2NpbmVEb3NlcyA9IGZ1bmN0aW9uKGVuZFllYXIsIHZhY2NpbmUsIGRpc3RyaWN0KSB7XG4gICAgICAgICAgICAvLyAkKCcjc3Bpbm5lci1tb2RhbCcpLm1vZGFsKCdzaG93Jyk7XG5cbiAgICAgICAgICAgIC8vIHZtLmVuZE1vbnRoPXBlcmlvZDtcblxuICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5oaWRlTWFwID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vIGlmIChkaXN0cmljdCAhPSB1bmRlZmluZWQgJiYgZGlzdHJpY3QgIT0gXCJOYXRpb25hbFwiKSB7XG4gICAgICAgICAgICAvLyAgICAgc2hlbGxTY29wZS5jaGlsZC5tYXBQbGFjZWhvbGRlck1lc3NhZ2UgPSBcIk5vIG1hcCBhdmFpbGFibGUuXCI7XG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuO1xuICAgICAgICAgICAgLy8gfVxuXG5cbiAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQubWFwUGxhY2Vob2xkZXJNZXNzYWdlID0gXCJNYXAgbG9hZGluZy4gUGxlYXNlIHdhaXQuLi5cIjtcblxuICAgICAgICAgICAgLy9Ub2RvOiBUZW1wb3JhcmlseSBkaXNhYmxlIGZpbHRlcmluZyBieSBkaXN0cmljdCBmb3IgdGhlIHRhYmxlXG4gICAgICAgICAgICBkaXN0cmljdCA9IFwiXCJcbiAgICAgICAgICAgIHZtLmRpc3RyaWN0ID0gZGlzdHJpY3Q7XG4gICAgICAgICAgICB2bS52YWNjaW5lID0gdmFjY2luZTsvL3ZtLnNlbGVjdGVkVmFjY2luZSA/IHZtLnNlbGVjdGVkVmFjY2luZS5uYW1lIDogXCJ2YVwiO1xuICAgICAgICAgICAgdm0uYWN0aXZlVmFjY2luZSA9IHZhY2NpbmU7XG5cbiAgICAgICAgICAgIGlmICh2YWNjaW5lID09IFwiRFBUXCIgfHwgdmFjY2luZSA9PSBcIkFMTFwiKSB7XG4gICAgICAgICAgICAgICAgdm0uYWN0aXZlVmFjY2luZSA9IFwiUEVOVEFcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQXNzaWduIGRpbWVuc2lvbnMgZm9yIG1hcCBjb250YWluZXJcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IDUwMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSA1MDA7XG4gICAgICAgICAgICB2YXIgZmllbGQgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIGRvc2UxID0gXCJcIjtcblxuICAgICAgICAgICAgdmFyIGludGVycG9sYXRlRnVuY3Rpb247XG5cbiAgICAgICAgICAgIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9yZWRjYXRlZ29yeVwiKXtcbiAgICAgICAgICAgICAgICBpbnRlcnBvbGF0ZUZ1bmN0aW9uID0gZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ID0gKHQgKiAxMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQgPT0gMCApIHJldHVybiAnTGlnaHRHcmF5JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ID09IDEpIHJldHVybiAnRGFya0dyZWVuJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ID09IDIpIHJldHVybiAnWWVsbG93JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ID09IDMpIHJldHVybiAnT3JhbmdlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ID09IDQpIHJldHVybiAnUmVkJztcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9kcm9wb3V0cmF0ZVwiKXtcbiAgICAgICAgICAgICAgICBpbnRlcnBvbGF0ZUZ1bmN0aW9uID0gZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdCA9IHQgKiAxMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodCA9PSAwICkgcmV0dXJuICdMaWdodEdyYXknO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCh0ID49IDApICYmICh0IDw9IDEwKSkgcmV0dXJuICdHcmVlbic7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHQgPj0gLTEwICYmIHQgPCAwKSB8fCAodCA+IDEwICYmIHQgPD0gMjApKSByZXR1cm4gJ1llbGxvdyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHQgPCAtMTApIHx8ICh0ID4gMjApKSByZXR1cm4gJ1JlZCc7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW50ZXJwb2xhdGVGdW5jdGlvbiA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgPSB0ICogMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQgPT0gMCkgcmV0dXJuICdMaWdodEdyYXknO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQgPCA1MCkgcmV0dXJuICdSZWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQ+PSA1MCAmJiB0PDkwKSByZXR1cm4gJ1llbGxvdyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodCA+PSA5MCkgcmV0dXJuICdEYXJrR3JlZW4nO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY29sb3IgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAgICAgICAgICAgICAgIC5kb21haW4oWzAsIDEwMF0pXG4gICAgICAgICAgICAgICAgLmludGVycG9sYXRlKGludGVycG9sYXRlRnVuY3Rpb24pO1xuXG4gICAgICAgICAgICBpZiAodm0ucGF0aD09XCIvY292ZXJhZ2UvZHJvcG91dHJhdGVcIil7XG4gICAgICAgICAgICAgICAgZmllbGQ9XCJkcm9wX291dF9yYXRlXCI7XG4gICAgICAgICAgICAgICAgdm0uZW5kdHh0PVwiJVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbHNlIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9jb3ZlcmFnZVwiKXtcbiAgICAgICAgICAgICAgICBmaWVsZD1cImNvdmVyYWdlX3JhdGVcIjtcbiAgICAgICAgICAgICAgICB2bS5lbmR0eHQ9XCIlXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvc2UxID0gXCJMT1dcIiArIFwiLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cIisgXCJISUdIXCI7XG5cbiAgICAgICAgICAgIGlmICh2YWNjaW5lPT1cIlBFTlRBXCIpe1xuICAgICAgICAgICAgICAgIHZtLnZhY2NpbmU9XCJEUFQzXCI7XG4gICAgICAgICAgICAgICAgdm0udmFjZG9zZT1cIkRQVDEtRFBUM1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodmFjY2luZT09XCJQQ1ZcIil7XG4gICAgICAgICAgICAgICAgdm0udmFjY2luZT1cIlBDVjNcIjtcbiAgICAgICAgICAgICAgICB2bS52YWNkb3NlPVwiUENWMS1QQ1YzXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh2YWNjaW5lPT1cIkJDR1wiKXtcbiAgICAgICAgICAgICAgICB2bS52YWNjaW5lPVwiQkNHXCI7XG4gICAgICAgICAgICAgICAgdm0udmFjZG9zZT1cIkJDRy1NRUFTTEVTXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh2YWNjaW5lPT1cIk9QVlwiKXtcbiAgICAgICAgICAgICAgICB2bS52YWNjaW5lPVwiT1BWM1wiO1xuICAgICAgICAgICAgICAgIHZtLnZhY2Rvc2U9XCJPUFYwLU9QVjNcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHZhY2NpbmU9PVwiSFBWXCIpe1xuICAgICAgICAgICAgICAgIHZtLnZhY2NpbmU9XCJIUFYyXCI7XG4gICAgICAgICAgICAgICAgdm0udmFjZG9zZT1cIkhQVjEtSFBWMlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgIGVsc2UgaWYgKHZhY2NpbmU9PVwiTUVBU0xFU1wiKXtcbiAgICAgICAgICAgICAgICB2bS52YWNjaW5lPVwiTUVBU0xFU1wiO1xuICAgICAgICAgICAgICAgIHZtLnZhY2Rvc2U9XCJCQ0ctTUVBU0xFU1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodmFjY2luZT09XCJUVFwiKXtcbiAgICAgICAgICAgICAgICB2bS52YWNjaW5lPVwiVFQyXCI7XG4gICAgICAgICAgICAgICAgdm0udmFjZG9zZT1cIlRUMS1UVDJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQucGVyaW9kTW9udGggPSBwZXJpb2REaXNwbGF5KHZtLmVuZE1vbnRoKTtcblxuICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC50aGVkb3NlID0gdm0udmFjY2luZTtcbiAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudGhldmFjZG9zZSA9IHZtLnZhY2Rvc2U7XG5cblxuICAgICAgICAgICAgdmFyIHZhbHVlRm9ybWF0ID0gZDMuZm9ybWF0KFwiLFwiKTtcblxuICAgICAgICAgICAgLy8gRGVmaW5lIGEgZ2VvZ3JhcGhpY2FsIHByb2plY3Rpb25cbiAgICAgICAgICAgIC8vIEFsc28sIHNldCBpbml0aWFsIHpvb20gdG8gc2hvdyB0aGUgZmVhdHVyZXNcbiAgICAgICAgICAgIHZhciBwcm9qZWN0aW9uXHQ9IGQzLmdlby5tZXJjYXRvcigpXG4gICAgICAgICAgICAgICAgLnNjYWxlKDEpO1xuXG4gICAgICAgICAgICAvLyBQcmVwYXJlIGEgcGF0aCBvYmplY3QgYW5kIGFwcGx5IHRoZSBwcm9qZWN0aW9uIHRvIGl0XG4gICAgICAgICAgICB2YXIgcGF0aCA9IGQzLmdlby5wYXRoKClcbiAgICAgICAgICAgICAgICAucHJvamVjdGlvbihwcm9qZWN0aW9uKTtcblxuICAgICAgICAgICAgLy8gV2UgcHJlcGFyZSBhbiBvYmplY3QgdG8gbGF0ZXIgaGF2ZSBlYXNpZXIgYWNjZXNzIHRvIHRoZSBkYXRhLlxuICAgICAgICAgICAgdmFyIGRhdGFCeUlkID0gZDMubWFwKCk7XG5cbiAgICAgICAgICAgIC8vRGVmaW5lIHF1YW50aXplIHNjYWxlIHRvIHNvcnQgZGF0YSB2YWx1ZXMgaW50byBidWNrZXRzIG9mIGNvbG9yXG4gICAgICAgICAgICAvL0NvbG9ycyBieSBDeW50aGlhIEJyZXdlciAoY29sb3JicmV3ZXIyLm9yZyksIDktY2xhc3MgWWxHbkJ1XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy5yYW5nZShkMy5yYW5nZSg5KSxtYXAoZnVuY3Rpb24oaSkgeyByZXR1cm4gJ3EnICsgaSArICctOSc7fSkpO1xuXG5cbiAgICAgICAgICAgIC8vIENvdmVyYWdlU2VydmljZS5nZXRWYWNjaW5lRG9zZXMocGVyaW9kLCB2YWNjaW5lKVxuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICBlbmRZZWFyOiBlbmRZZWFyLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnbWFwJ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgQ292ZXJhZ2VTZXJ2aWNlLmdldFZhY2NpbmVEb3Nlc0J5UGVyaW9kKHBhcmFtcylcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhRGlzdHJpY3RNYXAgPSBNYXBTdXBwb3J0U2VydmljZS5jcmVhdGVEaXN0cmljdERhdGFNYXAoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHZtLnNhbXBsZURpc3RyaWN0RGF0YSA9IGRhdGFEaXN0cmljdE1hcFtPYmplY3Qua2V5cyhkYXRhRGlzdHJpY3RNYXApWzBdXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBtYXBzIHRoZSBkYXRhIG9mIHRoZSBDU1Ygc28gaXQgY2FuIGJlIGVhc2lseSBhY2Nlc3NlZCBieVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgSUQgb2YgdGhlIGRpc3RyaWN0LCBmb3IgZXhhbXBsZTogZGF0YUJ5SWRbMjE5Nl1cbiAgICAgICAgICAgICAgICAgICAgZGF0YUJ5SWQgPSBkMy5uZXN0KClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5rZXkoZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuaWQ7IH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAucm9sbHVwKGZ1bmN0aW9uIChkKSB7IHJldHVybiBkWzBdOyB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChkYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBMb2FkIGZlYXR1cmVzIGZyb20gR2VvSlNPTlxuICAgICAgICAgICAgICAgICAgICBkMy5qc29uKCdzdGF0aWMvYXBwL2NvbXBvbmVudHMvY292ZXJhZ2UvZGF0YS91Z19kaXN0cmljdHMyLmdlb2pzb24nLCBmdW5jdGlvbiAoZXJyb3IsIGpzb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzY2FsZUNlbnRlciA9IGNhbGN1bGF0ZVNjYWxlQ2VudGVyKGpzb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbi5zY2FsZShzY2FsZUNlbnRlci5zY2FsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2VudGVyKHNjYWxlQ2VudGVyLmNlbnRlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJhbnNsYXRlKFt3aWR0aCAvIDIsIGhlaWdodCAvIDJdKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgZGlzdCBpbiBkYXRhRGlzdHJpY3RNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gZGlzdC5pbmRleE9mKFwiIFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YURpc3RyaWN0ID0gZGlzdC5zdWJzdHJpbmcoMCwgcG9zKS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBqc29uLmZlYXR1cmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBqc29uRGlzdHJpY3QgPSBqc29uLmZlYXR1cmVzW2pdLnByb3BlcnRpZXMuZGlzdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFEaXN0cmljdCA9PSBqc29uRGlzdHJpY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uZmVhdHVyZXNbal0ucHJvcGVydGllcy5maWVsZCA9IGRhdGFEaXN0cmljdE1hcFtkaXN0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QoXCIjbWFwXCIpLnNlbGVjdEFsbChcIipcIikucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3ZnID0gZDMuc2VsZWN0KFwiI21hcFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzdmcuYXBwZW5kKCdnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnZmVhdHVyZXMnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc3ZnLnNlbGVjdEFsbChcInBhdGhcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZGF0YShqc29uLmZlYXR1cmVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5lbnRlcigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcImRcIiwgcGF0aClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgaG92ZXJvbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBob3Zlcm91dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIFwiIzc3N1wiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0udXBkYXRlTWFwV2l0aFZhY2NpbmUodm0uYWN0aXZlVmFjY2luZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuaGlkZU1hcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC4kYXBwbHkoKTtcblxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgaG92ZXJvbiA9IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9vbHRpcCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2LnN0eWxlLmxlZnQgPSBldmVudC5wYWdlWCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUudG9wID0gZXZlbnQucGFnZVkgKyAncHgnO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QodGhpcykuc3R5bGUoXCJmaWxsXCIsIFwid2hpdGVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QoXCIjdG9vbHRpcFwiKS5zdHlsZShcIm9wYWNpdHlcIiwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QoXCIjdG9vbHRpcCAubmFtZVwiKS50ZXh0KGQucHJvcGVydGllcy5kaXN0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KFwiI3Rvb2x0aXAgLnZhbHVlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRleHQgKGQzLmZvcm1hdCgnLjAxZicpKHZtLmdldERpc3RyaWN0VmFsdWUoZCkpKyB2bS5lbmR0eHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGhvdmVyb3V0ID0gZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCB2bS5nZXRGaWxsQ29sb3IpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QoXCIjdG9vbHRpcFwiKS5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2bS5kcmF3TGVnZW5kID0gZnVuY3Rpb24oY29sb3JDb3VudHMpIHtcbiAgICAgICAgICAgICAgICAvLyBTZXR1cCBMZWdlbmRcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3QoXCIjZ2VuZFwiKS5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHZhciBsZWdlbmRTdmcgPSBkMy5zZWxlY3QoJyNnZW5kJykuYXBwZW5kKCdzdmcnKTtcblxuICAgICAgICAgICAgICAgIGxlZ2VuZFN2Zy5hcHBlbmQoXCJnXCIpXG4gICAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibGVnZW5kUXVhbnRcIilcbiAgICAgICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDIwLDIwKVwiKTtcblxuICAgICAgICAgICAgICAgIHZhciBsZWdlbmQgPSBkMy5sZWdlbmQuY29sb3IoKVxuICAgICAgICAgICAgICAgICAgLmxhYmVsRm9ybWF0KGQzLmZvcm1hdChcIi4yZlwiKSlcbiAgICAgICAgICAgICAgICAgIC5zaGFwZVdpZHRoKDQwKVxuICAgICAgICAgICAgICAgICAgLnNoYXBlSGVpZ2h0KDIwKTtcblxuICAgICAgICAgICAgICAgIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9yZWRjYXRlZ29yeVwiKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdldExhYmVsID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIHRvdGFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGVyY2VudGFnZSA9ICh2YWx1ZS90b3RhbCkgKiAxMDA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuYW1lICsgJyAoJyt2YWx1ZSsnKSAoJyArIHBlcmNlbnRhZ2UudG9GaXhlZCgpICsgJyUpJztcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdG90YWxzID0gY29sb3JDb3VudHMuTGlnaHRHcmF5ICsgY29sb3JDb3VudHMuRGFya0dyZWVuICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yQ291bnRzLlllbGxvdyArIGNvbG9yQ291bnRzLk9yYW5nZSArIGNvbG9yQ291bnRzLlJlZDtcblxuICAgICAgICAgICAgICAgICAgICBsZWdlbmQuY2VsbHMoWzAsIDEsIDIsIDMsIDRdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmxhYmVscyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TGFiZWwoJ05vIGRhdGEnLCBjb2xvckNvdW50cy5MaWdodEdyYXksIHRvdGFscyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TGFiZWwoJ0NBVDEnLCBjb2xvckNvdW50cy5EYXJrR3JlZW4sIHRvdGFscyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TGFiZWwoJ0NBVDInLCBjb2xvckNvdW50cy5ZZWxsb3csIHRvdGFscyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TGFiZWwoJ0NBVDMnLCBjb2xvckNvdW50cy5PcmFuZ2UsIHRvdGFscyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TGFiZWwoJ0NBVDQnLCBjb2xvckNvdW50cy5SZWQsIHRvdGFscylcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodm0ucGF0aD09XCIvY292ZXJhZ2UvZHJvcG91dHJhdGVcIil7XG4gICAgICAgICAgICAgICAgICAgIGxlZ2VuZC5jZWxscyhbMCwgMzAsIDE1LCA1XSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5sYWJlbHMoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdObyBkYXRhICgnK2NvbG9yQ291bnRzLkxpZ2h0R3JheSsnKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwtMTAgJiA+MjAgKCcrY29sb3JDb3VudHMuUmVkKycpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnKC0xMC0wKSAmICgxMC0yMCkgKCcrY29sb3JDb3VudHMuWWVsbG93KycpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnMC0xMCAoJytjb2xvckNvdW50cy5EYXJrR3JlZW4rJyknXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZWdlbmQuY2VsbHMoNClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5sYWJlbHMoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdObyBkYXRhICgnK2NvbG9yQ291bnRzLkxpZ2h0R3JheSsnKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzw1MCUgKCcrY29sb3JDb3VudHMuUmVkKycpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnNTAtODklICgnK2NvbG9yQ291bnRzLlllbGxvdysnKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJz49OTAlICgnK2NvbG9yQ291bnRzLkRhcmtHcmVlbisnKSdcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxlZ2VuZC5zY2FsZShjb2xvcik7XG5cbiAgICAgICAgICAgICAgICBsZWdlbmRTdmcuc2VsZWN0KFwiLmxlZ2VuZFF1YW50XCIpXG4gICAgICAgICAgICAgICAgICAuY2FsbChsZWdlbmQpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdm0uZ2V0TWFwVGl0bGUgPSBmdW5jdGlvbih2YWNjaW5lKSB7XG4gICAgICAgICAgICAgICAgdmFyIGR1cmF0aW9uID0gdm0uYWN0aXZlUmVwb3J0VG9nZ2xlWzBdID09ICdBJyA/IFwiQW5udWFsaXplZFwiIDogXCJNb250aGx5XCI7XG4gICAgICAgICAgICAgICAgdmFyIHBlcmlvZCA9IHZtLmdldExhc3RNYXBQZXJpb2QoKTtcbiAgICAgICAgICAgICAgICB2YXIgZnVsbFBlcmlvZCA9IGFwcEhlbHBlcnMuZ2VuZXJhdGVGdWxsTGFiZWxGcm9tUGVyaW9kKHBlcmlvZFswXStwZXJpb2RbMV0pO1xuICAgICAgICAgICAgICAgIHZhciBhbnRpZ2VuTGFiZWwgPSB2bS5hY3RpdmVEb3NlICE9IHVuZGVmaW5lZCA/IHZtLmFjdGl2ZURvc2UgOiB2YWNjaW5lO1xuXG4gICAgICAgICAgICAgICAgdmFyIHRhYiA9IFwiQ292ZXJhZ2VcIjtcbiAgICAgICAgICAgICAgICBpZiAodm0ucGF0aD09XCIvY292ZXJhZ2UvZHJvcG91dHJhdGVcIikgdGFiID0gXCJEcm9wb3V0IFJhdGVcIjtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9yZWRjYXRlZ29yeVwiKSB0YWIgPSBcIlJlZCBDYXRlZ29yaXphdGlvblwiO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke2R1cmF0aW9ufSAke3RhYn0gb2YgJHthbnRpZ2VuTGFiZWx9IGZvciAke2Z1bGxQZXJpb2R9YDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZtLnVwZGF0ZU1hcFdpdGhWYWNjaW5lID0gZnVuY3Rpb24odmFjY2luZSkge1xuICAgICAgICAgICAgICAgIC8vIGlmICh2bS5hY3RpdmVEaXN0cmljdCAhPSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAvLyAgICAgJiYgdm0uYWN0aXZlRGlzdHJpY3QgIT0gXCJBTExcIlxuICAgICAgICAgICAgICAgIC8vICAgICAmJiB2bS5hY3RpdmVEaXN0cmljdCAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmhpZGVNYXAgPSB0cnVlO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5tYXBQbGFjZWhvbGRlck1lc3NhZ2UgPSBcIk5vIG1hcCBhdmFpbGFibGUuXCI7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgc2hlbGxTY29wZS5jaGlsZC5oaWRlTWFwID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgLy8gc2hlbGxTY29wZS5jaGlsZC5oaWRlTWFwID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFjY2luZSA9PSBcIkRQVFwiIHx8IHZhY2NpbmUgPT0gXCJBTExcIikge1xuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lID0gXCJQRU5UQVwiO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZtLmFjdGl2ZVZhY2NpbmUgPSB2YWNjaW5lO1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQubWFwVGl0bGUgPSB2bS5nZXRNYXBUaXRsZSh2YWNjaW5lKTtcblxuICAgICAgICAgICAgICAgIGNvbG9yQ291bnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBSZWQ6IDAsXG4gICAgICAgICAgICAgICAgICAgIFllbGxvdzogMCxcbiAgICAgICAgICAgICAgICAgICAgRGFya0dyZWVuOiAwLFxuICAgICAgICAgICAgICAgICAgICBMaWdodEdyYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgIE9yYW5nZTogMFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2YXIgcGF0aHMgPSBkMy5zZWxlY3QoXCIjbWFwIHN2Z1wiKS5zZWxlY3RBbGwoXCJwYXRoXCIpO1xuICAgICAgICAgICAgICAgIHBhdGhzLnN0eWxlKFwiZmlsbFwiLCB2bS5nZXRGaWxsQ29sb3IpO1xuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHt2bS5kcmF3TGVnZW5kKGNvbG9yQ291bnRzKTsgfSwgMTApO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdm0uZ2V0RmlsbENvbG9yID0gZnVuY3Rpb24oZCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdm0uZ2V0RGlzdHJpY3RWYWx1ZShkKTtcblxuICAgICAgICAgICAgICAgIHZhciBjb2xvclZhbHVlID0gY29sb3IodmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmIChjb2xvclZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2xvclZhbHVlIGluIGNvbG9yQ291bnRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvckNvdW50c1tjb2xvclZhbHVlXSArPSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb2xvclZhbHVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkxpZ2h0R3JheVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZtLmdldExhc3RNYXBQZXJpb2QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFjY2luZURhdGEgPSB2bS5zYW1wbGVEaXN0cmljdERhdGFbdm0uYWN0aXZlVmFjY2luZV07XG4gICAgICAgICAgICAgICAgdmFyIHBlcmlvZExpc3QgPSBNYXBTdXBwb3J0U2VydmljZS5nZXRQZXJpb2RMaXN0KFxuICAgICAgICAgICAgICAgICAgICB2YWNjaW5lRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgZW5kWWVhcixcbiAgICAgICAgICAgICAgICAgICAgdm0uYWN0aXZlUmVwb3J0VG9nZ2xlXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGVyaW9kTGlzdFtwZXJpb2RMaXN0Lmxlbmd0aC0xXTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZtLmdldERpc3RyaWN0VmFsdWUgPSBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RyaWN0RGF0YSA9IGQucHJvcGVydGllcy5maWVsZDtcblxuICAgICAgICAgICAgICAgIGlmIChkaXN0cmljdERhdGEgPT0gdW5kZWZpbmVkIHx8ICghICh2bS5hY3RpdmVWYWNjaW5lIGluIGRpc3RyaWN0RGF0YSkpICkge1xuICAgICAgICAgICAgICAgICAgICBjb2xvckNvdW50c1snTGlnaHRHcmF5J10gKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdMaWdodEdyYXknO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciB2YWNjaW5lRGF0YSA9IGRpc3RyaWN0RGF0YVt2bS5hY3RpdmVWYWNjaW5lXTtcblxuICAgICAgICAgICAgICAgIHZhciBwZXJpb2RMaXN0ID0gTWFwU3VwcG9ydFNlcnZpY2UuZ2V0UGVyaW9kTGlzdChcbiAgICAgICAgICAgICAgICAgICAgdmFjY2luZURhdGEsXG4gICAgICAgICAgICAgICAgICAgIGVuZFllYXIsXG4gICAgICAgICAgICAgICAgICAgIHZtLmFjdGl2ZVJlcG9ydFRvZ2dsZVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBpZiAodm0ucGF0aD09XCIvY292ZXJhZ2UvY292ZXJhZ2VcIil7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNYXBTdXBwb3J0U2VydmljZS5jYWxjdWxhdGVDb3ZlcmFnZVJhdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWNjaW5lRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZExpc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRBY3RpdmVEb3NlTnVtYmVyKClcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodm0ucGF0aD09XCIvY292ZXJhZ2UvZHJvcG91dHJhdGVcIil7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNYXBTdXBwb3J0U2VydmljZS5jYWxjdWxhdGVEcm9wb3V0UmF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhY2NpbmVEYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kTGlzdFxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9yZWRjYXRlZ29yeVwiKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1hcFN1cHBvcnRTZXJ2aWNlLmNhbGN1bGF0ZVJlZENhdGVnb3J5VmFsdWUoXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWNjaW5lRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZExpc3RcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfTtcblxuXG4gICAgICAgICAgICBmdW5jdGlvbiBjYWxjdWxhdGVTY2FsZUNlbnRlcihmZWF0dXJlcykge1xuICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBwYXRocyAoaW4gcGl4ZWxzKSBhbmQgY2FsY3VsYXRlIGEgc2NhbGUgZmFjdG9yIGJhc2VkIG9uIGJveCBhbmQgbWFwIHNpemVcbiAgICAgICAgICAgICAgICB2YXIgYmJveF9wYXRoID0gcGF0aC5ib3VuZHMoZmVhdHVyZXMpLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZSA9IDAuOTUgLyBNYXRoLm1heChcbiAgICAgICAgICAgICAgICAgICAgICAgIChiYm94X3BhdGhbMV1bMF0gLSBiYm94X3BhdGhbMF1bMF0pIC8gd2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAoYmJveF9wYXRoWzFdWzFdIC0gYmJveF9wYXRoWzBdWzFdKSAvIGhlaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBmZWF0dXJlcyAoaW4gbWFwIHVuaXRzKSBhbmQgdXNlIGl0IHRvIGNhbGN1bGF0ZSB0aGUgY2VudGVyIG9mIHRoZSBmZWF0dXJlcy5cbiAgICAgICAgICAgICAgICB2YXIgYmJveF9mZWF0dXJlID0gZDMuZ2VvLmJvdW5kcyhmZWF0dXJlcyksXG4gICAgICAgICAgICAgICAgICAgIGNlbnRlciA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIChiYm94X2ZlYXR1cmVbMV1bMF0gKyBiYm94X2ZlYXR1cmVbMF1bMF0pIC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgIChiYm94X2ZlYXR1cmVbMV1bMV0gKyBiYm94X2ZlYXR1cmVbMF1bMV0pIC8gMl07XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAnc2NhbGUnOnNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAnY2VudGVyJzpjZW50ZXJcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgLy8gTkVXOiBEZWZpbmluZyBnZXRJZE9mRmVhdHVyZVxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0SWRPZkZlYXR1cmUoZikge1xuICAgICAgICAgICAgICByZXR1cm4gZi5wcm9wZXJ0aWVzLmlkdWc7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICB9O1xuXG5cbiAgICAgICAgdm0uZ2V0UmVkVmFjY2luZURvc2VzID0gZnVuY3Rpb24ocGVyaW9kLCB2YWNjaW5lLCBkaXN0cmljdCkge1xuXG5cbiAgICAgICAgICAgIC8vVG9kbzogVGVtcG9yYXJpbHkgZGlzYWJsZSBmaWx0ZXJpbmcgYnkgZGlzdHJpY3QgZm9yIHRoZSB0YWJsZVxuICAgICAgICAgICAgZGlzdHJpY3QgPSBcIlwiXG4gICAgICAgICAgICB2bS5kaXN0cmljdCA9IGRpc3RyaWN0O1xuICAgICAgICAgICAgdm0udmFjY2luZSA9IHZhY2NpbmU7Ly92bS5zZWxlY3RlZFZhY2NpbmUgPyB2bS5zZWxlY3RlZFZhY2NpbmUubmFtZSA6IFwidmFcIjtcblxuICAgICAgICAgICAgLy8gQXNzaWduIGRpbWVuc2lvbnMgZm9yIG1hcCBjb250YWluZXJcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IDUwMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSA1MDA7XG4gICAgICAgICAgICB2YXIgZmllbGQgPSBcIlJlZF9jYXRlZ29yeVwiO1xuICAgICAgICAgICAgLy9pZiAodm0ucGF0aD09XCIvY292ZXJhZ2UvcmVkY2F0ZWdvcnlcIil7XG4gICAgICAgICAgICAvLyAgICBmaWVsZD1cIlJlZF9jYXRlZ29yeVwiXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy99XG5cbiAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZGlzdHJpY3QgPSB2bS5kaXN0cmljdDtcbiAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudmFjY2luZSA9ICAgdm0udmFjY2luZTtcblxuICAgICAgICAgICAgdmFyIHZhbHVlRm9ybWF0ID0gZDMuZm9ybWF0KFwiLFwiKTtcblxuICAgICAgICAgICAgLy8gRGVmaW5lIGEgZ2VvZ3JhcGhpY2FsIHByb2plY3Rpb25cbiAgICAgICAgICAgIC8vIEFsc28sIHNldCBpbml0aWFsIHpvb20gdG8gc2hvdyB0aGUgZmVhdHVyZXNcbiAgICAgICAgICAgIHZhciBwcm9qZWN0aW9uXHQ9IGQzLmdlby5tZXJjYXRvcigpXG4gICAgICAgICAgICAgICAgLnNjYWxlKDEpO1xuXG4gICAgICAgICAgICAvLyBQcmVwYXJlIGEgcGF0aCBvYmplY3QgYW5kIGFwcGx5IHRoZSBwcm9qZWN0aW9uIHRvIGl0XG4gICAgICAgICAgICB2YXIgcGF0aCA9IGQzLmdlby5wYXRoKClcbiAgICAgICAgICAgICAgICAucHJvamVjdGlvbihwcm9qZWN0aW9uKTtcblxuICAgICAgICAgICAgLy8gV2UgcHJlcGFyZSBhbiBvYmplY3QgdG8gbGF0ZXIgaGF2ZSBlYXNpZXIgYWNjZXNzIHRvIHRoZSBkYXRhLlxuICAgICAgICAgICAgdmFyIGRhdGFCeUlkID0gZDMubWFwKCk7XG5cbiAgICAgICAgICAgIC8vRGVmaW5lIHF1YW50aXplIHNjYWxlIHRvIHNvcnQgZGF0YSB2YWx1ZXMgaW50byBidWNrZXRzIG9mIGNvbG9yXG4gICAgICAgICAgICAvL0NvbG9ycyBieSBDeW50aGlhIEJyZXdlciAoY29sb3JicmV3ZXIyLm9yZyksIDktY2xhc3MgWWxHbkJ1XG5cbiAgICAgICAgICAgIHZhciBjb2xvciA9IGQzLnNjYWxlLnF1YW50aXplKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8ucmFuZ2UoZDMucmFuZ2UoOSksbWFwKGZ1bmN0aW9uKGkpIHsgcmV0dXJuICdxJyArIGkgKyAnLTknO30pKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yYW5nZShbICAgIFwiIzAwODAwMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiI0ZGRkYwMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiI0ZGQTUwMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiI0ZGMDAwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIENvdmVyYWdlU2VydmljZS5nZXRSZWRWYWNjaW5lRG9zZXMocGVyaW9kLCB2YWNjaW5lKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vU2V0IGlucHV0IGRvbWFpbiBmb3IgY29sb3Igc2NhbGVcbiAgICAgICAgICAgICAgICAgICAgY29sb3IuZG9tYWluKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQzLm1pbihkYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiArZFtmaWVsZF07IH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgZDMubWF4KGRhdGEsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuICtkW2ZpZWxkXTsgfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBtYXBzIHRoZSBkYXRhIG9mIHRoZSBDU1Ygc28gaXQgY2FuIGJlIGVhc2lseSBhY2Nlc3NlZCBieVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgSUQgb2YgdGhlIGRpc3RyaWN0LCBmb3IgZXhhbXBsZTogZGF0YUJ5SWRbMjE5Nl1cbiAgICAgICAgICAgICAgICAgICAgZGF0YUJ5SWQgPSBkMy5uZXN0KClcbiAgICAgICAgICAgICAgICAgICAgICAua2V5KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7IH0pXG4gICAgICAgICAgICAgICAgICAgICAgLnJvbGx1cChmdW5jdGlvbihkKSB7IHJldHVybiBkWzBdOyB9KVxuICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGxlZ2VuZCA9IGQzLnNlbGVjdCgnI2xlZ2VuZCcpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsaXN0LWlubGluZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXlzID0gbGVnZW5kLnNlbGVjdEFsbCgnbGkua2V5JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kYXRhKGNvbG9yLnJhbmdlKCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGtleXMuZW50ZXIoKS5hcHBlbmQoJ2xpJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdrZXknKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKCdib3JkZXItdG9wLWNvbG9yJywgU3RyaW5nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQ9PVwiIzAwODAwMFwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ0NBVDEnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGQ9PVwiI0ZGRkYwMFwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdDQVQyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChkPT1cIiNGRkE1MDBcIil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnQ0FUMydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQ9PVwiI0ZGMDAwMFwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdDQVQ0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICAgICAgICAgIC8vIExvYWQgZmVhdHVyZXMgZnJvbSBHZW9KU09OXG4gICAgICAgICAgICAgICAgICAgIGQzLmpzb24oJ3N0YXRpYy9hcHAvY29tcG9uZW50cy9jb3ZlcmFnZS9kYXRhL3VnX2Rpc3RyaWN0czIuZ2VvanNvbicsIGZ1bmN0aW9uKGVycm9yLCBqc29uKSB7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBzY2FsZSBhbmQgY2VudGVyIHBhcmFtZXRlcnMgZnJvbSB0aGUgZmVhdHVyZXMuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2NhbGVDZW50ZXIgPSBjYWxjdWxhdGVTY2FsZUNlbnRlcihqc29uKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXBwbHkgc2NhbGUsIGNlbnRlciBhbmQgdHJhbnNsYXRlIHBhcmFtZXRlcnMuXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uLnNjYWxlKHNjYWxlQ2VudGVyLnNjYWxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2VudGVyKHNjYWxlQ2VudGVyLmNlbnRlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRyYW5zbGF0ZShbd2lkdGgvMiwgaGVpZ2h0LzJdKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWVyZ2UgdGhlIGNvdmVyYWdlIGRhdGEgYW1kIEdlb0pTT04gaW50byBhIHNpbmdsZSBhcnJheVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWxzbyBsb29wIHRocm91Z2ggb25jZSBmb3IgZWFjaCBjb3ZlcmFnZSBzY29yZSBkYXRhIHZhbHVlXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaSA8IGRhdGEubGVuZ3RoIDsgaSsrICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR3JhYiBkaXN0cmljdCBuYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpc3QgPSBkYXRhW2ldLmRpc3RyaWN0X19uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3MgPSBkaXN0LmluZGV4T2YoXCIgXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhRGlzdHJpY3QgPSBkaXN0LnN1YnN0cmluZygwLCBwb3MpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy92YXIgZGF0YURpc3RyaWN0ID0gZGF0YVtpXS5kaXN0cmljdDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vR3JhYiBkYXRhIHZhbHVlLCBhbmQgY29udmVydCBmcm9tIHN0cmluZyB0byBmbG9hdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhVmFsdWUgPSArZGF0YVtpXVtmaWVsZF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0ZpbmQgdGhlIGNvcnJlc3BvbmRpbmcgZGlzdHJpY3QgaW5zaWRlIEdlb0pTT05cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqPTA7IGogPCBqc29uLmZlYXR1cmVzLmxlbmd0aCA7IGorKyApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayB0aGUgZGlzdHJpY3QgcmVmZXJlbmNlIGluIGpzb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGpzb25EaXN0cmljdCA9IGpzb24uZmVhdHVyZXNbal0ucHJvcGVydGllcy5kaXN0O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhRGlzdHJpY3QgPT0ganNvbkRpc3RyaWN0KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQ29weSB0aGUgZGF0YSB2YWx1ZSBpbnRvIHRoZSBHZW9KU09OXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLmZlYXR1cmVzW2pdLnByb3BlcnRpZXMuZmllbGQgPSBkYXRhVmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vU3RvcCBsb29raW5nIHRocm91Z2ggSlNPTlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgU1ZHIGluc2lkZSBtYXAgY29udGFpbmVyIGFuZCBhc3NpZ24gZGltZW5zaW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9zdmcuc2VsZWN0QWxsKFwiKlwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiNyZWRcIikuc2VsZWN0QWxsKFwiKlwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdmcgPSBkMy5zZWxlY3QoXCIjcmVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFkZCBhIDxnPiBlbGVtZW50IHRvIHRoZSBTVkcgZWxlbWVudCBhbmQgZ2l2ZSBhIGNsYXNzIHRvIHN0eWxlIGxhdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdmcuYXBwZW5kKCdnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnZmVhdHVyZXMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmluZCBkYXRhIGFuZCBjcmVhdGUgb25lIHBhdGggcGVyIEdlb0pTT04gZmVhdHVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgc3ZnLnNlbGVjdEFsbChcInBhdGhcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZGF0YShqc29uLmZlYXR1cmVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5lbnRlcigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcImRcIiwgcGF0aClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgaG92ZXJvbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBob3Zlcm91dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIFwiIzc3N1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oZCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdldCBkYXRhIHZhbHVlXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gZC5wcm9wZXJ0aWVzLmZpZWxkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdmFsdWUgZXhpc3RzIC4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbG9yKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHZhbHVlIGlzIHVuZGVmaW5lcyAuLi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIiNjY2NcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG5cblxuICAgICAgICAgICAgICAgICAgICB9KTsgLy8gRW5kIGQzLmpzb25cblxuICAgICAgICAgICAgICAgICAgICAvLyBMb2dpYyB0byBoYW5kbGUgaG92ZXIgZXZlbnQgd2hlbiBpdHMgZmlyZWR1cFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhvdmVyb24gPSBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b29sdGlwJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGl2LnN0eWxlLmxlZnQgPSBldmVudC5wYWdlWCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGl2LnN0eWxlLnRvcCA9IGV2ZW50LnBhZ2VZICsgJ3B4JztcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9GaWxsIHllbGxvdyB0byBoaWdobGlnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIndoaXRlXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9TaG93IHRoZSB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KFwiI3Rvb2x0aXBcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAxKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vUG9wdWxhdGUgbmFtZSBpbiB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KFwiI3Rvb2x0aXAgLm5hbWVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRleHQoZC5wcm9wZXJ0aWVzLmRpc3QpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9Qb3B1bGF0ZSB2YWx1ZSBpbiB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFkLnByb3BlcnRpZXMuZmllbGQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QoXCIjdG9vbHRpcCAudmFsdWVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRleHQoXCJObyBEYXRhXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QoXCIjdG9vbHRpcCAudmFsdWVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KCdDQVQnICsgKHZhbHVlRm9ybWF0KGQucHJvcGVydGllcy5maWVsZCkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaG92ZXJvdXQgPSBmdW5jdGlvbihkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1Jlc3RvcmUgb3JpZ2luYWwgY2hvcm9wbGV0aCBmaWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gZC5wcm9wZXJ0aWVzLmZpZWxkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbG9yKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiI2NjY1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vSGlkZSB0aGUgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiN0b29sdGlwXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFBbGxkb3NlcyA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNEb3NlcyA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTBcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhQWxsZG9zZXMsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gY2FsY3VsYXRlU2NhbGVDZW50ZXIoZmVhdHVyZXMpIHtcbiAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGJvdW5kaW5nIGJveCBvZiB0aGUgcGF0aHMgKGluIHBpeGVscykgYW5kIGNhbGN1bGF0ZSBhIHNjYWxlIGZhY3RvciBiYXNlZCBvbiBib3ggYW5kIG1hcCBzaXplXG4gICAgICAgICAgICAgICAgdmFyIGJib3hfcGF0aCA9IHBhdGguYm91bmRzKGZlYXR1cmVzKSxcbiAgICAgICAgICAgICAgICAgICAgc2NhbGUgPSAwLjk1IC8gTWF0aC5tYXgoXG4gICAgICAgICAgICAgICAgICAgICAgICAoYmJveF9wYXRoWzFdWzBdIC0gYmJveF9wYXRoWzBdWzBdKSAvIHdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgKGJib3hfcGF0aFsxXVsxXSAtIGJib3hfcGF0aFswXVsxXSkgLyBoZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGJvdW5kaW5nIGJveCBvZiB0aGUgZmVhdHVyZXMgKGluIG1hcCB1bml0cykgYW5kIHVzZSBpdCB0byBjYWxjdWxhdGUgdGhlIGNlbnRlciBvZiB0aGUgZmVhdHVyZXMuXG4gICAgICAgICAgICAgICAgdmFyIGJib3hfZmVhdHVyZSA9IGQzLmdlby5ib3VuZHMoZmVhdHVyZXMpLFxuICAgICAgICAgICAgICAgICAgICBjZW50ZXIgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAoYmJveF9mZWF0dXJlWzFdWzBdICsgYmJveF9mZWF0dXJlWzBdWzBdKSAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAoYmJveF9mZWF0dXJlWzFdWzFdICsgYmJveF9mZWF0dXJlWzBdWzFdKSAvIDJdO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgJ3NjYWxlJzpzY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgJ2NlbnRlcic6Y2VudGVyXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgIC8vIE5FVzogRGVmaW5pbmcgZ2V0SWRPZkZlYXR1cmVcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldElkT2ZGZWF0dXJlKGYpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGYucHJvcGVydGllcy5pZHVnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG5cbiAgICAgICAgdm0uZ2V0VmFjY2luZURvc2VzQnlEaXN0cmljdCA9IGZ1bmN0aW9uKHBlcmlvZCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcblxuXG4gICAgICAgICAgICBDb3ZlcmFnZVNlcnZpY2UuZ2V0VmFjY2luZURvc2VzQnlEaXN0cmljdChwZXJpb2QsIGRpc3RyaWN0LCB2YWNjaW5lKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZHJvcGVkb3V0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYodm0uZGF0YS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZHJvcGVkb3V0ID0gdm0uZGF0YVswXS5kcm9wX291dF9yYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC51bmRlcmltbXVuaXplZCA9IHZtLmRhdGFbMF0udW5kZXJfaW1tdW5pemVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogQWNjZXNzICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih2bS5kYXRhWzBdLmFjY2VzcyA+PSA5MCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5hY2Nlc3MgPSBcIkdvb2RcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmFjY2VzcyA9IFwiUG9vclwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBVdGlsaXphdGlvbiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoc2hlbGxTY29wZS5jaGlsZC5kcm9wZWRvdXQgPD0gMTApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudXRpbGl6YXRpb24gPSBcIkdvb2RcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnV0aWxpemF0aW9uID0gXCJQb29yXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFJlZCBDYXRlZ29yaXphdGlvbiovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigodm0uZGF0YVswXS5hY2Nlc3MgPj0gOTApICYmICh2bS5kYXRhWzBdLmRyb3Bfb3V0X3JhdGUgPD0xMCkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUucmVkY2F0ZWdvcnkgPSBcIkNBVDFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZih2bS5kYXRhWzBdLmFjY2VzcyA+PSA5MCAmJiB2bS5kYXRhWzBdLmRyb3Bfb3V0X3JhdGUgPiAxMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5yZWRjYXRlZ29yeSA9IFwiQ0FUMlwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKHZtLmRhdGFbMF0uYWNjZXNzIDwgOTAgJiYgdm0uZGF0YVswXS5kcm9wX291dF9yYXRlIDw9IDEwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLnJlZGNhdGVnb3J5ID0gXCJDQVQzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYodm0uZGF0YVswXS5hY2Nlc3MgPCA5MCAmJiB2bS5kYXRhWzBdLmRyb3Bfb3V0X3JhdGUgPiAxMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5yZWRjYXRlZ29yeSA9IFwiQ0FUNFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmdldEFjdGl2ZURvc2VOdW1iZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh2bS5hY3RpdmVEb3NlICE9IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICByZXR1cm4gTnVtYmVyKHZtLmFjdGl2ZURvc2Uuc3Vic3RyKHZtLmFjdGl2ZURvc2UubGVuZ3RoLTEsIDEpKTtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmNvbXB1dGVSYXRlID0gZnVuY3Rpb24oZG9zZXMsIHBsYW5uZWQpIHtcbiAgICAgICAgICAgIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9jb3ZlcmFnZVwiKXtcbiAgICAgICAgICAgICAgICB2YXIgYWN0aXZlRG9zZU51bWJlciA9IHZtLmdldEFjdGl2ZURvc2VOdW1iZXIoKTtcbiAgICAgICAgICAgICAgICB2YXIgZG9zZVZhbHVlID0gZG9zZXMubGFzdDtcblxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVEb3NlTnVtYmVyID09IDEpIGRvc2VWYWx1ZSA9IGRvc2VzLmZpcnN0O1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGFjdGl2ZURvc2VOdW1iZXIgPT0gMikgZG9zZVZhbHVlID0gZG9zZXMuc2Vjb25kO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGFjdGl2ZURvc2VOdW1iZXIgPT0gMykgZG9zZVZhbHVlID0gZG9zZXMudGhpcmQ7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gKGRvc2VWYWx1ZSAvIHBsYW5uZWQpICogMTAwO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9kcm9wb3V0cmF0ZVwiKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gKChkb3Nlcy5maXJzdCAtIGRvc2VzLmxhc3QpIC8gZG9zZXMuZmlyc3QpICogMTAwO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2bS5wYXRoPT1cIi9jb3ZlcmFnZS9yZWRjYXRlZ29yeVwiKXtcbiAgICAgICAgICAgICAgICB2YXIgYWNjZXNzID0gKGRvc2VzLmZpcnN0L3BsYW5uZWQpICogMTAwO1xuICAgICAgICAgICAgICAgIHZhciBkcm9wb3V0UmF0ZSA9ICgoZG9zZXMuZmlyc3QgLSBkb3Nlcy5sYXN0KSAvIGRvc2VzLmZpcnN0KSAqIDEwMDtcblxuICAgICAgICAgICAgICAgIGlmIChhY2Nlc3MgPj0gOTAgJiYgZHJvcG91dFJhdGUgPj0gMCAmJiBkcm9wb3V0UmF0ZSA8PSAxMCkgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYWNjZXNzID49IDkwICYmIChkcm9wb3V0UmF0ZSA8IDAgfHwgZHJvcG91dFJhdGUgPiAxMCkpIHJldHVybiAyO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGFjY2VzcyA8IDkwICYmIGRyb3BvdXRSYXRlID49IDAgJiYgZHJvcG91dFJhdGUgPD0gMTApIHJldHVybiAzO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGFjY2VzcyA8IDkwICYmIChkcm9wb3V0UmF0ZSA8IDAgfHwgZHJvcG91dFJhdGUgPiAxMCkpIHJldHVybiA0O1xuICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uZ2V0Q2hhcnREYXRhID0gZnVuY3Rpb24ocGFyYW1zLCBkYXRhLCByZXBvcnRZZWFyLCBjdW11bGF0aXZlKSB7XG5cbiAgICAgICAgICAgIHZhciBwZXJpb2RWYWx1ZXMgPSB7fTtcbiAgICAgICAgICAgIHZhciByZWRDYXRlZ29yeVZhbHVlcyA9IHt9O1xuICAgICAgICAgICAgdmFyIHRvdGFscyA9IHt9O1xuICAgICAgICAgICAgdmFyIHJlZENhdGVnb3J5VG90YWxzID0ge307XG4gICAgICAgICAgICB2YXIgcmF0ZTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBlcmlvZCA9IGRhdGFbaV0ucGVyaW9kO1xuICAgICAgICAgICAgICAgIHZhciBsYXN0X2Rvc2UgPSBkYXRhW2ldLnRvdGFsX2xhc3RfZG9zZTtcbiAgICAgICAgICAgICAgICB2YXIgZmlyc3RfZG9zZSA9IGRhdGFbaV0udG90YWxfZmlyc3RfZG9zZTtcbiAgICAgICAgICAgICAgICB2YXIgc2Vjb25kX2Rvc2UgPSBkYXRhW2ldLnRvdGFsX3NlY29uZF9kb3NlO1xuICAgICAgICAgICAgICAgIHZhciB0aGlyZF9kb3NlID0gZGF0YVtpXS50b3RhbF90aGlyZF9kb3NlO1xuICAgICAgICAgICAgICAgIHZhciBwbGFubmVkID0gZGF0YVtpXS50b3RhbF9wbGFubmVkO1xuICAgICAgICAgICAgICAgIHZhciB2YWNjaW5lID0gZGF0YVtpXS52YWNjaW5lX19uYW1lO1xuICAgICAgICAgICAgICAgIHZhciBkaXN0cmljdCA9IGRhdGFbaV0uZGlzdHJpY3RfX25hbWU7XG5cbiAgICAgICAgICAgICAgICB2YXIgZGF0YU1vbnRoID0gYXBwSGVscGVycy5nZXRNb250aEZyb21QZXJpb2QocGVyaW9kLCByZXBvcnRZZWFyKTtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YVllYXIgPSBhcHBIZWxwZXJzLmdldFllYXJGcm9tUGVyaW9kKHBlcmlvZCwgcmVwb3J0WWVhcik7XG5cbiAgICAgICAgICAgICAgICB2YXIgeWVhckxhYmVsID0gYXBwSGVscGVycy5nZXRZZWFyTGFiZWxGcm9tUGVyaW9kKHBlcmlvZCwgcmVwb3J0WWVhcik7XG4gICAgICAgICAgICAgICAgdmFyIG1vbnRoSW5kZXggPSBhcHBIZWxwZXJzLmdldE1vbnRoSW5kZXhGcm9tUGVyaW9kKHBlcmlvZCwgcmVwb3J0WWVhcik7XG5cbiAgICAgICAgICAgICAgICAvKiBUaGUgdmlldyByZXR1cm5zIGV4dHJhIGRhdGEgdG8gY2F0ZXIgZm9yIHRoZSBmaW5hbmNpYWwgeWVhclxuICAgICAgICAgICAgICAgIFNpbmNlIGl0cyBpZ25vcmFudCBvZiB0aGUgcGVyaW9kcywgd2UgZG8gdGhlIGZpbHRlcnMgb3Vyc2VsdmVzXG4gICAgICAgICAgICAgICAgRGlkbid0IHdhbnQgdG8gY3JlYXRlIGEgbmV3IEFQSSBjYWxsIGZvciBhIGNoYW5nZSBpbiByZXBvcnQgeWVhclxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaWYgKChyZXBvcnRZZWFyID09IFwiQ1lcIikgJiYgKGRhdGFZZWFyID4gcGFyYW1zLmVuZFllYXIpKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAvLyBpZiAoKHJlcG9ydFllYXIgPT0gXCJGWVwiKSAmJiAoZGF0YVllYXIgPT0gcGFyYW1zLmVuZFllYXIpICYmIChkYXRhTW9udGggPiA2KSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYgKChyZXBvcnRZZWFyID09IFwiRllcIikgJiYgKGRhdGFZZWFyID09IHBhcmFtcy5zdGFydFllYXIpICYmIChkYXRhTW9udGggPD0gNikpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEgKHllYXJMYWJlbCBpbiBwZXJpb2RWYWx1ZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZFZhbHVlc1t5ZWFyTGFiZWxdID0ge307XG4gICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VmFsdWVzW3llYXJMYWJlbF0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgdG90YWxzW3llYXJMYWJlbF0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgcmVkQ2F0ZWdvcnlUb3RhbHNbeWVhckxhYmVsXSA9IHt9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghICh2YWNjaW5lIGluIHBlcmlvZFZhbHVlc1t5ZWFyTGFiZWxdKSkge1xuICAgICAgICAgICAgICAgICAgICBwZXJpb2RWYWx1ZXNbeWVhckxhYmVsXVt2YWNjaW5lXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICByZWRDYXRlZ29yeVZhbHVlc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdID0ge307XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdID0ge2ZpcnN0X2Rvc2U6IDAsIHNlY29uZF9kb3NlOjAsIHRoaXJkX2Rvc2U6MCwgbGFzdF9kb3NlOiAwLCBwbGFubmVkOiAwfTtcbiAgICAgICAgICAgICAgICAgICAgcmVkQ2F0ZWdvcnlUb3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXSA9IHt9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChkaXN0cmljdCAhPSB1bmRlZmluZWQgJiYgIShkaXN0cmljdCBpbiByZWRDYXRlZ29yeVRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdKSkge1xuICAgICAgICAgICAgICAgICAgICByZWRDYXRlZ29yeVRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdW2Rpc3RyaWN0XSA9IHtmaXJzdF9kb3NlOiAwLCBsYXN0X2Rvc2U6IDAsIHBsYW5uZWQ6IDB9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChjdW11bGF0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2bS5wYXRoID09ICcvY292ZXJhZ2UvcmVkY2F0ZWdvcnknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29tYmluZWRGaXJzdERvc2UgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV1bZGlzdHJpY3RdLmZpcnN0X2Rvc2UgKyBmaXJzdF9kb3NlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbWJpbmVkTGFzdERvc2UgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV1bZGlzdHJpY3RdLmxhc3RfZG9zZSArIGxhc3RfZG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb21iaW5lZFBsYW5uZWQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZENhdGVnb3J5VG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV1bZGlzdHJpY3RdLnBsYW5uZWQgKyBwbGFubmVkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZWRDYXRlZ29yeVRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdW2Rpc3RyaWN0XS5maXJzdF9kb3NlID0gY29tYmluZWRGaXJzdERvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWRDYXRlZ29yeVRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdW2Rpc3RyaWN0XS5sYXN0X2Rvc2UgPSBjb21iaW5lZExhc3REb3NlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVkQ2F0ZWdvcnlUb3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXVtkaXN0cmljdF0ucGxhbm5lZCA9IGNvbWJpbmVkUGxhbm5lZDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb21iaW5lZEZpcnN0RG9zZSA9IHRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLmZpcnN0X2Rvc2UgKyBmaXJzdF9kb3NlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbWJpbmVkTGFzdERvc2UgPSB0b3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXS5sYXN0X2Rvc2UgKyBsYXN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29tYmluZWRTZWNvbmREb3NlID0gdG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0uc2Vjb25kX2Rvc2UgKyBzZWNvbmRfZG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb21iaW5lZFRoaXJkRG9zZSA9IHRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLnRoaXJkX2Rvc2UgKyB0aGlyZF9kb3NlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbWJpbmVkUGxhbm5lZCA9IHRvdGFsc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdLnBsYW5uZWQgKyBwbGFubmVkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXS5maXJzdF9kb3NlID0gY29tYmluZWRGaXJzdERvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXS5sYXN0X2Rvc2UgPSBjb21iaW5lZExhc3REb3NlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxzW3llYXJMYWJlbF1bdmFjY2luZV0uc2Vjb25kX2Rvc2UgPSBjb21iaW5lZFNlY29uZERvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXS50aGlyZF9kb3NlID0gY29tYmluZWRUaGlyZERvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbHNbeWVhckxhYmVsXVt2YWNjaW5lXS5wbGFubmVkID0gY29tYmluZWRQbGFubmVkO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmF0ZSA9IHZtLmNvbXB1dGVSYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0OiBjb21iaW5lZEZpcnN0RG9zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlY29uZDogY29tYmluZWRTZWNvbmREb3NlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcmQ6IGNvbWJpbmVkVGhpcmREb3NlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdDogY29tYmluZWRMYXN0RG9zZVxuICAgICAgICAgICAgICAgICAgICB9LCBjb21iaW5lZFBsYW5uZWQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJhdGUgPSB2bS5jb21wdXRlUmF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdDpmaXJzdF9kb3NlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kOnNlY29uZF9kb3NlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcmQ6IHRoaXJkX2Rvc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0OiBsYXN0X2Rvc2V9XG4gICAgICAgICAgICAgICAgICAgICwgcGxhbm5lZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHZtLnBhdGggPT0gJy9jb3ZlcmFnZS9yZWRjYXRlZ29yeScpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhdGVnb3J5ID0gcmF0ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEgKG1vbnRoSW5kZXggaW4gcmVkQ2F0ZWdvcnlWYWx1ZXNbeWVhckxhYmVsXVt2YWNjaW5lXSkpXG4gICAgICAgICAgICAgICAgICAgICAgICByZWRDYXRlZ29yeVZhbHVlc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdW21vbnRoSW5kZXhdID0ge307XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEgKGNhdGVnb3J5IGluIHJlZENhdGVnb3J5VmFsdWVzW3llYXJMYWJlbF1bdmFjY2luZV1bbW9udGhJbmRleF0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVkQ2F0ZWdvcnlWYWx1ZXNbeWVhckxhYmVsXVt2YWNjaW5lXVttb250aEluZGV4XVtjYXRlZ29yeV0gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICByZWRDYXRlZ29yeVZhbHVlc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdW21vbnRoSW5kZXhdW2NhdGVnb3J5XS5wdXNoKGRpc3RyaWN0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwZXJpb2RWYWx1ZXNbeWVhckxhYmVsXVt2YWNjaW5lXS5wdXNoKHt4OiBtb250aEluZGV4LCB5OiBkMy5mb3JtYXQoJy4wMWYnKShyYXRlKX0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGNoYXJ0RGF0YSA9IFtdO1xuXG4gICAgICAgICAgICBpZiAodm0ucGF0aCA9PSAnL2NvdmVyYWdlL3JlZGNhdGVnb3J5Jykge1xuICAgICAgICAgICAgICAgIHZhciBnZXRSZWRDYXRlZ29yeVZhbHVlcyA9IGZ1bmN0aW9uKG1vbnRoSW5kZXgsIGNhdERpc3RyaWN0cywgdG90YWxEaXN0cmljdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBOdW1iZXIobW9udGhJbmRleCksIHk6IGQzLmZvcm1hdCgnLjAxZicpKChjYXREaXN0cmljdHMgLyB0b3RhbERpc3RyaWN0cykgKiAxMDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8geDogTnVtYmVyKG1vbnRoSW5kZXgpLCB5OiBkMy5mb3JtYXQoJy4wMWYnKShjYXREaXN0cmljdHMpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZhciBnZXRUb3RhbFJlZENhdGVnb3J5RGlzdHJpY3RzID0gZnVuY3Rpb24oY2F0LCBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYXQgaW4gZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFbY2F0XS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZhciBjYXRlZ29yeVZhbHVlcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgMTogW10sIDI6IFtdLCAzOiBbXSwgNDogW11cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeWVhckxhYmVsIGluIHJlZENhdGVnb3J5VmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHZhY2NpbmUgaW4gcmVkQ2F0ZWdvcnlWYWx1ZXNbeWVhckxhYmVsXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbW9udGhJbmRleCBpbiByZWRDYXRlZ29yeVZhbHVlc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFjY2luZURhdGEgPSByZWRDYXRlZ29yeVZhbHVlc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdW21vbnRoSW5kZXhdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coeWVhckxhYmVsICsgXCItXCIgKyBtb250aEluZGV4ICsgXCItXCIgKyB2YWNjaW5lICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codmFjY2luZURhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNhdDFEaXN0cmljdHMgPSBnZXRUb3RhbFJlZENhdGVnb3J5RGlzdHJpY3RzKDEsIHZhY2NpbmVEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2F0MkRpc3RyaWN0cyA9IGdldFRvdGFsUmVkQ2F0ZWdvcnlEaXN0cmljdHMoMiwgdmFjY2luZURhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjYXQzRGlzdHJpY3RzID0gZ2V0VG90YWxSZWRDYXRlZ29yeURpc3RyaWN0cygzLCB2YWNjaW5lRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNhdDREaXN0cmljdHMgPSBnZXRUb3RhbFJlZENhdGVnb3J5RGlzdHJpY3RzKDQsIHZhY2NpbmVEYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b3RhbERpc3RyaWN0cyA9IGNhdDFEaXN0cmljdHMgKyBjYXQyRGlzdHJpY3RzICsgY2F0M0Rpc3RyaWN0cyArIGNhdDREaXN0cmljdHM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeVZhbHVlc1sxXS5wdXNoKGdldFJlZENhdGVnb3J5VmFsdWVzKG1vbnRoSW5kZXgsIGNhdDFEaXN0cmljdHMsIHRvdGFsRGlzdHJpY3RzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlWYWx1ZXNbMl0ucHVzaChnZXRSZWRDYXRlZ29yeVZhbHVlcyhtb250aEluZGV4LCBjYXQyRGlzdHJpY3RzLCB0b3RhbERpc3RyaWN0cykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5VmFsdWVzWzNdLnB1c2goZ2V0UmVkQ2F0ZWdvcnlWYWx1ZXMobW9udGhJbmRleCwgY2F0M0Rpc3RyaWN0cywgdG90YWxEaXN0cmljdHMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeVZhbHVlc1s0XS5wdXNoKGdldFJlZENhdGVnb3J5VmFsdWVzKG1vbnRoSW5kZXgsIGNhdDREaXN0cmljdHMsIHRvdGFsRGlzdHJpY3RzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjaGFydERhdGEucHVzaCh7a2V5OiAnQ0FUMScsIGNvbG9yOiAnRGFya0dyZWVuJywgdmFsdWVzOiB2bS5maWxsTWlzc2luZ1ZhbHVlcyhjYXRlZ29yeVZhbHVlc1sxXSl9KTtcbiAgICAgICAgICAgICAgICBjaGFydERhdGEucHVzaCh7a2V5OiAnQ0FUMicsIGNvbG9yOiAnWWVsbG93JywgdmFsdWVzOiB2bS5maWxsTWlzc2luZ1ZhbHVlcyhjYXRlZ29yeVZhbHVlc1syXSl9KTtcbiAgICAgICAgICAgICAgICBjaGFydERhdGEucHVzaCh7a2V5OiAnQ0FUMycsIGNvbG9yOiAnT3JhbmdlJywgdmFsdWVzOiB2bS5maWxsTWlzc2luZ1ZhbHVlcyhjYXRlZ29yeVZhbHVlc1szXSl9KTtcbiAgICAgICAgICAgICAgICBjaGFydERhdGEucHVzaCh7a2V5OiAnQ0FUNCcsIGNvbG9yOiAnUmVkJywgdmFsdWVzOiB2bS5maWxsTWlzc2luZ1ZhbHVlcyhjYXRlZ29yeVZhbHVlc1s0XSl9KTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB5ZWFyTGFiZWwgaW4gcGVyaW9kVmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHZhY2NpbmUgaW4gcGVyaW9kVmFsdWVzW3llYXJMYWJlbF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSB2YWNjaW5lO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgKHZtLmFjdGl2ZURvc2UgIT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGtleSA9IHZtLmFjdGl2ZURvc2UgO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlcyA9IHZtLmZpbGxNaXNzaW5nVmFsdWVzKHBlcmlvZFZhbHVlc1t5ZWFyTGFiZWxdW3ZhY2NpbmVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0RGF0YS5wdXNoKHtrZXk6IGtleSwgdmFsdWVzOiB2YWx1ZXN9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNoYXJ0RGF0YTtcbiAgICAgICAgfTtcblxuICAgICAgICB2bS5maWxsTWlzc2luZ1ZhbHVlcyA9IGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgICAgICAgdmFyIG1vbnRoSW5kZXhlcyA9IF8ucmFuZ2UoMSwgMTMpO1xuICAgICAgICAgICAgdmFyIGV4aXN0aW5nSW5kZXhlcyA9IHZhbHVlcy5tYXAoZnVuY3Rpb24oaXRlbSkgeyByZXR1cm4gaXRlbS54OyB9KTtcbiAgICAgICAgICAgIHZhciBuZXdJbmRleGVzID0gbW9udGhJbmRleGVzLmZpbHRlcihmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4aXN0aW5nSW5kZXhlcy5pbmRleE9mKHYpIDwgMDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbmV3SW5kZXhlcy5mb3JFYWNoKGZ1bmN0aW9uKG1vbnRoSW5kZXgpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaCh7eDogbW9udGhJbmRleCwgeTogMH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWVzLnNvcnQoZnVuY3Rpb24oYSwgYikge3JldHVybiBhLnggLSBiLnh9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2bS5nZXRDaGFydE9wdGlvbnMgPSBmdW5jdGlvbihyZXBvcnRZZWFyKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdsaW5lQ2hhcnQnLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDQ1MCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDQ1MCxcbiAgICAgICAgICAgICAgICAgICAgdXNlSW50ZXJhY3RpdmVHdWlkZWxpbmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGludGVyYWN0aXZlTGF5ZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXZpdHk6ICdzJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbihkKXsgcmV0dXJuIGQueDsgfSxcbiAgICAgICAgICAgICAgICAgICAgeTogZnVuY3Rpb24oZCl7IHJldHVybiBkLnk7IH0sXG4gICAgICAgICAgICAgICAgICAgIGZvcmNlWTogWy0xMCwxNTBdLFxuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVDaGFuZ2U6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInN0YXRlQ2hhbmdlXCIpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlU3RhdGU6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcImNoYW5nZVN0YXRlXCIpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcFNob3c6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInRvb2x0aXBTaG93XCIpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcEhpZGU6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInRvb2x0aXBIaWRlXCIpOyB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHhBeGlzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWw6ICdNb250aHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGlja0Zvcm1hdDogZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwcEhlbHBlcnMuZ2V0TW9udGhGcm9tTnVtYmVyKGQsIHJlcG9ydFllYXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB5QXhpczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiAnUGVyY2VudGFnZSAoJSknXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihjaGFydCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiISEhIGxpbmVDaGFydCBjYWxsYmFjayAhISFcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmdldENoYXJ0VGl0bGUgPSBmdW5jdGlvbih2YWNjaW5lKSB7XG4gICAgICAgICAgICB2YXIgZHVyYXRpb24gPSB2bS5hY3RpdmVSZXBvcnRUb2dnbGVbMF0gPT0gJ0EnID8gXCJBbm51YWxpemVkXCIgOiBcIk1vbnRobHlcIjtcbiAgICAgICAgICAgIHZhciBhbnRpZ2VuTGFiZWwgPSB2bS5hY3RpdmVEb3NlICE9IHVuZGVmaW5lZCA/IHZtLmFjdGl2ZURvc2UgOiB2YWNjaW5lO1xuICAgICAgICAgICAgYW50aWdlbkxhYmVsID0gKHZhY2NpbmUgPT0gXCJBTExcIikgPyBcImFudGlnZW5zXCIgOiBhbnRpZ2VuTGFiZWw7XG4gICAgICAgICAgICB2YXIgeWVhclR5cGUgPSB2bS5hY3RpdmVSZXBvcnRZZWFyID09ICdDWScgPyAnQ2FsZW5kYXIgWWVhcicgOiAnRmluYW5jaWFsIHllYXInO1xuXG4gICAgICAgICAgICB2YXIgdGFiID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL2Ryb3BvdXRyYXRlXCIpXG4gICAgICAgICAgICAgICAgdGFiID0gXCJEcm9wb3V0IFJhdGVcIjtcbiAgICAgICAgICAgIGVsc2UgaWYgKHZtLnBhdGg9PVwiL2NvdmVyYWdlL3JlZGNhdGVnb3J5XCIpXG4gICAgICAgICAgICAgICAgdGFiID0gXCJSZWQgQ2F0ZWdvcml6YXRpb25cIjtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0YWIgPSBcIkNvdmVyYWdlXCI7XG5cbiAgICAgICAgICAgIHJldHVybiBcIlRyZW5kIG9mIFwiICsgZHVyYXRpb24gKyBcIiBcIiArIHRhYiArIFwiIG9mIFwiICtcbiAgICAgICAgICAgICAgICBhbnRpZ2VuTGFiZWwgKyBcIiBmb3IgXCIgKyB2bS5hY3RpdmVDb3ZlcmFnZVllYXIgKyBcIiBcIiArIHllYXJUeXBlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmdldFZhY2NpbmVEb3Nlc0J5UGVyaW9kID0gZnVuY3Rpb24ocGFyYW1zKSB7XG5cbiAgICAgICAgICAgIENvdmVyYWdlU2VydmljZS5nZXRWYWNjaW5lRG9zZXNCeVBlcmlvZChwYXJhbXMpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5vcHRpb25zTUNZID0gdm0uZ2V0Q2hhcnRPcHRpb25zKFwiQ1lcIik7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5vcHRpb25zQUNZID0gdm0uZ2V0Q2hhcnRPcHRpb25zKFwiQ1lcIik7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5vcHRpb25zTUZZID0gdm0uZ2V0Q2hhcnRPcHRpb25zKFwiRllcIik7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5vcHRpb25zQUZZID0gdm0uZ2V0Q2hhcnRPcHRpb25zKFwiRllcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGFNQ1kgPSB2bS5nZXRDaGFydERhdGEocGFyYW1zLCBkYXRhLCBcIkNZXCIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGFBQ1kgPSB2bS5nZXRDaGFydERhdGEocGFyYW1zLCBkYXRhLCBcIkNZXCIsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YU1GWSA9IHZtLmdldENoYXJ0RGF0YShwYXJhbXMsIGRhdGEsIFwiRllcIiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YUFGWSA9IHZtLmdldENoYXJ0RGF0YShwYXJhbXMsIGRhdGEsIFwiRllcIiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5jaGFydFRpdGxlID0gdm0uZ2V0Q2hhcnRUaXRsZSh2bS5zZWxlY3RlZEFudGlnZW4pO1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uZW5hYmxlUERGRG93bmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmRvd25sb2FkUERGID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vRml4IGNoYXJ0IGJlZm9yZSBkb3dubG9hZFxuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3RBbGwoXCJzdmcgLm52LWxpbmVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCIjZmZmZmZmXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52ZDMgLm52LWJhY2tncm91bmRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCIjZmZmZmZmXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52ZDMgLm52LWF4aXMgbGluZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIFwiI2U1ZTVlNVwiKTtcblxuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3RBbGwoXCIubnZkMyB0ZXh0XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmb250XCIsIFwibm9ybWFsIDEzcHggQXJpYWwsIHNhbnMtc2VyaWZcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52ZDMgLm52LWdyb3VwcyAubnYtcG9pbnRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlLXdpZHRoXCIsIFwiMHB4XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdEFsbChcIi5udmQzIC5udi1heGlzIC56ZXJvIGxpbmVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBcIiM0MDQwNDBcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52LXkgLm52LWF4aXMgZyBwYXRoLmRvbWFpblwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIFwiIzQwNDA0MFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3RBbGwoXCIubGVnZW5kUXVhbnQgLmxhYmVsXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmb250XCIsIFwibm9ybWFsIDEycHggQXJpYWwsIHNhbnMtc2VyaWZcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHBkZiA9IG5ldyBqc1BERignbCcsICdtbScpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHsgZm9ybWF0IDogJ1BORycgfTtcblxuICAgICAgICAgICAgICAgICAgICBwZGYuYWRkSFRNTChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBkZlJlcG9ydFwiKSwgMCwgMCwgb3B0aW9ucywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcGRmLnNhdmUoJ2NvdmVyYWdlLXJlcG9ydC5wZGYnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vICRzY29wZS4kb24oJ3JlZnJlc2gnLCBmdW5jdGlvbihlLCBzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgLy8gICAgIGlmKHN0YXJ0TW9udGgubmFtZSAmJiBlbmRNb250aC5uYW1lICYmIGRpc3RyaWN0Lm5hbWUgJiYgdmFjY2luZS5uYW1lKSB7XG4gICAgICAgICRzY29wZS4kb24oXG4gICAgICAgICAgICAncmVmcmVzaENvdmVyYWdlMicsXG4gICAgICAgICAgICBmdW5jdGlvbihlLCBlbmRNb250aCwgc3RhcnRZZWFyLCBlbmRZZWFyLCBhY3RpdmVDb3ZlcmFnZVllYXIsIGFudGlnZW4sIGRvc2UsIGRpc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgLyogYnkgRmVsaXg7IE11bHRpcGxlIEdlb0pzb24gcmVxdWVzdHMgd2VyZSBiZWluZyBzZW50LFxuICAgICAgICAgICAgICAgIHRyYWNlZCB0aGUgcHJvYmxlbSB0byBtdWx0aXBsZSBDb3ZlcmFnZUNvbnRyb2xsZXIgY2FsbHMuXG4gICAgICAgICAgICAgICAgRm91bmQgc29sdXRpb24gYnkgY2hlY2tpbmcgY3VycmVudFNjb3BlIGFzIHNob3duXG4gICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpZiAoJ3ZtJyBpbiBlLmN1cnJlbnRTY29wZSkge1xuICAgICAgICAgICAgICAgICAgICAvL3ZtLmdldFN0b2NrQnlEaXN0cmljdChzdGFydE1vbnRoLm5hbWUsIGVuZE1vbnRoLm5hbWUsIGRpc3RyaWN0Lm5hbWUsIHZhY2NpbmUubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vdm0uZ2V0U3RvY2tCeURpc3RyaWN0VmFjY2luZShzdGFydE1vbnRoLm5hbWUsIGVuZE1vbnRoLm5hbWUsIGRpc3RyaWN0Lm5hbWUsIHZhY2NpbmUubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vdm0uZ2V0REhJUzJWYWNjaW5lRG9zZXMoZW5kTW9udGgucGVyaW9kLCBkaXN0cmljdC5uYW1lLCB2YWNjaW5lLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB2bS5hY3RpdmVEaXN0cmljdCA9IGRpc3RyaWN0O1xuICAgICAgICAgICAgICAgICAgICB2bS5hY3RpdmVEb3NlID0gZG9zZTtcbiAgICAgICAgICAgICAgICAgICAgdm0uYWN0aXZlU3RhcnRZZWFyID0gc3RhcnRZZWFyO1xuICAgICAgICAgICAgICAgICAgICB2bS5hY3RpdmVFbmRZZWFyID0gZW5kWWVhcjtcbiAgICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRBbnRpZ2VuID0gYW50aWdlbjtcbiAgICAgICAgICAgICAgICAgICAgdm0uYWN0aXZlQ292ZXJhZ2VZZWFyID0gYWN0aXZlQ292ZXJhZ2VZZWFyO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbmFibGVEaXN0cmljdEdyb3VwaW5nID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZtLnBhdGggPT0gJy9jb3ZlcmFnZS9yZWRjYXRlZ29yeScpXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVEaXN0cmljdEdyb3VwaW5nID0gMTtcblxuICAgICAgICAgICAgICAgICAgICB2bS5lbmFibGVQREZEb3dubG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICB2bS5nZXRWYWNjaW5lRG9zZXNCeURpc3RyaWN0KGVuZE1vbnRoLnBlcmlvZCwgZGlzdHJpY3QsIGFudGlnZW4pO1xuICAgICAgICAgICAgICAgICAgICB2bS5nZXRWYWNjaW5lRG9zZXNCeVBlcmlvZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFllYXI6IGFjdGl2ZUNvdmVyYWdlWWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFllYXI6IGFjdGl2ZUNvdmVyYWdlWWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGFudGlnZW46IGFudGlnZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBkb3NlOiBkb3NlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRpc3RyaWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlRGlzdHJpY3RHcm91cGluZzogZW5hYmxlRGlzdHJpY3RHcm91cGluZ1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyB2bS5nZXRWYWNjaW5lRG9zZXMoZW5kTW9udGgucGVyaW9kLCBhbnRpZ2VuLCBkaXN0cmljdCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVDb3ZlcmFnZVllYXIgIT0gdm0ubGFzdEVuZFllYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldFZhY2NpbmVEb3NlcyhhY3RpdmVDb3ZlcmFnZVllYXIsIGFudGlnZW4sIGRpc3RyaWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnVwZGF0ZU1hcFdpdGhWYWNjaW5lKGFudGlnZW4pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gdm0uZ2V0UmVkVmFjY2luZURvc2VzKGVuZE1vbnRoLnBlcmlvZCwgYW50aWdlbik7XG5cblxuICAgICAgICAgICAgICAgICAgICB2bS5sYXN0RW5kWWVhciA9IGFjdGl2ZUNvdmVyYWdlWWVhcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICB9XG5cbl0pXG4gICAgLmRpcmVjdGl2ZShcInJlcG9ydFllYXJUb2dnbGVzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzdGF0aWMvYXBwL2NvbXBvbmVudHMvY292ZXJhZ2UvcmVwb3J0LXllYXItdG9nZ2xlcy5odG1sJ1xuICAgICAgICB9XG4gICAgfSk7XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJykuY29udHJvbGxlcignRmluYW5jZURhdGFDb250cm9sbGVyJywgRmluYW5jZURhdGFDb250cm9sbGVyKTtcblxuRmluYW5jZURhdGFDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckaHR0cCcsICdGaW5hbmNlU2VydmljZSddO1xuZnVuY3Rpb24gRmluYW5jZURhdGFDb250cm9sbGVyKCRzY29wZSwgJGh0dHAsIEZpbmFuY2VTZXJ2aWNlKSB7XG5cbiAgICAkc2NvcGUuYWRkTmV3Um93ID0gYWRkTmV3Um93O1xuICAgICRzY29wZS5zYXZlUm93ID0gc2F2ZVJvdztcblxuICAgICRzY29wZS5ncmlkT3B0aW9ucyA9IHt9O1xuICAgICRzY29wZS5ncmlkT3B0aW9ucy5kYXRhID0gW107XG4gICAgJHNjb3BlLmdyaWRPcHRpb25zLmNvbHVtbkRlZnMgPSBbXG4gICAgICAgIHtuYW1lOiAncGVyaW9kJywgZW5hYmxlQ2VsbEVkaXQ6IHRydWUgfSxcbiAgICAgICAge25hbWU6ICdnYXZpX2FwcHJvdmVkJywgZW5hYmxlQ2VsbEVkaXQ6IHRydWUgfSxcbiAgICAgICAge25hbWU6ICdnYXZpX2Rpc2J1cnNlZCcsIGVuYWJsZUNlbGxFZGl0OiB0cnVlIH0sXG4gICAgICAgIHtuYW1lOiAnZ291X2FwcHJvdmVkJywgZW5hYmxlQ2VsbEVkaXQ6IHRydWUgfSxcbiAgICAgICAge25hbWU6ICdnb3VfZGlzYnVyc2VkJywgZW5hYmxlQ2VsbEVkaXQ6IHRydWUgfVxuICAgIF07XG5cbiAgICAvLyAkaHR0cC5nZXQoJy9maW5hbmNlL2xpc3QnLCB7fSlcbiAgICAvLyAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAvLyAgICAgICAgIHZhciBkYXRhID0gYW5ndWxhci5mcm9tSnNvbihyZXNwb25zZS5kYXRhKTtcbiAgICAvLyAgICAgICAgIGRhdGEubWFwKGZ1bmN0aW9uKGQpIHtcbiAgICAvLyAgICAgICAgICAgICAkc2NvcGUuZ3JpZE9wdGlvbnMuZGF0YS5wdXNoKGQuZmllbGRzKTtcbiAgICAvLyAgICAgICAgIH0pO1xuICAgIC8vICAgICB9KVxuICAgIEZpbmFuY2VTZXJ2aWNlLmdldEZpbmFuY2VEYXRhKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIGRhdGEubWFwKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICRzY29wZS5ncmlkT3B0aW9ucy5kYXRhLnB1c2goZCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLmdyaWRPcHRpb25zLm9uUmVnaXN0ZXJBcGkgPSBmdW5jdGlvbihncmlkQXBpKXtcbiAgICAgICAgJHNjb3BlLmdyaWRBcGkgPSBncmlkQXBpO1xuICAgICAgICBncmlkQXBpLnJvd0VkaXQub24uc2F2ZVJvdygkc2NvcGUsICRzY29wZS5zYXZlUm93KTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gYWRkTmV3Um93KCkge1xuICAgICAgICAkc2NvcGUuZ3JpZE9wdGlvbnMuZGF0YS5wdXNoKHtcbiAgICAgICAgICAgIHBlcmlvZDogMCxcbiAgICAgICAgICAgIGdhdmlfYXBwcm92ZWQ6IDAsXG4gICAgICAgICAgICBnYXZpX2Rpc2J1cnNlZDogMCxcbiAgICAgICAgICAgIGdvdV9hcHByb3ZlZDogMCxcbiAgICAgICAgICAgIGdvdV9kaXNidXJzZWQ6IDBcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2F2ZVJvdyhyb3dFbnRpdHkpIHtcbiAgICAgICAgJGh0dHAuZGVmYXVsdHMueHNyZkNvb2tpZU5hbWUgPSAnY3NyZnRva2VuJztcbiAgICAgICAgJGh0dHAuZGVmYXVsdHMueHNyZkhlYWRlck5hbWUgPSAnWC1DU1JGVG9rZW4nO1xuICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJy9maW5hbmNlL3VwZGF0ZScsIHJvd0VudGl0eSlcblxuICAgICAgICAkc2NvcGUuZ3JpZEFwaS5yb3dFZGl0LnNldFNhdmVQcm9taXNlKHJvd0VudGl0eSwgcHJvbWlzZS5wcm9taXNlKTtcbiAgICAgICAgY29uc29sZS5sb2cocm93RW50aXR5KTtcbiAgICB9XG59XG5cbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKS5jb250cm9sbGVyKCdNYWluRmluYW5jZUNvbnRyb2xsZXInLCBNYWluRmluYW5jZUNvbnRyb2xsZXIpO1xuXG5NYWluRmluYW5jZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0NoYXJ0UERGRXhwb3J0JywgJ0NoYXJ0U3VwcG9ydFNlcnZpY2UnLCAnRmluYW5jZVNlcnZpY2UnXTtcbmZ1bmN0aW9uIE1haW5GaW5hbmNlQ29udHJvbGxlcigkc2NvcGUsIENoYXJ0UERGRXhwb3J0LCBDaGFydFN1cHBvcnRTZXJ2aWNlLCBGaW5hbmNlU2VydmljZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uZXhwb3J0UERGID0gQ2hhcnRQREZFeHBvcnQuZXhwb3J0O1xuICAgIHZtLmdyYXBoT3B0aW9ucyA9IGdldE9wdGlvbnMoKTtcbiAgICB2bS55ZWFySW5kZXhlcyA9IFtdO1xuICAgIHZtLmFjdGl2ZVRvZ2dsZSA9ICdHQVZJJztcblxuICAgIHJlc2V0R3JhcGhEYXRhKCk7XG4gICAgc2V0WWVhckZpbHRlck9wdGlvbnMoKTtcblxuICAgICRzY29wZS4kd2F0Y2goJ3ZtLmFjdGl2ZVRvZ2dsZScsIGNoYW5nZVRhYnMpO1xuICAgICRzY29wZS4kb24oJ3JlZnJlc2hDb3ZlcmFnZTMnLCB1cGRhdGVDaGFydCk7XG5cbiAgICBmdW5jdGlvbiByZXNldEdyYXBoRGF0YSgpIHtcbiAgICAgICAgdm0uZ3JhcGhEYXRhID0gZ2V0RGVmYXVsdEdyYXBoRGF0YSgpO1xuICAgICAgICB2bS5hbGxvY0dyYXBoRGF0YSA9IFtdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFllYXJGaWx0ZXJPcHRpb25zKCkge1xuICAgICAgICBGaW5hbmNlU2VydmljZS5nZXRGaW5hbmNlWWVhcnMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICRzY29wZS4kcGFyZW50LmZpbmFuY2VZZWFycyA9IGRhdGE7XG4gICAgICAgICAgICAkc2NvcGUuJGVtaXQoJ3NldERlZmF1bHRZZWFycycsIGRhdGFbMF0sIGRhdGFbZGF0YS5sZW5ndGgtMV0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXREZWZhdWx0R3JhcGhEYXRhKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2F2aUFsbG9jOiBbXG4gICAgICAgICAgICAgICAge2tleTogJ0FwcHJvdmVkJywgdmFsdWVzOiBbXX0sXG4gICAgICAgICAgICAgICAge2tleTogJ0Rpc2J1cnNlZCcsIHZhbHVlczogW119XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgZ291QWxsb2M6IFtcbiAgICAgICAgICAgICAgICB7a2V5OiAnQXBwcm92ZWQnLCB2YWx1ZXM6IFtdfSxcbiAgICAgICAgICAgICAgICB7a2V5OiAnRGlzYnVyc2VkJywgdmFsdWVzOiBbXX1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBhbGxPYmxpZzogW1xuICAgICAgICAgICAgICAgIHtrZXk6ICdHYXZpIEZ1bmRzJywgdmFsdWVzOiBbXX0sXG4gICAgICAgICAgICAgICAge2tleTogJ0dPVSBGdW5kcycsIHZhbHVlczogW119XG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZGF0ZUNoYXJ0KGUsIHBhcmFtcykge1xuICAgICAgICByZXNldEdyYXBoRGF0YSgpO1xuICAgICAgICBGaW5hbmNlU2VydmljZS5nZXRGaW5hbmNlRGF0YShwYXJhbXMpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIHllYXJJbmRleCA9IGdldFllYXJJbmRleChkYXRhW2ldLnBlcmlvZClcblxuICAgICAgICAgICAgICAgIHZtLmdyYXBoRGF0YS5hbGxPYmxpZ1swXS52YWx1ZXMucHVzaCh7eDogeWVhckluZGV4LCB5OiBkYXRhW2ldLmdhdmlfYXBwcm92ZWR9KTtcbiAgICAgICAgICAgICAgICB2bS5ncmFwaERhdGEuYWxsT2JsaWdbMV0udmFsdWVzLnB1c2goe3g6IHllYXJJbmRleCwgeTogZGF0YVtpXS5nb3VfYXBwcm92ZWR9KTtcblxuICAgICAgICAgICAgICAgIHZtLmdyYXBoRGF0YS5nYXZpQWxsb2NbMF0udmFsdWVzLnB1c2goe3g6IHllYXJJbmRleCwgeTogZGF0YVtpXS5nYXZpX2FwcHJvdmVkfSk7XG4gICAgICAgICAgICAgICAgdm0uZ3JhcGhEYXRhLmdhdmlBbGxvY1sxXS52YWx1ZXMucHVzaCh7eDogeWVhckluZGV4LCB5OiBkYXRhW2ldLmdhdmlfZGlzYnVyc2VkfSk7XG5cbiAgICAgICAgICAgICAgICB2bS5ncmFwaERhdGEuZ291QWxsb2NbMF0udmFsdWVzLnB1c2goe3g6IHllYXJJbmRleCwgeTogZGF0YVtpXS5nb3VfYXBwcm92ZWR9KTtcbiAgICAgICAgICAgICAgICB2bS5ncmFwaERhdGEuZ291QWxsb2NbMV0udmFsdWVzLnB1c2goe3g6IHllYXJJbmRleCwgeTogZGF0YVtpXS5nb3VfZGlzYnVyc2VkfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKlRyaWdnZXIgdGhlIGxvYWRpbmcgb2YgdGhlIGluaXRhbCBUYWIsIHdpdGggcmFuZG9tIHZhbHVlcyovXG4gICAgICAgICAgICBjaGFuZ2VUYWJzKDAsMSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE9wdGlvbnMoKSB7XG4gICAgICAgIHZhciBjaGFydE9wdGlvbnMgPSBDaGFydFN1cHBvcnRTZXJ2aWNlLmdldE9wdGlvbnMoJ211bHRpQmFyQ2hhcnQnKTtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LmNvbG9yID0gW1wiZ3JlZW5cIiwgXCJEb2RnZXJCbHVlXCJdO1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQud2lkdGggPSA5MDA7XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC5tYXJnaW4gPSB7bGVmdDogNzAsIHRvcDogNzB9O1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQubGVnZW5kLndpZHRoID0gOTAwO1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQueEF4aXMuYXhpc0xhYmVsID0gXCJ5ZWFyc1wiO1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQueUF4aXMuYXhpc0xhYmVsID0gXCJcIjtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LnhBeGlzLnRpY2tGb3JtYXQgPSBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgIHJldHVybiB2bS55ZWFySW5kZXhlc1tkXTtcbiAgICAgICAgfTtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LnZhbHVlRm9ybWF0ID0gZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICByZXR1cm4gdGlja0Zvcm1hdChkMy5mb3JtYXQoJy4wZicpKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGNoYXJ0T3B0aW9ucztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRZZWFySW5kZXgoeWVhcikge1xuICAgICAgICBpZiAodm0ueWVhckluZGV4ZXMuaW5kZXhPZih5ZWFyKSA9PSAtMSkgdm0ueWVhckluZGV4ZXMucHVzaCh5ZWFyKTtcbiAgICAgICAgcmV0dXJuIHZtLnllYXJJbmRleGVzLmluZGV4T2YoeWVhcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hhbmdlVGFicyhuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgaWYgKG5ld1ZhbHVlICE9IG9sZFZhbHVlKSB7XG4gICAgICAgICAgICBDaGFydFN1cHBvcnRTZXJ2aWNlLmNsZWFyTGFiZWxzKCk7XG4gICAgICAgICAgICBpZiAodm0uYWN0aXZlVG9nZ2xlID09ICdHQVZJJylcbiAgICAgICAgICAgICAgICB2bS5hbGxvY0dyYXBoRGF0YSA9IHZtLmdyYXBoRGF0YS5nYXZpQWxsb2M7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdm0uYWxsb2NHcmFwaERhdGEgPSB2bS5ncmFwaERhdGEuZ291QWxsb2M7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpXG4uY29udHJvbGxlcignRnJpZGdlQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0ZyaWRnZVNlcnZpY2UnLCAnJHJvb3RTY29wZScsICdOZ1RhYmxlUGFyYW1zJywgJ0ZpbHRlclNlcnZpY2UnLFxuZnVuY3Rpb24oJHNjb3BlLCBGcmlkZ2VTZXJ2aWNlLCAkcm9vdFNjb3BlLCBOZ1RhYmxlUGFyYW1zLCBGaWx0ZXJTZXJ2aWNlKVxue1xuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2YXIgc2hlbGxTY29wZSA9ICRzY29wZS4kcGFyZW50O1xuICAgIHNoZWxsU2NvcGUuY2hpbGQgPSAkc2NvcGU7XG5cbiAgICB2bS5nZXRGcmlkZ2VBbGxEaXN0cmljdENhcGFjaXR5ID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKSB7XG5cbiAgICAgICAgdm0uc3RhcnRRdWFydGVyID0gdm0uc3RhcnRRdWFydGVyID8gdm0uc3RhcnRRdWFydGVyIDogXCIyMDE2MDFcIjtcbiAgICAgICAgdm0uZW5kUXVhcnRlciA9IHZtLmVuZFF1YXJ0ZXIgPyB2bS5lbmRRdWFydGVyIDogXCIyMDE2MDRcIjtcbiAgICAgICAgZnJpZGdlRGlzdHJpY3QgPSBcIlwiO1xuICAgICAgICB2bS5jYXJlbGV2ZWwgPSBjYXJlbGV2ZWw7XG5cbiAgICAgICAgRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VEaXN0cmljdENhcGFjaXR5KHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuXG4gICAgICAgICAgICB0YWJsZWRhdGFBbGxkaXN0cmljdHMgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zQ2FwYWNpdHlBbGxkaXN0cmljdHMgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YUFsbGRpc3RyaWN0cyxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vPT09PUFkZGl0aW9uYWwgTWV0cmljcz09PT1cblxuICAgICAgICAgICAgICAgIHZhciBtZXRyaWNzID0gRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VDYXBhY2l0eU1ldHJpY3Modm0uZGF0YSk7XG5cbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnVzdXJwID0gbWV0cmljcy5zdXJwbHVzO1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudXN1ZmZpY2llbnQgPSBtZXRyaWNzLnN1ZmZpY2llbnQ7XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC51c2hvcnRhZ2U9IG1ldHJpY3Muc2hvcnRhZ2U7XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uZ2V0RnJpZGdlRGlzdHJpY3RDYXBhY2l0eSA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuXG4gICAgICAgICAgICB2bS5zdGFydFF1YXJ0ZXIgPyB2bS5zdGFydFF1YXJ0ZXIgOiBcIjIwMTYwMVwiO1xuICAgICAgICAgICAgdm0uZW5kUXVhcnRlciA9IHZtLmVuZFF1YXJ0ZXIgPyB2bS5lbmRRdWFydGVyIDogXCIyMDE2MDRcIjtcbiAgICAgICAgICAgIGRpc3RyaWN0ID0gXCJcIjtcbiAgICAgICAgICAgIHZtLmZyaWRnZURpc3RyaWN0ID0gZnJpZGdlRGlzdHJpY3Q7XG4gICAgICAgICAgICB2bS5jYXJlbGV2ZWwgPSBjYXJlbGV2ZWw7XG5cbiAgICAgICAgICAgIEZyaWRnZVNlcnZpY2UuZ2V0RnJpZGdlRGlzdHJpY3RDYXBhY2l0eShzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuXG5cbiAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdG90YWxzXG5cbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmZyaWRnZURpc3RyaWN0ID0gZGlzdHJpY3Q7XG5cblxuXG5cbiAgICAgICAgICAgICAgICAvLyBjb25zdHJ1Y3QgRGlzdHJpY3QgZ3JhcGggZGF0YVxuICAgICAgICAgICAgICAgIHZhciBncmFwaGRhdGEgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgc2VyaWVzUmVxdWlyZWQgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgc2VyaWVzQXZhaWxhYmxlID0gW107XG4gICAgICAgICAgICAgICAgdmFyIHNlcmllc0dhcCA9IFtdO1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuYXZhaWxhYmxlID0gMDtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uZGF0YS5sZW5ndGggOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgc2VyaWVzUmVxdWlyZWQucHVzaChbdm0uZGF0YVtpXS5xdWFydGVyLnNsaWNlKDAsNCkgKyBcIi1RXCIgKyB2bS5kYXRhW2ldLnF1YXJ0ZXIuc2xpY2UoNSw2KSwgdm0uZGF0YVtpXS5yZXF1aXJlZF0pXG4gICAgICAgICAgICAgICAgICAgIHNlcmllc0F2YWlsYWJsZS5wdXNoKFt2bS5kYXRhW2ldLnF1YXJ0ZXIuc2xpY2UoMCw0KSArIFwiLVFcIiArIHZtLmRhdGFbaV0ucXVhcnRlci5zbGljZSg1LDYpLCB2bS5kYXRhW2ldLmF2YWlsYWJsZV0pXG4gICAgICAgICAgICAgICAgICAgIHNlcmllc0dhcC5wdXNoKFt2bS5kYXRhW2ldLnF1YXJ0ZXIuc2xpY2UoMCw0KSArIFwiLVFcIiArIHZtLmRhdGFbaV0ucXVhcnRlci5zbGljZSg1LDYpLCB2bS5kYXRhW2ldLmdhcF0pXG4gICAgICAgICAgICAgICAgICAgIGlmICh2bS5kYXRhW2ldLnF1YXJ0ZXIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5hdmFpbGFibGUgPSB2bS5kYXRhW2ldLmF2YWlsYWJsZVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICBzZXJpZXNSZXF1aXJlZCA9IFtbMjAxNjAyLCAzMF0sIFsyMDE2MDMsIDMwXV07XG4gICAgICAgICAgICAgICAgc2VyaWVzQXZhaWxhYmxlID0gW1syMDE2MDIsIDYwXSwgWzIwMTYwMywgMjBdXTtcbiAgICAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAgICAgZ3JhcGhkYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBrZXk6IFwiUmVxdWlyZWRcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBzZXJpZXNSZXF1aXJlZCxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6JyMyQTQ0OEEnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZ3JhcGhkYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBrZXk6IFwiQXZhaWxhYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlczogc2VyaWVzQXZhaWxhYmxlLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjonZ3JlZW4nXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB2bS5ncmFwaCA9IGdyYXBoZGF0YTtcblxuXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIGdyYXBoXG4gICAgICAgICAgICAgICAgdm0ub3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibXVsdGlCYXJDaGFydFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA0NTAsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDIwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3R0b206IDQ1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IDQ1XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpcEVkZ2U6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgeDogZnVuY3Rpb24oZCl7IHJldHVybiBkWzBdOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogZnVuY3Rpb24oZCl7IHJldHVybiBkWzFdOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dZQXhpczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbG9yOiBmdW5jdGlvbihkKXsgcmV0dXJuICdncmVlbid9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFsdWVGb3JtYXQ6IGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgcmV0dXJuIHRpY2tGb3JtYXQoZDMuZm9ybWF0KCcsLjFmJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfTtcblxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIHZtLmdldEZyaWRnZUZhY2lsaXR5Q2FwYWNpdHkgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcblxuICAgICAgICAgICAgdm0uc3RhcnRRdWFydGVyID8gdm0uc3RhcnRRdWFydGVyIDogXCIyMDE2MDFcIjtcbiAgICAgICAgICAgIHZtLmVuZFF1YXJ0ZXIgPSB2bS5lbmRRdWFydGVyID8gdm0uZW5kUXVhcnRlciA6IFwiMjAxNjA0XCI7XG4gICAgICAgICAgICBkaXN0cmljdCA9IFwiXCI7XG4gICAgICAgICAgICB2bS5kaXN0cmljdCA9IGZyaWRnZURpc3RyaWN0O1xuICAgICAgICAgICAgdm0uY2FyZWxldmVsID0gY2FyZWxldmVsO1xuXG4gICAgICAgICAgICBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZUZhY2lsaXR5Q2FwYWNpdHkoc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcbiAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc19mID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb3VudDogMTVcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB2bS5kYXRhLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRvdGFsc1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZnJpZGdlRGlzdHJpY3QgPSB2bS5mcmlkZ2VEaXN0cmljdDtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmNhcmVsZXZlbCA9IHZtLmNhcmVsZXZlbDtcblxuICAgICAgICAgICAgICAgIC8vPT09PUFkZGl0aW9uYWwgTWV0cmljcz09PT1cblxuICAgICAgICAgICAgICAgIHZhciBtZXRyaWNzID0gRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VDYXBhY2l0eU1ldHJpY3Modm0uZGF0YSk7XG5cbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnV0c3VycCA9IChtZXRyaWNzLnN1cnBsdXMvbWV0cmljcy50b3RhbCkqMTAwO1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudXRzdWZmaWNpZW50ID0gKG1ldHJpY3Muc3VmZmljaWVudC9tZXRyaWNzLnRvdGFsKSoxMDA7XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC51dHNob3J0YWdlPSAobWV0cmljcy5zaG9ydGFnZS9tZXRyaWNzLnRvdGFsKSoxMDA7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgdm0uZ2V0RnJpZGdlQWxsRGlzdHJpY3RSZWZyaWdlcmF0b3IgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcblxuICAgICAgICAgICAgdm0uc3RhcnRRdWFydGVyID0gdm0uc3RhcnRRdWFydGVyID8gdm0uc3RhcnRRdWFydGVyIDogXCIyMDE2MDFcIjtcbiAgICAgICAgICAgIHZtLmVuZFF1YXJ0ZXIgPSB2bS5lbmRRdWFydGVyID8gdm0uZW5kUXVhcnRlciA6IFwiMjAxNjA0XCI7XG4gICAgICAgICAgICBmcmlkZ2VEaXN0cmljdCA9IFwiXCI7XG4gICAgICAgICAgICB2bS5mcmlkZ2VEaXN0cmljdCA9IGZyaWRnZURpc3RyaWN0O1xuICAgICAgICAgICAgdm0uY2FyZWxldmVsID0gY2FyZWxldmVsO1xuXG4gICAgICAgICAgICBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZURpc3RyaWN0UmVmcmlnZXJhdG9yKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG4gICAgICAgICAgICAgICAgdGFibGVkYXRhQWxsZGlzdHJpY3RzID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNGdW5jdGlvbmFsaXR5QWxsZGlzdHJpY3RzID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFBbGxkaXN0cmljdHMsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2bS5nZXRGcmlkZ2VEaXN0cmljdFJlZnJpZ2VyYXRvciA9IGZ1bmN0aW9uKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuXG4gICAgICAgICAgICAgICAgdm0uc3RhcnRRdWFydGVyID0gdm0uc3RhcnRRdWFydGVyID8gdm0uc3RhcnRRdWFydGVyIDogXCIyMDE2MDFcIjtcbiAgICAgICAgICAgICAgICB2bS5lbmRRdWFydGVyID0gdm0uZW5kUXVhcnRlciA/IHZtLmVuZFF1YXJ0ZXIgOiBcIjIwMTYwNFwiO1xuICAgICAgICAgICAgICAgIGRpc3RyaWN0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICB2bS5jYXJlbGV2ZWwgPSBjYXJlbGV2ZWw7XG5cbiAgICAgICAgICAgICAgICBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZURpc3RyaWN0UmVmcmlnZXJhdG9yKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhQWxsZGlzdHJpY3RzID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zQWxsZGlzdHJpY3RzID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFBbGxkaXN0cmljdHMsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfZCA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxNVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdm0uZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zdHJ1Y3QgRGlzdHJpY3QgZ3JhcGggZGF0YVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ3JhcGhmdW5jdGlvbmFsaXR5ZGF0YSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlcmllc0V4aXN0aW5nID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VyaWVzTm90V29ya2luZyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlcmllc21haW50ZW5hbmNlID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZnVuY3Rpb25hbGl0eSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmZyaWRnZURpc3RyaWN0ID0gZGlzdHJpY3Q7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5kYXRhLmxlbmd0aCA7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcmllc0V4aXN0aW5nLnB1c2goW3ZtLmRhdGFbaV0ucXVhcnRlci5zbGljZSgwLDQpICsgXCItUVwiICsgdm0uZGF0YVtpXS5xdWFydGVyLnNsaWNlKDUsNiksIHZtLmRhdGFbaV0ubnVtYmVyX2V4aXN0aW5nXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpZXNOb3RXb3JraW5nLnB1c2goW3ZtLmRhdGFbaV0ucXVhcnRlci5zbGljZSgwLDQpICsgXCItUVwiICsgdm0uZGF0YVtpXS5xdWFydGVyLnNsaWNlKDUsNiksIHZtLmRhdGFbaV0ubm90X3dvcmtpbmddKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcmllc21haW50ZW5hbmNlLnB1c2goW3ZtLmRhdGFbaV0ucXVhcnRlci5zbGljZSgwLDQpICsgXCItUVwiICsgdm0uZGF0YVtpXS5xdWFydGVyLnNsaWNlKDUsNiksIHZtLmRhdGFbaV0ubmVlZHNfbWFpbnRlbmFuY2VdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2bS5kYXRhW2ldLnF1YXJ0ZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5mdW5jdGlvbmFsaXR5ID0gKHZtLmRhdGFbaV0ubnVtYmVyX2V4aXN0aW5nIC0gdm0uZGF0YVtpXS5ub3Rfd29ya2luZykvdm0uZGF0YVtpXS5udW1iZXJfZXhpc3RpbmcqMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBncmFwaGZ1bmN0aW9uYWxpdHlkYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJFeGlzdGluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogc2VyaWVzRXhpc3RpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J2dyZWVuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBncmFwaGZ1bmN0aW9uYWxpdHlkYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJOb3QgV29ya2luZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogc2VyaWVzTm90V29ya2luZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjonIzJBNDQ4QSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhmdW5jdGlvbmFsaXR5ZGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiTmVlZHMgbWFpbnRlbmFuY2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IHNlcmllc21haW50ZW5hbmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOidyZWQnXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ3JhcGhmdW5jdGlvbmFsaXR5ID0gZ3JhcGhmdW5jdGlvbmFsaXR5ZGF0YTtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGUgZ3JhcGhcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLm9wdGlvbnNmdW5jdGlvbmFsaXR5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibXVsdGlCYXJDaGFydFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDQ1MCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDIwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IDIwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiA0NSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IDQ1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dDb250cm9sczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaXBFZGdlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbihkKXsgcmV0dXJuIGRbMF07IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFsxXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1lBeGlzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy92YWx1ZUZvcm1hdDogZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgIHJldHVybiB0aWNrRm9ybWF0KGQzLmZvcm1hdCgnLC4xZicpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cblxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdm0uZ2V0RnJpZGdlRmFjaWxpdHlSZWZyaWdlcmF0b3IgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcblxuICAgICAgICAgICAgICAgICAgICB2bS5zdGFydFF1YXJ0ZXIgPyB2bS5zdGFydFF1YXJ0ZXIgOiBcIjIwMTYwMVwiO1xuICAgICAgICAgICAgICAgICAgICB2bS5lbmRRdWFydGVyID0gdm0uZW5kUXVhcnRlciA/IHZtLmVuZFF1YXJ0ZXIgOiBcIjIwMTYwNFwiO1xuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIHZtLmRpc3RyaWN0ID0gZnJpZGdlRGlzdHJpY3Q7XG4gICAgICAgICAgICAgICAgICAgIHZtLmNhcmVsZXZlbCA9IGNhcmVsZXZlbDtcblxuICAgICAgICAgICAgICAgICAgICBGcmlkZ2VTZXJ2aWNlLmdldEZyaWRnZUZhY2lsaXR5UmVmcmlnZXJhdG9yKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhQWxsZmFjaWxpdGllcyA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc0FsbGZhY2lsaXRpZXMgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YUFsbGZhY2lsaXRpZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc19mID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB2bS5kYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRvdGFsc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZnJpZGdlRGlzdHJpY3QgPSB2bS5mcmlkZ2VEaXN0cmljdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmNhcmVsZXZlbCA9IHZtLmNhcmVsZXZlbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgdm0uZ2V0RnJpZGdlQWxsRGlzdHJpY3RJbW11bml6aW5nRmFjaWxpdHkgPSBmdW5jdGlvbihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uc3RhcnRRdWFydGVyID0gdm0uc3RhcnRRdWFydGVyID8gdm0uc3RhcnRRdWFydGVyIDogXCIyMDE2MDFcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmVuZFF1YXJ0ZXIgPSB2bS5lbmRRdWFydGVyID8gdm0uZW5kUXVhcnRlciA6IFwiMjAxNjA0XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcmlkZ2VEaXN0cmljdCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5jYXJlbGV2ZWwgPSBjYXJlbGV2ZWw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIEZyaWRnZVNlcnZpY2UuZ2V0RnJpZGdlRGlzdHJpY3RJbW11bml6aW5nRmFjaWxpdHkoc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxEYXRhID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFBbGxkaXN0cmljdHMgPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc0ltbXVuaXppbmdBbGxkaXN0cmljdHMgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YUFsbGRpc3RyaWN0cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldEZyaWRnZURpc3RyaWN0SW1tdW5pemluZ0ZhY2lsaXR5ID0gZnVuY3Rpb24oc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdCwgY2FyZWxldmVsKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5zdGFydFF1YXJ0ZXIgPyB2bS5zdGFydFF1YXJ0ZXIgOiBcIjIwMTYwMVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmVuZFF1YXJ0ZXIgPSBlbmRRdWFydGVyLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3QgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRpc3RyaWN0ID0gZnJpZGdlRGlzdHJpY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uY2FyZWxldmVsID0gY2FyZWxldmVsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VEaXN0cmljdEltbXVuaXppbmdGYWNpbGl0eShzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LCBjYXJlbGV2ZWwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YUFsbGZyaWRnZSA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc0FsbGZyaWRnZSA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhQWxsZnJpZGdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zX2QgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHZtLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRvdGFsc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5mcmlkZ2VEaXN0cmljdCA9IGRpc3RyaWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5xdWFydGVyID0gZW5kUXVhcnRlci5uYW1lIC0gMjtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zdHJ1Y3QgRGlzdHJpY3QgZ3JhcGggZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdyYXBoZGF0YWltbXVuaXppbmcgPSBbXTtcblxuXG5cblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmRhdGEubGVuZ3RoIDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIEltbXVuaXppbmcgPSB2bS5kYXRhW2ldLmltbXVuaXppbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIE5vdEltbXVuaXppbmcgPSB2bS5kYXRhW2ldLlRvdGFsX2ZhY2lsaXRpZXMgLSB2bS5kYXRhW2ldLmltbXVuaXppbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmZhY2lsaXR5ID0gdm0uZGF0YVtpXS5pbW11bml6aW5nO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGUgZ3JhcGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLm9wdGlvbnNpbW11bml6aW5nID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwaWVDaGFydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQua2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQueTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0xhYmVsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxUaHJlc2hvbGQ6IDAuMDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsU3VuYmVhbUxheW91dDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ3JhcGhpbW11bml6aW5nID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIkltbXVuaXppbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogSW1tdW5pemluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J2dyZWVuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiTm90IEltbXVuaXppbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogTm90SW1tdW5pemluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6JyMyQTQ0OEEnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kb24oJ3JlZnJlc2hDYXBhY2l0eScsIGZ1bmN0aW9uKGUsIHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QsIGNhcmVsZXZlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihzdGFydFF1YXJ0ZXIgJiYgZW5kUXVhcnRlciAmJiBmcmlkZ2VEaXN0cmljdC5kaXN0cmljdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0RnJpZGdlRGlzdHJpY3RSZWZyaWdlcmF0b3Ioc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdC5kaXN0cmljdCwgY2FyZWxldmVsLmdyb3VwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldEZyaWRnZUFsbERpc3RyaWN0UmVmcmlnZXJhdG9yKHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QuZGlzdHJpY3QsIGNhcmVsZXZlbC5ncm91cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRGcmlkZ2VGYWNpbGl0eVJlZnJpZ2VyYXRvcihzdGFydFF1YXJ0ZXIsIGVuZFF1YXJ0ZXIsIGZyaWRnZURpc3RyaWN0LmRpc3RyaWN0LCBjYXJlbGV2ZWwuZ3JvdXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0RnJpZGdlQWxsRGlzdHJpY3RJbW11bml6aW5nRmFjaWxpdHkoc3RhcnRRdWFydGVyLCBlbmRRdWFydGVyLCBmcmlkZ2VEaXN0cmljdC5kaXN0cmljdCwgY2FyZWxldmVsLmdyb3VwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldEZyaWRnZURpc3RyaWN0SW1tdW5pemluZ0ZhY2lsaXR5KHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QuZGlzdHJpY3QsIGNhcmVsZXZlbC5ncm91cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRGcmlkZ2VBbGxEaXN0cmljdENhcGFjaXR5KHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QuZGlzdHJpY3QsIGNhcmVsZXZlbC5ncm91cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRGcmlkZ2VEaXN0cmljdENhcGFjaXR5KHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QuZGlzdHJpY3QsIGNhcmVsZXZlbC5ncm91cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRGcmlkZ2VGYWNpbGl0eUNhcGFjaXR5KHN0YXJ0UXVhcnRlciwgZW5kUXVhcnRlciwgZnJpZGdlRGlzdHJpY3QuZGlzdHJpY3QsIGNhcmVsZXZlbC5ncm91cCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgXSk7XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJylcbiAgICAuY29udHJvbGxlcignUGxhbm5pbmdDb250cm9sbGVyJywgWyckc2NvcGUnLCAnQW5udWFsU2VydmljZScsICckcm9vdFNjb3BlJywgJ05nVGFibGVQYXJhbXMnLCAnRmlsdGVyU2VydmljZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCBBbm51YWxTZXJ2aWNlLCAkcm9vdFNjb3BlLCBOZ1RhYmxlUGFyYW1zLCBGaWx0ZXJTZXJ2aWNlKVxuICAgIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdmFyIHNoZWxsU2NvcGUgPSAkc2NvcGUuJHBhcmVudDtcbiAgICAgICAgc2hlbGxTY29wZS5jaGlsZCA9ICRzY29wZTtcblxuICAgICAgICB2bS5nZXRGdW5kQWN0aXZpdGllcyA9IGZ1bmN0aW9uKHllYXIpIHtcbiAgICAgICAgICAgIHllYXIgPSBcIlwiXG4gICAgICAgICAgICB2bS55ZWFyID0geWVhcjtcblxuICAgICAgICAgICAgQW5udWFsU2VydmljZS5nZXRGdW5kQWN0aXZpdGllcyh5ZWFyKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlZGF0YV9mdW5kZWQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlZGF0YV91bmZ1bmRlZCA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG5cblxuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFfZnVuZGVkID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuZnVuZCA9PSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YV91bmZ1bmRlZCA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmZ1bmQgPT0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG5cblxuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFmdW5kID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNmdW5kZWQgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDE1XG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YWZ1bmQsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0b3RhbHNcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZ3JhcGhkYXRhZnVuZCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZnVuZGVkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVuZnVuZGVkID0gMDtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2bS5kYXRhW2ldLmZ1bmQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmRlZCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodm0uZGF0YVtpXS5mdW5kID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5mdW5kZWQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG5cblxuXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBncmFwaFxuICAgICAgICAgICAgICAgICAgICB2bS5mdW5kYWN0aXZpdHkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwaWVDaGFydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC5rZXk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC55O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0xhYmVsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsVGhyZXNob2xkOiAwLjAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsU3VuYmVhbUxheW91dDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByaWdodDogMzUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3R0b206IDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGZ1bmRlZCA9PSB2bS5kYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ3JhcGhmdW5kZWRhY3Rpdml0aWVzID0gW107XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc19mdW5kZWQgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YV9mdW5kZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfdW5mdW5kZWQgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YV91bmZ1bmRlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdyYXBoZnVuZGVkYWN0aXZpdGllcyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJGdW5kZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogKGZ1bmRlZCAvIHZtLmRhdGEubGVuZ3RoKSAqIDEwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J2dyZWVuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiVW5mdW5kZWQgQWN0aXZpdGllc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiAodW5mdW5kZWQgLyB2bS5kYXRhLmxlbmd0aCkgKiAxMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOidyZWQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB2bS5nZXRQcmlvcml0eUFjdGl2aXRpZXMgPSBmdW5jdGlvbih5ZWFyKSB7XG4gICAgICAgICAgICB5ZWFyID0gXCJcIlxuICAgICAgICAgICAgdm0ueWVhciA9IHllYXI7XG5cbiAgICAgICAgICAgIEFubnVhbFNlcnZpY2UuZ2V0UHJpb3JpdHlBY3Rpdml0aWVzKHllYXIpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGVkYXRhX3ByaW9yaXR5ZnVuZCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGVkYXRhX3ByaW9yaXR5dW5mdW5kZWQgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhX3ByaW9yaXR5ZnVuZCA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmZ1bmQgPT0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFfcHJpb3JpdHl1bmZ1bmRlZCA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmZ1bmQgPT0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG5cblxuXG5cblxuICAgICAgICAgICAgICAgICAgICBpZiAoZnVuZGVkID09IHZtLmRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5ncmFwaGZ1bmRlZGFjdGl2aXRpZXMgPSBbXTtcblxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc19wcmlvcml0eWZ1bmQ9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxNVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhX3ByaW9yaXR5ZnVuZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc19wcmlvcml0eXVuZnVuZGVkID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDE1XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFfcHJpb3JpdHl1bmZ1bmRlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zdHJ1Y3QgRGlzdHJpY3QgZ3JhcGggZGF0YVxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJpb3JpdHlkYXRhID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciBwcmlvcml0eWRhdGF1biA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgSGlnaHByaW9yaXR5ID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciBNZWRpdW1wcmlvcml0eSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgTG93cHJpb3JpdHkgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIEhpZ2hwcmlvcml0eXVuID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciBNZWRpdW1wcmlvcml0eXVuID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciBMb3dwcmlvcml0eXVuID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5kYXRhLmxlbmd0aCA7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZtLmRhdGFbaV0uZnVuZCA9PSB0cnVlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBIaWdocHJpb3JpdHkucHVzaChbdm0uZGF0YVtpXS5hcmVhLCB2bS5kYXRhW2ldLkhpZ2hdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1lZGl1bXByaW9yaXR5LnB1c2goW3ZtLmRhdGFbaV0uYXJlYSwgdm0uZGF0YVtpXS5NZWRpdW1dKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIExvd3ByaW9yaXR5LnB1c2goW3ZtLmRhdGFbaV0uYXJlYSwgdm0uZGF0YVtpXS5Mb3ddKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSGlnaHByaW9yaXR5dW4ucHVzaChbdm0uZGF0YVtpXS5hcmVhLCB2bS5kYXRhW2ldLkhpZ2hdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1lZGl1bXByaW9yaXR5dW4ucHVzaChbdm0uZGF0YVtpXS5hcmVhLCB2bS5kYXRhW2ldLk1lZGl1bV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTG93cHJpb3JpdHl1bi5wdXNoKFt2bS5kYXRhW2ldLmFyZWEsIHZtLmRhdGFbaV0uTG93XSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHlkYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJISUdIXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBIaWdocHJpb3JpdHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6JyMyQTQ0OEEnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eWRhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIk1FRElVTVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogTWVkaXVtcHJpb3JpdHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J2dyZWVuJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHlkYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJMT1dcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IExvd3ByaW9yaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOid5ZWxsb3cnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLnByaW9yaXR5Z3JhcGggPSBwcmlvcml0eWRhdGE7XG5cblxuICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGUgZ3JhcGhcbiAgICAgICAgICAgICAgICAgICAgdm0ucHJpb3JpdHlvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibXVsdGlCYXJDaGFydFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDQ1MCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6NTAwLFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaXBFZGdlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbihkKXsgcmV0dXJuIGRbMF07IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFsxXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1lBeGlzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93WEF4aXM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdGF0ZUxhYmVsczogNTUsXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eWRhdGF1bi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiSElHSFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogSGlnaHByaW9yaXR5dW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6JyMyQTQ0OEEnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eWRhdGF1bi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiTUVESVVNXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBNZWRpdW1wcmlvcml0eXVuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOidncmVlbidcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5ZGF0YXVuLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJMT1dcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IExvd3ByaW9yaXR5dW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J3llbGxvdydcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdm0ucHJpb3JpdHlncmFwaHVuID0gcHJpb3JpdHlkYXRhdW47XG5cbiAgICAgICAgICAgICAgICAgICAgdm0ucHJpb3JpdHlvcHRpb25zdW4gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJtdWx0aUJhckNoYXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogNDUwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDo1MDAsXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpcEVkZ2U6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFswXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogZnVuY3Rpb24oZCl7IHJldHVybiBkWzFdOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93VmFsdWVzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93WUF4aXM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dYQXhpczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm90YXRlTGFiZWxzOiA1NSxcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJ3JlZnJlc2hBd3AnLCBmdW5jdGlvbihlLCB5ZWFyKSB7XG4gICAgICAgICAgICAgICAgaWYoeWVhci55ZWFyKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uZ2V0RnVuZEFjdGl2aXRpZXMoeWVhci55ZWFyKTtcbiAgICAgICAgICAgICAgICAgICAgdm0uZ2V0UHJpb3JpdHlBY3Rpdml0aWVzKHllYXIueWVhcik7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgXSk7XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJylcbiAgICAuY29udHJvbGxlcignU3RvY2tDb250cm9sbGVyJywgWyckc2NvcGUnLCAnU3RvY2tTZXJ2aWNlJywgJyRyb290U2NvcGUnLCAnTmdUYWJsZVBhcmFtcycsXG4gICAgJ0ZpbHRlclNlcnZpY2UnLCAnTW9udGhTZXJ2aWNlJywgJyRsb2NhdGlvbicsICdDaGFydFN1cHBvcnRTZXJ2aWNlJywgJ0NoYXJ0UERGRXhwb3J0JywgJyR0aW1lb3V0JyxcbiAgICBmdW5jdGlvbigkc2NvcGUsIFN0b2NrU2VydmljZSwgJHJvb3RTY29wZSwgTmdUYWJsZVBhcmFtcywgRmlsdGVyU2VydmljZSwgTW9udGhTZXJ2aWNlLFxuICAgICAgICAkbG9jYXRpb24sIENoYXJ0U3VwcG9ydFNlcnZpY2UsIENoYXJ0UERGRXhwb3J0LCAkdGltZW91dClcbiAgICB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZhciBzaGVsbFNjb3BlID0gJHNjb3BlLiRwYXJlbnQ7XG4gICAgICAgIHNoZWxsU2NvcGUuY2hpbGQgPSAkc2NvcGU7XG4gICAgICAgIHZtLmV4cG9ydFBERiA9IENoYXJ0UERGRXhwb3J0LmV4cG9ydDtcblxuICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmlzQWN0aXZlID0gZnVuY3Rpb24odmlld0xvY2F0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdmlld0xvY2F0aW9uID09PSAkbG9jYXRpb24ucGF0aCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFRvZG86IFVzZSB0aGlzIHRvIHNvcnQgYnkgcGVyZm9ybWFuY2UgKE1hbGlzYSlcbiAgICAgICAgdm0uU29ydEJ5S2V5ID0gZnVuY3Rpb24oYXJyYXksIGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5LnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIHZhciB4ID0gYVtrZXldOyB2YXIgeSA9IGJba2V5XTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCh4IDwgeSkgPyAtMSA6ICgoeCA+IHkpID8gMSA6IDApKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmdldFN0b2NrQnlEaXN0cmljdCA9IGZ1bmN0aW9uKHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSkge1xuXG4gICAgICAgICAgICB2bS5zdGFydE1vbnRoID8gdm0uc3RhcnRNb250aCA6IFwiXCI7XG4gICAgICAgICAgICB2bS5lbmRNb250aCA9IHZtLmVuZE1vbnRoID8gdm0uZW5kTW9udGggOiBcIlwiO1xuICAgICAgICAgICAgLy9Ub2RvOiBUZW1wb3JhcmlseSBkaXNhYmxlIGZpbHRlcmluZyBieSBkaXN0cmljdCBmb3IgdGhlIHRhYmxlXG4gICAgICAgICAgICBkaXN0cmljdCA9IFwiXCJcbiAgICAgICAgICAgIHZtLmRpc3RyaWN0ID0gXCJcIjtcbiAgICAgICAgICAgIHZtLnZhY2NpbmUgPSB2bS5zZWxlY3RlZFZhY2NpbmUgPyB2bS5zZWxlY3RlZFZhY2NpbmUubmFtZSA6IFwiXCI7XG5cbiAgICAgICAgICAgIFN0b2NrU2VydmljZS5nZXRTdG9ja0J5RGlzdHJpY3Qoc3RhcnRNb250aCwgZW5kTW9udGgsIGRpc3RyaWN0LCB2YWNjaW5lKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGVkYXRhX3NvID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZWRhdGFfYm0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlZGF0YV93ciA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGVkYXRhX2FtID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZWRhdGFfc2VhcmNoID1bXTtcblxuICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YV9zbyA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmF0X2hhbmQgPT0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YV9hbSA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmF0X2hhbmQgPiB2YWx1ZS5zdG9ja19yZXF1aXJlbWVudF9fbWF4aW11bTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YV93ciA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgodmFsdWUuYXRfaGFuZCA+IHZhbHVlLnN0b2NrX3JlcXVpcmVtZW50X19taW5pbXVtKSAmJiAodmFsdWUuYXRfaGFuZCA8IHZhbHVlLnN0b2NrX3JlcXVpcmVtZW50X19tYXhpbXVtKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB0YWJsZWRhdGFfYm0gPSB2bS5kYXRhLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoKHZhbHVlLmF0X2hhbmQgPCB2YWx1ZS5zdG9ja19yZXF1aXJlbWVudF9fbWluaW11bSkgJiYgKHZhbHVlLmF0X2hhbmQgPiAwKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhX3NlYXJjaCA9IHZtLmRhdGEuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhQWxsZGlzdHJpY3RzID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc0FsbGRpc3RyaWN0cyA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTBcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhQWxsZGlzdHJpY3RzLFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdG90YWxzXG4gICAgICAgICAgICAgICAgICAgIHZhciBub3RoaW5nID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdpdGhpbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBiZWxvd21pbmltdW0gPSAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWJvdmVtYXhpbXVtID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXR1cyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZtLmRhdGFbaV0uYXRfaGFuZCA9PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdGhpbmcrKyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM9XCJTdG9ja2VkIE91dFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoKHZtLmRhdGFbaV0uYXRfaGFuZCA+IHZtLmRhdGFbaV0uc3RvY2tfcmVxdWlyZW1lbnRfX21pbmltdW0pICYmICh2bS5kYXRhW2ldLmF0X2hhbmQgPCB2bS5kYXRhW2ldLnN0b2NrX3JlcXVpcmVtZW50X19tYXhpbXVtKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRoaW4rKyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM9XCJXaXRoaW4gUmFuZ2VcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCh2bS5kYXRhW2ldLmF0X2hhbmQgPCB2bS5kYXRhW2ldLnN0b2NrX3JlcXVpcmVtZW50X19taW5pbXVtKSAmJiAodm0uZGF0YVtpXS5hdF9oYW5kID4gMCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVsb3dtaW5pbXVtKyssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzPVwiQmVsb3cgTUlOXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh2bS5kYXRhW2ldLmF0X2hhbmQgPiB2bS5kYXRhW2ldLnN0b2NrX3JlcXVpcmVtZW50X19tYXhpbXVtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFib3ZlbWF4aW11bSsrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cz1cIkFib3ZlIE1BWFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZGF0YVtpXS5zdGF0dXM9c3RhdHVzO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5zdG9ja2Vkb3V0ID0gKG5vdGhpbmcgLyB2bS5kYXRhLmxlbmd0aCkgKiAxMDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBiYWxhbmNlTW9udGggPSBuZXcgRGF0ZShNb250aFNlcnZpY2UubW9udGhUb0RhdGUoZW5kTW9udGgpKTtcbiAgICAgICAgICAgICAgICAgICAgYmFsYW5jZU1vbnRoLnNldE1vbnRoKGJhbGFuY2VNb250aC5nZXRNb250aCgpIC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudGhlbW9udGggPSBiYWxhbmNlTW9udGg7XG4gICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQudmFjY2luZSA9IHZhY2NpbmU7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlIGdyYXBoXG4gICAgICAgICAgICAgICAgICAgIHZtLm9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwaWVDaGFydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC5rZXk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC55O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0xhYmVsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsVGhyZXNob2xkOiAwLjAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsU3VuYmVhbUxheW91dDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByaWdodDogMzUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3R0b206IDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vdGhpbmcgPT0gdm0uZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdyYXBoID0gW107XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc19zbyA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhX3NvLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zX2JtID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YWJsZWRhdGFfYm0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNfd3IgPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YV93cixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc19hbSA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhX2FtLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc19zZWFyY2ggPSBuZXcgTmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJEZWxheTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhYmxlZGF0YV9zZWFyY2gsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ3JhcGggPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiU3RvY2tlZCBPdXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogKG5vdGhpbmcgLyB2bS5kYXRhLmxlbmd0aCkgKiAxMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjRkYwMDAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiV2l0aGluIFJhbmdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6ICh3aXRoaW4gLyB2bS5kYXRhLmxlbmd0aCkgKiAxMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjRkZGRjAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiQmVsb3cgTUlOXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IChiZWxvd21pbmltdW0gLyB2bS5kYXRhLmxlbmd0aCkgKiAxMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjRkZBNTAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiQWJvdmUgTUFYXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IChhYm92ZW1heGltdW0gLyB2bS5kYXRhLmxlbmd0aCkgKiAxMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjMDA4MDAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uZ2V0U3RvY2tCeURpc3RyaWN0VmFjY2luZSA9IGZ1bmN0aW9uKHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSkge1xuXG4gICAgICAgICAgICB2bS5zdGFydE1vbnRoID8gdm0uc3RhcnRNb250aCA6IFwiTm92IDIwMTVcIjtcbiAgICAgICAgICAgIHZtLmVuZE1vbnRoID0gdm0uZW5kTW9udGggPyB2bS5lbmRNb250aCA6IFwiRGVjIDIwMTZcIjtcbiAgICAgICAgICAgIC8vVG9kbzogVGVtcG9yYXJpbHkgZGlzYWJsZSBmaWx0ZXJpbmcgYnkgZGlzdHJpY3QgZm9yIHRoZSB0YWJsZVxuICAgICAgICAgICAgLy9kaXN0cmljdCA9IFwiXCJcbiAgICAgICAgICAgIHZtLmRpc3RyaWN0ID0gZGlzdHJpY3Q7XG4gICAgICAgICAgICB2bS52YWNjaW5lID0gdmFjY2luZTsgLy92bS5zZWxlY3RlZFZhY2NpbmUgPyB2bS5zZWxlY3RlZFZhY2NpbmUubmFtZSA6IFwiXCI7XG5cbiAgICAgICAgICAgIFN0b2NrU2VydmljZS5nZXRTdG9ja0J5RGlzdHJpY3RWYWNjaW5lKHN0YXJ0TW9udGgsIGVuZE1vbnRoLCBkaXN0cmljdCwgdmFjY2luZSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb3VudDogMTVcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICBjb3VudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB2bS5kYXRhLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRvdGFsc1xuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZGlzdHJpY3QgPSB2bS5kaXN0cmljdDtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnZhY2NpbmUgPSB2bS52YWNjaW5lO1xuXG5cbiAgICAgICAgICAgICAgICAvLyBjb25zdHJ1Y3QgRGlzdHJpYnV0aW9uIGdyYXBoIGRhdGFcbiAgICAgICAgICAgICAgICB2YXIgZ3JhcGhkYXRhRGlzdHJpYnV0aW9uID0gW107XG4gICAgICAgICAgICAgICAgdmFyIHNlcmllc0Rpc3RyaWJ1dGlvbiA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBzZXJpZXNPcmRlcnMgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgbWluX3Nlcmllc0Rpc3RyaWJ1dGlvbiA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBtYXhfc2VyaWVzRGlzdHJpYnV0aW9uID0gW107XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5yZWZyZXNocmF0ZSA9IDA7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmRhdGEubGVuZ3RoIDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcmllc0Rpc3RyaWJ1dGlvbi5wdXNoKFt2bS5kYXRhW2ldLm1vbnRoLCBwYXJzZUludCh2bS5kYXRhW2ldLnJlY2VpdmVkKV0pXG4gICAgICAgICAgICAgICAgICAgIHNlcmllc09yZGVycy5wdXNoKFt2bS5kYXRhW2ldLm1vbnRoLCB2bS5kYXRhW2ldLm9yZGVyZWRdKVxuICAgICAgICAgICAgICAgICAgICBtaW5fc2VyaWVzRGlzdHJpYnV0aW9uLnB1c2goW3ZtLmRhdGFbaV0ubW9udGgsIHZtLmRhdGFbaV0uc3RvY2tfcmVxdWlyZW1lbnRfX21pbmltdW1dKVxuICAgICAgICAgICAgICAgICAgICBtYXhfc2VyaWVzRGlzdHJpYnV0aW9uLnB1c2goW3ZtLmRhdGFbaV0ubW9udGgsIHZtLmRhdGFbaV0uc3RvY2tfcmVxdWlyZW1lbnRfX21heGltdW1dKVxuICAgICAgICAgICAgICAgICAgICBpZiAodm0uZGF0YVtpXS5tb250aCA9PSBNb250aFNlcnZpY2UuZ2V0TW9udGhOdW1iZXIoZW5kTW9udGguc3BsaXQoXCIgXCIpWzBdKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnJlZnJlc2hyYXRlID0gdm0uZGF0YVtpXS5vcmRlcmVkID09IDAgPyAwIDp2bS5kYXRhW2ldLnJlY2VpdmVkL3ZtLmRhdGFbaV0ub3JkZXJlZCoxMDAgO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGdyYXBoZGF0YURpc3RyaWJ1dGlvbi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJNaW5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogbWluX3Nlcmllc0Rpc3RyaWJ1dGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjQTVFODE2J1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGdyYXBoZGF0YURpc3RyaWJ1dGlvbi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJJc3N1ZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogc2VyaWVzRGlzdHJpYnV0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6JyMxRjc3QjQnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZ3JhcGhkYXRhRGlzdHJpYnV0aW9uLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcIk9yZGVyZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogc2VyaWVzT3JkZXJzLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J3JlZCdcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGdyYXBoZGF0YURpc3RyaWJ1dGlvbi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJNYXhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogbWF4X3Nlcmllc0Rpc3RyaWJ1dGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOicjRkY3RjBFJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdm0uZ3JhcGhEaXN0cmlidXRpb24gPSBncmFwaGRhdGFEaXN0cmlidXRpb247XG5cblxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBEaXN0cmlidXRpb24gZ3JhcGhcbiAgICAgICAgICAgICAgICB2bS5vcHRpb25zRGlzdHJpYnV0aW9uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbGluZUNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCA6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdBYmltJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0xlZ2VuZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dDb250cm9sczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW4gOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiA4NSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogNjVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlWTogKFswLDEwMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWdnZXJMYWJlbHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZnVuY3Rpb24oZCl7IHJldHVybiBkWzBdOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFsxXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWw6ICdNb250aHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWNrRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBNb250aFNlcnZpY2UuZ2V0TW9udGhOYW1lKGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWxEaXN0YW5jZTogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZUludGVyYWN0aXZlR3VpZGVsaW5lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVDaGFuZ2U6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInN0YXRlQ2hhbmdlXCIpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZVN0YXRlOiBmdW5jdGlvbihlKXsgY29uc29sZS5sb2coXCJjaGFuZ2VTdGF0ZVwiKTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwU2hvdzogZnVuY3Rpb24oZSl7IGNvbnNvbGUubG9nKFwidG9vbHRpcFNob3dcIik7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcEhpZGU6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInRvb2x0aXBIaWRlXCIpOyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93VmFsdWVzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpY2tGb3JtYXQoZDMuZm9ybWF0KCcsLjFmJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8vIGNvbnN0cnVjdCBVcHRha2UgZ3JhcGggZGF0YVxuXG5cbiAgICAgICAgICAgICAgICAvLyBjb25zdHJ1Y3QgQ29uc3VtcHRpb24gZ3JhcGggZGF0YVxuICAgICAgICAgICAgICAgIHZhciBncmFwaGRhdGFDb25zdW1wdGlvbiA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBzZXJpZXNDb25zdW1wdGlvbiA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXRfc2VyaWVzQ29uc3VtcHRpb24gPSBbXTtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmNvdmVyYWdlID0gMDtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uZGF0YS5sZW5ndGggOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgc2VyaWVzQ29uc3VtcHRpb24ucHVzaChbdm0uZGF0YVtpXS5tb250aCwgdm0uZGF0YVtpXS5jb25zdW1lZF0pXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldF9zZXJpZXNDb25zdW1wdGlvbi5wdXNoKFt2bS5kYXRhW2ldLm1vbnRoLCB2bS5kYXRhW2ldLnN0b2NrX3JlcXVpcmVtZW50X190YXJnZXRdKVxuICAgICAgICAgICAgICAgICAgICBpZiAodm0uZGF0YVtpXS5tb250aCA9PSBNb250aFNlcnZpY2UuZ2V0TW9udGhOdW1iZXIoZW5kTW9udGguc3BsaXQoXCIgXCIpWzBdKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmNvdmVyYWdlID0gdm0uZGF0YVtpXS5zdG9ja19yZXF1aXJlbWVudF9fdGFyZ2V0ID09IDAgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAgOnZtLmRhdGFbaV0uY29uc3VtZWQvdm0uZGF0YVtpXS5zdG9ja19yZXF1aXJlbWVudF9fdGFyZ2V0KjEwMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZ3JhcGhkYXRhQ29uc3VtcHRpb24ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiQWN0dWFsIENvbnN1bXB0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IHNlcmllc0NvbnN1bXB0aW9uXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZ3JhcGhkYXRhQ29uc3VtcHRpb24ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwiUGxhbm5lZCBjb25zdW1wdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiB0YXJnZXRfc2VyaWVzQ29uc3VtcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNGRjdGMEUnXG4gICAgICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgICAgIHZtLmdyYXBoQ29uc3VtcHRpb24gPSBncmFwaGRhdGFDb25zdW1wdGlvbjtcblxuXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIENvbnN1bXB0aW9uIGdyYXBoXG4gICAgICAgICAgICAgICAgdm0ub3B0aW9uc0NvbnN1bXB0aW9uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbGluZUNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCA6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdBYmltJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0xlZ2VuZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dDb250cm9sczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW4gOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiA4NSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogNjVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlWTogKFswLDEwMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWdnZXJMYWJlbHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZnVuY3Rpb24oZCl7IHJldHVybiBkWzBdOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uKGQpeyByZXR1cm4gZFsxXTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWw6ICdNb250aHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWNrRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBNb250aFNlcnZpY2UuZ2V0TW9udGhOYW1lKGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzTGFiZWxEaXN0YW5jZTogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZUludGVyYWN0aXZlR3VpZGVsaW5lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVDaGFuZ2U6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInN0YXRlQ2hhbmdlXCIpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZVN0YXRlOiBmdW5jdGlvbihlKXsgY29uc29sZS5sb2coXCJjaGFuZ2VTdGF0ZVwiKTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwU2hvdzogZnVuY3Rpb24oZSl7IGNvbnNvbGUubG9nKFwidG9vbHRpcFNob3dcIik7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcEhpZGU6IGZ1bmN0aW9uKGUpeyBjb25zb2xlLmxvZyhcInRvb2x0aXBIaWRlXCIpOyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93VmFsdWVzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlRm9ybWF0OiBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpY2tGb3JtYXQoZDMuZm9ybWF0KCcsLjFmJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS4kb24oJ3JlZnJlc2gnLCBmdW5jdGlvbihlLCBzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIGlmKHN0YXJ0TW9udGgubmFtZSAmJiBlbmRNb250aC5uYW1lICYmIGRpc3RyaWN0Lm5hbWUgJiYgdmFjY2luZS5uYW1lKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZtLmdldFN0b2NrQnlEaXN0cmljdChzdGFydE1vbnRoLm5hbWUsIGVuZE1vbnRoLm5hbWUsIGRpc3RyaWN0Lm5hbWUsIHZhY2NpbmUubmFtZSk7XG4gICAgICAgICAgICAgICAgdm0uZ2V0U3RvY2tCeURpc3RyaWN0VmFjY2luZShzdGFydE1vbnRoLm5hbWUsIGVuZE1vbnRoLm5hbWUsIGRpc3RyaWN0Lm5hbWUsIHZhY2NpbmUubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG5dKTtcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKS5jb250cm9sbGVyKCdTdG9ja1VwdGFrZUNvbnRyb2xsZXInLCBTdG9ja1VwdGFrZUNvbnRyb2xsZXIpO1xuXG5TdG9ja1VwdGFrZUNvbnRyb2xsZXIuJGluamVjdCA9IFtcbiAgICAnJHNjb3BlJyxcbiAgICAnU3RvY2tTZXJ2aWNlJyxcbiAgICAnTW9udGhTZXJ2aWNlJyxcbiAgICAnQ2hhcnRTdXBwb3J0U2VydmljZScsXG4gICAgJ0NoYXJ0UERGRXhwb3J0JyxcbiAgICAnJHRpbWVvdXQnXG5dO1xuZnVuY3Rpb24gU3RvY2tVcHRha2VDb250cm9sbGVyKCRzY29wZSwgU3RvY2tTZXJ2aWNlLCBNb250aFNlcnZpY2UsIENoYXJ0U3VwcG9ydFNlcnZpY2UsIENoYXJ0UERGRXhwb3J0LCAkdGltZW91dCkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdmFyIHNoZWxsU2NvcGUgPSAkc2NvcGUuJHBhcmVudDtcbiAgICBzaGVsbFNjb3BlLmNoaWxkID0gJHNjb3BlO1xuXG4gICAgc2hlbGxTY29wZS5jaGlsZC51cHRha2UgPSAwO1xuICAgIHZtLmV4cG9ydFBERiA9IENoYXJ0UERGRXhwb3J0LmV4cG9ydDtcblxuXG4gICAgdm0ub3B0aW9uc1VwdGFrZSA9IGdldE9wdGlvbnMoKTtcblxuICAgICRzY29wZS4kb24oJ3JlZnJlc2gnLCB1cGRhdGVDaGFydCk7XG4gICAgZnVuY3Rpb24gdXBkYXRlQ2hhcnQoZSwgc3RhcnRNb250aCwgZW5kTW9udGgsIGRpc3RyaWN0LCB2YWNjaW5lKSB7XG4gICAgICAgIFN0b2NrU2VydmljZS5nZXRTdG9ja0J5RGlzdHJpY3RWYWNjaW5lKHN0YXJ0TW9udGgubmFtZSwgZW5kTW9udGgubmFtZSwgZGlzdHJpY3QubmFtZSwgdmFjY2luZS5uYW1lKVxuICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuXG4gICAgICAgICAgICB2YXIgZ3JhcGhkYXRhVXB0YWtlID0gW107XG4gICAgICAgICAgICB2YXIgc2VyaWVzVXB0YWtlID0gW107XG4gICAgICAgICAgICB2YXIgc3RvY2tEYXRhID0gW107XG4gICAgICAgICAgICB2YXIgaW1tdW5pc2F0aW9uRGF0YSA9IFtdO1xuICAgICAgICAgICAgdmFyIG1vbnRobHlUYXJnZXREYXRhID0gW107XG4gICAgICAgICAgICB2YXIgZm9yY2VTdGFydFplcm9EYXRhID0gW107XG4gICAgICAgICAgICB2YXIgbWF4TW9udGhseVRhcmdldCA9IDA7XG4gICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnVwdGFrZSA9IFwiMFwiO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmRhdGEubGVuZ3RoIDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB2bS5kYXRhW2ldO1xuICAgICAgICAgICAgICAgIC8qIENlcnRhaW4gZGF0YSBoYWQgaW52YWxpZCBwZXJpb2RzIGxpa2UgMjAxNzIgaW5zdGVhZCBvZlxuICAgICAgICAgICAgICAgICAgICAyMDE3MDIgd2hpY2ggd2VyZSBjYXVzaW5nIGVycm9ycy4gSGVuY2UgdGhlIGZpbHRlciBiZWxvdy4gKi9cbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5wZXJpb2QudG9TdHJpbmcoKS5sZW5ndGggPT0gNSkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICB2YXIgbW9udGhJbmRleCA9IGFwcEhlbHBlcnMuZ2V0TW9udGhJbmRleEZyb21QZXJpb2QoaXRlbS5wZXJpb2QsICdDWScpO1xuICAgICAgICAgICAgICAgIHZhciBhdEhhbmQgPSBpdGVtLmF0X2hhbmQgPT0gdW5kZWZpbmVkID8gaXRlbS50b3RhbF9hdF9oYW5kIDogaXRlbS5hdF9oYW5kO1xuICAgICAgICAgICAgICAgIHZhciByZWNlaXZlZCA9IGl0ZW0ucmVjZWl2ZWQgPT0gdW5kZWZpbmVkID8gaXRlbS50b3RhbF9yZWNlaXZlZCA6IGl0ZW0ucmVjZWl2ZWQ7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnN1bWVkID0gaXRlbS5jb25zdW1lZCA9PSB1bmRlZmluZWQgPyBpdGVtLnRvdGFsX2NvbnN1bWVkIDogaXRlbS5jb25zdW1lZDtcbiAgICAgICAgICAgICAgICB2YXIgbW9udGhseVRhcmdldCA9IGl0ZW0uc3RvY2tfcmVxdWlyZW1lbnRfX3RhcmdldCA9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgPyBpdGVtLnRvdGFsX3RhcmdldCA6IGl0ZW0uc3RvY2tfcmVxdWlyZW1lbnRfX3RhcmdldDtcbiAgICAgICAgICAgICAgICB2YXIgdG90YWxTdG9jayA9IGF0SGFuZCArIHJlY2VpdmVkO1xuXG4gICAgICAgICAgICAgICAgbWF4TW9udGhseVRhcmdldCA9IE1hdGgubWF4KG1heE1vbnRobHlUYXJnZXQsIE51bWJlcihtb250aGx5VGFyZ2V0LnRvRml4ZWQoMCkpKTtcbiAgICAgICAgICAgICAgICBzdG9ja0RhdGEucHVzaCh7eDogbW9udGhJbmRleCwgeTogTnVtYmVyKHRvdGFsU3RvY2sudG9GaXhlZCgwKSl9KTtcbiAgICAgICAgICAgICAgICBpbW11bmlzYXRpb25EYXRhLnB1c2goe3g6IG1vbnRoSW5kZXgsIHk6IE51bWJlcihjb25zdW1lZC50b0ZpeGVkKDApKX0pO1xuICAgICAgICAgICAgICAgIG1vbnRobHlUYXJnZXREYXRhLnB1c2goe3g6IG1vbnRoSW5kZXgsIHk6IE51bWJlcihtb250aGx5VGFyZ2V0LnRvRml4ZWQoMCkpfSk7XG4gICAgICAgICAgICAgICAgZm9yY2VTdGFydFplcm9EYXRhLnB1c2goe3g6IG1vbnRoSW5kZXgsIHk6IDB9KTtcblxuICAgICAgICAgICAgICAgIGlmICh2bS5kYXRhW2ldLm1vbnRoID09IE1vbnRoU2VydmljZS5nZXRNb250aE51bWJlcihlbmRNb250aC5uYW1lLnNwbGl0KFwiIFwiKVswXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC51cHRha2UgPSByZWNlaXZlZCA9PSAwICYmIGF0SGFuZCA9PSAwID9cbiAgICAgICAgICAgICAgICAgICAgICAgIDAgOiBNYXRoLnJvdW5kKGNvbnN1bWVkLyh0b3RhbFN0b2NrKSoxMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZ3JhcGhkYXRhVXB0YWtlLnB1c2goe2tleTogJ0F2YWlsYWJsZSBTdG9jaycsIHR5cGU6ICdiYXInLCB5QXhpczogMSwgdmFsdWVzOiBzdG9ja0RhdGF9KTtcbiAgICAgICAgICAgIGdyYXBoZGF0YVVwdGFrZS5wdXNoKHtrZXk6ICdDaGlsZHJlbiBJbW11bmlzZWQnLCB0eXBlOiAnYmFyJywgeUF4aXM6IDEsIHZhbHVlczogaW1tdW5pc2F0aW9uRGF0YX0pO1xuICAgICAgICAgICAgZ3JhcGhkYXRhVXB0YWtlLnB1c2goe2tleTogJ01vbnRobHkgVGFyZ2V0cycsIHR5cGU6ICdsaW5lJywgeUF4aXM6IDEsIHZhbHVlczogbW9udGhseVRhcmdldERhdGF9KTtcbiAgICAgICAgICAgIGdyYXBoZGF0YVVwdGFrZS5wdXNoKHtrZXk6ICcnLCB0eXBlOiAnbGluZScsIHlBeGlzOiAxLCBzdHJva2VXaWR0aDogMCwgdmFsdWVzOiBmb3JjZVN0YXJ0WmVyb0RhdGF9KTtcbiAgICAgICAgICAgIHZtLmdyYXBoVXB0YWtlID0gZ3JhcGhkYXRhVXB0YWtlO1xuICAgICAgICAgICAgdm0ubWF4TW9udGhseVRhcmdldCA9IG1heE1vbnRobHlUYXJnZXQ7XG5cbiAgICAgICAgICAgIHVwZGF0ZUxhYmVscygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRPcHRpb25zKCkge1xuICAgICAgICB2YXIgdXB0YWtlT3B0aW9ucyA9IENoYXJ0U3VwcG9ydFNlcnZpY2UuZ2V0T3B0aW9ucygnbXVsdGlDaGFydCcpO1xuICAgICAgICB1cHRha2VPcHRpb25zLmNoYXJ0LmNvbG9yID0gW1wiZ3JlZW5cIiwgXCJEb2RnZXJCbHVlXCIsIFwicmVkXCIsIFwid2hpdGVcIl07XG4gICAgICAgIHVwdGFrZU9wdGlvbnMuY2hhcnQud2lkdGggPSA5MDA7XG4gICAgICAgIHVwdGFrZU9wdGlvbnMuY2hhcnQubWFyZ2luID0ge2xlZnQ6IDcwLCB0b3A6IDcwfTtcbiAgICAgICAgdXB0YWtlT3B0aW9ucy5jaGFydC5sZWdlbmQud2lkdGggPSA5MDA7XG4gICAgICAgIHVwdGFrZU9wdGlvbnMuY2hhcnQueEF4aXMuYXhpc0xhYmVsID0gXCJNb250aHNcIjtcbiAgICAgICAgdXB0YWtlT3B0aW9ucy5jaGFydC55QXhpcy5heGlzTGFiZWwgPSBcIlwiO1xuICAgICAgICB1cHRha2VPcHRpb25zLmNoYXJ0LnhBeGlzLnRpY2tGb3JtYXQgPSBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgIHJldHVybiBhcHBIZWxwZXJzLmdldE1vbnRoRnJvbU51bWJlcihkLCAnQ1knKTtcbiAgICAgICAgfTtcbiAgICAgICAgdXB0YWtlT3B0aW9ucy5jaGFydC52YWx1ZUZvcm1hdCA9IGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgcmV0dXJuIHRpY2tGb3JtYXQoZDMuZm9ybWF0KCcuMGYnKSk7XG4gICAgICAgIH07XG4gICAgICAgIHVwdGFrZU9wdGlvbnMuY2hhcnQubGVnZW5kLmRpc3BhdGNoLnN0YXRlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB1cGRhdGVMYWJlbHMoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHVwdGFrZU9wdGlvbnM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlTGFiZWxzKCkge1xuICAgICAgICBDaGFydFN1cHBvcnRTZXJ2aWNlLmNsZWFyTGFiZWxzKCk7XG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgQ2hhcnRTdXBwb3J0U2VydmljZS5pbml0TGFiZWxzKCk7XG4gICAgICAgICAgICAvKiBjaGFydC5jbGlwRWRnZSBzZWVtcyBub3QgdG8gYmUgd29ya2luZyxcbiAgICAgICAgICAgIHRoaXMgc2hvdWxkIHNlcnZlIGFzIGEgaGFjayAqL1xuICAgICAgICAgICAgZDMuc2VsZWN0QWxsKFwiLm52LW11bHRpYmFyIGdcIikuYXR0cihcImNsaXAtcGF0aFwiLCBcIlwiKTtcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgfVxufVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgLy8gJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpLmNvbnRyb2xsZXIoJ1N0b2Nrb3V0VHJlbmRDb250cm9sbGVyJywgU3RvY2tvdXRUcmVuZENvbnRyb2xsZXIpO1xuXG5TdG9ja291dFRyZW5kQ29udHJvbGxlci4kaW5qZWN0ID0gW1xuICAgICckc2NvcGUnLFxuICAgICdTdG9ja1NlcnZpY2UnLFxuICAgICdNb250aFNlcnZpY2UnLFxuICAgICdDaGFydFN1cHBvcnRTZXJ2aWNlJyxcbiAgICAnQ2hhcnRQREZFeHBvcnQnLFxuICAgICckdGltZW91dCdcbl07XG5mdW5jdGlvbiBTdG9ja291dFRyZW5kQ29udHJvbGxlcigkc2NvcGUsIFN0b2NrU2VydmljZSwgTW9udGhTZXJ2aWNlLCBDaGFydFN1cHBvcnRTZXJ2aWNlLCBDaGFydFBERkV4cG9ydCwgJHRpbWVvdXQpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmV4cG9ydFBERiA9IENoYXJ0UERGRXhwb3J0LmV4cG9ydDtcbiAgICB2bS5ncmFwaE9wdGlvbnMgPSBnZXRPcHRpb25zKCk7XG4gICAgdm0uZ3JhcGhEYXRhID0gW107XG5cbiAgICAkc2NvcGUuJG9uKCdyZWZyZXNoJywgdXBkYXRlQ2hhcnQpO1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlQ2hhcnQoZSwgc3RhcnRNb250aCwgZW5kTW9udGgsIGRpc3RyaWN0LCB2YWNjaW5lKSB7XG4gICAgICAgIFN0b2NrU2VydmljZS5nZXRTdG9ja0J5RGlzdHJpY3RWYWNjaW5lKHN0YXJ0TW9udGgubmFtZSwgZW5kTW9udGgubmFtZSwgZGlzdHJpY3QubmFtZSwgdmFjY2luZS5uYW1lKVxuICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB2bS5kYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuXG4gICAgICAgICAgICB2YXIgZ3JhcGhEYXRhID0gW107XG4gICAgICAgICAgICB2YXIgc3RvY2tEYXRhID0gW107XG4gICAgICAgICAgICB2YXIgc3VwcGx5RGF0YSA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmRhdGEubGVuZ3RoIDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB2bS5kYXRhW2ldO1xuICAgICAgICAgICAgICAgIC8qIENlcnRhaW4gZGF0YSBoYWQgaW52YWxpZCBwZXJpb2RzIGxpa2UgMjAxNzIgaW5zdGVhZCBvZlxuICAgICAgICAgICAgICAgICAgICAyMDE3MDIgd2hpY2ggd2VyZSBjYXVzaW5nIGVycm9ycy4gSGVuY2UgdGhlIGZpbHRlciBiZWxvdy4gKi9cbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5wZXJpb2QudG9TdHJpbmcoKS5sZW5ndGggPT0gNSkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICB2YXIgbW9udGhJbmRleCA9IGFwcEhlbHBlcnMuZ2V0TW9udGhJbmRleEZyb21QZXJpb2QoaXRlbS5wZXJpb2QsICdDWScpO1xuICAgICAgICAgICAgICAgIHZhciBhdEhhbmQgPSBpdGVtLmF0X2hhbmQgPT0gdW5kZWZpbmVkID8gaXRlbS50b3RhbF9hdF9oYW5kIDogaXRlbS5hdF9oYW5kO1xuICAgICAgICAgICAgICAgIHZhciByZWNlaXZlZCA9IGl0ZW0ucmVjZWl2ZWQgPT0gdW5kZWZpbmVkID8gaXRlbS50b3RhbF9yZWNlaXZlZCA6IGl0ZW0ucmVjZWl2ZWQ7XG5cbiAgICAgICAgICAgICAgICBzdG9ja0RhdGEucHVzaCh7eDogbW9udGhJbmRleCwgeTogTnVtYmVyKGF0SGFuZC50b0ZpeGVkKDApKX0pO1xuICAgICAgICAgICAgICAgIHN1cHBseURhdGEucHVzaCh7eDogbW9udGhJbmRleCwgeTogTnVtYmVyKHJlY2VpdmVkLnRvRml4ZWQoMCkpfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGdyYXBoRGF0YS5wdXNoKHtrZXk6ICdTdG9jayBCYWxhbmNlJywgdmFsdWVzOiBzdG9ja0RhdGF9KTtcbiAgICAgICAgICAgIGdyYXBoRGF0YS5wdXNoKHtrZXk6ICdTdXBwbHkgQnkgTk1TJywgdmFsdWVzOiBzdXBwbHlEYXRhfSk7XG4gICAgICAgICAgICB2bS5ncmFwaERhdGEgPSBncmFwaERhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE9wdGlvbnMoKSB7XG4gICAgICAgIHZhciBjaGFydE9wdGlvbnMgPSBDaGFydFN1cHBvcnRTZXJ2aWNlLmdldE9wdGlvbnMoJ211bHRpQmFyQ2hhcnQnKTtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LmNvbG9yID0gW1wiZ3JlZW5cIiwgXCJEb2RnZXJCbHVlXCJdO1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQud2lkdGggPSA5MDA7XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC5tYXJnaW4gPSB7bGVmdDogNzAsIHRvcDogNzB9O1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQubGVnZW5kLndpZHRoID0gOTAwO1xuICAgICAgICBjaGFydE9wdGlvbnMuY2hhcnQueEF4aXMuYXhpc0xhYmVsID0gXCJNb250aHNcIjtcbiAgICAgICAgY2hhcnRPcHRpb25zLmNoYXJ0LnlBeGlzLmF4aXNMYWJlbCA9IFwiXCI7XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC54QXhpcy50aWNrRm9ybWF0ID0gZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICByZXR1cm4gYXBwSGVscGVycy5nZXRNb250aEZyb21OdW1iZXIoZCwgJ0NZJyk7XG4gICAgICAgIH07XG4gICAgICAgIGNoYXJ0T3B0aW9ucy5jaGFydC52YWx1ZUZvcm1hdCA9IGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgcmV0dXJuIHRpY2tGb3JtYXQoZDMuZm9ybWF0KCcuMGYnKSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBjaGFydE9wdGlvbnM7XG4gICAgfVxuXG59XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAvLyAndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJylcbi5jb250cm9sbGVyKCdVbmVwaUNvbnRyb2xsZXInLCBbXG4gICAgJyRzY29wZScsICdDb3ZlcmFnZVNlcnZpY2UnLCdTdG9ja1NlcnZpY2UnLFxuICAgICdNb250aFNlcnZpY2UnLCAnJHJvb3RTY29wZScsICdOZ1RhYmxlUGFyYW1zJyxcbiAgICAnRmlsdGVyU2VydmljZScsICdGcmlkZ2VTZXJ2aWNlJywgJ0NvdmVyYWdlQ2FsY3VsYXRvcicsICckdGltZW91dCcsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCBDb3ZlcmFnZVNlcnZpY2UsIFN0b2NrU2VydmljZSxcbiAgICAgICAgTW9udGhTZXJ2aWNlLCAkcm9vdFNjb3BlLCBOZ1RhYmxlUGFyYW1zLFxuICAgICAgICBGaWx0ZXJTZXJ2aWNlLCBGcmlkZ2VTZXJ2aWNlLCBDb3ZlcmFnZUNhbGN1bGF0b3IsICR0aW1lb3V0KVxuICAgIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdmFyIHNoZWxsU2NvcGUgPSAkc2NvcGUuJHBhcmVudDtcbiAgICAgICAgc2hlbGxTY29wZS5jaGlsZCA9ICRzY29wZTtcblxuICAgICAgICBmdW5jdGlvbiBwZXJpb2REaXNwbGF5KHBlcmlvZClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIG1vbnRoID0gcGFyc2VJbnQocGVyaW9kLnNsaWNlKDQsNikpO1xuICAgICAgICAgICAgcmV0dXJuIE1vbnRoU2VydmljZS5nZXRNb250aE5hbWUobW9udGgpICsgXCIgXCIgKyBwZXJpb2Quc2xpY2UoMCw0KVxuICAgICAgICB9XG5cbiAgICAgICAgdm0uZ2V0VW5lcGlDb3ZlcmFnZSA9IGZ1bmN0aW9uKHBlcmlvZCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB7cGVyaW9kLCBkaXN0cmljdH07XG5cbiAgICAgICAgICAgIHZhciBnZXRWYWx1ZVN1bSA9IGZ1bmN0aW9uKGRhdGEsIG5hbWUsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YS5yZWR1Y2UoZnVuY3Rpb24oYWNjdW11bGF0b3IsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS52YWNjaW5lX19uYW1lID09IHZhY2NpbmUpIHJldHVybiBhY2N1bXVsYXRvciArIHZhbHVlW25hbWVdXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIENvdmVyYWdlU2VydmljZS5nZXRWYWNjaW5lRG9zZXNCeVBlcmlvZChwYXJhbXMpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciB0YWJsZURhdGEgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgcGVudGFDUiA9IDAsXG4gICAgICAgICAgICAgICAgICAgIHBjdkNSID0gMDtcblxuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZGlzdHJpY3QgPSBkaXN0cmljdDtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLkdhcCA9IDA7XG4gICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5kcm9wb3V0X1BlbnRhID0gMDtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmRyb3BvdXRfaHB2ID0gMDtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLmNhdGVnb3J5ID0gMDtcbiAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnBlcmlvZE1vbnRoID0gcGVyaW9kRGlzcGxheShwZXJpb2QpO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhUGVyaW9kID0gZGF0YVtpXS5wZXJpb2RcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3REb3NlID0gZGF0YVtpXS50b3RhbF9sYXN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmaXJzdERvc2UgPSBkYXRhW2ldLnRvdGFsX2ZpcnN0X2Rvc2U7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWNvbmREb3NlID0gZGF0YVtpXS50b3RhbF9zZWNvbmRfZG9zZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBsYW5uZWQgPSBkYXRhW2ldLnRvdGFsX3BsYW5uZWQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWNjaW5lID0gZGF0YVtpXS52YWNjaW5lX19uYW1lO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhUGVyaW9kICE9IHBlcmlvZCkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogU3VtIHVwIHRoZSB2YWx1ZXMgZnJvbSBzdGFydCBvZiB5ZWFyIHRvIHNlbGVjdGVkIHBlcmlvZFxuICAgICAgICAgICAgICAgICAgICAgdG8gY2FsY3VsYXRlIEFubnVhbGl6ZWQgQ292ZXJhZ2UgKGF2b2MpICovXG4gICAgICAgICAgICAgICAgICAgIHZhciB0b3RhbExhc3REb3NlID0gZ2V0VmFsdWVTdW0oZGF0YSwgJ3RvdGFsX2xhc3RfZG9zZScsIHZhY2NpbmUpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG90YWxQbGFubmVkID0gZ2V0VmFsdWVTdW0oZGF0YSwgJ3RvdGFsX3BsYW5uZWQnLCB2YWNjaW5lKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgY292ZXJhZ2VSYXRlID0gQ292ZXJhZ2VDYWxjdWxhdG9yLmNhbGN1bGF0ZUNvdmVyYWdlUmF0ZShsYXN0RG9zZSwgcGxhbm5lZCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkcm9wb3V0UmF0ZSA9IENvdmVyYWdlQ2FsY3VsYXRvci5jYWxjdWxhdGVEcm9wb3V0UmF0ZShmaXJzdERvc2UsIGxhc3REb3NlKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlZENhdGVnb3J5ID0gQ292ZXJhZ2VDYWxjdWxhdG9yLmNhbGN1bGF0ZVJlZENhdGVnb3J5KGZpcnN0RG9zZSwgbGFzdERvc2UsIHBsYW5uZWQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXZvYyA9IENvdmVyYWdlQ2FsY3VsYXRvci5jYWxjdWxhdGVDb3ZlcmFnZVJhdGUodG90YWxMYXN0RG9zZSwgdG90YWxQbGFubmVkKTtcblxuICAgICAgICAgICAgICAgICAgICB0YWJsZURhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAndmFjY2luZSc6IHZhY2NpbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAncGxhbm5lZF9jb25zdW1wdGlvbic6IHBsYW5uZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAnY292ZXJhZ2VfcmF0ZSc6IGNvdmVyYWdlUmF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdhdm9jJzogYXZvY1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHZhY2NpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJQRU5UQVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlbnRhQ1IgPSBjb3ZlcmFnZVJhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5kcm9wb3V0X1BlbnRhID0gZHJvcG91dFJhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5jYXRlZ29yeSA9IHJlZENhdGVnb3J5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlBDVlwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBjdkNSID0gY292ZXJhZ2VSYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkhQVlwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZHJvcG91dF9ocHYgPSBkcm9wb3V0UmF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuR2FwID0gcGVudGFDUiAtIHBjdkNSO1xuXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHtwYWdlOiAxLCBjb3VudDogMTB9O1xuICAgICAgICAgICAgICAgIHZhciBzZXR0aW5ncyA9IHtmaWx0ZXJEZWxheTogMCwgY291bnRzOiBbXSwgZGF0YTogdGFibGVEYXRhfTtcbiAgICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtc0Rvc2VzID0gbmV3IE5nVGFibGVQYXJhbXMocGFyYW1zLCBzZXR0aW5ncyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZtLmdldFVuZXBpTmF0aW9uYWxTdG9jayA9IGZ1bmN0aW9uKGVuZE1vbnRoLCBkaXN0cmljdCkge1xuICAgICAgICAgICAgU3RvY2tTZXJ2aWNlLmdldFVuZXBpU3RvY2soZW5kTW9udGgsIGRpc3RyaWN0KS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFibGVkYXRhQWxsc3RvY2sgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgc3RvY2tlZE91dEFudGlnZW5zID0gMDtcblxuICAgICAgICAgICAgICAgIC8qIFR1cm4gdGhlIGRpc3RyaWN0IGJhc2VkIGRhdGEgaW50byBhZ2dyZWdhdGVkXG4gICAgICAgICAgICAgICAgdmFjY2luZSBiYXNlZCBkYXRhICovXG4gICAgICAgICAgICAgICAgdmFyIHZhY2NpbmVEYXRhID0gZGF0YS5yZWR1Y2UoZnVuY3Rpb24oYWNjLCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghIChpdGVtLnZhY2NpbmUgaW4gYWNjKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY1tpdGVtLnZhY2NpbmVdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0X2hhbmQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvY2tfcmVxdWlyZW1lbnRfX21pbmltdW06IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJlZDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdW1lZDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVfc3RvY2s6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgYWNjW2l0ZW0udmFjY2luZV0uYXRfaGFuZCArPSBpdGVtLmF0X2hhbmQ7XG4gICAgICAgICAgICAgICAgICAgIGFjY1tpdGVtLnZhY2NpbmVdLnN0b2NrX3JlcXVpcmVtZW50X19taW5pbXVtICs9IGl0ZW0uc3RvY2tfcmVxdWlyZW1lbnRfX21pbmltdW07XG4gICAgICAgICAgICAgICAgICAgIGFjY1tpdGVtLnZhY2NpbmVdLnJlY2VpdmVkICs9IGl0ZW0ucmVjZWl2ZWQ7XG4gICAgICAgICAgICAgICAgICAgIGFjY1tpdGVtLnZhY2NpbmVdLm9yZGVyZWQgKz0gaXRlbS5vcmRlcmVkO1xuICAgICAgICAgICAgICAgICAgICBhY2NbaXRlbS52YWNjaW5lXS5jb25zdW1lZCArPSBpdGVtLmNvbnN1bWVkO1xuICAgICAgICAgICAgICAgICAgICBhY2NbaXRlbS52YWNjaW5lXS5hdmFpbGFibGVfc3RvY2sgKz0gaXRlbS5hdmFpbGFibGVfc3RvY2s7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgICAgICB9LCB7fSk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciB2YWNjaW5lIGluIHZhY2NpbmVEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdEhhbmQgPSB2YWNjaW5lRGF0YVt2YWNjaW5lXS5hdF9oYW5kO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWluU3RvY2sgPSB2YWNjaW5lRGF0YVt2YWNjaW5lXS5zdG9ja19yZXF1aXJlbWVudF9fbWluaW11bTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9yZGVyZWQgPSB2YWNjaW5lRGF0YVt2YWNjaW5lXS5vcmRlcmVkO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVjZWl2ZWQgPSB2YWNjaW5lRGF0YVt2YWNjaW5lXS5yZWNlaXZlZDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnN1bWVkID0gdmFjY2luZURhdGFbdmFjY2luZV0uY29uc3VtZWQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdmFpbGFibGVTdG9jayA9IGF0SGFuZCArIHJlY2VpdmVkO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbW9udGhzU3RvY2sgPSBNYXRoLnJvdW5kKGF0SGFuZCAvIG1pblN0b2NrKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobW9udGhzU3RvY2sgPT0gMCkgc3RvY2tlZE91dEFudGlnZW5zKys7XG5cbiAgICAgICAgICAgICAgICAgICAgdGFibGVkYXRhQWxsc3RvY2sucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWNjaW5lOiB2YWNjaW5lLFxuICAgICAgICAgICAgICAgICAgICAgICAgTW9udGhzX3N0b2NrOiBtb250aHNTdG9jayxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlZmlsbF9yYXRlOiAob3JkZXJlZCA9PSAwKSA/IDAgOiBNYXRoLnJvdW5kKChyZWNlaXZlZCAvIG9yZGVyZWQpICogMTAwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwdGFrZV9yYXRlOiAoYXZhaWxhYmxlU3RvY2sgPT0gMCkgPyAwIDogTWF0aC5yb3VuZCgoY29uc3VtZWQgLyBhdmFpbGFibGVTdG9jaykgKiAxMDApXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuQW50aWdlbl9zdG9ja2Vkb3V0ID0gc3RvY2tlZE91dEFudGlnZW5zO1xuXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHtwYWdlOiAxLCBjb3VudDogMTB9O1xuICAgICAgICAgICAgICAgIHZhciBzZXR0aW5ncyA9IHtmaWx0ZXJEZWxheTogMCwgY291bnRzOiBbXSwgZGF0YTogdGFibGVkYXRhQWxsc3RvY2t9O1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zU3RvY2sgPSBuZXcgTmdUYWJsZVBhcmFtcyhwYXJhbXMsIHNldHRpbmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICAgICB2bS5nZXRVbmVwaVN0b2NrID0gZnVuY3Rpb24oZW5kTW9udGgsIGRpc3RyaWN0KSB7XG5cbiAgICAgICAgICAgICAgICB2bS5lbmRNb250aCA9IHZtLmVuZE1vbnRoID8gdm0uZW5kTW9udGggOiBcIlwiO1xuXG4gICAgICAgICAgICAgICAgU3RvY2tTZXJ2aWNlLmdldFVuZXBpU3RvY2soIGVuZE1vbnRoLCBkaXN0cmljdClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlZGF0YUFsbHN0b2NrID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBhbmd1bGFyLmNvcHkoZGF0YSk7XG5cblxuXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlZGF0YUFsbHN0b2NrID0gdm0uZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdm0udGFibGVQYXJhbXNTdG9jayA9IG5ldyBOZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckRlbGF5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFibGVkYXRhQWxsc3RvY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5BbnRpZ2VuX3N0b2NrZWRvdXQgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmRhdGEubGVuZ3RoIDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodm0uZGF0YVtpXS5Nb250aHNfc3RvY2sgPT0gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuQW50aWdlbl9zdG9ja2Vkb3V0Kys7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIENvbGQgQ2hhaW4gJiBVbmVwaSBEaXN0cmljdCBmaWx0ZXJzIHVzZWQgZGlmZmVyZW50IGRhdGEgc291cmNlc1xuICAgICAgICAgICAgICAgIEZvciB0aGF0IHJlYXNvbiB0byB1c2UgdGhlIENvbGQgQ2hhaW4gYXBpLCB0aGUgZGlzdHJpY3QgbmFtZVxuICAgICAgICAgICAgICAgIGhhcyB0byBiZSByZWZvcm1hdHRlZCB0byBtYXRjaCB0aGUgY29sZCBjaGFpbiBkaXN0cmljdCBmaWx0ZXIuXG4gICAgICAgICAgICAgICAgQFRvZG86IFN0YW5kYXJkaXplIHRoZSBkaXN0cmljdCB2YWx1ZXNcbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHZtLnBhcnNlRGlzdHJpY3QgPSBmdW5jdGlvbihkaXN0cmljdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGlzdHJpY3QucmVwbGFjZShcIiBEaXN0cmljdFwiLCBcIlwiKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2bS5nZXRVbmVwaUNvbGRDaGFpbkNhcGFjaXR5ID0gZnVuY3Rpb24oZW5kTW9udGgsIGRpc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0ID0gdm0ucGFyc2VEaXN0cmljdChkaXN0cmljdCk7XG5cbiAgICAgICAgICAgICAgICAgICAgRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VGYWNpbGl0eUNhcGFjaXR5KHVuZGVmaW5lZCwgZW5kTW9udGgsIGRpc3RyaWN0LCB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtZXRyaWNzID0gRnJpZGdlU2VydmljZS5nZXRGcmlkZ2VDYXBhY2l0eU1ldHJpY3MoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLm1ldHJpY3MgPSBtZXRyaWNzO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5wZXIgPSBhcHBIZWxwZXJzLnBlcjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZtLmdldFVuZXBpQ29sZENoYWluRnVuY3Rpb25hbGl0eSA9IGZ1bmN0aW9uKGVuZE1vbnRoLCBkaXN0cmljdCkge1xuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdCA9IHZtLnBhcnNlRGlzdHJpY3QoZGlzdHJpY3QpO1xuXG4gICAgICAgICAgICAgICAgICAgIEZyaWRnZVNlcnZpY2UuZ2V0RnJpZGdlRGlzdHJpY3RSZWZyaWdlcmF0b3IodW5kZWZpbmVkLCBlbmRNb250aCwgZGlzdHJpY3QsIHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWdncmVnYXRlcyA9IGRhdGEucmVkdWNlKGZ1bmN0aW9uKGFjYywgaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjYy50b3RhbEVxdWlwbWVudCArPSBpdGVtLm51bWJlcl9leGlzdGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2MudG90YWxXb3JraW5nV2VsbCArPSBpdGVtLndvcmtpbmdfd2VsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2MudG90YWxOb3RXb3JraW5nV2VsbCArPSBpdGVtLm5vdF93b3JraW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjYy50b3RhbE5lZWRNYWludGVuYW5jZSArPSBpdGVtLm5lZWRzX21haW50ZW5hbmNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjYy50b3RhbEZhY2lsaXRpZXMgKz0gaXRlbS50b3RhbF9mYWNpbGl0aWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7dG90YWxFcXVpcG1lbnQ6MCwgdG90YWxGYWNpbGl0aWVzOjAsIHRvdGFsV29ya2luZ1dlbGw6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxOb3RXb3JraW5nV2VsbDowLCB0b3RhbE5lZWRNYWludGVuYW5jZTogMH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLm51bWJlck9mQ29sZGNoYWluRXF1aXBtZW50ID0gYWdncmVnYXRlcy50b3RhbEVxdWlwbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQubnVtYmVyT2ZGYWNpbGl0aWVzID0gYWdncmVnYXRlcy50b3RhbEZhY2lsaXRpZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLm51bWJlcldvcmtpbmdXZWxsID0gYWdncmVnYXRlcy50b3RhbFdvcmtpbmdXZWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGxTY29wZS5jaGlsZC5udW1iZXJOb3RXb3JraW5nV2VsbCA9IGFnZ3JlZ2F0ZXMudG90YWxOb3RXb3JraW5nV2VsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQubnVtYmVyTmVlZE1haW50ZW5hbmNlID0gYWdncmVnYXRlcy50b3RhbE5lZWRNYWludGVuYW5jZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQucGVyID0gYXBwSGVscGVycy5wZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLm51bWJlcldvcmtpbmcgPSBhZ2dyZWdhdGVzLnRvdGFsRXF1aXBtZW50IC0gYWdncmVnYXRlcy50b3RhbE5vdFdvcmtpbmdXZWxsO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdm0uZW5hYmxlUERGRG93bmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQuZG93bmxvYWRQREYgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVsbFNjb3BlLmNoaWxkLnByaW50VmlldyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwZGYgPSBuZXcganNQREYoJ3AnLCAnbW0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGRmLmFkZEhUTUwoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmVwaVJlcG9ydFwiKSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGRmLnNhdmUoJ3VuZXBpLXJlcG9ydC5wZGYnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxMDApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsU2NvcGUuY2hpbGQucHJpbnRWaWV3ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICRzY29wZS4kb24oJ3JlZnJlc2gnLCBmdW5jdGlvbihlLCBzdGFydE1vbnRoLCBlbmRNb250aCwgZGlzdHJpY3QsIHZhY2NpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoc3RhcnRNb250aC5uYW1lICYmIGVuZE1vbnRoLm5hbWUgJiYgZGlzdHJpY3QubmFtZSAmJiB2YWNjaW5lLm5hbWUpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldFVuZXBpQ292ZXJhZ2UoZW5kTW9udGgucGVyaW9kLCBkaXN0cmljdC5uYW1lLCB2YWNjaW5lLm5hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlzdHJpY3QubmFtZSA9PSBcIk5hdGlvbmFsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRVbmVwaU5hdGlvbmFsU3RvY2soZW5kTW9udGgubmFtZSwgZGlzdHJpY3QubmFtZSwgdmFjY2luZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0VW5lcGlTdG9jayhlbmRNb250aC5uYW1lLCBkaXN0cmljdC5uYW1lLCB2YWNjaW5lLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ2V0VW5lcGlDb2xkQ2hhaW5DYXBhY2l0eShlbmRNb250aC5uYW1lLCBkaXN0cmljdC5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdldFVuZXBpQ29sZENoYWluRnVuY3Rpb25hbGl0eShlbmRNb250aC5uYW1lLCBkaXN0cmljdC5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmVuYWJsZVBERkRvd25sb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuICAgICAgICBdKTtcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiJdfQ==
