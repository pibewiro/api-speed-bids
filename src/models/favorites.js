const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FavoriteSchema = new Schema({
  productDetails: [{ productId: String, active: Boolean }],
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

module.exports = mongoose.model('Favorite', FavoriteSchema);