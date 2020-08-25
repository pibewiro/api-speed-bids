const Message = require("../models/message");
const nodeMailer = require("nodemailer");
const adminTemplate = require("../../utils/emailTemplates/TemplateAdmin");
const path = require("path");

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
    const { firstname, lastname, email, message } = req.body;

    if (!message) {
      let errors = {};
      errors.message = "A mensagem é obrigatória";
    }
    let transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: process.env.AUTH_EMAIL, pass: process.env.AUTH_PASS },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
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

  async getMyMessages(req, res, next) {
    const { userId } = req.params;
    let messages, index;
    let senders = []

    messages = await Message.find({ receiver: userId })
      .sort({ updatedAt: 'desc' })
      .populate({ path: 'sender', select: 'username updatedAt' })


    for (let i = 0; i < messages.length; i++) {
      index = senders.findIndex(sender => sender.username === messages[i].sender.username && sender.id === messages[i].sender._id);
      if (index === -1) {
        senders.push({
          id: messages[i].sender._id,
          username: messages[i].sender.username
        })
      }
    }

    return res.status(200).json({ data: senders })
  }
};

module.exports = messageController;
