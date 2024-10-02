const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require("path");
const mongoose = require('mongoose');

require('dotenv').config();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
        required: true
    },
    maxLevel: {
        type: Number,
        default: 0
    }
});

const User = mongoose.model('User', userSchema);

// Test route
app.get('/test', (req, res) => {
    res.send('Backend working');
});

app.get('/mongotest', (req, res) => {
    res.send(dbUrl);
});

app.get('/login', (req, res) => {
    res.render('login');
});

// Handle user login
app.post('/login', (req, res) => {
    const username = req.body.username;

    User.findOne({ username })
        .then(user => {
            if (!user) {
                const newUser = new User({ username });
                return newUser.save();
            }
            return user;
        })
        .then(() => {
            res.redirect('/main?username=' + encodeURIComponent(username));
        })
        .catch(err => res.status(400).send("Error handling login."));
});

// Update user level
app.post('/update-level', (req, res) => {
    const username = req.body.username;
    const currentLevel = parseInt(req.body.currentLevel, 10);

    if (isNaN(currentLevel)) {
        return res.status(400).send("Invalid level provided.");
    }

    User.findOne({ username })
        .then(user => {
            if (!user) {
                return res.status(404).send("User not found.");
            }

            if (currentLevel > user.maxLevel) {
                user.maxLevel = currentLevel;
                return user.save().then(() => {
                    res.status(200).send("Max level updated successfully!");
                });
            } else {
                res.status(200).send("No update needed.");
            }
        })
        .catch(err => res.status(500).send("Error updating max level."));
});

// Render the main page
app.get('/main', (req, res) => {
    res.render('main', { query: req.query });
});

// Render the leaderboard
app.get('/leaderboard', (req, res) => {
    User.find().sort({ maxLevel: -1 })
        .then(users => {
            res.render('leaderboard', { users, username: req.query.username });
        })
        .catch(err => res.status(500).send("Error retrieving leaderboard."));
});

// Search leaderboard by username
app.get('/leaderboard/search', (req, res) => {
    const searchTerm = req.query.username;
    User.find({ username: new RegExp(searchTerm, 'i') })
        .sort({ maxLevel: -1 })
        .then(users => {
            res.render('leaderboard', { users, username: searchTerm });
        })
        .catch(err => res.status(500).send("Error retrieving leaderboard."));
});

// Redirect all other routes to login page
app.get("/*", (req, res) => {
    res.redirect("login");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
