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