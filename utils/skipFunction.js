function skipFunction(req, limit, page) {

  let skip;

  if (limit && page) {
    limit = parseInt(req.query.limit);
    page = parseInt(req.query.page);

    skip = (page - 1) * limit;

    return {
      skip,
      limit,
      page
    }
  }

  else {
    return { skip: false }
  }

}

module.exports = skipFunction;