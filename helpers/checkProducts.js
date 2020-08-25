const Product = require("../src/models/product");
const Buyer = require("../src/models/buyer");
const Purchase = require("../src/models/purchase");
const nodemailer = require("nodemailer");

async function checkProducts() {
  let product, buyer, purchase, tax, priceTaxedBonus, check;
  let productId = [];
  let bidders = [];

  product = await Product.find({ endDate: { $lt: Date.now() }, active: true });

  product.map((res) => {
    res.active = false;
    productId.push(res._id);
    res.save();
  });

  buyer = await Buyer.find({ product: productId, active: true })
    .populate({ path: "winner" })
    .populate({ path: "product", select: "user" });

  buyer.map(async (res) => {
    if (res.bidType === "Standard") {
      res.active = false;

      res.prices.map(price => {
        check = bidders.includes(price.buyerId)

        if (check === false) {
          bidders.push(price.buyerId);
        }
      });

      let lengthBidders = bidders.length;
      let bonusPercent = lengthBidders * 0.03;
      let bonusPriceBidders = res.currentPrice * bonusPercent;
      let bonusPrice = res.currentPrice * 0.05;
      bonusPrice = bonusPrice + bonusPriceBidders;





      await res.save();
      if (res.prices.length != 0) {
        purchase = await Purchase();

        purchase.user = res.winner;
        purchase.owner = res.product.user;
        purchase.product = res.product._id;
        purchase.buyer = res._id;
        purchase.status = "Pending";
        purchase.bonus = bonusPrice.toFixed(2);
        purchase.price = res.currentPrice;

        tax = purchase.price * 0.05;
        purchase.tax = tax.toFixed(2);
        priceTaxedBonus = (purchase.price + purchase.bonus) - purchase.tax;
        purchase.priceTaxedBonus = priceTaxedBonus.toFixed(2);
        purchase.save();

        res.active = false;
        await res.save();
        await Product.updateOne({ _id: purchase.product }, { purchaseId: purchase._id });
        console.log('done')
      }
    }
  });
}

module.exports = checkProducts;
