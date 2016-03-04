'use strict';

require("main/404.html")
var angularModule = require("main/Main")

angularModule.config(function ($stateProvider) {
    $stateProvider.state('notfound', {
        url: '/404',
        templateUrl: 'main/404.html',
        controller: function(){}
    });
});
