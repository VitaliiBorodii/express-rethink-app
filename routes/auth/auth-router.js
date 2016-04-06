/*jshint node:true */
'use strict';

import express from 'express';
import authControllers from './auth-controller';

import auth from './index';
var authRouter = express.Router();

// GitHub
authRouter.use('/login/callback/github', auth.authenticate('github'), authControllers.login);
authRouter.get('/login/github', auth.authenticate('github'));

// All
authRouter.use('/user', authControllers.getUser);
authRouter.use('/logout', authControllers.logout);

export default authRouter;
