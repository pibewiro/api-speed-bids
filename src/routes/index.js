const router = require('express').Router();
const user = require('./user');
const auth = require('./auth');
const product = require('./product');
const favorite = require('./favorite');


const routes = [user, auth, product, favorite];

router.use(routes);

module.exports = router;


