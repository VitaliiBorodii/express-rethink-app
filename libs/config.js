import nconf from 'nconf';
var env = process.env;
nconf.argv()
    .env()
   // .file({file: './main.json'});
nconf.defaults({
    server: {
        port : env.PORT || 1337,
        ip: "127.0.0.1"
    },
    rethink: {
        connectOptions: {
        servers: [
            { host: '127.0.0.1', port: 28015 }
        ],
        db: 'dev',
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
    }
});

export default nconf;