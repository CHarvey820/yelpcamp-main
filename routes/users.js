const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const usersController = require('../controllers/usersController.js');
const passport = require('passport');
const { storeReturnTo } = require('../utils/middleware');

/** user registration form; POST new user */
router.route('/register')
    .get(usersController.renderRegister)
    .post(catchAsync(usersController.createUser))

/** user login page; POST user login info */
    router.route('/login')
    .get(usersController.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), usersController.loginUser)

/** logout user */
router.get('/logout', usersController.logoutUser);

module.exports = router;