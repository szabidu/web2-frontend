'use strict';

angular.module('tilosApp').config(function ($stateProvider) {
    $stateProvider.state('index', {
        url: '/',
        templateUrl: 'partials/index.html',
        controller: 'MainCtrl'
    });
    $stateProvider.state('index-i', {
        url: '/index',
        templateUrl: 'partials/index.html',
        controller: 'MainCtrl'
    });

});

angular.module('tilosApp').controller('MainCtrl', function ($scope, FeedService, $http, API_SERVER_ENDPOINT, $sce, $timeout) {
    FeedService.parseFeed('http://hirek.tilos.hu/?feed=rss2').then(function (res) {
        $scope.feeds = res.data.responseData.feed.entries;
    });
    $http.get(API_SERVER_ENDPOINT + '/api/v1/episode/next').success(function (data) {
        $scope.next = data;
    });
    $http.get(API_SERVER_ENDPOINT + '/api/v1/episode/last').success(function (data) {
        $scope.last = data;
    });
    $http.get(API_SERVER_ENDPOINT + '/api/v1/episode/lastWeek').success(function (data) {
        $scope.lastWeek = data;
    });
    $http.get(API_SERVER_ENDPOINT + '/api/v1/text/page/lead').success(function (data) {
        $scope.lead = data;
    });

});
