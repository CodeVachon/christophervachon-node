angular.module('Administrator')
.controller('ArticlesCreateController', ["$scope", "$routeParams", "$location", "Articles",
    function($scope, $routeParams, $location, Articles) {
        $scope.article = {
            title: "",
            summary: "",
            publish_date: new Date(),
            author: {
                name: "Christopher Vachon",
                email: "code@christophervachon.com"
            }
        };
        $scope.pageTitle = "Add Article";

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

            Articles.save(article, function(_data) {
                $location.path("/articles/" + _data._id);
            });
        }
    }
]);
