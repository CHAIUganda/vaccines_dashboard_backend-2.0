$(document).ready(function() {

  var accessAreaId = "#id_access_area";
  var accessLevelId = "#id_access_level";

  var updateAreas = function(element){
    var level = $(element).val().toLowerCase();
    $.getJSON('/api/access/areas', {"level": level}, function(data){
      $(accessAreaId).select2().empty();
      $(accessAreaId).select2({data:data});
    });
  };

  var accessLevelChanged = function(event){
    updateAreas(event.target);
  };

  $(accessLevelId).select2();
  $(accessLevelId).change(accessLevelChanged);
  $(accessAreaId).select2();

});

