const router = require('express').Router();
const productController = require('../controllers/product.controller');
const auth = require('../../middlewares/verifyToken')

router.get('/product', productController.index);
router.get('/product/:id', productController.get);
router.post('/product', auth, productController.store);
router.put('/product/:id', auth, productController.update);
router.delete('/product/:id', auth, productController.delete);

module.exports = router;