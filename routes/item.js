import Item from '../models/Item';

export default function (app) {
    app.get('/items', function (req, res) {
        Item.run().then(function (result) {
            res.json(result);
        });
    });
    app.get('/items/:id', function (req, res) {
        Item.get(req.params.id).run().then(function (result) {
            res.json(result);
        });
    });
    app.post('/items', function (req, res) {
        var item = new Item(req.body);
        item.save(req.body).then(function (result) {
            res.json(result);
        });
    });
    app.put('/items/:id', function (req, res) {
        Item.get(req.params.id).update(req.body).then(function (result) {
            res.json(result);
        });
    });
    app.delete('/items/:id', function (req, res) {
        Item.get(req.params.id).delete().then(function (result) {
            res.json(result);
        });
    });
}