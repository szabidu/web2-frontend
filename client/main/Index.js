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


angularModule.controller('MainCtrl', function ($scope, $http, API_SERVER_ENDPOINT, $interval) {

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

    function getWhatsPlaying () {
        var url = "https://gettingstartedwithazurewebasos.azurewebsites.net/echo/";
        $http.get(url).success(function(data) {
            // $scope.whatsPlaying.stream = {
            //     streamId: data.stream_id,
            //     streamUrl: data.stream_url,
            // }

            try{
                var parts = data.split(';');
                $scope.whatsPlaying = {
                    stream: {
                        streamId: parts[0].split('=')[1],
                        streamUrl: parts[1].split('=')[1],
                    }
                }

                //var d = data.data;
                var d = parts[3].split('=')[1];
                $scope.whatsPlaying.song = JSON.parse(d);
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
            console.error(data);
            $scope.whatsPlaying.song.artist = 'HIBA: ';
            var msg = ''; try { msg =  JSON.stringify(data); } catch(ex) {}
            $scope.whatsPlaying.song.title = data.toString() + msg;
    });
    }

    getWhatsPlaying();
    $interval(getWhatsPlaying, 10000);
    $scope.getWhatsPlaying = getWhatsPlaying;

});
