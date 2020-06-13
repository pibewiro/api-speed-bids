const Message = require("../models/message");
const { get } = require("./product.controller");

const messageController = {
  async get(req, res, next) {
    const { receiverId, senderId } = req.params;
    let message;

    try {
      message = await Message.find({
        $or: [
          { receiver: receiverId, sender: senderId },
          { receiver: senderId, sender: receiverId },
        ],
      })
        .populate({ path: "receiver", select: "username" })
        .populate({ path: "sender", select: "username" });
      return res.status(200).json({ data: message });
    } catch (err) {
      console.log(err);
      return res.status(200).json({ error: "Falha Interna" });
    }
  },
};

module.exports = messageController;
