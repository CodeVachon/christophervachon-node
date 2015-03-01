angular.module('Administrator')
.factory('Users', ["$resource", function UsersFactory($resource) {
    return $resource("/api/users/:id", {}, {
        update: {
            method: "put"
        }
    });
}]);
