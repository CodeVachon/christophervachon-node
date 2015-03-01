angular.module('Administrator')
.controller('UsersCreateController', ["$scope", "$routeParams", "$location", "Users",
    function($scope, $routeParams, $location, Users) {
        $scope.user = {};
        $scope.pageTitle = "Add User";

        $scope.saveUser = function(user) {
            $scope.errors = null;
            $scope.updating = true;

            Users.save(user, function(_data) {
                $location.path("/users/" + _data._id);
            });
        }
    }
]);
