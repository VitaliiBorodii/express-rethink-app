import ItemController from './items';
import authRouter from './auth/auth-router';

export default (app) => {
    app.get('/', (req, res) => {
        res.render('index', {
        title: "Home page",
        user: req.user
        });
    });
    app.use('/auth', authRouter);
    app.use('/items', ItemController);
};