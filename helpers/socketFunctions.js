const socket = require("socket.io");
const Buyer = require("../src/models/buyer");
const Message = require("../src/models/message");
function socketFunctions(server) {
  const io = socket(server);

  io.on("connection", (socket) => {
    // console.log("Connected to Socket");

    socket.on("register", (data) => {
      socket.on("private_chat", async (data) => {
        const receiverId = data.receiver.id;
        const senderId = data.sender.id;
        let saveMessage = new Message();
        saveMessage.receiver = receiverId;
        saveMessage.sender = senderId;
        saveMessage.text = data.message;

        await saveMessage.save();
        io.emit("message-sent", saveMessage);
      });
    });

    socket.on("loggedIn", async (data) => {
      socket.join(data.bidId);
      socket.broadcast.to(data.bidId).emit("logInMessage", {
        info: `entrou no lance live ${data.bidId}`,
        id: data.bidId,
        username: data.username,
      });
    });

    socket.on("bid", async (data) => {
      socket.join(data.bidId);
      let buyer = await Buyer.findById(data.bidId);

      if (data.price <= buyer.currentPrice) {
        try {
          io.to(socket.id).emit("error", {
            error: "O preço deve ser superior ao lance atual",
          });
        } catch (err) {
          console.log(err);
        }
      } else if (data.userId == buyer.winner) {
        try {
          io.to(socket.id).emit("error", {
            error: "Você deve esperar por outro licitante",
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        let buyer;
        // await Buyer.updateOne(
        //   { _id: data.bidId },
        //   { currentPrice: data.price, winner: data.userId }
        // );

        buyer = await Buyer.findById(data.bidId);
        buyer.currentPrice = data.price;
        buyer.winner = data.userId;
        buyer.prices.push({
          buyerId: data.userId,
          price: data.price,
        });
        await buyer.save();

        io.to(data.bidId).emit("bid2", {
          info: data.price,
          userId: data.userId,
          username: data.username,
        });
      }
    });

    socket.on("closeSocket", (data) => {
      console.log(data);
    });
  });
}

module.exports = socketFunctions;
