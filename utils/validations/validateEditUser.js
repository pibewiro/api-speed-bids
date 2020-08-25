const validator = require('validator');
const isEmpty = require('./isEmpty');

function validateEditUser(data) {
  let errors = {}
  let checkCpf = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

  data.firstname = isEmpty(data.firstname) ? '' : data.firstname;
  data.lastname = isEmpty(data.lastname) ? '' : data.lastname;
  data.username = isEmpty(data.username) ? '' : data.username;
  data.address.city = isEmpty(data.address.city) ? '' : data.address.city;
  data.address.state = isEmpty(data.address.state) ? '' : data.address.state;
  data.address.country = isEmpty(data.address.country) ? '' : data.address.country;
  data.cpf = isEmpty(data.cpf) ? '' : data.cpf;
  data.email = isEmpty(data.email) ? '' : data.email;

  if (!validator.isLength(data.firstname, { min: 2, max: 30 })) {
    errors.firstname = 'O campo deve conter entre 2 e 30 caracteres';
  }

  if (validator.isEmpty(data.firstname)) {
    errors.firstname = 'Campo é obrigatório';
  }

  if (!validator.isLength(data.lastname, { min: 2, max: 30 })) {
    errors.lastname = 'O campo deve conter entre 2 e 30 caracteres';
  }

  if (validator.isEmpty(data.lastname)) {
    errors.lastname = 'Campo é obrigatório';
  }

  if (!validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.username = 'O campo deve conter entre 2 e 30 caracteres';
  }

  if (validator.isEmpty(data.username)) {
    errors.username = 'Campo é obrigatório';
  }

  if (!validator.isLength(data.address.city, { min: 2, max: 30 })) {
    errors.city = 'O campo deve conter entre 2 e 30 caracteres';
  }

  if (validator.isEmpty(data.address.city)) {
    errors.city = 'Campo é obrigatório';
  }

  if (!validator.isLength(data.address.state, { min: 2, max: 30 })) {
    errors.state = 'O campo deve conter entre 2 e 30 caracteres';
  }

  if (validator.isEmpty(data.address.state)) {
    errors.state = 'Campo é obrigatório';
  }

  if (!validator.isLength(data.address.country, { min: 2, max: 30 })) {
    errors.country = 'O campo deve conter entre 2 e 30 caracteres';
  }

  if (validator.isEmpty(data.address.country)) {
    errors.country = 'Campo é obrigatório';
  }

  if (!validator.isLength(data.cpf, { min: 2, max: 30 })) {
    errors.cpf = 'O campo deve conter entre 2 e 30 caracteres';
  }

  if (!checkCpf.test(data.cpf)) {
    errors.cpf = 'CPF inválido';
  }

  if (validator.isEmpty(data.cpf)) {
    errors.cpf = 'Campo é obrigatório';
  }

  if (!validator.isEmail(data.email)) {
    errors.email = 'Email inválido';
  }

  if (validator.isEmpty(data.email)) {
    errors.email = 'Campo é obrigatório';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = validateEditUser;