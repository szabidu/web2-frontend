'use strict';

var angular = require("angular")
require("ttt/ttt.html");
require("ttt/ttt-business.html");
require("ttt/ttt-sub.html");

var angularModule = angular.module("ttt", []);

angularModule.config(function ($stateProvider, $urlRouterProvider) {
    var businessUrlSlug = 'elfogad';

    $urlRouterProvider.when('/ttt', '/ttt/' + businessUrlSlug);
    $urlRouterProvider.when('/ttt/', '/ttt/' + businessUrlSlug);

    $stateProvider.state('ttt', {
        abstract: true,
        url: '/ttt',
        templateUrl: 'ttt/ttt.html'
    });

    $stateProvider.state('ttt.sub', {
        url: '/:id',
        templateUrl: function (stateParams) {
            return (stateParams.id === businessUrlSlug) ? 'ttt/ttt-business.html' : 'ttt/ttt-sub.html';
        },
        controller: 'TTTCtrl'
    });

});

angularModule.controller('TTTCtrl', function ($scope, API_SERVER_ENDPOINT, $stateParams, $http) {
    var id = $stateParams.id;

    if (id === 'elfogad') {
        $http.get(API_SERVER_ENDPOINT + '/api/v1/ttt/business').success(function (data) {
		  $scope.businesses = data;
  	    });
  } else {
        $http.get(API_SERVER_ENDPOINT + '/api/v1/text/page/ttt-' + id).success(function (data) {
            $scope.page = data;
        });
  }

});

module.exports = angularModule;
