const User = require('../models/user');
const JwtModel = require('../models/Jwt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const generateToken = require('../../utils/generateToken');

const authController = {

  async loginUser(req, res, next) {

    let user, auth;
    const { email, password } = req.body;

    try {
      user = await User.findOne({ email }, { email: 1, password: 1, type: 1 });

      if (!user) return res.status(404).json({ error: 'Invalid login details' });

      const match = bcrypt.compare(password, user.password);

      if (!match) return res.status(400).json({ error: 'Invalid login details' });

      const token = await generateToken(user._id, user.type);

      auth = await User.updateOne({ _id: user._id, email: email }, { token, lastLogin: Date.now() });

      return res.status(200).json({ success: true, token });

    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'falha internal' });
    }
  },

  async logoutUser(req, res, next) {

    const token = req.headers['x-access-token'];
    let auth;

    try {
      auth = await JwtModel.create({ jwt: token })
      auth.save();

      return res.status('200').json({ msg: 'User logged off successfully' });
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = authController;