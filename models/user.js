var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs')
;

var UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    emailAddress: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now }
});


UserSchema.pre('save', function(callback) {
    var user = this;
    user.updated_at = new Date();
    // Break out if the password hasn't changed
    if (!user.isModified('password')) {
        return callback();
    }

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function(error, salt) {
        if (error) {
            return callback(error);
        }

        bcrypt.hash(user.password, salt, null, function(error, hash) {
            if (error) {
                return callback(error);
            }
            user.password = hash;
            callback();
        });
    });
});


UserSchema.methods.verifyPassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(error, isMatch) {
    if (error) return callback(error);
    callback(null, isMatch);
  });
};


module.exports = mongoose.model('User', UserSchema);
