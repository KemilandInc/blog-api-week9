const express = require('express');

const multer = require('multer');
const { registerUser, loginUser } = require('../controllers/user.controller');

const { validateRegister, validateLogin } = require('../validations/user.validations');

const upload = require('../middlewares/upload.js');
const router = express.Router();



router.post("/upload", upload.single('image'), (req, res) =>{
   const fileUrl = req.file.path;
   const fileName = req.file.filename;

   

   res.send("Hello, from upload")
})


router.post('/signup', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

module.exports = router;
