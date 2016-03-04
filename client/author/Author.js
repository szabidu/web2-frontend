'use strict';

var angular = require("angular")
//require("ngtemplate?relativeTo=/client/!raw!author/author.html");

var angularModule = angular.module('author', []);

angularModule.config(function ($stateProvider) {
    $stateProvider.state('author', {
        url: '/author/:id',
        templateUrl: 'author/author.html',
        controller: 'AuthorCtrl'
    });
});

angularModule.controller('AuthorCtrl', function ($scope, $rootScope, $stateParams, API_SERVER_ENDPOINT, $http) {
    $http.get(API_SERVER_ENDPOINT + '/api/v1/author/' + $stateParams.id, {cache: true}).success(function (data) {
        $scope.author = data;
        $rootScope.pageTitle = data.name;

    });
});


module.exports = angularModule
