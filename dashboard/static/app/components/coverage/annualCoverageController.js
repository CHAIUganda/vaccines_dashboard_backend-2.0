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
