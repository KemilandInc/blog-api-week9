const express = require('express');
const { registerUser, loginUser } = require('../controllers/user.controller');

const { validateRegister, validateLogin } = require('../validations/user.validations');

const router = express.Router();


router.post('/signup', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

module.exports = router;
