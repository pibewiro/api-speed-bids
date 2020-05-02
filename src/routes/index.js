const router = require('express').Router();
const user = require('./user');
const auth = require('./auth');
const product = require('./product');

const routes = [user, auth, product];

router.use(routes);

module.exports = router;


