import config from './config';
import session from 'express-session';
import RDBStore from 'express-session-rethinkdb';
var Store = RDBStore(session);

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
    table: 'session',
    sessionTimeout: 86400000,
    flushInterval: 60000,
    debug: false
});

export default (app) => {
    var newSession = session({
        resave: true,
        secret: 'my5uperSEC537(key)!',
        saveUninitialized: true,
        cookie: { maxAge: 860000 },
        store: rdbStore
    });
    app.use(newSession);
    return newSession;
};