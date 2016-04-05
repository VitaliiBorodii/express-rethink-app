import item from './item'

export default (app) => {
    app.get('/', (req, res) => {
        res.render('index', {
        title: "Home page"
    })
    });
    item(app);
}