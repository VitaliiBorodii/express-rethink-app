import r from 'rethinkdb';
import config from './libs/config';
import rInit from 'rethinkdb-init';
rInit(r);

r.init({
    host: config.get('rethink:host'),
    port: config.get('rethink:port'),
    db: config.get('rethink:db')
}, [
    'items',
    'session',
    {
        name: 'users',
        indexes: ['originalId']
    }
])
.then(function (conn) {
    console.log("All tables and indexes have been created");
    conn.close();
});