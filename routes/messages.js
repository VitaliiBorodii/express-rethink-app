'use strict';

import express from 'express';
import Message from '../models/Message';
import cors from '../libs/cors';
import auth from '../libs/auth';
import thinky from '../libs/rethink';

var MessageRouter = express.Router();
var r = thinky.r;

MessageRouter.use('/', cors);
MessageRouter.use('/', auth);
MessageRouter.get('/', (req, res) => {
    filter(Message, req.user).orderBy('date', r.desc('createdAt')).then(function (result) {
        res.json(result);
    });
});
MessageRouter.get('/:id', (req, res) => {
    filter(Message.get(req.params.id), req.user).then(function (result) {
        res.json(result);
    });
});
MessageRouter.post('/', (req, res) => {
    var data = {
        sender_id: req.user.id,
        receiver_id: req.body.receiver_id,
        title: req.body.title,
        content: req.body.content
    };
    var required = [];
    for (let key in data) {
        if (data[key] === undefined || data[key] === null) {
            required.push(key);
        }
    }
    if (required.length) {
        return res.status(400).json({required});
    }
    var message = new Message(data);
    message.save().then(function (result) {
        res.json(result);
    });
});
MessageRouter.put('/:id', (req, res) => {
    console.log({
        id: req.params.id,
        user_id: req.user.id
    });
    var data = {
        title: req.body.title,
        content: req.body.content
    };
    var required = [];
    for (let key in data) {
        if (data[key] === undefined || data[key] === null) {
            required.push(key);
        }
    }
    if (!required.length) {
        return res.status(400).json('`title` or `content` field is required');
    }
    Message.filter({
        id: req.params.id,
        sender_id: req.user.id
    }).update(data).then((result) => {
        if (!result || !result.length) {
            return res.status(404).end();
        }
        res.json(result);
    });
});
MessageRouter.delete('/:id', (req, res) => {
    Message.filter({
        id: req.params.id,
        sender_id: req.user.id
    }).delete().then(function (result) {
        if (!result.deleted) {
            return res.status(404).end();
        }
        return res.status(202).end();
    });
});

function filter (query, user) {
    return query.filter((msg) => {
        return (msg("receiver_id").eq(user.id)
            .or(msg("sender_id").eq(user.id)));
    });
}

export default MessageRouter;
