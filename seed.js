/*jshint node:true */
'use strict';

import r from 'rethinkdb';
import config from './libs/config';
import rInit from 'rethinkdb-init';
rInit(r);

r.init({
    host: config.get('rethink:host'),
    port: config.get('rethink:port'),
    db: config.get('rethink:db')
}, [
    {
        name: 'items',
        indexes: ['id']
    },
    'session',
    {
        name: 'users',
        indexes: ['originalId', 'id']
    }
])
.then(function (conn) {
    console.log("All tables and indexes have been created");
    conn.close();
});