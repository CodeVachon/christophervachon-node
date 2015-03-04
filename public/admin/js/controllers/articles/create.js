angular.module('Administrator')
.controller('ArticlesCreateController', ["$scope", "$routeParams", "$location", "Articles",
    function($scope, $routeParams, $location, Articles) {
        $scope.article = {
            title: "",
            summary: ""
        };
        $scope.pageTitle = "Add Article";

        $scope.saveArticle = function(article) {
            $scope.errors = null;
            $scope.updating = true;

            Articles.save(article, function(_data) {
                $location.path("/articles/" + _data._id);
            });
        }
    }
]);
