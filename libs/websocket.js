import sharedsession  from "express-socket.io-session";
import Item from '../models/Item'
export default function (io, session) {
    io.use(sharedsession(session, {
        autoSave: true,
        resave: true,
        saveUninitialized: true
    }));
    Item.changes().then(function(feed) {
        feed.each(function(error, doc) {
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
    }).error(function(error) {
        console.log(error);
        process.exit(1);
    });
    io.on('connection', (socket) => {
        console.log('user joined!');
        });
    return io;
};