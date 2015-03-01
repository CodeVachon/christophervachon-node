angular.module('Administrator', ['ngRoute','ngResource','Gravatar'])
.config(function($gravatarProvider){
    // Configure the Gravitar Image Size
    $gravatarProvider.setSize(100);
}).run(function($rootScope, $location, $window) {
    // To enforce Authentication, Check on Location Change for the Token.
    $rootScope.$on( "$locationChangeStart", function(event, next, current) {

        // Check for the Auth Token...
        if (!$window.sessionStorage.token) {
            // Token Not Found... Are we already going to the Login Page?
            if (!next.match(/\/login$/g)) {
                // not going to login -- Redirect to Login
                $location.path( "/login" );
            }
        }

    });
}).factory('authInterceptor', function($rootScope, $q, $window, $location) {
    return {
        request: function (config) {
            // This Handles All outgoing Requests
            // We want to add our Token to all Outgoing Requests
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            } else {
                // If I dont have a token, go get one...
                // (note that this should not ever actually fire...)
                $location.path( "/login" );
            }
            return config;
        },
        response: function (response) {
            // This Handles HTTP Responses
            return response || $q.when(response);
        },
        responseError: function (rejection) {
            // Sever returned an error code...
            if (rejection.status === 401) {
                console.log("Auth Failed -- Redirect to Login");
                $location.path( "/login" );
            }
            return $q.reject(rejection);
        }
    };
}).config(function ($httpProvider) {
    // Add our Token to All HTTP Requests if it exists
    $httpProvider.interceptors.push('authInterceptor');
});
