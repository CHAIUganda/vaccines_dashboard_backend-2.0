angular.module( 'ngDashboard.admin', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'admin', {
    url: '/admin',
    views: {
      "main": {
        controller: 'AdminCtrl',
        templateUrl: 'admin/admin.tpl.html'
      }
    },
    data:{ pageTitle: 'Admin' }
  });
})

.controller( 'AdminCtrl', function AdminCtrl( $scope ) {
  // This is simple a demo for UI Boostrap.
  $scope.dropdownDemoItems = [
    "The first choice!",
    "And another choice for you.",
    "but wait! A third!"
  ];
})

;
