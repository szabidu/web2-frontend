'use strict';


var angularModule = require("episode/Episode.js");
require("episode/listenButton.html"),
angularModule.directive('listenButton', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            link: '@'
        },
        templateUrl: 'episode/listenButton.html',
        controller: function($scope) {
            $scope.mp3Link = $scope.link.replace('.m3u','.mp3');
            $scope.downloadLink = $scope.mp3Link.replace("/mp3/","/download/");
        }
    }

});
