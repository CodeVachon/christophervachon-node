angular.module('Administrator')
.controller('UsersEditController', ["$scope", "$routeParams", "$location", "Users",
    function($scope, $routeParams, $location, Users) {
        var _controller = this;
        $scope.user = Users.get({id: $routeParams.id});
        $scope.pageTitle = "Edit User";

        $scope.saveUser = function(user) {
            $scope.errors = null;
            $scope.updating = true;

            Users.update({id: user._id}, user, function(_data) {
                $location.path("/users/" + user._id);
            });
        }
    }
]);
