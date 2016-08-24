/**
 * Created by BCHAI on 8/23/2016.
 */
angular.module('dashboard')
    .controller('ConsumptionController', ['$scope', 'StockService', '$rootScope', 'NgTableParams', 'FilterService',
    function($scope, StockService, $rootScope, NgTableParams, FilterService)
       {
    var vm = this;
        var shellScope = $scope.$parent;
        shellScope.child = $scope;

        vm.getAmc = function(startMonth, endMonth, district, vaccine) {
            vm.startMonth ? vm.startMonth : "Nov 2015";
            vm.endMonth = vm.endMonth ? vm.endMonth : "Dec 2015";
            vm.district = vm.selectedDistrict ? vm.selectedDistrict.name : "";
            vm.vaccine = vm.selectedVaccine ? vm.selectedVaccine.name : "";

            StockService.getAmc(startMonth, endMonth, district, vaccine)
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





                // construct graph data
                var graphdata = [];
                for (var j = 0; j < 6   ; j++) {
                    graphdata.push(
                        {
                        key: vm.data[j].vaccine_category__vaccine__name,
                        values: [
                            [ vm.data[j].vaccine_category__vaccine__name , vm.data[j].consumption ]
                        ]
                    });
                }
                vm.graph = graphdata;

                // update graph
                vm.options = {
                        chart: {
                            type: 'multiBarChart',
                            height: 600,
                            title: {
                                enable: true,
                                text: 'VACCINE STOCK ON HAND'
                            },
                            showLegend: true,

                            showControls: false,
                            margin : {
                                top: 20,
                                right: 20,
                                bottom: 45,
                                left: 45
                            },
                            groupSpacing: 0,
                            rotateLabels: -45,
                            staggerLabels: true,
                            x: function(d){ return d[0]; },
                            y: function(d){ return d[1]; },
                            showValues: true,
                            valueFormat: function(d){
                                return d3.format(',.4f')(d);
                            },
                            transitionDuration: 500
                        }
                };


            });
        };

        $scope.$on('refresh', function(startMonth, endMonth, district, vaccine) {
            if(startMonth.name)
            {
                vm.getAmc(startMonth.name, endMonth.name, district.name, vaccine.name);
            }
        });


    }

]);