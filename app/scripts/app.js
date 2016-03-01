'use strict';
var angular = require("angular");
require("script!../bower_components/angular-route/angular-route.js");
require("script!../bower_components/angular-resource/angular-resource.js");
require("script!../bower_components/angular-sanitize/angular-sanitize.js");
require("script!../bower_components/textAngular/textAngular.js");
require("script!../bower_components/angular-ui-bootstrap-bower/ui-bootstrap.js");
require("script!../bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js");
require("script!../bower_components/angular-ui-router/release/angular-ui-router.js");
require("script!../bower_components/angular-local-storage/dist/angular-local-storage.js");
require("script!../bower_components/angular-recaptcha/release/angular-recaptcha.min.js");
require("script!../bower_components/angularitics/src/angulartics.js");
require("script!../bower_components/angularitics/src/angulartics-ga.js");
require("script!../bower_components/angular-easyfb/angular-easyfb.min.js");
require("script!../bower_components/satellizer/satellizer.js");
require("script!../bower_components/angular-growl-v2/build/angular-growl.js");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/index.html")
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/shows.html")
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/sidebar_right.html")
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/sidebar_left.html")



require("ngtemplate?relativeTo=/app/!raw!../../app/partials/mix.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/login.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/comment.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/sidebar_show.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/page.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/me.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/404.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/comment-reply.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/sidebar_left.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/reset.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/search.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/audiotest.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/program.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/show-contact.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/profile.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/episode.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/experimental.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/author.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/show-bookmarks.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/show-main.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/register.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/commentable.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/tags.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/tag.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/show.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/listenButton.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/images/samsara_banner.png");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/images/selection_banner.png");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/show-intro.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/ttt-business.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/news.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/ttt-sub.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/ttt.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/reminder.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/show-mixes.html");
require("ngtemplate?relativeTo=/app/!raw!../../app/partials/mixes.html");



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
    'ezfb',
    'satellizer',
    'angular-growl',
    'angulartics',
    'angulartics.google.analytics']);

tilos.config(['growlProvider', function (growlProvider) {
    growlProvider.globalTimeToLive(3000);
    growlProvider.globalPosition('top-left');
}]);


tilos.config(function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push(function($q, growl) {
        return {
            'responseError': function(rejection) {
                if (rejection.status != 404 && rejection.data.message) {
                    growl.error(rejection.data.message);
                }
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

tilos.run(['$rootScope', 'Meta', 'localStorageService', '$http', 'API_SERVER_ENDPOINT', '$auth', function ($rootScope, Meta, localStorageService, $http, API_SERVER_ENDPOINT, satellizer) {
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


tilos.config(function ($routeProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
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


require("script!./filters/RssDate.js");
require("script!./dateutil.js");
require("script!./enum.js");
require("script!./services/DateFormatUtils.js");
require("script!./services/FeedService.js");
require("script!./config.js");
require("script!./directives/scroll.js");
require("script!./directives/activeLink.js");
require("script!./directives/commentable.js");
require("script!./directives/listenButton.js");
require("script!./directives/compiledText.js");
require("script!./directives/show-label.js");
require("script!./controllers/Profile.js");
require("script!./controllers/Episode.js");
require("script!./controllers/Header.js");
require("script!./controllers/Mix.js");
require("script!./controllers/Static.js");
require("script!./controllers/Tag.js");
require("script!./controllers/Search.js");
require("script!./controllers/Render.js");
require("script!./controllers/Experimental.js");
require("script!./controllers/404.js");
require("script!./controllers/Program.js");
require("script!./controllers/AudioTest.js");
require("script!./controllers/TTT.js");
require("script!./controllers/Player.js");
require("script!./controllers/ChangePassword.js");
require("script!./controllers/Main.js");
require("script!./controllers/AllShow.js");
require("script!./controllers/Login.js");
require("script!./controllers/Page.js");
require("script!./controllers/Register.js");
require("script!./controllers/Author.js");
require("script!./controllers/Episodes.js");
require("script!./controllers/Index.js");
require("script!./controllers/User.js");
require("script!./controllers/Show.js");
require("script!./controllers/News.js");
