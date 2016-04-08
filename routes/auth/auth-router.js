'use strict';

import express from 'express';
import authControllers from './auth-controller';
import connectFlash from 'connect-flash';
import auth from './index';
var authRouter = express.Router();

authRouter.use(connectFlash());
//Local
authRouter.get('/login', function(req, res) {
        res.render('login', {
            title: 'Login',
            error: req.flash('error')
        });
    });
authRouter.post('/login', auth.authenticate('local', { failureRedirect: '/auth/login', failureFlash: true }),
    function(req, res) {
        res.redirect('/');
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
