'use strict';

var angular = require("angular");
var angularModule = angular.module("episode", []);
require("episode/episode.html");

angularModule.controller('EpisodesCtrl', function ($scope, $stateParams, API_SERVER_ENDPOINT, $http) {
        $scope.now = new Date();

        var nowDate = new Date();
        var start = Math.round((nowDate.getTime() - 60 * 60 * 3 * 1000) / 60000) * 60000;
        var now = nowDate.getTime();
        $http.get(API_SERVER_ENDPOINT + '/api/v1/episode?start=' + start + '&end=' + (start + 8 * 60 * 60 * 1000), {cache: true}).success(function (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].plannedFrom <= now && data[i].plannedTo > now) {
                    $scope.current = data[i];
                }
            }
            $http.get(API_SERVER_ENDPOINT + '/api/v1/show/' + $scope.current.show.id, {cache: true}).success(function (sd) {
                $scope.current.show = sd;
                $scope.episodes = data;
            });
        });

    }
);


angularModule.config(function ($stateProvider) {
    $stateProvider.state('episode-id', {
        url: '/episode/:id',
        templateUrl: 'episode/episode.html',
        controller: 'EpisodeCtrl',
        resolve: {
            data: function ($route, $http, API_SERVER_ENDPOINT) {
                return $http.get(API_SERVER_ENDPOINT + '/api/v1/episode/' + $route.current.params.id, {cache: true});
            },
            show: function ($route, $http, API_SERVER_ENDPOINT) {
                return $http.get(API_SERVER_ENDPOINT + '/api/v1/show/' + $route.current.params.show);
            }
        }
    }).state('episode-date', {
        url: '/episode/:show/:year/:month/:day',
        templateUrl: 'episode/episode.html',
        controller: 'EpisodeCtrl',
        resolve: {
            data: function ($stateParams, $http, API_SERVER_ENDPOINT) {
                return $http.get(API_SERVER_ENDPOINT + '/api/v1/episode/' + $stateParams.show + '/' + $stateParams.year + '/' + $stateParams.month + '/' + $stateParams.day);
            },
            show: function ($stateParams, $http, API_SERVER_ENDPOINT) {
                return $http.get(API_SERVER_ENDPOINT + '/api/v1/show/' + $stateParams.show);
            }
        }
    });
});


angularModule.controller('EpisodeCtrl', function ($scope, data, show, $sce, Meta, $location, dateUtil, $http, API_SERVER_ENDPOINT) {
        $scope.absUrl = $location.absUrl();
        $scope.episode = data.data;
        $scope.show = show.data;
        if (data.data.text && data.data.text.formatted) {
            $scope.episode.text.formatted = $sce.trustAsHtml(data.data.text.formatted);
        }
        $scope.currentShow = show.data;
        if ($scope.episode.text && $scope.episode.text.title) {
            Meta.setTitle($scope.episode.text.title);
        } else {
            Meta.setTitle($scope.currentShow.name + ' adásnapló');
        }
        if ($scope.episode.text && $scope.episode.text.content) {
            Meta.setDescription($scope.episode.text.content.substring(0, 400));
        }
        $scope.bookmark = {};
        $scope.bookmark.from = dateUtil.toHourMin($scope.episode.plannedFrom);
        $scope.bookmark.to = dateUtil.toHourMin($scope.episode.plannedTo);
        $scope.save = function () {
            var bts = {};
            bts.title = $scope.bookmark.title;
            bts.from = dateUtil.setDate($scope.episode.plannedFrom, $scope.bookmark.from);
            bts.to = dateUtil.setDate($scope.episode.plannedTo, $scope.bookmark.to);
            return $http.post(API_SERVER_ENDPOINT + '/api/v1/episode/' + $scope.episode.id + '/bookmark', bts).success(function () {
                alert('Bookmark has been saved');
                $scope.bookmark = {};
                $scope.bookmark.from = dateUtil.toHourMin($scope.episode.plannedFrom);
                $scope.bookmark.to = dateUtil.toHourMin($scope.episode.plannedTo);
                return $http.get(API_SERVER_ENDPOINT + '/api/v1/episode/' + $scope.episode.id, bts).success(function (data) {
                    $scope.episode = data;
                });
            });
        }

    }
);

module.exports = angularModule;
require("episode/Program")
