'use strict';

var authController = {};
authController.getUser = function (req, res) {
    if (req.user && req.user.id) {
        return res.json(req.user);
    }
    res.status(400).json(null);
};
authController.logout = function (req, res) {
    req.logout();
    res.redirect('/');
};

authController.login = function (req, res) {
    res.redirect('/');
};

export default authController;