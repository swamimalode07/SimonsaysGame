const express = require('express');
const { login, updateLevel, main , leaderboard } =require('../controllers/loginController.cjs'); 

const router = express.Router();

router.post('/login', login);
router.post('/update-level', updateLevel);
router.get('/main', main);
router.get('/leaderboard', leaderboard);

module.exports = router;