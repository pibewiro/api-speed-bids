const Purchase = require("../models/purchase");
const Product = require("../models/product");
const Buyer = require("../models/buyer");
const pdf = require("html-pdf");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const moment = require("moment");
const recieptTemplate = require("../../utils/emailTemplates/recipetTemplate");
const { bidderTimestamp } = require("./buyer.controller");

const purchaseController = {
  async index(req, res, next) {
    const { userId } = req.params;
    let purchase;

    try {
      purchase = await Purchase.find({ user: userId })
        .populate({ path: "user", select: "username firstname lastname" })
        .populate({ path: "product" })
        .populate({ path: "owner", select: "username firstname lastname" });
      return res.status(200).json({ data: purchase });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },

  async updateStatus(req, res, next) {
    const { purchaseId } = req.params;

    try {
      await Purchase.updateOne({ _id: purchaseId }, { status: "Paid", datePaid: new Date() });
      return res
        .status(200)
        .json({ data: "O produto foi pago com sucesso" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },

  async checkout(req, res, next) {
    const { purchaseId } = req.params;
    let purchase;
    let sessionData = {};

    try {
      purchase = await Purchase.findById(purchaseId).populate({
        path: "product",
        select: "productName",
      });

      sessionData = {
        payment_method_types: ["card"],
        line_items: [
          {
            amount: purchase.price * 100,
            quantity: 1,
            currency: "brl",
            name: purchase.product.productName,
            description: "Speed Buyer",
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/payment-success/${purchaseId}`,
        cancel_url: "http://localhost:8080/purchases",
      };

      await stripe.checkout.sessions.create({ ...sessionData }, function (
        err,
        session
      ) {
        if (err) console.log(err);

        return res.status(200).json({ data: session });
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },

  async downloadReciept(req, res, next) {
    const { purchaseId } = req.params;
    let purchase;
    purchase = await Purchase.findById(purchaseId)
      .populate({ path: "user", select: "firstname lastname" })
      .populate({ path: "owner", select: "firstname lastname" })
      .populate({ path: "product", select: "productName price" });

    const recieptData = {
      id: purchase._id,
      productName: purchase.product.productName,
      user: {
        firstname: purchase.user.firstname,
        lastname: purchase.user.lastname,
      },
      owner: {
        firstname: purchase.owner.firstname,
        lastname: purchase.owner.lastname,
      },
      price: purchase.price,
      date: moment(purchase.datePaid).format("DD/MM/YYYY"),
    };

    let imgPath = path.join(__dirname + "../../../utils/emailTemplates/");
    imgPath = imgPath.replace(new RegExp(/\\/g), "/");
    const options = {
      type: "pdf",
      base: `file:///${imgPath}`,
    };
    pdf.create(recieptTemplate(recieptData), options).toBuffer((err, data) => {
      res.send(data);
    });
  },

  async updateLive(req, res, next) {
    const { buyerId } = req.body;
    let buyer, purchase, tax, priceTaxedBonus, check;
    let bidders = [];

    try {
      buyer = await Buyer.findById(buyerId);

      buyer.prices.map(price => {
        check = bidders.includes(price.buyerId)

        if (check === false) {
          bidders.push(price.buyerId);
        }
      })

      let lengthBidders = bidders.length;
      let bonusPercent = lengthBidders * 0.03;
      let bonusPriceBidders = buyer.currentPrice * bonusPercent;
      let bonusPrice = buyer.currentPrice * 0.05;
      bonusPrice = bonusPrice + bonusPriceBidders;

      purchase = new Purchase();
      purchase.user = buyer.winner;
      purchase.owner = buyer.owner;
      purchase.product = buyer.product;
      purchase.buyer = buyerId;
      purchase.status = "Pending";
      purchase.bonus = bonusPrice.toFixed(2);
      purchase.price = buyer.currentPrice;

      tax = purchase.price * 0.05;
      purchase.tax = tax.toFixed(2);
      priceTaxedBonus = (purchase.price + purchase.bonus) - purchase.tax;
      purchase.priceTaxedBonus = priceTaxedBonus.toFixed(2);
      await purchase.save();

      buyer.liveStatus = false;
      buyer.active = false;
      await buyer.save();
      await Product.updateOne({ _id: purchase.product }, { purchaseId: purchase._id });

      let purchaseData = await Purchase.findById(purchase._id)
        .populate({ path: "user", select: "firstname lastname username" })
        .populate({ path: "owner", select: "firstname lastname username" })
        .populate({ path: "product", select: "image.defaultImage" });

      return res.status(200).json({ data: purchaseData });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ Error: "Falha Interna" });
    }
  },

  async getUserPurchaseData(req, res, next) {
    const { userId } = req.params;
    let purchase;

    try {
      purchase = await Purchase.find({
        owner: userId,
        status: "Paid",
      });

      let itemsSold = purchase.length;
      let totalPrice = 0;
      let totalBonus = 0;
      let purchaseData;

      purchase.map((res) => {
        totalPrice = totalPrice + res.price;

        if (res.bonus) {
          totalBonus = totalBonus + res.bonus;
        }
      });

      purchaseData = {
        totalPrice,
        totalBonus,
        itemsSold,
      };

      return res.status(200).json({ data: purchaseData });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },
};

module.exports = purchaseController;
