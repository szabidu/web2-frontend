'use strict';

var angular = require("angular")
var angularModule = angular.module("comment", []);
require("comment/comment.html");
require("comment/commentable.html");
require("comment/comment-reply.html");

angularModule.directive('commentable', [function () {

    return {

        templateUrl: 'comment/commentable.html',

        scope: {  //isolate the scope
            commentable: '@',
            commentableType: '@',
            src: '=',
            loggedIn: '&'
        },

        controller: function ($scope, $http, API_SERVER_ENDPOINT) {

            var restEndpoint = API_SERVER_ENDPOINT + '/api/v1/' + $scope.commentableType + '/' + $scope.commentable + '/comment';
            $scope.comments = [];
            $scope.formComment = {};

            $http.get(restEndpoint).success(function (res) {
                $scope.comments = res;
            });

            var commentable = {};

            $scope.commentReply = function (comment) {
                comment.interact = '';
                comment.replying = true;
                comment.editing = false;
            };

            $scope.cancelComment = function (comment) {
                _commentResetState(comment);
            };

            $scope.createComment = function () {
                if ($scope.formComment.comment) {
                    return $http.post(restEndpoint, $scope.formComment).success(function () {
                        _resetFormComment();
                        $http.get(restEndpoint).success(function (res) {
                            $scope.comments = res;
                        });
                    });
                }
            };


            $scope.replyComment = function (comment) {

                if (comment.interact) {
                    var newComment = {};
                    newComment.comment = comment.interact;
                    newComment.parentId = comment.id;

                    return $http.post(restEndpoint, newComment).success(function () {
                        $http.get(restEndpoint).success(function (res) {
                            $scope.comments = res;
                        });
                    });
                }

            };

            /// PRIVATE

            //helpers
            function _resetFormComment() {
                $scope.formComment = null;
                $scope.formComment = {};
            }

            function _commentResetState(comment) {
                comment.replying = false;
                comment.editing = false;
            }

        }
    };
}]);

module.exports = angularModule
