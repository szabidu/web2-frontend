'use strict';


var angular = require("angular");

var angularModule = angular.module('main', []);
require("main/index.html");
require("main/sidebar_left.html");
require("main/sidebar_right.html");
require("main/404.html");

angularModule.controller('HeaderCtrl', function ($scope, $location) {
    $scope.isCollapsed = false;
    $scope.searchTerm = '';
    $scope.search = function () {
        $location.path('/search/' + $scope.searchTerm);
    };
});



module.exports = angularModule;


require("main/404");
require("main/Index")
