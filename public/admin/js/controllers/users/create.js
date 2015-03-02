angular.module('Administrator')
.controller('UsersCreateController', ["$scope", "$routeParams", "$location", "Users",
    function($scope, $routeParams, $location, Users) {
        $scope.user = {
            isAdmin: false,
            canPost: false
        };
        $scope.pageTitle = "Add User";
        $scope.options = [
            {label: 'Yes', value: true},
            {label: 'No', value: false}
        ];

        $scope.saveUser = function(user) {
            $scope.errors = null;
            $scope.updating = true;

            Users.save(user, function(_data) {
                $location.path("/users/" + _data._id);
            });
        }
    }
]);
