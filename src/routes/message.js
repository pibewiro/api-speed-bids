const router = require("express").Router();
const auth = require("../../middlewares/verifyToken");
const messageController = require("../controllers/message.controller");

router.get("/message/:senderId/:receiverId", messageController.get);

module.exports = router;
