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
            if (location.port === "3000") data = [{"StreamId":"s-M1xLrD2","StreamUrl":"http://stream.tilos.hu/tilos.m3u","Data":"{\"status\": {\"msg\": \"Success\", \"code\": 0, \"version\": \"1.0\"}, \"result_type\": 0, \"metadata\": {\"type\": \"real-time\", \"timestamp_utc\": \"2020-12-09 04:56:38\", \"music\": [{\"album\": {\"name\": \"Classic Quirky Keys\"}, \"play_offset_ms\": 166740, \"sample_begin_time_offset_ms\": 1260, \"contributors\": {\"composers\": [\"Bob Bradley\", \"Lincoln Grounds\", \"Steve Dymond\"]}, \"title\": \"Dark Stranger 5\", \"result_from\": 1, \"release_date\": \"2015-07-28\", \"sample_end_time_offset_ms\": 9740, \"genres\": [{\"name\": \"Comedy\"}, {\"name\": \"Quirky\"}], \"label\": \"Audio Network\", \"db_end_time_offset_ms\": 166740, \"score\": 76, \"db_begin_time_offset_ms\": 158260, \"artists\": [{\"name\": \"Bob Bradley\"}, {\"name\": \"Lincoln Grounds\"}, {\"name\": \"Steve Dymond\"}], \"duration_ms\": 174000, \"external_ids\": {\"isrc\": \"GBFFM1599197\"}, \"acrid\": \"b1a52a5d7e348dcdb1c79f97fe7c343e\", \"external_metadata\": {}}, {\"album\": {\"name\": \"Tower of God (Original Series Soundtrack)\"}, \"play_offset_ms\": 133840, \"sample_begin_time_offset_ms\": 0, \"contributors\": {\"composers\": [\"Kevin Penkin\"]}, \"title\": \"Silent\", \"result_from\": 1, \"release_date\": \"2020-10-16\", \"sample_end_time_offset_ms\": 8300, \"genres\": [{\"name\": \"Soundtracks\"}], \"label\": \"SME - Milan\", \"db_end_time_offset_ms\": 131800, \"score\": 76, \"db_begin_time_offset_ms\": 124360, \"artists\": [{\"name\": \"Kevin Penkin\"}], \"duration_ms\": 157000, \"external_ids\": {\"isrc\": \"JPZ922011309\", \"upc\": \"886448817062\"}, \"acrid\": \"55347a60be64ab32807c45dbf457f8a9\", \"external_metadata\": {\"spotify\": {\"album\": {\"name\": \"TOWER OF GOD \\u300e\\u795e\\u4e4b\\u5854\\u300f Original Soundtrack\"}, \"track\": {\"name\": \"Silent\", \"id\": \"5bi227S3GDRKcPaEYKwlNY\"}, \"artists\": [{\"name\": \"Kevin Penkin\"}]}, \"deezer\": {\"album\": {\"name\": \"\"}, \"track\": {\"name\": \"Silent\", \"id\": \"1101671292\"}, \"artists\": [{\"name\": \"Kevin Penkin\"}]}}}]}}","PartitionKey":"s-M1xLrD2","RowKey":"797999879990999599439940","Timestamp":"\/Date(1607489820017)\/","ETag":"W/\"datetime\u00272020-12-09T04%3A57%3A00.0171447Z\u0027\""}];
            try{
                var d = '';
                try {
                    d = typeof data === 'string' ? data : JSON.stringify(data)
                    d = JSON.parse(d);

                    if (d[0] && d[0].Data) {
                        if (typeof d[0].Data === 'string') d = JSON.parse(d[0].Data);
                        else d = d[0].Data;
                    }
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
        //if (episode.show.alias) console.log(alias);
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

