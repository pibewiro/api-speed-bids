const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JwtSchema = new Schema({
  jwt: { type: String }
})

module.exports = mongoose.model('Jwt', JwtSchema);