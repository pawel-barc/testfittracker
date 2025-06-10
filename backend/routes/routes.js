const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../middlewares/upload");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const UserController = require("../controllers/UserController");
const UserStatController = require("../controllers/UserStatController");
const GoalController = require("../controllers/GoalController");
const NotificationController = require("../controllers/NotificationController");
const ProgressController = require("../controllers/ProgressController");
const SessionController = require("../controllers/SessionController");
const SessionExerciseController = require("../controllers/SessionExerciseController");
const TypeExerciseController = require("../controllers/TypeExerciseController");
const ExerciseCategoryController = require("../controllers/ExerciseCategoryController");
const TypeController = require("../controllers/TypeController");
const {
  getAndAddCategoriesFromWger,
  getAndAddExercisesFromWger,
} = require("../api/Wger.js");

// Auth routes
router.post("/register", upload.single("avatar"), AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", AuthController.logout);

// Profile routes
router.get("/users/profile", verifyToken, UserController.getProfile);
router.put("/users/profile", verifyToken, upload.single("avatar"), UserController.updateProfile);
router.put("/users/password", verifyToken, UserController.updatePassword);

// User Stats routes
router.post("/user-stats", verifyToken, UserStatController.addStat);
router.get("/user-stats", verifyToken, UserStatController.getStats);

// Goals routes
router.post("/goals", verifyToken, GoalController.createGoal);
router.get("/goals", verifyToken, GoalController.getGoals);

// Notification routes
router.get(
  "/notifications",
  verifyToken,
  NotificationController.getUserNotification
);
router.patch(
  "/notifications/:id/read",
  verifyToken,
  NotificationController.markAsRead
);

// Progress routes
router.post("/progress", verifyToken, ProgressController.addProgressForGoal);
router.get(
  "/progress/:goalId",
  verifyToken,
  ProgressController.getProgressForGoal
);

// Session routes
router.get("/sessions", verifyToken, SessionController.getUserSession);
router.post("/sessions", verifyToken, SessionController.createSession);
// ✅ NOUVELLES ROUTES pour les sessions
router.get("/sessions/:id", verifyToken, SessionController.getSessionById); // Optionnel
router.delete("/sessions/:id", verifyToken, SessionController.deleteSession); // ← NOUVELLE ROUTE

// Session Exercises routes
router.post(
  "/session-exercises",
  verifyToken,
  SessionExerciseController.addExerciseToSession
);
router.get(
  "/session-exercise/:sessionId",
  verifyToken,
  SessionExerciseController.getExercisesForSession
);

// Type Exercises routes
router.get(
  "/type-exercises",
  verifyToken,
  TypeExerciseController.getAllTypesExercises
);
router.post("/type-exercises", TypeExerciseController.addExerciseType);

// Exercise Categories routes
router.get(
  "/exercise-categories",
  verifyToken,
  ExerciseCategoryController.getAllCategories
);
router.post(
  "/exercise-categories",
  verifyToken,
  ExerciseCategoryController.addCategory
);

// Type route
router.get("/types", TypeController.getAllTypes);
router.post("/types", TypeController.createType);

// Wger routes
router.get("/add-categories-from-wger", async (req, res) => {
  try {
    const result = await getAndAddCategoriesFromWger();
    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur interne du serveur", message: err.message });
  }
});
router.get("/add-exercises-from-wger", async (req, res) => {
  try {
    const result = await getAndAddExercisesFromWger();
    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur interne du serveur", message: err.message });
  }
});

module.exports = router;