'use strict';

angular.module('tilosApp').config(function ($stateProvider) {
    $stateProvider.state('register', {
            url: '/register',
            templateUrl: 'partials/register.html',
            controller: 'RegisterCtrl'
        }
    );

});

angular.module('tilosApp').controller('RegisterCtrl', function ($scope, $http, API_SERVER_ENDPOINT, vcRecaptchaService, $rootScope, localStorageService, $location) {
    $scope.form = {};
    $scope.register = function () {
        $scope.errormessage = '';
        $scope.form.captchaChallenge = vcRecaptchaService.data().challenge;
        $scope.form.captchaResponse= vcRecaptchaService.data().response;
        $http.post(API_SERVER_ENDPOINT + '/api/v1/auth/register', $scope.form).success(function (data) {
            localStorageService.set('jwt', data);

            $http.get(API_SERVER_ENDPOINT + '/api/v1/user/me').success(function (data) {
                $rootScope.user = data;
                $location.path('/');
            });
        }).error(function (data) {
            vcRecaptchaService.reload();
            if (data.message) {
                $scope.errormessage = data.message.replace(/\n/g,'<br/>');
            } else {
                $scope.errormessage = 'Ismeretlen hiba történt';

            }
        });
    };
});
