angular.module('Administrator')
.controller('ArticlesViewController', ["$scope", "$routeParams", "$location", "Articles",
    function($scope, $routeParams, $location, Articles) {
        var _controller = this;
        $scope.article = Articles.get({id: $routeParams.id});

        $scope.removeArticle = function(article) {
            $scope.errors = null;
            $scope.updating = true;

            Articles.delete({id: article._id}, function() {
                $location.path("/articles");
            });
        }
    }
]);
