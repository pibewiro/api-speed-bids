const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema(
  {
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { defaultImage: { type: String }, productImages: [String] },
    endDate: { type: Date },
    active: { type: Boolean, default: true },
    purchaseId: { type: String, ref: "Purchase" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
