const router = require('express').Router();
const userController = require('../controllers/user.controllers');
const auth = require('../../middlewares/verifyToken');

router.get('/user', userController.index);
router.get('/user/:id', userController.get);
router.post('/user', userController.store);
router.put('/user/:id', auth, userController.update);
router.delete('/user/:id', auth, userController.delete);

module.exports = router;