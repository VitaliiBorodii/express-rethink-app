import session from 'express-session';
import r from 'rethinkdb';
import RDBStore from 'express-session-rethinkdb';
import config from 'nconf';
var Store = RDBStore(session);
r.connect(config.get('rethink'), (err, conn) => {
    if (err) {
        throw err
    } else {
        console.log('connection to DB has been successfully established')
    }
});
var rdbStore = new Store(config.get('rethink'));

export default rdbStore;