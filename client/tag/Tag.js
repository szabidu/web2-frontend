'use strict';

var angular = require("angular")
require("tag/tags.html");
require("tag/tag.html");

var angularModule = angular.module("tag", []);


angularModule.config(function ($stateProvider) {
    $stateProvider.state('tag', {
        url: '/tag/:id',
        templateUrl: 'tag/tag.html',
        controller: 'TagCtrl',
        resolve: {
            data: function ($route, Tags, $stateParams) {
                return Tags.get({id: $stateParams.id});
            }
        }
    }).state('tags', {
        url: '/tags',
        templateUrl: 'tag/tags.html',
        controller: 'TagListCtrl'
    });
});

angularModule.controller('TagCtrl', function ($scope, Tags, data, $stateParams) {
    $scope.list = data;
    $scope.tag = $stateParams.id;
});

angularModule.controller('TagListCtrl', function ($scope, $http, API_SERVER_ENDPOINT) {
    $http.get(API_SERVER_ENDPOINT + '/api/v1/tag?limit=100', {cache: true}).success(function (data) {
        $scope.tags = data;
    });

});

angularModule.factory('Tags', ['API_SERVER_ENDPOINT', '$resource', function (server, $resource) {
    return $resource(server + '/api/v1/tag/:id', null, {});
}]);


angularModule.controller('TagCloudCtrl', function (API_SERVER_ENDPOINT, $http, $scope) {
    $http.get(API_SERVER_ENDPOINT + '/api/v1/tag', {cache: true}).success(function (data) {
        $scope.tags = data.tags;
    });
});


module.exports = angularModule;

