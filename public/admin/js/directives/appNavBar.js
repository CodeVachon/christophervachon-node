angular.module('Administrator')
.directive('appNavBar',["$sce", "$window", "$location",
function($sce, $window, $location) {
    return {
        replace: true,
        restrict: "E",
        templateUrl: './templates/directives/appNavBar.html',
        controller: function($scope) {
            $scope.navItems = [
                { label: "Articles", path: "articles" },
                { label: "Projects", path: "projects" },
                { label: "Users", path: "users" }
            ];

            $scope.isLoggedIn = function() {
                return $window.sessionStorage.token;
            }
            $scope.getActive = function()  {
                var value = $location.path().replace(/^\/([a-zA-Z0-9]+)(?:\/.+)$/gi,"$1").replace(/\//g,"").toLowerCase();
                return value;
            }
            $scope.isActiveMenu = function(value) {
                var currentValue = $scope.getActive();
                return (currentValue === value);
            }
            $scope.getActiveUserId = function() {
                var userData = JSON.parse($window.sessionStorage.user);
                return userData._id;
            }
        },
        link: function($scope) {
        }
    };
}]);
