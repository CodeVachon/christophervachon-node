angular.module('Gravatar', [])
.provider('$gravatar', function() {
  var avatarSize = 80; // Default size
  var avatarUrl = "http://www.gravatar.com/avatar/";

  this.setSize = function(size) {
    avatarSize = size;
  }

  this.$get = function(){
    return {
      generate: function(email){
        return avatarUrl + CryptoJS.MD5(email) + "?size=" + avatarSize.toString()
      }
    }
  }
});
