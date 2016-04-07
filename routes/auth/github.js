'use strict';

import config from '../../libs/config';
import githubPassport from 'passport-github';
var GitHubStrategy = githubPassport.Strategy;

export default function (passport, handler) {
    var callbackURL = 'http://' + config.get('server:ip') + ':' + config.get('server:port') + '/auth/login/callback';
    if (config.get('github:clientID')) {
        passport.use(new GitHubStrategy({
                clientID: config.get('github:clientID'),
                clientSecret: config.get('github:clientSecret'),
                callbackURL: callbackURL + '/github'
            },
            handler(function (profile) {
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
    }
}