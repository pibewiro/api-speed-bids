const User = require('../models/user');
const hashPassword = require('../../utils/hashPassword')
const responseStatus = require('../../utils/responseStatus');
const validateReg = require('../../utils/validateRegistration');
const jwt = require('jsonwebtoken');

const userController = {
  async index(req, res, next) {
    let user, total;
    try {
      user = await User.find();
      total = await User.countDocuments();
      return res.status(200).json({ success: true, data: user, total });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Falha Interna' })
    }
  },
  async store(req, res, next) {
    let { username, email, cpf } = req.body;

    let { isValid, errors } = validateReg(req.body);

    if (!isValid) return res.status(400).json(errors);

    try {

      try {
        const user = await User.findOne({ $or: [{ username }, { email }, { cpf }] })

        if (user) {
          let errors = {};

          if (user.username === username) {
            errors.username = 'User Already Exists';
          }

          if (user.email === email) {
            errors.email = 'Email Already Exists';
          }

          if (user.cpf === cpf) {
            errors.cpf = 'CPF Already Exists';
          }

          return res.status(400).json({ errors })
        }
      } catch (err) {
        console.log(err)
      }

      req.body.password = await hashPassword(req.body.password);
      req.body.active = true;
      req.body.type = 'user';

      const user = await User.create({ ...req.body });
      user.save();

      return res.status(200).json({ msg: 'User Successfully Registered', data: user })
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Falha Interna' })
    }
  },

  async get(req, res, next) {

    let user;
    const { id } = req.params;

    try {
      user = await User.findById(id);

      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.status(200).json({ success: true, data: user })
    }
    catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Falha Interna' })
    }
  },

  async update(req, res, next) {

    let { username, email, cpf } = req.body;
    let { isValid, errors } = validateReg(req.body);

    if (!isValid) return res.status(400).json(errors);

    const token = req.headers['x-access-token'];
    let user;
    const type = jwt.decode(token).type;

    const { id } = req.params

    if (id !== res.locals.id && type !== 'master') return res.status(401).json({ error: 'Unauthorized' });

    try {
      try {
        const user = await User.findOne({ $or: [{ username }, { email }, { cpf }], $and: [{ _id: { $ne: id } }] })

        if (user) {
          let errors = {};

          if (user.username === username) {
            errors.username = 'User Already Exists';
          }

          if (user.email === email) {
            errors.email = 'Email Already Exists';
          }

          if (user.cpf === cpf) {
            errors.cpf = 'CPF Already Exists';
          }

          return res.status(400).json({ errors })
        }
      } catch (err) {
        console.log(err)
      }

      user = await User.updateOne({ _id: id }, { ...req.body });
      if (!user) return res.status(404).json({ error: 'No user found' });

      return res.status(200).json({ msg: 'User updated' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Falha Interna' })
    }
  },

  async delete(req, res, next) {
    const token = req.headers['x-access-token'];

    let user;
    const type = jwt.decode(token).type;
    const { id } = req.params;

    if (id !== res.locals.id && type !== 'master') return res.status(401).json({ error: 'Unauthorized' });

    try {
      user = await User.updateOne({ _id: id }, { active: false });

      if (!user) return res.status(404).json({ error: 'User not found' });

      return res.status(200).json({ success: true, msg: 'User deleted' })
    }
    catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Falha Interna' })
    }
  },
}

module.exports = userController;