const express = require('express');
const router = express.Router();


// Require controller modules
const user_controller = require('../controllers/userController');
const message_controller = require('../controllers/messageController');

// GET home page
router.get('/', user_controller.index);

// GET sign up page
router.get('/sign-up', user_controller.user_create_get);

// POST request for creating a User
router.post('/sign-up', user_controller.user_create_post);

// GET sign in page
router.get('/sign-in', user_controller.user_sign_in_get);

// POST sign in page
router.post('/sign-in', user_controller.user_sign_in_post);

// GET sign out
router.get('/sign-out', user_controller.user_sign_out_get);

// GET member form page
router.get('/become-a-member', user_controller.member_form_get);

// POST member form page
router.post('/become-a-member', user_controller.member_form_post);

// GET admin form page
router.get('/become-an-admin', user_controller.admin_form_get);

// POST member form page
router.post('/become-an-admin', user_controller.admin_form_post);

// GET message form page
router.get('/post-a-message', message_controller.message_form_get);

// POST message form page
router.post('/post-a-message', message_controller.message_form_post);


module.exports = router;
