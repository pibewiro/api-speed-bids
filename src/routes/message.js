const router = require("express").Router();
const auth = require("../../middlewares/verifyToken");
const messageController = require("../controllers/message.controller");

router.get("/message/my-messages/:userId", auth, messageController.myMessages);
router.get("/message/:senderId/:receiverId", auth, messageController.get);
router.post(
  "/message/send-message-admin/:receiverId/:senderId",
  auth,
  messageController.sendMessageAdmin
);

module.exports = router;
