'use strict';

import Message from '../models/Message';
//import thinky from '../libs/rethink';
export default (io) => {
    io.sockets.on('connection', (socket) => {
        var feed;
        socket.on('chat_join', (data) => {
        console.log(data);
            if (data.receiver && data.sender) {
                subscribeToMessages(data.sender, data.receiver, (f) => {
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
                            console.log('update message', {
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
        });
        socket.on('disconnect', () => {
            if (feed) {
                feed.close();
            }
        });
    });
    function subscribeToMessages (sender_id, receiver_id, cb, cbR) {
        query(sender_id, receiver_id).then((result) => {
            cbR(result);
        });
        query(sender_id, receiver_id).changes().then((feed) => {
            feed.each(cb(feed));
        }).error((error) => {
            console.log(error);
            process.exit(1);
        });
    }
    function query (sender_id, receiver_id) {
        return Message.filter((msg) => {
            return (msg("receiver_id").eq(receiver_id)
                .and(msg("sender_id").eq(sender_id)))
                .or(msg("receiver_id").eq(sender_id)
                    .and(msg("sender_id").eq(receiver_id)));
        });
    }
};