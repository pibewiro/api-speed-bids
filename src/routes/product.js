const router = require('express').Router();
const productController = require('../controllers/product.controller');
const auth = require('../../middlewares/verifyToken')

router.get('/product', productController.index);
router.get('/product/:id', productController.get);
router.post('/product', auth, productController.store);
router.put('/product/:id', auth, productController.update);
router.delete('/product/:productName/:id', auth, productController.delete);
router.get('/product/my-products/:id', auth, productController.getMyProducts);
router.get('/product/:category/:id', productController.getSimilarProducts);
router.delete('/product/deleteImage/:name/:id', auth, productController.deleteImage);
router.put('/product/defaultImage/:id', auth, productController.updateDefaulImage);
router.put('/product/addImages/:id', auth, productController.addProductImages);

module.exports = router;