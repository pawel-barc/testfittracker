const User = require("./User");
const UserStat = require("./UserStat");
const Notification = require("./Notification");
const Goals = require("./Goal");
const Types = require("./Type");
const Progress = require("./Progress");
const Session = require("./Session");
const SessionExercise = require("./SessionExercise");
const TypeExercise = require("./TypeExercise");
const ExerciseCategory = require("./ExerciseCategory");

User.hasMany(UserStat, { foreignKey: "user_id" });
UserStat.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Notification, { foreignKey: "user_id" });
Notification.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Goals, { foreignKey: "user_id" });
Goals.belongsTo(User, { foreignKey: "user_id" });

Goals.hasMany(Progress, {
  foreignKey: "goal_id",
  onDelete: "CASCADE",
  as: "progress",
});
Progress.belongsTo(Goals, { foreignKey: "goal_id" });

User.hasMany(Session, { foreignKey: "user_id" });
Session.belongsTo(User, { foreignKey: "user_id" });

Session.hasMany(SessionExercise, { foreignKey: "session_id" });
SessionExercise.belongsTo(Session, { foreignKey: "session_id" });

TypeExercise.hasMany(SessionExercise, { foreignKey: "type_exercise_id" });
SessionExercise.belongsTo(TypeExercise, { foreignKey: "type_exercise_id" });

ExerciseCategory.hasMany(TypeExercise, { foreignKey: "exercise_category_id" });
TypeExercise.belongsTo(ExerciseCategory, {
  foreignKey: "exercise_category_id",
});
