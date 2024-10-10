const express = require("express");
const {
  login,
  updateLevel,
  main,
  leaderboard,
  userLeaderboard,
  register
} = require("../controllers/loginController.cjs");
const authenticateToken = require("../middleware/auth_middleware.cjs");
const router = express.Router();

router.post("/", register);
router.post("/login", login);
router.post("/update-level", updateLevel);
router.get("/main", authenticateToken, main);
router.get("/leaderboard", leaderboard);
router.get("/history", userLeaderboard);

module.exports = router;
