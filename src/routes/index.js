'use strict';

import ItemRouter from './items';
import authRouter from './auth/auth-router';
import MessageRouter from './messages';

export default (app) => {
    app.get('/', (req, res) => {
        res.render('index', {
        title: "Home page",
        user: req.user
        });
    });
    app.use('/auth', authRouter);
    app.use('/items', ItemRouter);
    app.use('/messages', MessageRouter);
};