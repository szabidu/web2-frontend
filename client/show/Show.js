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
const dateFns = require('date-fns');


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

    $stateProvider.state('show.archive', {
        url: '/archive/:year/:quarter',
        templateUrl: 'show/show-main.html',
        controller: 'ShowArchiveCtrl'
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

angularModule.controller('ShowIntroCtrl', function () {});


angularModule.controller('ShowContactCtrl', function ($state, growl, $scope, $stateParams, API_SERVER_ENDPOINT, $http) {
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
.controller('ShowCtrl', function ($scope, $state, $stateParams, Meta) {
    Meta.setTitle($scope.show.name);
    if ($scope.show.definition) {
        Meta.setDescription($scope.show.definition);
    } else if ($scope.show.description) {
        Meta.setDescription($scope.show.description.substring(0, 400));
    }
    var today = new Date();

    $state.go('show.archive', {
        id: $stateParams.id,
        year: dateFns.getYear(today),
        quarter: dateFns.getQuarter(today)
    });
}
);


angularModule
    .controller('ShowArchiveCtrl', function ($scope, $state, $stateParams, API_SERVER_ENDPOINT, $http, Meta) {
        $scope.server = API_SERVER_ENDPOINT;
        Meta.setTitle($scope.show.name);
        if ($scope.show.definition) {
            Meta.setDescription($scope.show.definition);
        } else if ($scope.show.description) {
            Meta.setDescription($scope.show.description.substring(0, 400));
        }

        var year = parseInt($stateParams.year);
        var quarter = parseInt($stateParams.quarter);
        $scope.prevDisabled = false;
        $scope.nextDisabled = false;

        var firstDayOfQuarter = dateFns.setQuarter(new Date(year, 0, 1), quarter);
        if(dateFns.isAfter($scope.show.firstShowDate, firstDayOfQuarter)) {
            firstDayOfQuarter = $scope.show.firstShowDate;
            $scope.prevDisabled = true;
        }

        var lastDayOfQuarter = dateFns.endOfQuarter(firstDayOfQuarter);

        if(dateFns.isAfter(lastDayOfQuarter, $scope.show.lastShowDate)) {
            lastDayOfQuarter = $scope.show.lastShowDate;
            firstDayOfQuarter = dateFns.startOfQuarter(lastDayOfQuarter);
            $scope.nextDisabled = true;
        }

        $state.go('show.archive', {
            id: $stateParams.id,
            year: dateFns.getYear(firstDayOfQuarter),
            quarter: dateFns.getQuarter(firstDayOfQuarter)
        });


        $http.get(`${API_SERVER_ENDPOINT}/api/v1/show/${$scope.show.id}/episodes?start=${dateFns.getTime(firstDayOfQuarter)}&end=${dateFns.getTime(lastDayOfQuarter)}`)
            .success(function (data) {
                $scope.show.episodes = data;
            });

        $scope.prev = function () {
            var newYear = quarter === 1 ? year - 1 : year;
            var newQ = quarter === 1 ? 4 : quarter - 1;
            $state.go('show.archive', {id: $stateParams.id , year: newYear , quarter: newQ})

        };
        $scope.next = function () {
            var newYear = quarter === 4 ? year + 1 : year;
            var newQ = quarter === 4 ? 1 :  quarter + 1;
            $state.go('show.archive', {id: $stateParams.id , year: newYear , quarter: newQ})
        };
    });

module.exports = angularModule;

require("show/AllShow");
require("show/ShowLabel");
