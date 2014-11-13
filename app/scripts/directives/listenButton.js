'use strict';

angular.module('tilosApp').directive('listenButton', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            link: '@'
        },
        templateUrl: 'partials/listenButton.html',
        controller: function($scope) {
            $scope.mp3Link = $scope.link.replace('.m3u','.mp3');
        }
    }

});
