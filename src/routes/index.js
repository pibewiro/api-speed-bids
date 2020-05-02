const router = require('express').Router();
const user = require('./user');
const auth = require('./auth');

const routes = [user, auth];

router.use(routes);

module.exports = router;


