const { User } = require("../Models/userModel.cjs");

// Handles login requests
const login = (req, res) => {
    const username = req.body.username;
    // Try to find a user in the database with the given username
    User.findOne({ username })
        // If the user is found, proceed with the login process
        .then(user => {
            if (!user) {
                // If the user does not exist, create a new user with the given username
                const newUser = new User({ username });
                return newUser.save();
            }
            return user;
        })
        // Log the user in and redirect them to the main page
        .then(() => {
            res.redirect('/main?username=' + encodeURIComponent(username));
        })
        .catch(err => res.status(400).send("Error handling login."));
};

// Update the user's level
const updateLevel = (req, res) => {
    const username = req.body.username;
    const currentLevel = parseInt(req.body.currentLevel, 10);
    
    // Check if the provided level is valid (not NaN)
    if (isNaN(currentLevel)) {
        return res.status(400).send("Invalid level provided.");
    }
    
    // Try to find the user in the database with the given username
    User.findOne({ username })
        // If the user is not found, return a 404 error
        .then(user => {
            if (!user) {
                return res.status(404).send("User not found.");
            }
            // If the level is higher than the user's current max level, update the max level
            if (currentLevel > user.maxLevel) {
                user.results.push({ score: currentLevel });
                user.maxLevel = currentLevel;
                return user.save().then(() => {
                    res.status(200).send("Max level updated successfully!");
                });
            } else {
                user.results.push({ score: currentLevel });
                return user.save().then(() => {
                    res.status(200).send("Max level updated successfully!");
                });
            }
        })
        // Catch any errors that occur during the update process
        .catch(err => {
            res.status(500).send("Error updating max level.");
        });
};
// Render the main page
const main = (req, res) => {
    res.render('main', { query: req.query });
};
// Render the leaderboard page
const leaderboard = (req, res) => {
    User.find().sort({ maxLevel: -1 })
        // Return a list of users sorted by max level in descending order
        .then(users => {
            res.render('leaderboard', { users, username: req.query.username });
        })
        // Catch any errors that occur during the retrieval of the leaderboard data
        .catch(err => {
            res.status(500).send("Error retrieving leaderboard.");
        });

}
// Render the userLeaderboard page
const userLeaderboard = (req, res) => {
    // Return a list of users sorted by max level in descending order
    User.findOne({ username: req.query.user })
        .then(currentUser => {
            if (!currentUser) {
                console.log(currentUser);
                return res.status(404).send("User not found.");
            }
            res.render('userLeaderboard', { currentUser, username: req.query.username });
        })
        .catch(err => {
            // Catch any errors that occur during the retrieval of the leaderboard data
            res.status(500).send("Error retrieving leaderboard.");
        });
}

// Export the login, updateLevel, main, leaderboard and userLeaderboard functions
module.exports = { login, updateLevel, main, leaderboard, userLeaderboard };
