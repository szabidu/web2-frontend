'use strict';

angular.module('tilosApp').config(function ($stateProvider) {
    $stateProvider.state('show', {
        abstract: true,
        url: '/show/:id',
        templateUrl: 'partials/show.html',
        controller: function ($scope, $http, API_SERVER_ENDPOINT, $stateParams) {
            $http.get(API_SERVER_ENDPOINT + '/api/v1/show/' + $stateParams.id, {cache: true}).success(function (data) {
                $scope.show = data;
            });
        }
    });

    $stateProvider.state('show.main', {
        url: '',
        templateUrl: 'partials/show-main.html',
        controller: 'ShowCtrl'
    });

    $stateProvider.state('show.intro', {
        url: '/intro',
        templateUrl: 'partials/show-intro.html',
        controller: 'ShowIntroCtrl'
    });

    $stateProvider.state('show.mixes', {
        url: '/mixes',
        templateUrl: 'partials/show-mixes.html',
        controller: 'ShowMixesCtrl'
    });

    $stateProvider.state('show.bookmarks', {
        url: '/bookmarks',
        templateUrl: 'partials/show-bookmarks.html',
        controller: 'ShowBookmarksCtrl'
    });
})
;

angular.module('tilosApp').config(function ($routeProvider) {
    $routeProvider.when('/show/:id', {
        templateUrl: 'partials/show.html',
        controller: 'ShowCtrl',
        tab: 'archive'
    }).when('/show/:id/intro', {
        templateUrl: 'partials/show-intro.html',
        controller: 'ShowIntroCtrl',
        tab: 'intro'
    }).when('/show/:id/mixes', {
        templateUrl: 'partials/show-mixes.html',
        controller: 'ShowMixesCtrl',
        tab: 'mixes'
    }).when('/show/:id/bookmarks', {
        templateUrl: 'partials/show-bookmarks.html',
        controller: 'ShowBookmarksCtrl',
        tab: 'bookmarks'
    });
});

angular.module('tilosApp').controller('ShowIntroCtrl', function () {
});

angular.module('tilosApp')
    .controller('ShowMixesCtrl', function ($scope, $stateParams, API_SERVER_ENDPOINT, $http) {

        $http.get(API_SERVER_ENDPOINT + '/api/v1/mix?show=' + $stateParams.id, {cache: true}).success(function (data) {
            $scope.mixes = data;
        });
    });


angular.module('tilosApp')
    .controller('ShowCtrl', function (Player, $scope, $stateParams, API_SERVER_ENDPOINT, $http, validateUrl, $rootScope, $location, Meta) {
        $http.get(API_SERVER_ENDPOINT + '/api/v1/show/' + $stateParams.id, {cache: true}).success(function (data) {
            $scope.show = data;
            $scope.server = API_SERVER_ENDPOINT;
            Meta.setTitle(data.name);
            if (data.definition) {
                Meta.setDescription(data.definition);
            } else if ($scope.show.description) {
                Meta.setDescription($scope.show.description.substring(0, 400));
            }

            $scope.currentShowPage = 0;

            var to = new Date().getTime();
            var from = to - ( 6 * 30 * 24 * 3600 * 1000);
            $http.get(API_SERVER_ENDPOINT + '/api/v1/show/' + data.id + '/episodes?start=' + from + '&end=' + to).success(function (data) {
                $scope.show.episodes = data;
            });

            $scope.play = Player.play;

            $scope.prev = function () {
                $scope.currentShowPage--;
                var to = $scope.show.episodes[$scope.show.episodes.length - 1].plannedFrom - 60000;
                var from = to - 60 * 24 * 60 * 60 * 1000;
                $http.get(API_SERVER_ENDPOINT + '/api/v1/show/' + data.id + '/episodes?start=' + from + '&end=' + to).success(function (data) {
                    $scope.show.episodes = data;
                });

            };
            $scope.next = function () {
                $scope.currentShowPage++;
                var from = $scope.show.episodes[0].plannedTo + 60000;
                var to = from + 60 * 24 * 60 * 60 * 1000;
                $http.get(API_SERVER_ENDPOINT + '/api/v1/show/' + data.id + '/episodes?start=' + from + '&end=' + to).success(function (data) {
                    $scope.show.episodes = data;
                });
            };

        });

    }
);
