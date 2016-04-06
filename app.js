import express from 'express';
import path from 'path';
import fs from 'fs';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import engine from 'express-dot-engine';
import http from 'http';
import io from 'socket.io';
import auth from './routes/auth'
import config from './libs/config';
import db from './libs/rethink';
import session from './libs/session';
import routes from './routes';
import websocket from './libs/websocket';
import authRouter from './routes/auth/auth-router'
var app = express();
var port = config.get('server:port');
var ip = config.get('server:ip');

app.set('port', port);
app.set('ip', ip);
var server = http.Server(app);
// view engine setup
app.engine('dot', engine.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dot');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//routes and session
app.use(session).use(auth.initialize()).use(auth.session());
routes(app);
app.use('/auth', authRouter);

//websocket
var socket = io(server);
var ws = websocket(socket);

app.use(express.static('public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

var dev = (app.get('env') === 'development');
//error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.format({
        text: function () {
            res.send(err.message);
        },
        html: function () {
            err.stack = dev ? err.stack : '';
            res.render('error', {
                title: 'Error',
                message: err.message,
                error: err
            });
        },
        json: function () {
            res.send({content: err.message, success: false});
        }
    });
});
server.listen(port, ip, function () {
    console.log("✔ Server listening at http://%s:%d ", ip, port);
});

export default app;