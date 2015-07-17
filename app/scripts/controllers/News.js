'use strict';

angular.module('tilosApp').config(function ($stateProvider) {
    $stateProvider.state('news', {
        url: '/news/:id',
        templateUrl: 'partials/news.html',
        controller: 'NewsCtrl'
    });
});
angular.module('tilosApp')
    .controller('NewsCtrl', ['$scope', '$stateParams', 'API_SERVER_ENDPOINT', '$http', 'validateUrl', function ($scope, $stateParams, $server, $http) {
        $http.get($server + '/api/v1/text/news/' + $stateParams.id, {cache: true}).success(function (data) {
            $scope.news = data;
        });

    }]);
