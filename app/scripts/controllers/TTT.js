'use strict';

angular.module('tilosApp').config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('/ttt', '/ttt/elfogad');
    $urlRouterProvider.when('/ttt/', '/ttt/elfogad');

    $stateProvider.state('ttt', {
        abstract: true,
        url: '/ttt',
        templateUrl: 'partials/ttt.html'
    });

    $stateProvider.state('ttt.sub', {
        url: '/:id',
        templateUrl: 'partials/ttt-sub.html',
        controller: 'TTTCtrl'
    });

    $stateProvider.state('ttt.default', {
        url: '',
        templateUrl: 'partials/ttt-sub.html',
        controller: 'TTTCtrl'
    });
})

angular.module('tilosApp').controller('TTTCtrl', function ($scope, API_SERVER_ENDPOINT, $stateParams, $http) {
    var id = $stateParams.id
    if (id == undefined || id === '') {
        id = 'havi';
    }
    $http.get(API_SERVER_ENDPOINT + '/api/v1/text/page/ttt-' + id).success(function (data) {
        $scope.page = data;
    });
});
