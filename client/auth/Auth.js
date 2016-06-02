var angular = require("angular");

var captcha = require("angular-recaptcha");
var storage = require("angular-local-storage")
var angularModule = angular.module("auth", ['vcRecaptcha', storage]);

module.exports = angularModule;

require("auth/Login");
require("auth/Profile");
require("auth/Register");
require("auth/User");
require("auth/ChangePassword");
