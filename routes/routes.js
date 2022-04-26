const express = require('express');

const router = express.Router();

const userController = require('../controllers/user.controller');
const verifyToken = require('../controllers/auth')

router.post('/register', userController.register);
router.post('/verifyToken', verifyToken);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/', userController.welcome);
router.get('/getUserProfile', userController.getUserProfile)
router.post('/updateUserProfile', userController.updateUserProfile)

module.exports = router;