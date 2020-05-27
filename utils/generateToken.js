const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });

async function generateToken(id, type) {

  let token = await jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
  return token;
}



module.exports = generateToken;