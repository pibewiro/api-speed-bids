const Buyer = require("../src/models/buyer");
const Product = require("../src/models/product");

async function checkLiveBids() {
  let buyer, product;
  let productIds = [];

  product = await Product.find({ endDate: { $lt: Date.now() }, active: true });
  product.map((res) => {
    productIds.push(res._id);
  });

  buyer = await Buyer.find({ product: productIds, active: true });
  buyer.map((res) => {
    if (res.bidType === "Live") {
      res.liveStatus = true;
      res.save();
    }
  });
}

module.exports = checkLiveBids;
