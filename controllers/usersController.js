const User = require('../models/user');

/** Controller file for users methods */

/** render user registration form */
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

/** create a new User in DB */
module.exports.createUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registredUser = await User.register(user, password);
        req.login(registredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

/** render user login page */
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

/** login user  */
module.exports.loginUser = (req, res) => {
    req.flash('success', 'Logged in to Yelp Camp!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

/** logout user */
module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged Out!');
        res.redirect('/campgrounds');
    });
}