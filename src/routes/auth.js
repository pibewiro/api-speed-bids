const router = require('express').Router();
const authController = require('../controllers/auth.controller')

router.post('/auth', authController.loginUser);
router.get('/auth', authController.logoutUser);


module.exports = router;