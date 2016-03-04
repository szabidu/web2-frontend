'use strict';

var angularModule = require("auth/Auth");

angularModule.config(function ($stateProvider) {
  $stateProvider.state('me', {
      url: '/me',
      templateUrl: 'partials/me.html',
      controller: 'MeCtrl'
    }
  );

});

angularModule.controller('MeCtrl', function ($scope, $location) {
  if (!$scope.user) {
    $location.path('/login');
  }


});
