// controllers/UserController.js
const { User } = require("../models");

class UserController {
  static async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
}

module.exports = UserController;

// controllers/UserStatController.js
const { UserStat } = require("../models");

class UserStatController {
  static async getStats(req, res) {
    try {
      const stats = await UserStat.findAll({
        where: { user_id: req.user.id },
        order: [["recorded_at", "DESC"]],
      });
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }

  static async addStat(req, res) {
    try {
      const { weight, height } = req.body;
      const stat = await UserStat.create({
        user_id: req.user.id,
        weight,
        height,
        recorded_at: new Date(),
      });
      res.status(201).json(stat);
    } catch (err) {
      res.status(400).json({ error: "Invalid data" });
    }
  }
}

module.exports = UserStatController;

// controllers/NotificationController.js
const { Notification } = require("../models");

class NotificationController {
  static async getUserNotifications(req, res) {
    try {
      const notifications = await Notification.findAll({
        where: { user_id: req.user.id },
      });
      res.json(notifications);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
}

module.exports = NotificationController;

// controllers/ProgressController.js
const { Progress } = require("../models");

class ProgressController {
  static async getProgressForGoal(req, res) {
    try {
      const progress = await Progress.findAll({
        where: { goal_id: req.params.goalId },
      });
      res.json(progress);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }

  static async addProgress(req, res) {
    try {
      const { goal_id, value, note } = req.body;
      const newProgress = await Progress.create({ goal_id, value, note });
      res.status(201).json(newProgress);
    } catch (err) {
      res.status(400).json({ error: "Invalid data" });
    }
  }
}

module.exports = ProgressController;

// controllers/SessionController.js
const { Session } = require("../models");

class SessionController {
  static async getUserSessions(req, res) {
    try {
      const sessions = await Session.findAll({
        where: { user_id: req.user.id },
      });
      res.json(sessions);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }

  static async createSession(req, res) {
    try {
      const { date, notes } = req.body;
      const session = await Session.create({
        user_id: req.user.id,
        date,
        notes,
      });
      res.status(201).json(session);
    } catch (err) {
      res.status(400).json({ error: "Invalid data" });
    }
  }
}

module.exports = SessionController;

// controllers/TypeExerciseController.js
const { TypeExercise } = require("../models");

class TypeExerciseController {
  static async getAllTypeExercises(req, res) {
    try {
      const exercises = await TypeExercise.findAll();
      res.json(exercises);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
}

module.exports = TypeExerciseController;

// controllers/ExerciseCategoryController.js
const { ExerciseCategory } = require("../models");

class ExerciseCategoryController {
  static async getAllCategories(req, res) {
    try {
      const categories = await ExerciseCategory.findAll();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
}

module.exports = ExerciseCategoryController;

// routes.js
const express = require("express");
const router = express.Router();

const UserController = require("./controllers/UserController");
const UserStatController = require("./controllers/UserStatController");
const NotificationController = require("./controllers/NotificationController");
const ProgressController = require("./controllers/ProgressController");
const SessionController = require("./controllers/SessionController");
const SessionExerciseController = require("./controllers/SessionExerciseController");
const TypeExerciseController = require("./controllers/TypeExerciseController");
const ExerciseCategoryController = require("./controllers/ExerciseCategoryController");

// Przykłady tras
router.get("/profile", UserController.getProfile);
router.get("/stats", UserStatController.getStats);
router.post("/stats", UserStatController.addStat);
router.get("/notifications", NotificationController.getUserNotifications);
router.get("/progress/:goalId", ProgressController.getProgressForGoal);
router.post("/progress", ProgressController.addProgress);
router.get("/sessions", SessionController.getUserSessions);
router.post("/sessions", SessionController.createSession);
router.post(
  "/session-exercises",
  SessionExerciseController.addExerciseToSession
);
router.get(
  "/session-exercises/:sessionId",
  SessionExerciseController.getExercisesForSession
);
router.get("/type-exercises", TypeExerciseController.getAllTypeExercises);
router.get("/exercise-categories", ExerciseCategoryController.getAllCategories);

module.exports = router;
