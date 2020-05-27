const validator = require('validator');
const jwt = require('jsonwebtoken');
const JwtModel = require('../src/models/Jwt');

const verifyToken = async (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) return res.status(404).json({ error: 'No token found' });

  if (!validator.isJWT(token)) return res.status(404).json({ error: 'Unauthorized' });

  const blacklist = await JwtModel.findOne({ jwt: token });

  if (!blacklist) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ error: 'Invalid Token' });
      res.locals = decoded;
      return next();
    })
  }

  else {
    return res.status(401).json({ error: 'Token Blacklisted' });
  }
}

module.exports = verifyToken;