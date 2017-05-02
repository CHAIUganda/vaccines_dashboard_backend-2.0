angular.module('dashboard')
    .controller('PlanningController', ['$scope', 'PlanService', '$rootScope', 'NgTableParams', 'FilterService',
    function($scope, PlanService, $rootScope, NgTableParams, FilterService)
    {
        var vm = this;
        var shellScope = $scope.$parent;
        shellScope.child = $scope;

        vm.getFundActivities = function(year){
            year=""
            vm.year = vm.selectedYear.value;

           PlanService.getFundActivities(year)
               .then(function(data){
               vm.data = angular.copy(data);

               tabledatafund = vm.data.filter(
                        function (value) {
                            return value;
                        });
               vm.tableParamsfunded = new NgTableParams({
                    page: 1
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

    }


]);
