angular.module('Administrator')
.controller('UsersViewController', ["$scope", "$routeParams", "$location", "Users", "$gravatar",
    function($scope, $routeParams, $location, Users, Gravatar) {
        var _controller = this;
        $scope.user = Users.get({id: $routeParams.id});
        $scope.gravatar = function(user) {
            return Gravatar.generate(user.emailAddress);
        }

        $scope.removeUser = function(user) {
            $scope.errors = null;
            $scope.updating = true;

            Users.delete({id: user._id}, function() {
                $location.path("/users");
            });
        }
    }
]);
