import item from './item'
import auth from './auth'
export default (app) => {
    app.get('/', (req, res) => {
        console.log(req.user);
        res.render('index', {
        title: "Home page",
        user: req.user
    });
});
    ;
    item(app);
}
;