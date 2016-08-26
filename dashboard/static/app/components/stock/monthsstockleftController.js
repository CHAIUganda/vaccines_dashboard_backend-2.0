/**
 * Created by CHAI on 8/22/2016.
 */
angular.module('dashboard')
    .controller('MonthsStockLeftController', ['$scope', 'StockService', '$rootScope', 'NgTableParams', 'FilterService', 'MonthService',
    function($scope, StockService, $rootScope, NgTableParams, FilterService, MonthService)
    {
        var vm = this;
        var shellScope = $scope.$parent;
        shellScope.child = $scope;

        // Todo: Use this to sort by performance (Malisa)
        vm.SortByKey = function(array, key) {
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        };

        vm.getStockByDistrict = function(startMonth, endMonth, district, vaccine) {

            vm.startMonth ? vm.startMonth : "Nov 2015";
            vm.endMonth = vm.endMonth ? vm.endMonth : "Dec 2016";
            //Todo: Temporarily disable filtering by district for the table
            district = ""
            vm.district = "";
            vm.vaccine = vm.selectedVaccine ? vm.selectedVaccine.name : "";


            StockService.getStockByDistrict(startMonth, endMonth, district, vaccine)
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
                var total = 0;
                for(var i = 0; i < vm.data.length; i++){
                    var units = vm.data[i].at_hand;
                    total += units;
                }

                shellScope.child.stockathand = total;
            });
        };



        $scope.$on('refresh', function(e, startMonth, endMonth, district, vaccine) {
            if(startMonth.name && endMonth.name && district.name && vaccine.name)
            {

                vm.getStockByDistrict(startMonth.name, endMonth.name, district.name, vaccine.name);
                vm.getStockByMonth(startMonth.name, endMonth.name, district.name, vaccine.name);
            }
        });

    }

]);
