const { User } =require("../Models/userModel.cjs");

const login = (req, res) => {
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
};



const updateLevel =  (req, res) => {
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
        .catch(err => {
            res.status(500).send("Error updating max level.");
        });
};


const main = (req, res) => {
    res.render('main', { query: req.query });
};

const leaderboard = (req, res) => {
    User.find().sort({ maxLevel: -1 })
        .then(users => {
            res.render('leaderboard', { users, username: req.query.username });
        })
        .catch(err => {
            res.status(500).send("Error retrieving leaderboard.");
        });
}

const userLeaderboard = (req, res) => {
    User.findOne({ username: req.query.user })
        .then(currentUser => {
            if (!currentUser) {
                console.log(currentUser);
                return res.status(404).send("User not found.");
            }
            res.render('userLeaderboard', { currentUser, username: req.query.username });
        })
        .catch(err => {
            res.status(500).send("Error retrieving leaderboard.");
        });
}


module.exports = { login, updateLevel, main, leaderboard, userLeaderboard };
