import User from '../../models/User';

export function signIn (req, res, next) {
    var user,
        username = req.body.username,
        password = req.body.password,
        passwordRepeat = req.body['password-repeat'];
    if (password && passwordRepeat && (password === passwordRepeat)) {
        User.getAll(username, { index: 'originalId' }).then((results) => {
            if (results.length) {
            res.render('signin', {
                title: 'Sign In',
                error: 'Username is already taken'
            });
        } else {
            user = new User({
                originalId: username,
                name: username,
                hashedPassword: password,
                role: 'user',
                type: 'local'
            });
            user.creteWithPassword((err) => {
                if (err) {
                    return next(err);
                }
                user.save().then(function () {
                res.redirect('login');
            });
        });
        }
        });
    } else {
        if (!password || !passwordRepeat) {
            res.render('signin', {
                title: 'Sign In',
                error: 'Password cannot be empty'
            });
        } else if (password !== passwordRepeat) {
            res.render('signin', {
                title: 'Sign In',
                error: 'Passwords do not math'
            });
        }
    }
}