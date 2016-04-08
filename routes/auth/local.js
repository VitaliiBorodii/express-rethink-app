import LocalStrategy from 'passport-local';
import User from '../../models/User';

export default function (passport, handler) {
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        function(username, password, done) {
            User.filter({originalId: username}).then(function (cursor) {
                return cursor.toArray ? cursor.toArray(cb) : cb(cursor);
                function cb (users) {
                    if (users.length > 0) {
                        users[0].verifyPassword(password, (err, match) => {
                            if (err) {
                                return done(err);
                            } else if (!match) {
                            return done(null, false, { message: 'Invalid password '});
                        } else {
                            return done(null, users[0]);
                        }
                    });
                    } else {
                        return done (null, false, { message: 'Invalid username ' + username })
                    }
                }
            });
        }
    ));
}