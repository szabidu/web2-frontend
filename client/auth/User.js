'use strict';

var angularModule = require("auth/Auth");
require("auth/me.html");

angularModule.config(function ($stateProvider) {
  $stateProvider.state('me', {
      url: '/me',
      templateUrl: 'auth/me.html',
      controller: 'MeCtrl'
    }
  );

});

angularModule.controller('MeCtrl', function ($scope, $location) {
  if (!$scope.user) {
    $location.path('/login');
  }


});
