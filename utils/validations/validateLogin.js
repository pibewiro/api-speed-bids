const validator = require('validator');
const isEmpty = require('./isEmpty');

function validateLogin(data) {
  let errors = {}

  data.email = isEmpty(data.email) ? '' : data.email;
  data.password = isEmpty(data.password) ? '' : data.password;

  if (!validator.isEmail(data.email)) {
    errors.email = 'Email inválido';
  };

  if (validator.isEmpty(data.email)) {
    errors.email = 'Campo é obrigatório';
  }

  if (validator.isEmpty(data.password)) {
    errors.password = 'Campo é obrigatório';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = validateLogin;