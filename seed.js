'use strict';

import rethinkdbdash from 'rethinkdbdash';
var r = rethinkdbdash({pool: false});

import config from './libs/config';
import rInit from 'rethinkdb-init';
rInit(r);

r.init({
    host: config.get('rethink:host'),
    port: config.get('rethink:port'),
    db: config.get('rethink:db')
}, [
    {
        name: 'items'
    },
    'sessions',
    {
        name: 'users',
        indexes: ['originalId']
    },
    {
        name: 'messages',
        indexes: ['createdAt']
    }
])
.then(function (conn) {
    console.log("All tables and indexes have been created");
    conn.close();
});