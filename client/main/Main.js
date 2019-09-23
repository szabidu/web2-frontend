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


angularModule.directive('activeLink', ['$location', function (location) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var clazz = attrs.activeLink;
            //TODO it shoud be more error prone
            var path = element.children()[0].href;
            path = path.substring(1 + path.indexOf('#'));
            if (path.charAt(0) !== '/') {
                path = '/' + path;
            }
            scope.location = location;
            scope.$watch('location.path()', function (newPath) {
                if (path === newPath) {
                    element.addClass(clazz);
                } else {
                    element.removeClass(clazz);
                }
            });

        }
    };
}]);

module.exports = angularModule;


require("main/404");
require("main/Index");
require("main/Static");
require("main/Listen");
require("main/Maraton");

