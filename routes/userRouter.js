const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { authUser } = require('../config/basicAuth');

//GET account
router.get('/signin', userController.signInGet);
router.get('/signup', userController.signUpGet);
//POST users listing.
router.post('/signup', userController.signUpPost);
router.post('/signin', userController.signInPost);

// LOGOUT
router.get('/logout', userController.logout);

module.exports = router;
