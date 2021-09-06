const express = require('express');
const router = express.Router();
const Sauces = require('../controllers/sauce');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const sauce = new Sauces();

/** Routers leading to the sauce controllers */

router.get('/', auth, sauce.saucesArray);
router.get('/:id', auth, sauce.saucesUnique);
router.post('/', auth, multer, sauce.addSauce);
router.put('/:id', auth, multer, sauce.modifySauce);
router.delete('/:id', auth, sauce.deleteSauce);
router.post('/:id/like', auth, sauce.likeSauce);


module.exports = router;
