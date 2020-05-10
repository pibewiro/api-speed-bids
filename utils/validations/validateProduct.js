const validator = require('validator');
const isEmpty = require('./isEmpty');

function validateProduct(data) {
  let errors = {}

  data.productName = isEmpty(data.productName) ? '' : data.productName;
  data.price = isEmpty(data.price) ? '' : data.price;
  data.category = isEmpty(data.category) ? '' : data.category;
  data.description = isEmpty(data.description) ? '' : data.description;

  if (!validator.isLength(data.productName, { min: 2, max: 30 })) {
    errors.productName = 'Field must contain between 2 and 30 charcters';
  }

  if (validator.isEmpty(data.productName)) {
    errors.productName = 'Field is required';
  };

  if (!validator.isDecimal(data.price, { decimal_digits: 2 })) {
    errors.price = 'Invalid Value';
  }

  if (data.price < 0) {
    errors.price = 'Invalid Value';
  }

  if (validator.isEmpty(data.price)) {
    errors.price = 'Field is required';
  }

  if (!validator.isLength(data.description, { min: 2, max: 400 })) {
    errors.description = 'Field must contain between  2 and 30 charcters';
  }

  if (validator.isEmpty(data.description)) {
    errors.description = 'Field is required';
  }

  if (validator.isEmpty(data.category)) {
    errors.category = 'Field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = validateProduct;