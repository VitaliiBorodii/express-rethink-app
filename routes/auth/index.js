'use strict';

import passport from 'passport';
import github from './github';
import User from '../../models/User';
import facebook from './facebook';
import local from './local';
github(passport, loginCallbackHandler);
facebook(passport, loginCallbackHandler);
local(passport, loginCallbackHandler);
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
                        var userToCreate = objectMapper(profile);
                        userToCreate.role = 'user';
                        return User
                            .insert(userToCreate)
                            .then(function (response) {
                                return User
                                    .get(response.generated_keys[0]);
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
}


passport.checkIfLoggedIn = function (req, res, next) {
    if (req.user) {
        return next();
    }
    return res.status(401).send('You\'re not logged in');
};

export default passport;
