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

               })
        }

        $scope.$on('refreshAwp', function(e, year) {
            if(year.value)
            {
                vm.getFundActivities(year.value);

            }
        });

    }]);
