const cron = require("node-cron");
const sendDailyMotivation = require("./sendDailyMotivation");
const checkStaleGoals = require("./checkStaleGoals");

const startCronJobs = () => {
  cron.schedule("0 */5 * * *", async () => {
    await sendDailyMotivation();
    await checkStaleGoals();
  });
};

module.exports = startCronJobs;
