const router = require("express").Router();
const buyerController = require("../controllers/buyer.controller");
const auth = require("../../middlewares/verifyToken");

router.get("/buyer/:productId", auth, buyerController.index);
router.post("/buyer/liveBid", auth, buyerController.addLiveBidder);
router.post(
  "/buyer/bidder-timestamp/:buyerId",
  auth,
  buyerController.bidderTimestamp
);
router.get("/buyer/get-buyer/:buyerId", auth, buyerController.get);
router.get("/buyer/view-bids/:userId", auth, buyerController.viewBids);
router.put("/buyer/:productId", auth, buyerController.update);

module.exports = router;
