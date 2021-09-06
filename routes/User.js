const express = require('express');
const router = express.Router();
const Users = require('../controllers/user');
const userCtrl = new Users();

/** Routers leading to User controllers */

router.post('/signup', userCtrl.signingUp);
router.post('/login', userCtrl.logingIn);

module.exports = router;