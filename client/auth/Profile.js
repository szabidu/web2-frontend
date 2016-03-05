'use strict';

var angularModule = require("auth/Auth");
require("auth/profile.html");

angularModule.config(function ($stateProvider) {
    $stateProvider.state('profile', {
            url: '/profile',
            templateUrl: 'auth/profile.html',
            controller: 'ProfileCtrl'
        }
    );


});

angularModule.controller('ProfileCtrl', function () {

});

