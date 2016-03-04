'use strict';

var angularModule = require("auth/Auth");

angularModule.config(function ($stateProvider) {
    $stateProvider.state('profile', {
            url: '/profile',
            templateUrl: 'partials/profile.html',
            controller: 'ProfileCtrl'
        }
    );


});

angularModule.controller('ProfileCtrl', function () {

});

