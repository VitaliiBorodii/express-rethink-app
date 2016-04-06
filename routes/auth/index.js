/*jshint node:true */
'use strict';

import config from 'nconf';
import passport from 'passport';
import githubPassport from 'passport-github';
import thinky from '../../libs/rethink';
var r = thinky.r;
var GitHubStrategy = githubPassport.Strategy;

passport.serializeUser(function (user, done) {
    return done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    r
        .table('users')
        .get(id)
        .run(r.conn)
        .then(function (user) {
            done(null, user);
        });
});

var loginCallbackHandler = function (objectMapper, type) {
    return function (accessToken, refreshToken, profile, done) {
        if (accessToken !== null) {
            r
                .table('users')
                .getAll(profile.username, { index: 'login' })
                .filter({ type: type })
                .run(r.conn)
                .then(function (cursor) {
                    return (cursor.toArray) ? cursor.toArray()
                        .then(cb) : cb(cursor);
                    function cb (users) {
                        if (users.length > 0) {
                            return done(null, users[0]);
                        }
                        return r.table('users')
                            .insert(objectMapper(profile))
                            .run(r.conn)
                            .then(function (response) {
                                return r.table('users')
                                    .get(response.generated_keys[0])
                                    .run(r.conn);
                            })
                            .then(function (newUser) {
                                done(null, newUser);
                            });
                    }
                })
                .catch(function (err) {
                    console.log('Error Getting User', err);
                });
        }
    };
};
var callbackURL = 'http://' + config.get('server:ip') + ':' + config.get('server:port') + '/auth/login/callback';

// Github
passport.use(new GitHubStrategy({
        clientID: config.get('github').clientID,
        clientSecret: config.get('github').clientSecret,
        callbackURL: callbackURL + '/github'
    },
    loginCallbackHandler(function (profile) {
        return {
            'login': profile.username,
            'name': profile.displayName || null,
            'url': profile.profileUrl,
            'avatarUrl': profile._json.avatar_url,
            'type': 'github'
        };
    }, 'github')
));


passport.checkIfLoggedIn = function (req, res, next) {
    if (req.user) {
        return next();
    }
    return res.status(401).send('You\'re not logged in');
};

export default passport;
