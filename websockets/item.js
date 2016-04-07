/*jshint node:true */
'use strict';

import Item from '../models/Item';

export default (io) => {
    Item.changes().then(function (feed) {
        feed.each(function (error, doc) {
            if (error) {
                console.log(error);
                process.exit(1);
            }
            if (doc.isSaved() === false) {
                console.log("The following document was deleted:");
                console.log(doc);
                io.emit('delete', {data: doc})
            }
            else if (doc.getOldValue() == null) {
                console.log("A new document was inserted:");
                console.log(doc);
                io.emit('insert', {data: doc})
            }
            else {
                console.log("A document was updated.");
                console.log("Old value:");
                console.log(doc.getOldValue());
                console.log("New value:");
                console.log(doc);
                io.emit('update', {
                    oldData: doc.getOldValue(),
                    newData: doc
                })
            }
        });
    }).error(function (error) {
        console.log(error);
        process.exit(1);
    });
}