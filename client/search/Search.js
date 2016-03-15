'use strict';

var angular = require("angular");

var angularModule = angular.module("search", []);
require("search/search.html");

angularModule.config(function ($stateProvider) {
    $stateProvider.state('search', {
        url: '/search/:id',
        templateUrl: 'search/search.html',
        controller: 'SearchCtrl'
    });
});
angularModule.controller('SearchCtrl', function ($scope, $rootScope, $stateParams, API_SERVER_ENDPOINT, $http) {
    $scope.types = {'page': 'Oldal', 'episode': 'Adásnapló', 'author': 'Műsorkészítő', 'show': 'Műsor', 'mix': 'Mix'};
    $http.get(API_SERVER_ENDPOINT + '/api/v1/search/query?q=' + $stateParams.id, {cache: true}).success(function (data) {
        $scope.result = data;
    });
});

angularModule.controller('SearchBox', function ($scope, $location) {
    $scope.search = function () {
        $location.path('search/' + $scope.term);
    };
});

module.exports = angularModule;
