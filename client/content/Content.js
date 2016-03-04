var angular = require("angular");

var angularModule = angular.module("content", []);

module.exports = angularModule;
require("content/News");
require("content/Page");
require("page.scss");
