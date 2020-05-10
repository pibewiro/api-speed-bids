const User = require('../models/user');
const JwtModel = require('../models/Jwt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const generateToken = require('../../utils/generateToken');
const validateLogin = require('../../utils/validations/validateLogin')

const authController = {

  async loginUser(req, res, next) {
    const { errors, isValid } = validateLogin(req.body);

    if (!isValid) return res.status(400).json(errors);

    let user, auth;
    const { email, password } = req.body;

    try {
      user = await User.findOne({ email }, { email: 1, password: 1, type: 1, username: 1, lastname: 1, firstname: 1 });

      if (!user) return res.status(404).json({ invalid: 'Invalid login details' });

      const match = await bcrypt.compare(password, user.password);

      if (!match) return res.status(400).json({ invalid: 'Invalid login details' });

      const token = await generateToken(user._id, user.type);

      auth = await User.updateOne({ _id: user._id, email: email }, { token, lastLogin: Date.now() });

      return res.status(200).json({ success: true, user: { token, userId: user._id, firstname: user.firstname, lastname: user.lastname, username: user.username } });

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