import LocalStrategy from 'passport-local';
import User from '../../models/User';

export default function (passport) {
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        function(username, password, done) {
            User.filter({originalId: username}).then(function (cursor) {
                return cursor.toArray ? cursor.toArray(cb) : cb(cursor);
                function cb (users) {
                    var user = users[0];
                    if (user) {
                        user.verifyPassword(password, (err, match) => {
                            if (err) {
                                return done(err);
                            } else if (!match) {
                            return done(null, false, { message: 'Invalid password '});
                        } else {
                            return done(null, user);
                        }
                    });
                    } else {
                        return done (null, false, { message: 'Invalid username \`' + username + '\`'});
                    }
                }
            });
        }
    ));
}