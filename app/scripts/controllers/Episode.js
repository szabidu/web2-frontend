'use strict';


angular.module('tilosApp').config(function($stateProvider)
{
    $stateProvider.state('episode-id', {
        url: '/episode/:id',
        templateUrl: 'partials/episode.html',
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
        templateUrl: 'partials/episode.html',
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


/*global angular*/
angular.module('tilosApp').controller('EpisodeCtrl', function ($scope, data, show, $sce, Meta, $location) {
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
        if ($scope.episode.text.content) {
            Meta.setDescription($scope.episode.text.content.substring(0,400));
        }
    }
);
