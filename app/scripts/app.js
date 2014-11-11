'use strict';
var tilos = angular.module('tilosApp',
  ['ngRoute',
    'ngSanitize',
    'configuration',
    'ui.bootstrap',
    'textAngular',
    'ngResource',
    'ui.router',
    'LocalStorageModule',
    'vcRecaptcha',
    'angulartics',
    'angulartics.google.analytics']);

tilos.config(function ($locationProvider) {
    $locationProvider.html5Mode(true);
});

tilos.weekStart = function (date) {
    var first = date.getDate() - date.retrieveEpisodesForDay() + 1;
    date.setHours(0);
    date.setSeconds(0);
    date.setMinutes(0);
    return new Date(date.setDate(first));
};


tilos.factory('Meta', function ($rootScope) {
    return {
        setTitle: function (newTitle) {
            $rootScope.pageTitle = newTitle;
        },
        setDescription: function (newDesc) {
            var metaDesc = angular.element(document.querySelector('#desc'));
            metaDesc.attr('content', newDesc);
        }

    };
});

tilos.run(function(){
  Date.prototype.setToNoon = function () {
    this.setHours(12, 0, 0, 0);
  };

  Date.prototype.setToDayStart = function () {
    this.setHours(0, 0, 0, 0);
  };


  Date.prototype.setToDayEnd = function () {
    this.setHours(23, 59, 60, 0);
  };

  Date.prototype.isLeapYear = function (year) {
    return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));

  };


  Date.prototype.daysInFebruary = function (year) {
    if (this.isLeapYear(year)) {
      // Leap year
      return 29;
    } else {
      // Not a leap year
      return 28;
    }
  };

  Date.prototype.getTimestamp = function () {
    return this.getTime() / 1000;
  };

  Date.prototype.dayIndex = function () {
    var pastYears = 0;
    for (var i = 1990; i < this.getFullYear(); i++) {
      pastYears += 365;
      if (this.isLeapYear(i)) {
        pastYears++;
      }
    }
    var feb = this.daysInFebruary(this.getFullYear());
    var aggregateMonths = [0, // January
      31, // February
      31 + feb, // March
      31 + feb + 31, // April
      31 + feb + 31 + 30, // May
      31 + feb + 31 + 30 + 31, // June
      31 + feb + 31 + 30 + 31 + 30, // July
      31 + feb + 31 + 30 + 31 + 30 + 31, // August
      31 + feb + 31 + 30 + 31 + 30 + 31 + 31, // September
      31 + feb + 31 + 30 + 31 + 30 + 31 + 31 + 30, // October
      31 + feb + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31, // November
      31 + feb + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30, // December
    ];
    return pastYears + aggregateMonths[this.getMonth() - 1] + this.getDate();
  };
});

tilos.run(function ($rootScope, Meta, localStorageService, $http, API_SERVER_ENDPOINT) {
    $rootScope.$on('$locationChangeStart', function () {
        Meta.setTitle('');
        Meta.setDescription('');

    });

    if (localStorageService.get('jwt')) {
        $http.get(API_SERVER_ENDPOINT + '/api/v1/user/me').success(function (data) {
            $rootScope.user = data;
        });
    }

});

tilos.config(function ($routeProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.interceptors.push(function ($q, localStorageService) {
        return {
            'request': function (config) {
                var jwt = localStorageService.get('jwt');
                if (jwt) {
                    config.headers.Bearer = jwt;
                }
                return config;
            }
        };
    });

    $urlRouterProvider.otherwise(function ($injector, $location) {
        var $http = $injector.get('$http');
        var API_SERVER_ENDPOINT = $injector.get('API_SERVER_ENDPOINT');
        var path = $location.path();
        $http.get(API_SERVER_ENDPOINT + '/api/v0/text' + path).success(function () {
            var $state = $injector.get('$state');
            $state.go('page', {id: path.substr(1)});
        }).error(function () {
            $http.get(API_SERVER_ENDPOINT + '/api/v0/show' + path).success(function () {
                $injector.get('$state').go('show.main', {id: path.substr(1)});
            }).error(function () {
                $injector.get('$state').go('notfound');
            });
        });
        return false;

    });

//    .when('/news/:id', {
//        templateUrl: 'partials/news.html',
//        controller: 'NewsCtrl'
//    });

});

var server = window.location.protocol + '//' + window.location.hostname;
if (window.location.port && window.location.port !== '9000') {
    server = server + ':' + window.location.port;
}

angular.module('configuration', []).constant('API_SERVER_ENDPOINT', server);

tilos.factory('validateUrl', function ($sce) {
    return {
        getValidUrl: function (url) {
            return $sce.trustAsResourceUrl(url);
        }
    };
});
