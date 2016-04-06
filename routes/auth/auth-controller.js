var authController = {};
authController.getUser = function (req, res) {
    if (req.user && req.user.id) {
        res.json(req.user);
        return;
    }
    res.status(400).json(null);
};
authController.logout = function (req, res) {
    console.log('logout', req.isUnAuthenticated);
    req.logout();
    res.redirect('/');
};

authController.login = function (req, res) {
    console.log('login', req.isAuthenticated());
    res.redirect('/');
};

export default authController;