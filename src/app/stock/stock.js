angular.module( 'ngDashboard.stock', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'stock', {
    url: '/stock',
    views: {
      "main": {
        controller: 'StockCtrl',
        templateUrl: 'stock/stock.tpl.html'
      }
    },
    data:{ pageTitle: 'Stock Management' }
  });
})

.controller( 'StockCtrl', function StockCtrl( $scope ) {
  // This is simple a demo for UI Boostrap.
  $scope.dropdownDemoItems = [
    "The first choice!",
    "And another choice for you.",
    "but wait! A third!"
  ];
})

;
