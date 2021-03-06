'use strict';

import config from './config';
import expressSession from 'express-session';
import RDBStore from 'express-session-rethinkdb';
var Store = RDBStore(expressSession);

const rdbStore = new Store({
    connectOptions: {
        servers: [
            { host: config.get('rethink:host'), port: config.get('rethink:port')}
        ],
        db: config.get('rethink:db'),
        discovery: false,
        pool: true,
        buffer: 50,
        max: 1000,
        timeout: 20,
        timeoutError: 1000
    },
    table: 'sessions',
    sessionTimeout: 86400000,
    flushInterval: 60000,
    debug: false
});

var session = expressSession({
    resave: false,
    secret: 'my5uperSEC537(key)!',
    saveUninitialized: true,
    rolling: true,
    cookie: {
        secure : true,
        maxAge: 86400000
    },
    store: rdbStore
});

export default session;