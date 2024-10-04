const express = require('express');
const { login, updateLevel, main , leaderboard, userLeaderboard } =require('../controllers/loginController.cjs'); 

const router = express.Router();

router.post('/login', login);
router.post('/update-level', updateLevel);
router.get('/main', main);
router.get('/leaderboard', leaderboard);
router.get('/history', userLeaderboard)

module.exports = router;