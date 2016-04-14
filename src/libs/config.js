'use strict';

import nconf from 'nconf';
var env = process.env;
nconf.argv()
    .env()
    .file({file: 'config/development.json'});
nconf.defaults({
    server: {
        port : env.NODE_PORT || 1337,
        ip: env.NODE_IP || "127.0.0.1"
    },
    rethink: {
        host: env.RETHINK_HOST || "127.0.0.1",
        port: env.RETHINK_PORT || 28015,
        db: env.RETHINK_DBNAME || 'test'
    },
    corsWhitelist: []
});

export default nconf;