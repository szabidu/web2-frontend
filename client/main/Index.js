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
            if (location.port === "3000") data = '{"status": {"msg": "Success", "version": "1.0", "code": 0}, "result_type": 0, "metadata": {"type": "real-time", "timestamp_utc": "2020-07-13 16:36:26", "music": [{"album": {"name": "Cello Suite No. 6 in D Major, BWV 1012: VI. Gigue"}, "play_offset_ms": 22160, "genres": [{"name": "Classical"}], "contributors": {"composers": ["Johann Sebastian Bach"]}, "title": "Cello Suite No. 6 in D Major, BWV 1012: VI. Gigue", "result_from": 1, "release_date": "2013-07-12", "sample_end_time_offset_ms": 8800, "sample_begin_time_offset_ms": 0, "label": "WMG - PLG Classics (EMIC)", "duration_ms": 239000, "score": 100, "db_begin_time_offset_ms": 13760, "artists": [{"role": "MainArtist", "name": "Pablo Casals"}], "db_end_time_offset_ms": 22560, "external_ids": {"isrc": "GBAYC8803121", "upc": "724356621558"}, "acrid": "e75b7ba9d66f093c86b63d489318f3f6", "external_metadata": {}}, {"album": {"name": "Pablo Casals: Song of the Birds (Cello Encores)"}, "play_offset_ms": 22560, "genres": [{"name": "Classical"}], "contributors": {"composers": ["Johann Sebastian Bach"]}, "title": "Suite for Cello No. 6 in D Major: VII. Gigue", "result_from": 1, "release_date": "2004-01-01", "sample_end_time_offset_ms": 9200, "sample_begin_time_offset_ms": 400, "label": "Regis Records ", "duration_ms": 237707, "score": 100, "db_begin_time_offset_ms": 14160, "artists": [{"name": "Pablo Casals"}], "db_end_time_offset_ms": 22960, "external_ids": {"isrc": "GBJ2F1200063", "upc": "5055031311934"}, "acrid": "69599e25e9d832f70952168b839c4620", "external_metadata": {"musicbrainz": [{"track": {"id": "42d2284c-793a-4024-a1b8-14ab29bc22b4"}}], "spotify": {"track": {"id": "6tELnUAwWb7ZZ6jWTRZ9e3"}, "album": {"id": "5C1Hyi6noSXvS2CTx6966T"}, "artists": [{"id": "5aIqB5nVVvmFsvSdExz408"}, {"id": "42ZCvzken6DllCB1xghinZ"}]}, "musicstory": {"track": {"id": "5316839"}, "release": {"id": "1176072"}, "album": {"id": "444581"}}, "deezer": {"track": {"id": "63824461"}, "album": {"id": 6263899}, "artists": [{"id": 77553}]}}}, {"album": {"name": "Bach: Cello Suites Nos. 1-6 (1936-1939)"}, "play_offset_ms": 22240, "genres": [{"name": "Classical"}], "contributors": {"composers": ["Johann Sebastian Bach"]}, "title": "VI. Gigue", "result_from": 1, "release_date": "2010-03-01", "sample_end_time_offset_ms": 8800, "sample_begin_time_offset_ms": 0, "label": "Documents", "duration_ms": 233620, "score": 100, "db_begin_time_offset_ms": 13840, "artists": [{"name": "Pablo Casals"}], "db_end_time_offset_ms": 22640, "external_ids": {"isrc": "DEU240304156", "upc": "4011222326751"}, "acrid": "25c4728e45f2583296a4a805b97f97fb", "external_metadata": {"musicbrainz": [{"track": {"id": "42d2284c-793a-4024-a1b8-14ab29bc22b4"}}]}}]}}';
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

    $scope.hasPic = function(episode) {
        var re = /<img([\w\W]+?)\/>/;
        var html = episode.text.formatted;
        return re.test(html);
    }

    $scope.getShowPic = function(episode) {
        var alias = episode.show.alias || 'tilos-radio';
        if (episode.show.alias) console.log(alias);
        return "https://tilos.hu/upload/episode/"+ alias+ ".jpg";
    }

    $scope.getPicFront = function(episode) {
        if (!episode || !episode.text || !episode.text.formatted) return null;
        var re = /(.*)(<img\s[\w\W]+?\/>)(.*)/;
        var html = episode.text.formatted;
        if (re.test(html)) {
            var wrapper1 = '<p class="image-wrapper">';
            var wrapper2 = '</p>';
            episode.text.formatted = html.replace(re, "$2$1$3");
            return wrapper1 + episode.text.formatted + wrapper2;
        }
    }
});

