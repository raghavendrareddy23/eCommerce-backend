const cron = require('node-cron');
const yourCronFunction = require('./cronFunction');

cron.schedule('*/15 * * * *', () => {
  yourCronFunction();
}, {
  timezone: 'Asia/Kolkata' 
});
