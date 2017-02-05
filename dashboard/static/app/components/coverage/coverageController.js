angular.module('dashboard')
    .controller('CoverageController', ['$scope','$location', 'StockService', '$rootScope', 'NgTableParams', 'FilterService', 'MonthService', 'CoverageService',
    function($scope,$location, StockService, $rootScope, NgTableParams, FilterService, MonthService, CoverageService)
    {
        var vm = this;
        var shellScope = $scope.$parent;
        shellScope.child = $scope;
        vm.path = $location.path();
        vm.endtxt="";
        vm.startxt="";

        vm.getVaccineDoses = function(period, vaccine, district) {


            //Todo: Temporarily disable filtering by district for the table
            district = ""
            vm.district = district;
            vm.vaccine = vaccine;//vm.selectedVaccine ? vm.selectedVaccine.name : "va";

            // Assign dimensions for map container
            var width = 500,
                height = 500;
            var field = "";

            if (vm.path=="/coverage/dropoutrate"){
                field="drop_out_rate";
                vm.endtxt="%";

            }
            else if (vm.path=="/coverage/redcategory"){
                field="Red_category";
                vm.startxt="CAT";
                if (Red_category='1'){
                    color="#FFFF00"
                }
                else if (Red_category='2'){
                    color="#c6c30b"
                }
            }
            else if (vm.path=="/coverage/coverage"){
                field="coverage_rate";
                vm.endtxt="%"
            }
            else if (vm.path=="/coverage/notimmunized"){
                field="under_immunized";
            }

            if (vaccine=="PENTA"){
                vm.vaccine='DPT3';
            }
            else if (vaccine=="PCV"){
                vm.vaccine="PCV3";
            }
            else if (vaccine=="BCG"){
                vm.vaccine="BCG-MEASLES";
            }
            else if (vaccine=="OPV"){
                vm.vaccine="OPV4";
            }
            else if (vaccine=="HPV"){
                vm.vaccine="HPV2";
            }
            else if (vaccine=="TT"){
                vm.vaccine="TT2";
            }
            shellScope.child.district = vm.district;
            shellScope.child.vaccine = vm.vaccine;


            var valueFormat = d3.format(",");

            // Define a geographical projection
            // Also, set initial zoom to show the features
            var projection	= d3.geo.mercator()
                .scale(1);

            // Prepare a path object and apply the projection to it
            var path = d3.geo.path()
                .projection(projection);

            // We prepare an object to later have easier access to the data.
            var dataById = d3.map();

            //Define quantize scale to sort data values into buckets of color
            //Colors by Cynthia Brewer (colorbrewer2.org), 9-class YlGnBu

            var color = d3.scale.quantize()
                                //.range(d3.range(9),map(function(i) { return 'q' + i + '-9';}));
                            .range([    "#a50026",
                                        "#d73027",
                                        "#f46d43",
                                        "#fdae61",
                                        "#fee08b",
                                        "#ffffbf",
                                        "#d9ef8b",
                                        "#a6d96a",
                                        "#66bd63",
                                        "#1a9850",
                                        "#006837" ]);

            CoverageService.getVaccineDoses(period, vaccine)
                .then(function(data) {

                    vm.data = angular.copy(data);

                    //Set input domain for color scale
                    color.domain([
                        d3.min(data, function(d) { return +d[field]; }),
                        d3.max(data, function(d) { return +d[field]; })

                        ]);

                    // This maps the data of the CSV so it can be easily accessed by
                    // the ID of the district, for example: dataById[2196]
                    dataById = d3.nest()
                      .key(function(d) { return d.id; })
                      .rollup(function(d) { return d[0]; })
                      .map(data);

                    // Load features from GeoJSON
                    d3.json('static/app/components/coverage/data/ug_districts2.geojson', function(error, json) {


                        // Get the scale and center parameters from the features.
                        var scaleCenter = calculateScaleCenter(json);

                        // Apply scale, center and translate parameters.
                        projection.scale(scaleCenter.scale)
                                .center(scaleCenter.center)
                                .translate([width/2, height/2]);

                        // Merge the coverage data amd GeoJSON into a single array
                        // Also loop through once for each coverage score data value

                        for (var i=0; i < data.length ; i++ ) {

                            // Grab district name
                            var dist = data[i].district__name;
                            var pos = dist.indexOf(" ");
                            var dataDistrict = dist.substring(0, pos).toUpperCase();
                            //var dataDistrict = data[i].district;

                            //Grab data value, and convert from string to float
                            var dataValue = +data[i][field];

                            //Find the corresponding district inside GeoJSON
                            for (var j=0; j < json.features.length ; j++ ) {

                                // Check the district reference in json
                                var jsonDistrict = json.features[j].properties.dist;

                                if (dataDistrict == jsonDistrict) {

                                    //Copy the data value into the GeoJSON
                                    json.features[j].properties.field = dataValue;

                                    //Stop looking through JSON
                                    break;
                                }
                            }
                        }



                        // Create SVG inside map container and assign dimensions
                        //svg.selectAll("*").remove();
                        d3.select("#map").selectAll("*").remove();
                        var svg = d3.select("#map")
                            .append('svg')
                            .attr("width", width)
                            .attr("height", height);

                        // Add a <g> element to the SVG element and give a class to style later
                        svg.append('g')
                            .attr('class', 'features')
                        // Bind data and create one path per GeoJSON feature
                        svg.selectAll("path")
                            .data(json.features)
                            .enter()
                            .append("path")
                            .attr("d", path)
                            .on("mouseover", hoveron)
                            .on("mouseout", hoverout)
                            .style("cursor", "pointer")
                            .style("stroke", "#777")
                            .style("fill", function(d) {

                                // Get data value

                                var value = d.properties.field;

                                if (value) {
                                    // If value exists ...
                                    return color(value);
                                } else {
                                    // If value is undefines ...
                                    return "#ccc";
                                }
                            });



                    }); // End d3.json

                    // Logic to handle hover event when its firedup
                        var hoveron = function(d) {
                            console.log('d', d, 'event', event);
                            var div = document.getElementById('tooltip');
                            div.style.left = event.pageX + 'px';
                            div.style.top = event.pageY + 'px';


                            //Fill yellow to highlight
                            d3.select(this)
                                .style("fill", "white");

                            //Show the tooltip
                            d3.select("#tooltip")
                                .style("opacity", 1);

                            //Populate name in tooltip
                            d3.select("#tooltip .name")
                                .text(d.properties.dist);

                            //Populate value in tooltip
                            d3.select("#tooltip .value")
                                .text((vm.startxt)+ (valueFormat(d.properties.field)+ vm.endtxt));
                        }

                        var hoverout = function(d) {

                            //Restore original choropleth fill
                            d3.select(this)
                                .style("fill", function(d) {
                                    var value = d.properties.field;
                                    if (value) {
                                        return color(value);
                                    } else {
                                        return "#ccc";
                                    }
                                });

                            //Hide the tooltip
                            d3.select("#tooltip")
                                .style("opacity", 0);

                        }

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

            function calculateScaleCenter(features) {
                // Get the bounding box of the paths (in pixels) and calculate a scale factor based on box and map size
                var bbox_path = path.bounds(features),
                    scale = 0.95 / Math.max(
                        (bbox_path[1][0] - bbox_path[0][0]) / width,
                        (bbox_path[1][1] - bbox_path[0][1]) / height
                        );

                // Get the bounding box of the features (in map units) and use it to calculate the center of the features.
                var bbox_feature = d3.geo.bounds(features),
                    center = [
                        (bbox_feature[1][0] + bbox_feature[0][0]) / 2,
                        (bbox_feature[1][1] + bbox_feature[0][1]) / 2];

                return {
                    'scale':scale,
                    'center':center
                };
            }

             // NEW: Defining getIdOfFeature
            function getIdOfFeature(f) {
              return f.properties.idug;
            }
        };

        //vm.getVaccineDoses = function(period, vaccine, district) {
        //
        //
        //    //Todo: Temporarily disable filtering by district for the table
        //    district = ""
        //    vm.district = district;
        //    vm.vaccine = vaccine;//vm.selectedVaccine ? vm.selectedVaccine.name : "va";
        //
        //    // Assign dimensions for map container
        //    var width = 500,
        //        height = 500;
        //    var field = "";
        //
        //
        //
        //    shellScope.child.district = vm.district;
        //    shellScope.child.vaccine = vm.vaccine;
        //
        //    var valueFormat = d3.format(",");
        //
        //    // Define a geographical projection
        //    // Also, set initial zoom to show the features
        //    var projection	= d3.geo.mercator()
        //        .scale(1);
        //
        //    // Prepare a path object and apply the projection to it
        //    var path = d3.geo.path()
        //        .projection(projection);
        //
        //    // We prepare an object to later have easier access to the data.
        //    var dataById = d3.map();
        //
        //    //Define quantize scale to sort data values into buckets of color
        //    //Colors by Cynthia Brewer (colorbrewer2.org), 9-class YlGnBu
        //
        //    var color = d3.scale.quantize()
        //                        //.range(d3.range(9),map(function(i) { return 'q' + i + '-9';}));
        //
        //                    .range([    "#008000",
        //                                "#FFFF00",
        //                                "#FFA500",
        //                                "#FF0000"
        //                                         ]);
        //
        //    CoverageService.getVaccineDoses(period, vaccine)
        //        .then(function(data) {
        //
        //            vm.data = angular.copy(data);
        //
        //            //Set input domain for color scale
        //            color.domain([
        //                d3.min(data, function(d) { return +d[field]; }),
        //                d3.max(data, function(d) { return +d[field]; })
        //
        //                ]);
        //
        //            // This maps the data of the CSV so it can be easily accessed by
        //            // the ID of the district, for example: dataById[2196]
        //            dataById = d3.nest()
        //              .key(function(d) { return d.id; })
        //              .rollup(function(d) { return d[0]; })
        //              .map(data);
        //
        //            // Load features from GeoJSON
        //            d3.json('static/app/components/coverage/data/ug_districts2.geojson', function(error, json) {
        //
        //
        //                // Get the scale and center parameters from the features.
        //                var scaleCenter = calculateScaleCenter(json);
        //
        //                // Apply scale, center and translate parameters.
        //                projection.scale(scaleCenter.scale)
        //                        .center(scaleCenter.center)
        //                        .translate([width/2, height/2]);
        //
        //                // Merge the coverage data amd GeoJSON into a single array
        //                // Also loop through once for each coverage score data value
        //
        //                for (var i=0; i < data.length ; i++ ) {
        //
        //                    // Grab district name
        //                    var dist = data[i].district__name;
        //                    var pos = dist.indexOf(" ");
        //                    var dataDistrict = dist.substring(0, pos).toUpperCase();
        //                    //var dataDistrict = data[i].district;
        //
        //                    //Grab data value, and convert from string to float
        //                    var dataValue = +data[i][field];
        //
        //                    //Find the corresponding district inside GeoJSON
        //                    for (var j=0; j < json.features.length ; j++ ) {
        //
        //                        // Check the district reference in json
        //                        var jsonDistrict = json.features[j].properties.dist;
        //
        //                        if (dataDistrict == jsonDistrict) {
        //
        //                            //Copy the data value into the GeoJSON
        //                            json.features[j].properties.field = dataValue;
        //
        //                            //Stop looking through JSON
        //                            break;
        //                        }
        //                    }
        //                }
        //
        //
        //
        //                // Create SVG inside map container and assign dimensions
        //                //svg.selectAll("*").remove();
        //                d3.select("#map").selectAll("*").remove();
        //                var svg = d3.select("#map")
        //                    .append('svg')
        //                    .attr("width", width)
        //                    .attr("height", height);
        //
        //                // Add a <g> element to the SVG element and give a class to style later
        //                svg.append('g')
        //                    .attr('class', 'features')
        //                // Bind data and create one path per GeoJSON feature
        //                svg.selectAll("path")
        //                    .data(json.features)
        //                    .enter()
        //                    .append("path")
        //                    .attr("d", path)
        //                    .on("mouseover", hoveron)
        //                    .on("mouseout", hoverout)
        //                    .style("cursor", "pointer")
        //                    .style("stroke", "#777")
        //                    .style("fill", function(d) {
        //
        //                        // Get data value
        //
        //                        var value = d.properties.field;
        //
        //                        if (value) {
        //                            // If value exists ...
        //                            return color(value);
        //                        } else {
        //                            // If value is undefines ...
        //                            return "#ccc";
        //                        }
        //                    });
        //
        //
        //
        //            }); // End d3.json
        //
        //            // Logic to handle hover event when its firedup
        //                var hoveron = function(d) {
        //                    console.log('d', d, 'event', event);
        //                    var div = document.getElementById('tooltip');
        //                    div.style.left = event.pageX + 'px';
        //                    div.style.top = event.pageY + 'px';
        //
        //
        //                    //Fill yellow to highlight
        //                    d3.select(this)
        //                        .style("fill", "white");
        //
        //                    //Show the tooltip
        //                    d3.select("#tooltip")
        //                        .style("opacity", 1);
        //
        //                    //Populate name in tooltip
        //                    d3.select("#tooltip .name")
        //                        .text(d.properties.dist);
        //
        //                    //Populate value in tooltip
        //                    d3.select("#tooltip .value")
        //                        .text(valueFormat(d.properties.field)+ vm.endtxt);
        //                }
        //
        //                var hoverout = function(d) {
        //
        //                    //Restore original choropleth fill
        //                    d3.select(this)
        //                        .style("fill", function(d) {
        //                            var value = d.properties.field;
        //                            if (value) {
        //                                return color(value);
        //                            } else {
        //                                return "#ccc";
        //                            }
        //                        });
        //
        //                    //Hide the tooltip
        //                    d3.select("#tooltip")
        //                        .style("opacity", 0);
        //
        //                }
        //
        //            tabledataAlldoses = vm.data.filter(
        //                function (value) {
        //                    return value;
        //                });
        //
        //            vm.tableParamsDoses = new NgTableParams({
        //                page: 1,
        //                count: 10
        //            }, {
        //                filterDelay: 0,
        //                counts: [],
        //                data: tabledataAlldoses,
        //            });
        //
        //    });
        //
        //    function calculateScaleCenter(features) {
        //        // Get the bounding box of the paths (in pixels) and calculate a scale factor based on box and map size
        //        var bbox_path = path.bounds(features),
        //            scale = 0.95 / Math.max(
        //                (bbox_path[1][0] - bbox_path[0][0]) / width,
        //                (bbox_path[1][1] - bbox_path[0][1]) / height
        //                );
        //
        //        // Get the bounding box of the features (in map units) and use it to calculate the center of the features.
        //        var bbox_feature = d3.geo.bounds(features),
        //            center = [
        //                (bbox_feature[1][0] + bbox_feature[0][0]) / 2,
        //                (bbox_feature[1][1] + bbox_feature[0][1]) / 2];
        //
        //        return {
        //            'scale':scale,
        //            'center':center
        //        };
        //    }
        //
        //     // NEW: Defining getIdOfFeature
        //    function getIdOfFeature(f) {
        //      return f.properties.idug;
        //    }
        //};


        vm.getVaccineDosesByDistrict = function(period, district, vaccine) {


            CoverageService.getVaccineDosesByDistrict(period, district, vaccine)
                .then(function(data) {

                    vm.data = angular.copy(data);

                    shellScope.child.dropedout = 0;
                    if(vm.data.length > 0){
                        shellScope.child.dropedout = vm.data[0].drop_out_rate;
                        shellScope.child.underimmunized = vm.data[0].under_immunized;
                        /* Access */
                        if(vm.data[0].access >= 90){
                            shellScope.child.access = "Good"
                        }
                        else{
                            shellScope.child.access = "Poor"
                        }
                        /* Utilization */
                        if(shellScope.child.dropedout <= 10){
                            shellScope.child.utilization = "Good"
                        }
                        else{
                            shellScope.child.utilization = "Poor"
                        }
                        /* Red Categorization*/
                        if((vm.data[0].access >= 90) && (vm.data[0].drop_out_rate <= 10)){
                            shellScope.redcategory = "CAT1"
                        }
                        else if(vm.data[0].access >= 90 && vm.data[0].drop_out_rate > 10){
                            shellScope.redcategory = "CAT2"
                        }
                        else if(vm.data[0].access < 90 && vm.data[0].drop_out_rate <= 10){
                            shellScope.redcategory = "CAT3"
                        }
                        else if(vm.data[0].access < 90 && vm.data[0].drop_out_rate > 10){
                            shellScope.redcategory = "CAT4"
                        }
                    }

                });
        };

        $scope.$on('refresh', function(e, startMonth, endMonth, district, vaccine) {
            if(startMonth.name && endMonth.name && district.name && vaccine.name)
            {
                //vm.getStockByDistrict(startMonth.name, endMonth.name, district.name, vaccine.name);
                //vm.getStockByDistrictVaccine(startMonth.name, endMonth.name, district.name, vaccine.name);
                vm.getVaccineDosesByDistrict(endMonth.period, district.name, vaccine.name);
                //vm.getVaccineDoses(endMonth.period, vaccine.name);
                vm.getVaccineDoses(endMonth.period, vaccine.name);
                //vm.getDHIS2VaccineDoses(endMonth.period, district.name, vaccine.name);

            }
        });

    }

]);
