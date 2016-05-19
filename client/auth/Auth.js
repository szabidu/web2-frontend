var angular = require("angular");

var captcha = require("angular-recaptcha");
var angularModule = angular.module("auth",['vcRecaptcha']);

module.exports = angularModule;

require("auth/Login");
require("auth/Profile");
require("auth/Register");
require("auth/User");
require("auth/ChangePassword");
