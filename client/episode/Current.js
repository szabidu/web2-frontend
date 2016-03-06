 var angularModule = require("episode/Episode.js");
require("episode/currentShow.html");
require("episode/currentList.html");


angularModule.factory("currentEpisodes", function ($http, API_SERVER_ENDPOINT) {
    var Rx = require('rx');

    var episodes = Rx.Observable.timer(
        0,
        5 * 60 * 1000)
        .flatMap(function (x, i) {
            var nowDate = new Date();
            var start = Math.round((nowDate.getTime() - 60 * 60 * 3 * 1000) / 60000) * 60000;
            var now = nowDate.getTime();
            var p = $http.get(API_SERVER_ENDPOINT + '/api/v1/episode?start=' + start + '&end=' + (start + 8 * 60 * 60 * 1000), {cache: true});
            var observable = Rx.Observable.fromPromise(p);
            return observable;
        }).map(function (x) {
            return x.data;
        });


    var current = episodes.map(function (x) {
        for (var i = 0; i < x.length; i++) {
            var now = new Date().getTime();
            var episode = x[i];
            if (episode.plannedFrom <= now && episode.plannedTo > now) {
                return episode;
            }
        }
    });

    var result = {
        episodes: function () {
            return episodes;
        },
        current: function () {
            return current;
        }
    };
    return result;

});

angularModule.component('currentList', {
    templateUrl: 'episode/currentList.html',
    controller: function ($http, currentEpisodes, $scope) {
        var ctrl = this;
        ctrl.now = new Date();
        var subscription = currentEpisodes.episodes().subscribe(
            function (x) {
                $scope.$apply(function () {
                    ctrl.episodes = x;
                })

            });

        var subscription = currentEpisodes.current().subscribe(
            function (x) {
                $scope.$apply(function () {
                    ctrl.current = x;
                })

            });


    }
});
angularModule.component('currentShow', {
    templateUrl: 'episode/currentShow.html',
    controller: function ($http, currentEpisodes, $scope) {
        var ctrl = this;
        var subscription = currentEpisodes.current().subscribe(
            function (x) {
                $scope.$apply(function () {
                    ctrl.current = x;
                })

            });
    }
});
