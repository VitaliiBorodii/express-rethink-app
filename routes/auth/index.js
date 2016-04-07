/*jshint node:true */
'use strict';

import config from 'nconf';
import passport from 'passport';
import githubPassport from 'passport-github';
import facebookPassport from 'passport-facebook';

import thinky from '../../libs/rethink';
import User from '../../models/User'
var GitHubStrategy = githubPassport.Strategy;
var FacebookStrategy = facebookPassport.Strategy;

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
                .getAll(profile.id, { index: 'originalId' })
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
        clientID: config.get('github:clientID'),
        clientSecret: config.get('github:clientSecret'),
        callbackURL: callbackURL + '/github'
    },
    loginCallbackHandler(function (profile) {
        return {
            'originalId': profile.id,
            'login': profile.username,
            'name': profile.displayName || null,
            'url': profile.profileUrl,
            'avatarUrl': profile._json.avatar_url,
            'type': 'github'
        };
    }, 'github')
));

passport.use(new FacebookStrategy({
        clientID: config.get('facebook:clientID'),
        clientSecret: config.get('facebook:clientSecret'),
        callbackURL: 'http://fb9461e3.ngrok.io/auth/login/callback/facebook',
        profileFields: ['id', 'displayName', 'photos', 'first_name', 'link', 'last_name', 'email']
    },
    loginCallbackHandler(function (profile) {
        return {
            'originalId': profile.id,
            'login': profile.username,
            'name': profile.displayName || null,
            'url': profile.profileUrl,
            'avatarUrl': profile.photos[0] ? profile.photos[0].value : null,
            'type': 'facebook'
        };
    }, 'facebook')));


passport.checkIfLoggedIn = function (req, res, next) {
    if (req.user) {
        return next();
    }
    return res.status(401).send('You\'re not logged in');
};

export default passport;
