import {rdbStore} from './rethink';
import session from 'express-session';

export default (app) => {
    var newSession = session({
        resave: true,
        secret: 'my5uperSEC537(key)!',
        saveUninitialized: true,
        cookie: { maxAge: 860000 },
        store: rdbStore
    })
    app.use(newSession);
    return newSession;
};