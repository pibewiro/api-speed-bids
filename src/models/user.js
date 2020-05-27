const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true },
  cpf: { type: String, required: true },
  password: { type: String, select: false, hidden: true, required: true },
  email: { type: String, required: true },
  image: { type: String },
  type: { type: String, enum: ['user', 'master'], required: true },
  address: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true }
  },
  active: { type: Boolean, required: true },
  token: { type: String },
  lastLogin: { type: Date }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema);
