'use strict';

require("main/404.html")
require("main/test.html")
var angularModule = require("main/Main")



angularModule .config(function ($stateProvider) {
    $stateProvider.state('index', {
        url: '/',
        templateUrl: 'main/index.html',
        controller: 'MainCtrl'
    });
    $stateProvider.state('index-i', {
        url: '/index',
        templateUrl: 'main/index.html',
        controller: 'MainCtrl'
    });

});

angularModule.config(function ($stateProvider) {
    $stateProvider.state('testpage', {
        url: '/testpage',
        templateUrl: 'main/test.html'
    });
});


angularModule.controller('MainCtrl', function ($scope, $http, API_SERVER_ENDPOINT, $interval, currentEpisodes) {

    // $http.get(API_SERVER_ENDPOINT + '/api/v1/text/page/lead').success(function (data) {
    //     $scope.lead = data;
    // });

    $http.get(API_SERVER_ENDPOINT + '/api/v1/text/news/current').success(function (data) {
        $scope.news = data;
    });
    $http.get(API_SERVER_ENDPOINT + '/api/v1/episode/next').success(function (data) {
        $scope.next = data;
    });
    $http.get(API_SERVER_ENDPOINT + '/api/v1/episode/last').success(function (data) {
        $scope.last = data;
    });
    $http.get(API_SERVER_ENDPOINT + '/api/v1/episode/lastWeek').success(function (data) {
        $scope.lastWeek = data;
    });

    $scope.whatsPlaying = $scope.whatsPlaying || {};
    $scope.whatsPlaying.song = $scope.whatsPlaying.song || {};
    $scope.whatsPlaying.showDetails = false;
    $scope.whatsPlaying.whatsPlayingText = 'Felismerés folyamatban...';
    $scope.whatsPlaying.get = function () {
        if (document.hidden === true) return;
        var url = location.port === "3000" 
            ? "sample.json" 
            : "https://acrcloudtilos.azurewebsites.net/acr/last";
        $http.get(url).success(function(data) {
            try{
                var d = '';
                try {
                    d = typeof data === 'string' ? data : JSON.stringify(data)
                    d = JSON.parse(d);
                    //if (!Array.isArray(d) || d.length !== 1) throw "The backend did not return 1 record.";
                    //if (!d[0].Data) throw "Backend did not return a Data object: " + JSON.stringify(d[0]);
                    //if (typeof d[0].Data === 'string') d[0].Data = JSON.parse(d[0].Data);
                } catch (ex) {
                    $scope.whatsPlaying.song.artist = 'ismeretlen szám';
                    $scope.whatsPlaying.song.title = 'ismeretlen előadó';
                    $scope.whatsPlaying.whatsPlayingText = '';
                    return;
                }

                $scope.whatsPlaying.song = d; //d[0].Data;
                $scope.whatsPlaying.song.title = $scope.whatsPlaying.song.metadata.music[0].title;
                $scope.whatsPlaying.song.artist = '';
                var artists = $scope.whatsPlaying.song.metadata.music[0].artists;
                for (var i = 0; i< artists.length; i++) {
                    $scope.whatsPlaying.song.artist += artists[i].name + "; ";
                }
                $scope.whatsPlaying.song.artist = $scope.whatsPlaying.song.artist.substr(0, $scope.whatsPlaying.song.artist.length - 2);
                
                // Has the song ended?
                var now = new Date();
                var songEndTime = getSongEndTime();
                if (!songEndTime) {
                    $scope.whatsPlaying.whatsPlayingText = 'Talán már véget ért: ';
                } else if (songEndTime < now) {
                    $scope.whatsPlaying.whatsPlayingText = 'Utolsó felismert szám (vége lett: ' + songEndTime.toLocaleTimeString() + ')';
                } else {
                    $scope.whatsPlaying.whatsPlayingText = 'MOST SZÓL';
                }
            } catch (ex) {
                $scope.whatsPlaying.song.artist = 'HIBA: ';
                $scope.whatsPlaying.song.title = ex.toString();
                $scope.whatsPlaying.whatsPlayingText = '';
            }
        }).error(function(data) {
            $scope.whatsPlaying.song.artist = '';
            $scope.whatsPlaying.song.title = '';
            $scope.whatsPlaying.whatsPlayingText = '';
            if (!data) return;
             console.error(data);
            var msg = ''; try { msg =  JSON.stringify(data); } catch(ex) {}
        });
    }

    $scope.whatsPlaying.subscription = currentEpisodes.current().subscribe(
        function (x) {
            $scope.$apply(function () {
                $scope.whatsPlaying.currentEpisode = x;
                // műsor címe == x.show.name;
            })
        });
    $scope.whatsPlaying.stopAtEndOfSong = function() {
    }

    function getSongEndTime() {
        var sRecognitionTime = $scope.whatsPlaying.song.metadata.timestamp_utc;
        var recognitionTime = new Date(sRecognitionTime.replace(/-/g, '/') + ' UTC');
        var playOffset = $scope.whatsPlaying.song.metadata.music[0].play_offset_ms;
        var duration = $scope.whatsPlaying.song.metadata.music[0].duration_ms;
        if (isNaN(playOffset)) {
            console.log('Invalid playOffset: ' + $scope.whatsPlaying.song.metadata.music[0].play_offset_ms.toString())
            playOffset = 0;
        } 
        if (isNaN(duration) || duration < 0) {
            console.log('Invalid duration');
            return null;
        }
        if (isNaN(recognitionTime.getTime())) {
            console.log('Invalid recognition time. Did the format change from yyyy-mm-dd hh:mm:ss? ' + sRecognitionTime);
            return null;
        }
        return new Date(recognitionTime.getTime() + duration - playOffset);
    }

    $scope.whatsPlaying.get();
    $interval($scope.whatsPlaying.get, 10000);

});
