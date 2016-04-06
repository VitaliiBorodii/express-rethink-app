/*jshint node:true */
'use strict';

import config from 'nconf';
import passport from 'passport';
import githubPassport from 'passport-github';
import thinky from '../../libs/rethink';
import User from '../../models/User'
var GitHubStrategy = githubPassport.Strategy;

passport.serializeUser(function (user, done) {
    return done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User
        .get(id)
        .then(function (user) {
            done(null, user);
        });
});

var loginCallbackHandler = function (objectMapper, type) {
    return function (accessToken, refreshToken, profile, done) {
        if (accessToken !== null) {
            User
                .getAll(profile.username, { index: 'login' })
                .filter({ type: type })
                .then(function (cursor) {
                    return (cursor.toArray) ? cursor.toArray()
                        .then(cb) : cb(cursor);
                    function cb (users) {
                        if (users.length > 0) {
                            return done(null, users[0]);
                        }
                        return User
                            .insert(objectMapper(profile))
                            .then(function (response) {
                                return User
                                    .get(response.generated_keys[0])
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
