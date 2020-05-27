const router = require('express').Router();
const auth = require('../../middlewares/verifyToken');
const purchaseController = require('../controllers/purchase.controller')

router.get('/purchase/:userId', auth, purchaseController.index)
router.put('/purchase/:purchaseId', auth, purchaseController.updateStatus)
router.put('/purchase/checkout/:purchaseId', auth, purchaseController.checkout)


module.exports = router;

