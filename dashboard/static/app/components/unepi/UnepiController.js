angular.module('dashboard')
    .controller('UnepiController', ['$scope', 'CoverageService', '$rootScope', 'NgTableParams', 'FilterService',
    function($scope, CoverageService, $rootScope, NgTableParams, FilterService)
    {
        var vm = this;
        var shellScope = $scope.$parent;
        shellScope.child = $scope;


        vm.getUnepiCoverage = function(period, district) {
            vm.endMonth=period;


            CoverageService.getUnepiCoverage(period, district)
                .then(function (data) {

                    vm.data = angular.copy(data);


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
            };

            $scope.$on('refresh', function(e, startMonth, endMonth, district, vaccine) {
            if(startMonth.name && endMonth.name && district.name && vaccine.name)
                {

                    vm.getUnepiCoverage(endMonth.period, district.name, vaccine.name);

                }
            });

        }
    ]);
