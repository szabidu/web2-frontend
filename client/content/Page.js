'use strict';

var angularModule = require("content/Content");
require("content/page.html");

angularModule.config(function ($stateProvider) {
    $stateProvider.state('page', {
        url: '/page/:id',
        templateUrl: 'content/page.html',
        controller: 'PageCtrl'
    });
});

angularModule.controller('PageCtrl', function ($scope, API_SERVER_ENDPOINT, $stateParams, $http, $sce, Meta) {
    $http.get(API_SERVER_ENDPOINT + '/api/v1/text/page/' + $stateParams.id).success(function (data) {
        $scope.page = data;
        if ($scope.page.title) {
            Meta.setTitle($scope.page.title);
        }
        if ($scope.page.formatted) {
            Meta.setDescription($scope.page.formatted.replace(/<(?:.|\n)*?>/gm, '').substring(0, 400));
        }
        $scope.page.formatted = $sce.trustAsHtml($scope.page.formatted);
    });
});
