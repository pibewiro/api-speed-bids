const Message = require("../models/message");
const Follow = require("../models/follow");
const nodeMailer = require("nodemailer");
const adminTemplate = require("../../utils/emailTemplates/TemplateAdmin");
const path = require("path");
const follow = require("../models/follow");

const messageController = {
  async get(req, res, next) {
    const { receiverId, senderId } = req.params;
    let message;

    try {
      message = await Message.find({
        $or: [
          { receiver: receiverId, sender: senderId },
          { receiver: senderId, sender: receiverId },
        ],
      })
        .populate({ path: "receiver", select: "username" })
        .populate({ path: "sender", select: "username" });
      return res.status(200).json({ data: message });
    } catch (err) {
      console.log(err);
      return res.status(200).json({ error: "Falha Interna" });
    }
  },

  async sendMessageAdmin(req, res, next) {
    // console.log(req.params);
    // console.log(req.body);

    const { firstname, lastname, email, message } = req.body;

    if (!message) {
      let errors = {};
      errors.message = "A mensagem é obrigatória";
    }
    let transporter = nodeMailer.createTransport({
      service: process.env.AUTH_SERVICE,
      auth: { user: process.env.AUTH_EMAIL, pass: process.env.AUTH_PASS },
    });

    let mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Admin",
      html: adminTemplate(firstname, lastname, message),
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
      if (err) console.log(err);
      console.log(info);
    });

    return res.status(200).json({ data: "Mensagem enviada com sucesso" });
  },

  async myMessages(req, res, next) {
    const { userId } = req.params;
    let message, follow;
    let senders = [];

    try {
      follow = await Follow.findOne({ user: userId });
      let followers = follow.follows;
      for (follower of followers) {
        message = await Message.findOne({ sender: follower }).populate({
          path: "sender",
          select: "username",
        });
        senders.push(message);
      }

      return res.status(200).json({ data: senders });
    } catch (err) {
      console.log(err);
      return res.status(200).json({ error: "Falha Interna" });
    }
  },
};

module.exports = messageController;
