const fs = require('fs');
const path = require('path');
const User = require('./src/models/user');
const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

async function importData() {

  try {
    let user = await User.find();

    let data = JSON.stringify(user);

    try {
      fs.writeFileSync(path.join(__dirname, 'user.json'), data, (err) => {
        console.log(err)
      });
    } catch (err) {
      console.log(err)
    }

  } catch (err) {
    console.log(err)
  }

}

if (process.argv[2] === '-i') {
  importData();
  console.log('Data Imported');
}