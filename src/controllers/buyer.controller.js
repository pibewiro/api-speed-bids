const Buyer = require("../models/buyer");
const moment = require("moment");

const BuyerController = {
  async index(req, res, next) {
    const { productId } = req.params;
    let buyer;

    try {
      buyer = await Buyer.findOne({
        product: productId,
        active: true,
      }).populate({ path: "prices.buyerId", select: "username" });

      let reverseArray;
      reverseArray = buyer.prices;
      reverseArray = reverseArray.reverse();

      let buyerData = {
        prices: reverseArray,
        currentPrice: buyer.currentPrice,
        bidType: buyer.bidType,
        _id: buyer._id,
      };

      return res.status(200).json({ data: buyerData });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },

  async get(req, res, next) {
    const { buyerId } = req.params;
    let buyer;
    try {
      buyer = await Buyer.findById(buyerId)
        .populate({ path: "owner", select: "username firstname lastname" })
        .populate({ path: "product" })
        .populate({ path: "winner", select: "username firstname lastname" });

      return res.status(200).json({ data: buyer });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
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
      error.price = "A number is required";
      return res.status(400).json(error);
    }

    try {
      buyer = await Buyer.findOne({ product: productId }).populate({
        path: "prices.buyerId",
        select: "username",
      });

      if (buyer.prices.length === 0) {
        if (buyer.currentPrice >= price) {
          error.price = "Price Must be higher than the current bid";
          return res.status(400).json(error);
        }
      }

      let check = buyer.prices.map((res) => {
        if (res.price >= price) {
          return true;
        } else {
          return false;
        }
      });

      if (check.includes(true)) {
        error.price = "Price Must be higher than the current bid";
        return res.status(400).json(error);
      }

      buyer.prices.push({ buyerId: userId, price, dateAdded: new Date() });
      buyer.currentPrice = price;
      buyer.winner = userId;
      await buyer.save();

      return res
        .status(200)
        .json({ data: `Price has been updated to R$${price}` });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },

  async addLiveBidder(req, res, next) {
    const { userId, buyerId } = req.body;
    let buyer;
    let error = {};

    try {
      buyer = await Buyer.findById(buyerId);
      const checkUser = buyer.liveBidders.includes(userId);

      if (checkUser) {
        error.liveBidder = "You have already joined this bidding Session";
        return res.status(400).json(error);
      }

      buyer.liveBidders.push(userId);
      buyer.save();
      return res.status(200).json("Buyer Added");
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },

  async viewBids(req, res, next) {
    const { userId } = req.params;
    let buyer;

    try {
      buyer = await Buyer.find({ liveBidders: { $in: userId }, active: true })
        .populate({ path: "product" })
        .populate({ path: "owner", select: "username" })
        .sort({ liveStatus: -1 });
      return res.status(200).json({ data: buyer });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },

  async bidderTimestamp(req, res, next) {
    const { buyerId } = req.params;
    const userId = res.locals.id;
    const { entering } = req.body;

    let buyer;
    buyer = await Buyer.findById(buyerId);

    if (entering) {
      let time = moment().format();
      time = time.split("T");
      let time2 = time[1].split("-");
      let timeEntered = `${time[0]}T${time2[0]}.000Z`;

      buyer.bidderTimestamps.push({
        bidderId: userId,
        timeEntered,
      });
      await buyer.save();

      let bidderData = await Buyer.findById(buyerId);

      let userData = bidderData.bidderTimestamps.filter(
        (res) => res.bidderId == userId
      );
      return res.status(200).json({ data: userData[0] });
    } else {
      let arr = buyer.bidderTimestamps.filter((res) => res.bidderId != userId);
      buyer.bidderTimestamps = arr;
      await buyer.save();

      return res.status(200).json({ data: "User has left the bid" });
    }
  },
};

module.exports = BuyerController;
