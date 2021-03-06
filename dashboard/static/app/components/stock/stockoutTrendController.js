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
