'use strict';

import thinky from '../libs/rethink';
import bcrypt from 'bcrypt';
var type = thinky.type;
//var SALT_WORK_FACTOR = 10;

var User = thinky.createModel("users", {
    id: type.string(),
    originalId: type.string()
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
