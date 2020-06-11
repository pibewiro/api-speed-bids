const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    sender: { type: mongoose.Schema.ObjectId, ref: "User" },
    reciever: { type: mongoose.Schema.ObjectId, ref: "User" },
    product: { type: mongoose.Schema.ObjectId, ref: "Product" },
    text: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
