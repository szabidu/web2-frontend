'use strict';

angular.module('tilosApp').config(function ($stateProvider) {
  $stateProvider.state('password_reset', {
    url: '/password_reset',
    templateUrl: 'partials/reset.html',
    controller: 'ChangePasswordCtrl' });
});

angular.module('tilosApp')
    .controller('ChangePasswordCtrl', ['$rootScope', '$scope', '$location', 'API_SERVER_ENDPOINT', '$http', function ($rootScope, $scope, $location, server, $http) {
      $scope.newpassword = {};
      $scope.newpassword.token = ($location.search()).token;
      $scope.newpassword.email = ($location.search()).email;
      if (!$scope.newpassword.token || !$scope.newpassword.email) {
        $scope.error = "Az email vagy a token paraméter hiányzik";
      }
      $scope.reset = function () {
        $http.post(server + '/api/v1/auth/password_reset', $scope.newpassword).success(function (data) {
            $scope.error = "";
            $scope.message = data.message;

        }).error(function (data) {
          if (data.message) {
            $scope.error = data.message;
          } else {
            $scope.error= "Unknown error"
          }
            });
      };
    }]);
