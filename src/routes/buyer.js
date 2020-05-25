const router = require('express').Router();
const buyerController = require('../controllers/buyer.controller');
const auth = require('../../middlewares/verifyToken')

router.get('/buyer/:productId', auth, buyerController.index);
router.put('/buyer/:productId', auth, buyerController.update);


module.exports = router;