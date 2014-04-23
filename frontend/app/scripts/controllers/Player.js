'use strict';


angular.module('tilosApp').factory("Player", function ($rootScope) {
    var jplayer = $("#jquery_jplayer_1");
    $("#jquery_jplayer_1").jPlayer({
        ready: function () {

        },
        swfPath: "/jplayer",
        nativeSupport: false,
        solution: "flash, html"
    });
    var player = {};

    player.play = function(url) {
        jplayer.jPlayer("setMedia", {
            title: "Tilos",
            mp3: url[0].url
        });
        $rootScope.player = true;
        jplayer.jPlayer("play");
    };
    return player;

})


