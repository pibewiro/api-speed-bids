const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikesSchema = Schema({
  likes: [String],
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
}, { timeStamps: true })


module.exports = mongoose.model('Likes', LikesSchema);