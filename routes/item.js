import Item from '../models/Item';

export default function (app) {
    app.get('/items', function (req, res) {
        Item.run().then(function (result) {
            res.json(result);
        });
    });
    app.post('/items', function (req, res) {
        var item = new Item(req.body);
        item.save(req.body).then(function (result) {
            res.json(result);
        });
    });
}