'use strict';

var angular = require("angular");
var angularModule = angular.module("episode", []);
require("episode/episode.html");


angularModule.factory('dateUtil', function () {
    return {
        toHourMin: function (epoch) {
            var d = new Date();
            d.setTime(epoch);
            var result = "" + (d.getHours() < 10 ? "0" : "" ) + d.getHours() + ':' + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes() + ":" + (d.getSeconds() < 10 ? "0" : "") + d.getSeconds();
            return result;
        },
        setDate: function (dateEpoch, dateStr) {
            var date = new Date();
            date.setTime(dateEpoch);
            var parts = dateStr.split(':');
            date.setHours(parseInt(parts[0], 10));
            date.setMinutes(parseInt(parts[1], 10));
            if (parts.length > 2) {
                date.setSeconds(parseInt(parts[2], 10));
            }
            return date.getTime();
        }
    };
});


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
            data: function ($state, $stateParams, $http, API_SERVER_ENDPOINT, $q) {
                return $http.get(API_SERVER_ENDPOINT + '/api/v1/episode/' + $stateParams.show + '/' + $stateParams.year + '/' + $stateParams.month + '/' + $stateParams.day)
                .then($q.resolve)
                .catch(function (err) {
                    $state.go('notfound');
                });

            },
            show: function ($state, $stateParams, $http, API_SERVER_ENDPOINT, $q) {
                return $http.get(API_SERVER_ENDPOINT + '/api/v1/show/' + $stateParams.show)
                    .then($q.resolve)
                    .catch(function (err) {
                        $state.go('notfound');
                    });

            }
        }
    });
});


angularModule.controller('EpisodeCtrl', function ($scope, data, show, $sce, Meta, $location, dateUtil, $http, API_SERVER_ENDPOINT) {
        var d = document, s = d.createElement('script');
        s.src = 'https://tilos.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);

        window.disqus_config = function () {
            this.page.url = 'https://tilos.hu' + data.data.url;
            this.page.identifier = data.data.url;
        };

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
require("episode/Program");
require("episode/Current");
require("episode/Podcast");
require("episode/ListenButton");

