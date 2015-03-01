angular.module('Administrator', ['ngRoute','ngResource','Gravatar'])
.config(function($gravatarProvider){
  $gravatarProvider.setSize(100);
});
