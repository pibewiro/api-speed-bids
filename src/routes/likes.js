const express = require('express').Router();
const auth = require('../../middlewares/verifyToken');
const likesControler = require('../controllers/likes.controller');

router.post('/likes', auth, likesControler.addLikes);
router.delete('/likes/:userId/:idLike', auth, likesControler.deleteLikes);
router.get('/likes/:userId', auth, likesControler.getLikes);


module.exports = router;