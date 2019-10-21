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
    $scope.whatsPlaying.get = function () {
        if (document.hidden === true) return;
        var url = location.port === "3000" 
            ? "http://192.168.0.80:8001/acr/lastdev" 
            : "https://acrcloudtilos.azurewebsites.net/acr/last";
        $http.get(url).success(function(data) {
            try{
                var d = '';
                try {
                    d = typeof data === 'string' ? data : JSON.stringify(data)
                    d = JSON.parse(d);
                } catch (ex) {
                    $scope.whatsPlaying.song.artist = 'ismeretlen szám';
                    $scope.whatsPlaying.song.title = 'ismeretlen előadó';
                    return;
                }

                $scope.whatsPlaying.song = d;
                $scope.whatsPlaying.song.title = $scope.whatsPlaying.song.metadata.music[0].title;
                $scope.whatsPlaying.song.artist = '';
                var artists = $scope.whatsPlaying.song.metadata.music[0].artists;
                for (var i = 0; i< artists.length; i++) {
                    $scope.whatsPlaying.song.artist += artists[i].name + "; ";
                }
                $scope.whatsPlaying.song.artist = $scope.whatsPlaying.song.artist.substr(0,$scope.whatsPlaying.song.artist.length-2);
            } catch (ex) {
                $scope.whatsPlaying.song.artist = 'HIBA: ';
                $scope.whatsPlaying.song.title = ex.toString();
            }
        }).error(function(data) {
            $scope.whatsPlaying.song.artist = '';
            $scope.whatsPlaying.song.title = '';
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

    $scope.whatsPlaying.get();
    $interval($scope.whatsPlaying.get, 10000);

});
