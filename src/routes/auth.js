const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const auth = require('../../middlewares/verifyToken')

router.post('/auth', authController.loginUser);
router.get('/auth', authController.logoutUser);
router.delete('/auth/:password/:id', auth, authController.deleteUser);
router.put('/auth/change-password/:id', auth, authController.updatePassword);
router.get('/auth/delete-profile-email/:email/:firstname/:lastname', auth, authController.emailDeletedUser);

module.exports = router;