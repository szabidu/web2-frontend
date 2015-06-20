'use strict';

angular.module('tilosApp').directive('showLabel', function ($compile) {
    return {
        restrict: 'EA',
        scope: {
            show: '='
        },
        template: '<a class="{{labelstyle}} label label-default" ng-href="/show/{{show.alias}}">' +
        '{{show.name}}&nbsp;<i class="{{icon}}"></i>' +
        '</a>',
        controller: function ($scope) {
            if ($scope.show.type == 'SPEECH') {
                $scope.icon = "icon-bubbles"
            } else {
                $scope.icon = "icon-music"
            }
            $scope.labelstyle = 'label-' + $scope.show.type.toLowerCase();
        }
    }

});
