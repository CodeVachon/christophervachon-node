angular.module('Administrator').config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
          // redirect to the notes index
          templateUrl: './templates/pages/index/index.html'
        })
        .when('/users', {
            templateUrl: './templates/pages/users/index.html',
            controller: 'UsersIndexController'
        })
        .when('/users/new', {
            templateUrl: './templates/pages/users/edit.html',
            controller: 'UsersCreateController'
        })
        .when('/users/:id', {
            templateUrl: './templates/pages/users/view.html',
            controller: 'UsersViewController'
        })
        .when('/users/:id/edit', {
            templateUrl: './templates/pages/users/edit.html',
            controller: 'UsersEditController'
        })
        .otherwise({redirectTo: '/'})
    ;
}]);
