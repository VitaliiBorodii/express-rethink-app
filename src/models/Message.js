'use strict';

import thinky from '../libs/rethink';

var type = thinky.type;
// Create a model - the table is automatically created
var Message =  thinky.createModel("messages", {
    id: type.string(),
    title: type.string(),
    content: type.string(),
    receiver_id: type.string(),
    sender_id: type.string(),
    createdAt: type.date().default(() => Date.now())
});

export default Message;

