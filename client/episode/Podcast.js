var angularModule = require("episode/Episode.js");
require("episode/podcast.html");


angularModule.config(function ($stateProvider) {
    $stateProvider.state('podcast', {
        url: '/podcast',
        templateUrl: 'episode/podcast.html',
        controller: 'PodcastCtrl'
    });
});

angularModule.controller("PodcastCtrl", function ($scope, $http, API_SERVER_ENDPOINT) {
    $scope.what = 'all';
    $scope.annotated = 'yes';
    $scope.type = 'all';
    $scope.format = 'mp3';
    var calculateUrl = function () {
        $scope.url = "http://tilos.hu/feed/";
        if ($scope.what == 'show') {
            $scope.url += "show/" + $scope.show;
        } else {
            if ($scope.annotated == 'yes') {
                $scope.url += 'podcast';
            } else {
                $scope.url += 'weekly';
            }
            if ($scope.type != 'all') {
                $scope.url += '/' + $scope.type;
            }
            if ($scope.format == 'mp4') {
                $scope.url += '?format=mp4';
            }
        }
        $scope.qrUrl = "https://chart.googleapis.com/chart?cht=qr&chl=" + $scope.url + "&chs=360x360&choe=UTF-8&chld=L|2%27";
    };
    $scope.$watch("what", function () {
        calculateUrl();
    });
    $scope.$watch("show", function () {
        calculateUrl();
    });
    $scope.$watch("format", function () {
        calculateUrl();
    });
    $scope.$watch("type", function () {
        calculateUrl();
    });
    $scope.$watch("annotated", function () {
        calculateUrl();
    });

    $http.get(API_SERVER_ENDPOINT + '/api/v1/show', {'cache': true}).then(function (data) {
        $scope.shows = data;//
    });

});
