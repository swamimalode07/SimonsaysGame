// Import the express library
const express = require('express');

// Import the controller functions from the loginController file
const { login, updateLevel, main , leaderboard, userLeaderboard } =require('../controllers/loginController.cjs'); 

// Create a new router object
const router = express.Router();

// POST route for the login endpoint, using the login controller function
router.post('/login', login);

// POST route for the update-level endpoint, using the updateLevel controller function
router.post('/update-level', updateLevel);

// GET route for the main endpoint, using the main controller function
router.get('/main', main);

// GET route for the leaderboard endpoint, using the leaderboard controller function
router.get('/leaderboard', leaderboard);

// GET route for the userLeaderboard endpoint, using the history controller function
router.get('/history', userLeaderboard);

// Export the router object for use in other parts of the application
module.exports = router;
