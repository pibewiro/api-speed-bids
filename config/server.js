const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const routes = require('../src/routes');
const connectDB = require('./database');

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.database();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(morgan('dev'));
    this.server.use(fileUpload());
  }

  routes() {
    this.server.use('/images', express.static(path.join(__dirname, '../', 'images')));
    this.server.use('/api/v1', require('../src/routes'));
  }

  database() {
    connectDB();
  }
}

module.exports = new App().server;