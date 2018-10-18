'use strict';

var angular = require("angular")
require("mix/mix.html");
require("mix/mixes.html");

var angularModule = angular.module("mix",[]);

angularModule.factory('enumMixType', function () {
    return ['Zenés', 'Beszélgetős'];
});

angularModule.config(function ($stateProvider) {
    $stateProvider.state('mixlist', {
        url: '/mixes/:category',
        templateUrl: 'mix/mixes.html',
        controller: 'MixListCtrl'
    });
    $stateProvider.state('mix', {
        url: '/mix/:id',
        templateUrl: 'mix/mix.html',
        controller: 'MixCtrl'
    });
});


angularModule.controller('MixListCtrl', function ($http, $stateParams, API_SERVER_ENDPOINT, $scope, enumMixType) {
        $scope.localeSensitiveComparator = function(v1, v2) {
            if (v1.type !== 'string' || v2.type !== 'string') {
            return (v1.index < v2.index) ? -1 : 1;
            }
            return v1.value.localeCompare(v2.value);
        };

        $scope.tab = $stateParams.category;
        var category = $stateParams.category.toUpperCase();

        $http.get(API_SERVER_ENDPOINT + '/api/v1/mix?category=' + category).success(function (data) {
            $scope.propertyName = category === 'TALE' ? 'title' : 'date' ;
            $scope.reverse = category !== 'TALE';
            $scope.mixes = data;
        });
        $scope.mixType = enumMixType;
        $scope.sortBy = function(propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
          };
    }
);

angularModule.controller('MixCtrl', function ($http, $stateParams, API_SERVER_ENDPOINT, $scope, enumMixType) {
        $scope.tab = $stateParams.category;
        $http.get(API_SERVER_ENDPOINT + '/api/v1/mix/' + $stateParams.id).success(function (data) {
            $scope.mix = data;
        });
        $scope.mixType = enumMixType;

    }
);

module.exports = angularModule





