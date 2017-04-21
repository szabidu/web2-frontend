'use strict';

var angularModule = require("content/Content");
require("content/news.html");

angularModule.config(function ($stateProvider) {
    $stateProvider.state('news', {
        url: '/news/:id',
        templateUrl: 'content/news.html',
        controller: 'NewsCtrl'
    });
});

angularModule
    .controller('NewsCtrl', ['$scope', '$stateParams', 'API_SERVER_ENDPOINT', '$http', 'Meta', 'validateUrl', function ($scope, $stateParams, $server, $http, Meta) {
        $http.get($server + '/api/v1/text/news/' + $stateParams.id, {cache: true}).success(function (data) {
            $scope.news = data;

            if ($scope.news.title) {
                Meta.setTitle($scope.news.title);
            }
            if ($scope.news.formatted) {
                Meta.setDescription($scope.news.formatted.replace(/<(?:.|\n)*?>/gm, '').substring(0, 400));
            }
        });

    }]);
