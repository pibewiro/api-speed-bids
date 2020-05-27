const validator = require('validator');
const isEmpty = require('./isEmpty');

function validateRegistration(data) {
  let errors = {
  }

  let checkCpf = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

  data.firstname = isEmpty(data.firstname) ? '' : data.firstname;
  data.lastname = isEmpty(data.lastname) ? '' : data.lastname;
  data.username = isEmpty(data.username) ? '' : data.username;
  data.address.city = isEmpty(data.address.city) ? '' : data.address.city;
  data.address.state = isEmpty(data.address.state) ? '' : data.address.state;
  data.address.country = isEmpty(data.address.country) ? '' : data.address.country;
  data.password = isEmpty(data.password) ? '' : data.password;
  data.cpf = isEmpty(data.cpf) ? '' : data.cpf;
  data.email = isEmpty(data.email) ? '' : data.email;

  if (!validator.isLength(data.firstname, { min: 2, max: 30 })) {
    errors.firstname = 'Field must contain betweem 2 and 30 charcters';
  }

  if (validator.isEmpty(data.firstname)) {
    errors.firstname = 'Field is Required';
  }

  if (!validator.isLength(data.lastname, { min: 2, max: 30 })) {
    errors.lastname = 'Field must contain betweem 2 and 30 charcters';
  }

  if (validator.isEmpty(data.lastname)) {
    errors.lastname = 'Field is Required';
  }

  if (!validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.username = 'Field must contain betweem 2 and 30 charcters';
  }

  if (validator.isEmpty(data.username)) {
    errors.username = 'Field is Required';
  }

  if (!validator.isLength(data.address.city, { min: 2, max: 30 })) {
    errors.city = 'Field must contain betweem 2 and 30 charcters';
  }

  if (validator.isEmpty(data.address.city)) {
    errors.city = 'Field is Required';
  }

  if (!validator.isLength(data.address.state, { min: 2, max: 30 })) {
    errors.state = 'Field must contain betweem 2 and 30 charcters';
  }

  if (validator.isEmpty(data.address.state)) {
    errors.state = 'Field is Required';
  }

  if (!validator.isLength(data.address.country, { min: 2, max: 30 })) {
    errors.country = 'Field must contain betweem 2 and 30 charcters';
  }

  if (validator.isEmpty(data.address.country)) {
    errors.country = 'Field is Required';
  }

  if (!validator.isLength(data.password, { min: 2, max: 30 })) {
    errors.password = 'Field must contain betweem 2 and 30 charcters';
  }

  if (validator.isEmpty(data.password)) {
    errors.password = 'Field is Required';
  }

  if (!validator.isLength(data.cpf, { min: 2, max: 30 })) {
    errors.cpf = 'Field must contain betweem 2 and 30 charcters';
  }

  if (!checkCpf.test(data.cpf)) {
    errors.cpf = 'Invalid CPF';
  }

  if (validator.isEmpty(data.cpf)) {
    errors.cpf = 'Field is Required';
  }

  if (!validator.isEmail(data.email)) {
    errors.email = 'Invalid Email';
  }

  if (validator.isEmpty(data.email)) {
    errors.email = 'Field is Required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = validateRegistration;