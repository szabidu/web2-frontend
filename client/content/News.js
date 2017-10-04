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
    .controller('NewsCtrl', ['$scope', '$state', '$stateParams', 'API_SERVER_ENDPOINT', '$http', 'validateUrl', function ($scope, $state, $stateParams, $server, $http) {
        $http.get($server + '/api/v1/text/news/' + $stateParams.id, {cache: true}).success(function (data) {
            $scope.news = data;
        }).error(function (err) {
            $state.go('notfound');
        });

    }]);
