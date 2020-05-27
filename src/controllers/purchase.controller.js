const Purchase = require('../models/purchase');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const purchaseController = {
  async index(req, res, next) {
    const { userId } = req.params
    let purchase;

    try {
      purchase = await Purchase.find({ user: userId })
        .populate({ path: 'user', select: 'username firstname lastname' })
        .populate({ path: 'product' })
        .populate({ path: 'owner', select: 'username firstname lastname' })
      return res.status(200).json({ data: purchase });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Falha Interna' })
    }
  },

  async updateStatus(req, res, next) {
    console.log(req.params)
    const { purchaseId } = req.params;

    try {
      await Purchase.updateOne({ _id: purchaseId }, { status: 'Paid' });
      return res.status(200).json({ data: 'Product has successfully been paid' })

    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Falha Interna' })
    }
  },

  async checkout(req, res, next) {
    console.log(req.headers.origin)
    const { purchaseId } = req.params;
    let purchase;
    let sessionData = {};


    try {
      purchase = await Purchase.findById(purchaseId)
        .populate({ path: 'product', select: 'productName' });

      sessionData = {
        payment_method_types: ['card'],
        line_items: [{
          amount: purchase.price * 100,
          quantity: 1,
          currency: 'usd',
          name: purchase.product.productName,
          description: 'Speed Buyer'
        }],
        mode: 'payment',
        success_url: `${req.headers.origin}/payment-success/${purchaseId}`,
        cancel_url: 'http://localhost:8080/purchases',
      }

      await stripe.checkout.sessions.create({ ...sessionData }, function (err, session) {
        if (err) console.log(err)

        return res.status(200).json({ data: session })
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Falha Interna' })
    }
  }
};

module.exports = purchaseController;