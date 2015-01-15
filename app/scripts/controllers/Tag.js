'use strict';


angular.module('tilosApp').config(function ($stateProvider) {
    $stateProvider.state('tag', {
        url: '/tag/:id',
        templateUrl: 'partials/tag.html',
        controller: 'TagCtrl',
        resolve: {
            data: function ($route, Tags, $stateParams) {
                return Tags.get({id: $stateParams.id});
            }
        }
    }).state('tags', {
        url: '/tags',
        templateUrl: 'partials/tags.html',
        controller: 'TagListCtrl'
    });
});

angular.module('tilosApp').controller('TagCtrl', function ($scope, Tags, data, $stateParams) {
    $scope.list = data;
    $scope.tag = $stateParams.id;
});

angular.module('tilosApp').controller('TagListCtrl', function ($scope, $http, API_SERVER_ENDPOINT) {
    $http.get(API_SERVER_ENDPOINT + '/api/v1/tag?limit=100', {cache: true}).success(function (data) {
        $scope.tags = data;
    });

});

angular.module('tilosApp').factory('Tags', ['API_SERVER_ENDPOINT', '$resource', function (server, $resource) {
    return $resource(server + '/api/v1/tag/:id', null, {});
}]);
