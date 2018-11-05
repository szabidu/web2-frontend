'use strict';

var angularModule = require("show/Show");

require("show/shows.html");

angularModule.config(function ($stateProvider) {
    $stateProvider.state('shows', {
        url: '/shows',
        templateUrl: 'show/shows.html',
        controller: 'AllshowCtrl'
    });
});

angularModule.controller('AllshowCtrl', function ($scope, $stateParams, API_SERVER_ENDPOINT, $http) {
    $scope.statusSet = 'active';

    $http.get(API_SERVER_ENDPOINT + '/api/v1/show?status=all', {cache: true}).success(function (data) {
        var res = {
            talk: [],
            sound: []
        };
        for (var i = 0; i < data.length; i++) {
            var show = data[i];
            if (show.type == 'SPEECH') {
                res.talk.push(data[i]);
            } else {
                res.sound.push(data[i]);
            }
        }
        $scope.shows = res;
    });
});
