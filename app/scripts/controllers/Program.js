'use strict';

angular.module('tilosApp').config(function ($stateProvider) {
  $stateProvider.state('archiveDefault', {
    url: '/archive',
    templateUrl: 'partials/program.html',
    controller: 'ProgramCtrl'
  });
  $stateProvider.state('archive', {
    url: '/archive/:year/:month/:day',
    templateUrl: 'partials/program.html',
    controller: 'ProgramCtrl'
  });
});
angular.module('tilosApp').controller('ProgramCtrl', function ($scope, $state, $stateParams, API_SERVER_ENDPOINT, $http, datepickerPopupConfig, $timeout) {
    datepickerPopupConfig.closeText = 'Bezár';
    datepickerPopupConfig.toggleWeeksText = 'Hetek száma';
    datepickerPopupConfig.currentText = 'Ma';
    datepickerPopupConfig.clearText = 'Törlés';


    $scope.gotoDay = function(date) {
      var monthStr = ("0" + (date.getMonth() + 1)).slice(-2);
      var dayStr = ("0" + date.getDate()).slice(-2)
      $state.go("archive", {"year": date.getFullYear(), "month": monthStr, "day": dayStr});
    };

    $scope.prev = function () {
      var prev = new Date($scope.selectedDate.getTime() - 60 * 60 * 24 * 1000);
      $scope.gotoDay(prev);

    };

    $scope.next = function () {
      var next = new Date($scope.selectedDate.getTime() + 60 * 60 * 24 * 1000);
      $scope.gotoDay(next);
    };

    $scope.retrieveEpisodesForDay = function (timestamp) {
      var from = new Date(timestamp * 1000);
      from.setToDayStart();
      var to = new Date(timestamp * 1000);
      to.setToDayEnd();
      $http.get(API_SERVER_ENDPOINT + '/api/v0/episode?start=' + from.getTimestamp() + '&end=' + to.getTimestamp(), {cache: true}).success(function (data) {
        for (var i = 0; i < data.length; i++) {
          var fromDate = new Date(data[i].plannedFrom * 1000);
          var toDate = new Date(data[i].plannedTo * 1000);
          var fromDateString = fromDate.getFullYear() + ('0' + (fromDate.getMonth() + 1)).slice(-2) + ('0' + fromDate.getDate()).slice(-2);
          var fromDateHours = ('0' + fromDate.getHours()).slice(-2) + ('0' + fromDate.getMinutes()).slice(-2);
          var toDateHours = ('0' + toDate.getHours()).slice(-2) + ('0' + toDate.getMinutes()).slice(-2);
        }
        $scope.episodes = data;
      });
    };


    $scope.program = {};
    var now = new Date();
    now.setToNoon();
    $scope.selectedDate = new Date();


    $scope.selectedDate = now;
    if ($stateParams.year) {
      $scope.selectedDate = new Date($stateParams.year, $stateParams.month - 1, $stateParams.day, 12, 0, 0);
    }

    //Get today's episodes.
    $scope.retrieveEpisodesForDay($scope.selectedDate.getTimestamp());

    $scope.today = function () {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.showWeeks = true;
    $scope.toggleWeeks = function () {
      $scope.showWeeks = !$scope.showWeeks;
    };

    $scope.clear = function () {
      $scope.dt = null;
    };

    $scope.toggleMin = function () {
      $scope.minDate = ($scope.minDate) ? null : new Date();
    };

    $scope.open = function () {
      $timeout(function () {
        $scope.opened = true;
      });
    };
    $scope.goto = function () {
      $scope.gotoDay($scope.selectedDate);
    };
    $scope.dateOptions = {
      'year-format': '\'yy\'',
      'starting-day': 1
    };
  }
);
