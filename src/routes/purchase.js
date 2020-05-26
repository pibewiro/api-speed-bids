const router = require('express').Router();
const auth = require('../../middlewares/verifyToken');
const purchaseController = require('../controllers/purchase.controller')

router.get('/purchase/:userId', auth, purchaseController.index)

module.exports = router;

