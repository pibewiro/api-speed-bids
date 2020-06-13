const router = require("express").Router();
const user = require("./user");
const auth = require("./auth");
const product = require("./product");
const favorite = require("./favorite");
const follow = require("./follow");
const buyer = require("./buyer");
const purchase = require("./purchase");
const message = require("./message");

const routes = [
  user,
  auth,
  product,
  favorite,
  follow,
  buyer,
  purchase,
  message,
];

router.use(routes);

module.exports = router;
