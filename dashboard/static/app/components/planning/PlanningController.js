angular.module('dashboard')
    .controller('PlanningController', ['$scope', 'AnnualService', '$rootScope', 'NgTableParams', 'FilterService',
    function($scope, AnnualService, $rootScope, NgTableParams, FilterService)
    {
        var vm = this;
        var shellScope = $scope.$parent;
        shellScope.child = $scope;

        vm.getFundActivities = function(year){
            year=""
            vm.year = vm.selectedYear.value;

           AnnualService.getFundActivities(year)
               .then(function(data){
               vm.data = angular.copy(data);

               tabledatafund = vm.data.filter(
                        function (value) {
                            return value;
                        });
               vm.tableParamsfunded = new NgTableParams({
                    page: 1,
                    count:10
               }, {
                    filterDelay: 0,
                    counts: [],
                    data: tabledatafund,
                    });

               var graphdatafund = [];
               var funded = 0;
               var unfunded =0;

               for (var i = 0; i < vm.data.length ; i++)   {
                   if(vm.data[i].fund == true) {
                       funded++;
                   }
                   else if(vm.data[i].fund == false){
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
                vm.graphfundedactivities = [
                    {
                       key: "Funded",
                       y: funded,
                        color:'green'
                    },
                    {
                       key: "UnFunded",
                       y: unfunded,
                        color:'red'
                    }

                ];
           })

        }

        $scope.$on('refreshAwp', function(e, year) {
            if(year.value)
            {
                vm.getFundActivities(year.value);

            }
        });

    }]);
