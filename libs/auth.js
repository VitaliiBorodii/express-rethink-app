export default function (req, res, next) {
    "use strict";
    var authenticated = req.isAuthenticated();
    return authenticated ? next() : res.status(401).send('Need Authorization');
}