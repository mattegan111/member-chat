const { body, validationResult} = require('express-validator');
const Message = require('../models/message');

exports.message_form_get = function(req, res, done) {
    res.render('message_form', {user: res.locals.currentUser});
};

exports.message_form_post = [
    // res.render('member_form', {user: res.locals.currentUser});

    body('header', 'A header is required.').trim().isLength({min: 1, max: 40}).escape(),
    body('body', 'A message body is required.').trim().isLength({min: 1, max: 160}).escape(),

    (req, res, done) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('message_form', {
                // TODO Add error message for render
            });
        }
        else {
            const messageInstance = new Message(
                {
                    header: req.body.header,
                    body: req.body.body,
                    user: res.locals.currentUser._id,
                    timestamp: Date.now(),
                }
            );
            messageInstance.save(function (err) {
                if (err) { return done(err); }
                res.redirect('/');
            });
        };
    }
];

