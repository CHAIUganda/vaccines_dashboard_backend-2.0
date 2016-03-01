angular.module( 'ngDashboard.surveillance', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'surveillance', {
    url: '/surveillance',
    views: {
      "main": {
        controller: 'SurveillanceCtrl',
        templateUrl: 'surveillance/surveillance.tpl.html'
      }
    },
    data:{ pageTitle: 'Surveillance' }
  });
})

.controller( 'SurveillanceCtrl', function SurvellanceCtrl( $scope ) {
  // This is simple a demo for UI Boostrap.
  $scope.dropdownDemoItems = [
    "The first choice!",
    "And another choice for you.",
    "but wait! A third!"
  ];
})

;
