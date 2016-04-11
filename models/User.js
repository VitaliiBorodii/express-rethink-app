'use strict';

import thinky from '../libs/rethink';
import bcrypt from 'bcrypt';
var type = thinky.type;
var SALT_WORK_FACTOR = 10;

var User = thinky.createModel("users", {
    id: type.string(),
    originalId: type.string()
});

User.define("creteWithPassword", function (next) {
    var user = this;

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) {
            return next(err);
        }
        user.salt = salt;
        // hash the password using our new salt
        bcrypt.hash(user.hashedPassword, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            // override the cleartext password with the hashed one
            // user.hashedPassword = hash;
        next(null);
        });
    });
});

User.define("verifyPassword", function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.hashedPassword, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
});

export default User;
