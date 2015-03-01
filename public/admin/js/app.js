angular.module('Administrator', ['ngRoute','ngResource','Gravatar'])
.config(function($gravatarProvider){
    // Configure the Gravitar Image Size
    $gravatarProvider.setSize(100);
}).run(function($rootScope, $location, $window) {
    // To enforce Authentication, Check on Location Change for the Token.
    $rootScope.$on( "$locationChangeStart", function(event, next, current) {

        if (!$window.sessionStorage.token) {
            console.log("No Token Found!");
            if (!next.match(/\/login$/g)) {
                console.log("not going to login -- Redirect to Login");
                $location.path( "/login" );
            }
        }
    });
}).factory('authInterceptor', function($rootScope, $q, $window) {
    return {
        request: function (config) {
            // This Handles All outgoing Requests
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },
        response: function (response) {
            // This Handles HTTP Responses
            if (response.status === 401) {
                console.log("Auth Failed Redirect to Login");
                $location.path( "/login" );
            }
            return response || $q.when(response);
        }
    };
}).config(function ($httpProvider) {
    // Add our Token to All HTTP Requests if it exists
    $httpProvider.interceptors.push('authInterceptor');
});
