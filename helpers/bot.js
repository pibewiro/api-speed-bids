const nodeCron = require('node-cron');
const checkProdoucts = require('./checkProducts')

function runBot() {
  nodeCron.schedule('*/30 * * * * *', () => {
    checkProdoucts();
  })
}
module.exports = runBot;
