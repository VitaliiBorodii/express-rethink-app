import rdbStore from './rethink';
import session from 'express-session';

export default (app) => {
    app.use(session({
        key: 'sid',
        secret: 'my5uperSEC537(key)!',
        cookie: { maxAge: 860000 },
        store: rdbStore
    }));
    return session;
};