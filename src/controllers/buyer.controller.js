const Buyer = require('../models/buyer');

const BuyerController = {

  async index(req, res, next) {
    const { productId } = req.params;
    let buyer;

    try {
      buyer = await Buyer.findOne({ product: productId, active: true })
        .populate({ path: 'prices.buyerId', select: 'username' })

      let reverseArray;
      reverseArray = buyer.prices;
      reverseArray = reverseArray.reverse();

      let buyerData = {
        prices: reverseArray,
        currentPrice: buyer.currentPrice
      }

      return res.status(200).json({ data: buyerData });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Falha Interna' })
    }
  },

  async update(req, res, next) {
    const { price, userId } = req.body;
    const { productId } = req.params;

    let buyer, validateNum, checkNumber;
    let error = {};

    validateNum = /^\d*$/g;
    checkNumber = validateNum.test(price);
    if (!checkNumber || !price) {
      error.price = 'A number is required'
      return res.status(400).json(error)
    }

    try {
      buyer = await Buyer.findOne({ product: productId })
        .populate({ path: 'prices.buyerId', select: 'username' })

      if (buyer.prices.length === 0) {
        if (buyer.currentPrice >= price) {
          error.price = 'Price Must be higher than the current bid'
          return res.status(400).json(error);
        }
      }

      let check = buyer.prices.map(res => {
        if (res.price >= price) {
          return true;
        }

        else {
          return false;
        }
      });

      if (check.includes(true)) {
        error.price = 'Price Must be higher than the current bid'
        return res.status(400).json(error);
      }


      buyer.prices.push({ buyerId: userId, price, dateAdded: new Date() })
      buyer.currentPrice = price;
      buyer.winner = userId;
      await buyer.save();

      return res.status(200).json({ data: `Price has been updated to R$${price}` });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Falha Interna' });
    }
  }
}

module.exports = BuyerController;