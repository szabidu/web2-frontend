var angularModule = require("episode/Episode.js");
require("episode/currentShow.html");
require("episode/currentList.html");


angularModule.factory("currentEpisodes", function ($http, API_SERVER_ENDPOINT, $q) {
    var episodes = null;
    var current = null;

    if (episodes == null) {
        var nowDate = new Date();
        var start = Math.round((nowDate.getTime() - 60 * 60 * 3 * 1000) / 60000) * 60000;
        var now = nowDate.getTime();
        episodes = $http.get(API_SERVER_ENDPOINT + '/api/v1/episode?start=' + start + '&end=' + (start + 8 * 60 * 60 * 1000), {cache: true});
        current = episodes.then(function (data) {
            var c = null;
            for (var i = 0; i < data.data.length; i++) {
                var episode = data.data[i];
                if (episode.plannedFrom <= now && episode.plannedTo > now) {
                    c = episode;
                }
            }
            return c;
        })
    }
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

function CurrentController($http, currentEpisodes) {
    var ctrl = this;
    ctrl.now = new Date();
    currentEpisodes.episodes().then(function (data) {
        ctrl.episodes = data.data;
    });
    currentEpisodes.current().then(function(data){
       ctrl.current = data;
    });

};

angularModule.component('currentList', {
    templateUrl: 'episode/currentList.html',
    controller: function ($http, currentEpisodes) {
        var ctrl = this;
        ctrl.now = new Date();
        currentEpisodes.episodes().then(function (data) {
            ctrl.episodes = data.data;
        });
        currentEpisodes.current().then(function (data) {
            ctrl.current = data;
        });
    }
});
angularModule.component('currentShow', {
    templateUrl: 'episode/currentShow.html',
    controller: function ($http, currentEpisodes) {
        var ctrl = this;
        currentEpisodes.current().then(function (data) {
            ctrl.current = data;
        });
    }
});
