import session from 'express-session';
import RDBStore from 'express-session-rethinkdb';
import config from 'nconf';
import thinkyLib from 'thinky';
var Store = RDBStore(session);
var rethinkConfig = config.get('rethink');
export default thinkyLib({
    host: rethinkConfig.connectOptions.servers[0].host,
    port: rethinkConfig.connectOptions.servers[0].port,
    db: rethinkConfig.connectOptions.db
});
export const rdbStore = new Store(rethinkConfig);