'use strict';

import thinky from '../libs/rethink';
var type = thinky.type;
import bcrypt from 'bcrypt';
//var SALT_WORK_FACTOR = 10;

var User = thinky.createModel("users", {
    id: type.string(),
    originalId: type.string()
});

User.define("verifyPassword", function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, (this.hashedPassword || ' '), function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
});

export default User;
