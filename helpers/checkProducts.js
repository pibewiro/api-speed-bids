const Product = require('../src/models/product');
const Buyer = require('../src/models/buyer');
const Purchase = require('../src/models/purchase');
const nodemailer = require('nodemailer');

async function checkProducts() {
  let product, buyer, purchase;
  let productId = [];

  product = await Product.find({ endDate: { $lt: Date.now() }, active: true })

  product.map(res => {
    res.active = false;
    productId.push(res._id);
    res.save();
  });

  buyer = await Buyer.find({ product: productId, active: true })
    .populate({ path: 'winner' })
    .populate({ path: 'product', select: 'user' })

  buyer.map(async res => {
    res.active = false;
    await res.save();
    if (res.prices.length != 0) {
      purchase = await Purchase();
      purchase.user = res.winner,
        purchase.owner = res.product.user,
        purchase.product = res.product._id,
        purchase.buyer = res._id,
        purchase.price = res.currentPrice,
        purchase.save();
    }
  })
}

module.exports = checkProducts;