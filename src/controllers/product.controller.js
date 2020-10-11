const Product = require("../models/product");
const Purchase = require("../models/purchase");
const auth = require("../../middlewares/verifyToken");
const validateProduct = require("../../utils/validations/validateProduct");
const skipFunction = require("../../utils/skipFunction");
const makeId = require("../../utils/makeId");
const User = require("../models/user");
const path = require("path");
const Buyer = require("../models/buyer");
const moment = require("moment");

const productController = {
  async index(req, res, next) {
    let product, total;

    let limit = req.query.limit;
    let page = req.query.page;

    const obj = skipFunction(req, limit, page);
    try {
      if (obj.skip !== false) {
        product = await Product.find()
          .populate({ path: "user", select: "firstname lastname username" })
          .skip(obj.skip)
          .limit(obj.limit)
          .sort({ createdAt: -1 });

        total = await Product.countDocuments();
        return res.status(200).json({
          success: true,
          data: product,
          total,
          page: obj.page,
          limit: obj.limit,
        });
      } else {
        product = await Product.find()
          .populate({ path: "user", select: "firstname lastname username" })
          .sort({ createdAt: -1 });

        total = await Product.countDocuments();
        return res.status(200).json({ success: true, data: product, total });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },

  async get(req, res, next) {
    const { id } = req.params;
    let product;

    try {
      product = await Product.findById(id).populate({
        path: "user",
        select: "firstname lastname username",
      });
      return res.status(200).json({ success: true, data: product });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },

  async store(req, res, next) {
    const { isValid, errors } = validateProduct(req.body);

    if (!isValid) return res.status(400).json(errors);

    let product;
    let newProduct;
    let image;
    let defaultImage;
    const userId = req.body.user;

    if (res.locals.id !== userId)
      return res.status(401).json({ error: "Unauthorized" });

    try {
      let errors = {};
      let productImages = [];
      let defaultImageFile;
      if (!req.files) {
        errors.images = "Selecione pelo menos uma imagem padrão";
        return res.status(400).json(errors);
      }

      if (
        (req.files.productImages && !req.files.defaultImage) ||
        req.files.defaultImage.name === "null"
      ) {
        errors.images = "Adicione uma imagem padrão";
        return res.status(400).json(errors);
      }

      if (req.files.defaultImage) {
        defaultImageFile = req.files.defaultImage;
        if (!defaultImageFile.mimetype.startsWith("image")) {
          errors.images = "Imagen inválido";
          return res.status(400).json(errors);
        }
        let ext = path.extname(defaultImageFile.name).toLowerCase();
        let imgId = makeId(20);
        let name = `${imgId}${ext}`;
        await defaultImageFile.mv(`images/${name}`);

        defaultImage = name;
      }

      if (req.files.productImages) {
        let productImagesFile = req.files.productImages;
        let exts = [];

        if (req.files.productImages.length > 1) {
          for (let i = 0; i < productImagesFile.length; i++) {
            if (!productImagesFile[i].mimetype.startsWith("image")) {
              exts.push(productImagesFile[i].mimetype);
            }
          }

          if (exts.length > 0) {
            errors.images = "Imagen inválido";
            return res.status(400).json(errors);
          }

          for (let i = 0; i < productImagesFile.length; i++) {
            let name = `${makeId(20)}${path
              .extname(productImagesFile[i].name)
              .toLowerCase()}`;
            productImages.push(name);
            productImagesFile[i].mv(`images/${name}`);
          }
        } else {
          if (!req.files.productImages.mimetype.startsWith("image")) {
            errors.images = "Imagen inválido";
            return res.status(400).json(errors);
          }
          let ext = path.extname(req.files.productImages.name).toLowerCase();
          let imgId = makeId(20);
          let name = `${imgId}${ext}`;
          productImages.push(name);
          await req.files.productImages.mv(`images/${name}`);
        }
      }

      product = await Product();
      buyer = await Buyer();
      let endDate = `${req.body.endDate}T${req.body.endTime}.000-03:00`;
      let bidEndTime = moment(endDate)
        .add(2, "minutes")
        .format("YYYY-MM-DDThh:mm:ss.000-03:00");

      product.productName = req.body.productName;
      product.price = req.body.price;
      product.category = req.body.category;
      product.description = req.body.description;
      product.user = req.body.user;
      product.image.defaultImage = defaultImage;
      product.image.productImages = productImages;
      product.endDate = endDate;
      product.save();

      //save buyer data
      buyer.product = product._id;
      buyer.currentPrice = product.price;
      buyer.bidType = req.body.bidType;
      buyer.owner = req.body.user;
      buyer.times.startTime = endDate;
      buyer.times.endTime = bidEndTime;
      buyer.save();

      return res.status(200).json({ success: true, data: product });
    } catch (err) {
      console.log(err);
    }
  },

  async update(req, res, next) {
    const { id } = req.params;
    const userId = req.body.user._id;
    let product;

    if (res.locals.id !== userId)
      return res.status(401).json({ error: "Unauthorized" });

    // const { errors, isValid } = validateProduct(req.body);
    // if (!isValid) return res.status(401).json(errors);

    try {
      product = await Product.findById(id);
      product.productName = req.body.productName;
      product.price = req.body.price;
      product.category = req.body.category;
      product.description = req.body.description;
      product.save();

      return res.status(200).json({
        success: true,
        msg: "Produto atualizado com sucesso",
        data: product,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },

  async delete(req, res, next) {
    const { id, productName } = req.params;
    let product, product2, user;
    let error = {};

    try {
      try {
        user = await User.findById(res.locals.id);
        const userId = user._id;
        if (res.locals.id != user._id && user.type !== "master")
          return res.status(401).json({ error: "Unauthorized" });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Falha Interna" });
      }

      product2 = await Product.findById(id);

      if (product2.productName !== productName) {
        error.productName = "Nome Errado";
        return res.status(400).json(error);
      }

      product = await Product.updateOne({ _id: id }, { active: false });
      return res
        .status(200)
        .json({ success: true, msg: "Produto excluído com sucesso" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },

  async getMyProducts(req, res, next) {
    const userId = req.params.id;
    // if (res.locals.id !== req.params.id) return res.status(401).json({ error: 'Unauthorized' })

    try {
      const product = await Product.find({ user: userId })
        .populate({
          path: "purchaseId",
          select: "bonus price tax status priceTaxedBonus datePaid",
        })
        .sort({
          createdAt: "desc",
        });

      return res.status(200).json({ succes: true, data: product });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },

  async getSimilarProducts(req, res, next) {
    const { id, category } = req.params;

    try {
      const product = await Product.find({
        _id: { $ne: id },
        category,
        // active: true,
      }).populate({ path: "user", select: "username" });
      return res.status(200).json({ succes: true, data: product });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },

  async deleteImage(req, res, next) {
    const { name, id } = req.params;
    let product;

    try {
      product = await Product.findById(id);

      if (!product)
        return res.status(404).json({ error: "Nenhum produto encontrado" });

      let imgs = [];
      imgs = product.image.productImages.filter((res) => res !== name);
      product.image.productImages = imgs;
      product.save();

      return res.status(200).json({ data: product });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },

  async updateDefaulImage(req, res, next) {
    let error = {};

    const { id } = req.body;
    let product;

    if (!req.files) {
      error.image = "Imagem padrão necessária";

      return res.status(404).json(error);
    }

    try {
      product = await Product.findById(id);

      if (!product)
        return res.status(404).json({ error: "Nenhum produto encontrado" });

      let imgs, img, name, ext;

      if (!req.files.newDefaultImage.mimetype.startsWith("image")) {
        error.image = "Deve ser um arquivo de imagem";
        return res.status(400).json(error);
      }

      img = req.files.newDefaultImage;
      name = makeId(20);
      ext = path.extname(img.name).toLowerCase();
      name = `${name}${ext}`;
      product.image.defaultImage = name;
      img.mv(`images/${name}`);
      product.save();
      return res.status(200).json({ data: product });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },

  async addProductImages(req, res, next) {
    let img = req.files.addedProductImage;
    let name, ext, product;
    const id = req.params.id;

    if (!img.mimetype.startsWith("image")) {
      let error = {};
      error.image = "Deve ser um arquivo de imagem";
      return res.status(400).json(error);
    }

    try {
      product = await Product.findById(id);
      if (!product) return res.status(404).json({ error: "User not found" });

      name = makeId(20);
      ext = path.extname(img.name).toLowerCase();
      name = `${name}${ext}`;
      product.image.productImages.push(name);
      product.save();
      img.mv(`images/${name}`);
      return res.status(200).json({ data: product });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },

  async filterProducts(req, res, next) {
    let = {
      productName,
      category,
      minPrice,
      maxPrice,
      sortPrice,
      sortDate,
    } = req.query;
    let query = {};
    let sort = {};
    let product;

    if (productName) {
      query = { productName };
    }

    if (category) {
      query = { ...query, category };
    }

    if (minPrice) {
      query = { ...query, price: { $gte: minPrice } };
    }

    if (maxPrice) {
      query = { ...query, price: { $lte: maxPrice } };
    }

    if (minPrice && maxPrice) {
      query = { ...query, price: { $gte: minPrice, $lte: maxPrice } };
    }

    // query = { ...query, active: true };

    if (sortDate) {
      switch (sortDate) {
        case "newOld":
          sort = { createdAt: "desc" };
          break;

        case "oldNew":
          sort = { createdAt: "asc" };
          break;
      }
    }

    if (sortPrice) {
      switch (sortPrice) {
        case "highLow":
          sort = { ...sort, price: "desc" };
          break;

        case "lowHigh":
          sort = { ...sort, price: "asc" };
          break;
      }
    }
    try {
      if (sortPrice || sortDate) {
        product = await Product.find(query)
          .populate({ path: "user", select: "username" })
          .sort(sort);
      } else {
        product = await Product.find(query)
          .sort({ createdAt: "desc" })
          .populate({ path: "user", select: "username" });
      }

      return res.status(200).json({ data: product });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "falha interna" });
    }
  },

  async getProductsHomePage(req, res, next) {
    let product;

    try {
      product = await Product.find().limit(16).sort({ createdAt: -1 });
      return res.status(200).json({ data: product });
    } catch (err) {
      console.log(err);
      return res.status(200).json({ error: data });
    }
  },

  async getProductsAdmin(req, res, next) {
    try {
      const { productFilter } = req.query;
      let product;
      if (productFilter) {
        product = await Product.find({
          $or: [
            { productName: { $regex: ".*" + productFilter + ".*" } },
            { category: { $regex: ".*" + productFilter + ".*" } },
          ],
        }).populate({
          path: "user",
          select: "username firstname lastname email",
        });
      } else {
        product = await Product.find().populate({
          path: "user",
          select: "username firstname lastname email",
        });
      }
      return res.status(200).json({ data: product });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },

  async productStatus(req, res, next) {
    const { active } = req.body;
    const { productId } = req.params;
    let product;

    try {
      if (active == true) {
        await Product.update({ _id: productId }, { active: false });
      } else {
        await Product.update({ _id: productId }, { active: true });
      }

      return res.status(200).json({ data: "Status do Produto Atulaizado" });
    } catch (error) {
      console.log(err);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },

  async getAllProductsLogout(req, res, next) {
    let product;

    try {
      product = await Product.find({ active: true }).sort({ createdAt: -1 });
      return res.status(200).json({ data: product });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }
  },
};

module.exports = productController;
