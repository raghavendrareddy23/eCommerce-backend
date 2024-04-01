const cron = require('node-cron');
const yourCronFunction = require('./cronFunction');

cron.schedule('*/12 * * * *', () => {
  yourCronFunction();
}, {
  timezone: 'Asia/Kolkata' 
});
