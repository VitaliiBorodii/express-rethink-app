'use strict';

import Message from '../models/Message';
import thinky from '../libs/rethink';
var r = thinky.r;
export default (io) => {
    function subscribeToMessages (receiver_id) => {
        Message.filter(r.row("receiver_id").eq(receiver_id).or(r.row("sender_id").eq(receiver_id))).changes().then(function (feed) {
            feed.each(function (error, doc) {
                if (error) {
                    console.log(error);
                    process.exit(1);
                }
                if (doc.isSaved() === false) {
                    console.log('delete message', doc);
                    io.emit('delete_message', {data: doc});
                }
                else if (doc.getOldValue() === null) {
                    io.emit('new_message', {data: doc});
                    console.log('insert message', doc);

                }
                else {
                    console.log('update message', {
                        oldData: doc.getOldValue(),
                        newData: doc
                    });
                    io.emit('update_message', {
                        oldData: doc.getOldValue(),
                        newData: doc
                    });
                }
            });
        }).error(function (error) {
            console.log(error);
            process.exit(1);
        });
    }
};