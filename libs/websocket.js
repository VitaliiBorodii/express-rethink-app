import sharedsession  from "express-socket.io-session";
function connect(socket) {
    console.log('user joined!')
};

export default function (socket, session) {
    socket.use(sharedsession(session, {
        autoSave: true
    }));
    socket.on('connection', connect);
    return socket;
};