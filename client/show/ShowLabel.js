'use strict';

require("show/Show").component('showLabel', {
    bindings: {
        show: '='
    },
    template: '<a class="{{$ctrl.labelstyle}} label label-default label-show" ng-href="/show/{{$ctrl.show.alias}}">' +
    '{{$ctrl.show.name}}&nbsp;<i ng-show="ctrl.icon" class="{{$ctrl.icon}}"></i>' +
    '</a>',
    controller: function () {
        var ctrl = this;
        if (ctrl.show.type == 'SPEECH') {
            ctrl.icon = "icon-bubbles"
        } else {
            ctrl.icon = "icon-music"
        }
        ctrl.labelstyle = 'label-' + ctrl.show.type.toLowerCase();

    }
});
