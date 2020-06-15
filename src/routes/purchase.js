const router = require("express").Router();
const auth = require("../../middlewares/verifyToken");
const purchaseController = require("../controllers/purchase.controller");

router.get("/purchase/:userId", auth, purchaseController.index);
router.get(
  "/purchase/user-purchase-data/:userId",
  auth,
  purchaseController.getUserPurchaseData
);
router.post("/purchase/updateLive", auth, purchaseController.updateLive);
router.put("/purchase/:purchaseId", auth, purchaseController.updateStatus);
router.get(
  "/purchase/download/:purchaseId",
  auth,
  purchaseController.downloadReciept
);
router.put("/purchase/checkout/:purchaseId", auth, purchaseController.checkout);

module.exports = router;
