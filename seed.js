'use strict';

var rethinkdbdash = require('rethinkdbdash');
var config = require('./config/development.json');
var rInit = require('rethinkdb-init');
var r = rethinkdbdash({pool: false});
rInit(r);

r.init({
    host: config.rethink.host,
    port: config.rethink.port,
    db: config.rethink.db
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