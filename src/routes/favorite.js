const router = require('express').Router();
const favorite = require('../controllers/favorite.controller');
const auth = require('../../middlewares/verifyToken')

router.get('/favorite/:userId', auth, favorite.getFavorite);
router.post('/favorite', auth, favorite.addFavorite);

module.exports = router;