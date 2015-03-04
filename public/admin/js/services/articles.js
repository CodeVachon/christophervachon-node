angular.module('Administrator')
.factory('Articles', ["$resource", function ArticlesFactory($resource) {
    return $resource("/api/posts/:id", {}, {
        update: {
            method: "put"
        }
    });
}]);
