const router = require('express').Router();
const productController = require('../controllers/product.controller');
const auth = require('../../middlewares/verifyToken')

router.get('/product', productController.index);
router.get('/product/:id', productController.get);
router.post('/product', auth, productController.store);
router.put('/product/:id', auth, productController.update);
router.delete('/product/:id', auth, productController.delete);
router.get('/product/my-products/:id', auth, productController.getMyProducts);
router.get('/product/:category/:id', productController.getSimilarProducts);



module.exports = router;