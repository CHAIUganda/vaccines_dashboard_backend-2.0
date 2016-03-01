angular.module( 'ngDashboard.stock', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'http'
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

.controller( 'StockCtrl', function StockCtrl( $scope, $http) {

    var districts_json={};
    var vaccines_json={};   

    $scope.districts = [
            {id: 1, name: "Kampala"},
            {id: 2, name: "Jinja"},
            {id: 3, name: "Abim"},
    ];
    
    $scope.vaccines = [
            {id: 1, name: "DPT3-HEB-HID"},
            {id: 2, name: "DPT4-HEB-Other"},
    ];
    
    $scope.filter=function(mode){
        switch(mode){
            case "district":
                $scope.districts[$scope.district] = $scope.districts[$scope.district];
                $scope.district = 'all';
            break;
            case "district":
                $scope.vaccines[$scope.vaccine] = $scope.vaccines[$scope.vaccine];
                $scope.vaccine = 'all';
            break;
        }
        delete $scope.districts["all"];
        delete $scope.vaccines["all"];
    };
  
})

;
