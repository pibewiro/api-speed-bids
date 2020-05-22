const router = require('express').Router();
const user = require('./user');
const auth = require('./auth');
const product = require('./product');
const favorite = require('./favorite');
const follow = require('./follow');

const routes = [user, auth, product, favorite, follow];

router.use(routes);

module.exports = router;


