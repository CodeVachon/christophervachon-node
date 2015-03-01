angular.module('Administrator')
.controller('IndexAuthenticateController', ["$scope", "$http", "$location", "$window",
    function($scope, $http, $location, $window) {
        $scope.error = "";
        $scope.emailaddress = "";
        $scope.password = "";

        $scope.getToken = function() {
            $scope.errors = null;
            $scope.fetching = true;

            $http({
                method: "POST",
                url: "/api/authenticate",
                data: {
                    emailAddress: $scope.emailAddress,
                    password: $scope.password
                }
            }).success(function(_data) {
                // Lets only allow users flagged by the api as an admin
                if (_data.user.isAdmin) {
                    $window.sessionStorage.token = _data.token;
                    $window.sessionStorage.user = JSON.stringify(_data.user, null, '\t');
                    $location.path( "/" );
                } else {
                    delete $window.sessionStorage.token;
                    delete $window.sessionStorage.user
                    $scope.errors = "You are not Authorized to Login"
                }

            }).error(function(_data) {
                $scope.errors = _data;
                $scope.fetching = false;
                delete $window.sessionStorage.token;
                delete $window.sessionStorage.user
            });

        }
    }
]).controller('IndexLogoutController', ["$window",
    function($window) {
        delete $window.sessionStorage.token;
        delete $window.sessionStorage.user
        console.log("Token set to: " + $window.sessionStorage.token);
    }
]);
