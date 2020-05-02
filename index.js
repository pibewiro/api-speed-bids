const app = require('./config/server');

const port = process.env.PORT || 9000;

app.listen(port, () => console.log('Listening to Port:', port))