angular.module( 'ngDashboard.survellance', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'survellance', {
    url: '/survellance',
    views: {
      "main": {
        controller: 'SurvellanceCtrl',
        templateUrl: 'survellance/survellance.tpl.html'
      }
    },
    data:{ pageTitle: 'What is It?' }
  });
})

.controller( 'SurvellanceCtrl', function SurvellanceCtrl( $scope ) {
  // This is simple a demo for UI Boostrap.
  $scope.dropdownDemoItems = [
    "The first choice!",
    "And another choice for you.",
    "but wait! A third!"
  ];
})

;
