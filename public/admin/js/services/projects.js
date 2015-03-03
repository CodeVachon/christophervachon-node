angular.module('Administrator')
.factory('Projects', ["$resource", function ProjectsFactory($resource) {
    return $resource("/api/projects/:id", {}, {
        update: {
            method: "put"
        }
    });
}]);
