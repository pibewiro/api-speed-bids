const router = require("express").Router();
const auth = require("../../middlewares/verifyToken");
const messageController = require("../controllers/message.controller");

router.get('/message/get-my-messages/:userId', auth, messageController.getMyMessages)
router.get("/message/:senderId/:receiverId", auth, messageController.get);
router.post(
  "/message/send-message-admin/:receiverId/:senderId",
  auth,
  messageController.sendMessageAdmin
);


module.exports = router;
