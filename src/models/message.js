const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    sender: { type: mongoose.Schema.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.ObjectId, ref: "User" },
    text: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
