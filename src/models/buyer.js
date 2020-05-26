const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BuyerSchema = new Schema({
  product: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
  prices: [{ buyerId: { type: mongoose.Schema.ObjectId, ref: "User" }, price: Number, dateAdded: { type: Date } }],
  currentPrice: { type: Number },
  winner: { type: Schema.Types.ObjectId, ref: "User" },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Buyer', BuyerSchema);