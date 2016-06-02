'use strict';

var PouchDB = require("pouchdb");
var angular = require("angular");
require("maraton/day.html");
require("maraton/days.html");


var angularModule = angular.module("maraton", []);

angularModule.factory('pouchService', function ($rootScope) {
    var db = new PouchDB("maraton")
    var remote = new PouchDB('https://db.tilos.hu/maraton16');
    remote.replicate.to(db).on('complete', function () {
        console.log("synced");
        $rootScope.$emit("synced", {});
    }).on('error', function (err) {
        console.log("sync error" + err);
    });
    return db;
})
    .run(function (pouchService) {


    });


angularModule.controller('DayCtrl', function ($scope, pouchService) {
    var base = new Date("2016-06-03 08:00").getTime()
    var date = Math.max(base, new Date().getTime());
    var offset = Math.floor((date - base) / (60 * 60 * 1000 * 24)) + 1;
    var id = "day" + offset;
    pouchService.get(id, {attachment: true}).then(function (result) {
        $scope.$apply(function () {
            $scope.day = result;
        });
        $scope.selectIcon = function (type) {
            if (type == 'radio') {
                return 'ion-mic-c';
            } else if (type == 'tombola') {
                return 'ion-speakerphone';
            } else if (type == 'DJ') {
                return 'ion-disc';
            } else if (type == 'bogracs') {
                return 'ion-fork';
            } else {
                return '';
            }
        };
        $scope.timeComparator = function (item) {
            if (item.time && item.time.length > 4) {
                var hour = parseInt(item.time.substring(0, 2))
                var min = parseInt(item.time.substring(3, 5))
                if (hour < 12) hour += 24;
                return hour * 60 + min;
            }
            return -1;
        };

        angular.forEach(result.events, function (event) {
            if (event.image) {
                pouchService.getAttachment(id, event.image).then(function (data) {

                    $scope.$apply(function () {
                        console.log(data);
                        event.imageData = URL.createObjectURL(data);
                    });
                    //event.imageData = 'http://localhost:5984/maraton16/day1/bazsinka.jpg';


                }).catch(function (err) {
                    console.log(err);
                });
            }

        });
    })
})
    .controller('PageCtrl', function ($scope, pouchService, $stateParams) {
        pouchService.get($stateParams.id, {attachment: true}).then(function (result) {
            $scope.$apply(function () {
                $scope.page = result;
            });
        })
    });

module.exports = angularModule;
