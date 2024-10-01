// Import necessary modules
const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require("path");
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// Set up EJS as the view engine with EJS Mate for layout support
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.json()); // Parse JSON data

// Set up port and database URL from environment variables
const port = process.env.PORT || 8080;
const dbUrl = process.env.MONGODB_URI;

// Connect to the MongoDB database
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to the Database"))
    .catch(err => console.error("Could not connect to Database", err));

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true // Username is required
    },
    maxLevel: {
        type: Number,
        default: 0 // Default max level is 0
    }
});

// Create a User model based on the schema
const User = mongoose.model('User', userSchema);

// Route to render the login page
app.get('/login', (req, res) => {
    res.render('login');  
});

// Handle user login
app.post('/login', (req, res) => {
    const username = req.body.username; // Get the username from the request body

    // Check if the user already exists
    User.findOne({ username })
        .then(user => {
            if (!user) {
                // Create a new user if not found
                const newUser = new User({ username });
                return newUser.save();
            }
            return user; // Return existing user
        })
        .then(() => {
            // Redirect to the main page with the username as a query parameter
            res.redirect('/main?username=' + encodeURIComponent(username));  
        })
        .catch(err => res.status(400).send("Error handling login.")); // Error handling
});

// Update the user's max level
app.post('/update-level', (req, res) => {
    const username = req.body.username;
    const currentLevel = parseInt(req.body.currentLevel, 10); // Parse current level to an integer

    if (isNaN(currentLevel)) {
        return res.status(400).send("Invalid level provided."); // Validation for current level
    }

    // Find the user and update their max level if necessary
    User.findOne({ username })
        .then(user => {
            if (!user) {
                return res.status(404).send("User not found."); // User not found
            }

            if (currentLevel > user.maxLevel) {
                user.maxLevel = currentLevel; // Update max level
                return user.save().then(() => {
                    res.status(200).send("Max level updated successfully!"); // Success response
                });
            } else {
                res.status(200).send("No update needed."); // No update required
            }
        })
        .catch(err => {
            res.status(500).send("Error updating max level."); // Error handling
        });
});

// Route to render the main page
app.get('/main', (req, res) => {
    res.render('main', { query: req.query }); // Pass query parameters to the view
});

// Route to render the leaderboard
app.get('/leaderboard', (req, res) => {
    User.find().sort({ maxLevel: -1 }) // Fetch users sorted by max level in descending order
        .then(users => {
            res.render('leaderboard', { users, username: req.query.username }); // Render leaderboard view
        })
        .catch(err => {
            res.status(500).send("Error retrieving leaderboard."); // Error handling
        });
});

// Redirect all other routes to the login page
app.get("/*", (req, res) => {
    res.redirect("login");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
