const express = require('express');

const router = express.Router();

const userController = require('../controllers/user.controller');
const imageController = require('../controllers/image.controller');
const lodgeController = require('../controllers/lodge.controller');
const verifyToken = require('../controllers/auth')

const multer  = require('multer')
const upload = multer({ dest: './public/data/uploads/' })

router.post('/register', userController.register);
router.post('/verifyToken', verifyToken);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/', userController.welcome);
router.get('/getUserProfile', userController.getUserProfile)
router.post('/updateUserProfile', userController.updateUserProfile)
router.post('/uploadProfileImage',upload.single('uploaded_file'), imageController.uploadProfileImage)
router.get('/getProfileImage', imageController.getProfileImage)
router.post('/createLodge', lodgeController.createLodge)
router.get('/getLodgeByOwner', lodgeController.getLodgeByOwner)
router.get('/getLodgeByName', lodgeController.getLodgeByName)

module.exports = router;