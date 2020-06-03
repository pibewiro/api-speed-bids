const socket = require("socket.io");

function socketFunctions(server) {
  const io = socket(server);

  io.on("connection", (socket) => {
    console.log("Connected to Socket");

    socket.on("loggedIn", (data) => {
      socket.join(data.bidId);

      socket.broadcast.to(data.bidId).emit("logInMessage", {
        info: `has joined the live bid ${data.bidId}`,
        id: data.bidId,
        username: data.username,
      });
    });

    socket.on("bid", (data) => {
      socket.join(data.bidId);
      io.to(data.bidId).emit("bid2", {
        info: data.price,
        userId: data.userId,
        username: data.username,
      });
    });
  });
}

module.exports = socketFunctions;
