'use strict';

angular.module('tilosApp').config(function ($stateProvider) {
  $stateProvider.state('me', {
      url: '/me',
      templateUrl: 'partials/me.html',
      controller: 'MeCtrl'
    }
  );

});

angular.module('tilosApp').controller('MeCtrl', function ($scope, $location) {
  if (!$scope.user) {
    $location.path('/login');
  }


});
