const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: '../.env' });

const Buyer = require('../src/models/buyer');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

async function deleteData() {
  try {
    await Buyer.deleteMany();
    console.log('Data Destroyed');
    process.exit();
  } catch (err) {
    console.log(err)
  }
}

async function importData() {

  try {
    let buyer = await Buyer.find();

    let data = JSON.stringify(buyer);

    try {
      fs.writeFileSync(path.join(__dirname, '../', 'data', 'buyer.json'), data, (err) => {
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
  let data = fs.readFileSync(path.join(__dirname, '../', 'data', 'buyer.json'), 'utf-8');
  data = JSON.parse(data);
  await Product.create(data);
  console.log('Data Exported');
  process.exit();
}

async function runScript() {
  await Buyer.updateMany({ owner: '5ed5d457ec139136cc6094e7' });
  console.log('Data Added')
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

if (process.argv[2] === '-u') {
  runScript();
}