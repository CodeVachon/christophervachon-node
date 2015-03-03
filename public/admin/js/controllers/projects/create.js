angular.module('Administrator')
.controller('ProjectsCreateController', ["$scope", "$routeParams", "$location", "Projects",
    function($scope, $routeParams, $location, Projects) {
        $scope.project = {
            title: "",
            summary: ""
        };
        $scope.pageTitle = "Add Project";

        $scope.saveProject = function(project) {
            $scope.errors = null;
            $scope.updating = true;

            Projects.save(project, function(_data) {
                $location.path("/projects/" + _data._id);
            });
        }
    }
]);
