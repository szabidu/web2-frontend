'use strict';

var angularModule = require("auth/Auth");

require("auth/login.html");
require("auth/reminder.html");

angularModule.config(function ($stateProvider) {
    $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'auth/login.html',
            controller: 'LoginCtrl'
        }
    );
    $stateProvider.state('password_reminder', {
            url: '/password_reminder',
            templateUrl: 'auth/reminder.html',
            controller: 'PasswordReminderCtrl'
        }
    );

});

angularModule.run(['$rootScope', '$location', '$auth', function ($rootScope, $location, satellizer) {
    $rootScope.logout = function () {
        $rootScope.user = null;
        satellizer.logout();
        $location.path('/');
    };
    $rootScope.isLoggedIn = function () {
        return $rootScope.user;
    };
}]);


angularModule.controller('PasswordReminderCtrl', function ($scope, $http, API_SERVER_ENDPOINT) {
    $scope.reminderdata = {};
    $scope.reminder = function () {
        $http.post(API_SERVER_ENDPOINT + '/api/v1/auth/password_reset', $scope.reminderdata).then(function (data) {
            if (!data.error) {
                $scope.message = data.message;
            } else {
                $scope.remindererror = 'Password reset error';
            }
        }).error(function (data) {
            if (data.message) {
                $scope.remindererror = data.message;
            } else {
                $scope.remindererror = 'Unknown error';
            }
        });
    };
});

angularModule.controller('LoginCtrl',
    ['$rootScope', '$scope', '$location', 'API_SERVER_ENDPOINT', '$http', 'localStorageService', '$auth',
        function ($rootScope, $scope, $location, API_SERVER_ENDPOINT, $http, localStorageService, $auth) {
            if ($scope.user) {
                $location.path('/me');
            }
            $scope.logindata = {};
            $scope.loginerror = '';
            $scope.authenticate = function (provider) {
                $auth.authenticate(provider).then(function(){
                    $http.get(API_SERVER_ENDPOINT + '/api/v1/user/me').then(function (data) {
                        $rootScope.user = data;
                        $location.path('/');
                    });
                    });
            };
            $scope.login = function () {
                $http.post(API_SERVER_ENDPOINT + '/api/v1/auth/login', $scope.logindata).then(function (data) {
                    $auth.setToken(data.access_token);
                    localStorageService.set('jwt', data);

                    $http.get(API_SERVER_ENDPOINT + '/api/v1/user/me').then(function (data) {
                        $rootScope.user = data;
                        $location.path('/');
                    });

                },function (data) {
                    localStorageService.remove('jwt');
                    if (data.message) {
                        $scope.loginerror = data.message;
                    } else {
                        $scope.loginerror = 'Login error';
                    }
                });

            };


        }]
);
