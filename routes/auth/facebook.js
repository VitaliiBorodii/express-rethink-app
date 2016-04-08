'use strict';

import config from '../../libs/config';
import facebookPassport from 'passport-facebook';
var FacebookStrategy = facebookPassport.Strategy;

export default function (passport, handler) {
    var callbackURL = 'http://fb9461e3.ngrok.io/auth/login/callback/facebook';
    if (config.get('facebook:clientID')) {
        passport.use(new FacebookStrategy({
                clientID: config.get('facebook:clientID'),
                clientSecret: config.get('facebook:clientSecret'),
                callbackURL: callbackURL,
                profileFields: ['id', 'displayName', 'picture', 'first_name', 'link', 'last_name', 'email']
            },
            handler(function (profile) {
                return {
                    'originalId': profile.id,
                    'login': profile.username,
                    'email': profile._json.email || null,
                    'name': profile.displayName || null,
                    'url': profile.profileUrl,
                    'avatarUrl': profile._json.picture.data.url,
                    'type': 'facebook'
                };
            }, 'facebook')));
    }
}