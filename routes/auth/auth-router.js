'use strict';

import express from 'express';
import authControllers from './auth-controller';
import auth from './index';
import {signIn} from './signin';
var authRouter = express.Router();

//Local
authRouter.get('/login', (req, res) => {
        res.render('login', {
            title: 'Login'
        });
    });

authRouter.get('/sign_in', (req, res) => {
    res.render('signin', {
        title: 'Sign In'
    });
});

authRouter.post('/sign_in', signIn);

authRouter.post('/login', (req, res, next) => {
    auth.authenticate('local',
        (err, user, info) => {
            return err ? next(err) : (user ? req.logIn(user, (err) => {
                return err ? next(err) : res.redirect('/');
            }) : res.render('login', {
                title: 'Login',
                error: info ? (info.message || '') : ''
            }));
        }
    )(req, res, next);
});

// GitHub
authRouter.use('/login/callback/github', auth.authenticate('github'), authControllers.login);
authRouter.get('/login/github', auth.authenticate('github'));

//FaceBook
authRouter.get('/login/facebook', auth.authenticate('facebook',
    { scope: ['email', 'public_profile', 'user_location', 'user_photos', 'user_birthday'] }));
authRouter.use('/login/callback/facebook', auth.authenticate('facebook'), authControllers.login);


// All
authRouter.use('/user', authControllers.getUser);
authRouter.use('/logout', authControllers.logout);

export default authRouter;
