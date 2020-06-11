const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: "../.env" });

const User = require("../src/models/user");
const Buyer = require("../src/models/buyer");
const Favorite = require("../src/models/favorites");
const Jwt = require("../src/models/Jwt");
const Product = require("../src/models/product");
const Purchase = require("../src/models/purchase");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

async function deleteData() {
  try {
    // await User.deleteMany();
    await Buyer.deleteMany();
    await Favorite.deleteMany();
    await Jwt.deleteMany();
    await Product.deleteMany();
    await Purchase.deleteMany();

    console.log("Data Destroyed");
    process.exit();
  } catch (err) {
    console.log(err);
  }
}

if (process.argv[2] === "-d") {
  deleteData();
}
