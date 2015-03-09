angular.module('Administrator')
.controller('ArticlesEditController', ["$scope", "$routeParams", "$location", "Articles",
    function($scope, $routeParams, $location, Articles) {
        $scope.article = Articles.get({id: $routeParams.id},function(_data) {
            _data.publish_date = new Date(_data.publish_date);
        });
        $scope.pageTitle = "Edit Article";

        $scope.addTag = function(article) {
            if (!$scope.article.tags) { $scope.article.tags = []; }
            $scope.article.tags.push( prompt("New Tag Name") );
        }

        $scope.removeTag = function(tag) {
            if (!$scope.article.tags) { $scope.article.tags = []; }
            if (confirm("Are you sure you want to remove: " + tag)) {
                for (var i=0, x=$scope.article.tags.length; i<x; i++) {
                    if ($scope.article.tags[i] === tag) {
                        $scope.article.tags.splice(i,1);
                        return;
                    }
                }
            }
        }

        $scope.saveArticle = function(article) {
            $scope.errors = null;
            $scope.updating = true;

            Articles.update({id: article._id}, article, function success(_data) {
                $location.path("/articles/" + article._id);
            }, function error(_data) {
                console.log(_data.data.validationerrors);
                $scope.errors = _data.data.validationerrors;
                $scope.updating = false;
            });
        }
    }
]);
