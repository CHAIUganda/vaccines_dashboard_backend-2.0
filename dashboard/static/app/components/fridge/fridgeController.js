angular.module('dashboard')
    .controller('FridgeController', ['$scope', 'FridgeService', '$rootScope', 'NgTableParams', 'FilterService',
    function($scope, FridgeService, $rootScope, NgTableParams, FilterService)
    {

        var vm = this;
        var shellScope = $scope.$parent;
        shellScope.child = $scope;

        vm.getFridgeAllDistrictCapacity = function(startQuarter, endQuarter, district, carelevel) {

            vm.startQuarter = vm.startQuarter ? vm.startQuarter : "201601";
            vm.endQuarter = vm.endQuarter ? vm.endQuarter : "201604";
            district = "";
            vm.carelevel = carelevel;

            FridgeService.getFridgeDistrictCapacity(startQuarter, endQuarter, district, carelevel)
                .then(function(data) {

                vm.data = angular.copy(data);
                    allData =
                tabledataAlldistricts = vm.data.filter(
                        function (value) {
                            return value;
                        });
                vm.tableParamsCapacityAlldistricts = new NgTableParams({
                    page: 1,
                    count: 10
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: tabledataAlldistricts,
                    });

            });
        };

        vm.getFridgeDistrictCapacity = function(startQuarter, endQuarter, fridgeDistrict, carelevel) {

            vm.startQuarter ? vm.startQuarter : "201601";
            vm.endQuarter = vm.endQuarter ? vm.endQuarter : "201604";
            fridgeDistrict = "";
            vm.fridgeDistrict = fridgeDistrict;
            vm.carelevel = carelevel;

            FridgeService.getFridgeDistrictCapacity(startQuarter, endQuarter, fridgeDistrict, carelevel)
                .then(function(data) {

                vm.data = angular.copy(data);


                // calculate totals
                shellScope.child.fridgeDistrict = vm.fridgeDistrict;
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


        vm.getFridgeFacilityCapacity = function(startQuarter, endQuarter, fridgeDistrict, carelevel) {

            vm.startQuarter ? vm.startQuarter : "201601";
            vm.endQuarter = vm.endQuarter ? vm.endQuarter : "201604";
            fridgeDistrict = "";
            vm.district = fridgeDistrict;
            vm.carelevel = carelevel;

            FridgeService.getFridgeFacilityCapacity(startQuarter, endQuarter, fridgeDistrict, carelevel)
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
                shellScope.child.fridgeDistrict = vm.fridgeDistrict;
                shellScope.child.carelevel = vm.carelevel;

            });
        };


        vm.getFridgeAllDistrictRefrigerator = function(startQuarter, endQuarter, fridgeDistrict, carelevel) {

            vm.startQuarter = vm.startQuarter ? vm.startQuarter : "201601";
            vm.endQuarter = vm.endQuarter ? vm.endQuarter : "201604";
            vm.fridgeDistrict = fridgeDistrict;
            vm.carelevel = carelevel;

            FridgeService.getFridgeDistrictRefrigerator(startQuarter, endQuarter, fridgeDistrict, carelevel)
            .then(function(data) {

                vm.data = angular.copy(data);
                tabledataAlldistricts = vm.data.filter(
                        function (value) {
                            return value;
                        });
                vm.tableParamsFunctionalityAlldistricts = new NgTableParams({
                    page: 1,
                    count: 10
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: tabledataAlldistricts,
                    });

            });
        };

        vm.getFridgeDistrictRefrigerator = function(startQuarter, endQuarter, fridgeDistrict, carelevel) {

            vm.startQuarter = vm.startQuarter ? vm.startQuarter : "201601";
            vm.endQuarter = vm.endQuarter ? vm.endQuarter : "201604";
            fridgeDistrict = vm.selectedFridgeDistrict ? vm.selectedFridgeDistrict: "";
            vm.carelevel = carelevel;

            FridgeService.getFridgeDistrictRefrigerator(startQuarter, endQuarter, fridgeDistrict, carelevel)
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
                shellScope.child.fridgeDistrict = vm.fridgeDistrict;
                shellScope.child.carelevel = vm.carelevel;


                // construct District graph data
                var graphfunctionalitydata = [];
                var seriesExisting = [];
                var seriesNotWorking = [];
                var seriesmaintenance = [];

                for (var i = 0; i < vm.data.length ; i++) {
                    seriesExisting.push([vm.data[i].quarter, vm.data[i].number_existing])
                    seriesNotWorking.push([vm.data[i].quarter, vm.data[i].not_working])
                    seriesmaintenance.push([vm.data[i].quarter, vm.data[i].needs_maintenance])
                }

                graphfunctionalitydata.push({
                        key: "Existing",
                        values: seriesExisting,
                        color:'#A5E816'
                });
                graphfunctionalitydata.push({
                        key: "Not Working",
                        values: seriesNotWorking,
                        color:'#1F77B4'
                });
               graphfunctionalitydata.push({
                        key: "Needs maintenance",
                        values: seriesmaintenance,
                        color:'red'
                });

               vm.graphfunctionality = graphfunctionalitydata;


                // update graph
               vm.optionsfunctionality = {
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
                            stacked: true,
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

        vm.getFridgeFacilityRefrigerator = function(startQuarter, endQuarter, fridgeDistrict, carelevel) {

            vm.startQuarter ? vm.startQuarter : "201601";
            vm.endQuarter = vm.endQuarter ? vm.endQuarter : "201604";
            fridgeDistrict = "";
            vm.district = fridgeDistrict;
            vm.carelevel = carelevel;

            FridgeService.getFridgeFacilityRefrigerator(startQuarter, endQuarter, fridgeDistrict, carelevel)
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
                shellScope.child.fridgeDistrict = vm.fridgeDistrict;
                shellScope.child.carelevel = vm.carelevel;

            });
        };

        vm.getFridgeAllDistrictImmunizingFacility = function(startQuarter, endQuarter, fridgeDistrict, carelevel) {

            vm.startQuarter = vm.startQuarter ? vm.startQuarter : "201601";
            vm.endQuarter = vm.endQuarter ? vm.endQuarter : "201604";
            fridgeDistrict = "";
            vm.carelevel = carelevel;

            FridgeService.getFridgeDistrictImmunizingFacility(startQuarter, endQuarter, fridgeDistrict, carelevel)
            .then(function(data) {

                vm.data = angular.copy(data);
                    allData =
                tabledataAlldistricts = vm.data.filter(
                        function (value) {
                            return value;
                        });
                vm.tableParamsImmunizingAlldistricts = new NgTableParams({
                    page: 1,
                    count: 10
                }, {
                    filterDelay: 0,
                    counts: [],
                    data: tabledataAlldistricts,
                    });

            });
        };

        vm.getFridgeDistrictImmunizingFacility = function(startQuarter, endQuarter, fridgeDistrict, carelevel) {

            vm.startQuarter ? vm.startQuarter : "201601";
            vm.endQuarter = vm.endQuarter ? vm.endQuarter : "201604";
            fridgeDistrict = "";
            vm.district = fridgeDistrict;
            vm.carelevel = carelevel;

            FridgeService.getFridgeDistrictImmunizingFacility(startQuarter, endQuarter, fridgeDistrict, carelevel)
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
                shellScope.child.fridgeDistrict = vm.fridgeDistrict;
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

        $scope.$on('refreshCapacity', function(e, startQuarter, endQuarter, fridgeDistrict, carelevel) {
            if(startQuarter && endQuarter)
            {
                vm.getFridgeDistrictRefrigerator(startQuarter, endQuarter, fridgeDistrict, carelevel);
                vm.getFridgeAllDistrictRefrigerator(startQuarter, endQuarter, fridgeDistrict, carelevel);
                vm.getFridgeFacilityRefrigerator(startQuarter, endQuarter, fridgeDistrict, carelevel);
                vm.getFridgeAllDistrictImmunizingFacility(startQuarter, endQuarter, fridgeDistrict, carelevel);
                vm.getFridgeDistrictImmunizingFacility(startQuarter, endQuarter, fridgeDistrict, carelevel);
                vm.getFridgeAllDistrictCapacity(startQuarter, endQuarter, fridgeDistrict, carelevel);
                vm.getFridgeDistrictCapacity(startQuarter, endQuarter, fridgeDistrict, carelevel);
                vm.getFridgeFacilityCapacity(startQuarter, endQuarter, fridgeDistrict, carelevel);

            }
        });

    }

]);
