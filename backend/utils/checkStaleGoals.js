const { Op } = require("sequelize");
const Progress = require("../models/Progress");
const Goal = require("../models/Goal");
const Notification = require("../models/Notification");
const User = require("../models/User");

const checkStaleGoals = async () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 1);

  const staleGoals = await Goal.findAll({
    where: { status: "active" },
    include: [
      {
        model: Progress,
        as: "progress",
        where: {
          updated_at: { [Op.lt]: oneWeekAgo },
        },
      },
    ],
  });

  for (const goal of staleGoals) {
    await Notification.create({
      user_id: goal.user_id,
      message: `Vous n'avez pas mis à jour vos progrès pour l’objectif "${goal.title}". Où en êtes-vous ? 🤔`,
      status: "unread",
    });
  }

  console.log("🔔 Rappels envoyés pour objectifs inactifs");
};

module.exports = checkStaleGoals;
