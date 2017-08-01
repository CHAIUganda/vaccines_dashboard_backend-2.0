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


                    var tabledata_Penta = [];
                    var tabledata_HPV = [];
                    var tabledataAlldoses = [];
                    var tabledata_Category = [];

                    vm.data = angular.copy(data);

                    tabledata_Penta = vm.data.filter(
                        function (value) {
                            return value.vaccine__name == "PENTA";
                        }
                    );
                    vm.tableParams_penta= new NgTableParams({
                            page: 1,
                            count:1
                        }, {
                            filterDelay: 0,
                            counts: [],
                            data:tabledata_Penta,
                        });


                    tabledata_HPV = vm.data.filter(
                        function (value) {
                            return value.vaccine__name == "HPV";
                        }
                    );
                    vm.tableParams_HPV= new NgTableParams({
                            page: 1,
                            count:1
                        }, {
                            filterDelay: 0,
                            counts: [],
                            data:tabledata_HPV,
                        });



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
