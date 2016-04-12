'use strict';

import Message from '../models/Message';
import thinky from '../libs/rethink';
var r = thinky.r;
export default (io) => {
    io.on('message', function (data) {
        console.log('received message for client');
        socket.emit('news', { hello: 'world' });
    });
    io.sockets.on('connection', function (socket) {
        console.log('added handler for "chat_join"');

        socket.on('chat_join', function(data) {
        console.log(data);
            if (data.receiver) {
                subscribeToMessages(data.receiver, function (error, doc) {
                    if (error) {
                        console.log(error);
                        process.exit(1);
                    }
                    if (doc.isSaved() === false) {
                        console.log('delete message', doc);
                        socket.emit('delete_message', {data: doc});
                    }
                    else if (doc.getOldValue() === null) {
                        socket.emit('new_message', {data: doc});
                        console.log('insert message', doc);

                    }
                    else {
                        console.log('update message', {
                            oldData: doc.getOldValue(),
                            newData: doc
                        });
                        socket.emit('update_message', {
                            oldData: doc.getOldValue(),
                            newData: doc
                        });
                    }
                }, function (result) {
                    socket.emit('fetch_messages', {
                        data: result
                    });
                });
            }
        });
    });
    function subscribeToMessages (receiver_id, cb, cbR) {
        Message.filter(r.row("receiver_id").eq(receiver_id).or(r.row("sender_id").eq(receiver_id))).then((result) => {
            cbR(result)
        });
        Message.filter(r.row("receiver_id").eq(receiver_id).or(r.row("sender_id").eq(receiver_id))).changes().then(function (feed) {
            feed.each(cb);
        }).error(function (error) {
            console.log(error);
            process.exit(1);
        });
    }
};