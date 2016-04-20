angular.module('coverage', []);
angular.module('fridge', []);
angular.module('stock', []);
angular.module('surveillance', []);

// Lastly, define your "main" module and inject all other modules as dependencies
angular.module('main',
  [
    'coverage',
    'fridge',
    'stock',
    'LoginApp',
    'surveillance',

    //Shared
    "ui.router",
    "chart.js",
    "ui.bootstrap",
    "checklist-model",
    "angularChart",
    "ngTable",
    "services"
  ]
);