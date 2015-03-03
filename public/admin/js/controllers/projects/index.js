angular.module('Administrator')
.controller('ProjectsIndexController', ["$scope", "Projects",
    function($scope, Projects) {
        var _controller = this;
        $scope.projects = Projects.query();
    }
]);
