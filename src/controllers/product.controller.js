const Product = require('../models/product');
const auth = require('../../middlewares/verifyToken');
const validateProduct = require('../../utils/validations/validateProduct');
const skipFunction = require('../../utils/skipFunction');
const User = require('../models/user');

const productController = {

  async index(req, res, next) {

    let product, total;

    let limit = req.query.limit;
    let page = req.query.page;

    const obj = skipFunction(req, limit, page);
    try {

      if (obj.skip !== false) {
        product = await Product.find()
          .populate({ path: 'user', select: 'firstname lastname' })
          .skip(obj.skip)
          .limit(obj.limit)
          .sort({ createdAt: -1 });

        total = await Product.countDocuments();
        return res.status(200).json({ success: true, data: product, total, page: obj.page, limit: obj.limit });
      }

      else {
        product = await Product.find()
          .populate({ path: 'user', select: 'firstname lastname' })
          .sort({ createdAt: -1 });

        total = await Product.countDocuments();
        return res.status(200).json({ success: true, data: product, total });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Falha Interna' });
    }
  },

  async get(req, res, next) {

    const { id } = req.params;
    let product;

    try {
      product = await Product.findById(id);
      return res.status(200).json({ success: true, data: product })
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Falha Interna' });
    }
  },

  async store(req, res, next) {

    const { isValid, errors } = validateProduct(req.body);

    if (!isValid) return res.status(400).json(errors);

    let product;
    const userId = req.body.user;

    if (res.locals.id !== userId) return res.status(401).json({ error: 'Unauthorized' });

    try {
      product = await Product.create({ ...req.body });
      product.save();

      return res.status(200).json({ success: true, data: product });
    } catch (err) {
      console.log(err)
    }
  },

  async update(req, res, next) {

    const { id } = req.params;
    const userId = req.body.user;
    let product;

    if (res.locals.id !== userId) return res.status(401).json({ error: 'Unauthorized' });

    const { errors, isValid } = validateProduct(req.body);
    if (!isValid) return res.status(401).json(errors);

    try {
      product = await Product.updateOne({ _id: id }, { ...req.body });
      return res.status(200).json({ success: true, msg: 'Product Successfully Updated' })
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Falha Interna' });
    }
  },

  async delete(req, res, next) {

    const { id } = req.params;
    const userId = req.body.user;
    let product, user;

    try {

      try {
        user = await User.findById((res.locals.id));

        if (res.locals.id !== userId && user.type !== 'master') return res.status(401).json({ error: 'Unauthorized' });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Falha Interna' })
      }

      product = await Product.updateOne({ _id: id }, { active: false });
      return res.status(200).json({ success: true, msg: 'Product Successfully Deleted' })
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Falha Interna' });
    }
  },
}

module.exports = productController;