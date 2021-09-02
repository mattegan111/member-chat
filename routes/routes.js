const express = require('express');
const router = express.Router();


// Require controller modules
const user_controller = require('../controllers/userController');

// GET home page
router.get('/', user_controller.index);

// GET sign up page
router.get('/sign-up', user_controller.user_create_get);

// POST request for creating a User
router.post('/sign-up', user_controller.user_create_post);

// GET login page
router.get('/sign-in', user_controller.user_sign_in_get);

// POST login page
router.post('/sign-in', user_controller.user_sign_in_post);

// GET member form page
router.get('/become-a-member', user_controller.member_form_get);

// POST member form page
router.post('/become-a-member', user_controller.member_form_post);


module.exports = router;
