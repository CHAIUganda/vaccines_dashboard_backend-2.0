angular.module( 'ngDashboard.fridge', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'fridge', {
    url: '/fridge',
    views: {
      "main": {
        controller: 'FridgeCtrl',
        templateUrl: 'fridge/fridge.tpl.html'
      }
    },
    data:{ pageTitle: 'Fridge Coverage' }
  });
})

.controller( 'FridgeCtrl', function FridgeCtrl( $scope ) {
  // This is simple a demo for UI Boostrap.
  $scope.dropdownDemoItems = [
    "The first choice!",
    "And another choice for you.",
    "but wait! A third!"
  ];
})

;
