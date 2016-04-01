export default (app) => {
    app.get('/items', (req, res) => {
        console.log('get all items');
        res.status(200).send([]);
    });
}