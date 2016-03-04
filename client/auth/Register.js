'use strict';

var angularModule = require("auth/Auth");

angularModule.config(function ($stateProvider) {
    $stateProvider.state('register', {
            url: '/register',
            templateUrl: 'partials/register.html',
            controller: 'RegisterCtrl'
        }
    );

});

angularModule.controller('RegisterCtrl',
    ['$scope', '$http', 'API_SERVER_ENDPOINT', 'vcRecaptchaService', '$rootScope', 'localStorageService', '$location', 'satellizer.shared',
        function ($scope, $http, API_SERVER_ENDPOINT, vcRecaptchaService, $rootScope, localStorageService, $location, satellizer) {
            if ($scope.user) {
                $location.path('/me');
            }
            $scope.form = {};
            $scope.register = function () {
                $scope.errormessage = '';
                $scope.form.captchaChallenge = vcRecaptchaService.data().challenge;
                $scope.form.captchaResponse = vcRecaptchaService.data().response;
                $http.post(API_SERVER_ENDPOINT + '/api/v1/auth/register', $scope.form).success(function (data) {
                    satellizer.setToken({access_token: data});
                    localStorageService.set('jwt', data);
                    $http.get(API_SERVER_ENDPOINT + '/api/v1/user/me').success(function (data) {
                        $rootScope.user = data;
                        $location.path('/');
                    });
                }).error(function (data) {
                    vcRecaptchaService.reload();
                    if (data.message) {
                        $scope.errormessage = data.message.replace(/\n/g, '<br/>');
                    } else {
                        $scope.errormessage = 'Ismeretlen hiba történt';

                    }
                });
            };
        }]);
