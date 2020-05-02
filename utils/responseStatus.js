function responseStatus(res, resp, message) {
  return res.status(resp).json(message);
}

module.exports = responseStatus;