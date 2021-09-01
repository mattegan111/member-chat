const async = require('async');
const { body, validationResult} = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.index = function(req, res, done) {
    res.render('index', { title: 'Member Chat', user: req.user });
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

exports.user_sign_in_post = function(req, res, done) {
    res.render('index');
};

exports.member_form_get = function(req, res, done) {
    res.render('member_form');
};

exports.member_form_post = [


    (req, res, done) => {
        body('secret_code', 'Enter the secret code to become a member')
        .custom(async (value, {req}) =>{
            if (value != 'letmein') {
                throw new Error('Incorrect code')
            }
            else {
                if (!errors.isEmpty()){
                    res.render('member_form', { codeError: 'Incorrect code' });
                }
                else {
                    console.log(req);
                    // TODO implement update current user to member
                    // userInstance.save(function (err) {
                        // if (err) { return done(err); }
                        res.redirect('/');
                    // });
                }
            }

        })
        res.render('');
    }
    
    // body('first_name', 'First Name is required.').trim().isLength({min: 1, max: 100}).escape(),
    // body('last_name', 'First Name is required.').trim().isLength({min: 1, max: 100}).escape(),
    // body('email', 'Email is required.'),
    // body('password', 'Password must be at least 6 characters.').isLength({min: 6}).escape(),
    // body('confirm_password', 'Password must be at least 6 characters.')
    // .isLength({min: 6})
    // .escape()
    // .custom(async (value, { req }) => {
    //     // Use the custom method w/ a CB func to ensure that both passwords match, return an error if so
    //     if (value !== req.body.password) throw new Error('Passwords must be the same');
    //     return true;
    // }),
    
    // (req, res, done) => {
    //     const errors = validationResult(req);
    //     bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    //         if(err){
    //             return res.render('sign_up');
    //         }
    //         else{
    //             const userInstance = new UserInstance(
    //                 {
    //                     first_name: req.body.first_name,
    //                     last_name: req.body.last_name,
    //                     email: req.body.email,
    //                     password: hashedPassword,
    //                     member: false,
    //                     admin: false
    //                 }
    //             );

    //             if (!errors.isEmpty()) {
    //                 res.render('sign_up', { 
    //                     first_name: userInstance.first_name, 
    //                     last_name: userInstance.last_name, 
    //                     email: userInstance.email,
    //                     passwordConfirmationError: "Passwords must be the same"
    //                 });
    //             }
    //             else {
    //                 userInstance.save(function (err) {
    //                     if (err) { return done(err); }
    //                     res.redirect('/')
    //                 })
    //             }
    //         }
    //     });
    // }
];