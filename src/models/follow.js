const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FollowSchema = Schema(
  {
    follows: [String],
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Follow", FollowSchema);
