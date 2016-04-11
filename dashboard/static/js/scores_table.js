$(document).ready(function() {
    var tableId = "#score-tables";

    var oTable = $(tableId).DataTable({
        "dom": '<"top"f>rt<"bottom"lp><"clear">',
        language: {
            search: "",
            searchPlaceholder: "Search"
        },
        "processing": true,
        "serverSide": true,
        "ordering": true,
        "fixedColumns": {
            leftColumns: 4
        },
        "aoColumnDefs": [{
            "bSortable": false,
            "aTargets": [
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
            ]
        }],
        "scrollX": "100%",
        "scrollCollapse": true,
        "bLengthChange": true,
        "columnDefs": [{
            "width": "90%",
            "targets": 0
        }],
        "ajax": {
            "url": "/api/table/scores",
            "type": "POST",
            "data": function(d) {
                d.cycle = $("#cycle_select").val();
                d.warehouse = $("#warehouse_select").val();
                d.ip = $("#ip_select").val();
                d.formulation = $("#formulation_select").val();
                var list_of_districts = $(
                    "#district_select").val();
                if (list_of_districts) {
                    var districts_text = list_of_districts.join(
                        ",");
                    d.district = districts_text;
                }

            }
        }
    });
    $(tableId).on("draw.dt", function() {
        $("td:contains('PASS')").addClass("score_PASS");
        $("td:contains('FAIL')").addClass("score_FAIL");
        $("td:contains('WEB')").addClass("score_WEB");
        $("td:contains('PAPER')").addClass("score_FAIL");
    });
    var selectIds = [
        "#district_select",
        "#warehouse_select",
        "#ip_select",
        "#cycle_select",
        "#formulation_select"
    ];
    var tags = {};
    var displayTags = function() {
        var tagsToDisplay = [];
        _.forIn(tags, function(value, key) {
            if (value) {
                if (key == "district") {
                  if (value.length < 5){
                    for (var i = 0; i < value.length; i +=
                        1) {
                        tagsToDisplay.push({
                            "value": value[i],
                            "name": key
                        });
                    }
                  }else {
                    tagsToDisplay.push({ "value": value.length + " districts", "name": "Districts"});
                  }
                } else {
                    tagsToDisplay.push({
                        "value": value,
                        "name": key
                    });
                }

            }
        });

        var template =
            $.templates(
                "{{for tags}}<span class='filter-tag'>{{:value}} <button type='button'  class='close close-tag' aria-label='Close' ><span aria-hidden='true' data-name='{{:name}}' data-value='{{:value}}'>&times;</span></button></span>{{/for}}<a href='#' id='resetFilter' class='btn btn-sm reset-tag'>Reset</a>"
            );
        var html = template.render({
            tags: tagsToDisplay
        });
        $("#tags").html(html);
        $("#resetFilter").click(function() {
          _.forEach(selectIds, function(id) {
            if (id == "#district_select") {
              $(id).val("").multipleSelect("refresh");
            }
            else {
              $(id).select2("val", "");
            }
            });
        });

        $(".close-tag").click(function(ev) {
            var name = $(ev.target).data("name");
            var value = $(ev.target).data("value");
            var selectId = "#" + name + "_select";
            if (name == "district") {
                var values = $(selectId).val();
                var index = values.indexOf(value);
                values.splice(index, 1);
                $(selectId).val(values).multipleSelect("refresh");
            } else {
                var firstValue = $(selectId + " option:first")
                    .val();
                $(selectId).select2("val", firstValue);
            }

        });

    };

    _.forEach(selectIds, function(id) {
        var name = $(id).attr("name");
        if (id == "#district_select") {
            $(id).multipleSelect({
                placeholder: "ALL DISTRICTS",
                tags: false
            });
        } else {
            $(id).select2();
        }


        $(id).on("change", function(ev) {
            oTable.draw();
            var selectedValue = $(ev.target).val();
            var filter = $(ev.target).attr("name");
            tags[filter] = selectedValue;
            displayTags();
        });
    });

    _.forEach(["#cycle_select", "#formulation_select"], function(id) {
        var firstValue = $(id + " option:first").val();
        $(id).select2("val", firstValue);
        console.log("val", firstValue);
    });

    $(tableId).on("click", "td", function(e) {
        var realTable = $(tableId).dataTable();
        var col = $(this).parent().children().index($(this));
        var row = $(this).parent().parent().children().index($(
            this).parent());
        var data = realTable.fnGetData(row);
        var id = data[data.length - 1];
        var combination = $("#formulation_select").val();
        if (col > 3) {
            var url = "/api/table/scores/detail/" + id + "/" +
                col;
            var success = function(html) {
                var detailPageId = "#score_detail";
                $(detailPageId).html(html);
                $("#score_detail").modal();
            };
            $.ajax({
                url: url,
                data: {
                    combination: combination
                },
                success: success
            });

        }

    });

    $("[name='score-tables_length']").removeClass();

});
