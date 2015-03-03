angular.module('Administrator')
.controller('ProjectsViewController', ["$scope", "$routeParams", "$location", "Projects",
    function($scope, $routeParams, $location, Projects) {
        var _controller = this;
        $scope.project = Projects.get({id: $routeParams.id});

        $scope.removeProject = function(project) {
            $scope.errors = null;
            $scope.updating = true;

            Projects.delete({id: project._id}, function() {
                $location.path("/projects");
            });
        }
    }
]);
