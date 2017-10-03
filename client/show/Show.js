'use strict';
var captcha = require("angular-recaptcha");
var angular = require("angular");
var angularModule = angular.module("show",['vcRecaptcha']);
require("show/show.html");
require("show/show-main.html");
require("show/show-intro.html");
require("show/show-mixes.html");
require("show/show-bookmarks.html");
require("show/show-contact.html");
require("show/sidebar_show.html");
require("show/show.scss");


angularModule.config(function ($stateProvider) {

    $stateProvider.state('show', {
        abstract: true,
        url: '/show/:id',
        templateUrl: 'show/show.html',
        controller: function (show, $scope) {
            $scope.show = show.data;
        },
        resolve: {
            show: function ($http, API_SERVER_ENDPOINT, $stateParams, $state) {
                var addIcon = function (data) {
                    if (data.type === 'facebook') {
                        data.icon = 'icon-facebook2';
                    } else if (data.type == 'mixcloud') {
                        data.icon = 'icon-cloud';
                    } else {
                        data.icon = 'icon-link';
                    }
                };
                return $http({
                    method: 'GET',
                    url: API_SERVER_ENDPOINT + '/api/v1/show/' + $stateParams.id,
                    cache: true
                }).then(function (data) {
                    data.data.urls.forEach(function (url) {
                        addIcon(url);
                    });
                    return data;
                }).catch(function(error) {
                    $state.go('notfound');
                });
            }
        }
    });

    $stateProvider.state('show.main', {
        url: '',
        templateUrl: 'show/show-main.html',
        controller: 'ShowCtrl'
    });

    $stateProvider.state('show.intro', {
        url: '/intro',
        templateUrl: 'show/show-intro.html',
        controller: 'ShowIntroCtrl'
    });

    $stateProvider.state('show.mixes', {
        url: '/mixes',
        templateUrl: 'show/show-mixes.html',
        controller: 'ShowMixesCtrl'
    });

    $stateProvider.state('show.bookmarks', {
        url: '/bookmarks',
        templateUrl: 'show/show-bookmarks.html',
        controller: 'ShowBookmarksCtrl'
    });

    $stateProvider.state('showContact', {
        url: '/show/:id/contact',
        templateUrl: 'show/show-contact.html',
        controller: 'ShowContactCtrl'
    });
});

angularModule.controller('ShowIntroCtrl', function () {
});


angularModule.controller('ShowContactCtrl', function ($state, vcRecaptchaService, growl, $scope, $stateParams, API_SERVER_ENDPOINT, $http) {
    $scope.message = {};
    $scope.save = function () {
        $scope.message.captcha = $scope.captcha;
        $http.post(API_SERVER_ENDPOINT + '/api/v1/show/' + $stateParams.id + '/contact', $scope.message).success(function (data) {
            growl.info("Message has been successfully sent");
            $state.go('show.intro', {id: $stateParams.id});
        });
    }
});

angularModule
    .controller('ShowMixesCtrl', function ($scope, $stateParams, API_SERVER_ENDPOINT, $http) {

        $http.get(API_SERVER_ENDPOINT + '/api/v1/mix?show=' + $stateParams.id, {cache: true}).success(function (data) {
            $scope.mixes = data;
        });
    });


angularModule
    .controller('ShowCtrl', function ($scope, $stateParams, API_SERVER_ENDPOINT, $http, validateUrl, $rootScope, $location, Meta) {
        $scope.server = API_SERVER_ENDPOINT;
        Meta.setTitle($scope.show.name);
        if ($scope.show.definition) {
            Meta.setDescription($scope.show.definition);
        } else if ($scope.show.description) {
            Meta.setDescription($scope.show.description.substring(0, 400));
        }

        $scope.currentShowPage = 0;

        var to = new Date().getTime();
        var from = to - ( 6 * 30 * 24 * 3600 * 1000);
        $http.get(API_SERVER_ENDPOINT + '/api/v1/show/' + $scope.show.id + '/episodes?start=' + from + '&end=' + to).success(function (data) {
            $scope.show.episodes = data;
        });

        $scope.prev = function () {
            $scope.currentShowPage--;
            var to = $scope.show.episodes[$scope.show.episodes.length - 1].plannedFrom - 60000;
            var from = to - 60 * 24 * 60 * 60 * 1000;
            $http.get(API_SERVER_ENDPOINT + '/api/v1/show/' + $scope.show.id + '/episodes?start=' + from + '&end=' + to).success(function (data) {
                $scope.show.episodes = data;
            });

        };
        $scope.next = function () {
            $scope.currentShowPage++;
            var from = $scope.show.episodes[0].plannedTo + 60000;
            var to = from + 60 * 24 * 60 * 60 * 1000;
            $http.get(API_SERVER_ENDPOINT + '/api/v1/show/' + $scope.show.id + '/episodes?start=' + from + '&end=' + to).success(function (data) {
                $scope.show.episodes = data;
            });
        };


    }
);
module.exports = angularModule;

require("show/AllShow");
require("show/ShowLabel");
