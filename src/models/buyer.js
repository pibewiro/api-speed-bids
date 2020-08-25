const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BuyerSchema = new Schema(
  {
    product: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
    owner: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    prices: [
      {
        buyerId: { type: String, ref: "User" },
        price: Number,
        dateAdded: { type: Date },
      },
    ],
    currentPrice: { type: Number },
    winner: { type: Schema.Types.ObjectId, ref: "User" },
    active: { type: Boolean, default: true },
    bidType: { type: String, enum: ["Standard", "Live"] },
    liveBidders: { type: [String] },
    liveStatus: { type: Boolean, default: false },
    times: { startTime: { type: Date }, endTime: { type: Date } },
    bidderTimestamps: {
      type: [
        {
          bidderId: { type: Schema.Types.ObjectId, ref: "User" },
          timeEntered: { type: Date },
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Buyer", BuyerSchema);
