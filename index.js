const app = require('./config/server');
require('dotenv').config();

const port = process.env.PORT || 9000;

<<<<<<< HEAD
app.listen(port, () => console.log('Listening to Port:', port))
=======
app.listen(port, () => console.log('Listening to Port Number:', port))
>>>>>>> dev
