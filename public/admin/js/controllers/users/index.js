angular.module('Administrator')
.controller('UsersIndexController', ["$scope", "Users",
    function($scope, Users) {
        var _controller = this;
        $scope.users = Users.query();
    }
]);
