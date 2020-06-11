const router = require("express").Router();
const auth = require("../../middlewares/verifyToken");
const followController = require("../controllers/follow.controller");

router.get("/follow/:userId", auth, followController.getFollows);
router.get("/follow/show-follows/:userId", auth, followController.showFollows);
router.post("/follow", auth, followController.addFollow);

module.exports = router;
