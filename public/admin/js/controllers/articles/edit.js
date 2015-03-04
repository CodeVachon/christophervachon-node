angular.module('Administrator')
.controller('ArticlesEditController', ["$scope", "$routeParams", "$location", "Articles",
    function($scope, $routeParams, $location, Articles) {
        $scope.article = Articles.get({id: $routeParams.id},function(_data) {
            _data.publish_date = new Date(_data.publish_date);
        });
        $scope.pageTitle = "Edit Article";

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
