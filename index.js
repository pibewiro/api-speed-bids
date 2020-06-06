const app = require("./config/server");
const socketIO = require("./helpers/socketFunctions");
require("dotenv").config();

const port = process.env.PORT || 9000;

let server = app.listen(port, () =>
  console.log("Listening to Port Number:", port)
);

socketIO(server);
