'use strict';

import Message from '../models/Message';
import thinky from '../libs/rethink';
var r = thinky.r;
export default (io) => {
    io.sockets.on('connection', (socket) => {
        var feed;
        var user = socket.handshake.session.passport ? socket.handshake.session.passport.user : null;
        if (user) {
            subscribeToMessages(user, (f) => {
                feed = f;
                return (error, doc) => {
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
                        console.log('update_message', {
                            oldData: doc.getOldValue(),
                            newData: doc
                        });
                        socket.emit('update_message', {
                            oldData: doc.getOldValue(),
                            newData: doc
                        });
                    }
                };
            }, (result) => {
                socket.emit('fetch_messages', {
                    data: result
                });
            });
        }
        socket.on('disconnect', () => {
            if (feed) {
                feed.close();
            }
        });
    });
    function subscribeToMessages (user_id, cb, cbR) {
        query(user_id).orderBy('date', r.desc('createdAt')).limit(50).then((result) => {
            cbR(result);
        });
        query(user_id).changes().then((feed) => {
            feed.each(cb(feed));
        }).error((error) => {
            console.log(error);
            process.exit(1);
        });
    }
    function query (user_id) {
        return Message.filter((msg) => {
            return (msg("receiver_id").eq(user_id)
                .or(msg("sender_id").eq(user_id)));
        });
    }
};