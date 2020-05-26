const Purchase = require('../models/purchase');

const purchaseController = {
  async index(req, res, next) {
    const { userId } = req.params
    let purchase;

    try {
      purchase = await Purchase.find({ user: userId })
        .populate({ path: 'user', select: 'firstname, lastname, username' })
        .populate({ path: 'product' })
        .populate({ path: 'owner', select: 'username firstname lastname' })

      return res.status(200).json({ data: purchase });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Falha Interna' })
    }
  }
};

module.exports = purchaseController;