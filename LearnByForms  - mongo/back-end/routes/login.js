const express = require('express');
const multer = require('multer');
const  LoginController = require('../controllers/login')
const  TokenController = require('../controllers/token')
const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images')
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-')
      cb(null,  file.originalname)
    },
  })
var upload = multer({storage: storage});


router.post('/', LoginController.login);
router.post('/logout', LoginController.logout);
router.post('/register', LoginController.register);
router.post('/auth', LoginController.auth);
router.post('/callback', LoginController.callback);
router.post('/profile', LoginController.profile);
router.post('/addProfile', upload.single('file') ,LoginController.addProfile);
router.post('/refreshToken', TokenController.renewToken);




module.exports = router;