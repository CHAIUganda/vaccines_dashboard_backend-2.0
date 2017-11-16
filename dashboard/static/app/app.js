// Lastly, define your "main" module and inject all other modules as dependencies
var dashboard = angular.module('dashboard',
  [
    //Shared
    "ui.router",
    // "chart.js",
    "ui.bootstrap",
    "checklist-model",
    // "angularChart",
    "ngTable",
    "services",
    "nvd3",
    "ui.grid",
    "ui.grid.edit",
    "ui.grid.rowEdit"
    // "leaflet-directive"
  ]
);
