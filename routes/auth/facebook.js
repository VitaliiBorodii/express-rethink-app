/*jshint node:true */
'use strict';

import config from '../../libs/config';
import facebookPassport from 'passport-facebook';
var FacebookStrategy = facebookPassport.Strategy;

export default function (passport, handler) {
    var callbackURL = 'http://fb9461e3.ngrok.io/auth/login/callback/facebook';
    passport.use(new FacebookStrategy({
            clientID: config.get('facebook:clientID'),
            clientSecret: config.get('facebook:clientSecret'),
            callbackURL: callbackURL,
            profileFields: ['id', 'displayName', 'photos', 'first_name', 'link', 'last_name', 'email']
        },
        handler(function (profile) {
            return {
                'originalId': profile.id,
                'login': profile.username,
                'name': profile.displayName || null,
                'url': profile.profileUrl,
                'avatarUrl': profile.photos[0] ? profile.photos[0].value : null,
                'type': 'facebook'
            };
        }, 'facebook')));
}