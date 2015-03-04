angular.module('Administrator')
.controller('ArticlesIndexController', ["$scope", "Articles",
    function($scope, Articles) {
        var _controller = this;
        $scope.articles = Articles.query();
    }
]);
