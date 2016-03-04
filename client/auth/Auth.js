var angular = require("angular");

var angularModule = angular.module("auth",[]);

module.exports = angularModule;

require("auth/Login");
require("auth/Profile");
require("auth/Register");
require("auth/User");
require("auth/ChangePassword");
