const async = require('async');
const { body, validationResult} = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.index = function(req, res, done) {
    res.render('index', { title: 'Member Chat', user: res.locals.currentUser });
};

exports.user_create_get = function(req, res, done) {
    res.render('sign_up');
};

exports.user_create_post = [
    
    body('first_name', 'First Name is required.').trim().isLength({min: 1, max: 100}).escape(),
    body('last_name', 'First Name is required.').trim().isLength({min: 1, max: 100}).escape(),
    body('email', 'Email is required.'),
    body('password', 'Password must be at least 6 characters.').isLength({min: 6}).escape(),
    body('confirm_password', 'Password must be at least 6 characters.')
    .isLength({min: 6})
    .escape()
    .custom(async (value, { req }) => {
        // Use the custom method w/ a CB func to ensure that both passwords match, return an error if so
        if (value !== req.body.password) throw new Error('Passwords must be the same');
        return true;
    }),
    
    (req, res, done) => {
        const errors = validationResult(req);
        console.log(errors);
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if(err){
                return res.render('sign_up');
            }
            else{
                const userInstance = new User(
                    {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        email: req.body.email,
                        password: hashedPassword,
                        member: false,
                        admin: false
                    }
                );

                if (!errors.isEmpty()) {
                    res.render('sign_up', { 
                        first_name: userInstance.first_name, 
                        last_name: userInstance.last_name, 
                        email: userInstance.email,
                        passwordConfirmationError: 'Passwords must be the same'
                    });
                }
                else {
                    userInstance.save(function (err) {
                        if (err) { return done(err); }
                        res.redirect('/')
                    })
                }
            }
        });
    }
];

exports.user_sign_in_get = function(req, res, done) {
    res.render('sign_in');
};

exports.user_sign_in_post = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/sign-in'
});

exports.user_sign_out_get = function(req, res, done) {
    res.render('index', { user: null });
}

exports.member_form_get = function(req, res, done) {
    res.render('member_form', {user: res.locals.currentUser});
};

exports.member_form_post = [

    body('secret_code', 'Field is required').isLength({min: 1, max: 100})
    .custom((value) => {
        if (value != 'letmein') {
            throw new Error('Incorrect code');
        }
        return true;
    }),
    
    async (req, res, done) => {
        const errors = validationResult(req);
        console.log(errors);

        if (!errors.isEmpty()) {
            // console.log('!errors.isEmpty()'); //TODO delete
            res.render('member_form', { codeConfirmationError: errors });
        }
        else {
            console.log('update user in DB');

            // Create User object with local currentUser data
            const user = new User({
                _id: res.locals.currentUser._id,
                email: res.locals.currentUser.email,
                password: res.locals.currentUser.password,
                first_name: res.locals.currentUser.first_name,
                last_name: res.locals.currentUser.last_name,
                member: true,
                admin: res.locals.currentUser.admin,
            });

            User.findByIdAndUpdate(res.locals.currentUser._id, user, {}, function (err, theuser){
                if (err) { return done(err); }
                console.log(theuser); //TODO Delete
                res.redirect('/');
            });
        }
    }
];