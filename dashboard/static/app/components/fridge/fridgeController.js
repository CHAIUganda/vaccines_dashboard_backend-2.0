angular.module('dashboard')
    .controller('FridgeController', ['$scope', 'FridgeService', '$rootScope', 'NgTableParams', 'FilterService',
    function($scope, FridgeService, $rootScope, NgTableParams, FilterService)
    {

        var vm = this;
        var shellScope = $scope.$parent;
        shellScope.child = $scope;

        vm.getFridgeDistrictCapacity = function(startQuarter, endQuarter, district, carelevel) {

            vm.startQuarter ? vm.startQuarter : "201601";
            vm.endQuarter = vm.endQuarter ? vm.endQuarter : "201604";
            district = "";
            vm.district = district;
            vm.carelevel = carelevel;

            FridgeService.getFridgeDistrictCapacity(startQuarter, endQuarter, district, carelevel)
                .then(function(data) {

                vm.data = angular.copy(data);
                vm.tableParams_d = new NgTableParams({
                    page: 1,
                    count: 15
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: vm.data,
                });

                // calculate totals
                shellScope.child.district = vm.district;
                shellScope.child.carelevel = vm.carelevel;


                // construct District graph data
                var graphdata = [];
                var seriesRequired = [];
                var seriesAvailable = [];
                var seriesGap = [];

                for (var i = 0; i < vm.data.length ; i++) {
                    seriesRequired.push([vm.data[i].quarter, vm.data[i].required])
                    seriesAvailable.push([vm.data[i].quarter, vm.data[i].available])
                    seriesGap.push([vm.data[i].quarter, vm.data[i].gap])

                }
/*
                seriesRequired = [[201602, 30], [201603, 30]];
                seriesAvailable = [[201602, 60], [201603, 20]];
*/

                graphdata.push({
                        key: "Required",
                        values: seriesRequired,
                        color:'#A5E816'
                });
                graphdata.push({
                        key: "Available",
                        values: seriesAvailable,
                        color:'#1F77B4'
                });
/*                graphdata.push({
                        key: "Gap",
                        values: seriesGap,
                        color:'red'
                });
*/
                vm.graph = graphdata;


                // update graph
                vm.options = {
                        chart: {
                            type: "multiBarChart",
                            height: 450,
                            margin: {
                              top: 20,
                              right: 20,
                              bottom: 45,
                              left: 45
                            },
                            clipEdge: true,
                            stacked: false,
                            x: function(d){ return d[0]; },
                            y: function(d){ return d[1]; },
                            showValues: true,
                            //valueFormat: function(d){
                            //    return tickFormat(d3.format(',.1f'));
                            //}
                        },
                };


            });
        };

        vm.getFridgeFacilityCapacity = function(startQuarter, endQuarter, district, carelevel) {

            vm.startQuarter ? vm.startQuarter : "201601";
            vm.endQuarter = vm.endQuarter ? vm.endQuarter : "201604";
            district = "";
            vm.district = district;
            vm.carelevel = carelevel;

            FridgeService.getFridgeFacilityCapacity(startQuarter, endQuarter, district, carelevel)
                .then(function(data) {

                vm.data = angular.copy(data);
                vm.tableParams_f = new NgTableParams({
                    page: 1,
                    count: 15
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: vm.data,
                });

                // calculate totals
                shellScope.child.district = vm.district;
                shellScope.child.carelevel = vm.carelevel;

            });
        };


        vm.getFridgeDistrictRefrigerator = function(startQuarter, endQuarter, district, carelevel) {

            vm.startQuarter ? vm.startQuarter : "201601";
            vm.endQuarter = vm.endQuarter ? vm.endQuarter : "201604";
            district = "";
            vm.district = district;
            vm.carelevel = carelevel;

            FridgeService.getFridgeDistrictRefrigerator(startQuarter, endQuarter, district, carelevel)
                .then(function(data) {

                vm.data = angular.copy(data);
                tabledataAlldistricts = vm.data.filter(
                        function (value) {
                            return value;
                        });
                vm.tableParamsAlldistricts = new NgTableParams({
                    page: 1,
                    count: 10
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: tabledataAlldistricts,
                    });

                vm.tableParams_d = new NgTableParams({
                    page: 1,
                    count: 15
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: vm.data,
                });

                // calculate totals
                shellScope.child.district = vm.district;
                shellScope.child.carelevel = vm.carelevel;


                // construct District graph data
                var graphdata = [];
                var seriesRequired = [];
                var seriesAvailable = [];
                var seriesGap = [];

                for (var i = 0; i < vm.data.length ; i++) {
                    seriesRequired.push([vm.data[i].quarter, vm.data[i].required])
                    seriesAvailable.push([vm.data[i].quarter, vm.data[i].available])
                    seriesGap.push([vm.data[i].quarter, vm.data[i].gap])

                }
/*
                seriesRequired = [[201602, 30], [201603, 30]];
                seriesAvailable = [[201602, 60], [201603, 20]];
*/

                graphdata.push({
                        key: "Required",
                        values: seriesRequired,
                        color:'#A5E816'
                });
                graphdata.push({
                        key: "Available",
                        values: seriesAvailable,
                        color:'#1F77B4'
                });
/*                graphdata.push({
                        key: "Gap",
                        values: seriesGap,
                        color:'red'
                });
*/
                vm.graph = graphdata;


                // update graph
                vm.options = {
                        chart: {
                            type: "multiBarChart",
                            height: 450,
                            margin: {
                              top: 20,
                              right: 20,
                              bottom: 45,
                              left: 45
                            },
                            clipEdge: true,
                            stacked: false,
                            x: function(d){ return d[0]; },
                            y: function(d){ return d[1]; },
                            showValues: true,
                            //valueFormat: function(d){
                            //    return tickFormat(d3.format(',.1f'));
                            //}
                        },
                };


            });
        };

        vm.getFridgeFacilityRefrigerator = function(startQuarter, endQuarter, district, carelevel) {

            vm.startQuarter ? vm.startQuarter : "201601";
            vm.endQuarter = vm.endQuarter ? vm.endQuarter : "201604";
            district = "";
            vm.district = district;
            vm.carelevel = carelevel;

            FridgeService.getFridgeFacilityRefrigerator(startQuarter, endQuarter, district, carelevel)
                .then(function(data) {

                vm.data = angular.copy(data);
                tabledataAllfacilities = vm.data.filter(
                        function (value) {
                            return value;
                        });

                    vm.tableParamsAllfacilities = new NgTableParams({
                        page: 1,
                        count: 10
                    }, {
                        filterDelay: 0,
                        counts: [],
                        data: tabledataAllfacilities,
                    });

                vm.tableParams_f = new NgTableParams({
                    page: 1,
                    count: 15
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: vm.data,
                });

                // calculate totals
                shellScope.child.district = vm.district;
                shellScope.child.carelevel = vm.carelevel;

            });
        };

        vm.getFridgeDistrictImmunizingFacility = function(startQuarter, endQuarter, district, carelevel) {

            vm.startQuarter ? vm.startQuarter : "201601";
            vm.endQuarter = vm.endQuarter ? vm.endQuarter : "201604";
            district = "";
            vm.district = district;
            vm.carelevel = carelevel;

            FridgeService.getFridgeDistrictImmunizingFacility(startQuarter, endQuarter, district, carelevel)
                .then(function(data) {

                vm.data = angular.copy(data);
                tabledataAllfridge = vm.data.filter(
                        function (value) {
                            return value;
                        });
                vm.tableParamsAllfridge = new NgTableParams({
                    page: 1,
                    count: 10
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: tabledataAllfridge,
                    });

                vm.tableParams_d = new NgTableParams({
                    page: 1,
                    count: 15
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: vm.data,
                });

                // calculate totals
                shellScope.child.district = vm.district;
                shellScope.child.carelevel = vm.carelevel;


                // construct District graph data
                var graphdata = [];
                var seriesRequired = [];
                var seriesAvailable = [];
                var seriesGap = [];

                for (var i = 0; i < vm.data.length ; i++) {
                    seriesRequired.push([vm.data[i].quarter, vm.data[i].required])
                    seriesAvailable.push([vm.data[i].quarter, vm.data[i].available])
                    seriesGap.push([vm.data[i].quarter, vm.data[i].gap])

                }
/*
                seriesRequired = [[201602, 30], [201603, 30]];
                seriesAvailable = [[201602, 60], [201603, 20]];
*/

                graphdata.push({
                        key: "Required",
                        values: seriesRequired,
                        color:'#A5E816'
                });
                graphdata.push({
                        key: "Available",
                        values: seriesAvailable,
                        color:'#1F77B4'
                });
/*                graphdata.push({
                        key: "Gap",
                        values: seriesGap,
                        color:'red'
                });
*/
                vm.graph = graphdata;


                // update graph
                vm.options = {
                        chart: {
                            type: "multiBarChart",
                            height: 450,
                            margin: {
                              top: 20,
                              right: 20,
                              bottom: 45,
                              left: 45
                            },
                            clipEdge: true,
                            stacked: false,
                            x: function(d){ return d[0]; },
                            y: function(d){ return d[1]; },
                            showValues: true,
                            //valueFormat: function(d){
                            //    return tickFormat(d3.format(',.1f'));
                            //}
                        },
                };


            });
        };

        $scope.$on('refreshCapacity', function(e, startQuarter, endQuarter, district, carelevel) {
            if(startQuarter && endQuarter)
            {
                vm.getFridgeDistrictRefrigerator(startQuarter, endQuarter, district, carelevel);
                vm.getFridgeFacilityRefrigerator(startQuarter, endQuarter, district, carelevel);
                vm.getFridgeDistrictImmunizingFacility(startQuarter, endQuarter, district, carelevel);
                vm.getFridgeDistrictCapacity(startQuarter, endQuarter, district, carelevel);
                vm.getFridgeFacilityCapacity(startQuarter, endQuarter, district, carelevel);

            }
        });

    }

]);
