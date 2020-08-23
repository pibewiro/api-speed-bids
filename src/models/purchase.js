const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PurchaseSchema = new Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    owner: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
    buyer: { type: mongoose.Schema.ObjectId, ref: "Buyer", required: true },
    status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
    datePaid: { type: Date },
    price: { type: Number },
    bonus: { type: Number },
    tax: { type: Number },
    priceTaxedBonus: { type: Number }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", PurchaseSchema);
