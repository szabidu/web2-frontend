'use strict';
var angular = require("angular");
var uiRouter = require("angular-ui-router");
var satellizer = require("satellizer")
var author = require("author/Author");
var mix = require("mix/Mix");
var main = require("main/Main");
var search = require("search/Search");
var episode = require("episode/Episode");
var show = require("show/Show");
var content = require("content/Content");
var ttt = require("ttt/TTT");
var tag = require("tag/Tag");
var comment = require("comment/Comment");
var auth = require("auth/Auth");
require('./frameworkless');

require('script!angular-growl-v2');
require('angular-easyfb')

var tilos = angular.module('tilosApp',
    [
        require("angular-sanitize"),
        'configuration',
        require("angular-ui-bootstrap"),
        uiRouter,
        'ezfb',
        satellizer,
        require('angulartics'),
        'angular-growl',
        require('angulartics-google-analytics'),
        main.name,
        author.name,
        mix.name,
        search.name,
        episode.name,
        show.name,
        content.name,
        ttt.name,
        tag.name,
        comment.name,
        auth.name,
    ]);

tilos.config(['growlProvider', function (growlProvider) {
    growlProvider.globalTimeToLive(3000);
    growlProvider.globalPosition('top-left');
}]);

tilos.filter('truncate', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';
        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }
        return value + (tail || ' …');
    };
});


tilos.filter('statusFilter', () => {
    return function (value, type) {
        console.log(type);
        if(!value) return;
        console.log(value);
        return value.filter(show =>
            type === 'archive' ? show.status !== 'ACTIVE' : show.status === 'ACTIVE'
        );
    };
});


tilos.config(function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push(function ($q, growl, $injector) {
        return {
            'responseError': function (rejection) {
                if (rejection.status == 500 && rejection.data.exception == "hu.tilos.radio.backend.jwt.JwtAuthenticationException") {
                    $injector.get("$auth").logout();
                }
                if (rejection.status != 404 && rejection.data.message) {
                    growl.error(rejection.data.message);
                }
                if (rejection.status == 50)
                    return $q.reject(rejection);

                return $q.reject(rejection);
            }
        };
    })
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
            $rootScope.pageDescription = newDesc;
        }

    };
});

tilos.run(function () {
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

tilos.run(function ($rootScope) {
    $rootScope.$on('$stateChangeSuccess', function () {
        window.scrollTo(0, 0);
    });
});
tilos.run(['$rootScope', 'Meta', '$http', 'API_SERVER_ENDPOINT', '$auth', function ($rootScope, Meta, $http, API_SERVER_ENDPOINT, satellizer) {
    $rootScope.$on('$locationChangeStart', function () {
        Meta.setTitle('');
        Meta.setDescription('');

    });

    if (satellizer.getToken()) {
        $http.get(API_SERVER_ENDPOINT + '/api/v1/user/me').success(function (data) {
            $rootScope.user = data;
        });
    }

    $http.get(API_SERVER_ENDPOINT + '/api/v1/status/radio').success(function (data) {
        $rootScope.extraStreams = data;
    });

    $rootScope.now = new Date();

}]);

tilos.config(function (ezfbProvider) {
    ezfbProvider.setInitParams({
        appId: '1390285161277354',
        version: 'v2.0'
    });
});


tilos.config(function ($authProvider) {
    $authProvider.facebook({
        clientId: '1390285161277354',
        url: '/api/int/oauth/facebook'
    });

});


tilos.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise(function ($injector, $location) {
        var $http = $injector.get('$http');
        var API_SERVER_ENDPOINT = $injector.get('API_SERVER_ENDPOINT');
        var path = $location.path();
        $http.get(API_SERVER_ENDPOINT + '/api/v1/text' + path).success(function () {
            var $state = $injector.get('$state');
            $state.go('page', {id: path.substr(1)});
        }).error(function () {
            $http.get(API_SERVER_ENDPOINT + '/api/v1/show' + path).success(function () {
                $injector.get('$state').go('show.main', {id: path.substr(1)});
            }).error(function () {
                $injector.get('$state').go('notfound');
            });
        });
        return false;

    });
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


// require("script!./services/DateFormatUtils.js");
// require("script!./config.js");
// require("script!./directives/activeLink.js");
// require("script!./directives/show-label.js");
//
