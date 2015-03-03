angular.module('Administrator')
.controller('ProjectsEditController', ["$scope", "$routeParams", "$location", "Projects",
    function($scope, $routeParams, $location, Projects) {
        var _controller = this;
        $scope.project = Projects.get({id: $routeParams.id});
        $scope.pageTitle = "Edit Project";

        $scope.saveProject = function(project) {
            $scope.errors = null;
            $scope.updating = true;

            Projects.update({id: project._id}, project, function success(_data) {
                $location.path("/projects/" + project._id);
            }, function error(_data) {
                console.log(_data.data.validationerrors);
                $scope.errors = _data.data.validationerrors;
                $scope.updating = false;
            });
        }
    }
]);
