const validator = require("validator");
const isEmpty = require("./isEmpty");

function validateProduct(data) {
  let errors = {};

  data.productName = isEmpty(data.productName) ? "" : data.productName;
  data.price = isEmpty(data.price) ? "" : data.price;
  data.category = isEmpty(data.category) ? "" : data.category;
  data.description = isEmpty(data.description) ? "" : data.description;
  data.endDate = isEmpty(data.endDate) ? "" : data.endDate;
  data.endType = isEmpty(data.endType) ? "" : data.endType;
  data.bidType = isEmpty(data.bidType) ? "" : data.bidType;

  if (!validator.isLength(data.productName, { min: 2, max: 30 })) {
    errors.productName = "O campo deve conter entre 2 e 30 caracteres";
  }

  if (validator.isEmpty(data.productName) || data.productName === "null") {
    errors.productName = "Campo é obrigatório";
  }

  if (!validator.isDecimal(data.price, { decimal_digits: 2 })) {
    errors.price = "Valor inválido";
  }

  if (data.price < 0) {
    errors.price = "Valor inválido";
  }

  if (validator.isEmpty(data.price)) {
    errors.price = "Campo é obrigatório";
  }

  if (!validator.isLength(data.description, { min: 2, max: 400 })) {
    errors.description = "O campo deve conter entre 2 e 30 caracteres";
  }

  if (validator.isEmpty(data.description) || data.productName === "null") {
    errors.description = "Campo é obrigatório";
  }

  if (validator.isEmpty(data.category) || data.category === "null") {
    errors.category = "Campo é obrigatório";
  }

  if (validator.isEmpty(data.endDate) || data.endDate === "null") {
    errors.endDate = "Campo é obrigatório";
  }

  if (validator.isEmpty(data.endTime) || data.endTime === "null") {
    errors.endTime = "Campo é obrigatório";
  }

  if (validator.isEmpty(data.bidType) || data.bidType === "null") {
    errors.bidType = "Campo é obrigatório";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = validateProduct;
