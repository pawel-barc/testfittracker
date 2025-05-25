const User = require("../models/User");
const Goal = require("../models/Goal");
const Notification = require("../models/Notification");

const sendDailyMotivation = async () => {
  const usersWithGoals = await User.findAll({
    include: [
      {
        model: Goal,
        where: { status: "active" },
        required: true,
      },
    ],
  });

  for (const user of usersWithGoals) {
    await Notification.create({
      user_id: user.id,
      message: `Bonjour ! N'oubliez pas d’ajouter vos progrès aujourd’hui 💪`,
      status: "unread",
    });
  }

  console.log("✅ Notifications de motivation envoyées");
};

module.exports = sendDailyMotivation;
