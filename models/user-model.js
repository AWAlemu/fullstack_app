var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.methods.validatePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isValid) {
        console.log('validatePass called');
        if (err) {
            callback(err);
            return;
        }
        callback(null, isValid);
    });
};

var User = mongoose.model('User', UserSchema);

exports.User = User;
