'use strict';

import sharedsession  from "express-socket.io-session";
import session from './session';
import item from '../websockets/item';
//import chat from '../websockets/chat';
import messages from '../websockets/message';
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
    messages(io);
    //chat(io);
    return io;
}