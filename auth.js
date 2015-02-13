
var passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    User = require('./models/user')
;


passport.use(new BasicStrategy(
  function(emailAddress, password, callback) {
    User.findOne({ emailAddress: emailAddress }, function (error, user) {
      if (error) { return callback(error); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(error, isMatch) {
        if (error) { return callback(error); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        return callback(null, user);
      });
    });
  }
));


exports.isAuthenticated = passport.authenticate('basic', { session : false });
