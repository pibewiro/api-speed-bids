const socket = require("socket.io");
const Buyer = require("../src/models/buyer");
function socketFunctions(server) {
  const io = socket(server);

  io.on("connection", (socket) => {
    console.log("Connected to Socket");

    socket.on("loggedIn", async (data) => {
      socket.join(data.bidId);
      socket.broadcast.to(data.bidId).emit("logInMessage", {
        info: `has joined the live bid ${data.bidId}`,
        id: data.bidId,
        username: data.username,
      });

      const startingMinutes = 10;
      let time = startingMinutes * 60;

      async function updateCountdown() {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if (`${minutes}:${seconds}` === "9:35") {
          io.to(data.bidId).emit("finished", "Bid has finished");
          // socket.to(data.bidId).disconnect();
        } else {
          io.to(data.bidId).emit("timer", `${minutes}:${seconds}`);
        }
        time--;
      }

      console.log(io.engine.clientsCount);
      if (io.engine.clientsCount == 1) {
        setInterval(updateCountdown, 1500);
      }
    });

    socket.on("bid", async (data) => {
      socket.join(data.bidId);
      let buyer = await Buyer.findById(data.bidId);

      if (data.price <= buyer.currentPrice) {
        try {
          io.to(socket.id).emit("error", {
            error: "Price must be higher than current bid",
          });
        } catch (err) {
          console.log(err);
        }
      } else if (data.userId == buyer.winner) {
        try {
          io.to(socket.id).emit("error", {
            error: "You must wait for another bidder",
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        await Buyer.updateOne(
          { _id: data.bidId },
          { currentPrice: data.price, winner: data.userId }
        );
        io.to(data.bidId).emit("bid2", {
          info: data.price,
          userId: data.userId,
          username: data.username,
        });
      }
    });

    // socket.on("closeSocket", (data) => {
    //   console.log(data);
    // });
  });
}

module.exports = socketFunctions;
