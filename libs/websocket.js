'use strict';

import sharedsession  from "express-socket.io-session";
import session from './session';
import item from '../websockets/item';

export default function (io) {
    io.use(sharedsession(session, {
        autoSave: true,
        resave: true,
        saveUninitialized: true
    }));
    io.on('connection', () => {
        console.log('user joined!');
        });
    item(io);
    return io;
}