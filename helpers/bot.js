const nodeCron = require('node-cron');
const checkProdoucts = require('./checkProducts');
const checkLiveBids = require('./checkLiveBids');

function runBot() {
  nodeCron.schedule('*/30 * * * * *', async () => {
    await checkLiveBids();
    await checkProdoucts();
  })
}
module.exports = runBot;
