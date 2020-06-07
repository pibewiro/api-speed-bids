const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: '../.env' });

const User = require('../src/models/user');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

async function deleteData() {
  try {
    await User.deleteMany();
    console.log('Data Destroyed');
    process.exit();
  } catch (err) {
    console.log(err)
  }
}

async function importData() {

  try {
    let user = await User.find().select('+password');

    let data = JSON.stringify(user);

    try {
      fs.writeFileSync(path.join(__dirname, '../', 'data', 'user.json'), data, (err) => {
        console.log(err)
      });
      console.log('Imported data');
      process.exit();
    } catch (err) {
      console.log(err)
    }

  } catch (err) {
    console.log(err)
  }

}

async function exportData() {
  let data = fs.readFileSync(path.join(__dirname, '../', 'data', 'user.json'), 'utf-8');
  data = JSON.parse(data);
  await User.create(data);
  console.log('Data Exported');
  process.exit();
}

if (process.argv[2] === '-d') {
  deleteData();
}

if (process.argv[2] === '-i') {
  importData();
}

if (process.argv[2] === '-e') {
  exportData();
}