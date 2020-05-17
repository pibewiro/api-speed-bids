const User = require('../models/user');
const hashPassword = require('../../utils/hashPassword')
const responseStatus = require('../../utils/responseStatus');
const validateReg = require('../../utils/validations/validateRegistration');
const jwt = require('jsonwebtoken');
const skipFunction = require('../../utils/skipFunction');
const nodeMailer = require('nodemailer');
const emailTemplate = require('../../utils/emailTemplates/TemplateRegistration')
require('dotenv').config()
const path = require('path')
const makeId = require('../../utils/makeId');

const userController = {
  async index(req, res, next) {
    let user, total;
    let limit = req.query.limit;
    let page = req.query.page;

    const obj = skipFunction(req, limit, page);
    console.log(obj)

    try {

      if (obj.skip !== false) {
        user = await User.find()
          .skip(obj.skip)
          .limit(obj.limit);

        total = await User.countDocuments();
        return res.status(200).json({ success: true, data: user, total, page: obj.page, limit: obj.limit });
      }

      else {
        user = await User.find();
        total = await User.countDocuments();
        return res.status(200).json({ success: true, data: user, total });
      }

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
      let errors = {};
      try {
        const user = await User.findOne({ active: true, $or: [{ username }, { email }, { cpf }] })
        console.log(user)
        if (user) {

          if (user.username === username) {
            errors.username = 'User Already Exists';
          }

          if (user.email === email) {
            errors.email = 'Email Already Exists';
          }

          if (user.cpf === cpf) {
            errors.cpf = 'CPF Already Exists';
          }
          console.log(errors)
          return res.status(400).json(errors)
        }
      } catch (err) {
        console.log(err)
      }

      req.body.password = await hashPassword(req.body.password);
      req.body.active = true;
      req.body.type = 'user';
      req.body.image = 'default.jpg'

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
    // let { isValid, errors } = validateReg(req.body);

    // if (!isValid) return res.status(400).json(errors);

    const token = req.headers['x-access-token'];
    let user;
    const type = jwt.decode(token).type;

    const { id } = req.params
    if (id !== res.locals.id && type !== 'master') return res.status(401).json({ error: 'Unauthorized' });

    try {
      try {
        user = await User.findOne({ $or: [{ username }, { email }, { cpf }], $and: [{ _id: { $ne: id } }] })

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

      let user2 = await User.findById(id);
      if (!user2) return res.status(404).json({ error: 'No user found' });

      if (req.files) {
        if (user2.image !== req.files.userImage.name) {
          let errors = {}
          const img = req.files.userImage;
          if (!img.mimetype.startsWith('image')) {
            errors.image = "Must be am image file"
            return res.status('400').json(errors)
          }
          const ext = path.extname(img.name).toLowerCase();
          let imgName = makeId(20);
          imgName = `${imgName}${ext}`;
          req.body.image = imgName;
          img.mv(`images/${imgName}`)
        }
      }


      await User.updateOne({ _id: id }, { ...req.body });

      const user3 = await User.findById(id)
      console.log(user2)
      return res.status(200).json({ data: user3 });
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

  async registerEmail(req, res, next) {

    const { email, firstname, lastname } = req.params;
    console.log(req.params)

    let transporter = nodeMailer.createTransport({
      service: process.env.AUTH_SERVICE,
      auth: { user: process.env.AUTH_EMAIL, pass: process.env.AUTH_PASS }
    })

    let mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: 'Welcome to SpeedBids',
      html: emailTemplate(firstname, lastname),
      attachments: [{
        filename: 'logo.png',
        path: path.join(__dirname, '../', '../', 'utils', 'emailTemplates', 'logo.png'),
        cid: 'unique@kreata.ee' //same cid value as in the html img src
      }]
    }

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log('Sender:', info.envelope.from);
        console.log('Reciever:', info.accepted[0]);
        return res.status(200).json({ msg: 'Email Successfully Sent' });
      }
    })
  }
}

module.exports = userController;