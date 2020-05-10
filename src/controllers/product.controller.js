const Product = require('../models/product');
const auth = require('../../middlewares/verifyToken');
const validateProduct = require('../../utils/validations/validateProduct');
const skipFunction = require('../../utils/skipFunction');
const makeId = require('../../utils/makeId')
const User = require('../models/user');
const path = require('path')

const productController = {

  async index(req, res, next) {

    let product, total;

    let limit = req.query.limit;
    let page = req.query.page;

    const obj = skipFunction(req, limit, page);
    try {

      if (obj.skip !== false) {
        product = await Product.find()
          .populate({ path: 'user', select: 'firstname lastname username' })
          .skip(obj.skip)
          .limit(obj.limit)
          .sort({ createdAt: -1 });

        total = await Product.countDocuments();
        return res.status(200).json({ success: true, data: product, total, page: obj.page, limit: obj.limit });
      }

      else {
        product = await Product.find()
          .populate({ path: 'user', select: 'firstname lastname username' })
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
    let newProduct;
    let image;
    const userId = req.body.user;

    if (res.locals.id !== userId) return res.status(401).json({ error: 'Unauthorized' });

    try {
      let errors = {};
      let productImages = [];
      let defaultImageFile;
      if (!req.files) {
        errors.images = 'Please select at least a default image';
        return res.status(400).json(errors)
      }

      if (req.files.productImages && !req.files.defaultImage) {
        errors.images = 'Please add a default image';
        return res.status(400).json(errors)
      }

      if (req.files.defaultImage) {

        defaultImageFile = req.files.defaultImage;
        if (!defaultImageFile.mimetype.startsWith('image')) {
          errors.images = 'Invalid image';
          return res.status(400).json(errors)
        }
        let ext = path.extname(defaultImageFile.name).toLowerCase()
        let imgId = makeId(20);
        let name = `${imgId}${ext}`;
        productImages.push(name);
        await defaultImageFile.mv(`images/${name}`)

        image = { defaultImage: name }
      }

      if (req.files.productImages) {
        let productImagesFile = req.files.productImages;
        let exts = [];

        for (let i = 0; i < productImagesFile.length; i++) {
          if (!productImagesFile[i].mimetype.startsWith('image')) {
            exts.push(productImagesFile[i].mimetype);
          }
        }

        if (exts.length > 0) {
          errors.images = 'Invalid Image'
          return res.status(400).json(errors)
        }

        for (let i = 0; i < productImagesFile.length; i++) {
          let name = `${makeId(20)}${path.extname(productImagesFile[i].name).toLowerCase()}`;
          productImages.push(name);
          productImagesFile[i].mv(`images/${name}`)
        }

        image = { ...image, productImages };
      }

      newProduct = {
        ...req.body,
        image
      }

      product = await Product();
      product.productName = newProduct.productName
      product.price = newProduct.price
      product.category = newProduct.category
      product.description = newProduct.description
      product.user = newProduct.user
      product.image = newProduct.image
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