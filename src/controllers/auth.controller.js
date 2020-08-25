const User = require("../models/user");
const Product = require("../models/product");
const JwtModel = require("../models/Jwt");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateToken");
const validateLogin = require("../../utils/validations/validateLogin");
const nodemailer = require("nodemailer");
const deleteProfileEmail = require("../../utils/emailTemplates/TemplateDeleteUser");
const templateRecoverPassword = require("../../utils/emailTemplates/TemplateRecoverPassword");
const path = require("path");
const makeId = require('../../utils/makeId');
const hashPassword = require('../../utils/hashPassword');
require("dotenv").config();

const authController = {
  async loginUser(req, res, next) {
    const { errors, isValid } = validateLogin(req.body);

    if (!isValid) return res.status(400).json(errors);

    let user, auth;
    const { email, password } = req.body;

    try {
      user = await User.findOne(
        { email, active: true },
        {
          email: 1,
          password: 1,
          type: 1,
          username: 1,
          lastname: 1,
          firstname: 1,
        }
      );

      if (!user)
        return res.status(404).json({ invalid: "Login inválido" });

      const match = await bcrypt.compare(password, user.password);

      if (!match)
        return res.status(400).json({ invalid: "Login inválido" });

      const token = await generateToken(user._id, user.type);

      auth = await User.updateOne(
        { _id: user._id, email: email },
        { token, lastLogin: Date.now() }
      );

      return res.status(200).json({
        success: true,
        user: {
          token,
          userId: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "falha internal" });
    }
  },

  async logoutUser(req, res, next) {
    const token = req.headers["x-access-token"];
    let auth;

    try {
      auth = await JwtModel.create({ jwt: token });
      auth.save();

      return res.status("200").json({ msg: "User logged off successfully" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },

  async updatePassword(req, res, next) {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const { id } = req.params;
    let user;
    let error = {};

    if (newPassword !== confirmPassword) {
      error.password = "As senhas devem corresponder";
      return res.status(400).json(error);
    }

    user = await User.findById(id).select("+password");
    const compare = bcrypt.compareSync(currentPassword, user.password);

    if (!compare) {
      error.currentPassword = "Senha inválida";
      return res.status(400).json(error);
    }

    user.password = bcrypt.hashSync(newPassword);
    user.save();

    return res.status(200).json({ msg: "Senha alterada com sucesso" });
  },

  async deleteUser(req, res, next) {
    const { password, id } = req.params;
    let user, product;
    let error = {};

    if (!password) {
      return res.status(404).json(error);
    }

    try {
      user = await User.findById(id).select("+password");
      let compare = bcrypt.compareSync(password, user.password);
      if (!compare) {
        error.password = "Senha inválida";
        return res.status(400).json(error);
      }

      try {
        product = await Product.find({ user: id });
        product.map((res) => {
          res.active = false;
          res.save();
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Falha Interna" });
      }
      user.active = false;
      user.save();
      return res.status(200).json({ msg: "Usuário excluído!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },

  async emailDeletedUser(req, res, next) {
    const { firstname, lastname, email } = req.params;

    let transporter = nodemailer.createTransport({
      service: process.env.AUTH_SERVICE,
      auth: { user: process.env.AUTH_EMAIL, pass: process.env.AUTH_PASS },
    });

    let mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Obrigado por usar nosso serviço",
      html: deleteProfileEmail(firstname, lastname),
      attachments: [
        {
          filename: "logo.png",
          path: path.join(
            __dirname,
            "../",
            "../",
            "utils",
            "emailTemplates",
            "logo.png"
          ),
          cid: "unique@kreata.ee", //same cid value as in the html img src
        },
      ],
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
        res.status(200).json({ msg: "Message Sent" });
      }
    });
  },

  async loginAdmin(req, res, next) {
    const { errors, isValid } = validateLogin(req.body);

    if (!isValid) return res.status(400).json(errors);

    let user, auth;
    const { email, password } = req.body;

    try {
      user = await User.findOne(
        { email, active: true },
        {
          email: 1,
          password: 1,
          type: 1,
          username: 1,
          lastname: 1,
          firstname: 1,
        }
      );

      if (user.type !== "master") {
        let errors = {};
        errors.invalid = "Não Autorizado";
        return res.status(404).json(errors);
      }
      if (!user)
        return res.status(404).json({ invalid: "Login inválido" });

      const match = await bcrypt.compare(password, user.password);

      if (!match)
        return res.status(400).json({ invalid: "Login inválido" });

      const token = await generateToken(user._id, user.type);

      auth = await User.updateOne(
        { _id: user._id, email: email },
        { token, lastLogin: Date.now() }
      );
      return res.status(200).json({
        success: true,
        user: {
          token,
          userId: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "falha internal" });
    }
  },

  async recoverPassword(req, res) {
    const { email } = req.params;
    let user, newPassword;

    if (email === 'null') {
      return res.status(400).json({ error: 'Por favor digite um email' })
    }

    user = await User.findOne({ email }).select('+password');
    console.log(user)

    if (!user) {
      return res.status(400).json({ error: 'Usuário não exisite' })
    }

    newPassword = makeId(6);

    let hashedPassword = await hashPassword(newPassword);
    await User.updateOne({ email }, { password: hashedPassword });

    let transporter = nodemailer.createTransport({
      service: process.env.AUTH_SERVICE,
      auth: { user: process.env.AUTH_EMAIL, pass: process.env.AUTH_PASS },
    });

    let mailOptions = {
      from: `Speed Buyer <${process.env.AUTH_EMAIL}>`,
      to: email,
      subject: "Recuperação de Senha",
      html: templateRecoverPassword(user.firstname, user.lastname, newPassword),
      attachments: [
        {
          filename: "logo.jpg",
          path: path.join(
            __dirname,
            "../",
            "../",
            "utils",
            "emailTemplates",
            "logo.jpg"
          ),
          cid: "unique@kreata.ee", //same cid value as in the html img src
        },
      ],
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
        return res.status(200).json({ msg: "Message Sent", success: true });
      }
    });
  }
};

module.exports = authController;
