/*jshint node:true */
'use strict';

import express from 'express';
import Item from '../models/Item';
import cors from '../libs/cors'
var ItemsRouter = express.Router();

ItemsRouter.use('/', cors);

ItemsRouter.get('/', (req, res) => {
    Item.run().then(function (result) {
        res.json(result);
    });
});
ItemsRouter.get('/:id', (req, res) => {
    Item.get(req.params.id).run().then(function (result) {
        res.json(result);
    });
});
ItemsRouter.post('/', (req, res) => {
    var item = new Item(req.body);
    item.save(req.body).then(function (result) {
        res.json(result);
    });
});
ItemsRouter.put('/:id', (req, res) => {
    Item.get(req.params.id).update(req.body).then(function (result) {
        res.json(result);
    });
});
ItemsRouter.delete('/:id', (req, res) => {
    Item.get(req.params.id).delete().then(function (result) {
        res.json(result);
    });
});

export default ItemsRouter;
