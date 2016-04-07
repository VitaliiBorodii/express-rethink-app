/*jshint node:true */
'use strict';

import config from 'nconf';
import passport from 'passport';
import github from './github'
import thinky from '../../libs/rethink';
import User from '../../models/User';
import facebook from './facebook';

github(passport, loginCallbackHandler);
facebook(passport, loginCallbackHandler);

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

function loginCallbackHandler (objectMapper, type) {
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


passport.checkIfLoggedIn = function (req, res, next) {
    if (req.user) {
        return next();
    }
    return res.status(401).send('You\'re not logged in');
};

export default passport;
