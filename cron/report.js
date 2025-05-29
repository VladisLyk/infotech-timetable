const cron = require('node-cron');
const api = require("../modules/reports");
var date = new Date();
date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

const dailyTask = () => {
  console.log(`[${date}] Оновлення статистика викладачів (logs/report_${date}.log)`);
  api.buildReport();
};

const addHourForTeacher = cron.schedule('0 23 * * *', dailyTask);

module.exports = addHourForTeacher;
